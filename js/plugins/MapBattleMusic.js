//=============================================================================
// MapBattleMusic.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Map Battle Music v1.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.0.0
 * @description v1.0.0 Changes battle music based on map notes
 * @url 
 * @help MapBattleMusic.js
 * 
 * This plugin allows you to set custom battle music for specific maps
 * by using note tags in the map's note field.
 * 
 * Usage:
 * In the map's note field (accessible through the Map Properties), 
 * add the following note tag:
 * 
 * <BattleMusic: filename>
 * 
 * Where "filename" is the name of the audio file in your audio/bgm folder
 * (without the file extension). Supports subfolders using forward slashes.
 * 
 * Examples:
 * <BattleMusic: Boss1>                    - Plays Boss1.ogg from audio/bgm/
 * <BattleMusic: battle/intense>           - Plays intense.ogg from audio/bgm/battle/
 * <BattleMusic: boss/final/ultimate>      - Plays ultimate.ogg from audio/bgm/boss/final/
 * 
 * This will play the specified audio file as the battle music for that map.
 * 
 * If no <BattleMusic> tag is found, the plugin will use the default
 * battle music set in the System settings.
 * 
 * Note Tags:
 * <BattleMusic: filename> - Sets custom battle music for the map
 *                          Supports subfolders (e.g., battle/boss, music/dungeon/dark)
 * 
 * @param defaultVolume
 * @text Default Volume
 * @desc Default volume for battle music (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param defaultPitch
 * @text Default Pitch
 * @desc Default pitch for battle music (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param defaultPan
 * @text Default Pan
 * @desc Default pan for battle music (-100 to 100)
 * @type number
 * @min -100
 * @max 100
 * @default 0
 * 
 * License: MIT
 */

(() => {
    'use strict';
    
    const pluginName = 'MapBattleMusic';
    const parameters = PluginManager.parameters(pluginName);
    const defaultVolume = parseInt(parameters['defaultVolume'] || 90);
    const defaultPitch = parseInt(parameters['defaultPitch'] || 100);
    const defaultPan = parseInt(parameters['defaultPan'] || 0);
    
    // Store the original battle music
    let originalBattleBgm = null;
    
    /**
     * Extract battle music filename from map notes
     * @param {string} noteData - The map's note data
     * @returns {string|null} - The battle music filename or null if not found
     */
    function extractBattleMusic(noteData) {
        if (!noteData) return null;
        
        const match = noteData.match(/<BattleMusic:\s*(.+?)>/i);
        return match ? match[1].trim() : null;
    }
    
    /**
     * Get the current map's custom battle music
     * @returns {object|null} - Battle music object or null if using default
     */
    function getCurrentMapBattleMusic() {
        if (!$dataMap || !$dataMap.note) return null;
        
        const battleMusicName = extractBattleMusic($dataMap.note);
        if (!battleMusicName) return null;
        
        return {
            name: battleMusicName,
            volume: defaultVolume,
            pitch: defaultPitch,
            pan: defaultPan
        };
    }
    
    // Override BattleManager.playBattleBgm to use custom map battle music
    const _BattleManager_playBattleBgm = BattleManager.playBattleBgm;
    BattleManager.playBattleBgm = function() {
        const customBattleMusic = getCurrentMapBattleMusic();
        
        if (customBattleMusic) {
            // Store original battle BGM if not already stored
            if (!originalBattleBgm) {
                originalBattleBgm = $dataSystem.battleBgm;
            }
            
            // Temporarily replace the system battle BGM
            $dataSystem.battleBgm = customBattleMusic;
            
            // Play the custom battle music
            AudioManager.playBgm(customBattleMusic);
        } else {
            // Use the original method for default behavior
            _BattleManager_playBattleBgm.call(this);
        }
    };
    
    // Override BattleManager.replayBgmAndBgs to handle custom battle music
    const _BattleManager_replayBgmAndBgs = BattleManager.replayBgmAndBgs;
    BattleManager.replayBgmAndBgs = function() {
        const customBattleMusic = getCurrentMapBattleMusic();
        
        if (customBattleMusic && this.isBattleTest()) {
            // If we're in battle and have custom music, replay it
            AudioManager.playBgm(customBattleMusic);
        } else if (customBattleMusic && $gameParty.inBattle()) {
            // If we're in battle with custom music, replay it
            AudioManager.playBgm(customBattleMusic);
        } else {
            // Use the original method
            _BattleManager_replayBgmAndBgs.call(this);
        }
    };
    
    // Override Scene_Battle.terminate to restore original battle BGM
    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        // Restore original battle BGM if it was modified
        if (originalBattleBgm) {
            $dataSystem.battleBgm = originalBattleBgm;
            originalBattleBgm = null;
        }
        
        _Scene_Battle_terminate.call(this);
    };
    
    // Override DataManager.onLoad to ensure compatibility with save/load
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.call(this, object);
        
        // Reset the original battle BGM reference when loading
        if (object === $dataSystem) {
            originalBattleBgm = null;
        }
    };
    
    // Add plugin command for testing (optional)
    PluginManager.registerCommand(pluginName, "testBattleMusic", args => {
        const musicName = args.musicName || "";
        if (musicName) {
            const testMusic = {
                name: musicName,
                volume: defaultVolume,
                pitch: defaultPitch,
                pan: defaultPan
            };
            AudioManager.playBgm(testMusic);
            $gameMessage.add(`Testing battle music: ${musicName}`);
        }
    });
    
})();