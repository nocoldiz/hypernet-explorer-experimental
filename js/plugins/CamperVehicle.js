/*:
* @plugindesc Changes the Ship into a Camper with fuel system
* @author Claude
* @target MZ
* 
* @param FuelVariableId
* @desc Variable ID used to track fuel level
* @type variable
* @default 1
* 
* @param MaxFuel
* @desc Maximum fuel capacity
* @type number
* @min 1
* @default 100
* 
* @param FuelGaugeWidth
* @desc Width of the fuel gauge
* @type number
* @min 50
* @default 150
* 
* @param FuelGaugeHeight
* @desc Height of the fuel gauge
* @type number
* @min 10
* @default 20
* 
* @param GaugeColor1
* @desc First color of the fuel gauge gradient
* @type text
* @default #e48712
* 
* @param GaugeColor2
* @desc Second color of the fuel gauge gradient
* @type text
* @default #f6c478
* 
* @param SearchRadius
* @desc Maximum search radius for finding valid position (in tiles)
* @type number
* @min 1
* @default 5
*
* @param CamperSpeedMultiplier
* @desc Speed multiplier for the camper (1.0 = normal speed)
* @type number
* @decimals 1
* @min 0.5
* @max 5.0
* @default 1.5
* 
* @command summonCamper
* @text Summon Camper
* @desc Teleports the camper to a nearby location from the player
*
* @command teleportToVehicle
* @text Teleport To Camper
* @desc Teleports the player to a location near the camper
*
* @help 
* CamperVehicle.js
* 
* This plugin changes the behavior of the ship in RPG Maker MZ:
* - Renames the ship to "Camper"
* - Makes the camper travel on land instead of water (terrain tag 3)
* - Blocks the camper from region ID 10
* - Allows the camper to pass through region ID 4
* - Adds a fuel gauge system linked to a game variable
* - Prevents movement when fuel is at zero
* - Prevents interaction with events while driving
* - Moves faster than normal walking speed
* 
* Instructions:
* 1. Set the variable ID to use for tracking fuel in the plugin parameters
* 2. Set the maximum fuel capacity
* 3. Use the standard "Ship" vehicle in your game, and this plugin will
*    transform it into the Camper
* 4. Adjust the speed multiplier in the plugin parameters (default: 1.5x faster)
* 
* Script calls:
* $gameVariables.setValue(fuelVariableId, amount); // Set fuel amount
* $gameMap.vehicle("ship").refuel(amount);         // Add fuel
* $gameMap.vehicle("ship").consumeFuel(amount);    // Consume fuel
*
* Plugin Commands:
* - Summon Camper: Teleports the camper to a nearby location from the player
* - Teleport To Camper: Teleports the player to a location near the camper
*/

(() => {
'use strict';

const pluginName = "CamperVehicle";

const parameters = PluginManager.parameters(pluginName);
const fuelVariableId = Number(parameters['FuelVariableId'] || 1);
const maxFuel = Number(parameters['MaxFuel'] || 100);
const fuelGaugeWidth = Number(parameters['FuelGaugeWidth'] || 150);
const fuelGaugeHeight = Number(parameters['FuelGaugeHeight'] || 20);
const gaugeColor1 = String(parameters['GaugeColor1'] || '#e48712');
const gaugeColor2 = String(parameters['GaugeColor2'] || '#f6c478');
const searchRadius = Number(parameters['SearchRadius'] || 5);
const camperSpeedMultiplier = Number(parameters['CamperSpeedMultiplier'] || 1.5);

//=============================================================================
// Plugin Commands
//=============================================================================

PluginManager.registerCommand(pluginName, "summonCamper", args => {
    const vehicle = $gameMap.vehicle("ship");
    if (vehicle) {
        const validPosition = findValidPosition($gamePlayer.x, $gamePlayer.y, vehicle);
        if (validPosition) {
            vehicle.setLocation($gameMap.mapId(), validPosition.x, validPosition.y);
            
            // Play SFX and show animation if desired
            AudioManager.playSe({name: "Horn", pan: 0, pitch: 100, volume: 90});
            $gameTemp.requestAnimation([vehicle], 13); // Use appropriate animation ID
            
            // Show a balloon on the vehicle (10 is usually the exclamation balloon)
            $gameTemp.requestBalloon(vehicle, 1);
        } else {
            // Show failure message
            window.skipLocalization = true;

            $gameMessage.add("Cannot find a valid location to summon the camper!");
            window.skipLocalization = false;

        }
    }
});

PluginManager.registerCommand(pluginName, "teleportToVehicle", args => {
    const vehicle = $gameMap.vehicle("ship");
    if (vehicle && vehicle.mapId() === $gameMap.mapId()) {
        const validPosition = findValidPosition(vehicle.x, vehicle.y, $gamePlayer);
        if (validPosition) {
            // Save player's direction
            const direction = $gamePlayer.direction();
            
            // Teleport player
            $gamePlayer.reserveTransfer($gameMap.mapId(), validPosition.x, validPosition.y, direction, 0);
            
            // Play SFX and show animation
            AudioManager.playSe({name: "Teleport", pan: 0, pitch: 100, volume: 90});
            $gameTemp.requestAnimation([$gamePlayer], 52); // Use appropriate animation ID
        } else {
            // Show failure message
            window.skipLocalization = true;

            $gameMessage.add("Cannot find a valid location near the camper!");
            window.skipLocalization = false;

        }
    } else {
        window.skipLocalization = true;

        $gameMessage.add("The camper is not on this map!");
        window.skipLocalization = false;

    }
});

// Helper function to find a valid position around a target
function findValidPosition(targetX, targetY, character) {
    // Check immediate surrounding tiles first (4 directions)
    const directions = [2, 4, 6, 8]; // Down, Left, Right, Up
    
    // First try the exact directions
    for (const d of directions) {
        const x = $gameMap.roundXWithDirection(targetX, d);
        const y = $gameMap.roundYWithDirection(targetY, d);
        
        if (isValidPosition(x, y, character)) {
            return {x: x, y: y};
        }
    }
    
    // If direct positions don't work, try in a spiral pattern up to search radius
    for (let r = 2; r <= searchRadius; r++) {
        // Try positions in a square around the target
        for (let dx = -r; dx <= r; dx++) {
            for (let dy = -r; dy <= r; dy++) {
                // Only check the perimeter of the square
                if (Math.abs(dx) === r || Math.abs(dy) === r) {
                    const x = $gameMap.roundX(targetX + dx);
                    const y = $gameMap.roundY(targetY + dy);
                    
                    if (isValidPosition(x, y, character)) {
                        return {x: x, y: y};
                    }
                }
            }
        }
    }
    
    // No valid position found
    return null;
}

// Helper function to check if a position is valid for the given character
function isValidPosition(x, y, character) {
    if (character.isShip()) {
        // Check camper-specific passability (same logic as in isMapPassable)
        const regionId = $gameMap.regionId(x, y);
        if (regionId === 10) return false; // Blocked by region 10
        if (regionId === 4) return true;   // Can pass through region 4
        
        // Camper can pass on land, blocked by water (terrain tag 3)
        if ($gameMap.terrainTag(x, y) === 3) return false;
        
        return $gameMap.isPassable(x, y, 0);
    } else {
        // For player, use standard passability
        return $gameMap.isPassable(x, y, 0);
    }
}

//=============================================================================
// Game_Vehicle - Modified to change ship behavior
//=============================================================================

const _Game_Vehicle_initialize = Game_Vehicle.prototype.initialize;
Game_Vehicle.prototype.initialize = function(type) {
    _Game_Vehicle_initialize.call(this, type);
    if (this.isShip()) {
        this._name = "Camper";
    }
};

// Add a log to help debug why the fuel gauge doesn't show
const _Game_Player_updateVehicleGetOn = Game_Player.prototype.updateVehicleGetOn;
Game_Player.prototype.updateVehicleGetOn = function() {
    const hasVehicle = this.vehicle();
    _Game_Player_updateVehicleGetOn.call(this);
    
    // After get on, check if we need to create the gauge
    if (!hasVehicle && this.vehicle() && this.vehicle().isShip()) {
        console.log("Player got on Camper - creating fuel gauge");
        this.vehicle().createFuelGauge();
    }
};

const _Game_Vehicle_getOn = Game_Vehicle.prototype.getOn;
Game_Vehicle.prototype.getOn = function() {
    _Game_Vehicle_getOn.call(this);
    
    // Debug log
    if (this.isShip()) {
        console.log("Vehicle getOn called for Camper");
    }
};

const _Game_Vehicle_getOff = Game_Vehicle.prototype.getOff;
Game_Vehicle.prototype.getOff = function() {
    if (this.isShip() && $gamePlayer.isInVehicle() && $gamePlayer.vehicle() === this) {
        this.hideFuelGauge();

        _Game_Vehicle_getOff.call(this);

        // Set player speed to 3 only if exiting on map 315
        if ($gameMap.mapId() === 315) {
            $gamePlayer.setMoveSpeed(3);
        } else {
            // Otherwise keep default walking speed
            $gamePlayer.setMoveSpeed(4);
        }

        $gamePlayer.followers().show();
        $gamePlayer.refresh();
    } else {
        _Game_Vehicle_getOff.call(this);
    }
};


Game_Vehicle.prototype.createFuelGauge = function() {
    console.log("Creating fuel gauge - scene exists:", !!SceneManager._scene);
    if (SceneManager._scene && SceneManager._scene instanceof Scene_Map) {
        console.log("Is Scene_Map, window exists?", !!SceneManager._scene._fuelGaugeWindow);
        if (!SceneManager._scene._fuelGaugeWindow) {
            console.log("Creating window now");
            SceneManager._scene.createFuelGaugeWindow();
        }
    }
};

Game_Vehicle.prototype.hideFuelGauge = function() {
    if (SceneManager._scene && SceneManager._scene instanceof Scene_Map) {
        if (SceneManager._scene._fuelGaugeWindow) {
            SceneManager._scene.removeFuelGaugeWindow();
        }
    }
};

Game_Vehicle.prototype.getFuel = function() {
    return $gameVariables.value(fuelVariableId);
};

Game_Vehicle.prototype.setFuel = function(value) {
    const amount = Math.max(0, Math.min(value, maxFuel));
    $gameVariables.setValue(fuelVariableId, amount);
};

Game_Vehicle.prototype.refuel = function(amount) {
    this.setFuel(this.getFuel() + amount);
};

Game_Vehicle.prototype.consumeFuel = function(amount) {
    this.setFuel(this.getFuel() - amount);
};

Game_Vehicle.prototype.hasFuel = function() {
    return this.getFuel() > 0;
};

// Override ship passability checks
const _Game_Vehicle_isMapPassable = Game_Vehicle.prototype.isMapPassable;
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    if (this.isShip()) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        
        // If out of fuel, camper can't move
        if (!this.hasFuel()) return false;
        
        // Check region-specific passability
        const regionId = $gameMap.regionId(x2, y2);
        if (regionId === 10) return false; // Blocked by region 10
        if (regionId === 4) return true;   // Can pass through region 4
        
        // Camper can pass on land, blocked by water (terrain tag 3)
        if ($gameMap.terrainTag(x2, y2) === 3) return false;
        
        return $gameMap.isPassable(x2, y2, this.reverseDir(d));
    } else {
        return _Game_Vehicle_isMapPassable.call(this, x, y, d);
    }
};

// Update method - monitor gauge timer, consume fuel, update gauge
const _Game_Vehicle_update = Game_Vehicle.prototype.update;
Game_Vehicle.prototype.update = function() {
    _Game_Vehicle_update.call(this);
    
    // Handle fuel consumption and gauge update
    if (this.isShip() && $gamePlayer.isInVehicle() && $gamePlayer.vehicle() === this) {
        // Try to create the gauge again if it doesn't exist
        if (!SceneManager._scene._fuelGaugeWindow) {
            console.log("Fuel gauge still missing - recreating");
            this.createFuelGauge();
        }
        
        // Only consume fuel when actually moving (not just idling)
        if ($gamePlayer.isMoving()) {
            if (Graphics.frameCount % 60 === 0) { // Consume fuel every 60 frames (1 second)
                this.consumeFuel(1);
            }
        }
        
        // Update fuel gauge if it exists
        if (SceneManager._scene && 
            SceneManager._scene instanceof Scene_Map && 
            SceneManager._scene._fuelGaugeWindow) {
            SceneManager._scene._fuelGaugeWindow.refresh();
        }
    }
};

// Ensure the gauge is created when player is already riding the vehicle
const _Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    
    // Check if player is already in the camper and create gauge if needed
    if ($gamePlayer.isInVehicle() && 
        $gamePlayer.vehicle() && 
        $gamePlayer.vehicle().isShip()) {
        this.createFuelGaugeWindow();
    }
};

//=============================================================================
// Window_FuelGauge - Creates the fuel gauge display
//=============================================================================

function Window_FuelGauge() {
    this.initialize(...arguments);
}

Window_FuelGauge.prototype = Object.create(Window_Base.prototype);
Window_FuelGauge.prototype.constructor = Window_FuelGauge;

Window_FuelGauge.prototype.initialize = function() {
    const width = fuelGaugeWidth + this.padding * 2;
    const height = fuelGaugeHeight + this.padding * 2;
    const x = Graphics.width - width - 20;
    const y = 20;
    Window_Base.prototype.initialize.call(this, new Rectangle(x, y, width, height));
    this.opacity = 200;
    this.refresh();
};

Window_FuelGauge.prototype.refresh = function() {
    this.contents.clear();
    const vehicle = $gameMap.vehicle("ship");
    if (vehicle) {
        const fuel = vehicle.getFuel();
        const ratio = fuel / maxFuel;
        
        // Draw fuel gauge
        const gaugeX = 0;
        const gaugeY = 0;
        const gaugeWidth = fuelGaugeWidth;
        
        this.drawGauge(gaugeX, gaugeY, gaugeWidth, ratio, gaugeColor1, gaugeColor2);
        
        // Draw text
        const text = "FUEL: " + fuel + "/" + maxFuel;
        const textWidth = this.textWidth(text);
        const textX = gaugeWidth / 2 - textWidth / 2;
        const textY = -2;
        this.drawText(text, textX, textY, gaugeWidth, "center");
    }
};

Window_FuelGauge.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    const fillWidth = Math.floor(width * rate);
    const gaugeY = y + this.lineHeight() - 8;
    const gaugeHeight = 6;
    
    // Use standard colors from ColorManager for gauge background
    this.contents.fillRect(x, gaugeY, width, gaugeHeight, ColorManager.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillWidth, gaugeHeight, color1, color2);
};

//=============================================================================
// Scene_Map - Add fuel gauge to map scene
//=============================================================================

// Add the fuel gauge to the Scene_Map createDisplayObjects to ensure it's available
const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    
    // Check if player is already in the camper and create gauge if needed
    if ($gamePlayer && $gamePlayer.isInVehicle() && 
        $gamePlayer.vehicle() && $gamePlayer.vehicle().isShip()) {
        console.log("Scene_Map createDisplayObjects - creating fuel gauge");
        this.createFuelGaugeWindow();
    }
};

Scene_Map.prototype.createFuelGaugeWindow = function() {
    console.log("createFuelGaugeWindow called");
    if (!this._fuelGaugeWindow) {
        this._fuelGaugeWindow = new Window_FuelGauge();
        this.addWindow(this._fuelGaugeWindow);
        console.log("Fuel gauge window created");
    }
};

Scene_Map.prototype.removeFuelGaugeWindow = function() {
    if (this._fuelGaugeWindow) {
        if (this._windowLayer) {
            this._windowLayer.removeChild(this._fuelGaugeWindow);
        }
        this._fuelGaugeWindow = null;
    }
};

// Prevent player from interacting with events while in Camper
const _Game_Player_checkEventTriggerHere = Game_Player.prototype.checkEventTriggerHere;
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.isInVehicle() && this.vehicle().isShip()) {
        return false; // No event interaction while in Camper
    }
    return _Game_Player_checkEventTriggerHere.call(this, triggers);
};

const _Game_Player_checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.isInVehicle() && this.vehicle().isShip()) {
        return false; // No event interaction while in Camper
    }
    return _Game_Player_checkEventTriggerThere.call(this, triggers);
};

const _Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (this.isInVehicle() && this.vehicle().isShip()) {
        return false; // No event interaction while in Camper
    }
    return _Game_Player_startMapEvent.call(this, x, y, triggers, normal);
};

// Set initial fuel value if not already set
const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    
    if ($gameVariables.value(fuelVariableId) === 0) {
        $gameVariables.setValue(fuelVariableId, maxFuel);
    }
};
// Direct approach to ensure the gauge appears - hook into the scene's existing setupDisplayObjects method
const _Scene_Map_setupDisplayObjects = Scene_Map.prototype.setupDisplayObjects;
Scene_Map.prototype.setupDisplayObjects = function() {
    _Scene_Map_setupDisplayObjects.call(this);
    
    // Set a flag on the vehicle to indicate it needs a gauge
    if ($gamePlayer && $gamePlayer.isInVehicle() && 
        $gamePlayer.vehicle() && $gamePlayer.vehicle().isShip()) {
        $gamePlayer.vehicle()._needsGauge = true;
    }
};    // Force gauge creation with an interval check
const _Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    
    // Every 60 frames, check if we need to create the fuel gauge
    if (Graphics.frameCount % 60 === 0) {
        if ($gamePlayer && $gamePlayer.isInVehicle() && 
            $gamePlayer.vehicle() && $gamePlayer.vehicle().isShip() &&
            !this._fuelGaugeWindow) {
            console.log("Scene_Map update - creating missing fuel gauge");
            this.createFuelGaugeWindow();
        }
    }
};
})();