/*:
 * @target MZ
 * @plugindesc Weather, Time & Temperature System v1.2.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @help
 * ============================================================================
 * Weather, Time & Temperature System Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates a dynamic weather system with realistic temperature
 * simulation that changes based on time of day, weather, and seasons.
 * 
 * Features:
 * - Weather changes when entering maps with <Exterior> tag
 * - Weather effects are removed in maps with <Interior> tag
 * - Time of day tinting system with 16 gradual tints (never too dark)
 * - Realistic temperature simulation based on time, weather, and season
 * - Map-specific base temperatures and forced weather
 * - Status effects applied based on weather type:
 *   - Rain: Status Effect 28 (Wet)
 *   - Storm: Status Effect 27 (Static)
 *   - Snow: Status Effect 25 (Hot) 
 * - Seeded random weather based on real time and date
 * - Current hour saved in Variable 23
 * - Temperature saved in Variable 61 (in Celsius)
 * 
 * Map Tags:
 * - <Exterior> - Enables weather changes and time tints on this map
 * - <Interior> - Disables all weather and time tints, resets to neutral
 * - <BaseTemp:X> - Sets base temperature for this map (X = temperature in Celsius)
 * - <ForceWeather:TYPE> - Forces specific weather on this map (none/rain/storm/snow)
 * 
 * Examples:
 * - <BaseTemp:25> - Sets map base temperature to 25°C
 * - <BaseTemp:-10> - Sets map base temperature to -10°C
 * - <ForceWeather:rain> - Always raining on this map
 * - <ForceWeather:snow> - Always snowing on this map
 * 
 * @param weatherChangeChance
 * @text Weather Change Chance
 * @desc Chance of weather changing when entering an exterior map (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 30
 * 
 * @param sunlightColorMode
 * @text Sunlight Color Mode
 * @desc Controls how the day/night tint cycle works on exterior maps
 * @type select
 * @option Full Cycle (Default)
 * @value full
 * @option Day Only (No tint)
 * @value day
 * @option Night Only
 * @value night
 * @option Dusk Only
 * @value dusk
 * @default full
 * 
 * @param enableTimeDebug
 * @text Enable Time Debug
 * @desc Show console messages for time changes (for development)
 * @type boolean
 * @default false
 * 
 * @param enableTempDebug
 * @text Enable Temperature Debug
 * @desc Show console messages for temperature changes (for development)
 * @type boolean
 * @default false
 * 
 * @command forceWeatherChange
 * @text Force Weather Change
 * @desc Forces a random weather change immediately
 * 
 * @command forceTimeUpdate
 * @text Force Time Update
 * @desc Forces an immediate time and tint update
 * 
 * @command forceTemperatureUpdate
 * @text Force Temperature Update
 * @desc Forces an immediate temperature recalculation
 * 
 * @command changeSunlightMode
 * @text Change Sunlight Mode
 * @desc Changes the sunlight color mode during gameplay
 * 
 * @arg mode
 * @text Mode
 * @desc Select the sunlight color mode
 * @type select
 * @option Full Cycle
 * @value full
 * @option Day Only
 * @value day
 * @option Night Only
 * @value night
 * @option Dusk Only
 * @value dusk
 * @default full
 * @command addCustomWeatherEffect
 * @text Add Custom Weather Effect
 * @desc Add custom animated weather effects using PIXI
 * 
 * @arg effectType
 * @text Effect Type
 * @desc Type of custom weather effect
 * @type select
 * @option Fireflies
 * @value fireflies
 * @option Pollen
 * @value pollen
 * @option Leaves
 * @value leaves
 * @option Sakura Petals
 * @value sakura
 * @option Dust Storm
 * @value dust
 * @option Ash Fall
 * @value ash
 * @option Magic Particles
 * @value magic
 * @option Bubbles
 * @value bubbles
 * @option Embers
 * @value embers
 * @option Aurora
 * @value aurora
 * @default fireflies
 * 
 * @arg intensity
 * @text Intensity
 * @desc Intensity of the effect (1-10)
 * @type number
 * @min 1
 * @max 10
 * @default 5
 * 
 * @arg duration
 * @text Duration
 * @desc Duration of transition in frames
 * @type number
 * @min 1
 * @default 60
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'WeatherSystem';
    const parameters = PluginManager.parameters(pluginName);
    const weatherChangeChance = Number(parameters['weatherChangeChance'] || 30);
    const enableTimeDebug = parameters['enableTimeDebug'] === 'true';
    const enableTempDebug = parameters['enableTempDebug'] === 'true';
    
    // Weather types enum
    const WeatherTypes = {
        NONE: 0,
        RAIN: 1,
        STORM: 2,
        SNOW: 3
    };
    
    // Status effect IDs
    const StatusEffects = {
        RAIN: 28,  // Wet
        STORM: 27, // Static
        SNOW: 25   // Hot (as specified, though typically would be Cold)
    };
    let sunlightColorMode = parameters['sunlightColorMode'] || 'full';
    // Time of day tints (16 stages) - RGB values, much brighter nights for visibility
    const TimeOfDayTints = [
        [120, 120, 160],  // 00:00 - Deep night (brighter with more blue)
        [115, 115, 155],  // 01:00 - Late night (brighter)
        [110, 110, 150],  // 02:00 - Midnight (brighter)
        [108, 108, 148],  // 03:00 - Deep night (brighter)
        [112, 112, 152],  // 04:00 - Pre-dawn (brighter)
        [125, 120, 145],  // 05:00 - Early dawn (brighter)
        [140, 130, 120],  // 06:00 - Dawn
        [160, 140, 100],  // 07:00 - Sunrise
        [200, 180, 140],  // 08:00 - Early morning
        [230, 220, 190],  // 09:00 - Morning
        [255, 250, 230],  // 10:00 - Late morning
        [255, 255, 245],  // 11:00 - Midday
        [255, 255, 255],  // 12:00 - Noon (no tint)
        [255, 255, 245],  // 13:00 - Early afternoon
        [255, 250, 220],  // 14:00 - Afternoon
        [250, 240, 200],  // 15:00 - Late afternoon
        [240, 210, 160],  // 16:00 - Pre-evening
        [220, 180, 120],  // 17:00 - Early evening
        [200, 160, 100],  // 18:00 - Evening
        [180, 140, 90],   // 19:00 - Sunset
        [160, 130, 110],  // 20:00 - Dusk (much brighter with blue tint)
        [150, 140, 125],  // 21:00 - Late dusk (much brighter with blue tint)
        [140, 130, 140],  // 22:00 - Early night (much brighter with blue tint)
        [130, 125, 150]   // 23:00 - Night (much brighter with blue tint)
    ];
    const FixedTints = {
        day: [255, 255, 255],    // No tint (bright daylight)
        night: [120, 120, 160],  // Night tint (hour 0)
        dusk: [180, 140, 90]      // Dusk/sunset tint (hour 19)
    };
    // Base temperature by hour (24-hour cycle) for Central Europe in spring/autumn
    const BaseHourlyTemperature = [
        8,   // 00:00 - Coldest part of night
        7,   // 01:00
        6,   // 02:00
        5,   // 03:00 - Coldest point
        6,   // 04:00
        7,   // 05:00 - Dawn warming begins
        9,   // 06:00
        12,  // 07:00 - Sunrise
        15,  // 08:00 - Morning warming
        18,  // 09:00
        21,  // 10:00
        23,  // 11:00
        25,  // 12:00 - Peak temperature
        26,  // 13:00
        25,  // 14:00
        24,  // 15:00
        22,  // 16:00 - Afternoon cooling
        20,  // 17:00
        17,  // 18:00 - Evening
        15,  // 19:00 - Sunset
        13,  // 20:00 - Dusk
        11,  // 21:00
        10,  // 22:00
        9    // 23:00 - Night cooling
    ];
    
    // Seasonal temperature modifiers
    const SeasonalModifiers = {
        WINTER: -12,  // December, January, February
        SPRING: 0,    // March, April, May (baseline)
        SUMMER: 8,    // June, July, August
        AUTUMN: -2    // September, October, November
    };
    
    // Weather temperature effects (in Celsius)
    const WeatherTemperatureEffects = {
        NONE: 0,
        RAIN: -3,    // Rain cools things down
        STORM: -5,   // Storms bring cooler temperatures
        SNOW: -8     // Snow is cold
    };
    
    // Weather probability by season for Central Europe
    const SeasonalWeather = {
        WINTER: { none: 40, rain: 20, storm: 5, snow: 35 },
        SPRING: { none: 50, rain: 35, storm: 10, snow: 5 },
        SUMMER: { none: 60, rain: 25, storm: 15, snow: 0 },
        AUTUMN: { none: 45, rain: 40, storm: 10, snow: 5 }
    };
    
    // Plugin commands
    PluginManager.registerCommand(pluginName, 'forceWeatherChange', args => {
        $gameWeather.forceRandomChange();
    });
    PluginManager.registerCommand(pluginName, 'changeSunlightMode', args => {
        const mode = args.mode || 'full';
        $gameWeather.setSunlightMode(mode);
    });
    PluginManager.registerCommand(pluginName, 'forceTimeUpdate', args => {
        $gameWeather.updateTimeAndWeather();
    });
    
    PluginManager.registerCommand(pluginName, 'forceTemperatureUpdate', args => {
        $gameWeather.updateTemperature();
    });
    
    PluginManager.registerCommand(pluginName, 'addCustomWeatherEffect', args => {
        const effectType = args.effectType || 'fireflies';
        const intensity = Number(args.intensity || 5);
        const duration = Number(args.duration || 60);
        $gameWeather.setCustomWeather(effectType, intensity, duration);
    });
    
    // Weather, Time & Temperature System Manager
    class Game_WeatherTimeSystem {
        constructor() {
            this.currentWeatherType = WeatherTypes.NONE;
            this.isInterior = false;
            this.customWeatherType = null;
            this.customWeatherIntensity = 0;
            this.currentHour = 12;
            this.currentTintIndex = 12; // Start at noon
            this.targetTintIndex = 12;
            this.sunlightMode = sunlightColorMode; // ADD THIS LINE
            this.tintTransitionProgress = 1.0;
            this.tintTransitionDuration = 60; // 1 second transition
            this.currentTemperature = 20; // Start at 20°C
            this.mapBaseTemperature = null; // Will be set by map tags
            this.mapForcedWeather = null; // Will be set by map tags
            this.initialize();
        }
        
        initialize() {
            this.updateTimeAndWeather();
        }
        getTintForMode() {
            switch (this.sunlightMode) {
                case 'day':
                    return FixedTints.day;
                case 'night':
                    return FixedTints.night;
                case 'dusk':
                    return FixedTints.dusk;
                case 'full':
                default:
                    if (this.tintTransitionProgress >= 1.0) {
                        return TimeOfDayTints[this.currentTintIndex];
                    } else {
                        const currentTint = TimeOfDayTints[this.currentTintIndex];
                        const targetTint = TimeOfDayTints[this.targetTintIndex];
                        const progress = this.tintTransitionProgress;
                        return [
                            Math.round(currentTint[0] + (targetTint[0] - currentTint[0]) * progress),
                            Math.round(currentTint[1] + (targetTint[1] - currentTint[1]) * progress),
                            Math.round(currentTint[2] + (targetTint[2] - currentTint[2]) * progress)
                        ];
                    }
            }
        }
        setSunlightMode(mode) {
            this.sunlightMode = mode;
            sunlightColorMode = mode;
            if (!this.isInterior) {
                this.updateTimeOfDayTint();
            }
            if (enableTimeDebug) {
                console.log(`Sunlight mode changed to: ${mode}`);
            }
        }

        getSunlightMode() {
            return this.sunlightMode;
        }
        updateTimeAndWeather() {
            // Get current real time
            const now = new Date();
            const newHour = now.getHours();
            
            // Update seed for weather generation
            this.dayOfYear = this.getDayOfYear(now);
            this.seed = this.dayOfYear * 24 + newHour;
            
            // Update hour if changed
            const hourChanged = this.currentHour !== newHour;
            if (hourChanged) {
                this.currentHour = newHour;
                
                // Save current hour to variable 23
                $dataSystem.variables[23] = this.currentHour;
                if ($gameVariables) {
                    $gameVariables.setValue(23, this.currentHour);
                }
                
                // Start tint transition to new hour
                this.startTintTransition(newHour);
                
                if (enableTimeDebug) {
                    console.log(`Time synchronized to: ${this.currentHour}:00`);
                }
            }
            
            // Always update temperature (accounts for weather changes)
            this.updateTemperature();
        }
        
        getDayOfYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        }
        
        getSeason() {
            const month = new Date().getMonth();
            if (month >= 2 && month <= 4) return 'SPRING';
            if (month >= 5 && month <= 7) return 'SUMMER';
            if (month >= 8 && month <= 10) return 'AUTUMN';
            return 'WINTER';
        }
        
        seededRandom() {
            // Simple seeded random using linear congruential generator
            this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
            return this.seed / 0x7fffffff;
        }
        
        changeWeather() {
            // Weather is determined by current real time, not when method is called
            const now = new Date();
            this.dayOfYear = this.getDayOfYear(now);
            this.currentHour = now.getHours();
            this.seed = this.dayOfYear * 24 + this.currentHour;
            
            const newWeather = this.determineWeather();
            this.setWeather(newWeather);
        }
        determineWeather() {
            const season = this.getSeason();
            const weatherProbs = SeasonalWeather[season];
            const random = this.seededRandom() * 100;
            
            let cumulative = 0;
            if (random < (cumulative += weatherProbs.none)) return WeatherTypes.NONE;
            if (random < (cumulative += weatherProbs.rain)) return WeatherTypes.RAIN;
            if (random < (cumulative += weatherProbs.storm)) return WeatherTypes.STORM;
            return WeatherTypes.SNOW;
        }
        updateCurrentTime() {
            const now = new Date();
            const newHour = now.getHours();
            
            if (this.currentHour !== newHour) {
                this.currentHour = newHour;
                
                // Save current hour to variable 23
                $dataSystem.variables[23] = this.currentHour;
                if ($gameVariables) {
                    $gameVariables.setValue(23, this.currentHour);
                }
                
                // Start tint transition to new hour
                this.startTintTransition(newHour);
                
                // Update temperature when hour changes
                this.updateTemperature();
                
                if (enableTimeDebug) {
                    console.log(`Time updated to: ${this.currentHour}:00`);
                }
            }
        }
        
        updateTemperature() {
            let temperature = 0;
            
            // Start with base hourly temperature
            temperature = BaseHourlyTemperature[this.currentHour];
            
            // Apply seasonal modifier
            const season = this.getSeason();
            temperature += SeasonalModifiers[season];
            
            // Apply weather effects
            temperature += WeatherTemperatureEffects[this.currentWeatherType] || 0;
            
            // Apply map base temperature if set
            if (this.mapBaseTemperature !== null) {
                // Map base temperature overrides the baseline, but still applies time/weather modifiers
                const timeVariation = BaseHourlyTemperature[this.currentHour] - 15; // 15°C is neutral
                const weatherEffect = WeatherTemperatureEffects[this.currentWeatherType] || 0;
                temperature = this.mapBaseTemperature + timeVariation + weatherEffect;
            }
            
            // Round to nearest integer
            const newTemperature = Math.round(temperature);
            
            if (this.currentTemperature !== newTemperature) {
                this.currentTemperature = newTemperature;
                
                // Save temperature to variable 61
                $dataSystem.variables[61] = this.currentTemperature;
                if ($gameVariables) {
                    $gameVariables.setValue(61, this.currentTemperature);
                }
                
                if (enableTempDebug) {
                    console.log(`Temperature updated to: ${this.currentTemperature}°C`);
                    console.log(`- Base temp: ${this.mapBaseTemperature || 'default'}`);
                    console.log(`- Season: ${season} (${SeasonalModifiers[season]}°C)`);
                    console.log(`- Weather: ${this.getWeatherName()} (${WeatherTemperatureEffects[this.currentWeatherType]}°C)`);
                }
            }
        }
        
        getWeatherName() {
            switch (this.currentWeatherType) {
                case WeatherTypes.NONE: return 'Clear';
                case WeatherTypes.RAIN: return 'Rain';
                case WeatherTypes.STORM: return 'Storm';
                case WeatherTypes.SNOW: return 'Snow';
                default: return 'Unknown';
            }
        }
        
        startTintTransition(targetHour) {
            if (this.sunlightMode !== 'full') return; // ADD THIS LINE
            this.targetTintIndex = targetHour;
            this.tintTransitionProgress = 0.0;
            if (enableTimeDebug) {
                console.log(`Starting tint transition from ${this.currentTintIndex} to ${this.targetTintIndex}`);
            }
        }
                
        updateTimeOfDayTint() {
            if (this.isInterior) {
                this.clearTimeOfDayTint();
                return;
            }
            
            // Update tint transition only in full mode
            if (this.sunlightMode === 'full' && this.tintTransitionProgress < 1.0) {
                this.tintTransitionProgress += 1.0 / this.tintTransitionDuration;
                if (this.tintTransitionProgress >= 1.0) {
                    this.tintTransitionProgress = 1.0;
                    this.currentTintIndex = this.targetTintIndex;
                }
            }
            
            // Get the appropriate tint based on mode
            const [tintR, tintG, tintB] = this.getTintForMode();
            
            // Apply the tint
            $gameScreen.startTint([tintR - 255, tintG - 255, tintB - 255, 0], 0);
        }
        
        clearTimeOfDayTint() {
            // Clear tint (reset to neutral)
            $gameScreen.startTint([0, 0, 0, 0], 30);
        }
        
        parseMapTags() {
            if (!$dataMap || !$dataMap.meta) return;
            
            // Parse base temperature tag
            this.mapBaseTemperature = null;
            if ($dataMap.meta.BaseTemp !== undefined) {
                const baseTemp = parseInt($dataMap.meta.BaseTemp);
                if (!isNaN(baseTemp)) {
                    this.mapBaseTemperature = baseTemp;
                    if (enableTempDebug) {
                        console.log(`Map base temperature set to: ${baseTemp}°C`);
                    }
                }
            }
            
            // Parse forced weather tag
            this.mapForcedWeather = null;
            if ($dataMap.meta.ForceWeather !== undefined) {
                const weatherStr = $dataMap.meta.ForceWeather.toLowerCase();
                switch (weatherStr) {
                    case 'none':
                    case 'clear':
                        this.mapForcedWeather = WeatherTypes.NONE;
                        break;
                    case 'rain':
                        this.mapForcedWeather = WeatherTypes.RAIN;
                        break;
                    case 'storm':
                        this.mapForcedWeather = WeatherTypes.STORM;
                        break;
                    case 'snow':
                        this.mapForcedWeather = WeatherTypes.SNOW;
                        break;
                }
                
                if (this.mapForcedWeather !== null && enableTimeDebug) {
                    console.log(`Map forced weather set to: ${this.getWeatherName()}`);
                }
            }
        }
        
        checkMapTags() {
            if (!$dataMap || !$dataMap.meta) return;
            
            const wasInterior = this.isInterior;
            const hasInteriorTag = !!$dataMap.meta.Interior;
            const hasExteriorTag = !!$dataMap.meta.Exterior;
            
            // If neither tag is present, assume interior
            this.isInterior = hasInteriorTag || (!hasInteriorTag && !hasExteriorTag);
            
            // Parse additional map tags
            this.parseMapTags();
            
            if (this.isInterior) {
                // Clear weather before entering interior to avoid showing for a few frames
                this.clearWeather();
                this.clearTimeOfDayTint();
                // Update temperature for interior (no weather effects)
                this.updateTemperature();
            } else if (hasExteriorTag) {
                // Entering exterior map - synchronize with real time
                this.updateTimeAndWeather();
                
                if (wasInterior) {
                    // Coming from interior, immediately apply current time tint
                    this.currentTintIndex = this.currentHour;
                    this.targetTintIndex = this.currentHour;
                    this.tintTransitionProgress = 1.0;
                }
                
                // Update time and tint
                this.updateTimeOfDayTint();
                
                // Check for weather change (unless forced)
                if (this.mapForcedWeather !== null) {
                    // Use forced weather
                    this.setWeather(this.mapForcedWeather);
                } else if (Math.random() * 100 < weatherChangeChance) {
                    // Normal weather change based on real time
                    this.changeWeather();
                }
            }
        }
        
        forceRandomChange() {
            // Force a true random change instead of seeded (ignores map forced weather)
            const types = [WeatherTypes.NONE, WeatherTypes.RAIN, WeatherTypes.STORM, WeatherTypes.SNOW];
            const newWeather = types[Math.floor(Math.random() * types.length)];
            this.setWeather(newWeather);
        }
        
        forceTimeUpdate() {
            this.updateTimeAndWeather();
            this.updateTimeOfDayTint();
        }
        
        setWeather(weatherType) {
            if (this.isInterior) return; // Don't set weather in interior
            
            const oldWeather = this.currentWeatherType;
            this.currentWeatherType = weatherType;
            
            // Apply RPG Maker MZ weather effects
            switch (weatherType) {
                case WeatherTypes.NONE:
                    $gameScreen.changeWeather('none', 0, 60);
                    break;
                case WeatherTypes.RAIN:
                    $gameScreen.changeWeather('rain', 7, 60);
                    break;
                case WeatherTypes.STORM:
                    $gameScreen.changeWeather('storm', 9, 60);
                    break;
                case WeatherTypes.SNOW:
                    $gameScreen.changeWeather('snow', 5, 60);
                    break;
            }
            
            this.applyStatusEffects();
            
            // Update temperature if weather changed
            if (oldWeather !== weatherType) {
                this.updateTemperature();
            }
        }
        
        clearWeather() {
            this.currentWeatherType = WeatherTypes.NONE;
            $gameScreen.changeWeather('none', 0, 0); // Immediate clear to avoid showing in interior
            this.removeAllWeatherEffects();
            this.clearCustomWeather();
        }
        
        applyStatusEffects() {
            if (this.isInterior) return;
            
            $gameParty.members().forEach(actor => {
                // Remove all weather effects first
                this.removeWeatherEffects(actor);
                
                // Apply current weather effect
                switch (this.currentWeatherType) {
                    case WeatherTypes.RAIN:
                        actor.addState(StatusEffects.RAIN);
                        break;
                    case WeatherTypes.STORM:
                        actor.addState(StatusEffects.STORM);
                        break;
                    case WeatherTypes.SNOW:
                        actor.addState(StatusEffects.SNOW);
                        break;
                }
            });
        }
        
        removeWeatherEffects(actor) {
            actor.removeState(StatusEffects.RAIN);
            actor.removeState(StatusEffects.STORM);
            actor.removeState(StatusEffects.SNOW);
        }
        
        removeAllWeatherEffects() {
            $gameParty.members().forEach(actor => {
                this.removeWeatherEffects(actor);
            });
        }
        
        update() {
            // Only update tint transition - no periodic time updates
            this.updateTimeOfDayTint();
        }
        
        setCustomWeather(type, intensity, duration) {
            if (this.isInterior) return; // Don't set custom weather in interior
            
            this.customWeatherType = type;
            this.customWeatherIntensity = intensity;
            
            // Clear standard weather when using custom effects
            $gameScreen.changeWeather('none', 0, 30);
            
            // Apply custom weather through Spriteset_Map
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                SceneManager._scene._spriteset.setCustomWeather(type, intensity, duration);
            }
        }
        
        clearCustomWeather() {
            this.customWeatherType = null;
            this.customWeatherIntensity = 0;
            
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                SceneManager._scene._spriteset.clearCustomWeather();
            }
        }
    }
    
    // Global weather system object
    window.$gameWeather = null;
    
    // Create weather system on new game
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameWeather = new Game_WeatherTimeSystem();
    };
    
    // Save/Load weather system
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.weather = $gameWeather;
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameWeather = contents.weather || new Game_WeatherTimeSystem();
        // ADD THIS: Restore sunlight mode from save
        if ($gameWeather && !$gameWeather.sunlightMode) {
            $gameWeather.sunlightMode = sunlightColorMode;
        }
    };
    
    // Check weather and time on map load
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        if ($gameWeather) {
            // Synchronize time with real clock and check map settings
            $gameWeather.updateTimeAndWeather();
            $gameWeather.checkMapTags();
        }
    };
    
    // Update weather and time system
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if ($gameWeather) {
            $gameWeather.update();
        }
    };
    
    // Initialize on game start
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if (!$gameWeather) {
            $gameWeather = new Game_WeatherTimeSystem();
        }
    };
    // Hook into options to add Sunlight Color Mode
const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function() {
    _Window_Options_makeCommandList.call(this);
    this.addCommand('Sunlight Color', 'sunlightColor');
};

const _Window_Options_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    if (symbol === 'sunlightColor') {
        const mode = this.getSunlightColorMode();
        switch(mode) {
            case 'full': return 'Full Cycle';
            case 'day': return 'Day Only';
            case 'night': return 'Night Only';
            case 'dusk': return 'Dusk Only';
            default: return 'Full Cycle';
        }
    }
    return _Window_Options_statusText.call(this, index);
};

Window_Options.prototype.getSunlightColorMode = function() {
    if ($gameWeather) {
        return $gameWeather.getSunlightMode();
    }
    return sunlightColorMode;
};

const _Window_Options_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === 'sunlightColor') {
        const currentMode = this.getSunlightColorMode();
        const modes = ['full', 'day', 'night', 'dusk'];
        const currentIndex = modes.indexOf(currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];
        
        if ($gameWeather) {
            $gameWeather.setSunlightMode(nextMode);
        }
        sunlightColorMode = nextMode;
        
        this.redrawItem(index);
        this.playCursorSound();
        return;
    }
    _Window_Options_processOk.call(this);
};

const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function(wrap) {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === 'sunlightColor') {
        const currentMode = this.getSunlightColorMode();
        const modes = ['full', 'day', 'night', 'dusk'];
        const currentIndex = modes.indexOf(currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const nextMode = modes[nextIndex];
        
        if ($gameWeather) {
            $gameWeather.setSunlightMode(nextMode);
        }
        sunlightColorMode = nextMode;
        
        this.redrawItem(index);
        this.playCursorSound();
        return;
    }
    _Window_Options_cursorRight.call(this, wrap);
};

const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function(wrap) {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (symbol === 'sunlightColor') {
        const currentMode = this.getSunlightColorMode();
        const modes = ['full', 'day', 'night', 'dusk'];
        const currentIndex = modes.indexOf(currentMode);
        const nextIndex = currentIndex - 1 < 0 ? modes.length - 1 : currentIndex - 1;
        const nextMode = modes[nextIndex];
        
        if ($gameWeather) {
            $gameWeather.setSunlightMode(nextMode);
        }
        sunlightColorMode = nextMode;
        
        this.redrawItem(index);
        this.playCursorSound();
        return;
    }
    _Window_Options_cursorLeft.call(this, wrap);
};
    // Custom Weather Particle System (keeping all existing custom weather effects)
    class Weather_CustomParticle extends PIXI.Sprite {
        constructor(texture, config) {
            super(texture);
            this.config = config;
            this.reset();
        }
        
        reset() {
            // Override in subclasses
        }
        
        update() {
            // Override in subclasses
        }
    }
    
    // Custom Weather Layer
    class Weather_CustomLayer extends PIXI.Container {
        constructor() {
            super();
            this.particles = [];
            this.maxParticles = 100;
            this.intensity = 5;
            this.effectType = null;
            this.targetIntensity = 5;
            this.transitionDuration = 60;
            this.transitionTime = 0;
        }
        
        setWeather(type, intensity, duration) {
            this.effectType = type;
            this.targetIntensity = intensity;
            this.transitionDuration = duration;
            this.transitionTime = 0;
            this.maxParticles = this.getMaxParticles(type, intensity);
            
            // Clear existing particles
            this.clearParticles();
            
            // Create new particles
            this.createParticles();
        }
        
        getMaxParticles(type, intensity) {
            const base = {
                fireflies: 20,
                pollen: 40,
                leaves: 15,
                sakura: 30,
                dust: 60,
                ash: 50,
                magic: 35,
                bubbles: 25,
                embers: 40,
                aurora: 10
            };
            return Math.floor((base[type] || 30) * (intensity / 5));
        }
        
        clearParticles() {
            this.particles.forEach(p => this.removeChild(p));
            this.particles = [];
        }
        
        createParticles() {
            for (let i = 0; i < this.maxParticles; i++) {
                const particle = this.createParticle();
                if (particle) {
                    this.particles.push(particle);
                    this.addChild(particle);
                }
            }
        }
        
        createParticle() {
            switch (this.effectType) {
                case 'fireflies': return this.createFirefly();
                case 'pollen': return this.createPollen();
                case 'leaves': return this.createLeaf();
                case 'sakura': return this.createSakuraPetal();
                case 'dust': return this.createDust();
                case 'ash': return this.createAsh();
                case 'magic': return this.createMagicParticle();
                case 'bubbles': return this.createBubble();
                case 'embers': return this.createEmber();
                case 'aurora': return this.createAurora();
                default: return null;
            }
        }
        
        createFirefly() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF88, 1);
            graphics.drawCircle(0, 0, 2);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const firefly = new Weather_CustomParticle(texture, {
                speed: 0.5 + Math.random() * 0.5,
                glowPhase: Math.random() * Math.PI * 2,
                wanderAngle: Math.random() * Math.PI * 2,
                baseAlpha: 0.8 + Math.random() * 0.2
            });
            
            firefly.reset = function() {
                this.x = Math.random() * Graphics.width;
                this.y = Math.random() * Graphics.height;
                this.vx = 0;
                this.vy = 0;
            };
            
            firefly.update = function() {
                // Wandering movement
                this.config.wanderAngle += (Math.random() - 0.5) * 0.1;
                this.vx += Math.cos(this.config.wanderAngle) * this.config.speed * 0.1;
                this.vy += Math.sin(this.config.wanderAngle) * this.config.speed * 0.1;
                
                // Apply friction
                this.vx *= 0.98;
                this.vy *= 0.98;
                
                this.x += this.vx;
                this.y += this.vy;
                
                // Glowing effect
                this.config.glowPhase += 0.05;
                this.alpha = this.config.baseAlpha * (0.5 + 0.5 * Math.sin(this.config.glowPhase));
                
                // Wrap around screen
                if (this.x < -10) this.x = Graphics.width + 10;
                if (this.x > Graphics.width + 10) this.x = -10;
                if (this.y < -10) this.y = Graphics.height + 10;
                if (this.y > Graphics.height + 10) this.y = -10;
            };
            
            firefly.reset();
            return firefly;
        }
        
        createPollen() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFFCC, 0.8);
            graphics.drawCircle(0, 0, 1.5);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const pollen = new Weather_CustomParticle(texture, {
                floatSpeed: 0.3 + Math.random() * 0.4,
                swayAmount: 2 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            });
            
            pollen.reset = function() {
                this.x = Math.random() * Graphics.width;
                this.y = -10;
                this.baseX = this.x;
            };
            
            pollen.update = function() {
                this.y += this.config.floatSpeed;
                this.config.phase += 0.02;
                this.x = this.baseX + Math.sin(this.config.phase) * this.config.swayAmount;
                
                if (this.y > Graphics.height + 10) {
                    this.reset();
                }
            };
            
            pollen.reset();
            return pollen;
        }
        
        createLeaf() {
            const graphics = new PIXI.Graphics();
            const leafColors = [0x8B7355, 0xCD853F, 0xD2691E, 0xFF8C00];
            const color = leafColors[Math.floor(Math.random() * leafColors.length)];
            
            graphics.beginFill(color, 0.9);
            graphics.moveTo(0, -4);
            graphics.quadraticCurveTo(3, 0, 0, 4);
            graphics.quadraticCurveTo(-3, 0, 0, -4);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const leaf = new Weather_CustomParticle(texture, {
                fallSpeed: 1 + Math.random() * 1.5,
                swaySpeed: 0.02 + Math.random() * 0.02,
                swayAmount: 30 + Math.random() * 20,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                phase: Math.random() * Math.PI * 2
            });
            
            leaf.anchor.set(0.5);
            
            leaf.reset = function() {
                this.x = Math.random() * (Graphics.width + 200) - 100;
                this.y = -20;
                this.baseX = this.x;
                this.scale.set(0.8 + Math.random() * 0.4);
            };
            
            leaf.update = function() {
                this.y += this.config.fallSpeed;
                this.config.phase += this.config.swaySpeed;
                this.x = this.baseX + Math.sin(this.config.phase) * this.config.swayAmount;
                this.rotation += this.config.rotationSpeed;
                
                if (this.y > Graphics.height + 20) {
                    this.reset();
                }
            };
            
            leaf.reset();
            return leaf;
        }
        
        createSakuraPetal() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFB7C5, 0.9);
            graphics.moveTo(0, -3);
            graphics.quadraticCurveTo(2, -1, 2, 1);
            graphics.quadraticCurveTo(0, 3, -2, 1);
            graphics.quadraticCurveTo(-2, -1, 0, -3);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const petal = new Weather_CustomParticle(texture, {
                fallSpeed: 0.5 + Math.random() * 0.5,
                spinSpeed: 0.02 + Math.random() * 0.03,
                swayAmount: 20 + Math.random() * 20,
                phase: Math.random() * Math.PI * 2
            });
            
            petal.anchor.set(0.5);
            
            petal.reset = function() {
                this.x = Math.random() * (Graphics.width + 100) - 50;
                this.y = -10;
                this.baseX = this.x;
                this.scale.set(0.7 + Math.random() * 0.3);
            };
            
            petal.update = function() {
                this.y += this.config.fallSpeed;
                this.config.phase += this.config.spinSpeed;
                this.x = this.baseX + Math.sin(this.config.phase * 2) * this.config.swayAmount;
                this.rotation = Math.sin(this.config.phase) * 0.5;
                
                if (this.y > Graphics.height + 10) {
                    this.reset();
                }
            };
            
            petal.reset();
            return petal;
        }
        
        createDust() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xD2B48C, 0.3);
            graphics.drawCircle(0, 0, 1 + Math.random() * 2);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const dust = new Weather_CustomParticle(texture, {
                speedX: 2 + Math.random() * 3,
                speedY: (Math.random() - 0.5) * 0.5,
                fadeSpeed: 0.002 + Math.random() * 0.003
            });
            
            dust.reset = function() {
                this.x = -20;
                this.y = Math.random() * Graphics.height;
                this.alpha = 0.3 + Math.random() * 0.3;
                this.scale.set(1 + Math.random());
            };
            
            dust.update = function() {
                this.x += this.config.speedX;
                this.y += this.config.speedY;
                this.alpha -= this.config.fadeSpeed;
                
                if (this.x > Graphics.width + 20 || this.alpha <= 0) {
                    this.reset();
                }
            };
            
            dust.reset();
            return dust;
        }
        
        createAsh() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0x808080, 0.7);
            graphics.drawRect(-1, -1, 2, 2);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const ash = new Weather_CustomParticle(texture, {
                fallSpeed: 0.3 + Math.random() * 0.4,
                driftSpeed: (Math.random() - 0.5) * 0.5,
                rotationSpeed: (Math.random() - 0.5) * 0.05
            });
            
            ash.reset = function() {
                this.x = Math.random() * Graphics.width;
                this.y = -10;
                this.alpha = 0.4 + Math.random() * 0.4;
            };
            
            ash.update = function() {
                this.y += this.config.fallSpeed;
                this.x += this.config.driftSpeed;
                this.rotation += this.config.rotationSpeed;
                
                if (this.y > Graphics.height + 10) {
                    this.reset();
                }
            };
            
            ash.reset();
            return ash;
        }
        
        createMagicParticle() {
            const graphics = new PIXI.Graphics();
            const colors = [0xFF00FF, 0x00FFFF, 0xFFFF00, 0x00FF00];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            graphics.beginFill(color, 1);
            graphics.drawStar(0, 0, 4, 3, 2);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const magic = new Weather_CustomParticle(texture, {
                orbitRadius: 50 + Math.random() * 100,
                orbitSpeed: 0.02 + Math.random() * 0.03,
                centerX: Math.random() * Graphics.width,
                centerY: Math.random() * Graphics.height,
                phase: Math.random() * Math.PI * 2,
                pulsePhase: Math.random() * Math.PI * 2
            });
            
            magic.anchor.set(0.5);
            
            magic.reset = function() {
                this.scale.set(0.5 + Math.random() * 0.5);
            };
            
            magic.update = function() {
                this.config.phase += this.config.orbitSpeed;
                this.x = this.config.centerX + Math.cos(this.config.phase) * this.config.orbitRadius;
                this.y = this.config.centerY + Math.sin(this.config.phase) * this.config.orbitRadius * 0.5;
                
                this.config.pulsePhase += 0.05;
                this.alpha = 0.5 + 0.5 * Math.sin(this.config.pulsePhase);
                this.rotation += 0.05;
                
                // Slowly drift center
                this.config.centerX += (Math.random() - 0.5) * 0.5;
                this.config.centerY += (Math.random() - 0.5) * 0.5;
                
                // Wrap center position
                if (this.config.centerX < -100) this.config.centerX = Graphics.width + 100;
                if (this.config.centerX > Graphics.width + 100) this.config.centerX = -100;
                if (this.config.centerY < -100) this.config.centerY = Graphics.height + 100;
                if (this.config.centerY > Graphics.height + 100) this.config.centerY = -100;
            };
            
            magic.reset();
            return magic;
        }
        
        createBubble() {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(1, 0xFFFFFF, 0.5);
            graphics.beginFill(0xFFFFFF, 0.1);
            graphics.drawCircle(0, 0, 5);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const bubble = new Weather_CustomParticle(texture, {
                riseSpeed: 0.5 + Math.random() * 0.5,
                wobbleSpeed: 0.03 + Math.random() * 0.02,
                wobbleAmount: 10 + Math.random() * 10,
                phase: Math.random() * Math.PI * 2,
                popTimer: 300 + Math.random() * 300
            });
            
            bubble.reset = function() {
                this.x = Math.random() * Graphics.width;
                this.y = Graphics.height + 20;
                this.baseX = this.x;
                this.scale.set(0.5 + Math.random() * 1);
                this.config.popTimer = 300 + Math.random() * 300;
            };
            
            bubble.update = function() {
                this.y -= this.config.riseSpeed;
                this.config.phase += this.config.wobbleSpeed;
                this.x = this.baseX + Math.sin(this.config.phase) * this.config.wobbleAmount;
                
                this.config.popTimer--;
                
                if (this.y < -20 || this.config.popTimer <= 0) {
                    // Pop effect
                    if (this.config.popTimer <= 0) {
                        this.scale.x += 0.1;
                        this.scale.y += 0.1;
                        this.alpha -= 0.1;
                        if (this.alpha <= 0) {
                            this.reset();
                        }
                    } else {
                        this.reset();
                    }
                }
            };
            
            bubble.reset();
            return bubble;
        }
        
        createEmber() {
            const graphics = new PIXI.Graphics();
            graphics.beginFill(0xFF4500, 1);
            graphics.drawCircle(0, 0, 2);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const ember = new Weather_CustomParticle(texture, {
                riseSpeed: 1 + Math.random() * 1.5,
                driftX: (Math.random() - 0.5) * 2,
                lifespan: 200 + Math.random() * 200,
                currentLife: 0
            });
            
            ember.reset = function() {
                this.x = Math.random() * Graphics.width;
                this.y = Graphics.height + 10;
                this.config.currentLife = 0;
                this.alpha = 1;
                this.scale.set(1);
            };
            
            ember.update = function() {
                this.y -= this.config.riseSpeed;
                this.x += this.config.driftX + (Math.random() - 0.5) * 0.5;
                
                this.config.currentLife++;
                const lifeRatio = this.config.currentLife / this.config.lifespan;
                
                // Fade and shrink over time
                this.alpha = 1 - lifeRatio;
                this.scale.set(1 - lifeRatio * 0.5);
                
                // Color transition from orange to red to dark
                const color = this.interpolateColor(0xFF4500, 0x8B0000, lifeRatio);
                this.tint = color;
                
                if (this.config.currentLife >= this.config.lifespan || this.y < -10) {
                    this.reset();
                }
            };
            
            ember.interpolateColor = function(color1, color2, ratio) {
                const r1 = (color1 >> 16) & 255;
                const g1 = (color1 >> 8) & 255;
                const b1 = color1 & 255;
                
                const r2 = (color2 >> 16) & 255;
                const g2 = (color2 >> 8) & 255;
                const b2 = color2 & 255;
                
                const r = Math.round(r1 + (r2 - r1) * ratio);
                const g = Math.round(g1 + (g2 - g1) * ratio);
                const b = Math.round(b1 + (b2 - b1) * ratio);
                
                return (r << 16) + (g << 8) + b;
            };
            
            ember.reset();
            return ember;
        }
        
        createAurora() {
            const graphics = new PIXI.Graphics();
            const width = Graphics.width / 10;
            const height = 100 + Math.random() * 100;
            
            // Create gradient-like aurora band
            const colors = [0x00FF00, 0x00FFFF, 0xFF00FF, 0x0000FF];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            graphics.beginFill(color, 0.3);
            graphics.drawRect(0, 0, width, height);
            graphics.endFill();
            
            const texture = Graphics.app.renderer.generateTexture(graphics);
            const aurora = new Weather_CustomParticle(texture, {
                waveSpeed: 0.01 + Math.random() * 0.02,
                waveAmount: 20 + Math.random() * 30,
                phase: Math.random() * Math.PI * 2,
                baseY: Math.random() * Graphics.height * 0.5,
                fadePhase: Math.random() * Math.PI * 2
            });
            
            aurora.reset = function() {
                this.x = Math.floor(Math.random() * 10) * (Graphics.width / 10);
                this.y = this.config.baseY;
            };
            
            aurora.update = function() {
                this.config.phase += this.config.waveSpeed;
                this.y = this.config.baseY + Math.sin(this.config.phase) * this.config.waveAmount;
                
                this.config.fadePhase += 0.02;
                this.alpha = 0.1 + 0.2 * Math.sin(this.config.fadePhase);
                
                // Slight horizontal drift
                this.x += Math.sin(this.config.phase * 0.5) * 0.5;
            };
            
            aurora.reset();
            return aurora;
        }
        
        update() {
            // Update transition
            if (this.transitionTime < this.transitionDuration) {
                this.transitionTime++;
                const ratio = this.transitionTime / this.transitionDuration;
                this.intensity = this.intensity + (this.targetIntensity - this.intensity) * ratio;
                this.alpha = this.intensity / 10;
            }
            
            // Update all particles
            this.particles.forEach(particle => {
                if (particle.update) {
                    particle.update();
                }
            });
        }
        
        clear() {
            this.clearParticles();
            this.effectType = null;
        }
    }
    
    // Extend Spriteset_Map to include custom weather
    const _Spriteset_Map_createWeather = Spriteset_Map.prototype.createWeather;
    Spriteset_Map.prototype.createWeather = function() {
        _Spriteset_Map_createWeather.call(this);
        this._customWeatherLayer = new Weather_CustomLayer();
        this.addChild(this._customWeatherLayer);
    };
    
    const _Spriteset_Map_updateWeather = Spriteset_Map.prototype.updateWeather;
    Spriteset_Map.prototype.updateWeather = function() {
        _Spriteset_Map_updateWeather.call(this);
        if (this._customWeatherLayer) {
            this._customWeatherLayer.update();
        }
    };
    
    Spriteset_Map.prototype.setCustomWeather = function(type, intensity, duration) {
        if (this._customWeatherLayer) {
            this._customWeatherLayer.setWeather(type, intensity, duration);
        }
    };
    
    Spriteset_Map.prototype.clearCustomWeather = function() {
        if (this._customWeatherLayer) {
            this._customWeatherLayer.clear();
        }
    };
    
    // Clear custom weather when entering interior
    const _Game_WeatherTimeSystem_clearWeather = Game_WeatherTimeSystem.prototype.clearWeather;
    Game_WeatherTimeSystem.prototype.clearWeather = function() {
        _Game_WeatherTimeSystem_clearWeather.call(this);
        this.clearCustomWeather();
    };
    
})();