//=============================================================================
// VisualNovelBustSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Visual Novel Bust System v1.3.0 (Auto & Manual Busts + Batch Dialogue + Character Names)
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.3.0
 * @description v1.3.0 Visual novel-style bust display system for dialogue and manual triggers, with batch dialogue mode and character name display.
 * @url
 * @help VisualNovelBustSystem.js
 *
 * Automatically loads character busts based on the active event sprite,
 * displays them during dialogue with character names, auto-hides when dialogue ends,
 * and provides manual show/hide commands.
 * 
 * @param showCharacterNames
 * @text Show Character Names
 * @desc Display character names above busts during dialogue
 * @type boolean
 * @default true
 * 
 * @param nameWindowWidth
 * @text Name Window Width
 * @desc Width of the character name window
 * @type number
 * @default 200
 * 
 * @param nameWindowHeight
 * @text Name Window Height
 * @desc Height of the character name window
 * @type number
 * @default 60
 * 
 * @command showBust
 * @text Show Character Bust
 * @desc Manually display a character bust on screen (automatically detects current event's sprite).
 *
 * @command hideBusts
 * @text Hide All Busts
 * @desc Manually hide all bust images and names.
 * 
 * @command batchDialogue
 * @text Batch Dialogue Mode
 * @desc Enable batch dialogue mode - bust stays visible until hideBusts is called.
 * 
 * @command setPartyBust
 * @text Set Party Member Bust
 * @desc Detect and assign a custom bust image from img/busts based on naming conventions.
 *
 * @arg memberIndex
 * @type number
 * @min 0
 * @max 2
 * @text Party Member Index
 * @desc Index of the party member in the party (0 = first slot, 1 = second, 2 = third).
 * 
 * @command showCustomBust
 * @text Show Custom Bust
 * @desc Display a specific bust image from the busts/All folder.
 *
 * @arg imageName
 * @type string
 * @text Image Name
 * @desc Name of the image file in busts/All folder (without extension).
 *
 * @arg characterName
 * @type string
 * @text Character Name
 * @desc Name to display for this character (optional).
 * 
 * @command playerBatchDialogue
 * @text Show Player bust
 * @desc Display a specific bust image from the busts/All folder.
 * @arg imageName
 * @type string
 * @text Image Name
 * @desc Name of the image file in busts/All folder (without extension).

 */
(function() {
    "use strict";
    
    const PLUGIN_NAME = "VisualNovelBustSystem";
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    const showCharacterNames = parameters['showCharacterNames'] === 'true';
    const nameWindowWidth = parseInt(parameters['nameWindowWidth']) || 200;
    const nameWindowHeight = parseInt(parameters['nameWindowHeight']) || 60;

    // Parameters
    const bustOpacity = 255;
    const bustWidth = 256;
    const bustHeight = 256;
    const bustYOffset = 180;
    const fadeInDuration = 12;
    const fadeOutDuration = 12;

    class CharacterNameWindow extends Window_Base {
        constructor(rect) {
            super(rect);
            this.opacity = 0;
            this._characterName = "";
            this._targetOpacity = 0;
            this._fadeSpeed = 15;
            this.hide();
        }

        setCharacterName(name) {
            this._characterName = name || "";
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if (this._characterName) {
                const textWidth = this.textWidth(this._characterName);
                const x = (this.contents.width - textWidth) / 2;
                const y = (this.contents.height - this.lineHeight()) / 2;
                this.drawText(this._characterName, x, y, textWidth, 'center');
            }
        }

        showName() {
            this.show();
            this._targetOpacity = 255;
        }

        hideName() {
            this._targetOpacity = 0;
        }

        update() {
            super.update();
            if (this.opacity !== this._targetOpacity) {
                const delta = this._targetOpacity > this.opacity ? this._fadeSpeed : -this._fadeSpeed;
                this.opacity = Math.max(0, Math.min(255, this.opacity + delta));
                if (this.opacity === 0 && this._targetOpacity === 0) {
                    this.hide();
                }
            }
        }
    }

    class BustManager {
        constructor() {
            this.characterBust = null;
            this.nameWindow = null;
            this.currentCharacterKey = null;
            this.batchDialogueMode = false;
        }

        initialize() {
            this.createBustSprites();
            if (showCharacterNames) {
                this.createNameWindow();
            }
        }

        createBustSprites() {
            this.characterBust = new Sprite();
            this.characterBust.opacity = 0;
            this.characterBust.anchor.x = 0;
            this.characterBust.anchor.y = 1;
            this.setupBustPosition(this.characterBust);
            this.characterBust._hiddenX = Graphics.width + bustWidth;
            this.characterBust._targetX = Graphics.width - bustWidth;
            this.characterBust.x = this.characterBust._hiddenX;
        }

        createNameWindow() {
            const rect = new Rectangle(
                Graphics.width - nameWindowWidth - 20,
                Graphics.height - bustYOffset - nameWindowHeight - 10,
                nameWindowWidth,
                nameWindowHeight
            );
            this.nameWindow = new CharacterNameWindow(rect);
        }

        setupBustPosition(sprite) {
            sprite.y = Graphics.height - bustYOffset;
        }

        scaleBustToFit(sprite) {
            if (!sprite.bitmap || !sprite.bitmap.width || !sprite.bitmap.height) {
                sprite.bitmap.addLoadListener(() => this.scaleBustToFit(sprite));
                return;
            }
            const scaleX = bustWidth / sprite.bitmap.width;
            const scaleY = bustHeight / sprite.bitmap.height;
            const scale = Math.min(scaleX, scaleY);
            sprite.scale.x = scale;
            sprite.scale.y = scale;
        }

        getBustImageForCharacter(characterName, characterIndex) {
            if (!characterName) return null;
            
            // Check for special character types that should use empty sprite
            if (characterName.startsWith("$") || characterName.startsWith("!") || characterName.startsWith("Objects")) {
                return "busts/Animals01/7"; // Empty sprite to avoid errors
            }
            
            const spritesheetName = characterName.split('.')[0];
            return `busts/${spritesheetName}/${characterIndex}`;
        }

        getCharacterDisplayName(eventId) {
            // Try to get character name from event name first
            if (eventId) {
                const gameEvent = $gameMap.event(eventId);
                if (gameEvent && gameEvent.event().name) {
                    return gameEvent.event().name;
                }
            }

            // Fallback to character info
            const charInfo = this.getCurrentEventCharacterInfo();
            if (charInfo && charInfo.characterName) {
                // Convert filename to readable name
                const spritesheetName = charInfo.characterName.split('.')[0];
                return spritesheetName.replace(/_/g, ' ');
            }

            return "";
        }

        getCurrentEventCharacterInfo() {
            const interpreter = $gameMap._interpreter;
            if (!interpreter || !interpreter._eventId) return null;
            const gameEvent = $gameMap.event(interpreter._eventId);
            if (!gameEvent) return null;
            const page = gameEvent.event().pages.find(p => gameEvent.meetsConditions(p));
            if (!page || !page.image || !page.image.characterName) return null;
            return {
                characterName: page.image.characterName,
                characterIndex: page.image.characterIndex,
                eventId: interpreter._eventId
            };
        }

        showCustomBust(imageName, characterName = null) {
            if (!imageName) {
                console.warn("No image name provided for custom bust");
                return;
            }
            
            const path = `busts/All/${imageName}`;
            const key = `custom_${imageName}`;
            
            // Only skip if we already have the same custom image displayed
            if (this.currentCharacterKey === key && this.characterBust.parent) return;
            
            try {
                this.characterBust.bitmap = ImageManager.loadBitmap('img/', path);
                this.scaleBustToFit(this.characterBust);
                this.currentCharacterKey = key;
                const scene = SceneManager._scene;
                if (!this.characterBust.parent && scene) scene.addChild(this.characterBust);
                
                // Show character name
                if (showCharacterNames && this.nameWindow) {
                    const displayName = characterName || imageName.replace(/_/g, ' ');
                    this.nameWindow.setCharacterName(displayName);
                    if (!this.nameWindow.parent && scene) scene.addChild(this.nameWindow);
                    this.nameWindow.showName();
                }
                
                this.slideIn();
            } catch(err) {
                console.warn("Failed to load custom bust image:", path, err);
            }
        }

        showBusts() {
            const charInfo = this.getCurrentEventCharacterInfo();
            console.log("## charInfo", charInfo);
            
            if (!charInfo) return;
            
            const { characterName, characterIndex, eventId } = charInfo;
            const key = `${characterName}_${characterIndex}`;
            
            // Only skip if we already have the same character displayed
            if (this.currentCharacterKey === key && this.characterBust.parent) return;
            
            const path = this.getBustImageForCharacter(characterName, characterIndex);
            if (path) {
                try {
                    this.characterBust.bitmap = ImageManager.loadBitmap('img/', path);
                    this.scaleBustToFit(this.characterBust);
                    this.currentCharacterKey = key;
                    const scene = SceneManager._scene;
                    if (!this.characterBust.parent && scene) scene.addChild(this.characterBust);
                    
                    // Show character name
                    if (showCharacterNames && this.nameWindow) {
                        const displayName = this.getCharacterDisplayName(eventId);
                        this.nameWindow.setCharacterName(displayName);
                        if (!this.nameWindow.parent && scene) scene.addChild(this.nameWindow);
                        this.nameWindow.showName();
                    }
                    
                    this.slideIn();
                } catch(err) {
                    console.warn("Failed to load bust image:", path, err);
                }
            }
        }

        hideBusts() {
            if (this.characterBust.parent) this.slideOut();
            
            // Hide name window
            if (showCharacterNames && this.nameWindow) {
                this.nameWindow.hideName();
            }
            
            this.currentCharacterKey = null;
            this.batchDialogueMode = false; // Reset batch dialogue mode when hiding
        }

        // New method to enable batch dialogue mode
        enableBatchDialogue() {
            this.batchDialogueMode = true;
            this.showBusts(); // Show the bust when batch dialogue starts
        }

        // Modified method to check if we should auto-hide
        shouldAutoHide() {
            return !this.batchDialogueMode;
        }

        slideIn() {
            this.characterBust._slideTarget = this.characterBust._targetX;
            this.characterBust._slideDuration = fadeInDuration;
            this.characterBust._slideType = 'in';
        }

        slideOut() {
            this.characterBust._slideTarget = this.characterBust._hiddenX;
            this.characterBust._slideDuration = fadeOutDuration;
            this.characterBust._slideType = 'out';
        }

        update() {
            const s = this.characterBust;
            if (s._slideDuration > 0) {
                const delta = (s._slideTarget - s.x) / s._slideDuration;
                s.x += delta;
                s._slideDuration -= 1;
                s.opacity = s._slideType === 'in'
                    ? bustOpacity * (1 - s._slideDuration / fadeInDuration)
                    : bustOpacity * (s._slideDuration / fadeOutDuration);
            } else if (s._slideType === 'out' && s.parent) {
                s.parent.removeChild(s);
                s.opacity = 0;
            }

            // Update name window
            if (this.nameWindow) {
                this.nameWindow.update();
            }
        }
    }

    // Scene setup
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        this._bustManager = new BustManager();
        this._bustManager.initialize();
    };

    // Map update
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (this._bustManager) this._bustManager.update();
    };

    // Auto-show on message start
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _Window_Message_startMessage.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.showBusts();
    };

    // Modified auto-hide on message end - now checks if we should auto-hide
    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        const scene = SceneManager._scene;
        if (scene && scene._bustManager && scene._bustManager.shouldAutoHide()) {
            scene._bustManager.hideBusts();
        }
    };

    // Manual commands
    PluginManager.registerCommand(PLUGIN_NAME, "showBust", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.showBusts();
    });
    
    PluginManager.registerCommand(PLUGIN_NAME, "hideBusts", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) scene._bustManager.hideBusts();
    });

    // New batch dialogue command
    PluginManager.registerCommand(PLUGIN_NAME, "batchDialogue", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            scene._bustManager.enableBatchDialogue();
        }
    });

    // New player batch dialogue command
    PluginManager.registerCommand(PLUGIN_NAME, "playerBatchDialogue", () => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            //scene._bustManager.enablePlayerBatchDialogue();
        }
    });

    // Show custom bust command
    PluginManager.registerCommand(PLUGIN_NAME, "showCustomBust", (args) => {
        const scene = SceneManager._scene;
        if (scene && scene._bustManager) {
            scene._bustManager.showCustomBust(args.imageName, args.characterName);
        }
    });
    
})();