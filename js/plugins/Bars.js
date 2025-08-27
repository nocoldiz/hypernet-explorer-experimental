(() => {
  "use strict";
  const pluginName = "TekkenStyleHealthBars";
  const parameters = PluginManager.parameters(pluginName);
  const barWidth = 280;
  const barHeight = Number(parameters["BarHeight"] || 25);
  const barSpacing = 70;
  const playerBarX = Number(parameters["PlayerBarX"] || 60);
  const enemyBarX = Number(470);
  const barsY = Number(parameters["BarsY"] || 20);
  const playerHPColor1 = String(parameters["PlayerHPColor1"] || "#ff4444");
  const playerHPColor2 = String(parameters["PlayerHPColor2"] || "#ff0000");
  const enemyHPColor1 = String(parameters["EnemyHPColor1"] || "#ff4444");
  const enemyHPColor2 = String(parameters["EnemyHPColor2"] || "#ff0000");
  const mpBarColor1 = String(parameters["MPBarColor1"] || "#44aaff");
  const mpBarColor2 = String(parameters["MPBarColor2"] || "#0066cc");
  const tpColor1 = String(parameters["TPColor1"] || "#ffcc00");
  const tpColor2 = String(parameters["TPColor2"] || "#ff9900");
  const damageColor = String(parameters["DamageColor"] || "#ffffff");
  const mpSkillColor = String(parameters["MPSkillColor"] || "#44aaff");
  const tpSkillColor = String(parameters["TPSkillColor"] || "#ff9900");
  const animationSpeed = Number(parameters["AnimationSpeed"] || 5);
  const gradientSpeed = Number(parameters["GradientSpeed"] || 1);
  const tpOrbSize = Number(parameters["TPOrbSize"] || 56);
  const tpOrbOffsetX = Number(-40);
  const enemyTpOrbOffsetX = Number(265);
  const angleSize = Number(parameters["AngleSize"] || 15);
  const borderThickness = Number(parameters["BorderThickness"] || 2);
  const borderColor = String(parameters["BorderColor"] || "#000000");
  // Stat change display parameters
  const statDisplayOffsetY = 100; // Offset below MP bar
  const statTextColor = "#FFCC00"; // Yellow text for stat changes
  const statDisplayHeight = 18; // Increased height for stat display
  const isMobileDevice = Utils.isMobileDevice(); // Detect if running on mobile
  const useMobileOptimization = false; // Set to true to force optimization even on desktop

  // Battle UI fixes parameters
  const helpWindowHeightBonus = Number(
    parameters["HelpWindowHeightBonus"] || 20
  );

  const statDisplayPlayerX = Number(
    parameters["StatDisplayPlayerX"] || Graphics.width / 2 - 180
  );
  const statDisplayEnemyX = Number(
    parameters["StatDisplayEnemyX"] || Graphics.width / 2 + 100
  );
  const statDisplayY = Number(parameters["StatDisplayY"] || 50);

  function getEnemyLevel(battler) {
    if (!battler.isEnemy || !battler.isEnemy()) return "";

    const notes = battler.enemy().note || "";
    const lvMatch = notes.match(/LV:\s*(\d+)/i);

    if (lvMatch && lvMatch[1]) {
      return "Lv." + lvMatch[1];
    }
    return "";
  }
  function getStatusTag(state) {
    if (!state || !state.note) return null;

    const notes = state.note;
    const currentLanguage = ConfigManager.language || "en";

    // Look for language-specific tags like <En: DMK> or <It: MRT>
    const langPattern = new RegExp(
      `<${currentLanguage.toUpperCase()}:\\s*([^>]+)>`,
      "i"
    );
    const match = notes.match(langPattern);

    if (match && match[1]) {
      return match[1].trim();
    }

    // Fallback to English if current language not found
    if (currentLanguage !== "en") {
      const enPattern = /<En:\s*([^>]+)>/i;
      const enMatch = notes.match(enPattern);
      if (enMatch && enMatch[1]) {
        return enMatch[1].trim();
      }
    }

    // If no tags found, return null (don't display anything)
    return null;
  }

  // Helper function to collect status tags for display
  function getStatusTags(battler) {
    if (!battler || !battler.states) return [];

    const tags = [];
    const states = battler.states();

    for (const state of states) {
      const tag = getStatusTag(state);
      if (tag) {
        tags.push(tag);
      }
    }

    return tags;
  }
  //=========================================================================
  // Battle UI Fixes - Window_Help modifications
  //=========================================================================

  const _Window_Help_initialize = Window_Help.prototype.initialize;
  Window_Help.prototype.initialize = function (rect) {
    // Check if we're in battle scene and adjust height
    if ($gameParty.inBattle()) {
      rect.height += helpWindowHeightBonus;
    }
    _Window_Help_initialize.call(this, rect);
  };

  const _Scene_Battle_helpWindowRect = Scene_Battle.prototype.helpWindowRect;
  Scene_Battle.prototype.helpWindowRect = function () {
    const rect = _Scene_Battle_helpWindowRect.call(this);
    rect.height += helpWindowHeightBonus;
    return rect;
  };

  // Adjust other windows to account for taller help window
  const _Scene_Battle_skillWindowRect = Scene_Battle.prototype.skillWindowRect;
  Scene_Battle.prototype.skillWindowRect = function () {
    const rect = _Scene_Battle_skillWindowRect.call(this);
    rect.y += helpWindowHeightBonus;
    rect.height -= helpWindowHeightBonus;
    return rect;
  };

  const _Scene_Battle_itemWindowRect = Scene_Battle.prototype.itemWindowRect;
  Scene_Battle.prototype.itemWindowRect = function () {
    const rect = _Scene_Battle_itemWindowRect.call(this);
    rect.y += helpWindowHeightBonus;
    rect.height -= helpWindowHeightBonus;
    return rect;
  };

  //=========================================================================
  // Battle UI Fixes - Window_BattleItem single column
  //=========================================================================

  const _Window_BattleItem_initialize = Window_BattleItem.prototype.initialize;
  Window_BattleItem.prototype.initialize = function (rect) {
    _Window_BattleItem_initialize.call(this, rect);
    // Force single column for battle item window
    this._singleColumn = true;
  };

  const _Window_BattleItem_maxCols = Window_BattleItem.prototype.maxCols;
  Window_BattleItem.prototype.maxCols = function () {
    // Always return 1 column for battle items to prevent name truncation
    return 1;
  };

  const _Window_BattleItem_colSpacing = Window_BattleItem.prototype.colSpacing;
  Window_BattleItem.prototype.colSpacing = function () {
    // No column spacing needed for single column
    return 0;
  };

  // Optional: Adjust item name display to use full width
  const _Window_BattleItem_drawItemName =
    Window_BattleItem.prototype.drawItemName;
  Window_BattleItem.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
      const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
      const textMargin = ImageManager.iconWidth + 4;
      const itemWidth = width || this.innerWidth - textMargin;

      this.resetTextColor();
      this.drawIcon(item.iconIndex, x, iconY);

      // Use full available width for item name
      this.drawText(item.name, x + textMargin, y, itemWidth - textMargin);
    }
  };

  // Make sure regular item windows (outside battle) keep their normal behavior
  const _Window_ItemList_maxCols = Window_ItemList.prototype.maxCols;
  Window_ItemList.prototype.maxCols = function () {
    // Only affect battle item window, not regular item lists
    if (this.constructor === Window_BattleItem) {
      return 1;
    }
    return _Window_ItemList_maxCols.call(this);
  };

  // Ensure help window text wrapping works properly with increased height
  const _Window_Help_refresh = Window_Help.prototype.refresh;
  Window_Help.prototype.refresh = function () {
    this.contents.clear();
    if (this._text) {
      const textState = this.createTextState(this._text, 0, 0, this.innerWidth);
      textState.height = this.innerHeight;
      this.processAllText(textState);
    }
  };

  //=========================================================================
  // Original Tekken Bar Code continues below
  //=========================================================================

  function Sprite_TekkenBar() {
    this.initialize(...arguments);
  }
  Sprite_TekkenBar.prototype = Object.create(Sprite.prototype);
  Sprite_TekkenBar.prototype.constructor = Sprite_TekkenBar;
  Sprite_TekkenBar.prototype.initialize = function (battler, isPlayer = false) {
    Sprite.prototype.initialize.call(this);
    this._battler = battler;
    this._isPlayer = isPlayer;
    this._gradientPhase = Math.random() * Math.PI * 2; // Start at a random phase

    const isSimpleDisplay =
      this._isPlayer &&
      this._battler.actorId &&
      (this._battler.actorId() === 2 || this._battler.actorId() === 3);

    if (isSimpleDisplay) {
      this.createSimpleDisplayBackground(); // NEW: Create the cool background
      this.createSimpleStatusDisplay();
    } else {
      // Original initialization for actor 1 and enemies
      this.bitmap = new Bitmap(barWidth, barHeight * 3);
      this._lastHp = battler.hp;
      this._lastMaxHp = battler.mhp;
      this._lastMp = battler.mp;
      this._lastMaxMp = battler.mmp;
      this._lastTp = battler.tp;
      this._mpFlashAmount = 0;
      this._mpFlashTimer = 0;
      this._mpFlashState = false;
      this._projectedTp = battler.tp;
      this._currentSkill = null;
      this._displayHp = battler.hp;
      this._damageChunkHp = battler.hp;
      this._animationCount = 0;
      this._wavePhase = 0;

      // Create TP Orb first so it appears behind other elements
      this.createTPOrb();
      this.refresh();
      this.createDamageOverlay();

      // Add stat display for actor 1
      if (
        this._isPlayer &&
        this._battler.actorId &&
        this._battler.actorId() === 1
      ) {
        this.createStatDisplay();
      }
    }
  };

  // Add a method to update the position of the stat display
  Sprite_TekkenBar.prototype.updateStatDisplayPosition = function (x, y) {
    if (this._statDisplay) {
      this._statDisplay.x = x;
      this._statDisplay.y = y;
    }
  };

  // Replace the createStatDisplay method with this new version:
  Sprite_TekkenBar.prototype.createStatDisplay = function () {
    this._statDisplay = new Sprite();
    // Increase the width to avoid clipping
    this._statDisplay.bitmap = new Bitmap(
      barWidth * 1.5,
      statDisplayHeight * 6
    );

    // Position at the top center of the screen
    const xCenterOffset = 20; // Adjust this value to move left/right from center

    if (this._isPlayer) {
      this._statDisplay.x = 40; // Slightly left of center
      this._statDisplay.y = 75; // Top of screen with some padding
    } else {
      this._statDisplay.x = Graphics.width / 2 + xCenterOffset + 30; // Slightly right of center
      this._statDisplay.y = 75; // Top of screen with some padding
    }

    // Make sure the sprite is added to the scene, not as a child of the bar
    if (SceneManager._scene) {
      SceneManager._scene.addChild(this._statDisplay);
    } else {
      this.addChild(this._statDisplay);
    }

    // Set visibility
    this._statDisplay.visible = true;

    // Store base stats
    this._baseStats = {
      atk: this._battler.param(2), // Attack
      def: this._battler.param(3), // Defense
      mat: this._battler.param(4), // Magic Attack
      mdf: this._battler.param(5), // Magic Defense
      agi: this._battler.param(6), // Agility
      luk: this._battler.param(7), // Luck
    };

    //this.refreshStatDisplay();
  };

  Sprite_TekkenBar.prototype.refreshStatDisplay = function () {
    if (!this._statDisplay || !this._battler) return;
    if (
      this._isPlayer &&
      this._battler.actorId &&
      this._battler.actorId() !== 1
    )
      return;

    const bitmap = this._statDisplay.bitmap;
    bitmap.clear();
    bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.fontSize = 24;
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 3;

    let params = [
      { id: 2, name: "STR", base: this._baseStats.atk },
      { id: 3, name: "CON", base: this._baseStats.def },
      { id: 4, name: "INT", base: this._baseStats.mat },
      { id: 5, name: "WIS", base: this._baseStats.mdf },
      { id: 6, name: "DEX", base: this._baseStats.agi },
      { id: 7, name: "PSI", base: this._baseStats.luk },
    ];
    if (ConfigManager.language === "it") {
      params = [
        { id: 2, name: "FRZ", base: this._baseStats.atk },
        { id: 3, name: "COS", base: this._baseStats.def },
        { id: 4, name: "INT", base: this._baseStats.mat },
        { id: 5, name: "SAG", base: this._baseStats.mdf },
        { id: 6, name: "DES", base: this._baseStats.agi },
        { id: 7, name: "PSI", base: this._baseStats.luk },
      ];
    }

    // Collect all stat diffs
    const statParts = params.reduce((arr, p) => {
      const current = this._battler.param(p.id);
      const diff = current - p.base;
      if (diff !== 0) {
        const sign = diff > 0 ? "+" : "";
        const color = diff > 0 ? "#00ff00" : "#ff4444";
        arr.push({ text: `${p.name}${sign}${diff.toFixed(0)}`, color });
      }
      return arr;
    }, []);

    // Collect status tags instead of full status names
    const statusTags = getStatusTags(this._battler);
    if (statusTags.length > 0) {
      const tagsText = statusTags.join(" ");
      statParts.push({ text: `[${tagsText}]`, color: "#ffdd99" });
    }

    // If nothing to show, hide and exit
    if (statParts.length === 0) {
      this._statDisplay.visible = false;
      return;
    }

    // Draw them all in one go
    let x = 0;
    const y = 0;
    const lineHeight = 24;
    const padding = 10;

    for (const part of statParts) {
      bitmap.textColor = part.color;
      const w = bitmap.measureTextWidth(part.text + "  ");
      bitmap.drawText(part.text, x, y, w, lineHeight, "left");
      x += w + padding;
    }

    this._statDisplay.visible = true;
  };

  Sprite_TekkenBar.prototype.setCurrentSkill = function (skill) {
    this._currentSkill = skill;
    if (skill && this._battler) {
      const tpCost = this._battler.skillTpCost(skill);
      this._projectedTp = Math.max(0, this._battler.tp - tpCost);
    } else {
      this._projectedTp = this._battler.tp;
    }
    this.refreshTPOrb();
  };
  Sprite_TekkenBar.prototype.setMpFlashAmount = function (amount) {
    this._mpFlashAmount = amount || 0;
    if (amount > 0) {
      this._mpFlashTimer = 0;
      this._mpFlashState = true;
    }
  };
  Sprite_TekkenBar.prototype.createDamageOverlay = function () {
    this._damageOverlay = new Sprite();
    this._damageOverlay.bitmap = new Bitmap(barWidth, barHeight);
    this._damageOverlay.y = 0;
    this.addChild(this._damageOverlay);
  };
  Sprite_TekkenBar.prototype.createTPOrb = function () {
    this._tpOrb = new Sprite();
    this._tpOrb.bitmap = new Bitmap(tpOrbSize, tpOrbSize);
    if (this._isPlayer) {
      this._tpOrb.x = tpOrbOffsetX;
    } else {
      this._tpOrb.x = enemyTpOrbOffsetX;
    }
    this._tpOrb.y = -3;
    this.addChild(this._tpOrb);
    this.refreshTPOrb();
  };
  Sprite_TekkenBar.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (!this._battler) {
      return;
    }
  
    // Always update gradient animations for a live feeling
    this.updateGradientAnimation();
  
    // Handle simple display for actors 2 and 3
    const isSimpleDisplay =
      this._isPlayer &&
      this._battler.actorId &&
      (this._battler.actorId() === 2 || this._battler.actorId() === 3);
  
    if (isSimpleDisplay) {
      // NEW: Animate the background pattern
      if (this._backgroundPattern) {
        this._backgroundPattern.origin.x += 0.5;
        this._backgroundPattern.origin.y += 0.25;
      }
  
      const b = this._battler;
      if (
        b.hp !== this._lastHp ||
        b.mhp !== this._lastMaxHp ||
        b.mp !== this._lastMp ||
        b.mmp !== this._lastMaxMp ||
        b.tp !== this._lastTp ||
        this._lastStatesHash !==
          this._battler
            .states()
            .map((s) => s.id)
            .join(",")
      ) {
        this.refreshSimpleStatus();
        this._lastHp = b.hp;
        this._lastMaxHp = b.mhp;
        this._lastMp = b.mp;
        this._lastMaxMp = b.mmp;
        this._lastTp = b.tp;
        this._lastStatesHash = this._battler
          .states()
          .map((s) => s.id)
          .join(",");
      }
      return; // Skip the rest of the update logic
    }
  
    const b = this._battler;
    if (b.hp < this._lastHp) {
      this._damageChunkHp = this._displayHp;
      this._displayHp = b.hp;
      this.updateDamageOverlay();
    } else if (b.hp > this._lastHp) {
      this._displayHp = b.hp;
      this._damageChunkHp = b.hp;
      this.updateDamageOverlay();
    }
  
    if (this._damageChunkHp > this._displayHp) {
      this._damageChunkHp = Math.max(
        this._displayHp,
        this._damageChunkHp - b.mhp / (60 * animationSpeed)
      );
      this.updateDamageOverlay();
    }
  
    // Check for deck count changes when switch 45 is active
    let deckCountChanged = false;
    if ($gameSwitches.value(45) && this._isPlayer) {
      const currentDeckCount = window.$deckCount || 0;
      if (currentDeckCount !== this._lastDeckCount) {
        deckCountChanged = true;
        this._lastDeckCount = currentDeckCount;
      }
    }
  
    // Only refresh if values have changed
    if (
      b.hp !== this._lastHp ||
      b.mhp !== this._lastMaxHp ||
      b.mp !== this._lastMp ||
      b.mmp !== this._lastMaxMp ||
      b.tp !== this._lastTp ||
      deckCountChanged
    ) {
      this.refresh();
  
      // Only refresh TP orb if TP has changed or deck count changed
      if (this._tpOrb && (b.tp !== this._lastTp || deckCountChanged)) {
        this.refreshTPOrb();
      }
  
      this._lastHp = b.hp;
      this._lastMaxHp = b.mhp;
      this._lastMp = b.mp;
      this._lastMaxMp = b.mmp;
      this._lastTp = b.tp;
    }
  
    // Check for stat changes or states for actor 1
    if (
      this._statDisplay &&
      this._isPlayer &&
      this._battler.actorId &&
      this._battler.actorId() === 1
    ) {
      // Reduce frequency of stat updates on mobile
      if (
        !(isMobileDevice || useMobileOptimization) ||
        (this._statCheckCount = ((this._statCheckCount || 0) + 1) % 10) === 0
      ) {
        const params = [2, 3, 4, 5, 6, 7]; // ATK, DEF, MAT, MDF, AGI, LUK
        let statsChanged = false;
        let statesChanged = false;
        let lastStatesHash = this._lastStatesHash || "";
  
        // Create a hash of current states to check for changes
        let currentStatesHash = this._battler
          .states()
          .map((state) => state.id)
          .sort()
          .join(",");
  
        // Check if states have changed
        if (currentStatesHash !== lastStatesHash) {
          statesChanged = true;
          this._lastStatesHash = currentStatesHash;
        }
  
        // Check if stats have changed
        for (const paramId of params) {
          const current = this._battler.param(paramId);
          const base =
            this._baseStats[
              ["atk", "def", "mat", "mdf", "agi", "luk"][paramId - 2]
            ];
          if (current !== base) {
            statsChanged = true;
            break;
          }
        }
  
        // Refresh display if either stats or states changed
        if (statsChanged || statesChanged) {
          this.refreshStatDisplay();
        }
      }
    }
  };
  Sprite_TekkenBar.prototype.updateGradientAnimation = function () {
    // Update gradient phase for all animations
    this._gradientPhase += 0.01 * gradientSpeed;
    if (this._gradientPhase > Math.PI * 2) {
      this._gradientPhase -= Math.PI * 2;
    }

    // Only update wave phase if not in mobile mode (for TP orb)
    if (!(isMobileDevice || useMobileOptimization)) {
      this._wavePhase += 0.02 * gradientSpeed;
      if (this._wavePhase > Math.PI * 2) {
        this._wavePhase -= Math.PI * 2;
      }
    }

    // Refresh is now needed to see the moving gradient
    const isSimpleDisplay =
      this._isPlayer &&
      this._battler &&
      this._battler.actorId &&
      (this._battler.actorId() === 2 || this._battler.actorId() === 3);
    if (!isSimpleDisplay) {
      this.refresh();
      if (this._tpOrb) {
        this.refreshTPOrb();
      }
    }
  };

  Sprite_TekkenBar.prototype.updateDamageOverlay = function () {
    const w = this.bitmap.width;
    const b = this._battler;
    const hpRate = this._displayHp / Math.max(1, b.mhp);
    const dmgRate = this._damageChunkHp / Math.max(1, b.mhp);
    this._damageOverlay.bitmap.clear();
    const ctx = this._damageOverlay.bitmap.context;
    if (this._isPlayer) {
      const dmgWidth = (w - borderThickness * 2) * dmgRate;
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const dmgX = w - dmgWidth - borderThickness;
      const dmgChunkWidth = dmgWidth - hpWidth;
      if (dmgChunkWidth > 0) {
        ctx.fillStyle = damageColor;
        ctx.fillRect(dmgX, 0, dmgChunkWidth, barHeight);
      }
    } else {
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const dmgWidth = (w - borderThickness * 2) * dmgRate;
      if (dmgWidth > hpWidth) {
        const chunkX = borderThickness + hpWidth;
        const chunkWidth = dmgWidth - hpWidth;
        ctx.fillStyle = damageColor;
        ctx.fillRect(chunkX, 0, chunkWidth, barHeight);
      }
    }
  };
  Sprite_TekkenBar.prototype.refreshTPOrb = function () {
    if (!this._battler || !this._tpOrb) {
      return;
    }
  
    const b = this._battler;
    let displayValue, maxValue, rate;
    
    // Check if switch 45 is active and this is a player
    if ($gameSwitches.value(45) && this._isPlayer) {
      // Use deck count instead of TP
      displayValue = Math.min(window.$deckCount || 0, 40);
      maxValue = 40;
      rate = displayValue / maxValue;
    } else {
      // Original TP logic
      displayValue = Math.min(b.tp, 99);
      maxValue = 99;
      rate = displayValue / maxValue;
    }
  
    const bitmap = this._tpOrb.bitmap;
    const radius = tpOrbSize / 2;
    const center = radius;
  
    bitmap.clear();
    bitmap.drawCircle(center, center, radius, "#333333");
    bitmap.drawCircle(center, center, radius - 2, "#222222");
    const liquidHeight = Math.floor((tpOrbSize - 4) * rate);
  
    const ctx = bitmap.context;
    const gradientFactor = (Math.sin(this._gradientPhase) + 1) / 2;
  
    if (liquidHeight > 0) {
      // Check if using mobile optimization
      if (isMobileDevice || useMobileOptimization) {
        // Simple block fill for mobile (much faster)
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius - 2, 0, Math.PI * 2, false);
        ctx.clip();
  
        // Create a simple gradient
        const orbGradient = ctx.createLinearGradient(
          0,
          tpOrbSize,
          0,
          tpOrbSize - liquidHeight
        );
        orbGradient.addColorStop(0, tpColor1);
        orbGradient.addColorStop(1, tpColor2);
  
        // Draw a simple rectangle instead of wave pattern
        ctx.fillStyle = orbGradient;
        ctx.fillRect(0, tpOrbSize - liquidHeight, tpOrbSize, liquidHeight);
        ctx.restore();
      } else {
        // Original liquid animation for desktop
        const waveAmplitude = 3;
        const waveFrequency = 3;
        const orbGradient = ctx.createLinearGradient(
          0,
          tpOrbSize,
          0,
          tpOrbSize - liquidHeight
        );
        orbGradient.addColorStop(0, tpColor1);
        orbGradient.addColorStop(0.5 + gradientFactor * 0.5, tpColor2);
        orbGradient.addColorStop(1, tpColor1);
  
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius - 2, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.beginPath();
        ctx.moveTo(0, tpOrbSize);
        ctx.lineTo(0, tpOrbSize - liquidHeight);
  
        // This loop is expensive on mobile
        for (let x = 0; x <= tpOrbSize; x += 1) {
          const y =
            tpOrbSize -
            liquidHeight +
            Math.sin(
              (x / tpOrbSize) * Math.PI * waveFrequency + this._wavePhase
            ) *
              waveAmplitude *
              rate;
          ctx.lineTo(x, y);
        }
  
        ctx.lineTo(tpOrbSize, tpOrbSize);
        ctx.closePath();
        ctx.fillStyle = orbGradient;
        ctx.fill();
        ctx.restore();
      }
    }
  
    // Display the value
    bitmap.fontSize = 16;
    bitmap.textColor = "#ffffff";
    
    if ($gameSwitches.value(45) && this._isPlayer) {
      // Show deck count
      bitmap.drawText(Math.floor(displayValue), 0, center - 8, tpOrbSize, 16, "center");
    } else {
      // Original TP display logic
      if (
        this._currentSkill &&
        this._battler.skillTpCost(this._currentSkill) > 0
      ) {
        const originalTp = Math.floor(b.tp);
        const projectedTp = Math.floor(this._projectedTp);
        bitmap.textColor = projectedTp < originalTp ? "#ff9900" : "#ffffff";
        bitmap.drawText(projectedTp, 0, center - 8, tpOrbSize, 16, "center");
      } else {
        bitmap.drawText(Math.floor(b.tp), 0, center - 8, tpOrbSize, 16, "center");
      }
    }
  
    // Add highlight effect (simplified for mobile)
    if (!(isMobileDevice || useMobileOptimization)) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const highlight = ctx.createRadialGradient(
        center - radius / 4,
        center - radius / 4,
        0,
        center - radius / 4,
        center - radius / 4,
        radius / 2
      );
      highlight.addColorStop(0, "rgba(255,255,255,0.4)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(
        center - radius / 4,
        center - radius / 4,
        radius / 2,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.restore();
    }
  
    bitmap._baseTexture.update();
  };
  
  Sprite_TekkenBar.prototype.refresh = function () {
    if (!this._battler) {
      return;
    }
    const w = this.bitmap.width;
    const b = this._battler;
    const hpRate = this._displayHp / Math.max(1, b.mhp);
    this.bitmap.clear();
  
    // NEW: Animated gradient logic
    const gradientWidth = w * 1.5;
    const scrollX = w * 0.5 * Math.sin(this._gradientPhase);
    const gradientOffset = w / 2 - scrollX;
  
    const ctx = this.bitmap.context;
    if (this._isPlayer) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - angleSize, barHeight);
      ctx.lineTo(0, barHeight);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w - angleSize, barHeight);
      ctx.lineTo(0, barHeight);
      ctx.closePath();
      ctx.stroke();
  
      // NEW: Apply the moving gradient
      const playerGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      playerGradient.addColorStop(0, playerHPColor2);
      playerGradient.addColorStop(0.5, playerHPColor1);
      playerGradient.addColorStop(1, playerHPColor2);
  
      const hpWidth = (w - borderThickness * 2) * hpRate;
      const hpX = w - hpWidth - borderThickness;
      if (hpWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w - borderThickness, borderThickness);
        ctx.lineTo(
          w - borderThickness - angleSize,
          barHeight - borderThickness
        );
        ctx.lineTo(hpX, barHeight - borderThickness);
        ctx.lineTo(hpX, borderThickness);
        ctx.closePath();
        ctx.clip(); // Clip the drawing to the bar shape
        ctx.fillStyle = playerGradient;
        ctx.fillRect(0, 0, w, barHeight); // Fill the clipped area
        ctx.restore();
      }
  
      // Only draw MP bar if switch 45 is NOT active or this is not a player
      if (!$gameSwitches.value(45)) {
        const mpY = barHeight + 5;
        const mpHeight = barHeight / 2;
        const mpRate = b.mp / Math.max(1, b.mmp);
        ctx.beginPath();
        ctx.moveTo(0, mpY);
        ctx.lineTo(w, mpY);
        ctx.lineTo(w - Math.floor(angleSize / 2), mpY + mpHeight);
        ctx.lineTo(0, mpY + mpHeight);
        ctx.lineTo(0, mpY);
        ctx.closePath();
        ctx.fillStyle = "#111";
        ctx.fill();
  
        // NEW: Apply moving gradient to MP bar
        const mpGradient = ctx.createLinearGradient(
          gradientOffset - gradientWidth / 2,
          0,
          gradientOffset + gradientWidth / 2,
          0
        );
        mpGradient.addColorStop(0, mpBarColor2);
        mpGradient.addColorStop(0.5, mpBarColor1);
        mpGradient.addColorStop(1, mpBarColor2);
  
        if (mpRate > 0) {
          const mpWidth = (w - 4) * mpRate;
  
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(2, mpY + 2);
          ctx.lineTo(mpWidth + 2, mpY + 2);
          ctx.lineTo(mpWidth - Math.floor(angleSize / 3) + 2, mpY + mpHeight - 2);
          ctx.lineTo(2, mpY + mpHeight - 2);
          ctx.closePath();
          ctx.clip();
          ctx.fillStyle = mpGradient;
          ctx.fillRect(0, mpY, w, mpHeight);
          ctx.restore();
  
          // MP Flash logic (unchanged)
          if (this._mpFlashAmount > 0 && this._mpFlashState) {
            const mpFlashRate = this._mpFlashAmount / Math.max(1, b.mmp);
            const mpFlashWidth = (w - 4) * mpFlashRate;
            const mpFlashX = 2 + (mpWidth - mpFlashWidth);
            if (mpFlashX >= 2 && mpFlashWidth > 0) {
              ctx.save();
              ctx.globalAlpha = 0.6;
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.moveTo(mpFlashX, mpY + 2);
              ctx.lineTo(mpFlashX + mpFlashWidth, mpY + 2);
              ctx.lineTo(
                mpFlashX + mpFlashWidth - Math.floor(angleSize / 3),
                mpY + mpHeight - 2
              );
              ctx.lineTo(mpFlashX, mpY + mpHeight - 2);
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }
    } else {
      // Enemy Bar (unchanged)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, barHeight);
      ctx.lineTo(angleSize, barHeight);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderThickness;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, barHeight);
      ctx.lineTo(angleSize, barHeight);
      ctx.closePath();
      ctx.stroke();
  
      // NEW: Apply moving gradient to Enemy HP
      const enemyGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      enemyGradient.addColorStop(0, enemyHPColor2);
      enemyGradient.addColorStop(0.5, enemyHPColor1);
      enemyGradient.addColorStop(1, enemyHPColor2);
  
      const hpWidth = (w - borderThickness * 2) * hpRate;
      if (hpWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(borderThickness, borderThickness);
        ctx.lineTo(borderThickness + angleSize, barHeight - borderThickness);
        const rightX = borderThickness + hpWidth;
        ctx.lineTo(rightX, barHeight - borderThickness);
        ctx.lineTo(rightX, borderThickness);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = enemyGradient;
        ctx.fillRect(0, 0, w, barHeight);
        ctx.restore();
      }
  
      const mpY = barHeight + 5;
      const mpHeight = barHeight / 2;
      const mpRate = b.mp / Math.max(1, b.mmp);
      ctx.beginPath();
      ctx.moveTo(0, mpY);
      ctx.lineTo(w, mpY);
      ctx.lineTo(w, mpY + mpHeight);
      ctx.lineTo(Math.floor(angleSize / 2), mpY + mpHeight);
      ctx.lineTo(0, mpY);
      ctx.closePath();
      ctx.fillStyle = "#111";
      ctx.fill();
  
      // NEW: Apply moving gradient to Enemy MP
      const mpGradient = ctx.createLinearGradient(
        gradientOffset - gradientWidth / 2,
        0,
        gradientOffset + gradientWidth / 2,
        0
      );
      mpGradient.addColorStop(0, mpBarColor2);
      mpGradient.addColorStop(0.5, mpBarColor1);
      mpGradient.addColorStop(1, mpBarColor2);
  
      if (mpRate > 0) {
        const mpWidth = (w - 4) * mpRate;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(2, mpY + 2);
        ctx.lineTo(Math.floor(angleSize / 3) + 2, mpY + mpHeight - 2);
        ctx.lineTo(mpWidth + 2, mpY + mpHeight - 2);
        ctx.lineTo(mpWidth + 2, mpY + 2);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = mpGradient;
        ctx.fillRect(0, mpY, w, mpHeight);
        ctx.restore();
      }
    }
    this.bitmap._baseTexture.update();
    this.bitmap.textColor = "#ffffff";
    this.bitmap.fontSize = 12;
    this.bitmap.fontBold = true;
    this.bitmap.fontFace = $gameSystem.mainFontFace();
    if (this._isPlayer) {
      this.bitmap.drawText(b.name(), 0, 0, w - 20, barHeight, "right");
    } else {
      const level = getEnemyLevel(b);
      const nameText = level
        ? `${window.translateText(b.name())} ${level}`
        : window.translateText(b.name());
  
      this.bitmap.fontSize = 12;
      this.bitmap.fontBold = true;
      this.bitmap.fontFace = $gameSystem.mainFontFace();
  
      const maxWidth = w - 30;
      const textWidth = this.bitmap.measureTextWidth(nameText);
  
      if (textWidth > maxWidth) {
        if (this._scaledTextSprite) {
          this.removeChild(this._scaledTextSprite);
        }
  
        this._scaledTextSprite = new Sprite();
        this._scaledTextSprite.bitmap = new Bitmap(textWidth + 20, barHeight);
        this._scaledTextSprite.bitmap.fontSize = 12;
        this._scaledTextSprite.bitmap.fontBold = true;
        this._scaledTextSprite.bitmap.fontFace = $gameSystem.mainFontFace();
        this._scaledTextSprite.bitmap.textColor = "#ffffff";
  
        this._scaledTextSprite.bitmap.drawText(
          nameText,
          10,
          0,
          textWidth + 10,
          barHeight,
          "left"
        );
  
        const scaleFactor = maxWidth / textWidth;
  
        this._scaledTextSprite.scale.x = scaleFactor;
        this._scaledTextSprite.scale.y = 1;
  
        this._scaledTextSprite.x = 15;
        this._scaledTextSprite.y = 0;
  
        this.addChild(this._scaledTextSprite);
      } else {
        if (this._scaledTextSprite) {
          this.removeChild(this._scaledTextSprite);
          this._scaledTextSprite = null;
        }
  
        this.bitmap.drawText(nameText, 15, 0, w - 15, barHeight, "left");
      }
    }
  };
  const _Window_SkillList_drawSkillCost =
    Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function (skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
      const tpCost = this._actor.skillTpCost(skill);
      const hasEnoughTp = this._actor.tp >= tpCost;
      if (hasEnoughTp) {
        this.changeTextColor(tpSkillColor);
      } else {
        this.changeTextColor("#888888");
      }
      this.drawText(tpCost, x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
      const mpCost = this._actor.skillMpCost(skill);
      const hasEnoughMp = this._actor.mp >= mpCost;
      if (hasEnoughMp) {
        this.changeTextColor(mpSkillColor);
      } else {
        this.changeTextColor("#888888");
      }
      this.drawText(mpCost, x, y, width, "right");
    }
  };
  Window_SkillList.prototype.isSkillUsable = function (skill) {
    return this._actor && this._actor.canUse(skill);
  };
  const _Window_SkillList_refresh = Window_SkillList.prototype.refresh;
  Window_SkillList.prototype.refresh = function () {
    this._lastMp = this._actor ? this._actor.mp : null;
    this._lastTp = this._actor ? this._actor.tp : null;
    _Window_SkillList_refresh.call(this);
  };
  const _Window_SkillList_update = Window_SkillList.prototype.update;
  Window_SkillList.prototype.update = function () {
    _Window_SkillList_update.call(this);
    if (this._actor) {
      if (this._actor.mp !== this._lastMp || this._actor.tp !== this._lastTp) {
        this.refresh();
      }
    }
  };
  const _Window_SkillList_select = Window_SkillList.prototype.select;
  Window_SkillList.prototype.select = function (index) {
    _Window_SkillList_select.call(this, index);
    this.updateTPProjection();
  };
  Window_SkillList.prototype.updateTPProjection = function () {
    if (!this._actor || !this.active) {
      return;
    }
    const skill = this.item();
    const scene = SceneManager._scene;
    if (scene instanceof Scene_Battle && scene._tekkenHealthBarSprites) {
      for (const sprite of scene._tekkenHealthBarSprites) {
        if (sprite && sprite._battler === this._actor) {
          sprite.setCurrentSkill(skill);
          if (skill) {
            const mpCost = this._actor.skillMpCost(skill);
            sprite.setMpFlashAmount(mpCost);
          } else {
            sprite.setMpFlashAmount(0);
          }
          break;
        }
      }
    }
  };
  const _Window_SkillList_deactivate = Window_SkillList.prototype.deactivate;
  Window_SkillList.prototype.deactivate = function () {
    _Window_SkillList_deactivate.call(this);
    const scene = SceneManager._scene;
    if (scene instanceof Scene_Battle && scene._tekkenHealthBarSprites) {
      for (const sprite of scene._tekkenHealthBarSprites) {
        if (sprite && sprite._battler === this._actor) {
          sprite.setCurrentSkill(null);
          sprite.setMpFlashAmount(0);
          break;
        }
      }
    }
  };
  Window_Selectable.prototype.drawItemBackground = function (index) {};
  const _Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;
  Window_SkillList.prototype.drawItem = function (index) {
    if (this._actor) {
      const skill = this._data[index];
      if (skill) {
        const rect = this.itemLineRect(index);
        const costWidth = this.costWidth();
        const skillName = this._actor.canUse(skill) ? skill.name : skill.name;
        this.changePaintOpacity(this._actor.canUse(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(true);
      }
    }
  };
  const _Window_ItemList_drawItem = Window_ItemList.prototype.drawItem;
  Window_ItemList.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
      const rect = this.itemLineRect(index);
      const nameWidth = rect.width;
      this.changePaintOpacity(this.isEnabled(item));
      this.drawItemName(item, rect.x, rect.y, nameWidth);
      this.changePaintOpacity(true);
    }
  };
  // Create a method to get status effects
  Sprite_TekkenBar.prototype.getStatusEffects = function () {
    if (!this._battler) return [];
    return this._battler.states().map((state) => state.name);
  };

  const _Scene_Battle_createDisplayObjects =
    Scene_Battle.prototype.createDisplayObjects;
  Scene_Battle.prototype.createDisplayObjects = function () {
    _Scene_Battle_createDisplayObjects.call(this);
    this.createTekkenHealthBars();
  };
  Scene_Battle.prototype.createTekkenHealthBars = function () {
    this._tekkenHealthBarSprites = [];
    

    
    const partyMembers = $gameParty.battleMembers();
  
    // Create Player Bars (existing code)
    for (let i = 0; i < partyMembers.length; i += 1) {
      const actor = partyMembers[i];
      const sprite = new Sprite_TekkenBar(actor, true);
      
      let yPos = barsY + i * barSpacing;
      if (i > 0) {
        yPos += 40;
      }
  
      sprite.x = playerBarX;
      sprite.y = yPos;
      
      this.addChild(sprite);
      this._tekkenHealthBarSprites.push(sprite);
    }
  
    // Create Enemy Bars (existing code)
    for (let i = 0; i < $gameTroop.members().length; i += 1) {
      const enemy = $gameTroop.members()[i];
      if (enemy.isAlive()) {
        const sprite = new Sprite_TekkenBar(enemy, false);
        sprite.x = enemyBarX;
        sprite.y = barsY + i * barSpacing;
        this.addChild(sprite);
        this._tekkenHealthBarSprites.push(sprite);
      }
    }
  };



  Scene_Battle.prototype.createEnemyHPSprite = function(enemy) {
    const sprite = new Sprite();
    sprite._enemy = enemy;
    sprite._lastHp = enemy.hp;
    
    // Create bitmap for HP text - wider to prevent cutoff
    sprite.bitmap = new Bitmap(200, 30);
    sprite.bitmap.fontFace = $gameSystem.mainFontFace();
    sprite.bitmap.fontSize = 18;
    sprite.bitmap.fontBold = true;
    sprite.bitmap.outlineColor = "black";
    sprite.bitmap.outlineWidth = 3;
    
    // Position under the enemy battler
    const enemySprite = this._spriteset._enemySprites.find(s => s._battler === enemy);
    if (enemySprite) {
      sprite.x = enemySprite.x - 100; // Center under enemy (adjusted for wider bitmap)
      sprite.y = enemySprite.y + enemySprite.height / 2 - 200; // Below enemy
    }
    
    // Update method for the HP sprite
    sprite.update = function() {
      Sprite.prototype.update.call(this);
      
      if (!this._enemy || !this._enemy.isAlive()) {
        this.visible = false;
        return;
      }
      
      // Only refresh if HP changed
      if (this._enemy.hp !== this._lastHp) {
        this.refreshHP();
        this._lastHp = this._enemy.hp;
      }
    };
    
    // Refresh method for HP display
    sprite.refreshHP = function() {
      this.bitmap.clear();
      
      const hp = this._enemy.hp;
      const maxHp = this._enemy.mhp;
      const hpRate = hp / Math.max(1, maxHp);
      
      // Color based on HP percentage
      let color = "#ffffff";
      if (hpRate <= 0.25) color = "#ff4444";      // Critical - Red
      else if (hpRate <= 0.5) color = "#ffff00";  // Low - Yellow
      else if (hpRate <= 0.75) color = "#ffaa00"; // Medium - Orange
      
      this.bitmap.textColor = color;
      this.bitmap.drawText(`${hp}/${maxHp}`, 0, 0, 200, 30, "center");
    };
    
    sprite.refreshHP();
    return sprite;
  };

  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);
    this.updateTekkenHealthBars();
  };
  Scene_Battle.prototype.updateTekkenHealthBars = function () {

    
    // Original logic for Tekken bars
    for (const sprite of this._tekkenHealthBarSprites) {
      if (sprite && sprite._battler) {
        sprite.visible = sprite._battler.isAlive();
      }
    }
  };
  const _Window_ActorCommand_initialize =
    Window_ActorCommand.prototype.initialize;

  // Create a method to get stat display values
  Sprite_TekkenBar.prototype.getStatChanges = function () {
    if (!this._battler) return {};

    const changes = {};
    const params = [
      { id: 2, name: "STR", base: this._baseStats.atk },
      { id: 3, name: "CON", base: this._baseStats.def },
      { id: 4, name: "INT", base: this._baseStats.mat },
      { id: 5, name: "WIS", base: this._baseStats.mdf },
      { id: 6, name: "DEX", base: this._baseStats.agi },
      { id: 7, name: "PSI", base: this._baseStats.luk },
    ];

    for (const param of params) {
      const current = this._battler.param(param.id);
      const diff = current - param.base;

      if (diff !== 0) {
        changes[param.name] = diff;
      }
    }

    return changes;
  };
  Window_ActorCommand.prototype.initialize = function (rect) {
    if (rect) {
      const lineHeight = this.lineHeight();
      const itemPadding = this.itemPadding();
      const extraHeight = lineHeight + itemPadding * 2;
      rect.height += extraHeight;
    }
    _Window_ActorCommand_initialize.call(this, rect);
  };
  Window_ActorCommand.prototype.maxVisibleItems = function () {
    return 6;
  };
  Window_ActorCommand.prototype.numVisibleRows = function () {
    return 6;
  };
  Window_ActorCommand.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
  };
  const _Scene_Battle_updateActorCommandWindowPosition =
    Scene_Battle.prototype.updateActorCommandWindowPosition;
  Scene_Battle.prototype.updateActorCommandWindowPosition = function () {
    _Scene_Battle_updateActorCommandWindowPosition.call(this);
    if (
      this._actorCommandWindow.y + this._actorCommandWindow.height >
      Graphics.boxHeight
    ) {
      const overflow =
        this._actorCommandWindow.y +
        this._actorCommandWindow.height -
        Graphics.boxHeight;
      this._actorCommandWindow.y -= overflow + 4;
    }
  };
  Window_ActorCommand.prototype.updateLayoutForExtraCommand = function () {
    const height = this.windowHeight();
    if (this.height !== height) {
      this.height = height;
      this.createContents();
    }
  };
  const _Window_ActorCommand_refresh = Window_ActorCommand.prototype.refresh;
  Window_ActorCommand.prototype.refresh = function () {
    this.updateLayoutForExtraCommand();
    _Window_ActorCommand_refresh.call(this);
  };
  const _Window_ActorCommand_makeCommandList =
    Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function () {
    if (this._actor) {
      this.clearCommandList();
      this.addAttackCommand();
      this.addSkillCommands();
      this.addItemCommand();
      this.addGuardCommand();
    }
  };
  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function () {
    _Scene_Battle_terminate.call(this);
    this.removeTekkenHealthBars();
  };
  Scene_Battle.prototype.removeTekkenHealthBars = function () {

    // Original cleanup code
    if (this._tekkenHealthBarSprites) {
      for (const sprite of this._tekkenHealthBarSprites) {
        if (sprite) {
          this.removeChild(sprite);
          if (sprite._statDisplay) {
            this.removeChild(sprite._statDisplay);
          }
        }
      }
      this._tekkenHealthBarSprites = [];
    }
  };

  //=========================================================================
  // NEW: Functions for the 'Simple Display' (Actors 2 & 3)
  //=========================================================================

  // NEW: This function creates the animated background for Actors 2 & 3
  // MODIFIED: This function creates the animated background for Actors 2 & 3
// MODIFIED: This function creates the animated background for Actors 2 & 3
Sprite_TekkenBar.prototype.createSimpleDisplayBackground = function () {
  // 1. Create the bitmap that will hold our square pattern
  const patternBitmap = new Bitmap(128, 128);
  const size = 16;
  const darkGold = "#3b3100";
  const black = "#0a0a0a";

  // 2. Fill the bitmap with the pattern
  for (let y = 0; y < patternBitmap.height; y += size) {
    for (let x = 0; x < patternBitmap.width; x += size) {
      const color = ((x + y) / size) % 2 === 0 ? darkGold : black;
      patternBitmap.fillRect(x, y, size, size, color);
    }
  }

  // 3. Create the TilingSprite for the moving background with reduced width
  const barGfxWidth = 220; // CHANGED: Reduced from 290 to 220 (70px narrower)
  const barGfxHeight = 68; // Height remains the same
  this._backgroundPattern = new TilingSprite(patternBitmap);
  
  // CHANGED: Position much closer to left edge (was -playerBarX, now 5 pixels from left)
  this._backgroundPattern.move(
    5, // Very close to left border instead of -playerBarX
    -barGfxHeight / 2,
    barGfxWidth,
    barGfxHeight
  );
  this._backgroundPattern.opacity = 128; // Make the pattern itself semi-transparent
  this.addChild(this._backgroundPattern);

  // 4. Create the semi-transparent overlay to darken the pattern
  const overlayBitmap = new Bitmap(barGfxWidth, barGfxHeight);
  overlayBitmap.fillAll("rgba(0, 0, 0, 0.6)"); // 60% black overlay
  this._backgroundOverlay = new Sprite(overlayBitmap);
  
  // CHANGED: Position overlay to match the pattern position
  this._backgroundOverlay.x = 5; // Match the pattern position
  this._backgroundOverlay.y = -barGfxHeight / 2;
  this.addChild(this._backgroundOverlay);
};
  // MODIFIED: This now just creates the foreground elements for the simple display
  Sprite_TekkenBar.prototype.createSimpleStatusDisplay = function () {
    this._simpleStatusDisplay = new Sprite();
    // Bitmap is wide enough for the bust + stats. Position it to align with the background.
    this._simpleStatusDisplay.bitmap = new Bitmap(barWidth + 50, 80);
    
    // CHANGED: Position very close to left border to match background
    this._simpleStatusDisplay.x = -playerBarX ; // Move further left
    this._simpleStatusDisplay.y = -40; // Center the drawing area vertically
    this.addChild(this._simpleStatusDisplay);
  
    // Store battler's initial state for comparison
    this._lastHp = this._battler.hp;
    this._lastMaxHp = this._battler.mhp;
    this._lastMp = this._battler.mp;
    this._lastMaxMp = this._battler.mmp;
    this._lastTp = this._battler.tp;
    this._lastStatesHash = this._battler
      .states()
      .map((s) => s.id)
      .join(",");
  
    // Load bust image
    this._bustImage = null;
    this._shouldUseBust =
      this._battler.actorId &&
      (this._battler.actorId() === 2 || this._battler.actorId() === 3);
  
    if (this._shouldUseBust) {
      const sheet = this._battler.characterName();
      const idx = this._battler.characterIndex();
      try {
        this._bustImage = ImageManager.loadBitmap(
          "img/busts/" + sheet + "/",
          String(idx)
        );
        if (this._bustImage) {
          this._bustImage.addLoadListener(() => {
            this.refreshSimpleStatus();
          });
        }
      } catch (error) {
        console.log("Failed to load bust image for:", sheet, idx);
        this._shouldUseBust = false;
      }
    }
  
    this.refreshSimpleStatus();
  };
  // MODIFIED: This now only draws the text and bust image
// MODIFIED: This function creates the animated background for Actors 2 & 3
Sprite_TekkenBar.prototype.createSimpleDisplayBackground = function () {
  // 1. Create the bitmap that will hold our square pattern
  const patternBitmap = new Bitmap(128, 128);
  const size = 16;
  const darkGold = "#3b3100";
  const black = "#0a0a0a";

  // 2. Fill the bitmap with the pattern
  for (let y = 0; y < patternBitmap.height; y += size) {
    for (let x = 0; x < patternBitmap.width; x += size) {
      const color = ((x + y) / size) % 2 === 0 ? darkGold : black;
      patternBitmap.fillRect(x, y, size, size, color);
    }
  }

  // 3. Create the TilingSprite for the moving background with reduced width
  const barGfxWidth = 220; // CHANGED: Reduced from 290 to 220 (70px narrower)
  const barGfxHeight = 68; // Height remains the same
  this._backgroundPattern = new TilingSprite(patternBitmap);
  
  // CHANGED: Position at the very edge of the screen
  this._backgroundPattern.move(
    -playerBarX, // Move to compensate for sprite's x position
    -barGfxHeight / 2,
    barGfxWidth,
    barGfxHeight
  );
  this._backgroundPattern.opacity = 128; // Make the pattern itself semi-transparent
  this.addChild(this._backgroundPattern);

  // 4. Create the semi-transparent overlay to darken the pattern
  const overlayBitmap = new Bitmap(barGfxWidth, barGfxHeight);
  overlayBitmap.fillAll("rgba(0, 0, 0, 0.6)"); // 60% black overlay
  this._backgroundOverlay = new Sprite(overlayBitmap);
  
  // CHANGED: Position overlay at the very edge of the screen
  this._backgroundOverlay.x = -playerBarX; // Move to compensate for sprite's x position
  this._backgroundOverlay.y = -barGfxHeight / 2;
  this.addChild(this._backgroundOverlay);
};

// MODIFIED: This now just creates the foreground elements for the simple display
// MODIFIED: This now just creates the foreground elements for the simple display
Sprite_TekkenBar.prototype.refreshSimpleStatus = function () {
  if (!this._simpleStatusDisplay || !this._battler) return;
  const bitmap = this._simpleStatusDisplay.bitmap;
  bitmap.clear();
  const b = this._battler;
  const name = b.name();
  const hp = b.hp;

  bitmap.fontFace = $gameSystem.mainFontFace();
  bitmap.fontSize = 22; // Slightly smaller font for better fit
  bitmap.fontBold = true;
  bitmap.outlineColor = "black";
  bitmap.outlineWidth = 4; // Bolder outline for readability
  const lineHeight = 24;

  // Positioning constants
  const barHeight = 68;
  const totalAreaHeight = this._simpleStatusDisplay.bitmap.height;
  const startY = (totalAreaHeight - barHeight) / 2; // Start drawing within the vertical center
  
  // CHANGED: Start drawing at the very edge (compensate for negative x position)
  let x = 5; // Small padding from the actual screen edge

  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    const bustSize = 64;
    const bustY = startY + (barHeight - bustSize) / 2; // Center bust vertically in the bar
    bitmap.blt(
      this._bustImage,
      0,
      0,
      this._bustImage.width,
      this._bustImage.height,
      x,
      bustY,
      bustSize,
      bustSize
    );

    // Position stats to the right of the bust
    const statX = x + bustSize + 15;

    // Calculate vertical positions for text to be centered
    const nameY = startY + 8;
    const hpY = nameY + lineHeight + 2;

    // Draw character name
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      statX,
      nameY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw HP
    const hpRate = hp / Math.max(1, b.mhp);
    let hpNumberColor = "#ffffff";
    if (hpRate <= 0.25) hpNumberColor = "#ff0000"; // Critical
    else if (hpRate <= 0.5) hpNumberColor = "#ffff00"; // Low

    bitmap.textColor = hpNumberColor;
    const hpText = `${hp}`;
    bitmap.drawText(
      hpText,
      statX,
      hpY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw "HP" label next to the number
    const hpTextWidth = bitmap.measureTextWidth(hpText);
    bitmap.textColor = playerHPColor1;
    bitmap.drawText(
      " HP",
      statX + hpTextWidth,
      hpY,
      bitmap.width - (statX + hpTextWidth),
      lineHeight,
      "left"
    );

    // Draw status tags on the far right
    const statusTags = getStatusTags(this._battler);
    if (statusTags.length > 0) {
      const statusX = statX + 130;
      const tagsText = statusTags.join(" ");
      bitmap.textColor = "#ffdd99";
      bitmap.drawText(
        `[${tagsText}]`,
        statusX,
        nameY,
        bitmap.width - statusX,
        lineHeight,
        "left"
      );
    }
  } else {
    // Fallback if no bust is available
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      x,
      startY + barHeight / 2 - lineHeight / 2,
      bitmap.width,
      lineHeight,
      "left"
    );
  }

  bitmap._baseTexture.update();
};

// MODIFIED: This now only draws the text and bust image
Sprite_TekkenBar.prototype.refreshSimpleStatus = function () {
  if (!this._simpleStatusDisplay || !this._battler) return;
  const bitmap = this._simpleStatusDisplay.bitmap;
  bitmap.clear();
  const b = this._battler;
  const name = b.name();
  const hp = b.hp;

  bitmap.fontFace = $gameSystem.mainFontFace();
  bitmap.fontSize = 22; // Slightly smaller font for better fit
  bitmap.fontBold = true;
  bitmap.outlineColor = "black";
  bitmap.outlineWidth = 4; // Bolder outline for readability
  const lineHeight = 24;

  // Positioning constants
  const barHeight = 68;
  const totalAreaHeight = this._simpleStatusDisplay.bitmap.height;
  const startY = (totalAreaHeight - barHeight) / 2; // Start drawing within the vertical center
  
  // CHANGED: Start drawing much closer to left edge (was 10, now 5)
  let x = 5; // Very close to left border

  if (this._shouldUseBust && this._bustImage && this._bustImage.isReady()) {
    const bustSize = 64;
    const bustY = startY + (barHeight - bustSize) / 2; // Center bust vertically in the bar
    bitmap.blt(
      this._bustImage,
      0,
      0,
      this._bustImage.width,
      this._bustImage.height,
      x,
      bustY,
      bustSize,
      bustSize
    );

    // Position stats to the right of the bust
    const statX = x + bustSize + 15;

    // Calculate vertical positions for text to be centered
    const nameY = startY + 8;
    const hpY = nameY + lineHeight + 2;

    // Draw character name
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      statX,
      nameY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw HP
    const hpRate = hp / Math.max(1, b.mhp);
    let hpNumberColor = "#ffffff";
    if (hpRate <= 0.25) hpNumberColor = "#ff0000"; // Critical
    else if (hpRate <= 0.5) hpNumberColor = "#ffff00"; // Low

    bitmap.textColor = hpNumberColor;
    const hpText = `${hp}`;
    bitmap.drawText(
      hpText,
      statX,
      hpY,
      bitmap.width - statX,
      lineHeight,
      "left"
    );

    // Draw "HP" label next to the number
    const hpTextWidth = bitmap.measureTextWidth(hpText);
    bitmap.textColor = playerHPColor1;
    bitmap.drawText(
      " HP",
      statX + hpTextWidth,
      hpY,
      bitmap.width - (statX + hpTextWidth),
      lineHeight,
      "left"
    );

    // Draw status tags on the far right
    const statusTags = getStatusTags(this._battler);
    if (statusTags.length > 0) {
      const statusX = statX + 130;
      const tagsText = statusTags.join(" ");
      bitmap.textColor = "#ffdd99";
      bitmap.drawText(
        `[${tagsText}]`,
        statusX,
        nameY,
        bitmap.width - statusX,
        lineHeight,
        "left"
      );
    }
  } else {
    // Fallback if no bust is available
    bitmap.textColor = "#ffffff";
    bitmap.drawText(
      name,
      x,
      startY + barHeight / 2 - lineHeight / 2,
      bitmap.width,
      lineHeight,
      "left"
    );
  }

  bitmap._baseTexture.update();
};
})();
