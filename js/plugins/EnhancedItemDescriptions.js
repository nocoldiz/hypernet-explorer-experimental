
//=============================================================================
    // Detail Window
        /*:
 * @target MZ
 * @plugindesc v1.3.0 Enhanced inventory with weight system, detailed descriptions, and equipment management
 * @author Claude
 * @help EnhancedInventoryPlugin.js
 * * This plugin completely overhauls the inventory screen with:
 * - Split-view layout (items on left, details on right)
 * - Tabs to switch between items, weapons, armor, materials, and trash
 * - Text wrapping for long descriptions
 * - Detailed information display for all items and equipment
 * - Shows party members' equipment compatibility
 * - Direct equipment functionality from inventory screen
 * - Party member selection for item use
 * - "Use on All" option for party-wide item effects
 * - Special handling for food items
 * - Full translation support for Italian language
 * - WEIGHT SYSTEM with encumbrance mechanics
 * - TRASH SYSTEM to destroy unwanted items
 * * =====================
 * Weight System:
 * =====================
 * Add <weight:X> to an item's note field where X is weight in grams.
 * - Minimum weight is 1 gram
 * - Max carry weight is 60kg + bonus from COS stat (defense). Equipped items do not count toward weight.
 * - When overencumbered, player movement speed is reduced
 * - Weight is shown in item details and inventory header
 * * =====================
 * Food System:
 * =====================
 * Add <category:Food> to an item's note field to mark it as food.
 * Food items can be used even at full health.
 * When a food item is used:
 * - Variable 28 is set to the HP recovery percentage
 * - Common Event 23 is called when used by Actor 1 or the whole party
 * - Common Event 24 is called when used by Actor 2
 * * =====================
 * Trash System:
 * =====================
 * - A "Trash" tab lists all discardable items, weapons, and armors, sorted by weight.
 * - Selecting an item prompts for confirmation before destroying it.
 * - Key items cannot be discarded.
 * * =====================
 * Usage Notes:
 * =====================
 * - Back button works properly even when tabs aren't focused
 * - Equipment can be directly equipped by selecting a party member
 * - Buzzer plays if no party members can equip selected equipment
 * * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

        (function() {
            'use strict';
            
            //=============================================================================
            // Plugin Parameters
            //=============================================================================
            const FOOD_HP_RECOVERY_VARIABLE_ID = 28;
            const FOOD_COMMON_EVENT_ACTOR1 = 23;
            const FOOD_COMMON_EVENT_ACTOR2 = 24;
            const FOOD_COMMON_EVENT_ACTOR3 = 25;
            
            // Weight System Parameters
            const BASE_CARRY_WEIGHT = 60000; // 60kg in grams
            // const STR_WEIGHT_BONUS = 500; // 500g per STR point - No longer used
            const COS_WEIGHT_BONUS = 300; // 300g per COS point
            const OVERENCUMBERED_SPEED_PENALTY = 0.5; // 50% movement speed when overencumbered
        
            //=============================================================================
            // Weight System Functions
            //=============================================================================
            
            // Get item weight from note tag
            function getItemWeight(item) {
                if (!item || !item.note) return 1; // Minimum 1 gram
                
                const match = item.note.match(/<weight:\s*(\d+)>/i);
                if (match) {
                    return Math.max(1, parseInt(match[1]));
                }
                return 1; // Default 1 gram
            }
            
            // Calculate total inventory weight (only unequipped items)
            function calculateTotalWeight() {
                let totalWeight = 0;
            
                // 1. Regular items are always in the bag
                const items = $gameParty.items();
                for (const item of items) {
                    totalWeight += getItemWeight(item) * $gameParty.numItems(item);
                }
                
                // 2. Get a copy of weapon and armor counts
                const weapons = Object.assign({}, $gameParty._weapons);
                const armors = Object.assign({}, $gameParty._armors);
            
                // 3. Subtract equipped items from the counts
                for (const actor of $gameParty.members()) {
                    for (const equip of actor.equips()) {
                        if (equip) {
                            if (DataManager.isWeapon(equip)) {
                                if (weapons[equip.id]) {
                                    weapons[equip.id]--;
                                }
                            } else if (DataManager.isArmor(equip)) {
                                if (armors[equip.id]) {
                                    armors[equip.id]--;
                                }
                            }
                        }
                    }
                }
            
                // 4. Calculate weight of unequipped weapons
                for (const weaponId in weapons) {
                    if (weapons[weaponId] > 0) {
                        const weapon = $dataWeapons[weaponId];
                        totalWeight += getItemWeight(weapon) * weapons[weaponId];
                    }
                }
            
                // 5. Calculate weight of unequipped armors
                for (const armorId in armors) {
                    if (armors[armorId] > 0) {
                        const armor = $dataArmors[armorId];
                        totalWeight += getItemWeight(armor) * armors[armorId];
                    }
                }
            
                return totalWeight;
            }
            
            // Calculate max carry weight for party leader
            function calculateMaxCarryWeight() {
                const leader = $gameParty.leader();
                if (!leader) return BASE_CARRY_WEIGHT;
                
                const cosBonus = leader.param(3) * COS_WEIGHT_BONUS; // COS
                
                return BASE_CARRY_WEIGHT + cosBonus;
            }
            
            // Check if party is overencumbered
            function isOverencumbered() {
                return calculateTotalWeight() > calculateMaxCarryWeight();
            }
            
            // Format weight for display
            function formatWeight(grams) {
                if (grams < 1000) {
                    return grams + "g";
                } else {
                    return (grams / 1000).toFixed(1) + "kg";
                }
            }
        
            //=============================================================================
            // Game_Player Movement Speed Override
            //=============================================================================
            
            const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
            Game_Player.prototype.realMoveSpeed = function() {
                let speed = _Game_Player_realMoveSpeed.call(this);
                
                // Apply encumbrance penalty
                if (isOverencumbered()) {
                    speed = Math.max(1, speed * OVERENCUMBERED_SPEED_PENALTY);
                }
                
                return speed;
            };
        
            //=============================================================================
            // Enhanced Item Scene
            //=============================================================================
            
            function Scene_EnhancedItem() {
                this.initialize(...arguments);
            }
            
            Scene_EnhancedItem.prototype = Object.create(Scene_MenuBase.prototype);
            Scene_EnhancedItem.prototype.constructor = Scene_EnhancedItem;
            
            Scene_EnhancedItem.prototype.initialize = function() {
                Scene_MenuBase.prototype.initialize.call(this);
                this._mode = 'item'; // 'item', 'weapon', 'armor', 'keyItem', or 'trash'
            };
            
            Scene_EnhancedItem.prototype.create = function() {
                Scene_MenuBase.prototype.create.call(this);
                // Create windows in the correct order
                this.createWeightWindow();
                this.createTabWindow();
                this.createItemWindow();
                this.createDetailWindow();
                this.createActorWindow();
                this.createTargetWindow();
                this.createEquipSelectionWindow();
                this.createTrashConfirmationWindow();
                
                // Initialize with items view
                this._itemWindow.setCategory('item');
                this._itemWindow.refresh();
                
                // Set window connections
                this._itemWindow.setDetailWindow(this._detailWindow);
                this._itemWindow.setWeightWindow(this._weightWindow);
                
                // Create window relationships
                this._tabWindow.setHandlers(this);
                this._actorWindow.setHandlers(this);
                this._targetWindow.setHandlers(this);
                this._equipSelectionWindow.setHandlers(this);
                
                // Activate item window directly instead of tab window
                this._tabWindow.select(0);
                this._itemWindow.select(0);
                this._itemWindow.activate();
            };
            
            Scene_EnhancedItem.prototype.createWeightWindow = function() {
                const rect = this.weightWindowRect();
                this._weightWindow = new Window_Weight(rect);
                this.addWindow(this._weightWindow);
            };
            
            Scene_EnhancedItem.prototype.weightWindowRect = function() {
                const wx = 0;
                const wy = 0;
                const ww = Graphics.boxWidth;
                const wh = this.calcWindowHeight(1, true);
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createTabWindow = function() {
                const rect = this.tabWindowRect();
                this._tabWindow = new Window_EnhancedItemTab(rect);
                this.addWindow(this._tabWindow);
            };
            
            Scene_EnhancedItem.prototype.tabWindowRect = function() {
                const wx = 0;
                const wy = this._weightWindow.height;
                const ww = Graphics.boxWidth;
                const wh = this.calcWindowHeight(1, true);
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createItemWindow = function() {
                const rect = this.itemWindowRect();
                this._itemWindow = new Window_EnhancedItemList(rect);
                // Explicitly set handlers right when creating the window
                this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
                this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
                this.addWindow(this._itemWindow);
            };
            
            Scene_EnhancedItem.prototype.itemWindowRect = function() {
                const wx = 0;
                const wy = this._tabWindow.y + this._tabWindow.height;
                const ww = Math.floor(Graphics.boxWidth / 2);
                const wh = Graphics.boxHeight - wy;
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createDetailWindow = function() {
                const wx = Math.floor(Graphics.boxWidth / 2);
                const wy = this._tabWindow.y + this._tabWindow.height;
                const ww = Math.floor(Graphics.boxWidth / 2);
                const wh = Graphics.boxHeight - wy;
                this._detailWindow = new Window_ItemDetail(new Rectangle(wx, wy, ww, wh));
                this.addWindow(this._detailWindow);
            };
            
            Scene_EnhancedItem.prototype.createTargetWindow = function() {
                const rect = this.targetWindowRect();
                this._targetWindow = new Window_ItemTarget(rect);
                this._targetWindow.hide();
                this.addWindow(this._targetWindow);
            };
            
            Scene_EnhancedItem.prototype.targetWindowRect = function() {
                const wx = 0;
                const wy = this._tabWindow.y + this._tabWindow.height;
                const ww = Graphics.boxWidth;
                const wh = Graphics.boxHeight - wy;
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createActorWindow = function() {
                const rect = this.actorWindowRect();
                this._actorWindow = new Window_MenuActor(rect);
                this._actorWindow.hide();
                this.addWindow(this._actorWindow);
            };
            
            Scene_EnhancedItem.prototype.actorWindowRect = function() {
                const wx = 0;
                const wy = this._tabWindow.y + this._tabWindow.height;
                const ww = Graphics.boxWidth;
                const wh = Graphics.boxHeight - wy;
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createEquipSelectionWindow = function() {
                const rect = this.equipSelectionWindowRect();
                this._equipSelectionWindow = new Window_EquipSelection(rect);
                this._equipSelectionWindow.hide();
                this.addWindow(this._equipSelectionWindow);
            };
            
            Scene_EnhancedItem.prototype.equipSelectionWindowRect = function() {
                const wx = Math.floor(Graphics.boxWidth / 4);
                const wy = Math.floor(Graphics.boxHeight / 3);
                const ww = Math.floor(Graphics.boxWidth / 2);
                const wh = this.calcWindowHeight(Math.min($gameParty.size(), 2) + 1, true);
                return new Rectangle(wx, wy, ww, wh);
            };
            
            Scene_EnhancedItem.prototype.createTrashConfirmationWindow = function() {
                const rect = this.trashConfirmationWindowRect();
                this._trashConfirmationWindow = new Window_TrashConfirmation(rect);
                this._trashConfirmationWindow.setHandler("ok", this.onTrashConfirmOk.bind(this));
                this._trashConfirmationWindow.setHandler("cancel", this.onTrashConfirmCancel.bind(this));
                this.addWindow(this._trashConfirmationWindow);
            };
            
            Scene_EnhancedItem.prototype.trashConfirmationWindowRect = function() {
                const ww = 240;
                const wh = this.calcWindowHeight(3, true); // Height for question + 2 commands
                const wx = (Graphics.boxWidth - ww) / 2;
                const wy = (Graphics.boxHeight - wh) / 2;
                return new Rectangle(wx, wy, ww, wh);
            };
            
            //=============================================================================
            // Scene_EnhancedItem Handlers
            //=============================================================================
            
            Scene_EnhancedItem.prototype.onActorOk = function(actor) {
                // This is a placeholder in case we need to handle actor selection in the future
                this._actorWindow.hide();
                this._itemWindow.show();
                this._itemWindow.activate();
            };
            
            Scene_EnhancedItem.prototype.onActorCancel = function() {
                this._actorWindow.hide();
                this._itemWindow.show();
                this._itemWindow.activate();
            };
            
            // Ensure Tab selection properly sets up the item window
            Scene_EnhancedItem.prototype.onTabSelect = function(tabIndex) {
                // Clear the current list selection
                this._itemWindow.deselect();
                
                switch (tabIndex) {
                    case 0: // Items
                        this._mode = 'item';
                        this._itemWindow.setCategory('item');
                        break;
                    case 1: // Weapons
                        this._mode = 'weapon';
                        this._itemWindow.setCategory('weapon');
                        break;
                    case 2: // Armor
                        this._mode = 'armor';
                        this._itemWindow.setCategory('armor');
                        break;
                    case 3: // Materials (Key Items)
                        this._mode = 'keyItem';
                        this._itemWindow.setCategory('keyItem');
                        break;
                    case 4: // Trash
                        this._mode = 'trash';
                        this._itemWindow.setCategory('trash');
                        break;
                }
                
                // Important: Refresh window and reset position
                this._itemWindow.refresh();
                this._itemWindow.scrollTo(0, 0);
                
                // Activate the item window and make sure its handlers are set
                this._itemWindow.select(0);
                this._itemWindow.activate();
                this._tabWindow.deactivate();
            };
        
            Scene_EnhancedItem.prototype.onTabCancel = function() {
                this.popScene();
            };
            
            // Add a method to directly handle item selection from the item window
            Scene_EnhancedItem.prototype.onItemOk = function() {
                const item = this._itemWindow.item();
                
                if (!item) {
                    this._itemWindow.activate();
                    return;
                }
            
                if (this._mode === 'trash') {
                    this._trashConfirmationWindow.open();
                    this._trashConfirmationWindow.activate();
                    this._trashConfirmationWindow.select(0);
                    return;
                }
                
                // Handle selection based on item type
                if (DataManager.isItem(item)) {
                    this.handleItemSelection(item);
                } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                    this.handleEquipmentSelection(item);
                } else {
                    // Fallback - reactivate item window
                    this._itemWindow.activate();
                }
            };
            
            Scene_EnhancedItem.prototype.onItemCancel = function() {
                // Check which tab is currently selected
                const currentTabIndex = this._tabWindow.index();
                
                if (currentTabIndex === 0) { // If on the Items tab (first tab)
                    // Close the entire scene
                    this.popScene();
                } else {
                    // Original behavior - go back to tab selection
                    this._itemWindow.deselect();
                    this._tabWindow.activate();
                }
            };
            
            Scene_EnhancedItem.prototype.handleItemSelection = function(item) {
                if (DataManager.isItem(item)) {
                    if (this.isItemTargetRequired(item)) {
                        this.showItemTargetWindow(item);
                    } else {
                        this.useItemWithoutTarget(item);
                        this._itemWindow.refresh();
                        this._itemWindow.activate();
                        this._weightWindow.refresh();
                    }
                }
            };
            
            Scene_EnhancedItem.prototype.handleEquipmentSelection = function(item) {
                // Find actors who can equip this item
                const compatibleActors = this.findCompatibleActors(item);
                
                if (compatibleActors.length === 0) {
                    // If no one can equip, play buzzer and stay in item selection
                    SoundManager.playBuzzer();
                    this._itemWindow.activate();
                } else if (compatibleActors.length === 1) {
                    // If only one actor can equip, select them directly
                    this.equipItemToActor(item, compatibleActors[0]);
                } else {
                    // If multiple actors can equip, show selection window
                    this.showEquipSelectionWindow(item, compatibleActors);
                }
            };
            
            Scene_EnhancedItem.prototype.findCompatibleActors = function(item) {
                return $gameParty.members().filter(actor => actor.canEquip(item));
            };
            
            Scene_EnhancedItem.prototype.showEquipSelectionWindow = function(item, compatibleActors) {
                this._equipSelectionWindow.setItem(item);
                this._equipSelectionWindow.setActors(compatibleActors);
                this._equipSelectionWindow.refresh();
                this._equipSelectionWindow.show();
                this._equipSelectionWindow.activate();
                this._equipSelectionWindow.select(0);
            };
            
            Scene_EnhancedItem.prototype.onEquipSelectionOk = function() {
                const item = this._equipSelectionWindow.item();
                const actor = this._equipSelectionWindow.selectedActor();
                
                if (item && actor) {
                    this.equipItemToActor(item, actor);
                } else {
                    this._equipSelectionWindow.hide();
                    this._itemWindow.activate();
                }
            };
            
            Scene_EnhancedItem.prototype.onEquipSelectionCancel = function() {
                this._equipSelectionWindow.hide();
                this._itemWindow.activate();
            };
            
            Scene_EnhancedItem.prototype.equipItemToActor = function(item, actor) {
                if (!item || !actor) return;
                
                // Determine which slot the equipment fits into
                let slotId = -1;
                
                if (DataManager.isWeapon(item)) {
                    // Find the weapon slot
                    slotId = actor.equipSlots().indexOf(1);
                } else if (DataManager.isArmor(item)) {
                    // Find the matching armor type slot
                    const equipSlots = actor.equipSlots();
                    for (let i = 0; i < equipSlots.length; i++) {
                        if (equipSlots[i] === 2 && $dataArmors[item.id].etypeId === 2) {
                            // Shield/offhand
                            slotId = i;
                            break;
                        } else if (equipSlots[i] === 3 && $dataArmors[item.id].etypeId === 3) {
                            // Head
                            slotId = i;
                            break;
                        } else if (equipSlots[i] === 4 && $dataArmors[item.id].etypeId === 4) {
                            // Body
                            slotId = i;
                            break;
                        } else if (equipSlots[i] === 5 && $dataArmors[item.id].etypeId === 5) {
                            // Accessory
                            slotId = i;
                            break;
                        }
                    }
                }
                
                if (slotId >= 0) {
                    // Perform the equip
                    SoundManager.playEquip();
                    actor.changeEquip(slotId, item);
                    this._itemWindow.refresh();
                    this._weightWindow.refresh();
                    
                    // Hide equipment selection if it's visible
                    if (this._equipSelectionWindow.visible) {
                        this._equipSelectionWindow.hide();
                    }
                    
                    this._itemWindow.activate();
                } else {
                    SoundManager.playBuzzer();
                    if (this._equipSelectionWindow.visible) {
                        this._equipSelectionWindow.hide();
                    }
                    this._itemWindow.activate();
                }
            };
            
            Scene_EnhancedItem.prototype.isItemTargetRequired = function(item) {
                if (!item) return false;
                
                const scope = item.scope;
                return [7, 8, 9, 10].includes(scope); // These scopes target allies
            };
            
            Scene_EnhancedItem.prototype.showItemTargetWindow = function(item) {
                this._targetWindow.setItem(item);
                this._targetWindow.show();
                this._targetWindow.activate();
                this._targetWindow.select(0);
                this._itemWindow.hide();
                this._detailWindow.hide();
            };
            
            Scene_EnhancedItem.prototype.onTargetOk = function() {
                const item = this._targetWindow.item();
                const targetIndex = this._targetWindow.index();
                
                if (item) {
                    // Determine if "All Party" was selected
                    const partySize = $gameParty.members().length;
                    if (partySize > 1 && targetIndex === partySize) {
                        this.useItemOnAllParty(item);
                    } else {
                        // Use item on specific actor
                        const actor = $gameParty.members()[targetIndex];
                        if (actor) {
                            this.useItemOnActor(actor, item);
                        }
                    }
                    
                    this.hideTargetWindowAndRefresh();
                }
            };
            
            Scene_EnhancedItem.prototype.onTargetCancel = function() {
                this.hideTargetWindowAndRefresh();
            };
            
            Scene_EnhancedItem.prototype.onTrashConfirmOk = function() {
                const command = this._trashConfirmationWindow.currentSymbol();
                this._trashConfirmationWindow.close();
            
                if (command === 'yes') {
                    const item = this._itemWindow.item();
                    SoundManager.playOk(); // You might want a different sound for deleting
                    $gameParty.loseItem(item, 1);
                    
                    this._itemWindow.refresh();
                    this._weightWindow.refresh();
                    this._detailWindow.setItem(this._itemWindow.item()); // Update details to the new selection
                } else {
                    SoundManager.playCancel();
                }
            
                this._itemWindow.activate();
            };
            
            Scene_EnhancedItem.prototype.onTrashConfirmCancel = function() {
                this._trashConfirmationWindow.close();
                this._itemWindow.activate();
            };
            
            Scene_EnhancedItem.prototype.hideTargetWindowAndRefresh = function() {
                // Check if windows still exist (they might have been destroyed if scene changed)
                if (this._targetWindow && !this._targetWindow.destroyed) {
                    this._targetWindow.hide();
                }
                
                if (this._itemWindow && !this._itemWindow.destroyed) {
                    this._itemWindow.show();
                    this._itemWindow.refresh();
                    this._itemWindow.activate();
                }
                
                if (this._detailWindow && !this._detailWindow.destroyed) {
                    this._detailWindow.show();
                }
                
                if (this._weightWindow && !this._weightWindow.destroyed) {
                    this._weightWindow.refresh();
                }
            };
            
            Scene_EnhancedItem.prototype.useItemWithoutTarget = function(item) {
                if (!item) return;
                
                // Check if the item is usable
                if (item.scope === 0 || item.scope === 11) {
                    // Check for common event effects
                    const commonEventId = this.getCommonEventEffect(item);
                    
                    // Play sound effect
                    SoundManager.playUseItem();
                    
                    // Consume the item
                    $gameParty.consumeItem(item);
                    
                    if (commonEventId > 0) {
                        // Reserve the common event
                        $gameTemp.reserveCommonEvent(commonEventId);
                        // Return to map scene
                        SceneManager.goto(Scene_Map);
                        return;
                    }
                    
                    // Handle based on scope
                    if (item.scope === 0) {
                        // Global effect - apply to all party members
                        $gameParty.members().forEach(actor => {
                            actor.useItem(item);
                        });
                    } else if (item.scope === 11) {
                        // User effect - apply to leader
                        const actor = $gameParty.leader();
                        if (actor && actor.canUse(item)) {
                            actor.useItem(item);
                        }
                    }
                    
                    // Update the screen
                    $gameScreen.startFlash([255, 255, 255, 128], 8);
                } else {
                    // Not usable without a target
                    SoundManager.playBuzzer();
                }
            };
            
            Scene_EnhancedItem.prototype.useItemOnAllParty = function(item) {
                if (!item) return;
                SoundManager.playUseItem();
        
                // Helper function to check if an item has a specific category
                const isFood = this.hasItemCategory(item, "Food");
                
                // Consume the item
                $gameParty.consumeItem(item);
                
                // Get all valid targets (actors who can use the item or any actor if it's food)
                const validTargets = $gameParty.members().filter(actor => 
                    this._targetWindow.canUse(actor, item) || isFood
                );
                
                if (validTargets.length === 0) return;
                
                // Create a temporary action for calculations
                const tempActor = validTargets[0];
                const tempAction = new Game_Action(tempActor);
                tempAction.setItemObject(item);
                
                // Track total HP recovery percentage for food items
                let totalHpRecoveryPercent = 0;
                
                // Apply effects to all valid targets
                for (const actor of validTargets) {
                    // Apply damage/recovery
                    if (this.applyItemDamageEffects(actor, item)) {
                        // For food items, track HP recovery percent
                        if (isFood && item.damage && item.damage.type === 3) {
                            const action = new Game_Action(actor);
                            action.setItemObject(item);
                            const value = this.calculateHealingAmount(action, actor, item);
                            totalHpRecoveryPercent += Math.floor((value / actor.mhp) * 100);
                        }
                    }
                    
                    // Apply item's other effects
                    this.applyItemEffects(actor, item);
                    
                    // Refresh actor state
                    actor.refresh();
                }
                
                // Handle food items
                if (isFood) {
                    this.handleFoodItem(null, Math.floor(totalHpRecoveryPercent / validTargets.length), true);
                    return;
                }
                
                // Check for common event
                if (this.triggerCommonEvent(item)) {
                    return;
                }
                
                // Update game screen
                $gameScreen.startFlash([255, 255, 255, 128], 8);
            };
            
            Scene_EnhancedItem.prototype.useItemOnActor = function(actor, item) {
                if (!actor || !item) return;
                SoundManager.playUseItem();
        
                // Check if item is food
                const isFood = this.hasItemCategory(item, "Food");
                
                // Consume the item
                $gameParty.consumeItem(item);
                
                // Handle revival items
                if ((item.scope === 9 || item.scope === 10) && actor.isDead()) {
                    actor.setHp(1);
                }
                
                let hpRecoveryPercent = 0;
                
                // Apply damage/recovery effects
                if (this.applyItemDamageEffects(actor, item)) {
                    // Calculate HP recovery percent for food items
                    if (isFood && item.damage && item.damage.type === 3) {
                        const action = new Game_Action(actor);
                        action.setItemObject(item);
                        const value = this.calculateHealingAmount(action, actor, item);
                        hpRecoveryPercent = Math.floor((value / actor.mhp) * 100);
                    }
                }
                
                // Apply other effects
                this.applyItemEffects(actor, item);
                
                // Handle food items
                if (isFood) {
                    this.handleFoodItem(actor, hpRecoveryPercent);
                    return;
                }
                
                // Check for common event
                if (this.triggerCommonEvent(item)) {
                    return;
                }
                
                // Update visuals
                $gameScreen.startFlash([255, 255, 255, 128], 8);
                
                // Refresh actor
                actor.refresh();
            };
            
            Scene_EnhancedItem.prototype.calculateHealingAmount = function(action, target, item) {
                if (!action || !target || !item || !item.damage) return 0;
                
                // Calculate base value using damage formula
                let value = action.evalDamageFormula(target);
                
                // Apply variance
                value = action.applyVariance(value, item.damage.variance);
                
                // Apply critical if applicable
                if (item.damage.critical) {
                    value = action.applyCritical(value);
                }
                
                return value;
            };
            
            Scene_EnhancedItem.prototype.applyItemDamageEffects = function(actor, item) {
                if (!actor || !item || !item.damage || item.damage.type === 0) return false;
                
                // Create action for proper effect calculation
                const action = new Game_Action(actor);
                action.setItemObject(item);
                
                // Calculate damage/healing value
                let value = this.calculateHealingAmount(action, actor, item);
                
                // Apply the effect based on damage type
                switch (item.damage.type) {
                    case 1: // HP damage
                        actor.gainHp(-value);
                        break;
                    case 2: // MP damage
                        actor.gainMp(-value);
                        break;
                    case 3: // HP recovery
                        actor.gainHp(value);
                        SoundManager.playRecovery();
                        break;
                    case 4: // MP recovery
                        actor.gainMp(value);
                        SoundManager.playRecovery();
                        break;
                    case 5: // HP drain
                        actor.gainHp(value);
                        break;
                    case 6: // MP drain
                        actor.gainMp(value);
                        break;
                    default:
                        return false;
                }
                
                return true;
            };
            
            Scene_EnhancedItem.prototype.applyItemEffects = function(actor, item) {
                if (!actor || !item || !item.effects) return;
                
                // Apply each effect
                for (const effect of item.effects) {
                    this.applyItemEffect(actor, effect);
                }
            };
            
            Scene_EnhancedItem.prototype.applyItemEffect = function(actor, effect) {
                if (!actor || !effect) return;
                
                switch (effect.code) {
                    case Game_Action.EFFECT_REMOVE_DEBUFF:
                        actor.removeBuff(effect.dataId);
                        break;
                    case Game_Action.EFFECT_GROW:
                        actor.addParam(effect.dataId, Math.floor(effect.value1));
                        break;
                    case Game_Action.EFFECT_LEARN_SKILL:
                        actor.learnSkill(effect.dataId);
                        break;
                }
            };
            
            Scene_EnhancedItem.prototype.hasItemCategory = function(item, category) {
                if (!item || !item.note) return false;
                
                // Check for category in item notes
                const regex = new RegExp(`<category:${category}>`, 'i');
                return regex.test(item.note);
            };
            
            Scene_EnhancedItem.prototype.handleFoodItem = function(actor, hpRecoveryPercent, isParty = false) {
                // Set variable to HP recovery percentage
                $gameVariables.setValue(FOOD_HP_RECOVERY_VARIABLE_ID, hpRecoveryPercent);
                
                let commonEventId = 0;
                
                if (isParty || !actor) {
                    // When used on whole party or determining from context
                    commonEventId = FOOD_COMMON_EVENT_ACTOR1;
                } else if (actor.actorId() === 1) {
                    // When used by Actor 1
                    commonEventId = FOOD_COMMON_EVENT_ACTOR1;
                } else if (actor.actorId() === 2) {
                    // When used by Actor 2
                    commonEventId = FOOD_COMMON_EVENT_ACTOR2;
                } else if (actor.actorId() === 3) {
                    // When used by Actor 3
                    commonEventId = FOOD_COMMON_EVENT_ACTOR3;
                }
                
                if (commonEventId > 0) {
                    $gameTemp.reserveCommonEvent(commonEventId);
                    SceneManager.goto(Scene_Map);
                }
            };
            
            Scene_EnhancedItem.prototype.getCommonEventEffect = function(item) {
                if (!item || !item.effects) return 0;
                
                // Find the common event effect
                const commonEventEffect = item.effects.find(effect => 
                    effect.code === Game_Action.EFFECT_COMMON_EVENT
                );
                
                return commonEventEffect ? commonEventEffect.dataId : 0;
            };
            
            Scene_EnhancedItem.prototype.triggerCommonEvent = function(item) {
                const commonEventId = this.getCommonEventEffect(item);
                
                if (commonEventId > 0) {
                    $gameTemp.reserveCommonEvent(commonEventId);
                    SceneManager.goto(Scene_Map);
                    return true;
                }
                
                return false;
            };
            
            //=============================================================================
            // Weight Window Class
            //=============================================================================
            
            function Window_Weight() {
                this.initialize(...arguments);
            }
            
            Window_Weight.prototype = Object.create(Window_Base.prototype);
            Window_Weight.prototype.constructor = Window_Weight;
            
            Window_Weight.prototype.initialize = function(rect) {
                Window_Base.prototype.initialize.call(this, rect);
                this.refresh();
            };
            
            Window_Weight.prototype.refresh = function() {
                this.contents.clear();
                
                const currentWeight = calculateTotalWeight();
                const maxWeight = calculateMaxCarryWeight();
                const useTranslation = ConfigManager.language === 'it';
                
                // Draw weight information
                const x = 0;
                const y = 0;
                const width = this.innerWidth;
                
                // Change color based on encumbrance
                if (isOverencumbered()) {
                    this.changeTextColor(ColorManager.deathColor());
                } else if (currentWeight > maxWeight * 0.8) {
                    this.changeTextColor(ColorManager.crisisColor());
                } else {
                    this.changeTextColor(ColorManager.normalColor());
                }
                
                // Draw weight text
                const weightText = useTranslation ? "Peso" : "Weight";
                this.drawText(weightText + ": " + formatWeight(currentWeight) + " / " + formatWeight(maxWeight), x, y, width, 'center');
                
                // Draw encumbrance warning if overencumbered
                if (isOverencumbered()) {
                    this.changeTextColor(ColorManager.deathColor());
                    const warningText = useTranslation ? "Sovraccarico! Movimento rallentato!" : "Overencumbered! Movement slowed!";
                    this.drawText(warningText, x, y + this.lineHeight() / 2, width, 'center');
                }
                
                this.resetTextColor();
            };
            
            //=============================================================================
            // Tab Window Class
            //=============================================================================
            
            function Window_EnhancedItemTab() {
                this.initialize(...arguments);
            }
            
            Window_EnhancedItemTab.prototype = Object.create(Window_HorzCommand.prototype);
            Window_EnhancedItemTab.prototype.constructor = Window_EnhancedItemTab;
            
            Window_EnhancedItemTab.prototype.initialize = function(rect) {
                Window_HorzCommand.prototype.initialize.call(this, rect);
                this._scene = null;
                this.select(0);
            };
            
            Window_EnhancedItemTab.prototype.maxCols = function() {
                return 5; // Five tabs: Items, Weapons, Armor, Materials, Trash
            };
            
            Window_EnhancedItemTab.prototype.makeCommandList = function() {
                const useTranslation = ConfigManager.language === 'it'
                if(useTranslation){
                    this.addCommand("Oggetti", "item");
                    this.addCommand("Armi", "weapon");
                    this.addCommand("Armature", "armor");
                    this.addCommand("Materiali", "materials");
                    this.addCommand("Cestino", "trash");
                }else{
                    this.addCommand("Items", "item");
                    this.addCommand("Weapons", "weapon");
                    this.addCommand("Armor", "armor");
                    this.addCommand("Materials", "materials");
                    this.addCommand("Trash", "trash");
                }
        
            };
            
            Window_EnhancedItemTab.prototype.setHandlers = function(scene) {
                this._scene = scene;
                this.setHandler("ok", this.onTabOk.bind(this));
                this.setHandler("cancel", this.onTabCancel.bind(this));
                this.setHandler("item", this.onTabItem.bind(this));
                this.setHandler("weapon", this.onTabWeapon.bind(this));
                this.setHandler("armor", this.onTabArmor.bind(this));
                this.setHandler("materials", this.onTabMaterials.bind(this));
                this.setHandler("trash", this.onTabTrash.bind(this));
            };
            
            Window_EnhancedItemTab.prototype.onTabOk = function() {
                // Handle tab selection
                this._scene.onTabSelect(this.index());
            };
            
            Window_EnhancedItemTab.prototype.onTabCancel = function() {
                // Handle cancel
                this._scene.onTabCancel();
            };
            
            Window_EnhancedItemTab.prototype.onTabItem = function() {
                this._scene.onTabSelect(0);
            };
            
            Window_EnhancedItemTab.prototype.onTabWeapon = function() {
                this._scene.onTabSelect(1);
            };
            
            Window_EnhancedItemTab.prototype.onTabArmor = function() {
                this._scene.onTabSelect(2);
            };
            
            Window_EnhancedItemTab.prototype.onTabMaterials = function() {
                this._scene.onTabSelect(3);
            };
            
            Window_EnhancedItemTab.prototype.onTabTrash = function() {
                this._scene.onTabSelect(4);
            };
            
            Window_EnhancedItemTab.prototype.processHandling = function() {
                if (this.isOpenAndActive()) {
                    if (Input.isTriggered('ok') || Input.isRepeated('ok')) {
                        return this.processOk();
                    }
                    if (Input.isTriggered('cancel') || Input.isRepeated('cancel')) {
                        return this.processCancel();
                    }
                    if (Input.isRepeated('right')) {
                        this.cursorRight(Input.isTriggered('right'));
                    }
                    if (Input.isRepeated('left')) {
                        this.cursorLeft(Input.isTriggered('left'));
                    }
                    if (Input.isRepeated('down')) {
                        this.cursorDown(Input.isTriggered('down'));
                    }
                }
            };
            
            Window_EnhancedItemTab.prototype.cursorDown = function(triggered) {
                if (triggered) {
                    this.processOk();
                }
            };
            
            //=============================================================================
            // Enhanced Item List Window
            //=============================================================================
            
            function Window_EnhancedItemList() {
                this.initialize(...arguments);
            }
            
            Window_EnhancedItemList.prototype = Object.create(Window_ItemList.prototype);
            Window_EnhancedItemList.prototype.constructor = Window_EnhancedItemList;
            
            Window_EnhancedItemList.prototype.initialize = function(rect) {
                Window_ItemList.prototype.initialize.call(this, rect);
                this._category = "item";
                this._detailWindow = null;
                this._weightWindow = null;
                this._scene = null;
            };
            
            // Set item entries to a single column
            Window_EnhancedItemList.prototype.maxCols = function() {
                return 1;
            };
            
            // Enhanced display for items - with translation support
            Window_EnhancedItemList.prototype.drawItem = function(index) {
                const item = this.itemAt(index);
                if (item) {
                    const rect = this.itemLineRect(index);
                    const numberWidth = this.numberWidth();
                    const weightWidth = 80; // Space for weight display
                    
                    // Translate item name if translation function exists
                    const originalName = item.name;
                    if (window.translateText && typeof window.translateText === 'function') {
                        item.name = window.translateText(item.name);
                    }
                    
                    // Draw item with icon and translated name
                    this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth - weightWidth);
                    
                    // Restore original name
                    item.name = originalName;
                    
                    
                    // Draw quantity
                    this.resetTextColor();
                    this.drawItemNumber(item, rect.x, rect.y, rect.width);
                }
            };
            
            Window_EnhancedItemList.prototype.setDetailWindow = function(detailWindow) {
                this._detailWindow = detailWindow;
                this.updateDetail();
            };
            
            Window_EnhancedItemList.prototype.setWeightWindow = function(weightWindow) {
                this._weightWindow = weightWindow;
            };
            
            Window_EnhancedItemList.prototype.setCategory = function(category) {
                if (this._category !== category) {
                    this._category = category;
                    this._data = []; // Clear current data
                    this.makeItemList(); // Rebuild list for new category
                    this.refresh();
                    this.scrollTo(0, 0);
                }
            };
            
            Window_EnhancedItemList.prototype.includes = function(item) {
                if (this._category === "item") {
                    return DataManager.isItem(item) && item.itypeId === 1;
                } else if (this._category === "weapon") {
                    return DataManager.isWeapon(item);
                } else if (this._category === "armor") {
                    return DataManager.isArmor(item);
                } else if (this._category === "keyItem") {
                    return DataManager.isItem(item) && item.itypeId === 2;
                } else if (this._category === "trash") {
                    return item && (!DataManager.isItem(item) || item.itypeId !== 2);
                } else {
                    return false;
                }
            };
            
            Window_EnhancedItemList.prototype.makeItemList = function() {
                if (this._category === "item") {
                    this._data = $gameParty.allItems().filter(item => this.includes(item));
                } else if (this._category === "weapon") {
                    this._data = $gameParty.weapons().filter(item => this.includes(item));
                } else if (this._category === "armor") {
                    this._data = $gameParty.armors().filter(item => this.includes(item));
                } else if (this._category === "keyItem") {
                    this._data = $gameParty.allItems().filter(item => this.includes(item));
                } else if (this._category === "trash") {
                    this._data = $gameParty.allItems().filter(item => this.includes(item));
                    this._data.sort((a, b) => getItemWeight(b) - getItemWeight(a));
                } else {
                    this._data = [];
                }
                if (this.includes(null)) {
                    this._data.push(null);
                }
            };
            
            Window_EnhancedItemList.prototype.select = function(index) {
                Window_ItemList.prototype.select.call(this, index);
                this.updateDetail();
            };
            
            Window_EnhancedItemList.prototype.updateDetail = function() {
                if (this._detailWindow) {
                    const item = this.item();
                    this._detailWindow.setItem(item);
                }
            };
            
            Window_EnhancedItemList.prototype.setHandlers = function(scene) {
                this._scene = scene;
                this.setHandler("ok", this.onItemOk.bind(this));
                this.setHandler("cancel", this.onItemCancel.bind(this));
            };
            
            Window_EnhancedItemList.prototype.onItemOk = function() {
                this._scene.onItemOk();
            };
            
        
            Window_EnhancedItemList.prototype.processHandling = function() {
                if (this.isOpenAndActive()) {
                    if (Input.isTriggered('ok')) {
                        this.processOk();
                        return;
                    }
                    if (Input.isTriggered('cancel') || Input.isRepeated('cancel')) {
                        this.processCancel();
                        return;
                    }
                    // Add right/left handling for tab switching
                    if (Input.isRepeated('right')) {
                        this.switchToNextTab();
                    }
                    if (Input.isRepeated('left')) {
                        this.switchToPreviousTab();
                    }
                    if (Input.isRepeated('pagedown')) {
                        this.processPagedown();
                    }
                    if (Input.isRepeated('pageup')) {
                        this.processPageup();
                    }
                }
            };
            
            // Tab switching methods in the item window
            Window_EnhancedItemList.prototype.switchToNextTab = function() {
                if (!this._scene) return;
                
                const tabIndex = this._scene._tabWindow.index();
                if (tabIndex < 4) { // If not on the last tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(tabIndex + 1);
                    this._scene.onTabSelect(tabIndex + 1);
                }
            };
            
            Window_EnhancedItemList.prototype.switchToPreviousTab = function() {
                if (!this._scene) return;
                
                const tabIndex = this._scene._tabWindow.index();
                if (tabIndex > 0) { // If not on the first tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(tabIndex - 1);
                    this._scene.onTabSelect(tabIndex - 1);
                }
            };
        
            
            Window_EnhancedItemList.prototype.processPagedown = function() {
                if (this._category === "item") {
                    // Change to weapons tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(1);
                    this._scene.onTabSelect(1);
                } else if (this._category === "weapon") {
                    // Change to armor tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(2);
                    this._scene.onTabSelect(2);
                } else if (this._category === "armor") {
                    // Change to materials tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(3);
                    this._scene.onTabSelect(3);
                } else if (this._category === "keyItem") {
                    // Change to trash tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(4);
                    this._scene.onTabSelect(4);
                }
            };
            
            Window_EnhancedItemList.prototype.processPageup = function() {
                if (this._category === "trash") {
                    // Change to materials tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(3);
                    this._scene.onTabSelect(3);
                } else if (this._category === "keyItem") {
                    // Change to armor tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(2);
                    this._scene.onTabSelect(2);
                } else if (this._category === "armor") {
                    // Change to weapons tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(1);
                    this._scene.onTabSelect(1);
                } else if (this._category === "weapon") {
                    // Change to items tab
                    SoundManager.playCursor();
                    this._scene._tabWindow.select(0);
                    this._scene.onTabSelect(0);
                }
            };
            
            // Override the processOk method to make sure it works
            Window_EnhancedItemList.prototype.processOk = function() {
                if (this.isCurrentItemEnabled()) {
                    this.playOkSound();
                    this.updateInputData();
                    this.deactivate();
                    this.callOkHandler();
                } else {
                    this.playBuzzerSound();
                }
            };
            
            Window_EnhancedItemList.prototype.isCurrentItemEnabled = function() {
                const item = this.item();
                if (!item) return false;
            
                if (this._category === 'trash') {
                    return true;
                }
                
                // Always enable weapons and armor
                if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                    return true;
                }
                
                // For regular items, use the default logic (can the party use it)
                return $gameParty.canUse(item);
            };
        
            // Override the isEnabled method for consistency
            Window_EnhancedItemList.prototype.isEnabled = function(item) {
                if (!item) return false;
            
                if (this._category === 'trash') {
                    return true;
                }
                
                // Always enable weapons and armor
                if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                    return true;
                }
                
                // For regular items, check if party can use
                return $gameParty.canUse(item);
            };
        
            // If you're extending from Window_ItemList, also make sure its method is addressed
            // Add this to ensure full compatibility
            Window_ItemList.prototype.isEnabled = function(item) {
                if (!item) return false;
                
                // Always enable weapons and armor
                if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                    return true;
                }
                
                // Standard check for usable items
                return $gameParty.canUse(item);
            };
            
            // Add a direct method to call the ok handler from the window
            Window_EnhancedItemList.prototype.callOkHandler = function() {
                if (this.isHandled('ok')) {
                    this.callHandler('ok');
                }
            };
            
                    
                    function Window_ItemDetail() {
                        this.initialize(...arguments);
                    }
                    
                    Window_ItemDetail.prototype = Object.create(Window_Base.prototype);
                    Window_ItemDetail.prototype.constructor = Window_ItemDetail;
                    
                    Window_ItemDetail.prototype.initialize = function(rect) {
                        Window_Base.prototype.initialize.call(this, rect);
                        this._item = null;
                        this.refresh();
                    };
                    
                    Window_ItemDetail.prototype.setItem = function(item) {
                        if (this._item !== item) {
                            this._item = item;
                            this.refresh();
                        }
                    };
                    
                    Window_ItemDetail.prototype.refresh = function() {
                        this.contents.clear();
                        if (this._item) {
                            this.drawItemDetails();
                        }
                    };
                    
                    Window_ItemDetail.prototype.drawItemDetails = function() {
                        const item = this._item;
                        const lineHeight = this.lineHeight();
                        const contentWidth = this.width - this.padding * 2;
                        let y = 0;
                        
                        // Translate item name and draw with icon
                        const originalName = item.name;
                        if (window.translateText && typeof window.translateText === 'function') {
                            item.name = window.translateText(item.name);
                        }
                        this.drawItemName(item, 0, y, contentWidth);
                        // Restore original name
                        item.name = originalName;
                        y += lineHeight;
                        
                        // Draw horizontal rule
                        this.drawHorzLine(y);
                        y += 8;
                
                        // Translate description and draw with wrapping
                        if (item.description) {
                            let translatedDescription = item.description;
                            if (window.translateText && typeof window.translateText === 'function') {
                                translatedDescription = window.translateText(item.description);
                            }
                            
                            const descLines = this.wrapText(translatedDescription, contentWidth - 4);
                            for (const line of descLines) {
                                this.drawTextEx("\\c[6]" + line, 0, y, contentWidth);
                                y += lineHeight;
                            }
                        }
                        
                        // Draw horizontal rule
                        y += 8;
                        this.drawHorzLine(y);
                        y += 16;
                        
                        if (DataManager.isItem(item)) {
                            this.drawItemStats(item, y);
                        } else if (DataManager.isWeapon(item)) {
                            this.drawWeaponStats(item, y);
                        } else if (DataManager.isArmor(item)) {
                            this.drawArmorStats(item, y);
                        }
                    };
                    
                    Window_ItemDetail.prototype.drawItemStats = function(item, y) {
                        const lineHeight = this.lineHeight();
                        let currentY = y;
                        const useTranslation = ConfigManager.language === 'it'
                
                        // Draw item type
                        this.drawKeyValue(useTranslation ? "Tipo" : "Type", this.getItemTypeName(item), 0, currentY);
                        currentY += lineHeight;
                        
                        // Draw weight
                        const weight = getItemWeight(item);
                        this.drawKeyValue(useTranslation ? "Peso" : "Weight", formatWeight(weight), 0, currentY);
                        
                        // Draw price if not 0
                        if (item.price > 0) {
                            const euroPrice = (item.price / 100).toFixed(2);
                
                            this.drawKeyValue(useTranslation ? "Prezzo" : "Price", euroPrice + " €", 0, currentY);
                            currentY += lineHeight;
                        }
                        
                        // Draw consumable info for items
                        if (item.consumable !== undefined) {
                            this.drawKeyValue(useTranslation ? "Uso" : "Use", item.consumable ? (useTranslation ? "Singolo" : "Single") : (useTranslation ? "Illimitato" : "Unlimited"), 0, currentY);
                            currentY += lineHeight;
                        }
                        
                        // Draw scope/target information
                        this.drawKeyValue("Target", this.getScopeName(item.scope), 0, currentY);
                        currentY += lineHeight;
                        
                        // Draw occasion information
                        this.drawKeyValue(useTranslation ? "Usabile" : "Usable", this.getOccasionName(item.occasion), 0, currentY);
                        currentY += lineHeight;
                        
                        // Add a gap
                        
                        // Draw combat stats if they exist
                        const hasCombatStats = 
                            (item.speed !== undefined && item.speed !== 0) ||
                            (item.successRate !== undefined && item.successRate < 100) ||
                            (item.repeats && item.repeats > 1) ||
                            (item.tpGain !== undefined && item.tpGain !== 0) ||
                            (item.damage && item.damage.type > 0);
                        
                        if (hasCombatStats) {
                            currentY += lineHeight;
                            
                            // Add success rate if it exists
                            if (item.successRate !== undefined && item.successRate < 100) {
                                this.drawKeyValue(useTranslation ? "% Successo" : "Success %", item.successRate + "%", 0, currentY);
                                currentY += lineHeight;
                            }
                            
                            // Add repeat count if more than 1
                            if (item.repeats && item.repeats > 1) {
                                this.drawKeyValue(useTranslation ? "Colpi" : "Hits", item.repeats + (useTranslation ? " volte" : " times"), 0, currentY);
                                currentY += lineHeight;
                            }
                            
                            // Add speed modifier if not 0
                            if (item.speed !== undefined && item.speed !== 0) {
                                const speedSign = item.speed > 0 ? "+" : "";
                                this.drawKeyValue(useTranslation ? "Velocità" : "Speed", speedSign + item.speed, 0, currentY);
                                currentY += lineHeight;
                            }
                            
                            // Add TP gain if not 0
                            if (item.tpGain !== undefined && item.tpGain !== 0) {
                                this.drawKeyValue(useTranslation ? "+AP" : "AP Gain", item.tpGain.toString(), 0, currentY);
                                currentY += lineHeight;
                            }
                            
                            // Add HP damage/recovery
                            if (item.damage && item.damage.type > 0) {
                                
                                // Add elemental info
                                if (item.damage.elementId > 0) {
                                    this.drawKeyValue(useTranslation ? "Elemento" : "Element", this.getElementName(item.damage.elementId), 0, currentY);
                                    currentY += lineHeight;
                                }
                                
                                // Add variance
                                if (item.damage.variance !== undefined && item.damage.variance !== 0) {
                                    this.drawKeyValue(useTranslation ? "Var." : "Variance", item.damage.variance + "%", 0, currentY);
                                    currentY += lineHeight;
                                }
                                
                                // Add critical info
                                if (item.damage.critical !== undefined) {
                                    this.drawKeyValue(useTranslation ? "Critici" : "Can crit.", item.damage.critical ? (useTranslation ? "Si" : "Yes") : "No", 0, currentY);
                                    currentY += lineHeight;
                                }
                            }
                            
                            // Add a gap
                        }
                        
                        // Draw effects if they exist
                        if (item.effects && item.effects.length > 0) {
                            currentY += lineHeight;
                            
                            for (const effect of item.effects) {
                                const effectText = this.getEffectDescription(effect);
                                if (effectText) {
                                    const parts = effectText.split(": ");
                                    if (parts.length > 1) {
                                        this.drawKeyValue(parts[0], parts[1], 0, currentY);
                                    } else {
                                        this.drawTextEx("\\c[6]" + effectText, 0, currentY, this.width - this.padding * 2);
                                    }
                                    currentY += lineHeight;
                                }
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.drawWeaponStats = function(item, y) {
                        const lineHeight = this.lineHeight();
                        let currentY = y;
                        const useTranslation = ConfigManager.language === 'it';
                        
                        // Draw weapon info
                        
                        // Draw weapon type with translation
                        let weaponTypeName = $dataSystem.weaponTypes[item.wtypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            weaponTypeName = window.translateText(weaponTypeName);
                        }
                        this.drawKeyValue(useTranslation ? "Tipo" : "Type", weaponTypeName, 0, currentY);
                        currentY += lineHeight;
                        
                        // Draw weight
                        const weight = getItemWeight(item);
                        this.drawKeyValue(useTranslation ? "Peso" : "Weight", formatWeight(weight), 0, currentY);
                        currentY += lineHeight;
                        
                        // Show which party members can equip this weapon
                        currentY = this.drawEquipCompatibility(item, currentY);
                        
                        // Add a gap after compatibility check                        
                        // Draw price
                        if (item.price > 0) {
                            const euroPrice = (item.price / 100).toFixed(2);
                            this.drawKeyValue(useTranslation ? "Prezzo" : "Price", euroPrice + " €", 0, currentY);
                            currentY += lineHeight;
                        }
                        
                        // Add a gap

                        // Draw traits
                        if (item.traits && item.traits.length > 0) {
                            currentY += lineHeight;
                            
                            for (const trait of item.traits) {
                                const traitText = this.getTraitDescription(trait);
                                if (traitText) {
                                    const parts = traitText.split(": ");
                                    if (parts.length > 1) {
                                        this.drawKeyValue(parts[0], parts[1], 0, currentY);
                                    } else {
                                        this.drawTextEx("\\c[6]" + traitText, 0, currentY, this.width - this.padding * 2);
                                    }
                                    currentY += lineHeight;
                                }
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.drawEquipCompatibility = function(item, y) {
                        const lineHeight = this.lineHeight();
                        let currentY = y;
                        const useTranslation = ConfigManager.language === 'it'
                
                        // Draw a section header for equip compatibility
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "Equip. da:" : "Equip. by:", 0, currentY, this.width - this.padding * 2);
                        currentY += lineHeight;
                        
                        // Get party members
                        const party = $gameParty.members();
                        let equipInfoShown = false;
                        
                        // Check each actor in the party (limit to first two actors)
                        for (let i = 0; i < Math.min(2, party.length); i++) {
                            const actor = party[i];
                            
                            // Check if the actor can equip this item
                            const canEquip = actor.canEquip(item);
                            
                            // Display actor name and equip status
                            this.resetTextColor();
                            if (canEquip) {
                                const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
                                this.drawText(translatedName, 20, currentY, this.width - this.padding * 2 - 20);
                            }
                            
                            currentY += lineHeight;
                            equipInfoShown = true;
                        }
                        
                        // If we didn't show any party member info (empty party), show a message
                        if (!equipInfoShown) {
                            this.resetTextColor();
                            this.drawText(useTranslation ? "Nessun membro del party" : "No party members.", 20, currentY, this.width - this.padding * 2 - 20);
                            currentY += lineHeight;
                        }
                        
                        return currentY;
                    };
                    
                    Window_ItemDetail.prototype.drawArmorStats = function(item, y) {
                        const lineHeight = this.lineHeight();
                        let currentY = y;
                        const useTranslation = ConfigManager.language === 'it'
                
                        // Draw armor info
                        
                        // Draw armor type with translation
                        let armorTypeName = $dataSystem.armorTypes[item.atypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            armorTypeName = window.translateText(armorTypeName);
                        }
                        this.drawKeyValue(useTranslation ? "Tipo" : "Type", armorTypeName, 0, currentY);
                        currentY += lineHeight;
                        
                        // Draw equip type with translation
                        let equipTypeName = $dataSystem.equipTypes[item.etypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            equipTypeName = window.translateText(equipTypeName);
                        }
                        this.drawKeyValue("Slot", equipTypeName, 0, currentY);
                        currentY += lineHeight;
                        
                        // Draw weight
                        const weight = getItemWeight(item);
                        this.drawKeyValue(useTranslation ? "Peso" : "Weight", formatWeight(weight), 0, currentY);
                        currentY += lineHeight;
                        
                        // Show which party members can equip this armor
                        currentY = this.drawEquipCompatibility(item, currentY);
                        
                        
                        // Draw price
                        if (item.price > 0) {
                            const euroPrice = (item.price / 100).toFixed(2);
                
                            this.drawKeyValue(useTranslation ? "Prezzo" : "Price", euroPrice + " €", 0, currentY);
                            currentY += lineHeight;
                        }
                        

                        
                        // Draw traits
                        if (item.traits && item.traits.length > 0) {
                            currentY += lineHeight;
                            
                            for (const trait of item.traits) {
                                const traitText = this.getTraitDescription(trait);
                                if (traitText) {
                                    const parts = traitText.split(": ");
                                    if (parts.length > 1) {
                                        this.drawKeyValue(parts[0], parts[1], 0, currentY);
                                    } else {
                                        this.drawTextEx("\\c[6]" + traitText, 0, currentY, this.width - this.padding * 2);
                                    }
                                    currentY += lineHeight;
                                }
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.drawKeyValue = function(key, value, x, y) {
                        const width = this.width - this.padding * 2;
                        const keyWidth = Math.floor(width / 3);
                        
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(key, x, y, keyWidth);
                        
                        this.resetTextColor();
                        this.drawText(value, x + keyWidth, y, width - keyWidth, 'left');
                    };
                    
                    Window_ItemDetail.prototype.drawHorzLine = function(y) {
                        const lineY = y + this.lineHeight() / 2 - 1;
                        const width = this.width - this.padding * 2;
                        this.contents.fillRect(0, lineY, width, 2, ColorManager.systemColor());
                    };
                    
                    // Text wrapping function
                    Window_ItemDetail.prototype.wrapText = function(text, maxWidth) {
                        if (!text) return [];
                        
                        const result = [];
                        const words = text.split(' ');
                        let currentLine = '';
                        
                        for (const word of words) {
                            // Check if adding the next word exceeds the max width
                            const testLine = currentLine ? currentLine + ' ' + word : word;
                            const testWidth = this.textSizeEx(testLine).width;
                            
                            if (testWidth > maxWidth && currentLine) {
                                // If it exceeds and we already have content, push the current line
                                result.push(currentLine);
                                currentLine = word;
                            } else {
                                // Otherwise add to the current line
                                currentLine = testLine;
                            }
                        }
                        
                        // Don't forget to add the last line
                        if (currentLine) {
                            result.push(currentLine);
                        }
                        
                        // Handle newlines in original text
                        const finalResult = [];
                        for (const line of result) {
                            const subLines = line.split('\n');
                            for (const subLine of subLines) {
                                finalResult.push(subLine);
                            }
                        }
                        
                        return finalResult;
                    };
                    
                    //=============================================================================
                    // Helper Methods for Item Details
                    //=============================================================================
                    
                    Window_ItemDetail.prototype.getItemTypeName = function(item) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (DataManager.isItem(item)) {
                            return item.itypeId === 1 ? (useTranslation ? "Oggetto" : "Regular Item") : (useTranslation ? "Oggetto chiave" : "Key Item");
                        } else if (DataManager.isWeapon(item)) {
                            return useTranslation ? "Arma" : "Weapon";
                        } else if (DataManager.isArmor(item)) {
                            return useTranslation ? "Armatura" : "Armor";
                        }
                        return useTranslation ? "Sconosciuto" : "Unknown";
                    };
                    
                    Window_ItemDetail.prototype.getScopeName = function(scope) {
                        const useTranslation = ConfigManager.language === 'it'
                        if(useTranslation){
                            switch (scope) {
                                case 0: return "Nessuno";
                                case 1: return "Nemico";
                                case 2: return "Tutti i nemici";
                                case 3: return "Nemico casuale";
                                case 4: return "2 nemici casuali";
                                case 5: return "3 nemici casuali";
                                case 6: return "4 nemici casuali";
                                case 7: return "1 alleato";
                                case 8: return "Party";
                                case 9: return "1 alleato (Morto)";
                                case 10: return "Party (Morti)";
                                case 11: return "Utilizzatore";
                                default: return "Sconosciuto";
                            }
                        }else{
                            switch (scope) {
                                case 0: return "None";
                                case 1: return "1 Enemy";
                                case 2: return "All enemies";
                                case 3: return "1 random enemy";
                                case 4: return "2 random enemies";
                                case 5: return "3 random enemies";
                                case 6: return "4 random enemies";
                                case 7: return "1 ally";
                                case 8: return "All allies";
                                case 9: return "1 ally (Dead)";
                                case 10: return "All allies (Dead)";
                                case 11: return "User";
                                default: return "Unknown";
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.getOccasionName = function(occasion) {
                        const useTranslation = ConfigManager.language === 'it'
                        if(useTranslation){
                            switch (occasion) {
                                case 0: return "Sempre";
                                case 1: return "Battaglia";
                                case 2: return "Menu";
                                case 3: return "Mai";
                                default: return "Sconosciuto";
                            }
                        }else{
                            switch (occasion) {
                                case 0: return "Always";
                                case 1: return "Battle Only";
                                case 2: return "Menu Only";
                                case 3: return "Never";
                                default: return "Unknown";
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.getDamageTypeName = function(type) {
                        const useTranslation = ConfigManager.language === 'it'
                        if(useTranslation){
                            switch (type) {
                                case 1: return "-HP";
                                case 2: return "-MP";
                                case 3: return "+HP";
                                case 4: return "+MP";
                                case 5: return "Assorbi HP";
                                case 6: return "Assorbi MP";
                                default: return "Nessun danno";
                            }
                        }else{
                            switch (type) {
                                case 1: return "HP Damage";
                                case 2: return "MP Damage";
                                case 3: return "HP Recovery";
                                case 4: return "MP Recovery";
                                case 5: return "HP Drain";
                                case 6: return "MP Drain";
                                default: return "No Damage";
                            }
                        }
                    };
                    
                    Window_ItemDetail.prototype.getElementName = function(elementId) {
                        if (!elementId || elementId <= 0) return "None";
                        
                        // Get the element name from the database and translate it
                        if ($dataSystem && $dataSystem.elements && $dataSystem.elements[elementId]) {
                            let elementName = $dataSystem.elements[elementId];
                            if (window.translateText && typeof window.translateText === 'function') {
                                elementName = window.translateText(elementName);
                            }
                            return elementName;
                        }
                        return "Element " + elementId;
                    };
                    
                    Window_ItemDetail.prototype.getFormulaPreview = function(formula) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        // Show a simplified version of the formula
                        if (!formula) return "?";
                        
                        // Clean up the formula for display
                        let display = formula;
                        
                        // Replace common variables with readable text
                        if(useTranslation){
                            display = display.replace(/a\.atk/g, "FRZ");
                            display = display.replace(/b\.def/g, "COS");
                            display = display.replace(/a\.mat/g, "INT");
                            display = display.replace(/b\.mdf/g, "SAG");
                            display = display.replace(/a\.agi/g, "DES");
                            display = display.replace(/b\.luk/g, "PSI");
                        }else{
                            display = display.replace(/a\.atk/g, "STR");
                            display = display.replace(/b\.def/g, "COS");
                            display = display.replace(/a\.mat/g, "INT");
                            display = display.replace(/b\.mdf/g, "WIS");
                            display = display.replace(/a\.agi/g, "DEX");
                            display = display.replace(/b\.luk/g, "PSI");
                        }
                        
                        // Limit length
                        if (display.length > 30) {
                            display = display.substring(0, 27) + "...";
                        }
                        
                        return display;
                    };
                    
                    Window_ItemDetail.prototype.getEffectDescription = function(effect) {
                        if (!effect) return null;
                        const useTranslation = ConfigManager.language === 'it'
                
                        switch (effect.code) {
                            case Game_Action.EFFECT_RECOVER_HP:
                                return (useTranslation ? "+HP: " : "Recover HP: ") + (effect.value1 * 100) + "% + " + effect.value2;
                            case Game_Action.EFFECT_RECOVER_MP:
                                return (useTranslation ? "+MP: " : "Recover MP: ") + (effect.value1 * 100) + "% + " + effect.value2;
                            case Game_Action.EFFECT_GAIN_TP:
                                return (useTranslation ? "+ AP: " : "Gain AP: ") + effect.value1;
                            case Game_Action.EFFECT_ADD_STATE:
                                return (useTranslation ? "+ Status: " : "Add State: ") + this.getStateName(effect.dataId) + " (" + (effect.value1 * 100) + "%)";
                            case Game_Action.EFFECT_REMOVE_STATE:
                                return (useTranslation ? "- Status: " : "Remove State: ") + this.getStateName(effect.dataId) + " (" + (effect.value1 * 100) + "%)";
                            case Game_Action.EFFECT_ADD_BUFF:
                                return (useTranslation ? "+ Buff: " : "Add Buff: ") + this.getParameterName(effect.dataId) + " (" + effect.value1 + (useTranslation ? " turni)" : " turns)");
                            case Game_Action.EFFECT_ADD_DEBUFF:
                                return (useTranslation ? "+ Debuff: " : "Add Debuff: ") + this.getParameterName(effect.dataId) + " (" + effect.value1 + (useTranslation ? " turni)" : " turns)");
                            case Game_Action.EFFECT_REMOVE_BUFF:
                                return (useTranslation ? "- Buff: " : "Remove Buff: ") + this.getParameterName(effect.dataId);
                            case Game_Action.EFFECT_REMOVE_DEBUFF:
                                return (useTranslation ? "- Debuff: " : "Remove Debuff: ") + this.getParameterName(effect.dataId);
                            case Game_Action.EFFECT_SPECIAL:
                                return useTranslation ? "Speciale" : "Special Effect";
                            case Game_Action.EFFECT_GROW:
                                return (useTranslation ? "Aumenta: " : "Grow: ") + this.getParameterName(effect.dataId) + " +" + effect.value1;
                            case Game_Action.EFFECT_LEARN_SKILL:
                                return (useTranslation ? "Impara: " : "Learn Skill: ") + this.getSkillName(effect.dataId);
                            case Game_Action.EFFECT_COMMON_EVENT:
                                return useTranslation ? "Evento" : "Trigger Event";
                            default:
                                return null;
                        }
                    };
                
                    Window_ItemDetail.prototype.getTraitDescription = function(trait) {
                        if (!trait) return null;
                        const useTranslation = ConfigManager.language === 'it'
                
                        const code = trait.code;
                        const dataId = trait.dataId;
                        const value = trait.value;
                        
                        switch (code) {
                            case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                                return "Elem: " + this.getElementName(dataId) + " x" + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                                return "Debuff: " + this.getParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_STATE_RATE:
                                return (useTranslation ? "Stato: " : "State: ") + this.getStateName(dataId) + " x" + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_STATE_RESIST:
                                return (useTranslation ? "Resisti: " : "Resist: ") + this.getStateName(dataId);
                            case Game_BattlerBase.TRAIT_XPARAM:
                                return (useTranslation ? "Abilità: " : "Skill: ") + this.getXParameterName(dataId) + " +" + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_SPARAM:
                                return (useTranslation ? "Abilità: " : "Skill: ") + this.getSParameterName(dataId) + " x" + value;
                            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT:
                                return (useTranslation ? "Elemento: " : "Element: ") + this.getElementName(dataId);
                            case Game_BattlerBase.TRAIT_ATTACK_STATE:
                                return (useTranslation ? "Status: " : "State: ") + this.getStateName(dataId) + " " + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_ATTACK_SPEED:
                                return (useTranslation ? "Velocità: " : "Speed: ") + value;
                            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                                return (useTranslation ? "Volte:" : "Times: ") + value;
                            case Game_BattlerBase.TRAIT_STYPE_ADD:
                                return (useTranslation ? "+ Tipo Abilità: " : "Add Skill Type: ") + this.getSkillTypeName(dataId);
                            case Game_BattlerBase.TRAIT_STYPE_SEAL:
                                return (useTranslation ? "Sigilla Tipo: " : "Seal Type: ") + this.getSkillTypeName(dataId);
                            case Game_BattlerBase.TRAIT_SKILL_ADD:
                                return (useTranslation ? "+ Abilità: " : "Add Skill: ") + this.getSkillName(dataId);
                            case Game_BattlerBase.TRAIT_SKILL_SEAL:
                                return (useTranslation ? "Sigilla Abilità: " : "Seal Skill: ") + this.getSkillName(dataId);
                            case Game_BattlerBase.TRAIT_EQUIP_WTYPE:
                                return "Equip: " + this.getWeaponTypeName(dataId);
                            case Game_BattlerBase.TRAIT_EQUIP_ATYPE:
                                return "Equip: " + this.getArmorTypeName(dataId);
                            case Game_BattlerBase.TRAIT_EQUIP_LOCK:
                                return (useTranslation ? "Blocca: " : "Lock: ") + this.getEquipTypeName(dataId);
                            case Game_BattlerBase.TRAIT_EQUIP_SEAL:
                                return (useTranslation ? "Sigilla: " : "Seal: ") + this.getEquipTypeName(dataId);
                            case Game_BattlerBase.TRAIT_SLOT_TYPE:
                                return "Slot: " + dataId;
                            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                                return (useTranslation ? "Azioni Extra: +" : "Extra Actions: +") + Math.floor(value * 100) + "%";
                            case Game_BattlerBase.TRAIT_SPECIAL_FLAG:
                                return (useTranslation ? "Speciale: " : "Special: ") + this.getSpecialFlagName(dataId);
                            case Game_BattlerBase.TRAIT_COLLAPSE_TYPE:
                                return (useTranslation ? "Collasso: " : "Collapse: ") + dataId;
                            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                                return (useTranslation ? "Abilità Party: " : "Party Ability: ") + this.getPartyAbilityName(dataId);
                            default:
                                return null;
                        }
                    };
                    
                    Window_ItemDetail.prototype.getStateName = function(stateId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (!$dataStates || !$dataStates[stateId]) return (useTranslation ? "Status " : "State ") + stateId;
                        
                        let stateName = $dataStates[stateId].name;
                        if (window.translateText && typeof window.translateText === 'function') {
                            stateName = window.translateText(stateName);
                        }
                        return stateName;
                    };
                    
                    Window_ItemDetail.prototype.getParameterName = function(paramId) {
                        const useTranslation = ConfigManager.language === 'it'
                        const params = useTranslation ? [
                            "MaxHP", "MaxMP", "FRZ", "COS", "INT", "SAG", "DES", "PSI"
                        ] : [
                            "MaxHP", "MaxMP", "STR", "COS", "INT", "WIS", "DEX", "PSI"
                        ];
                
                        return params[paramId] || "Param " + paramId;
                    };
                    
                    Window_ItemDetail.prototype.getXParameterName = function(xparamId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        const xparams = useTranslation ? [
                            "% Colpire", "Evasione", "Critico", "Ev. Critica",
                            "Ev. Magica", "Riflesso", "Contrattacco", 
                            "Rig. HP", "Rig. MP", "Rig. AP"
                        ] : [
                            "Hit %", "Evasion", "Critical Rate", "Critical Evasion",
                            "Magic Evasion", "Magic Reflection", "Counter Attack", 
                            "HP Regeneration", "MP Regeneration", "AP Regeneration"
                        ];
                        
                        return xparams[xparamId] || "XParam " + xparamId;
                    };
                    
                    Window_ItemDetail.prototype.getSParameterName = function(sparamId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        const sparams = useTranslation ? [
                            "% Target", "Effetto Guardia", "Effetto Recupero", "Farmacologia",
                            "Costo MP", "Carica AP", "Danno Fisico", "Danno Magico",
                            "Damno Ambientale", "Tasso EXP"
                        ] : [
                            "Target Rate", "Guard Effect", "Recovery Effect", "Pharmacology",
                            "MP Cost", "AP Charge", "Physical Damage", "Magical Damage",
                            "Floor Damage", "Experience Rate"
                        ];
                        
                        return sparams[sparamId] || "SParam " + sparamId;
                    };
                    
                    Window_ItemDetail.prototype.getSpecialFlagName = function(flagId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        const flags = useTranslation ? [
                            "Auto Battaglia", "Guardia", "Sostituto", "Preserva AP"
                        ] : [
                            "Auto Battle", "Guard", "Substitute", "Preserve AP"
                        ];
                        
                        return flags[flagId] || "Flag " + flagId;
                    };
                    
                    Window_ItemDetail.prototype.getPartyAbilityName = function(abilityId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        const abilities = useTranslation ? [
                            "Incontri Dimezzati", "Nessun Incontro", "No Imboscate", 
                            "Aumenta Iniziativa", "Raddoppia Euro", "Raddoppia Drop Oggetti"
                        ] : [
                            "Encounter Half", "Encounter None", "Cancel Surprise", 
                            "Raise Preemptive", "Double Euro", "Drop Item Double"
                        ];
                        
                        return abilities[abilityId] || "Ability " + abilityId;
                    };
                    
                    Window_ItemDetail.prototype.getSkillName = function(skillId) {
                        if (!$dataSkills || !$dataSkills[skillId]) return "Skill " + skillId;
                        
                        let skillName = $dataSkills[skillId].name;
                        if (window.translateText && typeof window.translateText === 'function') {
                            skillName = window.translateText(skillName);
                        }
                        return skillName;
                    };
                    
                    Window_ItemDetail.prototype.getSkillTypeName = function(stypeId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (!$dataSystem || !$dataSystem.skillTypes || !$dataSystem.skillTypes[stypeId]) {
                            return (useTranslation ? "Tipo Abilità " : "Skill Type ") + stypeId;
                        }
                        
                        let skillTypeName = $dataSystem.skillTypes[stypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            skillTypeName = window.translateText(skillTypeName);
                        }
                        return skillTypeName;
                    };
                    
                    Window_ItemDetail.prototype.getWeaponTypeName = function(wtypeId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (!$dataSystem || !$dataSystem.weaponTypes || !$dataSystem.weaponTypes[wtypeId]) {
                            return (useTranslation ? "Tipo Arma " : "Weapon Type ") + wtypeId;
                        }
                        
                        let weaponTypeName = $dataSystem.weaponTypes[wtypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            weaponTypeName = window.translateText(weaponTypeName);
                        }
                        return weaponTypeName;
                    };
                    
                    Window_ItemDetail.prototype.getArmorTypeName = function(atypeId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (!$dataSystem || !$dataSystem.armorTypes || !$dataSystem.armorTypes[atypeId]) {
                            return (useTranslation ? "Tipo Armatura " : "Armor Type ") + atypeId;
                        }
                        
                        let armorTypeName = $dataSystem.armorTypes[atypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            armorTypeName = window.translateText(armorTypeName);
                        }
                        return armorTypeName;
                    };
                    
                    Window_ItemDetail.prototype.getEquipTypeName = function(etypeId) {
                        const useTranslation = ConfigManager.language === 'it'
                
                        if (!$dataSystem || !$dataSystem.equipTypes || !$dataSystem.equipTypes[etypeId]) {
                            return (useTranslation ? "Tipo Equip " : "Equip Type ") + etypeId;
                        }
                        
                        let equipTypeName = $dataSystem.equipTypes[etypeId];
                        if (window.translateText && typeof window.translateText === 'function') {
                            equipTypeName = window.translateText(equipTypeName);
                        }
                        return equipTypeName;
                    };
                    
                    //=============================================================================
                    // Trash Confirmation Window
                    //=============================================================================
                    
                    function Window_TrashConfirmation() {
                        this.initialize(...arguments);
                    }
                    
                    Window_TrashConfirmation.prototype = Object.create(Window_Command.prototype);
                    Window_TrashConfirmation.prototype.constructor = Window_TrashConfirmation;
                    
                    Window_TrashConfirmation.prototype.initialize = function(rect) {
                        Window_Command.prototype.initialize.call(this, rect);
                        this.openness = 0;
                        this.deactivate();
                    };
                    
                    Window_TrashConfirmation.prototype.makeCommandList = function() {
                        const useTranslation = ConfigManager.language === 'it';
                        this.addCommand(useTranslation ? "Getta via" : "Throw away", 'yes');
                        this.addCommand(useTranslation ? "Annulla" : "Cancel", 'no', true);
                    };
                    
                    Window_TrashConfirmation.prototype.refresh = function() {
                        this.contents.clear();
                        const useTranslation = ConfigManager.language === 'it';
                        const question = useTranslation ? "Gettare via?" : "Throw away?";
                        this.drawText(question, 0, 0, this.innerWidth, 'center');
                        Window_Command.prototype.refresh.call(this);
                    };
                    
                    Window_TrashConfirmation.prototype.itemRect = function(index) {
                        const rect = Window_Command.prototype.itemRect.call(this, index);
                        rect.y += this.lineHeight(); // Move commands down to make space for the question
                        return rect;
                    };
                    
                    //=============================================================================
                    // Override Scene_Menu to use our enhanced scene
                    //=============================================================================
                    
                    const _Scene_Menu_commandItem = Scene_Menu.prototype.commandItem;
                    Scene_Menu.prototype.commandItem = function() {
                        SceneManager.push(Scene_EnhancedItem);
                    };
                    
                    //=============================================================================
                    // Actor Window Extensions
                    //=============================================================================
                    
                    // Add handler setter to Window_MenuActor
                    Window_MenuActor.prototype.setHandlers = function(scene) {
                        this._scene = scene;
                        this.setHandler("ok", this.onActorOk.bind(this));
                        this.setHandler("cancel", this.onActorCancel.bind(this));
                    };
                    
                    Window_MenuActor.prototype.onActorOk = function() {
                        if (this._scene && this._scene.onActorOk) {
                            this._scene.onActorOk(this.actor());
                        }
                    };
                    
                    Window_MenuActor.prototype.onActorCancel = function() {
                        if (this._scene && this._scene.onActorCancel) {
                            this._scene.onActorCancel();
                        }
                    };
                    
                    //=============================================================================
                    // Input Handler Extensions
                    //=============================================================================
                    
                    // Add global cancel key support
                    const _Scene_EnhancedItem_update = Scene_EnhancedItem.prototype.update;
                    // Update method to handle right mouse click
                    Scene_EnhancedItem.prototype.update = function() {
                        Scene_MenuBase.prototype.update.call(this);
                        
                        // Close window when right mouse button is clicked
                        if (TouchInput.isCancelled()) {
                            this.popScene();
                            return;
                        }
                        
                        // Handle global cancel key to exit scene even when tabs aren't focused
                        if (Input.isTriggered('cancel')) {
                            // Only activate if no window is active or a window without a cancel handler is active
                            const activeWindow = this._windowLayer.children.find(w => w.active);
                            if (!activeWindow || !activeWindow.isHandled('cancel')) {
                                this.popScene();
                            }
                        }
                    };
                })();    //=============================================================================
                    // Target Selection Window
                    //=============================================================================
                    
                    function Window_ItemTarget() {
                        this.initialize(...arguments);
                    }
                    
                    Window_ItemTarget.prototype = Object.create(Window_Selectable.prototype);
                    Window_ItemTarget.prototype.constructor = Window_ItemTarget;
                    
                    Window_ItemTarget.prototype.initialize = function(rect) {
                        Window_Selectable.prototype.initialize.call(this, rect);
                        this._item = null;
                        this._scene = null;
                        this.refresh();
                        this.select(0);
                        this.hide();
                    };
                    
                    Window_ItemTarget.prototype.setItem = function(item) {
                        if (this._item !== item) {
                            this._item = item;
                            this.refresh();
                        }
                    };
                    
                    Window_ItemTarget.prototype.maxItems = function() {
                        return $gameParty.members().length;
                    };
                    
                    Window_ItemTarget.prototype.maxCols = function() {
                        // Display 2 actors side by side if party has 2 or more members
                        return Math.min($gameParty.members().length, 2);
                    };
                    Window_ItemTarget.prototype.itemWidth = function() {
                        return Math.floor((this.innerWidth - this.colSpacing()) / this.maxCols());
                    };
                    
                    Window_ItemTarget.prototype.itemHeight = function() {
                        return Math.floor(this.innerHeight / Math.min(2, this.maxItems()));
                    };
                    
                    Window_ItemTarget.prototype.item = function() {
                        return this._item;
                    };
                    
                    Window_ItemTarget.prototype.isCurrentItemEnabled = function() {
                        return this.isItemEnabled(this.index());
                    };
                    
                    Window_ItemTarget.prototype.isItemEnabled = function(index) {
                        if (index >= 0 && index < $gameParty.members().length) {
                            const actor = $gameParty.members()[index];
                            return this.canUse(actor, this._item);
                        }
                        return false;
                    };
                    
                    Window_ItemTarget.prototype.canUse = function(actor, item) {
                        if (!actor || !item) return false;
                        
                        // Check for food category tag to allow use at full health
                        const isFood = this.hasItemCategory(item, "Food");
                        
                        // Handle revival items
                        if (DataManager.isItem(item) && (item.scope === 9 || item.scope === 10)) {
                            return actor.isDead();
                        }
                        
                        // Handle HP recovery items
                        if (DataManager.isItem(item) && item.damage && item.damage.type === 3 && !isFood) {
                            // HP Recovery - check if not full HP
                            return actor.hp < actor.mhp;
                        }
                        
                        // Handle MP recovery items
                        if (DataManager.isItem(item) && item.damage && item.damage.type === 4) {
                            // MP Recovery - check if not full MP
                            return actor.mp < actor.mmp;
                        }
                        
                        // Otherwise check if actor can use the item
                        return actor.canUse(item);
                    };
                    
                
                    Window_ItemTarget.prototype.hasItemCategory = function(item, category) {
                        if (!item || !item.note) return false;
                        
                        const regex = new RegExp(`<category:${category}>`, 'i');
                        return regex.test(item.note);
                    };
                    
                    // Update Window_ItemTarget.prototype.drawItem method
                    Window_ItemTarget.prototype.drawItem = function(index) {
                        const actor = $gameParty.members()[index];
                        if (!actor) return;
                        const useTranslation = ConfigManager.language === 'it'
                    
                        // Calculate item rect
                        const rect = this.itemRect(index);
                        const padding = 10;
                        
                        // Clear the item area
                        this.resetTextColor();
                        this.changePaintOpacity(this.isItemEnabled(index));
                        
                        // Draw actor face
                        const faceWidth = 64;
                        const faceHeight = 64;
                        const faceX = rect.x + padding;
                        const faceY = rect.y + padding;
                        
                        try {
                            // Get the actor's sprite sheet name and character index
                            const spritesheetName = actor.characterName();
                            const characterIndex = actor.characterIndex();
                            
                            // Load and draw the custom bust image
                            const bustBitmap = ImageManager.loadBitmap('img/busts/' + spritesheetName + '/', characterIndex);
                            
                            // Draw the bust image when it's loaded
                            if (bustBitmap.isReady()) {
                               this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                            } else {
                               bustBitmap.addLoadListener(() => {
                                   try {
                                       this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                   } catch (error) {
                                       // Load fallback image if bust image fails
                                       const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                       if (fallbackBitmap.isReady()) {
                                           this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                       } else {
                                           fallbackBitmap.addLoadListener(() => {
                                               this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                           });
                                       }
                                   }
                               });
                               
                               // Also add error listener for the main bitmap
                               bustBitmap.addErrorListener(() => {
                                   // Load fallback image if bust image fails to load
                                   const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                   if (fallbackBitmap.isReady()) {
                                       this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                   } else {
                                       fallbackBitmap.addLoadListener(() => {
                                           this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                       });
                                   }
                               });
                            }
                        } catch (error) {
                            // Load fallback image if any error occurs
                            try {
                                const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                if (fallbackBitmap.isReady()) {
                                    this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                } else {
                                    fallbackBitmap.addLoadListener(() => {
                                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                    });
                                }
                            } catch (fallbackError) {
                                console.warn('Failed to load both bust image and fallback image:', error, fallbackError);
                            }
                        }
                        
                        // Draw actor name with translation
                        const nameX = faceX + faceWidth + padding;
                        const nameY = faceY;
                        const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
                        this.drawText(translatedName, nameX, nameY, rect.width - faceWidth - padding * 3, 'left');
                        
                        // Set positions for gauges
                        const gaugeWidth = rect.width - faceWidth - padding * 3;
                        const gaugeHeight = 16;
                        const gaugeX = nameX;
                        let gaugeY = nameY + this.lineHeight();
                        
                        // Draw HP
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("HP ", gaugeX, gaugeY, 30);
                        this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.hpRate(), 
                                      ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
                        this.changeTextColor(ColorManager.hpColor(actor));
                        this.drawText(actor.hp + " / " + actor.mhp + "", gaugeX + 35, gaugeY, gaugeWidth - 35, 'left');
                        
                        // Draw MP
                        gaugeY += gaugeHeight + 8;
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("MP ", gaugeX, gaugeY, 30);
                        this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.mpRate(), 
                                      ColorManager.mpGaugeColor1(), ColorManager.mpGaugeColor2());
                        this.changeTextColor(ColorManager.mpColor(actor));
                        this.drawText(actor.mp + " / " + actor.mmp + "", gaugeX + 35, gaugeY, gaugeWidth - 35, 'left');
                        
                        // Draw AP if system uses it
                        if ($dataSystem.optDisplayTp) {
                            gaugeY += gaugeHeight + 8;
                            this.changeTextColor(ColorManager.systemColor());
                            this.drawText("AP ", gaugeX, gaugeY, 30);
                            this.drawGauge(gaugeX + 35, gaugeY, gaugeWidth - 35, actor.tpRate(), 
                                          ColorManager.tpGaugeColor1(), ColorManager.tpGaugeColor2());
                            this.changeTextColor(ColorManager.tpColor(actor));
                            this.drawText(actor.tp + " / 100", gaugeX + 35, gaugeY, gaugeWidth - 35, 'left');
                        }
                        
                        // Draw basic stats aligned to the left
                        gaugeY += gaugeHeight + 16;
                        const statX = gaugeX;
                        const statWidth = 80;
                        const valueWidth = 60;
                        
                        // Row 1: Attack & Defense
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "FRZ" :"STR", statX, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(2), statX + statWidth, gaugeY, valueWidth, 'left');
                        
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "COS" :"COS", statX + statWidth + valueWidth + 20, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(3), statX + statWidth * 2 + valueWidth + 20, gaugeY, valueWidth, 'left');
                        
                        // Row 2: M.Attack & M.Defense
                        gaugeY += this.lineHeight();
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("INT", statX, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(4), statX + statWidth, gaugeY, valueWidth, 'left');
                        
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "SAG" :"WIS", statX + statWidth + valueWidth + 20, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(5), statX + statWidth * 2 + valueWidth + 20, gaugeY, valueWidth, 'left');
                        
                        // Row 3: Agility & Luck
                        gaugeY += this.lineHeight();
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "DES:" :"DEX", statX, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(6), statX + statWidth, gaugeY, valueWidth, 'left');
                        
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("PSI", statX + statWidth + valueWidth + 20, gaugeY, statWidth, 'left');
                        this.resetTextColor();
                        this.drawText(actor.param(7), statX + statWidth * 2 + valueWidth + 20, gaugeY, valueWidth, 'left');
                        
                        // Reset paint opacity
                        this.changePaintOpacity(true);
                    };
                    Window_ItemTarget.prototype.drawAllPartyOption = function(rect) {
                        const padding = 20;
                        const nameWidth = 140;
                        const useTranslation = ConfigManager.language === 'it'
                
                        // Draw "All Party" text
                        this.changePaintOpacity(this.isItemEnabled($gameParty.members().length));
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText(useTranslation ? "Tutto il Party" : "All Party", rect.x + padding, rect.y, nameWidth);
                        
                        // Draw description
                        this.resetTextColor();
                        this.drawText(useTranslation ? "Dividi gli effetti tra i compagni" : "Distribute effects among members", rect.x + padding + nameWidth, rect.y, 
                                     rect.width - padding - nameWidth);
                        this.changePaintOpacity(true);
                    };
                    
                    Window_ItemTarget.prototype.drawActorInfo = function(actor, rect) {
                        if (!actor) return;
                        
                        const padding = 20;
                        const nameWidth = 140;
                        const gaugeWidth = 90;
                        const valueWidth = 70;
                        const spacing = 20;
                        
                        // Enable/disable based on whether actor can use the item
                        this.changePaintOpacity(this.isItemEnabled($gameParty.members().indexOf(actor)));
                        
                        // Draw actor name with translation
                        this.changeTextColor(ColorManager.systemColor());
                        const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
                        this.drawText(translatedName, rect.x + padding, rect.y, nameWidth);
                        
                        let x = rect.x + padding + nameWidth + spacing;
                        
                        // Draw HP information
                        this.drawActorHp(actor, x, rect.y, gaugeWidth);
                        x += gaugeWidth + valueWidth + spacing;
                        
                        // Draw MP information
                        this.drawActorMp(actor, x, rect.y, gaugeWidth);
                        x += gaugeWidth + valueWidth + spacing;
                        
                        // Draw TP information if using TP
                        if ($dataSystem.optDisplayTp) {
                            this.drawActorTp(actor, x, rect.y, gaugeWidth);
                        }
                        
                        this.changePaintOpacity(true);
                    };
                    
                    Window_ItemTarget.prototype.drawActorHp = function(actor, x, y, width) {
                        // Draw HP gauge
                        const color1 = ColorManager.hpGaugeColor1();
                        const color2 = ColorManager.hpGaugeColor2();
                        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
                        
                        // Draw HP values with label after
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("HP", x, y, 30);
                        
                        this.changeTextColor(ColorManager.hpColor(actor));
                        this.drawText(actor.hp + " / " + actor.mhp + " HP", x + 35, y, width - 35, 'left');
                    };
                    Window_ItemTarget.prototype.drawActorMp = function(actor, x, y, width) {
                        // Draw MP gauge
                        const color1 = ColorManager.mpGaugeColor1();
                        const color2 = ColorManager.mpGaugeColor2();
                        this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
                        
                        // Draw MP values with label after
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("MP", x, y, 30);
                        
                        this.changeTextColor(ColorManager.mpColor(actor));
                        this.drawText(actor.mp + " / " + actor.mmp + "", x + 35, y, width - 35, 'left');
                    };
                    
                    
                    Window_ItemTarget.prototype.drawActorTp = function(actor, x, y, width) {
                        // Draw AP gauge
                        const color1 = ColorManager.tpGaugeColor1();
                        const color2 = ColorManager.tpGaugeColor2();
                        this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
                        
                        // Draw AP label and values
                        this.changeTextColor(ColorManager.systemColor());
                        this.drawText("AP", x, y, 30);
                        
                        this.changeTextColor(ColorManager.tpColor(actor));
                        this.drawText(actor.tp + " / 100 AP", x + 35, y, width - 35, 'left');
                    };
                    
                    Window_ItemTarget.prototype.refresh = function() {
                        this.contents.clear();
                        this.drawAllItems();
                    };
                    
                    Window_ItemTarget.prototype.setHandlers = function(scene) {
                        this._scene = scene;
                        this.setHandler("ok", this.onTargetOk.bind(this));
                        this.setHandler("cancel", this.onTargetCancel.bind(this));
                    };
                    
                    Window_ItemTarget.prototype.onTargetOk = function() {
                        this._scene.onTargetOk();
                    };
                    
                    Window_ItemTarget.prototype.onTargetCancel = function() {
                        this._scene.onTargetCancel();
                    };
                    //=============================================================================
                    // Equipment Selection Window
                    //=============================================================================
                    
                    function Window_EquipSelection() {
                        this.initialize(...arguments);
                    }
                    
                    Window_EquipSelection.prototype = Object.create(Window_Selectable.prototype);
                    Window_EquipSelection.prototype.constructor = Window_EquipSelection;
                    
                    Window_EquipSelection.prototype.initialize = function(rect) {
                        Window_Selectable.prototype.initialize.call(this, rect);
                        this._item = null;
                        this._actors = [];
                        this._scene = null;
                        this.refresh();
                        this.hide();
                    };
                    
                    Window_EquipSelection.prototype.setItem = function(item) {
                        if (this._item !== item) {
                            this._item = item;
                            this.refresh();
                        }
                    };
                    
                    Window_EquipSelection.prototype.setActors = function(actors) {
                        this._actors = actors || [];
                        this.refresh();
                    };
                    
                    Window_EquipSelection.prototype.maxItems = function() {
                        return this._actors.length;
                    };
                    
                    Window_EquipSelection.prototype.item = function() {
                        return this._item;
                    };
                    
                    Window_EquipSelection.prototype.selectedActor = function() {
                        return this._actors[this.index()];
                    };
                    
                // Equipment selection window with translation support
                Window_EquipSelection.prototype.drawItem = function(index) {
                    const rect = this.itemLineRect(index);
                    const actor = this._actors[index];
                    const useTranslation = ConfigManager.language === 'it'
                    const padding = 10;
                
                    if (actor) {
                        const faceWidth = 64;
                        const faceHeight = 64;
                        const faceX = rect.x + padding;
                        const faceY = rect.y + padding;
                        
                        try {
                            // Get the actor's sprite sheet name and character index
                            const spritesheetName = actor.characterName();
                            const characterIndex = actor.characterIndex();
                            
                            // Load and draw the custom bust image
                            const bustBitmap = ImageManager.loadBitmap('img/busts/' + spritesheetName + '/', characterIndex);
                            
                            // Draw the bust image when it's loaded
                            if (bustBitmap.isReady()) {
                               this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                            } else {
                               bustBitmap.addLoadListener(() => {
                                   try {
                                       this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                   } catch (error) {
                                       // Load fallback image if bust image fails
                                       const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                       if (fallbackBitmap.isReady()) {
                                           this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                       } else {
                                           fallbackBitmap.addLoadListener(() => {
                                               this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                           });
                                       }
                                   }
                               });
                               
                               // Also add error listener for the main bitmap
                               bustBitmap.addErrorListener(() => {
                                   // Load fallback image if bust image fails to load
                                   const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                   if (fallbackBitmap.isReady()) {
                                       this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                   } else {
                                       fallbackBitmap.addLoadListener(() => {
                                           this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                       });
                                   }
                               });
                            }
                        } catch (error) {
                            // Load fallback image if any error occurs
                            try {
                                const fallbackBitmap = ImageManager.loadBitmap('img/busts/Animals01/', '7');
                                if (fallbackBitmap.isReady()) {
                                    this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                } else {
                                    fallbackBitmap.addLoadListener(() => {
                                        this.contents.blt(fallbackBitmap, 0, 0, fallbackBitmap.width, fallbackBitmap.height, faceX, faceY, faceWidth, faceHeight);
                                    });
                                }
                            } catch (fallbackError) {
                                console.warn('Failed to load both bust image and fallback image:', error, fallbackError);
                            }
                        }
                        
                        // Draw actor name with translation
                        const translatedName = window.translateText ? window.translateText(actor.name()) : actor.name();
                        this.drawText(translatedName, rect.x + 72, rect.y, 120);
                        
                        // Show current equipment in that slot
                        if (this._item) {
                            let equipType = "";
                            let currentEquip = null;
                            
                            if (DataManager.isWeapon(this._item)) {
                                equipType = useTranslation ? "Arma" : "Weapon";
                                currentEquip = actor.weapons()[0]; // Simplified to first weapon
                            } else if (DataManager.isArmor(this._item)) {
                                // Determine armor type
                                switch (this._item.etypeId) {
                                    case 2:
                                        equipType = useTranslation ? "Scudo" : "Shield";
                                        currentEquip = actor.armors().find(a => a.etypeId === 2);
                                        break;
                                    case 3:
                                        equipType = useTranslation ? "Testa" : "Head";
                                        currentEquip = actor.armors().find(a => a.etypeId === 3);
                                        break;
                                    case 4:
                                        equipType = useTranslation ? "Corpo" : "Body";
                                        currentEquip = actor.armors().find(a => a.etypeId === 4);
                                        break;
                                    case 5:
                                        equipType = useTranslation ? "Accessorio" : "Accessory";
                                        currentEquip = actor.armors().find(a => a.etypeId === 5);
                                        break;
                                    default:
                                        equipType = useTranslation ? "Armatura" : "Armor";
                                        break;
                                }
                            }
                            
                            // Draw equipment type
                            this.changeTextColor(ColorManager.systemColor());
                            this.drawText(equipType + ":", rect.x + 72, rect.y + 32, 100);
                            
                            // Draw current equipment or "None" with translation
                            this.resetTextColor();
                            if (currentEquip) {
                                // Translate equipment name
                                const originalName = currentEquip.name;
                                if (window.translateText && typeof window.translateText === 'function') {
                                    currentEquip.name = window.translateText(currentEquip.name);
                                }
                                this.drawItemName(currentEquip, rect.x + 180, rect.y + 32, 200);
                                // Restore original name
                                currentEquip.name = originalName;
                            } else {
                                this.drawText(useTranslation ? "Nessuno" : "None", rect.x + 180, rect.y + 32, 200);
                            }
                        }
                    }
                };
                
                    Window_EquipSelection.prototype.drawActorMenuImage = function(actor, x, y) {
                        // This is a simplified method - in a real implementation you'd use actor face graphics
                        const faceIndex = actor.faceIndex();
                        const faceName = actor.faceName();
                        const width = ImageManager.faceWidth;
                        const height = ImageManager.faceHeight;
                        const faceWidth = 64;
                        const faceHeight = 64;
                        const faceX = rect.x + padding;
                        const faceY = rect.y + padding;
                        
                        // Get the actor's sprite sheet name and character index
                        const spritesheetName = actor.characterName();
                        const characterIndex = actor.characterIndex();
                        
                        // Load and draw the custom bust image
                        const bustImagePath = `img/busts/${spritesheetName}/${characterIndex}`;
                        const bustBitmap = ImageManager.loadBitmap('img/busts/' + spritesheetName + '/', characterIndex);
                        
                        // Draw the bust image when it's loaded
                        if (bustBitmap.isReady()) {
                           this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                        } else {
                           bustBitmap.addLoadListener(() => {
                               this.contents.blt(bustBitmap, 0, 0, bustBitmap.width, bustBitmap.height, faceX, faceY, faceWidth, faceHeight);
                           });
                        }    };
                    
                    Window_EquipSelection.prototype.refresh = function() {
                        this.contents.clear();
                        this.drawAllItems();
                        const useTranslation = ConfigManager.language === 'it';
                        
                        // Draw window title with translation
                        this.changeTextColor(ColorManager.systemColor());
                        const titleText = useTranslation ? "Equipaggia a quale personaggio?" : "Equip to which character?";
                        this.drawText(titleText, 0, 0, this.width - this.padding * 2, 'center');
                    };
                    
                    Window_EquipSelection.prototype.setHandlers = function(scene) {
                        this._scene = scene;
                        this.setHandler("ok", this.onSelectionOk.bind(this));
                        this.setHandler("cancel", this.onSelectionCancel.bind(this));
                    };
                    
                    Window_EquipSelection.prototype.onSelectionOk = function() {
                        this._scene.onEquipSelectionOk();
                    };
                    
                    Window_EquipSelection.prototype.onSelectionCancel = function() {
                        this._scene.onEquipSelectionCancel();
                    };