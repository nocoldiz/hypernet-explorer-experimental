//=============================================================================
// HexphoneSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.1.0] Hexphone Contact System
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @url 
 * @help HexphoneSystem.js
 * 
 * @param menuText
 * @text Menu Option Text
 * @desc Text shown in the pause menu for the phone
 * @type string
 * @default Hexphone
 * 
 * @param menuTextIT
 * @text Menu Option Text (Italian)
 * @desc Text shown in the pause menu for the phone (Italian)
 * @type string
 * @default Esafono
 * 
 * @param callSound
 * @text Call Sound Effect
 * @desc Sound effect played when making a call
 * @type file
 * @dir audio/se/
 * @default Decision1
 * 
 * @param callVolume
 * @text Call Sound Volume
 * @desc Volume of the call sound effect (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param callPitch
 * @text Call Sound Pitch
 * @desc Pitch of the call sound effect (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param defaultCommonEvent
 * @text Default Common Event
 * @desc Common event called when no specific event is set for a contact
 * @type common_event
 * @default 1
 * 
 * @param contacts
 * @text Available Contacts
 * @desc Define your available contacts here (must be registered to appear in phone)
 * @type struct<Contact>[]
 * @default []
 * 
 * @param preregisteredContacts
 * @text Preregistered Contacts
 * @desc Contacts that appear in the phone from the start (by name)
 * @type string[]
 * @default []
 * 
 * @command registerContact
 * @text Register Contact
 * @desc Add a contact to the player's phone from the available contacts list
 * 
 * @arg contactName
 * @text Contact Name
 * @desc Name of the contact to register
 * @type string
 * @default
 * 
 * @command removeContact
 * @text Remove Contact
 * @desc Remove a contact from the player's phone
 * 
 * @arg contactName
 * @text Contact Name
 * @desc Name of the contact to remove
 * @type string
 * @default
 * 
 * @command clearAllContacts
 * @text Clear All Contacts
 * @desc Remove all contacts from the player's phone
 * 
 * @help HexphoneSystem.js
 * 
 * ============================================================================
 * Hexphone Contact System Plugin
 * ============================================================================
 * 
 * This plugin adds a phone system to your RPG Maker MZ game with the following
 * features:
 * 
 * - Adds "Hexphone" option to the pause menu
 * - Displays a list of registered contacts (alphabetically ordered)
 * - Allows calling contacts with custom sound effects
 * - Calls different common events for each contact
 * - Plugin commands to register/remove contacts during gameplay
 * - Italian language support
 * - Preregistered contacts option
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * Register Contact: Adds a contact to the player's phone from available list
 * Remove Contact: Removes a contact from the player's phone
 * Clear All Contacts: Removes all contacts from the phone
 * 
 * ============================================================================
 * Script Calls
 * ============================================================================
 * 
 * $gameSystem.registerContact("ContactName");
 * $gameSystem.removeContact("ContactName");
 * $gameSystem.clearAllContacts();
 * $gameSystem.hasContact("ContactName");
 * 
 * ============================================================================
 * Contact Structure
 * ============================================================================
 * 
 * Each contact should have:
 * - Name: Display name for the contact
 * - Common Event: Event ID to call when this contact is selected
 * 
 * ============================================================================
 * Language Support
 * ============================================================================
 * 
 * The plugin automatically detects the game's language setting and uses
 * appropriate text strings for Italian (it) or English (default).
 * 
 */

/*~struct~Contact:
 * @param name
 * @text Contact Name
 * @desc Name of the contact
 * @type string
 * @default 
 * 
 * @param commonEventId
 * @text Common Event ID
 * @desc Common event to call when this contact is selected
 * @type common_event
 * @default 1
 */

/*:it
 * @target MZ
 * @plugindesc [v1.1.0] Sistema Contatti Esafono
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @url 
 * @help HexphoneSystem.js
 * 
 * @param menuText
 * @text Testo Opzione Menu
 * @desc Testo mostrato nel menu pausa per il telefono
 * @type string
 * @default Hexphone
 * 
 * @param menuTextIT
 * @text Testo Opzione Menu (Italiano)
 * @desc Testo mostrato nel menu pausa per il telefono (Italiano)
 * @type string
 * @default Esafono
 * 
 * @param callSound
 * @text Effetto Sonoro Chiamata
 * @desc Effetto sonoro riprodotto quando si effettua una chiamata
 * @type file
 * @dir audio/se/
 * @default Decision1
 * 
 * @param callVolume
 * @text Volume Suono Chiamata
 * @desc Volume dell'effetto sonoro della chiamata (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param callPitch
 * @text Tono Suono Chiamata
 * @desc Tono dell'effetto sonoro della chiamata (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param defaultCommonEvent
 * @text Evento Comune Predefinito
 * @desc Evento comune chiamato quando non è impostato un evento specifico per un contatto
 * @type common_event
 * @default 1
 * 
 * @param contacts
 * @text Contatti Disponibili
 * @desc Definisci qui i tuoi contatti disponibili (devono essere registrati per apparire nel telefono)
 * @type struct<Contact>[]
 * @default []
 * 
 * @param preregisteredContacts
 * @text Contatti Preregistrati
 * @desc Contatti che appaiono nel telefono dall'inizio (per nome)
 * @type string[]
 * @default []
 * 
 * @command registerContact
 * @text Registra Contatto
 * @desc Aggiungi un contatto al telefono del giocatore dalla lista dei contatti disponibili
 * 
 * @arg contactName
 * @text Nome Contatto
 * @desc Nome del contatto da registrare
 * @type string
 * @default
 * 
 * @command removeContact
 * @text Rimuovi Contatto
 * @desc Rimuovi un contatto dal telefono del giocatore
 * 
 * @arg contactName
 * @text Nome Contatto
 * @desc Nome del contatto da rimuovere
 * @type string
 * @default
 * 
 * @command clearAllContacts
 * @text Cancella Tutti i Contatti
 * @desc Rimuovi tutti i contatti dal telefono del giocatore
 */

(() => {
    'use strict';
    
    const pluginName = "HexphoneSystem";
    const parameters = PluginManager.parameters(pluginName);
    
    // Language detection
    const isItalian = ConfigManager.language === 'it';
    
    // Text strings
    const TEXT = {
        menuOption: isItalian ? (parameters['menuTextIT'] || 'Esafono') : (parameters['menuText'] || 'Hexphone'),
        selectContact: isItalian ? "Seleziona un contatto da chiamare" : "Select a contact to call",
        noContacts: isItalian ? "Nessun contatto disponibile" : "No contacts available",
        calling: isItalian ? "Chiamando" : "Calling",
        contactAdded: isItalian ? "è stato aggiunto ai tuoi contatti." : "has been added to your contacts.",
        contactNotFound: isItalian ? "Contatto non trovato nel database." : "Contact not found in database.",
        contactRemoved: isItalian ? "è stato rimosso dai tuoi contatti." : "has been removed from your contacts.",
        contactNotInList: isItalian ? "Contatto non trovato." : "Contact not found.",
        allContactsCleared: isItalian ? "Tutti i contatti sono stati rimossi." : "All contacts have been cleared."
    };
    
    const callSound = parameters['callSound'] || 'Decision1';
    const callVolume = Number(parameters['callVolume']) || 90;
    const callPitch = Number(parameters['callPitch']) || 100;
    const defaultCommonEvent = Number(parameters['defaultCommonEvent']) || 1;
    
    // Parse available contacts from parameters
    const contactsData = JSON.parse(parameters['contacts'] || '[]');
    const availableContacts = {};
    
    for (const contactData of contactsData) {
        const contact = JSON.parse(contactData);
        availableContacts[contact.name] = {
            name: contact.name,
            commonEventId: Number(contact.commonEventId) || defaultCommonEvent
        };
    }
    
    // Parse preregistered contacts
    const preregisteredData = JSON.parse(parameters['preregisteredContacts'] || '[]');
    const preregisteredContacts = preregisteredData || [];

    //=============================================================================
    // Game_System
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initializeHexphone();
    };
    
    Game_System.prototype.initializeHexphone = function() {
        this._hexphoneContacts = {};
        // Add preregistered contacts
        for (const contactName of preregisteredContacts) {
            if (availableContacts[contactName]) {
                this._hexphoneContacts[contactName] = availableContacts[contactName];
            }
        }
    };
    
    Game_System.prototype.registerContact = function(contactName) {
        if (availableContacts[contactName]) {
            this._hexphoneContacts[contactName] = availableContacts[contactName];
            return true;
        }
        return false;
    };
    
    Game_System.prototype.removeContact = function(contactName) {
        if (this._hexphoneContacts[contactName]) {
            delete this._hexphoneContacts[contactName];
            return true;
        }
        return false;
    };
    
    Game_System.prototype.clearAllContacts = function() {
        this._hexphoneContacts = {};
    };
    
    Game_System.prototype.hasContact = function(contactName) {
        return !!this._hexphoneContacts[contactName];
    };
    
    Game_System.prototype.getHexphoneContacts = function() {
        return this._hexphoneContacts || {};
    };
    
    Game_System.prototype.getContactCommonEvent = function(contactName) {
        const contact = this._hexphoneContacts[contactName];
        return contact ? contact.commonEventId : defaultCommonEvent;
    };
    
    Game_System.prototype.getAvailableContacts = function() {
        return availableContacts;
    };

    //=============================================================================
    // Window_MenuCommand
    //=============================================================================
    
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand(TEXT.menuOption, 'hexphone', true, 46);
    };

    //=============================================================================
    // Scene_Menu
    //=============================================================================
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('hexphone', this.commandHexphone.bind(this));
    };
    
    Scene_Menu.prototype.commandHexphone = function() {
        SceneManager.push(Scene_Hexphone);
    };

    //=============================================================================
    // Window_HexphoneContacts
    //=============================================================================
    
    function Window_HexphoneContacts() {
        this.initialize(...arguments);
    }
    
    Window_HexphoneContacts.prototype = Object.create(Window_Selectable.prototype);
    Window_HexphoneContacts.prototype.constructor = Window_HexphoneContacts;
    
    Window_HexphoneContacts.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_HexphoneContacts.prototype.maxItems = function() {
        return this._data ? this._data.length : 1;
    };
    
    Window_HexphoneContacts.prototype.item = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };
    
    Window_HexphoneContacts.prototype.makeItemList = function() {
        const contacts = $gameSystem.getHexphoneContacts();
        this._data = Object.values(contacts);
        
        // Sort contacts alphabetically by name
        this._data.sort((a, b) => a.name.localeCompare(b.name));
        
        if (this._data.length === 0) {
            this._data = [{ name: TEXT.noContacts, commonEventId: null }];
        }
    };
    
    Window_HexphoneContacts.prototype.drawItem = function(index) {
        const item = this._data[index];
        if (item) {
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(item.commonEventId !== null);
            this.drawText(item.name, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    };
    
    Window_HexphoneContacts.prototype.refresh = function() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };
    
    Window_HexphoneContacts.prototype.isCurrentItemEnabled = function() {
        const item = this.item();
        return item && item.commonEventId !== null;
    };

    //=============================================================================
    // Scene_Hexphone
    //=============================================================================
    
    function Scene_Hexphone() {
        this.initialize(...arguments);
    }
    
    Scene_Hexphone.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Hexphone.prototype.constructor = Scene_Hexphone;
    
    Scene_Hexphone.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_Hexphone.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createContactsWindow();
    };
    
    Scene_Hexphone.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.setText(TEXT.selectContact);
        this.addWindow(this._helpWindow);
    };
    
    Scene_Hexphone.prototype.createContactsWindow = function() {
        const rect = this.contactsWindowRect();
        this._contactsWindow = new Window_HexphoneContacts(rect);
        this._contactsWindow.setHelpWindow(this._helpWindow);
        this._contactsWindow.setHandler('ok', this.onContactOk.bind(this));
        this._contactsWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._contactsWindow);
        this._contactsWindow.activate();
    };
    
    Scene_Hexphone.prototype.helpWindowRect = function() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(2, false);
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_Hexphone.prototype.contactsWindowRect = function() {
        const wx = 0;
        const wy = this._helpWindow.height;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight - wy;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_Hexphone.prototype.onContactOk = function() {
        const contact = this._contactsWindow.item();
        if (contact && contact.commonEventId !== null) {
            this.makeCall(contact);
        } else {
            this._contactsWindow.activate();
        }
    };
    
    Scene_Hexphone.prototype.makeCall = function(contact) {
        // Play call sound
        const se = {
            name: callSound,
            volume: callVolume,
            pitch: callPitch,
            pan: 0
        };
        AudioManager.playSe(se);
        
        // Show calling message
        const message = `${TEXT.calling} ${contact.name}...`;
        $gameMessage.add(message);
        
        // Set up the common event to be called after the message
        this._callCommonEventId = contact.commonEventId;
        
        // Set interpreter to handle the message and then call the event
        this._messageWait = true;
        this.update = this.updateCalling;
    };
    
    Scene_Hexphone.prototype.updateCalling = function() {
        Scene_MenuBase.prototype.update.call(this);
        
        if (this._messageWait && !$gameMessage.isBusy()) {
            this._messageWait = false;
            
            // Reserve the common event
            $gameTemp.reserveCommonEvent(this._callCommonEventId);
            
            // Return to map
            this.popScene();
            SceneManager.pop(); // Also pop the menu scene
        }
    };

    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "registerContact", args => {
        const contactName = args.contactName;
        if ($gameSystem.registerContact(contactName)) {
            $gameMessage.add(`${contactName} ${TEXT.contactAdded}`);
        } else {
            $gameMessage.add(`${TEXT.contactNotFound.replace('Contatto', contactName).replace('Contact', contactName)}`);
        }
    });
    
    PluginManager.registerCommand(pluginName, "removeContact", args => {
        const contactName = args.contactName;
        if ($gameSystem.removeContact(contactName)) {
            $gameMessage.add(`${contactName} ${TEXT.contactRemoved}`);
        } else {
            $gameMessage.add(`${TEXT.contactNotInList.replace('Contatto', contactName).replace('Contact', contactName)}`);
        }
    });
    
    PluginManager.registerCommand(pluginName, "clearAllContacts", args => {
        $gameSystem.clearAllContacts();
        $gameMessage.add(TEXT.allContactsCleared);
    });

    //=============================================================================
    // Plugin Command Parameters
    //=============================================================================

    // Remove the old manual command registration since we're using @command annotations

})();