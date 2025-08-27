/*:
 * @target MZ
 * @plugindesc Allows dynamic character class selection with detailed class information and popups for skills.
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 *
 * @command openClassSelection
 * @text Open Class Selection
 * @desc Opens the class selection menu
 *
 * @command characterCreation
 * @text Character Creation
 * @desc Starts the character creation sequence.
 * * @command repriseCreation
 * @text Reprise Creation
 * @desc Resumes the character creation process from the class selection step.
 * * @param availableClasses
 * @text Available Classes
 * @desc List of class IDs that can be selected (comma-separated)
 * @type string
 * @default 1,2,3,4
 *
 * @param classNameVariable
 * @text Class Name Variable
 * @desc Variable ID to store the selected class name
 * @type variable
 * @default 1
 *
 * @help
 * Plugin Commands:
 * - Open Class Selection: Opens the class selection menu
 * - Character Creation: Starts the character creation sequence.
 * * * Script Call:
 * $gameParty.setFirstMemberClass(classId)
 * * The plugin will store the selected class name in the variable
 * specified in the "Class Name Variable" parameter.
 *
 * ---
 * Class Notetags for Skill Categories:
 * To define skill categories for a class, use the following notetags in the class's note box:
 *
 * <Primary: SkillOne, SkillTwo, CamelCaseSkill>
 * <Secondary: AnotherSkill, AndAnother>
 *
 * Example:
 * <Primary: Firefighting, Leadership, LawEnforcement>
 * <Secondary: ChemicalArts, Hydromancy, Convokation> 
 *
 * The plugin will parse these and display them in the "Skill Categories" window.
 */

(() => {
    const pluginName = 'ClassSelector';

    // Parse available classes from plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const availableClassesParam = parameters['availableClasses'] || '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63';
    const availableClasses = availableClassesParam.split(',').map(id => Number(id.trim()));

    // Initialize class levels storage when the game is ready
    const _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.call(this, object);
        if (object === $dataSystem) {
            if (!$dataSystem.classLevels) {
                $dataSystem.classLevels = {};
            }
        }
    };

    // Weapon type icon mapping
    const weaponTypeIcons = {
        1: 1,   // Dagger
        2: 59,   // Sword
        3: 4,   // Flail
        4: 160,   // Axe
        5: 12,  // Whip
        6: 5,  // Staff
        7: 6,  // Bow
        8: 93,  // Crossbow
        9: 7,  // Gun
        10: 49, // Claw
        11: 8, // Glove
        12: 36  // Spear
    };

    // Magic icon (standard magic icon from RPG Maker iconset)
    const magicIcon = 63;

    // Class Selection Window
    class Window_ClassSelection extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = this.makeClassList();
            this.refresh();
            this.select(0);
            this.activate();
        }

        makeClassList() {
            return availableClasses.filter(classId => 
                classId > 0 && $dataClasses[classId]
            );
        }

        maxItems() {
            return this._data ? this._data.length : 1;
        }

        itemAt(index) {
            return this._data ? this._data[index] : null;
        }

        drawItem(index) {
            const classId = this.itemAt(index);
            if (classId) {
                const rect = this.itemLineRect(index);
                const className = $dataClasses[classId].name;
                const classLevel = this.getClassLevel(classId);
                const displayText = `${className} (Lv. ${classLevel})`;
                this.drawText(displayText, rect.x, rect.y, rect.width);
            }
        }

        getClassLevel(classId) {
            const actor = $gameParty.members()[0];
            if (!actor) return 1;
            
            if (actor._classId === classId) {
                return actor._level;
            }
            
            return actor._classLevels ? (actor._classLevels[classId] || 1) : 1;
        }

        processOk() {
            const classId = this.itemAt(this.index());
            if (classId) {
                this.playOkSound();
                this.callOkHandler();
            }
        }

        select(index) {
            super.select(index);
            this.callHandler('select');
        }

        onTouchSelect(trigger) {
            super.onTouchSelect(trigger);
            this.callHandler('select');
        }

        currentClass() {
            return $dataClasses[this.itemAt(this.index())];
        }

        currentClassId() {
            return this.itemAt(this.index());
        }
    }

    // Confirmation Dialog Window
    class Window_ClassConfirmation extends Window_Command {
        initialize(rect) {
            super.initialize(rect);
            this._message = "";
            this._classLevel = 1;
            this.openness = 0;
        }
        
        makeCommandList() {
            if(ConfigManager.language === 'it'){
                this.addCommand("Lista Abilità per Livello", 'levelUpList');
                this.addCommand("Categorie Abilità", 'skillCategories');
                if (this._classLevel > 30) {
                    this.addCommand("Prestigio", 'prestige', false);
                }
                this.addCommand("Conferma classe", 'yes');
                this.addCommand("Annulla", 'no');
            } else {
                this.addCommand("Level Up List", 'levelUpList');
                this.addCommand("Skill Categories", 'skillCategories');
                if (this._classLevel > 30) {
                    this.addCommand("Prestige", 'prestige', false);
                }
                this.addCommand("Confirm class", 'yes');
                this.addCommand("Cancel", 'no');
            }
        }

        setClassLevel(level) {
            if (this._classLevel !== level) {
                this._classLevel = level;
                this.refresh();
            }
        }
        
        setMessage(message) {
            this._message = ""; 
            this.refresh();
        }
    }
    
    // Window for displaying level-up skills
    class Window_ClassLevelUpSkills extends Window_Selectable {
        initialize(rect, classData) {
            super.initialize(rect);
            this._class = classData;
            this._data = this.makeSkillList();
            this.refresh();
            this.activate();
            this.select(0);
        }

        makeSkillList() {
            if (!this._class || !this._class.learnings) {
                return [];
            }
            return this._class.learnings
                .map(learning => ({...learning, skill: $dataSkills[learning.skillId]}))
                .sort((a, b) => {
                    if (a.level !== b.level) {
                        return a.level - b.level;
                    }
                    return a.skill.name.localeCompare(b.skill.name);
                });
        }

        maxItems() {
            return this._data.length > 0 ? this._data.length : 1;
        }

        itemAt(index) {
            return this._data ? this._data[index] : null;
        }

        drawItem(index) {
            const rect = this.itemLineRect(index);
            if (this._data.length > 0) {
                const learning = this.itemAt(index);
                if (learning && learning.skill) {
                    const levelText = `Lv ${learning.level}: `;
                    const levelWidth = this.textWidth(levelText);
                    this.drawText(levelText, rect.x, rect.y, levelWidth);
                    this.drawText(learning.skill.name, rect.x + levelWidth, rect.y, rect.width - levelWidth);
                }
            } else {
                this.drawText("No level-up skills for this class.", rect.x, rect.y, rect.width, 'center');
            }
        }
        
        isCurrentItemEnabled() {
            return this._data.length > 0;
        }

        processCancel() {
            super.processCancel();
            this.callHandler('cancel');
        }
    }

    // Window for displaying skill categories from notetags
    class Window_SkillCategories extends Window_Base {
        initialize(rect, classData) {
            super.initialize(rect);
            this._handlers = {}; 
            this._class = classData;
            this.refresh();
            this.activate();
        }

        setHandler(symbol, method) {
            this._handlers[symbol] = method;
        }

        isHandled(symbol) {
            return !!this._handlers[symbol];
        }

        callHandler(symbol) {
            if (this.isHandled(symbol)) {
                this._handlers[symbol]();
            }
        }
        
        close() {
            this.openness = 0;
        }

        _splitCamelCase(text) {
            return text.replace(/([A-Z])/g, ' $1').trim();
        }

        refresh() {
            this.contents.clear();
            if (!this._class || !this._class.note) {
                this.drawText("No skill categories defined.", 0, 0, this.contentsWidth(), 'center');
                return;
            }

            const note = this._class.note;
            let y = 0;

            const primaryMatch = note.match(/<Primary:\s*([^>]+)>/);
            const secondaryMatch = note.match(/<Secondary:\s*([^>]+)>/);

            if (!primaryMatch && !secondaryMatch) {
                this.drawText("No skill categories defined.", 0, 0, this.contentsWidth(), 'center');
                return;
            }

            if (primaryMatch) {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText("Primary:", 0, y, this.contentsWidth());
                y += this.lineHeight();
                this.resetTextColor();
                const skills = primaryMatch[1].split(',').map(s => this._splitCamelCase(s.trim()));
                this.drawTextEx(skills.join(', '), this.itemPadding(), y);
                y += this.lineHeight() * 2;
            }

            if (secondaryMatch) {
                this.changeTextColor(ColorManager.systemColor());
                this.drawText("Secondary:", 0, y, this.contentsWidth());
                y += this.lineHeight();
                this.resetTextColor();
                const skills = secondaryMatch[1].split(',').map(s => this._splitCamelCase(s.trim()));
                this.drawTextEx(skills.join(', '), this.itemPadding(), y);
            }
        }

        update() {
            super.update();
            if (this.active && (Input.isTriggered('cancel') || TouchInput.isCancelled())) {
                if (this.isHandled('cancel')) {
                    this.callHandler('cancel');
                }
            }
        }
    }

    // Class Details Window
    class Window_ClassDetails extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._class = null;
            this.refresh();
        }

        setClass(classData) {
            if (this._class !== classData) {
                this._class = classData;
                this.refresh();
            }
        }

        refresh() {
            this.contents.clear();
            if (this._class) {
                this.drawClassDetails();
            }
        }

        drawClassDetails() {
            const statsHeight = this.calcStatsHeight();
            const skillsHeight = this.calcSkillsHeight();
            this.drawClassNote();
            const bottomMargin = 10;
            const availableHeight = this.contents.height - bottomMargin;
            const statsStartY = availableHeight - statsHeight - skillsHeight;
            const skillsStartY = availableHeight - skillsHeight;
            this.drawParameters(statsStartY);
            this.drawLearnableSkills(skillsStartY);
        }

        calcStatsHeight() {
            return (Math.ceil(6 / 2) * (this.lineHeight() * 0.9)) + this.lineHeight();
        }
        
        calcSkillsHeight() {
            let skillCount = 0;
            if (this._class.learnings && this._class.learnings.length > 0) {
                skillCount = this._class.learnings.filter(learning => learning.level === 1).length;
            }
            return Math.max(1, skillCount) * (this.lineHeight() * 0.85) + this.lineHeight();
        }

        drawClassNote() {
            let note = this._class.note || "No description available.";
        
            if (ConfigManager.language === 'it') {
                const match = note.match(/<it:\s*([\s\S]*?)>/);
                if (match) {
                    note = match[1].trim();
                } else {
                    note = note.replace(/<[^>]+>/g, '').trim();
                }
            } else {
                note = note.replace(/<it:\s*[\s\S]*?>/g, '').trim();
            }
        
            this.changeTextColor(ColorManager.systemColor());
            this.resetTextColor();
            const maxLines = 3;
            const maxLength = this.contents.width * maxLines - 10; 
            const truncatedNote = note.length > maxLength
                ? note.substring(0, maxLength) + "..."
                : note;
        
            this.drawTextEx(truncatedNote, 0, 0, this.contents.width);
        }

        drawWeaponAndMagicIcons(y) {
            let iconX = 0;
            const iconWidth = ImageManager.iconWidth + 4;
            for (let weaponTypeId = 1; weaponTypeId <= 12; weaponTypeId++) {
                if (this.canUseWeaponType(weaponTypeId)) {
                    this.drawIcon(weaponTypeIcons[weaponTypeId], iconX, y);
                    iconX += iconWidth;
                }
            }
            if (this.canUseMagic()) {
                this.drawIcon(magicIcon, iconX, y);
            }
        }

        canUseWeaponType(weaponTypeId) {
            if (!this._class || !this._class.traits) return false;
            return this._class.traits.some(trait => 
                trait.code === 51 && trait.dataId === weaponTypeId && trait.value === 1
            );
        }

        canUseMagic() {
            if (!this._class || !this._class.traits) return false;
            return this._class.traits.some(trait => 
                trait.code === 52 && trait.value === 1
            );
        }

        drawParameters(y) {
            const paramNames = ["STR", "COS", "INT", "SAG", "DEX", "PSI"];
            const paramIds = [2, 3, 4, 5, 6, 7];
            this.changeTextColor(ColorManager.systemColor());
            this.resetTextColor();
            for (let i = 0; i < paramNames.length; i++) {
                const x = i % 2 * (this.contents.width / 2);
                const paramY = y + Math.floor(i / 2) * (this.lineHeight() * 0.9);
                const paramValue = this._class.params[paramIds[i]][1];
                this.drawText(paramNames[i] + ":", x, paramY, 80);
                this.resetTextColor();
                this.drawText(String(paramValue), x + 80, paramY, 60, 'right');
            }
        }

        drawLearnableSkills(y) {
            this.drawWeaponAndMagicIcons(y);
            let level1Skills = [];
            if (this._class.learnings && this._class.learnings.length > 0) {
                level1Skills = this._class.learnings
                    .filter(learning => learning.level === 1)
                    .map(learning => $dataSkills[learning.skillId].name);
            }
            
            if (level1Skills.length === 0) {
                this.drawText("No skills at level 1", 0, y + this.lineHeight(), this.contents.width);
                return;
            }
            let skillY = y + this.lineHeight() * 0.9;
            const skillLineHeight = this.lineHeight() * 0.85;
            for (const skillName of level1Skills) {
                this.drawText(skillName, 0, skillY, this.contents.width);
                skillY += skillLineHeight;
            }
        }
    }

    // Title Window
    class Window_ClassSelectionTitle extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            if(ConfigManager.language === 'it'){
                this.drawText("Seleziona la tua classe", 0, 0, this.contents.width, 'center');
            }else{
                this.drawText("Select your class", 0, 0, this.contents.width, 'center');
            }
        }
    }

    // Class Selection Scene
    class Scene_ClassSelection extends Scene_MenuBase {
        create() {
            super.create();
            this.createTitleWindow();
            this.createClassWindow();
            this.createDetailsWindow();
        }

        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_ClassSelectionTitle(rect);
            this.addWindow(this._titleWindow);
        }

        createClassWindow() {
            const rect = this.classWindowRect();
            this._classWindow = new Window_ClassSelection(rect);
            this._classWindow.setHandler('ok', this.onClassSelect.bind(this));
            this._classWindow.setHandler('cancel', this.popScene.bind(this));
            this._classWindow.setHandler('select', this.onClassSelectionChange.bind(this));
            this.addWindow(this._classWindow);
        }

        createDetailsWindow() {
            const rect = this.detailsWindowRect();
            this._detailsWindow = new Window_ClassDetails(rect);
            this.addWindow(this._detailsWindow);
            
            if (this._classWindow.currentClass()) {
                this._detailsWindow.setClass(this._classWindow.currentClass());
            }
        }

        titleWindowRect() {
            const padding = 24;
            const width = Graphics.boxWidth - padding * 2;
            const height = this.calcWindowHeight(1, false);
            return new Rectangle(padding, padding, width, height);
        }

        classWindowRect() {
            const titleHeight = this.titleWindowRect().height;
            const padding = 24;
            const width = Math.floor((Graphics.boxWidth - padding * 2) / 2);
            const top = padding + titleHeight + 8;
            const height = Graphics.boxHeight - top - padding;
            return new Rectangle(padding, top, width, height);
        }

        detailsWindowRect() {
            const titleHeight = this.titleWindowRect().height;
            const padding = 24;
            const classWidth = this.classWindowRect().width;
            const width = Math.floor((Graphics.boxWidth - padding * 2) / 2);
            const top = padding + titleHeight + 8;
            const height = Graphics.boxHeight - top - padding;
            const x = padding + classWidth + 8;
            return new Rectangle(x, top, width, height);
        }

        onClassSelectionChange() {
            if (this._classWindow.currentClass()) {
                this._detailsWindow.setClass(this._classWindow.currentClass());
            }
        }

        onClassSelect() {
            if (!this._confirmationWindow) {
                const rect = this.confirmationWindowRect();
                this._confirmationWindow = new Window_ClassConfirmation(rect);
                this._confirmationWindow.setHandler('yes', this.onConfirmationYes.bind(this));
                this._confirmationWindow.setHandler('no', this.onConfirmationNo.bind(this));
                this._confirmationWindow.setHandler('levelUpList', this.onLevelUpList.bind(this));
                this._confirmationWindow.setHandler('skillCategories', this.onSkillCategories.bind(this));
                this._confirmationWindow.setHandler('prestige', this.onPrestige.bind(this));
                this.addWindow(this._confirmationWindow);
            }
            
            const classId = this._classWindow.currentClassId();
            const classLevel = this._classWindow.getClassLevel(classId);
            this._confirmationWindow.setClassLevel(classLevel);
            
            this._confirmationWindow.setMessage('');
            this._confirmationWindow.open();
            this._confirmationWindow.activate();
            this._confirmationWindow.select(0);
            
            this._classWindow.deactivate();
        }
        
        onConfirmationYes() {
            const classId = this._classWindow.itemAt(this._classWindow.index());
            const className = $dataClasses[classId].name;
            
            $gameParty.setFirstMemberClassWithLevel(classId);
            
            const variableId = Number(parameters['classNameVariable'] || 0);
            if (variableId > 0) {
                $gameVariables.setValue(variableId, className);
            }
            this._confirmationWindow.close();
            this.popScene();
        }
        
        onConfirmationNo() {
            this._confirmationWindow.close();
            this._classWindow.activate();
        }

        onPrestige() {
        }
        
        confirmationWindowRect() {
            const width = 400;
            const classId = this._classWindow.currentClassId();
            const classLevel = this._classWindow.getClassLevel(classId);
            const commandCount = classLevel > 30 ? 5 : 4;
            const height = this.calcWindowHeight(commandCount, true);
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            return new Rectangle(x, y, width, height);
        }

        onLevelUpList() {
            this._confirmationWindow.deactivate();
            const rect = this.levelUpListWindowRect();
            this._levelUpListWindow = new Window_ClassLevelUpSkills(rect, this._classWindow.currentClass());
            this._levelUpListWindow.setHandler('cancel', this.onSubWindowCancel.bind(this));
            this.addWindow(this._levelUpListWindow);
        }

        onSkillCategories() {
            this._confirmationWindow.deactivate();
            const rect = this.skillCategoriesWindowRect();
            this._skillCategoriesWindow = new Window_SkillCategories(rect, this._classWindow.currentClass());
            this._skillCategoriesWindow.setHandler('cancel', this.onSubWindowCancel.bind(this));
            this.addWindow(this._skillCategoriesWindow);
        }
        
        onSubWindowCancel() {
            if (this._levelUpListWindow) {
                this._levelUpListWindow.close();
                this._levelUpListWindow = null;
            }
            if (this._skillCategoriesWindow) {
                this._skillCategoriesWindow.close();
                this._skillCategoriesWindow = null;
            }
            this._confirmationWindow.activate();
        }

        levelUpListWindowRect() {
            const width = 520;
            const height = Graphics.boxHeight * 0.75;
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            return new Rectangle(x, y, width, height);
        }

        skillCategoriesWindowRect() {
            const width = 600;
            const height = this.calcWindowHeight(6, false);
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            return new Rectangle(x, y, width, height);
        }
    }

    // Enhanced Game_Party method to handle class changing with level management
    Game_Party.prototype.setFirstMemberClassWithLevel = function(classId) {
        const actor = this.members()[0];
        if (!actor) return;
        
        if (!actor._classLevels) {
            actor._classLevels = {};
        }
        
        if (actor._classId !== classId) {
            actor._classLevels[actor._classId] = actor._level;
        }
        
        const targetLevel = actor._classLevels[classId] || 1;
        
        const currentSkills = [...actor._skills];
        
        actor.changeClass(classId, true); 
        actor._skills = [];
        
        actor._level = targetLevel;
        actor._exp[classId] = actor.expForLevel(targetLevel);
        
        if ($dataClasses[classId].learnings) {
            for (const learning of $dataClasses[classId].learnings) {
                if (learning.level <= actor._level) {
                    actor.learnSkill(learning.skillId);
                }
            }
        }
        
        actor.refresh();
    };

    const _Game_Actor_initialize = Game_Actor.prototype.initialize;
    Game_Actor.prototype.initialize = function(actorId) {
        _Game_Actor_initialize.call(this, actorId);
        if (!this._classLevels) {
            this._classLevels = {};
        }
    };

    const _Game_Actor_makeEmpty = Game_Actor.prototype.makeEmpty;
    Game_Actor.prototype.makeEmpty = function() {
        _Game_Actor_makeEmpty.call(this);
        this._classLevels = {};
    };

    Game_Party.prototype.setFirstMemberClass = function(classId) {
        this.setFirstMemberClassWithLevel(classId);
    };

    PluginManager.registerCommand(pluginName, 'openClassSelection', () => {
        SceneManager.push(Scene_ClassSelection);
    });

    window.Scene_ClassSelection = Scene_ClassSelection;

    // ===================================================================================
    // REWORKED: Character Creation Feature
    // ===================================================================================

    const CharacterCreationData = [
        { // 0: Difficulty
            title: "Select difficulty",
            choices: [
                { name: "Permadeath", symbol: 'permadeath', description: "In \\C[1]Permadeath mode\\C[0] if your character perish in battle you will have to create a new one. Loot the body of your past character to recover items and euros.", bgImage: "" },
                { name: "Roguelite", symbol: 'roguelite', description: "In \\C[1]Roguelite mode\\C[0] if your character get defeated during battle will rewake at the base floor of the dungeon. Your allies will still die if they are not resurrected by the end of the battle.", bgImage: "" }
            ],
            handler: function(symbol) {
                $gameScreen.startFadeOut(1); 
                $gameSwitches.setValue(9, symbol === 'permadeath');
                $gameSwitches.setValue(33, true);
                this.nextStep();
            }
        },
        { // 1: Combat System
            title: "Select your combat system",
            choices: [
                { name: "RPG", symbol: 'rpg', description: "Engage in classic turn-based RPG combat.", bgImage: "" },
                { name: "Cards", symbol: 'cards', description: "Engage in tactical battles using a deck of cards.", bgImage: "" }
            ],
            handler: function(symbol) {
                $gameSwitches.setValue(45, symbol === 'cards');
                this.nextStep();
            }
        },
        { // 2: Belief
            title: "What do you believe in?",
            choices: [
                { name: "Muscles", symbol: 'belief', value: 0 }, { name: "Science", symbol: 'belief', value: 1 },
                { name: "Magic", symbol: 'belief', value: 2 }, { name: "Religion", symbol: 'belief', value: 3 },
                { name: "Hypercapitalism", symbol: 'belief', value: 4 }, { name: "Nothing really", symbol: 'belief', value: 5 }
            ],
            handler: function(symbol, index) {
                const choice = this.currentStepData().choices[index];
                if (choice) $gameVariables.setValue(42, choice.value);
                this.nextStep();
            }
        },
        { // 3: Gender
            title: "Select your gender:",
            choices: [
                { name: "Male", symbol: 'gender', value: 0 }, { name: "Female", symbol: 'gender', value: 1 },
                { name: "Non binary", symbol: 'gender', value: 2 }, { name: "Cocoon", symbol: 'gender', value: 2 }
            ],
            handler: function(symbol, index) {
                const choice = this.currentStepData().choices[index];
                if (choice) $gameVariables.setValue(38, choice.value);
                this.nextStep();
            }
        },
        { // 4: Creation Method
            title: "Create a character:",
            choices: [
                { name: "New character", symbol: 'new_char', value: 97, description: "Create a new character from scratch." },
                { name: "Random character", symbol: 'random_char', value: 96, description: "Generate a character with random attributes." }
            ],
            handler: function(symbol, index) {
                const choice = this.currentStepData().choices[index];
                this.startWaitingForCommonEvent(choice.value);
            }
        },
        { // 5: Class
            title: "Choose your class",
            choices: [
                { name: "Select a class", symbol: 'select_class', description: "Choose your starting class from a list." },
                { name: "Random class", symbol: 'random_class', description: "Be assigned a random starting class." }
            ],
            handler: function(symbol) {
                if (symbol === 'select_class') {
                    SceneManager.goto(Scene_ClassSelection);
                } else {
                    const validClasses = $dataClasses.filter(c => c);
                    if (validClasses.length > 0) {
                        const randomClass = validClasses[Math.floor(Math.random() * validClasses.length)];
                        if ($gameActors.actor(1)) $gameActors.actor(1).changeClass(randomClass.id, true);
                    }
                    this.popScene();
                }
            }
        }
    ];
    

    // --- Scene_CharacterCreation ---
    class Scene_CharacterCreation extends Scene_MenuBase {
        static _startStep = 0;
    
        static prepare(startStep = 0) {
            this._startStep = startStep;
        }
        hideUI() {
            if (this._titleWindow) this._titleWindow.visible = false;
            if (this._gridWindow) {
              this._gridWindow.deactivate();
              this._gridWindow.visible = false;
            }
          }
          
          showUI() {
            if (this._titleWindow) this._titleWindow.visible = true;
            if (this._gridWindow) {
              this._gridWindow.visible = true;
              this._gridWindow.activate();
            }
          }
        initialize() {
            super.initialize();
            this._step = Scene_CharacterCreation._startStep;
            Scene_CharacterCreation._startStep = 0;
            this._waitingForCommonEvent = false;
            this._interpreter = null;            // <-- add this
        }
    
        create() {
            super.create();
            this.createTitleWindow();
            this.createGridWindow();
            this.setupStep();
        }
        
        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_CharacterCreationTitle(rect);
            this.addWindow(this._titleWindow);
        }
    
        createGridWindow() {
            const rect = this.gridWindowRect();
            this._gridWindow = new Window_CharacterCreationGrid(rect);
            this._gridWindow.setHandler("ok", this.onGridOk.bind(this));
            // MODIFIED: Call onCancel instead of popScene
            this._gridWindow.setHandler("cancel", this.onCancel.bind(this));
            this.addWindow(this._gridWindow);
        }
        
        titleWindowRect() {
            const width = Graphics.boxWidth;
            const height = this.calcWindowHeight(1, false);
            return new Rectangle(0, 0, width, height);
        }
    
        gridWindowRect() {
            const titleRect = this.titleWindowRect();
            const x = 0;
            const y = titleRect.y + titleRect.height;
            const width = Graphics.boxWidth;
            const height = Graphics.boxHeight - y;
            return new Rectangle(x, y, width, height);
        }
    
        setupStep() {
            if (this._step >= CharacterCreationData.length) {
                this.popScene();
                return;
            }
            const stepData = this.currentStepData();
            this._titleWindow.setTitle(stepData.title);
            this._gridWindow.setChoices(stepData.choices);
        }
        
        currentStepData() {
            return CharacterCreationData[this._step];
        }
    
        nextStep() {
            this._step++;
            this.setupStep();
        }
        
        // NEW: Handles going to the previous step.
        previousStep() {
            this._step--;
            this.setupStep();
        }
    
        onGridOk() {
            const stepData = this.currentStepData();
            const index = this._gridWindow.index();
            const choice = stepData.choices[index];
            if (stepData.handler) {
                stepData.handler.call(this, choice.symbol, index);
            }
        }
    
        // NEW: Handles the cancel button press.
        onCancel() {
            if (this._step > 0) {
                SoundManager.playCancel();
                this.previousStep();
            }
            // If step is 0, do nothing to prevent closing the window.
        }
        
        // MODIFIED: Destroys windows before running the common event.
        startWaitingForCommonEvent(commonEventId) {
            // Hide/close UI first to avoid overlap or input issues
            this.hideUI();
            if (this._titleWindow) { this._titleWindow.deactivate(); this._titleWindow.close(); }
            if (this._gridWindow)  { this._gridWindow.deactivate();  this._gridWindow.close();  }
          
            // Reserve CE for Scene_Map so event commands run safely on the map interpreter
            if ($dataCommonEvents[commonEventId]) {
              $gameTemp.reserveCommonEvent(commonEventId);
            }
          
            // Return to the map; the reserved CE will start as soon as the map interpreter is free
            SceneManager.pop();
          }
          
    
        // MODIFIED: Recreates windows after common event completion.
        update() {
            super.update();
          
            if (this._waitingForCommonEvent) {
              if (this._interpreter) this._interpreter.update();
          
              // When the CE completes, resume the flow
              if (!this._interpreter || !this._interpreter.isRunning()) {
                this._interpreter = null;
                this._waitingForCommonEvent = false;
          
                // Advance to the step after the CE (you were doing this already)
                this._step++;
                this.showUI();
                this.setupStep();
              }
            }
          }
    }

    // --- Window_CharacterCreationTitle ---
    class Window_CharacterCreationTitle extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._title = "";
        }
        setTitle(title) {
            if (this._title !== title) {
                this._title = title;
                this.refresh();
            }
        }
        refresh() {
            this.contents.clear();
            this.drawText(this._title, 0, 0, this.contents.width, 'center');
        }
    }

    // --- Window_CharacterCreationGrid (NEW) ---
// --- Window_CharacterCreationGrid (FIXED) ---
// Replace the existing Window_CharacterCreationGrid class with this updated version

class Window_CharacterCreationGrid extends Window_Selectable {
    initialize(rect) {
        super.initialize(rect);
        this._choices = [];
    }

    setChoices(choices) {
        this._choices = choices || [];
        this._choices.forEach(choice => {
            if (choice.bgImage) {
                const bitmap = ImageManager.loadPicture(choice.bgImage);
                bitmap.addLoadListener(() => this.refresh());
            }
        });
        this.refresh();
        this.select(0);
        this.activate();
    }

    maxItems() {
        return this._choices ? this._choices.length : 0;
    }

    maxCols() {
        const numItems = this.maxItems();
        if (numItems <= 1) return 1;
        if (numItems <= 4) return 2;
        if (numItems <= 9) return 3;
        return 4;
    }

    itemHeight() {
        const numRows = Math.ceil(this.maxItems() / this.maxCols());
        if (numRows === 0) {
            return this.innerHeight;
        }
        return Math.floor(this.innerHeight / numRows);
    }

    // NEW: Helper method to wrap text without breaking words
    wrapText(text, maxWidth) {
        if (!text) return [];
        
        // Handle color codes and other escape sequences
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            
            // Measure the text width (accounting for escape sequences)
            const testWidth = this.textSizeEx(testLine).width;
            
            if (testWidth <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Single word is too long, force it on its own line
                    lines.push(word);
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    // NEW: Calculate text size including escape sequences
    textSizeEx(text) {
        const tempTextState = this.createTextState(text, 0, 0, 0);
        tempTextState.drawing = false; // Don't actually draw
        this.processAllText(tempTextState);
        return { width: tempTextState.outputWidth, height: tempTextState.outputHeight };
    }

    // UPDATED: Improved drawItem method with proper word wrapping
    drawItem(index) {
        const choice = this._choices[index];
        if (!choice) return;
        
        const rect = this.itemRect(index);

        // Draw background image if available
        if (choice.bgImage) {
            const bitmap = ImageManager.loadPicture(choice.bgImage);
            if (bitmap.isReady()) {
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, rect.x, rect.y, rect.width, rect.height);
            }
        }
        
        // Draw semi-transparent background for text readability
        const textPadding = 8;
        this.contents.fillRect(rect.x + 4, rect.y + 4, rect.width - 8, rect.height - 8, "rgba(0, 0, 0, 0.6)");
        
        // Draw choice name (title)
        this.resetFontSettings();
        this.changeTextColor(ColorManager.systemColor());
        this.contents.fontSize += 4;
        this.drawText(choice.name, rect.x, rect.y + textPadding, rect.width, 'center');
        
        // Draw description with word wrapping
        this.resetFontSettings();
        if (choice.description) {
            const descY = rect.y + textPadding + this.lineHeight() + 4; // Add small gap
            const availableWidth = rect.width - (textPadding * 2);
            const availableHeight = rect.height - (descY - rect.y) - textPadding;
            
            this.drawWrappedDescription(choice.description, rect.x + textPadding, descY, availableWidth, availableHeight);
        }
    }

    // NEW: Method to draw wrapped description text
    drawWrappedDescription(description, x, y, maxWidth, maxHeight) {
        const wrappedLines = this.wrapText(description, maxWidth);
        const lineHeight = this.lineHeight();
        const maxLines = Math.floor(maxHeight / lineHeight);
        
        // Limit the number of lines to fit in the available space
        const linesToDraw = Math.min(wrappedLines.length, maxLines);
        
        for (let i = 0; i < linesToDraw; i++) {
            const lineY = y + (i * lineHeight);
            let lineText = wrappedLines[i];
            
            // If this is the last line we can draw and there are more lines, add ellipsis
            if (i === linesToDraw - 1 && wrappedLines.length > maxLines) {
                // Check if we need to truncate to fit ellipsis
                const ellipsis = '...';
                const ellipsisWidth = this.textWidth(ellipsis);
                
                while (this.textSizeEx(lineText + ellipsis).width > maxWidth && lineText.length > 0) {
                    lineText = lineText.slice(0, -1);
                }
                lineText += ellipsis;
            }
            
            // Draw the line using drawTextEx to handle color codes
            this.drawTextEx(lineText, x, lineY, maxWidth);
        }
    }
}
PluginManager.registerCommand(pluginName, 'characterCreation', () => {
    Scene_CharacterCreation.prepare(0);
    SceneManager.push(Scene_CharacterCreation);
});

PluginManager.registerCommand(pluginName, 'repriseCreation', () => {
    Scene_CharacterCreation.prepare(5); // Start at step 5 (index 5)
    SceneManager.push(Scene_CharacterCreation);
});

})();