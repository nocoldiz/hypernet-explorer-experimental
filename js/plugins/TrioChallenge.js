/*:
 * @target MZ
 * @plugindesc v1.1 Increases enemy stats when the party has exactly 3 members.
 * @author Claude
 * @help
 * TrioChallenge.js
 * 
 * This plugin increases enemy stats when your party has exactly 3 members.
 * The balance is carefully designed to provide a challenge without being unfair.
 * 
 * If Switch 45 is ON, the trio challenge will be disabled regardless of party size.
 * 
 * ===========================================================================
 * 
 * Parameters:
 *   Attack Multiplier: How much to multiply enemy attack power (default: 1.2)
 *   Defense Multiplier: How much to multiply enemy defense (default: 1.15)
 *   HP Multiplier: How much to multiply enemy HP (default: 1.25)
 *   MP Multiplier: How much to multiply enemy MP (default: 1.1)
 *   Agility Multiplier: How much to multiply enemy agility (default: 1.1)
 *   Luck Multiplier: How much to multiply enemy luck (default: 1.05)
 *   Experience Multiplier: How much to multiply XP rewards (default: 1.3)
 *   Gold Multiplier: How much to multiply gold rewards (default: 1.25)
 * 
 * ===========================================================================
 * 
 * No credit required, free for commercial and non-commercial use.
 * 
 * @param attackMult
 * @text Attack Multiplier
 * @desc Multiplier for enemy attack when party has 3 members
 * @default 1.2
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param defenseMult
 * @text Defense Multiplier
 * @desc Multiplier for enemy defense when party has 3 members
 * @default 1.15
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param hpMult
 * @text HP Multiplier
 * @desc Multiplier for enemy HP when party has 3 members
 * @default 1.25
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param mpMult
 * @text MP Multiplier
 * @desc Multiplier for enemy MP when party has 3 members
 * @default 1.1
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param agilityMult
 * @text Agility Multiplier
 * @desc Multiplier for enemy agility when party has 3 members
 * @default 1.1
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param luckMult
 * @text Luck Multiplier
 * @desc Multiplier for enemy luck when party has 3 members
 * @default 1.05
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param expMult
 * @text Experience Multiplier
 * @desc Multiplier for experience rewards when party has 3 members
 * @default 1.3
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param goldMult
 * @text Gold Multiplier
 * @desc Multiplier for gold rewards when party has 3 members
 * @default 1.25
 * @type number
 * @decimals 2
 * @min 1.0
 * 
 * @param showIcon
 * @text Show Challenge Icon
 * @desc Show an icon indicating increased difficulty when trio mode is active
 * @default true
 * @type boolean
 * 
 * @param challengeIcon
 * @text Challenge Icon ID
 * @desc Icon index to display when trio challenge is active
 * @default 87
 * @type number
 * @min 0
 */

(function() {
    'use strict';
    
    const pluginName = "TrioChallenge";
    const parameters = PluginManager.parameters(pluginName);
    
    const attackMult = Number(parameters['attackMult'] || 1.2);
    const defenseMult = Number(parameters['defenseMult'] || 1.15);
    const hpMult = Number(parameters['hpMult'] || 1.25);
    const mpMult = Number(parameters['mpMult'] || 1.1);
    const agilityMult = Number(parameters['agilityMult'] || 1.1);
    const luckMult = Number(parameters['luckMult'] || 1.05);
    const expMult = Number(parameters['expMult'] || 1.3);
    const goldMult = Number(parameters['goldMult'] || 1.25);
    const showIcon = String(parameters['showIcon'] || 'true') === 'true';
    const challengeIcon = Number(parameters['challengeIcon'] || 87);
    
    // Helper function to check if party has exactly 3 members and switch 45 is OFF
    function isTrioMode() {
        // If switch 45 is ON, trio challenge is disabled
        if ($gameSwitches.value(45)) {
            return false;
        }
        return $gameParty.battleMembers().length === 3;
    }
    
    // Override enemy parameter calculation
    const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function(paramId) {
        let value = _Game_Enemy_paramBase.call(this, paramId);
        
        if (isTrioMode()) {
            // Apply multipliers based on parameter type
            switch (paramId) {
                case 0: // MHP (Max HP)
                    value *= hpMult;
                    break;
                case 1: // MMP (Max MP)
                    value *= mpMult;
                    break;
                case 2: // ATK (Attack)
                    value *= attackMult;
                    break;
                case 3: // DEF (Defense)
                    value *= defenseMult;
                    break;
                case 4: // MAT (Magic Attack)
                    value *= attackMult;
                    break;
                case 5: // MDF (Magic Defense)
                    value *= defenseMult;
                    break;
                case 6: // AGI (Agility)
                    value *= agilityMult;
                    break;
                case 7: // LUK (Luck)
                    value *= luckMult;
                    break;
            }
        }
        
        return Math.round(value);
    };
    
    // Override experience calculation
    const _Game_Enemy_exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function() {
        let value = _Game_Enemy_exp.call(this);
        
        if (isTrioMode()) {
            value = Math.round(value * expMult);
        }
        
        return value;
    };
    
    // Override gold calculation
    const _Game_Enemy_gold = Game_Enemy.prototype.gold;
    Game_Enemy.prototype.gold = function() {
        let value = _Game_Enemy_gold.call(this);
        
        if (isTrioMode()) {
            value = Math.round(value * goldMult);
        }
        
        return value;
    };
    
    // Add visual indicator for trio challenge mode if enabled
    if (showIcon) {
        // Create and update trio challenge sprite
        function TrioChallengeSprite() {
            this.initialize.apply(this, arguments);
        }
        
        TrioChallengeSprite.prototype = Object.create(Sprite.prototype);
        TrioChallengeSprite.prototype.constructor = TrioChallengeSprite;
        
        TrioChallengeSprite.prototype.initialize = function() {
            Sprite.prototype.initialize.call(this);
            this.bitmap = ImageManager.loadSystem('IconSet');
            this.setupIconFrame();
            this.opacity = 0;
            this.x = Graphics.width - 42;
            this.y = 2;
        };
        
        TrioChallengeSprite.prototype.setupIconFrame = function() {
            const iconIndex = challengeIcon;
            const pw = ImageManager.iconWidth;
            const ph = ImageManager.iconHeight;
            const sx = (iconIndex % 16) * pw;
            const sy = Math.floor(iconIndex / 16) * ph;
            this.setFrame(sx, sy, pw, ph);
        };
        
        TrioChallengeSprite.prototype.update = function() {
            Sprite.prototype.update.call(this);
            
            // Show icon only in battle and when trio mode is active
            if ($gameParty && $gameParty.inBattle() && isTrioMode()) {
                this.opacity = 255;
            } else {
                this.opacity = 0;
            }
        };
        
        // Hook into scene base to add our sprite
        const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
        Scene_Battle.prototype.createAllWindows = function() {
            _Scene_Battle_createAllWindows.call(this);
            this.createTrioChallengeSprite();
        };
        
        Scene_Battle.prototype.createTrioChallengeSprite = function() {
            this._trioChallengeSprite = new TrioChallengeSprite();
            this.addChild(this._trioChallengeSprite);
        };
    }
    

    
    // Compatibility with enemy health bars plugins
    // This ensures accurate health displays if HP multiplier changes
    const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    Game_Enemy.prototype.initMembers = function() {
        _Game_Enemy_initMembers.call(this);
        this._trioMaxHp = 0;
    };
    
    const _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        // Store the adjusted max HP for health bar plugins
        this._trioMaxHp = this.mhp;
    };
    
    // Optional method for compatibility with health bar plugins
    Game_Enemy.prototype.getAdjustedMaxHp = function() {
        return this._trioMaxHp;
    };
    
})();