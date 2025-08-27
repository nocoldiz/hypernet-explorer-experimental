//=============================================================================
// ClearLoot.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.1] Clear Loot
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.0.1
 * @description v1.0.1 Completely destroys random loot chests on maps with <NoRandomLoot> tag
 * @url 
 * @help ClearLoot.js
 * 
 * Clear Loot Plugin v1.0.1
 * 
 * This plugin completely removes specified loot chest events from maps that have the
 * <NoRandomLoot> tag in their note field.
 * 
 * The plugin will search for and destroy events with these names:
 * - RandomItemChest
 * - RandomArmorChest  
 * - RandomWeaponChest
 * 
 * Map Setup:
 * Add <NoRandomLoot> to the map's note field to enable loot clearing.
 * 
 * Load Order:
 * This plugin should be loaded AFTER any plugins that spawn/copy events
 * from other maps to ensure it can find and remove the spawned loot chests.
 * 
 * Terms of Use:
 * Free for commercial and non-commercial use.
 * 
 */

(() => {
    'use strict';
    
    // Target event names to remove
    const LOOT_EVENT_NAMES = [
        'RandomItemChest',
        'RandomArmorChest', 
        'RandomWeaponChest'
    ];
    
    // Check if current map has NoRandomLoot tag
    function hasNoRandomLootTag() {
        if (!$dataMap || !$dataMap.note) return false;
        return $dataMap.note.includes('<NoRandomLoot>');
    }
    
    // Completely destroy loot events from the current map
    function destroyLootEvents() {
        if (!$gameMap || !$dataMap) return;
        
        // Check if map has the NoRandomLoot tag
        if (!hasNoRandomLootTag()) return;
        
        // Get all events on the current map
        const events = $dataMap.events;
        if (!events) return;
        
        // Track removed events for logging
        let destroyedCount = 0;
        const destroyedEventIds = [];
        
        // Iterate through all events
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            
            // Skip null events
            if (!event) continue;
            
            // Check if event name matches any loot chest names
            if (LOOT_EVENT_NAMES.includes(event.name)) {
                // Store the event ID for logging
                destroyedEventIds.push(i);
                
                // Remove from data map
                events[i] = null;
                
                // Remove from game map events array
                if ($gameMap._events && $gameMap._events[i]) {
                    const gameEvent = $gameMap._events[i];
                    
                    // Remove from character sprites if present
                    if (SceneManager._scene && SceneManager._scene._spriteset && 
                        SceneManager._scene._spriteset._characterSprites) {
                        const sprites = SceneManager._scene._spriteset._characterSprites;
                        for (let j = sprites.length - 1; j >= 0; j--) {
                            if (sprites[j]._character === gameEvent) {
                                SceneManager._scene._spriteset._tilemap.removeChild(sprites[j]);
                                sprites.splice(j, 1);
                            }
                        }
                    }
                    
                    // Clear the game event
                    $gameMap._events[i] = null;
                }
                
                // Remove from interpreter if currently running
                if ($gameMap._interpreter && $gameMap._interpreter._eventId === i) {
                    $gameMap._interpreter.clear();
                }
                
                destroyedCount++;
            }
        }
        
        // Clean up the events array by removing null entries at the end
        // (Keep nulls in the middle to maintain indexing)
        while (events.length > 0 && events[events.length - 1] === null) {
            events.pop();
        }
        
        // Clean up game events array similarly
        if ($gameMap._events) {
            while ($gameMap._events.length > 0 && 
                   $gameMap._events[$gameMap._events.length - 1] === null) {
                $gameMap._events.pop();
            }
        }
        
        // Refresh the map display to update sprites
        if (destroyedCount > 0) {
            // Force refresh of character sprites
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                SceneManager._scene._spriteset.createCharacters();
            }
            
            console.log(`ClearLoot: Destroyed ${destroyedCount} loot chest(s) from map ${$gameMap.mapId()} (Event IDs: ${destroyedEventIds.join(', ')})`);
        }
    }
    
    // Hook into map setup
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        
        // Destroy loot events after map setup is complete
        // Use setTimeout to ensure this runs after other plugins
        setTimeout(() => {
            destroyLootEvents();
        }, 1);
    };
    
    // Alternative hook for scene map loading (backup method)
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        // Destroy loot events when map is fully loaded
        destroyLootEvents();
    };
    
    // Hook into map refresh to ensure events stay destroyed
    const _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function() {
        _Game_Map_refresh.call(this);
        
        // Re-destroy loot events after refresh to prevent them from coming back
        if (hasNoRandomLootTag()) {
            setTimeout(() => {
                destroyLootEvents();
            }, 1);
        }
    };
    
})();