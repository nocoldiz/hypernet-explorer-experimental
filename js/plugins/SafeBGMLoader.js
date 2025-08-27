//=============================================================================
// SafeBGMLoader.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.1] Safe BGM Loader
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @url 
 * @help SafeBGMLoader.js
 * 
 * @param enableLogging
 * @text Enable Console Logging
 * @desc Log when BGM files are missing (for debugging)
 * @type boolean
 * @default true
 * 
 * This plugin prevents the game from crashing when background music files
 * are missing. Instead of throwing an error, it will silently skip playing
 * the missing BGM file. Only intervenes when files are actually missing,
 * otherwise uses default RPG Maker MZ methods.
 * 
 * Features:
 * - Prevents crashes from missing BGM files
 * - Optional console logging for debugging
 * - Works with map BGM and event-triggered BGM
 * - Only overrides behavior when files are missing
 * 
 * License: MIT
 */

(() => {
    'use strict';
    
    const pluginName = 'SafeBGMLoader';
    const parameters = PluginManager.parameters(pluginName);
    const enableLogging = parameters['enableLogging'] === 'true';
    
    // Store original methods
    const _AudioManager_playBgm = AudioManager.playBgm;
    const _AudioManager_createBuffer = AudioManager.createBuffer;
    
    // Helper function to check if a file exists
    function checkFileExists(folder, name) {
        const ext = AudioManager.audioFileExt();
        const nameParts = name.split('/');
        const encodedName = nameParts.map(part => encodeURIComponent(part)).join('/');
        const url = AudioManager._path + folder + "/" + encodedName + ext;
        
        // Create a test request to check file existence
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, false); // Synchronous request for existence check
        try {
            xhr.send();
            return xhr.status >= 200 && xhr.status < 400;
        } catch (e) {
            return false;
        }
    }
    
    // Override AudioManager.playBgm to check file existence first
    AudioManager.playBgm = function(bgm, pos) {
        if (this.isCurrentBgm(bgm)) {
            // File is already playing, use default behavior
            return _AudioManager_playBgm.call(this, bgm, pos);
        }
        
        if (!bgm || !bgm.name) {
            // No BGM specified, use default behavior
            return _AudioManager_playBgm.call(this, bgm, pos);
        }
        
        // Check if the BGM file exists
        if (checkFileExists('bgm', bgm.name)) {
            // File exists, use default RPG Maker MZ behavior
            return _AudioManager_playBgm.call(this, bgm, pos);
        } else {
            // File doesn't exist, apply our safe handling
            if (enableLogging) {
                console.warn(`[${pluginName}] BGM file not found: ${bgm.name}`);
            }
            
            this.stopBgm();
            this._currentBgm = {
                name: "",
                volume: 0,
                pitch: 0,
                pan: 0,
                pos: 0
            };
        }
    };
    
    // Override AudioManager.createBuffer to handle missing files gracefully
    AudioManager.createBuffer = function(folder, name) {
        // First check if file exists
        if (!checkFileExists(folder, name)) {
            if (enableLogging) {
                console.warn(`[${pluginName}] Audio file not found: ${folder}/${name}`);
            }
            return null;
        }
        
        // File exists, use default behavior with error handling
        try {
            return _AudioManager_createBuffer.call(this, folder, name);
        } catch (e) {
            if (enableLogging) {
                console.warn(`[${pluginName}] Error creating buffer for: ${folder}/${name}`, e);
            }
            return null;
        }
    };
    
    // Override WebAudio methods only for error handling
    const _WebAudio_initialize = WebAudio.prototype.initialize;
    WebAudio.prototype.initialize = function(url) {
        try {
            _WebAudio_initialize.call(this, url);
        } catch (e) {
            if (enableLogging) {
                console.warn(`[${pluginName}] WebAudio initialization failed for: ${url}`);
            }
            // Initialize with safe defaults to prevent crashes
            this._buffer = null;
            this._sourceNode = null;
            this._gainNode = null;
            this._pannerNode = null;
            this._totalTime = 0;
            this._sampleRate = 0;
            this._loop = false;
            this._loopStart = 0;
            this._loopLength = 0;
            this._startTime = 0;
            this._volume = 1;
            this._pitch = 1;
            this._pan = 0;
            this._endTimer = null;
            this._loadListeners = [];
            this._stopListeners = [];
            this._hasError = true;
        }
    };
    
    // Add safety to WebAudio load method
    const _WebAudio_load = WebAudio.prototype._load;
    WebAudio.prototype._load = function(url) {
        if (this._hasError) {
            // Don't attempt to load if we already know there's an error
            return;
        }
        
        try {
            _WebAudio_load.call(this, url);
        } catch (e) {
            if (enableLogging) {
                console.warn(`[${pluginName}] WebAudio load failed for: ${url || this._url}`, e);
            }
            this._hasError = true;
            this._loading = false;
        }
    };
    
    // Override Game_Map.autoplay to handle BGM safely
    const _Game_Map_autoplay = Game_Map.prototype.autoplay;
    Game_Map.prototype.autoplay = function() {
        if ($dataMap.autoplayBgm) {
            if ($dataMap.bgm && $dataMap.bgm.name) {
                // Check if BGM exists before trying to play
                if (checkFileExists('bgm', $dataMap.bgm.name)) {
                    AudioManager.playBgm($dataMap.bgm);
                } else if (enableLogging) {
                    console.warn(`[${pluginName}] Map BGM file not found: ${$dataMap.bgm.name}`);
                }
            } else if (enableLogging) {
                console.warn(`[${pluginName}] Map has autoplay BGM enabled but no BGM name specified`);
            }
        } else {
            AudioManager.stopBgm();
        }
        
        // Handle BGS normally
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        } else {
            AudioManager.stopBgs();
        }
    };

})();