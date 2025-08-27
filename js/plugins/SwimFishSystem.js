/*:
 * @target MZ
 * @plugindesc v1.4 Adds swimming and fishing mechanics similar to Pokemon.
 * @author Claude
 * @help
 * This plugin adds swimming and fishing mechanics to RPG Maker MZ.
 * 
 * Features:
 * - Press Enter/Z button when facing water to get options menu
 * - Touch/click on water tiles adjacent to player to open menu
 * - Swim in water like the default boat system (uses boat sprite from system)
 * - Fish in water if you have the fishing rod (item ID configurable)
 * - Random items or encounters when fishing is successful
 * - Supports fishing rod as both items and weapons
 * - Configurable common events for fishing animations
 * - Hides companions/followers while swimming (New in v1.1)
 * - Customizable sound effects for swimming and fishing (New in v1.2)
 * - Enhanced swimming animation with directional cycling (New in v1.4)
 * 
 * Instructions:
 * 1. Configure the fishing rod item ID in plugin parameters
 * 2. Optionally, set fishing rod weapon IDs
 * 3. Configure fishing items/encounters in plugin parameters
 * 4. Set up common events for fishing animations if desired
 * 5. Make sure water tiles are properly configured in your tilesets
 * 6. Configure sound effects for fishing and swimming (optional)
 * 
 * @param fishingItems
 * @text Fishing Items
 * @desc Items that can be obtained while fishing (comma-separated item IDs)
 * @default 1,2,3,4,5
 * 
 * @param fishingEncounterTroopIds
 * @text Fishing Encounters
 * @desc Troop IDs that can be encountered while fishing (comma-separated)
 * @default 1,2,3
 * 
 * @param fishingSuccessRate
 * @text Fishing Success Rate
 * @desc Chance of successful fishing (0-100)
 * @default 70
 * 
 * @param waitTime
 * @text Wait Time for Fishing
 * @desc Time to wait while fishing in frames (60 frames = 1 second)
 * @default 180
 * 
 * @param waterRegions
 * @text Water Region IDs
 * @desc Region IDs that are considered water (comma-separated)
 * @default 1
 * 
 * @param waterTerrainTags
 * @text Water Terrain Tags
 * @desc Terrain tags that are considered water (comma-separated)
 * @default 1
 * 
 * @param fishingRodItemId
 * @text Fishing Rod Item ID
 * @desc Item ID for the fishing rod
 * @default 118
 * 
 * @param fishingRodWeaponIds
 * @text Fishing Rod Weapon IDs
 * @desc Weapon IDs that can be used as fishing rods (comma-separated)
 * @default 
 * 
 * @param fishingAnimationCommonEventId
 * @text Fishing Animation Common Event ID
 * @desc Common event ID for fishing animation (0 = none)
 * @default 0
 * 
 * @param fishingBattleCommonEventId
 * @text Fishing Battle Common Event ID
 * @desc Common event ID for battle transition animation (0 = none)
 * @default 0
 * 
 * @param hideCompanions
 * @text Hide Companions While Swimming
 * @type boolean
 * @desc Whether to hide companions while swimming
 * @default true
 * 
 * @param fishingSoundEffect
 * @text Fishing Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when fishing (leave empty for no sound)
 * @default Bubble
 * 
 * @param startSwimmingSoundEffect
 * @text Start Swimming Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when starting to swim (leave empty for no sound)
 * @default Splash
 * 
 * @param stopSwimmingSoundEffect
 * @text Stop Swimming Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play when stopping swimming (leave empty for no sound)
 * @default Water2
 * 
 * @param swimMovementSoundEffect
 * @text Swim Movement Sound Effect
 * @type file
 * @dir audio/se/
 * @desc Sound effect to play during swimming movement (leave empty for no sound)
 * @default Water1
 * 
 * @param swimMovementSoundInterval
 * @text Swim Movement Sound Interval
 * @type number
 * @min 1
 * @desc Number of frames between swim movement sounds (60 = 1 second)
 * @default 30
 * 
 * @param swimAnimationSpeed
 * @text Swimming Animation Speed
 * @type number
 * @min 10
 * @max 120
 * @desc Frames between direction changes while swimming (lower = faster)
 * @default 45
 */

(() => {
    'use strict';
    
    const pluginName = "SwimFishSystem";
    
    // Plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const fishingItems = String(parameters.fishingItems || "1,2,3,4,5").split(',').map(Number);
    const fishingEncounterTroopIds = String(parameters.fishingEncounterTroopIds || "1,2,3").split(',').map(Number);
    const fishingSuccessRate = Number(parameters.fishingSuccessRate || 70);
    const waitTime = Number(parameters.waitTime || 180);
    const waterRegions = String(parameters.waterRegions || "1").split(',').map(Number);
    const waterTerrainTags = String(parameters.waterTerrainTags || "1").split(',').map(Number);
    const FISHING_ROD_ID = Number(parameters.fishingRodItemId || 118);
    const fishingRodWeaponIds = String(parameters.fishingRodWeaponIds || "").split(',').filter(id => id !== "").map(Number);
    const fishingAnimationCommonEventId = Number(parameters.fishingAnimationCommonEventId || 0);
    const fishingBattleCommonEventId = Number(parameters.fishingBattleCommonEventId || 0);
    const hideCompanions = String(parameters.hideCompanions || "true") === "true";
    
    // Sound effect parameters
    const fishingSoundEffect = String(parameters.fishingSoundEffect || "");
    const startSwimmingSoundEffect = String(parameters.startSwimmingSoundEffect || "");
    const stopSwimmingSoundEffect = String(parameters.stopSwimmingSoundEffect || "");
    const swimMovementSoundEffect = String(parameters.swimMovementSoundEffect || "");
    const swimMovementSoundInterval = Number(parameters.swimMovementSoundInterval || 30);
    const swimAnimationSpeed = Number(parameters.swimAnimationSpeed || 45);
    
    const tr = (en, it) => ConfigManager.language === "it" ? it : en;

    // Global state variables
    let isFishing = false;
    let companionsVisible = true; // Track companion visibility state
    let lastSwimSoundFrame = 0; // Track last frame when swim sound was played
    let swimAnimationTimer = 0; // Timer for swimming animation when stationary
    let swimDirectionIndex = 0; // Current direction index for swimming animation (0=down, 1=left, 2=right, 3=up)
    const swimDirections = [2, 4, 6, 8]; // Down, Left, Right, Up
    
    //=============================================================================
    // Helper Functions
    //=============================================================================
    
    function isWaterTile(x, y) {
        const regionId = $gameMap.regionId(x, y);
        if (waterRegions.includes(regionId)) return true;
        
        const terrainTag = $gameMap.terrainTag(x, y);
        if (waterTerrainTags.includes(terrainTag)) return true;
        
        // Default water check for RPG Maker MZ - checks if tile is boat passable
        return $gameMap.isBoatPassable(x, y);
    }
    
    function hasFishingRod() {
        // Check if player has fishing rod item
        if ($gameParty.hasItem($dataItems[FISHING_ROD_ID])) {
            return true;
        }
        
        // Check if player has any fishing rod weapon
        return fishingRodWeaponIds.some(weaponId => {
            return $gameParty.hasItem($dataWeapons[weaponId], true);
        });
    }
    
    function getFrontTile() {
        const direction = $gamePlayer.direction();
        let x = $gamePlayer.x;
        let y = $gamePlayer.y;
        
        switch (direction) {
            case 2: // Down
                y += 1;
                break;
            case 4: // Left
                x -= 1;
                break;
            case 6: // Right
                x += 1;
                break;
            case 8: // Up
                y -= 1;
                break;
        }
        
        return { x, y };
    }
    
    function performFishing() {
        // Set fishing state
        isFishing = true;
        
        // Play fishing sound effect if configured
        if (fishingSoundEffect) {
            AudioManager.playSe({
                name: fishingSoundEffect,
                volume: 90,
                pitch: 100,
                pan: 0
            });
        }
        
        // Disable player movement
        const originalCanMove = Game_Player.prototype.canMove;
        Game_Player.prototype.canMove = function() {
            return false;
        };
        
        // Show fishing animation
        if (fishingAnimationCommonEventId > 0) {
            $gameTemp.reserveCommonEvent(fishingAnimationCommonEventId);
        } else {
            // Default animation if no common event is set
            $gameScreen.startFlash([255, 255, 255, 128], 60);
        }
        
        // Wait for the fishing time
        let remainingFrames = waitTime;
        const originalUpdate = Scene_Map.prototype.update;
        
        Scene_Map.prototype.update = function() {
            originalUpdate.call(this);
            if (remainingFrames > 0) {
                remainingFrames--;
                if (remainingFrames === 0) {
                    // Restore player movement
                    Game_Player.prototype.canMove = originalCanMove;
                    Scene_Map.prototype.update = originalUpdate;
                    completeFishing();
                }
            }
        };
    }
    
    function completeFishing() {
        // Reset fishing state
        isFishing = false;
        
        const success = Math.random() * 100 < fishingSuccessRate;
        
        if (!success) {
            window.skipLocalization = true;
            $gameMessage.add("Nothing bit the hook...");
            window.skipLocalization = false;
            return;
        }
        
        // Determine if we get an item or an encounter
        const getItem = Math.random() < 0.7; // 70% chance to get item, 30% for encounter
        
        if (getItem) {
            // Get random item
            const itemId = fishingItems[Math.floor(Math.random() * fishingItems.length)];
            const item = $dataItems[itemId];
            
            if (item) {
                $gameParty.gainItem(item, 1);
                window.skipLocalization = true;
                $gameMessage.add(`\\i[${itemId}]You caught a ${item.name}!`);
                window.skipLocalization = false;
            }
        } else {
            // Start encounter
            const troopId = fishingEncounterTroopIds[Math.floor(Math.random() * fishingEncounterTroopIds.length)];
            window.skipLocalization = true;
            $gameMessage.add("Something is pulling on your line!");
            window.skipLocalization = false;
            
            // Use battle transition common event if set
            if (fishingBattleCommonEventId > 0) {
                $gameTemp.reserveCommonEvent(fishingBattleCommonEventId);
            }
            
            // Small delay before battle
            setTimeout(() => {
                BattleManager.setup(troopId, true, false);
                SceneManager.push(Scene_Battle);
            }, 1000);
        }
    }
    
    // Hide/show companions function
    function setCompanionsVisibility(visible) {
        if (!hideCompanions) return; // Skip if the hide companions option is disabled
        
        // Only process if the visibility state is changing
        if (companionsVisible === visible) return;
        
        companionsVisible = visible;
        
        // Set visibility for all followers
        if ($gamePlayer.followers && $gamePlayer.followers()) {
            for (let i = 0; i < $gamePlayer.followers()._data.length; i++) {
                const follower = $gamePlayer.followers()._data[i];
                if (follower) {
                    follower.setTransparent(!visible);
                }
            }
        }
    }
    
    function enterSwimMode() {
        // Similar to boat mode
        $gamePlayer._vehicleType = "boat";
        $gamePlayer._vehicleGettingOn = true;
        $gamePlayer._vehicleGettingOnDowning = true;
        $gamePlayer._wasSwimming = true; // Flag to track swimming state
        $gamePlayer.setMoveSpeed(4);
        
        // Initialize swimming animation
        swimAnimationTimer = 0;
        swimDirectionIndex = 0; // Start with down direction
        
        // Play start swimming sound if configured
        if (startSwimmingSoundEffect) {
            AudioManager.playSe({
                name: startSwimmingSoundEffect,
                volume: 90,
                pitch: 100,
                pan: 0
            });
        }
        
        // Use the boat sprite set in system options
        const boatData = $dataSystem.boat;
        $gamePlayer.setImage(boatData.characterName, boatData.characterIndex);
        
        const frontTile = getFrontTile();
        $gamePlayer.forceMoveForward();
        
        // Hide companions when entering swim mode
        setCompanionsVisibility(false);
        
        // Handle transitioning back to normal when leaving water
        const originalUpdateVehicleGetOn = Game_Player.prototype.updateVehicleGetOn;
        Game_Player.prototype.updateVehicleGetOn = function() {
            if (this._vehicleGettingOn && this._vehicleType === "boat") {
                this._vehicleGettingOn = false;
                this._vehicleGettingOnDowning = false;
                this._vehicleType = "boat";
                this.setTransparent(false);
            } else {
                originalUpdateVehicleGetOn.call(this);
            }
        };
    }
    
    function exitSwimMode() {
        // Reset player state
        $gamePlayer._vehicleType = "";
        // Reset various vehicle-related properties
        $gamePlayer._vehicleGettingOn = false;
        $gamePlayer._vehicleGettingOff = false;
        $gamePlayer._vehicleGettingOnDowning = false;
        
        // Reset swimming animation timer and direction
        swimAnimationTimer = 0;
        swimDirectionIndex = 0;
        
        // Play stop swimming sound if configured
        if (stopSwimmingSoundEffect) {
            AudioManager.playSe({
                name: stopSwimmingSoundEffect,
                volume: 90,
                pitch: 100,
                pan: 0
            });
        }
        
        // Restore original character appearance
        $gamePlayer.setImage(
            $gameActors.actor(1).characterName(),
            $gameActors.actor(1).characterIndex()
        );
        $gamePlayer.setMoveSpeed(4); // Use a fixed move speed as default (4 is standard)
        $gamePlayer.setTransparent(false);
        
        // Show companions when exiting swim mode
        setCompanionsVisibility(true);
        
        // Force reset player state to ensure movement works
        if ($gameTemp.isDestinationValid()) {
            $gameTemp._destinationX = null;
            $gameTemp._destinationY = null;
        }
        Input.clear();
    }
    
    //=============================================================================
    // Game_Player - Additional functionality
    //=============================================================================
    
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        this.updateSwimState();
    };
    
    Game_Player.prototype.updateSwimState = function() {
        if (this._vehicleType === "boat") {
            // Check if we need to exit swim mode (player moved to land)
            if (!isWaterTile(this.x, this.y)) {
                exitSwimMode();
                return;
            }
            
            // Handle enhanced swimming animation
            this.updateSwimmingAnimation();
            
            // Play swim movement sound if configured
            if (swimMovementSoundEffect && this.isMoving()) {
                const currentFrame = Graphics.frameCount;
                if (currentFrame - lastSwimSoundFrame >= swimMovementSoundInterval) {
                    AudioManager.playSe({
                        name: swimMovementSoundEffect,
                        volume: 50, // Lower volume for movement sounds
                        pitch: 100,
                        pan: 0
                    });
                    lastSwimSoundFrame = currentFrame;
                }
            }
        }
    };
    
    Game_Player.prototype.updateSwimmingAnimation = function() {
        // Enhanced swimming animation with directional cycling
        swimAnimationTimer++;
        
        // Change direction based on animation speed setting
        if (swimAnimationTimer >= swimAnimationSpeed) {
            swimAnimationTimer = 0;
            
            // If not moving or moving, still cycle through directions
            // This creates the swimming animation effect
            
            // Store current movement direction if moving
            const isCurrentlyMoving = this.isMoving();
            const originalDirection = this.direction();
            
            if (!isCurrentlyMoving) {
                // Cycle through directions when stationary
                swimDirectionIndex = (swimDirectionIndex + 1) % swimDirections.length;
                const newDirection = swimDirections[swimDirectionIndex];
                this.setDirection(newDirection);
                
                // Force the character to step animation
                this._animationCount = (this._animationCount + 1) % this.animationWait();
                if (this._animationCount === 0) {
                    this.updateAnimationCount();
                }
            } else {
                // When moving, still cycle directions but less frequently
                // This creates a more natural swimming look
                if (swimAnimationTimer % 2 === 0) { // Every other cycle
                    swimDirectionIndex = (swimDirectionIndex + 1) % swimDirections.length;
                    const newDirection = swimDirections[swimDirectionIndex];
                    
                    // Only change direction if it's not conflicting with movement
                    // Allow the swimming animation to show while keeping movement direction
                    if (Math.random() < 0.3) { // 30% chance to show swimming direction
                        this.setDirection(newDirection);
                        
                        // Quickly revert to movement direction
                        setTimeout(() => {
                            if (this._vehicleType === "boat" && this.isMoving()) {
                                this.setDirection(originalDirection);
                            }
                        }, 100);
                    }
                }
            }
        }
    };

    // Override direction setting for swimming to allow cycling
    const _Game_Player_setDirection = Game_Player.prototype.setDirection;
    Game_Player.prototype.setDirection = function(d) {
        if (this._vehicleType === "boat" && !this.isMoving()) {
            // When swimming and not moving, allow any direction for animation
            this._direction = d;
            this.resetStopCount();
        } else {
            _Game_Player_setDirection.call(this, d);
        }
    };

    // Make sure player can move after exiting swim mode
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        // If we were just swimming and now on land, force movement to be allowed
        if (this._wasSwimming && !this._vehicleType) {
            this._wasSwimming = false;
            return true;
        }
        return _Game_Player_canMove.call(this);
    };
    
    //=============================================================================
    // Companions/Followers Handling
    //=============================================================================
    
    // Hook into gather followers to manage visibility
    const _Game_Player_gatherFollowers = Game_Player.prototype.gatherFollowers;
    Game_Player.prototype.gatherFollowers = function() {
        _Game_Player_gatherFollowers.call(this);
        
        // Ensure follower visibility matches current state
        if (!companionsVisible) {
            setCompanionsVisibility(false);
        }
    };
    
    // Hook into refresh to manage visibility on scene/map changes
    const _Game_Followers_refresh = Game_Followers.prototype.refresh;
    Game_Followers.prototype.refresh = function() {
        _Game_Followers_refresh.call(this);
        
        // Re-apply visibility setting after refresh
        if ($gamePlayer._vehicleType === "boat") {
            setCompanionsVisibility(false);
        } else {
            setCompanionsVisibility(true);
        }
    };
    
    //=============================================================================
    // Input handling for keyboard and touch
    //=============================================================================
    
    const _Scene_Map_updateScene = Scene_Map.prototype.updateScene;
    Scene_Map.prototype.updateScene = function() {
        _Scene_Map_updateScene.call(this);
        
        if (!SceneManager.isSceneChanging()) {
            this.updateSwimFishInput();
        }
    };
    
    Scene_Map.prototype.updateSwimFishInput = function() {
        // Don't show the prompt if already swimming or fishing
        if ($gamePlayer._vehicleType === "boat" || isFishing) return;
        
        // Keyboard input - pressing Enter/Z
        if (Input.isTriggered('ok')) {
            const frontTile = getFrontTile();
            
            if (isWaterTile(frontTile.x, frontTile.y)) {
                this.showSwimFishOptions();
            }
        }
        
        // Touch input - check when screen is touched
        this.processTouchForWaterInteraction();
    };
    
    Scene_Map.prototype.processTouchForWaterInteraction = function() {
        if (!TouchInput.isTriggered()) return;
        
        // Get the map coordinates that were touched
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        
        // Only process if the touch is close to the player (adjacent tile)
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        
        // Check if touched tile is adjacent to player and is water
        if (isAdjacentTile(playerX, playerY, x, y) && isWaterTile(x, y)) {
            // Face the player towards the water tile
            if (x > playerX) {
                $gamePlayer.setDirection(6); // Right
            } else if (x < playerX) {
                $gamePlayer.setDirection(4); // Left
            } else if (y > playerY) {
                $gamePlayer.setDirection(2); // Down
            } else if (y < playerY) {
                $gamePlayer.setDirection(8); // Up
            }
            
            // Show options
            this.showSwimFishOptions();
        }
    };
    
    function isAdjacentTile(playerX, playerY, targetX, targetY) {
        // Calculate Manhattan distance (since diagonal movement typically isn't allowed)
        const distance = Math.abs(playerX - targetX) + Math.abs(playerY - targetY);
        return distance === 1; // Only adjacent tiles (not diagonal)
    }
    
    Scene_Map.prototype.showSwimFishOptions = function() {
        const choices = [tr("Swim", "Nuota")];
        
        // Add fishing option if player has fishing rod (always second position)
        if (hasFishingRod()) {
            choices.push(tr("Fish", "Pesca"));
        }
        
        // Always add Cancel as the last option
        choices.push(tr("Cancel", "Annulla"));
        
        $gameMessage.setChoices(choices, 0, choices.length - 1);
        $gameMessage.setChoiceCallback(index => {
            // Fixed: Check for swim option first
            if (index === choices.indexOf(tr("Swim", "Nuota"))) {
                enterSwimMode();
            } else if (index === choices.indexOf(tr("Fish", "Pesca")) && hasFishingRod()) {
                performFishing();
            }
            // Cancel option is handled automatically by RPG Maker
        });
    };
    
    //=============================================================================
    // Handle saving/loading swim state
    //=============================================================================
    
    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        if (this._vehicleType === "boat") {
            const boatData = $dataSystem.boat;
            this.setImage(boatData.characterName, boatData.characterIndex); // Reset to swimming sprite after load
            
            // Ensure companions are hidden when loading a save where player is swimming
            setCompanionsVisibility(false);
            
            // Reset swimming animation state
            swimAnimationTimer = 0;
            swimDirectionIndex = 0;
        }
    };
    
    //=============================================================================
    // Initialize plugin
    //=============================================================================
    
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        // Initialize any required resources here
        // Initialize the _wasSwimming property
        if ($gamePlayer) {
            $gamePlayer._wasSwimming = false;
        }
        isFishing = false;
        companionsVisible = true; // Initialize companion visibility state
        lastSwimSoundFrame = 0; // Initialize last swim sound frame
        swimAnimationTimer = 0; // Initialize swimming animation timer
        swimDirectionIndex = 0; // Initialize direction index
    };
})();