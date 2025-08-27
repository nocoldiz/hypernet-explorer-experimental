/*:
 * @target MZ
 * @plugindesc Adds a 'Switch' button to the equipment and skills menus to cycle through party members.
 * @author Claude
 * @help 
 * This plugin adds a "Switch" button to both the equipment and skills menus,
 * allowing players to cycle through party members without leaving these screens.
 * 
 * No plugin parameters are needed.
 * 
 * Version 1.0.0
 */

(() => {
    //=========================================================================
    // Equipment Menu Modifications
    //=========================================================================
    
    // Override the maxCols method for equipment command window
    const _Window_EquipCommand_maxCols = Window_EquipCommand.prototype.maxCols;
    Window_EquipCommand.prototype.maxCols = function() {
        // Ensure there's enough space for our button
        const originalCols = _Window_EquipCommand_maxCols.call(this);
        return Math.max(originalCols, 4); // We need at least Equip, Best Face, Reset, Switch
    };

    // Override the makeCommandList method to add our Switch command
    const _Window_EquipCommand_makeCommandList = Window_EquipCommand.prototype.makeCommandList;
    Window_EquipCommand.prototype.makeCommandList = function() {
        // Call the original method first
        _Window_EquipCommand_makeCommandList.call(this);
        
        // Add our switch command at the end
        this.addCommand("Switch", "switch", this.isSwapEnabled());
    };

    // Add a method to check if actor swapping should be enabled
    Window_EquipCommand.prototype.isSwapEnabled = function() {
        return $gameParty.size() > 1; // Only enable if there's more than one party member
    };

    // Add handler for the new command in Scene_Equip
    const _Scene_Equip_createCommandWindow = Scene_Equip.prototype.createCommandWindow;
    Scene_Equip.prototype.createCommandWindow = function() {
        _Scene_Equip_createCommandWindow.call(this);
        this._commandWindow.setHandler("switch", this.commandSwitch.bind(this));
    };

    // Add the commandSwitch method to Scene_Equip
    Scene_Equip.prototype.commandSwitch = function() {
        // Get the current actor index in the party
        const partyMembers = $gameParty.members();
        const currentIndex = partyMembers.indexOf(this.actor());
        
        // Calculate the next actor index (wrap around if at the end)
        const nextIndex = (currentIndex + 1) % partyMembers.length;
        
        // Set the next actor as the active actor
        this._actor = partyMembers[nextIndex];
        
        // Refresh all windows with the new actor data
        this.refreshActor();
        
        // Keep the command window active
        this._commandWindow.activate();
    };

    //=========================================================================
    // Skills Menu Modifications
    //=========================================================================
    
    // For skills menu, keep all buttons in a single column (vertical alignment)
    Window_SkillType.prototype.maxCols = function() {
        return 1; // Force a single column for vertical alignment
    };

    // Override the makeCommandList method to add our Switch command
    const _Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
    Window_SkillType.prototype.makeCommandList = function() {
        // Call the original method first
        _Window_SkillType_makeCommandList.call(this);
        
        // Add our switch command at the end
        this.addCommand("Switch", "switch", this.isSwapEnabled());
    };

    // Add a method to check if actor swapping should be enabled
    Window_SkillType.prototype.isSwapEnabled = function() {
        return $gameParty.size() > 1; // Only enable if there's more than one party member
    };

    // Add handler for the new command in Scene_Skill
    const _Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
    Scene_Skill.prototype.createSkillTypeWindow = function() {
        _Scene_Skill_createSkillTypeWindow.call(this);
        this._skillTypeWindow.setHandler("switch", this.commandSwitch.bind(this));
    };

    // Add the commandSwitch method to Scene_Skill
    Scene_Skill.prototype.commandSwitch = function() {
        // Get the current actor index in the party
        const partyMembers = $gameParty.members();
        const currentIndex = partyMembers.indexOf(this.actor());
        
        // Calculate the next actor index (wrap around if at the end)
        const nextIndex = (currentIndex + 1) % partyMembers.length;
        
        // Set the next actor as the active actor
        this._actor = partyMembers[nextIndex];
        
        // Refresh all windows with the new actor data
        this.refreshActor();
        
        // Store the current index to restore it after refresh
        const switchIndex = this._skillTypeWindow.findSymbol("switch");
        
        // Keep the command window active and maintain cursor position
        this._skillTypeWindow.activate();
        
        // Select the Switch command to keep the cursor on the button
        if (switchIndex >= 0) {
            this._skillTypeWindow.select(switchIndex);
        }
    };
})();