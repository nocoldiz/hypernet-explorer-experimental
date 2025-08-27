/*:
 * @target MZ
 * @plugindesc Handles a system of treasure rooms and houses that can be accessed randomly from specific locations.
 * @author Claude
 * @url [Your Website URL]
 * 
 * @param treasureRooms
 * @text Treasure Rooms
 * @desc Comma-separated list of map IDs to use as treasure rooms
 * @default 5,6,7,8,9
 * 
 * @param treasureRoomAssociations
 * @text Treasure Room Associations
 * @desc Maps that always lead to specific treasure rooms (format: sourceMapID:treasureMapID,...)
 * @default 1:5,2:6,3:7
 * 
 * @param houseList
 * @text House List
 * @desc Comma-separated list of map IDs to use as houses (can be reused)
 * @default 10,11,12
 * 
 * @param spawnRegionId
 * @text Spawn Region ID
 * @desc Region ID to spawn player at in treasure room/house (default: 13)
 * @type number
 * @default 13
 * 
 * @command visitTreasureRoom
 * @text Visit Treasure Room
 * @desc Transports the player to a random unique treasure room
 * 
 * @command exitTreasureRoom
 * @text Exit Treasure Room
 * @desc Transports the player back to where they were before entering the treasure room
 * 
 * @command visitHouse
 * @text Visit House
 * @desc Transports the player to a house with modified NPCs
 * 
 * @command exitHouse
 * @text Exit House
 * @desc Transports the player back to where they were before entering the house
 * 
 * @help
 * ============================================================================
 * Treasure Room and House System
 * ============================================================================
 * 
 * This plugin allows you to create a system of treasure rooms and houses that
 * the player can visit. 
 * 
 * TREASURE ROOMS:
 * When the player activates a "Visit Treasure Room" event, they will be 
 * transported to a randomly selected treasure room. Each activation point
 * consistently leads to the same treasure room.
 * 
 * HOUSES:
 * When the player activates a "Visit House" event, they will be transported
 * to a house map. House maps can be reused. NPCs in house maps will be
 * modified based on seeded randomization:
 * - Events with notes starting with "NPC" will have their graphics changed
 * - A random number (0-4) of NPC events will be deleted
 * - Changes are consistent based on the activation location
 * 
 * When entering a treasure room or house, the player will be placed on a tile
 * with Region ID 13 (configurable in plugin parameters).
 * 
 * ============================================================================
 * Map Note Tags
 * ============================================================================
 * 
 * You can use the following note tag in treasure room/house maps to specify
 * the player's direction when entering:
 * 
 * <treasureRoomDirection:down>
 * <houseDirection:down>
 * 
 * Valid directions are: up, down, left, right
 * 
 * ============================================================================
 * Event Note Tags
 * ============================================================================
 * 
 * For house maps, mark NPC events with notes starting with "NPC":
 * 
 * NPC_Villager
 * NPC_Merchant
 * NPC_Guard
 * 
 * These events will have their graphics randomly changed and some may be deleted.
 * 
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * 
 * Visit Treasure Room: Transports to a random treasure room
 * Exit Treasure Room: Returns from treasure room
 * Visit House: Transports to a house with modified NPCs
 * Exit House: Returns from house
 */

(() => {
    'use strict';
    const pluginName = "TreasureRoomSystem";
    
    //=============================================================================
    // Plugin Parameters
    //=============================================================================
    
    const parameters = PluginManager.parameters(pluginName);
    const treasureRoomList = String(parameters['treasureRooms'] || '').split(',').map(Number);
    const treasureRoomAssociationsRaw = String(parameters['treasureRoomAssociations'] || '');
    const houseList = String(parameters['houseList'] || '').split(',').map(Number);
    
    // Parse treasure room associations
    const treasureRoomAssociations = {};
    if (treasureRoomAssociationsRaw) {
        treasureRoomAssociationsRaw.split(',').forEach(pair => {
            const [sourceMap, treasureMap] = pair.split(':').map(Number);
            treasureRoomAssociations[sourceMap] = treasureMap;
        });
    }
    
    // Storage for visited treasure rooms and return points
    const visitedTreasureRooms = {};
    const treasureRoomReturnPoints = {}; // Maps treasure room ID to return point
    const houseReturnPoints = {}; // Maps house session ID to return point
    const houseModifications = {}; // Cache for house modifications by location key
    
    // Current session tracking
    let currentHouseSessionId = null;
    
    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "visitTreasureRoom", args => {
        visitTreasureRoom();
    });
    
    PluginManager.registerCommand(pluginName, "exitTreasureRoom", args => {
        exitTreasureRoom();
    });
    
    PluginManager.registerCommand(pluginName, "visitHouse", args => {
        visitHouse();
    });
    
    PluginManager.registerCommand(pluginName, "exitHouse", args => {
        exitHouse();
    });
    
    //=============================================================================
    // Utility Functions
    //=============================================================================
    
    // Create a unique key based on the player's current location
    function createLocationKey() {
        const mapId = $gameMap.mapId();
        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        return `${mapId}_${x}_${y}`;
    }
    
    // Seeded random number generator
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
    
    // Create a seed from location
    function createSeed(mapId, x, y) {
        return mapId * 1000000 + x * 1000 + y;
    }
    
    // Get random value from array using seeded random
    function getSeededRandomFromArray(array, seed) {
        if (array.length === 0) return null;
        const index = Math.floor(seededRandom(seed) * array.length);
        return array[index];
    }
    
    // Get seeded random integer in range [min, max]
    function getSeededRandomInt(min, max, seed) {
        return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
    }
    
    //=============================================================================
    // Treasure Room Functions
    //=============================================================================
    
    // Save the current location as a return point for a specific treasure room
    function saveReturnPoint(treasureRoomId) {
        const returnPoint = {
            mapId: $gameMap.mapId(),
            x: $gamePlayer.x,
            y: $gamePlayer.y,
            direction: $gamePlayer.direction()
        };
        
        treasureRoomReturnPoints[treasureRoomId] = returnPoint;
    }
    
    // Select a treasure room based on current map and player position or random available room
    function selectTreasureRoom() {
        const currentMapId = $gameMap.mapId();
        const locationKey = createLocationKey();
        
        // If there's an association for the current map, use that treasure room
        if (treasureRoomAssociations[currentMapId]) {
            return treasureRoomAssociations[currentMapId];
        }
        
        // Check if this specific location already has a treasure room assigned
        if (visitedTreasureRooms[locationKey]) {
            return visitedTreasureRooms[locationKey];
        }
        
        // Otherwise, select a random unvisited treasure room if possible
        const usedRoomIds = Object.values(visitedTreasureRooms);
        const availableRooms = treasureRoomList.filter(roomId => !usedRoomIds.includes(roomId));
        
        if (availableRooms.length > 0) {
            const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
            visitedTreasureRooms[locationKey] = randomRoom;
            return randomRoom;
        } else {
            // If all rooms have been visited, pick a random room
            const randomRoom = treasureRoomList[Math.floor(Math.random() * treasureRoomList.length)];
            visitedTreasureRooms[locationKey] = randomRoom;
            return randomRoom;
        }
    }
    
    //=============================================================================
    // House Functions
    //=============================================================================
    
    // Save return point for house visit
    function saveHouseReturnPoint() {
        const returnPoint = {
            mapId: $gameMap.mapId(),
            x: $gamePlayer.x,
            y: $gamePlayer.y,
            direction: $gamePlayer.direction()
        };
        
        const sessionId = Date.now() + '_' + Math.random();
        houseReturnPoints[sessionId] = returnPoint;
        currentHouseSessionId = sessionId;
        return sessionId;
    }
    
    // Select a house based on seeded randomization
    function selectHouse(seed) {
        if (houseList.length === 0) return null;
        return getSeededRandomFromArray(houseList, seed);
    }
    
    // Get all available character graphics for NPC replacement
    function getAvailableCharacterGraphics() {
        // This is a simplified list - you may want to expand this based on your game's available graphics
        const characterFiles = [
            'Heroes01Color', 'Actor1', 'FarmCharacters01RM', 'Npcs01Color', 'Npcs03Color','School01RM'
        ];
        
        const graphics = [];
        characterFiles.forEach(filename => {
            for (let i = 0; i < 8; i++) { // 8 characters per file
                graphics.push({
                    characterName: filename,
                    characterIndex: i
                });
            }
        });
        
        return graphics;
    }
    
    // Modify NPCs in the house based on seeded randomization
    function modifyHouseNPCs(mapId, seed) {
        const locationKey = createLocationKey();
        
        // Check if we already have modifications cached for this location
        if (houseModifications[locationKey]) {
            applyHouseModifications(houseModifications[locationKey]);
            return;
        }
        
        // Find all NPC events
        const npcEvents = [];
        $dataMap.events.forEach((event, index) => {
            if (event && event.note && event.note.startsWith('NPC')) {
                npcEvents.push(index);
            }
        });
        
        if (npcEvents.length === 0) {
            houseModifications[locationKey] = { deletedEvents: [], modifiedEvents: [] };
            return;
        }
        
        const availableGraphics = getAvailableCharacterGraphics();
        const modifications = {
            deletedEvents: [],
            modifiedEvents: []
        };
        
        // Determine how many NPCs to delete (0-4)
        const numToDelete = getSeededRandomInt(0, Math.min(4, npcEvents.length), seed);
        
        // Select which NPCs to delete
        const shuffledNPCs = [...npcEvents];
        for (let i = 0; i < numToDelete; i++) {
            const randomIndex = getSeededRandomInt(0, shuffledNPCs.length - 1, seed + i * 1000);
            const eventIdToDelete = shuffledNPCs.splice(randomIndex, 1)[0];
            modifications.deletedEvents.push(eventIdToDelete);
        }
        
        // Modify graphics for remaining NPCs
        shuffledNPCs.forEach((eventId, index) => {
            const newGraphic = getSeededRandomFromArray(availableGraphics, seed + eventId * 100);
            modifications.modifiedEvents.push({
                eventId: eventId,
                characterName: newGraphic.characterName,
                characterIndex: newGraphic.characterIndex
            });
        });
        
        // Cache and apply modifications
        houseModifications[locationKey] = modifications;
        applyHouseModifications(modifications);
    }
    
    // Apply the cached house modifications
    function applyHouseModifications(modifications) {
        // Delete events
        modifications.deletedEvents.forEach(eventId => {
            if ($gameMap.event(eventId)) {
                $gameMap.event(eventId).erase();
            }
        });
        
        // Modify remaining events
        modifications.modifiedEvents.forEach(mod => {
            const event = $gameMap.event(mod.eventId);
            if (event) {
                event.setImage(mod.characterName, mod.characterIndex);
            }
        });
        
        // Refresh the map
        $gameMap.refresh();
    }
    
    //=============================================================================
    // Common Functions
    //=============================================================================
    
    // Find a position with the specified region ID
    function findPositionWithRegionId(mapId, regionId) {
        if (!$dataMap) {
            return { x: 0, y: 0 };
        }
        
        const width = $dataMap.width;
        const height = $dataMap.height;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if ($gameMap.regionId(x, y) === regionId) {
                    return { x, y };
                }
            }
        }
        
        return { x: 0, y: 0 };
    }
    
    // Get direction from map note tags
    function getMapDirection(mapId, tagName) {
        if ($gameMap.mapId() === mapId && $dataMap && $dataMap.note) {
            const noteMatch = $dataMap.note.match(new RegExp(`<${tagName}:(\\w+)>`, 'i'));
            if (noteMatch) {
                const directionText = noteMatch[1].toLowerCase();
                switch (directionText) {
                    case 'down': return 2;
                    case 'left': return 4;
                    case 'right': return 6;
                    case 'up': return 8;
                    default: return null;
                }
            }
        }
        return null;
    }
    
    //=============================================================================
    // Main Visit Functions
    //=============================================================================
    
    // Visit a treasure room
    function visitTreasureRoom() {
        if (treasureRoomList.length === 0) {
            console.error("No treasure rooms defined in plugin parameters");
            return;
        }
        
        const treasureRoomId = selectTreasureRoom();
        saveReturnPoint(treasureRoomId);
        
        const originalDirection = $gamePlayer.direction();
        const spawnRegionId = Number(parameters['spawnRegionId'] || 13);
        
        $gamePlayer.reserveTransfer(treasureRoomId, 0, 0, originalDirection, 0);
        
        const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
        Scene_Map.prototype.onMapLoaded = function() {
            _Scene_Map_onMapLoaded.call(this);
            
            const position = findPositionWithRegionId($gameMap.mapId(), spawnRegionId);
            const treasureRoomDirection = getMapDirection($gameMap.mapId(), 'treasureRoomDirection');
            
            $gamePlayer.locate(position.x, position.y);
            
            if (treasureRoomDirection !== null) {
                $gamePlayer.setDirection(treasureRoomDirection);
            } else {
                $gamePlayer.setDirection(originalDirection);
            }
            
            Scene_Map.prototype.onMapLoaded = _Scene_Map_onMapLoaded;
        };
    }
    
    // Visit a house
    function visitHouse() {
        if (houseList.length === 0) {
            console.error("No houses defined in plugin parameters");
            return;
        }
        
        // Create seed based on current location
        const currentMapId = $gameMap.mapId();
        const playerX = $gamePlayer.x;
        const playerY = $gamePlayer.y;
        const seed = createSeed(currentMapId, playerX, playerY);
        
        // Save return point
        saveHouseReturnPoint();
        
        // Select house
        const houseId = selectHouse(seed);
        if (!houseId) {
            console.error("Failed to select a house");
            return;
        }
        
        const originalDirection = $gamePlayer.direction();
        const spawnRegionId = Number(parameters['spawnRegionId'] || 13);
        
        $gamePlayer.reserveTransfer(houseId, 0, 0, originalDirection, 0);
        
        const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
        Scene_Map.prototype.onMapLoaded = function() {
            _Scene_Map_onMapLoaded.call(this);
            
            const position = findPositionWithRegionId($gameMap.mapId(), spawnRegionId);
            const houseDirection = getMapDirection($gameMap.mapId(), 'houseDirection');
            
            $gamePlayer.locate(position.x, position.y);
            
            if (houseDirection !== null) {
                $gamePlayer.setDirection(houseDirection);
            } else {
                $gamePlayer.setDirection(originalDirection);
            }
            
            // Modify NPCs based on the original location's seed
            modifyHouseNPCs($gameMap.mapId(), seed);
            
            Scene_Map.prototype.onMapLoaded = _Scene_Map_onMapLoaded;
        };
    }
    
    // Exit the treasure room
    function exitTreasureRoom() {
        const currentTreasureRoomId = $gameMap.mapId();
        
        if (treasureRoomReturnPoints[currentTreasureRoomId]) {
            const returnPoint = treasureRoomReturnPoints[currentTreasureRoomId];
            $gamePlayer.reserveTransfer(
                returnPoint.mapId,
                returnPoint.x,
                returnPoint.y,
                2,
                0
            );
        } else {
            console.error("No return point saved for treasure room " + currentTreasureRoomId);
        }
    }
    
    // Exit the house
    function exitHouse() {
        if (currentHouseSessionId && houseReturnPoints[currentHouseSessionId]) {
            const returnPoint = houseReturnPoints[currentHouseSessionId];
            $gamePlayer.reserveTransfer(
                returnPoint.mapId,
                returnPoint.x,
                returnPoint.y,
                2,
                0
            );
            
            // Clean up the session
            delete houseReturnPoints[currentHouseSessionId];
            currentHouseSessionId = null;
        } else {
            console.error("No return point saved for current house session");
        }
    }
    
    //=============================================================================
    // Plugin Management
    //=============================================================================
    
    // Reset on new game
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        
        // Clear treasure room data
        for (const key in visitedTreasureRooms) {
            delete visitedTreasureRooms[key];
        }
        for (const key in treasureRoomReturnPoints) {
            delete treasureRoomReturnPoints[key];
        }
        
        // Clear house data
        for (const key in houseReturnPoints) {
            delete houseReturnPoints[key];
        }
        for (const key in houseModifications) {
            delete houseModifications[key];
        }
        
        currentHouseSessionId = null;
    };
    
    // Save game data
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.treasureRoomSystem = {
            visitedTreasureRooms: visitedTreasureRooms,
            treasureRoomReturnPoints: treasureRoomReturnPoints,
            houseReturnPoints: houseReturnPoints,
            houseModifications: houseModifications,
            currentHouseSessionId: currentHouseSessionId
        };
        return contents;
    };
    
    // Load game data
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.treasureRoomSystem) {
            // Clear existing data
            for (const key in visitedTreasureRooms) {
                delete visitedTreasureRooms[key];
            }
            for (const key in treasureRoomReturnPoints) {
                delete treasureRoomReturnPoints[key];
            }
            for (const key in houseReturnPoints) {
                delete houseReturnPoints[key];
            }
            for (const key in houseModifications) {
                delete houseModifications[key];
            }
            
            // Load saved data
            const system = contents.treasureRoomSystem;
            
            // Load treasure room data
            for (const key in system.visitedTreasureRooms || {}) {
                visitedTreasureRooms[key] = system.visitedTreasureRooms[key];
            }
            for (const key in system.treasureRoomReturnPoints || {}) {
                treasureRoomReturnPoints[key] = system.treasureRoomReturnPoints[key];
            }
            
            // Load house data
            for (const key in system.houseReturnPoints || {}) {
                houseReturnPoints[key] = system.houseReturnPoints[key];
            }
            for (const key in system.houseModifications || {}) {
                houseModifications[key] = system.houseModifications[key];
            }
            
            currentHouseSessionId = system.currentHouseSessionId || null;
        }
    };
})();