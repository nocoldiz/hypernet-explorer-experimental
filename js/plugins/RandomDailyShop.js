/*:
 * @target MZ
 * @plugindesc Opens a shop with 10 random items that change daily based on real-world date.
 * @author ChatGPT
 *
 * @command OpenDailyShop
 * @text Open Daily Shop
 * @desc Opens the randomized shop based on real-world date.
 */

(() => {
    const pluginName = "RandomDailyShop";
  
    // Utility to get real-world date string (YYYY-MM-DD)
    function getCurrentDateKey() {
      const now = new Date();
      return now.toISOString().split("T")[0]; // e.g., "2025-05-26"
    }
  
    // Randomly select 10 items from the database
    function getDailyItems() {
      const allItems = [];
  
      // Collect all valid item entries
      for (let i = 1; i < $dataItems.length; i++) {
        const item = $dataItems[i];
        if (item && item.name) allItems.push(item);
      }
      for (let i = 1; i < $dataWeapons.length; i++) {
        const weapon = $dataWeapons[i];
        if (weapon && weapon.name) allItems.push(weapon);
      }
      for (let i = 1; i < $dataArmors.length; i++) {
        const armor = $dataArmors[i];
        if (armor && armor.name) allItems.push(armor);
      }
  
      // Shuffle and pick 10
      const shuffled = allItems.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 10);
    }
  
    // Store the shop inventory in a global map by date
    const dailyInventoryCache = {};
  
    function getShopItemsForToday() {
      const dateKey = getCurrentDateKey();
      if (!dailyInventoryCache[dateKey]) {
        dailyInventoryCache[dateKey] = getDailyItems();
      }
      return dailyInventoryCache[dateKey];
    }
  
    // Open the shop with today's random inventory
    function openDailyShop() {
      const goods = getShopItemsForToday().map(item => {
        let type;
        if (DataManager.isItem(item)) type = 0;
        else if (DataManager.isWeapon(item)) type = 1;
        else if (DataManager.isArmor(item)) type = 2;
        else return null;
        return [type, item.id, 0, 0];
      }).filter(Boolean);
      SceneManager.push(Scene_Shop);
      SceneManager.prepareNextScene(goods, false);
    }
  
    // Plugin command registration
    PluginManager.registerCommand(pluginName, "OpenDailyShop", () => {
      openDailyShop();
    });
  
    // Optional: script call for events
    window.openRandomDailyShop = openDailyShop;
  
  })();
  