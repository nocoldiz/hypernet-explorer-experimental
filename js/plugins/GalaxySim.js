/*:
 * @target MZ
 * @plugindesc Local Star Map v1.4.0
 * @author YourName
 * @url
 * @help
 * ============================================================================
 * Local Star Map Plugin for RPG Maker MZ
 * ============================================================================
 * * This plugin renders a local section of space around Sol,
 * showing known stars with their names within a defined radius.
 * * It allows for exploring these star systems, which feature planets
 * with labels and can be procedurally generated.
 * * Features:
 * - A local map of star systems with labels within a 10 LY diameter.
 * - Names displayed for planets within each star system.
 * - Real star systems dataset integration for local stars.
 * - Procedural planet generation for non-hardcoded systems.
 * - FTL and sub-light travel modes.
 * - Zoom (Mouse Wheel, Q/E keys), pan (click-and-drag), and max zoom-out.
 * - Level of Detail (LOD) system that hides distant stars when zoomed out
 * - Improved text rendering that stays crisp at all zoom levels
 * - Current system orrery display with smooth transitions
 * * Plugin Commands:
 * - SetFTLSpeed: Set faster-than-light speed multiplier
 * - EnterSystem: Enter a specific star system
 * - OpenGalaxyMap: Open the local star map interface
 * - ExitToGalaxy: Exit current system to map view
 * * @command SetFTLSpeed
 * @text Set FTL Speed
 * @desc Set the ship's faster-than-light speed
 * @arg speed
 * @text Speed (c)
 * @desc Speed in multiples of light speed
 * @type number
 * @default 10
 * @decimals 1
 * * @command EnterSystem
 * @text Enter Star System
 * @desc Enter a specific star system by name
 * @arg systemName
 * @text System Name
 * @desc Name of the star system to enter
 * @type string
 * * @command OpenGalaxyMap
 * @text Open Galaxy Map
 * @desc Opens the galaxy map interface
 * * @command ExitToGalaxy
 * @text Exit to Galaxy
 * @desc Exit current system and return to galaxy view
 * * @param defaultFTLSpeed
 * @text Default FTL Speed
 * @desc Default FTL speed in multiples of light speed
 * @type number
 * @default 10
 * @decimals 1
 * * @param localBubbleRadius
 * @text Local Bubble Radius (ly)
 * @desc Radius of the local space bubble to display, centered on Sol. Default is 5 for a 10 LY diameter.
 * @type number
 * @default 5
 */

(() => {
  "use strict";

  const pluginName = "GalaxySim";
  const parameters = PluginManager.parameters(pluginName);
  const localBubbleRadius = 20000000;

  // ============================================================================
  // Constants and Configuration
  // ============================================================================

  const LIGHT_SPEED = 299792458; // m/s
  const PARSEC_TO_LY = 3.26156;
  const AU_TO_M = 149597870700;
  const SOLAR_MASS = 1.989e30; // kg
  const SOLAR_RADIUS = 696340000; // m
  const { STAR_TYPES, PLANET_TYPES, SYSTEMS } = window.GalaxyData;

  // LOD (Level of Detail) constants
  const LOD_LEVELS = {
    CLOSE: { maxDistance: 5, minScale: 1.5, showText: true, showDetail: true },
    MEDIUM: { maxDistance: 15, minScale: 0.4, showText: true, showDetail: false },
    FAR: { maxDistance: 75, minScale: 0.08, showText: false, showDetail: false },
    VERY_FAR: { maxDistance: Infinity, minScale: 0.01, showText: false, showDetail: false }
  };

  // ============================================================================
  // Utility Functions
  // ============================================================================

  class RandomGenerator {
    constructor(seed) {
      this.seed = this.hashCode(seed);
    }

    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    }

    random() {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }

    range(min, max) {
      return min + this.random() * (max - min);
    }

    int(min, max) {
      return Math.floor(this.range(min, max + 1));
    }

    choose(array) {
      return array[this.int(0, array.length - 1)];
    }

    gaussian(mean = 0, stdev = 1) {
      const u = 1 - this.random();
      const v = this.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return z * stdev + mean;
    }
  }

  // ============================================================================
  // Galaxy Data Manager
  // ============================================================================

  class GalaxyDataManager {
    constructor() {
      this.knownSystems = {};
      this.cachedSystems = new Map();
      this.visitedSystems = new Set();
      this.currentLocation = null;
      this.currentSystem = "Sol"; // Default current system
      this.shipState = {
        ftlSpeed: parseFloat(parameters.defaultFTLSpeed) || 10,
        position: { x: 0, y: 0, z: 0 },
        systemPosition: { x: 0, y: 0 },
      };
    }

    setCurrentSystem(systemName) {
      this.currentSystem = systemName;
      this.saveData();
    }

    getCurrentSystem() {
      return this.currentSystem;
    }

    loadKnownSystems() {
      // Hardcoded known systems data
      const knownSystemsData = SYSTEMS;
      const filteredSystems = {};
      const radius = localBubbleRadius;
      const radiusSq = radius * radius;

      for (const key in knownSystemsData) {
        const system = knownSystemsData[key];
        const pos = system.position;
        const distanceSq = pos.x * pos.x + pos.y * pos.y + pos.z * pos.z;

        if (distanceSq <= radiusSq) {
          filteredSystems[key] = system;
        }
      }

      this.knownSystems = filteredSystems;
    }

    generateStarSystem(name, x = 0, y = 0, z = 0) {
      const key = name.toLowerCase();

      // Check for known system
      if (this.knownSystems[key]) {
        const system = this.knownSystems[key];
        if (!system.color) {
          system.color = STAR_TYPES[system.type].color;
        }
        return system;
      }

      // Check cache
      if (this.cachedSystems.has(key)) {
        return this.cachedSystems.get(key);
      }

      // Generate procedural system
      const rng = new RandomGenerator(name);
      const system = this.generateProceduralSystem(name, rng, x, y, z);

      // Cache the system
      this.cachedSystems.set(key, system);
      if (this.cachedSystems.size > 100) {
        const firstKey = this.cachedSystems.keys().next().value;
        this.cachedSystems.delete(firstKey);
      }

      return system;
    }

    generateProceduralSystem(name, rng, x, y, z) {
      // Select star type based on frequency
      let starType = "M";
      const typeRoll = rng.random();
      let cumFreq = 0;
      for (const [type, data] of Object.entries(STAR_TYPES)) {
        cumFreq += data.freq;
        if (typeRoll < cumFreq) {
          starType = type;
          break;
        }
      }

      const typeData = STAR_TYPES[starType];
      const mass = rng.range(typeData.mass[0], typeData.mass[1]);
      const radius = rng.range(typeData.radius[0], typeData.radius[1]);
      const temperature = rng.range(typeData.temp[0], typeData.temp[1]);

      // Generate planets
      const numPlanets = Math.floor(rng.gaussian(4, 2));
      const planets = [];

      for (let i = 0; i < Math.max(0, Math.min(numPlanets, 12)); i++) {
        const orbitRadius = 0.3 + Math.pow(1.5, i) * rng.range(0.8, 1.2);
        const planetType = this.selectPlanetType(orbitRadius, temperature, rng);
        const typeInfo = PLANET_TYPES[planetType];

        planets.push({
          name: `${name}-${String.fromCharCode(98 + i)}`,
          type: planetType,
          orbitRadius: orbitRadius,
          mass: rng.range(typeInfo.minMass, typeInfo.maxMass),
          period: Math.sqrt(Math.pow(orbitRadius, 3) / mass),
          angle: rng.random() * Math.PI * 2,
          atmosphere: rng.random() > 0.3,
          gravity: rng.range(0.3, 2.5),
          temperature: this.calculatePlanetTemp(temperature, orbitRadius),
        });
      }

      // Check for earthlike conditions (very rare)
      if (rng.random() < 0.001) {
        const habitableZone = Math.sqrt(
          typeData.radius[0] * typeData.radius[1]
        );
        planets.push({
          name: `${name}-h`,
          type: "ocean",
          orbitRadius: habitableZone * rng.range(0.95, 1.05),
          mass: rng.range(0.8, 1.2),
          atmosphere: true,
          gravity: rng.range(0.9, 1.1),
          temperature: rng.range(273, 323),
          earthlike: true,
        });
      }

      return {
        name: name,
        type: starType,
        mass: mass,
        radius: radius,
        temperature: temperature,
        luminosity: Math.pow(mass, 3.5),
        position: { x, y, z },
        planets: planets,
        color: typeData.color,
      };
    }

    selectPlanetType(orbitRadius, starTemp, rng) {
      const temp = this.calculatePlanetTemp(starTemp, orbitRadius);

      if (orbitRadius < 0.5 && temp > 600) return "lava";
      if (orbitRadius < 1.5 && temp > 250 && temp < 350) {
        return rng.random() < 0.3 ? "ocean" : "rocky";
      }
      if (orbitRadius < 2 && temp > 200)
        return rng.random() < 0.5 ? "rocky" : "desert";
      if (orbitRadius > 3 && orbitRadius < 10) return "gas_giant";
      if (orbitRadius > 10) return "ice_giant";
      if (temp < 200) return "ice";

      return "rocky";
    }

    calculatePlanetTemp(starTemp, orbitRadius) {
      return starTemp * Math.pow(0.5 / orbitRadius, 0.5);
    }

    addVisitedSystem(name) {
      this.visitedSystems.add(name.toLowerCase());
    }

    isSystemVisited(name) {
      return this.visitedSystems.has(name.toLowerCase());
    }

    saveData() {
      const saveData = {
        visitedSystems: Array.from(this.visitedSystems),
        currentLocation: this.currentLocation,
        currentSystem: this.currentSystem,
        shipState: this.shipState,
      };
      $gameSystem.galaxySimData = saveData;
    }

    loadData() {
      if ($gameSystem.galaxySimData) {
        const data = $gameSystem.galaxySimData;
        this.visitedSystems = new Set(data.visitedSystems || []);
        this.currentLocation = data.currentLocation;
        this.currentSystem = data.currentSystem || "Sol";
        this.shipState = data.shipState || this.shipState;
      }
    }
  }

  // ============================================================================
  // Star System Renderer
  // ============================================================================

  class StarSystemRenderer {
    constructor(container, system) {
      this.container = container;
      this.system = system;
      this.graphics = new PIXI.Graphics();
      this.planetSprites = [];
      this.shipSprite = null;
      this.scale = 50; // pixels per AU
      this.time = 0;

      this.container.addChild(this.graphics);
      this.createSystem();
    }

    createSystem() {
      // Draw star
      const starSprite = new PIXI.Graphics();
      starSprite.beginFill(this.system.color || 0xffff00);
      starSprite.drawCircle(0, 0, Math.log(this.system.radius + 1) * 10);
      starSprite.endFill();

      const glowFilter = new PIXI.filters.BlurFilter();
      glowFilter.blur = 4;
      starSprite.filters = [glowFilter];
      this.container.addChild(starSprite);

      // Create planets
      this.system.planets.forEach((planet) => {
        const planetContainer = new PIXI.Container();

        // Draw orbit
        const orbit = new PIXI.Graphics();
        orbit.lineStyle(1, 0x444444, 0.3);
        orbit.drawCircle(0, 0, planet.orbitRadius * this.scale);
        this.container.addChild(orbit);

        // Draw planet
        const planetSprite = new PIXI.Graphics();
        const planetTypeData = PLANET_TYPES[planet.type];
        planetSprite.beginFill(planetTypeData.color);
        const size = Math.max(2, Math.log(planet.mass + 1) * 3);
        planetSprite.drawCircle(0, 0, size);
        planetSprite.endFill();
        planetContainer.addChild(planetSprite);

        // Draw planet name
        const textStyle = new PIXI.TextStyle({
          fontSize: 12,
          fill: 0xcccccc,
          stroke: 0x000000,
          strokeThickness: 2,
        });
        const planetName = new PIXI.Text(planet.name, textStyle);
        planetName.x = size + 4;
        planetName.y = -size;
        planetName.anchor.set(0, 0.5);
        planetContainer.addChild(planetName);

        planetContainer.planet = planet;
        this.planetSprites.push(planetContainer);
        this.container.addChild(planetContainer);
      });

      this.createShip();
    }

    createShip() {
      this.shipSprite = new PIXI.Graphics();
      this.shipSprite.beginFill(0x00ff00);
      this.shipSprite.moveTo(0, -5);
      this.shipSprite.lineTo(-3, 5);
      this.shipSprite.lineTo(3, 5);
      this.shipSprite.closePath();
      this.shipSprite.endFill();
      this.container.addChild(this.shipSprite);
    }

    update(deltaTime) {
      this.time += deltaTime * 0.001;

      this.planetSprites.forEach((sprite) => {
        const planet = sprite.planet;
        const angle = planet.angle + (this.time / planet.period) * Math.PI * 2;
        sprite.x = Math.cos(angle) * planet.orbitRadius * this.scale;
        sprite.y = Math.sin(angle) * planet.orbitRadius * this.scale;
      });
    }

    moveShip(dx, dy) {
      if (this.shipSprite) {
        this.shipSprite.x += dx;
        this.shipSprite.y += dy;
        if (dx !== 0 || dy !== 0) {
          this.shipSprite.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        }
      }
    }

    getShipPosition() {
      return { x: this.shipSprite.x, y: this.shipSprite.y };
    }

    destroy() {
      this.graphics.destroy();
      this.planetSprites.forEach((sprite) => sprite.destroy());
      if (this.shipSprite) this.shipSprite.destroy();
    }
  }

  // ============================================================================
  // Orbital Animation System (Orrery)
  // ============================================================================

  class OrbitalRenderer {
    constructor(container, system, scale) {
      this.container = container;
      this.system = system;
      this.scale = scale;
      this.orbitContainers = [];
      this.time = 0;
      this.visible = false;
      
      this.createOrbits();
    }
    
    createOrbits() {
      if (!this.system.planets || this.system.planets.length === 0) return;
      
      this.system.planets.forEach((planet, index) => {
        const orbitContainer = new PIXI.Container();
        
        // Draw orbit path
        const orbitPath = new PIXI.Graphics();
        orbitPath.lineStyle(1, 0x444444, 0.4);
        orbitPath.drawCircle(0, 0, planet.orbitRadius * this.scale);
        orbitContainer.addChild(orbitPath);
        
        // Create planet sprite
        const planetSprite = new PIXI.Graphics();
        const planetColor = this.getPlanetColor(planet.type);
        planetSprite.beginFill(planetColor);
        
        // Size based on mass (Earth = 1.0 mass, size = 3 pixels)
        const planetSize = Math.max(1.5, Math.min(8, Math.log(planet.mass + 0.5) * 2.5));
        planetSprite.drawCircle(0, 0, planetSize);
        planetSprite.endFill();
        
        // Add atmosphere glow for gas giants and planets with atmosphere
        if (planet.atmosphere || planet.type === "gas_giant" || planet.type === "ice_giant") {
          const glow = new PIXI.Graphics();
          glow.beginFill(planetColor, 0.2);
          glow.drawCircle(0, 0, planetSize * 1.5);
          glow.endFill();
          const glowFilter = new PIXI.filters.BlurFilter();
          glowFilter.blur = 2;
          glow.filters = [glowFilter];
          orbitContainer.addChild(glow);
        }
        
        orbitContainer.addChild(planetSprite);
        
        // Create planet name text
        const textStyle = new PIXI.TextStyle({
          fontSize: 10,
          fill: 0xcccccc,
          stroke: 0x000000,
          strokeThickness: 2,
        });
        
        const planetNameText = new PIXI.Text(planet.name, textStyle);
        planetNameText.anchor.set(0.5, 0.5);
        planetNameText.x = 0;
        planetNameText.y = -planetSize - 12;
        orbitContainer.addChild(planetNameText);
        
        // Store references
        orbitContainer.planet = planet;
        orbitContainer.planetSprite = planetSprite;
        orbitContainer.nameText = planetNameText;
        orbitContainer.initialAngle = (index / this.system.planets.length) * Math.PI * 2;
        
        this.orbitContainers.push(orbitContainer);
        this.container.addChild(orbitContainer);
      });
    }
    
    getPlanetColor(type) {
      const colors = {
        rocky: 0x8B4513,
        ocean: 0x0066CC,
        desert: 0xD2691E,
        ice: 0xB0E0E6,
        lava: 0xFF4500,
        gas_giant: 0xFFA500,
        ice_giant: 0x4169E1,
        mini_neptune: 0x6495ED
      };
      return colors[type] || 0x888888;
    }
    
    update(deltaTime) {
      if (!this.visible) return;
      
      this.time += deltaTime * 0.0005;
      
      this.orbitContainers.forEach((orbitContainer, index) => {
        const planet = orbitContainer.planet;
        
        const period = Math.sqrt(Math.pow(planet.orbitRadius, 3)) * 3.0; 
        const angle = orbitContainer.initialAngle + (this.time / period);
        
        // Position planet in orbit
        const planetX = Math.cos(angle) * planet.orbitRadius * this.scale;
        const planetY = Math.sin(angle) * planet.orbitRadius * this.scale;
        
        orbitContainer.planetSprite.x = planetX;
        orbitContainer.planetSprite.y = planetY;
        orbitContainer.nameText.x = planetX;
        orbitContainer.nameText.y = planetY - 15;
      });
    }
    
    show() {
      this.visible = true;
      this.orbitContainers.forEach(container => {
        container.visible = true;
      });
    }
    
    hide() {
      this.visible = false;
      this.orbitContainers.forEach(container => {
        container.visible = false;
      });
    }
    
    destroy() {
      this.orbitContainers.forEach(container => {
        container.destroy();
      });
      this.orbitContainers = [];
    }
    
    updateScale(newScale) {
      this.scale = newScale;
      
      // Update existing orbit containers instead of recreating everything
      this.orbitContainers.forEach((orbitContainer) => {
        const planet = orbitContainer.planet;
        
        // Update orbit path
        const orbitPath = orbitContainer.children.find(child => child instanceof PIXI.Graphics && child !== orbitContainer.planetSprite);
        if (orbitPath) {
          orbitPath.clear();
          orbitPath.lineStyle(1, 0x444444, 0.4);
          orbitPath.drawCircle(0, 0, planet.orbitRadius * this.scale);
        }
      });
    }
  }

  // ============================================================================
  // Galaxy Map Scene with Current System Orrery
  // ============================================================================

  class Scene_GalaxyMap extends Scene_MenuBase {
    constructor() {
      super();
      this.galaxyData = null;
      this.selectedSystem = null;
      this.searchText = "";
      this.maxZoomOutScale = 0.1;
      this.lastUpdateScale = 1.0;
      this.scaleFactor = 60;
      this.currentSystemOrrery = null; // Only one orrery for current system
      this.animationTime = 0;
      this.isTransitioning = false;
      this.transitionTarget = null;
    }

    create() {
      super.create();
      this.createBackground();
      this.createGalaxyDisplay();
      this.createUI();
      this.galaxyData = $gameSystem.galaxyDataManager;
      this.setupZoomControls();
      this.calculateMaxZoomOut();
    }

    terminate() {
      super.terminate();
      if (this._wheelListener) {
        document.removeEventListener("wheel", this._wheelListener);
      }
      if (this.currentSystemOrrery) {
        this.currentSystemOrrery.destroy();
        this.currentSystemOrrery = null;
      }
    }

    calculateMaxZoomOut() {
      const mapPixelDiameter = localBubbleRadius * 2 * this.scaleFactor;
      const screenMinDim = Math.min(Graphics.width, Graphics.height);
      this.maxZoomOutScale = (screenMinDim / mapPixelDiameter) * 0.95;
    }

    // Smooth transition to a system
    transitionToSystem(system) {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      this.transitionTarget = system;
      
      // Set as current system
      this.galaxyData.setCurrentSystem(system.name);
      
      // Calculate target position to center the system on screen
      // We need to account for the system's position in world coordinates
      const systemWorldX = system.position.x * this.scaleFactor;
      const systemWorldY = system.position.y * this.scaleFactor;
      
      // Target container position to center the system
      const targetX = Graphics.width / 2 - systemWorldX;
      const targetY = Graphics.height / 2 - systemWorldY;
      const targetScale = 4.0; // Good zoom level to see the orrery
      
      // Animate to target
      this.animateToTarget(targetX, targetY, targetScale, () => {
        this.isTransitioning = false;
        this.createCurrentSystemOrrery();
      });
    }
    

    animateToTarget(targetX, targetY, targetScale, onComplete) {
      const startX = this.galaxyContainer.x;
      const startY = this.galaxyContainer.y;
      const startScale = this.galaxyContainer.scale.x;
      
      const duration = 1000; // 1 second transition
      let elapsed = 0;
      
      const animate = () => {
        elapsed += 16; // Assume 60fps
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-in-out interpolation
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        // Interpolate position and scale
        this.galaxyContainer.x = startX + (targetX - startX) * eased;
        this.galaxyContainer.y = startY + (targetY - startY) * eased;
        
        const newScale = startScale + (targetScale - startScale) * eased;
        this.galaxyContainer.scale.set(newScale);
        
        this.updateLOD();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      };
      
      animate();
    }

    createCurrentSystemOrrery() {
      // Remove existing orrery
      if (this.currentSystemOrrery) {
        this.currentSystemOrrery.destroy();
        this.currentSystemOrrery = null;
      }
      
      const currentSystemName = this.galaxyData.getCurrentSystem();
      const systemContainer = this.findSystemContainer(currentSystemName);
      
      if (systemContainer && systemContainer.systemData) {
        const system = systemContainer.systemData;
        
        // Calculate appropriate scale based on current zoom level
        // The orrery should be clearly visible but not overwhelming
        const currentScale = this.galaxyContainer.scale.x;
        const baseOrbitScale = 30; // Base scale for planet orbits
        const orbitScale = Math.max(15, Math.min(baseOrbitScale, baseOrbitScale / Math.sqrt(currentScale)));
        
        this.currentSystemOrrery = new OrbitalRenderer(
          systemContainer,
          system,
          orbitScale
        );
        this.currentSystemOrrery.show();
      }
    }

    updateCurrentSystemOrrery() {
      if (this.currentSystemOrrery) {
        const currentScale = this.galaxyContainer.scale.x;
        const showOrrery = currentScale >= 1.5; // Show orrery when zoomed in enough
        
        if (showOrrery) {
          // Dynamically adjust orbit scale based on zoom level
          const baseOrbitScale = 30;
          const orbitScale = Math.max(15, Math.min(baseOrbitScale, baseOrbitScale / Math.sqrt(currentScale)));
          this.currentSystemOrrery.updateScale(orbitScale);
          this.currentSystemOrrery.show();
        } else {
          this.currentSystemOrrery.hide();
        }
      }
    }
    createBackground() {
      this._backgroundSprite = new PIXI.Graphics();
      this._backgroundSprite.beginFill(0x000011);
      this._backgroundSprite.drawRect(0, 0, Graphics.width, Graphics.height);
      this._backgroundSprite.endFill();

      for (let i = 0; i < 200; i++) {
        const star = new PIXI.Graphics();
        star.beginFill(0xffffff, Math.random() * 0.8 + 0.2);
        star.drawCircle(
          Math.random() * Graphics.width,
          Math.random() * Graphics.height,
          Math.random() * 2
        );
        star.endFill();
        this._backgroundSprite.addChild(star);
      }
      this.addChild(this._backgroundSprite);
    }

    createGalaxyDisplay() {
      this.galaxyContainer = new PIXI.Container();
      this.galaxyContainer.x = Graphics.width / 2;
      this.galaxyContainer.y = Graphics.height / 2;

      this.systemPoints = new PIXI.Container();
      this.galaxyContainer.addChild(this.systemPoints);

      this.addChild(this.galaxyContainer);

      this.galaxyContainer.interactive = true;
      this.setupGalaxyControls();
    }
    setupGalaxyControls() {
      // Remove the direct PIXI event handling - we'll use RPG Maker's TouchInput instead
      this._backgroundSprite.interactive = true;
      
      // Initialize drag state variables
      this._isDragging = false;
      this._lastX = 0;
      this._lastY = 0;
      this._dragStartX = 0;
      this._dragStartY = 0;
    }
    
// ============================================================================
// Fixed Galaxy Map Scene - Replace existing methods in GalaxySim.js
// ============================================================================

// Replace the existing setupGalaxyControls method
setupGalaxyControls() {
  // Remove the direct PIXI event handling - we'll use RPG Maker's TouchInput instead
  this._backgroundSprite.interactive = true;
  
  // Initialize drag state variables
  this._isDragging = false;
  this._lastX = 0;
  this._lastY = 0;
  this._dragStartX = 0;
  this._dragStartY = 0;
}

// Add these new methods to Scene_GalaxyMap class
updateInput() {
  // Handle zoom with mouse wheel (similar to WorldMapVisualizer)
  const currentWheelY = TouchInput.wheelY;
  if (currentWheelY !== 0) {
    const zoomFactor = 1.15;
    let newScale;
    
    if (currentWheelY < 0) {
      newScale = this.galaxyContainer.scale.x * zoomFactor;
    } else {
      newScale = this.galaxyContainer.scale.x / zoomFactor;
    }
    
    if (newScale > 0.01) {
      // Calculate zoom point for smooth zooming
      const mouseX = TouchInput.x;
      const mouseY = TouchInput.y;
      
      // Convert screen coordinates to container local coordinates
      const localPoint = {
        x: (mouseX - this.galaxyContainer.x) / this.galaxyContainer.scale.x,
        y: (mouseY - this.galaxyContainer.y) / this.galaxyContainer.scale.y
      };
      
      // Apply new scale
      this.galaxyContainer.scale.set(newScale);
      
      // Adjust position to keep zoom point stable
      this.galaxyContainer.x = mouseX - localPoint.x * newScale;
      this.galaxyContainer.y = mouseY - localPoint.y * newScale;
      
      this.updateLOD();
      this.updateCurrentSystemOrrery();
    }
  }
  
  // Handle dragging with TouchInput (RPG Maker's input system)
  if (TouchInput.isPressed()) {
    if (!this._isDragging) {
      this._isDragging = true;
      this._lastX = TouchInput.x;
      this._lastY = TouchInput.y;
      this._dragStartX = TouchInput.x;
      this._dragStartY = TouchInput.y;
    } else {
      // Calculate drag delta
      const deltaX = TouchInput.x - this._lastX;
      const deltaY = TouchInput.y - this._lastY;
      
      // Apply drag movement
      this.galaxyContainer.x += deltaX;
      this.galaxyContainer.y += deltaY;
      
      // Update last position
      this._lastX = TouchInput.x;
      this._lastY = TouchInput.y;
    }
  } else {
    if (this._isDragging) {
      this._isDragging = false;
      
      // Check if this was a click (minimal drag distance)
      const totalDragDistance = Math.sqrt(
        Math.pow(TouchInput.x - this._dragStartX, 2) + 
        Math.pow(TouchInput.y - this._dragStartY, 2)
      );
      
      // If drag distance is small, treat as click
      if (totalDragDistance < 10) {
        this.checkSystemClick(TouchInput.x, TouchInput.y);
      }
    } else if (TouchInput.isTriggered()) {
      // Handle direct clicks
      this.checkSystemClick(TouchInput.x, TouchInput.y);
    }
  }
}

// Add new method for handling system clicks
checkSystemClick(screenX, screenY) {
  if (!this.systemPoints || !this.systemPoints.children) return;
  
  // Convert screen coordinates to world coordinates
  const worldX = (screenX - this.galaxyContainer.x) / this.galaxyContainer.scale.x;
  const worldY = (screenY - this.galaxyContainer.y) / this.galaxyContainer.scale.y;
  
  // Check each system for clicks (iterate in reverse for top-most first)
  const systems = this.systemPoints.children.slice().reverse();
  
  for (const systemContainer of systems) {
    if (!systemContainer.visible || !systemContainer.systemData) continue;
    
    // Calculate system bounds - make click area slightly larger for easier clicking
    const systemSize = 15; // Larger click area
    const bounds = {
      left: systemContainer.x - systemSize,
      right: systemContainer.x + systemSize,
      top: systemContainer.y - systemSize,
      bottom: systemContainer.y + systemSize
    };
    
    // Check if click is within system bounds
    if (worldX >= bounds.left && worldX <= bounds.right && 
        worldY >= bounds.top && worldY <= bounds.bottom) {
      
      // Handle system selection
      this.selectedSystem = systemContainer.systemData;
      this.infoWindow.setSystem(systemContainer.systemData);
      
      // Transition to clicked system with proper centering
      this.transitionToSystem(systemContainer.systemData);
      this.commandWindow.activate();
      
      return; // Exit after first hit
    }
  }
}

    setupZoomControls() {
      this._wheelListener = this.onWheel.bind(this);
      document.addEventListener("wheel", this._wheelListener);
    }

    onWheel(event) {
      const zoomFactor = 1.15;
      let newScale;

      if (event.deltaY < 0) {
        newScale = this.galaxyContainer.scale.x * zoomFactor;
      } else {
        newScale = this.galaxyContainer.scale.x / zoomFactor;
      }

      if (newScale > 0.01) {
        this.galaxyContainer.scale.set(newScale);
        this.updateLOD();
        this.updateCurrentSystemOrrery();
      }
    }

    // Determine LOD level based on current zoom scale
    getCurrentLOD() {
      const scale = this.galaxyContainer.scale.x;
      
      if (scale >= LOD_LEVELS.CLOSE.minScale) return LOD_LEVELS.CLOSE;
      if (scale >= LOD_LEVELS.MEDIUM.minScale) return LOD_LEVELS.MEDIUM;
      if (scale >= LOD_LEVELS.FAR.minScale) return LOD_LEVELS.FAR;
      return LOD_LEVELS.VERY_FAR;
    }

    // Calculate distance from center of view to a system
    getDistanceFromCenter(systemContainer) {
      const bounds = this.galaxyContainer.getBounds();
      const centerX = -this.galaxyContainer.x + Graphics.width / 2;
      const centerY = -this.galaxyContainer.y + Graphics.height / 2;
      
      const dx = (systemContainer.x - centerX) / this.galaxyContainer.scale.x;
      const dy = (systemContainer.y - centerY) / this.galaxyContainer.scale.y;
      
      return Math.sqrt(dx * dx + dy * dy) / this.scaleFactor;
    }

    // Update visibility and detail level based on current zoom and distance
    updateLOD() {
      if (!this.systemPoints) return;
      
      const currentLOD = this.getCurrentLOD();
      const currentScale = this.galaxyContainer.scale.x;
      
      this.systemPoints.children.forEach((systemContainer) => {
        const distance = this.getDistanceFromCenter(systemContainer);
        const isVisible = distance <= currentLOD.maxDistance;
        
        systemContainer.visible = isVisible;
        
        if (isVisible && systemContainer.nameText) {
          // Show/hide text based on LOD level
          systemContainer.nameText.visible = currentLOD.showText;
          
          // Update text scaling for crisp rendering
          if (currentLOD.showText) {
            this.updateTextForSystem(systemContainer, currentLOD);
          }
        }
      });
    }
    
    // Helper method to find system container by name
    findSystemContainer(systemName) {
      return this.systemPoints.children.find(container => 
        container.systemData && container.systemData.name === systemName
      );
    }

    // Update text rendering to stay crisp at all zoom levels
    updateTextForSystem(systemContainer, lodLevel) {
      if (!systemContainer.nameText) return;
      
      const currentScale = this.galaxyContainer.scale.x;
      
      // Calculate ideal font size to maintain readability
      const baseFontSize = 14;
      const minFontSize = 8;
      const maxFontSize = 24;
      
      // Inverse scale to maintain apparent size
      let targetFontSize = baseFontSize / currentScale;
      targetFontSize = Math.max(minFontSize / currentScale, 
                               Math.min(maxFontSize / currentScale, targetFontSize));
      
      // Update font size and stroke
      systemContainer.nameText.style.fontSize = targetFontSize;
      systemContainer.nameText.style.strokeThickness = Math.max(1, 3 / currentScale);
      
      // Recreate the text if the scale change is significant
      if (Math.abs(currentScale - this.lastUpdateScale) > 0.3) {
        const system = systemContainer.systemData;
        if (system) {
          // Remove old text
          systemContainer.removeChild(systemContainer.nameText);
          
          // Create new text with proper scaling
          const textStyle = new PIXI.TextStyle({
            fontSize: targetFontSize,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: Math.max(1, 3 / currentScale),
          });
          
          const newText = new PIXI.Text(system.name, textStyle);
          newText.x = 8;
          newText.y = -8;
          newText.anchor.set(0, 0.5);
          systemContainer.addChild(newText);
          systemContainer.nameText = newText;
        }
      }
    }

    createUI() {
      this.infoWindow = new Window_GalaxyInfo(new Rectangle(0, 0, 400, 200));
      this.addWindow(this.infoWindow);

      this.commandWindow = new Window_GalaxyCommand(
        new Rectangle(0, Graphics.height - 100, 240, 100)
      );
      this.commandWindow.setHandler("enter", this.onEnterSystem.bind(this));
      this.commandWindow.setHandler("search", this.onSearch.bind(this));
      this.commandWindow.setHandler("exit", this.popScene.bind(this));
      this.addWindow(this.commandWindow);

      this.searchWindow = new Window_SystemSearch(
        new Rectangle(200, 100, 400, 300)
      );
      this.searchWindow.setHandler("ok", this.onSystemSelect.bind(this));
      this.searchWindow.setHandler("cancel", this.onSearchCancel.bind(this));
      this.searchWindow.hide();
      this.addWindow(this.searchWindow);
    }

    displayKnownSystems() {
      this.systemPoints.removeChildren();
      const currentSystemName = this.galaxyData.getCurrentSystem();

      Object.values(this.galaxyData.knownSystems).forEach((system) => {
        const systemContainer = new PIXI.Container();

        const point = new PIXI.Graphics();
        
        // Highlight current system differently
        let color;
        if (system.name === currentSystemName) {
          color = 0xffff00; // Yellow for current system
        } else if (this.galaxyData.isSystemVisited(system.name)) {
          color = 0x00ff00; // Green for visited
        } else {
          color = 0xffffff; // White for unvisited
        }
        
        point.beginFill(color);
        const size = system.name === currentSystemName ? 5 : 3; // Larger for current system
        point.drawCircle(0, 0, size);
        point.endFill();
        systemContainer.addChild(point);

        // Create initial text
        const textStyle = new PIXI.TextStyle({
          fontSize: 14,
          fill: system.name === currentSystemName ? 0xffff00 : 0xffffff,
          stroke: 0x000000,
          strokeThickness: 3,
        });

        const starName = new PIXI.Text(system.name, textStyle);
        starName.x = 8;
        starName.y = -8;
        starName.anchor.set(0, 0.5);
        systemContainer.addChild(starName);

        systemContainer.x = system.position.x * this.scaleFactor;
        systemContainer.y = system.position.y * this.scaleFactor;

        systemContainer.interactive = true;
        systemContainer.buttonMode = true;

        systemContainer.on("pointerover", () => {
          this.selectedSystem = system;
          this.infoWindow.setSystem(system);
        });
        
        systemContainer.on("pointerdown", () => {
          this.selectedSystem = system;
          // Transition to clicked system and make it current
          this.transitionToSystem(system);
          this.commandWindow.activate();
        });

        // Store references for LOD system
        systemContainer.nameText = starName;
        systemContainer.systemData = system;

        this.systemPoints.addChild(systemContainer);
      });

      // Initial LOD update
      this.updateLOD();
      
      // Create orrery for current system if we're zoomed in enough
      setTimeout(() => {
        this.createCurrentSystemOrrery();
      }, 100);
    }

    onEnterSystem() {
      if (this.selectedSystem) {
        this.galaxyData.currentLocation = this.selectedSystem.name;
        this.galaxyData.addVisitedSystem(this.selectedSystem.name);
        SceneManager.push(Scene_StarSystem);
      }
      this.commandWindow.activate();
    }

    onSearch() {
      this.searchWindow.show();
      this.searchWindow.activate();
      this.commandWindow.deactivate();
    }

    onSystemSelect() {
      const systemName = this.searchWindow.currentItem();
      if (systemName) {
        const system = Object.values(this.galaxyData.knownSystems).find(
          s => s.name === systemName
        );
        if (system) {
          this.selectedSystem = system;
          this.infoWindow.setSystem(system);
          // Transition to selected system
          this.transitionToSystem(system);
        }
      }
      this.searchWindow.hide();
      this.commandWindow.activate();
    }

    onSearchCancel() {
      this.searchWindow.hide();
      this.commandWindow.activate();
    }

    update() {
      super.update();
      this.updateInput();
      const zoomFactor = 1.02;
      const panSpeed = 8;
      let newScale;
      let scaleChanged = false;

      // Update animation time for orbital renderer
      this.animationTime += 16; // Assuming ~60fps, 16ms per frame
      
      // Update current system orrery
      if (this.currentSystemOrrery) {
        this.currentSystemOrrery.update(16);
      }

      // Keyboard Zoom Controls
      if (Input.isPressed("q")) {
        newScale = this.galaxyContainer.scale.x / zoomFactor;
        if (newScale > 0.01) {
          this.galaxyContainer.scale.set(newScale);
          scaleChanged = true;
        }
      }
      if (Input.isPressed("e")) {
        newScale = this.galaxyContainer.scale.x * zoomFactor;
        this.galaxyContainer.scale.set(newScale);
        scaleChanged = true;
      }

      // Update LOD and orrery when zoom changes
      if (scaleChanged) {
        this.updateLOD();
        this.updateCurrentSystemOrrery();
        this.lastUpdateScale = this.galaxyContainer.scale.x;
      }

      // Keyboard Panning Controls
      if (Input.isPressed("up") || Input.isPressed("w")) {
        this.galaxyContainer.y += panSpeed;
      }
      if (Input.isPressed("down") || Input.isPressed("s")) {
        this.galaxyContainer.y -= panSpeed;
      }
      if (Input.isPressed("left") || Input.isPressed("a")) {
        this.galaxyContainer.x += panSpeed;
      }
      if (Input.isPressed("right") || Input.isPressed("d")) {
        this.galaxyContainer.x -= panSpeed;
      }

      // Update LOD periodically when panning
      if (Input.isPressed("up") || Input.isPressed("down") || 
          Input.isPressed("left") || Input.isPressed("right") ||
          Input.isPressed("w") || Input.isPressed("s") || 
          Input.isPressed("a") || Input.isPressed("d")) {
        this.updateLOD();
      }
      
    }

    start() {
      super.start();
      this.displayKnownSystems();
    }
  }

  // ============================================================================
  // Star System Scene
  // ============================================================================

  class Scene_StarSystem extends Scene_Base {
    constructor() {
      super();
      this.systemRenderer = null;
      this.shipSpeed = 5;
    }

    create() {
      super.create();
      this.createBackground();
      this.createSystemDisplay();
      this.createUI();
    }

    createBackground() {
      const bg = new PIXI.Graphics();
      bg.beginFill(0x000000);
      bg.drawRect(0, 0, Graphics.width, Graphics.height);
      bg.endFill();

      for (let i = 0; i < 300; i++) {
        const star = new PIXI.Graphics();
        star.beginFill(0xffffff, Math.random() * 0.5 + 0.1);
        star.drawCircle(
          Math.random() * Graphics.width,
          Math.random() * Graphics.height,
          Math.random() * 1.5
        );
        star.endFill();
        bg.addChild(star);
      }
      this.addChild(bg);
    }

    createSystemDisplay() {
      const galaxyData = $gameSystem.galaxyDataManager;
      const system = galaxyData.generateStarSystem(
        galaxyData.currentLocation || "Sol"
      );

      this.systemContainer = new PIXI.Container();
      this.systemContainer.x = Graphics.width / 2;
      this.systemContainer.y = Graphics.height / 2;

      this.systemRenderer = new StarSystemRenderer(
        this.systemContainer,
        system
      );

      this.addChild(this.systemContainer);
    }

    createUI() {
      this.systemInfoWindow = new Window_SystemInfo(
        new Rectangle(0, 0, 400, 250)
      );
      this.systemInfoWindow.setSystem(
        $gameSystem.galaxyDataManager.generateStarSystem(
          $gameSystem.galaxyDataManager.currentLocation || "Sol"
        )
      );
      this.addWindow(this.systemInfoWindow);

      this.commandWindow = new Window_SystemCommand(
        new Rectangle(0, Graphics.height - 100, 240, 144)
      );
      this.commandWindow.setHandler("map", this.onReturnToMap.bind(this));
      this.commandWindow.setHandler("scan", this.onScan.bind(this));
      this.commandWindow.setHandler("ftl", this.onFTLSettings.bind(this));
      this.commandWindow.setHandler("cancel", this.onReturnToMap.bind(this));
      this.addWindow(this.commandWindow);
    }

    onReturnToMap() {
      this.popScene();
    }

    onScan() {
      SoundManager.playOk();
      $gameMessage.add("Scanning system...");
      $gameMessage.add(
        "Planets detected: " + this.systemRenderer.system.planets.length
      );
      this.commandWindow.activate();
    }

    onFTLSettings() {
      SceneManager.push(Scene_FTLSettings);
    }

    update() {
      super.update();

      if (this.systemRenderer) {
        this.systemRenderer.update(16);

        let dx = 0,
          dy = 0;
        if (Input.isPressed("left")) dx = -this.shipSpeed;
        if (Input.isPressed("right")) dx = this.shipSpeed;
        if (Input.isPressed("up")) dy = -this.shipSpeed;
        if (Input.isPressed("down")) dy = this.shipSpeed;

        if (dx !== 0 || dy !== 0) {
          this.systemRenderer.moveShip(dx, dy);
          $gameSystem.galaxyDataManager.shipState.systemPosition =
            this.systemRenderer.getShipPosition();
        }
      }
    }

    terminate() {
      super.terminate();
      if (this.systemRenderer) {
        this.systemRenderer.destroy();
      }
    }
  }

  // ============================================================================
  // Windows
  // ============================================================================

  class Window_GalaxyInfo extends Window_Base {
    constructor(rect) {
      super(rect);
      this.system = null;
    }

    setSystem(system) {
      this.system = system;
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      if (!this.system) return;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText("System Information", 0, 0, this.innerWidth, "center");

      this.changeTextColor(ColorManager.normalColor());
      this.drawText("Name: " + this.system.name, 0, this.lineHeight());
      this.drawText(
        "Type: " + this.system.type + " Class",
        0,
        this.lineHeight() * 2
      );
      this.drawText(
        "Planets: " + (this.system.planets ? this.system.planets.length : 0),
        0,
        this.lineHeight() * 3
      );

      const distance = Math.sqrt(
        Math.pow(this.system.position.x, 2) +
          Math.pow(this.system.position.y, 2) +
          Math.pow(this.system.position.z, 2)
      );
      this.drawText(
        "Distance: " + distance.toFixed(2) + " ly",
        0,
        this.lineHeight() * 4
      );
    }
  }

  class Window_GalaxyCommand extends Window_Command {
    constructor(rect) {
      super(rect);
    }
    makeCommandList() {
      this.addCommand("Enter System", "enter");
      this.addCommand("Search", "search");
      this.addCommand("Exit", "exit");
    }
  }

  class Window_SystemSearch extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this.searchResults = [];
      this.refresh();
    }
    maxItems() {
      return this.searchResults.length;
    }
    itemHeight() {
      return this.lineHeight();
    }

    drawItem(index) {
      const item = this.searchResults[index];
      if (item) {
        const rect = this.itemLineRect(index);
        this.drawText(item, rect.x, rect.y, rect.width);
      }
    }

    currentItem() {
      return this.searchResults[this.index()];
    }

    refresh() {
      this.searchResults = Object.keys(
        $gameSystem.galaxyDataManager.knownSystems
      ).map((key) => $gameSystem.galaxyDataManager.knownSystems[key].name);
      this.contents.clear();
      this.drawAllItems();
    }
  }

  class Window_SystemInfo extends Window_Base {
    constructor(rect) {
      super(rect);
      this.system = null;
    }

    setSystem(system) {
      this.system = system;
      this.refresh();
    }

    refresh() {
      this.contents.clear();
      if (!this.system) return;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(
        this.system.name + " System",
        0,
        0,
        this.innerWidth,
        "center"
      );

      this.changeTextColor(ColorManager.normalColor());
      this.drawText("Star Type: " + this.system.type, 0, this.lineHeight());
      this.drawText(
        "Mass: " + this.system.mass.toFixed(2) + " M☉",
        0,
        this.lineHeight() * 2
      );
      this.drawText(
        "Temperature: " + Math.floor(this.system.temperature) + " K",
        0,
        this.lineHeight() * 3
      );
      this.drawText(
        "Luminosity: " + this.system.luminosity.toFixed(2) + " L☉",
        0,
        this.lineHeight() * 4
      );

      this.changeTextColor(ColorManager.systemColor());
      this.drawText("Navigation", 0, this.lineHeight() * 5);
      this.changeTextColor(ColorManager.normalColor());
      this.drawText("Use Arrow Keys to move ship", 0, this.lineHeight() * 6);
    }
  }

  class Window_SystemCommand extends Window_Command {
    constructor(rect) {
      super(rect);
    }
    makeCommandList() {
      this.addCommand("Galaxy Map", "map");
      this.addCommand("Scan System", "scan");
      this.addCommand("FTL Settings", "ftl");
      this.addCommand("Cancel", "cancel");
    }
  }

  class Scene_FTLSettings extends Scene_MenuBase {
    create() {
      super.create();
      this.createSpeedWindow();
    }

    createSpeedWindow() {
      const rect = new Rectangle(
        Graphics.boxWidth / 2 - 200,
        Graphics.boxHeight / 2 - 100,
        400,
        200
      );
      this.speedWindow = new Window_FTLSpeed(rect);
      this.speedWindow.setHandler("ok", this.onSpeedOk.bind(this));
      this.speedWindow.setHandler("cancel", this.popScene.bind(this));
      this.addWindow(this.speedWindow);
    }

    onSpeedOk() {
      const speed = this.speedWindow.currentSpeed();
      $gameSystem.galaxyDataManager.shipState.ftlSpeed = speed;
      this.popScene();
    }
  }

  class Window_FTLSpeed extends Window_Selectable {
    constructor(rect) {
      super(rect);
      this.speeds = [1, 5, 10, 50, 100, 1000];
      this.refresh();
      this.select(
        this.speeds.indexOf($gameSystem.galaxyDataManager.shipState.ftlSpeed)
      );
      this.activate();
    }

    maxItems() {
      return this.speeds.length;
    }
    currentSpeed() {
      return this.speeds[this.index()];
    }

    drawItem(index) {
      const speed = this.speeds[index];
      const rect = this.itemLineRect(index);
      this.drawText(speed + "c", rect.x, rect.y, rect.width, "center");
    }

    refresh() {
      this.contents.clear();
      this.drawText("FTL Speed Settings", 0, 0, this.innerWidth, "center");
      this.drawAllItems();
    }
  }

  // ============================================================================
  // Plugin Command Registration
  // ============================================================================

  PluginManager.registerCommand(pluginName, "SetFTLSpeed", (args) => {
    const speed = parseFloat(args.speed) || 10;
    $gameSystem.galaxyDataManager.shipState.ftlSpeed = speed;
  });

  PluginManager.registerCommand(pluginName, "EnterSystem", (args) => {
    const systemName = args.systemName;
    if (systemName) {
      $gameSystem.galaxyDataManager.currentLocation = systemName;
      SceneManager.push(Scene_StarSystem);
    }
  });

  PluginManager.registerCommand(pluginName, "OpenGalaxyMap", (args) => {
    SceneManager.push(Scene_GalaxyMap);
  });

  PluginManager.registerCommand(pluginName, "ExitToGalaxy", (args) => {
    if (SceneManager._scene instanceof Scene_StarSystem) {
      SceneManager.pop();
    }
  });

  // ============================================================================
  // Game System Extensions
  // ============================================================================

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.galaxyDataManager = new GalaxyDataManager();
    this.galaxyDataManager.loadKnownSystems();
  };

  const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function () {
    _Game_System_onBeforeSave.call(this);
    if (this.galaxyDataManager) {
      this.galaxyDataManager.saveData();
    }
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function () {
    _Game_System_onAfterLoad.call(this);
    if (!this.galaxyDataManager) {
      this.galaxyDataManager = new GalaxyDataManager();
    }
    this.galaxyDataManager.loadData();
    this.galaxyDataManager.loadKnownSystems();
  };
})();