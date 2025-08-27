// ============================================================================
// Battle System Enhanced
// For RPG Maker MZ
// ============================================================================

/*:
 * @target MZ
 * @plugindesc Combines persistent battles, respawn, and a dynamic event-based encounter system.
 * @author Combined by Claude, modified by Gemini
 * @pluginName BattleSystemEnhanced
 *
 * @param respawnMapVar
 * @text Respawn Map Variable ID
 * @desc Game variable ID to store respawn map ID
 * @type variable
 * @default 1
 *
 * @param respawnXVar
 * @text Respawn X Variable ID
 * @desc Game variable ID to store respawn X coordinate
 * @type variable
 * @default 2
 *
 * @param respawnYVar
 * @text Respawn Y Variable ID
 * @desc Game variable ID to store respawn Y coordinate
 * @type variable
 * @default 3
 *
 * @command startBattle
 * @text Start Event Battle
 * @desc Start a battle with the event's fixed troop and maintain HP state
 *
 * @arg eventId
 * @text Event ID
 * @desc The ID of the event to battle with (use 0 for event running this command)
 * @type number
 * @default 0
 *
 * @command setRespawnPoint
 * @text Set Respawn Point
 * @desc Set the map ID and coordinates where the player will respawn
 *
 * @arg mapId
 * @text Map ID
 * @desc The ID of the map to respawn on
 * @type number
 * @default 1
 *
 * @arg x
 * @text X Coordinate
 * @desc The X coordinate to respawn at
 * @type number
 * @default 19
 *
 * @arg y
 * @text Y Coordinate
 * @desc The Y coordinate to respawn at
 * @type number
 * @default 13
 *
 * @command restore
 * @text Restore Inventory
 * @desc Restores the player's gold and inventory from their last death point and removes the gravestone data.
 *
 * @help
 * This plugin combines several features into one system.
 *
 * NEW ENCOUNTER SYSTEM:
 * - Disables default random encounters.
 * - Instead, finds all events named "Enemy" on the map.
 * - Assigns a troop to each "Enemy" event from the map's encounter list.
 * - This assignment is based on the event's regionId and the troop's weight.
 * - The event's sprite is automatically updated to match the first enemy in the troop.
 * (Requires <Char:SpriteName> notetag in the enemy's notes).
 * - Spawns are refreshed when the player changes maps.
 *
 * BATTLE & RESPAWN FEATURES:
 * 1. Maintains enemy HP between battles if player escapes.
 * 2. Hides battle messages (battle start, escape, victory).
 * 3. Shows a reward popup after battle instead of victory messages.
 * 4. Deletes the calling event if player wins the battle.
 * 5. Temporarily stops event movement for 60 frames if player flees.
 * 6. When actor 1 dies, ends battle, cures them, and respawns the player.
 * 7. When other actors die, they are removed from the party after battle.
 * 8. Health Protection: Each actor gets one-time protection per battle that prevents
 *    death on first lethal hit, keeping them at 1 HP instead.
 *
 * GRAVESTONE & RESTORE FEATURE:
 * - If the player dies while Switch 9 is ON:
 * - The player's current Map ID, X, and Y coordinates are saved.
 * - All of the player's gold and unequipped items are saved.
 * - The party loses all gold and unequipped items. Equipped items are lost.
 * - Each time the player dies, the previous gravestone data is overwritten.
 * - If the player enters the map where they last died, an event named "Gravestone"
 * on that map will be moved to the death coordinates. If no such event
 * exists, nothing happens.
 * - Use the "Restore" plugin command to get back the saved gold and items. This
 * also clears the saved data, so the gravestone will no longer appear unless
 * the player dies again.
 *
 * Usage:
 * 1. To use the new encounter system, create events and name them "Enemy".
 * 2. Set up your map's encounter list with troops, weights, and region IDs.
 * 3. In the Enemies database, add a note tag like: <Char:YourSprite>
 * This will make events use img/characters/Monsters/YourSprite.png
 * 4. Use the "Start Event Battle" command to initiate combat with these events.
 *
 * Terms of Use:
 * Free for use in both commercial and non-commercial projects.
 */

(() => {
    const pluginName = "BattleSystemEnhanced";
    
    // Get plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    const respawnMapVar = Number(parameters['respawnMapVar'] || 1);
    const respawnXVar = Number(parameters['respawnXVar'] || 2);
    const respawnYVar = Number(parameters['respawnYVar'] || 3);
    let _lastSpawnedMapId = null; // Changed from _lastShuffledMapId
    let _battleCooldownTimer = 0;
    const BATTLE_COOLDOWN_FRAMES = 120; // 2 seconds at 60fps
    //=============================================================================
    // Persistent Battle System - Core Variables
    //=============================================================================
    
    const _persistentEnemyData = {};
    let _currentBattleEventId = null;
    let _currentEventId = null;
    let _currentMapId = null;
    let _battleRewards = { exp: 0, gold: 0, items: [] };
    let _needsRespawn = false;
    const _enemyCharSprites = {};
    
    //=============================================================================
    // NEW: Health Protection System
    //=============================================================================
    
    // Track which actors have used their protection this battle
    let _healthProtectionUsed = {};
    
    /**
     * Resets health protection for all actors at battle start
     */
    function resetHealthProtection() {
        _healthProtectionUsed = {};
        $gameParty.members().forEach((actor, index) => {
            _healthProtectionUsed[actor.actorId()] = false;
        });
    }
    
    /**
     * Checks if actor has health protection available
     */
    function hasHealthProtection(actorId) {
        return !_healthProtectionUsed[actorId];
    }
    
    /**
     * Uses health protection for an actor
     */
    function useHealthProtection(actorId) {
        _healthProtectionUsed[actorId] = true;
    }
    
    /**
     * Shows health protection message
     */
    function showHealthProtectionMessage(actorName) {
        const protectionMessages = [
            " narrowly avoided death!",
            " was saved by divine intervention!",
            " clung to life with determination!",
            " refused to give up!",
            " survived through sheer willpower!",
            " was protected by fate!"
        ];
        
        const message = actorName + protectionMessages[Math.floor(Math.random() * protectionMessages.length)];
        $gameMessage.add(message);
    }

    // Add this function near the top of the plugin, after the helper functions

/**
 * Shows a warning dialogue if the enemy is too dangerous for the party
 */
function checkAndShowDangerousEnemyWarning() {
    if (!$gameTroop || !$gameTroop.members().length) return;
    
    const party = $gameParty.members();
    if (!party.length) return;
    
    // Get median party level
    const partyMedian = getMedianLevel(party);
    
    // Get highest enemy level in the troop
    const highestEnemyLevel = Math.max(...$gameTroop.members().map(enemy => {
        const enemyData = $dataEnemies[enemy.enemyId()];
        return enemyData ? getEnemyLevel(enemyData.note) : 0;
    }));
    
    // Check if enemy is more than 20 levels above party median
    if (highestEnemyLevel > partyMedian + 20) {
        showDangerWarning(party);
    }
}

/**
 * Shows the actual warning message
 */
/**
 * Shows the actual warning message
 */
function showDangerWarning(party) {
    const useTranslation = ConfigManager.language === 'it';
    
    const warningMessages = [
        "This enemy is too dangerous! We should flee!",
        "This enemy is too powerful! We need to run!",
        "We're outmatched! We should retreat!",
        "This foe is beyond us! We must escape!",
        "We can't handle this enemy! Let's get out of here!",
        "This creature is too strong! We should run away!"
    ];
   
    const singleMessages = [
        "This enemy is too dangerous! I should flee!",
        "This enemy is too powerful! I need to run!",
        "I'm outmatched! I should retreat!",
        "This foe is beyond me! I must escape!",
        "I can't handle this enemy! I need to get out of here!",
        "This creature is too strong! I should run away!"
    ];
    
    const warningMessagesIT = [
        "Questo nemico è troppo pericoloso! Dovremmo fuggire!",
        "Questo nemico è troppo potente! Dobbiamo scappare!",
        "Siamo in svantaggio! Dovremmo ritirarci!",
        "Questo nemico è oltre le nostre capacità! Dobbiamo scappare!",
        "Non possiamo affrontare questo nemico! Andiamocene da qui!",
        "Questa creatura è troppo forte! Dovremmo scappare!"
    ];
   
    const singleMessagesIT = [
        "Questo nemico è troppo pericoloso! Dovrei fuggire!",
        "Questo nemico è troppo potente! Devo scappare!",
        "Sono in svantaggio! Dovrei ritirarmi!",
        "Questo nemico è oltre le mie capacità! Devo scappare!",
        "Non posso affrontare questo nemico! Devo andarmene da qui!",
        "Questa creatura è troppo forte! Dovrei scappare!"
    ];
   
    let message;
   
    if (party.length === 1) {
        // Single party member
        const messages = useTranslation ? singleMessagesIT : singleMessages;
        message = messages[Math.floor(Math.random() * messages.length)];
        message = party[0].name() + ": " + message;
    } else {
        // Multiple party members - pick random one
        const randomMember = party[Math.floor(Math.random() * party.length)];
        const messages = useTranslation ? warningMessagesIT : warningMessages;
        message = messages[Math.floor(Math.random() * messages.length)];
        message = randomMember.name() + ": " + message;
    }
   
    // Check if switch 45 is on - if so, show at top of screen
    if ($gameSwitches.value(45)) {
        // Show message at top of screen using a picture or custom window
        showTopScreenMessage(message);
    } else {
        // Use standard message window
        $gameMessage.add(message);
    }
}
/**
 * Shows a message at the top of the screen
 */
function showTopScreenMessage(message) {
    // Create a temporary window at the top of the screen
    if (SceneManager._scene && SceneManager._scene.constructor === Scene_Battle) {
        // We're in battle scene
        const scene = SceneManager._scene;
        
        // Create a custom window for top screen message
        if (!scene._topWarningWindow) {
            scene._topWarningWindow = new Window_TopWarning();
            scene.addWindow(scene._topWarningWindow);
        }
        
        scene._topWarningWindow.showMessage(message);
    }
}


//=============================================================================
// Window_TopWarning - Custom window for top screen messages
//=============================================================================
function Window_TopWarning() {
    this.initialize(...arguments);
}

Window_TopWarning.prototype = Object.create(Window_Base.prototype);
Window_TopWarning.prototype.constructor = Window_TopWarning;

Window_TopWarning.prototype.initialize = function() {
    const width = Graphics.boxWidth;
    const height = this.fittingHeight(2); // 2 lines height
    const x = 0;
    const y = 0; // Top of screen
    Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
    this.openness = 0;
    this._displayTimer = 0;
    this._message = "";
};

Window_TopWarning.prototype.showMessage = function(message) {
    this._message = message;
    this._displayTimer = 180; // Show for 3 seconds (60fps * 3)
    this.refresh();
    this.open();
};

Window_TopWarning.prototype.refresh = function() {
    this.contents.clear();
    if (this._message) {
        // Set text color to red for warning
        this.changeTextColor(ColorManager.textColor(2)); // Red color
        this.drawText(this._message, 0, 0, this.contentsWidth(), 'center');
        this.resetTextColor();
    }
};

Window_TopWarning.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    
    if (this._displayTimer > 0) {
        this._displayTimer--;
        if (this._displayTimer <= 0) {
            this.close();
        }
    }
};

    //=============================================================================
    // NEW: Gravestone System Helper Function
    //=============================================================================
    function saveDeathData() {
        if ($gameSwitches.value(9)) {
            const savedData = {
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                gold: $gameParty.gold(),
                items: {}
            };

            // Save and then remove standard items
            $gameParty.items().forEach(item => {
                const count = $gameParty.numItems(item);
                savedData.items['i' + item.id] = count;
                $gameParty.loseItem(item, count, false);
            });

            // Save and then remove unequipped weapons
            $gameParty.weapons().forEach(weapon => {
                const isEquipped = $gameParty.members().some(actor => actor.isEquipped(weapon));
                if (!isEquipped) {
                    const count = $gameParty.numItems(weapon);
                    savedData.items['w' + weapon.id] = count;
                    $gameParty.loseItem(weapon, count, false);
                }
            });

            // Save and then remove unequipped armors
            $gameParty.armors().forEach(armor => {
                const isEquipped = $gameParty.members().some(actor => actor.isEquipped(armor));
                if (!isEquipped) {
                    const count = $gameParty.numItems(armor);
                    savedData.items['a' + armor.id] = count;
                    $gameParty.loseItem(armor, count, false);
                }
            });

            $gameParty.loseGold($gameParty.gold());
            $gameSystem.setDeathData(savedData);
        }
    }

    //=============================================================================
    // NEW: Encounter System Override
    //=============================================================================

    /**
     * Disables the default random encounter check. Encounters are now handled
     * by events named "Enemy" on the map.
     */
    Game_Player.prototype.executeEncounter = function() {
        // Do nothing. This prevents random encounters from triggering.
        return false;
    };
    // ——— Helper to pull the "LV: XX" out of an enemy's note ———
function getEnemyLevel(note) {
    const m = note.match(/LV:\s*(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }
  
  function getMedianLevel(party) {
    const levels = party.map(m => m.level).sort((a, b) => a - b);
    const mid = Math.floor(levels.length / 2);
    return levels.length % 2
      ? levels[mid]
      : (levels[mid - 1] + levels[mid]) / 2;
  }
  
  /** * Fills the `troops` array with up to 4 troop‐IDs whose 
   * highest enemy‐level is ≤ medianPartyLevel + 20 
   */
  function ensureTroops(troops, party, dataEnemies) {
    const median = getMedianLevel(party);
    const cap = median + 10;
    // find all troop IDs in $dataTroops whose first member's level ≤ cap
    const pool = $dataTroops
      .slice(1)
      .map((t, i) => ({ troop: t, id: i + 1 }))
      .filter(x => {
        // pick the highest‐level member in that troop
        const maxLv = Math.max(...x.troop.members.map(m => getEnemyLevel(dataEnemies[m.enemyId].note)));
        return maxLv <= cap;
      });
    if (!pool.length) throw new Error(`No troops ≤ level ${cap}`);
    // shuffle & take 4
    pool.sort(() => Math.random() - 0.5).slice(0, 4)
        .forEach(x => troops.push(x.id));
  }
  function getEnemyArchetype(enemyData) {
    if (!enemyData || !enemyData.note) return null;
    const archetypeMatch = enemyData.note.match(/<Archetype:\s*(.+?)>/i);
    return archetypeMatch ? archetypeMatch[1].trim() : null;
}

// Helper function to get required region for archetype
function getRequiredRegionForArchetype(archetype) {
    if (!archetype) return null;
    
    const archetypeRegionMap = {
        'Octopus': 3,
        'AquaticFish': 3,
        'SeaCreature': 3,
        'DeepSea': 3,
        'Coral': 3,
        'Whale': 3,
        'Shark': 3,
        'Jellyfish': 3,
        'Crab': 3,
        'Lobster': 3,
        'Seahorse': 3,
        'Starfish': 3,
        'Eel': 3,
        'Dolphin': 3,
        'Turtle': 3,
        'Manta': 3,
        'Squid': 3,
        'Kraken': 3,
        'Leviathan': 3,
        'Merfolk': 3,
        'Siren': 3,
        'Naga': 3,
        'WaterElemental': 3,
        'IceElemental': 3,
        'Frost': 3,
        'Penguin': 3,
        'Seal': 3,
        'Walrus': 3,
        'PolarBear': 3,
        'Yeti': 3,
        'IceWyrm': 3,
        'FrostGiant': 3,
        'Blizzard': 3,
        'Snowman': 3,
        'IceTroll': 3,
        'FrozenUndead': 3,
        'Glacier': 3,
        'AuroraSpirit': 3
    };
    
    return archetypeRegionMap[archetype] || null;
}

// Helper function to check if troop can spawn in region
function canTroopSpawnInRegion(troopId, regionId) {
    const troop = $dataTroops[troopId];
    if (!troop || !troop.members.length) return true; // Default to allowing spawn
    
    // Get the first enemy in the troop
    const firstMember = troop.members[0];
    if (!firstMember) return true;
    
    const enemyData = $dataEnemies[firstMember.enemyId];
    if (!enemyData) return true;
    
    const archetype = getEnemyArchetype(enemyData);
    if (!archetype) return true; // No archetype restriction
    
    const requiredRegion = getRequiredRegionForArchetype(archetype);
    if (requiredRegion === null) return true; // No region restriction for this archetype
    
    return regionId === requiredRegion;
}
    /**
     * Spawns enemies by assigning troops to events named "Enemy" based on the
     * map's encounter list, region, and weight.
     */
// Replace the existing spawnEnemiesFromEncounters method with this updated version
Scene_Map.prototype.spawnEnemiesFromEncounters = function() {
    let encounterList = $gameMap.encounterList();
    if (!encounterList || !encounterList.length) {
        // **INSERT FALLBACK HERE**
        const fallbackIds = [];
        const party = $gameParty.members();
        ensureTroops(fallbackIds, party, $dataEnemies);
        // turn them into the same shape as a normal encounterList:
        encounterList = fallbackIds.map(id => ({ troopId: id, weight: 1 }));
    }
    const enemyEvents = $gameMap.events().filter(ev => ev.event().name === "Enemy");
    if (!enemyEvents.length) return;

    // --- Find locations of critical events to avoid ---
    const criticalEventLocations = $gameMap.events()
        .filter(ev => ev.event().name === "Transfer" || ev.event().name === "Door")
        .map(ev => ({ x: ev.x, y: ev.y }));
    const exclusionRadius = 3; // Don't spawn within 3 tiles of a critical event

    // ---- UPDATED: scan for passable tiles, excluding specified regions and tilesets ----
    const spawnTiles = [];
    const w = $gameMap.width(), h = $gameMap.height();
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            // Skip region ID 10
            if ($gameMap.regionId(x, y) === 10) continue;

            // --- Check distance from critical events ---
            let tooClose = false;
            for (const loc of criticalEventLocations) {
                const distance = Math.sqrt(Math.pow(x - loc.x, 2) + Math.pow(y - loc.y, 2));
                if (distance <= exclusionRadius) {
                    tooClose = true;
                    break;
                }
            }
            if (tooClose) continue; // Skip this tile if it's too close

            // Check if tile is passable and terrain tag is not 4
            if (!$gameMap.isPassable(x, y, 2) || $gameMap.terrainTag(x, y) === 4) continue;

            // Check all layers for tiles
            let hasValidTile = false;
            let hasA3orA4Tile = false;

            for (let z = 0; z < 6; z++) { // Check all layers (0-5)
                const tileId = $gameMap.tileId(x, y, z);
                if (tileId > 0) {
                    // Check if this is an A3 or A4 tileset tile
                    // A3 tiles: 2048-4095, A4 tiles: 4096-5119
                    if ((tileId >= 2048 && tileId < 4096) || (tileId >= 4096 && tileId < 5120)) {
                        hasA3orA4Tile = true;
                        break;
                    }
                    // A1 tiles: 1536-2047, A2 tiles: 2816-4095, A5 tiles: 1536-1791
                    // Note: A2 overlaps with A3 range, need to be more specific
                    if ((tileId >= 1536 && tileId < 2048) || // A1 and A5 range
                        (tileId >= 2816 && tileId < 4096)) {   // A2 range
                        hasValidTile = true;
                    }
                }
            }

            // Only add if has valid tiles, no A3/A4 tiles, and no other event
            if (hasValidTile && !hasA3orA4Tile &&
                !$gameMap.events().some(ev => ev.x === x && ev.y === y)) {
                // NEW: Store region ID with spawn tile for archetype filtering
                spawnTiles.push({ x, y, regionId: $gameMap.regionId(x, y) });
            }
        }
    }

    // weighted-random helper (unchanged)
    const selectWeightedRandom = list => {
        const total = list.reduce((sum, it) => sum + it.weight, 0);
        let rnd = Math.random() * total;
        for (const it of list) {
            rnd -= it.weight;
            if (rnd <= 0) return it;
        }
        return list[0];
    };

    // relocate each Enemy, then assign its troop
    for (const ev of enemyEvents) {
        if (spawnTiles.length) {
            const idx = Math.floor(Math.random() * spawnTiles.length);
            const loc = spawnTiles.splice(idx, 1)[0];
            ev.locate(loc.x, loc.y);
            
            // NEW: Filter encounters by archetype compatibility with current region
            const currentRegion = loc.regionId;
            const validTroops = encounterList.filter(encounter => 
                canTroopSpawnInRegion(encounter.troopId, currentRegion)
            );
            
            if (validTroops.length) {
                const chosen = selectWeightedRandom(validTroops);
                ev._fixedTroopId = chosen.troopId;
                const troop = $dataTroops[chosen.troopId];
                if (troop && troop.members.length > 0) {
                    const firstEnemy = $dataEnemies[troop.members[0].enemyId];
                    if (firstEnemy && firstEnemy.note) {
                        const note = firstEnemy.note;

                        // Speed: 1-6
                        const speedMatch = note.match(/<Speed:\s*([1-6])>/i);
                        if (speedMatch) {
                            ev.setMoveSpeed(Number(speedMatch[1]));
                        }

                        // Movement: Approach | Random | Fixed | Fleeing
                        const moveMatch = note.match(/<Movement:\s*(Approach|Random|Fixed|Fleeing)>/i);
                        if (moveMatch) {
                            const type = moveMatch[1].toLowerCase();
                            // RPG Maker MV/MZ internals: 0=fixed, 1=random, 2=approach, 3=custom
                            if (type === 'fixed')    ev._moveType = 0;
                            else if (type === 'random') ev._moveType = 1;
                            else if (type === 'approach') ev._moveType = 2;
                            else if (type === 'fleeing') {
                                //ev._moveType = 3; // Custom movement
                                //ev.setupFleeingMovement();
                            }
                        }
                    }
                }
                ev.updateCharacterSprite();
                ev.setOpacity(255);
                ev.setThrough(false);
            } else {
                // No valid troops for this region, erase the event
                ev.erase();
            }
        } else {
            ev.erase();
        }
    }
};
// Replace the existing spawnEnemiesFromEncounters method with this updated version
// Replace the existing spawnEnemiesFromEncounters method with this updated version
Scene_Map.prototype.spawnEnemiesFromEncounters = function() {
    let encounterList = $gameMap.encounterList();
    if (!encounterList || !encounterList.length) {
        // **INSERT FALLBACK HERE**
        const fallbackIds = [];
        const party = $gameParty.members();
        ensureTroops(fallbackIds, party, $dataEnemies);
        // turn them into the same shape as a normal encounterList:
        encounterList = fallbackIds.map(id => ({ troopId: id, weight: 1 }));
      }
    const enemyEvents = $gameMap.events().filter(ev => ev.event().name === "Enemy");
    if (!enemyEvents.length) return;

    // —————— UPDATED: scan for passable tiles, excluding region 10 and A3/A4 tileset tiles ——————
    const spawnTiles = [];
    const w = $gameMap.width(), h = $gameMap.height();
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            // Skip region ID 10
            if ($gameMap.regionId(x, y) === 10) continue;
            
            // Check if tile is passable and terrain tag is not 4
            if (!$gameMap.isPassable(x, y, 2) || $gameMap.terrainTag(x, y) === 4) continue;
            
            // Check all layers for tiles
            let hasValidTile = false;
            let hasA3orA4Tile = false;
            
            for (let z = 0; z < 6; z++) { // Check all layers (0-5)
                const tileId = $gameMap.tileId(x, y, z);
                if (tileId > 0) {
                    // Check if this is an A3 or A4 tileset tile
                    // A3 tiles: 2048-4095, A4 tiles: 4096-5119
                    if ((tileId >= 2048 && tileId < 4096) || (tileId >= 4096 && tileId < 5120)) {
                        hasA3orA4Tile = true;
                        break;
                    }
                    // A1 tiles: 1536-2047, A2 tiles: 2816-4095, A5 tiles: 1536-1791
                    // Note: A2 overlaps with A3 range, need to be more specific
                    if ((tileId >= 1536 && tileId < 2048) || // A1 and A5 range
                        (tileId >= 2816 && tileId < 4096)) {   // A2 range
                        hasValidTile = true;
                    }
                }
            }
            
            // Only add if has valid tiles, no A3/A4 tiles, and no other event
            if (hasValidTile && !hasA3orA4Tile && 
                !$gameMap.events().some(ev => ev.x === x && ev.y === y)) {
                spawnTiles.push({ x, y });
            }
        }
    }

    // weighted‐random helper (unchanged)
    const selectWeightedRandom = list => {
        const total = list.reduce((sum, it) => sum + it.weight, 0);
        let rnd = Math.random() * total;
        for (const it of list) {
            rnd -= it.weight;
            if (rnd <= 0) return it;
        }
        return list[0];
    };

    // relocate each Enemy, then assign its troop
    for (const ev of enemyEvents) {
        if (spawnTiles.length) {
            const idx = Math.floor(Math.random() * spawnTiles.length);
            const loc = spawnTiles.splice(idx, 1)[0];
            ev.locate(loc.x, loc.y);
        }
        // now filter encounters by the region under the new spot (as before)
        const validTroops = encounterList
        if (validTroops.length) {
            const chosen = selectWeightedRandom(validTroops);
            ev._fixedTroopId = chosen.troopId;
            const enemyData = $dataEnemies[ev._fixedTroopId];
            if (enemyData && enemyData.note) {
            const note = enemyData.note;

            // Speed: 1–6
            const speedMatch = note.match(/<Speed:\s*([1-6])>/i);
            if (speedMatch) {
                ev.setMoveSpeed(Number(speedMatch[1]));
            }

            // Movement: Approach | Random | Fixed | Fleeing
            const moveMatch = note.match(/<Movement:\s*(Approach|Random|Fixed|Fleeing)>/i);
            if (moveMatch) {
                const type = moveMatch[1].toLowerCase();
                // RPG Maker MV/MZ internals: 0=fixed, 1=random, 2=approach, 3=custom
                if (type === 'fixed')    ev._moveType = 0;
                else if (type === 'random') ev._moveType = 1;
                else if (type === 'approach') ev._moveType = 2;
                else if (type === 'fleeing') {
                    //ev._moveType = 3; // Custom movement
                    //ev.setupFleeingMovement();
                }
            }
            }
            ev.updateCharacterSprite();
            ev.setOpacity(255);
            ev.setThrough(false);
        } else {
            ev.erase();
        }
    }
};

// Add this new method to Game_Event prototype
Game_Event.prototype.setupFleeingMovement = function() {
    // Create a custom move route for fleeing behavior
    const route = {
        list: [
            { code: 32 }, // Move away from player
            { code: 0 }   // End
        ],
        repeat: true,
        skippable: true,
        wait: false
    };
    
    this.forceMoveRoute(route);
    this._fleeingMovement = true;
};

// Add this new method to check if event is using fleeing movement
Game_Event.prototype.isFleeingMovement = function() {
    return this._fleeingMovement || false;
};

    
    
    //=============================================================================
    // Scene_Map - Handle Spawning, Rewards, and Respawn
    //=============================================================================

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        const currMap = $gameMap.mapId();

        // --- NEW Spawning Logic ---
        // Only spawn enemies on a fresh map transfer, not on returning from battle or loading a save.
        if (!$gameSystem.isBattleEnded() && currMap !== _lastSpawnedMapId) {
            _battleCooldownTimer = BATTLE_COOLDOWN_FRAMES;
            this.spawnEnemiesFromEncounters();
            _lastSpawnedMapId = currMap;
        }
        // --- END NEW Spawning Logic ---

        _Scene_Map_start.call(this); // Call original start method
        
        // --- NEW Gravestone Logic ---
        const deathData = $gameSystem.getDeathData();
        if (deathData && deathData.mapId === $gameMap.mapId()) {
            const gravestoneEvent = $gameMap.events().find(event => event.event().name === "Gravestone");
            if (gravestoneEvent) {
                if (deathData && deathData.mapId === $gameMap.mapId()) {
                    // Player has died on this map, move gravestone to death location
                    gravestoneEvent.locate(deathData.x, deathData.y);
                } else {
                    // Player hasn't died yet or died elsewhere, destroy the gravestone event
                    $gameMap.eraseEvent(gravestoneEvent.eventId());
                }
            }
        }
        // --- END Gravestone Logic ---

        // If returning from a battle, handle post-battle logic
        if ($gameSystem.isBattleEnded()) {
            let hasRespawned = false;
            $gameSystem.setBattleCooldown(120); // 2 seconds at 60fps
            if ($gameSystem.isActor1Died()) {
                this.handleActor1Respawn();
                hasRespawned = true;
            }

            if ($gameSystem.isActor2Died()) {
                this.handlePartyMemberDeath(2, $gameSystem.getActor2Name());
                hasRespawned = true;
            }
            
            if ($gameSystem.isActor3Died()) {
                this.handlePartyMemberDeath(3, $gameSystem.getActor3Name());
                hasRespawned = true;
            }

            const eventToDelete = $gameSystem.getEventToDelete();
            if (eventToDelete) {
                $gameMap.eraseEvent(eventToDelete.eventId);
                $gameSystem.clearEventToDelete();
            }

            const eventToLock = $gameSystem.getEventToLock();
            if (eventToLock) {
                const event = $gameMap.event(eventToLock.eventId);
                if (event) {
                    event.lockMovement(160);
                }
                $gameSystem.clearEventToLock();
            }

            if (!hasRespawned) {
                this.createRewardsPopup();
            }

            $gameSystem.setBattleEnded(false);
            
            // Reset death flags after handling them
            $gameSystem.setActor1Died(false);
            $gameSystem.setActor2Died(false, "");
            $gameSystem.setActor3Died(false, "");
        }else{
            $gamePlayer.setThrough(false);

        }
    };

    //=============================================================================
    // Game_Event - Modified to accommodate the new spawning system
    //=============================================================================
    
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        
        // This now only applies to non-"Enemy" events that use note-tags.
        this.selectFixedTroopIdFromNote();

        this._movementLocked = false;
        this._movementLockTimer = 0;
        this._fleeingMovement = false; // Initialize fleeing movement flag
        this.updateCharacterSprite(); // Initial sprite update
    };

    // Renamed from selectFixedTroopId to be more specific
    Game_Event.prototype.selectFixedTroopIdFromNote = function() {
        // --- MODIFIED: This logic is now ignored for "Enemy" events ---
        if (this.event().name === "Enemy") {
            this._fixedTroopId = 0; // It will be set by the new spawning system.
            return;
        }
        // --- END MODIFICATION ---
    
        const note = this.event().note || "";
        
        if (note.includes('?')) {
            const validTroopIds = $dataTroops.slice(1).map((t, i) => t ? i + 1 : 0).filter(id => id > 0);
            if (validTroopIds.length > 0) {
                this._fixedTroopId = validTroopIds[Math.floor(Math.random() * validTroopIds.length)];
            }
        } else {
            const troopIds = note.split(',').map(id => parseInt(id.trim())).filter(id => id > 0);
            if (troopIds.length > 0) {
                this._fixedTroopId = troopIds[Math.floor(Math.random() * troopIds.length)];
            } else {
                this._fixedTroopId = 0;
            }
        }
    
        // Handle movement settings for note-tagged events
        if (this._fixedTroopId > 0) {
            const enemyData = $dataEnemies[this._fixedTroopId];
            if (enemyData && enemyData.note) {
                const enemyNote = enemyData.note;
                
                // Movement: Approach | Random | Fixed | Fleeing
                const moveMatch = enemyNote.match(/<Movement:\s*(Approach|Random|Fixed|Fleeing)>/i);
                if (moveMatch) {
                    const type = moveMatch[1].toLowerCase();
                    if (type === 'fixed')    this._moveType = 0;
                    else if (type === 'random') this._moveType = 1;
                    else if (type === 'approach') this._moveType = 2;
                    else if (type === 'fleeing') {
                        //this._moveType = 3; // Custom movement
                        //this.setupFleeingMovement();
                    }
                }
            }
        }
    
        // Persistent data setup for note-tagged enemies
        if (this._fixedTroopId > 0) {
            const persistentId = `${this._mapId}_${this._eventId}`;
            if (!_persistentEnemyData[persistentId]) {
                _persistentEnemyData[persistentId] = {
                    troopId: this._fixedTroopId,
                    enemyHp: {}
                };
            }
        }
    };
    
    // Unchanged: This function works perfectly with the new system.
    Game_Event.prototype.updateCharacterSprite = function() {
        if (this._fixedTroopId && this._fixedTroopId > 0) {
          const troop = $dataTroops[this._fixedTroopId];
          if (!troop) return;
          const member = troop.members[0];
          const enemyId = member ? member.enemyId : null;
          if (!enemyId) return;
      
          if (_enemyCharSprites[enemyId]) {
            const charSpriteName = _enemyCharSprites[enemyId];
            this.setImage("Monsters/" + charSpriteName, this._characterIndex);
            
            const hue = ($dataEnemies[enemyId] && $dataEnemies[enemyId].battlerHue) || 0;
            this._characterHue = hue;
          }
        }
    };

    //=============================================================================
    // DataManager - Load Enemy Note Tags for Character Sprites
    //=============================================================================
    
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;
        
        if (!this._enemyCharSpritesLoaded) {
            this.loadEnemyCharSprites($dataEnemies);
            this._enemyCharSpritesLoaded = true;
        }
        
        return true;
    };
    
    DataManager.loadEnemyCharSprites = function(data) {
        for (let i = 1; i < data.length; i++) {
            const enemy = data[i];
            if (enemy && enemy.note) {
                const charMatch = enemy.note.match(/<Char:(.+?)>/i);
                if (charMatch) {
                    _enemyCharSprites[i] = charMatch[1];
                }
            }
        }
    };

    //=============================================================================
    // Game_Map - Setup events (minor change for clarity)
    //=============================================================================
    
    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents.call(this);
        
        // This ensures non-"Enemy" events with notes get their sprites set correctly on map load.
        // "Enemy" events are handled by spawnEnemiesFromEncounters.
        this.events().forEach(event => {
            if (event.event().name !== "Enemy") {
                event.selectFixedTroopIdFromNote();
                event.updateCharacterSprite();
            }
        });
    };
    
    // (The rest of the original plugin code continues below, largely unchanged)
    // ... [existing code for battles, respawn, popups, etc.] ...

    //=============================================================================
    // Sprite_Character – Apply Enemy Hue
    //=============================================================================
    (function() {
        const _SC_update = Sprite_Character.prototype.update;
        Sprite_Character.prototype.update = function() {
          _SC_update.call(this);
          const char = this._character;
          const hue  = char && char._characterHue;
          if (hue) {
            if (!this._hueFilter) {
              this._hueFilter = new PIXI.filters.ColorMatrixFilter();
              this.filters = [this._hueFilter];
            }
            this._hueFilter.reset();
            this._hueFilter.hue(hue, false);
          } else if (this._hueFilter) {
            this.filters = null;
            this._hueFilter = null;
          }
        };
      })();

    //=============================================================================
    // BattleManager - Hide Battle Messages and Manage Battle Flow
    //=============================================================================
    
    // Reset health protection when battle starts
    const _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function(troopId, canEscape, canLose) {
        _BattleManager_setup.call(this, troopId, canEscape, canLose);
        resetHealthProtection();
    };
    
    // Also check deaths during update (to catch deaths outside of turn ends)
    const _BattleManager_update = BattleManager.update;
    BattleManager.update = function() {
        _BattleManager_update.call(this);
        
        // Only check during battle phase
        if (this._phase === 'action' || this._phase === 'turn') {
            this.checkActorDeaths();
        }
    };
    let _battleTurnCount = 0;
    
// Modify the BattleManager.displayStartMessages to include the warning check
    BattleManager.displayStartMessages = function() {
        _battleTurnCount = 0;
        
        // Check for dangerous enemy and show warning if needed
        checkAndShowDangerousEnemyWarning();
    };    
    BattleManager.displayEscapeFailureMessage = function() {};
    
    BattleManager.displayEscapeSuccessMessage = function() {};
    
    const _BattleManager_makeEscapeRatio = BattleManager.makeEscapeRatio;
    BattleManager.makeEscapeRatio = function() {
        _BattleManager_makeEscapeRatio.call(this);
        if (_battleTurnCount <= 1) {
            this._escapeRatio = 1.0;
        }
    };
    
    const _BattleManager_makeRewards = BattleManager.makeRewards;
    BattleManager.makeRewards = function() {
        _BattleManager_makeRewards.call(this);
        if (!_battleRewards) {
            _battleRewards = { exp: 0, gold: 0, items: [] };
        }
        _battleRewards.exp = this._rewards.exp || 0;
        _battleRewards.gold = this._rewards.gold || 0;
        _battleRewards.items = this._rewards.items ? this._rewards.items.slice() : [];
    };
    
    BattleManager.displayVictoryMessage = function() {};
    
    BattleManager.displayRewards = function() {
        this.gainRewards();
    };
    
    const _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
        if (this.checkActorDeaths()) {
             if ($gameSystem.isActor1Died()) {
                this.processActor1Death();
                return;
            }
        }
        _BattleManager_endTurn.call(this);
    };

    const _BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
        _BattleManager_startTurn.call(this);
        _battleTurnCount++;
    };
    
    BattleManager.processActor1Death = function() {
    if ($gameSwitches.value(9)) {
        saveDeathData();
        $gameSwitches.setValue(34, true);
    }
    
        // Set flag for respawn
        _needsRespawn = true;
        
        // Mark current event for deletion
        if (_currentMapId && _currentEventId) {
            $gameSystem.setEventToDelete(_currentMapId, _currentEventId);
        }
        
        // End the battle immediately (with escape result to avoid game over)
        this._escaped = true;
        this.updateBattleEnd();
    };
        // Reset enemy HP when defeated
        const _Game_Enemy_die = Game_Enemy.prototype.die;
        Game_Enemy.prototype.die = function() {
            _Game_Enemy_die.call(this);
            
            // If this is in a persistent battle, mark this enemy as dead
            if (_currentBattleEventId && _persistentEnemyData[_currentBattleEventId]) {
                const index = $gameTroop.members().indexOf(this);
                if (index >= 0) {
                    _persistentEnemyData[_currentBattleEventId].enemyHp[index] = 0;
                }
            }
        };
        
        // Alias the BattleManager.updateBattleEnd method to set a flag when battle is ending
        const _BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
        BattleManager.updateBattleEnd = function() {
            _BattleManager_updateBattleEnd.call(this);
            if (this._escaped || $gameParty.isAllDead() || $gameTroop.isAllDead()) {
                $gameSystem.setBattleEnded(true);
                
                // Store special death flags if any actor died
                if ($gameSystem.isActor1Died()) {
                    // Will be handled in Scene_Map
                }
                
                if ($gameSystem.isActor2Died()) {
                    // Will handle removing actor2 after battle
                }
                if ($gameSystem.isActor3Died()) {
                    // Will handle removing actor2 after battle
                }
            }
        };
        
    BattleManager.checkActorDeaths = function() {
        let deathOccurred = false;
        const members = $gameParty.members();
        if (members[0] && members[0].isDead() && !$gameSystem.isActor1Died()) {
            $gameSystem.setActor1Died(true);
            deathOccurred = true;
        }
        if (members[1] && members[1].isDead() && !$gameSystem.isActor2Died()) {
            $gameSystem.setActor2Died(true, members[1].name());
            deathOccurred = true;
        }
        if (members[2] && members[2].isDead() && !$gameSystem.isActor3Died()) {
            $gameSystem.setActor3Died(true, members[2].name());
            deathOccurred = true;
        }
        return deathOccurred;
    };

    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        if ($gameSystem.isActor1Died()) {
            this.processActor1Death();
        } else {
             _BattleManager_processDefeat.call(this);
        }
    };

    const _Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        _Game_Troop_setup.call(this, troopId);
        if (_currentBattleEventId && _persistentEnemyData[_currentBattleEventId]) {
            const storedHp = _persistentEnemyData[_currentBattleEventId].enemyHp;
            this.members().forEach((enemy, index) => {
                if (storedHp[index] !== undefined) {
                    enemy.setHp(storedHp[index]);
                }
            });
        }
    };
    
    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        if (result === 1 && _currentBattleEventId && $gameTroop) { // Flee
            const persistentData = _persistentEnemyData[_currentBattleEventId] || { enemyHp: {} };
            $gameTroop.members().forEach((enemy, index) => {
                persistentData.enemyHp[index] = enemy.hp;
            });
            _persistentEnemyData[_currentBattleEventId] = persistentData;
            $gameSystem.setEventToLock(_currentMapId, _currentEventId);
            
            // Clear rewards when fleeing - no rewards should be given
            _battleRewards = { exp: 0, gold: 0, items: [] };
            
        } else if (result === 0 && _currentBattleEventId) { // Win
            if (_persistentEnemyData[_currentBattleEventId]) {
                delete _persistentEnemyData[_currentBattleEventId];
            }
            $gameSystem.setEventToDelete(_currentMapId, _currentEventId);
            // Don't clear rewards here - they should be shown for victories
        }
        
        $gameSystem.setBattleEnded(true);
        _currentBattleEventId = null;
        _BattleManager_endBattle.call(this, result);
    };

    //=============================================================================
    // Health Protection System - Actor HP Management
    //=============================================================================
    
    // Override Game_Actor setHp to implement health protection
//=============================================================================
    // Health Protection System - Actor HP Management
    //=============================================================================
    
    // Override Game_Actor setHp to implement health protection
    const _Game_Actor_setHp = Game_Actor.prototype.setHp;
    Game_Actor.prototype.setHp = function(hp) {
        const oldHp = this.hp;
        const wasAlive = !this.isDead();
        
        // Call original setHp first
        _Game_Actor_setHp.call(this, hp);
        
        // Check if actor would die and has protection available
        // BUT don't apply protection if they were already at 1HP (to avoid wasting protection on minimal damage)
        if (wasAlive && this.isDead() && hasHealthProtection(this.actorId()) && oldHp > 1) {
            // Use protection and set HP to 1
            useHealthProtection(this.actorId());
            _Game_Actor_setHp.call(this, 1);
            
            // Show protection message only in battle
            if ($gameParty.inBattle()) {
                
                // Play a special sound effect if available
                if ($dataCommonEvents[1]) { // Assuming common event 1 has protection sound
                    // You can add a sound effect here if desired
                    // AudioManager.playSe({name: "Bell3", volume: 90, pitch: 100, pan: 0});
                }
            }
        }
        
        // Handle map deaths (existing code)
        if (oldHp > 0 && this.hp <= 0 && !$gameParty.inBattle()) {
            // If this is actor1 (index 0), trigger death process
            if (this === $gameParty.members()[0]) {
                this.processMapDeath();
            }
            // If this is actor2, mark for potential removal
            else if (this === $gameParty.members()[1]) {
                $gameSystem.setActor2Died(true, this.name());
                
                // Update party to handle actor2 death on map
                $gameMap.requestRefresh();
            }
        }
    };

    //=============================================================================
    // Game_System - Store Battle States
    //=============================================================================
    
    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._battleEnded = false;
        this._actor1Died = false;
        this._actor2Died = false;
        this._actor3Died = false;
        this._actor2Name = "";
        this._actor3Name = "";
        this._eventToDelete = null;
        this._eventToLock = null;
        this._deathData = null; // For gravestone system
        this._battleEnded = false;
        this._battleCooldownTimer = 0; // Add this line
    };
    Game_System.prototype.setBattleCooldown = function(frames) { this._battleCooldownTimer = frames; };
Game_System.prototype.getBattleCooldown = function() { return this._battleCooldownTimer || 0; };
Game_System.prototype.updateBattleCooldown = function() { 
    if (this._battleCooldownTimer > 0) this._battleCooldownTimer--; 
};
    Game_System.prototype.setBattleEnded = function(value) { this._battleEnded = value; };
    Game_System.prototype.isBattleEnded = function() { return this._battleEnded; };
    Game_System.prototype.setActor1Died = function(value) { this._actor1Died = value; };
    Game_System.prototype.isActor1Died = function() { return this._actor1Died; };
    Game_System.prototype.setActor2Died = function(value, name) { this._actor2Died = value; this._actor2Name = name || ""; };
    Game_System.prototype.isActor2Died = function() { return this._actor2Died; };
    Game_System.prototype.getActor2Name = function() { return this._actor2Name; };
    Game_System.prototype.setActor3Died = function(value, name) { this._actor3Died = value; this._actor3Name = name || ""; };
    Game_System.prototype.isActor3Died = function() { return this._actor3Died; };
    Game_System.prototype.getActor3Name = function() { return this._actor3Name; };
    Game_System.prototype.setEventToDelete = function(mapId, eventId) { this._eventToDelete = { mapId, eventId }; };
    Game_System.prototype.getEventToDelete = function() { return this._eventToDelete; };
    Game_System.prototype.clearEventToDelete = function() { this._eventToDelete = null; };
    Game_System.prototype.setEventToLock = function(mapId, eventId) { this._eventToLock = { mapId, eventId }; };
    Game_System.prototype.getEventToLock = function() { return this._eventToLock; };
    Game_System.prototype.clearEventToLock = function() { this._eventToLock = null; };

    // --- NEW: Game_System methods for Gravestone data ---
    Game_System.prototype.setDeathData = function(data) { this._deathData = data; };
    Game_System.prototype.getDeathData = function() { return this._deathData; };
    Game_System.prototype.clearDeathData = function() { this._deathData = null; };
    // --- END NEW ---

    //=============================================================================
    // Actor and Scene Handlers for Death and Respawn
    //=============================================================================
    const _Game_Actor_onBattleEnd = Game_Actor.prototype.onBattleEnd;
    Game_Actor.prototype.onBattleEnd = function() {
        _Game_Actor_onBattleEnd.call(this);
        if (this === $gameParty.members()[0] && $gameSystem.isActor1Died()) {
            this.recoverAll();
        }
    };
    
    Scene_Map.prototype.handleActor1Respawn = function() {
        $gameVariables.setValue(1, 0); // Set variable 1 to 0
        $gamePlayer.setThrough(true);
        
        let respawnMapId = $gameVariables.value(respawnMapVar) || 1;
        let respawnX = $gameVariables.value(respawnXVar) || 19;
        let respawnY = $gameVariables.value(respawnYVar) || 13;
        if ($gameSwitches.value(34)) {
            respawnMapId =  557;
            respawnX = 13
            respawnY = 5
        }
        $gameScreen.startFadeOut(30);
        setTimeout(() => {
            $gamePlayer.reserveTransfer(respawnMapId, respawnX, respawnY, 2, 0);
            _needsRespawn = false;
            // After transfer, a new Scene_Map is created, player settings reset automatically.
            // We'll add a check to restore 'through' state on map load.
        }, 500);
    };

    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        // After any transfer, ensure the player is not stuck in 'through' mode unless intended.
        if (this.isTransferring() && !_needsRespawn) {
            this.setThrough(false);
        }
    };

    Scene_Map.prototype.handlePartyMemberDeath = function(actorIndex, actorName) {
        const actor = $gameParty.members()[actorIndex - 1];
        if (actor && actor.isDead()) {
            $gameParty.removeActor(actor.actorId());
            const useTranslation = ConfigManager.language === 'it'
            window.skipLocalization = true;

            $gameMessage.add(actorName + useTranslation?" è morto":" has died.");
            window.skipLocalization = false;

        }
    };
    
    Scene_Map.prototype.createRewardsPopup = function() {
        if (!_battleRewards || (_battleRewards.exp <= 0 && _battleRewards.gold <= 0 && _battleRewards.items.length === 0)) {
            return;
        }
        this._rewardsPopupWindow = new Window_BattleRewardsPopup();
        this.addWindow(this._rewardsPopupWindow);
        this._rewardsPopupWindow.open();
        this._rewardsPopupCloseTimer = 180;
        
        // Clear the rewards after showing them
        _battleRewards = { exp: 0, gold: 0, items: [] };
    };
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        // Update battle cooldown timer
        $gameSystem.updateBattleCooldown();
        if (this._rewardsPopupWindow && this._rewardsPopupCloseTimer > 0) {
            this._rewardsPopupCloseTimer--;
            if (this._rewardsPopupCloseTimer <= 0) {
                this._rewardsPopupWindow.close();
                this._rewardsPopupWindow = null;
            }
        }
    };

    Scene_Gameover.prototype.start = function() {
        SceneManager.goto(Scene_Map);
    };

// Add update method to Scene_Battle to handle the warning window
const _Scene_Battle_update_topWarning = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    _Scene_Battle_update_topWarning.call(this);
    
    if (this._topWarningWindow) {
        this._topWarningWindow.update();
    }
};
    //=============================================================================
    // Window_BattleRewardsPopup
    //=============================================================================
    function Window_BattleRewardsPopup() {
        this.initialize(...arguments);
    }
    
    Window_BattleRewardsPopup.prototype = Object.create(Window_Base.prototype);
    Window_BattleRewardsPopup.prototype.constructor = Window_BattleRewardsPopup;
    
    Window_BattleRewardsPopup.prototype.initialize = function() {
        const width = 240;
        const height = this.fittingHeight(1);
        const x = (Graphics.boxWidth - width) / 2;
        const y = 0;
        Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
        this.openness = 0;
        this.refresh();
    };
    
    Window_BattleRewardsPopup.prototype.refresh = function() {
        this.contents.clear();
        if (!_battleRewards) return;
      
        // convert gold (integer "G") into euros
        const gold = _battleRewards.gold || 0;
        const euros = (gold / 100).toFixed(2) + "€";
      
        const rewardText = `${_battleRewards.exp || 0} EXP, ${euros}`;
        this.drawText(rewardText, 0, 0, this.contentsWidth(), 'center');
        };

    //=============================================================================
    // Register Plugin Commands
    //=============================================================================
    function startPersistentBattle(troopId, persistentId, eventId, mapId) {
        if (!_persistentEnemyData[persistentId]) {
            _persistentEnemyData[persistentId] = {
                troopId: troopId,
                enemyHp: {}
            };
        }    
        if ($gameSystem.getBattleCooldown() > 0) {
            return;
        }
        
        _currentBattleEventId = persistentId;
        _currentEventId = eventId;
        _currentMapId = mapId;
        _needsRespawn = false;
        
        BattleManager.setup(troopId, false, false);
        SceneManager.push(Scene_Battle);
    }
    
    PluginManager.registerCommand(pluginName, "startBattle", function(args) {
        // Check if battle is on cooldown
        if ($gameSystem.getBattleCooldown() > 0) {
            console.log("Battle on cooldown:", $gameSystem.getBattleCooldown()); // Debug line
            return;
        }
        
        const eventId = Number(args.eventId) || this._eventId;
        const event = $gameMap.event(eventId);
        if (event && event._fixedTroopId > 0) {
            const persistentId = `${$gameMap.mapId()}_${eventId}`;
            startPersistentBattle(event._fixedTroopId, persistentId, eventId, $gameMap.mapId());
        }
    });
    
    PluginManager.registerCommand(pluginName, "setRespawnPoint", function(args) {
        $gameVariables.setValue(respawnMapVar, Number(args.mapId));
        $gameVariables.setValue(respawnXVar, Number(args.x));
        $gameVariables.setValue(respawnYVar, Number(args.y));
    });

    PluginManager.registerCommand(pluginName, "restore", function(args) {
        const deathData = $gameSystem.getDeathData();
        if (deathData) {
            $gameParty.gainGold(deathData.gold);
            for (const key in deathData.items) {
                const amount = deathData.items[key];
                let item = null;
                const id = parseInt(key.substring(1));
                if (key.startsWith('i')) {
                    item = $dataItems[id];
                } else if (key.startsWith('w')) {
                    item = $dataWeapons[id];
                } else if (key.startsWith('a')) {
                    item = $dataArmors[id];
                }
    
                if (item) {
                    $gameParty.gainItem(item, amount, false);
                }
            }
            $gameSystem.clearDeathData();
        }
    });

    //=============================================================================
    // Data Save/Load Handling
    //=============================================================================


    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.persistentEnemyData) {
            Object.assign(_persistentEnemyData, contents.persistentEnemyData);
        }
        if (contents.enemyCharSprites) {
            Object.assign(_enemyCharSprites, contents.enemyCharSprites);
        }
        // Load health protection data
        if (contents.healthProtectionUsed) {
            Object.assign(_healthProtectionUsed, contents.healthProtectionUsed);
        }
    };
    
    // Add enemy data to save contents
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.persistentEnemyData = _persistentEnemyData;
        contents.enemyCharSprites = _enemyCharSprites;
        // Save health protection state
        contents.healthProtectionUsed = _healthProtectionUsed;
        return contents;
    };

    const _Game_Map_setupEvents_RandomEnemies = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents_RandomEnemies.call(this);
        
        // Update all events that need resprite after load
        this.events().forEach(event => {
            const persistentId = `${this._mapId}_${event._eventId}`;
            if (_persistentEnemyData[persistentId] && _persistentEnemyData[persistentId].needsResprite) {
                // If this was a random enemy and needs resprite, update it
                event._fixedTroopId = _persistentEnemyData[persistentId].troopId;
                event.updateCharacterSprite();
                // Clear the resprite flag
                _persistentEnemyData[persistentId].needsResprite = false;
            }
        });
    };
        
        // Add movement locking functionality
        Game_Event.prototype.lockMovement = function(duration) {
            this._movementLocked = true;
            this._movementLockTimer = duration || 60;
        };
        
        // Override the updateSelfMovement to respect movement lock
        const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
        Game_Event.prototype.updateSelfMovement = function() {
            if (this._movementLocked) {
                // Don't allow movement while locked
                return;
            }
            _Game_Event_updateSelfMovement.call(this);
        };
        
        // Add a method to update movement lock timer
        Game_Event.prototype.updateMovementLock = function() {
            if (this._movementLocked && this._movementLockTimer > 0) {
                this._movementLockTimer--;
                if (this._movementLockTimer <= 0) {
                    this._movementLocked = false;
                }
            }
        };
        
        // Extend the update method to handle movement lock timer
        const _Game_Event_update = Game_Event.prototype.update;
        Game_Event.prototype.update = function() {
            _Game_Event_update.call(this);
            this.updateMovementLock();
        };
    

    // New method to handle actor1 death on map
    Game_Actor.prototype.processMapDeath = function() {
        // Only proceed if this is actor1
        if (this !== $gameParty.members()[0]) return;
        
        if ($gameSwitches.value(9)) {
            saveDeathData();
        }

        // Set variable 001 to 0 on player's death
        $gameVariables.setValue(1, 0);
        
        // Set relevant flags
        $gameSystem.setActor1Died(true);
        _needsRespawn = true;
        
        // Fully heal actor1 (will respawn at full health)
        this.recoverAll();
        let respawnMapId = $gameVariables.value(respawnMapVar);
        let respawnX = $gameVariables.value(respawnXVar);
        let respawnY = $gameVariables.value(respawnYVar);

        
        // Get respawn coordinates from variables
        
        // Use default values if any are 0
        if (respawnMapId <= 0) respawnMapId = 1;
        if (respawnX <= 0) respawnX = 21;
        if (respawnY <= 0) respawnY = 23;
        
        if ($gameSwitches.value(34)) {
            respawnMapId =  557;
            respawnX = 13
            respawnY = 5
        }
        // Set player to lower priority temporarily and disable touch events
        $gamePlayer._priorityType = 0; // Below characters
        $gamePlayer._through = true;   // Pass through (no collision/interaction)
        
        // Fade out first
        $gameScreen.startFadeOut(30);
        
        // Show death animation on player if available
        if ($dataAnimations[11]) { // Assuming animation ID 11 is a death animation
            $gameTemp.requestAnimation([$gamePlayer], 11); // Play death animation on player
        }
        
        // Wait for fade to complete before transferring
        setTimeout(() => {
            // Transfer player to respawn point with fade in
            $gamePlayer.reserveTransfer(respawnMapId, respawnX, respawnY, 2, 0);
            
            // Wait until map transfer is complete, then restore normal player settings
            const mapLoadInterval = setInterval(() => {
                if ($gameMap.mapId() === respawnMapId) {
                    // Restore normal priority and collision after transfer completes
                    $gamePlayer._priorityType = 1; // Same as characters (normal)
                    $gamePlayer._through = false;  // Normal collision/interaction
                    
                    // Reset death flags
                    $gameSystem.setActor1Died(false);
                    _needsRespawn = false;
                    
                    clearInterval(mapLoadInterval);

                    // Optional: Show resurrection message
                    //$gameMessage.add($gameParty.members()[0].name() + " has been revived!");
                }
            }, 100); // Check every 100ms
        }, 500); // 500ms should be adequate for 30-frame fade
    };

    const _Scene_Map_update_checkDeaths = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update_checkDeaths.call(this);
        
        // Handle actor2 death if needed
        if ($gameSystem.isActor2Died() && !$gameParty.inBattle()) {
            this.handleActor2Death();
        }
    };

    // Add new plugin command to damage actor on map
    PluginManager.registerCommand(pluginName, "damageActor", function(args) {
        const actorId = parseInt(args.actorId) || 1;
        const amount = parseInt(args.damage) || 0;
        
        if (amount > 0 && $gameActors.actor(actorId)) {
            const actor = $gameActors.actor(actorId);
            actor.gainHp(-amount);
            
            // Show damage popup if on map
            if (!$gameParty.inBattle()) {
                $gameTemp.requestAnimation([$gamePlayer], 1); // Damage animation ID
                
                // Flash the screen red briefly
                $gameScreen.startFlash([255, 0, 0, 128], 30);
            }
        }
    });

    //=============================================================================
    // Health Protection Debug Commands (Optional)
    //=============================================================================
    
    // Add plugin command to reset health protection for testing
    PluginManager.registerCommand(pluginName, "resetHealthProtection", function(args) {
        resetHealthProtection();
        $gameMessage.add("Health protection reset for all actors!");
    });
    
    // Add plugin command to check protection status
    PluginManager.registerCommand(pluginName, "checkHealthProtection", function(args) {
        const party = $gameParty.members();
        party.forEach((actor, index) => {
            const hasProtection = hasHealthProtection(actor.actorId());
            const status = hasProtection ? "Available" : "Used";
            $gameMessage.add(`${actor.name()}: Protection ${status}`);
        });
    });

})();

/* =========================
 * BattleSystemEnhanced - Safe Monster Image Loader
 * Adds try/catch when loading images from img/characters/Monsters
 * If loading fails, it logs the error and uses a placeholder bitmap.
 * ========================= */
(function() {
    'use strict';
    if (typeof Sprite_Character !== 'undefined') {
        const _Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
        Sprite_Character.prototype.setCharacterBitmap = function() {
            const name = this._characterName || "";
            if (/^Monsters\//i.test(name)) {
                try {
                    _Sprite_Character_setCharacterBitmap.call(this);
                } catch (e) {
                    console.error("[BattleSystemEnhanced] Failed to load character image:", name, e);
                    // Fallback: create a 3x4 placeholder sheet (48x48 frames)
                    const fw = 48, fh = 48;
                    const w = fw * 3, h = fh * 4;
                    const bmp = new Bitmap(w, h);
                    bmp.fillRect(0, 0, w, h, "#222222");
                    bmp.drawText("MISSING", 0, Math.floor(h/2) - 12, w, 24, "center");
                    this.bitmap = bmp;
                    this._isBigCharacter = false;
                    this.setFrame(0, 0, fw, fh);
                }
            } else {
                _Sprite_Character_setCharacterBitmap.call(this);
            }
        };
    }

    if (typeof ImageManager !== 'undefined') {
        // Also protect direct bitmap loads for Monsters folder, if used elsewhere
        const _loadBitmap = ImageManager.loadBitmap;
        ImageManager.loadBitmap = function(folder, filename) {
            try {
                return _loadBitmap.call(this, folder, filename);
            } catch (e) {
                if (typeof folder === "string" && /img\/characters\/Monsters\/?$/i.test(folder)) {
                    console.error("[BattleSystemEnhanced] Failed to load bitmap:", folder, filename, e);
                    // Fallback to a blank placeholder to avoid crashes
                    const bmp = new Bitmap(144, 192); // 3x4 frames
                    bmp.fillRect(0, 0, 144, 192, "#222222");
                    bmp.drawText("MISSING", 0, 84, 144, 24, "center");
                    return bmp;
                }
                throw e;
            }
        };
    }
})();
