/*:
 * @target MZ
 * @plugindesc Enhances shop screens with detailed item descriptions and adds actor equipment compatibility display
 * @author Claude
 * @help EnhancedShopDetails.js
 * 
 * This plugin enhances the shop screen by:
 * - Adding a detailed item description window instead of using the status window
 * - Showing comprehensive item information similar to EnhancedItemDescriptions.js
 * - Fixing item arrangement in the sell tab to display one item per line
 * - Showing which party members can equip weapons when a weapon is selected
 * 
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(() => {
    'use strict';
    
    //=============================================================================
    // Window_ShopItemDetail - Detailed item information window for shops
    //=============================================================================
    
    function Window_ShopItemDetail() {
        this.initialize(...arguments);
    }
    
    Window_ShopItemDetail.prototype = Object.create(Window_Base.prototype);
    Window_ShopItemDetail.prototype.constructor = Window_ShopItemDetail;
    
    Window_ShopItemDetail.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._item = null;
        this.refresh();
    };
    
    Window_ShopItemDetail.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
    
    Window_ShopItemDetail.prototype.refresh = function() {
        this.contents.clear();
        if (this._item) {
            this.drawItemDetails();
        }
    };
    
    Window_ShopItemDetail.prototype.drawItemDetails = function() {
        const item = this._item;
        const lineHeight = this.lineHeight();
        let y = 0;
        // Draw horizontal line and stats
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
    
    Window_ShopItemDetail.prototype.drawItemStats = function(item, y) {
        const lineHeight = this.lineHeight();
        let currentY = y;
        const useTranslation = ConfigManager.language === 'it'

        // Draw item type without header
        this.drawKeyValue(useTranslation?"Tipo":"Type", getItemTypeName(item), 0, currentY);
        currentY += lineHeight;
        
        /*
        // Draw consumable info for items
        if(item.consumable){
            this.drawKeyValue("Use", item.consumable ? "Single" : "No", 0, currentY);
            currentY += lineHeight;
        }*/
        
  
    
        // Add a gap
        currentY += 8;
        
        // Draw combat stats if they exist
        const hasCombatStats = 
            (item.speed !== undefined && item.speed !== 0) ||
            (item.successRate !== undefined && item.successRate < 100) ||
            (item.repeats && item.repeats > 1) ||
            (item.xGain !== undefined && item.tpGain !== 0) ||
            (item.damage && item.damage.type > 0);
        
        if (hasCombatStats) {
            // No header for combat stats
            
            // Add success rate if it exists
            if (item.successRate !== undefined && item.successRate < 100) {
                this.drawKeyValue(useTranslation?"Successo":"Success", item.successRate + "%", 0, currentY);
                currentY += lineHeight;
            }
            
            // Add repeat count if more than 1
            if (item.repeats && item.repeats > 1) {
                this.drawKeyValue(useTranslation?"Colpi":"Hits", item.repeats + " time(s)", 0, currentY);
                currentY += lineHeight;
            }
            
            // Add speed modifier if not 0
            if (item.speed !== undefined && item.speed !== 0) {
                const speedSign = item.speed > 0 ? "+" : "";
                this.drawKeyValue(useTranslation?"Velocità":"Speed", speedSign + item.speed, 0, currentY);
                currentY += lineHeight;
            }
            
            // Add TP gain if not 0
            if (item.tpGain !== undefined && item.tpGain !== 0) {
                this.drawKeyValue("AP", item.tpGain.toString(), 0, currentY);
                currentY += lineHeight;
            }
            
            // Add HP damage/recovery
            if (item.damage && item.damage.type > 0) {
                this.drawKeyValue(getDamageTypeName(item.damage.type), 
                                getFormulaPreview(item.damage.formula), 0, currentY);
                currentY += lineHeight;
                
                // Add elemental info
                if (item.damage.elementId > 0) {
                    this.drawKeyValue("Elem.", getElementName(item.damage.elementId), 0, currentY);
                    currentY += lineHeight;
                }

            }
            
            // Add a gap
            currentY += 8;
        }
        
        // Draw effects if they exist (without header)
        if (item.effects && item.effects.length > 0) {
            for (const effect of item.effects) {
                const effectText = getEffectDescription(effect);
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
    
    Window_ShopItemDetail.prototype.drawWeaponStats = function(item, y) {
        const lineHeight = this.lineHeight();
        const useTranslation = ConfigManager.language === 'it'

        let currentY = y;
        
        // Draw weapon type without header
        const weaponType = $dataSystem.weaponTypes[item.wtypeId] || "Weapon";
        this.drawKeyValue(useTranslation?"Tipo":"Type", weaponType, 0, currentY);
        currentY += lineHeight;

        // NEW: Show which party members can equip this weapon
        currentY = this.drawEquipCompatibility(item, currentY);
        
        // Add a gap after compatibility info
        currentY += 8;
        
        // Skip price (already visible in shop)
        
        // Draw parameters without header
        var params = [
            ["STR", item.params[2]],
            ["COS", item.params[3]],
            ["INT", item.params[4]],
            ["WIS", item.params[5]],
            ["DEX", item.params[6]],
            ["PSI", item.params[7]]
        ];

        if(useTranslation){
            params = [
                ["FRZ", item.params[2]],
                ["CON", item.params[3]],
                ["INT", item.params[4]],
                ["SAG", item.params[5]],
                ["DEX", item.params[6]],
                ["PSI", item.params[7]]
            ];
        }
        
        for (const param of params) {
            if (param[1] !== 0) {
                const sign = param[1] > 0 ? "+" : "";
                this.drawKeyValue(param[0], sign + param[1], 0, currentY);
                currentY += lineHeight;
            }
        }
        
        // Add a gap
        currentY += 8;
        
        // Draw traits without header
        if (item.traits && item.traits.length > 0) {
            for (const trait of item.traits) {
                let traitText = getTraitDescription(trait);
                if (traitText) {
                    // Replace "Attack Element" with "Elem"
                    traitText = traitText.replace("Attack Element", "Elem");
                    
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
    
    // NEW: Method to check and display actor equipment compatibility
    Window_ShopItemDetail.prototype.drawEquipCompatibility = function(item, y) {
        const useTranslation = ConfigManager.language === 'it'

        const lineHeight = this.lineHeight();
        let currentY = y;
        
        // Draw a section header for equip compatibility
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(useTranslation?"Equipaggiabile da":"Equippable By:", 0, currentY, this.width - this.padding * 2);
        currentY += lineHeight;
        
        // Get the first two party members (as requested in the specification)
        const party = $gameParty.members();
        let equipInfoShown = false;
        
        // Check each actor in the party (limit to first two actors)
        for (let i = 0; i < Math.min(2, party.length); i++) {
            const actor = party[i];
            
            // Check if the actor can equip this weapon
            const canEquip = actor.canEquip(item);
            
            // Display actor name and equip status
            this.resetTextColor();
            if (canEquip) {
                this.drawText(actor.name(), 20, currentY, this.width - this.padding * 2 - 20);
            } else {
                // If can't equip, show in red
                this.changeTextColor(ColorManager.deathColor());
                this.drawText(actor.name() + useTranslation?" non può equip.":" can't equip", 20, currentY, this.width - this.padding * 2 - 20);
            }
            
            currentY += lineHeight;
            equipInfoShown = true;
        }
        
        // If we didn't show any party member info (empty party), show a message
        if (!equipInfoShown) {
            this.resetTextColor();
            this.drawText(useTranslation?"Nessun membro del Party":"No party members.", 20, currentY, this.width - this.padding * 2 - 20);
            currentY += lineHeight;
        }
        
        return currentY;
    };
    
    Window_ShopItemDetail.prototype.drawArmorStats = function(item, y) {
        const lineHeight = this.lineHeight();
        let currentY = y;
        const useTranslation = ConfigManager.language === 'it'

        // Draw armor type without header
        this.drawKeyValue("Type", $dataSystem.armorTypes[item.atypeId], 0, currentY);
        currentY += lineHeight;
        
        // Draw equip type
        this.drawKeyValue("Slot", $dataSystem.equipTypes[item.etypeId], 0, currentY);
        currentY += lineHeight;
        
        // Skip price (already visible in shop)
        
        // Add a gap
        currentY += 8;
        
        // Draw parameters without header
        var params = [
            ["STR", item.params[2]],
            ["CON", item.params[3]],
            ["INT", item.params[4]],
            ["SAG", item.params[5]],
            ["DEX", item.params[6]],
            ["PSI", item.params[7]]
        ];

        if(useTranslation){
            params = [
                ["FRZ", item.params[2]],
                ["COS", item.params[3]],
                ["INT", item.params[4]],
                ["WIS", item.params[5]],
                ["DES", item.params[6]],
                ["PSI", item.params[7]]
            ];
        }
        
        for (const param of params) {
            if (param[1] !== 0) {
                const sign = param[1] > 0 ? "+" : "";
                this.drawKeyValue(param[0], sign + param[1], 0, currentY);
                currentY += lineHeight;
            }
        }
        
        // Add a gap
        currentY += 8;
        
        // Draw traits without header
        if (item.traits && item.traits.length > 0) {
            for (const trait of item.traits) {
                let traitText = getTraitDescription(trait);
                if (traitText) {
                    // Replace "Attack Element" with "Elem"
                    traitText = traitText.replace(useTranslation?"Elemento ATT":"Attack Element", "Elem");
                    
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
    
    Window_ShopItemDetail.prototype.drawKeyValue = function(key, value, x, y) {
        const width = this.width - this.padding * 2;
        const keyWidth = Math.floor(width / 3);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(key, x, y, keyWidth);
        this.resetTextColor();
        this.drawText(value, x + keyWidth, y, width - keyWidth, 'left');
    };
    
    Window_ShopItemDetail.prototype.drawHorzLine = function(y) {
        const lineY = y + this.lineHeight() / 2 - 1;
        const width = this.width - this.padding * 2;
        this.contents.fillRect(0, lineY, width, 2, ColorManager.systemColor());
    };

    // Text wrapping function
    Window_ShopItemDetail.prototype.wrapText = function(text, maxWidth) {
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
    // Helper Functions for readable format - copied from the previous plugin 
    //=============================================================================
    
    function getItemTypeName(item) {
        if (DataManager.isItem(item)) {
            return item.itypeId === 1 ? "Regular Item" : "Key Item";
        } else if (DataManager.isWeapon(item)) {
            return "Weapon";
        } else if (DataManager.isArmor(item)) {
            return "Armor";
        }
        return "Unknown";
    }
    
    function getScopeName(scope) {
        switch (scope) {
            case 0: return "None";
            case 1: return "Enemy";
            case 2: return "Enemy";
            case 3: return "Enemy";
            case 4: return "Enemy";
            case 5: return "Enemy";
            case 6: return "Enemy";
            case 7: return "Ally";
            case 8: return "Party";
            case 9: return "Ally (Dead)";
            case 10: return "Party (Dead)";
            case 11: return "User";
            default: return "Unknown";
        }
    }
    
    function getOccasionName(occasion) {
        const useTranslation = ConfigManager.language === 'it'
        if(useTranslation){
            switch (occasion) {
                case 0: return "Sempre";
                case 1: return "Battaglia";
                case 2: return "Mappa";
                case 3: return "Mai";
                default: return "Sconosciuto";
            }
        }else{
            switch (occasion) {
                case 0: return "Always";
                case 1: return "Battle";
                case 2: return "Map";
                case 3: return "Never";
                default: return "Unknown";
            }
        }

    }
    
    function getDamageTypeName(type) {
        const useTranslation = ConfigManager.language === 'it'

        if(useTranslation){

        switch (type) {
            case 1: return "HP Dmg";
            case 2: return "MP Dmg";
            case 3: return "HP Reg";
            case 4: return "MP Reg";
            case 5: return "HP Lose";
            case 6: return "MP Lose";
            default: return "No Dmg";
        }
        }else{
            switch (type) {
                case 1: return "Danno HP";
                case 2: return "Danno MP";
                case 3: return "Reg. HP";
                case 4: return "Reg. MP";
                case 5: return "Perdita HP";
                case 6: return "Perdita MP";
                default: return "No Danno";
            }
        }
    }
    
    function getElementName(elementId) {
        const useTranslation = ConfigManager.language === 'it'

        if (elementId <= 0) return useTranslation?"Nessuno":"None";
        
        // Get the element name from the database
        const element = $dataSystem.elements[elementId];
        return element || useTranslation?"Element #":"Elemento #" + elementId;
    }
    
    function getFormulaPreview(formula) {
        // Show a simplified version of the formula
        if (!formula) return "?";
        
        // Clean up the formula for display
        let display = formula;
        const useTranslation = ConfigManager.language === 'it'

        if(useTranslation){
        // Replace common variables with readable text
        display = display.replace(/a\.atk/g, "FRZ");
        display = display.replace(/b\.def/g, "COS");
        display = display.replace(/a\.mat/g, "INT");
        display = display.replace(/b\.mdf/g, "SAG");
        display = display.replace(/a\.agi/g, "DES");
        display = display.replace(/b\.luk/g, "PSI");
        }else{
        // Replace common variables with readable text
        display = display.replace(/a\.atk/g, "STR");
        display = display.replace(/b\.def/g, "CON");
        display = display.replace(/a\.mat/g, "INT");
        display = display.replace(/b\.mdf/g, "SAG");
        display = display.replace(/a\.agi/g, "WIS");
        display = display.replace(/b\.luk/g, "PSI");
        }

        
        // Limit length
        if (display.length > 30) {
            display = display.substring(0, 27) + "...";
        }
        
        return display;
    }
    
    function getEffectDescription(effect) {
        const useTranslation = ConfigManager.language === 'it'

        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                return "HP: " + (effect.value1 * 100) + "% + " + effect.value2;
            case Game_Action.EFFECT_RECOVER_MP:
                return "MP: " + (effect.value1 * 100) + "% + " + effect.value2;
            case Game_Action.EFFECT_GAIN_TP:
                return "AP: " + effect.value1;
            case Game_Action.EFFECT_ADD_STATE:
                return "" + getStateName(effect.dataId) + " (" + (effect.value1 * 100) + "%)";
            case Game_Action.EFFECT_REMOVE_STATE:
                return useTranslation?"Cura":"Cure: " + getStateName(effect.dataId) + " (" + (effect.value1 * 100) + "%)";
            case Game_Action.EFFECT_ADD_BUFF:
                return "Buff: " + getParameterName(effect.dataId) + " (" + effect.value1 + " turns)";
            case Game_Action.EFFECT_ADD_DEBUFF:
                return "Debuff: " + getParameterName(effect.dataId) + " (" + effect.value1 + " turns)";
            case Game_Action.EFFECT_REMOVE_BUFF:
                return useTranslation?"Rimuovi: ":"Remove: " + getParameterName(effect.dataId);
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                return useTranslation?"Rimuovi ":"Remove: " + getParameterName(effect.dataId);
            case Game_Action.EFFECT_SPECIAL:
                return useTranslation?"Speciale":"Special";
            case Game_Action.EFFECT_GROW:
                return useTranslation?"Aumenta":"Grow: " + getParameterName(effect.dataId) + " +" + effect.value1;
            case Game_Action.EFFECT_LEARN_SKILL:
                return useTranslation?"Impara":"Learn: " + getSkillName(effect.dataId);
            case Game_Action.EFFECT_COMMON_EVENT:
                return useTranslation?"Evento":"Event";
            default:
                return null;
        }
    }
    
    function getTraitDescription(trait) {
        const code = trait.code;
        const dataId = trait.dataId;
        const value = trait.value;
        const useTranslation = ConfigManager.language === 'it'

        switch (code) {
            case Game_BattlerBase.TRAIT_ELEMENT_RATE:
                return "Elem: " + getElementName(dataId) + " x" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_DEBUFF_RATE:
                return "Debuff: " + getParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_STATE_RATE:
                return "" + getStateName(dataId) + " x" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_STATE_RESIST:
                return useTranslation?"Resisti: ":"Resist: " + getStateName(dataId);
            case Game_BattlerBase.TRAIT_PARAM:
                return "Skill: " + getParameterName(dataId) + " x" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_XPARAM:
                // Don't show xparams with zero value
                if (value === 0) return null;
                return "Skill: " + getXParameterName(dataId) + " +" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_SPARAM:
                // Don't show sparams with zero value
                if (value === 0) return null;
                return "Skill: " + getSParameterName(dataId) + " x" + value;
            case Game_BattlerBase.TRAIT_ATTACK_Elem:
                return "Elem: " + getElementName(dataId);
            case Game_BattlerBase.TRAIT_ATTACK_STATE:
                return useTranslation?"Status ATT.":"ATK State: " + getStateName(dataId) + " " + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_ATTACK_SPEED:
                return  useTranslation?"Velocità ATT.":"ATK Speed: " + value;
            case Game_BattlerBase.TRAIT_ATTACK_TIMES:
                return  useTranslation?"ATT. Ripeti: +": "ATK Times: +" + value;
            case Game_BattlerBase.TRAIT_STYPE_ADD:
                return "Skill: " + $dataSystem.skillTypes[dataId];
            case Game_BattlerBase.TRAIT_STYPE_SEAL:
                return useTranslation?"Sigilla: ":"Seal: " + $dataSystem.skillTypes[dataId];
            case Game_BattlerBase.TRAIT_SKILL_ADD:
                return "Skill: " + getSkillName(dataId);
            case Game_BattlerBase.TRAIT_SKILL_SEAL:
                return useTranslation?"Sigilla: ":"Seal: " + getSkillName(dataId);
            case Game_BattlerBase.TRAIT_EQUIP_WTYPE:
                return "Equip: " + $dataSystem.weaponTypes[dataId];
            case Game_BattlerBase.TRAIT_EQUIP_ATYPE:
                return "Equip: " + $dataSystem.armorTypes[dataId];
            case Game_BattlerBase.TRAIT_EQUIP_LOCK:
                return useTranslation?"Blocca: ":"Lock: " + $dataSystem.equipTypes[dataId];
            case Game_BattlerBase.TRAIT_EQUIP_SEAL:
                return useTranslation?"Sigilla: ":"Seal: " + $dataSystem.equipTypes[dataId];
            case Game_BattlerBase.TRAIT_SLOT_TYPE:
                return useTranslation?"Tipo slot: ":"Slot Type: " + dataId;
            case Game_BattlerBase.TRAIT_ACTION_PLUS:
                return useTranslation?"Volte: + ":"Times: +" + Math.floor(value * 100) + "%";
            case Game_BattlerBase.TRAIT_SPECIAL_FLAG:
                return useTranslation? "Speciale: ":"Special: " + getSpecialFlagName(dataId);
            case Game_BattlerBase.TRAIT_PARTY_ABILITY:
                return "Skill: " + getPartyAbilityName(dataId);
    
            default:
                return null;
        }
    }
    
    function getStateName(stateId) {
        if (!$dataStates || !$dataStates[stateId]) return "State #" + stateId;
        return window.translateText($dataStates[stateId].name);
    }
    
    function getParameterName(paramId) {
        const useTranslation = ConfigManager.language === 'it'

        
        var params = [
            "MaxHP", "MaxMP", "STR", "CON", "INT", "WIS", "DEX", "PSI"
        ];
        if(useTranslation){
            params = [
                "MaxHP", "MaxMP", "FRZ", "COS", "INT", "SAG", "DES", "PSI"
            ];
        }
        return params[paramId] || "Param #" + paramId;
    }
    
    function getXParameterName(xparamId) {
        const useTranslation = ConfigManager.language === 'it'

        var xparams = [
            "Hit Rate", "Evasion", "Critical", "Critical Ev.",
            "Magic Ev.", "Magic Refl.", "Counter Attack", 
            "HP Reg.", "MP Reg.", "AP Reg."
        ];
        if(useTranslation){
            xparams = [
                "% Colpire", "Evasione", "Critico", "Evasione critica",
                "Evasione magica", "Riflesso", "Contrattacco", 
                "Rigenerazione HP", "Rigenerazione MP", "Rigenerazione AP"
            ];
        }
        return xparams[xparamId] || "XParam #" + xparamId;
    }
    
    function getSParameterName(sparamId) {
        const useTranslation = ConfigManager.language === 'it'

        var sparams = [
            "Target Rate", "Guard Effect", "Recovery Effect", "Pharmacology",
            "MP Cost", "AP Charge", "Physical", "Magical",
            "Floor Damage", "Experience Rate"
        ];
        if(useTranslation){
            sparams = [
                "% Target", "Guardia", "Recupero", "Farmacologia",
                "Costo MP", "Carica AP", "Danno fisico", "Danno magico",
                "Danno ambientale", "Tasso EXP"
            ];
        }
        return sparams[sparamId] || "SParam #" + sparamId;
    }
    
    function getSpecialFlagName(flagId) {
        const useTranslation = ConfigManager.language === 'it'

        var flags = ["Auto Battle", "Guard", "Substitute", "Preserve AP"];
        if(useTranslation){
            flags = ["Auto battaglia", "Guardia", "Sostituto", "Preserva AP"];
        }
        return flags[flagId] || "Flag #" + flagId;
    }
    
    function getPartyAbilityName(abilityId) {
        const useTranslation = ConfigManager.language === 'it'

        var abilities = ["Encounter Half", "Encounter None", "Cancel Surprise", 
            "Raise Preemptive", "Gold Double", "Drop Item Double"];
            if(useTranslation){
                abilities = ["Incontri dimezzati", "Nessun incontro", "No imboscate", 
               "Aumenta iniziativa", "Raddoppia euro", "Raddoppia drop oggetti"];
           }

        return abilities[abilityId] || ""
    }
    
    function getSkillName(skillId) {
        if (!$dataSkills || !$dataSkills[skillId]) return "Skill #" + skillId;
        return $dataSkills[skillId].name;
    }
    
    //=============================================================================
    // Create our modified Window_ShopStatus that acts as a bridge
    //=============================================================================
    
    const _Window_ShopStatus_initialize = Window_ShopStatus.prototype.initialize;
    Window_ShopStatus.prototype.initialize = function(rect) {
        _Window_ShopStatus_initialize.call(this, rect);
        this._detailWindow = null;
    };
    
    Window_ShopStatus.prototype.setDetailWindow = function(detailWindow) {
        this._detailWindow = detailWindow;
    };
    
    const _Window_ShopStatus_setItem = Window_ShopStatus.prototype.setItem;
    Window_ShopStatus.prototype.setItem = function(item) {
        _Window_ShopStatus_setItem.call(this, item);
        if (this._detailWindow) {
            this._detailWindow.setItem(item);
        }
    };
    
    // Make the status window invisible
    const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
    Window_ShopStatus.prototype.refresh = function() {
        this.contents.clear();
        this.hideBackgroundDimmer();
        this.hide();
    };
    
    //=============================================================================
    // Modify Scene_Shop to add our detail window
    //=============================================================================
    
    const _Scene_Shop_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function() {
        _Scene_Shop_create.call(this);
        this.createItemDetailWindow();
    };
    
    Scene_Shop.prototype.createItemDetailWindow = function() {
        const rect = this.statusWindowRect();
        this._itemDetailWindow = new Window_ShopItemDetail(rect);
        this.addWindow(this._itemDetailWindow);
        
        // Connect status and detail windows
        this._statusWindow.setDetailWindow(this._itemDetailWindow);
    };
    
    //=============================================================================
    // Modify Window_ShopBuy to work with our detail window
    //=============================================================================
    
    const _Window_ShopBuy_updateHelp = Window_ShopBuy.prototype.updateHelp;
    Window_ShopBuy.prototype.updateHelp = function() {
        _Window_ShopBuy_updateHelp.call(this);
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    };
    
    //=============================================================================
    // Modify Window_ShopSell to also work with our detail window
    //=============================================================================
    
    const _Window_ShopSell_updateHelp = Window_ShopSell.prototype.updateHelp;
    Window_ShopSell.prototype.updateHelp = function() {
        _Window_ShopSell_updateHelp.call(this);
        if (SceneManager._scene._statusWindow) {
            SceneManager._scene._statusWindow.setItem(this.item());
        }
    };

    //=============================================================================
    // Fix for the Sell window to display items in a single column list
    //=============================================================================
    
    // Override the maxCols method to ensure items are displayed in a single column
    const _Window_ShopSell_maxCols = Window_ShopSell.prototype.maxCols;
    Window_ShopSell.prototype.maxCols = function() {
        return 1; // Force single column display
    };
    
    // Override the item height to ensure proper spacing
    const _Window_ShopSell_itemHeight = Window_ShopSell.prototype.itemHeight;
    Window_ShopSell.prototype.itemHeight = function() {
        return this.lineHeight(); // Use standard line height for consistent spacing
    };
    
    // Override the draw item method to properly format each entry
    // Example for sell window override to include price & weight
    const _Window_ShopSell_drawItem = Window_ShopSell.prototype.drawItem;
    Window_ShopSell.prototype.drawItem = function(index) {
        const item = this._data[index];
        if (!item) return;
        const rect = this.itemLineRect(index);
        const x = rect.x + this.textPadding();
        const y = rect.y;
        const width = rect.width - this.textPadding() * 2;
        const priceY = y;

        // Draw name and count
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, x, y, width - 60);
        this.resetPaintOpacity();

        // Draw price
        if (this._price) {
            const price = this._price(item);
            const priceText = price + " G";
            const priceWidth = this.textWidth(priceText);
            this.drawText(priceText, x + width - priceWidth, priceY, priceWidth, 'right');
        }
        
        // Draw weight under price (from <weight:###> meta tag, expressed in grams)
        if (item.meta.weight) {
            const grams = parseFloat(item.meta.weight);
            if (!isNaN(grams)) {
                let weightStr;
                if (grams >= 1000) {
                    weightStr = (grams / 1000).toFixed(2) + " kg";
                } else {
                    weightStr = grams + " g";
                }
                const weightY = y + this.lineHeight();
                const weightWidth = this.textWidth(weightStr);
                this.drawText(weightStr, x + width - weightWidth, weightY, weightWidth, 'right');
            }
        }
        
        this.changePaintOpacity(true);
    };
    
    // Override the window sizing if needed to ensure it fits better
    // Override window sizing if needed
    const _Scene_Shop_sellWindowRect = Scene_Shop.prototype.sellWindowRect;
    Scene_Shop.prototype.sellWindowRect = function() {
        const rect = _Scene_Shop_sellWindowRect.call(this);
        // Adjust rect.height here if weight line needs more space
        return rect;
    };
})();