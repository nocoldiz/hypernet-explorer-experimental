/*:
 * @plugindesc Dwarf Fortress-inspired limb and organ damage system for Actor1
 * @author Claude
 * @help
 * This plugin implements a detailed limb and organ damage system
 * inspired by Dwarf Fortress. Features include:
 * - Individual health for limbs and organs
 * - Damage distribution to body parts
 * - Special effects for damaged body parts
 * - Health menu integration for body part status
 * - Recovery functionality
 * - Stat penalties for fully damaged body parts
 *
 * Plugin Commands:
 *   HealBodyParts [amount] - Heals all body parts by specified amount
 *
 * Note: This plugin only works for Actor1
 *
 * @param Menu Command Name
 * @desc The name of the command in the menu
 * @default Health Status
 *
 * @command HealBodyParts
 * @desc Heals all body parts by specified amount
 * @arg amount
 * @type number
 * @default 100
 * @desc Amount of HP to heal body parts
 *
 * @command OpenProstheticShop
 * @desc Open prostetic shop
 *
 * @command OpenBiologicSimulation
 * @desc Opens the biologic simulation window
 */

(function () {
  // Check if we're in MZ and load required window classes
  if (Utils.RPGMAKER_NAME === "MZ") {
    // In MZ, Window_StatusBase is required for actor-related drawing methods
    // Make sure it's loaded before creating our custom window
    if (!window.Window_StatusBase) {
      throw new Error(
        "Window_StatusBase is required for this plugin to work in RPG Maker MZ"
      );
    }
  }

  // Plugin parameters - Handle both MV and MZ
  var pluginName = "DF_LimbDamageSystem";
  var parameters = {};

  // Get parameters based on RPG Maker version
  if (Utils.RPGMAKER_NAME === "MZ") {
    parameters = PluginManager.parameters(pluginName);
  } else {
    // MV style
    var params = PluginManager.parameters(pluginName);
    parameters = params;
  }

  var menuCommandName = "Health Status";

  // Helper function to get current body parts based on language

  // Helper function to get translated text
  function getTranslatedText(englishText, italianText) {
    return ConfigManager.language === "it" ? italianText : englishText;
  }

  // Define body parts structure
  const { BodyParts, ProstheticTypes, ProstheticCompatibility } =
    window.ProstheticsData;
  // Centralized UI Translations
  const UI_TRANSLATIONS = {
    healthStatusMenu: { en: "Health Status", it: "Status Salute" },
    healthWindowHeaders: {
      head: { en: "Head", it: "Testa" },
      torso: { en: "Torso", it: "Corpo" },
      arms: { en: "Arms", it: "Braccia" },
      legs: { en: "Legs", it: "Gambe" },
    },
    paramNames: {
      en: ["Max HP", "Max MP", "ATK", "HIT", "INT", "DEF", "AGI", "LUK"],
      it: ["PV Max", "PM Max", "ATT", "PREC", "INT", "DIF", "AGI", "FOR"],
    },
    windowInstructions: {
      en: "↑↓: Navigate   ESC: Exit",
      it: "↑↓: Naviga   ESC: Esci",
    },
    damagedStatus: { en: "DAMAGED", it: "DANNEGGIATO" },
    battleLogFormat: {
      en: (name, msg, param, amount) =>
        `${name}'s ${msg}${param && amount ? `, ${param} ${amount}!` : "!"}`,
      it: (name, msg, param, amount) =>
        `${name} ${msg}${param && amount ? `, ${param} ${amount}!` : "!"}`,
    },
  };

  // Hit location groups for random targeting
  var HitLocations = {
    HEAD: {
      weight: 10,
      parts: [
        "HEAD",
        "BRAIN",
        "LEFT_EYE",
        "RIGHT_EYE",
        "NOSE",
        "LEFT_EAR",
        "RIGHT_EAR",
        "MOUTH",
        "TEETH",
      ],
    },
    TORSO: {
      weight: 40,
      parts: [
        "TORSO",
        "HEART",
        "LEFT_LUNG",
        "RIGHT_LUNG",
        "LIVER",
        "STOMACH",
        "SPLEEN",
        "INTESTINES",
      ],
    },
    LEFT_ARM: { weight: 15, parts: ["LEFT_ARM", "LEFT_HAND", "LEFT_FINGERS"] },
    RIGHT_ARM: {
      weight: 15,
      parts: ["RIGHT_ARM", "RIGHT_HAND", "RIGHT_FINGERS"],
    },
    LEFT_LEG: { weight: 10, parts: ["LEFT_LEG", "LEFT_FOOT", "LEFT_TOES"] },
    RIGHT_LEG: { weight: 10, parts: ["RIGHT_LEG", "RIGHT_FOOT", "RIGHT_TOES"] },
  };
  /**
   * Retrieves a translated property from a data object.
   */
  function getTranslated(dataObject, propertyName) {
    const lang = ConfigManager.language;
    const langKey = `${propertyName}_${lang}`;
    return lang !== "en" && dataObject[langKey]
      ? dataObject[langKey]
      : dataObject[propertyName];
  }

  /**
   * Retrieves a translated UI string from the UI_TRANSLATIONS object.
   */
  function getTranslatedUI(key) {
    const lang = ConfigManager.language || "en";
    const entry = UI_TRANSLATIONS[key];
    return entry ? entry[lang] || entry["en"] : "";
  }

  // Initialize actor body parts
  function initializeBodyParts(actor) {
    if (actor && !actor._bodyParts) {
      actor._bodyParts = {};
      actor._statModifiers = {};

      for (const partKey in BodyParts) {
        const basePart = BodyParts[partKey];
        const hpPercentage = basePart.hp / 100;

        actor._bodyParts[partKey] = {
          name: getTranslated(basePart, "name"), // Pre-translate name for efficiency
          maxHp: Math.round(actor.mhp * hpPercentage),
          currentHp: Math.round(actor.mhp * hpPercentage),
          vital: basePart.vital,
          damaged: false,
          equipSlot: basePart.equipSlot || null,
          childParts: basePart.childParts || [],
          multiple: basePart.multiple || false,
          appliedStatEffect: false,
        };
      }
    }
  }
  // Get a random hit location based on weights
  function getRandomHitLocation() {
    var totalWeight = 0;
    var locations = [];

    for (var loc in HitLocations) {
      totalWeight += HitLocations[loc].weight;
      locations.push({
        name: loc,
        weight: HitLocations[loc].weight,
        cumulative: totalWeight,
      });
    }

    var roll = Math.random() * totalWeight;

    for (var i = 0; i < locations.length; i++) {
      if (roll <= locations[i].cumulative) {
        return HitLocations[locations[i].name];
      }
    }

    return HitLocations.TORSO; // Default to torso if something goes wrong
  }

  // Select random body parts from a hit location
  function selectRandomBodyParts(hitLocation, count) {
    var parts = hitLocation.parts.slice();
    var selected = [];

    // Shuffle the parts array
    for (var i = parts.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = parts[i];
      parts[i] = parts[j];
      parts[j] = temp;
    }

    // Select the first 'count' parts or all if there are fewer
    for (var i = 0; i < Math.min(count, parts.length); i++) {
      selected.push(parts[i]);
    }

    return selected;
  }

  // Calculate damage to a body part
  function applyDamageToBodyPart(actor, partKey, damage) {
    var part = actor._bodyParts[partKey];

    if (!part || part.damaged) return 0;

    // Check if actor has more than 60% health, keep limbs at minimum 1hp if so
    var healthPercentage = actor.hp / actor.mhp;
    if (healthPercentage > 0.6) {
      var appliedDamage = Math.min(part.currentHp - 1, damage);
      if (appliedDamage <= 0) return 0;

      part.currentHp -= appliedDamage;
      return appliedDamage;
    } else {
      // Normal damage application if health is 60% or lower
      var appliedDamage = Math.min(part.currentHp, damage);
      part.currentHp -= appliedDamage;

      // Check if the part is now completely damaged
      if (part.currentHp <= 0) {
        part.damaged = true;
        handleDamagedBodyPart(actor, partKey);
      }

      return appliedDamage;
    }
  }

  // Apply stat effect for a fully damaged part
  function applyStatEffect(actor, partKey) {
    var part = actor._bodyParts[partKey];
    var basePart = BodyParts[partKey];

    if (part.appliedStatEffect || !basePart.statEffect) return;

    // Apply the stat effect
    var paramId = basePart.statEffect.param;
    var amount = basePart.statEffect.amount;

    // Track the stat modifier
    if (!actor._statModifiers[paramId]) {
      actor._statModifiers[paramId] = 0;
    }
    actor._statModifiers[paramId] += amount;

    // Mark as applied
    part.appliedStatEffect = true;

    // Refresh actor to apply stat changes
    actor.refresh();
  }

  // Get parameter name for display
  function getParamName(paramId) {
    var paramNames_en = [
      "Max HP",
      "Max MP",
      "STR",
      "Hit Rate",
      "INT",
      "COS",
      "DEX",
      "PSI",
    ];
    var paramNames_it = [
      "PV Max",
      "PM Max",
      "FOR",
      "Precisione",
      "INT",
      "COS",
      "DES",
      "PSI",
    ];
    var paramNames =
      ConfigManager.language === "it" ? paramNames_it : paramNames_en;
    return paramNames[paramId] || "Stat";
  }

  // Handle effects of a damaged body part
  function handleDamagedBodyPart(actor, partKey) {
    var part = actor._bodyParts[partKey];
    var basePart = BodyParts[partKey];

    // Apply stat effect if part has one and not already applied
    // But exclude any effects on max HP (param 0)
    if (
      !part.appliedStatEffect &&
      basePart.statEffect &&
      basePart.statEffect.param !== 0
    ) {
      applyStatEffect(actor, partKey);
    }

    // Unequip items if an equip slot is affected
    if (part.equipSlot) {
      unequipItemFromSlot(actor, part.equipSlot);
    }

    // Mark all child parts as damaged
    if (part.childParts && part.childParts.length > 0) {
      part.childParts.forEach(function (childKey) {
        if (actor._bodyParts[childKey] && !actor._bodyParts[childKey].damaged) {
          actor._bodyParts[childKey].currentHp = 0;
          actor._bodyParts[childKey].damaged = true;
          handleDamagedBodyPart(actor, childKey);
        }
      });
    }

    // Add to battlelog if in battle
    if ($gameParty.inBattle()) {
      $gameTemp.limbDamageLog = {
        name: actor.name(),
        partName: part.name,
        damageMsg: basePart.damageMsg || part.name + " gravemente danneggiato",
        paramName:
          basePart.statEffect && basePart.statEffect.param !== 0
            ? getParamName(basePart.statEffect.param)
            : null,
        amount:
          basePart.statEffect && basePart.statEffect.param !== 0
            ? basePart.statEffect.amount
            : null,
      };
    }
  }
  // Unequip an item from a slot
  function unequipItemFromSlot(actor, slotName) {
    if (slotName === "leftHand" || slotName === "rightHand") {
      var weapons = actor.weapons();
      if (weapons.length > 0) {
        // Just remove the first weapon for simplicity
        // In a full implementation, you would need to track which weapon is in which hand
        actor.changeEquip(0, null);
      }
    }
  }

  // Restore all body parts function - used for respawn
  function restoreAllBodyParts(actor) {
    if (!actor._bodyParts) return;

    // Reset all stat modifiers
    actor._statModifiers = {};

    for (var part in actor._bodyParts) {
      var bodyPart = actor._bodyParts[part];

      // Fully restore the part
      bodyPart.currentHp = bodyPart.maxHp;
      bodyPart.damaged = false;
      bodyPart.appliedStatEffect = false;
    }

    // Refresh actor to update stats
    actor.refresh();
  }

  // Apply damage to actor with limb damage system
  function applyLimbDamage(actor, damage) {
    if (!actor._bodyParts) initializeBodyParts(actor);

    // Get a random hit location
    var hitLocation = getRandomHitLocation();

    // Select 1-3 random body parts to damage
    var partsToHit = selectRandomBodyParts(
      hitLocation,
      Math.floor(Math.random() * 3) + 1
    );

    // Distribute damage among the selected parts
    var totalDamageApplied = 0;
    var damagePerPart = Math.floor(damage / partsToHit.length);

    partsToHit.forEach(function (partKey) {
      totalDamageApplied += applyDamageToBodyPart(
        actor,
        partKey,
        damagePerPart
      );
    });

    // Apply any remaining damage to the main part of the hit location
    var remainingDamage = damage - totalDamageApplied;
    if (remainingDamage > 0) {
      applyDamageToBodyPart(actor, hitLocation.parts[0], remainingDamage);
    }

    // We no longer show hit location in battlelog
  }

  // Heal body parts function - used by healing items/spells
  function healBodyParts(actor, amount) {
    if (!actor._bodyParts) return;

    // Reset stat modifiers for fully healed parts
    var needsRefresh = false;

    for (var part in actor._bodyParts) {
      var bodyPart = actor._bodyParts[part];
      var basePart = BodyParts[part];

      // If part is damaged and has a stat effect
      if (bodyPart.damaged && bodyPart.appliedStatEffect) {
        // Heal the part
        bodyPart.currentHp = Math.min(
          bodyPart.maxHp,
          bodyPart.currentHp + amount
        );

        // If substantially healed, remove the damage status and stat effect
        if (bodyPart.currentHp >= bodyPart.maxHp / 2) {
          bodyPart.damaged = false;
          bodyPart.appliedStatEffect = false;

          // Reset the stat modifier if it exists and it's not affecting max HP
          if (basePart.statEffect && basePart.statEffect.param !== 0) {
            var paramId = basePart.statEffect.param;
            if (actor._statModifiers[paramId]) {
              actor._statModifiers[paramId] -= basePart.statEffect.amount;
              if (actor._statModifiers[paramId] === 0) {
                delete actor._statModifiers[paramId];
              }
            }
          }

          needsRefresh = true;
        }
      }
      // Regular healing for undamaged parts
      else if (!bodyPart.damaged) {
        bodyPart.currentHp = Math.min(
          bodyPart.maxHp,
          bodyPart.currentHp + amount
        );
      }
    }

    // Refresh actor to update stats if needed
    if (needsRefresh) {
      actor.refresh();
    }
  }

  // Override param calculation to apply body part damage effects
  var _Game_Actor_param = Game_Actor.prototype.param;
  Game_Actor.prototype.param = function (paramId) {
    var value = _Game_Actor_param.call(this, paramId);

    // Apply limb damage modifiers if this is Actor1, but exclude max HP (paramId 0)
    if (
      this.actorId() === 1 &&
      this._statModifiers &&
      this._statModifiers[paramId] &&
      paramId !== 0
    ) {
      value += this._statModifiers[paramId];
    }

    return Math.max(1, value);
  };
  // Define Window_HealthStatus class BEFORE it's used
  function Window_HealthStatus() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_HealthStatus.prototype = Object.create(Window_StatusBase.prototype);
  } else {
    Window_HealthStatus.prototype = Object.create(Window_Selectable.prototype);
  }

  Window_HealthStatus.prototype.constructor = Window_HealthStatus;

  Window_HealthStatus.prototype.initialize = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      // MZ style initialization with Rectangle
      Window_StatusBase.prototype.initialize.call(
        this,
        new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight)
      );
    } else {
      // MV style initialization
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight
      );
    }

    this.setupBodyPartsList();
    this.refresh();
    this.activate();
    this.select(0);
  };

  Window_HealthStatus.prototype.setupBodyPartsList = function () {
    this._actor = $gameParty.members()[0]; // Actor1
    if (!this._actor) return;

    if (!this._actor._bodyParts) initializeBodyParts(this._actor);

    // Create sorted list of body parts for display
    this._bodyPartsList = [];

    // Add header for Head section
    this._bodyPartsList.push({
      isHeader: true,
      name: getTranslatedText("Head", "Testa"),
    });
    // Add head parts
    this.addPartsToList([
      "HEAD",
      "BRAIN",
      "LEFT_EYE",
      "RIGHT_EYE",
      "NOSE",
      "LEFT_EAR",
      "RIGHT_EAR",
      "MOUTH",
      "TEETH",
    ]);

    // Add header for Torso section
    this._bodyPartsList.push({
      isHeader: true,
      name: getTranslatedText("Torso", "Corpo"),
    });
    // Add torso parts
    this.addPartsToList([
      "TORSO",
      "HEART",
      "LEFT_LUNG",
      "RIGHT_LUNG",
      "LIVER",
      "STOMACH",
      "SPLEEN",
      "INTESTINES",
    ]);

    // Add header for Arms section
    this._bodyPartsList.push({
      isHeader: true,
      name: getTranslatedText("Arms", "Braccia"),
    });
    // Add arm parts
    this.addPartsToList([
      "LEFT_ARM",
      "LEFT_HAND",
      "LEFT_FINGERS",
      "RIGHT_ARM",
      "RIGHT_HAND",
      "RIGHT_FINGERS",
    ]);

    // Add header for Legs section
    this._bodyPartsList.push({
      isHeader: true,
      name: getTranslatedText("Legs", "Gambe"),
    });
    // Add leg parts
    this.addPartsToList([
      "LEFT_LEG",
      "LEFT_FOOT",
      "LEFT_TOES",
      "RIGHT_LEG",
      "RIGHT_FOOT",
      "RIGHT_TOES",
    ]);
  };

  Window_HealthStatus.prototype.addPartsToList = function (partKeys) {
    for (var i = 0; i < partKeys.length; i++) {
      var partKey = partKeys[i];
      var part = this._actor._bodyParts[partKey];

      if (part) {
        // Add part to list with reference to its key
        this._bodyPartsList.push({
          isHeader: false,
          key: partKey,
          part: part,
          // Determine indentation level
          indent:
            partKey !== "HEAD" &&
            partKey !== "TORSO" &&
            partKey !== "LEFT_ARM" &&
            partKey !== "RIGHT_ARM" &&
            partKey !== "LEFT_LEG" &&
            partKey !== "RIGHT_LEG",
        });
      }
    }
  };

  Window_HealthStatus.prototype.maxItems = function () {
    return this._bodyPartsList ? this._bodyPartsList.length : 0;
  };

  Window_HealthStatus.prototype.refresh = function () {
    this.contents.clear();
    this._actor = $gameParty.members()[0]; // Only for Actor1

    if (this._actor) {
      if (!this._actor._bodyParts) initializeBodyParts(this._actor);

      var lineHeight = this.lineHeight();

      // Draw actor name and HP using compatible methods
      if (Utils.RPGMAKER_NAME === "MZ") {
        this.drawActorName(this._actor, 6, 0, 150);
        this.drawActorHp(this._actor, 220, 0, 180);
      } else {
        // MV style
        this.drawActorName(this._actor, 6, 0);
        this.drawActorHp(this._actor, 220, 0);
      }

      this.drawHorzLine(lineHeight);

      // Instructions at the bottom
      var bottomY = this.contents.height - lineHeight * 1.5;
      var instructionText = getTranslatedText(
        "↑↓: Navigate   ESC: Exit",
        "↑↓: Naviga   ESC: Esci"
      );
      this.drawText(instructionText, 6, bottomY, this.contents.width - 12);

      // Items are drawn by drawItem when the window refreshes
      this.drawAllItems();
    }
  };

  // Update Window_HealthStatus drawItem method for damaged body parts
  Window_HealthStatus.prototype.drawItem = function (index) {
    if (
      !this._bodyPartsList ||
      index < 0 ||
      index >= this._bodyPartsList.length
    )
      return;

    var item = this._bodyPartsList[index];
    var rect = this.itemRect(index);

    // Clear the item area
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.isHeader) {
      // Draw section header
      this.changeTextColor(this.systemColor());
      this.drawText(item.name, rect.x + 6, rect.y, rect.width - 12);
      this.resetTextColor();
    } else {
      // Draw body part
      var part = item.part;
      var basePart = BodyParts[item.key];
      var x = rect.x + (item.indent ? 30 : 10);
      var width = rect.width - (item.indent ? 40 : 20);
      var gaugeWidth = 120;
      var textWidth = width - gaugeWidth - 10;

      // Draw part name
      this.drawText(part.name, x, rect.y, textWidth);

      // Draw HP gauge
      if (part.damaged) {
        var damagedText = getTranslatedText("DAMAGED", "DANNEGGIATO");
        this.drawText(damagedText, x + textWidth + 10, rect.y, gaugeWidth);

        if (Utils.RPGMAKER_NAME === "MZ") {
          this.changeTextColor(ColorManager.deathColor());
        } else {
          this.changeTextColor(this.deathColor());
        }

        // Draw stat effect if applied
        if (part.appliedStatEffect && basePart.statEffect) {
          var statEffect = basePart.statEffect;
          var paramName = getParamName(statEffect.param);
          var statText = paramName + " " + statEffect.amount;
          this.drawText(
            statText,
            x,
            rect.y + this.lineHeight() - 4,
            width,
            "right"
          );
        }
      } else {
        this.drawBodyPartGauge(
          x + textWidth + 10,
          rect.y,
          gaugeWidth,
          part.currentHp / part.maxHp
        );
        this.drawText(
          part.currentHp + "/" + part.maxHp,
          x + textWidth + 10,
          rect.y,
          gaugeWidth,
          "right"
        );
      }

      this.resetTextColor();
    }
  };

  // Define item height for scrolling
  Window_HealthStatus.prototype.itemHeight = function () {
    return this.lineHeight();
  };

  // Item width is the full width of the window
  Window_HealthStatus.prototype.itemWidth = function () {
    return this.contents.width;
  };

  // Handle window item visibility
  Window_HealthStatus.prototype.topRow = function () {
    return Math.floor(this._scrollY / this.itemHeight());
  };

  Window_HealthStatus.prototype.setTopRow = function (row) {
    var scrollY =
      Math.max(0, Math.min(row, this.maxTopRow())) * this.itemHeight();
    if (this._scrollY !== scrollY) {
      this._scrollY = scrollY;
      this.refresh();
      this.refreshCursor(); // Changed from updateCursor to refreshCursor
    }
  };

  Window_HealthStatus.prototype.maxTopRow = function () {
    return Math.max(0, this.maxItems() - this.maxPageRows());
  };

  Window_HealthStatus.prototype.maxPageRows = function () {
    var pageHeight = this.height - this.padding * 2;
    // Reserve space for actor info at top and instructions at bottom
    pageHeight -= this.lineHeight() * 3;
    return Math.floor(pageHeight / this.itemHeight());
  };

  // Override cursor movement methods
  Window_HealthStatus.prototype.cursorDown = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxPageRows = this.maxPageRows();

    if (index < maxItems - 1) {
      this.select((index + 1) % maxItems);
    } else if (wrap) {
      this.select(0);
    }
  };

  Window_HealthStatus.prototype.cursorUp = function (wrap) {
    var index = this.index();
    var maxItems = this.maxItems();

    if (index > 0) {
      this.select((index - 1 + maxItems) % maxItems);
    } else if (wrap) {
      this.select(maxItems - 1);
    }
  };

  Window_HealthStatus.prototype.isCursorVisible = function () {
    var row = this.row();
    return row >= this.topRow() && row <= this.bottomRow();
  };

  Window_HealthStatus.prototype.ensureCursorVisible = function () {
    var row = this.row();
    if (row < this.topRow()) {
      this.setTopRow(row);
    } else if (row > this.bottomRow()) {
      this.setTopRow(row - (this.maxPageRows() - 1));
    }
  };

  // Add mouse wheel support for scrolling
  Window_HealthStatus.prototype.processWheel = function () {
    if (this.isOpenAndActive()) {
      var threshold = 20;
      if (TouchInput.wheelY >= threshold) {
        this.scrollDown(1);
      }
      if (TouchInput.wheelY <= -threshold) {
        this.scrollUp(1);
      }
    }
  };

  Window_HealthStatus.prototype.scrollDown = function (num) {
    var newTopRow = Math.min(this.topRow() + num, this.maxTopRow());
    this.setTopRow(newTopRow);
  };

  Window_HealthStatus.prototype.scrollUp = function (num) {
    var newTopRow = Math.max(this.topRow() - num, 0);
    this.setTopRow(newTopRow);
  };
  Window_HealthStatus.prototype.update = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.update.call(this);
    } else {
      Window_Selectable.prototype.update.call(this);
    }

    // Process mouse wheel scrolling
    this.processWheel();
  };

  // Override selection handling
  Window_HealthStatus.prototype.select = function (index) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.select.call(this, index);
    } else {
      Window_Selectable.prototype.select.call(this, index);
    }
    this.ensureCursorVisible();
    this.refreshCursor();
  };

  Window_HealthStatus.prototype.refreshCursor = function () {
    if (this._cursorAll) {
      this.refreshCursorForAll();
    } else if (this.index() >= 0) {
      var rect = this.itemRect(this.index());
      this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
      this.setCursorRect(0, 0, 0, 0);
    }
  };

  Window_HealthStatus.prototype.bottomRow = function () {
    return Math.max(0, this.topRow() + this.maxPageRows() - 1);
  };

  Window_HealthStatus.prototype.row = function () {
    return Math.floor(this.index() / this.maxCols());
  };

  Window_HealthStatus.prototype.maxCols = function () {
    return 1;
  };

  // Helper method for drawing body part gauges
  Window_HealthStatus.prototype.drawBodyPartGauge = function (
    x,
    y,
    width,
    rate
  ) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    var gaugeHeight = 6;

    // Get colors based on RPG Maker version
    var backColor, color1, color2;

    if (Utils.RPGMAKER_NAME === "MZ") {
      backColor = ColorManager.gaugeBackColor();
      color1 = ColorManager.hpGaugeColor1();
      color2 = ColorManager.hpGaugeColor2();
    } else {
      backColor = this.gaugeBackColor();
      color1 = this.hpGaugeColor1();
      color2 = this.hpGaugeColor2();
    }

    this.contents.fillRect(x, gaugeY, width, gaugeHeight, backColor);
    this.contents.gradientFillRect(
      x,
      gaugeY,
      fillW,
      gaugeHeight,
      color1,
      color2
    );
  };

  Window_HealthStatus.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    var color =
      Utils.RPGMAKER_NAME === "MZ"
        ? ColorManager.normalColor()
        : this.normalColor();
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, color);
    this.contents.paintOpacity = 255;
  };

  Window_HealthStatus.prototype.processCancel = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.processCancel.call(this);
    } else {
      Window_Selectable.prototype.processCancel.call(this);
    }
    SceneManager.pop();
  };
  Scene_HealthStatus.prototype.popScene = function () {
    SceneManager.pop();
  };

  // Helper methods for color compatibility between MV and MZ
  Window_HealthStatus.prototype.systemColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.systemColor()
      : Window_Base.prototype.systemColor.call(this);
  };

  Window_HealthStatus.prototype.normalColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.normalColor()
      : Window_Base.prototype.normalColor.call(this);
  };

  Window_HealthStatus.prototype.hpGaugeColor1 = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.hpGaugeColor1()
      : Window_Base.prototype.hpGaugeColor1.call(this);
  };

  Window_HealthStatus.prototype.hpGaugeColor2 = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.hpGaugeColor2()
      : Window_Base.prototype.hpGaugeColor2.call(this);
  };

  Window_HealthStatus.prototype.deathColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.deathColor()
      : Window_Base.prototype.deathColor.call(this);
  };

  Window_HealthStatus.prototype.resetTextColor = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.changeTextColor(ColorManager.normalColor());
    } else {
      Window_Base.prototype.resetTextColor.call(this);
    }
  };

  Window_HealthStatus.prototype.changeTextColor = function (color) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.contents.textColor = color;
    } else {
      Window_Base.prototype.changeTextColor.call(this, color);
    }
  };

  // Add compatibility methods for MV if running in MZ
  if (Utils.RPGMAKER_NAME === "MZ") {
    // These methods need to be added for MV compatibility if they don't exist
    if (!Window_HealthStatus.prototype.drawActorName) {
      Window_HealthStatus.prototype.drawActorName = function (
        actor,
        x,
        y,
        width
      ) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
      };
    }

    if (!Window_HealthStatus.prototype.drawActorHp) {
      Window_HealthStatus.prototype.drawActorHp = function (
        actor,
        x,
        y,
        width
      ) {
        width = width || 186;
        const color1 = ColorManager.hpGaugeColor1();
        const color2 = ColorManager.hpGaugeColor2();
        this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.hpA, x, y, 44);
        this.drawCurrentAndMax(
          actor.hp,
          actor.mhp,
          x,
          y,
          width,
          this.hpColor(actor),
          ColorManager.normalColor()
        );
      };
    }

    if (!Window_HealthStatus.prototype.drawCurrentAndMax) {
      Window_HealthStatus.prototype.drawCurrentAndMax = function (
        current,
        max,
        x,
        y,
        width,
        color1,
        color2
      ) {
        const labelWidth = this.textWidth("HP");
        const valueWidth = this.textWidth("0000");
        const slashWidth = this.textWidth("/");
        const x1 = x + width - valueWidth;
        const x2 = x1 - slashWidth;
        const x3 = x2 - valueWidth;
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, "right");
        this.changeTextColor(ColorManager.normalColor());
        this.drawText("/", x2, y, slashWidth, "right");
        this.changeTextColor(color2);
        this.drawText(max, x1, y, valueWidth, "right");
      };
    }

    if (!Window_HealthStatus.prototype.hpColor) {
      Window_HealthStatus.prototype.hpColor = function (actor) {
        if (actor.isDead()) {
          return ColorManager.deathColor();
        } else if (actor.isDying()) {
          return ColorManager.crisisColor();
        } else {
          return ColorManager.normalColor();
        }
      };
    }
  }

  // Create the health status scene class
  function Scene_HealthStatus() {
    this.initialize(...arguments);
  }

  Scene_HealthStatus.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_HealthStatus.prototype.constructor = Scene_HealthStatus;

  Scene_HealthStatus.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_HealthStatus.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHealthStatusWindow();
    // Add this line to make sure cancel handling is set up
    this._healthStatusWindow.setHandler("cancel", this.popScene.bind(this));
  };

  Scene_HealthStatus.prototype.createHealthStatusWindow = function () {
    this._healthStatusWindow = new Window_HealthStatus();
    this.addWindow(this._healthStatusWindow);
  };

  // Add health status to the menu

  var _Window_MenuCommand_addOriginalCommands =
    Window_MenuCommand.prototype.addOriginalCommands;
  Window_MenuCommand.prototype.addOriginalCommands = function () {
    _Window_MenuCommand_addOriginalCommands.call(this);

    var menuText = getTranslatedText(menuCommandName, "Status Salute");
    this.addCommand(menuText, "healthStatus", true, 32);
    var menuText2 = getTranslatedText("Biologics", "Biologia");
    this.addCommand(menuText2, "biologics", true, 27);
  };

  var _Scene_Menu_createCommandWindow =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler(
      "healthStatus",
      this.commandHealthStatus.bind(this)
    );
    this._commandWindow.setHandler(
      "biologics",
      this.commandBiologics.bind(this)
    );
  };

  Scene_Menu.prototype.commandHealthStatus = function () {
    SceneManager.push(Scene_HealthStatus);
  };

  // Override damage application
  var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
  Game_Action.prototype.executeHpDamage = function (target, value) {
    _Game_Action_executeHpDamage.call(this, target, value);

    // Only apply limb damage system to Actor1
    if (target.isActor() && target.actorId() === 1 && value > 0) {
      applyLimbDamage(target, value);

      // Check if HP is zero or less and restore body parts if so
      if (target.hp <= 0) {
        restoreAllBodyParts(target);
      }
    }
  };
  // Add hooks for BattleLog to display limb damage
  var _Window_BattleLog_displayHpDamage =
    Window_BattleLog.prototype.displayHpDamage;
  Window_BattleLog.prototype.displayHpDamage = function (target) {
    _Window_BattleLog_displayHpDamage.call(this, target);

    // Check for limb damage logs - only when body parts are fully damaged
    if ($gameTemp.limbDamageLog && target.isActor() && target.actorId() === 1) {
      var log = $gameTemp.limbDamageLog;

      // Show specific damage message and stat effect if applied
      if (log.paramName && log.amount) {
        if (ConfigManager.language === "it") {
          this.push(
            "addText",
            log.name +
              " " +
              log.damageMsg +
              ", " +
              log.paramName +
              " " +
              log.amount +
              "!"
          );
        } else {
          this.push(
            "addText",
            log.name +
              "'s " +
              log.damageMsg +
              ", " +
              log.paramName +
              " " +
              log.amount +
              "!"
          );
        }
      } else {
        if (ConfigManager.language === "it") {
          this.push("addText", log.name + " " + log.damageMsg + "!");
        } else {
          this.push("addText", log.name + "'s " + log.damageMsg + "!");
        }
      }

      $gameTemp.limbDamageLog = null;
    }
  };

  // Override HP and MP recovery effects to also heal body parts
  var _Game_Action_itemEffectRecoverHp =
    Game_Action.prototype.itemEffectRecoverHp;
  Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
    _Game_Action_itemEffectRecoverHp.call(this, target, effect);

    // Only apply to Actor1
    if (target.isActor() && target.actorId() === 1) {
      var value = Math.floor(target.mhp * effect.value1 + effect.value2);
      healBodyParts(target, value);
    }
  };

  var _Game_Action_itemEffectRecoverMp =
    Game_Action.prototype.itemEffectRecoverMp;
  Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
    _Game_Action_itemEffectRecoverMp.call(this, target, effect);

    // Only apply to Actor1
    if (target.isActor() && target.actorId() === 1) {
      var value = Math.floor(target.mmp * effect.value1 + effect.value2);
      healBodyParts(target, Math.floor(value / 2)); // MP recovery items/skills heal body parts at half rate
    }
  };

  // ********************************************************************
  //Prosthetic Shop Window
  // Add this after the existing Window_HealthStatus class definition

  // Prosthetic Shop Window
  function Window_ProstheticShop() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ProstheticShop.prototype = Object.create(
      Window_StatusBase.prototype
    );
  } else {
    Window_ProstheticShop.prototype = Object.create(
      Window_Selectable.prototype
    );
  }

  Window_ProstheticShop.prototype.constructor = Window_ProstheticShop;

  Window_ProstheticShop.prototype.initialize = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(
        this,
        new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight - 120)
      );
    } else {
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight - 120
      );
    }

    this._actor = $gameParty.members()[0]; // Actor1
    this._selectedProsthetics = {}; // Store selected prosthetics
    this._totalCost = 0;
    this.setupProstheticList();
    this.refresh();
    this.activate();
    this.select(0);
  };

  Window_ProstheticShop.prototype.setupProstheticList = function () {
    if (!this._actor || !this._actor._bodyParts) {
      initializeBodyParts(this._actor);
    }

    this._prostheticList = [];

    // Add header for each body part that can have prosthetics
    for (var partKey in ProstheticCompatibility) {
      var part = this._actor._bodyParts[partKey];
      if (!part) continue;

      // Add body part header
      this._prostheticList.push({
        isHeader: true,
        partKey: partKey,
        name: part.name,
      });

      // Add current status (original/prosthetic)
      var currentProsthetic = this._actor._prosthetics
        ? this._actor._prosthetics[partKey]
        : null;
      this._prostheticList.push({
        isBodyPart: true,
        partKey: partKey,
        currentProsthetic: currentProsthetic,
        name: currentProsthetic
          ? ProstheticTypes[currentProsthetic]
            ? ConfigManager.language === "it"
              ? ProstheticTypes[currentProsthetic].name_it
              : ProstheticTypes[currentProsthetic].name_en
            : "Unknown Prosthetic"
          : getTranslatedText("Original", "Originale"),
      });

      // Add available prosthetics for this part
      var compatibleProsthetics = ProstheticCompatibility[partKey];
      for (var i = 0; i < compatibleProsthetics.length; i++) {
        var prostheticKey = compatibleProsthetics[i];
        var prosthetic = ProstheticTypes[prostheticKey];
        if (!prosthetic) continue;

        this._prostheticList.push({
          isProsthetic: true,
          partKey: partKey,
          prostheticKey: prostheticKey,
          prosthetic: prosthetic,
          name:
            ConfigManager.language === "it"
              ? prosthetic.name_it
              : prosthetic.name_en,
          cost: prosthetic.cost,
          isSelected: this._selectedProsthetics[partKey] === prostheticKey,
        });
      }
    }
  };

  Window_ProstheticShop.prototype.maxItems = function () {
    return this._prostheticList ? this._prostheticList.length : 0;
  };

  Window_ProstheticShop.prototype.drawItem = function (index) {
    if (
      !this._prostheticList ||
      index < 0 ||
      index >= this._prostheticList.length
    )
      return;

    var item = this._prostheticList[index];
    var rect = this.itemRect(index);

    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);

    if (item.isHeader) {
      // Draw body part header
      this.changeTextColor(this.systemColor());
      this.drawText("■ " + item.name, rect.x + 6, rect.y, rect.width - 12);
      this.resetTextColor();
    } else if (item.isBodyPart) {
      // Draw current status
      var statusText = getTranslatedText("Current: ", "Attuale: ") + item.name;
      this.drawText(statusText, rect.x + 20, rect.y, rect.width - 40);

      // Draw remove option if has prosthetic
      if (item.currentProsthetic) {
        var removeText = getTranslatedText("[Remove]", "[Rimuovi]");
        this.drawText(
          removeText,
          rect.x + 20,
          rect.y + this.lineHeight(),
          rect.width - 40
        );
      }
    } else if (item.isProsthetic) {
      // Draw prosthetic option
      var x = rect.x + 40;
      var width = rect.width - 80;

      // Highlight if selected
      if (
        item.isSelected ||
        this._selectedProsthetics[item.partKey] === item.prostheticKey
      ) {
        this.changeTextColor(this.textColor(3)); // Yellow
        this.drawText("→ ", rect.x + 20, rect.y, 20);
      }

      // Draw prosthetic name
      this.drawText(item.name, x, rect.y, width - 100);

      // Draw cost
      this.drawText(item.cost + "G", x + width - 100, rect.y, 100, "right");

      // Draw effects on second line
      if (item.prosthetic.effects) {
        var effectText = "";
        for (var paramId in item.prosthetic.effects) {
          var value = item.prosthetic.effects[paramId];
          var paramName = getParamName(parseInt(paramId));
          effectText += paramName + " +" + value + " ";
        }
        this.drawText(effectText, x, rect.y + this.lineHeight(), width);
      }

      this.resetTextColor();
    }
  };

  Window_ProstheticShop.prototype.itemHeight = function () {
    return this.lineHeight() * 2; // Double height for prosthetics to show effects
  };

  Window_ProstheticShop.prototype.refresh = function () {
    this.contents.clear();
    this.setupProstheticList();
    this.drawAllItems();
  };

  Window_ProstheticShop.prototype.processOk = function () {
    if (!this._prostheticList) return;

    var item = this._prostheticList[this.index()];
    if (!item) return;

    if (item.isProsthetic) {
      // Toggle prosthetic selection
      if (this._selectedProsthetics[item.partKey] === item.prostheticKey) {
        delete this._selectedProsthetics[item.partKey];
      } else {
        this._selectedProsthetics[item.partKey] = item.prostheticKey;
      }
      this.calculateTotalCost();
      this.refresh();
      if (this._handlers["costChanged"]) {
        this._handlers["costChanged"]();
      }
    } else if (item.isBodyPart && item.currentProsthetic) {
      // Remove current prosthetic
      this._selectedProsthetics[item.partKey] = "REMOVE";
      this.calculateTotalCost();
      this.refresh();
      if (this._handlers["costChanged"]) {
        this._handlers["costChanged"]();
      }
    }
  };

  Window_ProstheticShop.prototype.calculateTotalCost = function () {
    this._totalCost = 0;
    for (var partKey in this._selectedProsthetics) {
      var prostheticKey = this._selectedProsthetics[partKey];
      if (prostheticKey !== "REMOVE" && ProstheticTypes[prostheticKey]) {
        this._totalCost += ProstheticTypes[prostheticKey].cost;
      }
    }
  };

  Window_ProstheticShop.prototype.getTotalCost = function () {
    return this._totalCost;
  };

  Window_ProstheticShop.prototype.getSelectedProsthetics = function () {
    return this._selectedProsthetics;
  };

  // Cost Display Window
  function Window_ProstheticCost() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_ProstheticCost.prototype = Object.create(Window_Base.prototype);
  } else {
    Window_ProstheticCost.prototype = Object.create(Window_Base.prototype);
  }

  Window_ProstheticCost.prototype.constructor = Window_ProstheticCost;

  Window_ProstheticCost.prototype.initialize = function () {
    const height = 120;
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_Base.prototype.initialize.call(
        this,
        new Rectangle(0, Graphics.boxHeight - height, Graphics.boxWidth, height)
      );
    } else {
      Window_Base.prototype.initialize.call(
        this,
        0,
        Graphics.boxHeight - height,
        Graphics.boxWidth,
        height
      );
    }
    this._totalCost = 0;
    this.refresh();
  };

  Window_ProstheticCost.prototype.setTotalCost = function (cost) {
    this._totalCost = cost;
    this.refresh();
  };

  Window_ProstheticCost.prototype.refresh = function () {
    this.contents.clear();

    const currentMoney = $gameParty.gold();
    const costText =
      getTranslatedText("Total Cost: ", "Costo Totale: ") +
      this._totalCost +
      "G";
    const moneyText =
      getTranslatedText("Current Money: ", "Denaro Attuale: ") +
      currentMoney +
      "G";

    this.drawText(costText, 6, 0, this.contents.width - 12);
    this.drawText(moneyText, 6, this.lineHeight(), this.contents.width - 12);

    // Draw confirm/cancel instructions
    const canAfford = currentMoney >= this._totalCost;
    if (canAfford && this._totalCost > 0) {
      this.changeTextColor(this.textColor(3)); // Yellow
      const confirmText = getTranslatedText(
        "ENTER: Confirm Purchase",
        "INVIO: Conferma Acquisto"
      );
      this.drawText(
        confirmText,
        6,
        this.lineHeight() * 2,
        this.contents.width - 12
      );
    } else if (this._totalCost > 0) {
      this.changeTextColor(this.textColor(2)); // Red
      const noMoneyText = getTranslatedText(
        "Not enough money!",
        "Denaro insufficiente!"
      );
      this.drawText(
        noMoneyText,
        6,
        this.lineHeight() * 2,
        this.contents.width - 12
      );
    }

    this.resetTextColor();
  };

  Window_ProstheticCost.prototype.canAfford = function () {
    return $gameParty.gold() >= this._totalCost && this._totalCost > 0;
  };

  // Prosthetic Shop Scene
  function Scene_ProstheticShop() {
    this.initialize(...arguments);
  }

  Scene_ProstheticShop.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_ProstheticShop.prototype.constructor = Scene_ProstheticShop;

  Scene_ProstheticShop.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_ProstheticShop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createProstheticWindow();
    this.createCostWindow();
  };

  Scene_ProstheticShop.prototype.createProstheticWindow = function () {
    this._prostheticWindow = new Window_ProstheticShop();
    this._prostheticWindow.setHandler("cancel", this.popScene.bind(this));
    this._prostheticWindow.setHandler(
      "costChanged",
      this.onCostChanged.bind(this)
    );
    this.addWindow(this._prostheticWindow);
  };

  Scene_ProstheticShop.prototype.createCostWindow = function () {
    this._costWindow = new Window_ProstheticCost();
    this.addWindow(this._costWindow);
  };

  Scene_ProstheticShop.prototype.onCostChanged = function () {
    const totalCost = this._prostheticWindow.getTotalCost();
    this._costWindow.setTotalCost(totalCost);
  };

  Scene_ProstheticShop.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);

    // Handle confirm purchase
    if (Input.isTriggered("ok") && this._costWindow.canAfford()) {
      this.confirmPurchase();
    }
  };

  Scene_ProstheticShop.prototype.confirmPurchase = function () {
    var selectedProsthetics = this._prostheticWindow.getSelectedProsthetics();
    var totalCost = this._prostheticWindow.getTotalCost();
    var actor = $gameParty.members()[0];

    if (!actor || totalCost === 0) return;

    // Initialize prosthetic data if needed
    if (!actor._prosthetics) {
      actor._prosthetics = {};
    }
    if (!actor._prostheticEffects) {
      actor._prostheticEffects = {};
    }

    // Apply changes
    for (var partKey in selectedProsthetics) {
      var prostheticKey = selectedProsthetics[partKey];

      if (prostheticKey === "REMOVE") {
        // Remove prosthetic
        this.removeProsthetic(actor, partKey);
      } else {
        // Install prosthetic
        this.installProsthetic(actor, partKey, prostheticKey);
      }
    }

    // Deduct money
    if (totalCost > 0) {
      $gameParty.loseGold(totalCost);
    }

    // Refresh actor
    actor.refresh();

    // Show confirmation message
    var confirmText = getTranslatedText(
      "Prosthetics installed successfully!",
      "Protesi installate con successo!"
    );
    $gameMessage.add(confirmText);

    this.popScene();
  };

  Scene_ProstheticShop.prototype.installProsthetic = function (
    actor,
    partKey,
    prostheticKey
  ) {
    var prosthetic = ProstheticTypes[prostheticKey];
    if (!prosthetic) return;

    // Remove old prosthetic effects if any
    this.removeProsthetic(actor, partKey);

    // Install new prosthetic
    actor._prosthetics[partKey] = prostheticKey;

    // Apply stat effects
    if (prosthetic.effects) {
      for (var paramId in prosthetic.effects) {
        var value = prosthetic.effects[paramId];
        if (!actor._prostheticEffects[paramId]) {
          actor._prostheticEffects[paramId] = 0;
        }
        actor._prostheticEffects[paramId] += value;
      }
    }

    // Learn skill if specified
    if (prosthetic.skill) {
      actor.learnSkill(prosthetic.skill);
    }
  };

  Scene_ProstheticShop.prototype.removeProsthetic = function (actor, partKey) {
    var currentProstheticKey = actor._prosthetics[partKey];
    if (!currentProstheticKey) return;

    var prosthetic = ProstheticTypes[currentProstheticKey];
    if (!prosthetic) return;

    // Remove stat effects
    if (prosthetic.effects) {
      for (var paramId in prosthetic.effects) {
        var value = prosthetic.effects[paramId];
        if (actor._prostheticEffects[paramId]) {
          actor._prostheticEffects[paramId] -= value;
          if (actor._prostheticEffects[paramId] === 0) {
            delete actor._prostheticEffects[paramId];
          }
        }
      }
    }

    // Forget skill if specified
    if (prosthetic.skill) {
      actor.forgetSkill(prosthetic.skill);
    }

    // Remove prosthetic
    delete actor._prosthetics[partKey];
  };

  // Add prosthetic effects to param calculation
  var _Game_Actor_param_prosthetic = Game_Actor.prototype.param;
  Game_Actor.prototype.param = function (paramId) {
    var value = _Game_Actor_param_prosthetic.call(this, paramId);

    // Apply prosthetic effects if this is Actor1
    if (
      this.actorId() === 1 &&
      this._prostheticEffects &&
      this._prostheticEffects[paramId]
    ) {
      value += this._prostheticEffects[paramId];
    }

    return Math.max(1, value);
  };

  // Biologic Simulation System
  function Window_BiologicSimulation() {
    this.initialize(...arguments);
  }

  if (Utils.RPGMAKER_NAME === "MZ") {
    Window_BiologicSimulation.prototype = Object.create(
      Window_StatusBase.prototype
    );
  } else {
    Window_BiologicSimulation.prototype = Object.create(
      Window_Selectable.prototype
    );
  }

  Window_BiologicSimulation.prototype.constructor = Window_BiologicSimulation;

  Window_BiologicSimulation.prototype.initialize = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.initialize.call(
        this,
        new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight)
      );
    } else {
      Window_Selectable.prototype.initialize.call(
        this,
        0,
        0,
        Graphics.boxWidth,
        Graphics.boxHeight
      );
    }
    this._brainScrollY = 0;
    this._maxBrainScroll = 0;
    this._vitalScrollY = 0;
    this._maxVitalScroll = 0;
    this._actor = $gameParty.members()[0]; // Actor1
    this._category = 0; // 0: Vital Signs, 1: Hormones, 2: Immune System, 3: Ley Veins, 4: Brain Activity
    this._categories = [
      { name: "Vital Signs", name_it: "Segni Vitali" },
      { name: "Hormones", name_it: "Ormoni" },
      { name: "Immune System", name_it: "Sistema Immunitario" },
      { name: "Ley Veins", name_it: "Vene Magiche" },
      { name: "Brain Activity", name_it: "Attività Cerebrale" },
    ];

    this.initializeBiologicData();
    this.refresh();
    this.activate();
    this.select(0);

    // Start real-time simulation
    this.startBiologicSimulation();
  };

  // Override cursor movement for brain tab
  Window_BiologicSimulation.prototype.cursorUp = function (wrap) {
    if (this._category === 4) {
      // Brain Activity tab
      this._brainScrollY = Math.max(0, this._brainScrollY - this.lineHeight());
      this.refresh();
    } else if (this._category === 0) {
      // Vital Signs tab
      this._vitalScrollY = Math.max(0, this._vitalScrollY - this.lineHeight());
      this.refresh();
    } else {
      // Normal cursor behavior for other tabs
      Window_Selectable.prototype.cursorUp.call(this, wrap);
    }
  };

  Window_BiologicSimulation.prototype.cursorDown = function (wrap) {
    if (this._category === 4) {
      // Brain Activity tab
      this._brainScrollY = Math.min(
        this._maxBrainScroll,
        this._brainScrollY + this.lineHeight()
      );
      this.refresh();
    } else if (this._category === 0) {
      // Vital Signs tab
      this._vitalScrollY = Math.min(
        this._maxVitalScroll,
        this._vitalScrollY + this.lineHeight()
      );
      this.refresh();
    } else {
      // Normal cursor behavior for other tabs
      Window_Selectable.prototype.cursorDown.call(this, wrap);
    }
  };
  Window_BiologicSimulation.prototype.startBiologicSimulation = function () {
    var self = this;
    this._simulationInterval = setInterval(function () {
      self.updateBiologicActivity();
      self.refresh();
    }, 1000); // Update every second
  };

  Window_BiologicSimulation.prototype.stopBiologicSimulation = function () {
    if (this._simulationInterval) {
      clearInterval(this._simulationInterval);
      this._simulationInterval = null;
    }
  };
  Window_BiologicSimulation.prototype.updateBiologicActivity = function () {
    if (!this._actor || !this._actor._biologicData) return;

    var bio = this._actor._biologicData;
    var hungerRate = $gameVariables.value(54) || 50; // 0-100, 0 = very hungry
    var sleepRate = $gameVariables.value(55) || 50; // 0-100, 0 = very sleepy

    // Update vital signs with natural fluctuation
    this.updateVitalSigns(bio, hungerRate, sleepRate);

    // Update hormones
    this.updateHormones(bio, hungerRate, sleepRate);

    // Update immune system activity
    this.updateImmuneSystem(bio, hungerRate, sleepRate);

    // Update brain activity
    this.updateBrainActivity(bio, hungerRate, sleepRate);

    // Update ley veins
    this.updateLeyVeinsActivity(bio);

    // Update cellular activity
    this.updateCellularActivity(bio, hungerRate, sleepRate);
  };

  Window_BiologicSimulation.prototype.updateVitalSigns = function (
    bio,
    hunger,
    sleep
  ) {
    var baseHeart = 70;
    var baseTemp = 36.8;
    var baseBP = { systolic: 120, diastolic: 80 };

    // Hunger effects (0 = very hungry)
    var hungerMultiplier = (100 - hunger) / 100; // Higher when hungry
    baseHeart += hungerMultiplier * 15; // Heart rate increases when hungry
    baseTemp -= hungerMultiplier * 0.5; // Temperature drops when hungry

    // Sleep effects (0 = very sleepy)
    var sleepMultiplier = (100 - sleep) / 100; // Higher when tired
    baseHeart += sleepMultiplier * 20; // Heart rate increases when tired
    baseTemp += sleepMultiplier * 0.3; // Temperature rises when tired
    baseBP.systolic += sleepMultiplier * 15;

    // Natural fluctuation
    bio.vitalSigns.heartRate += (Math.random() - 0.5) * 4;
    bio.vitalSigns.heartRate = Math.max(
      40,
      Math.min(120, baseHeart + (Math.random() - 0.5) * 10)
    );

    bio.vitalSigns.bodyTemperature += (Math.random() - 0.5) * 0.1;
    bio.vitalSigns.bodyTemperature = Math.max(
      35.0,
      Math.min(38.5, baseTemp + (Math.random() - 0.5) * 0.5)
    );

    bio.vitalSigns.bloodPressure.systolic += (Math.random() - 0.5) * 2;
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      90,
      Math.min(160, baseBP.systolic + (Math.random() - 0.5) * 15)
    );

    bio.vitalSigns.bloodPressure.diastolic += (Math.random() - 0.5) * 2;
    bio.vitalSigns.bloodPressure.diastolic = Math.max(
      60,
      Math.min(100, baseBP.diastolic + (Math.random() - 0.5) * 10)
    );

    bio.vitalSigns.oxygenSaturation += (Math.random() - 0.5) * 1;
    bio.vitalSigns.oxygenSaturation = Math.max(
      90,
      Math.min(100, bio.vitalSigns.oxygenSaturation)
    );

    // Update nutrients based on hunger
    if (hunger < 30) {
      // Very hungry
      bio.vitalSigns.nutrients.calories = Math.max(
        0,
        bio.vitalSigns.nutrients.calories - Math.random() * 5
      );
      bio.vitalSigns.nutrients.protein = Math.max(
        0,
        bio.vitalSigns.nutrients.protein - Math.random() * 2
      );
      bio.vitalSigns.nutrients.carbs = Math.max(
        0,
        bio.vitalSigns.nutrients.carbs - Math.random() * 3
      );
      bio.vitalSigns.nutrients.fats = Math.max(
        0,
        bio.vitalSigns.nutrients.fats - Math.random() * 1
      );
    }

    // Cortisol increases with hunger and sleep deprivation
    var stressLevel = (100 - hunger + (100 - sleep)) / 2;
    bio.vitalSigns.cortisol = Math.max(
      5,
      Math.min(50, 15 + (stressLevel / 100) * 20 + (Math.random() - 0.5) * 3)
    );
  };

  Window_BiologicSimulation.prototype.updateHormones = function (
    bio,
    hunger,
    sleep
  ) {
    // Hormones fluctuate based on circadian rhythm, hunger, and sleep
    var currentGender = $gameVariables.value(38) || 0;

    // Growth hormone increases during sleep deprivation (body trying to compensate)
    if (sleep < 40) {
      bio.hormones.growth += Math.random() * 0.5;
    } else {
      bio.hormones.growth += (Math.random() - 0.5) * 0.2;
    }
    bio.hormones.growth = Math.max(0.5, Math.min(8, bio.hormones.growth));

    // Insulin fluctuates with hunger
    if (hunger < 50) {
      bio.hormones.insulin += Math.random() * 2; // Increases when hungry
    } else {
      bio.hormones.insulin += (Math.random() - 0.5) * 1;
    }
    bio.hormones.insulin = Math.max(2, Math.min(20, bio.hormones.insulin));

    // Adrenaline increases with stress (hunger/sleep deprivation)
    var stressLevel = (100 - hunger + (100 - sleep)) / 2;
    bio.hormones.adrenaline +=
      (stressLevel / 100) * 5 + (Math.random() - 0.5) * 10;
    bio.hormones.adrenaline = Math.max(
      10,
      Math.min(100, bio.hormones.adrenaline)
    );

    // Sex hormones fluctuate naturally
    bio.hormones.testosterone += (Math.random() - 0.5) * 20;
    bio.hormones.estrogen += (Math.random() - 0.5) * 15;
    bio.hormones.progesterone += (Math.random() - 0.5) * 1;

    // Keep within gender-appropriate ranges
    if (currentGender === 0) {
      // Male
      bio.hormones.testosterone = Math.max(
        250,
        Math.min(1000, bio.hormones.testosterone)
      );
      bio.hormones.estrogen = Math.max(10, Math.min(50, bio.hormones.estrogen));
    } else if (currentGender === 1) {
      // Female
      bio.hormones.testosterone = Math.max(
        10,
        Math.min(80, bio.hormones.testosterone)
      );
      bio.hormones.estrogen = Math.max(
        20,
        Math.min(400, bio.hormones.estrogen)
      );
    }

    bio.hormones.progesterone = Math.max(
      0.1,
      Math.min(25, bio.hormones.progesterone)
    );

    // Thyroid fluctuates slightly
    bio.hormones.thyroid += (Math.random() - 0.5) * 0.3;
    bio.hormones.thyroid = Math.max(0.5, Math.min(5.0, bio.hormones.thyroid));
  };
  Window_BiologicSimulation.prototype.updateBrainActivity = function (
    bio,
    hunger,
    sleep
  ) {
    if (!bio.brainActivity) {
      this.initializeBrainActivity(bio);
    }

    var brain = bio.brainActivity;
    var alertnessLevel = (hunger + sleep) / 200; // 0-1 scale

    // Update brain wave patterns
    brain.waves.alpha += (Math.random() - 0.5) * 5;
    brain.waves.beta += (Math.random() - 0.5) * 8;
    brain.waves.theta += (Math.random() - 0.5) * 3;
    brain.waves.delta += (Math.random() - 0.5) * 2;
    brain.waves.gamma += (Math.random() - 0.5) * 10;

    // Adjust based on sleep level
    if (sleep < 30) {
      // Very tired
      brain.waves.delta += 5; // Increase delta waves
      brain.waves.theta += 3;
      brain.waves.beta -= 5;
      brain.waves.gamma -= 3;
    } else if (sleep > 70) {
      // Well rested
      brain.waves.beta += 3;
      brain.waves.gamma += 2;
      brain.waves.alpha += 2;
    }

    // Keep waves in realistic ranges
    brain.waves.alpha = Math.max(0, Math.min(30, brain.waves.alpha));
    brain.waves.beta = Math.max(0, Math.min(40, brain.waves.beta));
    brain.waves.theta = Math.max(0, Math.min(20, brain.waves.theta));
    brain.waves.delta = Math.max(0, Math.min(15, brain.waves.delta));
    brain.waves.gamma = Math.max(0, Math.min(25, brain.waves.gamma));

    // Update brain regions activity
    for (var region in brain.regions) {
      var regionData = brain.regions[region];

      // Base activity changes
      regionData.activity += (Math.random() - 0.5) * 10;

      // Apply alertness effects
      if (alertnessLevel < 0.3) {
        // Low alertness
        regionData.activity *= 0.7;
      } else if (alertnessLevel > 0.8) {
        // High alertness
        regionData.activity *= 1.2;
      }

      // Keep activity in range
      regionData.activity = Math.max(10, Math.min(100, regionData.activity));

      // Update status based on activity
      if (regionData.activity > 80) {
        regionData.status = "Highly Active";
      } else if (regionData.activity > 60) {
        regionData.status = "Active";
      } else if (regionData.activity > 40) {
        regionData.status = "Moderate";
      } else if (regionData.activity > 20) {
        regionData.status = "Low Activity";
      } else {
        regionData.status = "Minimal";
      }

      // Update oxygen consumption based on activity
      regionData.oxygenConsumption =
        (regionData.activity / 100) * regionData.maxOxygen;

      // Update neurotransmitter levels with fluctuation
      for (var nt in regionData.neurotransmitters) {
        regionData.neurotransmitters[nt] += (Math.random() - 0.5) * 2;
        regionData.neurotransmitters[nt] = Math.max(
          0,
          Math.min(100, regionData.neurotransmitters[nt])
        );
      }
    }

    // Update overall brain stats
    var totalActivity = 0;
    var activeRegions = 0;

    for (var region in brain.regions) {
      totalActivity += brain.regions[region].activity;
      if (brain.regions[region].activity > 50) activeRegions++;
    }

    brain.overallActivity = totalActivity / Object.keys(brain.regions).length;
    brain.activeRegions = activeRegions;
    brain.totalRegions = Object.keys(brain.regions).length;

    // Update neuron activity
    brain.neurons.firing += Math.floor((Math.random() - 0.5) * 1000000);
    brain.neurons.firing = Math.max(
      50000000,
      Math.min(200000000, brain.neurons.firing)
    );

    brain.neurons.connections += Math.floor((Math.random() - 0.5) * 100000);
    brain.neurons.connections = Math.max(
      100000000000,
      Math.min(150000000000, brain.neurons.connections)
    );
  };

  Window_BiologicSimulation.prototype.initializeBrainActivity = function (bio) {
    bio.brainActivity = {
      overallActivity: 65 + Math.random() * 20,
      activeRegions: 0,
      totalRegions: 0,

      waves: {
        alpha: 8 + Math.random() * 5, // 8-13 Hz (relaxed awareness)
        beta: 15 + Math.random() * 15, // 13-30 Hz (active thinking)
        theta: 4 + Math.random() * 4, // 4-8 Hz (drowsy)
        delta: 1 + Math.random() * 3, // 0.5-4 Hz (deep sleep)
        gamma: 30 + Math.random() * 20, // 30-100 Hz (consciousness)
      },

      neurons: {
        total: 86000000000, // ~86 billion neurons
        firing: 100000000 + Math.floor(Math.random() * 50000000),
        connections: 125000000000, // ~125 trillion connections
        activeConnections: 0,
      },

      regions: {
        prefrontalCortex: {
          name: "Prefrontal Cortex",
          function: "Executive function, decision making",
          activity: 60 + Math.random() * 30,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 25,
          neurotransmitters: {
            dopamine: 50 + Math.random() * 30,
            serotonin: 45 + Math.random() * 25,
            norepinephrine: 40 + Math.random() * 35,
          },
        },
        motorCortex: {
          name: "Motor Cortex",
          function: "Motor control, movement",
          activity: 40 + Math.random() * 40,
          status: "Moderate",
          oxygenConsumption: 0,
          maxOxygen: 20,
          neurotransmitters: {
            acetylcholine: 60 + Math.random() * 25,
            gaba: 50 + Math.random() * 30,
          },
        },
        sensoryCortex: {
          name: "Sensory Cortex",
          function: "Sensory processing",
          activity: 70 + Math.random() * 25,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 22,
          neurotransmitters: {
            glutamate: 65 + Math.random() * 25,
            gaba: 45 + Math.random() * 30,
          },
        },
        hippocampus: {
          name: "Hippocampus",
          function: "Memory formation, learning",
          activity: 55 + Math.random() * 35,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 18,
          neurotransmitters: {
            acetylcholine: 70 + Math.random() * 20,
            dopamine: 40 + Math.random() * 30,
          },
        },
        amygdala: {
          name: "Amygdala",
          function: "Emotion, fear response",
          activity: 30 + Math.random() * 50,
          status: "Moderate",
          oxygenConsumption: 0,
          maxOxygen: 15,
          neurotransmitters: {
            norepinephrine: 60 + Math.random() * 30,
            serotonin: 35 + Math.random() * 40,
          },
        },
        cerebellum: {
          name: "Cerebellum",
          function: "Balance, coordination",
          activity: 45 + Math.random() * 35,
          status: "Moderate",
          oxygenConsumption: 0,
          maxOxygen: 20,
          neurotransmitters: {
            gaba: 70 + Math.random() * 20,
            glutamate: 50 + Math.random() * 30,
          },
        },
        brainstem: {
          name: "Brainstem",
          function: "Vital functions, breathing",
          activity: 85 + Math.random() * 15,
          status: "Highly Active",
          oxygenConsumption: 0,
          maxOxygen: 30,
          neurotransmitters: {
            serotonin: 60 + Math.random() * 25,
            norepinephrine: 70 + Math.random() * 20,
          },
        },
        occipitalLobe: {
          name: "Occipital Lobe",
          function: "Visual processing",
          activity: 60 + Math.random() * 30,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 25,
          neurotransmitters: {
            glutamate: 80 + Math.random() * 15,
            gaba: 40 + Math.random() * 35,
          },
        },
        temporalLobe: {
          name: "Temporal Lobe",
          function: "Auditory processing, language",
          activity: 50 + Math.random() * 40,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 22,
          neurotransmitters: {
            acetylcholine: 55 + Math.random() * 30,
            dopamine: 45 + Math.random() * 25,
          },
        },
        parietalLobe: {
          name: "Parietal Lobe",
          function: "Spatial processing, integration",
          activity: 55 + Math.random() * 30,
          status: "Active",
          oxygenConsumption: 0,
          maxOxygen: 20,
          neurotransmitters: {
            glutamate: 60 + Math.random() * 25,
            gaba: 50 + Math.random() * 25,
          },
        },
      },
    };

    // Initialize oxygen consumption
    for (var region in bio.brainActivity.regions) {
      var regionData = bio.brainActivity.regions[region];
      regionData.oxygenConsumption =
        (regionData.activity / 100) * regionData.maxOxygen;
    }
  };

  Window_BiologicSimulation.prototype.updateLeyVeinsActivity = function (bio) {
    // Ley veins fluctuate with magical energy
    var mpRatio = this._actor.mp / this._actor.mmp;
    bio.leyVeins.flow =
      Math.floor(mpRatio * 100) + Math.floor((Math.random() - 0.5) * 10);
    bio.leyVeins.flow = Math.max(0, Math.min(150, bio.leyVeins.flow));

    // Meridians fluctuate slightly
    for (var meridian in bio.leyVeins.meridians) {
      var meridianData = bio.leyVeins.meridians[meridian];
      if (meridianData.status === "Normal") {
        meridianData.flow += (Math.random() - 0.5) * 5;
        meridianData.flow = Math.max(80, Math.min(120, meridianData.flow));

        if (meridianData.magicalActivity) {
          meridianData.magicalActivity += (Math.random() - 0.5) * 10;
          meridianData.magicalActivity = Math.max(
            90,
            Math.min(110, meridianData.magicalActivity)
          );
        }
      }
    }
  };
  Window_BiologicSimulation.prototype.updateCellularActivity = function (
    bio,
    hunger,
    sleep
  ) {
    if (!bio.cellularActivity) {
      bio.cellularActivity = {
        cellsDying: Math.floor(Math.random() * 100000) + 50000,
        cellsForming: Math.floor(Math.random() * 100000) + 60000,
        mitosisRate: Math.random() * 100,
        apoptosisRate: Math.random() * 100,
        totalCells: 37200000000000, // Approximate human cell count
      };
    }

    var activity = bio.cellularActivity;
    var healthMultiplier = (hunger + sleep) / 200; // 0-1 scale

    // Cells forming (mitosis)
    var baseFormation = 100000 * healthMultiplier;
    activity.cellsForming = Math.floor(
      baseFormation * (0.8 + Math.random() * 0.4)
    );

    // Cells dying (apoptosis)
    var baseDeath = 80000 * (2 - healthMultiplier); // Dies more when unhealthy
    activity.cellsDying = Math.floor(baseDeath * (0.8 + Math.random() * 0.4));

    // Update rates
    activity.mitosisRate =
      (activity.cellsForming / activity.totalCells) * 100000000;
    activity.apoptosisRate =
      (activity.cellsDying / activity.totalCells) * 100000000;

    // Net change in cell count
    var netChange = activity.cellsForming - activity.cellsDying;
    activity.totalCells = Math.max(
      30000000000000,
      activity.totalCells + netChange
    );
  };

  Window_BiologicSimulation.prototype.updateImmuneSystem = function (
    bio,
    hunger,
    sleep
  ) {
    // Immune system weakens with poor nutrition and sleep
    var immuneEfficiency = (hunger + sleep) / 200; // 0-1 scale

    // White blood cells fluctuate
    bio.immuneSystem.whiteBloodCells += (Math.random() - 0.5) * 500;
    var baseWBC = 7500 * immuneEfficiency;
    bio.immuneSystem.whiteBloodCells = Math.max(
      2000,
      Math.min(15000, baseWBC + (Math.random() - 0.5) * 2000)
    );

    // Antibodies fluctuate
    bio.immuneSystem.antibodies += (Math.random() - 0.5) * 50;
    var baseAntibodies = 1200 * immuneEfficiency;
    bio.immuneSystem.antibodies = Math.max(
      400,
      Math.min(2000, baseAntibodies + (Math.random() - 0.5) * 200)
    );

    // Cellular death and regeneration
    if (!bio.cellularActivity) {
      bio.cellularActivity = {
        cellsDying: 0,
        cellsForming: 0,
        mitosisRate: 0,
        apoptosisRate: 0,
      };
    }

    // Update cellular activity
    this.updateCellularActivity(bio, hunger, sleep);
  };

  Window_BiologicSimulation.prototype.initializeBiologicData = function () {
    if (!this._actor._biologicData) {
      this._actor._biologicData = {};

      // Initialize vital signs
      var baseHP = this._actor.mhp;
      var baseMP = this._actor.mmp;

      this._actor._biologicData.vitalSigns = {
        heartRate: 60 + Math.floor(Math.random() * 40), // 60-100 BPM
        bloodPressure: {
          systolic: 110 + Math.floor(Math.random() * 30), // 110-140
          diastolic: 70 + Math.floor(Math.random() * 20), // 70-90
        },
        bodyTemperature: 36.0 + Math.random() * 1.5, // 36.0-37.5°C
        oxygenSaturation: 95 + Math.floor(Math.random() * 5), // 95-100%
        nutrients: {
          calories: 1800 + Math.floor(Math.random() * 400), // 1800-2200
          protein: 50 + Math.floor(Math.random() * 30), // 50-80g
          carbs: 200 + Math.floor(Math.random() * 100), // 200-300g
          fats: 60 + Math.floor(Math.random() * 40), // 60-100g
          water: 2000 + Math.floor(Math.random() * 500), // 2000-2500ml
        },
        cortisol: 10 + Math.floor(Math.random() * 15), // 10-25 μg/dL
      };

      // Initialize hormones with gender consideration
      var currentGender = $gameVariables.value(38) || 0;
      this._actor._biologicData.hormones = {
        testosterone: this.getInitialTestosterone(currentGender),
        estrogen: this.getInitialEstrogen(currentGender),
        progesterone: this.getInitialProgesterone(currentGender),
        cortisol: 10 + Math.floor(Math.random() * 15),
        adrenaline: 20 + Math.floor(Math.random() * 30),
        insulin: 5 + Math.floor(Math.random() * 10),
        growth: 1 + Math.random() * 4,
        thyroid: 1.0 + Math.random() * 3.0,
      };

      // Initialize immune system
      this._actor._biologicData.immuneSystem = {
        whiteBloodCells: 4000 + Math.floor(Math.random() * 7000), // 4000-11000/μL
        antibodies: 700 + Math.floor(Math.random() * 900), // 700-1600 mg/dL
        viruses: [],
        bacteria: [],
        infections: this.checkForInfections(),
      };

      // Initialize ley veins (magical system)
      this._actor._biologicData.leyVeins = {
        flow: Math.floor((this._actor.mp / this._actor.mmp) * 100), // Based on current MP
        meridians: {
          head: { status: "Normal", flow: 100, blockage: 0 },
          heart: { status: "Normal", flow: 100, blockage: 0 },
          lungs: { status: "Normal", flow: 100, blockage: 0 },
          liver: { status: "Normal", flow: 100, blockage: 0 },
          kidneys: { status: "Normal", flow: 100, blockage: 0 },
          arms: { status: "Normal", flow: 100, blockage: 0 },
          legs: { status: "Normal", flow: 100, blockage: 0 },
        },
      };

      // Initialize brain activity
      this.initializeBrainActivity(this._actor._biologicData);

      // Set blood type based on character name
      this._actor._biologicData.bloodType = this.determineBloodType(
        this._actor.name()
      );

      this.updateLeyVeinsFromDamage();
    }
  };

  Window_BiologicSimulation.prototype.getInitialTestosterone = function (
    gender
  ) {
    if (gender === 0) {
      // Male
      return 300 + Math.floor(Math.random() * 700); // 300-1000 ng/dL
    } else if (gender === 1) {
      // Female
      return 15 + Math.floor(Math.random() * 55); // 15-70 ng/dL
    } else {
      // Non-binary
      return 150 + Math.floor(Math.random() * 400); // 150-550 ng/dL
    }
  };

  Window_BiologicSimulation.prototype.getInitialEstrogen = function (gender) {
    if (gender === 0) {
      // Male
      return 10 + Math.floor(Math.random() * 30); // 10-40 pg/mL
    } else if (gender === 1) {
      // Female
      return 30 + Math.floor(Math.random() * 370); // 30-400 pg/mL
    } else {
      // Non-binary
      return 50 + Math.floor(Math.random() * 200); // 50-250 pg/mL
    }
  };

  Window_BiologicSimulation.prototype.getInitialProgesterone = function (
    gender
  ) {
    if (gender === 0) {
      // Male
      return 0.1 + Math.random() * 0.4; // 0.1-0.5 ng/mL
    } else if (gender === 1) {
      // Female
      return 0.5 + Math.random() * 19.5; // 0.5-20 ng/mL
    } else {
      // Non-binary
      return 0.3 + Math.random() * 10; // 0.3-10.3 ng/mL
    }
  };

  Window_BiologicSimulation.prototype.determineBloodType = function (name) {
    // Use character name as seed for consistent blood type
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
    }

    var bloodTypes = [
      { type: "O+", rarity: "Common", percent: 37.4 },
      { type: "A+", rarity: "Common", percent: 35.7 },
      { type: "B+", rarity: "Common", percent: 8.5 },
      { type: "AB+", rarity: "Uncommon", percent: 3.4 },
      { type: "O-", rarity: "Uncommon", percent: 6.6 },
      { type: "A-", rarity: "Uncommon", percent: 6.3 },
      { type: "B-", rarity: "Rare", percent: 1.5 },
      { type: "AB-", rarity: "Rare", percent: 0.6 },
      { type: "Rh-null", rarity: "Ultra Rare", percent: 0.0001 },
      { type: "Duffy-", rarity: "Very Rare", percent: 0.01 },
      { type: "Diego(b-)", rarity: "Very Rare", percent: 0.001 },
      { type: "Kidd(b-)", rarity: "Very Rare", percent: 0.001 },
    ];

    // Weighted random selection based on rarity
    var rand = Math.abs(hash) % 10000;
    var cumulative = 0;

    for (var i = 0; i < bloodTypes.length; i++) {
      cumulative += bloodTypes[i].percent * 100;
      if (rand < cumulative) {
        return bloodTypes[i];
      }
    }

    return bloodTypes[0]; // Default to O+ if something goes wrong
  };

  Window_BiologicSimulation.prototype.checkForInfections = function () {
    var infections = [];

    // Check damaged body parts for potential infections
    if (this._actor._bodyParts) {
      for (var partKey in this._actor._bodyParts) {
        var part = this._actor._bodyParts[partKey];
        if (part.damaged) {
          // 30% chance of infection in damaged parts
          if (Math.random() < 0.3) {
            infections.push({
              location: part.name,
              type: Math.random() < 0.7 ? "Bacterial" : "Viral",
              severity: Math.floor(Math.random() * 3) + 1, // 1-3
            });
          }
        }
      }
    }

    return infections;
  };

  Window_BiologicSimulation.prototype.updateLeyVeinsFromDamage = function () {
    if (!this._actor._bodyParts || !this._actor._biologicData) return;

    var leyVeins = this._actor._biologicData.leyVeins;
    var mpRatio = this._actor.mp / this._actor.mmp;

    // Update overall flow based on MP
    leyVeins.flow = Math.floor(mpRatio * 100);

    // Check for blockages based on damaged body parts
    var meridianMap = {
      HEAD: "head",
      BRAIN: "head",
      HEART: "heart",
      LEFT_LUNG: "lungs",
      RIGHT_LUNG: "lungs",
      LIVER: "liver",
      LEFT_ARM: "arms",
      RIGHT_ARM: "arms",
      LEFT_LEG: "legs",
      RIGHT_LEG: "legs",
    };

    for (var partKey in this._actor._bodyParts) {
      var part = this._actor._bodyParts[partKey];
      var meridian = meridianMap[partKey];

      if (meridian && leyVeins.meridians[meridian]) {
        if (part.damaged) {
          leyVeins.meridians[meridian].blockage =
            70 + Math.floor(Math.random() * 30); // 70-100% blocked
          leyVeins.meridians[meridian].flow = Math.max(
            0,
            100 - leyVeins.meridians[meridian].blockage
          );
          leyVeins.meridians[meridian].status = "Blocked";
        } else if (part.currentHp < part.maxHp * 0.5) {
          leyVeins.meridians[meridian].blockage =
            20 + Math.floor(Math.random() * 30); // 20-50% blocked
          leyVeins.meridians[meridian].flow = Math.max(
            0,
            100 - leyVeins.meridians[meridian].blockage
          );
          leyVeins.meridians[meridian].status = "Restricted";
        } else {
          leyVeins.meridians[meridian].blockage = 0;
          leyVeins.meridians[meridian].flow = 100;
          leyVeins.meridians[meridian].status = "Normal";
        }
      }
    }
  };

  Window_BiologicSimulation.prototype.updateGenderFromHormones = function () {
    if (!this._actor._biologicData) return;

    var hormones = this._actor._biologicData.hormones;
    var testosterone = hormones.testosterone;
    var estrogen = hormones.estrogen;

    // Normalize hormone levels to comparable scales
    var testosteroneNorm = testosterone / 1000; // Max ~1000 ng/dL
    var estrogenNorm = estrogen / 400; // Max ~400 pg/mL

    var difference = Math.abs(testosteroneNorm - estrogenNorm);
    var average = (testosteroneNorm + estrogenNorm) / 2;
    var tolerance = average * 0.1; // 10% tolerance

    var currentGender = $gameVariables.value(38);
    var newGender = currentGender;

    if (difference <= tolerance) {
      // Balanced hormones = non-binary
      newGender = 2;
    } else if (testosteroneNorm > estrogenNorm) {
      // Higher testosterone = male
      newGender = 0;
    } else {
      // Higher estrogen = female
      newGender = 1;
    }

    if (newGender !== currentGender) {
      $gameVariables.setValue(38, newGender);
      var genderNames = ["male", "female", "non-binary"];
      var genderNames_it = ["maschio", "femmina", "non-binario"];
      var genderName =
        ConfigManager.language === "it"
          ? genderNames_it[newGender]
          : genderNames[newGender];

      var message =
        ConfigManager.language === "it"
          ? "I tuoi ormoni hanno causato un cambio di genere in " +
            genderName +
            "!"
          : "Your hormones have caused a gender change to " + genderName + "!";
      $gameMessage.add(message);
    }
  };

  Window_BiologicSimulation.prototype.maxItems = function () {
    return this._categories.length;
  };

  Window_BiologicSimulation.prototype.refresh = function () {
    this.contents.clear();

    if (!this._actor) return;

    this.initializeBiologicData();
    this.updateLeyVeinsFromDamage();
    this.updateGenderFromHormones();

    var lineHeight = this.lineHeight();

    // Draw actor name and current category
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.drawActorName(this._actor, 6, 0, 200);
    } else {
      this.drawActorName(this._actor, 6, 0);
    }

    var categoryName =
      ConfigManager.language === "it"
        ? this._categories[this._category].name_it
        : this._categories[this._category].name;
    this.drawText("Category: " + categoryName, 220, 0, 300);

    // Draw hunger and sleep status
    var hungerRate = $gameVariables.value(54) || 50;
    var sleepRate = $gameVariables.value(55) || 50;
    var hungerText = "Hunger: " + hungerRate + "%";
    var sleepText = "Sleep: " + sleepRate + "%";
    this.drawText(hungerText, 520, 0, 150);
    this.drawText(sleepText, 680, 0, 150);

    // Draw blood type
    var bloodType = this._actor._biologicData.bloodType;
    var bloodText =
      "Blood Type: " + bloodType.type + " (" + bloodType.rarity + ")";
    this.drawText(bloodText, 6, lineHeight, 400);

    this.drawHorzLine(lineHeight * 2);

    // Draw category-specific data
    var startY = lineHeight * 3;

    switch (this._category) {
      case 0:
        this.drawVitalSigns(startY);
        break;
      case 1:
        this.drawHormones(startY);
        break;
      case 2:
        this.drawImmuneSystem(startY);
        break;
      case 3:
        this.drawLeyVeins(startY);
        break;
      case 4:
        this.drawBrainActivity(startY);
        break;
    }

    // Instructions at the bottom
    var bottomY = this.contents.height - lineHeight * 2;
    if (this._category === 4) {
      // Brain Activity tab
      instructionText = getTranslatedText(
        "↑↓: Scroll   ←→: Change Category   ESC: Exit",
        "↑↓: Scorri   ←→: Cambia Categoria   ESC: Esci"
      );
    } else if (this._category === 0) {
      // Vital Signs tab
      instructionText = getTranslatedText(
        "↑↓: Scroll   ←→: Change Category   ESC: Exit",
        "↑↓: Scorri   ←→: Cambia Categoria   ESC: Esci"
      );
    } else {
      instructionText = getTranslatedText(
        "←→: Change Category   ESC: Exit",
        "←→: Cambia Categoria   ESC: Esci"
      );
    }

    this.drawText(instructionText, 6, bottomY, this.contents.width - 12);
  };
  Window_BiologicSimulation.prototype.drawVitalSigns = function (startY) {
    var data = this._actor._biologicData.vitalSigns;
    var cellular = this._actor._biologicData.cellularActivity;
    var y = startY - this._vitalScrollY; // Apply scroll offset
    var lineHeight = this.lineHeight();
    var contentHeight = this.contents.height - startY - lineHeight * 2; // Reserve space for instructions
    var visibleAreaTop = startY;
    var visibleAreaBottom = visibleAreaTop + contentHeight;

    // Calculate total content height for scrolling
    var tempY = startY;

    // Basic vital signs (5 lines)
    tempY += lineHeight * 7; // 5 + 2 spacing

    // Cellular Activity section (7 lines if exists)
    if (cellular) {
      tempY += lineHeight * 8; // Title + 5 data lines + 2 spacing
    }

    // Nutrients section (7 lines)
    tempY += lineHeight * 8; // Title + 5 nutrients + 2 spacing

    // Additional detailed vital signs
    tempY += lineHeight * 15; // Extended vital signs data

    this._maxVitalScroll = Math.max(0, tempY - visibleAreaBottom);

    // Helper function to check if line is visible
    var isLineVisible = function (lineY) {
      return (
        lineY >= visibleAreaTop - lineHeight &&
        lineY <= visibleAreaBottom + lineHeight
      );
    };

    // Basic Vital Signs
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Basic Vital Signs:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Heart Rate: " + Math.floor(data.heartRate) + " BPM",
        20,
        y,
        300
      );
      var hrStatus =
        data.heartRate < 60
          ? "Bradycardia"
          : data.heartRate > 100
          ? "Tachycardia"
          : "Normal";
      var hrColor =
        data.heartRate < 60 || data.heartRate > 100
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(hrColor);
      this.drawText("(" + hrStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Blood Pressure: " +
          Math.floor(data.bloodPressure.systolic) +
          "/" +
          Math.floor(data.bloodPressure.diastolic),
        20,
        y,
        300
      );
      var bpStatus =
        data.bloodPressure.systolic > 140
          ? "Hypertension"
          : data.bloodPressure.systolic < 90
          ? "Hypotension"
          : "Normal";
      var bpColor =
        bpStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(bpColor);
      this.drawText("(" + bpStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Body Temperature: " + data.bodyTemperature.toFixed(1) + "°C",
        20,
        y,
        300
      );
      var tempStatus =
        data.bodyTemperature > 37.5
          ? "Fever"
          : data.bodyTemperature < 36.0
          ? "Hypothermia"
          : "Normal";
      var tempColor =
        tempStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(tempColor);
      this.drawText("(" + tempStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Oxygen Saturation: " + Math.floor(data.oxygenSaturation) + "%",
        20,
        y,
        300
      );
      var o2Status = data.oxygenSaturation < 95 ? "Low" : "Normal";
      var o2Color =
        o2Status !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(o2Color);
      this.drawText("(" + o2Status + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Cortisol: " + Math.floor(data.cortisol) + " μg/dL",
        20,
        y,
        300
      );
      var cortisolStatus =
        data.cortisol > 25
          ? "High Stress"
          : data.cortisol < 10
          ? "Low"
          : "Normal";
      var cortisolColor =
        cortisolStatus === "High Stress"
          ? this.textColor(2)
          : cortisolStatus === "Low"
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(cortisolColor);
      this.drawText("(" + cortisolStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight * 2;

    // Additional Vital Parameters
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Extended Vital Parameters:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    // Calculate respiratory rate based on heart rate
    var respiratoryRate =
      Math.floor(data.heartRate / 4) + Math.floor(Math.random() * 4);
    if (isLineVisible(y)) {
      this.drawText(
        "Respiratory Rate: " + respiratoryRate + " breaths/min",
        20,
        y,
        300
      );
      var respStatus =
        respiratoryRate > 20 ? "High" : respiratoryRate < 12 ? "Low" : "Normal";
      var respColor =
        respStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(respColor);
      this.drawText("(" + respStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Blood pH estimation
    var bloodPH = 7.4 + (Math.random() - 0.5) * 0.1;
    if (isLineVisible(y)) {
      this.drawText("Blood pH: " + bloodPH.toFixed(2), 20, y, 300);
      var pHStatus =
        bloodPH < 7.35 ? "Acidic" : bloodPH > 7.45 ? "Alkaline" : "Normal";
      var pHColor =
        pHStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(pHColor);
      this.drawText("(" + pHStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Blood glucose estimation based on nutrients
    var bloodGlucose =
      90 +
      Math.floor((data.nutrients.carbs / 300) * 50) +
      Math.floor(Math.random() * 20);
    if (isLineVisible(y)) {
      this.drawText("Blood Glucose: " + bloodGlucose + " mg/dL", 20, y, 300);
      var glucoseStatus =
        bloodGlucose > 140 ? "High" : bloodGlucose < 70 ? "Low" : "Normal";
      var glucoseColor =
        glucoseStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(glucoseColor);
      this.drawText("(" + glucoseStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Hydration status
    var hydrationPercent = Math.floor((data.nutrients.water / 2500) * 100);
    if (isLineVisible(y)) {
      this.drawText("Hydration Level: " + hydrationPercent + "%", 20, y, 300);
      var hydrationStatus =
        hydrationPercent < 70
          ? "Dehydrated"
          : hydrationPercent > 100
          ? "Overhydrated"
          : "Normal";
      var hydrationColor =
        hydrationStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(hydrationColor);
      this.drawText("(" + hydrationStatus + ")", 320, y, 150);
      this.resetTextColor();
    }
    y += lineHeight * 2;

    // Cellular Activity
    if (cellular) {
      if (isLineVisible(y)) {
        this.changeTextColor(this.systemColor());
        this.drawText("Cellular Activity:", 6, y, 200);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Cells Forming: " + cellular.cellsForming.toLocaleString() + "/sec",
          20,
          y,
          300
        );
        var formationRate =
          cellular.cellsForming > 120000
            ? "High"
            : cellular.cellsForming < 80000
            ? "Low"
            : "Normal";
        var formationColor =
          formationRate === "Low"
            ? this.textColor(18)
            : formationRate === "High"
            ? this.textColor(3)
            : this.normalColor();
        this.changeTextColor(formationColor);
        this.drawText("(" + formationRate + ")", 320, y, 150);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Cells Dying: " + cellular.cellsDying.toLocaleString() + "/sec",
          20,
          y,
          300
        );
        var deathRate =
          cellular.cellsDying > 100000
            ? "High"
            : cellular.cellsDying < 60000
            ? "Low"
            : "Normal";
        var deathColor =
          deathRate === "High"
            ? this.textColor(2)
            : deathRate === "Low"
            ? this.textColor(3)
            : this.normalColor();
        this.changeTextColor(deathColor);
        this.drawText("(" + deathRate + ")", 320, y, 150);
        this.resetTextColor();
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Net Cell Change: " +
            (cellular.cellsForming - cellular.cellsDying).toLocaleString() +
            "/sec",
          20,
          y,
          400
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Mitosis Rate: " + cellular.mitosisRate.toFixed(3) + "%",
          20,
          y,
          300
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Apoptosis Rate: " + cellular.apoptosisRate.toFixed(3) + "%",
          20,
          y,
          300
        );
      }
      y += lineHeight;

      if (isLineVisible(y)) {
        this.drawText(
          "Total Cells: " + cellular.totalCells.toExponential(2),
          20,
          y,
          300
        );
      }
      y += lineHeight * 2;
    }

    // Nutrients
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Nutritional Status:", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Calories: " + Math.floor(data.nutrients.calories) + " kcal",
        20,
        y,
        250
      );
      var calStatus =
        data.nutrients.calories < 1500
          ? "Deficit"
          : data.nutrients.calories > 2500
          ? "Surplus"
          : "Normal";
      var calColor =
        calStatus === "Deficit"
          ? this.textColor(2)
          : calStatus === "Surplus"
          ? this.textColor(18)
          : this.textColor(3);
      this.changeTextColor(calColor);
      this.drawText("(" + calStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Protein: " + Math.floor(data.nutrients.protein) + "g",
        20,
        y,
        250
      );
      var proteinStatus =
        data.nutrients.protein < 40
          ? "Low"
          : data.nutrients.protein > 100
          ? "High"
          : "Normal";
      var proteinColor =
        proteinStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(proteinColor);
      this.drawText("(" + proteinStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Carbohydrates: " + Math.floor(data.nutrients.carbs) + "g",
        20,
        y,
        250
      );
      var carbStatus =
        data.nutrients.carbs < 150
          ? "Low"
          : data.nutrients.carbs > 350
          ? "High"
          : "Normal";
      var carbColor =
        carbStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(carbColor);
      this.drawText("(" + carbStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Fats: " + Math.floor(data.nutrients.fats) + "g",
        20,
        y,
        250
      );
      var fatStatus =
        data.nutrients.fats < 40
          ? "Low"
          : data.nutrients.fats > 120
          ? "High"
          : "Normal";
      var fatColor =
        fatStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(fatColor);
      this.drawText("(" + fatStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Water: " + Math.floor(data.nutrients.water) + "ml",
        20,
        y,
        250
      );
      var waterStatus =
        data.nutrients.water < 1800
          ? "Low"
          : data.nutrients.water > 3000
          ? "High"
          : "Normal";
      var waterColor =
        waterStatus !== "Normal" ? this.textColor(18) : this.textColor(3);
      this.changeTextColor(waterColor);
      this.drawText("(" + waterStatus + ")", 270, y, 150);
      this.resetTextColor();
    }
    y += lineHeight;

    // Draw scroll indicator if needed
    if (this._maxVitalScroll > 0) {
      var scrollPercent = this._vitalScrollY / this._maxVitalScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(
        10,
        contentHeight * (contentHeight / (contentHeight + this._maxVitalScroll))
      );

      this.contents.fillRect(
        this.contents.width - 8,
        indicatorY,
        4,
        indicatorHeight,
        this.textColor(7)
      );
    }
  };
  Window_BiologicSimulation.prototype.drawBrainActivity = function (startY) {
    var brain = this._actor._biologicData.brainActivity;
    if (!brain) return;

    var y = startY - this._brainScrollY; // Apply scroll offset
    var lineHeight = this.lineHeight();
    var contentHeight = this.contents.height - startY - lineHeight * 2; // Reserve space for instructions
    var visibleAreaTop = startY;
    var visibleAreaBottom = visibleAreaTop + contentHeight;
    var totalContentHeight = 0;

    // Calculate total content height for scrolling
    var tempY = startY;

    // Overall brain stats (4 lines)
    tempY += lineHeight * 4;

    // Brain waves section (7 lines: title + 3 wave pairs + gamma)
    tempY += lineHeight * 7;

    // Brain regions section
    tempY += lineHeight * 2; // Title + spacing

    // Sort regions by activity for display
    var regionArray = [];
    for (var regionKey in brain.regions) {
      var region = brain.regions[regionKey];
      regionArray.push({
        key: regionKey,
        name: region.name,
        activity: region.activity,
        status: region.status,
        function: region.function,
        oxygen: region.oxygenConsumption,
        neurotransmitters: region.neurotransmitters,
      });
    }
    regionArray.sort(function (a, b) {
      return b.activity - a.activity;
    });

    // Each region takes 3 lines (name/status, function, neurotransmitters)
    tempY += regionArray.length * lineHeight * 3;

    // Neurotransmitter summary section
    tempY += lineHeight * 8; // Title + 6 neurotransmitters + spacing

    this._maxBrainScroll = Math.max(0, tempY - visibleAreaBottom);

    // Helper function to check if line is visible
    var isLineVisible = function (lineY) {
      return (
        lineY >= visibleAreaTop - lineHeight &&
        lineY <= visibleAreaBottom + lineHeight
      );
    };

    // Draw content only if visible

    // Overall brain stats
    if (isLineVisible(y)) {
      this.changeTextColor(this.textColor(3)); // Yellow for brain activity
      this.drawText(
        "Overall Activity: " + Math.floor(brain.overallActivity) + "%",
        6,
        y,
        300
      );
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Active Regions: " + brain.activeRegions + "/" + brain.totalRegions,
        6,
        y,
        300
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Neurons Firing: " + brain.neurons.firing.toLocaleString() + "/sec",
        6,
        y,
        400
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Total Connections: " + brain.neurons.connections.toExponential(2),
        6,
        y,
        400
      );
    }
    y += lineHeight * 2;

    // Brain waves
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Brain Waves (Hz):", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Alpha (8-13): " + brain.waves.alpha.toFixed(1),
        20,
        y,
        200
      );
      this.drawText(
        "Beta (13-30): " + brain.waves.beta.toFixed(1),
        250,
        y,
        200
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText("Theta (4-8): " + brain.waves.theta.toFixed(1), 20, y, 200);
      this.drawText(
        "Delta (0.5-4): " + brain.waves.delta.toFixed(1),
        250,
        y,
        200
      );
    }
    y += lineHeight;

    if (isLineVisible(y)) {
      this.drawText(
        "Gamma (30-100): " + brain.waves.gamma.toFixed(1),
        20,
        y,
        200
      );
    }
    y += lineHeight * 2;

    // Brain regions
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Brain Regions (Detailed):", 6, y, 200);
      this.resetTextColor();
    }
    y += lineHeight;

    for (var i = 0; i < regionArray.length; i++) {
      var region = regionArray[i];
      var statusColor = this.normalColor();

      if (region.status === "Highly Active") {
        statusColor = this.textColor(3); // Yellow
      } else if (region.status === "Active") {
        statusColor = this.textColor(23); // Light blue
      } else if (
        region.status === "Low Activity" ||
        region.status === "Minimal"
      ) {
        statusColor = this.textColor(18); // Orange/Red
      }

      // Region name and status
      if (isLineVisible(y)) {
        this.drawText(region.name + ":", 20, y, 180);
        this.changeTextColor(statusColor);
        this.drawText(
          Math.floor(region.activity) + "% " + region.status,
          210,
          y,
          150
        );
        this.resetTextColor();
        this.drawText("O₂: " + region.oxygen.toFixed(1), 370, y, 80);
      }
      y += lineHeight;

      // Function description
      if (isLineVisible(y)) {
        this.drawText("  Function: " + region.function, 30, y, 400);
      }
      y += lineHeight;

      // Neurotransmitters for this region
      if (isLineVisible(y)) {
        var ntText = "  NT: ";
        var ntArray = [];
        for (var nt in region.neurotransmitters) {
          ntArray.push(
            nt.charAt(0).toUpperCase() +
              nt.slice(1) +
              ": " +
              Math.floor(region.neurotransmitters[nt])
          );
        }
        ntText += ntArray.join(", ");
        this.changeTextColor(this.textColor(6)); // Light gray
        this.drawText(ntText, 30, y, 500);
        this.resetTextColor();
      }
      y += lineHeight;
    }

    y += lineHeight;

    // Overall neurotransmitter summary
    if (isLineVisible(y)) {
      this.changeTextColor(this.systemColor());
      this.drawText("Overall Neurotransmitter Levels:", 6, y, 300);
      this.resetTextColor();
    }
    y += lineHeight;

    // Calculate average neurotransmitter levels across all regions
    var avgNeurotransmitters = {
      dopamine: 0,
      serotonin: 0,
      norepinephrine: 0,
      acetylcholine: 0,
      gaba: 0,
      glutamate: 0,
    };
    var ntCounts = {};

    for (var regionKey in brain.regions) {
      var region = brain.regions[regionKey];
      for (var nt in region.neurotransmitters) {
        if (avgNeurotransmitters.hasOwnProperty(nt)) {
          avgNeurotransmitters[nt] += region.neurotransmitters[nt];
          ntCounts[nt] = (ntCounts[nt] || 0) + 1;
        }
      }
    }

    // Calculate averages
    for (var nt in avgNeurotransmitters) {
      if (ntCounts[nt] > 0) {
        avgNeurotransmitters[nt] = avgNeurotransmitters[nt] / ntCounts[nt];
      }
    }

    // Display neurotransmitter averages
    var ntDisplayNames = {
      dopamine: "Dopamine",
      serotonin: "Serotonin",
      norepinephrine: "Norepinephrine",
      acetylcholine: "Acetylcholine",
      gaba: "GABA",
      glutamate: "Glutamate",
    };

    var ntPairs = [
      ["dopamine", "serotonin"],
      ["norepinephrine", "acetylcholine"],
      ["gaba", "glutamate"],
    ];

    for (var i = 0; i < ntPairs.length; i++) {
      if (isLineVisible(y)) {
        var nt1 = ntPairs[i][0];
        var nt2 = ntPairs[i][1];
        this.drawText(
          ntDisplayNames[nt1] + ": " + Math.floor(avgNeurotransmitters[nt1]),
          20,
          y,
          200
        );
        this.drawText(
          ntDisplayNames[nt2] + ": " + Math.floor(avgNeurotransmitters[nt2]),
          250,
          y,
          200
        );
      }
      y += lineHeight;
    }

    // Draw scroll indicator if needed
    if (this._maxBrainScroll > 0) {
      var scrollPercent = this._brainScrollY / this._maxBrainScroll;
      var indicatorY = visibleAreaTop + contentHeight * scrollPercent;
      var indicatorHeight = Math.max(
        10,
        contentHeight * (contentHeight / (contentHeight + this._maxBrainScroll))
      );

      this.contents.fillRect(
        this.contents.width - 8,
        indicatorY,
        4,
        indicatorHeight,
        this.textColor(7)
      );
    }
  };
  Window_BiologicSimulation.prototype.drawHormones = function (startY) {
    var data = this._actor._biologicData.hormones;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.changeTextColor(this.systemColor());
    this.drawText("Sex Hormones:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    this.drawText(
      "Testosterone: " + Math.floor(data.testosterone) + " ng/dL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Estrogen: " + Math.floor(data.estrogen) + " pg/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Progesterone: " + data.progesterone.toFixed(2) + " ng/mL",
      20,
      y,
      300
    );
    y += lineHeight * 2;

    this.changeTextColor(this.systemColor());
    this.drawText("Other Hormones:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    this.drawText(
      "Cortisol: " + Math.floor(data.cortisol) + " μg/dL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Adrenaline: " + Math.floor(data.adrenaline) + " pg/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Insulin: " + Math.floor(data.insulin) + " mIU/L",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Growth Hormone: " + data.growth.toFixed(2) + " ng/mL",
      20,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Thyroid (TSH): " + data.thyroid.toFixed(2) + " mIU/L",
      20,
      y,
      300
    );

    // Show current gender based on hormones
    var currentGender = $gameVariables.value(38);
    var genderNames = ["Male", "Female", "Non-Binary"];
    var genderNames_it = ["Maschio", "Femmina", "Non-Binario"];
    var genderName =
      ConfigManager.language === "it"
        ? genderNames_it[currentGender]
        : genderNames[currentGender];

    y += lineHeight * 2;
    this.changeTextColor(this.textColor(3));
    this.drawText("Current Gender: " + genderName, 6, y, 300);
    this.resetTextColor();
  };

  Window_BiologicSimulation.prototype.drawImmuneSystem = function (startY) {
    var data = this._actor._biologicData.immuneSystem;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.drawText(
      "White Blood Cells: " + Math.floor(data.whiteBloodCells) + "/μL",
      6,
      y,
      300
    );
    y += lineHeight;

    this.drawText(
      "Antibodies: " + Math.floor(data.antibodies) + " mg/dL",
      6,
      y,
      300
    );
    y += lineHeight * 2;

    // Active Infections
    this.changeTextColor(this.systemColor());
    this.drawText("Active Infections:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.infections.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < data.infections.length; i++) {
        var infection = data.infections[i];
        var severityText = ["Mild", "Moderate", "Severe"][
          infection.severity - 1
        ];
        var text =
          infection.location +
          ": " +
          infection.type +
          " (" +
          severityText +
          ")";

        if (infection.severity >= 2) {
          this.changeTextColor(this.textColor(2)); // Red for moderate/severe
        }

        this.drawText(text, 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Viruses
    this.changeTextColor(this.systemColor());
    this.drawText("Active Viruses:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.viruses.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < Math.min(data.viruses.length, 5); i++) {
        var virus = data.viruses[i];
        var typeColor =
          virus.type === "Pathogenic"
            ? this.textColor(2)
            : virus.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(virus.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(
          virus.type + " (" + virus.count.toLocaleString() + ")",
          230,
          y,
          200
        );
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.viruses.length > 5) {
        this.drawText(
          "... and " + (data.viruses.length - 5) + " more",
          20,
          y,
          200
        );
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Bacteria
    this.changeTextColor(this.systemColor());
    this.drawText("Active Bacteria:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.bacteria.length === 0) {
      this.drawText("None detected", 20, y, 300);
    } else {
      for (var i = 0; i < Math.min(data.bacteria.length, 5); i++) {
        var bacteria = data.bacteria[i];
        var typeColor =
          bacteria.type === "Pathogenic"
            ? this.textColor(2)
            : bacteria.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(bacteria.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(
          bacteria.type + " (" + bacteria.count.toLocaleString() + ")",
          230,
          y,
          200
        );
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.bacteria.length > 5) {
        this.drawText(
          "... and " + (data.bacteria.length - 5) + " more",
          20,
          y,
          200
        );
      }
    }
  };

  Window_BiologicSimulation.prototype.drawLeyVeins = function (startY) {
    var data = this._actor._biologicData.leyVeins;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.changeTextColor(this.textColor(3)); // Yellow for magical
    this.drawText(
      "Overall Mana Flow: " + Math.floor(data.flow) + "%",
      6,
      y,
      300
    );
    this.resetTextColor();
    y += lineHeight * 2;

    this.changeTextColor(this.systemColor());
    this.drawText("Meridian Status:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    for (var meridian in data.meridians) {
      var meridianData = data.meridians[meridian];
      var statusColor = this.normalColor();

      if (meridianData.status === "Blocked") {
        statusColor = this.textColor(2); // Red
      } else if (meridianData.status === "Restricted") {
        statusColor = this.textColor(17); // Orange
      } else {
        statusColor = this.textColor(3); // Green
      }

      var capitalizedMeridian =
        meridian.charAt(0).toUpperCase() + meridian.slice(1);
      this.drawText(capitalizedMeridian + ":", 20, y, 100);

      this.changeTextColor(statusColor);
      this.drawText(
        meridianData.status + " (" + Math.floor(meridianData.flow) + "%)",
        130,
        y,
        200
      );
      this.resetTextColor();

      if (meridianData.blockage > 0) {
        this.drawText(
          "Blockage: " + Math.floor(meridianData.blockage) + "%",
          300,
          y,
          150
        );
      }

      if (meridianData.magicalActivity) {
        this.changeTextColor(this.textColor(3));
        this.drawText(
          "Activity: " + Math.floor(meridianData.magicalActivity) + "%",
          450,
          y,
          100
        );
        this.resetTextColor();
      }

      y += lineHeight;
    }

    // Show special resonances
    var specialResonances = [];
    if (data.resonance)
      specialResonances.push("Magic Reflection: " + data.resonance);
    if (data.divineResonance)
      specialResonances.push("Divine: " + data.divineResonance);
    if (data.shadowResonance)
      specialResonances.push("Shadow: " + data.shadowResonance);
    if (data.etherealResonance)
      specialResonances.push("Ethereal: " + data.etherealResonance);
    if (data.lifeResonance)
      specialResonances.push("Life: " + data.lifeResonance);
    if (data.levitationResonance)
      specialResonances.push("Levitation: " + data.levitationResonance);
    if (data.invisibilityResonance)
      specialResonances.push("Invisibility: " + data.invisibilityResonance);
    if (data.electricalActivity)
      specialResonances.push("Electrical: " + data.electricalActivity);

    if (specialResonances.length > 0) {
      y += lineHeight;
      this.changeTextColor(this.systemColor());
      this.drawText("Special Resonances:", 6, y, 200);
      this.resetTextColor();
      y += lineHeight;

      for (var i = 0; i < specialResonances.length; i++) {
        this.changeTextColor(this.textColor(3)); // Yellow for special effects
        this.drawText(specialResonances[i], 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }
  };

  Window_BiologicSimulation.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    var color =
      Utils.RPGMAKER_NAME === "MZ"
        ? ColorManager.normalColor()
        : this.normalColor();
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, color);
    this.contents.paintOpacity = 255;
  };

  Window_BiologicSimulation.prototype.cursorRight = function (wrap) {
    this._brainScrollY = 0; // Reset brain scroll
    this._vitalScrollY = 0; // Reset vital scroll
    this._category = (this._category + 1) % this._categories.length;
    this.refresh();
  };

  Window_BiologicSimulation.prototype.cursorLeft = function (wrap) {
    this._brainScrollY = 0; // Reset brain scroll
    this._vitalScrollY = 0; // Reset vital scroll
    this._category =
      (this._category - 1 + this._categories.length) % this._categories.length;
    this.refresh();
  };

  Window_BiologicSimulation.prototype.processCancel = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      Window_StatusBase.prototype.processCancel.call(this);
    } else {
      Window_Selectable.prototype.processCancel.call(this);
    }
    SceneManager.pop();
  };

  // Helper methods for color compatibility
  Window_BiologicSimulation.prototype.systemColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.systemColor()
      : Window_Base.prototype.systemColor.call(this);
  };

  Window_BiologicSimulation.prototype.normalColor = function () {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.normalColor()
      : Window_Base.prototype.normalColor.call(this);
  };

  Window_BiologicSimulation.prototype.textColor = function (n) {
    return Utils.RPGMAKER_NAME === "MZ"
      ? ColorManager.textColor(n)
      : Window_Base.prototype.textColor.call(this, n);
  };

  Window_BiologicSimulation.prototype.resetTextColor = function () {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.changeTextColor(ColorManager.normalColor());
    } else {
      Window_Base.prototype.resetTextColor.call(this);
    }
  };

  Window_BiologicSimulation.prototype.changeTextColor = function (color) {
    if (Utils.RPGMAKER_NAME === "MZ") {
      this.contents.textColor = color;
    } else {
      Window_Base.prototype.changeTextColor.call(this, color);
    }
  };

  // Add compatibility methods for MV if running in MZ
  if (Utils.RPGMAKER_NAME === "MZ") {
    if (!Window_BiologicSimulation.prototype.drawActorName) {
      Window_BiologicSimulation.prototype.drawActorName = function (
        actor,
        x,
        y,
        width
      ) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
      };
    }
  }

  // ****************************************************
  // Biologic Simulation Scene
  function Scene_BiologicSimulation() {
    this.initialize(...arguments);
  }

  Scene_BiologicSimulation.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_BiologicSimulation.prototype.constructor = Scene_BiologicSimulation;

  Scene_BiologicSimulation.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_BiologicSimulation.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBiologicWindow();
  };

  Scene_BiologicSimulation.prototype.createBiologicWindow = function () {
    this._biologicWindow = new Window_BiologicSimulation();
    this._biologicWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._biologicWindow);
  };
  // Add this after the biologic simulation system code

  // State Reaction System for Biologic Simulation
  Window_BiologicSimulation.prototype.applyStateReactions = function () {
    if (!this._actor || !this._actor._biologicData) return;

    var states = this._actor._states;
    var bio = this._actor._biologicData;

    // Reset to base values first
    this.resetBiologicToBase();

    // Apply state effects
    for (var i = 0; i < states.length; i++) {
      var stateId = states[i];
      this.applyStateEffect(stateId, bio);
    }
  };

  Window_BiologicSimulation.prototype.resetBiologicToBase = function () {
    var bio = this._actor._biologicData;

    // Reset vital signs to normal ranges
    bio.vitalSigns.heartRate = Math.max(
      60,
      Math.min(100, bio.vitalSigns.heartRate)
    );
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      110,
      Math.min(140, bio.vitalSigns.bloodPressure.systolic)
    );
    bio.vitalSigns.bodyTemperature = Math.max(
      36.0,
      Math.min(37.5, bio.vitalSigns.bodyTemperature)
    );
    bio.vitalSigns.cortisol = Math.max(
      10,
      Math.min(25, bio.vitalSigns.cortisol)
    );

    // Reset immune system
    bio.immuneSystem.whiteBloodCells = Math.max(
      4000,
      Math.min(11000, bio.immuneSystem.whiteBloodCells)
    );
    bio.immuneSystem.antibodies = Math.max(
      700,
      Math.min(1600, bio.immuneSystem.antibodies)
    );

    // Clear temporary infections and pathogens
    bio.immuneSystem.viruses = bio.immuneSystem.viruses.filter(function (v) {
      return !v.temporary;
    });
    bio.immuneSystem.bacteria = bio.immuneSystem.bacteria.filter(function (b) {
      return !b.temporary;
    });

    // Reset ley vein activity to normal
    for (var meridian in bio.leyVeins.meridians) {
      if (bio.leyVeins.meridians[meridian].status === "Normal") {
        bio.leyVeins.meridians[meridian].magicalActivity = 100;
      }
    }

    // Reset brain activity to normal
    if (bio.brainActivity) {
      for (var region in bio.brainActivity.regions) {
        var regionData = bio.brainActivity.regions[region];
        if (regionData.normalActivity) {
          regionData.activity = regionData.normalActivity;
        }
      }
    }
  };

  Window_BiologicSimulation.prototype.applyStateEffect = function (
    stateId,
    bio
  ) {
    switch (stateId) {
      case 1: // Dead
        bio.vitalSigns.heartRate = 0;
        bio.vitalSigns.bloodPressure.systolic = 0;
        bio.vitalSigns.bloodPressure.diastolic = 0;
        bio.vitalSigns.bodyTemperature = 20.0;
        bio.vitalSigns.oxygenSaturation = 0;
        bio.immuneSystem.whiteBloodCells = 0;
        if (bio.brainActivity) {
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity = 0;
          }
          bio.brainActivity.neurons.firing = 0;
          bio.brainActivity.overallActivity = 0;
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = 0;
        }
        break;

      case 2: // Guard
        bio.immuneSystem.whiteBloodCells += 2000;
        bio.immuneSystem.antibodies += 300;
        bio.vitalSigns.cortisol += 5;
        bio.hormones.adrenaline += 10;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity += 20;
          bio.brainActivity.regions.sensoryCortex.activity += 15;
        }
        break;

      case 3: // Immortal
        bio.vitalSigns.heartRate = 45; // Slow, efficient heartbeat
        bio.hormones.growth += 2;
        bio.immuneSystem.whiteBloodCells += 5000;
        bio.immuneSystem.antibodies += 500;
        if (bio.brainActivity) {
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity = Math.min(
              100,
              bio.brainActivity.regions[region].activity + 25
            );
          }
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = 150;
        }
        break;

      case 4: // Poison
        bio.vitalSigns.heartRate += 20;
        bio.vitalSigns.bodyTemperature += 1.0;
        bio.immuneSystem.whiteBloodCells += 3000;
        bio.vitalSigns.cortisol += 10;
        bio.immuneSystem.bacteria.push({
          name: "Toxin-producing bacteria",
          type: "Pathogenic",
          count: 50000 + Math.floor(Math.random() * 50000),
          temporary: true,
        });
        if (bio.brainActivity) {
          bio.brainActivity.regions.brainstem.activity -= 15;
          bio.brainActivity.regions.prefrontalCortex.activity -= 20;
        }
        break;

      case 5: // Blind
        bio.vitalSigns.cortisol += 8;
        bio.hormones.adrenaline += 15;
        if (bio.brainActivity) {
          bio.brainActivity.regions.occipitalLobe.activity -= 60; // Visual processing severely reduced
          bio.brainActivity.regions.sensoryCortex.activity += 10; // Other senses compensate
        }
        // Affect head meridian
        if (bio.leyVeins.meridians.head) {
          bio.leyVeins.meridians.head.magicalActivity = Math.max(
            50,
            bio.leyVeins.meridians.head.magicalActivity - 30
          );
        }
        break;

      case 6: // Silence
        bio.vitalSigns.cortisol += 5;
        if (bio.brainActivity) {
          bio.brainActivity.regions.temporalLobe.activity -= 30; // Language processing affected
        }
        // Reduce magical flow
        bio.leyVeins.flow = Math.max(30, bio.leyVeins.flow - 20);
        break;

      case 7: // Rage
        bio.vitalSigns.heartRate += 40;
        bio.vitalSigns.bloodPressure.systolic += 30;
        bio.vitalSigns.bloodPressure.diastolic += 20;
        bio.vitalSigns.bodyTemperature += 0.8;
        bio.hormones.adrenaline += 50;
        bio.hormones.testosterone += 100;
        bio.vitalSigns.cortisol += 15;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity += 60; // Fear/emotion center highly active
          bio.brainActivity.regions.prefrontalCortex.activity -= 25; // Reduced rational thinking
          bio.brainActivity.waves.beta += 15; // Increased beta waves
        }
        break;

      case 8: // Confusion
        bio.vitalSigns.cortisol += 12;
        bio.hormones.adrenaline += 20;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity -= 40;
          bio.brainActivity.regions.hippocampus.activity -= 25; // Memory affected
          bio.brainActivity.waves.theta += 10; // Increased theta waves (confusion)
          bio.brainActivity.regions.head.magicalActivity = Math.max(
            40,
            bio.brainActivity.regions.head.magicalActivity - 40
          );
        }
        break;

      case 9: // Charm
        bio.hormones.estrogen += 50;
        bio.vitalSigns.heartRate += 10;
        bio.vitalSigns.cortisol -= 5;
        if (bio.brainActivity) {
          bio.brainActivity.regions.amygdala.activity -= 20; // Reduced fear response
          bio.brainActivity.regions.prefrontalCortex.activity += 15; // Enhanced social processing
        }
        break;

      case 10: // Sleep
        bio.vitalSigns.heartRate -= 15;
        bio.vitalSigns.bloodPressure.systolic -= 20;
        bio.vitalSigns.bloodPressure.diastolic -= 15;
        bio.vitalSigns.bodyTemperature -= 0.5;
        bio.vitalSigns.cortisol -= 8;
        bio.hormones.growth += 1;
        if (bio.brainActivity) {
          bio.brainActivity.waves.delta += 10; // Increased delta waves
          bio.brainActivity.waves.theta += 5;
          bio.brainActivity.waves.beta -= 15;
          bio.brainActivity.overallActivity -= 30;
          for (var region in bio.brainActivity.regions) {
            bio.brainActivity.regions[region].activity *= 0.6; // Reduced activity across all regions
          }
        }
        break;

      case 11: // Freeze
        bio.vitalSigns.heartRate -= 25;
        bio.vitalSigns.bodyTemperature -= 5.0;
        bio.vitalSigns.bloodPressure.systolic -= 30;
        if (bio.brainActivity) {
          bio.brainActivity.regions.motorCortex.activity -= 70; // Severely reduced motor function
          bio.brainActivity.regions.cerebellum.activity -= 60; // Balance/coordination affected
          bio.brainActivity.overallActivity -= 40;
        }
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = Math.max(
            20,
            bio.leyVeins.meridians[meridian].magicalActivity - 60
          );
        }
        break;

      case 12: // Paralysis
        bio.vitalSigns.heartRate -= 10;
        bio.vitalSigns.cortisol += 20;
        bio.hormones.adrenaline += 30;
        if (bio.brainActivity) {
          bio.brainActivity.regions.motorCortex.activity -= 80; // Motor control severely affected
          bio.brainActivity.regions.cerebellum.activity -= 70;
          bio.brainActivity.regions.prefrontalCortex.activity += 10; // Increased awareness of paralysis
        }
        // Affect limb meridians
        if (bio.leyVeins.meridians.arms) {
          bio.leyVeins.meridians.arms.magicalActivity = Math.max(
            10,
            bio.leyVeins.meridians.arms.magicalActivity - 70
          );
        }
        if (bio.leyVeins.meridians.legs) {
          bio.leyVeins.meridians.legs.magicalActivity = Math.max(
            10,
            bio.leyVeins.meridians.legs.magicalActivity - 70
          );
        }
        break;

      case 13: // Stun
        bio.vitalSigns.heartRate += 25;
        bio.vitalSigns.cortisol += 15;
        bio.hormones.adrenaline += 40;
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity -= 50;
          bio.brainActivity.regions.sensoryCortex.activity -= 30;
          bio.brainActivity.waves.alpha -= 10;
          bio.brainActivity.waves.beta += 20; // Chaotic brain activity
          bio.brainActivity.regions.head.magicalActivity = Math.max(
            30,
            bio.brainActivity.regions.head.magicalActivity - 50
          );
        }
        break;

      // Continue with more states...
      case 15: // HP Regeneration
        bio.vitalSigns.heartRate += 5;
        bio.hormones.growth += 3;
        bio.immuneSystem.whiteBloodCells += 1500;
        bio.vitalSigns.nutrients.protein += 20;
        if (bio.brainActivity) {
          bio.brainActivity.regions.brainstem.activity += 10; // Enhanced vital functions
        }
        if (bio.cellularActivity) {
          bio.cellularActivity.cellsForming *= 1.5; // Increased cell formation
          bio.cellularActivity.mitosisRate *= 1.3;
        }
        break;

      case 16: // MP Regeneration
        for (var meridian in bio.leyVeins.meridians) {
          bio.leyVeins.meridians[meridian].magicalActivity = Math.min(
            200,
            bio.leyVeins.meridians[meridian].magicalActivity + 50
          );
        }
        bio.leyVeins.flow = Math.min(150, bio.leyVeins.flow + 30);
        if (bio.brainActivity) {
          bio.brainActivity.regions.prefrontalCortex.activity += 15; // Enhanced mental focus
        }
        break;

      case 45: // Infected
        bio.vitalSigns.heartRate += 30;
        bio.vitalSigns.bodyTemperature += 2.5;
        bio.immuneSystem.whiteBloodCells += 6000;
        bio.vitalSigns.cortisol += 20;

        if (bio.brainActivity) {
          bio.brainActivity.overallActivity -= 20; // Reduced brain function due to infection
          bio.brainActivity.regions.brainstem.activity += 15; // Fighting infection
        }

        // Add various pathogens
        bio.immuneSystem.bacteria.push({
          name: "Staphylococcus aureus",
          type: "Pathogenic",
          count: 500000 + Math.floor(Math.random() * 1000000),
          temporary: true,
        });
        bio.immuneSystem.bacteria.push({
          name: "Streptococcus pyogenes",
          type: "Pathogenic",
          count: 200000 + Math.floor(Math.random() * 500000),
          temporary: true,
        });
        bio.immuneSystem.viruses.push({
          name: "Inflammatory Virus",
          type: "Pathogenic",
          count: 50000 + Math.floor(Math.random() * 100000),
          temporary: true,
        });
        break;

      case 48: // Bleeding
        bio.vitalSigns.heartRate += 35;
        bio.vitalSigns.bloodPressure.systolic -= 20;
        bio.vitalSigns.bloodPressure.diastolic -= 15;
        bio.immuneSystem.whiteBloodCells += 2500;
        bio.vitalSigns.cortisol += 15;

        if (bio.brainActivity) {
          bio.brainActivity.overallActivity -= 15; // Reduced due to blood loss
          bio.brainActivity.regions.brainstem.activity += 20; // Compensating for blood loss
        }

        if (bio.cellularActivity) {
          bio.cellularActivity.cellsDying *= 1.3; // Increased cell death due to bleeding
        }

        bio.immuneSystem.bacteria.push({
          name: "Hemolytic bacteria",
          type: "Opportunistic",
          count: 40000 + Math.floor(Math.random() * 60000),
          temporary: true,
        });
        break;
    }

    // Ensure values stay within reasonable bounds
    bio.vitalSigns.heartRate = Math.max(
      0,
      Math.min(200, bio.vitalSigns.heartRate)
    );
    bio.vitalSigns.bloodPressure.systolic = Math.max(
      0,
      Math.min(300, bio.vitalSigns.bloodPressure.systolic)
    );
    bio.vitalSigns.bloodPressure.diastolic = Math.max(
      0,
      Math.min(200, bio.vitalSigns.bloodPressure.diastolic)
    );
    bio.vitalSigns.bodyTemperature = Math.max(
      15.0,
      Math.min(45.0, bio.vitalSigns.bodyTemperature)
    );
    bio.vitalSigns.oxygenSaturation = Math.max(
      0,
      Math.min(100, bio.vitalSigns.oxygenSaturation)
    );
    bio.immuneSystem.whiteBloodCells = Math.max(
      0,
      Math.min(50000, bio.immuneSystem.whiteBloodCells)
    );
    bio.immuneSystem.antibodies = Math.max(
      0,
      Math.min(5000, bio.immuneSystem.antibodies)
    );
    bio.vitalSigns.cortisol = Math.max(
      0,
      Math.min(100, bio.vitalSigns.cortisol)
    );

    // Bound brain activity values
    if (bio.brainActivity) {
      for (var region in bio.brainActivity.regions) {
        bio.brainActivity.regions[region].activity = Math.max(
          0,
          Math.min(100, bio.brainActivity.regions[region].activity)
        );
      }
      bio.brainActivity.overallActivity = Math.max(
        0,
        Math.min(100, bio.brainActivity.overallActivity)
      );
    }
  };
  // Override the refresh method to include state reactions
  var _Window_BiologicSimulation_refresh =
    Window_BiologicSimulation.prototype.refresh;
  Window_BiologicSimulation.prototype.refresh = function () {
    if (this._actor) {
      this.applyStateReactions();
    }
    _Window_BiologicSimulation_refresh.call(this);
  };

  // Enhanced drawImmuneSystem to show viruses and bacteria
  Window_BiologicSimulation.prototype.drawImmuneSystem = function (startY) {
    var data = this._actor._biologicData.immuneSystem;
    var y = startY;
    var lineHeight = this.lineHeight();

    this.drawText(
      "White Blood Cells: " + data.whiteBloodCells + "/μL",
      6,
      y,
      300
    );
    y += lineHeight;

    this.drawText("Antibodies: " + data.antibodies + " mg/dL", 6, y, 300);
    y += lineHeight * 2;

    // Active Infections
    this.changeTextColor(this.systemColor());
    this.drawText("Active Infections:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.infections.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < data.infections.length; i++) {
        var infection = data.infections[i];
        var severityText = ["Mild", "Moderate", "Severe"][
          infection.severity - 1
        ];
        var text =
          infection.location +
          ": " +
          infection.type +
          " (" +
          severityText +
          ")";

        if (infection.severity >= 2) {
          this.changeTextColor(this.textColor(2)); // Red for moderate/severe
        }

        this.drawText(text, 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Viruses
    this.changeTextColor(this.systemColor());
    this.drawText("Active Viruses:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.viruses.length === 0) {
      this.drawText("None detected", 20, y, 300);
      y += lineHeight;
    } else {
      for (var i = 0; i < Math.min(data.viruses.length, 5); i++) {
        var virus = data.viruses[i];
        var typeColor =
          virus.type === "Pathogenic"
            ? this.textColor(2)
            : virus.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(virus.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(virus.type + " (" + virus.count + ")", 230, y, 200);
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.viruses.length > 5) {
        this.drawText(
          "... and " + (data.viruses.length - 5) + " more",
          20,
          y,
          200
        );
        y += lineHeight;
      }
    }

    y += lineHeight;

    // Bacteria
    this.changeTextColor(this.systemColor());
    this.drawText("Active Bacteria:", 6, y, 200);
    this.resetTextColor();
    y += lineHeight;

    if (data.bacteria.length === 0) {
      this.drawText("None detected", 20, y, 300);
    } else {
      for (var i = 0; i < Math.min(data.bacteria.length, 5); i++) {
        var bacteria = data.bacteria[i];
        var typeColor =
          bacteria.type === "Pathogenic"
            ? this.textColor(2)
            : bacteria.type === "Beneficial"
            ? this.textColor(3)
            : this.normalColor();

        this.drawText(bacteria.name + ":", 20, y, 200);
        this.changeTextColor(typeColor);
        this.drawText(bacteria.type + " (" + bacteria.count + ")", 230, y, 200);
        this.resetTextColor();
        y += lineHeight;
      }
      if (data.bacteria.length > 5) {
        this.drawText(
          "... and " + (data.bacteria.length - 5) + " more",
          20,
          y,
          200
        );
      }
    }
  };

  // Enhanced drawLeyVeins to show special resonances
  var _Window_BiologicSimulation_drawLeyVeins =
    Window_BiologicSimulation.prototype.drawLeyVeins;
  Window_BiologicSimulation.prototype.drawLeyVeins = function (startY) {
    _Window_BiologicSimulation_drawLeyVeins.call(this, startY);

    var data = this._actor._biologicData.leyVeins;
    var y = startY + this.lineHeight() * 10; // After normal ley vein display
    var lineHeight = this.lineHeight();

    // Show special resonances
    var specialResonances = [];
    if (data.resonance)
      specialResonances.push("Magic Reflection: " + data.resonance);
    if (data.divineResonance)
      specialResonances.push("Divine: " + data.divineResonance);
    if (data.shadowResonance)
      specialResonances.push("Shadow: " + data.shadowResonance);
    if (data.etherealResonance)
      specialResonances.push("Ethereal: " + data.etherealResonance);
    if (data.lifeResonance)
      specialResonances.push("Life: " + data.lifeResonance);
    if (data.levitationResonance)
      specialResonances.push("Levitation: " + data.levitationResonance);
    if (data.invisibilityResonance)
      specialResonances.push("Invisibility: " + data.invisibilityResonance);
    if (data.electricalActivity)
      specialResonances.push("Electrical: " + data.electricalActivity);

    if (specialResonances.length > 0) {
      y += lineHeight;
      this.changeTextColor(this.systemColor());
      this.drawText("Special Resonances:", 6, y, 200);
      this.resetTextColor();
      y += lineHeight;

      for (var i = 0; i < specialResonances.length; i++) {
        this.changeTextColor(this.textColor(3)); // Yellow for special effects
        this.drawText(specialResonances[i], 20, y, 400);
        this.resetTextColor();
        y += lineHeight;
      }
    }
  };

  var _Scene_Menu_createCommandWindow_prosthetic =
    Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function () {
    _Scene_Menu_createCommandWindow_prosthetic.call(this);
    this._commandWindow.setHandler(
      "prostheticShop",
      this.commandProstheticShop.bind(this)
    );
  };

  Scene_Menu.prototype.commandProstheticShop = function () {
    SceneManager.push(Scene_ProstheticShop);
  };

  // Handle Biologics command in Scene_Menu

  Scene_Menu.prototype.commandBiologics = function () {
    SceneManager.push(Scene_BiologicSimulation);
  };

  // Register plugin command
  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);

    if (command === "HealBodyParts") {
      var actor = $gameParty.members()[0]; // Actor1
      var amount = Number(args[0]) || actor.mhp / 2;
      if (actor) {
        healBodyParts(actor, amount);
      }
    }
  };
  var _Game_Interpreter_pluginCommand_prosthetic =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand_prosthetic.call(this, command, args);

    if (command === "OpenProstheticShop") {
      SceneManager.push(Scene_ProstheticShop);
    }
  };

  var _Game_Interpreter_pluginCommand_biologic =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand_biologic.call(this, command, args);

    if (command === "OpenBiologicSimulation") {
      SceneManager.push(Scene_BiologicSimulation);
    }
  };
  // MZ compatibility for biologic simulation command
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(
      "DF_LimbDamageSystem",
      "OpenBiologicSimulation",
      (args) => {
        SceneManager.push(Scene_BiologicSimulation);
      }
    );
  }

  // MZ compatibility for prosthetic shop command
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(
      "DF_LimbDamageSystem",
      "OpenProstheticShop",
      (args) => {
        SceneManager.push(Scene_ProstheticShop);
      }
    );
  }
  // MV/MZ compatibility for plugin commands
  if (Utils.RPGMAKER_NAME === "MZ") {
    PluginManager.registerCommand(
      "DF_LimbDamageSystem",
      "HealBodyParts",
      (args) => {
        var actor = $gameParty.members()[0]; // Actor1
        var amount = Number(args.amount) || actor.mhp / 2;
        if (actor) {
          healBodyParts(actor, amount);
        }
      }
    );
  }
})();
