//=============================================================================
// F7_DebugCommonEvent.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] F7 Debug Common Event
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @url 
 * @help F7_DebugCommonEvent.js
 * 
 * @param commonEventId
 * @text Common Event ID
 * @desc The ID of the common event to execute when F7 is pressed
 * @type common_event
 * @default 1
 * 
 * @param enableInTest
 * @text Enable in Test Mode Only
 * @desc Only allow F7 execution during test play
 * @type boolean
 * @default true
 * 
 * @param showMessage
 * @text Show Debug Message
 * @desc Show a message when the common event is executed
 * @type boolean
 * @default true
 * 
 * @param debugMessage
 * @text Debug Message Text
 * @desc Message to display when common event is executed
 * @type string
 * @default Debug: Common Event Executed
 * 
 * ============================================================================
 * F7 Debug Common Event Plugin
 * ============================================================================
 * 
 * This plugin allows you to execute a specified common event by pressing F7.
 * Useful for debugging and testing purposes.
 * 
 * Features:
 * - Execute any common event with F7 key
 * - Option to restrict to test mode only
 * - Optional debug message display
 * - Configurable common event ID
 * 
 * Usage:
 * 1. Set the Common Event ID parameter to the event you want to execute
 * 2. Configure other options as needed
 * 3. Press F7 during gameplay to execute the event
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for commercial and non-commercial use.
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'F7_DebugCommonEvent';
    const parameters = PluginManager.parameters(pluginName);
    
    const commonEventId = Number(parameters['commonEventId']) || 1;
    const enableInTest = parameters['enableInTest'] === 'true';
    const showMessage = parameters['showMessage'] === 'true';
    const debugMessage = parameters['debugMessage'] || 'Debug: Common Event Executed';
    
    // Key code for F7
    const F7_KEY = 118;
    
    // Store original Scene_Map update method
    const _Scene_Map_update = Scene_Map.prototype.update;
    
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateDebugKey();
    };
    
    Scene_Map.prototype.updateDebugKey = function() {
        if (Input.isTriggered('debug_f7')) {
            this.executeDebugCommonEvent();
        }
    };
    
    Scene_Map.prototype.executeDebugCommonEvent = function() {
        // Check if we should only allow this in test mode
        if (enableInTest && !$dataSystem.isJapanese && !Utils.isOptionValid('test')) {
            return;
        }
        
        // Check if the common event exists
        if (!$dataCommonEvents[commonEventId]) {
            if (showMessage) {
                $gameMessage.add(`\\C[2]Debug Error: Common Event ${commonEventId} does not exist!\\C[0]`);
            }
            return;
        }
        
        // Check if we can execute the common event (not already running, etc.)
        if ($gameMap.isEventRunning()) {
            if (showMessage) {
                $gameMessage.add(`\\C[3]Debug: Cannot execute - event already running\\C[0]`);
            }
            return;
        }
        
        // Execute the common event
        $gameTemp.reserveCommonEvent(commonEventId);
        
        // Show debug message if enabled
        if (showMessage) {
            console.log(`[F7 Debug] Executing Common Event ${commonEventId}`);
            // Only show in-game message if message window is available and not busy
            if (!$gameMessage.isBusy()) {
                $gameMessage.add(`\\C[1]${debugMessage} (ID: ${commonEventId})\\C[0]`);
            }
        }
    };
    
    // Add custom input handler for F7
    Input.keyMapper[F7_KEY] = 'debug_f7';
    
    // Alternative method: Direct key listening
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input_onKeyDown.call(this, event);
        
        // Handle F7 key directly
        if (event.keyCode === F7_KEY) {
            event.preventDefault();
            this._currentState['debug_f7'] = true;
        }
    };
    
    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        _Input_onKeyUp.call(this, event);
        
        // Handle F7 key release
        if (event.keyCode === F7_KEY) {
            event.preventDefault();
            this._currentState['debug_f7'] = false;
        }
    };
    
    // Console command for manual execution (useful for additional debugging)
    window.executeDebugCommonEvent = function(eventId = null) {
        const id = eventId || commonEventId;
        if ($dataCommonEvents[id]) {
            $gameTemp.reserveCommonEvent(id);
            console.log(`Manually executed Common Event ${id}`);
        } else {
            console.error(`Common Event ${id} does not exist!`);
        }
    };
    
    // Plugin command support (for MZ plugin commands)
    PluginManager.registerCommand(pluginName, "executeCommonEvent", args => {
        const eventId = Number(args.eventId) || commonEventId;
        if ($dataCommonEvents[eventId]) {
            $gameTemp.reserveCommonEvent(eventId);
            if (showMessage) {
                $gameMessage.add(`\\C[1]Plugin Command: Common Event ${eventId} Executed\\C[0]`);
            }
        }
    });
    
    
})();