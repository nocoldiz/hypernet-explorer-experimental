/*:
 * @target MZ
 * @plugindesc [v1.0.0] Plays footstep sounds for player and events with customizable settings and play modes.
 * @author ToshaAngel
 * @version v1.0.0
 * @url https://toshaangel.itch.io/
 * @help
 * ___________          .__              
 * \__    ___/___  _____|  |__ _____     
 *   |    | /  _ \/  ___/  |  \\__  \    
 *   |    |(  <_> )___ \|   Y  \/ __ \_  
 *   |____| \____/____  >___|  (____  /  
 *                    \/     \/     \/   
 *    _____                        .__   
 *   /  _  \   ____    ____   ____ |  |  
 *  /  /_\  \ /    \  / ___\_/ __ \|  |  
 * /    |    \   |  \/ /_/  >  ___/|  |__
 * \____|__  /___|  /\___  / \___  >____/
 *         \/     \//_____/      \/   
 * 
 * This plugin allows you to play footstep sounds for both player and events,
 * with fine-tuned control over terrain tags, sound play modes, and various other settings.
 * 
 * === Features ===
 * - Footstep sounds when walking on different terrain tags.
 * - Support for multiple sounds for each terrain.
 * - Play modes: sequential or random.
 * - Individual volume, pitch, and pan settings for each sound.
 * - Toggle footstep sounds for events.
 * - Automatic synchronization of footstep sounds with character animation.
 * 
 * === How to Use ===
 * 1. In the tileset settings, assign terrain tags to the tiles.
 * 2. In the plugin parameters, configure the sound settings for each terrain tag.
 * 3. Choose the play mode for footstep sounds: "Sequential" or "Random".
 * 4. Enable or disable footstep sounds for events in the plugin parameters.
 *    - If event footstep sounds are enabled, you can disable them for a specific event
 *      by adding the tag <NoFootsteps> in the event's notes.
 * 
 * === Notes ===
 * - Terrain tags range from 0 to 7.
 * - Sound files must be placed in the audio/se folder of your project.
 * - Sounds play on specific animation frames (default frames 0 and 2).
 * - If you have any questions or find bugs, feel free to contact me.
 * 
 * Thank you for using my plugin!
 * 
 * === License ===
 * This plugin can be used in both free and commercial projects.
 * Attribution is not required but appreciated.
 * 
 * @param StepSounds
 * @text Footstep Sound Settings
 * @type struct<StepSound>[]
 * @default []
 * @desc Configure footstep sounds for each terrain tag.
 * 
 * @param EventFootstepsEnabled
 * @text Event Footstep Sounds
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default true
 * @desc Enable or disable footstep sounds for events by default.
 */

/*~struct~StepSound:
 * @param AreaName
 * @text Area Name
 * @desc The name of the area (for developer reference).
 * @type text
 * @default 
 * 
 * @param TerrainTag
 * @text Terrain Tag
 * @desc The terrain tag number (0 to 7).
 * @type number
 * @min 0
 * @max 7
 * @default 0
 *
 * @param SoundNames
 * @text Sound Names
 * @desc List of sounds that will be played.
 * @type file[]
 * @dir audio/se
 * @require 1
 *
 * @param PlayMode
 * @text Play Mode
 * @desc Choose the play mode for the footstep sounds.
 * @type select
 * @option Sequential
 * @value sequential
 * @option Random
 * @value random
 * @default sequential
 *
 * @param Volume
 * @text Volume
 * @desc The volume of the sound (0-100).
 * @type number
 * @min 0
 * @max 100
 * @default 90
 *
 * @param PitchMin
 * @text Minimum Pitch
 * @desc The minimum pitch value for the sound (50-150).
 * @type number
 * @min 50
 * @max 150
 * @default 90
 *
 * @param PitchMax
 * @text Maximum Pitch
 * @desc The maximum pitch value for the sound (50-150).
 * @type number
 * @min 50
 * @max 150
 * @default 110
 *
 * @param Pan
 * @text Pan
 * @desc The pan of the sound (-100 left, 0 center, 100 right).
 * @type number
 * @min -100
 * @max 100
 * @default 0
 *
 * @param MaxDistance
 * @text Maximum Distance
 * @desc The maximum distance at which event sounds can be heard.
 * @type number
 * @min 1
 * @default 5
 *
 * @param AnimationFrames
 * @text Animation Frames for Sound
 * @desc The animation frames during which the footstep sound plays.
 * @type number[]
 * @min 0
 * @max 2
 * @default ["0","2"]
 */

(() => {
    const pluginName = "ToshA_Footsteps";
    const parameters = PluginManager.parameters(pluginName);

    const stepSounds = JSON.parse(parameters["StepSounds"] || "[]").map((sound) => {
        const parsedSound = JSON.parse(sound);
        return {
            terrainTag: Number(parsedSound.TerrainTag || 0),
            soundNames: JSON.parse(parsedSound.SoundNames || "[]").map(String),
            playMode: String(parsedSound.PlayMode || "sequential"),
            volume: Number(parsedSound.Volume || 90),
            pitchMin: Number(parsedSound.PitchMin || 90),
            pitchMax: Number(parsedSound.PitchMax || 110),
            pan: Number(parsedSound.Pan || 0),
            maxDistance: Number(parsedSound.MaxDistance || 5),
            animationFrames: JSON.parse(parsedSound.AnimationFrames || '["0","2"]').map(Number),
        };
    });

    const eventFootstepsEnabled = parameters["EventFootstepsEnabled"] === "true";

    // ====== Footstep sound playback function ======
    function playFootstepSound(character) {
        const terrainTag = character.terrainTag();
        const stepSound = stepSounds.find(sound => sound.terrainTag === terrainTag);
        if (stepSound && stepSound.soundNames.length > 0) {
            const pitch = Math.floor(Math.random() * (stepSound.pitchMax - stepSound.pitchMin + 1)) + stepSound.pitchMin;
            let volume = stepSound.volume;

            // If it's an event, reduce volume based on distance
            if (character !== $gamePlayer) {
                const dx = $gamePlayer.x - character.x;
                const dy = $gamePlayer.y - character.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > stepSound.maxDistance) {
                    return; // Too far
                }
                const volumeFactor = 1 - distance / stepSound.maxDistance;
                volume = Math.max(0, Math.min(stepSound.volume * volumeFactor, 100));
            }

            let soundName;

            if (stepSound.playMode === "sequential") {
                // Get the current sound index
                if (!character._footstepSoundIndex || character._lastTerrainTag !== terrainTag) {
                    character._footstepSoundIndex = 0;
                }
                soundName = stepSound.soundNames[character._footstepSoundIndex];

                // Increment sound index
                character._footstepSoundIndex = (character._footstepSoundIndex + 1) % stepSound.soundNames.length;
            } else if (stepSound.playMode === "random") {
                // Choose a random sound
                soundName = stepSound.soundNames[Math.floor(Math.random() * stepSound.soundNames.length)];
            } else {
                // If the mode is not recognized, use the first sound
                soundName = stepSound.soundNames[0];
            }

            // Play the sound
            AudioManager.playSe({
                name: soundName,
                volume: volume,
                pitch: pitch,
                pan: stepSound.pan
            });

            // Save the current terrain tag
            character._lastTerrainTag = terrainTag;
        }
    }

    // ====== Override the animation pattern update method ======
    const _Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
    Game_CharacterBase.prototype.updatePattern = function() {
        const prevPattern = this._pattern;
        _Game_CharacterBase_updatePattern.call(this);
        const newPattern = this._pattern;

        if (prevPattern !== newPattern && this.isMoving()) {
            const isPlayer = this === $gamePlayer;
            let shouldPlayFootsteps = false;

            if (isPlayer) {
                shouldPlayFootsteps = true;
            } else if (this instanceof Game_Event) {
                if (eventFootstepsEnabled && !this.hasNoFootstepSounds()) {
                    shouldPlayFootsteps = true;
                }
            }

            if (shouldPlayFootsteps) {
                const terrainTag = this.terrainTag();
                const stepSound = stepSounds.find(sound => sound.terrainTag === terrainTag);
                if (stepSound && stepSound.animationFrames.includes(newPattern)) {
                    playFootstepSound(this);
                }
            }
        }
    };

    // ====== Check if the event has the <NoFootsteps> tag ======
    Game_Event.prototype.hasNoFootstepSounds = function() {
        return this.event().note.includes("<NoFootsteps>");
    };

})();
