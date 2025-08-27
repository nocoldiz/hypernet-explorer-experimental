/*:
 * @plugindesc Displays the median level of map encounters in the map name display.
 * @author Gemini
 * @version 1.0.0
 * @target MZ
 * @help
 * ============================================================================
 * Gemini - Map Level Display
 * ============================================================================
 *
 * This plugin automatically displays a median level for the current map
 * based on the random encounters defined for it.
 *
 * When the player enters a map, the plugin will calculate the median level
 * of all troop encounters and display it next to the map's name,
 * for example: "Whispering Woods Lv. 15".
 *
 * --- How to Set Up Troop Levels ---
 *
 * To set a level for a troop, you must follow a specific rule:
 *
 * 1. For a given Troop ID (e.g., Troop #5 in the database), you must define
 * its level in the note box of the ENEMY with the SAME ID (e.g., Enemy #5).
 *
 * 2. The format in the enemy's note box must be:
 * LV: XX
 * (Where XX is the level number)
 *
 * For example, in the note box for Enemy #5:
 * LV: 17
 * or
 * LV: 17 | Some description
 *
 * The plugin will read this number. If a troop encounter on the map
 * (e.g., Troop #5) does not have a corresponding enemy with the same ID
 * (Enemy #5) or that enemy does not have a valid LV: tag, it will be
 * ignored in the median calculation.
 *
 * If no valid troop levels can be found for a map, no level will be
 * displayed.
 *
 */

(() => {
    'use strict';

    // Alias Game_Map.setup to calculate the median level on map load.
    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        this.calculateMedianEncounterLevel();
    };

    // Add a new method to Game_Map to perform the calculation.
    Game_Map.prototype.calculateMedianEncounterLevel = function() {
        this._medianEncounterLevel = null;
        const encounterList = this.encounterList();
        if (!encounterList || encounterList.length === 0) {
            return;
        }

        const troopLevels = [];
        const levelRegex = /LV:\s*(\d+)/i;

        // Use a Set to only process unique troop IDs, as the median should be
        // based on the variety of troops, not encounter frequency.
        const uniqueTroopIds = new Set(encounterList.map(encounter => encounter.troopId));

        for (const troopId of uniqueTroopIds) {
            // Per the request, check the enemy with the same ID as the troop.
            const enemy = $dataEnemies[troopId];
            if (enemy && enemy.note) {
                const match = enemy.note.match(levelRegex);
                if (match && match[1]) {
                    troopLevels.push(parseInt(match[1], 10));
                }
            }
        }

        if (troopLevels.length > 0) {
            troopLevels.sort((a, b) => a - b);
            const mid = Math.floor(troopLevels.length / 2);
            let median;
            if (troopLevels.length % 2 === 0) {
                // Even number of levels: average the two middle ones and round.
                median = Math.round((troopLevels[mid - 1] + troopLevels[mid]) / 2);
            } else {
                // Odd number of levels: take the middle one.
                median = troopLevels[mid];
            }
            this._medianEncounterLevel = median;
        }
    };

    // Alias Game_Map.displayName to append the calculated level.
    const _Game_Map_displayName = Game_Map.prototype.displayName;
    Game_Map.prototype.displayName = function() {
        const originalName = _Game_Map_displayName.call(this);
        // Check if the map has a display name and a median level was calculated.
        if (originalName && this._medianEncounterLevel !== null) {
            return `${originalName} Lv. ${this._medianEncounterLevel}`;
        }
        return originalName;
    };

})();