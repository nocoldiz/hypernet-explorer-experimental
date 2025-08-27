/*:
 * @target MZ
 * @plugindesc Automatically loads save file #1 when selecting Load Game from the main menu.
 * @author Claude
 * @help 
 * This plugin modifies the behavior of the Load Game option in the main menu.
 * When the player selects "Load Game", it will automatically load save file #1
 * without showing the save file selection screen.
 * 
 * No configuration needed - just install the plugin and it works!
 * 
 * ============================================================================
 * Version 1.0.0
 * ============================================================================
 */

(function() {
    // Completely override the Scene_Title command window creation
    const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _Scene_Title_createCommandWindow.call(this);
        
        // Remove the original handler for load command
        this._commandWindow.setHandler("load", this.directlyLoadSaveFile1.bind(this));
    };
    
    // Add new method to directly load save file #1
    Scene_Title.prototype.directlyLoadSaveFile1 = function() {
        if (DataManager.isAnySavefileExists()) {
            if (DataManager.savefileExists(1)) {
                DataManager.loadGame(1);
                this.fadeOutAll();
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            } else {
                SoundManager.playBuzzer();
                alert("Save file #1 does not exist!");
                this._commandWindow.activate();
            }
        } else {
            SoundManager.playBuzzer();
            alert("No save files exist!");
            this._commandWindow.activate();
        }
    };
    
    // Make sure Scene_Load is never called from Scene_Title
    Scene_Title.prototype.commandLoad = function() {
        this.directlyLoadSaveFile1();
    };
})();