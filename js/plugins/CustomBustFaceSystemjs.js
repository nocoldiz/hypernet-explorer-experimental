/*:
 * @target MZ
 * @plugindesc Custom Bust Face System v1.0.1
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @version 1.0.1
 * @description v1.0.1 Replaces default face system with custom bust images
 * 
 * @help CustomBustFaceSystem.js
 * 
 * This plugin replaces the default RPG Maker face system with a custom
 * bust system that uses character spritesheet information.
 * 
 * Face images should be placed in: /img/busts/{spritesheetname}/{0-7}.png
 * Each bust image should be 64x64 pixels.
 * 
 * The system automatically uses the character's spritesheet filename
 * and sprite index (0-7) to determine which bust image to display.
 * 
 * If the specific bust image is not found, it will use img/busts/Animals01/7.png
 * as a fallback to prevent errors or blank displays.
 * 
 * No plugin parameters required.
 * 
 * License: Free for commercial and non-commercial use.
 */

(() => {
    'use strict';
    
    // Define fallback image path
    const FALLBACK_BUST_PATH = 'img/busts/Animals01/7';
    
    // Store original methods
    const _Window_Base_drawActorFace = Window_Base.prototype.drawActorFace;
    const _Window_StatusBase_drawActorFace = Window_StatusBase.prototype.drawActorFace;
    
    // Helper function to get bust image path
    function getBustImagePath(actor) {
        if (!actor._characterName || actor._characterName === '') {
            return FALLBACK_BUST_PATH;
        }
        
        const spritesheetName = actor._characterName;
        const spriteIndex = actor._characterIndex || 0;
        
        return `img/busts/${spritesheetName}/${spriteIndex}`;
    }
    
    // Helper function to load and draw bust image with fallback
    function drawBustImage(bitmap, actor, x, y, width, height) {
        try {
            const bustPath = getBustImagePath(actor);
            
            // Always clear the area first
            bitmap.clearRect(x, y, width, height);
            
            const bustBitmap = ImageManager.loadBitmap('', bustPath);
            
            bustBitmap.addLoadListener(() => {
                try {
                    // Check if the bitmap actually loaded successfully
                    if (bustBitmap.width > 0 && bustBitmap.height > 0 && !bustBitmap.isError()) {
                        drawBustToCanvas(bitmap, bustBitmap, x, y, width, height);
                    } else {
                        // Primary image failed to load, try fallback
                        loadFallbackImage(bitmap, x, y, width, height);
                    }
                } catch (error) {
                    console.warn('CustomBustFaceSystem: Error in load listener for', bustPath, error);
                    loadFallbackImage(bitmap, x, y, width, height);
                }
            });
            
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error loading bust image', error);
            loadFallbackImage(bitmap, x, y, width, height);
        }
        
        return true;
    }
    
    // Helper function to load fallback image
    function loadFallbackImage(bitmap, x, y, width, height) {
        try {
            const fallbackBitmap = ImageManager.loadBitmap('', FALLBACK_BUST_PATH);
            
            fallbackBitmap.addLoadListener(() => {
                try {
                    if (fallbackBitmap.width > 0 && fallbackBitmap.height > 0 && !fallbackBitmap.isError()) {
                        drawBustToCanvas(bitmap, fallbackBitmap, x, y, width, height);
                    } else {
                        console.warn('CustomBustFaceSystem: Fallback image failed to load properly:', FALLBACK_BUST_PATH);
                    }
                } catch (error) {
                    console.warn('CustomBustFaceSystem: Error in fallback load listener:', error);
                }
            });
            
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error loading fallback image:', error);
        }
    }
    
    // Helper function to draw bust image to canvas
    function drawBustToCanvas(bitmap, sourceBitmap, x, y, width, height) {
        try {
            // Disable image smoothing for pixel-perfect rendering
            const context = bitmap.context;
            const oldSmoothing = context.imageSmoothingEnabled;
            context.imageSmoothingEnabled = false;
            
            // Display at 2x scale (128x128) for crisp pixel doubling
            const drawWidth = 128;
            const drawHeight = 128;
            
            // Center the image within the specified area
            const drawX = Math.round(x + (width - drawWidth) / 2);
            const drawY = Math.round(y + (height - drawHeight) / 2);
            
            // Draw the bust image at 2x scale
            bitmap.blt(sourceBitmap, 0, 0, 64, 64, drawX, drawY, drawWidth, drawHeight);
            
            // Restore original smoothing setting
            context.imageSmoothingEnabled = oldSmoothing;
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error drawing bust to canvas:', error);
        }
    }
    
    // Override Window_Base drawActorFace method
    Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
        try {
            width = width || ImageManager.faceWidth;
            height = height || ImageManager.faceHeight;
            
            // Use our bust system with fallback support
            drawBustImage(this.contents, actor, x, y, width, height);
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error in Window_Base.drawActorFace:', error);
            // Clear the area to prevent visual glitches
            this.contents.clearRect(x, y, width, height);
        }
    };
    
    // Override Window_StatusBase drawActorFace method (for status screens)
    Window_StatusBase.prototype.drawActorFace = function(actor, x, y, width, height) {
        try {
            width = width || ImageManager.faceWidth;
            height = height || ImageManager.faceHeight;
            
            // Use our bust system with fallback support
            drawBustImage(this.contents, actor, x, y, width, height);
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error in Window_StatusBase.drawActorFace:', error);
            // Clear the area to prevent visual glitches
            this.contents.clearRect(x, y, width, height);
        }
    };
    
    // Override ImageManager.loadFace to prevent loading default faces when using busts
    const _ImageManager_loadFace = ImageManager.loadFace;
    ImageManager.loadFace = function(filename) {
        // Check if we're trying to load a face for an actor that should use busts
        // This is a bit tricky since we don't have direct actor context here
        // We'll let the original method handle it and rely on our drawActorFace overrides
        return _ImageManager_loadFace.call(this, filename);
    };
    
    // Helper method to preload bust images (optional, for performance)
    function preloadBustImages() {
        try {
            // Preload fallback image first
            ImageManager.loadBitmap('', FALLBACK_BUST_PATH);
            
            if ($dataActors) {
                $dataActors.forEach(actor => {
                    try {
                        if (actor && actor.characterName) {
                            for (let i = 0; i < 8; i++) {
                                const path = `img/busts/${actor.characterName}/${i}`;
                                ImageManager.loadBitmap('', path);
                            }
                        }
                    } catch (error) {
                        console.warn('CustomBustFaceSystem: Error preloading bust for actor:', actor, error);
                    }
                });
            }
        } catch (error) {
            console.warn('CustomBustFaceSystem: Error in preloadBustImages:', error);
        }
    }
    
    // Preload bust images when the game starts
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        preloadBustImages();
    };
    
    // Handle actor setup to ensure character name and index are properly set
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        
        // Ensure we have the character information from the database
        const actor = $dataActors[actorId];
        if (actor) {
            this._characterName = actor.characterName;
            this._characterIndex = actor.characterIndex;
        }
    };
    
    // Handle character graphic changes
    const _Game_Actor_setCharacterImage = Game_Actor.prototype.setCharacterImage;
    Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
        _Game_Actor_setCharacterImage.call(this, characterName, characterIndex);
        
        // Update our stored values
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    };
    
})();