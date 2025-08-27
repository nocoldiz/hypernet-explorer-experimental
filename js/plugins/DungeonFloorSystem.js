
/*:
 * @target MZ
 * @plugindesc v1.6.2 Creates a 100-floor dungeon system with robust map validation for stair placement.
 * @author Claude
 * @url https://www.example.com
 *
 * @help DungeonFloorSystem.js
 *
 * ######This plugin creates a dungeon system with 100 floors and a town level.
 * Floors are organized into 10 levels (A through J), each with 9 regular floors
 * and 1 elevator floor at the end of each level.
 *
 * --- New in v1.6.2: Staircase Map Validation ---
 * The plugin now validates maps to ensure they can be used for dungeon floors.
 * - Single-map floors: A map will be excluded from the generation pool if it
 * does not contain at least one tile with Region ID 13.
 * - Multi-map floors: A group of maps is only valid if it contains at least
 * TWO maps that have a Region ID 13 tile (for an entrance and an exit).
 * Maps within a valid group that lack Region ID 13 will not be used for
 * the start or end rooms.
 *
 * --- Special Floor Transitions ---
 * - From Town (Floor 0), using "nextFloor" teleports you to Map ID 101 (X:15, Y:38).
 * - From Floor 1, using "prevFloor" teleports you to the Town Map (Map ID 1) at (X:21, Y:21).
 * - If the current floor is a negative number, "nextFloor" and "prevFloor" are disabled.
 *
 * Plugin Commands:
 * generateDungeon - Creates a new random dungeon layout (resets max floor)
 * nextFloor      - Move to the next floor (up)
 * prevFloor      - Move to the previous floor (down)
 * setFloor       - Set a specific floor to visit (spawns near downstairs)
 * elevator       - Teleport to the floor stored in variable 17
 * teleportToHighest - Teleport to highest reached floor
 * teleportToNearestStairs - Teleport player to the nearest staircase on current map
 * teleportToUpstairs - Teleport player directly to the upstairs on current map
 * teleportToDownstairs - Teleport player directly to the downstairs on current map
 *
 * ===========================================================================
 * How to use:
 * 1. Set up your maps and their IDs in the plugin parameters. Use [ ] for map groups.
 * 2. Place region ID 13 on your maps where stairs can be located. Maps without
 * this region ID will not be chosen for most floors.
 * 3. Create events named "NextFloor" and "PrevFloor" on your dungeon maps.
 * 4. Generate the dungeon before starting exploration.
 * ===========================================================================
 * @param demoMode
 * @text Demo Mode
 * @desc If true, generate blocks A, B, C randomly and place boss room on floor 66 in demo mode.
 * @type boolean
 * @param levelAMaps
 * @text Level A Floor Maps
 * @desc Comma-separated list of map IDs for Level A floors (1-9). Use [map1,map2] for map groups.
 * @default 5,6,7,8,9
 *
 * @param levelBMaps
 * @text Level B Floor Maps
 * @desc Comma-separated list of map IDs for Level B floors (11-19)
 * @default 10,11,12,13,14
 *
 * @param levelCMaps
 * @text Level C Floor Maps
 * @desc Comma-separated list of map IDs for Level C floors (21-29)
 * @default 15,16,17,18,19
 *
 * @param levelDMaps
 * @text Level D Floor Maps
 * @desc Comma-separated list of map IDs for Level D floors (31-39)
 * @default 20,21,22,23,24
 *
 * @param levelEMaps
 * @text Level E Floor Maps
 * @desc Comma-separated list of map IDs for Level E floors (41-49)
 * @default 25,26,27,28,29
 *
 * @param levelFMaps
 * @text Level F Floor Maps
 * @desc Comma-separated list of map IDs for Level F floors (51-59)
 * @default 30,31,32,33,34
 *
 * @param levelGMaps
 * @text Level G Floor Maps
 * @desc Comma-separated list of map IDs for Level G floors (61-69)
 * @default 35,36,37,38,39
 *
 * @param levelHMaps
 * @text Level H Floor Maps
 * @desc Comma-separated list of map IDs for Level H floors (71-79)
 * @default 40,41,42,43,44
 *
 * @param levelIMaps
 * @text Level I Floor Maps
 * @desc Comma-separated list of map IDs for Level I floors (81-89)
 * @default 45,46,47,48,49
 *
 * @param levelJMaps
 * @text Level J Floor Maps
 * @desc Comma-separated list of map IDs for Level J floors (91-99)
 * @default 50,51,52,53,54
 *
 * @param elevatorMaps
 * @text Elevator Floor Maps
 * @desc Comma-separated list of map IDs for elevator floors (10,20,30,etc)
 * @default 60,61,62,63,64,65,66,67,68,69
 *
 * @param townMapId
 * @text Town Map ID
 * @desc Map ID for the town level
 * @type number
 * @default 1
 *
 * @param arenaMapId
 * @text Arena Map ID
 * @desc Map ID for the arena (alternative town when switch 5 is ON)
 * @type number
 * @default 2
 *
 * @param arenaMapX
 * @text Arena Map Spawn X
 * @desc X coordinate for player spawn on arena map
 * @type number
 * @default 5
 *
 * @param arenaMapY
 * @text Arena Map Spawn Y
 * @desc Y coordinate for player spawn on arena map
 * @type number
 * @default 5
 *
 * @param bossFloorMapId
 * @text Boss Floor (Floor 100) Map ID
 * @desc Map ID for floor 100
 * @type number
 * @default 70
 *
 * @param bossFloorX
 * @text Boss Floor Spawn X
 * @desc X coordinate for player spawn on floor 100
 * @type number
 * @default 10
 *
 * @param bossFloorY
 * @text Boss Floor Spawn Y
 * @desc Y coordinate for player spawn on floor 100
 * @type number
 * @default 10
 *
 * @param playerSpawnX
 * @text Player Spawn X
 * @desc Default X coordinate for player spawn on floors
 * @type number
 * @default 5
 *
 * @param playerSpawnY
 * @text Player Spawn Y
 * @desc Default Y coordinate for player spawn on floors
 * @type number
 * @default 5
 *
 * @param currentFloorVariable
 * @text Current Floor Variable
 * @desc Variable to store the current floor number
 * @type variable
 * @default 1
 *
 * @param maxFloorVariable
 * @text Maximum Floor Variable
 * @desc Variable to store the maximum floor reached
 * @type variable
 * @default 2
 *
 * @param elevatorFloorVariable
 * @text Elevator Floor Variable
 * @desc Variable that stores the floor number for elevator
 * @type variable
 * @default 17
 *
 * @param arenaToggleSwitch
 * @text Arena Toggle Switch
 * @desc Switch that determines whether to use the arena map instead of the town map
 * @type switch
 * @default 5
 *
 * @command generateDungeon
 * @text Generate Dungeon
 * @desc Generates a new random dungeon layout and resets max floor
 *
 * @command nextFloor
 * @text Go to Next Floor
 * @desc Move to the next floor in the dungeon (upstairs)
 *
 * @command prevFloor
 * @text Go to Previous Floor
 * @desc Move to the previous floor in the dungeon (downstairs)
 *
 * @command setFloor
 * @text Set Floor
 * @desc Set a specific floor to visit (spawns near downstairs)
 *
 * @arg floor
 * @text Floor Number
 * @desc Floor number to visit (0 for town, 1-100 for dungeon floors)
 * @type number
 * @default 1
 *
 * @command elevator
 * @text Elevator
 * @desc Teleport to the floor stored in variable 17
 *
 * @command teleportToHighest
 * @text Teleport to Highest Floor
 * @desc Teleports the player to the highest floor they've reached
 *
 * @command teleportToNearestStairs
 * @text Teleport to Nearest Stairs
 * @desc Teleports the player to the nearest staircase on the current floor
 *
 * @command teleportToUpstairs
 * @text Teleport to Upstairs
 * @desc Teleports the player to the upstairs on the current floor
 *
 * @command teleportToDownstairs
 * @text Teleport to Downstairs
 * @desc Teleports the player to the downstairs on the current floor
 */

(() => {
  "use strict";

  const pluginName = "DungeonFloorSystem";

  //=============================================================================
  // Plugin Parameters
  //=============================================================================

  const parameters = PluginManager.parameters(pluginName);

  const parseMapList = (paramString) => {
    if (!paramString) return [];
    // Wrap the string in brackets to make it a valid JSON array string.
    // This handles both old "1,2,3" and new "1,[2,3],4" formats.
    const jsonString = "[" + paramString.trim() + "]";
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("DungeonFloorSystem: Error parsing map list parameter.", e);
      console.error("Parameter string was:", paramString);
      // Fallback for simple comma-separated lists that might fail JSON.parse (e.g., trailing comma).
      const sanitizedString = paramString.trim().replace(/,$/, "");
      return sanitizedString
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
    }
  };

  function createSeededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash;
    }
    let state = Math.abs(hash);
    return function () {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  window.DungeonFloorSystemParams = {
    levelAMaps: parseMapList(parameters.levelAMaps),
    levelBMaps: parseMapList(parameters.levelBMaps),
    levelCMaps: parseMapList(parameters.levelCMaps),
    levelDMaps: parseMapList(parameters.levelDMaps),
    levelEMaps: parseMapList(parameters.levelEMaps),
    levelFMaps: parseMapList(parameters.levelFMaps),
    levelGMaps: parseMapList(parameters.levelGMaps),
    levelHMaps: parseMapList(parameters.levelHMaps),
    levelIMaps: parseMapList(parameters.levelIMaps),
    levelJMaps: parseMapList(parameters.levelJMaps),
    elevatorMaps: parseMapList(parameters.elevatorMaps),
    townMapId: parseInt(parameters.townMapId || 1),
    arenaMapId: parseInt(parameters.arenaMapId || 2),
    arenaMapX: parseInt(parameters.arenaMapX || 5),
    arenaMapY: parseInt(parameters.arenaMapY || 5),
    bossFloorMapId: parseInt(parameters.bossFloorMapId || 70),
    bossFloorX: parseInt(parameters.bossFloorX || 10),
    bossFloorY: parseInt(parameters.bossFloorY || 10),
    playerSpawnX: parseInt(parameters.playerSpawnX || 5),
    playerSpawnY: parseInt(parameters.playerSpawnY || 5),
    currentFloorVariable: parseInt(parameters.currentFloorVariable || 1),
    maxFloorVariable: parseInt(parameters.maxFloorVariable || 2),
    elevatorFloorVariable: parseInt(parameters.elevatorFloorVariable || 17),
    arenaToggleSwitch: parseInt(parameters.arenaToggleSwitch || 5),
  };

  const params = window.DungeonFloorSystemParams;

  //=============================================================================
  // Game_System additions for dungeon data
  //=============================================================================

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.initDungeonSystem();
  };

  Game_System.prototype.initDungeonSystem = function () {
    this._dungeonFloors = new Array(101).fill(0);
    this._dungeonGenerated = false;
    this._mapRegion13Cache = {};

    this._stairLocations = new Array(101);
    for (let i = 0; i <= 100; i++) {
      this._stairLocations[i] = {
        upstairs: { mapId: 0, x: 0, y: 0 },
        downstairs: { mapId: 0, x: 0, y: 0 },
      };
    }

    this._elevatorSpawnPoints = {};
  };

  Game_System.prototype.isDungeonGenerated = function () {
    return this._dungeonGenerated;
  };

  Game_System.prototype.hasRegion13 = function(mapId) {
      if (this._mapRegion13Cache.hasOwnProperty(mapId)) {
          return this._mapRegion13Cache[mapId];
      }

      const filename = "Map%1.json".format(mapId.padZero(3));
      const xhr = new XMLHttpRequest();
      const url = "data/" + filename;
      xhr.open("GET", url, false); // Synchronous request
      xhr.overrideMimeType("application/json");
      xhr.send();

      let hasRegion = false;
      if (xhr.status < 400) {
          try {
              const mapData = JSON.parse(xhr.responseText);
              const regionTiles = this.findRegion13Tiles(mapData);
              hasRegion = regionTiles.length > 0;
          } catch (e) {
              console.error("Error parsing map data for mapId " + mapId, e);
              hasRegion = false;
          }
      } else {
          console.error("Failed to load map data for mapId " + mapId);
          hasRegion = false;
      }

      this._mapRegion13Cache[mapId] = hasRegion;
      return hasRegion;
  };

  Game_System.prototype.generateDungeon = function () {
    const playerName = $gameActors.actor(1).name() || "Hero";
    this._seededRandom = createSeededRandom(playerName);
    this._mapRegion13Cache = {}; // Clear cache on new generation

    this._dungeonFloors[0] = $gameSwitches.value(params.arenaToggleSwitch)
      ? params.arenaMapId
      : params.townMapId;
    // Demo mode structure
      if (params.demoMode) {
        // Floor 0: map 1 (already set above)
        // Floor 1: map 101
        this._dungeonFloors[1] = 101;
        
        // Floor 2-9: Level Group A
        const levelAPool = [...params.levelAMaps];
        for (let floor = 2; floor <= 9; floor++) {
            if (levelAPool.length > 0) {
                const index = Math.floor(this._seededRandom() * levelAPool.length);
                this._dungeonFloors[floor] = levelAPool[index];
                if (levelAPool.length >= 8) {
                    levelAPool.splice(index, 1); // Remove to avoid duplicates if enough maps
                }
            }
        }
        
        // Floor 10: map 112
        this._dungeonFloors[10] = 112;
        
        // Floor 11-19: Level Group B
        const levelBPool = [...params.levelBMaps];
        for (let floor = 11; floor <= 19; floor++) {
            if (levelBPool.length > 0) {
                const index = Math.floor(this._seededRandom() * levelBPool.length);
                this._dungeonFloors[floor] = levelBPool[index];
                if (levelBPool.length >= 9) {
                    levelBPool.splice(index, 1);
                }
            }
        }
        
        // Floor 20: map 114
        this._dungeonFloors[20] = 114;
        
        // Floor 21-29: Level Group C
        const levelCPool = [...params.levelCMaps];
        for (let floor = 21; floor <= 29; floor++) {
            if (levelCPool.length > 0) {
                const index = Math.floor(this._seededRandom() * levelCPool.length);
                this._dungeonFloors[floor] = levelCPool[index];
                if (levelCPool.length >= 9) {
                    levelCPool.splice(index, 1);
                }
            }
        }
        
        // Floor 30: map 115
        this._dungeonFloors[30] = 115;
        
        // Initialize only up to floor 30 for demo mode
        this.initializeStairLocations();
        this._dungeonGenerated = true;
        $gameVariables.setValue(params.maxFloorVariable, 0);
        return;
    }
    const levelMaps = [
      params.levelAMaps,
      params.levelBMaps,
      params.levelCMaps,
      params.levelDMaps,
      params.levelEMaps,
      params.levelFMaps,
      params.levelGMaps,
      params.levelHMaps,
      params.levelIMaps,
      params.levelJMaps,
    ];

    // --- VALIDATION LOGIC ---
    const validatedLevelMaps = levelMaps.map(levelMapPool => {
        if (!levelMapPool) return [];
        const filteredPool = levelMapPool.map(mapInfo => {
            if (Array.isArray(mapInfo)) {
                // It's a multi-map group
                const validMapsInGroup = mapInfo.filter(mapId => this.hasRegion13(mapId));
                // A group needs at least two valid maps for an entrance and exit.
                if (validMapsInGroup.length >= 2) {
                    return validMapsInGroup; // Return the filtered, valid group
                }
                return null; // Invalid group, mark for removal
            } else {
                // It's a single map ID
                if (this.hasRegion13(mapInfo)) {
                    return mapInfo;
                }
                return null; // Invalid map, mark for removal
            }
        });
        // Remove the null entries from the pool
        return filteredPool.filter(item => item !== null);
    });
    // --- END VALIDATION ---


    this._dungeonFloors[100] = params.bossFloorMapId;

    const elevatorFloors = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const elevatorMaps = [...params.elevatorMaps];

    this._elevatorSpawnPoints = {};

    for (let i = 0; i < elevatorFloors.length; i++) {
      const floor = elevatorFloors[i];
      if (i < elevatorMaps.length) {
        this._dungeonFloors[floor] = elevatorMaps[i];
      } else {
        const randomIndex = Math.floor(
          this._seededRandom() * validatedLevelMaps[0].length
        );
        this._dungeonFloors[floor] = validatedLevelMaps[0][randomIndex];
      }
    }

    for (let level = 0; level < 10; level++) {
      const startFloor = level * 10 + 1;
      const endFloor = startFloor + 8;
      const levelMapPool = [...validatedLevelMaps[level]]; // Use validated maps
      const noDuplicates = levelMapPool.length >= 9;

      for (let floor = startFloor; floor <= endFloor; floor++) {
        if (floor === 1) {
          this._dungeonFloors[floor] = 101;
          continue;
        }
        if (levelMapPool.length === 0) {
            console.warn(`DungeonFloorSystem: No valid maps with Region ID 13 available for Level ${String.fromCharCode(65 + level)} (Floors ${startFloor}-${endFloor}).`);
            continue;
        };

        let index = Math.floor(this._seededRandom() * levelMapPool.length);
        const mapId = levelMapPool[index];
        this._dungeonFloors[floor] = mapId;

        if (noDuplicates) {
          levelMapPool.splice(index, 1);
        }
      }
    }

    this.initializeStairLocations();
    
    // --- DEBUG LOGGING START ---
    console.log("--- Dungeon Generation Debug Log ---");
    for (let floor = 1; floor < 100; floor++) {
      const mapInfo = this._dungeonFloors[floor];
      const stairData = this._stairLocations[floor];

      if (!mapInfo || !stairData) {
        console.log(`Floor ${floor}: No data available.`);
        continue;
      }

      const downstairs = stairData.downstairs;
      const upstairs = stairData.upstairs;

      if (!$dataMapInfos) {
         console.log("Cannot generate log: $dataMapInfos not loaded yet.");
         return;
      }

      if (Array.isArray(mapInfo) && mapInfo.length > 1) {
        // Multi-map floor
        const startRoomName = $dataMapInfos[downstairs.mapId] ? $dataMapInfos[downstairs.mapId].name : `MapID ${downstairs.mapId}`;
        const endRoomName = $dataMapInfos[upstairs.mapId] ? $dataMapInfos[upstairs.mapId].name : `MapID ${upstairs.mapId}`;

        console.log(
          `Floor ${String(floor).padEnd(3)}[Multi]: Start: '${startRoomName}' (Prev @ ${downstairs.x},${downstairs.y}) | End: '${endRoomName}' (Next @ ${upstairs.x},${upstairs.y})`
        );
      } else {
        // Single-map floor
        const mapId = downstairs.mapId;
        const mapName = $dataMapInfos[mapId] ? $dataMapInfos[mapId].name : `MapID ${mapId}`;
        console.log(
          `Floor ${String(floor).padEnd(3)}[Single]: Room: '${mapName}' -> Prev @ ${downstairs.x},${downstairs.y} | Next @ ${upstairs.x},${upstairs.y}`
        );
      }
    }
    console.log("--- End of Dungeon Log ---");
    // --- DEBUG LOGGING END ---

    this._dungeonGenerated = true;
    $gameVariables.setValue(params.maxFloorVariable, 0);
  };


  Game_System.prototype.getDungeonFloorMapId = function (floor) {
    if (floor === 0) {
      return $gameSwitches.value(params.arenaToggleSwitch)
        ? params.arenaMapId
        : params.townMapId;
    }

    if (floor < 1 || floor > 100) return params.townMapId;

    const mapInfo = this._dungeonFloors[floor];

    if (typeof mapInfo === "number" && mapInfo > 0) {
      return mapInfo;
    }

    if (Array.isArray(mapInfo) && mapInfo.length > 0) {
      return mapInfo[0]; // Return the first map as the "primary" map for the group
    }

    return params.townMapId; // Fallback
  };

  Game_System.prototype.initializeStairLocations = function () {
    const maxFloor = params.demoMode ? 30 : 99;
    for (let floor = 1; floor <= maxFloor; floor++) {
        this.initializeStairsForFloor(floor);
    }
};

  Game_System.prototype.initializeStairsForFloor = function (floor) {
    const mapInfo = this._dungeonFloors[floor];
    if (!mapInfo || floor === 1) return; // Special handling for floor 1 exists elsewhere

    const mapIdList = Array.isArray(mapInfo) ? mapInfo : [mapInfo];
    if (mapIdList.length === 0 || mapIdList[0] === 0) return;

    const defaultSpawn = (offset = 0) => ({
      mapId: mapIdList[0],
      x: params.playerSpawnX + offset,
      y: params.playerSpawnY,
    });

    // Helper to get tiles for a single map
    const getTilesForMap = (mapId) => {
      const filename = "Map%1.json".format(mapId.padZero(3));
      const xhr = new XMLHttpRequest();
      const url = "data/" + filename;
      xhr.open("GET", url, false);
      xhr.overrideMimeType("application/json");
      xhr.send();

      if (xhr.status < 400) {
        try {
          const mapData = JSON.parse(xhr.responseText);
          const regionTiles = this.findRegion13Tiles(mapData);
          const passableTiles = this.findPassableTiles(mapData);
          return { regionTiles, passableTiles };
        } catch (e) {
          console.error("Error parsing map data for mapId " + mapId, e);
        }
      } else {
        console.error("Failed to load map data for mapId " + mapId);
      }
      return { regionTiles: [], passableTiles: [] };
    };

    if (mapIdList.length > 1) {
      // MULTI-MAP LOGIC (Receives pre-validated list)
      const shuffledMapIds = [...mapIdList];
      for (let i = shuffledMapIds.length - 1; i > 0; i--) {
        const j = Math.floor(this._seededRandom() * (i + 1));
        [shuffledMapIds[i], shuffledMapIds[j]] = [
          shuffledMapIds[j],
          shuffledMapIds[i],
        ];
      }

      const startRoomMapId = shuffledMapIds[0];
      const endRoomMapId = shuffledMapIds[shuffledMapIds.length - 1];

      // Set downstairs (PrevFloor) in the start room
      let { regionTiles: startRegion } = getTilesForMap(startRoomMapId);
      if (startRegion.length > 0) {
        const loc =
          startRegion[Math.floor(this._seededRandom() * startRegion.length)];
        this._stairLocations[floor].downstairs = { ...loc, mapId: startRoomMapId };
      } else {
        this._stairLocations[floor].downstairs = {
          ...defaultSpawn(),
          mapId: startRoomMapId,
        };
      }

      // Set upstairs (NextFloor) in the end room
      let { regionTiles: endRegion } = getTilesForMap(endRoomMapId);
      if (endRegion.length > 0) {
        if (startRoomMapId === endRoomMapId && endRegion.length > 1) {
          const downstairsLoc = this._stairLocations[floor].downstairs;
          endRegion = endRegion.filter(
            (t) => t.x !== downstairsLoc.x || t.y !== downstairsLoc.y
          );
           if (endRegion.length === 0) { 
             let { regionTiles: originalRegion } = getTilesForMap(endRoomMapId);
             endRegion = originalRegion;
          }
        }
        const loc =
          endRegion[Math.floor(this._seededRandom() * endRegion.length)];
        this._stairLocations[floor].upstairs = { ...loc, mapId: endRoomMapId };
      } else {
        this._stairLocations[floor].upstairs = {
          ...defaultSpawn(1),
          mapId: endRoomMapId,
        };
      }
    } else {
      // SINGLE-MAP LOGIC
      const mapId = mapIdList[0];
      const { regionTiles, passableTiles } = getTilesForMap(mapId);

      if (regionTiles.length >= 2) {
        for (let i = regionTiles.length - 1; i > 0; i--) {
          const j = Math.floor(this._seededRandom() * (i + 1));
          [regionTiles[i], regionTiles[j]] = [regionTiles[j], regionTiles[i]];
        }
        this._stairLocations[floor].upstairs = { ...regionTiles[0], mapId };
        this._stairLocations[floor].downstairs = { ...regionTiles[1], mapId };
      } else if (regionTiles.length === 1) {
          this._stairLocations[floor].upstairs = { ...regionTiles[0], mapId };
          if(passableTiles.length > 0){
               const loc = passableTiles[Math.floor(this._seededRandom() * passableTiles.length)];
               this._stairLocations[floor].downstairs = { ...loc, mapId };
          } else {
               this._stairLocations[floor].downstairs = { ...defaultSpawn(), mapId };
          }
      }
      else { // 0 region tiles (should be rare now, but kept as fallback)
        if (passableTiles.length >= 2) {
             for (let i = passableTiles.length - 1; i > 0; i--) {
                const j = Math.floor(this._seededRandom() * (i + 1));
                [passableTiles[i], passableTiles[j]] = [passableTiles[j], passableTiles[i]];
            }
            this._stairLocations[floor].upstairs = { ...passableTiles[0], mapId };
            this._stairLocations[floor].downstairs = { ...passableTiles[1], mapId };
        } else if (passableTiles.length === 1) {
            this._stairLocations[floor].upstairs = { ...passableTiles[0], mapId };
            this._stairLocations[floor].downstairs = { ...defaultSpawn(), mapId };
        } else {
            this._stairLocations[floor].upstairs = { ...defaultSpawn(), mapId };
            this._stairLocations[floor].downstairs = { ...defaultSpawn(1), mapId };
        }
      }
    }
  };
  
  Game_System.prototype.findRegion13Tiles = function (mapData) {
    const width = mapData.width;
    const height = mapData.height;
    const region13Tiles = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const regionId = this.getRegionIdFromMapData(mapData, x, y);
        if (regionId === 13) {
          region13Tiles.push({ x, y });
        }
      }
    }
    return region13Tiles;
  };

  Game_System.prototype.findPassableTiles = function (mapData) {
    const width = mapData.width || 50;
    const height = mapData.height || 50;
    const passableTiles = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x > 2 && x < width - 2 && y > 2 && y < height - 2) {
          const regionId = this.getRegionIdFromMapData(mapData, x, y);
          if (regionId >= 0 && regionId <= 9) {
            passableTiles.push({ x, y });
          }
        }
      }
    }

    if (passableTiles.length > 50) {
      for (let i = passableTiles.length - 1; i > 0; i--) {
        const j = Math.floor(this._seededRandom() * (i + 1));
        [passableTiles[i], passableTiles[j]] = [
          passableTiles[j],
          passableTiles[i],
        ];
      }
      return passableTiles.slice(0, 50);
    }
    return passableTiles;
  };

  Game_System.prototype.getRegionIdFromMapData = function (mapData, x, y) {
    const regionLayerIndex = 5; // In MZ, layer 5 is typically regions.
    const index =
      y * mapData.width + x + regionLayerIndex * mapData.width * mapData.height;
    if (mapData.data && index < mapData.data.length) {
      const regionId = mapData.data[index];
      if (regionId > 0 && regionId < 256) {
        return regionId;
      }
    }
    return 0;
  };

  Game_System.prototype.getStairLocation = function (floor, isUpstairs) {
    const defaultLoc = {
      mapId: params.townMapId,
      x: params.playerSpawnX,
      y: params.playerSpawnY,
    };
    if (floor < 0 || floor > 100 || !this._stairLocations[floor])
      return defaultLoc;

    const loc = isUpstairs
      ? this._stairLocations[floor].upstairs
      : this._stairLocations[floor].downstairs;
    return loc && loc.mapId > 0 ? loc : defaultLoc;
  };

  Game_System.prototype.updateMaxFloor = function (floor) {
    const currentMax = $gameVariables.value(params.maxFloorVariable) || 0;
    if (floor > currentMax) {
      $gameVariables.setValue(params.maxFloorVariable, floor);
    }
  };

  //=============================================================================
  // Plugin Commands
  //=============================================================================

  PluginManager.registerCommand(pluginName, "generateDungeon", (args) => {
    $gameSystem.generateDungeon();
  });

  PluginManager.registerCommand(pluginName, "nextFloor", (args) => {
    const currentFloor = $gameVariables.value(params.currentFloorVariable);
    const maxFloor = params.demoMode ? 30 : 100;
    if (currentFloor < 0 || currentFloor >= maxFloor) {
        return;
    }
    moveToFloor(currentFloor === 0 ? 1 : currentFloor + 1, true);
});

  PluginManager.registerCommand(pluginName, "prevFloor", (args) => {
    const currentFloor = $gameVariables.value(params.currentFloorVariable);
    if (currentFloor <= 0) {
        return;
    }
    moveToFloor(currentFloor - 1, false); // false for going down
  });

  PluginManager.registerCommand(pluginName, "setFloor", (args) => {
    const floor = parseInt(args.floor || 1);
    const maxFloor = params.demoMode ? 30 : 100;
    if (floor > maxFloor) {
        console.warn(`Demo mode: Cannot go beyond floor ${maxFloor}`);
        return;
    }
    moveToFloor(floor, "downstairs");
});
PluginManager.registerCommand(pluginName, "elevator", (args) => {
  const floor = $gameVariables.value(params.elevatorFloorVariable);
  const maxFloor = params.demoMode ? 30 : 100;
  if (floor >= 0 && floor <= maxFloor) {
      moveToFloor(floor, "elevator");
  } else {
      console.error(
          "Invalid floor number in variable " +
          params.elevatorFloorVariable +
          ": " +
          floor +
          (params.demoMode ? " (Demo mode limit: 30)" : "")
      );
  }
});

  PluginManager.registerCommand(pluginName, "teleportToHighest", (args) => {
    const maxFloor = $gameVariables.value(params.maxFloorVariable);
    moveToFloor(maxFloor > 0 ? maxFloor : 1, null);
  });

  PluginManager.registerCommand(
    pluginName,
    "teleportToNearestStairs",
    (args) => {
      teleportToNearestStairs();
    }
  );

  PluginManager.registerCommand(pluginName, "teleportToUpstairs", (args) => {
    teleportToSpecificStairs(true);
  });

  PluginManager.registerCommand(pluginName, "teleportToDownstairs", (args) => {
    teleportToSpecificStairs(false);
  });

  //=============================================================================
  // Helper Functions
  //=============================================================================
  function findRegion20Spawn(mapId) {
    const filename = "Map%1.json".format(mapId.padZero(3));
    const xhr = new XMLHttpRequest();
    const url = "data/" + filename;
    
    try {
      xhr.open("GET", url, false);
      xhr.overrideMimeType("application/json");
      xhr.send();

      if (xhr.status < 400) {
        const mapData = JSON.parse(xhr.responseText);
        const width = mapData.width;
        const height = mapData.height;

        // Search for the first tile with region ID 20
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const regionId = $gameSystem.getRegionIdFromMapData(mapData, x, y);
            if (regionId === 20) {
              return { x: x, y: y };
            }
          }
        }
      }
    } catch (e) {
      console.error("Error loading map data for elevator spawn on mapId " + mapId, e);
    }

    return null; // Return null if no region 20 tile found
  }
  
  function moveToFloor(floor, spawnMode) {
    if (!$gameSystem.isDungeonGenerated()) {
        $gameSystem.generateDungeon();
    }

    const previousFloor = $gameVariables.value(params.currentFloorVariable);
    $gameVariables.setValue(params.currentFloorVariable, floor);
    $gameVariables.setValue(params.elevatorFloorVariable, floor);

    if (floor > 0) {
        $gameSystem.updateMaxFloor(floor);
    }

    let mapId, x, y, direction = 0;

    $gameTemp._showFloorDisplay = true;
    $gameTemp._isElevatorTransfer = false; // Initialize the flag
    $gameScreen.startFadeOut(1);

    // Hardcoded transition: From Town to Floor 1
    if (floor === 1 && previousFloor === 0) {
        mapId = 101;
        x = 15;
        y = 38;
        direction = 8; // Face up
    // Hardcoded transition: From Floor 1 to Town
    } else if (floor === 0 && previousFloor === 1) {
        mapId = params.townMapId;
        x = 21;
        y = 21;
        direction = 2; // Face down
    // Generic "go to town" from any other floor
    } else if (floor === 0) {
        mapId = $gameSwitches.value(params.arenaToggleSwitch) ? params.arenaMapId : params.townMapId;
        x = $gameSwitches.value(params.arenaToggleSwitch) ? params.arenaMapX : params.playerSpawnX;
        y = $gameSwitches.value(params.arenaToggleSwitch) ? params.arenaMapY : params.playerSpawnY;
    } else if (floor === 100) {
        mapId = params.bossFloorMapId;
        x = params.bossFloorX;
        y = params.bossFloorY;
    } else if (floor === 1 && previousFloor === 2) {
        mapId = $gameSystem.getDungeonFloorMapId(1);
        x = 17;
        y = 19;
        direction = 2;
    } else {
        let stairLocation;
        switch (spawnMode) {
            case "elevator":
                $gameTemp._isElevatorTransfer = true; // Set flag for elevator transfer
                mapId = $gameSystem.getDungeonFloorMapId(floor);
                const elevatorSpawn = findRegion20Spawn(mapId);
                if (elevatorSpawn) {
                    x = elevatorSpawn.x;
                    y = elevatorSpawn.y;
                    direction = 2; // Face downwards
                } else {
                    stairLocation = $gameSystem.getStairLocation(floor, false);
                    mapId = stairLocation.mapId;
                    x = stairLocation.x;
                    y = stairLocation.y;
                    direction = 2; // Face downwards
                }
                break;
            case true: // Going up
                stairLocation = $gameSystem.getStairLocation(floor, false); // Arrive at downstairs
                mapId = stairLocation.mapId;
                x = stairLocation.x;
                y = stairLocation.y;
                break;
            case false: // Going down
                stairLocation = $gameSystem.getStairLocation(floor, true); // Arrive at upstairs
                mapId = stairLocation.mapId;
                x = stairLocation.x;
                y = stairLocation.y;
                break;
            case "downstairs":
                stairLocation = $gameSystem.getStairLocation(floor, false);
                mapId = stairLocation.mapId;
                x = stairLocation.x; 
                y = stairLocation.y;
                break;
            default: // Default/fallback spawn
                mapId = $gameSystem.getDungeonFloorMapId(floor);
                x = params.playerSpawnX;
                y = params.playerSpawnY;
                break;
        }
    }

    if (mapId > 0) {
        $gamePlayer.reserveTransfer(mapId, x, y, direction);
    } else {
        console.error("DungeonFloorSystem: Invalid Map ID (0) for floor " + floor);
    }
  }
  

  function teleportToNearestStairs() {
    const currentFloor = $gameVariables.value(params.currentFloorVariable);
    const currentMapId = $gameMap.mapId();
    if (currentFloor <= 0 || currentFloor >= 100) return;

    const upstairsLoc = $gameSystem.getStairLocation(currentFloor, true);
    const downstairsLoc = $gameSystem.getStairLocation(currentFloor, false);
    const playerX = $gamePlayer.x;
    const playerY = $gamePlayer.y;

    let distToUpstairs = Infinity;
    if (upstairsLoc.mapId === currentMapId) {
      distToUpstairs = Math.hypot(
        playerX - upstairsLoc.x,
        playerY - upstairsLoc.y
      );
    }

    let distToDownstairs = Infinity;
    if (downstairsLoc.mapId === currentMapId) {
      distToDownstairs = Math.hypot(
        playerX - downstairsLoc.x,
        playerY - downstairsLoc.y
      );
    }

    let targetLoc = null;
    if (distToUpstairs <= distToDownstairs && distToUpstairs !== Infinity) {
      targetLoc = upstairsLoc;
    } else if (
      distToDownstairs < distToUpstairs &&
      distToDownstairs !== Infinity
    ) {
      targetLoc = downstairsLoc;
    }

    if (targetLoc) {
      teleportToAdjacentTile(targetLoc.x, targetLoc.y);
    }
  }

  function teleportToSpecificStairs(isUpstairs) {
    const currentFloor = $gameVariables.value(params.currentFloorVariable);
    const currentMapId = $gameMap.mapId();
    if (currentFloor <= 0 || currentFloor >= 100) return;

    const stairLoc = $gameSystem.getStairLocation(currentFloor, isUpstairs);

    if (stairLoc.mapId === currentMapId) {
      teleportToAdjacentTile(stairLoc.x, stairLoc.y);
    }
  }

  function teleportToAdjacentTile(targetX, targetY) {
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 1 },
      { dx: -1, dy: -1 },
    ];

    for (const dir of directions) {
      const checkX = targetX + dir.dx;
      const checkY = targetY + dir.dy;
      if ($gameMap.isPassable(checkX, checkY, 0)) {
        $gamePlayer.locate(checkX, checkY);
        $gameScreen.startFlash([0, 0, 0, 128], 30);
        return;
      }
    }

    $gamePlayer.locate(targetX, targetY);
    $gameScreen.startFlash([0, 0, 0, 128], 30);
  }

  function repositionStairEvents() {
    if (!$gameMap || !$gameSystem || !$gameSystem._stairLocations) return;

    const currentMapId = $gameMap.mapId();
    // Exemption for specific map IDs where event positions are fixed.
    if (currentMapId === 1 || currentMapId === 101 || currentMapId === 300) {
        return;
    }

    const currentFloor = $gameVariables.value(params.currentFloorVariable);
    if (currentFloor <= 0 || currentFloor >= 100) return;

    const upstairsLoc = $gameSystem.getStairLocation(currentFloor, true);
    const downstairsLoc = $gameSystem.getStairLocation(currentFloor, false);

    const events = $gameMap.events();
    for (const event of events) {
      if (!event || !event.event()?.name) continue;

      const eventName = event.event().name;

      if (eventName === "NextFloor") {
        if (upstairsLoc.mapId === currentMapId) {
          event.locate(upstairsLoc.x, upstairsLoc.y);
          event.setOpacity(255); // Ensure event is visible
          event.setThrough(true); // Ensure event is not "through"
        } else {
          event.locate(-1, -1); // Move off-screen to "delete"
          event.setOpacity(0);   // Make it invisible
        }
      } else if (eventName === "PrevFloor") {
        if (downstairsLoc.mapId === currentMapId) {
          event.locate(downstairsLoc.x, downstairsLoc.y);
          event.setOpacity(255);
          event.setThrough(true);
        } else {
          event.locate(-1, -1);
          event.setOpacity(0);
        }
      }
    }
  }

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function () {
    _Scene_Map_onMapLoaded.call(this);
    repositionStairEvents();
    $gameScreen.startFadeIn(15);
  };

  //=============================================================================
  // Floor Display Window
  //=============================================================================

  function Window_FloorDisplay() {
    this.initialize(...arguments);
  }

  Window_FloorDisplay.prototype = Object.create(Window_Base.prototype);
  Window_FloorDisplay.prototype.constructor = Window_FloorDisplay;

  Window_FloorDisplay.prototype.initialize = function () {
    const rect = new Rectangle(10, 10, 240, this.fittingHeight(1));
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 255;
    this.contentsOpacity = 0;
    this._showCount = 0;
    this.refresh();
    this.close();
  };

  Window_FloorDisplay.prototype.close = function () {
    this.contentsOpacity = 0;
    this.visible = false;
  };

  Window_FloorDisplay.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._showCount > 0) {
      this._showCount--;
      this.contentsOpacity = Math.min(255, this.contentsOpacity + 16);
    } else if (this.contentsOpacity > 0) {
      this.contentsOpacity -= 16;
      if (this.contentsOpacity === 0) {
        this.visible = false;
      }
    }
  };

  Window_FloorDisplay.prototype.open = function (floor) {
    this._floor = floor;
    this.refresh();
    this._showCount = 90;
    this.contentsOpacity = 0;
    this.visible = true;
  };

  Window_FloorDisplay.prototype.refresh = function () {
    this.contents.clear();
    let floorText;
    if (this._floor === 0) {
      floorText = $gameSwitches.value(params.arenaToggleSwitch)
        ? "Arena"
        : "Town";
    } else if (this._floor === 100) {
      floorText = "Final Floor";
    } else {
      floorText = "Floor " + this._floor;
    }

    this.contents.fontSize = 20;
    this.drawText(floorText, 0, 0, this.contents.width, "center");
  };
  /* const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createFloorDisplayWindow();
    };
    
    Scene_Map.prototype.createFloorDisplayWindow = function() {
        this._floorDisplayWindow = new Window_FloorDisplay();
        this.addWindow(this._floorDisplayWindow);
    };
  */
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
      _Scene_Map_start.call(this);
      if ($gameTemp && $gameTemp._showFloorDisplay) {
        const currentFloor = $gameVariables.value(params.currentFloorVariable);
        //this._floorDisplayWindow.open(currentFloor);
        //$gameTemp._showFloorDisplay = false;
        repositionStairEvents();
        

        $gameTemp._showFloorDisplay = false;
        $gameTemp._isElevatorTransfer = false; // Reset the flag
      }
    };
  const _Game_Map_displayName = Game_Map.prototype.displayName;
  Game_Map.prototype.displayName = function() {
    // get the original map name
    const original = _Game_Map_displayName.call(this);
    // if there's no map name, don't show anything (and thus no floor)
    if (!original || original.trim() === '') {
      return '';
    }
    // for non-town maps, append the floor if > 0
    if (this.mapId() !== params.townMapId) {
      const floor = $gameVariables.value(params.currentFloorVariable);
      if (floor > 0) {
        return 'FL: ' + floor + " " + original;
      }
    }
    // otherwise just return the original
    return original;
  };
  // Make the Map Name window wide enough to fit "MapName Floor: X"
  const _Window_MapName_windowWidth = Window_MapName.prototype.windowWidth;
  Window_MapName.prototype.windowWidth = function () {
    // get the full display string
    const text = $gameMap.displayName();
    // measure it (textWidth) + padding
    const padding = this.standardPadding() * 2;
    const textWidth = this.textWidth(text);
    const desired = textWidth + padding + 20; // add a little extra
    // never exceed screen width
    return Math.min(desired, Graphics.boxWidth);
  };
})();