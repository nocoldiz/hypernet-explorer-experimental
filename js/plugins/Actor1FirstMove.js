//=============================================================================
// Actor1FirstMove.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Actor1 First Move v1.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.0.0
 * @description v1.0.0 Makes Actor1 of the party always move first in battle.
 * 
 * @param enablePlugin
 * @text Enable Plugin
 * @desc Enable or disable the Actor1 first move functionality.
 * @type boolean
 * @default true
 * 
 * @help Actor1FirstMove.js
 * 
 * This plugin modifies the battle turn order to ensure that Actor1
 * (the first actor in the party) always acts first in each turn.
 * 
 * Features:
 * - Actor1 will always have the highest action speed
 * - Other party members and enemies follow normal speed calculations
 * - Can be toggled on/off via plugin parameters
 * 
 * License: MIT
 * 
 * Change Log:
 * v1.0.0 - Initial release
 */

(() => {
    'use strict';
    
    const pluginName = 'Actor1FirstMove';
    const parameters = PluginManager.parameters(pluginName);
    const enablePlugin = parameters['enablePlugin'] === 'true';
    
    if (!enablePlugin) return;
    
    // Store the original makeActionOrders function
    const _BattleManager_makeActionOrders = BattleManager.makeActionOrders;
    
    /**
     * Override the makeActionOrders function to prioritize Actor1
     */
    BattleManager.makeActionOrders = function() {
        // Call the original function to get the normal action order
        const actionOrders = _BattleManager_makeActionOrders.call(this);
        
        // Safety check - ensure actionOrders exists and is an array
        if (!actionOrders || !Array.isArray(actionOrders)) {
            return actionOrders; // Return as-is if invalid
        }
        
        // Find Actor1 in the action orders
        const actor1Index = actionOrders.findIndex(battler => {
            return battler && battler.isActor && battler.isActor() && battler.actorId() === 1;
        });
        
        // If Actor1 is found and not already first, move them to the front
        if (actor1Index > 0) {
            const actor1 = actionOrders.splice(actor1Index, 1)[0];
            actionOrders.unshift(actor1);
        }
        
        return actionOrders;
    };
    
    // Alternative approach: Modify the speed calculation directly
    // This ensures Actor1 always has the highest speed for action order
    const _Game_Battler_makeSpeed = Game_Battler.prototype.makeSpeed;
    
    /**
     * Override makeSpeed to give Actor1 maximum priority
     */
    Game_Battler.prototype.makeSpeed = function() {
        // Call original speed calculation
        _Game_Battler_makeSpeed.call(this);
        
        // Safety check and Actor1 priority
        if ($gameSystem && $gameSystem._actor1FirstMove !== false && 
            this.isActor && this.isActor() && this.actorId && this.actorId() === 1) {
            this._speed = 9999; // Set to very high value to ensure first position
        }
    };
    

    
    // Initialize the system flag
    const _Game_System_initialize = Game_System.prototype.initialize;
    
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._actor1FirstMove = true; // Default to enabled
    };
    
    // Check system flag in speed calculation with better error handling
    Game_Battler.prototype.makeSpeed = function() {
        _Game_Battler_makeSpeed.call(this);
        
        // Safety checks and Actor1 priority
        if ($gameSystem && $gameSystem._actor1FirstMove && 
            this.isActor && this.isActor() && this.actorId && this.actorId() === 1) {
            this._speed = 9999;
        }
    };
    
})();