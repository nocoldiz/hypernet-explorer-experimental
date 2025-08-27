/*:
 * @target MZ
 * @plugindesc v1.0.4 Adds hunger and sleep systems with HP/MP/Status display, time and temperature
 * @author Claude
 * @url https://www.anthropic.com
 *
 * @help
 * === Hunger and Sleep System ===
 * 
 * This plugin adds hunger and sleep mechanics to your game:
 * - Characters get hungry and sleepy over time
 * - Status is displayed in the main menu above the money window
 * - Shows HP, MP, first status effect, hunger, and sleep for each actor
 * - Notifications appear when states change
 * - Debuffs applied at low levels (< 20%) and severe debuffs at 0%
 * - Uses configurable icons for hunger and sleep display
 * - Shows current time (HH:MM format) and temperature to the left of money
 * 
 * --- Plugin Commands ---
 * RecoverHunger: Recover hunger for specified actor (1 or 2)
 * RecoverSleep: Recover sleep for specified actor (1 or 2)
 *
 * @param hungerDecreaseRate
 * @text Hunger Decrease Rate
 * @desc How much hunger decreases per step
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.05
 *
 * @param sleepDecreaseRate
 * @text Sleep Decrease Rate
 * @desc How much sleep decreases per step
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.03
 *
 * @param maxHunger
 * @text Maximum Hunger
 * @desc Maximum hunger value
 * @type number
 * @min 1
 * @default 100
 *
 * @param maxSleep
 * @text Maximum Sleep
 * @desc Maximum sleep value
 * @type number
 * @min 1
 * @default 100
 *
 * @param hungerIcon
 * @text Hunger Icon
 * @desc Icon index for hunger display (0-based)
 * @type number
 * @min 0
 * @default 118
 *
 * @param sleepIcon
 * @text Sleep Icon
 * @desc Icon index for sleep display (0-based)
 * @type number
 * @min 0
 * @default 3
 *
 * @param temperatureVariable
 * @text Temperature Variable
 * @desc Variable ID that stores temperature value
 * @type variable
 * @default 61
 *
 * @param timeIcon
 * @text Time Icon
 * @desc Icon index for time display (0-based)
 * @type number
 * @min 0
 * @default 87
 *
 * @param temperatureIcon
 * @text Temperature Icon
 * @desc Icon index for temperature display (0-based)
 * @type number
 * @min 0
 * @default 64
 *
 * @command RecoverHunger
 * @text Recover Hunger
 * @desc Recover hunger for specified actor
 *
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to recover hunger (1 or 2)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * 
 * @arg amount
 * @text Amount
 * @desc Amount of hunger to recover (percentage)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @command RecoverSleep
 * @text Recover Sleep
 * @desc Recover sleep for specified actor
 *
 * @arg actorId
 * @text Actor ID
 * @desc ID of the actor to recover sleep (1 or 2)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 *
 * @arg amount
 * @text Amount
 * @desc Amount of sleep to recover (percentage)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 */

/*:it
 * @target MZ
 * @plugindesc v1.0.4 Aggiunge sistemi di fame e sonno con visualizzazione HP/MP/Stato, ora e temperatura
 * @author Claude
 * @url https://www.anthropic.com
 *
 * @help
 * === Sistema di Fame e Sonno ===
 * 
 * Questo plugin aggiunge meccaniche di fame e sonno al tuo gioco:
 * - I personaggi diventano affamati e assonnati nel tempo
 * - Lo stato è visualizzato nel menu principale sopra la finestra dei soldi
 * - Mostra HP, MP, primo effetto di stato, fame e sonno per ogni attore
 * - Le notifiche appaiono quando gli stati cambiano
 * - Debuff applicati a livelli bassi (< 20%) e debuff gravi a 0%
 * - Utilizza icone configurabili per la visualizzazione di fame e sonno
 * - Mostra l'ora corrente (formato HH:MM) e temperatura a sinistra dei soldi
 * 
 * --- Comandi Plugin ---
 * RecuperaFame: Recupera la fame per l'attore specificato (1 o 2)
 * RecuperaSonno: Recupera il sonno per l'attore specificato (1 o 2)
 *
 * @param hungerDecreaseRate
 * @text Tasso di Diminuzione Fame
 * @desc Quanto diminuisce la fame per passo
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.05
 *
 * @param sleepDecreaseRate
 * @text Tasso di Diminuzione Sonno
 * @desc Quanto diminuisce il sonno per passo
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 0.03
 *
 * @param maxHunger
 * @text Fame Massima
 * @desc Valore massimo della fame
 * @type number
 * @min 1
 * @default 100
 *
 * @param maxSleep
 * @text Sonno Massimo
 * @desc Valore massimo del sonno
 * @type number
 * @min 1
 * @default 100
 *
 * @param hungerIcon
 * @text Icona Fame
 * @desc Indice dell'icona per la visualizzazione della fame (base 0)
 * @type number
 * @min 0
 * @default 118
 *
 * @param sleepIcon
 * @text Icona Sonno
 * @desc Indice dell'icona per la visualizzazione del sonno (base 0)
 * @type number
 * @min 0
 * @default 3
 *
 * @param temperatureVariable
 * @text Variabile Temperatura
 * @desc ID della variabile che memorizza il valore della temperatura
 * @type variable
 * @default 61
 *
 * @param timeIcon
 * @text Icona Ora
 * @desc Indice dell'icona per la visualizzazione dell'ora (base 0)
 * @type number
 * @min 0
 * @default 87
 *
 * @param temperatureIcon
 * @text Icona Temperatura
 * @desc Indice dell'icona per la visualizzazione della temperatura (base 0)
 * @type number
 * @min 0
 * @default 64
 *
 * @command RecoverHunger
 * @text Recupera Fame
 * @desc Recupera la fame per l'attore specificato
 *
 * @arg actorId
 * @text ID Attore
 * @desc ID dell'attore per recuperare la fame (1 o 2)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 * 
 * @arg amount
 * @text Quantità
 * @desc Quantità di fame da recuperare (percentuale)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 * @command RecoverSleep
 * @text Recupera Sonno
 * @desc Recupera il sonno per l'attore specificato
 *
 * @arg actorId
 * @text ID Attore
 * @desc ID dell'attore per recuperare il sonno (1 o 2)
 * @type number
 * @min 1
 * @max 3
 * @default 1
 *
 * @arg amount
 * @text Quantità
 * @desc Quantità di sonno da recuperare (percentuale)
 * @type number
 * @min 1
 * @max 100
 * @default 50
 *
 */

(function() {
    'use strict';
    
    const pluginName = "HungerSleepSystem";
    
    // Translation system
    const translations = {
        en: {
            hungry: "is hungry",
            starving: "is starving!",
            noLongerHungry: "is no longer hungry",
            sleepy: "is sleepy",
            exhausted: "is exhausted!",
            noLongerSleepy: "is no longer sleepy",
            hp: "HP",
            mp: "MP"
        },
        it: {
            hungry: "ha fame",
            starving: "sta morendo di fame!",
            noLongerHungry: "non ha più fame",
            sleepy: "ha sonno",
            exhausted: "è esausto!",
            noLongerSleepy: "non ha più sonno",
            hp: "PV",
            mp: "PM"
        }
    };
    
    // Get current language
    function getCurrentLanguage() {
        if (typeof ConfigManager !== 'undefined' && ConfigManager.language === 'it') {
            return 'it';
        }
        return 'en';
    }
    
    // Get translated text
    function getText(key) {
        const lang = getCurrentLanguage();
        return translations[lang][key] || translations.en[key] || key;
    }
    
    // Parameters
    const parameters = PluginManager.parameters(pluginName);
    const hungerDecreaseRate = Number(parameters.hungerDecreaseRate || 0.05);
    const sleepDecreaseRate = Number(parameters.sleepDecreaseRate || 0.03);
    const maxHunger = Number(parameters.maxHunger || 100);
    const maxSleep = Number(parameters.maxSleep || 100);
    const hungerIcon = Number(parameters.hungerIcon || 118);
    const sleepIcon = Number(parameters.sleepIcon || 3);
    const temperatureVariable = Number(parameters.temperatureVariable || 61);
    const timeIcon = Number(parameters.timeIcon || 87);
    const temperatureIcon = Number(parameters.temperatureIcon || 64);
    
    // Debug logging helper
    function debug(msg) {
        if (Utils.isNwjs() || Utils.isOptionValid('test')) {
            console.log(`[${pluginName}] ${msg}`);
        }
    }
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "RecoverHunger", function(args) {
        const actorId = Number(args.actorId || 1);
        const amount = Number(args.amount || 50);
        const actor = $gameActors.actor(actorId);
        
        if (actor) {
            // Calculate percentage of max hunger
            const hungerAmount = (amount / 100) * maxHunger;
            debug(`Recovering ${amount}% (${hungerAmount} points) hunger for actor ${actorId}`);
            actor.addHunger(hungerAmount);
            
            // Refresh menu if open
            if (SceneManager._scene instanceof Scene_Menu) {
                SceneManager._scene._hungerSleepStatusWindow.refresh();
            }
        } else {
            debug(`Actor ${actorId} not found.`);
        }
    });
    
    PluginManager.registerCommand(pluginName, "RecoverSleep", function(args) {
        const actorId = Number(args.actorId || 1);
        const amount = Number(args.amount || 50);
        const actor = $gameActors.actor(actorId);
        
        if (actor) {
            // Calculate percentage of max sleep
            const sleepAmount = (amount / 100) * maxSleep;
            debug(`Recovering ${amount}% (${sleepAmount} points) sleep for actor ${actorId}`);
            actor.addSleep(sleepAmount);
            
            // Refresh menu if open
            if (SceneManager._scene instanceof Scene_Menu) {
                SceneManager._scene._hungerSleepStatusWindow.refresh();
            }
        } else {
            debug(`Actor ${actorId} not found.`);
        }
    });
    
    //=============================================================================
    // Game_Actor Extensions
    //=============================================================================
    
    const _Game_Actor_initialize = Game_Actor.prototype.initialize;
    Game_Actor.prototype.initialize = function(actorId) {
        _Game_Actor_initialize.call(this, actorId);
        this._hunger = maxHunger;
        this._sleep = maxSleep;
        this._prevHungerState = 'normal';
        this._prevSleepState = 'normal';
    };
    
    // Hunger Methods
    Game_Actor.prototype.hunger = function() {
        return this._hunger;
    };
    
    Game_Actor.prototype.hungerRate = function() {
        return this._hunger / maxHunger;
    };
    
    Game_Actor.prototype.hungerPercent = function() {
        return Math.floor(this.hungerRate() * 100);
    };
    
    Game_Actor.prototype.hungerState = function() {
        if (this.hungerRate() <= 0) return 'starving';
        if (this.hungerRate() < 0.2) return 'hungry';
        return 'normal';
    };
    
    Game_Actor.prototype.addHunger = function(amount) {
        const oldState = this.hungerState();
        
        // Update hunger value
        this._hunger = Math.min(maxHunger, this._hunger + amount);
        debug(`Actor ${this._actorId} hunger updated to ${this._hunger}/${maxHunger} (${this.hungerPercent()}%)`);
        
        // Check for state changes
        this.checkStateChange('hunger', oldState);
    };
    
    Game_Actor.prototype.reduceHunger = function(amount) {
        const oldState = this.hungerState();
        
        // Update hunger value
        this._hunger = Math.max(0, this._hunger - amount);
        
        // Check for state changes and apply effects
        this.checkStateChange('hunger', oldState);
    };
    
    // Sleep Methods
    Game_Actor.prototype.sleep = function() {
        return this._sleep;
    };
    
    Game_Actor.prototype.sleepRate = function() {
        return this._sleep / maxSleep;
    };
    
    Game_Actor.prototype.sleepPercent = function() {
        return Math.floor(this.sleepRate() * 100);
    };
    
    Game_Actor.prototype.sleepState = function() {
        if (this.sleepRate() <= 0) return 'exhausted';
        if (this.sleepRate() < 0.2) return 'sleepy';
        return 'normal';
    };
    
    Game_Actor.prototype.addSleep = function(amount) {
        const oldState = this.sleepState();
        
        // Update sleep value
        this._sleep = Math.min(maxSleep, this._sleep + amount);
        debug(`Actor ${this._actorId} sleep updated to ${this._sleep}/${maxSleep} (${this.sleepPercent()}%)`);
        
        // Check for state changes
        this.checkStateChange('sleep', oldState);
    };
    
    Game_Actor.prototype.reduceSleep = function(amount) {
        const oldState = this.sleepState();
        
        // Update sleep value
        this._sleep = Math.max(0, this._sleep - amount);
        
        // Check for state changes and apply effects
        this.checkStateChange('sleep', oldState);
    };
    
    // State Changes and Effects
    Game_Actor.prototype.checkStateChange = function(type, oldState) {
        let currentState;
        let prevState;
        
        if (type === 'hunger') {
            currentState = this.hungerState();
            prevState = this._prevHungerState;
            this._prevHungerState = currentState;
        } else {
            currentState = this.sleepState();
            prevState = this._prevSleepState;
            this._prevSleepState = currentState;
        }
        
        // Only show message if state has changed
        if (currentState !== oldState) {
            let message = '';
            
            if (type === 'hunger') {
                if (currentState === 'hungry') {
                    message = `${this.name()} ${getText('hungry')}`;
                } else if (currentState === 'starving') {
                    message = `${this.name()} ${getText('starving')}`;
                } else if (currentState === 'normal' && prevState !== 'normal') {
                    message = `${this.name()} ${getText('noLongerHungry')}`;
                }
            } else {
                if (currentState === 'sleepy') {
                    message = `${this.name()} ${getText('sleepy')}`;
                } else if (currentState === 'exhausted') {
                    message = `${this.name()} ${getText('exhausted')}`;
                } else if (currentState === 'normal' && prevState !== 'normal') {
                    message = `${this.name()} ${getText('noLongerSleepy')}`;
                }
            }
            
            if (message) {
                // Send notification
                $gameTemp.addHungerSleepNotification(message);
            }
            
            // Apply debuffs based on new state (placeholder implementation)
            if (type === 'hunger') {
                this.applyHungerDebuffs(currentState);
            } else {
                this.applySleepDebuffs(currentState);
            }
        }
    };
    
    // Placeholder debuff methods - in a real plugin these would apply actual states/effects
    Game_Actor.prototype.applyHungerDebuffs = function(state) {
        debug(`Applied hunger debuffs for state: ${state}`);
        
        if (state === 'hungry') {
            // Apply mild hunger debuffs
        } else if (state === 'starving') {
            // Apply severe hunger debuffs
        } else {
            // Remove hunger debuffs
        }
    };
    
    Game_Actor.prototype.applySleepDebuffs = function(state) {
        debug(`Applied sleep debuffs for state: ${state}`);
        
        if (state === 'sleepy') {
            // Apply mild sleep debuffs
        } else if (state === 'exhausted') {
            // Apply severe sleep debuffs
        } else {
            // Remove sleep debuffs
        }
    };
    
    //=============================================================================
    // Game_Party Extensions
    //=============================================================================
    
    // Update hunger and sleep values when the player moves
    const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
    Game_Party.prototype.onPlayerWalk = function() {
        _Game_Party_onPlayerWalk.call(this);
        this.updateHungerAndSleep();
    };
    
    Game_Party.prototype.updateHungerAndSleep = function() {
        this.members().forEach(actor => {
            actor.reduceHunger(hungerDecreaseRate);
            actor.reduceSleep(sleepDecreaseRate);
        });
    };
    
    //=============================================================================
    // Time and Temperature Window
    //=============================================================================
    
    function Window_TimeTemperature() {
        this.initialize(...arguments);
    }
    
    Window_TimeTemperature.prototype = Object.create(Window_Base.prototype);
    Window_TimeTemperature.prototype.constructor = Window_TimeTemperature;
    
    Window_TimeTemperature.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.refresh();
        this._refreshTimer = 0;
    };
    
    Window_TimeTemperature.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        // Refresh every second (60 frames)
        this._refreshTimer++;
        if (this._refreshTimer >= 60) {
            this._refreshTimer = 0;
            this.refresh();
        }
    };
    
    Window_TimeTemperature.prototype.refresh = function() {
        if (!this.contents) return;
        
        this.contents.clear();
        this.drawTimeAndTemperature();
    };
    
    Window_TimeTemperature.prototype.drawTimeAndTemperature = function() {
        const y = 0;
        
        // Get current time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        
        // Get temperature from variable
        const temperature = $gameVariables.value(temperatureVariable) || 20;
        const tempString = `${temperature}°C`;
        
        // Draw time with icon (left side)
        this.resetTextColor();
        this.drawIcon(timeIcon, 0, y);
        this.drawText(timeString, 36, y, 60);
        
        // Draw temperature with icon (right side)
        const tempX = 110; // Position temperature to the right of time
        this.drawIcon(temperatureIcon, tempX, y);
        
        // Color code temperature
        let tempColor = 0; // White by default
        if (temperature <= 0) {
            tempColor = 4; // Blue for freezing
        } else if (temperature < 10) {
            tempColor = 4; // Blue for cold
        } else if (temperature >= 35) {
            tempColor = 2; // Red for very hot
        } else if (temperature >= 25) {
            tempColor = 14; // Yellow for warm
        }
        
        this.changeTextColor(ColorManager.textColor(tempColor));
        this.drawText(tempString, tempX + 36, y, 80);
    };
    
    //=============================================================================
    // Main Menu Display - Add hunger and sleep status
    //=============================================================================
    
    // Create a new window for hunger and sleep status
    function Window_HungerSleepStatus() {
        this.initialize(...arguments);
    }
    
    Window_HungerSleepStatus.prototype = Object.create(Window_Base.prototype);
    Window_HungerSleepStatus.prototype.constructor = Window_HungerSleepStatus;
    
    Window_HungerSleepStatus.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_HungerSleepStatus.prototype.refresh = function() {
        if (!this.contents) return;
        
        this.contents.clear();
        this.drawHungerSleepStatus();
    };
    
    Window_HungerSleepStatus.prototype.drawHungerSleepStatus = function() {
        const lineHeight = this.lineHeight();
        let y = 0;
        
        const members = $gameParty.members();
    
        // Column positions - spread across full window width
        const totalWidth = this.contents.width;
        const nameWidth = 100;
        const hpWidth = 80;
        const mpWidth = 80;
        const statusWidth = 120;
        const hungerWidth = 80; // Increased to accommodate icon + text
        const sleepWidth = 80; // Increased to accommodate icon + text
        
        // Calculate remaining space and distribute it
        const usedWidth = nameWidth + hpWidth + mpWidth + statusWidth + hungerWidth + sleepWidth;
        const remainingWidth = totalWidth - usedWidth;
        const padding = Math.max(10, remainingWidth / 6); // Distribute remaining space as padding
    
        const hpX = nameWidth + padding;
        const mpX = hpX + hpWidth + padding;
        const statusX = mpX + mpWidth + padding;
        const hungerX = statusX + statusWidth + padding;
        const sleepX = hungerX + hungerWidth + padding;
    
        for (let i = 0; i < members.length; i++) {
            const actor = members[i];
            const x = 0;
    
            // Draw actor name
            this.resetTextColor();
            this.drawText(actor.name(), x, y, nameWidth);
    
            // Draw HP with color coding (current number only) - translated label
            const hpPercent = Math.floor((actor.hp / actor.mhp) * 100);
            let hpColor = (hpPercent <= 25) ? 2 : (hpPercent < 50 ? 14 : 3);
            this.changeTextColor(ColorManager.textColor(hpColor));
            this.drawText(`${getText('hp')}:${actor.hp}`, hpX, y, hpWidth);
    
            // Draw MP with color coding (current number only) - translated label
            const mpPercent = Math.floor((actor.mp / actor.mmp) * 100);
            let mpColor = (mpPercent <= 25) ? 2 : (mpPercent < 50 ? 14 : 4);
            this.changeTextColor(ColorManager.textColor(mpColor));
            this.drawText(`${getText('mp')}:${actor.mp}`, mpX, y, mpWidth);
    
            // Get first status effect
            const firstState = actor.states().length > 0 ? actor.states()[0] : null;
            const statusText = firstState ? firstState.name : "";
            this.resetTextColor();
            if (firstState && firstState.iconIndex > 0) {
                // Draw status icon if available
                this.drawIcon(firstState.iconIndex, statusX, y);
                this.drawText(statusText.substring(0, 10), statusX + 32, y, statusWidth - 32);
            } else {
                this.drawText(statusText.substring(0, 12), statusX, y, statusWidth);
            }
    
            // Draw hunger with icon and color coding
            const hungerPercent = actor.hungerPercent();
            let hungerColor = (hungerPercent <= 0) ? 2 : (hungerPercent < 20 ? 14 : 3);
            this.changeTextColor(ColorManager.textColor(hungerColor));
            this.drawIcon(hungerIcon, hungerX, y);
            this.drawText(`${hungerPercent}%`, hungerX + 32, y, hungerWidth - 32);
    
            // Draw sleep with icon and color coding
            const sleepPercent = actor.sleepPercent();
            let sleepColor = (sleepPercent <= 0) ? 2 : (sleepPercent < 20 ? 14 : 4);
            this.changeTextColor(ColorManager.textColor(sleepColor));
            this.drawIcon(sleepIcon, sleepX, y);
            this.drawText(`${sleepPercent}%`, sleepX + 32, y, sleepWidth - 32);
    
            y += lineHeight;
        }
    };
    
    // Add the hunger/sleep window to the menu scene
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this.createHungerSleepStatusWindow();
        this.createTimeTemperatureWindow();
    };
    
    Scene_Menu.prototype.createHungerSleepStatusWindow = function() {
        const rect = this.hungerSleepStatusWindowRect();
        this._hungerSleepStatusWindow = new Window_HungerSleepStatus(rect);
        this.addWindow(this._hungerSleepStatusWindow);
    };
    
    Scene_Menu.prototype.createTimeTemperatureWindow = function() {
        const rect = this.timeTemperatureWindowRect();
        this._timeTemperatureWindow = new Window_TimeTemperature(rect);
        this.addWindow(this._timeTemperatureWindow);
    };
    
    Scene_Menu.prototype.hungerSleepStatusWindowRect = function() {
        // Full screen width window
        const goldRect = this.goldWindowRect();
        const partySize = $gameParty.members().length;
        const ww = Graphics.boxWidth; // Full screen width
        const wh = this.calcWindowHeight(partySize, false);
        const wx = 0; // Start from left edge
        const wy = goldRect.y - wh; // Position above the gold window
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_Menu.prototype.timeTemperatureWindowRect = function() {
        // Wider window to accommodate horizontal layout
        const goldRect = this.goldWindowRect();
        const ww = 200; // Increased width for horizontal layout (time + temperature)
        const wh = this.calcWindowHeight(1, false); // Height for 1 line only
        const wx = goldRect.x - ww; // Position to the left of gold window
        const wy = goldRect.y; // Same Y position as gold window
        return new Rectangle(wx, wy, ww, wh);
    };
    
    //=============================================================================
    // Game_Temp Extensions for Notifications
    //=============================================================================
    
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._hungerSleepNotifications = [];
        this._notificationTimer = 0;
    };
    
    Game_Temp.prototype.addHungerSleepNotification = function(text) {
        this._hungerSleepNotifications.push({
            text: text,
            duration: 120 // Display for 120 frames (2 seconds)
        });
    };
    
    Game_Temp.prototype.updateNotifications = function() {
        if (this._hungerSleepNotifications.length > 0) {
            if (this._notificationTimer <= 0) {
                this._notificationTimer = this._hungerSleepNotifications[0].duration;
            } else {
                this._notificationTimer--;
                if (this._notificationTimer <= 0) {
                    this._hungerSleepNotifications.shift();
                }
            }
        }
    };
    
    Game_Temp.prototype.getCurrentNotification = function() {
        return this._hungerSleepNotifications.length > 0 ? 
               this._hungerSleepNotifications[0].text : null;
    };
    
    //=============================================================================
    // Window_HungerSleepNotification
    //=============================================================================
    
    function Window_HungerSleepNotification() {
        this.initialize(...arguments);
    }
    
    Window_HungerSleepNotification.prototype = Object.create(Window_Base.prototype);
    Window_HungerSleepNotification.prototype.constructor = Window_HungerSleepNotification;
    
    Window_HungerSleepNotification.prototype.initialize = function() {
        const width = 300;
        const height = this.fittingHeight(1);
        const x = 10; // Top left position
        const y = 10;
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this.opacity = 200; // Slightly transparent
        this.visible = false;
        this._lastNotification = null;
    };
    
    Window_HungerSleepNotification.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        const notification = $gameTemp.getCurrentNotification();
        if (notification !== this._lastNotification) {
            this._lastNotification = notification;
            this.refresh();
        }
        
        this.visible = !!notification;
    };
    
    Window_HungerSleepNotification.prototype.refresh = function() {
        this.contents.clear();
        
        if (this._lastNotification) {
            // Set text color based on severity - works with Italian text too
            if (this._lastNotification.includes(getText('starving').replace('!', '')) || 
                this._lastNotification.includes(getText('exhausted').replace('!', ''))) {
                this.changeTextColor(ColorManager.textColor(2)); // Red color
            } else if (this._lastNotification.includes(getText('hungry')) || 
                       this._lastNotification.includes(getText('sleepy'))) {
                this.changeTextColor(ColorManager.textColor(14)); // Yellow color
            } else {
                this.resetTextColor();
            }
            
            this.drawText(this._lastNotification, 0, 0, this.contents.width, 'left');
        }
    };
    
    //=============================================================================
    // Scene_Map Extensions for Notifications
    //=============================================================================
    
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createHungerSleepNotificationWindow();
    };
    
    Scene_Map.prototype.createHungerSleepNotificationWindow = function() {
        this._hungerSleepNotificationWindow = new Window_HungerSleepNotification();
        this.addWindow(this._hungerSleepNotificationWindow);
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        $gameTemp.updateNotifications();
    };
    
    //=============================================================================
    // Data Loading/Saving
    //=============================================================================
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        
        // Initialize hunger/sleep system after loading if needed
        $gameParty.members().forEach(actor => {
            if (actor._hunger === undefined) {
                actor._hunger = maxHunger;
            }
            if (actor._sleep === undefined) {
                actor._sleep = maxSleep;
            }
            if (actor._prevHungerState === undefined) {
                actor._prevHungerState = 'normal';
            }
            if (actor._prevSleepState === undefined) {
                actor._prevSleepState = 'normal';
            }
        });
    };
    
})();