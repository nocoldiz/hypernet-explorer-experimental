/*:
 * @target MZ
 * @plugindesc Realistic Vending Machine v1.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @help
 * ============================================================================
 * Realistic Vending Machine Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin creates a realistic vending machine interface with daily stock
 * management, numeric keypad input, and item drop animations.
 * 
 * Features:
 * - Grid display of products with codes (A10-D49)
 * - Numeric keypad interface for code entry
 * - Daily stock limits (3 purchases per item per day)
 * - Row D items randomize daily
 * - Item drop animations
 * - Multiple vending machine support
 * - Secret codes that trigger common events
 * 
 * Plugin Commands:
 * - Open Vending Machine: Opens a specific vending machine by ID
 * 
 * @param machines
 * @text Vending Machines
 * @desc Configure different vending machines
 * @type struct<Machine>[]
 * @default []
 * 
 * @param defaultSoundBuy
 * @text Purchase Sound
 * @desc Sound effect when item is purchased
 * @type file
 * @dir audio/se/
 * @default Coin
 * 
 * @param defaultSoundError
 * @text Error Sound
 * @desc Sound effect for errors
 * @type file
 * @dir audio/se/
 * @default Buzzer1
 * 
 * @param rowDPool
 * @text Row D Item Pool
 * @desc Item IDs that can appear in row D (randomized daily)
 * @type item[]
 * @default []
 * 
 * @param secretCodes
 * @text Secret Codes
 * @desc Secret codes that trigger common events
 * @type struct<SecretCode>[]
 * @default []
 * 
 * @command openVendingMachine
 * @text Open Vending Machine
 * @desc Opens a vending machine interface
 * 
 * @arg machineId
 * @text Machine ID
 * @desc ID of the vending machine to open
 * @type string
 * @default default
 */

/*~struct~Machine:
 * @param id
 * @text Machine ID
 * @desc Unique identifier for this machine
 * @type string
 * @default default
 * 
 * @param name
 * @text Machine Name
 * @desc Display name for the vending machine
 * @type string
 * @default Vending Machine
 * 
 * @param itemsA
 * @text Row A Items (A10-A19)
 * @desc Items for row A slots
 * @type struct<ItemSlot>[]
 * @default []
 * 
 * @param itemsB
 * @text Row B Items (B20-B29)
 * @desc Items for row B slots
 * @type struct<ItemSlot>[]
 * @default []
 * 
 * @param itemsC
 * @text Row C Items (C30-C39)
 * @desc Items for row C slots
 * @type struct<ItemSlot>[]
 * @default []
 */

/*~struct~ItemSlot:
 * @param itemId
 * @text Item
 * @desc Item to sell in this slot
 * @type item
 * @default 1
 * 
 * @param price
 * @text Price
 * @desc Override price (0 to use item's default price)
 * @type number
 * @min 0
 * @default 0
 */

/*~struct~SecretCode:
 * @param code
 * @text Code
 * @desc Secret code (e.g., A99)
 * @type string
 * @default A99
 * 
 * @param commonEventId
 * @text Common Event
 * @desc Common event to run when code is entered
 * @type common_event
 * @default 1
 */

(() => {
    'use strict';
    
    const pluginName = 'RealisticVendingMachine';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const machines = JSON.parse(parameters.machines || '[]').map(m => {
        const machine = JSON.parse(m);
        machine.itemsA = JSON.parse(machine.itemsA || '[]').map(i => JSON.parse(i));
        machine.itemsB = JSON.parse(machine.itemsB || '[]').map(i => JSON.parse(i));
        machine.itemsC = JSON.parse(machine.itemsC || '[]').map(i => JSON.parse(i));
        return machine;
    });
    
    const rowDPool = JSON.parse(parameters.rowDPool || '[]').map(id => parseInt(id));
    const secretCodes = JSON.parse(parameters.secretCodes || '[]').map(s => JSON.parse(s));
    const soundBuy = parameters.defaultSoundBuy || 'Coin';
    const soundError = parameters.defaultSoundError || 'Buzzer1';
    
    // Storage keys
    const STORAGE_KEY_PURCHASES = 'VendingMachine_DailyPurchases';
    const STORAGE_KEY_ROWD = 'VendingMachine_RowD';
    const STORAGE_KEY_DATE = 'VendingMachine_LastDate';
    
    // Helper functions
    function getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    }
    
    function loadDailyData() {
        const todayString = getTodayString();
        const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
        
        if (savedDate !== todayString) {
            // Reset daily data
            localStorage.setItem(STORAGE_KEY_DATE, todayString);
            localStorage.setItem(STORAGE_KEY_PURCHASES, '{}');
            generateRowD();
        }
        
        return {
            purchases: JSON.parse(localStorage.getItem(STORAGE_KEY_PURCHASES) || '{}'),
            rowD: JSON.parse(localStorage.getItem(STORAGE_KEY_ROWD) || '{}')
        };
    }
    
    function savePurchase(machineId, code) {
        const data = loadDailyData();
        const key = `${machineId}_${code}`;
        data.purchases[key] = (data.purchases[key] || 0) + 1;
        localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(data.purchases));
    }
    
    function getPurchaseCount(machineId, code) {
        const data = loadDailyData();
        const key = `${machineId}_${code}`;
        return data.purchases[key] || 0;
    }
    
    function generateRowD() {
        const rowD = {};
        if (rowDPool.length > 0) {
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * rowDPool.length);
                rowD[`D${40 + i}`] = rowDPool[randomIndex];
            }
        }
        localStorage.setItem(STORAGE_KEY_ROWD, JSON.stringify(rowD));
    }
    
    // Plugin command
    PluginManager.registerCommand(pluginName, 'openVendingMachine', args => {
        const machineId = args.machineId || 'default';
        const machine = machines.find(m => m.id === machineId);
        
        if (!machine) {
            console.error(`Vending machine '${machineId}' not found!`);
            return;
        }
        
        SceneManager.push(Scene_VendingMachine);
        SceneManager.prepareNextScene(machine);
    });
    
    // Scene_VendingMachine
    class Scene_VendingMachine extends Scene_Base {
        prepare(machine) {
            this._machine = machine;
        }
        
        create() {
            super.create();
            this.createBackground();
            this.createWindowLayer();
            this.createItemGrid();
            this.createKeypad();
            this.createDisplay();
            this.createHelpWindow();
            this._inputCode = '';
            this._selectedItem = null;
        }
        
        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
            this.addChild(this._backgroundSprite);
            
            // Darken background
            const dimmer = new Sprite();
            dimmer.bitmap = new Bitmap(Graphics.width, Graphics.height);
            dimmer.bitmap.fillAll('rgba(0, 0, 0, 0.6)');
            this.addChild(dimmer);
        }
        
        createItemGrid() {
            const gridWidth = 600;
            const gridHeight = 400;
            const x = 20;
            const y = 60;
            
            this._itemGrid = new Window_VendingGrid(
                new Rectangle(x, y, gridWidth, gridHeight),
                this._machine
            );
            this.addWindow(this._itemGrid);
        }
        
        createKeypad() {
            const keypadWidth = 150;
            const keypadHeight = 400;
            const x = Graphics.width - keypadWidth - 20;
            const y = 60;
            
            this._keypad = new Window_VendingKeypad(
                new Rectangle(x, y, keypadWidth, keypadHeight)
            );
            this._keypad.setHandler('input', this.onKeypadInput.bind(this));
            this._keypad.setHandler('cancel', this.popScene.bind(this));
            this.addWindow(this._keypad);
        }
        
        createDisplay() {
            const displayWidth = 150;
            const displayHeight = 60;
            const x = Graphics.width - displayWidth - 20;
            const y = 470;
            
            this._display = new Window_VendingDisplay(
                new Rectangle(x, y, displayWidth, displayHeight)
            );
            this.addWindow(this._display);
        }
        
        createHelpWindow() {
            const helpWidth = 600;
            const helpHeight = 60;
            const x = 20;
            const y = 470;
            
            this._helpWindow = new Window_Base(new Rectangle(x, y, helpWidth, helpHeight));
            this._helpWindow.drawText('Enter code using keypad or press ESC to exit', 0, 0, helpWidth - 40, 'center');
            this.addWindow(this._helpWindow);
        }
        
        onKeypadInput(char) {
            if (char === 'C') {
                // Clear last character
                if (this._inputCode.length > 0) {
                    this._inputCode = this._inputCode.slice(0, -1);
                    this._display.setCode(this._inputCode);
                }
            } else {
                // Add character
                if (this._inputCode.length < 3) {
                    this._inputCode += char;
                    this._display.setCode(this._inputCode);
                    
                    // Check if code is complete
                    if (this._inputCode.length === 3) {
                        this.processCode();
                    }
                }
            }
        }
        
        processCode() {
            const code = this._inputCode;
            
            // Check secret codes
            const secret = secretCodes.find(s => s.code === code);
            if (secret) {
                $gameTemp.reserveCommonEvent(parseInt(secret.commonEventId));
                this.popScene();
                return;
            }
            
            // Check if code is valid
            const item = this._itemGrid.getItemByCode(code);
            if (!item || !item.item) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._helpWindow.contents.clear();
                this._helpWindow.drawText('Invalid code or out of stock!', 0, 0, 560, 'center');
                this._inputCode = '';
                this._display.setCode('');
                return;
            }
            
            // Check purchase limit
            const purchaseCount = getPurchaseCount(this._machine.id, code);
            if (purchaseCount >= 3) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._helpWindow.contents.clear();
                this._helpWindow.drawText('Sold out! Restocks at midnight.', 0, 0, 560, 'center');
                this._inputCode = '';
                this._display.setCode('');
                return;
            }
            
            // Check gold
            if ($gameParty.gold() < item.price) {
                AudioManager.playSe({name: soundError, volume: 90, pitch: 100});
                this._helpWindow.contents.clear();
                this._helpWindow.drawText('Not enough gold!', 0, 0, 560, 'center');
                this._inputCode = '';
                this._display.setCode('');
                return;
            }
            
            // Process purchase
            this.purchaseItem(item, code);
        }
        
        purchaseItem(item, code) {
            // Deduct gold and add item
            $gameParty.loseGold(item.price);
            $gameParty.gainItem(item.item, 1);
            
            // Save purchase
            savePurchase(this._machine.id, code);
            
            // Play sound
            AudioManager.playSe({name: soundBuy, volume: 90, pitch: 100});
            
            // Animate item drop
            this.animateItemDrop(item, code);
            
            // Update display
            this._helpWindow.contents.clear();
            this._helpWindow.drawText(`Purchased ${item.item.name}!`, 0, 0, 560, 'center');
            
            // Clear input
            this._inputCode = '';
            this._display.setCode('');
            
            // Refresh grid to show updated stock
            this._itemGrid.refresh();
        }
        
        animateItemDrop(item, code) {
            const position = this._itemGrid.getItemPosition(code);
            if (!position) return;
            
            // Create sprite for animation
            const sprite = new Sprite();
            sprite.bitmap = ImageManager.loadSystem('IconSet');
            const pw = ImageManager.iconWidth;
            const ph = ImageManager.iconHeight;
            const sx = item.item.iconIndex % 16 * pw;
            const sy = Math.floor(item.item.iconIndex / 16) * ph;
            sprite.setFrame(sx, sy, pw, ph);
            
            // Set initial position
            sprite.x = this._itemGrid.x + position.x + 16;
            sprite.y = this._itemGrid.y + position.y + 16;
            
            // Add to scene
            this.addChild(sprite);
            
            // Animate drop
            const dropY = Graphics.height - 100;
            const duration = 30;
            let count = 0;
            
            const animateFrame = () => {
                count++;
                const rate = count / duration;
                sprite.y = position.y + this._itemGrid.y + 16 + (dropY - position.y - this._itemGrid.y - 16) * rate;
                
                if (count >= duration) {
                    // Return animation
                    const returnDuration = 20;
                    let returnCount = 0;
                    
                    const animateReturn = () => {
                        returnCount++;
                        const rate = 1 - (returnCount / returnDuration);
                        sprite.y = position.y + this._itemGrid.y + 16 + (dropY - position.y - this._itemGrid.y - 16) * rate;
                        sprite.opacity = 255 * rate;
                        
                        if (returnCount >= returnDuration) {
                            this.removeChild(sprite);
                        } else {
                            requestAnimationFrame(animateReturn);
                        }
                    };
                    
                    setTimeout(() => {
                        animateReturn();
                    }, 500);
                } else {
                    requestAnimationFrame(animateFrame);
                }
            };
            
            animateFrame();
        }
    }
    
    // Window_VendingGrid
    class Window_VendingGrid extends Window_Base {
        constructor(rect, machine) {
            super(rect);
            this._machine = machine;
            this._items = {};
            this.setupItems();
            this.refresh();
        }
        
        setupItems() {
            // Setup rows A-C
            this._machine.itemsA.forEach((slot, i) => {
                if (slot.itemId) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `A${10 + i}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
            
            this._machine.itemsB.forEach((slot, i) => {
                if (slot.itemId) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `B${20 + i}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
            
            this._machine.itemsC.forEach((slot, i) => {
                if (slot.itemId) {
                    const itemData = $dataItems[parseInt(slot.itemId)];
                    if (itemData) {
                        const code = `C${30 + i}`;
                        this._items[code] = {
                            item: itemData,
                            price: parseInt(slot.price) || itemData.price
                        };
                    }
                }
            });
            
            // Setup row D (randomized)
            const data = loadDailyData();
            Object.entries(data.rowD).forEach(([code, itemId]) => {
                const itemData = $dataItems[itemId];
                if (itemData) {
                    this._items[code] = {
                        item: itemData,
                        price: itemData.price
                    };
                }
            });
        }
        
        refresh() {
            this.contents.clear();
            this.drawAllItems();
        }
        
        drawAllItems() {
            const rows = ['A', 'B', 'C', 'D'];
            const itemsPerRow = 3;
            const itemWidth = 56;
            const itemHeight = 80;
            const startX = 10;
            const startY = 10;
            
            rows.forEach((row, rowIndex) => {
                for (let i = 0; i < itemsPerRow; i++) {
                    const code = `${row}${row === 'A' ? 10 : row === 'B' ? 20 : row === 'C' ? 30 : 40}${i}`;
                    const x = startX + i * itemWidth;
                    const y = startY + rowIndex * itemHeight;
                    
                    this.drawItemSlot(code, x, y, itemWidth, itemHeight);
                }
            });
        }
        
        drawItemSlot(code, x, y, width, height) {
            const data = this._items[code];
            const purchaseCount = getPurchaseCount(this._machine.id, code);
            const soldOut = purchaseCount >= 3;
            
            // Draw frame
            this.contents.strokeRect(x, y, width - 4, height - 4, soldOut ? '#666666' : '#ffffff');
            
            // Draw code
            this.contents.fontSize = 14;
            this.contents.textColor = soldOut ? '#666666' : '#ffffff';
            this.drawText(code, x, y, width - 4, 'center');
            
            if (data && data.item) {
                // Draw icon
                const iconY = y + 20;
                this.drawIcon(data.item.iconIndex, x + (width - 32) / 2 - 2, iconY);
                
                if (soldOut) {
                    // Draw sold out overlay
                    this.contents.fillRect(x + 10, iconY + 8, width - 24, 16, 'rgba(0, 0, 0, 0.7)');
                    this.contents.fontSize = 12;
                    this.contents.textColor = '#ff6666';
                    this.drawText('SOLD OUT', x, iconY + 8, width - 4, 'center');
                }
                
                // Draw price
                this.contents.fontSize = 12;
                this.contents.textColor = soldOut ? '#666666' : '#ffcc66';
                this.drawText(`${data.price}G`, x, y + height - 20, width - 4, 'center');
            } else {
                // Draw "Out of stock" for empty slots
                this.contents.fontSize = 11;
                this.contents.textColor = '#666666';
                this.drawText('Out of', x, y + 25, width - 4, 'center');
                this.drawText('stock', x, y + 40, width - 4, 'center');
            }
        }
        
        getItemByCode(code) {
            return this._items[code];
        }
        
        getItemPosition(code) {
            const rows = ['A', 'B', 'C', 'D'];
            const row = code[0];
            const num = parseInt(code.substring(1));
            const rowIndex = rows.indexOf(row);
            
            if (rowIndex === -1) return null;
            
            const baseNum = row === 'A' ? 10 : row === 'B' ? 20 : row === 'C' ? 30 : 40;
            const colIndex = num - baseNum;
            
            const itemWidth = 56;
            const itemHeight = 80;
            const startX = 10;
            const startY = 10;
            
            return {
                x: startX + colIndex * itemWidth + itemWidth / 2 - 16,
                y: startY + rowIndex * itemHeight + 30
            };
        }
    }
    
    // Window_VendingKeypad
    class Window_VendingKeypad extends Window_Selectable {
        constructor(rect) {
            super(rect);
            this.refresh();
            this.select(0);
            this.activate();
        }
        
        maxItems() {
            return 15;
        }
        
        maxCols() {
            return 3;
        }
        
        itemHeight() {
            return 60;
        }
        
        drawItem(index) {
            const rect = this.itemRect(index);
            const buttons = [
                'A', '1', '2',
                'B', '3', '4',
                'C', '5', '6',
                'D', '7', '8',
                '', '9', '0',
                '', 'C', ''
            ];
            
            const text = buttons[index];
            if (text) {
                this.contents.fontSize = 24;
                this.drawText(text, rect.x, rect.y, rect.width, 'center');
            }
        }
        
        isOkEnabled() {
            const buttons = [
                'A', '1', '2',
                'B', '3', '4',
                'C', '5', '6',
                'D', '7', '8',
                '', '9', '0',
                '', 'C', ''
            ];
            return buttons[this.index()] !== '';
        }
        
        processOk() {
            if (this.isOkEnabled()) {
                const buttons = [
                    'A', '1', '2',
                    'B', '3', '4',
                    'C', '5', '6',
                    'D', '7', '8',
                    '', '9', '0',
                    '', 'C', ''
                ];
                
                this.playOkSound();
                //this.updateInputMethod();
                this.callHandler('input', buttons[this.index()]);
            } else {
                this.playBuzzerSound();
            }
        }
        
        isCursorMovable() {
            return this.isOpenAndActive();
        }
        
        cursorDown(wrap) {
            const index = this.index();
            const maxCols = this.maxCols();
            const maxItems = this.maxItems();
            
            let newIndex = index + maxCols;
            if (newIndex >= maxItems) {
                newIndex = index % maxCols;
            }
            
            // Skip empty buttons
            const buttons = [
                'A', '1', '2',
                'B', '3', '4',
                'C', '5', '6',
                'D', '7', '8',
                '', '9', '0',
                '', 'C', ''
            ];
            
            while (buttons[newIndex] === '' && newIndex !== index) {
                newIndex += maxCols;
                if (newIndex >= maxItems) {
                    newIndex = newIndex % maxCols;
                }
            }
            
            this.select(newIndex);
        }
        
        cursorUp(wrap) {
            const index = this.index();
            const maxCols = this.maxCols();
            const maxItems = this.maxItems();
            
            let newIndex = index - maxCols;
            if (newIndex < 0) {
                newIndex = index + maxCols * Math.floor((maxItems - 1 - index) / maxCols);
            }
            
            // Skip empty buttons
            const buttons = [
                'A', '1', '2',
                'B', '3', '4',
                'C', '5', '6',
                'D', '7', '8',
                '', '9', '0',
                '', 'C', ''
            ];
            
            while (buttons[newIndex] === '' && newIndex !== index) {
                newIndex -= maxCols;
                if (newIndex < 0) {
                    newIndex = index + maxCols * Math.floor((maxItems - 1 - index) / maxCols);
                }
            }
            
            this.select(newIndex);
        }
        
        onTouchSelect(trigger) {
            this._doubleTouch = false;
            if (this.isCursorMovable()) {
                const lastIndex = this.index();
                const hitIndex = this.hitTest(TouchInput.x, TouchInput.y);
                if (hitIndex >= 0) {
                    const buttons = [
                        'A', '1', '2',
                        'B', '3', '4',
                        'C', '5', '6',
                        'D', '7', '8',
                        '', '9', '0',
                        '', 'C', ''
                    ];
                    
                    if (buttons[hitIndex] !== '') {
                        if (hitIndex === this.index()) {
                            this._doubleTouch = true;
                        }
                        this.select(hitIndex);
                    }
                }
                if (trigger && this.index() !== lastIndex) {
                    this.playCursorSound();
                }
            }
        }
    }
    
    // Window_VendingDisplay
    class Window_VendingDisplay extends Window_Base {
        constructor(rect) {
            super(rect);
            this._code = '';
            this.refresh();
        }
        
        setCode(code) {
            this._code = code;
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            this.contents.fontSize = 32;
            this.drawText(this._code || '___', 0, 0, this.contents.width, 'center');
        }
    }
    
    // Initialize on game load
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        loadDailyData(); // Initialize daily data
    };
    
})();