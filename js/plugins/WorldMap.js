/*:
 * @target MZ
 * @plugindesc World Map Plugin v1.0.0
 * @author YourName
 * @version 1.0.0
 * @description Shows a minimap in the top-right corner with player and vehicle positions
 *
 * @param mapWidth
 * @text Map Width
 * @desc Width of the minimap in pixels
 * @type number
 * @min 50
 * @max 500
 * @default 200
 *
 * @param mapHeight
 * @text Map Height
 * @desc Height of the minimap in pixels
 * @type number
 * @min 50
 * @max 500
 * @default 150
 *
 * @param opacity
 * @text Map Opacity
 * @desc Opacity of the minimap (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 180
 *
 * @param playerColor
 * @text Player Color
 * @desc Color of the player dot (hex color)
 * @type string
 * @default #FF0000
 *
 * @param boatColor
 * @text Boat Color
 * @desc Color of the boat dot (hex color)
 * @type string
 * @default #0000FF
 *
 * @param shipColor
 * @text Ship Color
 * @desc Color of the ship dot (hex color)
 * @type string
 * @default #00FF00
 *
 * @param airshipColor
 * @text Airship Color
 * @desc Color of the airship dot (hex color)
 * @type string
 * @default #FFFF00
 *
 * @command showWorldMap
 * @text Show World Map
 * @desc Shows the world map minimap
 *
 * @command hideWorldMap
 * @text Hide World Map
 * @desc Hides the world map minimap
 *
 * @help WorldMap.js
 * 
 * This plugin creates a minimap using worldmap.png from the pictures folder.
 * The minimap shows in the top-right corner with player and vehicle positions.
 * 
 * Requirements:
 * - Place worldmap.png in your img/pictures/ folder
 * - The worldmap.png should represent your world map layout
 * 
 * Plugin Commands:
 * - Show World Map: Displays the minimap
 * - Hide World Map: Hides the minimap
 * 
 * The plugin automatically updates player and vehicle positions as they move.
 */

(() => {
    'use strict';
    
    const pluginName = 'WorldMap';
    const parameters = PluginManager.parameters(pluginName);
    
    const mapWidth = Number(parameters['mapWidth']) || 200;
    const mapHeight = Number(parameters['mapHeight']) || 150;
    const opacity = Number(parameters['opacity']) || 180;
    const playerColor = parameters['playerColor'] || '#FF0000';
    const boatColor = parameters['boatColor'] || '#0000FF';
    const shipColor = parameters['shipColor'] || '#00FF00';
    const airshipColor = parameters['airshipColor'] || '#FFFF00';
    
    let worldMapSprite = null;
    let worldMapVisible = false;
    let worldMapBitmap = null;
    
    // Plugin command registration
    PluginManager.registerCommand(pluginName, "showWorldMap", args => {
        showWorldMap();
    });
    
    PluginManager.registerCommand(pluginName, "hideWorldMap", args => {
        hideWorldMap();
    });
    
    // Create world map sprite
    function createWorldMapSprite() {
        if (worldMapSprite) return;
        
        worldMapSprite = new Sprite();
        worldMapSprite.x = Graphics.width - mapWidth - 10;
        worldMapSprite.y = 10;
        worldMapSprite.opacity = opacity;
        
        // Load the world map image
        worldMapBitmap = ImageManager.loadPicture('worldmap');
        worldMapBitmap.addLoadListener(() => {
            updateWorldMapBitmap();
        });
        
        SceneManager._scene.addChild(worldMapSprite);
    }
    function drawSquare(bitmap, x, y, color = '#00FF00', size = 6) {
        const ctx = bitmap.context;
        const half = size / 2;
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x - half), Math.round(y - half), size, size);
        ctx.restore();
        bitmap.baseTexture.update();
    }
    
    // Update world map bitmap with positions
    function updateWorldMapBitmap() {
        if (!worldMapBitmap || !worldMapBitmap.isReady()) return;
    
        const bitmap = new Bitmap(mapWidth, mapHeight);
    
        // Draw background
        bitmap.blt(
            worldMapBitmap,
            0, 0, worldMapBitmap.width, worldMapBitmap.height,
            0, 0, mapWidth, mapHeight
        );
    
        if ($gameMap && $gamePlayer) {
            const mapId  = $gameMap.mapId();
            const wTiles = $dataMap.width;
            const hTiles = $dataMap.height;
    
            // 1) TELEPORT EVENTS — green squares
            const events = $gameMap.events();
            for (const ev of events) {
                // skip erased or different map (safety)
                if (!ev || ev._erased) continue;
                const name = ev.event().name || "";
                if (/^teleport/i.test(name)) {
                    const ex = Math.floor((ev.x / wTiles) * mapWidth);
                    const ey = Math.floor((ev.y / hTiles) * mapHeight);
                    drawSquare(bitmap, ex, ey, '#00FF00', 6);
                }
            }
    
            // 2) PLAYER — keep existing dot
            const px = Math.floor(($gamePlayer.x / wTiles) * mapWidth);
            const py = Math.floor(($gamePlayer.y / hTiles) * mapHeight);
            drawDot(bitmap, px, py, playerColor, 4);
    
            // 3) VEHICLES — keep existing dots
            if ($gameMap.boat()._mapId === mapId) {
                const bx = Math.floor(($gameMap.boat()._x / wTiles) * mapWidth);
                const by = Math.floor(($gameMap.boat()._y / hTiles) * mapHeight);
                drawDot(bitmap, bx, by, boatColor, 3);
            }
            if ($gameMap.ship()._mapId === mapId) {
                const sx = Math.floor(($gameMap.ship()._x / wTiles) * mapWidth);
                const sy = Math.floor(($gameMap.ship()._y / hTiles) * mapHeight);
                drawDot(bitmap, sx, sy, shipColor, 3);
            }
            if ($gameMap.airship()._mapId === mapId) {
                const ax = Math.floor(($gameMap.airship()._x / wTiles) * mapWidth);
                const ay = Math.floor(($gameMap.airship()._y / hTiles) * mapHeight);
                drawDot(bitmap, ax, ay, airshipColor, 3);
            }
        }
    
        worldMapSprite.bitmap = bitmap;
    }
    // Draw a colored dot on the bitmap
    function drawDot(bitmap, x, y, color, radius) {
        const context = bitmap.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 1;
        context.stroke();
        context.restore();
        bitmap.baseTexture.update();
    }
    
    // Show world map
    function showWorldMap() {
        if (!worldMapVisible) {
            createWorldMapSprite();
            worldMapVisible = true;
            updateWorldMapBitmap();
        }
    }
    
    // Hide world map
    function hideWorldMap() {
        if (worldMapSprite && worldMapVisible) {
            worldMapSprite.visible = false;
            worldMapVisible = false;
        }
    }
    
    // Update world map when player moves
    const _Game_Player_updateMove = Game_Player.prototype.updateMove;
    Game_Player.prototype.updateMove = function() {
        _Game_Player_updateMove.call(this);
        if (worldMapVisible && worldMapSprite) {
            updateWorldMapBitmap();
        }
    };
    
    // Update world map when transferring to new map
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        if (worldMapVisible && worldMapSprite) {
            updateWorldMapBitmap();
        }
    };
    
    // Clean up when changing scenes
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.call(this);
        if (worldMapSprite) {
            if (worldMapSprite.parent) {
                worldMapSprite.parent.removeChild(worldMapSprite);
            }
            worldMapSprite = null;
            worldMapVisible = false;
        }
    };
    
    // Recreate world map sprite when entering map scene
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        if (worldMapVisible) {
            createWorldMapSprite();
            updateWorldMapBitmap();
        }
    };
    
})();