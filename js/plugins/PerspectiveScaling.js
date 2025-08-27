//=============================================================================
// PerspectiveScaling.js
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Perspective Scaling v1.0.0
 * @author YourName
 * @version 1.0.0
 * @description Scales events based on Y position for perspective effect
 *
 * @help PerspectiveScaling.js
 * 
 * This plugin scales events based on their Y position to create a
 * perspective scaling effect similar to classic JRPGs.
 * 
 * MAP NOTETAGS:
 * <PerspectiveScale>
 * baseScale: 1.0        // Base scale at Y=0
 * scaleRate: 0.02       // How much scale changes per tile
 * minScale: 0.3         // Minimum scale
 * maxScale: 1.5         // Maximum scale
 * centerY: 10           // Y position that represents "normal" scale
 * </PerspectiveScale>
 * 
 * This plugin scales events based on their Y position to create a
 * perspective scaling effect similar to classic JRPGs.
 * 
 * MAP NOTETAGS:
 * <PerspectiveScale>
 * baseScale: 1.0        // Base scale at Y=0
 * scaleRate: 0.02       // How much scale changes per tile
 * minScale: 0.3         // Minimum scale
 * maxScale: 1.5         // Maximum scale
 * centerY: 10           // Y position that represents "normal" scale
 * </PerspectiveScale>
 * 
 * EVENT NOTETAGS:
 * <NoScale>             // Excludes this event from scaling
 * <ScaleMultiplier: 1.5> // Custom scale multiplier for this event
 * 
 * The plugin will automatically scale all events on the map based on
 * their Y position, with events higher up (smaller Y) appearing smaller
 * and events lower down (larger Y) appearing larger.
 * 
 * License: Free for commercial and non-commercial use
 */

(() => {
    'use strict';
    
    // Default settings
    const DEFAULT_SETTINGS = {
        baseScale: 1.0,
        scaleRate: 0.02,
        minScale: 0.3,
        maxScale: 1.5,
        centerY: 10
    };
    
    let mapSettings = { ...DEFAULT_SETTINGS };
    
    // Parse map notetags
    function parseMapSettings() {
        if (!$dataMap || !$dataMap.note) return;
        
        const noteMatch = $dataMap.note.match(/<PerspectiveScale>([\s\S]*?)<\/PerspectiveScale>/i);
        if (!noteMatch) return;
        
        const noteContent = noteMatch[1];
        const settings = { ...DEFAULT_SETTINGS };
        
        // Parse each setting
        const baseScaleMatch = noteContent.match(/baseScale\s*:\s*([\d.]+)/i);
        if (baseScaleMatch) settings.baseScale = parseFloat(baseScaleMatch[1]);
        
        const scaleRateMatch = noteContent.match(/scaleRate\s*:\s*([\d.]+)/i);
        if (scaleRateMatch) settings.scaleRate = parseFloat(scaleRateMatch[1]);
        
        const minScaleMatch = noteContent.match(/minScale\s*:\s*([\d.]+)/i);
        if (minScaleMatch) settings.minScale = parseFloat(minScaleMatch[1]);
        
        const maxScaleMatch = noteContent.match(/maxScale\s*:\s*([\d.]+)/i);
        if (maxScaleMatch) settings.maxScale = parseFloat(maxScaleMatch[1]);
        
        const centerYMatch = noteContent.match(/centerY\s*:\s*([\d.]+)/i);
        if (centerYMatch) settings.centerY = parseFloat(centerYMatch[1]);
        
        mapSettings = settings;
    }
    
    // Calculate scale based on Y position
    function calculateScale(y) {
        const distance = y - mapSettings.centerY;
        const scale = mapSettings.baseScale + (distance * mapSettings.scaleRate);
        return Math.max(mapSettings.minScale, Math.min(mapSettings.maxScale, scale));
    }
    
    // Check if character should be excluded from scaling
    function isExcludedFromScaling(character) {
        if (!character) return true;
        
        // Handle different character types
        let noteContent = '';
        if (character instanceof Game_Event && character.event()) {
            noteContent = character.event().note;
        } else if (character instanceof Game_Player) {
            // Player can be excluded via map notes or actor notes
            if ($dataActors[$gameParty.leader()._actorId]) {
                noteContent = $dataActors[$gameParty.leader()._actorId].note;
            }
        } else if (character instanceof Game_Follower) {
            // Followers use their actor's notes
            const actor = character.actor();
            if (actor) {
                noteContent = $dataActors[actor._actorId].note;
            }
        }
        
        return noteContent.includes('<NoScale>');
    }
    
    // Get custom scale multiplier for character
    function getScaleMultiplier(character) {
        if (!character) return 1.0;
        
        let noteContent = '';
        if (character instanceof Game_Event && character.event()) {
            noteContent = character.event().note;
        } else if (character instanceof Game_Player) {
            if ($dataActors[$gameParty.leader()._actorId]) {
                noteContent = $dataActors[$gameParty.leader()._actorId].note;
            }
        } else if (character instanceof Game_Follower) {
            const actor = character.actor();
            if (actor) {
                noteContent = $dataActors[actor._actorId].note;
            }
        }
        
        const multiplierMatch = noteContent.match(/<ScaleMultiplier\s*:\s*([\d.]+)>/i);
        if (multiplierMatch) {
            return parseFloat(multiplierMatch[1]);
        }
        return 1.0;
    }
    
    // Override Game_CharacterBase update method
    const _Game_CharacterBase_update = Game_CharacterBase.prototype.update;
    Game_CharacterBase.prototype.update = function() {
        _Game_CharacterBase_update.call(this);
        this.updatePerspectiveScale();
    };
    
    // Add perspective scale update method
    Game_CharacterBase.prototype.updatePerspectiveScale = function() {
        if (isExcludedFromScaling(this)) return;
        
        const baseScale = calculateScale(this._realY);
        const multiplier = getScaleMultiplier(this);
        this._perspectiveScale = baseScale * multiplier;
    };
    
    // Override Sprite_Character update method
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        this.updatePerspectiveScaling();
    };
    
    // Add perspective scaling to sprite
    Sprite_Character.prototype.updatePerspectiveScaling = function() {
        if (!this._character) return;
        
        const scale = this._character._perspectiveScale || 1.0;
        this.scale.x = scale;
        this.scale.y = scale;
    };
    
    // Initialize settings when map loads
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        parseMapSettings();
        
        // Force update all characters with a small delay to ensure everything is loaded
        setTimeout(() => {
            if ($gameMap && $gameMap.events) {
                $gameMap.events().forEach(event => {
                    if (event && typeof event.updatePerspectiveScale === 'function') {
                        event.updatePerspectiveScale();
                    }
                });
            }
            
            if ($gamePlayer && typeof $gamePlayer.updatePerspectiveScale === 'function') {
                $gamePlayer.updatePerspectiveScale();
            }
            
            if ($gamePlayer.followers && $gamePlayer.followers()) {
                $gamePlayer.followers().data().forEach(follower => {
                    if (follower && typeof follower.updatePerspectiveScale === 'function') {
                        follower.updatePerspectiveScale();
                    }
                });
            }
        }, 100);
    };
    
    // Also update when transferring
    const _Game_Player_performTransfer = Game_Player.prototype.performTransfer;
    Game_Player.prototype.performTransfer = function() {
        _Game_Player_performTransfer.call(this);
        parseMapSettings();
    };
    
})();