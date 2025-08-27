/*:
 * @target MZ
 * @plugindesc [v2.4] Grid-based character sprite selector with improved UI, sprite management, random selection, and bust display.
 * @author ChatGPT (Modified by Claude)
 *
 * @param SpriteSheets
 * @text Sprite Sheets
 * @desc List of character sprite filenames (e.g. Actor3, !GateRMColor, Evil01).
 * @type text[]
 * @default ["Actor1","Actor2","Actor3"]
 *
 * @param SpriteSheetCutoffs
 * @text Sprite Sheet Cutoffs
 * @desc List of cutoff indices for each spritesheet. Sprites beyond this index are ignored (0 = only first sprite).
 * @type number[]
 * @default []
 * 
 * @param GridColumns
 * @text Grid Columns
 * @desc Number of columns to display in the sprite selection grid.
 * @type number
 * @min 1
 * @max 10
 * @default 4
 *
 * @param GridRows
 * @text Grid Rows
 * @desc Maximum number of rows to display per page in the sprite selection grid.
 * @type number
 * @min 1
 * @max 8
 * @default 4
 *
 * @command OpenSpriteSelector
 * @text Open Sprite Selector
 * @desc Opens the grid-based sprite selection UI to pick a sprite for Actor #1.
 *
 * @command OpenSpriteSelectorForActor
 * @text Open Sprite Selector For Actor
 * @desc Opens the sprite selection UI for a specific actor.
 * 
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to change the sprite for.
 * @type number
 * @min 1
 * @default 1
 *
 * @command SelectRandomSprite
 * @text Select Random Sprite
 * @desc Randomly selects a sprite for a specific actor without opening the UI.
 *
 * @arg actorId
 * @text Actor ID
 * @desc The ID of the actor to change the sprite for.
 * @type number
 * @min 1
 * @default 1
 */

(() => {
    const pluginName = "CharacterSpriteGridSelector";
    const params = PluginManager.parameters(pluginName);
    const spriteSheets = JSON.parse(params["SpriteSheets"] || "[]");
    const spriteSheetCutoffs = JSON.parse(params["SpriteSheetCutoffs"] || "[]").map(Number);
    const gridColumns = Number(params["GridColumns"] || 4);
    const gridRows = Number(params["GridRows"] || 4);

    // Build a comprehensive list of all sprite options (file + index) considering cutoffs
    const spriteOptions = [];
    const indexToLetter = index => {
        // Convert 0 -> A, 1 -> B, ... 25 -> Z, 26 -> AA, etc.
        let letters = "";
        let i = index;
        do {
            letters = String.fromCharCode(65 + (i % 26)) + letters;
            i = Math.floor(i / 26) - 1;
        } while (i >= 0);
        return letters;
    };
    
    for (let i = 0; i < spriteSheets.length; i++) {
        const name = spriteSheets[i];
        // Determine cutoff index for this sheet (use provided or default based on sheet type)
        let cutoffIndex = spriteSheetCutoffs[i];
        if (isNaN(cutoffIndex)) {
            // No cutoff given: default to 0 for single ($) sheets, or 7 for standard sheets (8 sprites)
            cutoffIndex = name.includes("$") ? 0 : 7;
        } else {
            // If cutoff provided, clamp it within valid range
            if (name.includes("$")) {
                cutoffIndex = 0; // single-character sheet can only have index 0
            } else if (cutoffIndex > 7) {
                cutoffIndex = 7; // multi-character sheets have at most indices 0-7
            }
        }
        
        // Add each sprite (up to cutoff index) as a separate option
        for (let index = 0; index <= cutoffIndex; index++) {
            spriteOptions.push({ name: name, index: index });
        }
    }

    // Function to load bust image
// Function to load bust image with fallback
function loadBustImage(characterName, characterIndex) {
    const bustPath = `img/busts/${characterName}/${characterIndex}.png`;
    const fallbackPath = `img/busts/Animals01/7.png`;
    const bitmap = new Bitmap();
    
    try {
        bitmap._url = bustPath;
        bitmap._loadingState = 'loading';
        
        const image = new Image();
        image.onload = () => {
            try {
                bitmap._image = image;
                bitmap._loadingState = 'loaded';
                bitmap._onLoad();
            } catch (error) {
                console.warn(`Error setting loaded bust image for ${characterName}/${characterIndex}:`, error);
                loadFallbackBust(bitmap, fallbackPath);
            }
        };
        image.onerror = () => {
            console.warn(`Bust image not found: ${bustPath}, loading fallback`);
            loadFallbackBust(bitmap, fallbackPath);
        };
        image.src = bustPath;
    } catch (error) {
        console.warn(`Error loading bust image for ${characterName}/${characterIndex}:`, error);
        loadFallbackBust(bitmap, fallbackPath);
    }
    
    return bitmap;
}

function loadFallbackBust(bitmap, fallbackPath) {
    try {
        bitmap._url = fallbackPath;
        bitmap._loadingState = 'loading';
        
        const fallbackImage = new Image();
        fallbackImage.onload = () => {
            try {
                bitmap._image = fallbackImage;
                bitmap._loadingState = 'loaded';
                bitmap._onLoad();
            } catch (error) {
                console.error(`Error setting fallback bust image:`, error);
                bitmap._loadingState = 'error';
            }
        };
        fallbackImage.onerror = () => {
            console.error(`Fallback bust image not found: ${fallbackPath}`);
            bitmap._loadingState = 'error';
        };
        fallbackImage.src = fallbackPath;
    } catch (error) {
        console.error(`Error loading fallback bust image:`, error);
        bitmap._loadingState = 'error';
    }
}

    // Function to select a random sprite from available options
    function selectRandomSprite(actorId) {
        // Get random index from available sprites
        const randomIndex = Math.floor(Math.random() * spriteOptions.length);
        const randomSprite = spriteOptions[randomIndex];
        
        // Apply the randomly selected sprite to the specified actor
        const actor = $gameActors.actor(actorId);
        actor.setCharacterImage(randomSprite.name, randomSprite.index);
        
        // Refresh player if this is the party leader
        if (actorId === $gameParty.leader().actorId()) {
            $gamePlayer.refresh();
        }
        
        return randomSprite;
    }

    // Scene to handle sprite grid selection
    class Scene_SpriteGridSelector extends Scene_MenuBase {
        constructor() {
            super();
            this._actorId = 1; // Default to Actor 1
        }
        
        // Add a method to set the actor ID
        setActor(actorId) {
            this._actorId = actorId;
        }
        
        create() {
            super.create();
            this.createHelpWindow();
            this.createGridWindow();
            this.preloadSprites();
        }

        createHelpWindow() {
            const rect = this.helpWindowRect();
            this._helpWindow = new Window_Help(rect);
            if(ConfigManager.language === 'it' ){
                this._helpWindow.setText("Scegli pure il personaggio");

            }else{
                this._helpWindow.setText("Select a character sprite.");

            }
            this.addWindow(this._helpWindow);
        }

        helpWindowRect() {
            const wx = 0;
            const wy = 0;
            const ww = Graphics.boxWidth;
            const wh = this.calcWindowHeight(1, false);
            return new Rectangle(wx, wy, ww, wh);
        }

        createGridWindow() {
            const rect = this.gridWindowRect();
            this._gridWindow = new Window_SpriteGrid(rect);
            this._gridWindow.setHandler('ok', this.onSpriteSelected.bind(this));
            this._gridWindow.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._gridWindow);
            this._gridWindow.activate();
            this._gridWindow.select(0);
        }

        gridWindowRect() {
            const wx = 0;
            const wy = this._helpWindow.height;
            const ww = Graphics.boxWidth;
            const wh = Graphics.boxHeight - wy;
            return new Rectangle(wx, wy, ww, wh);
        }

        // Preload all character images to ensure they are available
        preloadSprites() {
            const uniqueSheets = [...new Set(spriteSheets)];
            uniqueSheets.forEach(filename => {
                ImageManager.loadCharacter(filename);
            });
        }

        onSpriteSelected() {
            const index = this._gridWindow.index();
            if (index >= 0 && index < spriteOptions.length) {
                const entry = spriteOptions[index];
                const actor = $gameActors.actor(this._actorId);
                
                // Apply the selected sprite to the specified actor
                actor.setCharacterImage(entry.name, entry.index);
                
                // Refresh player if this is the party leader
                if (this._actorId === $gameParty.leader().actorId()) {
                    $gamePlayer.refresh();
                }
                
                SoundManager.playOk();
                this.popScene();
            }
        }
    }

    // Window to display the sprite grid
    class Window_SpriteGrid extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this._sprites = spriteOptions;
            this._characterSprites = [];
            this._bustBitmaps = new Map(); // Cache for bust bitmaps
            this._lastAnimFrame = 0;
            this._animationCount = 0;
            this._lastSelectedIndex = -1;
            this.refresh();
        }

        maxCols() {
            return gridColumns;
        }

        maxItems() {
            return this._sprites.length;
        }

        itemWidth() {
            return Math.floor((this.innerWidth - this.colSpacing() * (this.maxCols() - 1)) / this.maxCols());
        }

        itemHeight() {
            // Increased height to accommodate both sprite and bust at 2x scale
            return 160;
        }

        spacing() {
            return 8;
        }

        colSpacing() {
            return this.spacing();
        }

        rowSpacing() {
            return this.spacing();
        }
        
        update() {
            super.update();
            
            // Check if selection changed
            if (this.index() !== this._lastSelectedIndex) {
                if (this._lastSelectedIndex >= 0) {
                    this.redrawItem(this._lastSelectedIndex);
                }
                this._lastSelectedIndex = this.index();
            }
            
            // Update animation for selected sprite only
            if (this.index() >= 0) {
                this._animationCount++;
                if (this._animationCount % 12 === 0) {
                    this.updateCharacterAnimation();
                }
            }
        }
        
        updateCharacterAnimation() {
            const index = this.index();
            if (index >= 0) {
                this.redrawItem(index);
            }
        }

        drawAllItems() {
            super.drawAllItems();
            
            // Clear any existing character sprites
            if (this._characterSprites) {
                this._characterSprites.forEach(sprite => {
                    if (sprite && sprite.parent) {
                        sprite.parent.removeChild(sprite);
                    }
                });
            }
            this._characterSprites = [];
        }

        drawItem(index) {
            if (!this._sprites[index]) return;
            
            const sprite = this._sprites[index];
            const rect = this.itemRect(index);
            
            // Draw a background for the item
            this.drawItemBackground(index);
            
            // Draw the character sprite and bust
            this.drawCharacterSprite(sprite.name, sprite.index, rect.x + rect.width / 4, rect.y + rect.height / 2, index === this.index());
            this.drawCharacterBust(sprite.name, sprite.index, rect.x + 3 * rect.width / 4, rect.y + rect.height / 2);
        }
        
        drawCharacterSprite(characterName, characterIndex, x, y, isSelected) {
            // Find the index in the sprite options array
            const spriteIndex = this._sprites.findIndex(s => s.name === characterName && s.index === characterIndex);
            
            // Get the complete item rect
            const rect = this.itemRectWithPadding(this.indexToRect(spriteIndex));
            
            // Load character bitmap
            const bitmap = ImageManager.loadCharacter(characterName);
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(() => this.redrawItem(spriteIndex));
                return;
            }
            
            // Determine character sheet type
            const big = ImageManager.isBigCharacter(characterName);
            
            // Calculate pattern (animation frame) - only animate selected sprite
            let pattern = 1; // Default to middle frame (standing)
            if (isSelected) {
                const frameCount = Graphics.frameCount || this._animationCount;
                const animFrame = Math.floor((frameCount / 12) % 4);
                // Pattern for walking: 0, 1, 2, 1
                pattern = animFrame === 3 ? 1 : animFrame;
            }
            
            // Face down (direction 2)
            const direction = 2;
            
            // Calculate dimensions and source rectangle
            const pw = bitmap.width / (big ? 3 : 12);
            const ph = bitmap.height / (big ? 4 : 8);
            
            const sx = (big ? 0 : characterIndex % 4 * 3 + pattern) * pw;
            const sy = (big ? pattern : Math.floor(characterIndex / 4) * 4 + (direction / 2 - 1)) * ph;
            
            // Use integer scaling for pixel perfect rendering
            const scale = 2; // 2x scale for crisp pixels
            const dw = Math.floor(pw * scale);
            const dh = Math.floor(ph * scale);
            
            // Use integer coordinates for pixel perfect positioning
            const dx = Math.floor(x - dw / 2);
            const dy = Math.floor(y - dh / 2);
            
            // Draw directly to the window contents with integer coordinates
            this.contents.blt(bitmap, Math.floor(sx), Math.floor(sy), Math.floor(pw), Math.floor(ph), dx, dy, dw, dh);
        }

        drawCharacterBust(characterName, characterIndex, x, y) {
            try {
                const bustKey = `${characterName}_${characterIndex}`;
                
                // Check if we already have this bust cached
                if (!this._bustBitmaps.has(bustKey)) {
                    const bustBitmap = loadBustImage(characterName, characterIndex);
                    this._bustBitmaps.set(bustKey, bustBitmap);
                    
                    // Add load listener to redraw when bust is loaded
                    bustBitmap.addLoadListener(() => {
                        try {
                            const spriteIndex = this._sprites.findIndex(s => s.name === characterName && s.index === characterIndex);
                            if (spriteIndex >= 0) {
                                this.redrawItem(spriteIndex);
                            }
                        } catch (error) {
                            console.warn(`Error redrawing item after bust load for ${characterName}/${characterIndex}:`, error);
                        }
                    });
                    
                    return; // Don't draw yet, wait for load
                }
                
                const bustBitmap = this._bustBitmaps.get(bustKey);
                
                // If bust is null (failed to load), not ready, or in error state, don't draw
                if (!bustBitmap || !bustBitmap.isReady() || bustBitmap._loadingState === 'error') {
                    return;
                }
                
                // For 64x64 busts, use 2x scale for pixel perfect rendering
                const scale = 2;
                const drawWidth = 64 * scale; // 128px
                const drawHeight = 64 * scale; // 128px
                
                // Use integer coordinates for pixel perfect positioning
                const dx = Math.floor(x - drawWidth / 2);
                const dy = Math.floor(y - drawHeight / 2);
                
                // Draw the bust with integer coordinates and dimensions
                this.contents.blt(
                    bustBitmap, 
                    0, 0, 64, 64, // Source: full 64x64 bust
                    dx, dy, drawWidth, drawHeight // Destination: 128x128 (2x scale)
                );
            } catch (error) {
                console.warn(`Error drawing character bust for ${characterName}/${characterIndex}:`, error);
                // Silently fail - don't crash the game
            }
        }
        drawItemBackground(index) {
            // Do nothing - no background highlight for selected item
        }
        
        // Helper method to convert index to rect coordinates
        indexToRect(index) {
            if (index < 0) return new Rectangle(0, 0, 0, 0);
            const maxCols = this.maxCols();
            const itemWidth = this.itemWidth();
            const itemHeight = this.itemHeight();
            const colSpacing = this.colSpacing();
            const rowSpacing = this.rowSpacing();
            const col = index % maxCols;
            const row = Math.floor(index / maxCols);
            const x = col * itemWidth + col * colSpacing;
            const y = row * itemHeight + row * rowSpacing;
            return new Rectangle(x, y, itemWidth, itemHeight);
        }
        
        // Add padding to rect
        itemRectWithPadding(rect) {
            const padding = this.itemPadding();
            return new Rectangle(
                rect.x + padding,
                rect.y + padding,
                rect.width - padding * 2,
                rect.height - padding * 2
            );
        }
        
        select(index) {
            const lastIndex = this.index();
            super.select(index);
            
            if (lastIndex !== index) {
                // Force complete redraw of both the previous and new selected items
                if (lastIndex >= 0) this.redrawItem(lastIndex);
                if (index >= 0) this.redrawItem(index);
            }
        }
        
        // Override the cursor rectangle to hide the selection border
        refreshCursor() {
            // Override to hide the cursor/border completely
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    // Patch the prepareNextScene method to properly handle Scene_SpriteGridSelector
    const _SceneManager_prepareNextScene = SceneManager.prepareNextScene;
    SceneManager.prepareNextScene = function(sceneClass, ...args) {
        if (sceneClass === Scene_SpriteGridSelector) {
            // Handle sprite grid selector preparation specifically
            const [actorId] = args;
            Scene_SpriteGridSelector.prototype.setActor = function(actorId) {
                this._actorId = actorId || 1;
            };
            _SceneManager_prepareNextScene.apply(this, [sceneClass]);
            if (this._nextScene && actorId) {
                this._nextScene.setActor(actorId);
            }
        } else {
            // Handle all other scenes normally
            _SceneManager_prepareNextScene.apply(this, arguments);
        }
    };

    // Register plugin commands
    PluginManager.registerCommand(pluginName, "OpenSpriteSelector", () => {
        SceneManager.push(Scene_SpriteGridSelector);
    });
    
    PluginManager.registerCommand(pluginName, "OpenSpriteSelectorForActor", args => {
        const actorId = parseInt(args.actorId) || 1;
        SceneManager.push(Scene_SpriteGridSelector);
        if (SceneManager._nextScene) {
            SceneManager._nextScene.setActor(actorId);
        }
    });
    
    // Register the new random sprite selection command
    PluginManager.registerCommand(pluginName, "SelectRandomSprite", args => {
        const actorId = parseInt(args.actorId) || 1;
        const randomSprite = selectRandomSprite(actorId);
        
    });
})();