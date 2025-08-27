//=============================================================================
// BlockRegion.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Block Region - Override Passability
 * @author YourName
 * @version 1.0.0
 * @description Override tileset passability settings for specific regions
 *
 * @help BlockRegion.js
 * 
 * This plugin allows you to override tileset passability settings for
 * specific region IDs:
 * - Region ID 5: Always passable (forces passage)
 * - Region ID 10: Always impassable (blocks passage)
 * 
 * These settings take priority over any tileset passability configurations.
 * 
 * Simply paint regions 5 or 10 on your maps using the Region tool in the
 * map editor, and the plugin will handle the rest automatically.
 * 
 * No plugin parameters needed - just install and it works!
 * 
 * License: Free for commercial and non-commercial use
 * 
 * @param 
 * @desc 
 * @default 
 */

(() => {
    'use strict';
    
    // Store the original isPassable method
    const _Game_Map_isPassable = Game_Map.prototype.isPassable;
    
    // Override the isPassable method
    Game_Map.prototype.isPassable = function(x, y, d) {
        // Get the region ID at the specified coordinates
        const regionId = this.regionId(x, y);
        
        // Region 5: Always allow passage
        if (regionId === 5) {
            return true;
        }
        
        // Region 10: Always block passage
        if (regionId === 10) {
            return false;
        }
        // Region 11: Always block passage
        if (regionId === 11) {
            return false;
        }
        // For all other regions, use the original passability check
        return _Game_Map_isPassable.call(this, x, y, d);
    };
    
    // Also override checkPassage for more comprehensive coverage
    const _Game_Map_checkPassage = Game_Map.prototype.checkPassage;
    
    Game_Map.prototype.checkPassage = function(x, y, bit) {
        // Get the region ID at the specified coordinates
        const regionId = this.regionId(x, y);
        
        // Region 5: Always allow passage (return 0 for all directions)
        if (regionId === 5) {
            return 0;
        }
        
        // Region 10: Always block passage (return the bit flag to block)
        if (regionId === 10) {
            return bit;
        }
        
        // For all other regions, use the original passage check
        return _Game_Map_checkPassage.call(this, x, y, bit);
    };
    
})();