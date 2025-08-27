/*:
 * @plugindesc v1.1 Ensures physical attacks always do at least 3% of target's max HP
 * @author Claude
 * @target MZ
 * @help 
 * This plugin ensures physical attacks always do at least 3% of the target's max HP,
 * even when defense would normally reduce damage to zero.
 * 
 * This helps keep low-level enemies threatening even when the player has high defense.
 * 
 * No plugin commands or parameters needed.
 * Simply install the plugin and it will take effect.
 * 
 * Terms of Use:
 * Free for both commercial and non-commercial use.
 */

(function() {
    // Override the damage calculation function to apply minimum damage
    const _Game_Action_executePhysicalAttack = Game_Action.prototype.executePhysicalAttack;
    
    Game_Action.prototype.executePhysicalAttack = function(target) {
        // Get damage from original calculation
        const originalDamage = this.makeDamageValue(target, false);
        
        // Calculate 3% of max HP as minimum damage
        const minDamage = Math.floor(target.mhp * 0.03);
        
        // If this is an enemy attacking a player with less damage than the minimum
        if (this.subject().isEnemy() && target.isActor() && originalDamage < minDamage) {
            // Store the original function to calculate critical
            const originalApplyGuard = this.applyGuard;
            const originalApplyDefense = this.applyDefense;
            
            // Temporarily override these functions
            this.applyGuard = function(damage, target) {
                return damage; // Skip guard reduction
            };
            
            this.applyDefense = function(damage, target) {
                return minDamage; // Return minimum damage instead
            };
            
            // Execute the physical attack with our modifications
            _Game_Action_executePhysicalAttack.call(this, target);
            
            // Restore original functions
            this.applyGuard = originalApplyGuard;
            this.applyDefense = originalApplyDefense;
        } else {
            // Normal damage calculation for other cases
            _Game_Action_executePhysicalAttack.call(this, target);
        }
    };
    
    // Override the damage application to ensure minimum damage
    const _Game_Action_applyCritical = Game_Action.prototype.applyCritical;
    
    Game_Action.prototype.applyCritical = function(damage) {
        const critDamage = _Game_Action_applyCritical.call(this, damage);
        return critDamage;
    };
    
    // Make sure minimum damage is applied in the damage formula
    const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
    
    Game_Action.prototype.makeDamageValue = function(target, critical) {
        let damage = _Game_Action_makeDamageValue.call(this, target, critical);
        
        // Check if this is a physical attack from enemy to player
        if (this.isPhysical() && this.subject().isEnemy() && target.isActor()) {
            const minDamage = Math.floor(target.mhp * 0.03);
            
            // Ensure damage is at least the minimum value
            if (damage < minDamage) {
                damage = minDamage;
            }
        }
        
        return damage;
    };
})();