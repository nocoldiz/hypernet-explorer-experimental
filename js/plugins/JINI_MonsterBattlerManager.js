/*:
 * @target MZ
 * @plugindesc Manages a monster battling system where a dummy actor becomes a monster. (v2.3)
 * @author JINI
 * @version 2.3.0
 *
 * @param controllingSwitch
 * @text Controlling Switch
 * @desc The switch ID that activates the monster battling system.
 * @type switch
 * @default 46
 *
 * @param dummyActorId
 * @text Dummy Actor ID
 * @desc The ID of the actor who will act as the monster battler.
 * @type actor
 * @default 4
 *
 * @param dummyClassId
 * @text Dummy Class ID
 * @desc The ID of the class for the dummy actor. Skills are managed by the plugin.
 * @type class
 * @default 65
 *
 * @param switchCommandName
 * @text Switch Command Name
 * @desc The name for the in-battle command to switch monsters.
 * @type string
 * @default Switch
 *
 * @command addAllMonsters
 * @text Add All Monsters (for Testing)
 * @desc Adds all enemies with a <LV:x> tag to the defeated list, making them available.
 *
 * @help JINI_MonsterBattlerManager.js (v2.3)
 *
 * This plugin implements a monster battler system using a single dummy actor.
 *
 * ============================================================================
 * Version 2.3 Notes
 * ============================================================================
 * - Fixed defeated enemies not showing in the available list
 * - Monster battle system now only activates if switch is ON and roster has monsters
 * - Switch command is properly hidden when switch 46 is off
 * - Enemy ID 1 is always unlocked with 0 cost
 * - If entering battle without roster, proceeds as normal battle
 *
 * ============================================================================
 * SETUP
 * ============================================================================
 *
 * 1. Plugin Parameters:
 * - Set the 'Controlling Switch'.
 * - Set the 'Dummy Actor ID' to the actor you will use as a monster proxy.
 * - Set the 'Dummy Class ID' for that actor.
 *
 * 2. Database Setup:
 * - Dummy Actor: In the database, select your dummy actor (e.g., Actor 4).
 * - REMOVE its Face and Character graphics. Leave them blank.
 * - Assign its class to your dummy class (e.g., Class 65).
 *
 * 3. Enemy Note Tags:
 * - For any enemy to be usable, add a note tag: <LV: x>
 * - Example: <LV: 25>
 *
 */

(() => {
    'use strict';

    const PLUGIN_NAME = 'JINI_MonsterBattlerManager';
    const PARAMS = PluginManager.parameters(PLUGIN_NAME);
    const CONTROL_SWITCH_ID = Number(PARAMS['controllingSwitch'] || 46);
    const DUMMY_ACTOR_ID = Number(PARAMS['dummyActorId'] || 4);
    const DUMMY_CLASS_ID = Number(PARAMS['dummyClassId'] || 65);
    const SWITCH_COMMAND_NAME = String(PARAMS['switchCommandName'] || 'Switch');
    
    // Helper function to extract level from note text
    function extractLevelFromNote(enemy) {
        if (!enemy || !enemy.note) return null;
        
        // Look for "LV: X" at the start of the note
        const match = enemy.note.match(/^LV:\s*(\d+)/i);
        if (match) {
            return parseInt(match[1], 10);
        }
        
        // Also check for <LV:X> format as fallback
        if (enemy.meta.LV) {
            return parseInt(enemy.meta.LV, 10);
        }
        
        return null;
    }

    // Helper function to check if enemy has level
    function hasLevel(enemy) {
        return extractLevelFromNote(enemy) !== null;
    }

    //=============================================================================
    // ** Plugin Command
    //=============================================================================
    PluginManager.registerCommand(PLUGIN_NAME, "addAllMonsters", args => {
        console.log("=== ADD 20 RANDOM MONSTERS COMMAND ===");
        
        // Get all enemies with level tags
        const allValidEnemies = [];
        for (let i = 1; i < $dataEnemies.length; i++) {
            const enemy = $dataEnemies[i];
            if (enemy && hasLevel(enemy)) {
                allValidEnemies.push(enemy.id);
            }
        }
        
        console.log(`Found ${allValidEnemies.length} valid enemies with level tags`);
        
        // Clear current unlocked list and add 20 random monsters
        $gameSystem._unlockedMonsters = [];
        
        // Shuffle and take up to 20
        const shuffled = [...allValidEnemies].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(20, shuffled.length));
        
        selected.forEach(enemyId => {
            $gameSystem.addUnlockedMonster(enemyId);
        });
        
        console.log(`Added ${selected.length} random monsters to unlocked list`);
        console.log("Selected monster IDs:", selected);
        console.log("=== END COMMAND ===");
    });

    //=============================================================================
    // ** Game_System
    //=============================================================================
    Game_System.prototype.isMonsterSystemEnabled = function() {
        return $gameSwitches.value(CONTROL_SWITCH_ID);
    };

    // Check if monster battle should actually activate (switch ON + has monsters in roster)
    Game_System.prototype.shouldUseMonsterBattle = function() {
        if (!this.isMonsterSystemEnabled()) return false;
        const roster = this.monsterRoster().filter(id => id > 0);
        return roster.length > 0;
    };

    //=============================================================================
    // ** Game_Actor
    //=============================================================================
    Game_Actor.prototype.setBattlerName = function(name) {
        this._battlerName = name;
    };

    Game_Actor.prototype.setFaceName = function(name) {
        this._faceName = name;
    };

    const _Game_Actor_battlerName = Game_Actor.prototype.battlerName;
    Game_Actor.prototype.battlerName = function() {
        if (this._battlerName !== undefined) return this._battlerName;
        return _Game_Actor_battlerName.call(this);
    };
    const _Game_Actor_characterName = Game_Actor.prototype.characterName;
    Game_Actor.prototype.characterName = function() {
        if (this._characterName !== undefined) return this._characterName;
        return _Game_Actor_characterName.call(this);
    };
    const _Game_Actor_faceName = Game_Actor.prototype.faceName;
    Game_Actor.prototype.faceName = function() {
        if (this._faceName !== undefined) return this._faceName;
        return _Game_Actor_faceName.call(this);
    };

    Game_Actor.prototype.syncToMonster = function(enemyId) {
        const enemy = $dataEnemies[enemyId];
        if (!enemy) return;
        this._monsterEnemyId = enemyId;
        const level = Math.min(extractLevelFromNote(enemy) || 1, 99);
        this.setName(enemy.name);
        this.setBattlerName(enemy.battlerName);
        this.setFaceName("");
        this.changeLevel(level, false);
        this.clearSkills();
        for (const action of enemy.actions) {
            if (action.skillId > 0) this.learnSkill(action.skillId);
        }
        this.recoverAll();
    };

    Game_Actor.prototype.resetFromMonster = function() {
        this._monsterEnemyId = 0;
        const actorData = $dataActors[this._actorId];
        this.setName(actorData.name);
        this.setBattlerName(actorData.battlerName);
        this.setFaceName(actorData.faceName);
        this.changeLevel(1, false);
        this.initSkills();
        this.recoverAll();
    };
    
    const _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        if (this._monsterEnemyId && $gameSystem.isMonsterSystemEnabled()) {
            const enemy = $dataEnemies[this._monsterEnemyId];
            return enemy.params[paramId];
        }
        return _Game_Actor_paramBase.call(this, paramId);
    };

    Game_Actor.prototype.clearSkills = function() { this._skills = []; };

    //=============================================================================
    // ** Game_Party & BattleManager
    //=============================================================================
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._activeMonsterRosterIndex = 0;
        this._battleMonsterStatus = [];
    };

    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        // Only setup monster battle if switch is on AND roster has monsters
        if ($gameSystem.shouldUseMonsterBattle()) {
            this.setupMonsterBattle();
        }
        _BattleManager_setup.call(this, troopId, canEscape, canLose);
        if ($gameSystem.shouldUseMonsterBattle()) {
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
        }
    };

    BattleManager.setupMonsterBattle = function() {
        $gameSystem._originalPartyMembers = $gameParty.allMembers().map(actor => actor.actorId());
        $gameParty._actors = [];
        $gameParty.addActor(DUMMY_ACTOR_ID);
        const dummyActor = $gameActors.actor(DUMMY_ACTOR_ID);
        const roster = $gameSystem.monsterRoster().filter(id => id > 0);
        $gameParty._battleMonsterStatus = roster.map(() => true);
        $gameParty._activeMonsterRosterIndex = 0;
        if (roster.length > 0) {
            dummyActor.syncToMonster(roster[0]);
        } else {
            dummyActor.resetFromMonster();
        }
    };

    const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function() {
        if ($gameSystem._originalPartyMembers && $gameSystem._originalPartyMembers.length > 0) {
            this.restoreOriginalParty();
        }
        _BattleManager_updateBattleEnd.call(this);
    };

    BattleManager.restoreOriginalParty = function() {
        $gameActors.actor(DUMMY_ACTOR_ID).resetFromMonster();
        $gameParty._actors = [];
        $gameSystem._originalPartyMembers.forEach(actorId => $gameParty.addActor(actorId));
        $gameSystem._originalPartyMembers = [];
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    };

    //=============================================================================
    // ** Death and Switching Logic
    //=============================================================================
    const _Game_Actor_die = Game_Actor.prototype.die;
    Game_Actor.prototype.die = function() {
        _Game_Actor_die.call(this);
        if ($gameSystem.shouldUseMonsterBattle() && this.actorId() === DUMMY_ACTOR_ID) {
            $gameParty._battleMonsterStatus[$gameParty._activeMonsterRosterIndex] = false;
            const nextIndex = $gameParty._battleMonsterStatus.findIndex(status => status === true);
            if (nextIndex !== -1) {
                const roster = $gameSystem.monsterRoster().filter(id => id > 0);
                const nextMonsterId = roster[nextIndex];
                $gameParty._activeMonsterRosterIndex = nextIndex;
                this.syncToMonster(nextMonsterId);
                this.performRebirth();
                BattleManager.refreshStatus();
            }
        }
    };
    Game_Actor.prototype.performRebirth = function() { this.requestAnimation(52); };

    //=============================================================================
    // ** Battle Command: Switch
    //=============================================================================
    const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        _Window_ActorCommand_makeCommandList.call(this);
        // Only show switch command if monster system is enabled AND has monsters in roster
        if (this._actor && this._actor.actorId() === DUMMY_ACTOR_ID && $gameSystem.shouldUseMonsterBattle()) {
            const availableSwitches = $gameParty._battleMonsterStatus.filter(s => s).length;
            this.addCommand(SWITCH_COMMAND_NAME, 'switchMonster', availableSwitches > 1);
        }
    };

    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler('switchMonster', this.commandSwitchMonster.bind(this));
    };

    Scene_Battle.prototype.commandSwitchMonster = function() {
        const roster = $gameSystem.monsterRoster().filter(id => id > 0);
        const status = $gameParty._battleMonsterStatus;
        let nextIndex = $gameParty._activeMonsterRosterIndex;
        for (let i = 1; i < roster.length; i++) {
            const potentialIndex = (nextIndex + i) % roster.length;
            if (status[potentialIndex]) {
                 nextIndex = potentialIndex;
                 break;
            }
        }
        $gameParty._activeMonsterRosterIndex = nextIndex;
        BattleManager.actor().syncToMonster(roster[nextIndex]);
        this.endCommandSelection();
        BattleManager.endTurn();
    };

    //=============================================================================
    // ** Data Management
    //=============================================================================
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this.initMonsterBattlerData();
    };
    
    Game_System.prototype.initMonsterBattlerData = function() {
        if (!this._monsterRoster) this._monsterRoster = [0, 0, 0, 0];
        if (!this._unlockedMonsters) this._unlockedMonsters = [];
        if (!this._originalPartyMembers) this._originalPartyMembers = [];
        
        console.log("Initializing monster battler data...");
        console.log("Initial unlocked monsters:", this._unlockedMonsters);
        
        // Always ensure enemy ID 1 is available if it has LV tag
        if ($dataEnemies && $dataEnemies[1] && hasLevel($dataEnemies[1])) {
            if (!this._unlockedMonsters.includes(1)) {
                this._unlockedMonsters.push(1);
                console.log("Added enemy ID 1 to unlocked list automatically");
            }
        }
    };
    
    Game_System.prototype.monsterRoster = function() {
        if (!this._monsterRoster) this.initMonsterBattlerData();
        return this._monsterRoster;
    };
    
    Game_System.prototype.unlockedMonsters = function() {
        if (!this._unlockedMonsters) this.initMonsterBattlerData();
        console.log("Getting unlocked monsters:", this._unlockedMonsters);
        return this._unlockedMonsters;
    };
    
    Game_System.prototype.addUnlockedMonster = function(enemyId) {
        console.log(`Attempting to add unlocked monster ${enemyId}...`);
        
        if (!$dataEnemies[enemyId]) {
            console.log(`Enemy ${enemyId} does not exist in database`);
            return;
        }
        
        const enemy = $dataEnemies[enemyId];
        console.log(`Enemy ${enemyId} data:`, enemy);
        
        const level = extractLevelFromNote(enemy);
        console.log(`Extracted level: ${level}`);
        
        if (!hasLevel(enemy)) {
            console.log(`Enemy ${enemyId} has no level data`);
            return;
        }
        
        // Ensure unlocked monsters array exists
        if (!this._unlockedMonsters) {
            this._unlockedMonsters = [];
        }
        
        // Add to front of array (most recent first)
        const index = this._unlockedMonsters.indexOf(enemyId);
        if (index > -1) {
            // Remove if already exists
            this._unlockedMonsters.splice(index, 1);
        }
        
        // Add to front
        this._unlockedMonsters.unshift(enemyId);
        
        // Keep only latest 20
        if (this._unlockedMonsters.length > 20) {
            this._unlockedMonsters = this._unlockedMonsters.slice(0, 20);
        }
        
        console.log(`Successfully added monster ${enemyId} (${enemy.name}) to unlocked list`);
        console.log("Current unlocked monsters:", this._unlockedMonsters);
    };
    
    const _Game_Troop_onBattleEnd = Game_Troop.prototype.onBattleEnd;
    Game_Troop.prototype.onBattleEnd = function() {
        _Game_Troop_onBattleEnd.call(this);
        // Add defeated monsters to the unlocked list
        this.deadMembers().forEach(enemy => {
            $gameSystem.addUnlockedMonster(enemy.enemyId());
        });
    };
    
    //=============================================================================
    // ** Menu Integration
    //=============================================================================
    const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        _Window_MenuCommand_addMainCommands.call(this);
        if ($gameSystem.isMonsterSystemEnabled()) {
            this.addCommand("Monsters", 'monsterManager', true);
        }
    };
    
    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('monsterManager', () => SceneManager.push(Scene_MonsterManager));
    };

    //=============================================================================
    // ** Monster Manager Scene
    //=============================================================================
    function Scene_MonsterManager() { this.initialize(...arguments); }
    Scene_MonsterManager.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_MonsterManager.prototype.constructor = Scene_MonsterManager;
    
    Scene_MonsterManager.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createGoldWindow();
        this.createRosterWindow();
        this.createAvailableWindow();
    };
    
    Scene_MonsterManager.prototype.createGoldWindow = function() {
        this._goldWindow = new Window_Gold(new Rectangle(Graphics.boxWidth - 240, this.mainAreaTop(), 240, this.calcWindowHeight(1, true)));
        this.addWindow(this._goldWindow);
    };
    
    Scene_MonsterManager.prototype.createRosterWindow = function() {
        const rect = new Rectangle(0, this._goldWindow.y + this._goldWindow.height + 8, 300, this.mainAreaHeight() - this._goldWindow.height - 8);
        this._rosterWindow = new Window_MonsterRoster(rect);
        this._rosterWindow.setHandler('cancel', this.popScene.bind(this));
        this._rosterWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._rosterWindow);
    };
    
    Scene_MonsterManager.prototype.createAvailableWindow = function() {
        const rect = new Rectangle(300, this._rosterWindow.y, Graphics.boxWidth - 300, this._rosterWindow.height);
        this._availableWindow = new Window_MonsterAvailable(rect);
        this._availableWindow.setHandler('ok', this.onAvailableOk.bind(this));
        this._availableWindow.setHandler('cancel', this.activateRosterWindow.bind(this));
        this._availableWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._availableWindow);
        this._rosterWindow.setHandler('ok', this.activateAvailableWindow.bind(this));
    };
    
    Scene_MonsterManager.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._rosterWindow.activate();
        this._rosterWindow.select(0);
        this._helpWindow.setText("Select an empty slot, then choose a monster to add.");
    };
    
    Scene_MonsterManager.prototype.activateRosterWindow = function() {
        this._rosterWindow.activate();
        this._availableWindow.deselect();
    };
    
    Scene_MonsterManager.prototype.activateAvailableWindow = function() {
        if ($gameSystem.monsterRoster().filter(id => id === 0).length > 0) {
            this._availableWindow.activate();
            this._availableWindow.select(0);
            this._rosterWindow.deactivate();
        } else {
             this._helpWindow.setText("Roster is full! You cannot add more monsters.");
             SoundManager.playBuzzer();
             this._rosterWindow.activate();
        }
    };
    
    Scene_MonsterManager.prototype.onAvailableOk = function() {
        const monster = this._availableWindow.item();
        const cost = this.getMonsterCost(monster);
        if ($gameParty.gold() < cost) {
            SoundManager.playBuzzer();
            this._helpWindow.setText("Not enough gold!");
            this.activateAvailableWindow();
            return;
        }
        const firstEmptyIndex = $gameSystem.monsterRoster().indexOf(0);
        if (firstEmptyIndex !== -1) {
            $gameParty.loseGold(cost);
            $gameSystem.monsterRoster()[firstEmptyIndex] = monster.id;
            SoundManager.playOk();
            this._rosterWindow.refresh();
            this._goldWindow.refresh();
            this.activateRosterWindow();
        }
    };
    
    Scene_MonsterManager.prototype.getMonsterCost = function(enemy) {
        // Enemy ID 1 always costs 0, others cost level * 100 (reduced from 1000)
        if (enemy && enemy.id === 1) return 0;
        const level = extractLevelFromNote(enemy);
        return level ? level * 100 : 0;
    };

    //=============================================================================
    // ** Monster Roster Window
    //=============================================================================
    function Window_MonsterRoster() { this.initialize(...arguments); }
    Window_MonsterRoster.prototype = Object.create(Window_Selectable.prototype);
    Window_MonsterRoster.prototype.constructor = Window_MonsterRoster;
    
    Window_MonsterRoster.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_MonsterRoster.prototype.maxItems = function() { return 4; };
    Window_MonsterRoster.prototype.itemHeight = function() { return this.lineHeight() * 2; };
    
    Window_MonsterRoster.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const enemyId = $gameSystem.monsterRoster()[index];
        this.drawText(`Slot ${index + 1}:`, rect.x, rect.y, rect.width, 'left');
        if (enemyId > 0) {
            const enemy = $dataEnemies[enemyId];
            this.drawText(enemy.name, rect.x, rect.y + this.lineHeight(), rect.width, 'right');
        } else {
            this.changeTextColor(ColorManager.powerDownColor());
            this.drawText("- Empty -", rect.x, rect.y + this.lineHeight(), rect.width, 'right');
            this.resetTextColor();
        }
    };

    //=============================================================================
    // ** Monster Available Window
    //=============================================================================
    function Window_MonsterAvailable() { this.initialize(...arguments); }
    Window_MonsterAvailable.prototype = Object.create(Window_Selectable.prototype);
    Window_MonsterAvailable.prototype.constructor = Window_MonsterAvailable;
    
    Window_MonsterAvailable.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_MonsterAvailable.prototype.makeItemList = function() { 
        console.log("=== MAKING ITEM LIST ===");
        
        // Get all unlocked monsters and filter out invalid ones
        const unlockedIds = $gameSystem.unlockedMonsters();
        console.log("Raw unlocked IDs:", unlockedIds);
        
        this._data = [];
        
        for (const id of unlockedIds) {
            const enemy = $dataEnemies[id];
            console.log(`Processing enemy ${id}:`, enemy);
            
            if (enemy) {
                console.log(`  Name: ${enemy.name}`);
                console.log(`  Note:`, enemy.note);
                console.log(`  Meta:`, enemy.meta);
                
                const level = extractLevelFromNote(enemy);
                console.log(`  Extracted level:`, level);
                console.log(`  Has level:`, hasLevel(enemy));
                
                if (hasLevel(enemy)) {
                    this._data.push(enemy);
                    console.log(`  Added to list!`);
                } else {
                    console.log(`  Skipped - no level data`);
                }
            } else {
                console.log(`  Enemy ${id} is null/undefined`);
            }
        }
        
        console.log(`Final item list: ${this._data.length} monsters`);
        console.log("Monster names:", this._data.map(e => e.name));
        console.log("=== END MAKING ITEM LIST ===");
    };
    
    Window_MonsterAvailable.prototype.maxItems = function() { return this._data ? this._data.length : 0; };
    Window_MonsterAvailable.prototype.item = function() { return this._data[this.index()]; };
    
    Window_MonsterAvailable.prototype.drawItem = function(index) {
        const item = this._data[index];
        const rect = this.itemLineRect(index);
        const level = extractLevelFromNote(item) || 1;
        
        // Enemy ID 1 always costs 0, others cost level * 100 (reduced from 1000)
        const goldCost = item.id === 1 ? 0 : level * 100;
        const euroCost = (goldCost / 100).toFixed(2);
        const costText = `${euroCost}€`;
        const costWidth = this.textWidth(costText);
        const canAfford = $gameParty.gold() >= goldCost;
        
        this.changePaintOpacity(canAfford);
        this.drawText(item.name, rect.x + 4, rect.y, rect.width - costWidth - 8);
        this.drawText(costText, rect.x, rect.y, rect.width - 4, 'right');
        this.changePaintOpacity(true);
    };
    
    Window_MonsterAvailable.prototype.updateHelp = function() {
        if (!this.item()) { this._helpWindow.clear(); return; }
        const monster = this.item();
        const level = extractLevelFromNote(monster) || 'N/A';
        const costText = monster.id === 1 ? ' (FREE)' : '';
        this._helpWindow.setText(`${monster.name} - Level: ${level}${costText}`);
    };
    
    Window_MonsterAvailable.prototype.refresh = function() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    };

})();