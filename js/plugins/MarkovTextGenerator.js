/*:
 * @target MZ
 * @plugindesc Generates text using Markov chains from selected text sources with proper text wrapping.
 * @author Claude
 * @url https://example.com
 * 

 * @param defaultChainOrder
 * @text Default Chain Order
 * @type number
 * @min 1
 * @max 5
 * @desc The default order of the Markov chain (how many words to consider for context).
 * @default 2
 * 
 * @param defaultMinLength
 * @text Default Minimum Length
 * @type number
 * @min 1
 * @max 100
 * @desc The default minimum length (in words) of generated text.
 * @default 10
 * 
 * @param defaultMaxLength
 * @text Default Maximum Length
 * @type number
 * @min 5
 * @max 500
 * @desc The default maximum length (in words) of generated text.
 * @default 50
 * 
 * @param defaultMinChars
 * @text Default Minimum Characters
 * @type number
 * @min 1
 * @max 100
 * @desc The default minimum length (in characters) when generating names.
 * @default 4
 * 
 * @param defaultMaxChars
 * @text Default Maximum Characters
 * @type number
 * @min 2
 * @max 100
 * @desc The default maximum length (in characters) when generating names.
 * @default 12
 * 
 * @param maxLineLength
 * @text Max Line Length
 * @type number
 * @min 20
 * @max 120
 * @desc Maximum characters per line before automatic line breaks (affects text wrapping).
 * @default 60
 * 
 * @param insertPeriods
 * @text Insert Periods
 * @type boolean
 * @desc Automatically insert periods in long sentences to improve readability.
 * @default true
 * 
 * @command generateText
 * @text Generate Markov Text
 * @desc Generates text using a Markov chain and displays it in a message box.
 * 
 * @arg databaseId
 * @text Database ID
 * @type string
 * @desc The ID of the text database to use (as defined in plugin parameters).
 * 
 * @arg chainOrder
 * @text Chain Order
 * @type number
 * @min 1
 * @max 5
 * @desc How many words to consider for context (higher values = more coherent, less creative).
 * @default 2
 * 
 * @arg minLength
 * @text Minimum Length
 * @type number
 * @min 1
 * @max 100
 * @desc The minimum length (in words) of generated text.
 * @default 10
 * 
 * @arg maxLength
 * @text Maximum Length
 * @type number
 * @min 5
 * @max 500
 * @desc The maximum length (in words) of generated text.
 * @default 50
 * 
 * @arg faceIndex
 * @text Face Index
 * @type number
 * @min -1
 * @max 128
 * @desc The face index to use for the message (-1 for none).
 * @default -1
 * 
 * @arg faceName
 * @text Face Name
 * @type file
 * @dir img/faces/
 * @desc The face image to use for the message (leave empty for none).
 * 
 * @arg background
 * @text Background
 * @type select
 * @option Window
 * @value 0
 * @option Dim
 * @value 1
 * @option Transparent
 * @value 2
 * @desc The background type for the message window.
 * @default 0
 * 
 * @arg position
 * @text Position
 * @type select
 * @option Top
 * @value 0
 * @option Middle
 * @value 1
 * @option Bottom
 * @value 2
 * @desc The position of the message window.
 * @default 2
 * 
 * @command generateName
 * @text Generate Markov Name
 * @desc Generates a short text using character-based Markov for names.
 * 
 * @arg databaseId
 * @text Database ID
 * @type string
 * @desc The ID of the text database to use (as defined in plugin parameters).
 * 
 * @arg chainOrder
 * @text Chain Order
 * @type number
 * @min 1
 * @max 5
 * @desc How many characters to consider for context (higher values = more coherent).
 * @default 2
 * 
 * @arg minChars
 * @text Minimum Characters
 * @type number
 * @min 1
 * @max 100
 * @desc The minimum length (in characters) of generated name.
 * @default 4
 * 
 * @arg maxChars
 * @text Maximum Characters
 * @type number
 * @min 2
 * @max 100
 * @desc The maximum length (in characters) of generated name.
 * @default 12
 * 
 * @arg useWordMode
 * @text Use Word-Based Mode
 * @type boolean
 * @desc If true, will generate based on whole words instead of individual characters.
 * @default false
 * 
 * @arg variableId
 * @text Variable ID
 * @type variable
 * @desc Store the generated name in this game variable (0 to not store it).
 * @default 0
 * 
 * @arg actorId
 * @text Actor ID
 * @type actor
 * @desc Set the generated name to this actor (0 to not set any actor name).
 * @default 0
 * 
 * @arg displayInMessage
 * @text Display In Message
 * @type boolean
 * @desc Show the generated name in a message window.
 * @default false
 * 
 * @help
 * ============================================================================
 * Markov Text Generator with Text Wrapping
 * ============================================================================
 * 
 * This plugin allows you to generate text using Markov chains based on
 * predefined text databases. The generated text can be displayed in a
 * message box with customizable parameters and proper text wrapping.
 * 
 * == How to Use ==
 * 
 * 1. Define text databases in the plugin parameters.
 *    Each database needs a unique ID and the source text.
 * 
 * 2. Use the plugin command "Generate Markov Text" in an event
 *    to generate paragraphs of text.
 *    - OR -
 *    Use the plugin command "Generate Markov Name" to generate
 *    shorter character names or item names based on character length.
 * 
 * == IMPORTANT: Plugin File Name ==
 * 
 * This plugin file MUST be named "MarkovTextGenerator.js" in your project's 
 * plugins folder. The plugin name inside the code must match the file name
 * without the .js extension.
 * 
 * == Plugin Command Usage ==
 * 
 * In an event, add a "Plugin Command" action and select one of the commands:
 * 
 * 1. "Generate Markov Text" - For longer text passages
 *    Fill in at least the Database ID.
 * 
 * 2. "Generate Markov Name" - For character or item names
 *    - Set the database ID and character length limits
 *    - Choose whether to use word-based mode (for compound names)
 *    - Optionally store the result in a game variable
 *    - Decide whether to display the name in a message window
 * 
 * == Name Generation ==
 * 
 * The name generator has two modes:
 * 
 * 1. Character-based (useWordMode = false): Builds names character by character.
 *    Good for creating completely new names with the feel of the source text.
 * 
 * 2. Word-based (useWordMode = true): Uses whole words from the source.
 *    Good for creating compound names or picking words from the source text.
 * 
 * All generated names will have their first letter automatically capitalized.
 * 
 * You can also directly set an actor's name to the generated name by providing
 * an Actor ID in the plugin command parameters.
 * 
 * == Text Wrapping Parameters ==
 * 
 * - Max Line Length: Controls when text will be broken to a new line to ensure
 *   proper wrapping within the message window.
 * 
 * - Insert Periods: When enabled, automatically inserts periods in very long
 *   sentences to improve readability in the generated text.
 * 
 * == Parameters Explained ==
 * 
 * - Chain Order: How many words/characters to use for context. Higher values
 *   produce more coherent but less creative text.
 * 
 * - Min/Max Length: Controls how long the generated text will be.
 * 
 * == Example ==
 * 
 * Create a database with ID "fantasy_names" containing fantasy character names,
 * then use the "Generate Markov Name" command to create new character names
 * on the fly during gameplay.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * 
 * Free for use in both commercial and non-commercial projects.
 * Credit is appreciated but not required.
 * 
 */


(function() {
    'use strict';
    
    // The plugin name MUST match the filename (without .js)
    const pluginName = "MarkovTextGenerator";
    
    // Debug log function
    function debug(msg) {
        console.log(`[${pluginName}] ${msg}`);
    }
    
    // Log plugin initialization
    debug("Plugin initializing...");
    
    // Parse plugin parameters
    const parameters = PluginManager.parameters(pluginName);
    debug("Parameters loaded");
    
    const defaultChainOrder = Number(parameters.defaultChainOrder || 2);
    const defaultMinLength = Number(parameters.defaultMinLength || 10);
    const defaultMaxLength = Number(parameters.defaultMaxLength || 50);
    const defaultMinChars = Number(parameters.defaultMinChars || 4);
    const defaultMaxChars = Number(parameters.defaultMaxChars || 12);
    const maxLineLength = Number(parameters.maxLineLength || 60);
    const insertPeriods = parameters.insertPeriods !== "false";
    
    // Parse text databases
    const textDatabases = window.textDatabases || [];
    try {
        const rawDatabases = parameters.textDatabases;
        debug(`Raw databases parameter: ${rawDatabases}`);
        
        if (rawDatabases && rawDatabases !== '[]') {
            textDatabases = JSON.parse(rawDatabases).map(dbString => {
                const db = JSON.parse(dbString);
                
                return {
                    id: db.id,
                    name: db.name,
                    en: db.en,
                    it: db.it,

                };
            });
            debug(`Loaded ${textDatabases.length} text databases`);
            
            // Log the IDs of the loaded databases
            if (textDatabases.length > 0) {
                debug(`Database IDs: ${textDatabases.map(db => db.id).join(', ')}`);
            }
        } else {
            debug("No text databases found in parameters");
        }
    } catch (e) {
        console.error(`[${pluginName}] Error parsing text databases:`, e);
    }
    // Store built Markov models to avoid rebuilding
    const markovModels = {};
    const characterMarkovModels = {};
    
    // Helper function to capitalize first letter of a string
    function capitalizeFirstLetter(string) {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Function to format text with proper wrapping for display in message windows
    function formatTextForMessageWindow(text) {
        // Helper function to insert line breaks for better wrapping
        function addLineBreaks(text, maxLineLength) {
            let result = '';
            let currentLineLength = 0;
            const words = text.split(' ');
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                
                // Handle extra long words by breaking them if necessary
                if (word.length > maxLineLength) {
                    // If we're not at the start of a line, move to a new line first
                    if (currentLineLength > 0) {
                        result += '\n';
                        currentLineLength = 0;
                    }
                    
                    // Break the long word into chunks of maxLineLength
                    for (let j = 0; j < word.length; j += maxLineLength) {
                        const chunk = word.substring(j, Math.min(j + maxLineLength, word.length));
                        
                        // Add the chunk
                        result += chunk;
                        
                        // If this isn't the end of the word, add a hyphen and line break
                        if (j + maxLineLength < word.length) {
                            result += '-\n';
                            currentLineLength = 0;
                        } else {
                            currentLineLength = chunk.length;
                        }
                    }
                } else {
                    // Normal word processing - check if adding this word would exceed the line length
                    // Use a slightly smaller threshold (85% of maxLineLength) to wrap early
                    const wrapEarlyThreshold = Math.floor(maxLineLength * 0.85);
                    
                    if (currentLineLength + word.length + (currentLineLength > 0 ? 1 : 0) > wrapEarlyThreshold) {
                        result += '\n';
                        currentLineLength = 0;
                    }
                    
                    // Add the word
                    if (currentLineLength > 0) {
                        result += ' ';
                        currentLineLength += 1;
                    }
                    
                    result += word;
                    currentLineLength += word.length;
                }
                
                // Add automatic line breaks after sentence-ending punctuation
                if (/[.!?]$/.test(word) && i < words.length - 1) {
                    result += '\n';
                    currentLineLength = 0;
                }
            }
            
            return result;
        }
        
        // Helper function to insert periods in very long sentences to improve readability
        function insertPeriodsInLongSentences(text) {
            const sentences = text.split(/([.!?])/);
            let result = '';
            
            for (let i = 0; i < sentences.length; i += 2) {
                if (i + 1 < sentences.length) {
                    // This is the sentence content
                    let sentence = sentences[i];
                    // This is the punctuation
                    const punctuation = sentences[i + 1];
                    
                    // If sentence is very long (more than 20 words), try to break it up
                    const words = sentence.split(' ');
                    if (words.length > 20) {
                        // Insert periods approximately every 12-15 words at a comma if possible
                        let modifiedSentence = '';
                        let lastBreak = 0;
                        
                        for (let j = 0; j < words.length; j++) {
                            modifiedSentence += words[j] + ' ';
                            
                            // Look for good breaking points (after commas or conjunctions)
                            if (j - lastBreak > 12 && j < words.length - 3) {
                                if (words[j].endsWith(',') || 
                                    ['and', 'but', 'or', 'yet', 'so', 'for', 'nor'].includes(words[j])) {
                                    modifiedSentence = modifiedSentence.trim() + '. ';
                                    // Capitalize the next word
                                    if (j + 1 < words.length) {
                                        words[j + 1] = capitalizeFirstLetter(words[j + 1]);
                                    }
                                    lastBreak = j;
                                }
                            }
                        }
                        
                        sentence = modifiedSentence.trim();
                    }
                    
                    result += sentence + punctuation;
                } else {
                    // Handle the case when there's no punctuation at the end
                    result += sentences[i];
                }
            }
            
            return result;
        }
        
        // First, add periods to very long sentences if enabled
        if (insertPeriods) {
            text = insertPeriodsInLongSentences(text);
        }
        
        // Then add line breaks for proper wrapping
        return addLineBreaks(text, maxLineLength);
    }
    // Markov Chain Generator Class for word-based generation
    class MarkovChain {
        constructor(text, order = 2) {
            this.order = order;
            this.model = {};
            this.startSequences = [];
            
            this.buildModel(text);
        }
        
        buildModel(text) {
            // Clean and tokenize the text
            const words = text
            .split(/\s+/)
            .filter(word => word.length > 0);
            
            debug(`Building Markov model with ${words.length} words and order ${this.order}`);
            
            // Build model
            for (let i = 0; i <= words.length - this.order; i++) {
                // Get current sequence of words (state)
                const currentSequence = words.slice(i, i + this.order).join(' ');
                
                // Save sequences that can start sentences
                if (i === 0 || /[\.\?\!]$/.test(words[i - 1])) {
                    this.startSequences.push(currentSequence);
                }
                
                // Next word
                const nextWord = words[i + this.order];
                
                // If we reached the end of the text, continue
                if (!nextWord) continue;
                
                // Add to model
                if (!this.model[currentSequence]) {
                    this.model[currentSequence] = [];
                }
                this.model[currentSequence].push(nextWord);
            }
            
            debug(`Model built with ${Object.keys(this.model).length} states and ${this.startSequences.length} starting sequences`);
        }
        
        generateText(minLength = 10, maxLength = 50) {
            if (this.startSequences.length === 0) {
                debug("Error: Not enough data to generate text");
                return "Error: Not enough data to generate text.";
            }
            

            // Start with a random starting sequence
            let currentSequence = this.startSequences[Math.floor(Math.random() * this.startSequences.length)];
            let result = currentSequence.split(' ');
            
            debug(`Starting generation with sequence: "${currentSequence}"`);
            
            // Generate text until we reach max length or can't continue
            while (result.length < maxLength) {
                // If we don't have this sequence in our model, break
                if (!this.model[currentSequence] || this.model[currentSequence].length === 0) {
                    debug(`Sequence "${currentSequence}" not found in model, ending generation`);
                    break;
                }
                
                // Get a random next word based on current sequence
                const nextWords = this.model[currentSequence];
                const nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];
                result.push(nextWord);
                
                // Update current sequence
                const sequenceWords = currentSequence.split(' ');
                sequenceWords.shift();
                sequenceWords.push(nextWord);
                currentSequence = sequenceWords.join(' ');
                
                // If we've reached minimum length and the last word ends with a terminal punctuation, we can stop
                if (result.length >= minLength && /[\.\?\!]$/.test(nextWord)) {
                    debug(`Reached natural ending point after ${result.length} words`);
                    break;
                }
            }
            
            // Check if the text ends with proper punctuation, if not add a period
            if (result.length > 0 && !/[\.\?\!]$/.test(result[result.length - 1])) {
                result[result.length - 1] += '.';
            }
            
            // Ensure first letter is capitalized
            if (result.length > 0) {
                result[0] = capitalizeFirstLetter(result[0]);
            }
            
            // Format the text with proper wrapping for display
            const rawText = result.join(' ');
            const formattedText = formatTextForMessageWindow(rawText);
            
            debug(`Generated text (${result.length} words) with proper wrapping`);
            
            return formattedText;
        }
        
        // Generate a name using words (for compound names)
        generateWordBasedName(minChars = 4, maxChars = 12) {
            if (this.startSequences.length === 0) {
                debug("Error: Not enough data to generate a name");
                return "Error";
            }
            
            // Get an appropriate starting point - prefer single words from the start sequences
            const potentialStarts = this.startSequences
                .map(seq => seq.split(' ')[0])
                .filter(word => word.length >= 2);
            
            let name = potentialStarts[Math.floor(Math.random() * potentialStarts.length)];
            
            // Sometimes add a second word to create compound names
            if (name.length < minChars || (Math.random() > 0.7 && name.length < maxChars - 3)) {
                // Find words that could follow our starting word
                const currentSequence = name;
                if (this.model[currentSequence] && this.model[currentSequence].length > 0) {
                    const nextWords = this.model[currentSequence];
                    const nextWord = nextWords[Math.floor(Math.random() * nextWords.length)];
                    
                    // Create compound name - sometimes with hyphen, sometimes with space
                    if (Math.random() > 0.5) {
                        name += '-' + nextWord;
                    } else {
                        name += ' ' + nextWord;
                    }
                }
            }
            
            // Truncate if too long
            if (name.length > maxChars) {
                name = name.substring(0, maxChars);
                
                // Ensure we don't cut off in the middle of a hyphenated name
                if (name.endsWith('-')) {
                    name = name.substring(0, name.length - 1);
                }
            }
            
            // Remove any punctuation at the end
            name = name.replace(/[^\w\s-]$/, '');
            
            // Ensure first letter is capitalized and each part of a compound name is capitalized
            name = name.split(/[\s-]/).map(part => capitalizeFirstLetter(part)).join('-');
            
            debug(`Generated word-based name: "${name}" (${name.length} chars)`);
            
            return name;
        }
    }
    
    // Character-based Markov Chain for name generation
    class CharacterMarkov {
        constructor(text, order = 2) {
            this.order = order;
            this.model = {};
            this.startSequences = [];
            
            this.buildModel(text);
        }
        
        buildModel(text) {
            // Extract words from text, we'll use these as the basis for character-based generation
            const words = text
                .replace(/[^\w\s-]/g, '')
                .split(/\s+/)
                .filter(word => word.length >= this.order);
            
            debug(`Building character Markov model from ${words.length} words and order ${this.order}`);
            
            // Process each word
            words.forEach(word => {
                // Save beginning sequences
                const startSeq = word.substring(0, this.order);
                this.startSequences.push(startSeq);
                
                // Build character transitions
                for (let i = 0; i <= word.length - this.order; i++) {
                    const sequence = word.substring(i, i + this.order);
                    const nextChar = word[i + this.order];
                    
                    if (!nextChar) continue;
                    
                    if (!this.model[sequence]) {
                        this.model[sequence] = [];
                    }
                    
                    this.model[sequence].push(nextChar);
                }
                
                // Add end-of-word marker for more natural endings
                const endSeq = word.substring(word.length - this.order);
                if (!this.model[endSeq]) {
                    this.model[endSeq] = [];
                }
                this.model[endSeq].push('$END');
            });
            
            debug(`Character model built with ${Object.keys(this.model).length} states and ${this.startSequences.length} starting sequences`);
        }
        
        generateName(minChars = 4, maxChars = 12) {
            if (this.startSequences.length === 0) {
                debug("Error: Not enough data to generate a name");
                return "Error";
            }
            
            // Start with a random starting sequence
            const currentSequence = this.startSequences[Math.floor(Math.random() * this.startSequences.length)];
            let result = currentSequence;
            
            // Generate characters until we reach the max length or natural ending
            while (result.length < maxChars) {
                const currentState = result.substring(result.length - this.order);
                
                // If we don't have this sequence in our model or reached min length with ending, break
                if (!this.model[currentState] || this.model[currentState].length === 0 || 
                    (result.length >= minChars && Math.random() > 0.7)) {
                    break;
                }
                
                // Get a random next character based on current sequence
                const nextChars = this.model[currentState];
                const nextChar = nextChars[Math.floor(Math.random() * nextChars.length)];
                
                // Check if we reached a natural end
                if (nextChar === '$END') {
                    if (result.length >= minChars) {
                        break;
                    } else {
                        // Too short, continue with a different character
                        continue;
                    }
                }
                
                result += nextChar;
            }
            
            // Ensure the name has the specified minimum length
            if (result.length < minChars) {
                // Add random characters from the model to reach minimum length
                while (result.length < minChars) {
                    const randomChar = Object.keys(this.model)[Math.floor(Math.random() * Object.keys(this.model).length)];
                    result += randomChar.charAt(0);
                }
            }
            
            // Ensure first letter is capitalized
            result = capitalizeFirstLetter(result);
            
            debug(`Generated character-based name: "${result}" (${result.length} chars)`);
            
            return result;
        }
    }
    
    // Log when the plugin command is registered
    debug("Registering plugin commands...");
    
    // Register plugin command for normal text generation
    PluginManager.registerCommand(pluginName, "generateText", function(args) {
        const evId = this._eventId;
        if (evId) {
          const ev = $gameMap.event(evId);
          if (ev) ev.turnTowardPlayer();
        }
        // 2) pause this event until the dialog finishes
        this.setWaitMode('message');
        debug("Plugin command 'generateText' called with args: " + JSON.stringify(args));
        
        const databaseId = args.databaseId;
        const chainOrder = Number(args.chainOrder || defaultChainOrder);
        const minLength = Number(args.minLength || defaultMinLength);
        const maxLength = Number(args.maxLength || defaultMaxLength);
        const faceIndex = Number(args.faceIndex || -1);
        const faceName = args.faceName || "";
        const background = Number(args.background || 0);
        const position = Number(args.position || 2);
        
        debug(`Looking for database with ID: "${databaseId}"`);
        
        // Find the database
        const database = getTextDB(databaseId);        
        if (!database) {
            console.error(`[${pluginName}] Text database with ID "${databaseId}" not found.`);
            
            // Show an error message in-game
            $gameMessage.add(`[ERROR] Text database "${databaseId}" not found.`);
            $gameMessage.add("Please check plugin parameters.");
            return;
        }
        
        debug(`Found database: "${database.name}"`);

        const selectedLanguage = ConfigManager.language === 'it' ? database.it : database.en
        
        // Get or build the Markov model
        const modelKey = `${databaseId}_${chainOrder}`;
        if (!markovModels[modelKey]) {
            debug(`Building new Markov model for "${modelKey}"`);
            markovModels[modelKey] = new MarkovChain(selectedLanguage, chainOrder);
        } else {
            debug(`Using existing Markov model for "${modelKey}"`);
        }
        
        // Generate text
        debug("Generating text...");
        const generatedText = markovModels[modelKey].generateText(minLength, maxLength);
        
        // Split the text into lines if it contains line breaks
        const textLines = generatedText.split('\n');
        
        // Show text in a message box
        const messageOptions = {
            faceName: faceName,
            faceIndex: faceIndex,
            background: background,
            positionType: position
        };
        
        debug(`Displaying message with options: ${JSON.stringify(messageOptions)}`);
        
        $gameMessage.setFaceImage(messageOptions.faceName, messageOptions.faceIndex);
        $gameMessage.setBackground(messageOptions.background);
        $gameMessage.setPositionType(messageOptions.positionType);
        
        // Add each line separately to ensure proper display
        window.skipLocalization = true;
        textLines.forEach(line => {
            $gameMessage.add(line);
        });
        window.skipLocalization = false;
        
        debug("Message added to game message queue");
    });
    function getTextDB(id) {
        const db = textDatabases.find(d => d.id === id);
        if (!db) {
          throw new Error(`[${pluginName}] Text DB "${id}" not found`);
        }
        return db;
      }
    // Register plugin command for name generation
    PluginManager.registerCommand(pluginName, "generateName", args => {
        debug("Plugin command 'generateName' called with args: " + JSON.stringify(args));
        
        const databaseId = args.databaseId;
        const chainOrder = Number(args.chainOrder || 2);
        const minChars = Number(args.minChars || defaultMinChars);
        const maxChars = Number(args.maxChars || defaultMaxChars);
        const useWordMode = args.useWordMode === "true";
        const variableId = Number(args.variableId || 0);
        const displayInMessage = args.displayInMessage === "true";
        
        debug(`Looking for database with ID: "${databaseId}" for name generation`);
        
        // Find the database
        const database = textDatabases.find(db => db.id === databaseId);
        
        if (!database) {
            console.error(`[${pluginName}] Text database with ID "${databaseId}" not found.`);
            
            // Show an error message in-game
            if (displayInMessage) {
                $gameMessage.add(`[ERROR] Text database "${databaseId}" not found.`);
                $gameMessage.add("Please check plugin parameters.");
            }
            return;
        }
        
        debug(`Found database: "${database.name}"`);
        
        let generatedName = "";
        
        if (useWordMode) {
            // Use word-based mode (for compound names)
            const modelKey = `${databaseId}_${chainOrder}`;
            if (!markovModels[modelKey]) {
                debug(`Building new word Markov model for "${modelKey}"`);
                markovModels[modelKey] = new MarkovChain(database.en, chainOrder);
            } else {
                debug(`Using existing word Markov model for "${modelKey}"`);
            }
            
            // Generate name using word-based mode
            generatedName = markovModels[modelKey].generateWordBasedName(minChars, maxChars);
        } else {
            // Use character-based mode (for more unusual names)
            const modelKey = `char_${databaseId}_${chainOrder}`;
            if (!characterMarkovModels[modelKey]) {
                debug(`Building new character Markov model for "${modelKey}"`);
                characterMarkovModels[modelKey] = new CharacterMarkov(database.en, chainOrder);
            } else {
                debug(`Using existing character Markov model for "${modelKey}"`);
            }
            
            // Generate name using character-based mode
            generatedName = characterMarkovModels[modelKey].generateName(minChars, maxChars);
        }
        
        // Ensure first letter is capitalized
        generatedName = capitalizeFirstLetter(generatedName);
        
        debug(`Generated name: "${generatedName}"`);
        
        // Store in game variable if a variable ID was provided
        if (variableId > 0) {
            $gameVariables.setValue(variableId, generatedName);
            debug(`Stored name in variable ${variableId}`);
        }
        
        // Set actor name if an actor ID was provided
        const actorId = Number(args.actorId || 0);
        if (actorId > 0) {
            const actor = $gameActors.actor(actorId);
            if (actor) {
                actor.setName(generatedName);
                debug(`Set Actor #${actorId}'s name to "${generatedName}"`);
            } else {
                console.error(`[${pluginName}] Could not find Actor with ID ${actorId}`);
            }
        }
        
        // Display in message window if requested
        if (displayInMessage) {
            $gameMessage.add(generatedName);
            debug("Name added to game message queue");
        }
    });
    
    // Log when the plugin is fully loaded
    debug("Plugin initialization complete!");




    
})();