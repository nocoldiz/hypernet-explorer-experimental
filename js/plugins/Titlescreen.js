    //=============================================================================
    // WitcherStyleTitle.js
    //=============================================================================

    /*:
    * @target MZ
    * @plugindesc Replaces the title screen command window with a vertical, Witcher-style menu and adds a floating-network of connected data cards with fade-in mesh lines.
    * @author Gemini
    * @version 1.4.3
    *
    * @param windowWidth
    * @text Window Width (%)
    * @desc The width of the command window as a percentage of the screen width.
    * @type number
    * @default 35
    *
    * @param windowX
    * @text Window X Offset (%)
    * @desc Horizontal center position of the command window as a percentage of the screen width.
    * @type number
    * @default 20
    *
    * @param windowPadding
    * @text Window Padding
    * @desc Padding inside the command window.
    * @type number
    * @default 18
    *
    * @param commandPadding
    * @text Command Padding
    * @desc The space to the left of the command text.
    * @type number
    * @default 36
    *
    * @help
    * -----------------------------------------------------------------------------
    * Introduction
    * -----------------------------------------------------------------------------
    * This plugin replaces the default title screen command window with a full-height,
    * Witcher-style column menu on the left side and spawns floating cards below
    * that rise up, showing random enemies, skills, items, weapons, or armor from the
    * game's database. Each card is connected to every other with gold lines that
    * smoothly fade in and out, forming a dynamic mesh.
    *
    * Enhanced features:
    * - Animated ASCII title "Hypernet Explorer" with shimmer effect
    * - Skills now show icons
    * - Enemies display battler images
    * - Cards auto-resize based on content
    * - Terminal-style interface design with gold theme
    * - Cards appear earlier on screen
    * - Left-aligned command window text
    * - Simple black semi-transparent background with golden border
    * - ID-based references instead of icon/sprite numbers
    *
    * No plugin commands.
    *
    */

    (() => {
        const pluginName = "WitcherStyleTitle";
        const params = PluginManager.parameters(pluginName);
        const toPct = v => Number(v) / 100;
        const windowWidthPct = Number(params.windowWidth) || 35;
        const windowXOffsetPct = Number(params.windowX) || 20;
        const windowPadding = Number(params.windowPadding) || 18;
        const commandPadding = Number(params.commandPadding) || 36;

        // -------------------------------------------------------------------------
        // ASCII Title Animation Class
        // -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// ASCII Title Animation Class with Sand Effect
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// ASCII Title Animation Class with Sand Effect
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// ASCII Title Animation Class with Reversed Sand Effect (Building Up)
// -------------------------------------------------------------------------
class ASCIITitle extends PIXI.Container {
    constructor() {
        super();
        this._sandTimer = 0;
        this._sandInterval = 60; // Start composition effect after 1 second (60fps * 1)
        this._composeDelay = 0; // Counter for staggered composition
        this._createTitle();
    }
    
    _createTitle() {
        const asciiText = [
            "██╗  ██╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ██╗███████╗████████╗",
            "██║  ██║╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝",
            "███████║ ╚████╔╝ ██████╔╝█████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   ",
            "██╔══██║  ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   ",
            "██║  ██║   ██║   ██║     ███████╗██║  ██║██║ ╚████║███████╗   ██║   ",
            "╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ",
            "",
            "███████╗██╗  ██╗██████╗ ██╗      ██████╗ ██████╗ ███████╗██████╗ ",
            "██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔═══██╗██╔══██╗██╔════╝██╔══██╗",
            "█████╗   ╚███╔╝ ██████╔╝██║     ██║   ██║██████╔╝█████╗  ██████╔╝",
            "██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗",
            "███████╗██╔╝ ██╗██║     ███████╗╚██████╔╝██║  ██║███████╗██║  ██║",
            "╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝"
        ];
        
        this._titleCharacters = [];
        this._characterWidth = 7.2; // Approximate character width
        this._characterHeight = 14;
        this._compositionActive = false;
        this._composeQueue = []; // Queue of characters waiting to fly up and compose
        
        const titleStyle = new PIXI.TextStyle({
            fontFamily: 'Terminus, Courier New, monospace',
            fill: '#FFD700',
            fontSize: 12,
            fontWeight: 'bold'
        });
        
        // Create individual character text objects
        asciiText.forEach((line, lineIndex) => {
            for (let charIndex = 0; charIndex < line.length; charIndex++) {
                const char = line[charIndex];
                if (char !== ' ' && char !== '') {
                    // Create background for character
                    const charBg = new PIXI.Graphics();
                    charBg.beginFill(0x000000, 0.8);
                    charBg.drawRect(0, 0, this._characterWidth, this._characterHeight);
                    charBg.endFill();
                    
                    // Create character text
                    const charText = new PIXI.Text(char, titleStyle);
                    
                    // Calculate final position (where character should end up)
                    const finalX = charIndex * this._characterWidth;
                    const finalY = lineIndex * this._characterHeight;
                    
                    // Start position (bottom of screen with random spread)
                    const startX = finalX + (Math.random() - 0.5) * Graphics.width * 0.3; // Spread horizontally
                    const startY = Graphics.height + Math.random() * 200; // Start below screen
                    
                    charBg.x = startX;
                    charBg.y = startY;
                    charText.x = startX;
                    charText.y = startY;
                    
                    // Store character info for composition effect
                    const charInfo = {
                        bg: charBg,
                        text: charText,
                        startX: startX,
                        startY: startY,
                        finalX: finalX,
                        finalY: finalY,
                        currentX: startX,
                        currentY: startY,
                        originalColor: 0xFFD700,
                        charIndex: charIndex,
                        lineIndex: lineIndex,
                        globalIndex: lineIndex * 70 + charIndex,
                        // Composition physics properties
                        flying: false,
                        flySpeed: 0,
                        gravity: -0.15 - Math.random() * 0.1, // Negative gravity (upward force)
                        horizontalDrift: (finalX - startX) * 0.02, // Drift toward final position
                        inPosition: false,
                        rotationSpeed: (Math.random() - 0.5) * 0.03, // Rotation while flying
                        rotation: (Math.random() - 0.5) * Math.PI * 0.5, // Start with random rotation
                        targetRotation: 0, // End with no rotation
                        // Animation progress (0 = start position, 1 = final position)
                        progress: 0,
                        animationSpeed: 0.008 + Math.random() * 0.005 // Slightly different speeds
                    };
                    
                    this._titleCharacters.push(charInfo);
                    
                    this.addChild(charBg);
                    this.addChild(charText);
                }
            }
        });
        
        // Center the entire title container
        const maxLineLength = Math.max(...asciiText.map(line => line.length));
        const titleWidth = maxLineLength * this._characterWidth;
        const titleHeight = asciiText.length * this._characterHeight;
        
        this.x = (Graphics.width - titleWidth) / 2;
        this.y = 20; // Fixed position at top
        
        // Prepare characters for gradual composition (reverse order: top to bottom, right to left)
        this._prepareComposeOrder();
    }
    
    _prepareComposeOrder() {
        // Sort characters for composition: top lines first, then right to left
        // Add randomness to make it look more natural
        const sortedChars = [...this._titleCharacters].sort((a, b) => {
            // Primary sort: top lines first (lower line index = higher on screen = composes first)
            if (a.lineIndex !== b.lineIndex) {
                return a.lineIndex - b.lineIndex;
            }
            // Secondary sort: right to left with some randomness
            const randomOffset = (Math.random() - 0.5) * 5;
            return (b.charIndex - a.charIndex) + randomOffset;
        });
        
        // Create compose queue with delays
        this._composeQueue = sortedChars.map((char, index) => ({
            char: char,
            composeDelay: index * 2 + Math.random() * 8 // Stagger the composition
        }));
    }
    
    update() {
        this._sandTimer++;
        
        // Start composition effect after delay
        if (this._sandTimer >= this._sandInterval && !this._compositionActive) {
            this._compositionActive = true;
        }
        
        if (this._compositionActive) {
            this._updateCompositionEffect();
        }
    }
    
    _updateCompositionEffect() {
        // Check if any characters should start flying up
        this._composeQueue.forEach(queueItem => {
            if (!queueItem.char.flying && !queueItem.char.inPosition && queueItem.composeDelay <= 0) {
                queueItem.char.flying = true;
                queueItem.char.flySpeed = Math.random() * 0.5 + 0.5; // Start with some upward speed
            } else if (queueItem.composeDelay > 0) {
                queueItem.composeDelay--;
            }
        });
        
        // Update all flying/composing characters
        this._titleCharacters.forEach(char => {
            if (char.flying && !char.inPosition) {
                // Smoothly animate toward final position using easing
                char.progress = Math.min(char.progress + char.animationSpeed, 1);
                
                // Use easeOutBack easing for a nice settling effect
                const t = char.progress;
                const c1 = 1.70158;
                const c3 = c1 + 1;
                const easedProgress = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                
                // Interpolate position
                char.currentX = char.startX + (char.finalX - char.startX) * easedProgress;
                char.currentY = char.startY + (char.finalY - char.startY) * easedProgress;
                
                // Interpolate rotation (settle to 0)
                char.rotation = char.rotation * (1 - easedProgress);
                
                // Check if character has reached its final position
                if (char.progress >= 1) {
                    char.inPosition = true;
                    char.flying = false;
                    char.currentX = char.finalX;
                    char.currentY = char.finalY;
                    char.rotation = 0;
                }
                
                // Update visual position
                char.bg.x = char.currentX;
                char.bg.y = char.currentY;
                char.text.x = char.currentX;
                char.text.y = char.currentY;
                
                // Apply rotation
                char.bg.rotation = char.rotation;
                char.text.rotation = char.rotation;
                
            } else if (!char.flying && !char.inPosition) {
                // Characters waiting to fly might have slight movement at bottom
                const waitingTime = this._sandTimer - this._sandInterval;
                const bobAmount = Math.sin(Date.now() * 0.005 + char.globalIndex * 0.1) * 2;
                const driftAmount = Math.sin(Date.now() * 0.003 + char.globalIndex * 0.2) * 1;
                
                char.bg.x = char.startX + driftAmount;
                char.bg.y = char.startY + bobAmount;
                char.text.x = char.startX + driftAmount;
                char.text.y = char.startY + bobAmount;
                
                // Slight rotation while waiting
                const rotationAmount = Math.sin(Date.now() * 0.004 + char.globalIndex * 0.15) * 0.1;
                char.bg.rotation = rotationAmount;
                char.text.rotation = rotationAmount;
                
            } else if (char.inPosition) {
                // Characters in final position might have very subtle pulse or glow effect
                const pulse = 1 + Math.sin(Date.now() * 0.002 + char.globalIndex * 0.1) * 0.05;
                char.text.alpha = pulse;
                char.bg.alpha = pulse * 0.8;
            }
        });
    }
}

        // -------------------------------------------------------------------------
        // Title window layout with left-aligned text and simple styling
        // -------------------------------------------------------------------------
        const _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
        Scene_Title.prototype.createCommandWindow = function() {
            _Scene_Title_createCommandWindow.call(this);
            const ww = Graphics.width * toPct(windowWidthPct);
            const wx = Graphics.width * toPct(windowXOffsetPct) - ww / 2;
            
            // Calculate required height based on number of items
            const itemHeight = this._commandWindow.itemHeight();
            const numItems = this._commandWindow.maxItems();
            const requiredHeight = numItems * itemHeight + windowPadding * 2;
            
            // Center the window vertically, but account for the ASCII title
            const titleOffset = 200; // Space for the ASCII title
            const wy = titleOffset + (Graphics.height - requiredHeight - titleOffset) / 2;
            
            this._commandWindow.move(wx, wy);
            this._commandWindow.width = ww;
            this._commandWindow.height = requiredHeight;
            this._commandWindow.padding = windowPadding;
            this._commandWindow._itemPadding = commandPadding;
            
            // Apply custom styling after window is created
            this._applyCustomWindowStyle();
        };
        
        // Add custom styling method to Scene_Title
        Scene_Title.prototype._applyCustomWindowStyle = function() {
            // Make window background transparent
            this._commandWindow.opacity = 0;
            
            // Create custom background graphics
            if (!this._customWindowBg) {
                this._customWindowBg = new PIXI.Graphics();
                this.addChildAt(this._customWindowBg, 0);
            }
            
            // Update custom background
            this._updateCustomWindowBackground();
        };
        
        Scene_Title.prototype._updateCustomWindowBackground = function() {
            if (!this._customWindowBg || !this._commandWindow) return;
            
            this._customWindowBg.clear();
            
            // Draw simple black semi-transparent background
            this._customWindowBg.beginFill(0x000000, 0.7);
            this._customWindowBg.drawRect(
                this._commandWindow.x, 
                this._commandWindow.y, 
                this._commandWindow.width, 
                this._commandWindow.height
            );
            this._customWindowBg.endFill();
            
            // Draw golden border
            this._customWindowBg.lineStyle(2, 0xFFD700, 1);
            this._customWindowBg.drawRect(
                this._commandWindow.x + 1, 
                this._commandWindow.y + 1, 
                this._commandWindow.width - 2, 
                this._commandWindow.height - 2
            );
        };
        
        // Update background when window refreshes
        const _Scene_Title_update = Scene_Title.prototype.update;
        Scene_Title.prototype.update = function() {
            _Scene_Title_update.call(this);
            
            // Update ASCII title
            if (this._asciiTitle) {
                this._asciiTitle.update();
            }
            
            if (this._customWindowBg && this._commandWindow) {
                this._updateCustomWindowBackground();
            }
            
            // Update all cards
            if (this._floatingContainer) {
                this._floatingContainer.children.forEach(c => c.update && c.update());
            }
            
            // Spawn new cards more frequently
            if (Math.random() < 0.008 && this._floatingContainer) {
                const newCard = new FloatingCard(getRandomData(), this._cardIdCounter++);
                this._floatingContainer.addChild(newCard);
            }
            
            if (!this._floatingContainer) return;
            
            const cards = this._floatingContainer.children;
            const currentPairs = new Set();
            
            // Generate all current card pair combinations using their unique IDs
            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const cardA = cards[i];
                    const cardB = cards[j];
                    
                    // Create a consistent key using the smaller ID first
                    const key = cardA._cardId < cardB._cardId 
                        ? `${cardA._cardId}_${cardB._cardId}` 
                        : `${cardB._cardId}_${cardA._cardId}`;
                    
                    currentPairs.add(key);
                    
                    // Create new connection if it doesn't exist
                    if (!this._connections[key]) {
                        this._connections[key] = { 
                            a: cardA, 
                            b: cardB, 
                            alpha: 0,
                            fadingIn: true
                        };
                    }
                }
            }
            
            const fadeSpeed = 0.03; // Slightly faster fade for better visibility
            
            // Update all connections
            for (const key in this._connections) {
                const conn = this._connections[key];
                
                if (currentPairs.has(key)) {
                    // Connection should exist - fade in
                    if (conn.fadingIn) {
                        conn.alpha = Math.min(conn.alpha + fadeSpeed, 0.4); // Higher max alpha
                        if (conn.alpha >= 0.4) {
                            conn.fadingIn = false;
                        }
                    }
                } else {
                    // Connection should not exist - fade out
                    conn.fadingIn = false;
                    conn.alpha -= fadeSpeed;
                    if (conn.alpha <= 0) {
                        delete this._connections[key];
                    }
                }
            }
            
            // Draw all connection lines
            if (this._lineGraphics) {
                this._lineGraphics.clear();
                for (const key in this._connections) {
                    const { a, b, alpha } = this._connections[key];
                    
                    // Make sure both cards still exist
                    if (a && b && a.parent && b.parent) {
                        // Gold connecting lines instead of green
                        this._lineGraphics.lineStyle(2, 0xFFD700, alpha); // Thicker gold lines
                        this._lineGraphics.moveTo(a.x + a.width/2, a.y + a.height/2);
                        this._lineGraphics.lineTo(b.x + b.width/2, b.y + b.height/2);
                    }
                }
            }
        };

        // Override itemTextAlign to force left alignment (backup method)
        const _Window_TitleCommand_itemTextAlign = Window_TitleCommand.prototype.itemTextAlign;
        Window_TitleCommand.prototype.itemTextAlign = function() {
            return 'left';
        };

        // -------------------------------------------------------------------------
        // Terminal-style floating card with gold theme
        // -------------------------------------------------------------------------
        class FloatingCard extends PIXI.Container {
            constructor(data, cardId) {
                super();
                this._speed = 1 + Math.random();
                this._cardId = cardId; // Unique identifier for tracking connections
                this._draw(data);
            }
            
            _draw({ type, dbData }) {
                const padding = 12;
                const lineHeight = 16;
                let contentWidth = 280;
                let contentHeight = padding;
                const useTranslation = ConfigManager.language === 'it';

                // Terminal-style text styles with gold theme (smaller sizes)
                const headerStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FFD700', // Gold instead of green
                    fontSize: 15, 
                    fontWeight: 'bold'
                });
                
                const normalStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FFA500', // Orange-gold instead of cyan
                    fontSize: 13
                });
                
                const dimStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#808080',
                    fontSize: 11
                });
                
                const errorStyle = new PIXI.TextStyle({ 
                    fontFamily: 'Terminus, Courier New, monospace',
                    fill: '#FF6B35', // Orange-red instead of pure red
                    fontSize: 13,
                    fontWeight: 'bold'
                });
                
                const elements = [];
                
                // Terminal header with timestamp and type
                const timestamp = new Date().toISOString().slice(11, 19);
                const header = new PIXI.Text(`[${timestamp}] QUERY_TYPE:\n${type.toUpperCase()}`, dimStyle);
                header.x = padding;
                header.y = contentHeight;
                elements.push(header);
                contentHeight += header.height + 8;
                
                // Terminal prompt line
                const prompt = new PIXI.Text('> ', headerStyle);
                prompt.x = padding;
                prompt.y = contentHeight;
                elements.push(prompt);
                
                if (['item','weapon','armor'].includes(type)) {
                    // Terminal-style item display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('='.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Icon and ID reference
                    const bmp = ImageManager.loadSystem('IconSet');
                    const icon = new Sprite(bmp);
                    const idx = dbData.iconIndex;
                    icon.setFrame((idx % 16) * 32, Math.floor(idx / 16) * 32, 32, 32);
                    icon.x = padding;
                    icon.y = contentHeight;
                    elements.push(icon);
                    
                    // Get the actual database ID instead of icon index
                    const dbId = this._getDbId(type, dbData);
                    const iconText = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    iconText.x = padding + 40;
                    iconText.y = contentHeight + 8;
                    elements.push(iconText);
                    
                    // Move price to next line
                    contentHeight += Math.max(32, iconText.height) + 6;
                    const euroPrice = (dbData.price / 100).toFixed(2);
                    const priceText = new PIXI.Text(useTranslation?`PREZZO: ${euroPrice}€`:`PRICE: ${euroPrice}€`, errorStyle);
                    priceText.x = padding;
                    priceText.y = contentHeight;
                    elements.push(priceText);
                    contentHeight += priceText.height + 12;
                    
                    // Description with manual line breaks
                    const cleanDescription = window.translateText(dbData.description).replace(/\\n/g, ' ').replace(/\n/g, ' ');
                    const descLines = this._wrapTerminalText(cleanDescription, 28);
                    descLines.forEach((line, i) => {
                        const prefix = i === 0 ? 'DESC:\n' : '';
                        const desc = new PIXI.Text(prefix + line, normalStyle);
                        desc.x = padding;
                        desc.y = contentHeight;
                        elements.push(desc);
                        contentHeight += desc.height + 2;
                    });
                    
                } else if (type === 'enemy') {
                    const note = dbData.note || '';
                    const lv = (note.match(/LV:\s*(\d+)/i) || [])[1] || '0';
                    const descTxt = (note.match(/\|\s*([^<]+)/) || [])[1] || '';
                    
                    // Terminal-style enemy display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}\n[LV.${lv}]`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('-'.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Character image and ID reference
                    const charMatch = note.match(/<Char:(\$[^>]+)>/i);
                    let hasCharImage = false;
                    
                    if (charMatch) {
                        try {
                            const charFileName = charMatch[1];
                            const charBmp = ImageManager.loadBitmap('./img/characters/Monsters/', charFileName);
                            const charSprite = new Sprite(charBmp);
                            charSprite.setFrame(0, 0, 32, 32);
                            charSprite.x = padding;
                            charSprite.y = contentHeight;
                            elements.push(charSprite);
                            hasCharImage = true;
                        } catch (e) {
                            console.warn(`Failed to load character image: ${charMatch[1]}`);
                        }
                    }
                    
                    // Get the actual database ID for enemy
                    const dbId = this._getDbId(type, dbData);
                    const charRef = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    charRef.x = hasCharImage ? padding + 40 : padding;
                    charRef.y = contentHeight + (hasCharImage ? 8 : 0);
                    elements.push(charRef);
                    contentHeight += Math.max(hasCharImage ? 32 : 0, charRef.height) + 12;
                    var stats;
                    // Stats in terminal format
                    stats = new PIXI.Text(
                        `STR=${dbData.params[2].toString().padStart(3, '0')} CON=${dbData.params[3].toString().padStart(3, '0')} INT=${dbData.params[4].toString().padStart(3, '0')}\nWIS=${dbData.params[5].toString().padStart(3, '0')} DEX=${dbData.params[6].toString().padStart(3, '0')} PSI=${dbData.params[7].toString().padStart(3, '0')}`,
                        errorStyle
                    );
                    if(useTranslation){
                        stats = new PIXI.Text(
                            `FRZ=${dbData.params[2].toString().padStart(3, '0')} COS=${dbData.params[3].toString().padStart(3, '0')} INT=${dbData.params[4].toString().padStart(3, '0')}\nSAG=${dbData.params[5].toString().padStart(3, '0')} DES=${dbData.params[6].toString().padStart(3, '0')} PSI=${dbData.params[7].toString().padStart(3, '0')}`,
                            errorStyle
                        );
                    }
                    stats.x = padding;
                    stats.y = contentHeight;
                    elements.push(stats);
                    contentHeight += stats.height + 10;
                    
                    // Description with manual line breaks
                    if (descTxt.trim()) {
                        const descLines = this._wrapTerminalText(descTxt.trim(), 28);
                        descLines.forEach((line, i) => {
                            const prefix = i === 0 ? 'INFO:\n' : '';
                            const desc = new PIXI.Text(prefix + line, normalStyle);
                            desc.x = padding;
                            desc.y = contentHeight;
                            elements.push(desc);
                            contentHeight += desc.height + 2;
                        });
                    }
                    
                } else if (type === 'skill') {
                    // Terminal-style skill display
                    const nameText = new PIXI.Text(`${window.translateText(dbData.name).toUpperCase()}`, headerStyle);
                    nameText.x = padding + prompt.width;
                    nameText.y = contentHeight;
                    elements.push(nameText);
                    contentHeight += nameText.height + 10;
                    
                    // ASCII-style separator
                    const separator = new PIXI.Text('~'.repeat(40), dimStyle);
                    separator.x = padding;
                    separator.y = contentHeight;
                    elements.push(separator);
                    contentHeight += separator.height + 6;
                    
                    // Icon and ID reference
                    const bmp = ImageManager.loadSystem('IconSet');
                    const icon = new Sprite(bmp);
                    const idx = dbData.iconIndex;
                    icon.setFrame((idx % 16) * 32, Math.floor(idx / 16) * 32, 32, 32);
                    icon.x = padding;
                    icon.y = contentHeight;
                    elements.push(icon);
                    
                    // Get the actual database ID for skill
                    const dbId = this._getDbId(type, dbData);
                    const iconText = new PIXI.Text(`[ID:${dbId.toString().padStart(3, '0')}]`, dimStyle);
                    iconText.x = padding + 40;
                    iconText.y = contentHeight + 8;
                    elements.push(iconText);
                    contentHeight += Math.max(32, iconText.height) + 12;
                    
                    // Description with manual line breaks
                    const cleanDescription = window.translateText(dbData.description).replace(/\\n/g, ' ').replace(/\n/g, ' ');
                    const descLines = this._wrapTerminalText(cleanDescription, 35);
                    descLines.forEach((line, i) => {
                        const prefix = i === 0 ? 'EXEC:\n' : '';
                        const desc = new PIXI.Text(prefix + line, normalStyle);
                        desc.x = padding;
                        desc.y = contentHeight;
                        elements.push(desc);
                        contentHeight += desc.height + 3;
                    });
                }
                
                // Terminal footer
                contentHeight += 8;
                const footer = new PIXI.Text('EOF', dimStyle);
                footer.x = padding;
                footer.y = contentHeight;
                elements.push(footer);
                contentHeight += footer.height + padding;
                
                // Draw terminal-style background with gold theme
                const g = new PIXI.Graphics();
                // Dark terminal background
                g.beginFill(0x000000, 0.9);
                // Terminal-style border (double line) in gold
                g.lineStyle(1, 0xFFD700, 0.8); // Gold border
                g.drawRect(0, 0, contentWidth, contentHeight);
                g.lineStyle(1, 0xFFD700, 0.4); // Dimmer gold inner border
                g.drawRect(2, 2, contentWidth - 4, contentHeight - 4);
                g.endFill();
                
                this.addChild(g);
                
                // Add all elements
                elements.forEach(element => this.addChild(element));
                
                // Set card dimensions and position with better spacing
                this.width = contentWidth;
                this.height = contentHeight;
                
                // Calculate grid-like positioning to reduce overlap
                const screenMargin = Graphics.width * 0.05;
                const availableWidth = Graphics.width * 0.9;
                const cardSpacing = contentWidth + 40; // Add 40px spacing between cards
                const cardsPerRow = Math.floor(availableWidth / cardSpacing);
                
                // Use card ID to determine position for consistent spacing
                const cardIndex = this._cardId % (cardsPerRow * 3); // 3 rows of spacing
                const rowIndex = Math.floor(cardIndex / cardsPerRow);
                const colIndex = cardIndex % cardsPerRow;
                
                // Calculate base position with spacing
                const baseX = screenMargin + (colIndex * cardSpacing);
                const baseY = Graphics.height + (rowIndex * 150); // Stagger Y starting positions
                
                // Add some randomness but keep spacing
                this.x = baseX + (Math.random() - 0.5) * 30; // Small random offset
                this.y = baseY + Math.random() * 80; // Random Y offset within range
            }
            
            _getDbId(type, dbData) {
                // Find the actual database ID by searching through the appropriate array
                const map = { 
                    enemy: $dataEnemies, 
                    skill: $dataSkills, 
                    item: $dataItems, 
                    weapon: $dataWeapons, 
                    armor: $dataArmors 
                };
                
                const dataArray = map[type];
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i] === dbData) {
                        return i;
                    }
                }
                return 0; // fallback
            }
            
            _wrapTerminalText(text, maxChars) {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';
                
                words.forEach(word => {
                    if ((currentLine + word).length <= maxChars) {
                        currentLine += (currentLine ? ' ' : '') + word;
                    } else {
                        if (currentLine) lines.push(currentLine);
                        currentLine = word;
                        // If a single word is too long, force break it
                        if (word.length > maxChars) {
                            const chunks = [];
                            for (let i = 0; i < word.length; i += maxChars) {
                                chunks.push(word.slice(i, i + maxChars));
                            }
                            lines.push(...chunks.slice(0, -1));
                            currentLine = chunks[chunks.length - 1];
                        }
                    }
                });
                if (currentLine) lines.push(currentLine);
                
                return lines;
            }
            
            update() {
                this.y -= this._speed;
                
                // Remove CRT flicker effects - just keep steady alpha
                this.alpha = 1.0;
                
                if (this.y + this.height < 0 && this.parent) {
                    this.parent.removeChild(this);
                }
            }
        }

        // -------------------------------------------------------------------------
        // Random DB picker
        // -------------------------------------------------------------------------
        const TYPES = ['enemy','skill','item','weapon','armor'];
        function getRandomData() {
            const t = TYPES[Math.floor(Math.random() * TYPES.length)];
            const map = { enemy: $dataEnemies, skill: $dataSkills, item: $dataItems, weapon: $dataWeapons, armor: $dataArmors };
            let entry;
            do { entry = map[t][Math.floor(Math.random() * map[t].length)]; } while (!entry);
            return { type: t, dbData: entry };
        }

        // -------------------------------------------------------------------------
        // Scene_Title mesh + cards with fixed connection tracking and hover interaction
        // -------------------------------------------------------------------------
        const _Scene_Title_create = Scene_Title.prototype.create;
        Scene_Title.prototype.create = function() {
            _Scene_Title_create.call(this);
            this._connections = {};
            this._cardIdCounter = 0; // Counter for unique card IDs
            this._lineGraphics = new PIXI.Graphics();
            this.addChildAt(this._lineGraphics, 0);
            this._floatingContainer = new PIXI.Container();
            this.addChildAt(this._floatingContainer, 1);
            
            // Create and add ASCII title
            this._asciiTitle = new ASCIITitle();
            this.addChild(this._asciiTitle);
            
            // Spawn more initial cards with staggered timing
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const newCard = new FloatingCard(getRandomData(), this._cardIdCounter++);
                    this._floatingContainer.addChild(newCard);
                }, i * 300); // Faster stagger for more cards
            }
        };

        const parameters = PluginManager.parameters(pluginName);
        const heightMultiplier = parseFloat(parameters['heightMultiplier']) || 2.0;
    
        // Simply make the command window taller
        const _Scene_Title_commandWindowRect = Scene_Title.prototype.commandWindowRect;
        Scene_Title.prototype.commandWindowRect = function() {
            const rect = _Scene_Title_commandWindowRect.call(this);
            
            // Make the window taller
            rect.height = rect.height * heightMultiplier;
            
            // Keep it within screen bounds
            const maxHeight = Graphics.height - rect.y - 20;
            if (rect.height > maxHeight) {
                rect.height = maxHeight;
            }
            
            return rect;
        };
    
    })();