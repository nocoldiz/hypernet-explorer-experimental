/*:
 * @target MZ
 * @plugindesc v1.1 Enhanced parallax overlay system with scaling options.
 * @author Claude
 * @help 
 * ParallaxOverlay.js
 * 
 * This plugin creates overlays on maps using images from the img/layers folder.
 * The overlays can move with the player or stay fixed, with scrolling and scaling options.
 * 
 * === Map Notes Format ===
 * <overlay: filename>           - Basic overlay that moves with player
 * <overlay: filename, fixed>    - Fixed overlay that doesn't move with player
 * <overlay: filename, scrollX:value, scrollY:value> - Add scrolling (use values like 0.5, 1, 2)
 * <overlay: filename, opacity:value> - Set opacity (0-255)
 * <overlay: filename, z:value>  - Set z-order (higher appears on top, default is 8)
 * <overlay: filename, scale:value> - Scale uniformly (1.0 = original size, 2.0 = double size)
 * <overlay: filename, scaleX:value, scaleY:value> - Scale separately for X and Y
 * <overlay: filename, cover> - Scale to cover entire map (like CSS background-size: cover)
 * <overlay: filename, contain> - Scale to fit within map bounds (like CSS background-size: contain)
 * 
 * You can combine parameters:
 * <overlay: forest_tops, scrollX:0.5, scrollY:0.5, opacity:200, cover>
 * 
 * Multiple overlays:
 * <overlay: trees_top, cover>
 * <overlay: fog, scrollX:0.3, fixed, opacity:150>
 * 
 * === Examples ===
 * <overlay: trees_top>          - Basic overlay that moves with player
 * <overlay: buildings, fixed, cover>    - Fixed overlay scaled to cover entire map
 * <overlay: clouds, scrollX:0.5, scrollY:0.3, fixed, scale:1.5> - Scaled clouds
 * <overlay: fog, opacity:150, contain>   - Fog that fits within map bounds
 */

(function() {
    "use strict";
    
    // Custom image loader for layers folder
    function loadLayerImage(filename) {
        return ImageManager.loadBitmap('img/layers/', filename);
    }
    
    // Parse Map Notes for overlay parameters
    function parseMapNotes() {
        if (!$dataMap || !$dataMap.note) return [];
        
        const notes = $dataMap.note;
        const regex = /<overlay:\s*([^,>]+)(?:\s*,\s*([^>]*))?>/gi;
        let match;
        let overlays = [];
        
        while (match = regex.exec(notes)) {
            // Create basic overlay object
            const filename = match[1].trim();
            let overlay = {
                filename: filename,
                fixed: false,
                scrollX: 0,
                scrollY: 0,
                opacity: 255,
                z: 8,
                scaleX: 1.0,
                scaleY: 1.0,
                scalingMode: 'none' // 'none', 'cover', 'contain'
            };
            
            // Parse additional parameters if they exist
            if (match[2]) {
                const params = match[2].split(',');
                
                params.forEach(param => {
                    param = param.trim();
                    
                    // Check for special scaling modes
                    if (param === 'cover') {
                        overlay.scalingMode = 'cover';
                    } else if (param === 'contain') {
                        overlay.scalingMode = 'contain';
                    }
                    // Check for 'fixed' parameter
                    else if (param === 'fixed') {
                        overlay.fixed = true;
                    } 
                    // Check for parameters with values
                    else if (param.includes(':')) {
                        const [key, value] = param.split(':');
                        const trimmedKey = key.trim();
                        
                        switch (trimmedKey) {
                            case 'scrollX':
                                overlay.scrollX = parseFloat(value);
                                break;
                            case 'scrollY':
                                overlay.scrollY = parseFloat(value);
                                break;
                            case 'opacity':
                                overlay.opacity = parseInt(value);
                                break;
                            case 'z':
                                overlay.z = parseInt(value);
                                break;
                            case 'scale':
                                const scaleValue = parseFloat(value);
                                overlay.scaleX = scaleValue;
                                overlay.scaleY = scaleValue;
                                break;
                            case 'scaleX':
                                overlay.scaleX = parseFloat(value);
                                break;
                            case 'scaleY':
                                overlay.scaleY = parseFloat(value);
                                break;
                        }
                    }
                });
            }
            
            overlays.push(overlay);
        }
        
        return overlays;
    }
    
    // Calculate scaling for cover/contain modes
    function calculateScaling(imageWidth, imageHeight, mapWidth, mapHeight, mode) {
        if (mode === 'cover') {
            // Scale to cover entire map (may crop image)
            const scaleX = mapWidth / imageWidth;
            const scaleY = mapHeight / imageHeight;
            const scale = Math.max(scaleX, scaleY);
            return { scaleX: scale, scaleY: scale };
        } else if (mode === 'contain') {
            // Scale to fit within map bounds (may leave empty space)
            const scaleX = mapWidth / imageWidth;
            const scaleY = mapHeight / imageHeight;
            const scale = Math.min(scaleX, scaleY);
            return { scaleX: scale, scaleY: scale };
        }
        return { scaleX: 1, scaleY: 1 };
    }
    
    // Extend the Spriteset_Map class to add overlay sprites
    const _Spriteset_Map_createParallax = Spriteset_Map.prototype.createParallax;
    Spriteset_Map.prototype.createParallax = function() {
        _Spriteset_Map_createParallax.call(this);
        this.createOverlays();
    };
    
    Spriteset_Map.prototype.createOverlays = function() {
        this._overlays = [];
        this._overlayData = parseMapNotes();
        
        for (let i = 0; i < this._overlayData.length; i++) {
            const data = this._overlayData[i];
            const sprite = new Sprite();
            
            // Load the image from img/layers folder
            sprite.bitmap = loadLayerImage(data.filename);
            sprite.z = data.z;
            sprite.opacity = data.opacity;
            sprite.data = data;
            
            // Store initial map display position
            sprite._baseX = $gameMap.displayX();
            sprite._baseY = $gameMap.displayY();
            
            this._overlays.push(sprite);
            this.addChild(sprite);
        }
    };
    
    // Update the overlays - called every frame
    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.updateOverlays();
    };
    
    Spriteset_Map.prototype.updateOverlays = function() {
        if (!this._overlays) return;
        
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const mapWidth = $gameMap.width() * tileWidth;
        const mapHeight = $gameMap.height() * tileHeight;
        const screenWidth = Graphics.boxWidth;
        const screenHeight = Graphics.boxHeight;
        
        for (let i = 0; i < this._overlays.length; i++) {
            const sprite = this._overlays[i];
            const data = sprite.data;
            
            if (!sprite.bitmap.isReady()) continue;
            
            // Calculate scaling
            let finalScaleX = data.scaleX;
            let finalScaleY = data.scaleY;
            
            if (data.scalingMode === 'cover' || data.scalingMode === 'contain') {
                // For fixed overlays, scale to screen size; for moving overlays, scale to map size
                const targetWidth = data.fixed ? screenWidth : mapWidth;
                const targetHeight = data.fixed ? screenHeight : mapHeight;
                
                const calculatedScale = calculateScaling(
                    sprite.bitmap.width, 
                    sprite.bitmap.height, 
                    targetWidth, 
                    targetHeight, 
                    data.scalingMode
                );
                
                finalScaleX = calculatedScale.scaleX * data.scaleX;
                finalScaleY = calculatedScale.scaleY * data.scaleY;
            }
            
            // Apply scaling
            sprite.scale.x = finalScaleX;
            sprite.scale.y = finalScaleY;
            
            // Position calculation
            if (data.fixed) {
                // For fixed overlays, apply only scrolling
                sprite.x = -data.scrollX * $gameMap.displayX() * tileWidth;
                sprite.y = -data.scrollY * $gameMap.displayY() * tileHeight;
                
                // Center the sprite if using cover/contain modes
                if (data.scalingMode === 'cover' || data.scalingMode === 'contain') {
                    const scaledWidth = sprite.bitmap.width * finalScaleX;
                    const scaledHeight = sprite.bitmap.height * finalScaleY;
                    sprite.x += (screenWidth - scaledWidth) / 2;
                    sprite.y += (screenHeight - scaledHeight) / 2;
                }
            } else {
                // For overlays that move with the player
                sprite.x = -($gameMap.displayX() * tileWidth + data.scrollX * $gameMap.displayX() * tileWidth);
                sprite.y = -($gameMap.displayY() * tileHeight + data.scrollY * $gameMap.displayY() * tileHeight);
                
                // Center the sprite if using cover/contain modes
                if (data.scalingMode === 'cover' || data.scalingMode === 'contain') {
                    const scaledWidth = sprite.bitmap.width * finalScaleX;
                    const scaledHeight = sprite.bitmap.height * finalScaleY;
                    sprite.x += (mapWidth - scaledWidth) / 2;
                    sprite.y += (mapHeight - scaledHeight) / 2;
                }
            }
        }
    };
    
    // Clean up overlays when leaving map
    const _Spriteset_Map_destroy = Spriteset_Map.prototype.destroy;
    Spriteset_Map.prototype.destroy = function() {
        if (this._overlays) {
            for (let i = 0; i < this._overlays.length; i++) {
                this.removeChild(this._overlays[i]);
            }
            this._overlays = null;
        }
        _Spriteset_Map_destroy.call(this);
    };
    
})();