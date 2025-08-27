/*:
 * @target MZ
 * @plugindesc Adds 2D platformer controls (Super Mario style) on maps tagged <Platform>, with refined animation, ladder climbing, event triggers, and region-based passability.
 * @author GPT-Starfleet
 *
 * @help PlatformerMode.js
 *
 * Place this in your project's js/plugins folder and enable it.
 *
 * Map Note Tag:
 *   <Platform>
 *
 * Mechanics:
 *   - Left/Right: ←/→ keys (or assignable)
 *   - Jump: Space (disabled when touching/near events)
 *   - Wall-jump when pressing Space against a wall (regionId=10 or any blocking tile)
 *   - Gravity, max fall speed, collision with walls and ladders
 *   - Region 5 always passable; Region 10 and impassable tiles block
 *   - Followers follow the exact path with a short delay, matching facing direction
 *   - Animation: slower walk-cycle when moving; idle frame during jumps
 *   - Ladder climbing: press Up on ladder tiles
 *   - Action button (Space) triggers adjacent events; touch triggers on contact
 *
 * Configuration (at top of file):
 *   TILE_SIZE       : pixel size of one tile (default 48)
 *   GRAVITY         : pixels per frame²
 *   MOVE_SPEED      : pixels per frame
 *   JUMP_SPEED      : initial jump velocity (pixels per frame)
 *   MAX_FALL_SPEED  : terminal velocity (pixels per frame)
 *   WALL_JUMP_X     : horizontal boost speed on wall-jump
 *   WALL_JUMP_Y     : vertical boost speed on wall-jump
 *   FOLLOWER_DELAY  : frames between each follower in the path history
 *   ANIM_SPEED      : frames per walk-frame advance (higher = slower)
 */
(() => {
  const TILE_SIZE      = 48;
  const GRAVITY        = 1.2;
  const MOVE_SPEED     = 4;
  const JUMP_SPEED     = -16;
  const MAX_FALL_SPEED = 12;
  const WALL_JUMP_X    = 6;
  const WALL_JUMP_Y    = -14;
  const FOLLOWER_DELAY = 10;
  const ANIM_SPEED     = 12;

  const isPlatformMap = () => !!$dataMap.meta.Platform;
  let _positionHistory = [];

  // Cache original character animation
  const _Character_updateAnimation = Game_Character.prototype.updateAnimation;

  // Extend Game_Player init
  const _GP_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    _GP_initMembers.call(this);
    this._vx = 0;
    this._vy = 0;
    this._isJumping = false;
    this._animCounter = 0;
  };

  // Override update
  const _GP_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    if (isPlatformMap()) {
      this.updatePlatformer();
    } else {
      _GP_update.call(this, sceneActive);
    }
  };

  // Main platform update
  Game_Player.prototype.updatePlatformer = function() {
    this.updateInput();
    this.applyPhysics();
    this.updatePosition();
    this.updateAnimation();
    this.updateFollowersPath();
    this.checkEventTrigger();
    this.setMovementSuccess(true);
  };

  // Scoped animation override
  Game_Player.prototype.updateAnimation = function() {
    if (!isPlatformMap()) {
      _Character_updateAnimation.call(this);
      return;
    }
    if (this.isOnLadder()) {
      this.setImage(this._characterName, this._characterIndex);
      return;
    }
    if (this._vx !== 0 && !this._isJumping) {
      this._animCounter++;
      if (this._animCounter >= ANIM_SPEED) {
        this._pattern = (this._pattern + 1) % 3;
        this._animCounter = 0;
      }
    } else {
      this._pattern = 1;
      this._animCounter = 0;
    }
  };

  // Input handling
  Game_Player.prototype.updateInput = function() {
    // Ladder climb
    if (Input.isPressed('up') && this.isOnLadder()) {
      this._vy = -MOVE_SPEED;
      this.setDirection(8);
      return;
    }
    // Horizontal move
    if (Input.isPressed('left')) {
      this._vx = -MOVE_SPEED;
      this.setDirection(4);
    } else if (Input.isPressed('right')) {
      this._vx = MOVE_SPEED;
      this.setDirection(6);
    } else {
      this._vx = 0;
    }
    // Jump (blocked near/under events)
    if (Input.isTriggered('ok')) {
      if (!this.isNearEvent() && !this.isOnLadder()) {
        if (this.isTouchingFloor()) {
          this._vy = JUMP_SPEED;
          this._isJumping = true;
        } else if (this.isTouchingWall()) {
          this._vy = WALL_JUMP_Y;
          this._vx = this.isTouchingLeftWall() ? WALL_JUMP_X : -WALL_JUMP_X;
          this.setDirection(this._vx < 0 ? 4 : 6);
          this._isJumping = true;
        }
      }
    }
  };

  // Physics
  Game_Player.prototype.applyPhysics = function() {
    if (!this.isOnLadder()) {
      this._vy = Math.min(this._vy + GRAVITY, MAX_FALL_SPEED);
    }
  };

  // Position update & collision
  Game_Player.prototype.updatePosition = function() {
    // Horizontal
    if (this._vx !== 0) {
      const signX = Math.sign(this._vx);
      const nextX = this._realX + signX * (Math.abs(this._vx) / TILE_SIZE);
      if (!this._isBlockedAt(nextX, this._realY)) {
        this._realX = nextX;
      } else {
        this._vx = 0;
      }
    }
    // Vertical
    if (this._vy !== 0) {
      const signY = Math.sign(this._vy);
      const nextY = this._realY + signY * (Math.abs(this._vy) / TILE_SIZE);
      if (!this._isBlockedAt(this._realX, nextY)) {
        this._realY = nextY;
      } else {
        this._vy = 0;
        this._isJumping = false;
      }
    }
    this._x = Math.round(this._realX);
    this._y = Math.round(this._realY);
    this._followers._data.forEach(f => f._characterName = this._characterName);
  };

  // Ladder check
  Game_Player.prototype.isOnLadder = function() {
    return $gameMap.isLadder(Math.floor(this._realX), Math.floor(this._realY));
  };

  // Event proximity
  Game_Player.prototype.isNearEvent = function() {
    return $gameMap.events().some(ev => Math.abs(ev.x - this.x) + Math.abs(ev.y - this.y) <= 1);
  };

  // Trigger events
  Game_Player.prototype.checkEventTrigger = function() {
    // Action button
    if (Input.isTriggered('ok')) {
      $gameMap.events().forEach(ev => {
        if (Math.abs(ev.x - this.x) + Math.abs(ev.y - this.y) <= 1) {
          ev.start();
        }
      });
    }
    // Touch trigger
    const events = $gameMap.eventsXy(this.x, this.y);
    events.forEach(ev => ev.start());
  };

  // Collision check with region overrides
  Game_Player.prototype._isBlockedAt = function(rx, ry) {
    const tx = Math.floor(rx);
    const ty = Math.floor(ry);
    // Region 5 always passable
    if ($gameMap.regionId(tx, ty) === 5) return false;
    // Default passability
    if (!$gameMap.isPassable(tx, ty, this.direction())) return true;
    // Region 10 blocks
    if ($gameMap.regionId(tx, ty) === 10) return true;
    return false;
  };

  // Floor/wall checks
  Game_Player.prototype.isTouchingFloor = function() {
    return this._isBlockedAt(this._realX, this._realY + 0.51);
  };
  Game_Player.prototype.isTouchingWall = function() {
    return this.isTouchingLeftWall() || this.isTouchingRightWall();
  };
  Game_Player.prototype.isTouchingLeftWall = function() {
    return this._isBlockedAt(this._realX - 0.51, this._realY);
  };
  Game_Player.prototype.isTouchingRightWall = function() {
    return this._isBlockedAt(this._realX + 0.51, this._realY);
  };

  // Followers pathing
  Game_Player.prototype.updateFollowersPath = function() {
    _positionHistory.push({ x: this._realX, y: this._realY, dir: this.direction() });
    const maxHistory = FOLLOWER_DELAY * this._followers._data.length + 1;
    if (_positionHistory.length > maxHistory) _positionHistory.shift();
    this._followers._data.forEach((follower, idx) => {
      const i = _positionHistory.length - 1 - FOLLOWER_DELAY * (idx + 1);
      if (i >= 0) {
        const rec = _positionHistory[i];
        follower._realX = rec.x;
        follower._realY = rec.y;
        follower._x = Math.round(rec.x);
        follower._y = Math.round(rec.y);
        follower.setDirection(rec.dir);
      }
    });
  };

})();
