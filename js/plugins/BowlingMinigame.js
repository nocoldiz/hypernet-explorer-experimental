/*:
 * @target MZ
 * @plugindesc A Bowling Minigame against a CPU.
 * @author Gemini
 * @version 1.0.1
 *
 * @help BowlingMinigame.js
 *
 * This plugin adds a bowling minigame.
 * Use the "Start Bowling Game" plugin command to begin the minigame from an event.
 *
 * @param ---Sound Effects---
 * @default
 *
 * @param Roll Sound
 * @parent ---Sound Effects---
 * @desc The sound effect to play when the ball is rolled.
 * @type file
 * @dir audio/se/
 *
 * @param Pin Hit Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for pins being hit.
 * @type file
 * @dir audio/se/
 *
 * @param Strike Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a strike.
 * @type file
 * @dir audio/se/
 *
 * @param Spare Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a spare.
 * @type file
 * @dir audio/se/
 *
 * @param Gutter Sound
 * @parent ---Sound Effects---
 * @desc The sound effect for a gutter ball.
 * @type file
 * @dir audio/se/
 *
 * @param ---Game Variables---
 * @default
 *
 * @param Game Result Variable
 * @parent ---Game Variables---
 * @desc The game variable ID to store the result (1 for win, 2 for loss, 3 for draw).
 * @type variable
 * @default 0
 *
 * @command startBowlingGame
 * @text Start Bowling Game
 * @desc Opens the bowling minigame scene.
 */

(() => {
    'use strict';

    const pluginName = "BowlingMinigame";
    const parameters = PluginManager.parameters(pluginName);

    // --- Sound Parameters ---
    const rollSound = {
        name: parameters['Roll Sound'] || '',
        volume: 90,
        pitch: 100,
        pan: 0
    };
    const pinHitSound = {
        name: parameters['Pin Hit Sound'] || '',
        volume: 90,
        pitch: 100,
        pan: 0
    };
    const strikeSound = {
        name: parameters['Strike Sound'] || '',
        volume: 100,
        pitch: 100,
        pan: 0
    };
    const spareSound = {
        name: parameters['Spare Sound'] || '',
        volume: 100,
        pitch: 100,
        pan: 0
    };
    const gutterSound = {
        name: parameters['Gutter Sound'] || '',
        volume: 90,
        pitch: 100,
        pan: 0
    };

    // --- Game Variable Parameter ---
    const gameResultVariable = parseInt(parameters['Game Result Variable'], 10);

    // --- Plugin Command ---
    PluginManager.registerCommand(pluginName, "startBowlingGame", args => {
        SceneManager.push(Scene_Bowling);
    });
    class OscillatingSelector {
        constructor(min, max, speed) {
            this.min = min;
            this.max = max;
            this.speed = speed; // units per frame
            this.value = min;
            this.direction = 1;
            this.active = true;
        }
    
        update() {
            if (!this.active) return;
            this.value += this.direction * this.speed;
            if (this.value >= this.max) {
                this.value = this.max;
                this.direction = -1;
            } else if (this.value <= this.min) {
                this.value = this.min;
                this.direction = 1;
            }
        }
    
        stop() {
            this.active = false;
        }
    
        reset() {
            this.value = this.min;
            this.direction = 1;
            this.active = true;
        }
    }
    //-----------------------------------------------------------------------------
    // Scene_Bowling
    //
    // The scene class for the bowling minigame.

    function Scene_Bowling() {
        this.initialize(...arguments);
    }

    Scene_Bowling.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Bowling.prototype.constructor = Scene_Bowling;

    Scene_Bowling.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this._gameState = 'start'; // start, playerAim, playerPower, rolling, cpuTurn, scoring, end
        this._playerScores = Array(10).fill(null).map(() => [null, null]);
        this._cpuScores = Array(10).fill(null).map(() => [null, null]);
        this._currentFrame = 0;
        this._currentRoll = 0;
        this._isPlayerTurn = true;
        this._pins = [];
        this._pinPositions = [
            // x, y positions for the 10 pins
            { x: 408, y: 200 },
            { x: 393, y: 220 }, { x: 423, y: 220 },
            { x: 378, y: 240 }, { x: 408, y: 240 }, { x: 438, y: 240 },
            { x: 363, y: 260 }, { x: 393, y: 260 }, { x: 423, y: 260 }, { x: 453, y: 260 }
        ];
    };

    Scene_Bowling.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createBackground();
        this.createLane();
        this.createWindows();
        this.createBall();
        this.createPins();
        this.setupNewFrame();
    };

    Scene_Bowling.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._backgroundSprite.bitmap.gradientFillRect(0, 0, Graphics.width, Graphics.height, '#1a1a2e', '#16213e');
        this.addChild(this._backgroundSprite);
    };

    Scene_Bowling.prototype.createLane = function() {
        // Clean previous if any
        if (this._laneContainer) this.removeChild(this._laneContainer);
        this._laneContainer = new PIXI.Container();
        this.addChild(this._laneContainer);
    
        // Background gradient via Graphics
        const laneBg = new PIXI.Graphics();
        laneBg.beginFill(0x1a1a2e);
        laneBg.drawRect(0, 0, Graphics.width, Graphics.height);
        laneBg.endFill();
        this._laneContainer.addChild(laneBg);
    
        // Lane with subtle glow
        const lane = new PIXI.Graphics();
        const laneWidth = 200;
        const laneHeight = 400;
        const laneX = (Graphics.width - laneWidth) / 2;
        const laneY = 150;
        lane.lineStyle(0);
        lane.beginFill(0x8b4513);
        lane.drawRoundedRect(laneX, laneY, laneWidth, laneHeight, 10);
        lane.endFill();
        // Add inner shine
        lane.beginFill(0x9b5f1a, 0.2);
        lane.drawRoundedRect(laneX + 4, laneY + 4, laneWidth - 8, laneHeight - 8, 8);
        lane.endFill();
        this._laneContainer.addChild(lane);
    
        // Gutters
        const gutterL = new PIXI.Graphics();
        gutterL.beginFill(0x4b0082);
        gutterL.drawRect(laneX - 20, laneY, 20, laneHeight);
        gutterL.endFill();
        this._laneContainer.addChild(gutterL);
        const gutterR = new PIXI.Graphics();
        gutterR.beginFill(0x4b0082);
        gutterR.drawRect(laneX + laneWidth, laneY, 20, laneHeight);
        gutterR.endFill();
        this._laneContainer.addChild(gutterR);
    };

    Scene_Bowling.prototype.createWindows = function() {
        this._scoreWindow = new Window_BowlingScore(new Rectangle(0, 0, Graphics.width, 140));
        this.addWindow(this._scoreWindow);

        this._helpWindow = new Window_Help(new Rectangle(0, Graphics.height - 50, Graphics.width, 50));
        this.addWindow(this._helpWindow);

        this._powerMeterWindow = new Window_PowerMeter(new Rectangle(20, 200, 100, 300));
        this._powerMeterWindow.openness = 0;
        this.addWindow(this._powerMeterWindow);

        this._resultWindow = new Window_BowlingResult(new Rectangle((Graphics.width - 400) / 2, (Graphics.height - 200) / 2, 400, 200));
        this._resultWindow.openness = 0;
        this.addWindow(this._resultWindow);
    };

    Scene_Bowling.prototype.createBall = function() {
        if (this._ballSprite) this.removeChild(this._ballSprite);
        this._ballSprite = new PIXI.Container();
        const circle = new PIXI.Graphics();
        circle.beginFill(0x000000);
        circle.drawCircle(0, 0, 12);
        circle.endFill();
        // inner highlight
        const inner = new PIXI.Graphics();
        inner.beginFill(0x222222);
        inner.drawCircle(0, 0, 6);
        inner.endFill();
        this._ballSprite.addChild(circle);
        this._ballSprite.addChild(inner);
        this._ballSprite.pivot.set(0, 0);
        this.resetBall();
        this.addChild(this._ballSprite);
    
        // Trail container
        this._trailGraphics = new PIXI.Graphics();
        this.addChild(this._trailGraphics);
    };
    Scene_Bowling.prototype.createPins = function() {
        if (this._pinContainer) this.removeChild(this._pinContainer);
        this._pinContainer = new PIXI.Container();
        this.addChild(this._pinContainer);
        this._pins = [];
        for (let i = 0; i < 10; i++) {
            const pin = new PIXI.Container();
            const body = new PIXI.Graphics();
            body.beginFill(0xffffff);
            body.drawRoundedRect(-8, -32, 16, 32, 6);
            body.endFill();
            const stripe = new PIXI.Graphics();
            stripe.beginFill(0xff0000);
            stripe.drawRect(-6, -24, 12, 6);
            stripe.endFill();
            pin.addChild(body);
            pin.addChild(stripe);
            pin.originalX = this._pinPositions[i].x;
            pin.originalY = this._pinPositions[i].y;
            pin.x = pin.originalX;
            pin.y = pin.originalY;
            pin.visible = true;
            pin.knocked = false;
            this._pins.push(pin);
            this._pinContainer.addChild(pin);
        }
    };
    Scene_Bowling.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        this.updateGame();
    };

    Scene_Bowling.prototype.updateGame = function() {
        switch (this._gameState) {
            case 'playerAim':
                this.updatePlayerAim();
                break;
            case 'playerPower':
                this.updatePlayerPower();
                break;
            case 'rolling':
                this.updateRolling();
                break;
            case 'cpuTurn':
                this.updateCpuTurn();
                break;
            case 'scoring':
                this.updateScoring();
                break;
            case 'end':
                this.updateEnd();
                break;
        }
    };

    Scene_Bowling.prototype.setupNewFrame = function() {
        if (this._currentFrame >= 10) {
            this._gameState = 'end';
            this.showResult();
            return;
        }
        this._currentRoll = 0;
        this.resetPins();
        this.resetBall();
        this._scoreWindow.refresh(this._playerScores, this._cpuScores, this._currentFrame);
        this.startTurn();
    };
    Scene_Bowling.prototype.startTurn = function() {
        if (this._isPlayerTurn) {
            this._gameState = 'playerAim';
            this._helpWindow.setText("Press OK to lock angle.");
            // Setup Tekken-style selectors
            this._angleSelector = new OscillatingSelector(-60, 60, 1.2); // degrees offset
            this._powerSelector = new OscillatingSelector(0, 10, 0.3);
            this._aimLocked = false;
            this._powerLocked = false;
            this._showPowerMeter = false;
        } else {
            this._gameState = 'cpuTurn';
            this._cpuTurnState = 'aiming';
            this._cpuWait = 60;
            this._helpWindow.setText("CPU's Turn...");
        }
    };
    

    Scene_Bowling.prototype.resetPins = function() {
        this._pins.forEach(pin => {
            pin.x = pin.originalX;
            pin.y = pin.originalY;
            pin.visible = true;
            pin.knocked = false;
        });
    };

    Scene_Bowling.prototype.resetBall = function() {
        this._ballSprite.x = Graphics.width / 2;
        this._ballSprite.y = 500;
        this._ballSprite.visible = true;
        this._ballVelocity = { x: 0, y: 0 };
    };

    Scene_Bowling.prototype.updatePlayerAim = function() {
        this._angleSelector.update();
        const angleDeg = this._angleSelector.value;
        // Visualize aim: move ball preview based on angle
        const offsetX = Math.sin(angleDeg * Math.PI / 180) * 80;
        this._ballSprite.x = Graphics.width / 2 + offsetX;
        // Maybe add a small aiming line
        if (Input.isTriggered('ok')) {
            SoundManager.playOk();
            this._angleSelector.stop();
            this._aimLocked = true;
            this._gameState = 'playerPower';
            this._helpWindow.setText("Press OK to lock power.");
            this._powerSelector.reset();
            this._powerSelector.active = true;
            this._showPowerMeter = true;
            this._powerMeterWindow.open();
        }
        if (Input.isTriggered('cancel')) {
            SoundManager.playCancel();
            this.popScene();
        }
        // Optionally, draw a dynamic angle indicator (overriding default visuals)
        this.drawTekkenAimIndicator(angleDeg);
    };
    
    Scene_Bowling.prototype.drawTekkenAimIndicator = function(angleDeg) {
        if (!this._aimGraphics) {
            this._aimGraphics = new PIXI.Graphics();
            this.addChild(this._aimGraphics);
        }
        this._aimGraphics.clear();
        const centerX = Graphics.width / 2;
        const startY = 500;
        const length = 120;
        const rad = angleDeg * Math.PI / 180;
        const endX = centerX + Math.sin(rad) * length;
        const endY = startY - Math.cos(rad) * length;
        this._aimGraphics.lineStyle(4, 0xffffff, 0.6);
        this._aimGraphics.moveTo(centerX, startY);
        this._aimGraphics.lineTo(endX, endY);
        // small arrowhead
        this._aimGraphics.beginFill(0xffffff, 0.8);
        this._aimGraphics.drawCircle(endX, endY, 6);
        this._aimGraphics.endFill();
    };
    Scene_Bowling.prototype.updatePlayerPower = function() {
        this._powerSelector.update();
        // Update the meter window so it reflects the oscillating power
        this._powerMeterWindow._power = this._powerSelector.value; // reuse internal representation
        this._powerMeterWindow._powerDirection = this._powerSelector.direction;
        this._powerMeterWindow.refresh();
    
        if (Input.isTriggered('ok')) {
            SoundManager.playOk();
            this._powerSelector.stop();
            const lockedPower = 5 + this._powerSelector.value; // same base offset
            // Compute angle from locked selector
            const angleDeg = this._angleSelector.value;
            const startX = Graphics.width / 2 + Math.sin(angleDeg * Math.PI / 180) * 80;
            this.rollBall(startX, lockedPower);
            this._powerMeterWindow.close();
        }
        if (Input.isTriggered('cancel')) {
            SoundManager.playCancel();
            // Go back to aim stage
            this._gameState = 'playerAim';
            this._helpWindow.setText("Press OK to lock angle.");
            this._aimLocked = false;
            this._powerMeterWindow.close();
        }
    };

    Scene_Bowling.prototype.rollBall = function(startX, power) {
        const angle = (startX - (Graphics.width / 2)) * 0.05;
        this._ballVelocity.x = Math.sin(angle * (Math.PI / 180)) * power;
        this._ballVelocity.y = -power;
        this._gameState = 'rolling';
        this._helpWindow.setText("");
        if (rollSound.name) AudioManager.playSe(rollSound);
    };

    Scene_Bowling.prototype.updateRolling = function() {
    // trail
    if (this._ballSprite.visible) {
        this._trailGraphics.lineStyle(2, 0x888888, 0.4);
        this._trailGraphics.moveTo(this._ballSprite.x, this._ballSprite.y);
    }

    this._ballSprite.x += this._ballVelocity.x;
    this._ballSprite.y += this._ballVelocity.y;
    this._ballSprite.rotation += 0.1 * this._ballVelocity.y;

    // fade old trail (simple clear every few frames to avoid infinite)
    this._trailGraphics.clear();
        // Gutter ball check
        if (this._ballSprite.x < 308 || this._ballSprite.x > 508) {
            if (this._ballSprite.y > 150 && this._ballSprite.y < 550) {
                 if (gutterSound.name) AudioManager.playSe(gutterSound);
                 this._ballVelocity.x = 0;
                 this._ballVelocity.y = -10; // Continue rolling down gutter
                 this._ballSprite.x = this._ballSprite.x < 308 ? 298 : 518;
            }
        }

        // Check for pin collisions
        let hitPin = false;
        this._pins.forEach(pin => {
            if (pin.visible && !pin.knocked && this.isColliding(this._ballSprite, pin)) {
                this.knockOverPins(pin);
                hitPin = true;
            }
        });
        if(hitPin && pinHitSound.name) AudioManager.playSe(pinHitSound);


        if (this._ballSprite.y < 150) {
            this._ballSprite.visible = false;
            this._gameState = 'scoring';
        }
    };

    Scene_Bowling.prototype.isColliding = function(ball, pin) {
        const dx = ball.x - pin.x;
        const dy = ball.y - pin.y + 16; // adjust if needed
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 16 + 8; // ball radius + pin approximate radius
    };

    Scene_Bowling.prototype.knockOverPins = function(firstPin) {
        firstPin.knocked = true;
        // Simple chain reaction logic
        this._pins.forEach(pin => {
            if (pin.visible && !pin.knocked) {
                const dx = firstPin.x - pin.x;
                const dy = firstPin.y - pin.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 40 && Math.random() > 0.3) {
                    pin.knocked = true;
                }
            }
        });

        this._pins.forEach(pin => {
            if (pin.knocked) {
                pin.visible = false;
            }
        });
    };

    Scene_Bowling.prototype.updateCpuTurn = function() {
        if (this._cpuWait > 0) {
            this._cpuWait--;
            return;
        }

        if (this._cpuTurnState === 'aiming') {
            // Simple AI: Aim towards the center, with some randomness
            const targetX = (Graphics.width / 2) + (Math.random() * 60 - 30);
            this._ballSprite.x = targetX;
            this._cpuTurnState = 'powering';
            this._cpuWait = 60;
        } else if (this._cpuTurnState === 'powering') {
            // Simple AI: Choose a random power, usually high
            const power = 10 + Math.random() * 5;
            this.rollBall(this._ballSprite.x, power);
            this._cpuTurnState = ''; // Done
        }
    };

    Scene_Bowling.prototype.updateScoring = function() {
        let pinsDown = 0;
        this._pins.forEach(pin => {
            if (!pin.visible) {
                pinsDown++;
            }
        });
        
        let pinsThisRoll = pinsDown;
        if(this._currentRoll === 1){
            const firstRollScore = this._isPlayerTurn ? this._playerScores[this._currentFrame][0] : this._cpuScores[this._currentFrame][0];
            pinsThisRoll -= firstRollScore;
        }


        if (this._isPlayerTurn) {
            this._playerScores[this._currentFrame][this._currentRoll] = pinsThisRoll;
        } else {
            this._cpuScores[this._currentFrame][this._currentRoll] = pinsThisRoll;
        }

        this._scoreWindow.refresh(this._playerScores, this._cpuScores, this._currentFrame);

        // Strike
        if (this._currentRoll === 0 && pinsDown === 10) {
            if (strikeSound.name) AudioManager.playSe(strikeSound);
            this._helpWindow.setText("STRIKE!");
            this.endTurn();
        }
        // Spare
        else if (this._currentRoll === 1 && pinsDown === 10) {
            if (spareSound.name) AudioManager.playSe(spareSound);
            this._helpWindow.setText("SPARE!");
            this.endTurn();
        }
        // Second roll or open frame
        else if (this._currentRoll === 1) {
            this.endTurn();
        }
        // First roll, not a strike
        else {
            this._currentRoll = 1;
            this.resetBall();
            this.startTurn();
        }
    };
    
    Scene_Bowling.prototype.endTurn = function() {
        if (this._isPlayerTurn) {
            this._isPlayerTurn = false;
            this.resetPins();
            this.resetBall();
            this.startTurn();
        } else {
            this._isPlayerTurn = true;
            this._currentFrame++;
            this.setupNewFrame();
        }
    };
    
    Scene_Bowling.prototype.showResult = function() {
        const playerScore = this.calculateTotalScore(this._playerScores);
        const cpuScore = this.calculateTotalScore(this._cpuScores);
        let resultText;
        let resultValue = 0;

        if (playerScore > cpuScore) {
            resultText = "You Win!";
            resultValue = 1;
        } else if (cpuScore > playerScore) {
            resultText = "You Lose!";
            resultValue = 2;
        } else {
            resultText = "Draw!";
            resultValue = 3;
        }
        
        if (gameResultVariable > 0) {
            $gameVariables.setValue(gameResultVariable, resultValue);
        }

        this._resultWindow.setText(resultText, `Player: ${playerScore} - CPU: ${cpuScore}`);
        this._resultWindow.open();
        this._helpWindow.setText("Press OK or Cancel to exit.");
    };

    Scene_Bowling.prototype.updateEnd = function() {
        if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
            this.popScene();
        }
    };

    Scene_Bowling.prototype.calculateTotalScore = function(scores) {
        let total = 0;
        for (let i = 0; i < 10; i++) {
            const frame = scores[i];
            if (!frame) continue;

            const roll1 = frame[0];
            const roll2 = frame[1];

            if (roll1 === 10) { // Strike
                total += 10 + this.getStrikeBonus(scores, i);
            } else if (roll1 + roll2 === 10) { // Spare
                total += 10 + this.getSpareBonus(scores, i);
            } else {
                total += (roll1 || 0) + (roll2 || 0);
            }
        }
        return total;
    };

    Scene_Bowling.prototype.getStrikeBonus = function(scores, frameIndex) {
        if (frameIndex >= 9) return 0; // Simplified for now
        const nextFrame = scores[frameIndex + 1];
        if (!nextFrame) return 0;
        
        if (nextFrame[0] === 10) { // Another strike
             if (frameIndex >= 8) return 0;
             const frameAfter = scores[frameIndex + 2];
             return 10 + (frameAfter ? frameAfter[0] : 0);
        }
        return (nextFrame[0] || 0) + (nextFrame[1] || 0);
    };

    Scene_Bowling.prototype.getSpareBonus = function(scores, frameIndex) {
        if (frameIndex >= 9) return 0;
        const nextFrame = scores[frameIndex + 1];
        return nextFrame ? (nextFrame[0] || 0) : 0;
    };


    //-----------------------------------------------------------------------------
    // Window_BowlingScore
    //
    // The window for displaying the bowling scores.

    function Window_BowlingScore() {
        this.initialize(...arguments);
    }

    Window_BowlingScore.prototype = Object.create(Window_Base.prototype);
    Window_BowlingScore.prototype.constructor = Window_BowlingScore;

    Window_BowlingScore.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
    };

    Window_BowlingScore.prototype.refresh = function(playerScores, cpuScores, currentFrame) {
        this.contents.clear();
        this.drawScores("Player", playerScores, 0);
        this.drawScores("CPU", cpuScores, this.lineHeight());
        this._playerTotal = this.calculateTotalScore(playerScores);
        this._cpuTotal = this.calculateTotalScore(cpuScores);
        this.drawTotalScores(this._playerTotal, this._cpuTotal, currentFrame);
    };
    
    Window_BowlingScore.prototype.drawTotalScores = function(playerTotal, cpuTotal, currentFrame) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("TOTAL", this.width - 200, 0, 80, 'left');
        this.drawText("FRAME", this.width - 200, this.lineHeight(), 80, 'left');
        
        this.resetTextColor();
        this.drawText(playerTotal, this.width - 120, 0, 80, 'right');
        this.drawText(cpuTotal, this.width - 120, this.lineHeight(), 80, 'right');
        this.drawText(currentFrame + 1, this.width - 120, this.lineHeight() * 2, 80, 'right');
    };

    Window_BowlingScore.prototype.drawScores = function(name, scores, y) {
        const boxWidth = (this.contentsWidth() - 280) / 10;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, 4, y, 100);
        this.resetTextColor();

        let runningTotal = 0;
        for (let i = 0; i < 10; i++) {
            const x = 80 + i * boxWidth;
            this.drawFrame(x, y, scores, i);
            runningTotal += this.getFrameScore(scores, i);
            if(scores[i][0] !== null) {
                this.drawText(runningTotal, x, y + this.lineHeight(), boxWidth, 'center');
            }
        }
    };
    
    Window_BowlingScore.prototype.getFrameScore = function(scores, frameIndex) {
        const frame = scores[frameIndex];
        if (frame[0] === null) return 0;
        
        if (frame[0] === 10) { // Strike
            return 10 + this.getStrikeBonus(scores, frameIndex);
        }
        if (frame[0] + frame[1] === 10) { // Spare
            return 10 + this.getSpareBonus(scores, frameIndex);
        }
        return (frame[0] || 0) + (frame[1] || 0);
    };

    Window_BowlingScore.prototype.drawFrame = function(x, y, scores, i) {
        const boxWidth = (this.contentsWidth() - 280) / 10;
        const smallBoxWidth = boxWidth / 2;
        this.contents.strokeRect(x, y, boxWidth, this.lineHeight());
        this.contents.strokeRect(x + smallBoxWidth, y, smallBoxWidth, this.lineHeight() / 2);
        
        const frame = scores[i];
        if (frame[0] !== null) {
            if (frame[0] === 10) { // Strike
                this.drawText("X", x + smallBoxWidth, y, smallBoxWidth, 'center');
            } else {
                this.drawText(frame[0], x, y, smallBoxWidth, 'center');
                if (frame[1] !== null) {
                    if (frame[0] + frame[1] === 10) { // Spare
                        this.drawText("/", x + smallBoxWidth, y, smallBoxWidth, 'center');
                    } else {
                        this.drawText(frame[1], x + smallBoxWidth, y, smallBoxWidth, 'center');
                    }
                }
            }
        }
    };
    
    // Inherit score calculation logic from scene for consistency
    Window_BowlingScore.prototype.calculateTotalScore = Scene_Bowling.prototype.calculateTotalScore;
    Window_BowlingScore.prototype.getStrikeBonus = Scene_Bowling.prototype.getStrikeBonus;
    Window_BowlingScore.prototype.getSpareBonus = Scene_Bowling.prototype.getSpareBonus;


    //-----------------------------------------------------------------------------
    // Window_PowerMeter
    //
    // The window for the power meter.

    function Window_PowerMeter() {
        this.initialize(...arguments);
    }

    Window_PowerMeter.prototype = Object.create(Window_Base.prototype);
    Window_PowerMeter.prototype.constructor = Window_PowerMeter;

    Window_PowerMeter.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._power = 0;
        this._powerDirection = 1;
    };

    Window_PowerMeter.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this._power += this._powerDirection * 0.5;
        if (this._power > 10) {
            this._power = 10;
            this._powerDirection = -1;
        } else if (this._power < 0) {
            this._power = 0;
            this._powerDirection = 1;
        }
        this.refresh();
    };

    Window_PowerMeter.prototype.refresh = function() {
        this.contents.clear();
        this.drawText("Power", 0, 0, this.contentsWidth(), 'center');
        const meterHeight = this.contentsHeight() - this.lineHeight() * 2;
        const meterY = this.lineHeight();
        const powerHeight = (meterHeight / 10) * this._power;
        this.contents.fillRect(10, meterY + meterHeight - powerHeight, this.contentsWidth() - 20, powerHeight, ColorManager.powerUpColor());
        this.contents.strokeRect(10, meterY, this.contentsWidth() - 20, meterHeight);
    };

    Window_PowerMeter.prototype.getPower = function() {
        return 5 + this._power; // Base power + meter power
    };

    //-----------------------------------------------------------------------------
    // Window_BowlingResult
    //
    // The window for displaying the game result.

    function Window_BowlingResult() {
        this.initialize(...arguments);
    }

    Window_BowlingResult.prototype = Object.create(Window_Base.prototype);
    Window_BowlingResult.prototype.constructor = Window_BowlingResult;

    Window_BowlingResult.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text1 = "";
        this._text2 = "";
    };

    Window_BowlingResult.prototype.setText = function(text1, text2) {
        this._text1 = text1;
        this._text2 = text2;
        this.refresh();
    };

    Window_BowlingResult.prototype.refresh = function() {
        this.contents.clear();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(this._text1, 0, this.lineHeight() / 2, this.contentsWidth(), 'center');
        this.resetTextColor();
        this.drawText(this._text2, 0, this.lineHeight() * 1.5, this.contentsWidth(), 'center');
    };

})();
