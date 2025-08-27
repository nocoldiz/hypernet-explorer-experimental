//=============================================================================
// DreamSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Dream System v1.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.0.0
 * @description A dream system that teleports players to random maps with special effects
 *
 * @param dreamMaps
 * @text Dream Maps
 * @desc List of map IDs for dream sequences (comma separated)
 * @type string
 * @default 1,2,3
 *
 * @param minDreamTime
 * @text Minimum Dream Time
 * @desc Minimum time in seconds before dream ends
 * @type number
 * @min 1
 * @default 40
 *
 * @param maxDreamTime
 * @text Maximum Dream Time
 * @desc Maximum time in seconds before dream ends
 * @type number
 * @min 1
 * @default 120
 *
 * @param flashChance
 * @text Wall Flash Chance
 * @desc Chance (0-100) of flash effect when hitting walls
 * @type number
 * @min 0
 * @max 100
 * @default 30
 *
 * @param flashColors
 * @text Flash Colors
 * @desc Hex colors for flash effect (comma separated, no #)
 * @type string
 * @default FF0000,00FF00,0000FF,FFFF00,FF00FF,00FFFF
 *
 * @command StartDream
 * @text Start Dream
 * @desc Begin the dream sequence
 *
 * @help DreamSystem.js
 * 
 * Plugin Commands:
 * StartDream - Begins the dream sequence
 * 
 * This plugin creates a dream system where:
 * - Player is teleported to random maps from the specified list
 * - Walking into walls has a chance to trigger screen flash and teleport
 * - Dream automatically ends after a random time period
 * - Player returns to original position when dream ends
 * 
 * ============================================================================
 */

(() => {
    'use strict';
    
    const pluginName = 'DreamSystem';
    const parameters = PluginManager.parameters(pluginName);
    
    const dreamMaps = parameters['dreamMaps'].split(',').map(id => parseInt(id.trim()));
    const minDreamTime = parseInt(parameters['minDreamTime']) * 1000; // Convert to milliseconds
    const maxDreamTime = parseInt(parameters['maxDreamTime']) * 1000;
    const flashChance = parseInt(parameters['flashChance']);
    const flashColors = parameters['flashColors'].split(',').map(color => color.trim());
    
    let dreamActive = false;
    let dreamTimer = null;
    let originalMapId = 0;
    let originalX = 0;
    let originalY = 0;
    let originalDirection = 2;
    let lastWallHitTime = 0;
    const wallHitCooldown = 500; // Prevent spam triggering
    
    // Plugin Command Registration
    PluginManager.registerCommand(pluginName, "StartDream", args => {
        startDream();
    });
    
    // Start Dream Function
    function startDream() {
        if (dreamActive) return;
        
        // Store original position
        originalMapId = $gamePlayer._mapId;
        originalX = $gamePlayer._x;
        originalY = $gamePlayer._y;
        originalDirection = $gamePlayer._direction;
        
        dreamActive = true;
        
        // Teleport to random dream map
        teleportToRandomDreamMap();
        
        // Set random dream duration
        const dreamDuration = minDreamTime + Math.random() * (maxDreamTime - minDreamTime);
        dreamTimer = setTimeout(() => {
            endDream();
        }, dreamDuration);
    }
    
    // End Dream Function
    function endDream() {
        if (!dreamActive) return;
        
        dreamActive = false;
        
        // Clear timer
        if (dreamTimer) {
            clearTimeout(dreamTimer);
            dreamTimer = null;
        }
        
        // Return to original position
        $gamePlayer.reserveTransfer(originalMapId, originalX, originalY, originalDirection, 0);
        
        // Show wake up message after a short delay
        setTimeout(() => {
            $gameMessage.add("You woke up");
        }, 1000);
    }
    
    // Teleport to Random Dream Map
    function teleportToRandomDreamMap() {
        if (dreamMaps.length === 0) return;
        
        const randomMapId = dreamMaps[Math.floor(Math.random() * dreamMaps.length)];
        const mapData = $dataMap;
        
        // Find a random walkable position on the map
        let attempts = 0;
        let x, y;
        
        do {
            x = Math.floor(Math.random() * (mapData ? mapData.width : 20));
            y = Math.floor(Math.random() * (mapData ? mapData.height : 20));
            attempts++;
        } while (attempts < 50 && !isPositionWalkable(randomMapId, x, y));
        
        // If no walkable position found, use default
        if (attempts >= 50) {
            x = 0;
            y = 0;
        }
        
        $gamePlayer.reserveTransfer(randomMapId, x, y, 2, 0);
    }
    
    // Check if position is walkable
    function isPositionWalkable(mapId, x, y) {
        // This is a simplified check - in reality you might want to load map data
        return x >= 0 && y >= 0 && x < 50 && y < 50; // Assume reasonable map bounds
    }
    
    // Screen Flash Effect
    function createDreamFlash() {
        const randomColor = flashColors[Math.floor(Math.random() * flashColors.length)];
        
        // Create flash effect
        $gameScreen.startFlash([
            parseInt(randomColor.substr(0, 2), 16), // R
            parseInt(randomColor.substr(2, 2), 16), // G
            parseInt(randomColor.substr(4, 2), 16), // B
            128 // Alpha
        ], 60); // Duration in frames (60 frames = 1 second at 60fps)
    }
    
    // Override Game_Player movement to detect wall collisions
    const _Game_Player_executeMove = Game_Player.prototype.executeMove;
    Game_Player.prototype.executeMove = function(direction) {
        const wasMovementSuccessful = this.canPass(this._x, this._y, direction);
        
        _Game_Player_executeMove.call(this, direction);
        
        // Check for wall collision during dream
        if (dreamActive && !wasMovementSuccessful) {
            const currentTime = Date.now();
            
            // Check cooldown to prevent spam
            if (currentTime - lastWallHitTime > wallHitCooldown) {
                lastWallHitTime = currentTime;
                
                // Random chance for flash and teleport
                if (Math.random() * 100 < flashChance) {
                    createDreamFlash();
                    
                    // Teleport after flash effect
                    setTimeout(() => {
                        if (dreamActive) { // Make sure dream is still active
                            teleportToRandomDreamMap();
                        }
                    }, 1000); // Wait for flash to be visible
                }
            }
        }
    };
    
    // Clean up when transferring maps (safety measure)
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        
        // Reset wall hit cooldown on map transfer
        lastWallHitTime = 0;
    };
    
    // Save/Load compatibility
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        _Game_System_onAfterLoad.call(this);
        
        // Reset dream state on load (dreams don't persist through saves)
        dreamActive = false;
        if (dreamTimer) {
            clearTimeout(dreamTimer);
            dreamTimer = null;
        }
    };
    
})();