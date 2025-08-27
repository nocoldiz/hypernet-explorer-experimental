/*:
 * @target MZ
 * @plugindesc v1.1.0 Adds a window skin selector to the options menu
 * @author Claude
 * @url https://www.rpgmakerweb.com/
 *
 * @param Window Skins
 * @desc Define the available window skins for selection
 * @type struct<WindowSkin>[]
 * @default ["{\"Name\":\"Default\",\"FileName\":\"Window\"}"]
 *
 * @param Option Name
 * @desc The name that appears in the options menu
 * @type text
 * @default Window Style
 *
 * @help
 * ============================================================================
 * Window Skin Selector v1.1.0
 * ============================================================================
 * 
 * This plugin adds a window skin selector to the options menu.
 * Players can choose between different window skins defined in the plugin
 * parameters.
 * 
 * To use this plugin:
 * 1. Place the plugin below other plugins that might modify the options scene
 * 2. Add window skin images to the img/system/ folder
 * 3. Configure the window skins in the plugin parameters
 * 
 * The first window skin in the list will be used as the default.
 * 
 * ============================================================================
 * Troubleshooting
 * ============================================================================
 * 
 * If window skins aren't changing:
 * - Make sure the image files exist in img/system/ folder
 * - Verify the filenames in the plugin parameters match exactly
 * - Check the browser console for any errors
 * 
 * ============================================================================
 */

/*~struct~WindowSkin:
 * @param Name
 * @desc Display name of the window skin
 * @type text
 * 
 * @param FileName
 * @desc File name of the window skin (without extension) in img/system/
 * @type text
 */

(() => {
    'use strict';
    
    const pluginName = "WindowSkinSelector";
    
    //=============================================================================
    // Debug logging - helps with troubleshooting
    //=============================================================================
    
    // Utility function for debugging
    const debug = function(msg) {
        console.log(`[WindowSkinSelector] ${msg}`);
    };
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    
    const parameters = PluginManager.parameters(pluginName);
    const optionName = parameters['Option Name'] || 'Window Style';
    
    // Parse the window skins parameter
    let parsedWindowSkins = [];
    try {
        const windowSkinsParam = parameters['Window Skins'] || '[{"Name":"Default","FileName":"Window"}]';
        const windowSkins = JSON.parse(windowSkinsParam);
        
        // Ensure we have at least one default skin
        if (!windowSkins || windowSkins.length === 0) {
            parsedWindowSkins = [{name: "Default", fileName: "Window"}];
            debug("No window skins defined in parameters, using default only");
        } else {
            parsedWindowSkins = windowSkins.map(skinJSON => {
                try {
                    const skin = JSON.parse(skinJSON);
                    debug(`Registered window skin: ${skin.Name} (${skin.FileName})`);
                    return {
                        name: skin.Name || "Unknown",
                        fileName: skin.FileName || "Window"
                    };
                } catch (e) {
                    console.error("Error parsing window skin:", e);
                    return {
                        name: "Default",
                        fileName: "Window"
                    };
                }
            });
        }
    } catch (e) {
        console.error("Error parsing window skins parameter:", e);
        parsedWindowSkins = [{name: "Default", fileName: "Window"}];
    }
    
    //=============================================================================
    // ConfigManager extensions
    //=============================================================================
    
    // Add window skin to config manager
    ConfigManager.windowSkin = 0;
    
    // Save the window skin selection
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.windowSkin = this.windowSkin;
        return config;
    };
    
    // Load the window skin selection
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.windowSkin = this.readWindowSkin(config);
    };
    
    // Read window skin value with bounds checking
    ConfigManager.readWindowSkin = function(config) {
        if (config.windowSkin === undefined) {
            return 0;
        }
        return config.windowSkin.clamp(0, parsedWindowSkins.length - 1);
    };
    
    //=============================================================================
    // Window_Options extensions
    //=============================================================================
    
    // Add the window skin option to the options window
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'windowSkin');
    };
    
    // Handle the window skin option processing
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === 'windowSkin') {
            const value = this.getConfigValue(symbol);
            // Make sure the index is valid
            if (parsedWindowSkins && parsedWindowSkins[value]) {
                return parsedWindowSkins[value].name;
            } else {
                return "Default";
            }
        }
        return _Window_Options_statusText.call(this, index);
    };
    
    // After changing windowSkin value, refresh all windows
    const _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'windowSkin') {
            // Force redraw all windows immediately
            this.refreshWindowSkin();
            
            debug(`Window skin changed to index: ${value}`);
        }
    };
    
    // Handle changing the window skin option
    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        
        if (symbol === 'windowSkin') {
            this.changeWindowSkin(symbol);
        } else {
            _Window_Options_processOk.call(this);
        }
    };
    
    // Override cursorRight for window skin option
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'windowSkin') {
            this.changeWindowSkin(symbol);
        } else {
            _Window_Options_cursorRight.call(this);
        }
    };
    
    // Override cursorLeft for window skin option
    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === 'windowSkin') {
            this.changeWindowSkinReverse(symbol);
        } else {
            _Window_Options_cursorLeft.call(this);
        }
    };
    
    // Change the window skin and cycle through options (forward)
    Window_Options.prototype.changeWindowSkin = function(symbol) {
        const value = this.getConfigValue(symbol);
        const maxValue = parsedWindowSkins.length - 1;
        
        if (maxValue < 0) {
            return; // No skins available
        }
        
        if (value < maxValue) {
            this.setConfigValue(symbol, value + 1);
        } else {
            this.setConfigValue(symbol, 0);
        }
        
        this.redrawItem(this.findSymbol(symbol));
        this.playCursorSound();
        this.refreshWindowSkin();
    };
    
    // Change the window skin and cycle through options (backward)
    Window_Options.prototype.changeWindowSkinReverse = function(symbol) {
        const value = this.getConfigValue(symbol);
        const maxValue = parsedWindowSkins.length - 1;
        
        if (maxValue < 0) {
            return; // No skins available
        }
        
        if (value > 0) {
            this.setConfigValue(symbol, value - 1);
        } else {
            this.setConfigValue(symbol, maxValue);
        }
        
        this.redrawItem(this.findSymbol(symbol));
        this.playCursorSound();
        this.refreshWindowSkin();
    };
    
    // Refresh all windows with the new skin
    Window_Options.prototype.refreshWindowSkin = function() {
        const windowSkinIndex = ConfigManager.windowSkin || 0;
        
        // Safety check to ensure the index is valid
        if (!parsedWindowSkins || parsedWindowSkins.length === 0) {
            return;
        }
        
        // Ensure index is within bounds
        const validIndex = Math.min(windowSkinIndex, parsedWindowSkins.length - 1);
        const skinFileName = parsedWindowSkins[validIndex] ? parsedWindowSkins[validIndex].fileName : "Window";
        
        // Apply to all windows in the current scene
        if (SceneManager._scene) {
            SceneManager._scene.refreshAllWindowSkins(skinFileName);
        }
    };
    
    //=============================================================================
    // Scene_Base extensions - Apply to ALL scenes
    //=============================================================================
    
    // Add a method to refresh all window skins in the scene
    Scene_Base.prototype.refreshAllWindowSkins = function(skinFileName) {
        // Apply to all windows in this scene
        this.applyWindowSkinToChildren(this, skinFileName);
    };
    
    // Recursively apply window skin to all windows in the scene
    Scene_Base.prototype.applyWindowSkinToChildren = function(parent, skinFileName) {
        if (!parent || !parent.children || !skinFileName) return;
        
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            
            // Apply to Window_Base instances
            if (child instanceof Window_Base) {
                const skin = ImageManager.loadSystem(skinFileName);
                // Force redraw of window
                child.loadWindowskin(skin);
                child._windowskin = skin;
                child._refreshAllParts();
            }
            
            // Recursively apply to all children
            if (child.children && child.children.length > 0) {
                this.applyWindowSkinToChildren(child, skinFileName);
            }
        }
    };
    
    //=============================================================================
    // Window_Base extensions
    //=============================================================================
    
    // Override the loadWindowskin method to use the configured skin
    const _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(rect) {
        _Window_Base_initialize.call(this, rect);
        this.refreshWindowSkin();
    };
    
    // Refresh the window skin based on configuration
    Window_Base.prototype.refreshWindowSkin = function() {
        const windowSkinIndex = ConfigManager.windowSkin || 0;
        // Safety check to ensure the index is valid
        if (!parsedWindowSkins || parsedWindowSkins.length === 0) {
            this.loadWindowskin(ImageManager.loadSystem("Window"));
            return;
        }
        
        // Ensure index is within bounds
        const validIndex = Math.min(windowSkinIndex, parsedWindowSkins.length - 1);
        const skinFileName = parsedWindowSkins[validIndex] ? parsedWindowSkins[validIndex].fileName : "Window";
        
        debug(`Refreshing window skin to: ${skinFileName}`);
        
        const skin = ImageManager.loadSystem(skinFileName);
        this.loadWindowskin(skin);
        this._windowskin = skin; // Ensure the windowskin property is set
        this._refreshAllParts(); // Force redraw of window
    };
    
    //=============================================================================
    // Apply the selected skin on scene changes
    //=============================================================================
    
    // Make sure all windows use the correct skin when created in any scene
    const _Scene_Base_create = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.call(this);
        this._needsWindowSkinRefresh = true;
    };
    
    // Apply window skin when the scene becomes active
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        if (this._needsWindowSkinRefresh) {
            this._needsWindowSkinRefresh = false;
            this.refreshAllSceneWindowSkins();
        }
    };
    
    // Refresh all windows in the current scene with the selected skin
    Scene_Base.prototype.refreshAllSceneWindowSkins = function() {
        if (!parsedWindowSkins || parsedWindowSkins.length === 0) return;
        
        const windowSkinIndex = ConfigManager.windowSkin || 0;
        const validIndex = Math.min(windowSkinIndex, parsedWindowSkins.length - 1);
        const skinFileName = parsedWindowSkins[validIndex] ? parsedWindowSkins[validIndex].fileName : "Window";
        
        this.refreshAllWindowSkins(skinFileName);
    };
    
    //=============================================================================
    // Scene_Boot extensions
    //=============================================================================
    
    // Preload all window skins
    const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.call(this);
        
        debug("Preloading window skins...");
        for (const skin of parsedWindowSkins) {
            debug(`Loading skin: ${skin.fileName}`);
            ImageManager.loadSystem(skin.fileName);
        }
    };
    
    //=============================================================================
    // Apply selected window skin at game start
    //=============================================================================
    
    // When the map loads, make sure all windows have the correct skin
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        // Wait a frame, then apply skins to ensure all windows are created
        setTimeout(() => {
            this.refreshAllSceneWindowSkins();
            debug("Applied window skin on map load");
        }, 100);
    };
})();