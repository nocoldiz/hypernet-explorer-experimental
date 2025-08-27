//=============================================================================
// RPG Maker MZ - Event Spawner
// COCOMODE_eventSpawner.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Enables game developers to dynamically spawn events on game maps based on various parameters & conditions, accommodating diverse game scenarios.
 * @author CocoMode
 *
 * @url https://cocomode.itch.io/
 * 
 * @param sourceMapId
 * @text Source Map ID:
 * @type number
 * @desc Enter the ID of the source map (The dedicated map in which events to be spawned are originally defined).
 * @min 1
 *
 * @param events
 * @text Events to Spawn
 * @desc Define events to spawn and the parameters for spawning them.
 * @type struct<eventsParams>[]
 * 
 * @command spawnEvent
 * @text Spawn Event
 * @desc Define the parameters for spawning an event in real (game) time.
 *
 * @arg sourceEventId
 * @text Source Event Id
 * @desc Enter the ID of the source event to be spawned.
 * @type number
 * @min 0
 * 
 * @arg sourceEventName
 * @text Source Event Name:
 * @desc Enter the (unique!) name of the event to be spawned (instead of its ID).
 * @type string
 *
 * @arg exactLocation
 * @text Exact Location
 * @desc Enter the coordinates in which to spawn the event in the current game map in this format: x, y
 * @type string
 * 
 * @arg mapRandom
 * @text Number of Random Spawns
 * @desc Enter the number of times to spawn the event in random locations throughout the current game map.
 * @type number
 * @min 1
 * 
 * @arg regionId
 * @text By Region ID
 * @desc Define the parameters for spawning the chosen event in specific region IDs in the current game map.
 * @type struct<byRegionIdParams>
 * 
 * @arg passable
 * @text Spawn Only on Passable Tiles?
 * @desc Define whether the event can be spawned only on passable tiles (true) or on all tiles (false).
 * @type boolean
 * @on Only Passable Tiles
 * @off All Tiles
 * @default true
 *
 * @arg clear
 * @text Spawn Only on Non-Occupied Tiles:
 * @desc Define whether the event can be spawned only on tiles not occupied by other events (true) or on all tiles (false).
 * @type boolean
 * @on Non-Occupied Tiles
 * @off All Tiles
 * @default true
 * 
 * @arg persistent
 * @text Persistent?
 * @desc Define whether the event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @arg despawnable
 * @text Despawnable?
 * @desc Define whether the event can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @arg despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false
 * 
 * @arg pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the event (optional).
 * @type item
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add a line of text to be displayed when spawning the event (optional). Use %2 to incorporate the event's name.
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon spawning the event (optional).
 * @type animation
 * 
 * @command despawnEvent
 * @text Despawn Event
 * @desc Define the parameters for despawning an event in real (game) time.
 *
 * @arg exactLocation
 * @text Exact Location
 * @desc Enter the coordinates of the event to despawn in the current game map in this format: x, y
 * @type string
 * 
 * @arg sourceEventId
 * @text Source Event ID
 * @desc Enter the ID of the source event whose spawned 'copies' you want to despawn in the current game map.
 * @type number
 * @min 1
 *
 * @arg eventName
 * @text Event Name
 * @desc Enter the name of the event(s) to despawn in the current game map.
 * @type string
 * 
 * @arg eventId
 * @text Spawned event ID
 * @desc Enter the ID of the spawned event you want to despawn in the current game map.
 * @type number
 * @min 1
 * 
 * @arg regionId
 * @text Region ID
 * @desc Enter the ID of the region in the current game map in which to despawn all events.
 * @type number
 * @min 1
 * @max 255
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add a line of text to be displayed when despawning the event (optional).
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon despawning the event (optional).
 * @type animation
 * 
 * @command transformEvent
 * @text Transform Event
 * @desc Define the parameters for transforming an event (or several events) into another event in real (game) time.
 *
 * @arg exactLocation
 * @text Exact Location
 * @desc Enter the coordinates of the event to transform in the current game map in this format: x, y
 * @type string
 * 
 * @arg sourceEventId
 * @text Source Event ID
 * @desc Enter the ID of the source event whose spawned 'copies' you want to transform in the current game map.
 * @type number
 * @min 1
 *
 * @arg eventName
 * @text Event Name
 * @desc Enter the name of the event(s) to transform in the current game map.
 * @type string
 * 
 * @arg eventId
 * @text Spawned event ID
 * @desc Enter the ID of the spawned event you want to transform in the current game map.
 * @type number
 * @min 1
 * 
 * @arg regionId
 * @text Region ID
 * @desc Enter the ID of the region in the current game map in which to transform all events.
 * @type number
 * @min 1
 * @max 255
 * 
 * @arg transformToEventId
 * @text Transform to event ID
 * @desc Enter the ID of the source event you want to transform the events to.
 * @type number
 * @min 1
 * 
 * @arg transformToEventName
 * @text Transform to event Name
 * @desc Enter the name of the source event you want to transform the events to (instead of its ID).
 * @type string
 * 
 * @arg persistent
 * @text Persistent?
 * @desc Define whether the new transformed event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @arg despawnable
 * @text Despawnable?
 * @desc Define whether the transformed event can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @arg despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false
 * 
 * @arg pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the transformed event (optional).
 * @type item
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add text to display upon event transformation (optional). Use %1 to incorporate the transformed event's name.
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon event transformation (optional).
 * @type animation
 * 
 * @command playerSpawnEvent
 * @text Player Spawn Event
 * @desc Define the parameters for spawning an event (or several events) in real (game) time by the player.
 *
 * @arg sourceEventId
 * @text SourceEventId
 * @desc Enter the ID of the source event to be spawned.
 * @type number
 * @min 0
 * 
 * @arg sourceEventName
 * @text Source Event Name:
 * @desc Enter the (unique!) name of the source event to be spawned (instead of its ID).
 * @type string
 * 
 * @arg locationRestrictions
 * @text Location Restrictions
 * @desc Define restrictions for locations in which the event can be spawned (if left empty - no restrictions).
 * @type struct<locationRestrictionsParams>
 * 
 * @arg placeEvent
 * @text Where to Place the Event(s)
 * @desc Define where to spawn the event(s) in relation to the player's position.
 * @type select
 * @option In front of the player
 * @value front
 * @option Behind the back of the last member of the player's party
 * @value back
 * @option To the right of the player
 * @value right
 * @option To the left of the player
 * @value left
 * @option Custom position in relation to the player.
 * @value custom
 * @default front
 * 
 * @arg customPlacingXY
 * @text Custom Position XY Offset
 * @desc Define the event's custom position in relation to the player in this format: x, y
 * @type string
 * 
 * @arg numSpawns
 * @text Number of Spawns
 * @desc Define how many times to spawn the event (in a straight line) in (and from) the chosen position.
 * @type number
 * @min 1
 * @default 1
 * 
 * @arg passable
 * @text Spawn Only on Passable Tiles?
 * @desc Define whether the event can be spawned only on passable tiles (true) or on all tiles (false).
 * @type boolean
 * @on Only Passable Tiles
 * @off All Tiles
 * @default true
 *
 * @arg clear
 * @text Spawn Only on Non-Occupied Tiles:
 * @desc Define whether the event can be spawned only on tiles not occupied by other events (true) or on all tiles (false).
 * @type boolean
 * @on Non-Occupied Tiles
 * @off All Tiles
 * @default true
 * 
 * @arg persistent
 * @text Persistent?
 * @desc Define whether the event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @arg despawnable
 * @text Despawnable?
 * @desc Define whether the event can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @arg despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false
 * 
 * @arg pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the event (optional).
 * @type item
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add a line of text to be displayed when spawning the event (optional). Use %2 to incorporate the event's name.
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon spawning the event (optional).
 * @type animation
 * 
 * @command eventSpawnEvent
 * @text Event Spawn Event
 * @desc Define the parameters for spawning an event in real (game) time, by another event.
 *
 * @arg sourceEventId
 * @text SourceEventId
 * @desc Enter the ID of the source event to be spawned.
 * @type number
 * @min 0
 * 
 * @arg sourceEventName
 * @text Source Event Name:
 * @desc Enter the (unique!) name of the source event to be spawned (instead of its ID).
 * @type string
 * 
 * @arg locationRestrictions
 * @text Location Restrictions
 * @desc Define restrictions for locations in which the event can be spawned (if left empty - no restrictions).
 * @type struct<locationRestrictionsParams>
 * 
 * @arg placeEvent
 * @text Where to Place the Event
 * @desc Define where to spawn the event in relation to the spawning event's position.
 * @type select
 * @option In front of the spawning event
 * @value front
 * @option Behind the back of spawning event
 * @value back
 * @option To the right of the spawning event
 * @value right
 * @option To the left of the spawning event
 * @value left
 * @option Custom position in relation to the spawning event.
 * @value custom
 * @default front
 * 
 * @arg customPlacingXY
 * @text Custom Position XY Offset
 * @desc Define the event's custom position in relation to the spawning event, in this format: x, y
 * @type string
 * 
 * @arg numSpawns
 * @text Number of Spawns
 * @desc Define how many times to spawn the event (in a straight line) in (and from) the chosen position.
 * @type number
 * @min 1
 * @default 1
 * 
 * @arg passable
 * @text Spawn Only on Passable Tiles?
 * @desc Define whether the event can be spawned only on passable tiles (true) or on all tiles (false).
 * @type boolean
 * @on Only Passable Tiles
 * @off All Tiles
 * @default true
 *
 * @arg clear
 * @text Spawn Only on Non-Occupied Tiles:
 * @desc Define whether the event can be spawned only on tiles not occupied by other events (true) or on all tiles (false).
 * @type boolean
 * @on Non-Occupied Tiles
 * @off All Tiles
 * @default true
 * 
 * @arg persistent
 * @text Persistent?
 * @desc Define whether the event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @arg despawnable
 * @text Despawnable?
 * @desc Define whether the event can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @arg despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false
 * 
 * @arg pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the event (optional).
 * @type item
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add text to display when spawning (optional). Use %1 & %2 to insert the spawning event & spawned event's names.
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon spawning the event (optional).
 * @type animation 
 * 
 * @command playerTransformEvent
 * @text Player Transform Event
 * @desc Define the parameters for transforming one event into another in real (game) time by the player.
 *
 * @arg sourceEventId
 * @text Transform to Event ID
 * @desc Enter the ID of the event to transform to.
 * @type number
 * @min 0
 * 
 * @arg sourceEventName
 * @text Transform to Event Name
 * @desc Enter the (unique!) name of the event to transform to (instead of its ID).
 * @type string
 * 
 * @arg eventRestrictions
 * @text Event Restrictions
 * @desc Define restrictions for events that can be transformed (if left empty - no restrictions).
 * @type struct<eventRestrictionsParams>
 * 
 * @arg locationRestrictions
 * @text Location Restrictions
 * @desc Define restrictions for locations in which events can be transformed (if left empty - no restrictions).
 * @type struct<locationRestrictionsParams>
 * 
 * @arg placeEvent
 * @text Where is the Event to Transform
 * @desc Define where the event to transform is in relation to the player's position.
 * @type select
 * @option In front of the player
 * @value front
 * @option Behind the back of the last member of the player's party
 * @value back
 * @option To the right of the player
 * @value right
 * @option To the left of the player
 * @value left
 * @option Custom position in relation to the player.
 * @value custom
 * @default front
 * 
 * @arg customPlacingXY
 * @text Custom Position XY Offset
 * @desc Define the event's custom position in relation to the player in this format: x, y
 * @type string
 * 
 * @arg persistent
 * @text Persistent?
 * @desc Define whether the event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @arg despawnable
 * @text Despawnable?
 * @desc Define whether the event to transform to can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @arg despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false
 * 
 * @arg pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the transformed event (optional).
 * @type item
 * 
 * @arg text
 * @text Accompanying Text
 * @desc Add text to display on event transformation (optional). Use %1 & %2 to incorporate names of old & new events.
 * @type string
 * 
 * @arg animation
 * @text Accompanying Animation
 * @desc Choose an animation to be executed upon event transformation (optional).
 * @type animation
 * 
 * @help COCOMODE_eventSpawner.js
 * 
 * General Overview
 * ================
 * RPG Maker MZ allows game developers to 'plant' hidden events which reveal
 * themselves once a condition (or set of conditions) is met, making it look 
 * like they've spawned out of nothing. However, the applications of such a 
 * manual method are limited, and there isn't a built-in system to dynamically
 * and efficiently spawn an event (or multiple events) based on various 
 * parameters and conditions, allowing for richer game-design possibilities. 
 * 
 * 1. This plugin enables developers to spawn an event (or multiple events), 
 *    from a pre-made template event stored on a dedicated map, using various
 *    parameters and conditions, making spawning a dynamic process:
 * 
 *    1.1. The spawned event contains all the data and settings from its 
 *         original source (the template event).
 * 
 *         1.1.1. The developer can refer to the source / template event
 *                either by its ID (in the source map) or by its name.
 * 
 *                NOTE: in the latter case, The event's name must be UNIQUE. 
 *                if there is more than one template event with the same name
 *                in the source map, only the last one will be taken into 
 *                account.  
 * 
 *    1.2. If the template event is changed / updated, all of the events 
 *         spawned based on this template are also updated automatically
 *         (no need to update them manaully one-by-one).
 * 
 *    1.3. The event can be spawned on all game maps according to several
 *         parameters:
 * 
 *         1.3.1. exact coordinates.
 * 
 *         1.3.2. randomly scattered throughout the map, letting the game's
 *                developer determine how many events will be spawned.
 *     
 *         1.3.3. by region ID - with 2 sub-options:
 *          
 *                1.3.3.1. Full - the event will be spawned on EVERY tile 
 *                                with the specified region IDs.
 * 
 *                1.3.3.2. Random - the event will be spawned randomly on 
 *                         tiles with the specified region IDs. The 
 *                         developer detrermines the percentage or fixed 
 *                         number of the tiles that will be spawned upon 
 *                         out of the whole. 
 * 
 *    1.4. The developer can define restrictions for the locations in 
 *         which the event can be spawned, such as:
 * 
 *         1. Only on passable tiles.
 * 
 *         2. Only on tiles that are not already occupied by other events.
 * 
 *    1.5. Whether the developer defined such restrictions or not, the 
 *         plugin makes sure that the event's spawning location is a valid
 *         one, meaning:
 * 
 *         1.5.1.  It is within the target map's boundaries.
 *         
 *         1.5.2. It contains a tile (not just black space).
 * 
 *         1.5.3. It does not contain a vehicle. 
 * 
 *         1.5.4. If the location already contains another event (and the
 *                developer allows multiple events in the location), its 
 *                priority must be different than the spawned event's 
 *                priority.
 * 
 *         If these conditions are not met, the event will not be spawned in 
 *         that location.
 * 
 *    1.5. The developer can define whether the spawned events are persistent,
 *         meaning: when the player leaves the map they are preserved and
 *         remain in the same state when the player re-enters the map.
 * 
 *    1.6. Spawned events, spawning definitions and spawning history is 
 *         preserved in saved games, allowing for game continuity.
 * 
 * 2. The plugin also enables developers to:
 * 
 *    2.1. De-spawn spawned events.
 * 
 *    2.2. Transform spawned events into other events.
 * 
 *    NOTE: these can be performed only on SPAWNED events. Events that were
 *    placed on the map "manually" by the developer will not be affected.
 * 
 *    These actions can be performed using various conditions and parameters
 *    similar to the ones described in the previous article for spawning.  
 *    They enable various game scenarios not otherwise possible, for example:
 *    planting and harvesting crops.
 * 
 * 3. Event spawning, de-spawning and transformation can be triggered by
 *    various game scenarios:
 * 
 *    3.1. Parameters and conditions (including timing conditions) pre-defined 
 *         by the user and implemented through several mechanisms (mechanisms 
 *         explained later on). For example: Enemy troops & treasure chests 
 *         scattered randomly throughout a dungeon when the player enters it. 
 * 
 *    3.2. Spawning, de-spawning and transformation mechanisms can be 
 *         incorporated (using common events) into skills, spells, items etc., 
 *         allowing the PLAYER to perform event spawning and transformation 
 *         actions in real (game) time. For example: A scroll that conjures up
 *         a demon, or a spell that transforms cats into tigers.
 * 
 *    3.3. These mechanisms can also be incorporated into other events, in 
 *         order to create scenarios in which one event 'spawns' other events. 
 *         Example scenarios: A cow 'giving birth' to calfs periodically, or 
 *         A "Boss" monster spawning other, smaller monsters.
 * 
 *    3.4. The developer can define an item to be 'dropped' by an event and
 *         'picked-up' by the player in cases where the player despawns the
 *         event. Example scenario: when the player 'harvests' a crop, or some
 *         other game resource.
 * 
 * 4. Event spawning, de-spawning and transformation can be accompanied by
 *    text prompts & animation effects, in order to 'highlight' them in certain
 *    game scenarios (optional).
 * 
 * 5. The developer can define event spawning, de-spawning and transformation, 
 *    and incorporate them into game scenarios, using 2 different approaches:
 * 
 *    5.1. Targeted / focused - Through dedicated plugin commands (6 in total).
 * 
 *    5.2. In "bulk" (multiple events pre-defined for multiple maps) Through
 *         the plugin's parameters.
 * 
 *    These mechanisms and their respective uses will be explained in detail
 *    later on.
 * 
 * 6. The plugin implements 'on-the-go' event recycling, in order to optimize
 *    the use of system resources and avoid the creation of long, crowded 
 *    event lists which might affect performance.
 * 
 * 7. The plugin is compatible with my other plugins (so far):
 * 
 *    7.1. Enemy Levels.
 * 
 *    7.2. Customized Dynamically Generated Chest Loot.
 * 
 *    7.3. Revealed Area Map.
 * 
 * 
 * Explanation of the Plugin's Commands
 * ====================================
 * 
 * Note: In order for any of the following commands to work, you must first 
 * fill out the 'Source Map ID' parameter in the plugin's parameters. This 
 * tells the plugin in which map the source / template events are stored.
 * 
 * Spawn Event
 * -----------
 * The basic command for spawning an event (or multiple events) in the 
 * current game map. can be incorporated in any event on the map, and be 
 * subjected to any kind of triggering condition. 
 * 
 * The command's arguments:
 * 
 * 1. Source Event Id - The ID of the source / template event to be copied
 *    for spawning.
 * 
 * 2. Source Event Name - The name of the source / template event to be copied
 *    for spawning. Can be used instead of the event's ID, provided the name
 *    is UNIQUE. 
 * 
 * 3. Exact Location - If you want to spawn the event in an exact location,
 *    this is where you enter the location's coordinates in x, y format.
 * 
 * 4. Number of Random Spawns - if you want the event to be spawned in 
 *    random locations throughout the map, this is were you enter the 
 *    number of events to spawn.
 * 
 *    NOTE: for this parameter to be taken into account, you must leave the
 *    previous 'Exact Location' parameter EMPTY.
 * 
 * 5. By Region ID - If you want to spawn the event in certain regions, this
 *    is where you fill the spawning parameters in these regions. 
 * 
 *    NOTE: for this parameter to be taken into account, you must leave the
 *    previous 'Exact Location' & 'Number of Random Spawns' parameters EMPTY.  
 * 
 *    Sub-parameters: 
 * 
 *    5.1. Region IDs - The IDs of the regions in which to spawn the event
 *         on the current map. Multiple IDs can be defined.
 * 
 *    5.2. Full or Random Spawn - A selection between 2 options:
 * 
 *         'Fill the Whole Region' - If this option is chosen, the event will
 *         be spawned in any valid location within the specified regions.
 * 
 *         'Scatter the Events Randomly in the Region' - If this option is 
 *         chosen, the event will be spawned in random locations within the
 *         specified regions, to the amount dictated by the developer (see 
 *         next).
 * 
 *    5.3. Number of Events - If the developer chose to scatter events
 *         randomly in the specified regions, this is where they enter the 
 *         number of events to randomly spawn.  
 * 
 * 6. Spawn Only on Passable Tiles? - Choose whether the event can be spawned
 *    on any tile, or just on PASSABLE tiles.
 * 
 * 7. Spawn Only on Non-Occupied Tiles? - Choose whether the event can be 
 *    spawned only on tiles that don't have other events on them, or on any 
 *    tile.
 * 
 * 8. Persistent? - Choose whether the spawned event (or events) will be 
 *    persistent or not. A presistent event will be 'preserved' when the 
 *    player leaves the map, and will re-appear in the same state it was 
 *    last in when the player re-enters the map.
 * 
 * 9. Despawnable? - Choose whether the spawned event can be despawned
 *    when the player touches it.
 * 
 *    NOTE 1: This is only relevant for spawned events with an 'autorun'
 *    or 'parallel' trigger, which will not react to the player's touch 
 *    without the plugin. Events that have other, touch-based triggers 
 *    (like 'Player Touch' or 'Action Button') can be defined to despawn
 *    on player's touch through the editor, and don't require this feature.
 * 
 *    NOTE 2: This feature is useful, for example, when dealing with 
 *    collectibles in the game, like harvesting crops (when they finish 
 *    the 'growing' process) or gathering resources through mining, etc.
 * 
 * 10. Prompt Player to Despawn? - If the player CAN despawn the spawned
 *     event, choose whether to despawn the event immediately on touch, 
 *     or prompt the player with a question ('Do you want to remove 
 *     the ...?') before despawning.
 * 
 * 11. Pickup Item - If the player CAN despawn the spawned event, the 
 *     developer can define an item to be 'dropped' by the event upon
 *     despawning and 'picked up' by the player. The item is defined
 *     here by its ID.
 * 
 *     NOTE: This feature is useful, for example, for the aforementioned
 *     crop harvesting and resource gathering scenarios.
 * 
 * 12. Accompanying Text - The developer can define a text message to be
 *     displayed to the player when spawning the event. The event's name
 *     can be inserted into the message by using the %2 placeholder.
 * 
 *     For example, if the event's name is 'Troll' and the defined text
 *     message was: "You just conjured up a %2!", then the message that 
 *     will be displayed to the player is: "You just conjured up a 
 *     Troll!".
 * 
 * 13. Accompanying Animation - The developer can define an animation 
 *     effect to be executed upon spawning the event.
 * 
 * 
 * Despawn Event
 * -------------
 * The basic command for despawning an event (or multiple events) in the 
 * current game map. can be incorporated in any event on the map, and be 
 * subjected to any kind of triggering condition.
 * 
 * The command's arguments:
 * 
 * 1. Exact Location - To despawn an event in an exact location, enter the 
 *    location's coordinates here in x, y format.
 * 
 * 2. Source Event ID - To despawn all events on the current map that were 
 *    spawned from a specific source / template event, enter the template
 *    event's ID here (Note: the previous parameter must be empty).
 * 
 * 3. Event Name - To despawn all events on the current map that were 
 *    spawned from a specific source / template event, you can also enter 
 *    the template event's name (instead of its ID), provided it is a UNIQUE
 *    name (Note: the previous parameters must be empty).
 * 
 * 4. Spawned Event ID - You can despawn a specific spawned event on the 
 *    map by entering Its ID here (not to be confused with the template
 *    event's ID) (Note: the previous parameters must be empty).
 * 
 * 5. Region ID - To despawn all spawned events in a certain region on the 
 *    map, enter the region's ID here (Note: the previous parameters must 
 *    be empty).
 * 
 * 6. Accompanying Text - The developer can define a text message to be
 *    displayed to the player when despawning the event. 
 * 
 * 7. Accompanying Animation - The developer can define an animation effect
 *    to be executed upon despawning the event.
 * 
 * 
 * Transform Event
 * ---------------
 * The basic command for transforming an event (or multiple events) into 
 * another event in the current game map. can be incorporated in any event 
 * on the map, and be subjected to any kind of triggering condition.
 * 
 * The command's arguments:
 * 
 * 1. Exact Location - To transform an event in an exact location, enter the 
 *    location's coordinates here in x, y format.
 * 
 * 2. Source Event ID - To transform all events on the current map that were 
 *    spawned from a specific source / template event, enter the template
 *    event's ID here (Note: the previous parameter must be empty).
 * 
 * 3. Event Name - To transform all events on the current map that were 
 *    spawned from a specific source / template event, you can also enter the 
 *    template event's name (instead of its ID), provided it is a UNIQUE name
 *    (Note: the previous parameters must be empty).
 * 
 * 4. Spawned Event ID - You can transform a specific spawned event on the 
 *    map by entering Its ID here (not to be confused with the template
 *    event's ID) (Note: the previous parameters must be empty).
 * 
 * 5. Region ID - To transform all spawned events in a certain region on the 
 *    map, enter the region's ID here (Note: the previous parameters must 
 *    be empty).
 * 
 * 6. Transform to Event ID - Enter here the ID of the template event to 
 *    transform the event (or events) to. 
 * 
 * 7. Transform to Event Name - Alternatively, you can enter here the 
 *    template event's name (instead of its ID), provided it is a UNIQUE
 *    name.
 * 
 * 8. Persistent? - Choose whether the transformed event (or events) will
 *    be persistent or not. A presistent event will be 'preserved' when the 
 *    player leaves the map, and will re-appear in the same state it was 
 *    last in when the player re-enters the map.
 * 
 * 9. Despawnable? - Choose whether the transformed event can be despawned
 *    when the player touches it.
 * 
 *    NOTE: This is only relevant for spawned events with an 'autorun'
 *    or 'parallel' trigger, which will not react to the player's touch 
 *    without the plugin. Events that have other, touch-based triggers 
 *    (like 'Player Touch' or 'Action Button') can be defined to despawn
 *    on player's touch through the editor, and don't require this feature.
 * 
 * 10. Prompt Player to Despawn? - If the player CAN despawn the transformed
 *     event, choose whether to despawn the event immediately on touch, 
 *     or prompt the player with a question ('Do you want to remove the ...?') 
 *     before despawning.
 * 
 * 11. Pickup Item - If the player CAN despawn the transformed event, the 
 *     developer can define an item to be 'dropped' by the event upon
 *     despawning and 'picked up' by the player. The item is defined
 *     here by its ID.
 * 
 * 12. Accompanying Text - The developer can define a text message to be
 *     displayed to the player when transforming the event. The transformed 
 *     (template) event's name can be inserted into the message by using the
 *     %1 placeholder.
 * 
 *     For example, if the template event's name is 'Tree' and the defined 
 *     text message was: "Transformed into a %1", then the message that will
 *     be displayed to the player is: "Transformed into a Tree!""
 * 
 * 13. Accompanying Animation - The developer can define an animation 
 *     effect to be executed upon transforming the event.
 * 
 * 
 * Player Spawn Event
 * ------------------
 * This plugin command enables the game developer to create items, skills,
 * spells etc. that can be used by the player to spawn events in real (game)
 * time, for various game scenarios.
 * 
 * The command can be incorporated into a common event, which can then
 * be attached to an item, a skill, a spell, or any other game element that 
 * is usable by the player, to be executed when the player uses them.
 * 
 * Examples: 
 * - A scroll containing a spell that allows the player to conjure up a 
 *   monster.
 * - A piece of furniture that the player can buy and then 'place' in their 
 *   house.
 * - A seed, which when 'planted' by the player in the soil, starts producing
 *   a certain type of crop.
 * 
 * The command's arguments:
 * 
 * 1. Source Event Id - The ID of the source / template event to be copied
 *    for spawning.
 * 
 * 2. Source Event Name - The name of the source / template event to be copied
 *    for spawning. Can be used instead of the event's ID, provided the name
 *    is UNIQUE.
 * 
 * 3. Location Restrictions - The developer can define here restrictions 
 *    regarding the locations in which the event can be spawned. 
 *    Sub-parameters:
 * 
 *    3.1. Map IDs - The IDs of game maps in which the event can be spawned. 
 *         Multiple map IDs can be applied. If this parameter is left empty, 
 *         the event can be spawned on any map.
 * 
 *    3.2. Region IDs - The IDs of regions in which the event can be spawned. 
 *         Multiple region IDs can be applied. If this parameter is left 
 *         empty, the event can be spawned in any region.
 * 
 *    3.3. Terrain Tags - Terrain tags in which the event can be spawned. 
 *         Multiple tags can be applied. If this parameter is left empty, 
 *         the event can be spawned on any terrain type.
 * 
 * 4. Where to Place the Event(s) - Choose here where the event will be 
 *    spawned in relation to the player's position. the options are:
 *    - In front of the player (the default option).
 *    - Behind the back of the last (visible) member of the player's party. 
 *    - To the right of the player.
 *    - to the left of the player.
 *    - Custom position in relation to the player (defined by an x, y offset
 *      definition, see later)
 * 
 * 5. Custom Position XY Offset - If the event is to be placed in a custom
 *    position in relation to the player's position, this is where you 
 *    define that location's offset from the player's position in this
 *    format: x, y.
 * 
 *    For example: If the developer wants the event to be spawned 2 tiles
 *    above the player's position and 3 tiles to their right, then the 
 *    offset they should enter here is -2, 3.
 * 
 * 6. Number of Spawns - The developer can define here how many events will
 *    be spawned by the action (default is 1). If more than one event is 
 *    spawned, the events will be spawned in a straight line in whatever
 *    direction was defined for spawning in a previous parameter.
 * 
 *    For example: If the developer defined that 2 events will be spawned, 
 *    and that the spawning will be done in front of the player, then 2 
 *    events will appear in a row in front of the player. 
 * 
 * 7. Spawn Only on Passable Tiles? - Choose whether the event can be spawned
 *    on any tile, or just on PASSABLE tiles.
 * 
 * 8. Spawn Only on Non-Occupied Tiles? - Choose whether the event can be 
 *    spawned only on tiles that don't have other events on them, or on any 
 *    tile.
 * 
 * 9. Persistent? - Choose whether the spawned event (or events) will be 
 *    persistent or not. A presistent event will be 'preserved' when the 
 *    player leaves the map, and will re-appear in the same state it was 
 *    last in when the player re-enters the map.
 * 
 * 10. Despawnable? - Choose whether the spawned event can be despawned
 *     when the player touches it.
 * 
 *     NOTE: This is only relevant for spawned events with an 'autorun'
 *     or 'parallel' trigger, which will not react to the player's touch 
 *     without the plugin. Events that have other, touch-based triggers 
 *     (like 'Player Touch' or 'Action Button') can be defined to despawn
 *     on player's touch through the editor, and don't require this feature.
 * 
 * 11. Prompt Player to Despawn? - If the player CAN despawn the spawned
 *     event, choose whether to despawn the event immediately on touch, 
 *     or prompt the player with a question ('Do you want to remove 
 *     the ...?') before despawning.
 * 
 * 12. Pickup Item - If the player CAN despawn the spawned event, the 
 *     developer can define an item to be 'dropped' by the event upon
 *     despawning and 'picked up' by the player. The item is defined
 *     here by its ID.
 * 
 * 13. Accompanying Text - The developer can define a text message to be
 *     displayed to the player when spawning the event. The event's name
 *     can be inserted into the message by using the %2 placeholder.
 * 
 *     For example, if the event's name is 'Troll' and the defined text
 *     message was: "You just conjured up a %2!", then the message that 
 *     will be displayed to the player is: "You just conjured up a 
 *     Troll!".
 * 
 * 14. Accompanying Animation - The developer can define an animation 
 *     effect to be executed upon spawning the event.
 * 
 * 
 * Event Spawn Event
 * -----------------
 * This plugin command enables the game developer to create events that 
 * spawn other events, in real (game) time. 
 * 
 * The command can be incorporated into a such an event, which then spawns 
 * other events per the developer's definitions. 
 * 
 * Examples: 
 * - A 'Cat' event which walks randomly around the map and periodically 
 *   'gives birth' to a 'Kitten' event.
 * - A 'monster' event that 'replicates' itself when the player is close by.
 * - A 'Goose' event which lays 'Golden Egg' events (periodically or just
 *   the once). 
 * 
 * The command's arguments:
 * 
 * 1. Source Event Id - The ID of the source / template event to be copied
 *    for spawning.
 * 
 * 2. Source Event Name - The name of the source / template event to be copied
 *    for spawning. Can be used instead of the event's ID, provided the name
 *    is UNIQUE.
 * 
 * 3. Location Restrictions - The developer can define here restrictions 
 *    regarding the locations in which the event can be spawned. 
 *    Sub-parameters:
 * 
 *    3.1. Map IDs - The IDs of game maps in which the event can be spawned. 
 *         Multiple map IDs can be applied. If this parameter is left empty, 
 *         the event can be spawned on any map.
 * 
 *    3.2. Region IDs - The IDs of regions in which the event can be spawned. 
 *         Multiple region IDs can be applied. If this parameter is left 
 *         empty, the event can be spawned in any region.
 * 
 *    3.3. Terrain Tags - Terrain tags in which the event can be spawned. 
 *         Multiple tags can be applied. If this parameter is left empty, 
 *         the event can be spawned on any terrain type.
 * 
 * 4. Where to Place the Event(s) - Choose here where the SPAWNED event will 
 *    be placed in relation to the SPAWNING event's position. the options are:
 *    - In front of the spawning event (the default option).
 *    - Behind the back of the spawning event. 
 *    - To the right of the spawning event.
 *    - to the left of the spawning event.
 *    - Custom position in relation to the spawning event (defined by an x, y
 *      offset definition, see later)
 * 
 * 5. Custom Position XY Offset - If the event is to be placed in a custom
 *    position in relation to the spawning event's position, this is where you 
 *    define that location's offset from the spawning event's position in this
 *    format: x, y.
 * 
 *    For example: If the developer wants the event to be spawned 2 tiles
 *    above the spawning event's position and 3 tiles to its right, then the 
 *    offset they should enter here is -2, 3.
 * 
 * 6. Number of Spawns - The developer can define here how many events will
 *    be spawned by the action (default is 1). If more than one event is 
 *    spawned, the events will be spawned in a straight line in whatever
 *    direction was defined for spawning in a previous parameter.
 * 
 *    For example: If the developer defined that 2 events will be spawned, 
 *    and that the spawning will be done in back of the spawning event, then 2 
 *    events will appear in a row behind the spawning event. 
 * 
 * 7. Spawn Only on Passable Tiles? - Choose whether the event can be spawned
 *    on any tile, or just on PASSABLE tiles.
 * 
 * 8. Spawn Only on Non-Occupied Tiles? - Choose whether the event can be 
 *    spawned only on tiles that don't have other events on them, or on any 
 *    tile.
 * 
 * 9. Persistent? - Choose whether the spawned event (or events) will be 
 *    persistent or not. A presistent event will be 'preserved' when the 
 *    player leaves the map, and will re-appear in the same state it was 
 *    last in when the player re-enters the map.
 * 
 * 10. Despawnable? - Choose whether the spawned event can be despawned
 *     when the player touches it.
 * 
 *     NOTE: This is only relevant for spawned events with an 'autorun'
 *     or 'parallel' trigger, which will not react to the player's touch 
 *     without the plugin. Events that have other, touch-based triggers 
 *     (like 'Player Touch' or 'Action Button') can be defined to despawn
 *     on player's touch through the editor, and don't require this feature.
 * 
 * 11. Prompt Player to Despawn? - If the player CAN despawn the spawned
 *     event, choose whether to despawn the event immediately on touch, 
 *     or prompt the player with a question ('Do you want to remove 
 *     the ...?') before despawning.
 * 
 * 12. Pickup Item - If the player CAN despawn the spawned event, the 
 *     developer can define an item to be 'dropped' by the event upon
 *     despawning and 'picked up' by the player.
 * 
 * 13. Accompanying Text - The developer can define a text message to be
 *     displayed to the player when spawning the event. The spawning 
 *     event's name & the spawned event's name can be inserted into the 
 *     message by using the %1 and %2 placeholders, respectively.
 * 
 *     For example, if the spawning event's name is 'Cat' and the defined, 
 *     the spawned event's name is 'Kitten', and the text message defined
 *     by the developer is: "That %1 just gave birth to a %2!", then the 
 *     message that will be displayed to the player is: "That Cat just gave
 *     birth to a Kitten!".
 * 
 * 14. Accompanying Animation - The developer can define an animation 
 *     effect to be executed upon spawning the event. 
 * 
 * 
 * Player Transform Event
 * ----------------------
 * This plugin command enables the game developer to create items, skills,
 * spells etc. that can be used by the player to transform one event into
 * another in real (game) time, for various game scenarios.
 * 
 * The command can be incorporated into a common event, which can then
 * be attached to an item, a skill, a spell, or any other game element that 
 * is usable by the player, to be executed when the player uses them.
 * 
 * Examples: 
 * - A spell scroll that transforms a 'frog' event into a 'beautiful 
 *   princess' event. 
 * - A wand that transforms certain 'rock' events into usable 'resource'
 *   (metals, diamonds etc.) events.
 * 
 * The command's arguments:
 * 
 * 1. Transform to Event ID - Enter here the ID of the template event to 
 *    transform the event (or events) to. 
 * 
 * 2. Transform to Event Name - Alternatively, you can enter here the 
 *    template event's name (instead of its ID), provided it is a UNIQUE
 *    name.
 * 
 * 3. Event Restrictions - The developer can define here restrictions
 *    on the events that can be transformed by the current command.
 *    If left empty - no restrictions are applied.
 * 
 *    For example: The developer can define that only 'Frog' events can 
 *    be transformed by a certain spell into a 'Princess' event. Or 
 *    maybe just ONE specific 'Frog' event.
 * 
 *    Sub-parameters:
 * 
 *    3.1. Source Event ID - The IDs of source / template events whose 
 *         spawned events can be transformed by the current command. If 
 *         left empty.
 * 
 *    3.2. Source Event Name - Alternatively, you can enter here the 
 *         template events' names (instead of their IDs), provided they
 *         are UNIQUE names. 
 * 
 *    3.3. Spawned Event ID - The IDs of SPAWNED events that can be 
 *         transformed by the current sommand.
 * 
 *    NOTE: These restrictions can be specified even further in 
 *    combination with 'Location Restrictions' (see next). For example:
 *    The developer can define that only 'Frog' events in a specific
 *    game map can be transformed into 'Princess' events. And so on. 
 * 
 * 4. Location Restrictions - The developer can define here restrictions 
 *    regarding the locations in which events can be transformed by the
 *    current command. Sub-parameters:
 * 
 *    3.1. Map IDs - The IDs of game maps in which events can be 
 *         transformed. Multiple map IDs can be applied. If this parameter
 *         is left empty, events can be transformed on any map.
 * 
 *    3.2. Region IDs - The IDs of regions in which events can be 
 *         transformed. Multiple region IDs can be applied. If this 
 *         parameter is left empty, events can be transformed in any region.
 * 
 *    3.3. Terrain Tags - Terrain tags in which events can be transformed. 
 *         Multiple tags can be applied. If this parameter is left empty, 
 *         events can be transformed on any terrain type.
 * 
 * 5. Where is the Event to Transform - Choose here where the event to be
 *    transformed should be in relation to the player's position. the options
 *    are:
 *    - In front of the player (the default option).
 *    - Behind the back of the last (visible) member of the player's party. 
 *    - To the right of the player.
 *    - to the left of the player.
 *    - Custom position in relation to the player (defined by an x, y offset
 *      definition, see next)
 * 
 * 6. Custom Position XY Offset - If the event to be transformed is in a 
 *    custom position in relation to the player's position, this is where you 
 *    define that location's offset from the player's position in this
 *    format: x, y.
 * 
 * 7. Persistent? - Choose whether the transformed event will be persistent 
 *    or not. A presistent event will be 'preserved' when the player leaves
 *    the map, and will re-appear in the same state it was last in when the
 *    player re-enters the map.
 * 
 * 8. Despawnable? - Choose whether the transformed event can be despawned
 *    when the player touches it.
 * 
*     NOTE: This is only relevant for spawned events with an 'autorun'
*     or 'parallel' trigger, which will not react to the player's touch 
*     without the plugin. Events that have other, touch-based triggers 
*     (like 'Player Touch' or 'Action Button') can be defined to despawn
*     on player's touch through the editor, and don't require this feature.
 * 
 * 9. Prompt Player to Despawn? - If the player CAN despawn the transformed 
 *    event, choose whether to despawn the event immediately on touch, or 
 *    prompt the player with a question ('Do you want to remove the ...?') 
 *    before despawning.
 * 
 * 10. Pickup Item - If the player CAN despawn the transformed event, the 
 *     developer can define an item to be 'dropped' by the event upon
 *     despawning and 'picked up' by the player.
 * 
 * 11. Accompanying Text - The developer can define a text message to be
 *     displayed to the player when transforming the event. The original 
 *     event's name & the transformed event's name can be inserted into the 
 *     message by using the %1 and %2 placeholders, respectively.
 * 
 *     For example, if the player is transforming a 'Cat' event into a 'Dog'
 *     event, and the text message defined by the developer is: "You
 *     transformed the %1 into a %2!", then the message that will be 
 *     displayed to the player is: "You transformed the Cat into a Dog!".
 * 
 * 12. Accompanying Animation - The developer can define an animation 
 *     effect to be executed upon transforming the event.  
 * 
 * 
 * Explanation of the Plugin's Parameters
 * ======================================
 * The plugin's parameters serve 2 purposes:
 * 
 * (1) Here is where you enter the ID of the source map, in which 
 *     source / template events are created and stored. Without
 *     this parameter, none of the plugin's features used to spawn, 
 *     despawn and transform events would work.
 * 
 * (2) The plugin's parameters also offer an alternative option for
 *     spawning events - here you can pre-define event spawning in 'bulk' - 
 *     multiple events in multiple game maps. However:
 * 
 *     (a)  events pre-defined to spawn by this method will be spawned as
 *          soon as the player enters the relevant game map. If you need 
 *          a time-triggered or condition-triggered event spawning, you
 *          better use the plugin's commands instead, and incorporate them
 *          into events that employ such conditions. 
 * 
 *      (b) Some extra features which are available in the plugin's commands
 *          (such as text prompts or animation effects executed when 
 *          spawning) are not available in this option (since they don't
 *          fit this option's spawning scenario). 
 * 
 * The parameters:
 * 
 * 1. Source Map ID - the ID of the map in which source / template events 
 *    are stored. A crucial parameter without which none of the plugin's 
 *    features work.
 * 
 * 2. Events to Spawn - Definitions for spawning events in the game's maps.
 *    Multiple definitions are possible. Sub-parameters of each definition:
 * 
 *    2.1. Source Event ID - The ID of the source / template event to be 
 *         copied for spawning.
 * 
 *    2.2. Source Event Name - The name of the source / template event to be 
 *         copied for spawning. Can be used instead of the event's ID, 
 *         provided the name is UNIQUE. 
 * 
 *    2.3. Spawn Only on Passable Tiles? - Choose whether the event can be 
 *         spawned on any tile, or just on PASSABLE tiles.
 *    
 *    2.4. Spawn Only on Non-Occupied Tiles? - Choose whether the event can be 
 *         spawned only on tiles that don't have other events on them, or on 
 *         any tile.
 * 
 *    2.5. Persistent? - Choose whether the spawned event (or events) will be 
 *         persistent or not. A presistent event will be 'preserved' when the 
 *         player leaves the map, and will re-appear in the same state it was 
 *         last in when the player re-enters the map.
 * 
 *    2.6. Despawnable? - Choose whether the spawned event can be despawned 
 *         when the player touches it.
 * 
 *         NOTE: This is only relevant for spawned events with an 'autorun'
 *         or 'parallel' trigger, which will not react to the player's touch 
 *         without the plugin. Events that have other, touch-based triggers 
 *         (like 'Player Touch' or 'Action Button') can be defined to despawn
 *         on player's touch through the editor, and don't require this 
 *         feature.
 * 
 *    2.7. Prompt Player to Despawn? - If the player CAN despawn the spawned
 *         event, choose whether to despawn the event immediately on touch, 
 *         or prompt the player with a question ('Do you want to remove 
 *         the ...?') before despawning.
 * 
 *    2.8. Pickup Item - If the player CAN despawn the spawned event, the 
 *         developer can define an item to be 'dropped' by the event upon
 *         despawning and 'picked up' by the player. 
 * 
 *    2.9. Spawning Parameters - here is where the developer defines WHERE to
 *         spawn the event. Sub-parameters:
 * 
 *         NOTE: The following definitions for locating the events are 
 *         'read' and taken into account by the plugin in order. This means 
 *         that if the developer defined exact locations in which to spawn 
 *         the event, and then also defined that the event will be scattered 
 *         randomly, the plugin will only execute the first definition. If 
 *         the developer wants to scatter the event randomly he can either 
 *         leave the 'Exact Location' definitions empty, or create a new 
 *         spawning definitions 'branch'.
 * 
 *         2.9.1. Exact Location Parameters - The developer can define exact
 *                locations in which to spawn the event. multiple definitions
 *                are possible. Sub-parameters:
 * 
 *                2.9.1.1. Map IDs - the IDs of the game maps in which to 
 *                         spawn the event in exact locations. Multiple IDs
 *                         can be entered. If left empty - the event will be
 *                         spawned in ALL maps.
 * 
 *                2.9.1.2. Coordinates - the coordinates of the locations in
 *                         which to spawn the event in the specified maps, in
 *                         x, y format. Multiple coordinates can be entered.
 *                
 *         2.9.2. Random Scattering Parameters - The developer can define 
 *                that the event will be randomly scattered throughout certain
 *                game maps. multiple definitions are possible. 
 *                Sub-parameters:
 * 
 *                2.9.2.1. Map IDs - the IDs of the game maps in which to 
 *                         spawn the event in random locations. Multiple IDs
 *                         can be entered. If left empty - the event will be
 *                         spawned in ALL maps.
 * 
 *                2.9.2.2. Minimum Number of Events - The minimum number of 
 *                         events to randomly spawn in the specified maps.
 * 
 *                2.9.2.3. Maximum Number of Events - The maximum number of 
 *                         events to randomly spawn in the specified maps.
 * 
 *                         Note: The plugin will randomly choose a number in
 *                         range between minimum and maximum, adding another
 *                         randomization element to the spawning (each map
 *                         will have a different number). 
 * 
 *         2.9.3. Region ID parameters - The developer can define that the 
 *                event will be spawned in certain region IDs, either filling 
 *                them completely or randomly scattered in their areas. 
 *                multiple definitions are possible. Sub-parameters:
 * 
 *                2.9.3.1. Map IDs - the IDs of the game maps in which to 
 *                         spawn the event in the specified regions. Multiple 
 *                         IDs can be entered. If left empty - the event will 
 *                         be spawned in ALL maps.
 * 
 *                2.9.3.2. Region IDs - The IDs of the regions in which to 
 *                         spawn the event in the specified maps. Multiple IDs
 *                         can be entered.
 * 
 *                2.9.3.3. Full or Random Spawn - the developer can select 
 *                         here between 2 options:
 * 
 *                         - 'Fill the Whole Region': If this option is 
 *                           chosen, the event will be spawned in any valid 
 *                           location within the specified regions.
 * 
 *                         - 'Scatter the Events Randomly in the Region': If 
 *                           this option is chosen, the event will be spawned 
 *                           in random locations within the specified regions, 
 *                           to the amount dictated by the developer (see 
 *                           next).
 * 
 *                2.9.3.4. Percentage - If the developer defined that the 
 *                         events will be scattered randomly in the specified 
 *                         regions, here is where he determines the percentage 
 *                         of tiles in these regions that events will spawn 
 *                         upon. For example: the developer can define that 
 *                         40% of the region's area will be populated with 
 *                         spawned events. 
 *   
 */
/*~struct~eventsParams:
 * @param sourceEventId
 * @text Source Event ID:
 * @desc Enter the ID of the event to be spawned.
 * @type number
 * @min 1
 * 
 * @param sourceEventName
 * @text Source Event Name:
 * @desc Enter the (unique!) name of the event to be spawned (instead of its ID).
 * @type string
 * 
 * @param passable
 * @text Spawn Only on Passable Tiles?
 * @desc Define whether the event can be spawned only on passable tiles (true) or on all tiles (false).
 * @type boolean
 * @on Only Passable Tiles
 * @off All Tiles
 * @default true
 *
 * @param clear
 * @text Spawn Only on Non-Occupied Tiles:
 * @desc Define whether the event can be spawned only on tiles not occupied by other events (true) or on all tiles (false).
 * @type boolean
 * @on Non-Occupied Tiles
 * @off All Tiles
 * @default true
 * 
 * @param persistent
 * @text Persistent?
 * @desc Define whether the event is persistent (persists when player leaves & re-enters the map) or not.
 * @type boolean
 * @on Persistent
 * @off Not Persistent
 * @default true
 * 
 * @param despawnable
 * @text Despawnable?
 * @desc Define whether the event can be despawned by the player.
 * @type boolean
 * @on Can be despawned
 * @off Can't be despawned
 * @default false
 * 
 * @param despawnPrompt
 * @text Prompt Player to Despawn?
 * @desc If the event can be despawned, define whether to despawn it on touch, or prompt the player with a question.
 * @type boolean
 * @on Prompt the player
 * @off Despawn on touch
 * @default false 
 * 
 * @param pickup
 * @text Pickup Item
 * @desc Define what item is "picked up" by the player when they despawn the event (optional).
 * @type item
 * 
 * @param spawn
 * @text Spawning Parameters:
 * @desc Define the parameters for spawning the chosen event.
 * @type struct<spawnParams>
 */
/*~struct~spawnParams:
 * @param exactLocation
 * @text Exact Location Parameters:
 * @desc Define exact locations in which to spawn the chosen event.
 * @type struct<exactLocationParams>[]
 * 
 * @param mapRandom
 * @text Random Scattering Parameters:
 * @desc Define the parameters for randomly spawning the chosen event in game maps.
 * @type struct<mapRandomParams>[]
 * 
 * @param regionId
 * @text Region ID Parameters:
 * @desc Define the parameters for spawning the chosen event in specific region IDs.
 * @type struct<regionIdParams>[]
 */
/*~struct~exactLocationParams:
 * @param mapIds
 * @text Map IDs:
 * @desc Enter the IDs of maps in which to spawn the chosen event (if left empty - all maps are chosen).
 * @type number[]
 * @min 1
 * @default []
 * 
 * @param coordinates
 * @text Coordinates:
 * @desc Enter the coordinates in which to spawn the event in the chosen maps in this format: x, y
 * @type string[]
 */
/*~struct~mapRandomParams:
 * @param mapIds
 * @text Map IDs:
 * @desc Enter the IDs of maps in which to spawn the chosen event (if left empty - all maps are chosen).
 * @type number[]
 * @min 1
 * @min 1
 * 
 * @param minEvents
 * @text Minimum Number of Events:
 * @desc Define the minimum number of times to spawn the event in each chosen game map.
 * @type number
 * @min 1
 * 
 * @param maxEvents
 * @text Maximum Number of Events:
 * @desc Define the maximum number of times to spawn the event in each chosen game map.
 * @type number
 * @min 1
 */
/*~struct~regionIdParams:
 * @param mapIds
 * @text Map IDs:
 * @desc Enter the IDs of maps in which to spawn the chosen event (if left empty - all maps are chosen).
 * @type number[]
 * @min 1
 * @default []
 * 
 * @param regionIds 
 * @text Region IDs:
 * @desc Enter the regions IDs in which to spawn the event in the chosen maps.
 * @type number[]
 * @min 1
 * @max 255
 * 
 * @param fullOrRandom
 * @text Full or Random Spawn:
 * @desc Define whether the spawned events will fill the whole region or be scattered randomly.
 * @type select
 * @option Fill the Whole Region
 * @value full
 * @option Scatter the Events Randomly in the Region
 * @value random
 * 
 * @param percent
 * @text Percentage:
 * @desc If events are to be scattered randomly, determine the percent for spawning out of all tiles with regionId.
 * @type number
 * @min 1
 * @max 100
 */
/*~struct~locationRestrictionsParams:
 * @param mapIds
 * @text Map IDs:
 * @desc Enter the IDs of maps in which the chosen event can be spawned (if left empty - all maps).
 * @type number[]
 * @min 1
 * @default []
 * 
 * @param regionIds 
 * @text Region IDs:
 * @desc Enter the regions IDs in which the chosen event can be spawned (if left empty - all regions).
 * @type number[]
 * @min 1
 * @max 255
 * 
 * @param terrainTags
 * @text Terrain Tags:
 * @desc Enter the terrain tags in which the chosen event can be spawned (if left empty - all terrain tags).
 * @type number[]
 * @min 0
 * @max 7
 */
/*~struct~byRegionIdParams: 
 * @param regionIds 
 * @text Region IDs:
 * @desc Enter the regions IDs in which to spawn the event in the current game map.
 * @type number[]
 * @min 1
 * @max 255
 * 
 * @param fullOrRandom
 * @text Full or Random Spawn:
 * @desc Define whether the spawned events will fill the whole region or be scattered randomly.
 * @type select
 * @option Fill the Whole Region
 * @value full
 * @option Scatter the Events Randomly in the Region
 * @value random
 * 
 * @param numEvents
 * @text Number of Events:
 * @desc If events are to be scattered randomly, determine the number of events to spawn in the chosen regions.
 * @type number
 * @min 1
 */
/*~struct~eventRestrictionsParams:
 * @param sourceEventId
 * @text Source Event ID
 * @desc Enter the IDs of source events who's spawned copies can be transformed (if left empty - all events).
 * @type number[]
 * @min 1
 * @default []
 * 
 * @param sourceEventName 
 * @text Source Event Name
 * @desc Enter the names of source events (instead of their IDs) who's spawned copies can be transformed.
 * @type string[]
 * @default []
 * 
 * @param spawnedEventId
 * @text Spawned Event ID
 * @desc Enter the IDs of spawned events who's that can be transformed (if left empty - all events).
 * @type number[]
 * @min 1
 * @default []
 */
function _0x4727(_0x2ae163,_0x110179){const _0x1cecb3=_0x1cec();return _0x4727=function(_0x4727e,_0x5d5347){_0x4727e=_0x4727e-0x88;let _0x7cb74d=_0x1cecb3[_0x4727e];return _0x7cb74d;},_0x4727(_0x2ae163,_0x110179);}const _0x5876aa=_0x4727;function _0x1cec(){const _0x16fa1e=['_spawnedEvents','regionIds','isMapLoaded','clear','keys','call','blt','log','isPassable','1109073OrupOk','numSpawns','\x20added\x20to\x20the\x20party\x27s\x20inventory.','isTriggerIn','then','playerSpawnEvent','error','add','string','prototype','startsWith','fromEntries','event','locationRestrictions','Error:','isEventRunning','utf8','spawnedEventId','$dataMap','952vuxATT','parse','replace','floor','Yes','abs','filter','highestId','vehicles','regionId','spawnEventInLocation','max','despawnable','pickup','boolean','despawn','followers','despawnPrompt','catch','saveEventLocations','percent','requestAnimation','transformToEventName','sourceEvents','_eventId','undefined','currentEventId','createCharacters','performTransfer','sourceMapId','passableTiles','coordinates','maxEvents','sourceEventsByName','File\x20not\x20found:\x20','eventRestrictions','eventId','animation','Map','_spriteset','has','_scene','playerTransformEvent','onMapLoaded','spawnEvent','checkValidLocations','transform','eventsXy','1666928qPkLJH','back','width','path','json','spawnOrTransformEvents','eventSpawnEvent','name','tilesetId','getTime','numEvents','2WEWkOb','spawnData','padStart','5NTzMou','spawnStoredEvent','spawnEventsFromDefinitions','mapRandom','split','eventSpawner','459GDAqYk','2827027remIcI','every','_priorityType','getAllLocationsWithRegionId','terrainTag','param','data','nonPersistent','random','placeEvent','persistent','number','erase','some','initialize','data/Tilesets.json','checkLocationRestrictions','front','data/','MapInfos.json','spawnDefinedEventsByCategory','transformToEventId','Do\x20you\x20want\x20to\x20remove\x20the\x20','isArray','checkIfTilePassable','push','forEach','179449fgPsQM','loadDataFile','customPlacingXY','warn','generateLocationsByRegionId','Error\x20fetching\x20or\x20reading\x20MapInfos.json:','extractSaveContents','makeSaveContents','flags','mapId','direction','transformEvent','wholeNumber','startMapEvent','2125182hpcwIG','readFileSync','includes','fullOrRandom','minEvents','reduce','concat','Invalid\x20map\x20data\x20structure.','isNormalPriority','hasTile','full','both','generateLocationsToSpawnOnDemand','generateRandomLocations','despawnOrTransformEvent','despawnEvent','mapIds','isValid','command357','custom','data/MapInfos.json','location','setChoiceCallback','start','layeredTiles','registerCommand','pages','events','map','height','sourceEventId','sourceEventName','object','priorityType','exactLocation','slice','.json','8815070pZTqtA','length','_events','spawn','_erased','use\x20strict','passable'];_0x1cec=function(){return _0x16fa1e;};return _0x1cec();}(function(_0x1be443,_0x1b1bff){const _0xeaef26=_0x4727,_0x106e5d=_0x1be443();while(!![]){try{const _0x49cddb=parseInt(_0xeaef26(0x8f))/0x1+-parseInt(_0xeaef26(0x120))/0x2*(-parseInt(_0xeaef26(0xd2))/0x3)+-parseInt(_0xeaef26(0x115))/0x4*(parseInt(_0xeaef26(0x123))/0x5)+-parseInt(_0xeaef26(0x9d))/0x6+-parseInt(_0xeaef26(0x12a))/0x7+-parseInt(_0xeaef26(0xe5))/0x8*(-parseInt(_0xeaef26(0x129))/0x9)+parseInt(_0xeaef26(0xc2))/0xa;if(_0x49cddb===_0x1b1bff)break;else _0x106e5d['push'](_0x106e5d['shift']());}catch(_0x481631){_0x106e5d['push'](_0x106e5d['shift']());}}}(_0x1cec,0x3ff26));var COCOMODE=COCOMODE||{};COCOMODE[_0x5876aa(0x128)]=function(){const _0x525bdb=_0x5876aa;_0x525bdb(0xc7);const _0x4e100e='COCOMODE_eventSpawner';let _0x102c03=PluginManager['parameters'](_0x4e100e),_0x3c2daa={};_0x3c2daa[_0x525bdb(0x12f)]={};function _0x41860a(_0x4ca287){return new Promise((_0x5638f5,_0x1fd55a)=>{const _0x443caa=_0x4727,_0x11c06a='Map'+String(_0x4ca287)[_0x443caa(0x122)](0x3,'0'),_0x3f2704=_0x443caa(0x13c)+_0x11c06a+_0x443caa(0xc1);fetch(_0x3f2704)[_0x443caa(0xd6)](_0x4a0cb7=>{const _0x218fcb=_0x443caa;if(!_0x4a0cb7['ok'])throw new Error(_0x218fcb(0x107)+_0x3f2704);return _0x4a0cb7[_0x218fcb(0x119)]();})[_0x443caa(0xd6)](_0x5bc10b=>{const _0x2bbd23=_0x443caa;if(!_0x5bc10b[_0x2bbd23(0x130)]||!_0x5bc10b[_0x2bbd23(0x11d)]||!_0x5bc10b[_0x2bbd23(0xb8)]){console[_0x2bbd23(0x92)](_0x2bbd23(0xa4)),_0x5638f5({'passableTiles':[],'highestEventId':0x0});return;}let _0x5ed659=0x0;for(const _0x2163e6 of _0x5bc10b['events']){if(_0x2163e6)_0x5ed659=Math[_0x2bbd23(0xf0)](_0x5ed659,_0x2163e6['id']);}return fetch(_0x2bbd23(0x139))['then'](_0x2b7093=>_0x2b7093[_0x2bbd23(0x119)]())[_0x2bbd23(0xd6)](_0x24d736=>{const _0xe2709d=_0x2bbd23,_0x296aac=_0x24d736[_0x5bc10b[_0xe2709d(0x11d)]];if(!_0x296aac||!_0x296aac['flags']){console['warn']('Tileset\x20not\x20found\x20or\x20invalid.'),_0x5638f5({'passableTiles':[],'highestEventId':_0x5ed659});return;}const _0x327a43=_0x296aac[_0xe2709d(0x97)],_0x4a9fa3=[],_0x3e67b4=0x4;for(let _0x240fdb=0x0;_0x240fdb<_0x5bc10b[_0xe2709d(0xba)];_0x240fdb++){for(let _0x54ee1b=0x0;_0x54ee1b<_0x5bc10b[_0xe2709d(0x117)];_0x54ee1b++){let _0x7bb4fa=![];for(let _0x3ef50c=0x0;_0x3ef50c<_0x3e67b4;_0x3ef50c++){const _0x5704fe=_0x3ef50c*_0x5bc10b[_0xe2709d(0x117)]*_0x5bc10b[_0xe2709d(0xba)]+_0x240fdb*_0x5bc10b[_0xe2709d(0x117)]+_0x54ee1b,_0x426590=_0x5bc10b[_0xe2709d(0x130)][_0x5704fe]||0x0;if(_0x426590>0x0&&_0x426590!==0x1d60){const _0x401c0d=_0x327a43[_0x426590]||0x0;if((_0x401c0d&0x10)===0x0&&(_0x401c0d&0xf)!==0xf){_0x7bb4fa=!![];break;}}}_0x7bb4fa&&_0x4a9fa3[_0xe2709d(0x8d)]([_0x54ee1b,_0x240fdb]);}}_0x5638f5({'passableTiles':_0x4a9fa3,'highestEventId':_0x5ed659});});})[_0x443caa(0xf7)](_0x2050a8=>{console['error'](_0x2050a8),_0x5638f5({'passableTiles':[],'highestEventId':0x0});});});}function _0x30be21(){const _0x3bb8ed=async()=>{const _0x48b00e=_0x4727;let _0x24352e;try{if(typeof window!==_0x48b00e(0xfe)&&window['fetch']){const _0x47ab44=await fetch(_0x48b00e(0xb1));_0x24352e=await _0x47ab44[_0x48b00e(0x119)]();}else{if(typeof require!==_0x48b00e(0xfe)){const _0x47d6fe=require('fs'),_0x33a477=require(_0x48b00e(0x118)),_0x8bcf39=_0x33a477['join']('data',_0x48b00e(0x13d));_0x24352e=JSON['parse'](_0x47d6fe[_0x48b00e(0x9e)](_0x8bcf39,_0x48b00e(0xe2)));}}}catch(_0x248e09){return console[_0x48b00e(0xd8)](_0x48b00e(0x94),_0x248e09),[];}const _0x1b3dd9=_0x24352e[_0x48b00e(0xb9)]((_0x524ebf,_0x244e6c)=>_0x524ebf?_0x244e6c:null)['filter'](_0x549f07=>_0x549f07!==null);return _0x1b3dd9;};return _0x3bb8ed();}function _0x5b2528(_0x454665,_0x49bae2){const _0x558c3d=_0x525bdb;return _0x454665[_0x558c3d(0x137)](_0x43ec78=>Array[_0x558c3d(0x8b)](_0x43ec78)&&_0x43ec78[_0x558c3d(0xc3)]===_0x49bae2[_0x558c3d(0xc3)]&&_0x43ec78[_0x558c3d(0x12b)]((_0x383a24,_0xfb35ce)=>_0x383a24===_0x49bae2[_0xfb35ce]));}function _0x51bebc(_0x389479,_0xf57be0){let _0x22c537=_0x389479,_0x5d1756=_0xf57be0;if(_0x389479!==''||_0xf57be0!==''){_0x22c537=_0x389479===''?0x1:_0x389479,_0x5d1756=_0xf57be0===''?_0x22c537:_0xf57be0;if(_0x22c537>_0x5d1756){const _0x8442b9=_0x22c537;_0x22c537=_0x5d1756,_0x5d1756=_0x8442b9;}}return[_0x22c537,_0x5d1756];}function _0x1b6997(_0x464bef,_0x2e32af){const _0x38eb54=_0x525bdb;if(_0x464bef>_0x2e32af){let _0x323806=_0x464bef;_0x464bef=_0x2e32af,_0x2e32af=_0x323806;}const _0x94d8f6=Math[_0x38eb54(0xe8)](Math['random']()*(_0x2e32af-_0x464bef+0x1))+_0x464bef;return _0x94d8f6;}function _0x3031b4(_0x57bd82){const _0x19fd31=_0x525bdb;if(_0x57bd82===null||_0x57bd82===undefined)return _0x57bd82;if(typeof _0x57bd82!==_0x19fd31(0xbd))return _0x57bd82;if(_0x57bd82 instanceof Bitmap){const _0x3314d3=new Bitmap(_0x57bd82['width'],_0x57bd82['height']);return _0x3314d3[_0x19fd31(0xcf)](_0x57bd82,0x0,0x0,_0x57bd82['width'],_0x57bd82[_0x19fd31(0xba)],0x0,0x0),_0x3314d3;}if(Array[_0x19fd31(0x8b)](_0x57bd82)){const _0x1f217e=[];for(let _0x4b9415=0x0;_0x4b9415<_0x57bd82[_0x19fd31(0xc3)];_0x4b9415++){_0x1f217e[_0x4b9415]=_0x3031b4(_0x57bd82[_0x4b9415]);}return _0x1f217e;}if(_0x57bd82 instanceof Date)return new Date(_0x57bd82[_0x19fd31(0x11e)]());const _0x161f02={};for(const _0x42dffb in _0x57bd82){_0x57bd82['hasOwnProperty'](_0x42dffb)&&(_0x161f02[_0x42dffb]=_0x3031b4(_0x57bd82[_0x42dffb]));}return _0x161f02;}function _0x47f3f0(_0x5c10ea){return new Promise((_0x118529,_0x135df8)=>{const _0x5351d1=_0x4727,_0x32e5cd=_0x5351d1(0x10b)+String(_0x5c10ea)[_0x5351d1(0x122)](0x3,'0')+'.json';DataManager[_0x5351d1(0x90)](_0x5351d1(0xe4),_0x32e5cd);const _0xd85ea6=setInterval(()=>{const _0x8bf612=_0x5351d1;if(DataManager[_0x8bf612(0xcb)]()){clearInterval(_0xd85ea6);const _0x30ba00={};for(let _0x5521c7=0x0;_0x5521c7<$dataMap['events'][_0x8bf612(0xc3)];_0x5521c7++){$dataMap[_0x8bf612(0xb8)][_0x5521c7]!==null&&(_0x30ba00[_0x5521c7]=$dataMap[_0x8bf612(0xb8)][_0x5521c7]);}_0x118529(_0x30ba00);}},0x64);});}function _0x659d71(_0x4a984c,_0x3eeb09){const _0x5db114=_0x525bdb;return Math[_0x5db114(0xea)](_0x4a984c[0x0]-_0x3eeb09[0x0])+Math['abs'](_0x4a984c[0x1]-_0x3eeb09[0x1]);}function _0x4b0e61(_0x1fcde9,_0x7d3cf6,_0x7e70fb){let _0x365c7d=!![];for(const _0x45332a of _0x7d3cf6){if(_0x659d71(_0x1fcde9,_0x45332a)<_0x7e70fb){_0x365c7d=![];break;}}return _0x365c7d;}function _0x1f1166(_0x33dd55,_0x306258,_0x49f005){let [_0x1bcb6e,_0x1e0a4c]=_0x33dd55;const _0x4a6890={'front':{0x2:[0x0,0x1],0x4:[-0x1,0x0],0x6:[0x1,0x0],0x8:[0x0,-0x1]},'back':{0x2:[0x0,-0x1],0x4:[0x1,0x0],0x6:[-0x1,0x0],0x8:[0x0,0x1]},'left':{0x2:[0x1,0x0],0x4:[0x0,0x1],0x6:[0x0,-0x1],0x8:[-0x1,0x0]},'right':{0x2:[-0x1,0x0],0x4:[0x0,-0x1],0x6:[0x0,0x1],0x8:[0x1,0x0]}};if(_0x4a6890[_0x306258]&&_0x4a6890[_0x306258][_0x49f005]){const [_0x18e410,_0x129ed8]=_0x4a6890[_0x306258][_0x49f005];_0x1bcb6e+=_0x18e410,_0x1e0a4c+=_0x129ed8;}return[_0x1bcb6e,_0x1e0a4c];}function _0x9c5fe9(_0x497892){const _0xcdae90=_0x525bdb;for(let _0x3db53c=_0x497892[_0xcdae90(0xc3)]-0x1;_0x3db53c>0x0;_0x3db53c--){const _0x3b2729=Math[_0xcdae90(0xe8)](Math[_0xcdae90(0x132)]()*(_0x3db53c+0x1));[_0x497892[_0x3db53c],_0x497892[_0x3b2729]]=[_0x497892[_0x3b2729],_0x497892[_0x3db53c]];}return _0x497892;}function _0x4326b4(_0x4df49c){const _0x46eef8=_0x525bdb;for(const _0x314f5e of[_0x46eef8(0xbb),'pickup',_0x46eef8(0x10a),_0x46eef8(0xd3),'eventId','transformToEventId']){if(_0x4df49c[_0x314f5e])_0x4df49c[_0x314f5e]=Number(_0x4df49c[_0x314f5e]);}if(_0x4df49c[_0x46eef8(0xdf)]&&typeof _0x4df49c[_0x46eef8(0xdf)]===_0x46eef8(0xda)){_0x4df49c[_0x46eef8(0xdf)]=JSON['parse'](_0x4df49c[_0x46eef8(0xdf)]);for(const _0x11386c in _0x4df49c[_0x46eef8(0xdf)]){_0x4df49c[_0x46eef8(0xdf)][_0x11386c]&&(_0x4df49c[_0x46eef8(0xdf)][_0x11386c]=JSON[_0x46eef8(0xe6)](_0x4df49c['locationRestrictions'][_0x11386c])['map'](Number));}}if(_0x4df49c['eventRestrictions']&&typeof _0x4df49c['eventRestrictions']==='string'){_0x4df49c[_0x46eef8(0x108)]=JSON[_0x46eef8(0xe6)](_0x4df49c[_0x46eef8(0x108)]);for(const _0x25e096 in _0x4df49c[_0x46eef8(0x108)]){_0x4df49c['eventRestrictions'][_0x25e096]&&typeof _0x4df49c[_0x46eef8(0x108)][_0x25e096]===_0x46eef8(0xda)&&(_0x4df49c[_0x46eef8(0x108)][_0x25e096]=JSON['parse'](_0x4df49c[_0x46eef8(0x108)][_0x25e096])['map'](_0x4f5a58=>isNaN(_0x4f5a58)?_0x4f5a58:Number(_0x4f5a58)));}}if(_0x4df49c[_0x46eef8(0xbf)]){const _0x447164=_0x4df49c[_0x46eef8(0xbf)]['split'](',')[_0x46eef8(0xb9)](Number);_0x4df49c['exactLocation']=_0x447164['length']===0x2&&_0x447164['every'](_0x32a73c=>!isNaN(_0x32a73c))?_0x447164:null;}const _0x1ae37f=Number(_0x4df49c['mapRandom']);if(!isNaN(_0x1ae37f))_0x4df49c[_0x46eef8(0x126)]=_0x1ae37f;_0x4df49c['regionId']&&(_0x4df49c[_0x46eef8(0xee)]=JSON[_0x46eef8(0xe6)](_0x4df49c[_0x46eef8(0xee)]),_0x4df49c['regionId'][_0x46eef8(0xca)]&&(_0x4df49c['regionId'][_0x46eef8(0xca)]=JSON[_0x46eef8(0xe6)](_0x4df49c['regionId']['regionIds'])['map'](Number)),_0x4df49c['regionId'][_0x46eef8(0x11f)]=Number(_0x4df49c[_0x46eef8(0xee)][_0x46eef8(0x11f)]));if(_0x4df49c[_0x46eef8(0x133)]===_0x46eef8(0xb0)&&_0x4df49c[_0x46eef8(0x91)]){const _0x2d6cec=typeof _0x4df49c[_0x46eef8(0x91)]===_0x46eef8(0xda)?_0x4df49c[_0x46eef8(0x91)][_0x46eef8(0x127)](',')['map'](Number):_0x4df49c[_0x46eef8(0x91)];_0x4df49c['customPlacingXY']=_0x2d6cec[_0x46eef8(0xc3)]===0x2&&_0x2d6cec[_0x46eef8(0x12b)](_0x2228e9=>!isNaN(_0x2228e9))?_0x2d6cec:null;}for(const _0x287d1c of['passable',_0x46eef8(0xcc),'persistent',_0x46eef8(0xf1),_0x46eef8(0xf6)]){if(_0x4df49c[_0x287d1c])_0x4df49c[_0x287d1c]=JSON['parse'](_0x4df49c[_0x287d1c]);}return _0x4df49c;}function _0x2839be(_0x28e030){const _0x1e3850=_0x525bdb;if(!_0x28e030[_0x1e3850(0x102)])return _0x28e030;_0x28e030[_0x1e3850(0x102)]=Number(_0x28e030[_0x1e3850(0x102)]);if(!_0x28e030[_0x1e3850(0xb8)])return _0x28e030;return _0x28e030[_0x1e3850(0xb8)]=JSON[_0x1e3850(0xe6)](_0x28e030['events'])[_0x1e3850(0xb9)](_0x11db09=>{const _0x4807e6=_0x1e3850;_0x11db09=JSON[_0x4807e6(0xe6)](_0x11db09);for(const _0xfd7a52 in _0x11db09){if(!_0x11db09[_0xfd7a52])continue;if(!isNaN(_0x11db09[_0xfd7a52]))_0x11db09[_0xfd7a52]=Number(_0x11db09[_0xfd7a52]);else{if(_0xfd7a52!==_0x4807e6(0xbc)){_0x11db09[_0xfd7a52]=JSON['parse'](_0x11db09[_0xfd7a52]);for(const _0x532adb in _0x11db09[_0xfd7a52]){_0x11db09[_0xfd7a52][_0x532adb]?.[_0x4807e6(0xdc)]('[')&&(_0x11db09[_0xfd7a52][_0x532adb]=JSON[_0x4807e6(0xe6)](_0x11db09[_0xfd7a52][_0x532adb])['map'](_0x58ea38=>{const _0x2dec8b=_0x4807e6;_0x58ea38=JSON['parse'](_0x58ea38);for(const _0x1811c9 in _0x58ea38){if(!_0x58ea38[_0x1811c9])continue;if(!isNaN(_0x58ea38[_0x1811c9]))_0x58ea38[_0x1811c9]=Number(_0x58ea38[_0x1811c9]);else _0x58ea38[_0x1811c9][_0x2dec8b(0xdc)]('[')&&(_0x58ea38[_0x1811c9]=JSON[_0x2dec8b(0xe6)](_0x58ea38[_0x1811c9])['map'](_0x2aaa27=>!isNaN(_0x2aaa27)?Number(_0x2aaa27):_0x2aaa27));}return _0x58ea38;}));}}}}return _0x11db09;}),_0x28e030;}function _0x3d7bd0(_0x359984){const _0x9fe092=_0x525bdb;if(!_0x359984[_0x9fe092(0x102)])return;_0x3c2daa[_0x9fe092(0x12f)]['sourceMapId']=_0x359984['sourceMapId'],_0x47f3f0(_0x3c2daa[_0x9fe092(0x12f)]['sourceMapId'])[_0x9fe092(0xd6)](_0x5b7629=>{const _0x5a74f9=_0x9fe092;_0x3c2daa['param']['sourceEvents']=_0x5b7629,_0x3c2daa['param']['sourceEventsByName']=Object[_0x5a74f9(0xdd)](Object['values'](_0x5b7629)[_0x5a74f9(0xb9)](_0x58dd2a=>[_0x58dd2a[_0x5a74f9(0x11c)],_0x58dd2a]));if(!_0x359984[_0x5a74f9(0xb8)]?.[_0x5a74f9(0xc3)])return;for(const _0x27182b of _0x359984[_0x5a74f9(0xb8)]){const _0x7b3a71=_0x27182b[_0x5a74f9(0xbb)]||_0x27182b[_0x5a74f9(0xbc)]&&_0x3c2daa[_0x5a74f9(0x12f)][_0x5a74f9(0x106)]?.[_0x27182b[_0x5a74f9(0xbc)]]?.['id'];if(!_0x7b3a71)continue;const {exactLocation:_0x23377f,mapRandom:_0x4dad2f,regionId:_0x3ddd93}=_0x27182b[_0x5a74f9(0xc5)];if(_0x23377f?.['length'])for(const _0x41c975 of _0x23377f){if(!_0x41c975[_0x5a74f9(0x104)][_0x5a74f9(0xc3)])continue;const _0x1ebc86=[];for(const _0x59cb7d of _0x41c975['coordinates']){const _0x21a659=_0x59cb7d[_0x5a74f9(0x127)](',')[_0x5a74f9(0xb9)](_0x5ea470=>_0x5ea470['trim']());if(_0x21a659[_0x5a74f9(0xc3)]!==0x2||_0x21a659[_0x5a74f9(0x137)](_0x5b04e6=>isNaN(_0x5b04e6)))continue;const _0xe6970a=_0x21a659['map'](Number);if(!_0x5b2528(_0x1ebc86,_0xe6970a))_0x1ebc86[_0x5a74f9(0x8d)](_0xe6970a);}if(!_0x1ebc86[_0x5a74f9(0xc3)])continue;_0x41c975[_0x5a74f9(0xad)]=_0x41c975[_0x5a74f9(0xad)][_0x5a74f9(0xc3)]?_0x41c975['mapIds']:_0x45445b;for(const _0x1cad9b of _0x41c975[_0x5a74f9(0xad)]){_0x30b81d(_0x1cad9b,_0x7b3a71,_0x27182b);const _0x531da2=_0x3c2daa['param'][_0x1cad9b][_0x7b3a71];if(!_0x531da2[_0x5a74f9(0xbf)])_0x531da2[_0x5a74f9(0xbf)]=[];for(const _0x57991b of _0x1ebc86){!_0x5b2528(_0x531da2[_0x5a74f9(0xbf)],_0x57991b)&&_0x531da2[_0x5a74f9(0xbf)][_0x5a74f9(0x8d)](_0x57991b);}}}else{if(_0x4dad2f?.[_0x5a74f9(0xc3)])for(const _0x5244dc of _0x4dad2f){if(!(_0x5244dc[_0x5a74f9(0xa1)]||_0x5244dc[_0x5a74f9(0x105)]))continue;const [_0x33cc0e,_0x526d51]=_0x51bebc(_0x5244dc['minEvents'],_0x5244dc[_0x5a74f9(0x105)]);_0x5244dc[_0x5a74f9(0xad)]=_0x5244dc[_0x5a74f9(0xad)][_0x5a74f9(0xc3)]?_0x5244dc[_0x5a74f9(0xad)]:_0x45445b;for(const _0x5e0101 of _0x5244dc[_0x5a74f9(0xad)]){_0x30b81d(_0x5e0101,_0x7b3a71,_0x27182b);const _0x2dbe29=_0x1b6997(_0x33cc0e,_0x526d51);_0x3c2daa[_0x5a74f9(0x12f)][_0x5e0101][_0x7b3a71][_0x5a74f9(0x126)]=_0x2dbe29;}}else{if(_0x3ddd93?.[_0x5a74f9(0xc3)])for(const _0x5e2b9d of _0x3ddd93){if(!_0x5e2b9d['regionIds'][_0x5a74f9(0xc3)]||!_0x5e2b9d[_0x5a74f9(0xa0)])continue;_0x5e2b9d[_0x5a74f9(0xad)]=_0x5e2b9d[_0x5a74f9(0xad)][_0x5a74f9(0xc3)]?_0x5e2b9d[_0x5a74f9(0xad)]:_0x45445b;for(const _0x1e60f1 of _0x5e2b9d[_0x5a74f9(0xad)]){_0x30b81d(_0x1e60f1,_0x7b3a71,_0x27182b);const _0xc9e0e0=_0x3c2daa[_0x5a74f9(0x12f)][_0x1e60f1][_0x7b3a71];if(!_0xc9e0e0[_0x5a74f9(0xee)])_0xc9e0e0[_0x5a74f9(0xee)]={};for(const _0x1091fd of _0x5e2b9d[_0x5a74f9(0xca)]){if(_0x5e2b9d['fullOrRandom']===_0x5a74f9(0xa7))_0xc9e0e0[_0x5a74f9(0xee)][_0x1091fd]='full';else _0x5e2b9d[_0x5a74f9(0xf9)]&&(_0xc9e0e0[_0x5a74f9(0xee)][_0x1091fd]=_0x5e2b9d[_0x5a74f9(0xf9)]/0x64);}}}}}}})[_0x9fe092(0xf7)](_0x154825=>{const _0x3714b8=_0x9fe092;console[_0x3714b8(0xd0)](_0x3714b8(0xe0),_0x154825);});}function _0x30b81d(_0x80731,_0x5c6be9,_0x3ece01){const _0x13e8d6=_0x525bdb;if(!_0x3c2daa[_0x13e8d6(0x12f)][_0x80731])_0x3c2daa['param'][_0x80731]={};if(!_0x3c2daa[_0x13e8d6(0x12f)][_0x80731][_0x5c6be9])_0x3c2daa[_0x13e8d6(0x12f)][_0x80731][_0x5c6be9]={};const {passable:_0x3f286,clear:_0x2b45cc,persistent:_0x4bcd9f,despawnable:_0x15d684,despawnPrompt:_0x634f6d,pickup:_0x310167}=_0x3ece01,_0x58c902=_0x3c2daa['param'][_0x80731][_0x5c6be9];_0x58c902[_0x13e8d6(0xc8)]=typeof _0x3f286==='boolean'?_0x3f286:!![],_0x58c902[_0x13e8d6(0xcc)]=typeof _0x2b45cc===_0x13e8d6(0xf3)?_0x2b45cc:!![],_0x58c902['persistent']=typeof _0x4bcd9f===_0x13e8d6(0xf3)?_0x4bcd9f:!![],_0x58c902['despawnable']=typeof _0x15d684===_0x13e8d6(0xf3)?_0x15d684:![];if(_0x58c902[_0x13e8d6(0xf1)]){_0x58c902[_0x13e8d6(0xf6)]=typeof _0x634f6d==='boolean'?_0x634f6d:![];if(_0x310167>0x0)_0x58c902[_0x13e8d6(0xf2)]=_0x310167;}}Game_Map['prototype']['checkIfTilePassable']=function(_0x4ce8e1,_0x405c02){const _0x22abe0=_0x525bdb;return this[_0x22abe0(0xd1)](_0x4ce8e1,_0x405c02,0x2)||this['isPassable'](_0x4ce8e1,_0x405c02,0x4)||this[_0x22abe0(0xd1)](_0x4ce8e1,_0x405c02,0x6)||this[_0x22abe0(0xd1)](_0x4ce8e1,_0x405c02,0x8);},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0xa6)]=function(_0x52de6b,_0x45a01c){const _0x52b527=_0x525bdb,_0x2d5de3=this[_0x52b527(0xb5)](_0x52de6b,_0x45a01c);for(const _0x365f27 of _0x2d5de3){if(_0x365f27>0x0&&_0x365f27!==0x1d60)return!![];}return![];},Game_Map[_0x525bdb(0xdb)]['findAvailableEventId']=function(){const _0x1bee97=_0x525bdb,_0x44b6ab=this[_0x1bee97(0x98)](),_0x48016a=_0x3c2daa['param'][_0x44b6ab]['highestId'];if(_0x48016a<$dataMap[_0x1bee97(0xb8)][_0x1bee97(0xc3)]-0x1)for(let _0x3079b8=_0x48016a+0x1;_0x3079b8<this[_0x1bee97(0xc4)][_0x1bee97(0xc3)];_0x3079b8++){if(this[_0x1bee97(0xc4)][_0x3079b8]?.[_0x1bee97(0xc6)])return[_0x1bee97(0x134),'nonPersistent'][_0x1bee97(0x8e)](_0x8682ed=>{const _0x159d49=_0x1bee97;$gameSystem[_0x159d49(0xc9)]?.[_0x44b6ab]?.[_0x8682ed]?.[_0x3079b8]&&($gameSystem[_0x159d49(0xc9)][_0x44b6ab][_0x8682ed][_0x3079b8]=null);}),_0x3079b8;}return $dataMap[_0x1bee97(0xb8)][_0x1bee97(0xc3)];},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0xef)]=function(_0x46f35b,_0xfc6f84,_0x4309cb,_0x109bee,_0x3894d2,_0x370ccd,_0x19961b,_0x25fb40=null){const _0x3eff1f=_0x525bdb,_0x39550a=this[_0x3eff1f(0x98)]();let _0x26f8c7=_0x3031b4(_0x3c2daa[_0x3eff1f(0x12f)]['sourceEvents'][_0x46f35b]),_0x206625=Number(_0x4309cb)||this['findAvailableEventId']();_0x26f8c7['id']=_0x206625;if(_0xfc6f84){[_0x26f8c7['x'],_0x26f8c7['y']]=_0xfc6f84;if(!$gameSystem[_0x3eff1f(0xc9)])$gameSystem['_spawnedEvents']={};if(!$gameSystem['_spawnedEvents'][_0x39550a])$gameSystem[_0x3eff1f(0xc9)][_0x39550a]={};if(!$gameSystem['_spawnedEvents'][_0x39550a][_0x109bee])$gameSystem[_0x3eff1f(0xc9)][_0x39550a][_0x109bee]={};$gameSystem[_0x3eff1f(0xc9)][_0x39550a][_0x109bee][_0x206625]={'sourceEventId':Number(_0x46f35b),'location':_0xfc6f84,'despawnable':_0x3894d2,'despawnPrompt':_0x370ccd,'pickup':_0x19961b};}else{if(_0x4309cb&&$gameSystem['_spawnedEvents'][_0x39550a][_0x109bee][_0x4309cb]){const _0x3f63bd=$gameSystem[_0x3eff1f(0xc9)][_0x39550a][_0x109bee][_0x4309cb][_0x3eff1f(0xb2)];[_0x26f8c7['x'],_0x26f8c7['y']]=_0x3f63bd;}}$dataMap[_0x3eff1f(0xb8)][_0x206625]=_0x26f8c7;if(_0xfc6f84&&this['_events'][_0x206625])this[_0x3eff1f(0xc4)][_0x206625][_0x3eff1f(0x138)](_0x39550a,_0x206625);else!this[_0x3eff1f(0xc4)][_0x206625]&&(this[_0x3eff1f(0xc4)][_0x206625]=new Game_Event(_0x39550a,_0x206625));_0x25fb40&&$gameTemp[_0x3eff1f(0xfa)]([this['event'](_0x206625)],_0x25fb40);},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0xed)]=function(){return this['_vehicles'];},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x112)]=function(_0x316bd7,_0x2e082a,_0x1d94a5,_0xda8724){const _0x9e90fc=_0x525bdb,_0x26284c=[];for(const _0x18d8d3 of _0x316bd7){const [_0x42f180,_0x55a8d7]=_0x18d8d3;if(!this[_0x9e90fc(0xae)](_0x42f180,_0x55a8d7)||!this[_0x9e90fc(0xa6)](_0x42f180,_0x55a8d7))continue;if(_0x2e082a&&!this[_0x9e90fc(0x8c)](_0x42f180,_0x55a8d7))continue;if(this['vehicles']()['some'](_0x150715=>_0x150715['x']===_0x42f180&&_0x150715['y']===_0x55a8d7))continue;const _0x2adb84=this[_0x9e90fc(0x114)](_0x42f180,_0x55a8d7);if(_0x2adb84[_0x9e90fc(0xc3)]){if(_0x1d94a5){if(_0x2adb84['some'](_0x4b2cb0=>!_0x4b2cb0[_0x9e90fc(0xc6)]))continue;}else{if(_0x2adb84[_0x9e90fc(0x137)](_0x18296d=>!_0x18296d[_0x9e90fc(0xc6)]&&_0x18296d[_0x9e90fc(0x12c)]===_0xda8724))continue;}}_0x26284c[_0x9e90fc(0x8d)](_0x18d8d3);}return _0x26284c;},Game_Map[_0x525bdb(0xdb)]['generateRandomLocations']=function(_0xd6530,_0x2b0d42,_0xdfc6d4=null){const _0x122e53=_0x525bdb,_0x19b068=this[_0x122e53(0x98)]();if(!_0x3c2daa[_0x122e53(0x12f)][_0x19b068]?.['passableTiles']?.['length'])return;const _0x14cdf3=_0x3c2daa[_0x122e53(0x12f)][_0x19b068]?.[_0xd6530]||_0xdfc6d4,{passable:_0x539592,clear:_0x171c68}=_0x14cdf3,_0x54d51b=_0x3c2daa['param'][_0x122e53(0xfc)][_0xd6530][_0x122e53(0xb7)][0x0][_0x122e53(0xbe)],_0x22f17d=[],_0x17662a=new Set(),_0x438f35=this[_0x122e53(0x117)]()*this[_0x122e53(0xba)]()/(_0x2b0d42*0xa);let _0xc69705=0x0;while(_0x22f17d[_0x122e53(0xc3)]<_0x2b0d42&&_0xc69705<=0x2710){const _0x54bdce=_0x3c2daa[_0x122e53(0x12f)][_0x19b068][_0x122e53(0x103)][Math[_0x122e53(0xe8)](Math[_0x122e53(0x132)]()*_0x3c2daa[_0x122e53(0x12f)][_0x19b068][_0x122e53(0x103)]['length'])],[_0x2797c9,_0x3a8ffa]=_0x54bdce,_0x19a1fc=_0x2797c9+','+_0x3a8ffa;!_0x17662a[_0x122e53(0x10d)](_0x19a1fc)&&this['checkValidLocations']([_0x54bdce],_0x539592,_0x171c68,_0x54d51b)[_0x122e53(0xc3)]&&_0x4b0e61(_0x54bdce,_0x22f17d,_0x438f35)?(_0x22f17d['push'](_0x54bdce),_0x17662a[_0x122e53(0xd9)](_0x19a1fc)):_0xc69705++;}return _0x22f17d;},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x12d)]=function(_0x1ce695,_0x4dbd5f,_0x5a161d=null){const _0x4e0b7e=_0x525bdb,_0x33547e=this[_0x4e0b7e(0x98)](),_0x22c42d=_0x3c2daa[_0x4e0b7e(0x12f)][_0x33547e][_0x1ce695]||_0x5a161d,{passable:_0xa7ecb,clear:_0xfd319}=_0x22c42d,_0x5606cd=_0x3c2daa[_0x4e0b7e(0x12f)][_0x4e0b7e(0xfc)][_0x1ce695]['pages'][0x0][_0x4e0b7e(0xbe)],_0x344cf4=[];for(let _0x323f9e=0x0;_0x323f9e<this[_0x4e0b7e(0xba)]();_0x323f9e++){for(let _0x5bf4ad=0x0;_0x5bf4ad<this[_0x4e0b7e(0x117)]();_0x5bf4ad++){this['regionId'](_0x5bf4ad,_0x323f9e)===Number(_0x4dbd5f)&&this[_0x4e0b7e(0x112)]([[_0x5bf4ad,_0x323f9e]],_0xa7ecb,_0xfd319,_0x5606cd)[_0x4e0b7e(0xc3)]&&_0x344cf4[_0x4e0b7e(0x8d)]([_0x5bf4ad,_0x323f9e]);}}return _0x344cf4;},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x93)]=function(_0x15bc60,_0xb23ebb,_0x14a67b,_0x372a8a=null,_0x30ff03=null){const _0x4f2594=_0x525bdb,_0x50feec=this[_0x4f2594(0x12d)](_0x15bc60,_0xb23ebb,_0x30ff03);if(typeof _0x14a67b===_0x4f2594(0x135)){const _0x35fa73=_0x372a8a?_0x14a67b:Math['floor'](_0x14a67b*_0x50feec[_0x4f2594(0xc3)]);return _0x9c5fe9(_0x50feec)['slice'](0x0,_0x35fa73);}return _0x50feec;},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0xf8)]=function(){const _0x3f80a6=_0x525bdb,_0x1c80ea=this[_0x3f80a6(0x98)](),_0x539c76=$gameSystem[_0x3f80a6(0xc9)]?.[_0x1c80ea];if(!_0x539c76)return;for(const _0x30740c in _0x539c76){const _0x11c4d6=_0x539c76[_0x30740c];for(const _0x407a34 in _0x11c4d6){const _0x19f6ea=this['event'](_0x407a34);_0x11c4d6[_0x407a34]&&_0x19f6ea&&(!_0x19f6ea['_erased']?_0x11c4d6[_0x407a34][_0x3f80a6(0xb2)]=[_0x19f6ea['x'],_0x19f6ea['y']]:delete _0x11c4d6[_0x407a34]);}}},Game_Map['prototype'][_0x525bdb(0x88)]=function(_0x155015){const _0x54e003=_0x525bdb,_0x273bff=this[_0x54e003(0x98)](),_0x235090=_0x155015==='persistent'?!![]:![];for(const _0x4fd3b4 in _0x3c2daa['param'][_0x273bff]){const _0x1fd63c=_0x3c2daa[_0x54e003(0x12f)][_0x273bff][_0x4fd3b4];if(_0x1fd63c[_0x54e003(0x134)]===_0x235090){let _0x5db8a7=[];if(_0x1fd63c['exactLocation']){const {passable:_0x176cac,clear:_0x44741a}=_0x1fd63c,_0x67842a=_0x3c2daa['param'][_0x54e003(0xfc)][_0x4fd3b4][_0x54e003(0xb7)][0x0][_0x54e003(0xbe)];_0x5db8a7=this[_0x54e003(0x112)](_0x1fd63c[_0x54e003(0xbf)],_0x176cac,_0x44741a,_0x67842a);}else{if(_0x1fd63c[_0x54e003(0x126)])_0x5db8a7=this[_0x54e003(0xaa)](_0x4fd3b4,_0x1fd63c[_0x54e003(0x126)]);else _0x1fd63c[_0x54e003(0xee)]&&(_0x5db8a7=Object[_0x54e003(0xcd)](_0x1fd63c['regionId'])[_0x54e003(0xa2)]((_0x97f01c,_0x4c91ff)=>{const _0x3342b2=_0x54e003;return _0x97f01c[_0x3342b2(0xa3)](this['generateLocationsByRegionId'](_0x4fd3b4,_0x4c91ff,_0x1fd63c[_0x3342b2(0xee)][_0x4c91ff]));},[]));}_0x5db8a7[_0x54e003(0x8e)](_0x34057a=>{const _0xcc55ad=_0x54e003,{despawnable:_0x2fa537,despawnPrompt:_0x4f0695,pickup:_0x3d285f}=_0x1fd63c;this[_0xcc55ad(0xef)](_0x4fd3b4,_0x34057a,null,_0x155015,_0x2fa537,_0x4f0695||null,_0x3d285f||null);});}}},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x125)]=function(_0x2f5953){const _0x284e0b=_0x525bdb;this[_0x284e0b(0x88)]('nonPersistent'),_0x2f5953===_0x284e0b(0xa8)&&this[_0x284e0b(0x88)](_0x284e0b(0x134));},Game_Map[_0x525bdb(0xdb)]['generateLocationsToSpawnOnDemand']=function(_0xe27df4,_0xf4ff52,_0x3c44cb,_0x384a85){const _0x5479b6=_0x525bdb;let _0x3b38a9=_0x384a85?[this[_0x5479b6(0xde)](_0x384a85)['x'],this['event'](_0x384a85)['y']]:[$gamePlayer['x'],$gamePlayer['y']],_0x40040e=_0x384a85?this[_0x5479b6(0xc4)][_0x384a85][_0x5479b6(0x99)]():$gamePlayer[_0x5479b6(0x99)](),_0xa60c38=_0x3c44cb||0x1,_0x45f393=[];if(!_0x384a85&&_0xe27df4===_0x5479b6(0x116)){const _0x1bbede=$gamePlayer[_0x5479b6(0xf5)]()['visibleFollowers']();if(_0x1bbede[_0x5479b6(0xc3)]){const _0x5740df=_0x1bbede[_0x1bbede[_0x5479b6(0xc3)]-0x1];_0x3b38a9=[_0x5740df['x'],_0x5740df['y']],_0x40040e=_0x5740df[_0x5479b6(0x99)]();}}if(_0xe27df4===_0x5479b6(0xb0)){if(!_0xf4ff52?.[_0x5479b6(0xc3)])return _0x45f393;_0x3b38a9=[_0x3b38a9[0x0]+_0xf4ff52[0x0],_0x3b38a9[0x1]+_0xf4ff52[0x1]],_0x45f393[_0x5479b6(0x8d)]([..._0x3b38a9]),_0xe27df4=_0x5479b6(0x13b),_0xa60c38--;}while(_0xa60c38-->0x0){_0x3b38a9=_0x1f1166(_0x3b38a9,_0xe27df4,_0x40040e),_0x45f393[_0x5479b6(0x8d)]([..._0x3b38a9]);}return _0x45f393;},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x13a)]=function(_0x28f735,_0x2ee674){const _0x9ea85e=_0x525bdb,{regionIds:_0xf05a1f,terrainTags:_0x391e61}=_0x2ee674;if(!_0xf05a1f?.[_0x9ea85e(0xc3)]&&!_0x391e61?.[_0x9ea85e(0xc3)])return _0x28f735;const _0x45182c=_0xf05a1f?.[_0x9ea85e(0xc3)]?new Set(_0xf05a1f):null,_0x269d8b=_0x391e61?.[_0x9ea85e(0xc3)]?new Set(_0x391e61):null;return _0x28f735[_0x9ea85e(0xeb)](([_0x1b8d66,_0x3e6c72])=>{const _0xebda7a=_0x9ea85e,_0x281345=_0x45182c?_0x45182c[_0xebda7a(0x10d)](this['regionId'](_0x1b8d66,_0x3e6c72)):!![],_0x2cc9e0=_0x269d8b?_0x269d8b[_0xebda7a(0x10d)](this[_0xebda7a(0x12e)](_0x1b8d66,_0x3e6c72)):!![];return _0x281345&&_0x2cc9e0;});},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x124)]=function(_0x18063e,_0x4a6f90){const _0x19444a=_0x525bdb,_0xbd5c1f=this[_0x19444a(0x98)](),_0x573157=$gameSystem[_0x19444a(0xc9)][_0xbd5c1f][_0x18063e][_0x4a6f90];if(_0x573157){const {sourceEventId:_0x406377,despawnable:_0x5720ea,despawnPrompt:_0x139e66,pickup:_0x53858a}=_0x573157;this[_0x19444a(0xef)](_0x406377,null,_0x4a6f90,_0x18063e,_0x5720ea,_0x139e66||null,_0x53858a||null);}};const _0x27bc51=Scene_Map[_0x525bdb(0xdb)][_0x525bdb(0x110)];Scene_Map['prototype'][_0x525bdb(0x110)]=function(){const _0x4f85ef=_0x525bdb;_0x27bc51['call'](this);const _0x2e5d49=$gameMap[_0x4f85ef(0x98)](),_0x283e38=$gameSystem[_0x4f85ef(0xc9)]?.[_0x2e5d49];if(_0x283e38){if(_0x283e38[_0x4f85ef(0x134)])for(const _0x3d3ee8 in _0x283e38[_0x4f85ef(0x134)]){$gameMap[_0x4f85ef(0x124)](_0x4f85ef(0x134),_0x3d3ee8);}if(_0x283e38[_0x4f85ef(0x131)])for(const _0x5a1776 in _0x283e38[_0x4f85ef(0x131)]){$gameMap[_0x4f85ef(0x124)](_0x4f85ef(0x131),_0x5a1776);}else _0x3c2daa[_0x4f85ef(0x12f)][_0x2e5d49]&&$gameMap[_0x4f85ef(0x125)](_0x4f85ef(0x131));}else $gameMap[_0x4f85ef(0x125)]('both');this[_0x4f85ef(0x10c)][_0x4f85ef(0x100)]();};const _0x27f940=Game_Player[_0x525bdb(0xdb)][_0x525bdb(0x101)];Game_Player[_0x525bdb(0xdb)]['performTransfer']=function(){const _0x2fb5c9=_0x525bdb,_0x290e4c=$gameMap[_0x2fb5c9(0x98)](),_0x169a01=$gameSystem[_0x2fb5c9(0xc9)]?.[_0x290e4c];_0x169a01&&(_0x169a01[_0x2fb5c9(0x131)]=null,$gameMap[_0x2fb5c9(0xf8)]()),_0x27f940[_0x2fb5c9(0xce)](this);};const _0xd22e41=DataManager[_0x525bdb(0x96)];DataManager[_0x525bdb(0x96)]=function(){const _0x1ef376=_0x525bdb;$gameMap[_0x1ef376(0xf8)]();const _0x505860=_0xd22e41[_0x1ef376(0xce)](this);return _0x505860[_0x1ef376(0x121)]=_0x3031b4(_0x3c2daa),_0x505860;};const _0x4d8365=DataManager[_0x525bdb(0x95)];DataManager[_0x525bdb(0x95)]=function(_0x1e1a2e){const _0x11e231=_0x525bdb;_0x4d8365[_0x11e231(0xce)](this,_0x1e1a2e);if(_0x1e1a2e[_0x11e231(0x121)])_0x3c2daa=_0x3031b4(_0x1e1a2e['spawnData']);},Game_Player[_0x525bdb(0xdb)][_0x525bdb(0x9c)]=function(_0x436e70,_0x4212a4,_0x30af7f,_0x16e6b8){const _0x499d19=_0x525bdb;if(!$gameMap[_0x499d19(0xe1)]())for(const _0x43bfde of $gameMap[_0x499d19(0x114)](_0x436e70,_0x4212a4)){if(_0x43bfde[_0x499d19(0xd5)](_0x30af7f)&&_0x43bfde[_0x499d19(0xa5)]()===_0x16e6b8)_0x43bfde[_0x499d19(0xb4)]();else{if(_0x43bfde[_0x499d19(0xd5)]([0x3,0x4])&&_0x43bfde['isNormalPriority']()===_0x16e6b8){const _0x296750=$gameMap[_0x499d19(0x98)](),_0x1c78be=_0x43bfde['eventId'](),_0x456a94=$gameSystem[_0x499d19(0xc9)]?.[_0x296750];let _0x456a5f;if(_0x456a94?.[_0x499d19(0x134)]?.[_0x1c78be]?.[_0x499d19(0xf1)])_0x456a5f=_0x499d19(0x134);else _0x456a94?.['nonPersistent']?.[_0x1c78be]?.['despawnable']&&(_0x456a5f=_0x499d19(0x131));if(_0x456a5f){const _0x2c72b2=_0x456a94[_0x456a5f][_0x1c78be],_0x5f3c72=_0x43bfde[_0x499d19(0xde)]()[_0x499d19(0x11c)],_0x23e74e=_0x2c72b2[_0x499d19(0xf2)];let _0x4485d7='',_0x41eb88='';const _0x3b1744=_0x1954a8=>{const _0x43c9b1=_0x499d19;_0x43bfde['erase']();_0x1954a8&&(_0x4485d7=_0x5f3c72+'\x20removed.\x0a');if(_0x23e74e){const _0x17efca=$dataItems[_0x23e74e];$gameParty['gainItem'](_0x17efca,0x1),_0x41eb88=_0x17efca[_0x43c9b1(0x11c)]+_0x43c9b1(0xd4);}(_0x4485d7||_0x41eb88)&&setTimeout(()=>$gameMessage[_0x43c9b1(0xd9)](''+_0x4485d7+_0x41eb88),0x64);};_0x2c72b2[_0x499d19(0xf6)]?($gameMessage['setChoices']([_0x499d19(0xe9),'No'],0x0,-0x1),$gameMessage[_0x499d19(0xb3)](_0x132e18=>{if(_0x132e18===0x0)_0x3b1744(!![]);}),$gameMessage[_0x499d19(0xd9)](_0x499d19(0x8a)+_0x5f3c72+'?')):_0x3b1744(![]);}}}}};const _0x201b8a=Game_Interpreter['prototype'][_0x525bdb(0xaf)];Game_Interpreter[_0x525bdb(0xdb)][_0x525bdb(0xaf)]=function(_0x8e9791){const _0x4f1255=_0x525bdb;return _0x3c2daa[_0x4f1255(0xff)]=this[_0x4f1255(0xfd)],_0x201b8a['call'](this,_0x8e9791);},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x11a)]=function(_0x285635,_0x108353,_0x37e385=null){const _0x4f8f25=_0x525bdb,_0x5c428e=this['mapId']();let {sourceEventId:_0x76c4e9,sourceEventName:_0x231109,locationRestrictions:_0xa4927a,eventRestrictions:_0x5aca67,placeEvent:_0x5661ef,customPlacingXY:_0xf91c39,passable:_0x4d9d16,clear:_0x5ab799,persistent:_0x448c12,despawnable:_0x1933fe,despawnPrompt:_0x4ce9dc,pickup:_0x5d233c,text:_0x1ae9a4,animation:_0x2c985f,exactLocation:_0x81eef8,mapRandom:_0x56808f,regionId:_0x10a5ea,numSpawns:_0x5ec208}=_0x285635;const _0x4f273a=_0x76c4e9||_0x3c2daa['param']['sourceEventsByName']?.[_0x231109]?.['id'],_0x3bfaf6=_0x3031b4(_0x3c2daa['param'][_0x4f8f25(0xfc)]?.[_0x4f273a]);if(!_0x3bfaf6)return;const _0x309fd5=$dataMap[_0x4f8f25(0xb8)][_0x37e385]?.[_0x4f8f25(0x11c)],_0x4875ee=_0x448c12?'persistent':_0x4f8f25(0x131),_0x1b3537=_0x3bfaf6[_0x4f8f25(0xb7)][0x0][_0x4f8f25(0xbe)];let _0x4a4f08=[];if(_0x108353===_0x4f8f25(0xd7)||_0x108353===_0x4f8f25(0x11b)||_0x108353===_0x4f8f25(0x10f)){if(_0xa4927a?.['mapIds']?.[_0x4f8f25(0xc3)]&&!_0xa4927a[_0x4f8f25(0xad)][_0x4f8f25(0x9f)](_0x5c428e)||!_0x5661ef)return;const _0x26ec62=this[_0x4f8f25(0xa9)](_0x5661ef,_0xf91c39,_0x5ec208||0x1,_0x37e385),_0x42d042=this[_0x4f8f25(0x13a)](_0x26ec62,_0xa4927a);if(!_0x42d042[_0x4f8f25(0xc3)])return;if(_0x108353===_0x4f8f25(0xd7)||_0x108353===_0x4f8f25(0x11b)){_0x4a4f08=this[_0x4f8f25(0x112)](_0x42d042,_0x4d9d16,_0x5ab799,_0x1b3537);if(!_0x4a4f08[_0x4f8f25(0xc3)])return;}else{if(_0x108353===_0x4f8f25(0x10f)){const [_0x481ab5,_0xaebea]=_0x42d042[0x0],_0x444948=this[_0x4f8f25(0x114)](_0x481ab5,_0xaebea)[_0x4f8f25(0xeb)](_0x19df99=>_0x19df99[_0x4f8f25(0x109)]()>_0x3c2daa[_0x4f8f25(0x12f)][_0x5c428e][_0x4f8f25(0xec)]);if(!_0x444948[_0x4f8f25(0xc3)])return;const _0x28db67=_0x444948[0x0],_0xdee09b=_0x28db67[_0x4f8f25(0x109)](),_0x2b4583=$dataMap['events'][_0xdee09b][_0x4f8f25(0x11c)];if(_0x5aca67){const _0x5cdf58=[][_0x4f8f25(0xa3)](_0x5aca67[_0x4f8f25(0xbb)]||[])[_0x4f8f25(0xa3)]((_0x5aca67[_0x4f8f25(0xbc)]||[])[_0x4f8f25(0xb9)](_0x4a4a74=>_0x3c2daa[_0x4f8f25(0x12f)][_0x4f8f25(0x106)]?.[_0x4a4a74]?.['id'])[_0x4f8f25(0xeb)](_0x264d66=>_0x264d66&&!(_0x5aca67[_0x4f8f25(0xbb)]||[])[_0x4f8f25(0x9f)](_0x264d66))),_0x1623dd=$gameSystem['_spawnedEvents'][_0x5c428e],_0x175766=_0x1623dd?.['persistent']?.[_0xdee09b]?.[_0x4f8f25(0xbb)]||_0x1623dd?.[_0x4f8f25(0x131)]?.[_0xdee09b]?.[_0x4f8f25(0xbb)];if(!(_0x5cdf58[_0x4f8f25(0xc3)]&&_0x5cdf58['includes'](_0x175766))&&!(_0x5aca67[_0x4f8f25(0xe3)]&&_0x5aca67[_0x4f8f25(0xe3)][_0x4f8f25(0xc3)]&&_0x5aca67['spawnedEventId']['includes'](_0xdee09b)))return;}this[_0x4f8f25(0x9a)]([_0xdee09b],_0x4f273a,_0x1933fe,_0x4ce9dc,_0x5d233c,_0x4875ee,_0x2c985f);if(_0x1ae9a4)$gameMessage[_0x4f8f25(0xd9)](_0x1ae9a4[_0x4f8f25(0xe7)]('%1',_0x2b4583)[_0x4f8f25(0xe7)]('%2',_0x3bfaf6[_0x4f8f25(0x11c)]));}}}else{if(_0x108353===_0x4f8f25(0x111)){if(_0x81eef8)_0x4a4f08=this[_0x4f8f25(0x112)]([_0x81eef8],_0x4d9d16,_0x5ab799,_0x1b3537);else{if(_0x56808f)_0x4a4f08=this[_0x4f8f25(0xaa)](_0x4f273a,_0x56808f,_0x285635);else{if(_0x10a5ea?.[_0x4f8f25(0xca)]?.[_0x4f8f25(0xc3)]){const {regionIds:_0xd30966,fullOrRandom:_0xad2c36,numEvents:_0x3be00d}=_0x10a5ea;if(_0xad2c36===_0x4f8f25(0xa7))_0xd30966[_0x4f8f25(0x8e)](_0x18d2da=>_0x4a4f08['push'](...this[_0x4f8f25(0x93)](_0x4f273a,_0x18d2da,_0x4f8f25(0xa7),_0x4f8f25(0x9b),_0x285635)));else{let _0x11021a=0x0;while(_0x4a4f08['length']<(_0x3be00d||0x1)&&_0x11021a<0x2710){const _0x39fed3=_0xd30966[Math[_0x4f8f25(0xe8)](Math[_0x4f8f25(0x132)]()*_0xd30966['length'])],_0x242b61=this[_0x4f8f25(0x93)](_0x4f273a,_0x39fed3,0x1,_0x4f8f25(0x9b),_0x285635)[0x0];_0x242b61&&!_0x5b2528(_0x4a4f08,_0x242b61)?_0x4a4f08[_0x4f8f25(0x8d)](_0x242b61):_0x11021a++;}}}}}}}if([_0x4f8f25(0x111),'playerSpawnEvent',_0x4f8f25(0x11b)][_0x4f8f25(0x9f)](_0x108353)&&_0x4a4f08[_0x4f8f25(0xc3)]){_0x4a4f08[_0x4f8f25(0x8e)](_0x17a36c=>{this['spawnEventInLocation'](_0x4f273a,_0x17a36c,null,_0x4875ee,_0x1933fe,_0x4ce9dc||null,_0x5d233c||null,_0x2c985f||null);});if(_0x1ae9a4)$gameMessage[_0x4f8f25(0xd9)](_0x1ae9a4[_0x4f8f25(0xe7)]('%1',_0x309fd5)['replace']('%2',_0x3bfaf6[_0x4f8f25(0x11c)]));SceneManager[_0x4f8f25(0x10e)][_0x4f8f25(0x10c)][_0x4f8f25(0x100)]();}},Game_Map[_0x525bdb(0xdb)]['despawnOrTransformEvent']=function(_0x12c6ec,_0x16ff96){const _0x275fd4=_0x525bdb;if(_0x16ff96===_0x275fd4(0x113)&&!(_0x12c6ec[_0x275fd4(0x89)]||_0x12c6ec[_0x275fd4(0xfb)]))return;const _0x10c003=this['mapId'](),_0x557836=_0x3c2daa[_0x275fd4(0x12f)][_0x10c003]['highestId'],{exactLocation:_0x2ccdae,sourceEventId:_0xf9aa3a,eventName:_0x41b62d,eventId:_0x277037,regionId:_0x244941,text:_0x5a793f,transformToEventId:_0x1183b9,transformToEventName:_0x4b2dd3,persistent:_0x2251fa,despawnable:_0x4ef38a,despawnPrompt:_0x14bfb5,pickup:_0x2475aa,animation:_0x169f40}=_0x12c6ec;let _0xb11310,_0x1b3f90=[];if(_0x2ccdae?.[_0x275fd4(0xc3)]){const [_0x2ff157,_0x133c80]=_0x2ccdae;_0x1b3f90=this[_0x275fd4(0x114)](_0x2ff157,_0x133c80)[_0x275fd4(0xb9)](_0x49fedf=>_0x49fedf[_0x275fd4(0x109)]())[_0x275fd4(0xeb)](_0x69bf2f=>_0x69bf2f>_0x557836);}else{if(_0xf9aa3a||_0x41b62d){const _0x302f40=_0xf9aa3a?_0xf9aa3a:_0x3c2daa['param'][_0x275fd4(0x106)]?.[_0x41b62d]?.['id'];if(_0x302f40)for(const _0x39b722 of[_0x275fd4(0x134),_0x275fd4(0x131)]){const _0x14f007=$gameSystem['_spawnedEvents']?.[_0x10c003]?.[_0x39b722]||{};for(const _0x301d2e in _0x14f007){_0x14f007[_0x301d2e][_0x275fd4(0xbb)]===_0x302f40&&_0x1b3f90[_0x275fd4(0x8d)](Number(_0x301d2e));}}}else{if(_0x244941)_0x1b3f90=this[_0x275fd4(0xc4)][_0x275fd4(0xc0)](_0x557836+0x1)['filter'](_0xc4f36b=>this['regionId'](_0xc4f36b['x'],_0xc4f36b['y'])===_0x244941)[_0x275fd4(0xb9)](_0x1588c1=>_0x1588c1[_0x275fd4(0x109)]());else{if(_0x277037){if(_0x277037>_0x557836&&$dataMap['events'][_0x277037])_0x1b3f90[_0x275fd4(0x8d)](_0x277037);}else _0x1b3f90=this[_0x275fd4(0xc4)]['slice'](_0x557836+0x1)['map'](_0x2deb65=>_0x2deb65['eventId']());}}}if(!_0x1b3f90?.[_0x275fd4(0xc3)])return;if(_0x16ff96===_0x275fd4(0xf4))_0x1b3f90[_0x275fd4(0x8e)](_0x44a989=>{const _0x77fbdd=_0x275fd4;_0x169f40?($gameTemp[_0x77fbdd(0xfa)]([this[_0x77fbdd(0xde)](_0x44a989)],_0x169f40),setTimeout(()=>{const _0x22e73d=_0x77fbdd;this[_0x22e73d(0xde)](_0x44a989)?.[_0x22e73d(0x136)]();},0x1f4)):this[_0x77fbdd(0xde)](_0x44a989)?.[_0x77fbdd(0x136)]();});else{if(_0x16ff96===_0x275fd4(0x113)){const _0x4ece7d=_0x1183b9||_0x3c2daa[_0x275fd4(0x12f)][_0x275fd4(0x106)]?.[_0x4b2dd3]?.['id'],_0x334d4c=_0x2251fa?_0x275fd4(0x134):_0x275fd4(0x131);if(!_0x3c2daa[_0x275fd4(0x12f)][_0x275fd4(0xfc)][_0x4ece7d])return;_0xb11310=_0x3c2daa['param'][_0x275fd4(0xfc)][_0x4ece7d][_0x275fd4(0x11c)],this[_0x275fd4(0x9a)](_0x1b3f90,_0x4ece7d,_0x4ef38a,_0x14bfb5,_0x2475aa,_0x334d4c,_0x169f40);}}if(_0x5a793f)$gameMessage['add'](_0x5a793f[_0x275fd4(0xe7)]('%1',_0xb11310));},Game_Map[_0x525bdb(0xdb)][_0x525bdb(0x9a)]=function(_0x50e744,_0x5e6ecd,_0x35e02e,_0x2c3ebb,_0x4c1804,_0x4bc61d,_0x8a3bff){const _0x2cda6f=this['mapId']();_0x50e744['forEach'](_0x54b652=>{const _0x15f519=_0x4727,_0x161706=this['event'](_0x54b652),{x:_0x2642bd,y:_0x162056}=_0x161706,_0x21315a={..._0x3031b4(_0x3c2daa[_0x15f519(0x12f)][_0x15f519(0xfc)][_0x5e6ecd]),'eventId':_0x54b652,'x':_0x2642bd,'y':_0x162056};$dataMap['events'][_0x54b652]=_0x21315a,_0x161706[_0x15f519(0x138)](_0x2cda6f,_0x54b652),[_0x15f519(0x134),_0x15f519(0x131)][_0x15f519(0x8e)](_0x4aa1f9=>{const _0x4cd237=$gameSystem['_spawnedEvents'][_0x2cda6f][_0x4aa1f9];_0x4cd237?.[_0x54b652]&&(_0x4cd237[_0x54b652]=null);});const _0x5cb0b4={'sourceEventId':_0x5e6ecd,'location':[_0x2642bd,_0x162056],'despawnable':_0x35e02e,'despawnPrompt':_0x2c3ebb,'pickup':_0x4c1804},_0x32acd7=$gameSystem[_0x15f519(0xc9)];if(!_0x32acd7[_0x2cda6f])_0x32acd7[_0x2cda6f]={};if(!_0x32acd7[_0x2cda6f][_0x4bc61d])_0x32acd7[_0x2cda6f][_0x4bc61d]={};_0x32acd7[_0x2cda6f][_0x4bc61d][_0x54b652]=_0x5cb0b4;if(_0x8a3bff)$gameTemp[_0x15f519(0xfa)]([_0x161706],_0x8a3bff);});},_0x102c03=_0x2839be(_0x102c03);let _0x45445b;_0x30be21()[_0x525bdb(0xd6)](_0x523b51=>{const _0xc8ad7=_0x525bdb;_0x45445b=_0x523b51;for(const _0x56868d of _0x45445b){_0x41860a(_0x56868d)[_0xc8ad7(0xd6)](({passableTiles:_0x1dfcdd,highestEventId:_0x42caa7})=>{const _0x1f5b76=_0xc8ad7;if(!_0x3c2daa[_0x1f5b76(0x12f)][_0x56868d])_0x3c2daa[_0x1f5b76(0x12f)][_0x56868d]={};_0x3c2daa[_0x1f5b76(0x12f)][_0x56868d][_0x1f5b76(0xec)]=_0x42caa7,_0x3c2daa['param'][_0x56868d][_0x1f5b76(0x103)]=_0x1dfcdd;});}}),_0x3d7bd0(_0x102c03),PluginManager['registerCommand'](_0x4e100e,'spawnEvent',_0x56cc40=>{const _0xbf10fa=_0x525bdb;_0x56cc40=_0x4326b4(_0x56cc40),$gameMap[_0xbf10fa(0x11a)](_0x56cc40,_0xbf10fa(0x111));}),PluginManager[_0x525bdb(0xb6)](_0x4e100e,_0x525bdb(0xac),_0x23d911=>{const _0x1b2b3c=_0x525bdb;_0x23d911=_0x4326b4(_0x23d911),$gameMap[_0x1b2b3c(0xab)](_0x23d911,'despawn');}),PluginManager['registerCommand'](_0x4e100e,_0x525bdb(0x9a),_0x50c43f=>{const _0x3665e9=_0x525bdb;_0x50c43f=_0x4326b4(_0x50c43f),$gameMap[_0x3665e9(0xab)](_0x50c43f,_0x3665e9(0x113));}),PluginManager['registerCommand'](_0x4e100e,_0x525bdb(0xd7),_0x469d5f=>{const _0x14c43f=_0x525bdb;_0x469d5f=_0x4326b4(_0x469d5f),$gameMap[_0x14c43f(0x11a)](_0x469d5f,_0x14c43f(0xd7));}),PluginManager[_0x525bdb(0xb6)](_0x4e100e,_0x525bdb(0x11b),_0x91a152=>{const _0x17463b=_0x525bdb,_0x505365=_0x3c2daa[_0x17463b(0xff)];_0x91a152=_0x4326b4(_0x91a152),$gameMap[_0x17463b(0x11a)](_0x91a152,'eventSpawnEvent',_0x505365);}),PluginManager[_0x525bdb(0xb6)](_0x4e100e,_0x525bdb(0x10f),_0x43d312=>{const _0x3b030a=_0x525bdb;_0x43d312=_0x4326b4(_0x43d312),$gameMap[_0x3b030a(0x11a)](_0x43d312,_0x3b030a(0x10f));});},COCOMODE['eventSpawner']();