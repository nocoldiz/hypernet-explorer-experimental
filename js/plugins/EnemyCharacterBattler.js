/*:
 * @target MZ
 * @plugindesc v1.4.0 Uses character images for enemies with spritesheet animation, positioned at top
 * @author Claude
 *
 * @help
 * This plugin allows enemies to use character images as their battler sprites
 * when their battler image is set to None or when the "Painted enemies" 
 * option is enabled in the game options.
 * 
 * To use this plugin, add a note tag to your enemy in this format:
 * <Char:$CharacterName>
 * 
 * Example:
 * <Char:$IllustriousQueen>
 * 
 * When the enemy's battler image is set to None or the option is enabled, 
 * the plugin will use the character image from 
 * \img\pictures\sprites\$CharacterName.png (including the dollar sign in the filename)
 * 
 * The plugin assumes a 144x192 spritesheet and will animate the first 3 frames
 * of the first row with a slow looping animation. The sprite is scaled 4x larger
 * and positioned 100 pixels from the top of the screen.
 * 
 * Option "Painted enemies": 
 * - false (default): Use regular battler images
 * - true: Use pixel character sprites ($CharacterName.png)
 * 
 * ============================================================================
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 * Credit is appreciated but not required.
 * ============================================================================
 */

(() => {
    const pluginName = "EnemyCharacterBattler";
    
    // Animation constants
    const FRAME_WIDTH = 48;  // 144 / 3 = 48 (assuming 3 columns)
    const FRAME_HEIGHT = 48; // 192 / 4 = 48 (assuming 4 rows)
    const MAX_FRAMES = 3;    // Using first 3 frames
    const ANIMATION_SPEED = 30; // Frames between animations (increased from 15 to 30 for slower animation)
    const SPRITE_SCALE = 4;  // Scale the sprite 4x larger
    const POSITION_Y = 260;  // Position 100px from the top
    
    // Option configuration
    const CHARACTER_SPRITE_OPTION_NAME = "Pixel enemies";
    
    // Helper to get character name from enemy notes
    function getCharacterName(enemy) {
        if (!enemy || !enemy.note) return null;
       
        const noteData = enemy.note;
        const match = /<Char:(\$[^>]+)>/i.exec(noteData);
        return match ? match[1] : null;
    }
    
    // Add option to Options menu
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(CHARACTER_SPRITE_OPTION_NAME, "characterSpriteOption");
    };
    
    // Add getter and setter for the option
    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.characterSpriteOption = this.characterSpriteOption;
        return config;
    };
    
    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.characterSpriteOption = this.readFlag(config, "characterSpriteOption", false); // Default to false
    };
    
    // Function to check if character sprites are enabled
    function isCharacterSpritesEnabled() {
        return ConfigManager.characterSpriteOption === true; // Use character sprites when option is true
    }
    
    // Override enemy battlerName function to intercept when it's empty
    const _Game_Enemy_battlerName = Game_Enemy.prototype.battlerName;
    Game_Enemy.prototype.battlerName = function() {
        const originalName = _Game_Enemy_battlerName.call(this);
        if (originalName === '' || (isCharacterSpritesEnabled() && getCharacterName(this.enemy()))) {
            // Store the character name directly on the enemy object for later use
            if (!this._characterBattlerName) {
                this._characterBattlerName = getCharacterName(this.enemy());
            }
            return this._characterBattlerName ? "__CHARACTER__" : '';
        }
        return originalName;
    };
    
    // Override loadBitmap method of Sprite_Enemy
    const _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function(name) {
        if (name === "__CHARACTER__") {
            // Get the character name from the enemy
            const characterName = this._enemy._characterBattlerName;
            if (characterName) {
                this._characterBattler = true;
                this._animationFrame = 0;
                this._animationCount = 0;
                // Use loadPicture and keep the $ in the filename
                this.bitmap = ImageManager.loadPicture("sprites/" + characterName);
                
                // Center the anchor point for proper positioning
                this.anchor.x = 0.5;
                this.anchor.y = 0.5;
                
                // Apply scale immediately
                this.scale.x = SPRITE_SCALE;
                this.scale.y = SPRITE_SCALE;
                
                return;
            }
        }
        
        this._characterBattler = false;
        _Sprite_Enemy_loadBitmap.call(this, name);
    };
    
    // Override updateFrame to handle character image animation
    const _Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
    Sprite_Enemy.prototype.updateFrame = function() {
        if (this._characterBattler) {
            if (this.bitmap && this.bitmap.isReady()) {
                // Calculate frame position (first row, columns 0-2)
                const frameX = this._animationFrame * FRAME_WIDTH;
                const frameY = 0; // First row
                
                // Set the frame
                this.setFrame(frameX, frameY, FRAME_WIDTH, FRAME_HEIGHT);
            }
        } else {
            _Sprite_Enemy_updateFrame.call(this);
        }
    };
    
    // Override update to handle animation and maintain position
    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        if (this._characterBattler) {
            this.updateCharacterAnimation();
            // Ensure position is maintained during updates
            this.maintainPosition();
        }
    };
    
    // New method to maintain character position
    Sprite_Enemy.prototype.maintainPosition = function() {
        if (this._characterBattler) {
            // Force Y position to always be at the specified value
            this.y = POSITION_Y;
        }
    };
    
    // New method to update character animation
    Sprite_Enemy.prototype.updateCharacterAnimation = function() {
        if (!this.bitmap || !this.bitmap.isReady()) return;
        
        // Update animation count
        this._animationCount++;
        
        // Change animation frame when count reaches threshold
        if (this._animationCount >= ANIMATION_SPEED) {
            this._animationCount = 0;
            this._animationFrame = (this._animationFrame + 1) % MAX_FRAMES;
            
            // Calculate frame position (first row, columns 0-2)
            const frameX = this._animationFrame * FRAME_WIDTH;
            const frameY = 0; // First row
            
            // Set the frame
            this.setFrame(frameX, frameY, FRAME_WIDTH, FRAME_HEIGHT);
        }
    };
    
    // Fix position for character images - completely override original method
    Sprite_Enemy.prototype.setHome = function(x, y) {
        if (this._characterBattler) {
            // For character battlers, keep X position but set Y to our fixed position
            this._homeX = x;
            this._homeY = POSITION_Y;
            this.updatePosition();
        } else {
            // Original behavior for normal battlers
            this._homeX = x;
            this._homeY = y;
            this.updatePosition();
        }
    };
    
    // Override updatePosition to ensure our Y position is maintained
    const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;
    Sprite_Enemy.prototype.updatePosition = function() {
        _Sprite_Enemy_updatePosition.call(this);
        if (this._characterBattler) {
            // Force Y position to always be at the specified value
            this.y = POSITION_Y;
        }
    };
    
    // Override initMembers to set properties for character battlers
    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._characterBattler = false;
        this._animationFrame = 0;
        this._animationCount = 0;
    };
    
    // Override visibility initialization
    const _Sprite_Enemy_initVisibility = Sprite_Enemy.prototype.initVisibility;
    Sprite_Enemy.prototype.initVisibility = function() {
        _Sprite_Enemy_initVisibility.call(this);
        
        // Additional setup for character battlers
        if (this._characterBattler) {
            // Set the anchor point (center of sprite)
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            
            // Apply scaling
            this.scale.x = SPRITE_SCALE;
            this.scale.y = SPRITE_SCALE;
            
            // Set Y position
            this.y = POSITION_Y;
        }
    };
    
    // Additional override for any movement or effects
    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if (this._characterBattler) {
            // Immediately set position after battler is set
            this.y = POSITION_Y;
        }
    };
})();