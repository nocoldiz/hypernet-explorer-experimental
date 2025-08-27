/*:
 * @target MZ
 * @plugindesc Enhanced Autonomous NPC System v2.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @help
 * ============================================================================
 * Enhanced Autonomous NPC System
 * ============================================================================
 * 
 * This plugin makes NPCs come alive with autonomous behavior including
 * pathfinding, interactions, dynamic spawning, and zone-based activities.
 * 
 * Setup:
 * 1. Add <NPC Alice,Bob,Charlie> to map notes (use event names)
 * 2. Name transfer points starting with "Transfer"
 * 3. Name enemies starting with "Enemy"
 * 4. Set Region ID 5 as always passable
 * 5. Set Region ID 10 as blocking
 * 
 * Zone Region IDs:
 * - Region 100: Bench/Chair (rest zones)
 * - Region 101: Social zones (attract groups)
 * - Region 102: Market zones (shopping/browsing)
 * - Region 103: Avoidance zones (NPCs avoid)
 * 
 * @param debugMode
 * @text Debug Mode
 * @desc Enable console logging for debugging
 * @type boolean
 * @default false
 * 
 * @param interactionTime
 * @text Interaction Duration
 * @desc How long NPCs interact (in milliseconds)
 * @type number
 * @min 3000
 * @max 10000
 * @default 5000
 * 
 * @param spawnChance
 * @text Spawn Chance
 * @desc Chance per second for absent NPCs to spawn (0.01 = 1%)
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 0.1
 * @default 0.02
 * 
 * @param playerAwarenessRange
 * @text Player Awareness Range
 * @desc How many tiles away NPCs notice the player
 * @type number
 * @min 2
 * @max 8
 * @default 4
 * 
 * @param flockingEnabled
 * @text Enable Flocking
 * @desc Enable flocking behavior for NPCs
 * @type boolean
 * @default true
 */

(() => {
    'use strict';
    
    const pluginName = 'EnhancedAutonomousNPCSystem';
    const parameters = PluginManager.parameters(pluginName);
    const debugMode = parameters['debugMode'] === 'true';
    const interactionTime = Number(parameters['interactionTime']) || 5000;
    const spawnChance = Number(parameters['spawnChance']) || 0.02;
    const playerAwarenessRange = Number(parameters['playerAwarenessRange']) || 4;
    const flockingEnabled = parameters['flockingEnabled'] === 'true';
    const EXIT_CHANCE_AFTER_ACTIVITY = 0.3;
    // Zone constants
    const ZONE_BENCH = 100;
    const ZONE_SOCIAL = 101;
    const ZONE_MARKET = 102;
    const ZONE_AVOID = 103;
    const ZONE_EXIT = 104;

    // Helper functions
    function debug(message) {
        if (debugMode) console.log(`[NPC System] ${message}`);
    }
    
    function distance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    function euclideanDistance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    // ─── New Helper ──────────────────────────────────────────────────────────────
function getRegion104Points() {
    const points = [];
    const w = $gameMap.width();
    const h = $gameMap.height();
    for (let x = 1; x <= w; x++) {
      for (let y = 1; y <= h; y++) {
        if ($gameMap.regionId(x, y) === 104) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }
  function getBorderTiles() {
    const borderTiles = [];
    const w = $gameMap.width();
    const h = $gameMap.height();
    
    // Top and bottom borders
    for (let x = 0; x < w; x++) {
        // Top border
        if ($gameMap.isPassable(x, 0, 2)) {
            borderTiles.push({ x, y: 0 });
        }
        // Bottom border  
        if ($gameMap.isPassable(x, h - 1, 8)) {
            borderTiles.push({ x, y: h - 1 });
        }
    }
    
    // Left and right borders
    for (let y = 0; y < h; y++) {
        // Left border
        if ($gameMap.isPassable(0, y, 6)) {
            borderTiles.push({ x: 0, y });
        }
        // Right border
        if ($gameMap.isPassable(w - 1, y, 4)) {
            borderTiles.push({ x: w - 1, y });
        }
    }
    
    return borderTiles;
}
    function randBetween(min, max) {
        return min + Math.random() * (max - min);
    }
    
    function hasLineOfSight(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;
        let x = x1;
        let y = y1;
        
        while (x !== x2 || y !== y2) {
            if (!$gameMap.isPassable(x, y, 2)) return false;
            
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
        return true;
    }
    
    // Enhanced A* Pathfinding
    class Pathfinder {
        constructor(character) {
            this.character = character;
        }
        
        isPassable(x, y, d) {
            if ($gameMap.regionId(x, y) === 5) return true;
            if ($gameMap.regionId(x, y) === 10) return false;
            if ($gameMap.regionId(x, y) === ZONE_AVOID) return false;
            
            const events = $gameMap.eventsXyNt(x, y);
            for (const event of events) {
                if (event && !event.isThrough() && event !== this.character) {
                    // Check if this is a door event - if so, ignore it (consider it passable)
                    if (event.event().name.startsWith('door_')) {
                        continue; // Skip this event, don't block movement
                    }
                    return false;
                }
            }
            
            if (d) {
                return this.character.canPass(x, y, d);
            }
            return $gameMap.isPassable(x, y, 2) || 
                   $gameMap.isPassable(x, y, 4) || 
                   $gameMap.isPassable(x, y, 6) || 
                   $gameMap.isPassable(x, y, 8);
        }
        
        
        findPath(startX, startY, goalX, goalY, avoidEnemies = true, avoidNPCs = true) {
            const openSet = [];
            const closedSet = new Set();
            const cameFrom = new Map();
            const gScore = new Map();
            const fScore = new Map();
            
            const start = `${startX},${startY}`;
            const goal = `${goalX},${goalY}`;
            
            openSet.push(start);
            gScore.set(start, 0);
            fScore.set(start, distance({x: startX, y: startY}, {x: goalX, y: goalY}));
            
            let iterations = 0;
            const maxIterations = 500;
            
            while (openSet.length > 0 && iterations < maxIterations) {
                iterations++;
                openSet.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
                const current = openSet.shift();
                
                if (current === goal) {
                    return this.reconstructPath(cameFrom, current);
                }
                
                closedSet.add(current);
                const [x, y] = current.split(',').map(Number);
                
                const neighbors = [
                    {x: x, y: y - 1, dir: 8},
                    {x: x, y: y + 1, dir: 2},
                    {x: x - 1, y, dir: 4},
                    {x: x + 1, y, dir: 6}
                ];
                
                for (const neighbor of neighbors) {
                    const nx = neighbor.x;
                    const ny = neighbor.y;
                    const nKey = `${nx},${ny}`;
                    
                    if (!$gameMap.isValid(nx, ny) || closedSet.has(nKey)) {
                        continue;
                    }
                    
                    if (!this.character.canPass(x, y, neighbor.dir)) {
                        continue;
                    }
                    
                    if (!this.isPassable(nx, ny)) {
                        continue;
                    }
                    
                    // Avoid enemies if requested
                    if (avoidEnemies) {
                        const enemyNearby = $gameMap.events().some(event => {
                            if (!event || !event.event().name.startsWith('Enemy')) return false;
                            return distance({x: nx, y: ny}, {x: event.x, y: event.y}) < 3;
                        });
                        if (enemyNearby) continue;
                    }
                    
                    // Avoid other NPCs if requested
                    if (avoidNPCs && $gameSystem.npcControllers) {
                        const npcNearby = $gameSystem.npcControllers.some(controller => {
                            if (!controller.event || controller.event === this.character) return false;
                            return controller.event.x === nx && controller.event.y === ny;
                        });
                        if (npcNearby) continue;
                        
                        // Also check for door events and allow passage through them
                        const eventsAtPosition = $gameMap.eventsXyNt(nx, ny);
                        const blockingEvent = eventsAtPosition.some(event => {
                            if (!event || event === this.character) return false;
                            // Don't consider door events as blocking
                            if (event.event().name.startsWith('door_')) return false;
                            return !event.isThrough();
                        });
                        if (blockingEvent) continue;
                    }
                    
                    const tentativeGScore = (gScore.get(current) || 0) + 1;
                    
                    if (!openSet.includes(nKey)) {
                        openSet.push(nKey);
                    } else if (tentativeGScore >= (gScore.get(nKey) || Infinity)) {
                        continue;
                    }
                    
                    cameFrom.set(nKey, {pos: current, dir: neighbor.dir});
                    gScore.set(nKey, tentativeGScore);
                    fScore.set(nKey, tentativeGScore + distance({x: nx, y: ny}, {x: goalX, y: goalY}));
                }
            }
            
            return null;
        }
        
        reconstructPath(cameFrom, current) {
            const path = [];
            while (cameFrom.has(current)) {
                const node = cameFrom.get(current);
                path.unshift(node.dir);
                current = node.pos;
            }
            return path;
        }
    }
    
    // Enhanced NPC Controller
    class NPCController {
        constructor(eventName) {
            this.eventName = eventName;
            this.event = this.findEventByName(eventName);
            this.eventId = this.event ? this.event.eventId() : null;
            this.pathfinder = new Pathfinder(this.event);
            
            // State management
            this.state = 'idle';
            this.target = null;
            this.path = [];
            this.isAbsent = false;
            this.interactionPartner = null;
            
            // Time-based movement
            this.lastUpdateTime = performance.now();
            this.nextMoveTime = performance.now() + randBetween(2000, 5000);
            this.stateEndTime = performance.now() + randBetween(3000, 6000);
            
            // Behavior properties
            this.moveSpeed = 3;
            this.originalThrough = false;
            this.currentGoal = null;
            this.goalPriority = 0;
            
            // Player awareness
            this.playerAware = false;
            this.lastPlayerReaction = 0;
            
            // Flocking properties
            this.velocity = {x: 0, y: 0};
            this.desiredSeparation = 1.5;
            this.neighborDistance = 3;
            this.maxForce = 0.05;
            this.maxSpeed = 1;
        }
        
        findEventByName(name) {
            return $gameMap.events().find(e => e && e.event().name === name);
        }
        
        refreshEvent() {
            this.event = this.findEventByName(this.eventName);
            this.eventId = this.event ? this.event.eventId() : null;
            if (this.event) {
                this.pathfinder = new Pathfinder(this.event);
            }
        }
        
        update() {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;
            
            if (!this.event || this.isAbsent) {
                this.handleAbsence(currentTime);
                return;
            }
            if (this.checkForExit()) {
                return;
              }
            // Check player awareness
            this.updatePlayerAwareness(currentTime);
            
            // Update based on state
            switch (this.state) {
                case 'idle':
                    this.updateIdle(currentTime);
                    break;
                case 'wandering':
                    this.updateWandering(currentTime);
                    break;
                case 'goingToZone':
                    this.updateGoingToZone(currentTime);
                    break;
                case 'inZone':
                    this.updateInZone(currentTime);
                    break;
                case 'interacting':
                    this.updateInteracting(currentTime);
                    break;
                case 'resting':
                    this.updateResting(currentTime);
                    break;
                case 'shopping':
                    this.updateShopping(currentTime);
                    break;
                case 'socializing':
                    this.updateSocializing(currentTime);
                    break;
                case 'exiting':
                    this.updateExiting(currentTime);
                    break;
            }
            
            // Apply flocking if enabled and moving
            if (flockingEnabled && this.state === 'wandering') {
                this.applyFlocking();
            }
        }
        
        handleAbsence(currentTime) {
            if (Math.random() < spawnChance * 0.016) { // Convert to per-frame chance
                this.spawn();
            }
        }
        
        spawn() {
            const spawnPoints = getRegion104Points();
            if (!spawnPoints.length) return;
            
            const pt = randomElement(spawnPoints);
            this.refreshEvent();
            
            if (this.event) {
                // Restore normal event settings
                this.event.setThrough(false);
                this.event.locate(pt.x, pt.y);
                this.event.setOpacity(0);
                this.event.fadeIn();
                this.isAbsent = false;
                this.decideNextGoal();
                console.log(`NPC ${this.eventName} spawned at region 104 point (${pt.x}, ${pt.y})`);
            }
        }
          updatePlayerAwareness(currentTime) {
            const playerDist = distance(
                {x: this.event.x, y: this.event.y},
                {x: $gamePlayer.x, y: $gamePlayer.y}
            );
            
            const wasAware = this.playerAware;
            // shrink awareness radius to half and only if very close
            this.playerAware = playerDist <= (playerAwarenessRange * 0.5);
            
            // React far less often: 20 seconds cooldown instead of 5
            const reactionCooldown = 20000;
            
            // Only 25% chance to actually react when the conditions hit
            const shouldReact = Math.random() < 0.25;
            
            if (this.playerAware && !wasAware 
                && (currentTime - this.lastPlayerReaction) > reactionCooldown
                && shouldReact
            ) {
                this.lastPlayerReaction = currentTime;
                this.reactToPlayer();
            }
        }
        
        
        reactToPlayer() {
            const reactions = [
                () => { // Wave
                    $gameTemp.requestBalloon(this.event, 1);
                    this.turnTowardCharacter($gamePlayer);
                },
                () => { // Exclamation
                    $gameTemp.requestBalloon(this.event, 11);
                    this.turnTowardCharacter($gamePlayer);
                },
                () => { // Heart
                    $gameTemp.requestBalloon(this.event, 4);
                },
                () => { // Question
                    $gameTemp.requestBalloon(this.event, 3);
                }
            ];
            
            randomElement(reactions)();
            console.log(`NPC ${this.eventName} reacted to player`);
        }
        
        updateIdle(currentTime) {
            if (currentTime >= this.nextMoveTime) {
                this.decideNextGoal();
            }
            
            // Occasionally turn
            if (Math.random() < 0.02) {
                this.event.setDirection(2 + Math.floor(Math.random() * 4) * 2);
            }
        }
        
        updateWandering(currentTime) {
            if (currentTime >= this.stateEndTime) {
                this.decideNextGoal();
                return;
            }
            
            if (!this.event.isMoving() && currentTime >= this.nextMoveTime) {
                // Check for zone tiles nearby
                const nearbyZone = this.checkNearbyZones();
                if (nearbyZone && Math.random() < 0.3) {
                    this.setGoal(nearbyZone.type, nearbyZone);
                    return;
                }
                
                // Wander with purpose
                const dir = this.getSmartWanderDirection();
                if (dir && this.event.canPass(this.event.x, this.event.y, dir)) {
                    this.event.moveStraight(dir);
                }
                
                this.nextMoveTime = currentTime + randBetween(1000, 3000);
            }
        }
        
        updateGoingToZone(currentTime) {
            if (!this.target || currentTime >= this.stateEndTime) {
                this.decideNextGoal();
                return;
            }
            
            if (this.path.length === 0) {
                // Reached zone
                this.enterZone();
                return;
            }
            
            if (!this.event.isMoving()) {
                const dir = this.path.shift();
                if (dir && this.event.canPass(this.event.x, this.event.y, dir)) {
                    this.event.moveStraight(dir);
                } else {
                    // Recalculate path
                    this.calculatePathToTarget();
                }
            }
        }
        
        updateInZone(currentTime) {
            const regionId = $gameMap.regionId(this.event.x, this.event.y);
                if ([ZONE_BENCH, ZONE_MARKET].includes(regionId)) {
        const dirs = [2, 4, 6, 8];   // down, left, right, up
        for (const dir of dirs) {
            const nx = $gameMap.roundXWithDirection(this.event.x, dir);
            const ny = $gameMap.roundYWithDirection(this.event.y, dir);
            if (
                $gameMap.regionId(nx, ny) === regionId && 
                $gameMap.isCounter(nx, ny)
            ) {
                this.event.setDirection(dir);
                return;  // we’ve re‑faced, so bail out
            }
        }
    }
            switch (regionId) {
                case ZONE_BENCH:
                    this.updateResting(currentTime);
                    break;
                case ZONE_SOCIAL:
                    this.updateSocializing(currentTime);
                    break;
                case ZONE_MARKET:
                    this.updateShopping(currentTime);
                    break;
                case ZONE_EXIT:
                    this.exitMap()
                    break;
                default:
                    if (currentTime >= this.stateEndTime) {
                        this.decideNextGoal();
                    }
            }
        }
        
        updateResting(currentTime) {
            if (currentTime >= this.stateEndTime) {
              if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
                this.startExiting();
              } else {
                this.decideNextGoal();
              }
            } else if (Math.random() < 0.01) {
              $gameTemp.requestBalloon(this.event, 10);
            }
          }
        
        updateShopping(currentTime) {
            if (currentTime >= this.stateEndTime) {
                if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
                  this.startExiting();
                } else {
                  this.decideNextGoal();
                }
                return;
              }
            
            // Browse around market zone
            if (!this.event.isMoving() && Math.random() < 0.05) {
                const dir = 2 + Math.floor(Math.random() * 4) * 2;
                const newX = $gameMap.roundXWithDirection(this.event.x, dir);
                const newY = $gameMap.roundYWithDirection(this.event.y, dir);
                
                // Stay in market zone
                if ($gameMap.regionId(newX, newY) === ZONE_MARKET) {
                    this.event.moveStraight(dir);
                }
            }
            
            // Show shopping reactions
            if (Math.random() < 0.02) {
                const balloons = [1, 3, 4, 7]; // Happy, question, heart, music
                $gameTemp.requestBalloon(this.event, randomElement(balloons));
            }
        }
        
        updateSocializing(currentTime) {
            if (currentTime >= this.stateEndTime) {
              if (Math.random() < EXIT_CHANCE_AFTER_ACTIVITY) {
                this.startExiting();
                return;
              } else {
                this.decideNextGoal();
                return;
              }
            }
            // … your existing roaming code …
          }
        
        updateInteracting(currentTime) {
            if (currentTime >= this.stateEndTime) {
                this.endInteraction();
                return;
            }
            
            // Show interaction balloons
            const progress = (currentTime - (this.stateEndTime - interactionTime)) / interactionTime;
            if (progress > 0.2 && progress < 0.25) {
                $gameTemp.requestBalloon(this.event, 1); // Exclamation
            } else if (progress > 0.5 && progress < 0.55) {
                $gameTemp.requestBalloon(this.event, 4); // Heart
            } else if (progress > 0.8 && progress < 0.85) {
                $gameTemp.requestBalloon(this.event, 7); // Music
            }
            
            // Face partner
            if (this.interactionPartner && this.interactionPartner.event) {
                this.turnTowardCharacter(this.interactionPartner.event);
            }
        }
        
        updateExiting(currentTime) {
            if (this.path.length === 0 || this.checkForExit()) {
                return;
            }
            
            if (!this.event.isMoving()) {
                const dir = this.path.shift();
                if (dir) {
                    this.event.moveStraight(dir);
                }
            }
        }
        
        decideNextGoal() {
            const currentTime = performance.now();
            const goals = [];
            
            // Add weighted goals based on context
            goals.push({type: 'wander', weight: 30});
            goals.push({type: 'exit', weight: 10});
            
            // Check available zones
            const zones = this.findZonesOnMap();
            if (zones.bench.length > 0) goals.push({type: 'rest', weight: 15});
            if (zones.social.length > 0) goals.push({type: 'socialize', weight: 25});
            if (zones.market.length > 0) goals.push({type: 'shop', weight: 20});
            
            // Weight selection
            const totalWeight = goals.reduce((sum, g) => sum + g.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (const goal of goals) {
                random -= goal.weight;
                if (random <= 0) {
                    this.setGoal(goal.type);
                    break;
                }
            }
        }
        
        setGoal(type, target = null) {
            const currentTime = performance.now();
            
            switch (type) {
                case 'wander':
                    this.state = 'wandering';
                    this.stateEndTime = currentTime + randBetween(10000, 20000);
                    this.moveSpeed = Math.random() < 0.7 ? 3 : 4;
                    break;
                    
                case 'rest':
                    const benches = this.findZonesOnMap().bench;
                    if (benches.length > 0) {
                        this.target = randomElement(benches);
                        this.state = 'goingToZone';
                        this.calculatePathToTarget();
                    }
                    break;
                    
                case 'socialize':
                    const socialZones = this.findZonesOnMap().social;
                    if (socialZones.length > 0) {
                        this.target = randomElement(socialZones);
                        this.state = 'goingToZone';
                        this.calculatePathToTarget();
                    }
                    break;
                    
                case 'shop':
                    const markets = this.findZonesOnMap().market;
                    if (markets.length > 0) {
                        this.target = randomElement(markets);
                        this.state = 'goingToZone';
                        this.calculatePathToTarget();
                    }
                    break;
                    
                case 'exit':
                    
                    this.startExiting();
                    break;
            }
            
            this.event.setMoveSpeed(this.moveSpeed);
            console.log(`NPC ${this.eventName} goal: ${type}`);
        }
        
        calculatePathToTarget() {
            if (!this.target) return;
            
            this.path = this.pathfinder.findPath(
                this.event.x, this.event.y,
                this.target.x, this.target.y,
                true, true
            );
            
            if (!this.path || this.path.length === 0) {
                this.decideNextGoal();
            }
        }
        
        enterZone() {
            const regionId = $gameMap.regionId(this.event.x, this.event.y);
            const currentTime = performance.now();
            
            switch (regionId) {
                case ZONE_BENCH:
                    this.state = 'resting';
                    this.stateEndTime = currentTime + randBetween(8000, 15000);
                    break;
                case ZONE_SOCIAL:
                    this.state = 'socializing';
                    this.stateEndTime = currentTime + randBetween(10000, 20000);
                    break;
                case ZONE_MARKET:
                    this.state = 'shopping';
                    this.stateEndTime = currentTime + randBetween(8000, 12000);
                    break;
                default:
                    this.state = 'inZone';
                    this.stateEndTime = currentTime + randBetween(5000, 10000);
            }
        }
        
        checkNearbyZones() {
            const checkRadius = 5;
            const zones = [];
            
            for (let dx = -checkRadius; dx <= checkRadius; dx++) {
                for (let dy = -checkRadius; dy <= checkRadius; dy++) {
                    const x = this.event.x + dx;
                    const y = this.event.y + dy;
                    
                    if (!$gameMap.isValid(x, y)) continue;
                    
                    const regionId = $gameMap.regionId(x, y);
                    if ([ZONE_BENCH, ZONE_SOCIAL, ZONE_MARKET].includes(regionId)) {
                        const dist = Math.abs(dx) + Math.abs(dy);
                        zones.push({
                            x: x,
                            y: y,
                            type: this.getZoneType(regionId),
                            distance: dist
                        });
                    }
                }
            }
            
            zones.sort((a, b) => a.distance - b.distance);
            return zones[0] || null;
        }
        
        findZonesOnMap() {
            const zones = {
                bench: [],
                social: [],
                market: []
            };
            
            for (let x = 0; x < $gameMap.width(); x++) {
                for (let y = 0; y < $gameMap.height(); y++) {
                    const regionId = $gameMap.regionId(x, y);
                    switch (regionId) {
                        case ZONE_BENCH:
                            zones.bench.push({x, y});
                            break;
                        case ZONE_SOCIAL:
                            zones.social.push({x, y});
                            break;
                        case ZONE_MARKET:
                            zones.market.push({x, y});
                            break;
                    }
                }
            }
            
            return zones;
        }
        
        getZoneType(regionId) {
            switch (regionId) {
                case ZONE_BENCH: return 'rest';
                case ZONE_SOCIAL: return 'socialize';
                case ZONE_MARKET: return 'shop';
                case ZONE_EXIT: return 'exit';
                default: return 'none';
            }
        }
        
        getSmartWanderDirection() {
            const directions = [2, 4, 6, 8];
            const weights = [];
            
            for (const dir of directions) {
                let weight = 1;
                const newX = $gameMap.roundXWithDirection(this.event.x, dir);
                const newY = $gameMap.roundYWithDirection(this.event.y, dir);
                
                // Check if passable
                if (!this.event.canPass(this.event.x, this.event.y, dir)) {
                    weight = 0;
                } else {
                    // Prefer unexplored areas
                    const regionId = $gameMap.regionId(newX, newY);
                    
                    // Avoid avoidance zones
                    if (regionId === ZONE_AVOID) {
                        weight = 0;
                    } else if ([ZONE_BENCH, ZONE_SOCIAL, ZONE_MARKET].includes(regionId)) {
                        weight *= 1.5; // Slightly prefer zones
                    }
                    
                    // Avoid other NPCs
                    const npcAt = $gameSystem.npcControllers.some(c => 
                        c.event && c.event !== this.event && 
                        c.event.x === newX && c.event.y === newY
                    );
                    if (npcAt) weight *= 0.3;
                }
                
                weights.push(weight);
            }
            
            // Weighted random selection
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            if (totalWeight === 0) return null;
            
            let random = Math.random() * totalWeight;
            for (let i = 0; i < directions.length; i++) {
                random -= weights[i];
                if (random <= 0) return directions[i];
            }
            
            return null;
        }
        
        findNearbyNPCs(range = 3) {
            const nearby = [];
            
            for (const controller of $gameSystem.npcControllers || []) {
                if (controller === this || !controller.event || controller.isAbsent) continue;
                
                const dist = distance(
                    {x: this.event.x, y: this.event.y},
                    {x: controller.event.x, y: controller.event.y}
                );
                
                if (dist <= range) {
                    nearby.push(controller);
                }
            }
            
            return nearby;
        }
        
        startInteraction(partner) {
            const currentTime = performance.now();
            
            this.state = 'interacting';
            this.stateEndTime = currentTime + interactionTime;
            this.interactionPartner = partner;
            this.path = [];
            
            partner.state = 'interacting';
            partner.stateEndTime = currentTime + interactionTime;
            partner.interactionPartner = this;
            partner.path = [];
            
            // Face each other
            this.turnTowardCharacter(partner.event);
            partner.turnTowardCharacter(this.event);
            
            console.log(`NPCs ${this.eventName} and ${partner.eventName} interacting`);
        }
        
        endInteraction() {
            $gameTemp.requestBalloon(this.event, 0);
            
            if (this.interactionPartner) {
                $gameTemp.requestBalloon(this.interactionPartner.event, 0);
                this.interactionPartner.interactionPartner = null;
                this.interactionPartner.decideNextGoal();
            }
            
            this.interactionPartner = null;
            this.decideNextGoal();
        }
        
        turnTowardCharacter(character) {
            const sx = this.event.deltaXFrom(character.x);
            const sy = this.event.deltaYFrom(character.y);
            
            if (Math.abs(sx) > Math.abs(sy)) {
                this.event.setDirection(sx > 0 ? 4 : 6);
            } else if (sy !== 0) {
                this.event.setDirection(sy > 0 ? 8 : 2);
            }
        }
        
        startExiting() {
            const regionPts = getRegion104Points();
            const valid = regionPts.filter(p =>
              distance({ x: this.event.x, y: this.event.y }, p) > 4
            );
            if (!valid.length) {
              this.decideNextGoal();
              return;
            }
            const dest = randomElement(valid);
            this.path = this.pathfinder.findPath(
              this.event.x, this.event.y,
              dest.x, dest.y
            );
            if (this.path && this.path.length) {
              this.state = 'exiting';
            } else {
              this.decideNextGoal();
            }
          }
        
          checkForExit() {
            if ($gameMap.regionId(this.event.x, this.event.y) === 104) {
              this.exitMap();
              return true;
            }
            return false;
          }
        
          exitMap() {
            // Start fade out
            this.event.fadeOut();
            
            // Move to a random border tile to prevent interaction
            const borderTiles = getBorderTiles();
            if (borderTiles.length > 0) {
                const hidingSpot = randomElement(borderTiles);
                // Use a timeout to move after fade starts but before it completes
                setTimeout(() => {
                    if (this.event) {
                        this.event.locate(hidingSpot.x, hidingSpot.y);
                        // Make sure they're invisible and non-interactable
                        this.event.setOpacity(0);
                        this.event.setThrough(true);
                    }
                }, 500); // Move after half a second of fading
            }
            
            this.isAbsent = true;
            this.state = 'idle';
            console.log(`NPC ${this.eventName} exited map and moved to border`);
        }
        
        // Flocking behavior implementation
        applyFlocking() {
            if (!flockingEnabled) return;
            
            const neighbors = this.findNearbyNPCs(this.neighborDistance);
            
            const separation = this.calculateSeparation(neighbors);
            const alignment = this.calculateAlignment(neighbors);
            const cohesion = this.calculateCohesion(neighbors);
            
            // Weight the forces
            separation.x *= 2.0;
            separation.y *= 2.0;
            alignment.x *= 1.0;
            alignment.y *= 1.0;
            cohesion.x *= 1.0;
            cohesion.y *= 1.0;
            
            // Apply forces
            this.velocity.x += separation.x + alignment.x + cohesion.x;
            this.velocity.y += separation.y + alignment.y + cohesion.y;
            
            // Limit speed
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > this.maxSpeed) {
                this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
                this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
            }
            
            // Convert to direction
            if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
                if (this.velocity.x > 0.1) return 6;
                if (this.velocity.x < -0.1) return 4;
            } else {
                if (this.velocity.y > 0.1) return 2;
                if (this.velocity.y < -0.1) return 8;
            }
            
            return null;
        }
        
        calculateSeparation(neighbors) {
            const steer = {x: 0, y: 0};
            let count = 0;
            
            for (const neighbor of neighbors) {
                const d = euclideanDistance(
                    {x: this.event.x, y: this.event.y},
                    {x: neighbor.event.x, y: neighbor.event.y}
                );
                
                if (d > 0 && d < this.desiredSeparation) {
                    const diff = {
                        x: this.event.x - neighbor.event.x,
                        y: this.event.y - neighbor.event.y
                    };
                    
                    // Normalize and weight by distance
                    const mag = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
                    if (mag > 0) {
                        diff.x = (diff.x / mag) / d;
                        diff.y = (diff.y / mag) / d;
                    }
                    
                    steer.x += diff.x;
                    steer.y += diff.y;
                    count++;
                }
            }
            
            if (count > 0) {
                steer.x /= count;
                steer.y /= count;
                
                // Normalize and scale
                const mag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                if (mag > 0) {
                    steer.x = (steer.x / mag) * this.maxSpeed;
                    steer.y = (steer.y / mag) * this.maxSpeed;
                    
                    steer.x -= this.velocity.x;
                    steer.y -= this.velocity.y;
                    
                    // Limit force
                    const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (forceMag > this.maxForce) {
                        steer.x = (steer.x / forceMag) * this.maxForce;
                        steer.y = (steer.y / forceMag) * this.maxForce;
                    }
                }
            }
            
            return steer;
        }
        
        calculateAlignment(neighbors) {
            const sum = {x: 0, y: 0};
            let count = 0;
            
            for (const neighbor of neighbors) {
                sum.x += neighbor.velocity.x;
                sum.y += neighbor.velocity.y;
                count++;
            }
            
            if (count > 0) {
                sum.x /= count;
                sum.y /= count;
                
                // Normalize and scale
                const mag = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
                if (mag > 0) {
                    sum.x = (sum.x / mag) * this.maxSpeed;
                    sum.y = (sum.y / mag) * this.maxSpeed;
                }
                
                const steer = {
                    x: sum.x - this.velocity.x,
                    y: sum.y - this.velocity.y
                };
                
                // Limit force
                const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                if (forceMag > this.maxForce) {
                    steer.x = (steer.x / forceMag) * this.maxForce;
                    steer.y = (steer.y / forceMag) * this.maxForce;
                }
                
                return steer;
            }
            
            return {x: 0, y: 0};
        }
        
        calculateCohesion(neighbors) {
            const sum = {x: 0, y: 0};
            let count = 0;
            
            for (const neighbor of neighbors) {
                sum.x += neighbor.event.x;
                sum.y += neighbor.event.y;
                count++;
            }
            
            if (count > 0) {
                sum.x /= count;
                sum.y /= count;
                
                // Steer towards center
                const desired = {
                    x: sum.x - this.event.x,
                    y: sum.y - this.event.y
                };
                
                // Normalize and scale
                const mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
                if (mag > 0) {
                    desired.x = (desired.x / mag) * this.maxSpeed;
                    desired.y = (desired.y / mag) * this.maxSpeed;
                }
                
                const steer = {
                    x: desired.x - this.velocity.x,
                    y: desired.y - this.velocity.y
                };
                
                // Limit force
                const forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                if (forceMag > this.maxForce) {
                    steer.x = (steer.x / forceMag) * this.maxForce;
                    steer.y = (steer.y / forceMag) * this.maxForce;
                }
                
                return steer;
            }
            
            return {x: 0, y: 0};
        }
    }
    
    // System extensions
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.npcControllers = [];
    };
    
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this.setupNPCControllers();
    };
    
    Game_Map.prototype.setupNPCControllers = function() {
        $gameSystem.npcControllers = [];
        
        // Parse map note for NPC names
        const note = $dataMap.note;
        const match = note.match(/<NPC\s*([^>]+)>/i);
        
        if (match) {
            const npcNames = match[1].split(',').map(name => name.trim());
            const npcEvents = [];
            
            for (const name of npcNames) {
                const event = $gameMap.events().find(e => e && e.event().name === name);
                if (event) {
                    npcEvents.push({
                        event: event,
                        name: name,
                        originalX: event.x,
                        originalY: event.y
                    });
                }
            }
            
            // Shuffle positions on map load
            if (npcEvents.length > 1) {
                const positions = npcEvents.map(npc => ({
                    x: npc.originalX,
                    y: npc.originalY
                }));
                
                // Fisher-Yates shuffle
                for (let i = positions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [positions[i], positions[j]] = [positions[j], positions[i]];
                }
                
                // Apply shuffled positions
                npcEvents.forEach((npc, index) => {
                    npc.event.locate(positions[index].x, positions[index].y);
                    console.log(`NPC ${npc.name} placed at ${positions[index].x},${positions[index].y}`);
                });
            }
            
            // Create controllers
            for (const npc of npcEvents) {
                // Initialize event settings
                npc.event.setMoveSpeed(3);
                npc.event.setMoveFrequency(3);
                npc.event.setThrough(false);
                npc.event.setPriorityType(1); // Same as characters
                
                const controller = new NPCController(npc.name);
                $gameSystem.npcControllers.push(controller);
                console.log(`Initialized NPC controller for ${npc.name}`);
            }
            
            // Randomly make 1-2 NPCs absent at start
            const absentCount = Math.min(Math.floor(Math.random() * 2) + 1, npcEvents.length - 1);
            for (let i = 0; i < absentCount; i++) {
                const controller = randomElement($gameSystem.npcControllers);
                if (!controller.isAbsent) {
                    controller.isAbsent = true;
                    controller.event.setOpacity(0);
                    controller.event.locate(0, 0); // Move off map
                    console.log(`NPC ${controller.eventName} starts absent`);
                }
            }
        }
    };
    
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        
        if (sceneActive && $gameSystem.npcControllers) {
            for (const controller of $gameSystem.npcControllers) {
                controller.update();
            }
        }
    };
    
    // Event extensions for fading
    Game_CharacterBase.prototype.fadeIn = function() {
        this._fadeType = 'in';
        this._fadeSpeed = 10;
    };
    
    Game_CharacterBase.prototype.fadeOut = function() {
        this._fadeType = 'out';
        this._fadeSpeed = 10;
    };
    
    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBase_update.call(this);
        this.updateFade();
    };
    
    Game_CharacterBase.prototype.updateFade = function() {
        if (this._fadeType === 'in') {
            this.setOpacity(Math.min(this.opacity() + this._fadeSpeed, 255));
            if (this.opacity() >= 255) {
                this._fadeType = null;
            }
        } else if (this._fadeType === 'out') {
            this.setOpacity(Math.max(this.opacity() - this._fadeSpeed, 0));
            if (this.opacity() <= 0) {
                this._fadeType = null;
            }
        }
    };
    
    // Debug commands for testing
    if (debugMode) {
        const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            
            if (command === 'NPC') {
                switch (args[0]) {
                    case 'state':
                        const npc = $gameSystem.npcControllers.find(c => c.eventName === args[1]);
                        if (npc) {
                            console.log(`NPC ${args[1]} state: ${npc.state}`);
                        }
                        break;
                    case 'spawn':
                        const controller = $gameSystem.npcControllers.find(c => c.eventName === args[1]);
                        if (controller && controller.isAbsent) {
                            controller.spawn();
                        }
                        break;
                    case 'exit':
                        const exitController = $gameSystem.npcControllers.find(c => c.eventName === args[1]);
                        if (exitController && !exitController.isAbsent) {
                            exitController.exitMap();
                        }
                        break;
                }
            }
        };
    }
})();