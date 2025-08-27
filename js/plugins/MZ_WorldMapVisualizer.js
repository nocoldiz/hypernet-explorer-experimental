/*:
 * @target MZ
 * @plugindesc World Map Visualizer v1.4.1 (VRAM Optimized)
 * @author Nocoldiz + Gemini + ChatGPT + Claude (with VRAM optimizations)
 * @url
 * @help
 * ============================================================================
 * World Map Visualizer Plugin for RPG Maker MZ (VRAM Optimized)
 * ============================================================================
 *
 * This plugin creates an interactive world map that shows all game maps
 * and their connections.
 *
 * v1.4.1 (VRAM Optimizations):
 * - Compass only created when needed (destination is set)
 * - Pre-calculates waypoint coordinates to avoid constant event searching
 * - Compass only active on maps that are part of the current path
 * - Significantly reduced VRAM usage and processing overhead
 *
 * v1.4.0 (Enhancements):
 * - Click a map node to select it as a destination. The shortest path from
 * your current location will be highlighted in green.
 * - When a destination is selected, an in-game compass will appear on the
 * top-right of the screen, pointing to the nearest event on your path.
 * - Compass is hidden when you reach the destination or deselect the map.
 * - Destination selection is remembered when you close and reopen the map.
 *
 * Features:
 * - Zoomable and pannable world map
 * - Uniformly sized map nodes
 * - Auto-centering on the current map
 * - Reads Transfer Player events and events starting with "Door"
 * - Menu command integration
 * - Display depth limit from current map
 * - Special "Teleport Hub" view for a designated map
 * - Shortest path highlighting
 * - Memory-efficient in-game destination compass
 *
 * @param menuCommandName
 * @text Menu Command Name
 * @desc Name of the command in the main menu
 * @type string
 * @default World Map
 *
 * @param enableMenuCommand
 * @text Enable Menu Command
 * @desc Add world map command to main menu
 * @type boolean
 * @default true
 *
 * @param nodeWidth
 * @text Map Node Width
 * @desc The width of each map node on the visualizer.
 * @type number
 * @default 180
 *
 * @param nodeHeight
 * @text Map Node Height
 * @desc The height of each map node on the visualizer.
 * @type number
 * @default 180
 *
 * @param unvisitedMapName
 * @text Unvisited Map Name
 * @desc Text shown for unvisited maps
 * @type string
 * @default ???
 *
 * @param backgroundColor
 * @text Background Color
 * @desc Background color of the world map (hex)
 * @type string
 * @default #1a1a1a
 *
 * @param gridColor
 * @text Grid Color
 * @desc Color of the background grid (hex)
 * @type string
 * @default #2a2a2a
 *
 * @param displayDepth
 * @text Display Depth
 * @desc The depth of connections to show from the current map. 0 for all.
 * @type number
 * @default 2
 *
 * @param ignoredMaps
 * @text Ignored Maps
 * @desc Comma-separated list of Map IDs to ignore for connections.
 * @type string
 * @default 3,315
 *
 * @param teleportHubId
 * @text Teleport Hub ID
 * @desc The ID of the map that acts as a special teleport hub.
 * @type number
 * @default 315
 *
 */

(() => {
    'use strict';

    const pluginName = 'MZ_WorldMapVisualizer';
    const parameters = PluginManager.parameters(pluginName);

    const menuCommandName = parameters['menuCommandName'] || 'World Map';
    const enableMenuCommand = parameters['enableMenuCommand'] === 'true';
    const nodeWidth = Number(parameters['nodeWidth']) || 180;
    const nodeHeight = Number(parameters['nodeHeight']) || 180;
    const unvisitedMapName = parameters['unvisitedMapName'] || '???';
    const backgroundColor = parameters['backgroundColor'] || '#1a1a1a';
    const gridColor = parameters['gridColor'] || '#2a2a2a';
    const displayDepth = Number(parameters['displayDepth']) || 2;
    const ignoredMapIds = (parameters['ignoredMaps'] || '').split(',').map(Number).filter(id => id > 0);
    const teleportHubId = Number(parameters['teleportHubId']) || 0;

    // ============================================================================
    // NEW: Enhanced Game System for Compass Optimization
    // ============================================================================

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._visitedMaps = this._visitedMaps || new Set();
        this._worldMapDestinationId = this._worldMapDestinationId || null;
        this._mapConnectionGraph = this._mapConnectionGraph || null;
        // NEW: Compass optimization data
        this._compassWaypoints = this._compassWaypoints || new Map(); // mapId -> {x, y, targetMapId}
        this._compassActiveMaps = this._compassActiveMaps || new Set(); // Set of map IDs where compass should be active
    };
    
    // NEW: Enhanced player transfer with compass management
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        const oldMapId = this._newMapId;
        _Game_Player_performTransfer.call(this);
        if (!$gameSystem._visitedMaps) {
            $gameSystem._visitedMaps = new Set();
        }
        $gameSystem._visitedMaps.add($gameMap.mapId());
        
        // NEW: Update compass when map changes
        this.updateCompassOnMapChange();
    };

    // NEW: Compass update logic
    Game_Player.prototype.updateCompassOnMapChange = function() {
        const scene = SceneManager._scene;
        if (!(scene instanceof Scene_Map)) return;
        
        const currentMapId = $gameMap.mapId();
        const shouldShowCompass = $gameSystem._compassActiveMaps && 
                                 $gameSystem._compassActiveMaps.has(currentMapId) &&
                                 $gameSystem._worldMapDestinationId &&
                                 $gameSystem._worldMapDestinationId !== currentMapId;
        
        if (shouldShowCompass && !scene._compassSprite) {
            scene.createCompassSprite();
        } else if (!shouldShowCompass && scene._compassSprite) {
            scene.removeCompassSprite();
        }
        
        if (scene._compassSprite) {
            scene._compassSprite.onMapChange();
        }
    };

    // ============================================================================
    // Pathfinding and Graph Logic (unchanged)
    // ============================================================================

    function loadMapDataForGraph(mapId) {
        const filename = 'Map%1.json'.format(String(mapId).padZero(3));
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/' + filename, false);
            xhr.overrideMimeType('application/json');
            xhr.send();
            if (xhr.status === 200) {
                return JSON.parse(xhr.responseText);
            }
        } catch (e) {
            // Error loading is fine, just means no connections from that map
        }
        return null;
    }

    function buildCompleteConnectionGraph() {
        if ($gameSystem._mapConnectionGraph) {
            return $gameSystem._mapConnectionGraph;
        }
    
        const graph = new Map();
        
        for (let i = 1; i < $dataMapInfos.length; i++) {
            if ($dataMapInfos[i]) {
                graph.set(i, new Set());
            }
        }
        
        for (let i = 1; i < $dataMapInfos.length; i++) {
            if (!$dataMapInfos[i]) continue;
            
            const mapData = loadMapDataForGraph(i);
            if (mapData && mapData.events) {
                for (const event of mapData.events) {
                    if (!event || !event.pages) continue;
                    for (const page of event.pages) {
                        if (!page.list) continue;
                        for (const command of page.list) {
                            if (command.code === 201 && command.parameters[0] === 0) {
                                const targetMapId = command.parameters[1];
                                if (!ignoredMapIds.includes(targetMapId) && $dataMapInfos[targetMapId]) {
                                    if (!graph.has(i)) graph.set(i, new Set());
                                    if (!graph.has(targetMapId)) graph.set(targetMapId, new Set());
                                    
                                    graph.get(i).add(targetMapId);
                                    graph.get(targetMapId).add(i);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        const finalGraph = new Map();
        for (const [mapId, connections] of graph) {
            if (connections.size > 0) {
                finalGraph.set(mapId, Array.from(connections));
            }
        }
        
        console.log('Built connection graph:', finalGraph);
        $gameSystem._mapConnectionGraph = finalGraph;
        return finalGraph;
    }

    function findShortestPath(startId, endId) {
        console.log(`Finding shortest path from ${startId} to ${endId}`);
        
        if (startId === endId) {
            return [startId];
        }
        
        const completeGraph = buildCompleteConnectionGraph();
        console.log('Using graph:', completeGraph);
        
        const queue = [[startId]];
        const visited = new Set([startId]);

        while (queue.length > 0) {
            const path = queue.shift();
            const currentMapId = path[path.length - 1];

            if (currentMapId === endId) {
                console.log('Found path:', path);
                return path;
            }
            
            const neighbors = completeGraph.get(currentMapId) || [];
            console.log(`Neighbors of ${currentMapId}:`, neighbors);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }
        
        console.log('No path found');
        return [];
    }

    // NEW: Optimized waypoint calculation - collapses multiple transfers to same map
    function calculateCompassWaypoints(path) {
        const waypoints = new Map();
        const activeMaps = new Set();
        
        if (!path || path.length < 2) {
            $gameSystem._compassWaypoints = waypoints;
            $gameSystem._compassActiveMaps = activeMaps;
            return;
        }
        
        // For each map in the path (except the last), find the optimal transfer to the next map
        for (let i = 0; i < path.length - 1; i++) {
            const currentMapId = path[i];
            const nextMapId = path[i + 1];
            activeMaps.add(currentMapId);
            
            const mapData = loadMapDataForGraph(currentMapId);
            if (mapData && mapData.events) {
                // Collapse all transfers to the same destination into groups
                const transferGroups = new Map(); // targetMapId -> [{x, y, distance}, ...]
                
                for (const event of mapData.events) {
                    if (!event || !event.pages) continue;
                    
                    for (const page of event.pages) {
                        if (!page.list) continue;
                        
                        for (const command of page.list) {
                            if (command.code === 201 && command.parameters[0] === 0) {
                                const targetMapId = command.parameters[1];
                                
                                // Only process if this transfer leads to our next destination
                                if (targetMapId === nextMapId) {
                                    const distance = Math.sqrt(event.x * event.x + event.y * event.y);
                                    
                                    if (!transferGroups.has(targetMapId)) {
                                        transferGroups.set(targetMapId, []);
                                    }
                                    
                                    transferGroups.get(targetMapId).push({
                                        x: event.x,
                                        y: event.y,
                                        distance: distance
                                    });
                                }
                            }
                        }
                    }
                }
                
                // For each destination, find the nearest transfer event
                for (const [targetMapId, transfers] of transferGroups) {
                    if (transfers.length === 0) continue;
                    
                    // Find the transfer with minimum distance (closest to map origin/center)
                    const nearestTransfer = transfers.reduce((nearest, current) => {
                        return current.distance < nearest.distance ? current : nearest;
                    });
                    
                    // Only store waypoint for our intended next map
                    if (targetMapId === nextMapId) {
                        waypoints.set(currentMapId, {
                            x: nearestTransfer.x,
                            y: nearestTransfer.y,
                            targetMapId: targetMapId
                        });
                        
                        console.log(`Map ${currentMapId}: Collapsed ${transfers.length} transfers to map ${targetMapId} into waypoint at (${nearestTransfer.x}, ${nearestTransfer.y})`);
                        break; // Found our waypoint for this map, move to next
                    }
                }
            }
        }
        
        console.log('Optimized compass waypoints:', waypoints);
        console.log('Active compass maps:', activeMaps);
        console.log(`Waypoint optimization: Reduced from potential ${path.length - 1} maps to ${waypoints.size} actual waypoints`);
        
        $gameSystem._compassWaypoints = waypoints;
        $gameSystem._compassActiveMaps = activeMaps;
    }

    // Plugin command registration
    PluginManager.registerCommand(pluginName, 'openWorldMap', () => {
        SceneManager.push(Scene_WorldMap);
    });

    // Add menu command if enabled
    if (enableMenuCommand) {
        const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
        Window_MenuCommand.prototype.addOriginalCommands = function() {
            _Window_MenuCommand_addOriginalCommands.call(this);
            this.addCommand(menuCommandName, 'worldMap', true, 40);
        };

        const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
        Scene_Menu.prototype.createCommandWindow = function() {
            _Scene_Menu_createCommandWindow.call(this);
            this._commandWindow.setHandler('worldMap', this.commandWorldMap.bind(this));
        };

        Scene_Menu.prototype.commandWorldMap = function() {
            SceneManager.push(Scene_WorldMap);
        };
    }

    // World Map Scene (most unchanged, key additions marked with NEW)
    class Scene_WorldMap extends Scene_Base {
        create() {
            super.create();
            this.createBackground();
            this.createWorldMapSprite();
            this.createWindowLayer();
            this.createInfoWindow();
            this.createHelpWindow();
            
            this._currentDepth = displayDepth;
            this._highlightedPath = [];
            this._isDragging = false;
            this._lastX = 0;
            this._lastY = 0;
            this._dragStartX = 0;
            this._dragStartY = 0;

            this._highlightedPath = [];

            if ($gameMap && $gameMap.mapId() > 0) {
                this.analyzeMapConnections();
                
                if ($gameSystem._worldMapDestinationId) {
                    this.updateAndHighlightPath();
                }
                
                this.centerOnCurrentMap();
                this.setupZoomAndPan();
            } else {
                this._helpWindow.setText("Cannot display map. No map is currently loaded.");
            }
        }
        
        // NEW: Enhanced to calculate compass waypoints
        updateAndHighlightPath() {
            console.log('=== UPDATE AND HIGHLIGHT PATH ===');
            const destinationId = $gameSystem._worldMapDestinationId;
            console.log('Destination ID:', destinationId);
            
            if (destinationId) {
                const currentMapId = $gameMap.mapId();
                console.log(`Finding path from ${currentMapId} to ${destinationId}`);
                
                $gameSystem._mapConnectionGraph = null;
                const path = findShortestPath(currentMapId, destinationId);
                console.log('Found path:', path);
                this._highlightedPath = path;
                
                // NEW: Calculate compass waypoints
                calculateCompassWaypoints(path);
                
                // NEW: Update compass in current scene if needed
                if (SceneManager._scene instanceof Scene_Map) {
                    $gamePlayer.updateCompassOnMapChange();
                }
            } else {
                console.log('No destination, clearing path');
                this._highlightedPath = [];
                
                // NEW: Clear compass data
                $gameSystem._compassWaypoints = new Map();
                $gameSystem._compassActiveMaps = new Set();
                
                // NEW: Remove compass if it exists
                if (SceneManager._scene instanceof Scene_Map && SceneManager._scene._compassSprite) {
                    SceneManager._scene.removeCompassSprite();
                }
            }
            
            console.log('Current highlighted path:', this._highlightedPath);
            this.drawWorldMap();
        }

        // Rest of the Scene_WorldMap methods remain unchanged...
        centerOnCurrentMap() {
            const currentMapId = $gameMap.mapId();
            if (this._mapPositions && this._mapPositions.has(currentMapId)) {
                const pos = this._mapPositions.get(currentMapId);
                const nodeCenterX = pos.x + pos.width / 2;
                const nodeCenterY = pos.y + pos.height / 2;
                const bitmapCenterX = this._worldMapSprite.bitmap.width / 2;
                const bitmapCenterY = this._worldMapSprite.bitmap.height / 2;
                this._offsetX = -(nodeCenterX - bitmapCenterX);
                this._offsetY = -(nodeCenterY - bitmapCenterY);
                this.updateWorldMapPosition();
            }
        }

        createWindowLayer() {
            this._windowLayer = new WindowLayer();
            this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
            this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
            this.addChild(this._windowLayer);
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll(backgroundColor);
            this.addChild(this._backgroundSprite);
        }

        createWorldMapSprite() {
            this._worldMapSprite = new Sprite();
            this._worldMapSprite.bitmap = new Bitmap(8000, 8000);
            this._worldMapSprite.anchor.x = 0.5;
            this._worldMapSprite.anchor.y = 0.5;
            this._worldMapSprite.x = Graphics.width / 2;
            this._worldMapSprite.y = Graphics.height / 2;
            this.addChild(this._worldMapSprite);
            this._scale = 1.0;
            this._offsetX = 0;
            this._offsetY = 0;
        }

        createInfoWindow() {
            const rect = new Rectangle(Graphics.width - 320, 56, 320, 400);
            this._infoWindow = new Window_MapInfo(rect);
            this._infoWindow.hide();
            this._windowLayer.addChild(this._infoWindow);
        }

        createHelpWindow() {
            const lineHeight = 36;
            const padding = 18;
            const height = lineHeight + padding * 2;
            const rect = new Rectangle(0, 0, Graphics.width, height);
            this._helpWindow = new Window_Help(rect);
            this._helpWindow.setText('Mouse: Pan | Wheel: Zoom | Click: Select/Deselect | Esc: Exit');
            this._windowLayer.addChild(this._helpWindow);
        }

        analyzeMapConnections() {
            this._mapData = new Map();
            this._connections = new Map();
            this._clusters = [];
            
            const currentMapId = $gameMap.mapId();
            if (teleportHubId > 0 && currentMapId === teleportHubId) {
                this.analyzeTeleportHub();
            } else {
                this.analyzeNormalMaps(currentMapId);
            }
            this.findClusters();
            this.positionMaps();
            this.drawWorldMap();
        }

        analyzeTeleportHub() {
            const hubMapInfo = $dataMapInfos[teleportHubId];
            const hubMapData = this.loadMapData(teleportHubId);
            if (hubMapInfo && hubMapData) {
                this._mapData.set(teleportHubId, { id: teleportHubId, name: hubMapInfo.name, visited: true });
                const hubConnections = [];
                if (hubMapData.events) {
                    for (const event of hubMapData.events) {
                        if (event && event.name.startsWith('Teleport')) {
                            const destinationName = event.name.replace(/Teleport\s*-\s*/, '').trim();
                            const fakeMapId = `teleport_${event.id}`;
                            this._mapData.set(fakeMapId, { id: fakeMapId, name: destinationName, visited: true });
                            hubConnections.push({ targetMapId: fakeMapId, eventName: event.name, isDoor: true });
                        }
                    }
                }
                if (hubConnections.length > 0) this._connections.set(teleportHubId, hubConnections);
            }
        }

        analyzeNormalMaps(currentMapId) {
            const mapsToShow = this.getMapsInDepth(currentMapId, displayDepth);
            for (const mapId of mapsToShow) {
                const mapInfo = $dataMapInfos[mapId];
                if (!mapInfo) continue;
                this._mapData.set(mapId, { id: mapId, name: mapInfo.name, visited: $gameSystem._visitedMaps && $gameSystem._visitedMaps.has(mapId) });
                const mapData = this.loadMapData(mapId);
                if (mapData) {
                    const transfers = this.findTransferEvents(mapData);
                    const validTransfers = transfers.filter(t => !ignoredMapIds.includes(t.targetMapId));
                    if (validTransfers.length > 0) this._connections.set(mapId, validTransfers);
                }
            }
        }

        getMapsInDepth(startMapId, maxDepth) {
            if (maxDepth <= 0) {
                const allMaps = new Set();
                for (let i = 1; i < $dataMapInfos.length; i++) {
                    if ($dataMapInfos[i] && !ignoredMapIds.includes(i)) allMaps.add(i);
                }
                return allMaps;
            }
            const queue = [{ mapId: startMapId, depth: 0 }];
            const visited = new Set([startMapId]);
            let head = 0;
            while (head < queue.length) {
                const { mapId, depth } = queue[head++];
                if (depth >= maxDepth) continue;
                const mapData = this.loadMapData(mapId);
                if (mapData) {
                    const transfers = this.findTransferEvents(mapData);
                    for (const transfer of transfers) {
                        if (ignoredMapIds.includes(transfer.targetMapId)) continue;
                        if (!visited.has(transfer.targetMapId)) {
                            visited.add(transfer.targetMapId);
                            queue.push({ mapId: transfer.targetMapId, depth: depth + 1 });
                        }
                    }
                }
            }
            return visited;
        }

        loadMapData(mapId) {
            const filename = 'Map%1.json'.format(String(mapId).padZero(3));
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', 'data/' + filename, false);
                xhr.overrideMimeType('application/json');
                xhr.send();
                if (xhr.status === 200) {
                    const mapData = JSON.parse(xhr.responseText);
                    mapData.mapId = mapId;
                    return mapData;
                }
            } catch (e) {
                console.warn('Could not load map data for Map' + String(mapId).padZero(3));
            }
            return null;
        }

        findTransferEvents(mapData) {
            const transfers = [];
            if (!mapData || !mapData.events) return transfers;
            for (const event of mapData.events) {
                if (!event || !event.pages) continue;
                for (const page of event.pages) {
                    if (!page.list) continue;
                    for (const command of page.list) {
                        if (command.code === 201 && command.parameters[0] === 0) {
                            const targetMapId = command.parameters[1];
                            if ((mapData.mapId === 3 && targetMapId === 315) || (mapData.mapId === 315 && targetMapId === 3)) continue;
                            transfers.push({ targetMapId: targetMapId });
                        }
                    }
                }
            }
            return transfers;
        }

        findClusters() {
            const visited = new Set();
            const dfs = (mapId, cluster) => {
                if (visited.has(mapId)) return;
                visited.add(mapId);
                cluster.add(mapId);
                const connections = this._connections.get(mapId) || [];
                for (const conn of connections) {
                    if (this._mapData.has(conn.targetMapId)) dfs(conn.targetMapId, cluster);
                }
                for (const [otherId, otherConns] of this._connections) {
                    if (otherId !== mapId && this._mapData.has(otherId)) {
                        for (const conn of otherConns) {
                            if (conn.targetMapId === mapId) dfs(otherId, cluster);
                        }
                    }
                }
            };
            for (const [mapId] of this._mapData) {
                if (!visited.has(mapId)) {
                    const cluster = new Set();
                    dfs(mapId, cluster);
                    if (cluster.size > 0) this._clusters.push(cluster);
                }
            }
            this._clusters.sort((a, b) => b.size - a.size);
        }

        positionMaps() {
            const positions = new Map();
            const GRID_SIZE = Math.max(nodeWidth, nodeHeight) + 40;
            const CANVAS_CENTER_X = this._worldMapSprite.bitmap.width / 2;
            const CANVAS_CENTER_Y = this._worldMapSprite.bitmap.height / 2;
            const clusterColors = ['#4a90e2', '#e94b4b', '#50c878', '#ffa500', '#9b59b6', '#f39c12', '#1abc9c', '#e74c3c', '#3498db', '#2ecc71'];
            const occupiedCells = new Set();
            const gridToWorld = (gridX, gridY) => ({ x: CANVAS_CENTER_X + (gridX * GRID_SIZE) - nodeWidth / 2, y: CANVAS_CENTER_Y + (gridY * GRID_SIZE) - nodeHeight / 2 });
            const isCellAvailable = (gridX, gridY) => !occupiedCells.has(`${gridX},${gridY}`);
            const occupyCell = (gridX, gridY) => occupiedCells.add(`${gridX},${gridY}`);
            const findBestPositionNear = (referenceGridX, referenceGridY, preferredDirections = []) => {
                const searchRadius = 8;
                const allDirections = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }, { dx: 1, dy: 1 }, { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 }, ...preferredDirections];
                for (let radius = 1; radius <= searchRadius; radius++) {
                    for (const dir of allDirections) {
                        const gridX = referenceGridX + (dir.dx * radius);
                        const gridY = referenceGridY + (dir.dy * radius);
                        if (isCellAvailable(gridX, gridY)) return { gridX, gridY };
                    }
                    for (let dx = -radius; dx <= radius; dx++) {
                        for (let dy = -radius; dy <= radius; dy++) {
                            if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                                const gridX = referenceGridX + dx;
                                const gridY = referenceGridY + dy;
                                if (isCellAvailable(gridX, gridY)) return { gridX, gridY };
                            }
                        }
                    }
                }
                return this.findAnyAvailablePosition(occupiedCells);
            };
            let clusterOffsetX = 0;
            this._clusters.forEach((cluster, clusterIndex) => {
                const clusterMaps = Array.from(cluster);
                const clusterColor = clusterColors[clusterIndex % clusterColors.length];
                if (clusterMaps.length === 1) {
                    const gridX = clusterOffsetX;
                    const gridY = 0;
                    const worldPos = gridToWorld(gridX, gridY);
                    positions.set(clusterMaps[0], { x: worldPos.x, y: worldPos.y, width: nodeWidth, height: nodeHeight, color: clusterColor, clusterIndex: clusterIndex, previewImage: null });
                    occupyCell(gridX, gridY);
                    clusterOffsetX += 3;
                } else {
                    const placedMaps = new Map();
                    const unplacedMaps = new Set(clusterMaps);
                    let startMap = clusterMaps[0];
                    let maxConnections = 0;
                    for (const mapId of clusterMaps) {
                        const connections = this._connections.get(mapId) || [];
                        const inClusterConnections = connections.filter(conn => clusterMaps.includes(conn.targetMapId)).length;
                        if (inClusterConnections > maxConnections) {
                            maxConnections = inClusterConnections;
                            startMap = mapId;
                        }
                    }
                    const startGridX = clusterOffsetX;
                    const startGridY = 0;
                    placedMaps.set(startMap, { gridX: startGridX, gridY: startGridY });
                    unplacedMaps.delete(startMap);
                    occupyCell(startGridX, startGridY);
                    const queue = [startMap];
                    while (queue.length > 0 && unplacedMaps.size > 0) {
                        const currentMap = queue.shift();
                        const currentPos = placedMaps.get(currentMap);
                        const connections = this._connections.get(currentMap) || [];
                        const unplacedConnections = connections.filter(conn => unplacedMaps.has(conn.targetMapId));
                        for (const conn of unplacedConnections) {
                            const targetMap = conn.targetMapId;
                            const bestPos = findBestPositionNear(currentPos.gridX, currentPos.gridY);
                            if (bestPos) {
                                placedMaps.set(targetMap, bestPos);
                                unplacedMaps.delete(targetMap);
                                occupyCell(bestPos.gridX, bestPos.gridY);
                                queue.push(targetMap);
                            }
                        }
                        for (const mapId of Array.from(unplacedMaps)) {
                            const mapConnections = this._connections.get(mapId) || [];
                            const connectsToCurrentMap = mapConnections.some(conn => conn.targetMapId === currentMap);
                            if (connectsToCurrentMap) {
                                const bestPos = findBestPositionNear(currentPos.gridX, currentPos.gridY);
                                if (bestPos) {
                                    placedMaps.set(mapId, bestPos);
                                    unplacedMaps.delete(mapId);
                                    occupyCell(bestPos.gridX, bestPos.gridY);
                                    queue.push(mapId);
                                }
                            }
                        }
                    }
                    for (const mapId of unplacedMaps) {
                        const availablePos = this.findAnyAvailablePosition(occupiedCells);
                        if (availablePos) {
                            placedMaps.set(mapId, availablePos);
                            occupyCell(availablePos.gridX, availablePos.gridY);
                        }
                    }
                    for (const [mapId, gridPos] of placedMaps) {
                        const worldPos = gridToWorld(gridPos.gridX, gridPos.gridY);
                        positions.set(mapId, { x: worldPos.x, y: worldPos.y, width: nodeWidth, height: nodeHeight, color: clusterColor, clusterIndex: clusterIndex, previewImage: null });
                    }
                    const clusterBounds = this.getClusterBounds(placedMaps);
                    clusterOffsetX = clusterBounds.maxX + 4;
                }
            });
            this._mapPositions = positions;
        }

        findAnyAvailablePosition(occupiedCells) {
            const maxRadius = 20;
            for (let radius = 0; radius <= maxRadius; radius++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    for (let dy = -radius; dy <= radius; dy++) {
                        if (radius === 0 || Math.abs(dx) === radius || Math.abs(dy) === radius) {
                            const key = `${dx},${dy}`;
                            if (!occupiedCells.has(key)) return { gridX: dx, gridY: dy };
                        }
                    }
                }
            }
            return { gridX: Math.floor(Math.random() * 40) - 20, gridY: Math.floor(Math.random() * 40) - 20 };
        }

        getClusterBounds(placedMaps) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (const pos of placedMaps.values()) {
                minX = Math.min(minX, pos.gridX);
                maxX = Math.max(maxX, pos.gridX);
                minY = Math.min(minY, pos.gridY);
                maxY = Math.max(maxY, pos.gridY);
            }
            return { minX, maxX, minY, maxY };
        }

        drawWorldMap() {
            const bitmap = this._worldMapSprite.bitmap;
            bitmap.clear();
            this.drawGrid(bitmap);
            
            console.log('Drawing world map with highlighted path:', this._highlightedPath);
            
            for (const [mapId, connections] of this._connections) {
                const fromPos = this._mapPositions.get(mapId);
                if (!fromPos) continue;
                for (const conn of connections) {
                    const toPos = this._mapPositions.get(conn.targetMapId);
                    if (!toPos) continue;
                    const fromX = fromPos.x + fromPos.width / 2;
                    const fromY = fromPos.y + fromPos.height / 2;
                    const toX = toPos.x + toPos.width / 2;
                    const toY = toPos.y + toPos.height / 2;
                    
                    const path = this._highlightedPath;
                    let lineColor = '#666666', lineWidth = 2, arrowColor = '#666666';
                    
                    if (path && path.length > 1) {
                        const fromIndex = path.indexOf(mapId);
                        const toIndex = path.indexOf(conn.targetMapId);
                        console.log(`Checking connection ${mapId} -> ${conn.targetMapId}, fromIndex: ${fromIndex}, toIndex: ${toIndex}`);
                        
                        if (fromIndex > -1 && toIndex > -1 && Math.abs(fromIndex - toIndex) === 1) {
                            console.log('Highlighting connection');
                            lineColor = '#33ff33';
                            arrowColor = '#33ff33';
                            lineWidth = 4;
                        }
                    }
        
                    drawLine(bitmap, fromX, fromY, toX, toY, lineColor, lineWidth);
                    const angle = Math.atan2(toY - fromY, toX - fromX);
                    const arrowX = toX - Math.cos(angle) * (toPos.width / 2 + 5);
                    const arrowY = toY - Math.sin(angle) * (toPos.height / 2 + 5);
                    drawArrow(bitmap, arrowX, arrowY, angle, arrowColor, 10);
                }
            }
            
            for (const [mapId, mapInfo] of this._mapData) {
                const pos = this._mapPositions.get(mapId);
                if (pos) this.drawMapNode(bitmap, mapId, mapInfo, pos);
            }
        }

        drawMapNode(bitmap, mapId, mapInfo, pos) {
            const mapIdStr = String(mapId).padZero(3);
            const imagePath = `img/maps/Map${mapIdStr}.png`;
            try {
                const previewImg = new Image();
                previewImg.onload = () => {
                    clearRect(bitmap, pos.x, pos.y, pos.width, pos.height);
                    const context = bitmap.context;
                    context.save();
                    context.beginPath();
                    context.rect(pos.x, pos.y, pos.width, pos.height);
                    context.clip();
                    const scale = Math.max(pos.width / previewImg.width, pos.height / previewImg.height);
                    const scaledWidth = previewImg.width * scale;
                    const scaledHeight = previewImg.height * scale;
                    const drawX = pos.x + (pos.width - scaledWidth) / 2;
                    const drawY = pos.y + (pos.height - scaledHeight) / 2;
                    const shouldReveal = mapInfo.visited || ($gameVariables && $gameVariables.value(2) === 100);
                    if (!shouldReveal) context.filter = 'grayscale(100%) brightness(0.6)';
                    context.drawImage(previewImg, drawX, drawY, scaledWidth, scaledHeight);
                    context.restore();
                    this.drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal);
                };
                previewImg.onerror = () => this.drawFallbackNode(bitmap, mapInfo, pos);
                previewImg.src = imagePath;
            } catch (e) {
                this.drawFallbackNode(bitmap, mapInfo, pos);
            }
        }

        drawFallbackNode(bitmap, mapInfo, pos) {
            const shouldReveal = mapInfo.visited || ($gameVariables && $gameVariables.value(2) === 100);
            if (shouldReveal) {
                bitmap.fillRect(pos.x, pos.y, pos.width, pos.height, pos.color);
            } else {
                bitmap.fillRect(pos.x, pos.y, pos.width, pos.height, this.darkenColor(pos.color));
            }
            this.drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal);
        }

        drawNodeOverlay(bitmap, mapInfo, pos, shouldReveal = true) {
            const isInPath = this._highlightedPath && this._highlightedPath.includes(mapInfo.id);
            const isDestination = $gameSystem._worldMapDestinationId === mapInfo.id;
            const isHighlighted = isInPath || isDestination;
            
            console.log(`Drawing node ${mapInfo.id}: inPath=${isInPath}, isDestination=${isDestination}, highlighted=${isHighlighted}`);
            
            const borderColor = isHighlighted ? '#33ff33' : '#ffffff';
            const borderWidth = isHighlighted ? 6 : 3;
            drawRect(bitmap, pos.x, pos.y, pos.width, pos.height, borderColor, borderWidth);
            
            if (isDestination) {
                console.log('Drawing destination highlight for', mapInfo.id);
                drawRect(bitmap, pos.x - 4, pos.y - 4, pos.width + 8, pos.height + 8, '#ffff00', 4);
            }
            
            const context = bitmap.context;
            context.save();
            context.fillStyle = shouldReveal ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.9)';
            context.fillRect(pos.x, pos.y + pos.height - 30, pos.width, 30);
            context.restore();
            
            const displayName = shouldReveal ? mapInfo.name : unvisitedMapName;
            bitmap.fontSize = 16;
            bitmap.textColor = shouldReveal ? '#ffffff' : '#888888';
            bitmap.drawText(displayName, pos.x + 4, pos.y + pos.height - 26, pos.width - 8, 22, 'center');
        }

        darkenColor(hexColor) {
            const hex = hexColor.replace('#', '');
            const r = Math.floor(parseInt(hex.substr(0, 2), 16) * 0.3);
            const g = Math.floor(parseInt(hex.substr(2, 2), 16) * 0.3);
            const b = Math.floor(parseInt(hex.substr(4, 2), 16) * 0.3);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }

        drawGrid(bitmap) {
            const gridSize = 100;
            bitmap.fillAll(backgroundColor);
            for (let x = 0; x < bitmap.width; x += gridSize) bitmap.fillRect(x, 0, 1, bitmap.height, gridColor);
            for (let y = 0; y < bitmap.height; y += gridSize) bitmap.fillRect(0, y, bitmap.width, 1, gridColor);
        }

        setupZoomAndPan() {
            this._isDragging = false;
            this._lastX = 0;
            this._lastY = 0;
        }

        update() {
            super.update();
            this.updateInput();
            this.updateWorldMapPosition();
        }

        updateInput() {
            if (Input.isTriggered('cancel')) this.popScene();
    
            let depthChanged = false;
            if (Input.isTriggered('up')) {
                this._currentDepth = Math.max(0, this._currentDepth - 1);
                depthChanged = true;
            }
            if (Input.isTriggered('down')) {
                this._currentDepth = Math.min(10, this._currentDepth + 1);
                depthChanged = true;
            }
            
            if (depthChanged) {
                this.updateHelpText();
                this.analyzeMapConnections();
                if ($gameSystem._worldMapDestinationId) {
                    this.updateAndHighlightPath();
                }
                this.centerOnCurrentMap();
            }
            
            const currentWheelY = TouchInput.wheelY;
            if (currentWheelY !== 0) {
                const zoomFactor = 1.05;
                const mouseX = TouchInput.x;
                const mouseY = TouchInput.y;
                const point = new Point(mouseX, mouseY);
                this._worldMapSprite.worldTransform.applyInverse(point, point);
                const worldXBefore = point.x + this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
                const worldYBefore = point.y + this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;
                const oldScale = this._scale;
                this._scale = currentWheelY > 0 ? Math.max(this._scale / zoomFactor, 0.3) : Math.min(this._scale * zoomFactor, 3.0);
                if (this._scale !== oldScale) {
                    this._worldMapSprite.scale.x = this._scale;
                    this._worldMapSprite.scale.y = this._scale;
                    const pointAfter = new Point(mouseX, mouseY);
                    this._worldMapSprite.worldTransform.applyInverse(pointAfter, pointAfter);
                    const worldXAfter = pointAfter.x + this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
                    const worldYAfter = pointAfter.y + this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;
                    this._offsetX -= (worldXAfter - worldXBefore) * this._scale;
                    this._offsetY -= (worldYAfter - worldYBefore) * this._scale;
                }
            }
            
            if (TouchInput.isPressed()) {
                if (!this._isDragging) {
                    this._isDragging = true;
                    this._lastX = TouchInput.x;
                    this._lastY = TouchInput.y;
                    this._dragStartX = TouchInput.x;
                    this._dragStartY = TouchInput.y;
                } else {
                    const deltaX = TouchInput.x - this._lastX;
                    const deltaY = TouchInput.y - this._lastY;
                    this._offsetX += deltaX;
                    this._offsetY += deltaY;
                    this._lastX = TouchInput.x;
                    this._lastY = TouchInput.y;
                }
            } else {
                if (this._isDragging) {
                    this._isDragging = false;
                    const totalDragDistance = Math.sqrt(
                        Math.pow(TouchInput.x - this._dragStartX, 2) + 
                        Math.pow(TouchInput.y - this._dragStartY, 2)
                    );
                    
                    if (totalDragDistance < 10) {
                        this.checkMapClick(TouchInput.x, TouchInput.y);
                    }
                } else if (TouchInput.isTriggered()) {
                    this.checkMapClick(TouchInput.x, TouchInput.y);
                }
            }
            
            if (Input.isTriggered('pageup')) {
                this._scale = Math.min(this._scale * 1.2, 3.0);
                this._worldMapSprite.scale.x = this._scale;
                this._worldMapSprite.scale.y = this._scale;
            }
            if (Input.isTriggered('pagedown')) {
                this._scale = Math.max(this._scale / 1.2, 0.3);
                this._worldMapSprite.scale.x = this._scale;
                this._worldMapSprite.scale.y = this._scale;
            }
        }

        updateWorldMapPosition() {
            this._worldMapSprite.scale.x = this._scale;
            this._worldMapSprite.scale.y = this._scale;
            this._worldMapSprite.x = Graphics.width / 2 + this._offsetX;
            this._worldMapSprite.y = Graphics.height / 2 + this._offsetY;
        }

        checkMapClick(screenX, screenY) {
            if (!this._mapPositions || this._mapPositions.size === 0) return;
            
            const point = new Point(screenX, screenY);
            this._worldMapSprite.worldTransform.applyInverse(point, point);
            const worldX = point.x + this._worldMapSprite.bitmap.width * this._worldMapSprite.anchor.x;
            const worldY = point.y + this._worldMapSprite.bitmap.height * this._worldMapSprite.anchor.y;
            
            let clickedOnNode = false;
            const positions = Array.from(this._mapPositions.entries()).reverse();
            
            for (const [mapId, pos] of positions) {
                const isInside = worldX >= pos.x && worldX <= pos.x + pos.width && 
                                worldY >= pos.y && worldY <= pos.y + pos.height;
                
                if (isInside) {
                    const clickedMapId = typeof mapId === 'string' && mapId.startsWith('teleport_') ? mapId : Number(mapId);
                    const currentDestination = $gameSystem._worldMapDestinationId;
                    
                    if (currentDestination === clickedMapId) {
                        $gameSystem._worldMapDestinationId = null;
                    } else {
                        if (typeof clickedMapId === 'number') {
                            $gameSystem._worldMapDestinationId = clickedMapId;
                        }
                    }
                    
                    this.updateAndHighlightPath();
                    this.selectMap(mapId);
                    clickedOnNode = true;
                    return;
                }
            }
            
            if (!clickedOnNode && $gameSystem._worldMapDestinationId) {
                $gameSystem._worldMapDestinationId = null;
                this.updateAndHighlightPath();
                this._infoWindow.hide();
            }
        }

        selectMap(mapId) {
            const mapInfo = this._mapData.get(mapId);
            if (!mapInfo) return;
            const pos = this._mapPositions.get(mapId);
            const connections = this._connections.get(mapId) || [];
            this._infoWindow.setMapInfo(mapInfo, pos, connections);
            this._infoWindow.show();
        }
    }

    // Map Info Window (unchanged)
    class Window_MapInfo extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
        }
        setMapInfo(mapInfo, position, connections) {
            this.contents.clear();
            const lineHeight = this.lineHeight();
            let y = 0;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('Map Info', 0, y, this.contentsWidth(), 'center');
            y += lineHeight;
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(`Name: ${mapInfo.visited ? mapInfo.name : unvisitedMapName}`, 0, y, this.contentsWidth());
            y += lineHeight;
            this.drawText(`ID: ${mapInfo.id}`, 0, y, this.contentsWidth());
            y += lineHeight;
            if (position) {
                this.drawText(`Cluster: ${position.clusterIndex + 1}`, 0, y, this.contentsWidth());
                y += lineHeight;
            }
            this.drawText(`Status: ${mapInfo.visited ? 'Visited' : 'Not Visited'}`, 0, y, this.contentsWidth());
            y += lineHeight * 2;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText('Connections:', 0, y, this.contentsWidth());
            y += lineHeight;
            this.changeTextColor(ColorManager.normalColor());
            if (connections.length > 0) {
                const scene = SceneManager._scene;
                if (scene instanceof Scene_WorldMap) {
                    for (const conn of connections) {
                        if (scene._mapData.has(conn.targetMapId)) {
                            const targetMapData = scene._mapData.get(conn.targetMapId);
                            const targetName = targetMapData.name;
                            this.drawText(`→ ${targetName}`, 0, y, this.contentsWidth());
                            y += lineHeight;
                        }
                    }
                }
            } else {
                this.drawText('No connections found.', 0, y, this.contentsWidth());
            }
        }
    }

    // ============================================================================
    // LOCAL Drawing Helper Functions (Isolated from Global Bitmap Prototype)
    // ============================================================================
    
    // Local drawing functions to avoid conflicts with other plugins
    function drawLine(bitmap, x1, y1, x2, y2, color, width) {
        const context = bitmap.context;
        context.save();
        context.strokeStyle = color;
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.restore();
    }
    
    function drawArrow(bitmap, x, y, angle, color, size) {
        const context = bitmap.context;
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-size, -size / 2);
        context.lineTo(-size, size / 2);
        context.closePath();
        context.fill();
        context.restore();
    }
    
    function drawRect(bitmap, x, y, width, height, color, lineWidth) {
        const context = bitmap.context;
        context.save();
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.strokeRect(x, y, width, height);
        context.restore();
    }
    
    function clearRect(bitmap, x, y, width, height) {
        bitmap.context.clearRect(x, y, width, height);
    }
    
    function drawCircle(bitmap, x, y, radius, color) {
        const context = bitmap.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }

    // ============================================================================
    // NEW: VRAM-Optimized Compass Sprite and Scene_Map integration
    // ============================================================================
    
    // NEW: Optimized Compass Sprite - only created when needed
    class Sprite_Compass extends Sprite {
        constructor() {
            super();
            this._currentMapId = 0;
            this._targetCoords = null; // Pre-calculated coordinates
            this.createBase();
            this.createHand();
            this.x = Graphics.boxWidth - 74;
            this.y = 10;
            this.zIndex = 10;
            this.onMapChange();
        }

        createBase() {
            this.bitmap = new Bitmap(64, 64);
            drawCircle(this.bitmap, 32, 32, 30, 'rgba(0, 0, 0, 0.5)');
            drawCircle(this.bitmap, 32, 32, 28, '#FFD700');
            drawCircle(this.bitmap, 32, 32, 25, '#B8860B');
        }

        createHand() {
            this._handSprite = new Sprite();
            this._handSprite.bitmap = new Bitmap(64, 64);
            const handBitmap = this._handSprite.bitmap;
            handBitmap.context.fillStyle = '#FF4136';
            handBitmap.context.beginPath();
            handBitmap.context.moveTo(32, 8);
            handBitmap.context.lineTo(26, 32);
            handBitmap.context.lineTo(38, 32);
            handBitmap.context.closePath();
            handBitmap.context.fill();
            this._handSprite.anchor.x = 0.5;
            this._handSprite.anchor.y = 0.5;
            this._handSprite.x = 32;
            this._handSprite.y = 32;
            this.addChild(this._handSprite);
        }
        
        // NEW: Optimized map change handler
        onMapChange() {
            this._currentMapId = $gameMap.mapId();
            
            // Use pre-calculated waypoint data instead of searching events
            if ($gameSystem._compassWaypoints && $gameSystem._compassWaypoints.has(this._currentMapId)) {
                this._targetCoords = $gameSystem._compassWaypoints.get(this._currentMapId);
                console.log(`Compass target coords for map ${this._currentMapId}:`, this._targetCoords);
            } else {
                this._targetCoords = null;
                console.log(`No compass waypoint for map ${this._currentMapId}`);
            }
        }

        update() {
            super.update();
            // Only update if we have target coordinates
            if (this._targetCoords) {
                this.updateRotation();
            }
        }

        // NEW: Highly optimized rotation using pre-calculated coordinates
        updateRotation() {
            if (!this._targetCoords) return;
            
            // Get player position in tiles
            const playerX = $gamePlayer.x;
            const playerY = $gamePlayer.y;
            
            // Calculate direct tile distance (much faster than screen coordinates)
            const deltaX = this._targetCoords.x - playerX;
            const deltaY = this._targetCoords.y - playerY;
            
            // Calculate angle directly from tile coordinates
            const angle = Math.atan2(deltaY, deltaX);
            this._handSprite.rotation = angle + Math.PI / 2; // Offset for upward-pointing sprite
            
            // Optional: Check if player reached the waypoint (for automatic path progression)
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance < 1.5) { // Within 1.5 tiles of the waypoint
                console.log('Player reached waypoint, checking for path progression...');
                // Could trigger path progression logic here if needed
            }
        }
    }

    // NEW: Enhanced Scene_Map with conditional compass creation
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        // Only create compass if needed
        const currentMapId = $gameMap.mapId();
        const shouldShowCompass = $gameSystem._compassActiveMaps && 
                                 $gameSystem._compassActiveMaps.has(currentMapId) &&
                                 $gameSystem._worldMapDestinationId &&
                                 $gameSystem._worldMapDestinationId !== currentMapId;
        
        if (shouldShowCompass) {
            this.createCompassSprite();
        }
    };

    // NEW: Conditional compass creation
    Scene_Map.prototype.createCompassSprite = function() {
        if (!this._compassSprite) {
            console.log('Creating compass sprite');
            this._compassSprite = new Sprite_Compass();
            this.addChild(this._compassSprite);
        }
    };

    // NEW: Safe compass removal
    Scene_Map.prototype.removeCompassSprite = function() {
        if (this._compassSprite) {
            console.log('Removing compass sprite');
            this.removeChild(this._compassSprite);
            this._compassSprite = null;
        }
    };

    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        this.removeCompassSprite();
        _Scene_Map_terminate.call(this);
    };

})();