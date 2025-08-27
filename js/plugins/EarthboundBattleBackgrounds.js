// =============================================================================
// EarthboundBattleBackgrounds.js
// =============================================================================
/*:
* @plugindesc v2.0 Creates randomized Earthbound-style animated battle backgrounds with single-layer effects
* @author Claude (Modified)
*
* @param opacity
* @desc Opacity of the background overlay (0-255)
* @default 150
*
* @param blendMode
* @desc Blend mode (0:Normal, 1:Add, 2:Multiply, 3:Screen)
* @default 1
*
* @param animationSpeed
* @desc Animation speed multiplier (0.1-2.0, lower is slower)
* @default 0.5
* 
* @param optionName
* @desc Name of the option in the game menu
* @default Battle BG

* @help
* This plugin creates randomized Earthbound-style animated battle backgrounds
* that appear behind enemy sprites and above the background.
* 
* Each battle will have different random background patterns with a single optimized layer.
* 
* How to use:
* 1. Place this script in your plugins folder
* 2. Enable the plugin in the Plugin Manager
* 3. The backgrounds will automatically appear during battles
* 
* You can adjust the opacity, blend mode, and animation speed in the plugin parameters.
*/

(function() {
    // Get plugin parameters
    var parameters = PluginManager.parameters('EarthboundBattleBackgrounds');
    var optionName = String(parameters['optionName'] || 'Battle');
    var overlayOpacity = Number(parameters['opacity'] || 150);
    var overlayBlendMode = Number(parameters['blendMode'] || 1);
    var speedMultiplier = Number(parameters['animationSpeed'] || 0.5);

    const EG = window.EffectsGenerator;
    if (!EG) {
      throw new Error("EffectsGenerator not loaded before main-plugin.js");
    }
  
    // Mixin onto the prototype
    Object.assign(Spriteset_Battle.prototype, EG);
    // Cap animation speed to prevent it from being too fast
    speedMultiplier = Math.min(Math.max(speedMultiplier, 0.1), 1.0);
    
    // Constants for background types
    var ALL_TYPES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14]; // All available types
    
    //=============================================================================
    // ** Spriteset_Battle
    //=============================================================================
    
    // Alias the createLowerLayer method to inject our background
    var _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        // Call original method
        _Spriteset_Battle_createLowerLayer.call(this);
        
        // Create our overlay only if enabled in options (1 = Performance, 2 = Full)
        if (ConfigManager.ebBackgrounds > 0) {
            this.createEarthboundBackground();
        }
    };
    
    // Create the Earthbound background overlay with single layer
    Spriteset_Battle.prototype.createEarthboundBackground = function() {
        try {
            // Create containers for the background
            this._earthboundContainer = new Sprite();
            this._earthboundGradientContainer = new Sprite();

            // Set opacity for gradient (100% by default)
            this._earthboundGradientContainer.opacity = 255;
            this._earthboundGradientContainer.blendMode = 0; // Normal blend mode
            
            // Set opacity and blend mode for the main container
            this._earthboundContainer.opacity = overlayOpacity;
            this._earthboundContainer.blendMode = overlayBlendMode;
            
            // Position the containers BETWEEN background and battlers
            if (this._battleField && this._battleField.parent) {
                var battleFieldIndex = this._battleField.parent.getChildIndex(this._battleField);
                
                // Insert layers just before the battlefield so they're behind the enemies
                this._battleField.parent.addChildAt(this._earthboundGradientContainer, battleFieldIndex);
                this._battleField.parent.addChildAt(this._earthboundContainer, battleFieldIndex + 1);
            } else if (this.children && this.children.length > 0) {
                // Alternative: add to the spriteset directly
                this.addChildAt(this._earthboundGradientContainer, 1);
                this.addChildAt(this._earthboundContainer, 2);
            } else {
                console.error("EarthboundBattleBackgrounds: Could not find suitable parent container");
                return;
            }
            
            // Set dimensions to cover the screen
            this._earthboundContainer.width = Graphics.width;
            this._earthboundContainer.height = Graphics.height;
            this._earthboundGradientContainer.width = Graphics.width;
            this._earthboundGradientContainer.height = Graphics.height;
            
            // Create the bitmaps where we'll draw our patterns
            try {
                this._earthboundBitmap = new Bitmap(Graphics.width, Graphics.height);
                this._gradientBitmap = new Bitmap(Graphics.width, Graphics.height);

                if (!this._earthboundBitmap || !this._gradientBitmap) 
                    throw new Error("Failed to create bitmaps");

                this._earthboundSprite = new Sprite(this._earthboundBitmap);
                this._gradientSprite = new Sprite(this._gradientBitmap);
                
                this._earthboundContainer.addChild(this._earthboundSprite);
                this._earthboundGradientContainer.addChild(this._gradientSprite);
                
                // Initialize animation properties
                this._animationCount = 0;
                this._frameCount = 0;
                this._lastDrawTime = 0;
                
                // Generate random background
                this.initRandomBackground();
            } catch (bitmapError) {
                console.error("EarthboundBattleBackgrounds: Error creating bitmaps", bitmapError);
            }
        } catch (e) {
            console.error("EarthboundBattleBackgrounds: Error in createEarthboundBackground", e);
        }
    };
    
    // Initialize random background pattern
    Spriteset_Battle.prototype.initRandomBackground = function() {
        try {
            // Generate random values for the background
            this._bgType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
            this._colorHue1 = Math.floor(Math.random() * 360);
            this._colorHue2 = Math.floor(Math.random() * 360);
            this._colorHue3 = Math.floor(Math.random() * 360);
            
            // Generate random values for gradient background
            this._gradientColorHue1 = Math.floor(Math.random() * 360);
            this._gradientColorHue2 = Math.floor(Math.random() * 360);
            this._gradientRotation = Math.floor(Math.random() * 4) * 45; // 0, 45, 90, or 135 degrees
            this._gradientSpeed = 0.1 + Math.random() * 0.3;
            
            // Initialize pattern-specific properties
            this.initPatternProperties(this._bgType);
            
            // Initialize draw optimization properties
            this._drawRegions = [];
            this._needsFullRedraw = true;
            
            console.log("Initialized random background - Type: " + this._bgType);
        } catch (e) {
            console.error("EarthboundBattleBackgrounds: Error in initRandomBackground", e);
            
            // Set fallback values
            this._bgType = 0;
            this._colorHue1 = 0;
            this._colorHue2 = 120;
            this._colorHue3 = 240;
        }
    };
    
    // Initialize pattern-specific properties
    Spriteset_Battle.prototype.initPatternProperties = function(bgType) {
        switch(bgType) {
            case 0: // Wavy lines
                this._waveAmplitude = 5 + Math.floor(Math.random() * 10);
                this._waveFrequency = 0.02 + Math.random() * 0.03;
                this._waveSpeed = 0.02 + Math.random() * 0.03;
                this._numLines = 12 + Math.floor(Math.random() * 6);
                break;
                
            case 1: // Spiral
                this._spiralSegments = 8 + Math.floor(Math.random() * 6);
                this._spiralRotationSpeed = 0.2 + Math.random() * 0.3;
                this._spiralZoom = 0.02 + Math.random() * 0.03;
                break;
                
            case 2: // Arcane seal
                this._arcaneRings = 2 + Math.floor(Math.random() * 2);
                this._arcaneSymbols = 5 + Math.floor(Math.random() * 4);
                this._arcaneRotationSpeed = 0.02 + Math.random() * 0.30;
                break;
                
            case 3: // Checkerboard
                this._checkerSize = 20 + Math.floor(Math.random() * 20);
                this._checkerScrollSpeed = 0.05 + Math.random() * 0.1;
                this._checkerAngle = Math.floor(Math.random() * 4) * 45;
                break;
                
            case 4: // Diamond pattern
                this._diamondSize = 30 + Math.floor(Math.random() * 20);
                this._diamondSpeed = 0.02 + Math.random() * 0.03;
                this._diamondWave = 0.005 + Math.random() * 0.01;
                break;
            
            case 5: // Concentric circles
                this._circleCount = 6 + Math.floor(Math.random() * 6);
                this._circlePulseSpeed = 0.01 + Math.random() * 0.02;
                this._circlePulseAmount = 0.2 + Math.random() * 0.3;
                this._circleRotationSpeed = 0.1 + Math.random() * 0.2;
                break;
                
            case 6: // Flowing grid
                this._gridSize = 30 + Math.floor(Math.random() * 30);
                this._gridWaveSpeed = 0.01 + Math.random() * 0.02;
                this._gridWaveIntensity = 5 + Math.floor(Math.random() * 10);
                this._gridLinesOnly = Math.random() > 0.5;
                break;
                
            case 7: // Plaids/stripes
                this._plaidSize = 20 + Math.floor(Math.random() * 40);
                this._plaidSpeed = 0.5 + Math.random() * 1.0;
                this._plaidRotation = Math.random() * 45;
                this._plaidHorizontalDensity = 1 + Math.floor(Math.random() * 3);
                this._plaidVerticalDensity = 1 + Math.floor(Math.random() * 3);
                break;
                
            case 8: // Kaleidoscope
                this._kaleidoscopeSegments = 4 + Math.floor(Math.random() * 4) * 2;
                this._kaleidoscopeRotationSpeed = 0.01 + Math.random() * 0.02;
                this._kaleidoscopeScale = 0.5 + Math.random() * 0.5;
                this._kaleidoscopeCircles = 3 + Math.floor(Math.random() * 5);
                break;
                
            case 9: // Static noise (repurposed as flowing dots)
                this._dotSize = 4 + Math.floor(Math.random() * 6);
                this._dotDensity = 0.02 + Math.random() * 0.03;
                this._dotSpeed = 0.5 + Math.random() * 1.0;
                break;
                
            case 10: // Electric Arcs (repurposed as energy waves)
                this._waveCount = 3 + Math.floor(Math.random() * 5);
                this._waveThickness = 2 + Math.floor(Math.random() * 3);
                this._waveSpeed = 0.02 + Math.random() * 0.03;
                this._waveAmplitude = 20 + Math.floor(Math.random() * 20);
                break;
                
            case 11: // Crystal Lattice
                this._crystalSize = 40 + Math.floor(Math.random() * 30);
                this._crystalRotationSpeed = 0.01 + Math.random() * 0.02;
                this._crystalLayers = 2 + Math.floor(Math.random() * 2);
                this._crystalShininess = Math.random() > 0.5;
                break;
        }
    };
    
    // Update method with error handling
    var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
            if (Utils.isOptionValid('test') && Input.isTriggered('pagedown')) {
                    this.initRandomBackground();
                }
        // If backgrounds exist but option is off, remove them
        if (ConfigManager.ebBackgrounds === 0 && this._earthboundContainer) {
            this.removeEarthboundBackground();
        }
        // If backgrounds don't exist but option is on, create them
        else if (ConfigManager.ebBackgrounds > 0 && !this._earthboundContainer) {
            this.createEarthboundBackground();
        }
        // If option is on and containers exist, update the backgrounds
        else if (ConfigManager.ebBackgrounds > 0 && 
            this._earthboundBitmap && this._earthboundContainer) {
            this.updateEarthboundBackground();
        }
    };

    // New function to clean up backgrounds if option is turned off during gameplay
    Spriteset_Battle.prototype.removeEarthboundBackground = function() {
        try {
            if (this._earthboundContainer && this._earthboundContainer.parent) {
                this._earthboundContainer.parent.removeChild(this._earthboundContainer);
            }
            
            if (this._earthboundGradientContainer && this._earthboundGradientContainer.parent) {
                this._earthboundGradientContainer.parent.removeChild(this._earthboundGradientContainer);
            }
            
            // Clear references
            this._earthboundContainer = null;
            this._earthboundGradientContainer = null;
            this._earthboundBitmap = null;
            this._gradientBitmap = null;
        } catch (e) {
            console.error("EarthboundBattleBackgrounds: Error in removeEarthboundBackground", e);
        }
    };
    
    // Update Earthbound background with optimization
    Spriteset_Battle.prototype.updateEarthboundBackground = function() {
        try {
            // Make sure we have valid bitmaps to draw on
            if (!this._earthboundBitmap || !this._earthboundBitmap._context ||
                !this._gradientBitmap || !this._gradientBitmap._context) {
                return;
            }
            
            // Update animation counter
            this._animationCount += speedMultiplier;
            this._frameCount++;
            
            // Optimize drawing frequency based on pattern type
            var drawInterval = this.getDrawInterval();
            
            if (this._frameCount % drawInterval === 0) {
                // Check if using performance mode or full animation
                if (ConfigManager.ebBackgrounds === 1) {
                    // Performance mode - simple moving grid
                    this.drawPerformanceBackground();
                } else {
                    // Full animation mode
                    // Update gradient less frequently
                    if (this._frameCount % (drawInterval * 2) === 0) {
                        this.drawGradient();
                    }
                    
                    // Clear and draw pattern
                    this._earthboundBitmap.clear();
                    this.drawPattern(this._bgType);
                }
                
                this._lastDrawTime = Date.now();
            }
        } catch (e) {
            console.error("EarthboundBattleBackgrounds: Error in updateEarthboundBackground", e);
        }
    };
    
// Get optimal draw interval based on pattern type
Spriteset_Battle.prototype.getDrawInterval = function() {
    switch(this._bgType) {
        case 0:  // Wavy lines
        case 1:  // Spiral
        case 5:  // Concentric circles
        case 8:  // Kaleidoscope
        case 12: // RGB Glitch Scanlines
        case 13: // Nebula Swirl
            return 1; // Smooth animation needed

        case 2:  // Arcane seal
        case 4:  // Diamond pattern
        case 6:  // Flowing grid
        case 10: // Energy waves
        case 11: // Crystal Lattice
        case 14: // Warp Tunnel
            return 2; // Moderate animation

        case 3:  // Checkerboard
        case 7:  // Plaids
        case 9:  // Flowing dots
            return 3; // Can be slower

        default:
            return 2;
    }
};

// Draw the appropriate pattern based on type
Spriteset_Battle.prototype.drawPattern = function(bgType) {
    var bitmap = this._earthboundBitmap;
    this._currentBitmap = bitmap;
    this._currentContext = bitmap._context;
    
    // Enable optimizations for canvas
    this._currentContext.imageSmoothingEnabled = false;
    
    // Draw pattern based on type
    switch(bgType) {
        case 0:
            this.drawWavyLines();
            break;
        case 1:
            this.drawSpiral();
            break;
        case 2:
            this.drawArcaneSeal();
            break;
        case 3:
            this.drawCheckerboard();
            break;
        case 4:
            this.drawDiamondPattern();
            break;
        case 5:
            this.drawConcentricCircles();
            break;
        case 6:
            this.drawFlowingGrid();
            break;
        case 7:
            this.drawPlaids();
            break;
        case 8:
            this.drawKaleidoscope();
            break;
        case 9:
            this.drawFlowingDots();
            break;
        case 10:
            this.drawEnergyWaves();
            break;
        case 11:
            this.drawCrystalLattice();
            break;
        case 12:
            this.drawRGBGlitch();
            break;
        case 13:
            this.drawNebulaSwirl();
            break;
        case 14:
            this.drawWarpTunnel();
            break;
        default:
            this.drawWavyLines();
    }
};

    // Helper function to get color from hue with optional alpha and lightness
    Spriteset_Battle.prototype.hueToColor = function(hue, alpha, lightness) {
        try {
            var saturation = 80;
            var light = lightness !== undefined ? lightness : 50;
            var color = Color.hsl(hue, saturation, light);
            if (alpha !== undefined && alpha < 1) {
                return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + alpha + ")";
            } else {
                return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            }
        } catch (e) {
            console.error("Error converting hue to color", e);
            return alpha !== undefined && alpha < 1 ? 
                "rgba(255,0,255," + alpha + ")" : 
                "rgb(255,0,255)";
        }
    };

    // Draw animated gradient background
    Spriteset_Battle.prototype.drawGradient = function() {
        var w = this._gradientBitmap.width;
        var h = this._gradientBitmap.height;
        var context = this._gradientBitmap._context;
        
        // Clear the bitmap
        this._gradientBitmap.clear();
        
        // Create animated hues based on animation count
        var hue1 = (this._gradientColorHue1 + this._animationCount * this._gradientSpeed) % 360;
        var hue2 = (this._gradientColorHue2 + this._animationCount * this._gradientSpeed * 0.7) % 360;
        
        // Create gradient
        var gradient;
        var angle = this._gradientRotation * Math.PI / 180;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        
        // Calculate gradient start and end points based on angle
        var startX = w/2 - cos * w/2;
        var startY = h/2 - sin * h/2;
        var endX = w/2 + cos * w/2;
        var endY = h/2 + sin * h/2;
        
        gradient = context.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, this.hueToColor(hue1, 1, 30));
        gradient.addColorStop(1, this.hueToColor(hue2, 1, 30));
        
        // Fill the background with the gradient
        context.fillStyle = gradient;
        context.fillRect(0, 0, w, h);
    };
    

    //=============================================================================
    // Color Utility
    //=============================================================================

    // HSL to RGB conversion
    var Color = Color || {};

    Color.hsl = function(h, s, l) {
        var r, g, b;
        
        h = h % 360 / 360;
        s = s / 100;
        l = l / 100;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            var hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    //=============================================================================
    // ** ConfigManager
    //=============================================================================

    // Add our new option to the config manager
    ConfigManager.ebBackgrounds = 2; // Default to full
    
    // Alias the makeData method to save our option
    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.ebBackgrounds = this.ebBackgrounds;
        return config;
    };

    // Alias the applyData method to load our option
    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        
        if (config.ebBackgrounds === undefined) {
            this.ebBackgrounds = 2; // Default to full animation
        } else {
            this.ebBackgrounds = Number(config.ebBackgrounds);
        }
    };

    //=============================================================================
    // ** Window_Options
    //=============================================================================

    // Alias the addGeneralOptions method to add our option to the menu
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'ebBackgrounds');
    };
    
    // Override the statusText method for our option to handle three states
    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        if (symbol === 'ebBackgrounds') {
            var value = this.getConfigValue(symbol);
            return value === 0 ? 'Off' : (value === 1 ? 'Fast' : 'Full');
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    // Override the processOk method to cycle through our three options
    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'ebBackgrounds') {
            var value = this.getConfigValue(symbol);
            value = (value + 1) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_processOk.call(this, index);
        }
    };

    // Override cursorRight method for our option
    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'ebBackgrounds') {
            var value = this.getConfigValue(symbol);
            value = (value + 1) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_cursorRight.call(this, wrap);
        }
    };

    // Override cursorLeft method for our option
    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'ebBackgrounds') {
            var value = this.getConfigValue(symbol);
            value = (value + 2) % 3;
            this.changeValue(symbol, value);
        } else {
            _Window_Options_cursorLeft.call(this, wrap);
        }
    };
})();