/*:
 * @target MZ
 * @plugindesc v1.2 Adds a "Floor List" window for selecting generated dungeon floors and setting variable #1. Fixes blank-on-open and skipping unexplored floors. <FloorListWindow>
 * @author ChatGPT
 *
 * @command showFloorList
 * @text Show Floor List
 * @desc Opens a window listing all generated dungeon floors. Selecting one sets Variable 1 to that floor; cancel closes the window.
 *
 * @help
 * • Place this plugin **below** DungeonFloorSystem.  
 * • Call the plugin command "Show Floor List" or via script:
 *   `PluginManager.callCommand(null, "FloorListWindow", "showFloorList", {});`
 *
 * Behavior:
 * - Shows F0 - Hypernet point at the top (sets variable 17 to 0 when selected).
 * - Shows Hypermetro (sets variable 17 to -1 when selected).
 * - If no dungeon is generated yet, shows only "you are not worthy" (select to close).
 * - Floors ≤ max explored show as "F12 – Meadows" (map display name).
 * - Floors > max show as "???" (greyed out, skipped when navigating).
 * - Selecting a floor sets game variable #1 to that floor number.
 * - Uses display name if available, otherwise falls back to map name.
 */

(() => {
    const PLUGIN_NAME   = "FloorListWindow";
    const MAX_FLOOR_VAR = window.DungeonFloorSystemParams?.maxFloorVariable || 0;
  
    PluginManager.registerCommand(PLUGIN_NAME, "showFloorList", () => {
        SceneManager.push(Scene_FloorList);
    });
  
    //--------------------------------------------------------------------------
    // Window_FloorList
    //--------------------------------------------------------------------------
    class Window_FloorList extends Window_Selectable {
        initialize() {
            const ww = Graphics.boxWidth * 0.5;
            const wh = Graphics.boxHeight * 0.8;
            const wx = (Graphics.boxWidth - ww) / 2;
            const wy = (Graphics.boxHeight - wh) / 2;
            const rect = new Rectangle(wx, wy, ww, wh);
            Window_Selectable.prototype.initialize.call(this, rect);
            this.makeItemList();
            this.refresh();       // draw items immediately
            this.select(0);       // move cursor to first enabled
            this.activate();
        }
        processOk() {
          const item = this._data[this.index()];
          if (item) {
            if (item.floor === 0) {
              // F0 - Hypernet point sets variable 17 to 0
              $gameVariables.setValue(17, 0);
            } else if (item.floor === -1) {
              // Hypermetro sets variable 17 to -1
              $gameVariables.setValue(17, -1);
            } else {
              // Regular floors: set variable 17 and turn on switch 29
              $gameVariables.setValue(17, item.floor);
              $gameSwitches.setValue(29, true);  // Activate switch 29 when a floor is selected
            }
          }
          SceneManager.pop();
      }
        makeItemList() {
            this._data = [];
            // Always add Hypermetro
            this._data.push({ floor: -1, label: "F-1 Hypermetro", isHypermetro: true });

            // Always add F0 - Hypernet point at the top
            this._data.push({ floor: 0, label: "F0 - Hypernet point", isHypernet: true });
            
            
            if (!$gameSystem.isDungeonGenerated()) {
                this._data.push({ floor: null, label: "No other floors discovered" });
            } else {
                const maxFloor = $gameVariables.value(MAX_FLOOR_VAR) || 0;
                const floors   = $gameSystem._dungeonFloors || [];
                for (let i = 1; i < floors.length; i++) {
                    if (i <= maxFloor) {
                        const mapId = floors[i];
                        const info  = $dataMapInfos[mapId] || {};
                        
                        // Use display name if available, otherwise fall back to name
                        const name = info.displayName || info.name || "Unknown";
                        
                        this._data.push({ floor: i, label: `F${i} - ${name}` });
                    } else {
                        this._data.push({ floor: i, label: "???" });
                    }
                }
            }
        }
  
        maxItems() {
            return this._data ? this._data.length : 0;
        }
  
        itemHeight() {
            return this.lineHeight();
        }
  
        drawItem(index) {
            const item = this._data[index];
            const rect = this.itemRect(index);
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(item.label, rect.x, rect.y, rect.width, "left");
            this.changePaintOpacity(true);
        }
  
        isEnabled(index) {
            const item = this._data[index];
            if (!item) return false;
            if (item.floor === null) return true;
            if (item.floor === 0 && item.isHypernet) return true; // F0 is always enabled
            if (item.floor === -1 && item.isHypermetro) return true; // Hypermetro is always enabled
            const maxFloor = $gameVariables.value(MAX_FLOOR_VAR) || 0;
            return item.floor <= maxFloor;
        }
  
        // Ensure cursor never lands on disabled entries
        select(index) {
            let idx       = index;
            const last    = this.maxItems() - 1;
            const current = this.index();
            const dir     = idx > current ? 1 : -1;
            while (idx >= 0 && idx <= last && !this.isEnabled(idx)) {
                idx += dir;
            }
            if (idx >= 0 && idx <= last && this.isEnabled(idx)) {
                Window_Selectable.prototype.select.call(this, idx);
            }
        }
  
        currentFloor() {
            const item = this._data[this.index()];
            return item ? item.floor : null;
        }
  
        currentItem() {
            return this._data[this.index()];
        }
    }
  
    //--------------------------------------------------------------------------
    // Scene_FloorList
    //--------------------------------------------------------------------------
    class Scene_FloorList extends Scene_MenuBase {
        create() {
            super.create();
            this._window = new Window_FloorList();
            this._window.setHandler("ok",     this.onOk.bind(this));
            this._window.setHandler("cancel", this.onCancel.bind(this));
            this.addWindow(this._window);
        }
  
        onOk() {
          this._floorListWindow.processOk();
  
        }
  
        onCancel() {
            this.popScene();
        }
    }
  })();