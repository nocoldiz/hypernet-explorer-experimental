/*:
 * @target MZ
 * @plugindesc Train Animation System v2.0.0
 * @author YourName
 * @help
 * ============================================================================
 * Train Animation Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates a fullscreen train animation with parallax effects.
 * The train moves from left to right with easing at the center.
 * Features dynamic time-based backgrounds with sky gradients, stars, and moons.
 * 
 * Setup:
 * Place your images in img/pictures/train/ folder:
 * - train.png (or train1.png, train2.png, etc.)
 * - tracks.png (or tracks1.png, tracks2.png, etc.)
 * - background.png (or background1.png, background2.png, etc.)
 * - foreground.png (or foreground1.png, foreground2.png, etc.)
 * 
 * The plugin will randomly select from available variations if multiple
 * images are provided.
 * 
 * @param trainImages
 * @text Train Images
 * @desc List of train image filenames (without .png)
 * @type string[]
 * @default ["train"]
 * 
 * @param tracksImages
 * @text Tracks Images
 * @desc List of tracks image filenames (without .png)
 * @type string[]
 * @default ["tracks"]
 * 
 * @param backgroundImages
 * @text Background Images
 * @desc List of background image filenames (without .png)
 * @type string[]
 * @default ["background"]
 * 
 * @param foregroundImages
 * @text Foreground Images
 * @desc List of foreground image filenames (without .png)
 * @type string[]
 * @default ["foreground"]
 * 
 * @param animationDuration
 * @text Animation Duration
 * @desc Duration of the animation in milliseconds
 * @type number
 * @default 6000
 * @min 1000
 * @max 20000
 * 
 * @param backgroundSpeed
 * @text Background Speed
 * @desc Parallax speed multiplier for background (0.1 - 1.0)
 * @type number
 * @decimals 2
 * @default 0.3
 * @min 0.1
 * @max 1.0
 * 
 * @param tracksSpeed
 * @text Tracks Speed
 * @desc Parallax speed multiplier for tracks (0.5 - 1.5)
 * @type number
 * @decimals 2
 * @default 1.0
 * @min 0.5
 * @max 1.5
 * 
 * @param foregroundSpeed
 * @text Foreground Speed
 * @desc Parallax speed multiplier for foreground (1.0 - 2.0)
 * @type number
 * @decimals 2
 * @default 1.5
 * @min 1.0
 * @max 2.0
 * 
 * @param useTimeSky
 * @text Use Time-Based Sky
 * @desc Enable dynamic sky that changes with real time
 * @type boolean
 * @default true
 * 
 * @param starCount
 * @text Star Count
 * @desc Number of stars to display at night (0-200)
 * @type number
 * @default 100
 * @min 0
 * @max 200
 * 
 * @param tripleMoonChance
 * @text Triple Moon Chance
 * @desc Chance for companion moons to appear (0-100%)
 * @type number
 * @default 30
 * @min 0
 * @max 100
 * 
 * @command showTrainAnimation
 * @text Show Train Animation
 * @desc Display the train animation scene
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'TrainAnimationSystem';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const trainImages = JSON.parse(parameters['trainImages'] || '["train"]');
    const tracksImages = JSON.parse(parameters['tracksImages'] || '["tracks"]');
    const backgroundImages = JSON.parse(parameters['backgroundImages'] || '["background"]');
    const foregroundImages = JSON.parse(parameters['foregroundImages'] || '["foreground"]');
    const animationDuration = Number(parameters['animationDuration'] || 6000);
    const backgroundSpeed = Number(parameters['backgroundSpeed'] || 0.3);
    const tracksSpeed = Number(parameters['tracksSpeed'] || 1.0);
    const foregroundSpeed = Number(parameters['foregroundSpeed'] || 1.5);
    const useTimeSky = parameters['useTimeSky'] === 'true';
    const starCount = Number(parameters['starCount'] || 100);
    const tripleMoonChance = Number(parameters['tripleMoonChance'] || 30);
    
    // Sky gradient definitions for each hour (top color, bottom color)
    const skyGradients = {
        0: { top: '#0a0a2e', bottom: '#1e1e4a' },  // Midnight - deep night
        1: { top: '#0d0d35', bottom: '#252550' },  // Late night
        2: { top: '#101040', bottom: '#2a2a55' },  // Late night
        3: { top: '#131345', bottom: '#2f2f5a' },  // Pre-dawn
        4: { top: '#1a1a4a', bottom: '#3a3a65' },  // Pre-dawn
        5: { top: '#2a2a5a', bottom: '#4a4a75' },  // Early dawn
        6: { top: '#4a3a6a', bottom: '#8a6a9a' },  // Dawn
        7: { top: '#7a5a8a', bottom: '#ba9aca' },  // Sunrise
        8: { top: '#9a7aaa', bottom: '#dac0ea' },  // Early morning
        9: { top: '#87ceeb', bottom: '#f0e68c' },  // Morning
        10: { top: '#87ceeb', bottom: '#98d8f4' }, // Late morning
        11: { top: '#6bb6ff', bottom: '#a8d8ff' }, // Noon approach
        12: { top: '#5ba3f5', bottom: '#b8e2ff' }, // Noon
        13: { top: '#6bb6ff', bottom: '#a8d8ff' }, // Early afternoon
        14: { top: '#7bc4ff', bottom: '#98d0ff' }, // Afternoon
        15: { top: '#8bceff', bottom: '#b8d8ff' }, // Late afternoon
        16: { top: '#9bd4ff', bottom: '#d8e8ff' }, // Pre-sunset
        17: { top: '#ffb347', bottom: '#ffcc66' }, // Golden hour
        18: { top: '#ff8c42', bottom: '#ff6b6b' }, // Sunset
        19: { top: '#c44569', bottom: '#8b2f55' }, // Dusk
        20: { top: '#5a2a6a', bottom: '#3a1a4a' }, // Early night
        21: { top: '#3a1a5a', bottom: '#2a0a3a' }, // Night
        22: { top: '#1a1a4a', bottom: '#1a0a2a' }, // Late evening
        23: { top: '#0f0f3a', bottom: '#15152a' }  // Near midnight
    };
    
    // Register plugin command
    PluginManager.registerCommand(pluginName, 'showTrainAnimation', args => {
        if ($gameTemp._trainAnimation) {
            return; // Animation already playing
        }
        const scene = SceneManager._scene;
        if (scene) {
            const trainAnimation = new TrainAnimationSprite();
            scene.addChild(trainAnimation);
            $gameTemp._trainAnimation = trainAnimation;
        }
    });
    
    // Helper function to get random element from array
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // Helper function for easing (ease in center, accelerate out)
    function easeInOutCustom(t) {
        // Custom easing: slow down in middle, accelerate at end
        if (t < 0.4) {
            // Decelerate to center
            return 2.5 * t * t;
        } else if (t < 0.6) {
            // Slow at center
            return 0.4 + (t - 0.4) * 0.5;
        } else {
            // Accelerate away
            const t2 = (t - 0.6) / 0.4;
            return 0.5 + 0.5 * (t2 * t2);
        }
    }
    
    // Helper function to interpolate between colors
    function interpolateColor(color1, color2, factor) {
        const c1 = parseInt(color1.slice(1), 16);
        const c2 = parseInt(color2.slice(1), 16);
        
        const r1 = (c1 >> 16) & 0xff;
        const g1 = (c1 >> 8) & 0xff;
        const b1 = c1 & 0xff;
        
        const r2 = (c2 >> 16) & 0xff;
        const g2 = (c2 >> 8) & 0xff;
        const b2 = c2 & 0xff;
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return (r << 16) | (g << 8) | b;
    }
    
    // Train Animation Sprite Class
    class TrainAnimationSprite extends PIXI.Container {
        constructor() {
            super();
            this.initialize();
        }
        
        initialize() {
            // Set to fullscreen
            this.x = 0;
            this.y = 0;
            
            // Initialize properties
            this._startTime = performance.now();
            this._destroyed = false;
            
            // Determine if we should show triple moons
            this._showTripleMoons = Math.random() * 100 < tripleMoonChance;
            
            // Create sky background
            if (useTimeSky) {
                this.createTimeSky();
            } else {
                // Create simple black background
                this._blackBg = new PIXI.Graphics();
                this._blackBg.beginFill(0x000000, 0.8);
                this._blackBg.drawRect(0, 0, Graphics.width, Graphics.height);
                this._blackBg.endFill();
                this.addChild(this._blackBg);
            }
            
            // Create containers for each layer
            this._backgroundContainer = new PIXI.Container();
            this._tracksContainer = new PIXI.Container();
            this._trainContainer = new PIXI.Container();
            this._foregroundContainer = new PIXI.Container();
            
            // Add containers in correct order (back to front)
            this.addChild(this._backgroundContainer);
            this.addChild(this._tracksContainer);
            this.addChild(this._trainContainer);
            this.addChild(this._foregroundContainer);
            
            // Load images
            this.loadImages();
        }
        
        createTimeSky() {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const hourProgress = minute / 60;
            
            // Get current and next hour gradients
            const currentGradient = skyGradients[hour];
            const nextGradient = skyGradients[(hour + 1) % 24];
            
            // Interpolate colors
            const topColor = interpolateColor(currentGradient.top, nextGradient.top, hourProgress);
            const bottomColor = interpolateColor(currentGradient.bottom, nextGradient.bottom, hourProgress);
            
            // Create gradient background
            this._skyGradient = new PIXI.Graphics();
            const gradientTexture = this.createGradientTexture(topColor, bottomColor);
            this._skyGradient.beginTextureFill({ texture: gradientTexture });
            this._skyGradient.drawRect(0, 0, Graphics.width, Graphics.height);
            this._skyGradient.endFill();
            this.addChild(this._skyGradient);
            
            // Add celestial objects for night hours (8 PM to 5 AM)
            if (hour >= 20 || hour <= 5) {
                this.createStars();
                this.createMoons();
            }
            // Add subtle stars during dawn/dusk (6-7 AM, 6-7 PM)
            else if ((hour >= 6 && hour <= 7) || (hour >= 18 && hour <= 19)) {
                this.createStars(Math.floor(starCount * 0.3)); // Fewer stars
                if (hour >= 18 && hour <= 19) {
                    this.createMoons(0.5); // Faint moon during dusk
                }
            }
        }
        
        createGradientTexture(topColor, bottomColor) {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = Graphics.height;
            const ctx = canvas.getContext('2d');
            
            const gradient = ctx.createLinearGradient(0, 0, 0, Graphics.height);
            gradient.addColorStop(0, '#' + topColor.toString(16).padStart(6, '0'));
            gradient.addColorStop(1, '#' + bottomColor.toString(16).padStart(6, '0'));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1, Graphics.height);
            
            return PIXI.Texture.from(canvas);
        }
        
        createStars(count = starCount) {
            this._starsContainer = new PIXI.Container();
            
            for (let i = 0; i < count; i++) {
                const star = new PIXI.Graphics();
                const x = Math.random() * Graphics.width;
                const y = Math.random() * (Graphics.height * 0.6); // Stars in upper 60% of sky
                const size = Math.random() * 2 + 0.5;
                const brightness = Math.random() * 0.7 + 0.3;
                
                star.beginFill(0xffffff, brightness);
                star.drawCircle(0, 0, size);
                star.endFill();
                star.x = x;
                star.y = y;
                
                // Add twinkling animation
                star._twinkleOffset = Math.random() * Math.PI * 2;
                star._twinkleSpeed = Math.random() * 0.02 + 0.01;
                
                this._starsContainer.addChild(star);
            }
            
            this.addChild(this._starsContainer);
        }
        
        createMoons(opacity = 1.0) {
            this._moonsContainer = new PIXI.Container();
            this._moonsContainer.alpha = opacity;
            
            // Main moon position
            const moonX = Graphics.width * 0.75;
            const moonY = Graphics.height * 0.25;
            const mainMoonRadius = 30;
            
            // Create main moon
            const mainMoon = new PIXI.Graphics();
            mainMoon.beginFill(0xffffcc, 0.9);
            mainMoon.drawCircle(0, 0, mainMoonRadius);
            mainMoon.endFill();
            
            // Add moon craters/texture
            mainMoon.beginFill(0xeeeeaa, 0.3);
            mainMoon.drawCircle(-8, -5, 8);
            mainMoon.drawCircle(5, 8, 6);
            mainMoon.drawCircle(10, -8, 4);
            mainMoon.endFill();
            
            mainMoon.x = moonX;
            mainMoon.y = moonY;
            this._moonsContainer.addChild(mainMoon);
            
            // Create companion moons if triggered
            if (this._showTripleMoons) {
                // First small moon (upper left)
                const moon1 = new PIXI.Graphics();
                moon1.beginFill(0xffffe0, 0.8);
                moon1.drawCircle(0, 0, 12);
                moon1.endFill();
                moon1.x = moonX - 60;
                moon1.y = moonY - 40;
                this._moonsContainer.addChild(moon1);
                
                // Second small moon (upper right)
                const moon2 = new PIXI.Graphics();
                moon2.beginFill(0xfffff0, 0.85);
                moon2.drawCircle(0, 0, 10);
                moon2.endFill();
                moon2.x = moonX + 55;
                moon2.y = moonY - 35;
                this._moonsContainer.addChild(moon2);
                
                // Add subtle glow effect for triple moon formation
                const glow = new PIXI.Graphics();
                glow.beginFill(0xffffaa, 0.1);
                glow.drawCircle(moonX, moonY - 20, 80);
                glow.endFill();
                this._moonsContainer.addChildAt(glow, 0);
            }
            
            this.addChild(this._moonsContainer);
        }
        
        loadImages() {
            const basePath = 'img/pictures/train/';
            
            // Select random images
            const selectedTrain = getRandomElement(trainImages);
            const selectedTracks = getRandomElement(tracksImages);
            const selectedBackground = getRandomElement(backgroundImages);
            const selectedForeground = getRandomElement(foregroundImages);
            
            // Load textures
            const trainTexture = PIXI.Texture.from(basePath + selectedTrain + '.png');
            const tracksTexture = PIXI.Texture.from(basePath + selectedTracks + '.png');
            const backgroundTexture = PIXI.Texture.from(basePath + selectedBackground + '.png');
            const foregroundTexture = PIXI.Texture.from(basePath + selectedForeground + '.png');
            
            // Wait for textures to load
            const loader = new PIXI.Loader();
            loader.add('train', basePath + selectedTrain + '.png');
            loader.add('tracks', basePath + selectedTracks + '.png');
            loader.add('background', basePath + selectedBackground + '.png');
            loader.add('foreground', basePath + selectedForeground + '.png');
            
            loader.load(() => {
                this.setupSprites(trainTexture, tracksTexture, backgroundTexture, foregroundTexture);
            });
        }
        
        setupSprites(trainTexture, tracksTexture, backgroundTexture, foregroundTexture) {
            // Setup background (tiled) with transparency for sky to show through
            this._backgroundTiling = new PIXI.TilingSprite(
                backgroundTexture,
                Graphics.width * 3,
                Graphics.height
            );
            this._backgroundTiling.y = 0;
            this._backgroundTiling.alpha = 0.7; // Semi-transparent to show sky
            this._backgroundContainer.addChild(this._backgroundTiling);
            
            // Setup tracks (tiled)
            this._tracksTiling = new PIXI.TilingSprite(
                tracksTexture,
                Graphics.width * 3,
                tracksTexture.height
            );
            this._tracksTiling.y = Graphics.height - tracksTexture.height;
            this._tracksContainer.addChild(this._tracksTiling);
            
            // Setup train (single sprite)
            this._trainSprite = new PIXI.Sprite(trainTexture);
            this._trainSprite.anchor.set(0.5, 1.0);
            this._trainSprite.x = -trainTexture.width;
            this._trainSprite.y = Graphics.height - tracksTexture.height;
            this._trainContainer.addChild(this._trainSprite);
            
            // Setup foreground (tiled)
            this._foregroundTiling = new PIXI.TilingSprite(
                foregroundTexture,
                Graphics.width * 3,
                foregroundTexture.height
            );
            this._foregroundTiling.y = Graphics.height - foregroundTexture.height;
            this._foregroundContainer.addChild(this._foregroundTiling);
            
            // Store initial positions
            this._trainStartX = -trainTexture.width;
            this._trainEndX = Graphics.width + trainTexture.width;
            
            // Start animation
            this._isReady = true;
        }
        
        update() {
            if (!this._isReady || this._destroyed) return;
            
            const currentTime = performance.now();
            const elapsed = currentTime - this._startTime;
            const progress = Math.min(elapsed / animationDuration, 1.0);
            
            // Apply custom easing
            const easedProgress = easeInOutCustom(progress);
            
            // Update train position
            if (this._trainSprite) {
                this._trainSprite.x = this._trainStartX + 
                    (this._trainEndX - this._trainStartX) * easedProgress;
            }
            
            // Calculate base movement for parallax
            const baseMovement = Graphics.width * 2 * easedProgress;
            
            // Update parallax layers (tiling offset)
            if (this._backgroundTiling) {
                this._backgroundTiling.tilePosition.x = -baseMovement * backgroundSpeed;
            }
            
            if (this._tracksTiling) {
                this._tracksTiling.tilePosition.x = -baseMovement * tracksSpeed;
            }
            
            if (this._foregroundTiling) {
                this._foregroundTiling.tilePosition.x = -baseMovement * foregroundSpeed;
            }
            
            // Update star twinkling
            if (this._starsContainer) {
                this._starsContainer.children.forEach(star => {
                    star.alpha = 0.3 + Math.sin(elapsed * star._twinkleSpeed + star._twinkleOffset) * 0.3;
                });
            }
            
            // Gentle moon glow animation
            if (this._moonsContainer) {
                this._moonsContainer.alpha = 0.85 + Math.sin(elapsed * 0.0005) * 0.15;
            }
            
            // Check if animation is complete
            if (progress >= 1.0) {
                this.destroyAnimation();
            }
        }
        
        destroyAnimation() {
            if (this._destroyed) return;
            
            this._destroyed = true;
            
            // Fade out
            const fadeOut = () => {
                this.alpha -= 0.05;
                if (this.alpha <= 0) {
                    this.parent.removeChild(this);
                    this.destroy({ children: true });
                    delete $gameTemp._trainAnimation;
                } else {
                    requestAnimationFrame(fadeOut);
                }
            };
            
            fadeOut();
        }
    }
    
    // Hook into scene update
    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        if ($gameTemp._trainAnimation) {
            $gameTemp._trainAnimation.update();
        }
    };
    
    // Clean up on scene termination
    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        if ($gameTemp._trainAnimation) {
            $gameTemp._trainAnimation.destroyAnimation();
        }
        _Scene_Base_terminate.call(this);
    };
})();