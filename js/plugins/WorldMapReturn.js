/*:
 * @target MZ
 * @plugindesc World Map Return v1.2.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @url 
 * @help
 * ============================================================================
 * WorldMapReturn.js
 * ============================================================================
 * 
 * This plugin tracks the player's position on map 315 (world map) and provides
 * various methods to return to it, including automatic border detection.
 * 
 * Variables Used:
 * - Variable 43: Saved X coordinate on map 315
 * - Variable 44: Saved Y coordinate on map 315
 * - Variable 45: Destination map ID (used during transfers)
 * 
 * Features:
 * - Automatically saves player position when leaving map 315
 * - Plugin commands to save position and return to world map
 * - Border detection system for automatic teleportation
 * - Support for custom teleport destinations
 * - Automatic speed reset when leaving world map
 * - Screen tint management for interior maps
 * 
 * Map Notetags:
 * 
 * <Interior>
 * Marks a map as interior - screen tint will be reset to normal when
 * entering from map 315.
 * 
 * <Exterior>
 * Marks a map as exterior - screen tint will not be changed when
 * entering from map 315.
 * 
 * <OldEurope>
 * When player touches any passable border tile, teleport to saved position
 * on map 315.
 * 
 * <OldEurope x y>
 * When player touches any passable border tile, teleport to specific
 * coordinates on map 315.
 * Example: <OldEurope 25 30>
 * 
 * <Borders mapId x y>
 * When player touches any passable border tile, teleport to specified
 * map and coordinates.
 * Example: <Borders 10 15 20>
 * 
 * @command ReturnToWorldMap
 * @text Return to World Map
 * @desc Teleport the player back to their saved position on map 315
 * 
 * @command SaveWorldMapPosition
 * @text Save Current World Map Position
 * @desc Save the current position on map 315 for later return
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'WorldMapReturn';
    const worldMapId = 315;
    
    // Variable IDs
    const VAR_WORLD_X = 43;
    const VAR_WORLD_Y = 44;
    const VAR_DEST_MAP = 45;
    
    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'ReturnToWorldMap', args => {
        returnToWorldMap();
    });
    
    PluginManager.registerCommand(pluginName, 'SaveWorldMapPosition', args => {
        saveWorldMapPosition();
    });
    
    // Function to return to world map
    function returnToWorldMap() {
        const savedX = $gameVariables.value(VAR_WORLD_X) || 0;
        const savedY = $gameVariables.value(VAR_WORLD_Y) || 0;
        
        if (savedX === 0 && savedY === 0) {
            $gameMessage.add('No saved world map position!');
            $gameMessage.add('Visit the world map first to save a position.');
            return;
        }
        
        // Set destination map for tracking
        $gameVariables.setValue(VAR_DEST_MAP, worldMapId);
        
        // Perform transfer
        $gamePlayer.reserveTransfer(worldMapId, savedX, savedY, 0, 0);
    }
    
    // Function to save world map position
    function saveWorldMapPosition() {
        if ($gameMap.mapId() === worldMapId) {
            $gameVariables.setValue(VAR_WORLD_X, $gamePlayer.x);
            $gameVariables.setValue(VAR_WORLD_Y, $gamePlayer.y);
            $gamePlayer.setMoveSpeed(4); // Reset to normal speed
            $gameMessage.add(`World map position saved: ${$gamePlayer.x}, ${$gamePlayer.y}`);
            $gameMessage.add('Player speed reset to normal.');
        } else {
            $gameMessage.add('You must be on the world map (Map 315) to save position!');
        }
    }
    
    // Override performTransfer to handle position saving and effects
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        const currentMapId = $gameMap.mapId();
        const destinationMapId = this._newMapId;
        
        // Store destination map ID
        $gameVariables.setValue(VAR_DEST_MAP, destinationMapId);
        
        // If leaving world map, save position and reset speed
        if (currentMapId === worldMapId && destinationMapId !== worldMapId) {
            $gameVariables.setValue(VAR_WORLD_X, $gamePlayer.x);
            $gameVariables.setValue(VAR_WORLD_Y, $gamePlayer.y);
            this.setMoveSpeed(4); // Reset to normal speed
        }
        
        // Call original method
        _Game_Player_performTransfer.call(this);
    };
    
    // Override map setup for border tags and interior handling
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        
        // Setup border tags
        this.setupBorderTags();
        
        // Handle interior tint if coming from world map
        const previousMapId = $gameVariables.value(VAR_DEST_MAP);
        if (previousMapId === worldMapId || $gamePlayer._transferring) {
            const lastMapId = $gamePlayer._transferring ? 
                ($gamePlayer._oldMapId || previousMapId) : previousMapId;
                
            if (lastMapId === worldMapId && mapId !== worldMapId) {
                if ($dataMap && $dataMap.note && $dataMap.note.match(/<Interior>/i)) {
                    $gameScreen.startTint([0, 0, 0, 0], 0);
                }
            }
        }
    };
    
    // Setup border teleportation tags
    Game_Map.prototype.setupBorderTags = function() {
        this._borderDestination = null;
        
        if (!$dataMap || !$dataMap.note) return;
        
        const note = $dataMap.note;
        
        // Check for OldEurope tag
        const oldEuropeMatch = note.match(/<OldEurope(?:\s+(\d+)\s+(\d+))?>/i);
        if (oldEuropeMatch) {
            if (oldEuropeMatch[1] && oldEuropeMatch[2]) {
                this._borderDestination = {
                    mapId: worldMapId,
                    x: parseInt(oldEuropeMatch[1]),
                    y: parseInt(oldEuropeMatch[2])
                };
            } else {
                this._borderDestination = {
                    mapId: worldMapId,
                    x: -1,
                    y: -1
                };
            }
        }
        
        // Check for Borders tag
        const bordersMatch = note.match(/<Borders\s+(\d+)\s+(\d+)\s+(\d+)>/i);
        if (bordersMatch) {
            this._borderDestination = {
                mapId: parseInt(bordersMatch[1]),
                x: parseInt(bordersMatch[2]),
                y: parseInt(bordersMatch[3])
            };
        }
    };
    
    // Check if tile is a border
    Game_Map.prototype.isBorderTile = function(x, y) {
        return x === 0 || y === 0 || 
               x === this.width() - 1 || y === this.height() - 1;
    };
    
    // Update player to check for border teleports
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        
        if (sceneActive && !this.isMoving() && !$gameMessage.isBusy()) {
            this.checkBorderTeleport();
        }
    };
    
    // Check and perform border teleportation
    Game_Player.prototype.checkBorderTeleport = function() {
        if (!$gameMap._borderDestination) return;
        
        const x = this.x;
        const y = this.y;
        
        if ($gameMap.isBorderTile(x, y) && this.isMapPassable(x, y, this.direction())) {
            const dest = $gameMap._borderDestination;
            let targetX = dest.x;
            let targetY = dest.y;
            
            // Use saved position if coordinates are -1
            if (targetX === -1 && targetY === -1) {
                targetX = $gameVariables.value(VAR_WORLD_X) || 0;
                targetY = $gameVariables.value(VAR_WORLD_Y) || 0;
                
                if (targetX === 0 && targetY === 0) {
                    return;
                }
            }
            
            // Set destination map and perform transfer
            $gameVariables.setValue(VAR_DEST_MAP, dest.mapId);
            $gamePlayer.reserveTransfer(dest.mapId, targetX, targetY, 0, 0);
        }
    };
    
})();