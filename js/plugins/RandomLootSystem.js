/*:
 * @plugindesc v1.0 Random Loot System - Adds random loot functionality with rarity tiers.
 * @author Claude
 * @target MZ MV
 * @filename RandomLootSystem.js
 * @orderAfter PluginManager
 *
 * @command getItem
 * @text Get Random Item
 * @desc Adds a random item to the player's inventory.
 *
 * @command getArmor
 * @text Get Random Armor
 * @desc Adds a random armor to the player's inventory.
 *
 * @command getWeapon
 * @text Get Random Weapon
 * @desc Adds a random weapon to the player's inventory.
 *
 * @help
 * This plugin adds commands to randomly generate loot with rarity tiers.
 * 
 * Plugin Commands (MV Style):
 *   getItem                # Get a random item
 *   getArmor               # Get a random armor
 *   getWeapon              # Get a random weapon
 * 
 * The plugin uses game variable 2 (0-100) to influence loot rarity:
 * - Higher values make rare items more common
 * 
 * Rarity Tiers (based on item price):
 * - Common (White): 0-100 gold
 * - Uncommon (Green): 101-500 gold
 * - Rare (Blue): 501-2000 gold
 * - Epic (Purple): 2001-10000 gold
 * - Legendary (Orange): 10001+ gold
 * 
 * The message color will match the rarity tier.
 */

(function() {
    
    // Define rarity tiers and their colors
    const RARITY_TIERS = [
        { name: "Common", colorCode: "#FFFFFF", minPrice: 0, maxPrice: 999 },
        { name: "Uncommon", colorCode: "#1AFF1A", minPrice: 1000, maxPrice: 9999 },
        { name: "Rare", colorCode: "#0080FF", minPrice: 10000, maxPrice: 99999 },
        { name: "Epic", colorCode: "#8000FF", minPrice: 100000, maxPrice: 999999 },
        { name: "Legendary", colorCode: "#FF8000", minPrice: 1000000, maxPrice: Infinity }
    ];
    
    // The variable ID that controls rarity chances (0-100)
    const RARITY_VARIABLE_ID = 2;
    
    // Calculate the rarity tier based on item price
    function getItemRarityTier(price) {
        for (let tier of RARITY_TIERS) {
            if (price >= tier.minPrice && price <= tier.maxPrice) {
                return tier;
            }
        }
        return RARITY_TIERS[0]; // Default to Common if something goes wrong
    }
    
    // Get random item based on rarity influence
    function getRandomItem(itemList) {
        if (!itemList || itemList.length === 0) return null;
        
        // Filter out null items
        const validItems = itemList.filter(item => item);
        if (validItems.length === 0) return null;
        
        // Get rarity influence (0-100)
        const rarityInfluence = $gameVariables.value(RARITY_VARIABLE_ID);
        
        // Calculate weighted probability for each item based on price and rarity influence
        let weightedItems = [];
        let totalWeight = 0;
        
        for (let item of validItems) {
            // Skip items with price of 0 (usually key items)
            if (item.price === 0) continue;
            
            // Calculate weight: Items with higher price are more likely at higher rarity influence
            let weight;
            if (rarityInfluence < 50) {
                // Below 50, favor common items
                weight = Math.max(1, 1000 - item.price) * (1 + (50 - rarityInfluence) / 50);
            } else {
                // Above 50, favor rare items
                weight = Math.max(1, item.price / 10) * (1 + (rarityInfluence - 50) / 50);
            }
            
            weightedItems.push({
                item: item,
                weight: weight
            });
            
            totalWeight += weight;
        }
        
        // If no valid weighted items, return random item
        if (weightedItems.length === 0 || totalWeight === 0) {
            return validItems[Math.floor(Math.random() * validItems.length)];
        }
        
        // Select random item based on weight
        let random = Math.random() * totalWeight;
        let currentWeight = 0;
        
        for (let weightedItem of weightedItems) {
            currentWeight += weightedItem.weight;
            if (random <= currentWeight) {
                return weightedItem.item;
            }
        }
        
        // Fallback
        return validItems[Math.floor(Math.random() * validItems.length)];
    }
    
    // Create the notification window
    function showLootMessage(item) {
        if (!item) return;
        window.skipLocalization = true
        const rarityTier = getItemRarityTier(item.price);
        const colorCode = rarityTier.colorCode;
        const message = ConfigManager.language === 'it'? `\\c[0]Hai trovato \\c[${colorToCode(colorCode)}]${ window.translateText(item.name)}` :`\\c[0]You found \\c[${colorToCode(colorCode)}]${item.name}`;
        
        $gameMessage.add(message);
        window.skipLocalization = false

    }
    
    // Convert hex color to RPG Maker color code
    // This is approximate since RPG Maker has limited color codes
    function colorToCode(hexColor) {
        // Default color mappings for RPG Maker
        const colorMap = {
            "#FFFFFF": 0, // White
            "#1AFF1A": 3, // Green
            "#0080FF": 4, // Blue
            "#8000FF": 10, // Purple
            "#FF8000": 6  // Orange
        };
        
        return colorMap[hexColor] || 0;
    }
    
    // Extend the plugin command interpreter
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        
        switch (command.toLowerCase()) {
            case 'getitem':
                const randomItem = getRandomItem($dataItems);
                if (randomItem) {
                    $gameParty.gainItem(randomItem, 1);
                    showLootMessage(randomItem);
                }
                break;
                
            case 'getarmor':
                const randomArmor = getRandomItem($dataArmors);
                if (randomArmor) {
                    $gameParty.gainItem(randomArmor, 1);
                    showLootMessage(randomArmor);
                }
                break;
                
            case 'getweapon':
                const randomWeapon = getRandomItem($dataWeapons);
                if (randomWeapon) {
                    $gameParty.gainItem(randomWeapon, 1);
                    showLootMessage(randomWeapon);
                }
                break;
        }
    };
    
    // Register plugin commands for MZ
    if (Utils.RPGMAKER_NAME === "MZ") {
        PluginManager.registerCommand("RandomLootSystem", "getItem", args => {
            const randomItem = getRandomItem($dataItems);
            if (randomItem) {
                $gameParty.gainItem(randomItem, 1);
                showLootMessage(randomItem);
            }
        });
        
        PluginManager.registerCommand("RandomLootSystem", "getArmor", args => {
            const randomArmor = getRandomItem($dataArmors);
            if (randomArmor) {
                $gameParty.gainItem(randomArmor, 1);
                showLootMessage(randomArmor);
            }
        });
        
        PluginManager.registerCommand("RandomLootSystem", "getWeapon", args => {
            const randomWeapon = getRandomItem($dataWeapons);
            if (randomWeapon) {
                $gameParty.gainItem(randomWeapon, 1);
                showLootMessage(randomWeapon);
            }
        });
    }
})();