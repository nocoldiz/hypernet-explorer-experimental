/*:
 * @target MZ
 * @plugindesc Dynamic Lighting System v1.0.0
 * @author YourName
 * @help
 * ============================================================================
 * Dynamic Lighting Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin adds dynamic lighting effects to your game.
 * 
 * Event Note Tags:
 * - Light: Creates a basic white light with radius 100
 * - Light-[radius]: Creates a light with specified radius (e.g., Light-300)
 * - Light-[radius]-[color]: Creates a colored light (e.g., Light-200-blue)
 * - Streetlight-[radius]-[color]: Creates conditional light (variable 23 > 17)
 * - Flashlight-[radius]-[color]: Creates directional cone light
 * 
 * Supported colors: white, red, green, blue, yellow, orange, purple, cyan
 * 
 * @command addLight
 * @text Add Light to Player
 * @desc Adds a circular light to the player
 * 
 * @arg radius
 * @type number
 * @min 50
 * @max 500
 * @default 150
 * @text Light Radius
 * @desc The radius of the light in pixels
 * 
 * @arg color
 * @type select
 * @option white
 * @option red
 * @option green
 * @option blue
 * @option yellow
 * @option orange
 * @option purple
 * @option cyan
 * @default white
 * @text Light Color
 * @desc The color of the light
 * 
 * @command addFlashlight
 * @text Add Flashlight to Player
 * @desc Adds a directional flashlight to the player
 * 
 * @arg radius
 * @type number
 * @min 100
 * @max 600
 * @default 300
 * @text Flashlight Range
 * @desc The range of the flashlight in pixels
 * 
 * @arg color
 * @type select
 * @option white
 * @option yellow
 * @default white
 * @text Flashlight Color
 * @desc The color of the flashlight
 * 
 * @command removeLight
 * @text Remove Light from Player
 * @desc Removes all lights from the player
 */

(() => {
    'use strict';
    
    const pluginName = 'DynamicLighting';
    
    // Color definitions
    const COLORS = {
        white: 'rgba(255, 255, 255, 0.8)',
        red: 'rgba(255, 100, 100, 0.8)',
        green: 'rgba(100, 255, 100, 0.8)',
        blue: 'rgba(100, 150, 255, 0.8)',
        yellow: 'rgba(255, 255, 100, 0.8)',
        orange: 'rgba(255, 180, 100, 0.8)',
        purple: 'rgba(200, 100, 255, 0.8)',
        cyan: 'rgba(100, 255, 255, 0.8)'
    };
    
    // Plugin command registration
    PluginManager.registerCommand(pluginName, 'addLight', args => {
        const radius = Number(args.radius) || 150;
        const color = args.color || 'white';
        $gamePlayer._lightRadius = radius;
        $gamePlayer._lightColor = color;
        $gamePlayer._hasFlashlight = false;
        if (SceneManager._scene._lightingLayer) {
            SceneManager._scene._lightingLayer.refresh();
        }
    });
    
    PluginManager.registerCommand(pluginName, 'addFlashlight', args => {
        const radius = Number(args.radius) || 300;
        const color = args.color || 'white';
        $gamePlayer._lightRadius = radius;
        $gamePlayer._lightColor = color;
        $gamePlayer._hasFlashlight = true;
        if (SceneManager._scene._lightingLayer) {
            SceneManager._scene._lightingLayer.refresh();
        }
    });
    
    PluginManager.registerCommand(pluginName, 'removeLight', () => {
        $gamePlayer._lightRadius = 0;
        $gamePlayer._lightColor = null;
        $gamePlayer._hasFlashlight = false;
        if (SceneManager._scene._lightingLayer) {
            SceneManager._scene._lightingLayer.refresh();
        }
    });
    
    // Lighting Layer Class
    class Sprite_LightingLayer extends PIXI.Container {
        constructor() {
            super();
            this.initialize();
        }
        
        initialize() {
            this._lightSprites = [];
            this._ambientLight = 0.3; // Ambient light level (0 = dark, 1 = bright)
            this.createDarkness();
            this.refresh();
        }
        
        createDarkness() {
            this._darkness = new PIXI.Graphics();
            this.addChild(this._darkness);
            
            this._lightContainer = new PIXI.Container();
            this._lightContainer.blendMode = PIXI.BLEND_MODES.ADD;
            this.addChild(this._lightContainer);
        }
        
        refresh() {
            this._lightSprites.forEach(sprite => {
                this._lightContainer.removeChild(sprite);
            });
            this._lightSprites = [];
            this.createLights();
        }
        
        createLights() {
            // Create lights for events
            $gameMap.events().forEach(event => {
                const lightData = this.parseLightNote(event.event().note);
                if (lightData) {
                    if (lightData.type === 'streetlight') {
                        // Check if variable 23 > 17
                        if ($gameVariables.value(23) > 17) {
                            this.createEventLight(event, lightData);
                        }
                    } else {
                        this.createEventLight(event, lightData);
                    }
                }
            });
            
            // Create light for player
            if ($gamePlayer._lightRadius && $gamePlayer._lightRadius > 0) {
                const lightData = {
                    type: $gamePlayer._hasFlashlight ? 'flashlight' : 'light',
                    radius: $gamePlayer._lightRadius,
                    color: $gamePlayer._lightColor || 'white'
                };
                this.createPlayerLight(lightData);
            }
        }
        
        parseLightNote(note) {
            const lines = note.split(/[\r\n]+/);
            for (const line of lines) {
                // Match patterns: Light, Light-300, Light-200-blue, Streetlight-300-yellow, Flashlight-400-white
                const match = line.match(/^(Light|Streetlight|Flashlight)(?:-(\d+))?(?:-(\w+))?$/i);
                if (match) {
                    return {
                        type: match[1].toLowerCase(),
                        radius: parseInt(match[2]) || 100,
                        color: match[3] || 'white'
                    };
                }
            }
            return null;
        }
        
        createEventLight(event, lightData) {
            let sprite;
            if (lightData.type === 'flashlight') {
                sprite = this.createFlashlight(lightData.radius, lightData.color);
            } else {
                sprite = this.createCircularLight(lightData.radius, lightData.color);
            }
            
            sprite._event = event;
            sprite._lightType = lightData.type;
            this._lightContainer.addChild(sprite);
            this._lightSprites.push(sprite);
        }
        
        createPlayerLight(lightData) {
            let sprite;
            if (lightData.type === 'flashlight') {
                sprite = this.createFlashlight(lightData.radius, lightData.color);
            } else {
                sprite = this.createCircularLight(lightData.radius, lightData.color);
            }
            
            sprite._isPlayerLight = true;
            sprite._lightType = lightData.type;
            this._lightContainer.addChild(sprite);
            this._lightSprites.push(sprite);
        }
        
        createCircularLight(radius, colorName) {
            const sprite = new PIXI.Graphics();
            const color = COLORS[colorName] || COLORS.white;
            
            // Create gradient effect
            const canvas = document.createElement('canvas');
            canvas.width = radius * 2;
            canvas.height = radius * 2;
            const ctx = canvas.getContext('2d');
            
            const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color.replace('0.8', '0.4'));
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const texture = PIXI.Texture.from(canvas);
            const lightSprite = new PIXI.Sprite(texture);
            lightSprite.anchor.set(0.5);
            lightSprite.blendMode = PIXI.BLEND_MODES.ADD;
            
            return lightSprite;
        }
        
        createFlashlight(radius, colorName) {
            const sprite = new PIXI.Graphics();
            const color = COLORS[colorName] || COLORS.white;
            
            // Create cone-shaped flashlight
            const canvas = document.createElement('canvas');
            canvas.width = radius * 2;
            canvas.height = radius * 2;
            const ctx = canvas.getContext('2d');
            
            ctx.translate(radius, radius);
            
            // Create cone gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.7, color.replace('0.8', '0.4'));
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            // Draw cone shape (60 degree spread)
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, -Math.PI/6, Math.PI/6);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();
            
            const texture = PIXI.Texture.from(canvas);
            const lightSprite = new PIXI.Sprite(texture);
            lightSprite.anchor.set(0.5);
            lightSprite.blendMode = PIXI.BLEND_MODES.ADD;
            
            return lightSprite;
        }
        
        update() {
            this.updateDarkness();
            this.updateLights();
        }
        
        updateDarkness() {
            const width = Graphics.width;
            const height = Graphics.height;
            
            this._darkness.clear();
            this._darkness.beginFill(0x000000, 1 - this._ambientLight);
            this._darkness.drawRect(0, 0, width, height);
            this._darkness.endFill();
        }
        
        updateLights() {
            this._lightSprites.forEach(sprite => {
                if (sprite._isPlayerLight) {
                    // Update player light position
                    const player = $gamePlayer;
                    sprite.x = player.screenX();
                    sprite.y = player.screenY() - 24;
                    
                    // Update flashlight rotation
                    if (sprite._lightType === 'flashlight') {
                        sprite.rotation = this.getDirectionAngle(player.direction());
                    }
                } else if (sprite._event) {
                    // Update event light position
                    sprite.x = sprite._event.screenX();
                    sprite.y = sprite._event.screenY() - 24;
                    
                    // Update flashlight rotation for events
                    if (sprite._lightType === 'flashlight') {
                        sprite.rotation = this.getDirectionAngle(sprite._event.direction());
                    }
                }
            });
        }
        
        getDirectionAngle(direction) {
            switch (direction) {
                case 2: return Math.PI / 2;    // Down
                case 4: return Math.PI;         // Left
                case 6: return 0;               // Right
                case 8: return -Math.PI / 2;    // Up
                default: return 0;
            }
        }
    }
    
    // Scene_Map modifications
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        this.createLightingLayer();
    };
    
    Scene_Map.prototype.createLightingLayer = function() {
        this._lightingLayer = new Sprite_LightingLayer();
        // Add lighting layer above tilemap but below weather
        const index = this.children.indexOf(this._spriteset) + 1;
        this.addChildAt(this._lightingLayer, index);
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (this._lightingLayer) {
            this._lightingLayer.update();
        }
    };
    
    // Initialize player light properties
    const _Game_Player_initialize = Game_Player.prototype.initialize;
    Game_Player.prototype.initialize = function() {
        _Game_Player_initialize.call(this);
        this._lightRadius = 0;
        this._lightColor = null;
        this._hasFlashlight = false;
    };
})();