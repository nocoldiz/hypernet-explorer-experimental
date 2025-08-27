/*:
 * @target MZ
 * @plugindesc v1.1.0 Complete skill management system with encyclopedia, skill progression, and fusion. Includes actor-specific bonuses.
 * @author Claude
 *
 * @param Variable ID
 * @desc ID of the variable to store the selected skill ID
 * @type variable
 * @default 1
 *
 * @param Encyclopedia Command
 * @desc Command name for the skill system in the menu
 * @type string
 * @default Skill Master
 *
 * @param Add to Menu
 * @desc Add the skill system to the main menu?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param Category Window Width
 * @desc Width of the category window
 * @type number
 * @min 1
 * @default 300
 * * @param Skill List Width
 * @desc Width of the skill list window
 * @type number
 * @min 1
 * @default 300
 *
 * @param Confirmation Message
 * @desc Message shown when confirming a fusion.
 * @type text
 * @default Do you want to fuse these skills?
 *
 * @param Success Message
 * @desc Message shown after a successful fusion.
 * @type text
 * @default Fusion successful! You learned a new skill!
 *
 * @param Battle Progress Points
 * @desc Points gained after winning a battle with the skill selected
 * @type number
 * @min 1
 * @default 3
 *
 * @command openSkillSystem
 * @desc Opens the main skill system menu.
 *
 * @command openEncyclopedia
 * @text Open Encyclopedia
 * @desc Opens the skill encyclopedia
 *
 * @command openEncyclopediaWithSkill
 * @text Open With Skill
 * @desc Opens the encyclopedia and highlights a specific skill
 * @arg skillId
 * @type skill
 * @text Skill
 * @desc The skill to highlight in the encyclopedia
 * * @command showFusionMenu
 * @desc Shows the skill fusion menu.
 *
 * @command openSkillProgress
 * @desc Shows the skill progress window for the currently selected skill.
 *
 * @command increaseSkillProgress
 * @desc Manually increases the progress of the currently selected skill.
 * @arg amount
 * @type number
 * @text Amount
 * @desc The amount of progress to add
 * @default 1
 * @min 1
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin combines a skill encyclopedia, skill progression system, and
 * skill fusion functionality into one comprehensive skill management system.
 *
 * Features:
 * - Skill Encyclopedia: Browse and learn about skills organized by categories
 * - Skill Progression: Track and increase mastery of selected skills
 * - Skill Fusion: Combine two skills to create powerful new ones
 * - Actor Bonuses (v1.1.0): Actor 1 can have primary/secondary categories.
 *
 * ============================================================================
 * Actor Bonuses (v1.1.0)
 * ============================================================================
 *
 * For Actor 1 only, you can define Primary and Secondary skill categories in
 * their notebox. Skills from these categories will gain progression points
 * at an accelerated rate.
 *
 * Add these tags to Actor 1's note field:
 * <Primary: CategoryName1, CategoryName2>
 * <Secondary: CategoryName3, CategoryName4>
 *
 * - Primary categories get a 3x multiplier on progression points.
 * - Secondary categories get a 1.5x multiplier on progression points.
 *
 * The category list in the encyclopedia will show "(3x)" or "(1.5x)" next
 * to these categories as a visual indicator.
 *
 * ============================================================================
 * Skill Encyclopedia
 * ============================================================================
 *
 * To categorize skills in the encyclopedia, add a category tag to skill notes:
 * <category:EnhancementMagic>
 *
 * The encyclopedia interface shows:
 * - First: A list of all skill categories
 * - After selecting a category: skill list on left, details on right
 * - Press cancel to return to categories
 *
 * You can select a skill for progression by pressing OK when viewing it.
 * Only one skill can be selected for progression at a time.
 *
 * ============================================================================
 * Skill Progression
 * ============================================================================
 *
 * Select a skill in the encyclopedia to track its progression.
 * Progress is gained by:
 * 1. Winning battles with the skill selected (3 points per battle)
 * 2. Using the increaseSkillProgress plugin command
 *
 * The maximum progress is determined by the skill's MP or TP cost.
 * Progress is reset when you select a different skill.
 *
 * ============================================================================
 * Skill Fusion
 * ============================================================================
 *
 * This plugin allows you to create skill fusions by combining two skills to
 * get a new one. Skill fusions are hardcoded in the plugin file.
 *
 * The format for each fusion is: SkillA ID, SkillB ID, Result Skill ID
 * * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * openSkillSystem
 * - Opens the main skill system menu with all options
 *
 * openEncyclopedia
 * - Opens just the skill encyclopedia
 *
 * openEncyclopediaWithSkill
 * - Opens the encyclopedia and highlights a specific skill
 *
 * showFusionMenu
 * - Shows the skill fusion menu with all available fusions
 *
 * openSkillProgress
 * - Shows the skill progress window for the currently selected skill
 * * increaseSkillProgress
 * - Manually increases the progress of the currently selected skill
 *
 * ============================================================================
*/

(() => {
    'use strict';
    
    const pluginName = "SkillMaster";
    
    // Plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const variableId = Number(parameters['Variable ID'] || 1);
    const encyclopediaCommand = String(parameters['Encyclopedia Command'] || 'Training');
    const addToMenu = parameters['Add to Menu'] !== 'false'; // Fix the parsing of boolean parameter
    const categoryWindowWidth = Number(parameters['Category Window Width'] || 500);
    const skillListWidth = Number(parameters['Skill List Width'] || 300);
    const confirmMessage = String(parameters['Confirmation Message'] || 'Do you want to fuse these skills?');
    const successMessage = String(parameters['Success Message'] || 'Fusion successful!');
    const battleProgressPoints = Number(parameters['Battle Progress Points'] || 6);
    const tr = (en, it) => ConfigManager.language === "it" ? it : en;

    function getSkillCategory(skillId) {
        if (!skillId) return null;
        const skill = $dataSkills[skillId];
        if (!skill) return null;
        const match = skill.note.match(/<category:\s*(.+?)\s*>/i);
        return match ? match[1].trim() : null;
    }

    const actorCategoryManager = {
        _primary: [],
        _secondary: [],
        _initialized: false,

        initialize: function() {
            // Ensure the necessary data is loaded before proceeding
            if (this._initialized || typeof $dataActors === 'undefined' || !$dataActors || typeof $dataClasses === 'undefined' || !$dataClasses) return;
            
            const actor1 = $dataActors[1];
            if (!actor1) return;
        
            const actorClass = $dataClasses[actor1.classId];
            if (!actorClass) return;
        
            // Correctly get the note from the actor's class
            const note = actorClass.note;
            
            const primaryMatch = note.match(/<Primary:\s*(.+?)>/i);
            const secondaryMatch = note.match(/<Secondary:\s*(.+?)>/i);
        
            if (primaryMatch) {
                this._primary = primaryMatch[1].split(',').map(cat => cat.trim());
            }
            if (secondaryMatch) {
                this._secondary = secondaryMatch[1].split(',').map(cat => cat.trim());
            }
            this._initialized = true;
        },

        isPrimary: function(category) {
            if (!this._initialized) this.initialize();
            return this._primary.includes(category);
        },

        isSecondary: function(category) {
            if (!this._initialized) this.initialize();
            return this._secondary.includes(category);
        },

        getMultiplier: function(skillId) {
            if (!this._initialized) this.initialize();

            const category = getSkillCategory(skillId);
            if (!category) return 1;

            if (this.isPrimary(category)) {
                return 3;
            }
            if (this.isSecondary(category)) {
                return 1.5;
            }
            return 1;
        }
    };
    
    // Hardcoded fusion recipes list - copied from the original SkillFusion.js
    const fusionRecipes = [
        { skillA: 4, skillB: 6, result: 52 }, { skillA: 7, skillB: 113, result: 310 }, { skillA: 46, skillB: 50, result: 218 }, 
        { skillA: 48, skillB: 78, result: 359 }, { skillA: 44, skillB: 63, result: 68 }, { skillA: 56, skillB: 129, result: 192 }, 
        { skillA: 53, skillB: 47, result: 60 }, { skillA: 61, skillB: 181, result: 219 }, { skillA: 4, skillB: 6, result: 52 }, 
        { skillA: 7, skillB: 113, result: 310 }, { skillA: 12, skillB: 13, result: 64 }, { skillA: 13, skillB: 14, result: 46 }, 
        { skillA: 17, skillB: 18, result: 78 }, { skillA: 19, skillB: 20, result: 44 }, { skillA: 21, skillB: 25, result: 56 }, 
        { skillA: 27, skillB: 30, result: 97 }, { skillA: 32, skillB: 34, result: 432 }, { skillA: 37, skillB: 38, result: 553 }, 
        { skillA: 42, skillB: 43, result: 49 }, { skillA: 46, skillB: 50, result: 218 }, { skillA: 48, skillB: 78, result: 359 }, 
        { skillA: 44, skillB: 63, result: 68 }, { skillA: 56, skillB: 129, result: 192 }, { skillA: 53, skillB: 47, result: 60 }, 
        { skillA: 61, skillB: 181, result: 219 }, { skillA: 54, skillB: 179, result: 291 }, { skillA: 58, skillB: 74, result: 297 }, 
        { skillA: 79, skillB: 180, result: 345 }, { skillA: 181, skillB: 182, result: 183 }, { skillA: 183, skillB: 184, result: 64 }, 
        { skillA: 216, skillB: 217, result: 218 }, { skillA: 42, skillB: 181, result: 182 }, { skillA: 44, skillB: 63, result: 68 }, 
        { skillA: 101, skillB: 103, result: 186 }, { skillA: 107, skillB: 109, result: 188 }, { skillA: 113, skillB: 114, result: 117 }, 
        { skillA: 113, skillB: 117, result: 119 }, { skillA: 114, skillB: 115, result: 118 }, { skillA: 121, skillB: 122, result: 125 }, 
        { skillA: 122, skillB: 123, result: 126 }, { skillA: 129, skillB: 130, result: 133 }, { skillA: 130, skillB: 131, result: 134 }, 
        { skillA: 137, skillB: 138, result: 140 }, { skillA: 143, skillB: 144, result: 146 }, { skillA: 149, skillB: 150, result: 152 }, 
        { skillA: 155, skillB: 156, result: 158 }, { skillA: 161, skillB: 162, result: 164 }, { skillA: 167, skillB: 168, result: 170 }, 
        { skillA: 86, skillB: 87, result: 88 }, { skillA: 88, skillB: 89, result: 330 }, { skillA: 90, skillB: 91, result: 92 }, 
        { skillA: 92, skillB: 93, result: 94 }, { skillA: 101, skillB: 105, result: 186 }, { skillA: 101, skillB: 186, result: 366 }, 
        { skillA: 102, skillB: 104, result: 367 }, { skillA: 167, skillB: 168, result: 170 }, { skillA: 169, skillB: 170, result: 171 }, 
        { skillA: 12, skillB: 20, result: 291 }, { skillA: 13, skillB: 19, result: 44 }, { skillA: 14, skillB: 21, result: 56 }, 
        { skillA: 16, skillB: 24, result: 47 }, { skillA: 19, skillB: 26, result: 443 }, { skillA: 20, skillB: 43, result: 73 }, 
        { skillA: 22, skillB: 23, result: 95 }, { skillA: 24, skillB: 54, result: 79 }, { skillA: 25, skillB: 112, result: 483 }, 
        { skillA: 28, skillB: 30, result: 99 }, { skillA: 31, skillB: 34, result: 432 }, { skillA: 32, skillB: 33, result: 587 }, 
        { skillA: 35, skillB: 39, result: 146 }, { skillA: 36, skillB: 40, result: 147 }, { skillA: 41, skillB: 42, result: 64 }, 
        { skillA: 43, skillB: 45, result: 49 }, { skillA: 44, skillB: 49, result: 68 }, { skillA: 47, skillB: 48, result: 60 }, 
        { skillA: 52, skillB: 53, result: 61 }, { skillA: 54, skillB: 55, result: 69 }, { skillA: 56, skillB: 57, result: 58 }, 
        { skillA: 59, skillB: 69, result: 74 }, { skillA: 61, skillB: 62, result: 76 }, { skillA: 63, skillB: 67, result: 80 }, 
        { skillA: 65, skillB: 66, result: 77 }, { skillA: 68, skillB: 70, result: 71 }, { skillA: 72, skillB: 78, result: 316 }, 
        { skillA: 84, skillB: 85, result: 86 }, { skillA: 87, skillB: 88, result: 89 }, { skillA: 93, skillB: 94, result: 364 }, 
        { skillA: 95, skillB: 96, result: 97 }, { skillA: 98, skillB: 99, result: 100 }, { skillA: 105, skillB: 107, result: 188 }, 
        { skillA: 106, skillB: 108, result: 644 }, { skillA: 109, skillB: 110, result: 647 }, { skillA: 111, skillB: 112, result: 315 }, 
        { skillA: 115, skillB: 117, result: 119 }, { skillA: 123, skillB: 125, result: 127 }, { skillA: 131, skillB: 133, result: 135 }, 
        { skillA: 140, skillB: 140, result: 141 }, { skillA: 146, skillB: 146, result: 147 }, { skillA: 152, skillB: 152, result: 153 }, 
        { skillA: 158, skillB: 158, result: 159 }, { skillA: 164, skillB: 164, result: 165 }, { skillA: 170, skillB: 170, result: 171 }, 
        { skillA: 7, skillB: 113, result: 310 }, { skillA: 12, skillB: 113, result: 115 }, { skillA: 15, skillB: 211, result: 396 }, 
        { skillA: 17, skillB: 111, result: 314 }, { skillA: 18, skillB: 722, result: 725 }, { skillA: 19, skillB: 625, result: 626 }
    ];
    
    //=============================================================================
    // Game_System - Skill Progress Storage
    //=============================================================================
    
    // Initialize skill progress data
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._skillProgress = {};  // { skillId: progress }
        this._selectedSkillId = 0;
    };
    
    // Get/Set Selected Skill ID
    Game_System.prototype.getSelectedSkillId = function() {
        return this._selectedSkillId || 0;
    };
    
    Game_System.prototype.setSelectedSkillId = function(skillId) {
        // If changing the selected skill, reset progress
        if (this._selectedSkillId !== skillId && this._selectedSkillId > 0) {
            this.setSkillProgress(this._selectedSkillId, 0);
        }
        
        this._selectedSkillId = skillId;
        
        // Sync with the variable
        $gameVariables.setValue(variableId, skillId);
    };
    
    // Get/Set Skill Progress
    Game_System.prototype.getSkillProgress = function(skillId) {
        return this._skillProgress[skillId] || 0;
    };
    
    Game_System.prototype.setSkillProgress = function(skillId, value) {
        this._skillProgress[skillId] = Math.max(0, value);
    };
    
    // Get Max Progress for a skill (based on MP or TP cost)
    Game_System.prototype.getSkillMaxProgress = function(skillId) {
        const skill = $dataSkills[skillId];
        if (!skill) return 100;
        
        // Use MP cost or TP cost, whichever is higher, with minimum of 100
        return Math.max(100, skill.mpCost * 10, skill.tpCost * 10);
    };
    
    // Add progress from battle victory
    Game_System.prototype.addBattleProgress = function() {
        const skillId = this.getSelectedSkillId();
        if (skillId > 0) {
            const progress = this.getSkillProgress(skillId);
            const maxProgress = this.getSkillMaxProgress(skillId);
            
            const multiplier = actorCategoryManager.getMultiplier(skillId);
            const pointsToAdd = Math.floor(battleProgressPoints * multiplier);

            const newProgress = Math.min(progress + pointsToAdd, maxProgress);
            this.setSkillProgress(skillId, newProgress);
        }
    };
    
    //=============================================================================
    // Battle Victory Hook
    //=============================================================================
    
    const _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        // Add progress for the selected skill when winning a battle
        $gameSystem.addBattleProgress();
        
        // Call original method
        _BattleManager_processVictory.call(this);
    };
    
    //=============================================================================
    // Utility Functions
    //=============================================================================
    
    function getAllSkillCategories() {
        const categories = new Set();
        
        // Add "All" category
        categories.add("All");
        
        // Loop through all skills and collect categories
        for (const skill of $dataSkills) {
            if (!skill) continue;
            
            const categoryMatch = skill.note.match(/<category:(.+?)>/i);
            if (categoryMatch) {
                categories.add(categoryMatch[1]);
            }
        }
        
        return Array.from(categories);
    }
    
    function getSkillsByCategory(category) {
        const skills = [];
        
        for (const skill of $dataSkills) {
            if (!skill) continue;
            
            // Skip skills with no name (usually null entries)
            if (!skill.name) continue;
            
            // If "All" category or the skill matches the category
            if (category === "All" || skill.note.match(new RegExp(`<category:${category}>`, 'i'))) {
                skills.push(skill);
            }
        }
        
        return skills;
    }
    
    //=============================================================================
    // Window_SkillMasterCommand
    //=============================================================================
    
    function Window_SkillMasterCommand() {
        this.initialize(...arguments);
    }
    
    Window_SkillMasterCommand.prototype = Object.create(Window_Command.prototype);
    Window_SkillMasterCommand.prototype.constructor = Window_SkillMasterCommand;
    
    Window_SkillMasterCommand.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.refresh();
    };
    
    Window_SkillMasterCommand.prototype.makeCommandList = function() {
        const skillId = $gameSystem.getSelectedSkillId();
        const skillName = skillId > 0 ? $dataSkills[skillId].name : "None";
        
        this.addCommand(tr ?`(In allenamento: ${skillName})`:`(Training: ${skillName})`, "progress");
        this.addCommand(tr ?"Consulta Skillopedia":"Consult Encyclopedia", "encyclopedia");
        this.addCommand(tr?"Fondi skills":"Fuse Skills", "fusion");
        this.addCommand(tr?"Annulla":"Cancel", "cancel");
    };
    
    //=============================================================================
    // Window_SkillProgress
    //=============================================================================
    
    function Window_SkillProgress() {
        this.initialize(...arguments);
    }
    
    Window_SkillProgress.prototype = Object.create(Window_Selectable.prototype);
    Window_SkillProgress.prototype.constructor = Window_SkillProgress;
    
    Window_SkillProgress.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.activate();
        this.refresh();
    };
    
    Window_SkillProgress.prototype.maxItems = function() {
        return 1;
    };
    
    Window_SkillProgress.prototype.refresh = function() {
        this.contents.clear();
        
        const skillId = $gameSystem.getSelectedSkillId();
        if (skillId <= 0) {
            this.drawText(tr ?"Nessuna abilità in allenamento":"No skill selected for training.", 0, 0, this.contentsWidth(), "center");
            return;
        }
        
        const skill = $dataSkills[skillId];
        if (!skill) {
            this.drawText(tr ?"Abilità non valida selezionata":"Invalid skill selected.", 0, 0, this.contentsWidth(), "center");
            return;
        }
        
        const progress = $gameSystem.getSkillProgress(skillId);
        const maxProgress = $gameSystem.getSkillMaxProgress(skillId);
        
        // Draw skill name and icon
        const padding = 20;
        let y = padding;
        
        this.drawIcon(skill.iconIndex, padding, y);
        this.drawText(skill.name, padding + 40, y, this.contentsWidth() - padding * 2 - 40, "left");
        
        y += this.lineHeight() + 10;
        
        // Draw horizontal line
        this.drawHorzLine(y);
        y += 10;
        
        // Draw skill description
        if (skill.description) {
            skill.description = window.translateText(skill.description)
            this.drawTextEx(skill.description, padding, y, this.contentsWidth() - padding * 2);
            y += this.textSizeEx(skill.description).height + 20;
        } else {
            this.drawText(tr ?"Nessuna descrizione disponibile":"No description available.", padding, y, this.contentsWidth() - padding * 2);
            y += this.lineHeight() + 10;
        }
        
        // Draw horizontal line
        this.drawHorzLine(y);
        y += 10;
        
        // Draw progress bar
        this.drawText(tr ?`Progresso: ${progress}/${maxProgress}`:`Progress: ${progress}/${maxProgress}`, padding, y, this.contentsWidth() - padding * 2);
        y += this.lineHeight() + 5;
        
        const progressBarWidth = this.contentsWidth() - padding * 2;
        const progressBarHeight = 24;
        
        // Draw background bar
        this.contents.fillRect(
            padding, 
            y, 
            progressBarWidth, 
            progressBarHeight, 
            ColorManager.gaugeBackColor()
        );
        
        // Draw progress bar
        const fillWidth = Math.floor((progress / maxProgress) * progressBarWidth);
        this.contents.gradientFillRect(
            padding, 
            y, 
            fillWidth, 
            progressBarHeight, 
            ColorManager.textColor(3),  // Light blue
            ColorManager.textColor(1)   // Blue
        );
        
        y += progressBarHeight + 20;
        
        
        this.drawTextEx(tr ?`\\c[6]* Ogni vittoria aggiunge ${battleProgressPoints} punti progresso.\\c[0]`:
            `\\c[6]* Each battle victory adds ${battleProgressPoints} progress points.\\c[0]`, 
            padding, 
            y, 
            this.contentsWidth() - padding * 2
        );
        y += this.lineHeight();
        
        this.drawTextEx(tr ?            "\\c[6]* Il progresso si resetta quando selezioni una skill differente.\\c[0]":
            "\\c[6]* Progress resets when you select a different skill.\\c[0]", 
            padding, 
            y, 
            this.contentsWidth() - padding * 2
        );
    };
    
    Window_SkillProgress.prototype.drawHorzLine = function(y) {
        const lineWidth = this.contentsWidth() - 48;
        const lineY = y + 1;
        this.contents.paintOpacity = 128;
        this.contents.fillRect(24, lineY, lineWidth, 2, ColorManager.normalColor());
        this.contents.paintOpacity = 255;
    };
    
    //=============================================================================
    // Window_SkillCategory
    //=============================================================================
    
    function Window_SkillCategory() {
        this.initialize(...arguments);
    }
    
    Window_SkillCategory.prototype = Object.create(Window_Command.prototype);
    Window_SkillCategory.prototype.constructor = Window_SkillCategory;
    
    Window_SkillCategory.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
    };
    
    Window_SkillCategory.prototype.makeCommandList = function() {
        actorCategoryManager.initialize();
        const categories = getAllSkillCategories();
        for (const category of categories) {
            let commandName = category;
            if (category !== "All") {
                if (actorCategoryManager.isPrimary(category)) {
                    commandName += " (3x)";
                } else if (actorCategoryManager.isSecondary(category)) {
                    commandName += " (1.5x)";
                }
            }
            this.addCommand(commandName, 'category', true, category);
        }
    };
    
    Window_SkillCategory.prototype.currentCategory = function() {
        return this.currentExt() || (this.currentData() ? this.currentData().name : "All");
    };
    
    //=============================================================================
    // Window_SkillGrid
    //=============================================================================
    
    function Window_SkillGrid() {
        this.initialize(...arguments);
    }
    
    Window_SkillGrid.prototype = Object.create(Window_Selectable.prototype);
    Window_SkillGrid.prototype.constructor = Window_SkillGrid;
    
    Window_SkillGrid.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._category = "All";
        this._data = [];
        this.refresh();
    };
    
    Window_SkillGrid.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };
    
    Window_SkillGrid.prototype.setCategory = function(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
            this.select(0);
            if (this._detailWindow) {
                this._detailWindow.setSkill(this.currentSkill());
            }
        }
    };
    
    Window_SkillGrid.prototype.setDetailWindow = function(detailWindow) {
        this._detailWindow = detailWindow;
    };
    
    Window_SkillGrid.prototype.currentSkill = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()] : null;
    };
    
    Window_SkillGrid.prototype.currentSkillId = function() {
        const skill = this.currentSkill();
        return skill ? skill.id : 0;
    };
    
    Window_SkillGrid.prototype.selectSkillById = function(skillId) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i] && this._data[i].id === skillId) {
                this.select(i);
                this.scrollTo(0, Math.max(0, (i - 4) * this.itemHeight()));
                return true;
            }
        }
        return false;
    };
    
    Window_SkillGrid.prototype.refresh = function() {
        this._data = getSkillsByCategory(this._category);
        this.createContents();
        this.drawAllItems();
    };
    
    Window_SkillGrid.prototype.drawItem = function(index) {
        const skill = this._data[index];
        if (skill) {
            const rect = this.itemLineRect(index);
            
            // Check if this is the selected skill for progression
            const isSelected = $gameSystem.getSelectedSkillId() === skill.id;
            
            // Change color if this is the selected skill
            if (isSelected) {
                this.changeTextColor(ColorManager.textColor(17)); // Green
            } else {
                this.resetTextColor();
            }
            
            this.drawItemName(skill, rect.x, rect.y, rect.width);
            
            // Reset color
            this.resetTextColor();
        }
    };
    
    Window_SkillGrid.prototype.drawItemName = function(skill, x, y, width) {
        if (skill) {
            const iconBoxWidth = ImageManager.iconWidth + 4;
            this.drawIcon(skill.iconIndex, x, y + 2);
            this.drawText(skill.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    };
    
    Window_SkillGrid.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        if (this._detailWindow && this.active && this.currentSkill()) {
            this._detailWindow.setSkill(this.currentSkill());
        }
    };
    
    //=============================================================================
    // Window_SkillDetail
    //=============================================================================
    
    function Window_SkillDetail() {
        this.initialize(...arguments);
    }
    
    Window_SkillDetail.prototype = Object.create(Window_Base.prototype);
    Window_SkillDetail.prototype.constructor = Window_SkillDetail;
    
    Window_SkillDetail.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._skill = null;
        this._showSelectionInfo = false;
        this._selectionTimer = 0;
        this.refresh();
    };
    
    Window_SkillDetail.prototype.setSkill = function(skill) {
        if (this._skill !== skill) {
            this._skill = skill;
            this._showSelectionInfo = false;
            this._selectionTimer = 0;
            this.refresh();
        }
    };
    
    Window_SkillDetail.prototype.showSelectionInfo = function(show) {
        this._showSelectionInfo = show;
        this._selectionTimer = 180; // Show for 3 seconds (60 frames per second)
        this.refresh();
    };
    
    Window_SkillDetail.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        // Handle selection info timer
        if (this._showSelectionInfo && this._selectionTimer > 0) {
            this._selectionTimer--;
            if (this._selectionTimer === 0) {
                this._showSelectionInfo = false;
                this.refresh();
            }
        }
    };
    
    Window_SkillDetail.prototype.refresh = function() {
        this.contents.clear();
        if (!this._skill) return;
        
        const padding = 10;
        let y = padding;
        
        // Draw skill name and icon
        this.drawIcon(this._skill.iconIndex || 0, padding, y);
        
        // Using original font size for name
        this.drawText(this._skill.name || "Unknown Skill", padding + ImageManager.iconWidth + 4, y, this.contentsWidth() - padding * 2 - ImageManager.iconWidth - 4, "left");
        
        // Draw selection status
        const isSelected = $gameSystem.getSelectedSkillId() === this._skill.id;

        
        // Show selection confirmation message
        if (this._showSelectionInfo) {
            this.changeTextColor(ColorManager.textColor(14)); // Yellow
            this.drawText("Skill selected for progression!", padding, y + this.lineHeight(), this.contentsWidth() - padding * 2);
            this.resetTextColor();
            y += this.lineHeight();
        }
        
        // Draw horizontal line
        y += this.lineHeight();
        this.drawHorzLine(y);
        y += 8;
        
        // Reduce font size for all details
        const originalFontSize = this.contents.fontSize;
        this.contents.fontSize = Math.floor(originalFontSize * 0.8); // 80% of original size
        
        // Draw MP/TP cost
        if (this._skill.mpCost > 0) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("MP Cost:", padding, y, 120);
            this.resetTextColor();
            this.drawText(this._skill.mpCost, 120 + padding, y, 120, "right");
            y += this.lineHeight();
        }
        
        if (this._skill.tpCost > 0) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText("AP Cost:", padding, y, 120);
            this.resetTextColor();
            this.drawText(this._skill.tpCost, 120 + padding, y, 120, "right");
            y += this.lineHeight();
        }
        
        // Draw horizontal line
        this.drawHorzLine(y);
        y += 8;
        
        // Draw description
        var description = this._skill.description || "";
        if (description) {
            description = window.translateText(description)

            // Using smaller font size for description
            this.drawTextEx("\\c[0]" + description, padding, y, this.contentsWidth() - padding * 2);
            
            // Calculate height with current font size
            const textHeight = this.textSizeEx(description).height;
            y += textHeight + 4;
        } else {
            this.drawText(tr ?"Nessuna descrizione disponibile":"No description available", padding, y, this.contentsWidth() - padding * 2);
            y += this.lineHeight();
        }
        
        // Draw horizontal line
        this.drawHorzLine(y);
        y += 8;
        
        // Draw progress info if this is the selected skill
        if (isSelected) {
            const progress = $gameSystem.getSkillProgress(this._skill.id);
            const maxProgress = $gameSystem.getSkillMaxProgress(this._skill.id);
            
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(tr ?"Progresso:":"Progress:", padding, y, 120);
            this.resetTextColor();
            this.drawText(`${progress}/${maxProgress}`, 120 + padding, y, 120, "right");
            y += this.lineHeight() + 4;
            
            // Draw mini progress bar
            const barWidth = this.contentsWidth() - padding * 2;
            const barHeight = 8;
            
            // Background
            this.contents.fillRect(padding, y, barWidth, barHeight, ColorManager.gaugeBackColor());
            
            // Progress fill
            const fillWidth = Math.floor((progress / maxProgress) * barWidth);
            this.contents.gradientFillRect(
                padding, 
                y, 
                fillWidth, 
                barHeight, 
                ColorManager.textColor(3),  // Light blue
                ColorManager.textColor(1)   // Blue
            );
            
            y += barHeight + 8;
            
            // Draw horizontal line
            this.drawHorzLine(y);
            y += 8;
        }
        
        this.drawEffects(y, padding);
        
        // Restore original font size
        this.contents.fontSize = originalFontSize;
    };
    
    Window_SkillDetail.prototype.drawHorzLine = function(y) {
        const lineWidth = this.contentsWidth() - 32;
        const lineY = y + this.lineHeight() / 2 - 1;
        this.contents.paintOpacity = 48;
        this.contents.fillRect(16, lineY, lineWidth, 2, ColorManager.normalColor());
        this.contents.paintOpacity = 255;
    };
    
    Window_SkillDetail.prototype.drawEffects = function(y, padding) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(tr ?"Effetti:":"Effects:", padding, y, this.contentsWidth() - padding * 2);
        this.resetTextColor();
        y += this.lineHeight();
        
        if (!this._skill.damage.type && (!this._skill.effects || this._skill.effects.length === 0)) {
            this.drawText(tr ?"Nessun effetto:":"No effects", padding, y, this.contentsWidth() - padding * 2);
            return;
        }
        
        // Draw damage type
        if (this._skill.damage && this._skill.damage.type > 0) {
            let damageText = "";
            switch (this._skill.damage.type) {
                case 1: // HP damage
                    damageText = tr ?"Danneggia HP":"Deals HP damage";
                    break;
                case 2: // MP damage
                    damageText = tr ?"Danneggia MP":"Deals MP damage";
                    break;
                case 3: // HP recovery
                    damageText = tr ?"+ HP":"Recovers HP";
                    break;
                case 4: // MP recovery
                    damageText = tr ?"+ MP":"Recovers MP";
                    break;
                case 5: // HP drain
                    damageText = tr ?"Drena HP":"Drains HP";
                    break;
                case 6: // MP drain
                    damageText = tr ?"Drena MP":"Drains MP";
                    break;
            }
            
            this.drawText(damageText, padding + 20, y, this.contentsWidth() - padding * 2 - 20);
            y += this.lineHeight();
        }
        
        // Draw effects
// This is the fixed version of the drawEffects function that eliminates all references to this.paramName

Window_SkillDetail.prototype.drawEffects = function(y, padding) {
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("Effects:", padding, y, this.contentsWidth() - padding * 2);
    this.resetTextColor();
    y += this.lineHeight();
    
    if (!this._skill.damage.type && (!this._skill.effects || this._skill.effects.length === 0)) {
        this.drawText("No effects", padding, y, this.contentsWidth() - padding * 2);
        return;
    }
    
    // Draw damage type
    if (this._skill.damage && this._skill.damage.type > 0) {
        let damageText = "";
        switch (this._skill.damage.type) {
            case 1: // HP damage
                damageText = tr ?"- HP":"Deals HP damage";
                break;
            case 2: // MP damage
                damageText = tr ?"- MP":"Danneggia MP damage";
                break;
            case 3: // HP recovery
                damageText = tr ?"+ HP":"Recovers HP";
                break;
            case 4: // MP recovery
                damageText = tr ?"+ MP":"Recovers MP";
                break;
            case 5: // HP drain
                damageText = tr ?"Drena HP":"Drains HP";
                break;
            case 6: // MP drain
                damageText = tr ?"Drena MP":"Drains MP";
                break;
        }
        
        this.drawText(damageText, padding + 20, y, this.contentsWidth() - padding * 2 - 20);
        y += this.lineHeight();
    }
    
    // Draw effects
    if (this._skill.effects) {
        for (const effect of this._skill.effects) {
            let effectText = "";
            
            // Helper function to get parameter name safely
            const getParamName = function(paramId) {
                const paramNames = tr ?[
                    'HP', 'MP', 'ATT', 'COS',
                    'INT', 'SAG', 'DES', 'PSI'
                ]:[
                    'HP', 'MP', 'ATK', 'CON',
                    'INT', 'SAG', 'DEX', 'PSI'
                ];
                
                if (TextManager && TextManager.param) {
                    return TextManager.param(paramId);
                } else {
                    return paramNames[paramId] || 'Parameter ' + paramId;
                }
            };
            
            switch (effect.code) {
                case Game_Action.EFFECT_RECOVER_HP:
                    effectText = tr ?"+ HP:":"Recover HP: " + (effect.value1 * 100) + "% + " + effect.value2;
                    break;
                case Game_Action.EFFECT_RECOVER_MP:
                    effectText = tr ?"+ MP:":"Recover MP: " + (effect.value1 * 100) + "% + " + effect.value2;
                    break;
                case Game_Action.EFFECT_ADD_STATE:
                    if ($dataStates[effect.dataId]) {
                        effectText = tr ?"+ status":"Add State: " + $dataStates[effect.dataId].name + " (" + (effect.value1 * 100) + "%)";
                    }
                    break;
                case Game_Action.EFFECT_REMOVE_STATE:
                    if ($dataStates[effect.dataId]) {
                        effectText = tr ?"- status":"Remove State: " + $dataStates[effect.dataId].name + " (" + (effect.value1 * 100) + "%)";
                    }
                    break;
                case Game_Action.EFFECT_ADD_BUFF:
                    effectText = tr ?"+ buff":"Add Buff: " + getParamName(effect.dataId) + " (" + effect.value1 + " turns)";
                    break;
                case Game_Action.EFFECT_ADD_DEBUFF:
                    effectText = tr ?"+ debuff":"Add Debuff: " + getParamName(effect.dataId) + " (" + effect.value1 + " turns)";
                    break;
                case Game_Action.EFFECT_REMOVE_BUFF:
                    effectText = tr ?"- buff":"Remove Buff: " + getParamName(effect.dataId);
                    break;
                case Game_Action.EFFECT_REMOVE_DEBUFF:
                    effectText = tr ?"- debugg":"Remove Debuff: " + getParamName(effect.dataId);
                    break;
                case Game_Action.EFFECT_SPECIAL:
                    effectText = tr ?"Speciale":"Special Effect";
                    break;
                case Game_Action.EFFECT_GROW:
                    effectText = tr ?"Aumenta:":"Grow: " + getParamName(effect.dataId) + " +" + effect.value1;
                    break;
                case Game_Action.EFFECT_LEARN_SKILL:
                    if ($dataSkills[effect.dataId]) {
                        effectText = tr ?"Impara":"Learn Skill: " + $dataSkills[effect.dataId].name;
                    }
                    break;
            }
            
            if (effectText) {
                this.drawText(effectText, padding + 20, y, this.contentsWidth() - padding * 2 - 20);
                y += this.lineHeight();
            }
        }
    }
};
    };
    
    //=============================================================================
    // Window_SkillFusionList
    //=============================================================================
    
    function Window_SkillFusionList() {
        this.initialize(...arguments);
    }
    
    Window_SkillFusionList.prototype = Object.create(Window_Selectable.prototype);
    Window_SkillFusionList.prototype.constructor = Window_SkillFusionList;
    
    Window_SkillFusionList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._sortedRecipes = [];
        this.refresh();
        this.select(0);
        this.activate();
    };
    
    Window_SkillFusionList.prototype.maxItems = function() {
        return this._sortedRecipes.length;
    };
    
    Window_SkillFusionList.prototype.recipe = function(index) {
        return this._sortedRecipes[index];
    };
    
    Window_SkillFusionList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.index());
    };
    
    Window_SkillFusionList.prototype.isEnabled = function(index) {
        const recipe = this.recipe(index);
        const actor = $gameParty.members()[0];
        
        // Check if actor has the required skills
        return actor && actor.hasSkill(recipe.skillA) && actor.hasSkill(recipe.skillB);
    };
    
    Window_SkillFusionList.prototype.isDone = function(index) {
        const recipe = this.recipe(index);
        const actor = $gameParty.members()[0];
        
        // Check if actor already has the result skill
        return actor && actor.hasSkill(recipe.result);
    };
    
    Window_SkillFusionList.prototype.refresh = function() {
        // Sort recipes: available ones at the top
        this._sortedRecipes = this.getSortedRecipes();
        Window_Selectable.prototype.refresh.call(this);
    };
    
    Window_SkillFusionList.prototype.getSortedRecipes = function() {
        const actor = $gameParty.members()[0];
        if (!actor) return fusionRecipes.slice();
        
        // Filter out already learned fusions
        const filteredRecipes = fusionRecipes.filter(recipe => {
            // Skip if actor already has the result skill
            return !actor.hasSkill(recipe.result);
        });
        
        // Sort available fusions to the top
        return filteredRecipes.sort((a, b) => {
            const aAvailable = actor.hasSkill(a.skillA) && actor.hasSkill(a.skillB);
            const bAvailable = actor.hasSkill(b.skillA) && actor.hasSkill(b.skillB);
            
            if (aAvailable && !bAvailable) return -1;
            if (!aAvailable && bAvailable) return 1;
            return 0;
        });
    };
    
    Window_SkillFusionList.prototype.drawItem = function(index) {
        const recipe = this.recipe(index);
        const rect = this.itemLineRect(index);
        
        // Determine text color based on status
        if (this.isEnabled(index)) {
            this.resetTextColor(); // White color
        } else {
            this.changeTextColor(ColorManager.textColor(7)); // Gray color
        }
        
        // Draw skill names
        const skillA = $dataSkills[recipe.skillA];
        const skillB = $dataSkills[recipe.skillB];
        const resultSkill = $dataSkills[recipe.result];
        
        if (skillA && skillB && resultSkill) {
            this.drawText(skillA.name + " + " + skillB.name + " = " + resultSkill.name, rect.x, rect.y, rect.width, 'left');
        }
    };
    
    Window_SkillFusionList.prototype.updateHelp = function() {
        const recipe = this.recipe(this.index());
        if (recipe) {
            const skillA = $dataSkills[recipe.skillA];
            const skillB = $dataSkills[recipe.skillB];
            const resultSkill = $dataSkills[recipe.result];
            
            if (skillA && skillB && resultSkill) {
                const text = skillA.name + " + " + skillB.name + " = " + resultSkill.name;
                this._helpWindow.setText(text);
            }
        }
    };

    // Enable RPG movement key controls
    Window_SkillFusionList.prototype.processHandling = function() {
        if (this.isOpen() && this.active) {
            if (this.isHandled('up') && Input.isTriggered('up')) {
                this.cursorUp(Input.isTriggered('shift'));
                return;
            }
            if (this.isHandled('down') && Input.isTriggered('down')) {
                this.cursorDown(Input.isTriggered('shift'));
                return;
            }
            if (this.isHandled('right') && Input.isTriggered('right')) {
                this.cursorRight(Input.isTriggered('shift'));
                return;
            }
            if (this.isHandled('left') && Input.isTriggered('left')) {
                this.cursorLeft(Input.isTriggered('shift'));
                return;
            }
        }
        Window_Selectable.prototype.processHandling.call(this);
    };
    
    // Handle directional input
    Window_SkillFusionList.prototype.cursorUp = function() {
        this.smoothSelect(Math.max(0, this.index() - 1));
    };
    
    Window_SkillFusionList.prototype.cursorDown = function() {
        this.smoothSelect(Math.min(this.maxItems() - 1, this.index() + 1));
    };
    
    Window_SkillFusionList.prototype.cursorRight = function() {
        this.cursorDown();
    };
    
    Window_SkillFusionList.prototype.cursorLeft = function() {
        this.cursorUp();
    };
    
    //=============================================================================
    // Window_SkillFusionConfirmation
    //=============================================================================
    
    function Window_SkillFusionConfirmation() {
        this.initialize(...arguments);
    }
    
    Window_SkillFusionConfirmation.prototype = Object.create(Window_Command.prototype);
    Window_SkillFusionConfirmation.prototype.constructor = Window_SkillFusionConfirmation;
    
    Window_SkillFusionConfirmation.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this._recipe = null;
    };
    
    Window_SkillFusionConfirmation.prototype.makeCommandList = function() {
        this.addCommand(tr?"Fondi abilità":"Fuse skills", 'yes');
        this.addCommand(tr?"Annulla":"Cancel", 'no');
    };
    
    Window_SkillFusionConfirmation.prototype.setRecipe = function(recipe) {
        this._recipe = recipe;
        this.refresh();
    };
    
    Window_SkillFusionConfirmation.prototype.recipe = function() {
        return this._recipe;
    };
    
    Window_SkillFusionConfirmation.prototype.drawItem = function(index) {
        Window_Command.prototype.drawItem.call(this, index);
        

    };
    //=============================================================================
    // Scene_SkillMaster
    //=============================================================================
    
    function Scene_SkillMaster() {
        this.initialize(...arguments);
    }
    
    Scene_SkillMaster.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SkillMaster.prototype.constructor = Scene_SkillMaster;
    
    Scene_SkillMaster.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_SkillMaster.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
    };
    
    Scene_SkillMaster.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_SkillMasterCommand(rect);
        this._commandWindow.setHandler("progress", this.commandProgress.bind(this));
        this._commandWindow.setHandler("encyclopedia", this.commandEncyclopedia.bind(this));
        this._commandWindow.setHandler("fusion", this.commandFusion.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };
    
    Scene_SkillMaster.prototype.commandWindowRect = function() {
        const ww = 400;
        const wh = this.calcWindowHeight(4, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillMaster.prototype.commandProgress = function() {
        const skillId = $gameSystem.getSelectedSkillId();
        if (skillId > 0) {
            SceneManager.push(Scene_SkillProgress);
        } else {
            this._commandWindow.activate();
            window.skipLocalization = true;

            $gameMessage.add(tr ?"":"No skill in training.");
            window.skipLocalization = false;

        }
    };
    
    Scene_SkillMaster.prototype.commandEncyclopedia = function() {
        SceneManager.push(Scene_SkillEncyclopedia);
    };
    
    Scene_SkillMaster.prototype.commandFusion = function() {
        SceneManager.push(Scene_SkillFusion);
    };
    
    //=============================================================================
    // Scene_SkillProgress
    //=============================================================================
    
    function Scene_SkillProgress() {
        this.initialize(...arguments);
    }
    
    Scene_SkillProgress.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SkillProgress.prototype.constructor = Scene_SkillProgress;
    
    Scene_SkillProgress.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_SkillProgress.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createProgressWindow();
    };
    
    Scene_SkillProgress.prototype.createProgressWindow = function() {
        const rect = this.progressWindowRect();
        this._progressWindow = new Window_SkillProgress(rect);
        this._progressWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._progressWindow);
    };
    
    Scene_SkillProgress.prototype.progressWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    //=============================================================================
    // Scene_SkillEncyclopedia
    //=============================================================================
    
    function Scene_SkillEncyclopedia() {
        this.initialize(...arguments);
    }
    
    Scene_SkillEncyclopedia.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SkillEncyclopedia.prototype.constructor = Scene_SkillEncyclopedia;
    
    Scene_SkillEncyclopedia.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._selectedCategory = null;
        this._preselectedSkillId = $gameVariables.value(variableId);
    };
    
    Scene_SkillEncyclopedia.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCategoryWindow();
        this.createSkillListWindow();
        this.createSkillDetailWindow();
    };
    
    Scene_SkillEncyclopedia.prototype.createCategoryWindow = function() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_SkillCategory(rect);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    };
    
    Scene_SkillEncyclopedia.prototype.createSkillListWindow = function() {
        const rect = this.skillListWindowRect();
        this._skillListWindow = new Window_SkillGrid(rect);
        this._skillListWindow.setHandler("ok", this.onSkillOk.bind(this));
        this._skillListWindow.setHandler("cancel", this.onSkillCancel.bind(this));
        this._skillListWindow.hide();
        this._skillListWindow.deactivate();
        this.addWindow(this._skillListWindow);
    };
    
    Scene_SkillEncyclopedia.prototype.createSkillDetailWindow = function() {
        const rect = this.skillDetailWindowRect();
        this._skillDetailWindow = new Window_SkillDetail(rect);
        this._skillDetailWindow.hide();
        this.addWindow(this._skillDetailWindow);
        
        // Connect the skill list window with the detail window
        this._skillListWindow.setDetailWindow(this._skillDetailWindow);
    };
    
    Scene_SkillEncyclopedia.prototype.categoryWindowRect = function() {
        const wx = (Graphics.boxWidth - categoryWindowWidth) / 2;
        const wy = this.mainAreaTop();
        const ww = categoryWindowWidth;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillEncyclopedia.prototype.skillListWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = skillListWidth;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillEncyclopedia.prototype.skillDetailWindowRect = function() {
        const wx = skillListWidth;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - skillListWidth;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillEncyclopedia.prototype.onCategoryOk = function() {
        this._selectedCategory = this._categoryWindow.currentCategory();
        this._categoryWindow.hide();
        this._skillListWindow.setCategory(this._selectedCategory);
        
        // If there was a preselected skill, try to select it
        if (this._preselectedSkillId > 0) {
            this._skillListWindow.selectSkillById(this._preselectedSkillId);
            this._preselectedSkillId = 0; // Reset after use
        }
        
        this._skillListWindow.show();
        this._skillListWindow.activate();
        this._skillDetailWindow.show();
    };
    
    Scene_SkillEncyclopedia.prototype.onSkillOk = function() {
        const skillId = this._skillListWindow.currentSkillId();
        
        // Set as selected skill for progression
        $gameSystem.setSelectedSkillId(skillId);
        
        // Store in variable
        $gameVariables.setValue(variableId, skillId);
        
        // Show confirmation message
        this._skillDetailWindow.showSelectionInfo(true);
        
        // Refresh skill list to show selection highlight
        this._skillListWindow.refresh();
        this._skillListWindow.activate();
    };
    
    Scene_SkillEncyclopedia.prototype.onSkillCancel = function() {
        this._skillListWindow.hide();
        this._skillDetailWindow.hide();
        this._categoryWindow.show();
        this._categoryWindow.activate();
    };
    
    //=============================================================================
    // Scene_SkillFusion
    //=============================================================================
    
    function Scene_SkillFusion() {
        this.initialize(...arguments);
    }
    
    Scene_SkillFusion.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_SkillFusion.prototype.constructor = Scene_SkillFusion;
    
    Scene_SkillFusion.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_SkillFusion.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createHelpWindow();
        this.createFusionListWindow();
        this.createConfirmationWindow();
    };
    
    Scene_SkillFusion.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.setText(tr ?"Seleziona un'abilità da fondere":"Select a skill fusion");
        this.addWindow(this._helpWindow);
    };
    
    Scene_SkillFusion.prototype.helpWindowRect = function() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillFusion.prototype.createFusionListWindow = function() {
        const rect = this.fusionListWindowRect();
        this._fusionListWindow = new Window_SkillFusionList(rect);
        this._fusionListWindow.setHandler('ok', this.onFusionOk.bind(this));
        this._fusionListWindow.setHandler('cancel', this.popScene.bind(this));
        this._fusionListWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._fusionListWindow);
    };
    
    Scene_SkillFusion.prototype.fusionListWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillFusion.prototype.createConfirmationWindow = function() {
        const rect = this.confirmationWindowRect();
        this._confirmationWindow = new Window_SkillFusionConfirmation(rect);
        this._confirmationWindow.setHandler('yes', this.onConfirmationYes.bind(this));
        this._confirmationWindow.setHandler('no', this.onConfirmationNo.bind(this));
        this._confirmationWindow.deactivate();
        this._confirmationWindow.close();
        this.addWindow(this._confirmationWindow);
    };
    
    Scene_SkillFusion.prototype.confirmationWindowRect = function() {
        const ww = 300;
        const wh = this.calcWindowHeight(3, false);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    };
    
    Scene_SkillFusion.prototype.onFusionOk = function() {
        const index = this._fusionListWindow.index();
        const recipe = this._fusionListWindow.recipe(index);
        
        if (this._fusionListWindow.isEnabled(index)) {
            this._confirmationWindow.setRecipe(recipe);
            this._confirmationWindow.open();
            this._confirmationWindow.activate();
        } else {
            this._fusionListWindow.activate();
            SoundManager.playBuzzer();
        }
    };
    
    Scene_SkillFusion.prototype.onConfirmationYes = function() {
        const recipe = this._confirmationWindow.recipe();
        const actor = $gameParty.members()[0];
        
        // Remove skills A and B
        actor.forgetSkill(recipe.skillA);
        actor.forgetSkill(recipe.skillB);
        
        // Learn result skill
        actor.learnSkill(recipe.result);
        
        // Show success message
        this._helpWindow.setText(successMessage);
        
        // Update the fusion list window
        this._fusionListWindow.refresh();
        this._fusionListWindow.activate();
        this._confirmationWindow.close();
        
        // Play sound effect
        SoundManager.playRecovery();
        
        // If the selected skill was one of the fusion ingredients, reset it
        const selectedSkillId = $gameSystem.getSelectedSkillId();
        if (selectedSkillId === recipe.skillA || selectedSkillId === recipe.skillB) {
            $gameSystem.setSelectedSkillId(0);
        }
    };
    
    Scene_SkillFusion.prototype.onConfirmationNo = function() {
        this._confirmationWindow.close();
        this._fusionListWindow.activate();
    };
    
    //=============================================================================
    // Plugin Commands Registration
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "openSkillSystem", args => {
        try {
            SceneManager.push(Scene_SkillMaster);
        } catch (e) {
            console.error("Error opening Skill System menu:", e);
        }
    });
    
    PluginManager.registerCommand(pluginName, "openEncyclopedia", args => {
        try {
            SceneManager.push(Scene_SkillEncyclopedia);
        } catch (e) {
            console.error("Error opening Encyclopedia:", e);
        }
    });
    
    PluginManager.registerCommand(pluginName, "openEncyclopediaWithSkill", args => {
        const skillId = Number(args.skillId || 0);
        $gameVariables.setValue(variableId, skillId);
        try {
            SceneManager.push(Scene_SkillEncyclopedia);
        } catch (e) {
            console.error("Error opening Encyclopedia with skill:", e);
        }
    });
    
    PluginManager.registerCommand(pluginName, "showFusionMenu", args => {
        try {
            SceneManager.push(Scene_SkillFusion);
        } catch (e) {
            console.error("Error showing Fusion Menu:", e);
        }
    });
    
    PluginManager.registerCommand(pluginName, "openSkillProgress", args => {
        const skillId = $gameVariables.value(variableId);
        if (skillId > 0) {
            try {
                SceneManager.push(Scene_SkillProgress);
            } catch (e) {
                console.error("Error opening Skill Progress:", e);
            }
        } else {
            window.skipLocalization = true;

            $gameMessage.add("No skill selected for training.");
            window.skipLocalization = false;

        }
    });
    
    PluginManager.registerCommand(pluginName, "increaseSkillProgress", args => {
        const baseAmount = Number(args.amount || 1);
        const skillId = $gameVariables.value(variableId);
        
        if (skillId > 0) {
            const progress = $gameSystem.getSkillProgress(skillId);
            const maxProgress = $gameSystem.getSkillMaxProgress(skillId);
            
            const multiplier = actorCategoryManager.getMultiplier(skillId);
            const amount = Math.floor(baseAmount * multiplier);

            const newProgress = Math.min(progress + amount, maxProgress);
            $gameSystem.setSkillProgress(skillId, newProgress);
            window.skipLocalization = true;

            $gameMessage.add(tr ?`Progresso allenamento aumentato a ${newProgress}/${maxProgress}.`:`Skill training increased to ${newProgress}/${maxProgress}.`);
            window.skipLocalization = false;

        } else {
            window.skipLocalization = true;

            $gameMessage.add(tr ?"Nessuna abilità in allenamento":"No skill being trained.");
            window.skipLocalization = false;

        }
    });
    
    //=============================================================================
    // Menu Command
    //=============================================================================
    
    if (addToMenu) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            if($gameSwitches.value(45)){
                return
            }
            this.addCommand(ConfigManager.language === 'it'?"Allenamento":"Training", 'skillMaster',true,40);
        };
        
        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('skillMaster', this.commandSkillMaster.bind(this));
        };
        
        Scene_Menu.prototype.commandSkillMaster = function() {
            SceneManager.push(Scene_SkillMaster);
        };
    }
    
    // Register new classes globally
    window.Scene_SkillMaster = Scene_SkillMaster;
    window.Window_SkillMasterCommand = Window_SkillMasterCommand;
    window.Scene_SkillProgress = Scene_SkillProgress;
    window.Window_SkillProgress = Window_SkillProgress;
    window.Scene_SkillEncyclopedia = Scene_SkillEncyclopedia;
    window.Window_SkillCategory = Window_SkillCategory;
    window.Window_SkillGrid = Window_SkillGrid;
    window.Window_SkillDetail = Window_SkillDetail;
    window.Scene_SkillFusion = Scene_SkillFusion;
    window.Window_SkillFusionList = Window_SkillFusionList;
    window.Window_SkillFusionConfirmation = Window_SkillFusionConfirmation;
    
    // Debug log to confirm plugin is loaded successfully
    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
      _BattleManager_invokeAction.call(this, subject, target);
      if ($gameParty.inBattle() && subject.isActor()) {
        const action = subject.currentAction();
        if (action && action.item()) {
          handleCategoryPointGain(subject, action.item());
        }
      }
    };
  
    function handleCategoryPointGain(actor, skill) {
      if (!skill || !skill.note) return;
  
      const match = skill.note.match(/<category:(.+?)>/i);
      if (!match) return;
  
      const skillCategory = match[1].trim();
      const trainedSkillId = actor.skillMasterId?.(); // Adjust if needed
      if (!trainedSkillId) return;
  
      const trainingSkill = $dataSkills[trainedSkillId];
      if (!trainingSkill) return;
  
      const trainingCategoryMatch = trainingSkill.note.match(/<category:(.+?)>/i);
      if (!trainingCategoryMatch) return;
  
      const trainingCategory = trainingCategoryMatch[1].trim();
      if (skillCategory === trainingCategory) {
        const learned = gainSkillPoints(actor, trainedSkillId, 2, false); // false = silent
        if (learned) {
          const name = $dataSkills[trainedSkillId].name;
          $gameMessage.add(`${actor.name()} mastered ${name}!`);
        }
      }
    }
  
    function gainSkillPoints(actor, skillId, amount, notify = true) {
      if (!actor._skillPoints) actor._skillPoints = {};
      const current = actor._skillPoints[skillId] || 0;
      const newTotal = current + amount;
      actor._skillPoints[skillId] = newTotal;
  
      const required = 100; // Set your mastery threshold
      if (newTotal >= required && !actor.isLearnedSkill(skillId)) {
        actor.learnSkill(skillId);
        if (notify) {
          const name = $dataSkills[skillId].name;
          $gameMessage.add(`${actor.name()} mastered ${name}!`);
        }
        return true;
      }
      return false;
    }
  })();