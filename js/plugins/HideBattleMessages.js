/*:
 * @target MZ
 * @plugindesc Removes battle messages and displays rewards in a popup after battle.
 * @author Claude (Enhanced)
 * @help 
 * This plugin eliminates the display of several battle messages:
 * 1. The "Enemy Emerged" message shown at the start of battle
 * 2. The "Running Away" message shown when attempting to escape
 * 3. The victory messages showing EXP, gold, and items gained
 * 
 * Additionally, it creates a simple popup window in the top right corner of the map
 * that displays battle rewards (EXP and gold) after returning to the map.
 * This popup will automatically close after a few seconds.
 * 
 * No plugin parameters or commands required.
 * Simply install the plugin and these features will be activated.
 * 
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(function() {
    //=============================================================================
    // Sprite_Enemy - Move Enemy Battlers Down by 60px
    //=============================================================================
    
    // Adjust the position of enemy sprites
    const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
    Sprite_Enemy.prototype.updatePosition = function() {
        // Call the original method first
        _Sprite_Enemy_updatePosition.call(this);
        
        // Move the enemy battler down by 60 pixels
        this.y += 60;
    };
    
    //=============================================================================
    // BattleManager - Hide Battle Messages
    //=============================================================================
    
    // Overwrite the BattleManager.displayStartMessages method to skip the enemy emerged message
    const _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        // Do nothing, skipping the "Enemy Emerged" message
    };
    
    // Overwrite the BattleManager.displayEscapeFailureMessage method to skip the escape message
    const _BattleManager_displayEscapeFailureMessage = BattleManager.displayEscapeFailureMessage;
    BattleManager.displayEscapeFailureMessage = function() {
        // Do nothing, skipping the "Running Away" message
    };
    
    // Overwrite the BattleManager.displayEscapeSuccessMessage method to skip the success escape message
    const _BattleManager_displayEscapeSuccessMessage = BattleManager.displayEscapeSuccessMessage;
    BattleManager.displayEscapeSuccessMessage = function() {
        // Do nothing, skipping the "Running Away" success message
    };
    
    //=============================================================================
    // BattleManager - Store Battle Results and Skip Victory Messages
    //=============================================================================
    
    // Store battle rewards to display them later in a popup
    let _battleRewards = {
        exp: 0,
        gold: 0,
        items: []
    };
    
    // Alias and modify the methods to store rewards BEFORE applying them
    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function() {
        _BattleManager_makeRewards.call(this);
        
        // Store the total exp and gold BEFORE they're given to the party
        _battleRewards.exp = this._rewards.exp;
        _battleRewards.gold = this._rewards.gold;
        _battleRewards.items = this._rewards.items.slice(); // Clone the items array
    };
    
    // Overwrite the victory message display methods
    const _BattleManager_displayVictoryMessage = BattleManager.displayVictoryMessage;
    BattleManager.displayVictoryMessage = function() {
        // Skip the victory message
    };
    
    const _BattleManager_displayRewards = BattleManager.displayRewards;
    BattleManager.displayRewards = function() {
        // Skip displaying rewards in battle, but still gain them
        this.gainRewards();
        this.endBattle(0);
    };
    
    // Check for actor death and handle special cases
    const _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
        // Check for actor deaths before ending the turn
        this.checkActorDeaths();
        
        _BattleManager_endTurn.call(this);
    };
    
    // Also check deaths during update (to catch deaths outside of turn ends)
    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function() {
        _BattleManager_update.call(this);
        
        // Only check during battle phase
        if (this._phase === 'action' || this._phase === 'turn') {
            this.checkActorDeaths();
        }
    };
    
    // Add a method to check for dead actors with special handling
    BattleManager.checkActorDeaths = function() {
        // Get references to actor1 and actor2
        const actor1 = $gameParty.members()[0]; // First party member (index 0)
        const actor2 = $gameParty.members()[1]; // Second party member (index 1)
        
        // If actor1 is dead, trigger game over immediately
        if (actor1 && actor1.isDead()) {
            // Immediate game over for actor1
            this._actor1Died = true;
            // Force defeat processing
            this.processDefeat();
            return;
        }
        
        // If actor2 is dead, mark for removal
        if (actor2 && actor2.isDead() && !this._actor2Died) {
            // Mark actor2 as dead (to prevent repeated messages)
            this._actor2Died = true;
            this._actor2Name = actor2.name(); // Store name for the message
        }
    };
    
    // Override processDefeat to handle actor1 death
    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        if (this._actor1Died) {
            // Skip normal defeat processing if actor1 died
            this.updateBattleEnd();
            // Set a special flag for immediate game over
            $gameSystem.setActor1Died(true);
            $gameSystem.setImmediateGameOver(true);
        } else {
            _BattleManager_processDefeat.call(this);
        }
    };
    
    // Alias the BattleManager.updateBattleEnd method to set a flag when battle is ending
    const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function() {
        _BattleManager_updateBattleEnd.call(this);
        if (this._escaped || $gameParty.isAllDead() || $gameTroop.isAllDead()) {
            $gameSystem.setBattleEnded(true);
            
            // Store special death flags if any actor died
            if (this._actor1Died) {
                $gameSystem.setActor1Died(true);
            }
            
            if (this._actor2Died) {
                $gameSystem.setActor2Died(true, this._actor2Name);
            }
        }
    };
    
    //=============================================================================
    // Game_System - Store Battle Ended Flag and Actor Death Flags
    //=============================================================================
    
    // Add a method to Game_System to track when a battle has ended and actor death flags
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._battleEnded = false;
        this._actor1Died = false;
        this._actor2Died = false;
        this._actor2Name = "";
        this._immediateGameOver = false;
    };
    
    Game_System.prototype.setBattleEnded = function(value) {
        this._battleEnded = value;
    };
    
    Game_System.prototype.isBattleEnded = function() {
        return this._battleEnded;
    };
    
    Game_System.prototype.setActor1Died = function(value) {
        this._actor1Died = value;
    };
    
    Game_System.prototype.isActor1Died = function() {
        return this._actor1Died;
    };
    
    Game_System.prototype.setImmediateGameOver = function(value) {
        this._immediateGameOver = value;
    };
    
    Game_System.prototype.isImmediateGameOver = function() {
        return this._immediateGameOver;
    };
    
    Game_System.prototype.setActor2Died = function(value, name) {
        this._actor2Died = value;
        if (name) {
            this._actor2Name = name;
        }
    };
    
    Game_System.prototype.isActor2Died = function() {
        return this._actor2Died;
    };
    
    Game_System.prototype.getActor2Name = function() {
        return this._actor2Name;
    };
    
    //=============================================================================
    // Scene_Map - Display Rewards Popup
    //=============================================================================
    
    // Alias the Scene_Map.start method to check if we need to show rewards
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        
        // Check for game over first (actor1 died)
        if ($gameSystem.isImmediateGameOver()) {
            // Reset the flag to prevent loops
            $gameSystem.setImmediateGameOver(false);
            $gameSystem.setActor1Died(false);
            // Go directly to game over
            SceneManager.goto(Scene_Gameover);
            return;
        }
        
        // If returning from battle with rewards to show
        if ($gameSystem.isBattleEnded()) {
            // Check for game over again (as a backup)
            if ($gameSystem.isActor1Died()) {
                $gameSystem.setActor1Died(false);
                SceneManager.goto(Scene_Gameover);
                return;
            }
            
            // Check if actor2 died and handle removal + message
            if ($gameSystem.isActor2Died()) {
                const actor2Name = $gameSystem.getActor2Name();
                
                // Remove actor2 from the party
                const actor2Id = $gameParty.members()[1].actorId();
                $gameParty.removeActor(actor2Id);
                
                // Show the death message
                window.skipLocalization = true;

                $gameMessage.add(actor2Name + " has died.");
                window.skipLocalization = false;

                
                // Reset the flag
                $gameSystem.setActor2Died(false, "");
            }
            
            this.createRewardsPopup();
            $gameSystem.setBattleEnded(false);
        }
    };
    
    // Create the rewards popup window
    Scene_Map.prototype.createRewardsPopup = function() {
        this._rewardsPopupWindow = new Window_BattleRewardsPopup();
        this.addWindow(this._rewardsPopupWindow);
        this._rewardsPopupWindow.open();
        
        // Set timer to close popup
        this._rewardsPopupCloseTimer = 180; // Close after ~3 seconds (60 frames per second)
    };
    
    // Alias the Scene_Map.update method to handle popup timer
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateRewardsPopup();
    };
    
    // Update the rewards popup timer
    Scene_Map.prototype.updateRewardsPopup = function() {
        if (this._rewardsPopupWindow && this._rewardsPopupCloseTimer > 0) {
            this._rewardsPopupCloseTimer--;
            if (this._rewardsPopupCloseTimer <= 0) {
                this._rewardsPopupWindow.close();
                this._rewardsPopupWindow = null;
            }
        }
    };
    
    //=============================================================================
    // Window_BattleRewardsPopup
    //=============================================================================
    
    // Add a direct hook into the scene flow to handle immediate game over
    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        // Check if we need to force a game over during scene transition
        if ($gameSystem && $gameSystem.isImmediateGameOver() && sceneClass !== Scene_Gameover) {
            $gameSystem.setImmediateGameOver(false);
            $gameSystem.setActor1Died(false);
            _SceneManager_goto.call(this, Scene_Gameover);
        } else {
            _SceneManager_goto.call(this, sceneClass);
        }
    };
    
    // Define the new Window_BattleRewardsPopup class
    function Window_BattleRewardsPopup() {
        this.initialize(...arguments);
    }
    
    Window_BattleRewardsPopup.prototype = Object.create(Window_Base.prototype);
    Window_BattleRewardsPopup.prototype.constructor = Window_BattleRewardsPopup;
    
    Window_BattleRewardsPopup.prototype.initialize = function() {
        // Calculate window dimensions based on content
        const width = this.windowWidth();
        const height = this.windowHeight();
        const x = Graphics.boxWidth - width;
        const y = 0;
        
        // Call parent constructor
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        
        this.openness = 0;
        this.refresh();
    };
    
    // Update the window size calculations for single line format
    Window_BattleRewardsPopup.prototype.windowWidth = function() {
        return 200; // Width for single line format
    };
    
    Window_BattleRewardsPopup.prototype.windowHeight = function() {
        return this.lineHeight() + this.itemPadding() * 2; // Just one line of text
    };
    
    Window_BattleRewardsPopup.prototype.lineHeight = function() {
        return 36;
    };
    
    Window_BattleRewardsPopup.prototype.itemPadding = function() {
        return 12; // Increased padding for better appearance
    };
    
    // Simplified refresh method for single line format
    Window_BattleRewardsPopup.prototype.refresh = function() {
        this.contents.clear();
        
        // Format as a single line: "30exp 50€"
        const rewardText = _battleRewards.exp + "exp " + _battleRewards.gold + "€";
        
        // Draw with horizontal padding
        const horizontalPadding = 10;
        this.drawText(rewardText, horizontalPadding, 0, this.contentsWidth() - (horizontalPadding * 2), 'center');
    };
    
    // Add open and close animations
    Window_BattleRewardsPopup.prototype.open = function() {
        this.refresh();
        Window_Base.prototype.open.call(this);
    };
    
    Window_BattleRewardsPopup.prototype.close = function() {
        Window_Base.prototype.close.call(this);
    };
})();