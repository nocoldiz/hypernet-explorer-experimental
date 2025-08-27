/*:
 * @plugindesc Faction Reputation System for RPG Maker RZ
 * @author Claude
 * 
 * @param showInMenu
 * @text Show in Menu
 * @type boolean
 * @default true
 * @desc Whether to add the Faction Status option to the main menu.
 * 
 * @param menuText
 * @text Menu Command Text
 * @type string
 * @default Factions
 * @desc The text shown for the Faction Status command in the menu.
 * 
 * @param startingValues
 * @text Starting Reputation Values
 * @type string
 * @default 0,0,0,0,0,0,0,0,0,0
 * @desc Comma-separated starting values for factions (10 values for 10 factions).
 * 
 * @command open
 * @text Open Faction Screen
 * @desc Opens the faction reputation screen.
 * 
 * @command setReputation
 * @text Set Reputation
 * @desc Sets a faction's reputation to a specific value.
 * @arg factionId
 * @type number
 * @min 0
 * @max 9
 * @desc The ID of the faction (0-9).
 * @arg value
 * @type number
 * @min -100
 * @max 100
 * @desc The reputation value (-100 to 100).
 * 
 * @command changeReputation
 * @text Change Reputation
 * @desc Changes a faction's reputation by the specified amount.
 * @arg factionId
 * @type number
 * @min 0
 * @max 9
 * @desc The ID of the faction (0-9).
 * @arg change
 * @type number
 * @min -100
 * @max 100
 * @desc The amount to change reputation by (-100 to 100).
 * 
 * @command getFactionsByType
 * @text Get Factions by Type
 * @desc Gets all factions of a specific type and stores their count and IDs in variables.
 * @arg typeName
 * @type select
 * @option hardcoded
 * @option weird
 * @option modern
 * @option normal
 * @option medieval
 * @option fantascientific
 * @option criminal
 * @option nature
 * @desc The type of factions to get.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the count in. Subsequent variables will store faction IDs.
 * 
 * @command getHighestReputationFaction
 * @text Get Highest Reputation Faction
 * @desc Gets the faction ID with the highest reputation.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the faction ID in.
 * 
 * @command getLowestReputationFaction
 * @text Get Lowest Reputation Faction
 * @desc Gets the faction ID with the lowest reputation.
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the faction ID in.
 * 
 * @command checkQuestAvailability
 * @text Check Quest Availability
 * @desc Checks if a quest is available based on faction reputation.
 * @arg questId
 * @type number
 * @desc The ID of the quest.
 * @arg factionId
 * @type number
 * @min 0
 * @max 9
 * @desc The ID of the faction (0-9).
 * @arg requiredRep
 * @type number
 * @min -100
 * @max 100
 * @desc The required reputation (-100 to 100).
 * @arg switchId
 * @type switch
 * @desc The switch ID to store the result in (ON if available).
 * 
 * @command getAvailableQuestCount
 * @text Get Available Quest Count
 * @desc Gets the number of available quests for a faction.
 * @arg factionId
 * @type number
 * @min 0
 * @max 9
 * @desc The ID of the faction (0-9).
 * @arg variableId
 * @type variable
 * @desc The variable ID to store the count in.
 * 
 * @help 
 * This plugin implements a faction reputation system with 3 hardcoded factions
 * and 7 procedurally generated factions. Reputation ranges from -100 to +100.
 * 
 * Plugin Commands:
 * 
 * FactionReputationSystem open
 *   - Opens the faction reputation screen
 * 
 * FactionReputationSystem setReputation factionId value
 *   - Sets a faction's reputation to a specific value
 *   - Example: FactionReputationSystem setReputation 0 50
 * 
 * FactionReputationSystem changeReputation factionId change
 *   - Changes a faction's reputation by the specified amount
 *   - Example: FactionReputationSystem changeReputation 0 10
 *
 * Script Calls:
 *   $gameFactions.getReputation(factionId) - Get reputation value
 *   $gameFactions.setReputation(factionId, value) - Set reputation
 *   $gameFactions.getReputationLevel(factionId) - Get level text
 *   SceneManager.push(Scene_FactionStatus) - Open faction screen
 * 
 * Variables used: 30-37 for faction reputation values
 */

//=============================================================================
// Plugin Parameters and Setup
//=============================================================================

var Imported = Imported || {};
Imported.FactionReputationSystem = true;

var FRS = FRS || {};
FRS.Params = PluginManager.parameters('FactionDataManager');

FRS.Params.showInMenu = String(FRS.Params.showInMenu || 'true').toLowerCase() === 'true';
FRS.Params.menuText = String(FRS.Params.menuText || 'Factions');
FRS.Params.startingValues = String(FRS.Params.startingValues || '0,0,0,0,0,0,0,0,0,0').split(',').map(Number);

//=============================================================================
// Register Plugin Commands
//=============================================================================

PluginManager.registerCommand('FactionDataManager', 'open', args => {
    SceneManager.push(Scene_FactionStatus);
});

PluginManager.registerCommand('FactionDataManager', 'setReputation', args => {
    const factionId = Number(args.factionId || 0);
    const value = Number(args.value || 0);
    $gameFactions.setReputation(factionId, value);
});

PluginManager.registerCommand('FactionDataManager', 'changeReputation', args => {
    const factionId = Number(args.factionId || 0);
    const change = Number(args.change || 0);
    $gameFactions.changeReputation(factionId, change);
});

PluginManager.registerCommand('FactionDataManager', 'getFactionsByType', args => {
    const typeName = String(args.typeName || '');
    const variableId = Number(args.variableId || 0);
    $gameFactions.getFactionsByType(typeName, variableId);
});

PluginManager.registerCommand('FactionDataManager', 'getHighestReputationFaction', args => {
    const variableId = Number(args.variableId || 0);
    $gameFactions.getHighestReputationFaction(variableId);
});

PluginManager.registerCommand('FactionDataManager', 'getLowestReputationFaction', args => {
    const variableId = Number(args.variableId || 0);
    $gameFactions.getLowestReputationFaction(variableId);
});

PluginManager.registerCommand('FactionDataManager', 'checkQuestAvailability', args => {
    const questId = Number(args.questId || 0);
    const factionId = Number(args.factionId || 0);
    const requiredRep = Number(args.requiredRep || 0);
    const switchId = Number(args.switchId || 0);
    $gameFactions.checkQuestAvailability(questId, factionId, requiredRep, switchId);
});

PluginManager.registerCommand('FactionDataManager', 'getAvailableQuestCount', args => {
    const factionId = Number(args.factionId || 0);
    const variableId = Number(args.variableId || 0);
    $gameFactions.getAvailableQuestCount(factionId, variableId);
});

//=============================================================================
// Game_Factions - Handles faction data and operations
//=============================================================================

function Game_Factions() {
    this.initialize(...arguments);
}

Game_Factions.prototype.initialize = function() {
    this._dataManager = new FactionDataManager();
    this._reputations = [];
    this.initializeReputations();
};

Game_Factions.prototype.initializeReputations = function() {
    // Initialize reputations from plugin parameters
    this._reputations = FRS.Params.startingValues.slice(0, 10);
    
    // Fill with zeros if there are not enough values
    while (this._reputations.length < 10) {
        this._reputations.push(0);
    }
};

Game_Factions.prototype.getReputation = function(factionId) {
    if (factionId >= 0 && factionId < this._reputations.length) {
        return this._reputations[factionId];
    }
    return 0;
};

Game_Factions.prototype.setReputation = function(factionId, value) {
    if (factionId >= 0 && factionId < this._reputations.length) {
        this._reputations[factionId] = Math.max(-100, Math.min(100, value));
        
        // Update variable value
        const faction = this._dataManager._factions[factionId];
        if (faction && faction.variableId) {
            $gameVariables.setValue(faction.variableId, this._reputations[factionId]);
        }
        
        // Update relationships with other factions
        this.updateRelatedFactions(factionId, value);
    }
};

Game_Factions.prototype.changeReputation = function(factionId, change) {
    if (factionId >= 0 && factionId < this._reputations.length) {
        const newValue = this.getReputation(factionId) + change;
        this.setReputation(factionId, newValue);
    }
};

Game_Factions.prototype.updateRelatedFactions = function(factionId, newValue) {
    // Skip if relationships aren't initialized
    if (!this._dataManager._relationships) {
        this._dataManager.initializeRelationships();
    }
    
    // Check if this is a significant reputation change
    const oldValue = this.getReputation(factionId);
    const change = newValue - oldValue;
    
    // Only update related factions if change is significant (>= 10 points)
    if (Math.abs(change) >= 10) {
        for (let i = 0; i < this._dataManager._factions.length; i++) {
            if (i !== factionId) {
                const relationship = this._dataManager._relationships[factionId][i];
                
                // Update related faction's reputation based on relationship
                if (relationship !== 0) {
                    const relatedChange = Math.floor(change * relationship * 0.2);
                    if (relatedChange !== 0) {
                        this.changeReputation(i, relatedChange);
                    }
                }
            }
        }
    }
};

Game_Factions.prototype.getReputationLevel = function(factionId) {
    const reputation = this.getReputation(factionId);
    
    if (reputation >= 80) return "Exalted";
    if (reputation >= 60) return "Revered";
    if (reputation >= 40) return "Honored";
    if (reputation >= 20) return "Friendly";
    if (reputation >= -20) return "Neutral";
    if (reputation >= -40) return "Unfriendly";
    if (reputation >= -60) return "Hostile";
    if (reputation >= -80) return "Hated";
    return "Nemesis";
};

Game_Factions.prototype.getReputationColor = function(factionId) {
    const reputation = this.getReputation(factionId);
    
    if (reputation >= 80) return '#00FF00'; // Bright green
    if (reputation >= 60) return '#32CD32'; // Lime green
    if (reputation >= 40) return '#90EE90'; // Light green
    if (reputation >= 20) return '#98FB98'; // Pale green
    if (reputation >= -20) return '#FFFFFF'; // White
    if (reputation >= -40) return '#FFA07A'; // Light salmon
    if (reputation >= -60) return '#FF6347'; // Tomato
    if (reputation >= -80) return '#FF4500'; // Orange red
    return '#FF0000'; // Red
};

Game_Factions.prototype.getReputationPerks = function(factionId) {
    const reputation = this.getReputation(factionId);
    const perks = [];
    
    // Generic perks based on reputation level
    if (reputation >= 20) {
        perks.push("Basic services and goods available");
    }
    if (reputation >= 40) {
        perks.push("10% discount on faction goods");
        perks.push("Access to uncommon items");
    }
    if (reputation >= 60) {
        perks.push("25% discount on faction goods");
        perks.push("Access to rare items");
        perks.push("Faction members will assist in battle");
    }
    if (reputation >= 80) {
        perks.push("40% discount on faction goods");
        perks.push("Access to exclusive items");
        perks.push("Faction special quests available");
        perks.push("Faction safe houses accessible");
    }
    
    // Negative perks
    if (reputation <= -20) {
        perks.push("Most faction services unavailable");
    }
    if (reputation <= -40) {
        perks.push("Faction members may refuse to interact");
        perks.push("Guards will be suspicious of you");
    }
    if (reputation <= -60) {
        perks.push("Faction territory is dangerous to enter");
        perks.push("Faction members may attack on sight");
    }
    if (reputation <= -80) {
        perks.push("Faction sends bounty hunters after you");
        perks.push("Allied factions may become hostile");
    }
    
    return perks;
};

Game_Factions.prototype.getRelationship = function(factionId1, factionId2) {
    // Initialize relationships if not already done
    if (!this._dataManager._relationships) {
        this._dataManager.initializeRelationships();
    }
    
    if (factionId1 >= 0 && factionId1 < this._dataManager._factions.length &&
        factionId2 >= 0 && factionId2 < this._dataManager._factions.length) {
        return this._dataManager._relationships[factionId1][factionId2];
    }
    return 0;
};

Game_Factions.prototype.getRelationshipName = function(factionId1, factionId2) {
    const relationship = this.getRelationship(factionId1, factionId2);
    
    switch (relationship) {
        case 2: return "Allied";
        case 1: return "Friendly";
        case 0: return "Neutral";
        case -1: return "Unfriendly";
        case -2: return "Hostile";
        default: return "Unknown";
    }
};

Game_Factions.prototype.getAllFactions = function() {
    return this._dataManager._factions;
};

Game_Factions.prototype.getFaction = function(factionId) {
    if (factionId >= 0 && factionId < this._dataManager._factions.length) {
        return this._dataManager._factions[factionId];
    }
    return null;
};

Game_Factions.prototype.getFactionsByType = function(typeName, variableId) {
    let factionIds = [];
    
    // Map faction types to indices
    const typeIndices = {
        'hardcoded': [0, 1, 2],
        'weird': [3],
        'modern': [4],
        'normal': [5],
        'medieval': [6],
        'fantascientific': [7],
        'criminal': [8],
        'nature': [9]
    };
    
    // Get faction IDs by type
    if (typeIndices[typeName]) {
        factionIds = typeIndices[typeName];
    }
    
    // Store count in variableId
    $gameVariables.setValue(variableId, factionIds.length);
    
    // Store faction IDs in subsequent variables
    for (let i = 0; i < factionIds.length; i++) {
        $gameVariables.setValue(variableId + i + 1, factionIds[i]);
    }
};

Game_Factions.prototype.getHighestReputationFaction = function(variableId) {
    let highestRepFaction = 0;
    let highestRep = -101;
    
    for (let i = 0; i < this._reputations.length; i++) {
        if (this._reputations[i] > highestRep) {
            highestRep = this._reputations[i];
            highestRepFaction = i;
        }
    }
    
    $gameVariables.setValue(variableId, highestRepFaction);
};

Game_Factions.prototype.getLowestReputationFaction = function(variableId) {
    let lowestRepFaction = 0;
    let lowestRep = 101;
    
    for (let i = 0; i < this._reputations.length; i++) {
        if (this._reputations[i] < lowestRep) {
            lowestRep = this._reputations[i];
            lowestRepFaction = i;
        }
    }
    
    $gameVariables.setValue(variableId, lowestRepFaction);
};

Game_Factions.prototype.checkQuestAvailability = function(questId, factionId, requiredRep, switchId) {
    const reputation = this.getReputation(factionId);
    const isAvailable = reputation >= requiredRep;
    
    $gameSwitches.setValue(switchId, isAvailable);
};

Game_Factions.prototype.getAvailableQuestCount = function(factionId, variableId) {
    // This is a placeholder function that would normally check quest data
    // For now, we'll simulate based on reputation
    const reputation = this.getReputation(factionId);
    let questCount = 0;
    
    if (reputation >= -20) questCount += 1;
    if (reputation >= 20) questCount += 1;
    if (reputation >= 40) questCount += 1;
    if (reputation >= 60) questCount += 2;
    if (reputation >= 80) questCount += 3;
    
    $gameVariables.setValue(variableId, questCount);
};

//=============================================================================
// Faction Data Manager
//=============================================================================

function FactionDataManager() {
    this.initialize(...arguments);
}

FactionDataManager.prototype.initialize = function() {
    this._factions = [];
    this._setupHardcodedFactions();
    this._generateProceduralfactions();
};

FactionDataManager.prototype._setupHardcodedFactions = function() {
    // Hardcoded factions
    this._factions.push({
        id: 0,
        name: "Mages Guild",
        description: "An ancient organization dedicated to the study and regulation of arcane arts. Founded over five centuries ago by the legendary archmage Elyndria during the Cataclysm of Broken Stars, the Mages Guild serves as both an educational institution and a governing body for all registered practitioners of magic.\n\nHeadquartered in the floating citadel of Arcanium, the Guild maintains a strict hierarchy of seven circles, each representing mastery of different magical disciplines. Their Arcane Conservatory houses over 10,000 rare spellbooks and artifacts, including the controversial Codex Infinitum—said to contain spells capable of rewriting reality itself.\n\nThe Guild's current Archmagister, Thelion Vex, has pushed for greater oversight of wild magic practitioners, creating tension with independent spellcasters who view the Guild as increasingly authoritarian. Recent rumors suggest the Guild's Inner Circle is researching methods to stabilize the deteriorating boundaries between elemental planes, though skeptics claim this is merely a front for more sinister experiments.",
        variableId: 30
    });
    
    this._factions.push({
        id: 1,
        name: "Archive Foundation",
        description: "A scholarly collective focused on preserving knowledge across dimensions. The Archive Foundation emerged from the scattered remnants of the Great Library of Nemora after its destruction in the Time Wars. Led by the enigmatic Curator Prime, whose true identity remains unknown, the Foundation operates a network of hidden repositories throughout the world.\n\nTheir agents, known as Chroniclers, travel far and wide to recover lost knowledge, often venturing into dangerous ruins and forgotten realms. Each Chronicler specializes in a specific field of study, marked by the color of their signature recording crystals. The Foundation maintains the largest library in the known realms, with artifacts and tomes dating back to the First Era.\n\nThe Foundation's headquarters, the Infinite Archive, exists partially outside normal spacetime, allowing it to house an impossible amount of information in a seemingly modest building. Rumors persist that the deepest vaults contain forbidden knowledge from civilizations that never existed in our timeline. The Foundation's motto, 'Knowledge Transcends Time,' reflects their controversial belief that preserving information takes precedence over the potential dangers of its misuse.",
        variableId: 31
    });
    
    this._factions.push({
        id: 2,
        name: "Hypercapitalist Collective",
        description: "A powerful economic alliance that controls major trade routes and resources across continents. Founded by the infamous 'Seven Merchant Princes' after the collapse of the Imperial Economy, the Hypercapitalist Collective believes that unrestricted commerce is the path to societal progress and technological innovation.\n\nTheir sprawling headquarters, the Golden Spire, towers over the trade hub of Port Maximilian, where their elite security force—the Contract Enforcers—maintain order with advanced weaponry and strict interpretation of the Collective's byzantine commercial laws. The Collective operates through a complex system of subsidiaries, shell companies, and proxy merchants, making it difficult to determine where their influence ends.\n\nAt the heart of their philosophy is the 'Invisible Ledger,' a semi-mystical economic theory that views all human interactions as transactions with quantifiable value. Their grandmaster accountants, known as Profit Oracles, use specialized calculating devices to predict market trends with uncanny accuracy. Critics accuse the Collective of dabbling in forbidden blood magic to manipulate markets, while supporters point to their innovations in trade technology and the relative stability of regions under their economic control.",
        variableId: 32
    });
};

FactionDataManager.prototype._generateProceduralfactions = function() {
    // Procedural faction generation
    const factionTypes = [
        this._generateWeirdFaction,
        this._generateModernFaction,
        this._generateNormalFaction,
        this._generateMedievalFaction,
        this._generateFantascientificFaction,
        this._generateCriminalFaction,
        this._generateNatureFaction
    ];
    
    // Create 7 procedural factions
    for (let i = 0; i < 7; i++) {
        const generatorFunc = factionTypes[i % factionTypes.length];
        const faction = generatorFunc.call(this, i + 3);
        this._factions.push(faction);
    }
};

FactionDataManager.prototype._generateWeirdFaction = function(id) {
    const prefixes = ["Ethereal", "Whispering", "Nebulous", "Paradox", "Enigma", "Quantum", "Void"];
    const suffixes = ["Collective", "Paradigm", "Consortium", "Cognition", "Assembly", "Nexus", "Continuum"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A druidic order", "A coalition of nature spirits", "A tribe of shapeshifters", "An ancient elemental sect"],
        ["safeguarding the balance of nature", "communing with primordial forces", "protecting endangered species and magical groves", "opposing unchecked civilization"],
        ["through ancient rituals", "with the aid of animal companions", "using nature-based magic", "across untamed wilderness regions"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded in the aftermath of the Scouring, when the Archmage Veldorn's failed experiment turned the lush Eversong Valley into the blighted wastelands now known as the Desolation",
        "Emerged when the Great World Tree Yggdrasil granted sentience and purpose to seven guardians formed from its roots, branches, leaves, fruits, sap, bark, and flowers",
        "Formed during the industrial expansion of the Second Age, when displaced druids and forest dwellers united against the encroaching smokestacks and logging operations",
        "Created through a covenant between mortals and elemental spirits after the catastrophic Flame Wars threatened to destabilize natural cycles across the realm"
    ];
    
    const sanctuaries = [
        "Their primary sanctuary, the Heart Grove, exists within an ancient forest where time flows differently, allowing trees to reach impossible sizes and animals to develop unique adaptations",
        "Their network of sacred springs contains waters with remarkable healing properties, carefully tended by guardians who judge worthiness of those seeking restoration",
        "Their seasonal gathering sites align with powerful ley line convergences, allowing them to conduct rituals that help maintain the balance of elemental forces worldwide",
        "Their hidden valley sanctuaries serve as refuges for endangered magical creatures, protected by illusions, natural barriers, and guardians willing to give their lives in defense"
    ];
    
    const practices = [
        "Members undergo a profound communion ritual where they spiritually bond with a specific aspect of nature, gaining related abilities but also taking on corresponding responsibilities",
        "Their druids can enter the Green Dream—a collective consciousness connecting all plant life—to monitor ecological health across vast distances",
        "Their shapeshifters maintain ancient bloodlines of therianthropes, passing down both the ability to assume animal forms and the wisdom of those species",
        "Their elemental shamans can temporarily embody natural forces, becoming living manifestations of fire, water, earth, air, wood, or stone"
    ];
    
    const conflicts = [
        "Their opposition to the rapidly expanding Nanoforge Consortium has escalated from diplomatic protests to sabotage of facilities deemed most harmful to natural balance",
        "Their increasingly aggressive stance against frontier settlements has drawn military response, though public opinion remains divided on the issue",
        "Internal schism divides those who advocate for complete separation from civilization and those who believe in guiding humanity toward sustainable coexistence",
        "Their ancient rivalry with the Cult of the Ashen Heart stems from fundamentally opposed views on humanity's relationship with natural forces"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. Their symbol—a ${this._randomElement(["spiraling leaf", "blooming flower encircled by thorns", "tree with roots as vast as its branches", "perfect balance of elemental icons"])}—represents their commitment to maintaining natural harmony in an increasingly unbalanced world.\n\n${this._randomElement(sanctuaries)}. ${this._randomElement(practices)}. Their knowledge of botanical medicine far exceeds that of conventional healers, though they share this wisdom selectively.\n\nWhile generally preferring peaceful coexistence, ${this._randomElement(conflicts).toLowerCase()}. To allies, they offer guidance, protection, and natural bounty; to enemies, they demonstrate that nature's apparent tranquility masks tremendous power when threatened.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Complete the Modern Faction generation function
FactionDataManager.prototype._generateModernFaction = function(id) {
    const prefixes = ["Global", "United", "Strategic", "Progressive", "Dynamic", "Integrated", "Advanced"];
    const suffixes = ["Solutions", "Industries", "Network", "Coalition", "Initiative", "Alliance", "Corporation"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A multinational organization", "A corporate entity", "A global consortium", "A technological innovator"],
        ["specializing in cutting-edge research", "leveraging big data and AI", "with extensive political connections", "controlling vital infrastructure"],
        ["shaping the modern world", "with questionable ethical practices", "revolutionizing multiple industries", "with unprecedented resources"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded in the aftermath of the Resource Wars by a coalition of tech visionaries and venture capitalists",
        "Evolved from a small startup in Nexus City to become a dominant force in global markets within a decade",
        "Created through the controversial merger of seven competing corporations following the Economic Collapse",
        "Established by the enigmatic CEO known only as 'The Architect' whose true identity remains unknown"
    ];
    
    const operations = [
        "Their headquarters, a gleaming 300-story tower of smart-glass and carbon nanotubes, houses over 20,000 employees from 87 different countries",
        "They maintain an elite security force composed of ex-special forces operatives and cutting-edge combat drones",
        "Their R&D division operates from a floating artificial island with sovereign status outside international law",
        "Their proprietary algorithms predict market trends and consumer behavior with 98.7% accuracy, raising concerns about market manipulation"
    ];
    
    const projects = [
        "Their Project Ascension aims to develop neural interfaces that can directly upload skills and knowledge to the human brain",
        "Their Prometheus Initiative focuses on artificial general intelligence with rumored sentience capabilities",
        "Their Lazarus Protocol reportedly experiments with life extension technology for their executive class",
        "Their Orpheus Network integrates surveillance systems across major urban centers for 'public safety purposes'"
    ];
    
    const controversies = [
        "Critics point to their aggressive acquisition of water rights in drought-stricken regions as evidence of exploitation",
        "Several whistleblowers have disappeared after threatening to expose their alleged human enhancement experiments",
        "Their tax haven operations have drawn criticism from international regulatory bodies",
        "The mysterious disappearance of three competing research teams remains unofficially linked to their market dominance"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. ${this._randomElement(operations)}. ${this._randomElement(projects)}.\n\nPublic opinion remains divided on their influence: supporters credit them with technological breakthroughs that have improved quality of life, while detractors warn of their growing power. ${this._randomElement(controversies)}. Despite investigations, their complex legal structure and political connections have shielded them from serious consequences.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Normal faction generator
FactionDataManager.prototype._generateNormalFaction = function(id) {
    const prefixes = ["Citizens", "Community", "Public", "People's", "Regional", "Civic", "Urban"];
    const suffixes = ["Association", "Union", "Council", "League", "Alliance", "Coalition", "Trust"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A grassroots movement", "A community organization", "A local collective", "A public interest group"],
        ["working to improve daily life", "promoting mutual aid and support", "advocating for social reforms", "preserving cultural heritage"],
        ["with strong neighborhood ties", "through direct community action", "despite limited resources", "with growing influence"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded by seven neighbors after the Great Flood devastated their district and official relief efforts failed to materialize",
        "Evolved from weekly community meetings in Oak Park that started during the economic downturn twenty years ago",
        "Formed when local artisans and merchants united against the encroachment of corporate chain stores in their historic district",
        "Started as a parent-teacher initiative that expanded to address broader community needs after budget cuts to essential services"
    ];
    
    const structure = [
        "Led by a rotating council of elected representatives from each neighborhood district, with decisions made by consensus",
        "Operates through a network of interconnected mutual aid circles, each focusing on different community needs",
        "Maintains a modest headquarters in a renovated community center that serves as meeting space, food bank, and skills workshop",
        "Organized into specialized committees handling everything from conflict resolution to garden maintenance to emergency response"
    ];
    
    const activities = [
        "Their weekly market exchange allows community members to trade goods and services without currency",
        "Their neighborhood watch program has reduced crime by 40% while avoiding confrontational policing tactics",
        "Their community garden network produces fresh food for local families and maintains traditional agricultural knowledge",
        "Their skill-sharing workshops teach everything from home repair to conflict mediation to financial literacy"
    ];
    
    const challenges = [
        "They struggle to maintain cohesion as the community grows and becomes more diverse",
        "Their limited budget means they rely heavily on volunteer labor and donated materials",
        "They face increasing pressure from development interests seeking to gentrify the neighborhood",
        "Tensions occasionally arise between founding members with traditional approaches and newer members pushing for innovation"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. ${this._randomElement(structure)}. They've become an integral part of local life, with approximately one in three residents participating in their activities in some capacity.\n\n${this._randomElement(activities)}. Their annual community festival has become a regional attraction, drawing visitors from neighboring areas. However, ${this._randomElement(challenges).toLowerCase()}. Despite these challenges, they've created a model of community resilience that's being studied and adapted by other neighborhoods.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Medieval faction generator
FactionDataManager.prototype._generateMedievalFaction = function(id) {
    const prefixes = ["Royal", "Noble", "Ancient", "Iron", "Crimson", "Golden", "Shadow"];
    const suffixes = ["Order", "Brotherhood", "Knights", "Guard", "Regiment", "Dynasty", "Crown"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A venerable order of knights", "A secretive brotherhood", "A royal guard regiment", "An ancient noble house"],
        ["sworn to protect the realm", "upholding chivalric traditions", "with bloodlines dating back centuries", "wielding ancient magical artifacts"],
        ["serving the monarch directly", "maintaining order throughout the kingdom", "preserving ancient traditions", "with complex political alliances"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded during the Seventh Crusade by seven battle-hardened knights who survived the Siege of Dragonspire",
        "Established by royal decree following the assassination of King Aldric III to ensure such treachery would never succeed again",
        "Formed when the ancient Houses of Hawthorne and Blackthorn united through marriage after centuries of bitter rivalry",
        "Created to guard the sacred relics recovered from the ruins of the First Temple after the Cataclysm"
    ];
    
    const traditions = [
        "Members undergo the Seven Trials—tests of combat prowess, wisdom, endurance, loyalty, sacrifice, honor, and faith",
        "Their elaborate initiation ceremony involves a night-long vigil in the Sacred Crypt followed by anointing with oils blessed by the High Priestess",
        "Each member carries a ceremonial blade forged from meteoric iron, passed down through generations and said to hold the spirits of all who wielded it",
        "They maintain a strict code of honor embodied in the Thirteen Virtues, violations of which are punished by exile or worse"
    ];
    
    const holdings = [
        "Their ancestral fortress, Highkeep, stands atop the Dragonspine Mountains with walls thirty feet thick and towers that pierce the clouds",
        "They control the strategic Silverway Pass, collecting tolls that fund their operations and the maintenance of the King's highways",
        "Their chapter houses in each of the Seven Kingdoms serve as centers of training, governance, and occasionally sanctuary for those in need",
        "The Order's treasury contains wealth accumulated over centuries, including legendary artifacts thought lost to time"
    ];
    
    const politics = [
        "Their supposed neutrality in court politics is increasingly strained as factions vie for their support in the succession crisis",
        "Recent conflicts with the rising merchant guilds threaten their traditional authority over certain trade routes",
        "The current Grandmaster's controversial reforms have created a schism between traditionalists and progressives within the ranks",
        "Their ancient rivalry with the Twilight Brotherhood has erupted into open hostility following border disputes"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. Their heraldry—a ${this._randomElement(["golden griffin", "silver sword", "crimson dragon", "black raven", "azure lion"])} on a field of ${this._randomElement(["midnight blue", "forest green", "deep crimson", "royal purple", "burnished gold"])}—is recognized throughout the realm as a symbol of ${this._randomElement(["justice", "protection", "nobility", "power", "tradition"])}.\n\n${this._randomElement(traditions)}. ${this._randomElement(holdings)}.\n\nThough respected for their ${this._randomElement(["valor", "honor", "wisdom", "strength", "discipline"])}, ${this._randomElement(politics).toLowerCase()}. Commoners view them with a mixture of awe, gratitude, and trepidation—aware of both their protective role and their considerable power.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Fantascientific faction generator
FactionDataManager.prototype._generateFantascientificFaction = function(id) {
    const prefixes = ["Astral", "Xenotech", "Chrono", "Nanoforge", "Psionic", "Flux", "Biotech"];
    const suffixes = ["Directive", "Division", "Protocol", "Synthesis", "Vanguard", "Enclave", "Consortium"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A techno-magical research division", "An interdimensional exploration unit", "A collective of augmented beings", "A temporal manipulation institute"],
        ["fusing arcane knowledge with advanced technology", "experimenting with reality-altering devices", "developing bio-magical enhancements", "harnessing cosmic energies"],
        ["to transcend conventional limitations", "creating technologies indistinguishable from magic", "reshaping the fundamental laws of existence", "with unforeseen consequences"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Emerged from the ruins of the Technomancer Wars when a group of surviving scientists discovered ancient crystalline technology beneath the shattered Academy",
        "Founded by the brilliant but controversial Dr. Elysium Vex after her exile from the Imperial Science Council for 'ethical transgressions'",
        "Formed after the Great Convergence, when the boundaries between dimensions temporarily collapsed, allowing unprecedented access to xenotechnology",
        "Created by a coalition of rogue arcanists and quantum engineers seeking to bridge the divide between traditional magic and cutting-edge science"
    ];
    
    const facilities = [
        "Their headquarters, the Nexus Spire, exists partially phased out of conventional spacetime, allowing for experiments that would destabilize normal reality",
        "Their seven research facilities are strategically positioned along ley line intersections to harness ambient magical energy for their technological applications",
        "Their mobile research platform, the Arcanova, constantly shifts location to avoid detection while conducting experiments in different environmental conditions",
        "Their underground complex spans ten sublevels, with security increasing exponentially as one descends toward the reality-warping Core Chamber"
    ];
    
    const achievements = [
        "Their Consciousness Transfer Protocol has successfully moved minds between organic bodies, mechanical constructs, and even temporary energy states",
        "Their Quantum Entanglement Thaumaturgy allows for instantaneous communication across vast distances, revolutionizing both military strategy and commerce",
        "Their Bioadaptive Implant System grants users enhanced abilities ranging from accelerated healing to elemental manipulation",
        "Their Chronofracture Engine can create localized time dilation fields, allowing experiments to run for subjective years while only minutes pass outside"
    ];
    
    const controversies = [
        "Reports of missing persons near their facilities have fueled rumors of non-consensual experimentation on unwitting subjects",
        "Several catastrophic containment breaches have released anomalous phenomena into surrounding regions, causing unusual mutations in local wildlife",
        "Their increasing autonomy from government oversight raises concerns about their ultimate objectives and accountability",
        "Whistleblowers claim they've begun experimenting with consciousness fragmentation to create networked hive minds with specialized cognitive functions"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. ${this._randomElement(facilities)}. Their researchers often undergo extensive modifications themselves, blurring the line between user and technology.\n\n${this._randomElement(achievements)}. Their developments have revolutionized multiple fields and attracted both admiration and concern from traditional powers. However, ${this._randomElement(controversies).toLowerCase()}.\n\nDespite these concerns, their technological marvels remain highly sought after, and their representatives can be found in the courts of kings and the boardrooms of corporations alike, offering wonders to those with sufficient resources and flexible ethical standards.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Criminal faction generator
FactionDataManager.prototype._generateCriminalFaction = function(id) {
    const prefixes = ["Shadow", "Scarlet", "Silent", "Black", "Venom", "Phantom", "Crimson"];
    const suffixes = ["Syndicate", "Cartel", "Rogues", "Hand", "Daggers", "Guild", "Network"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A sophisticated criminal organization", "An underground network of thieves", "A ruthless smuggling operation", "A secretive assassins guild"],
        ["controlling the city's black market", "with spies in every major institution", "specializing in rare and illegal goods", "offering services to the highest bidder"],
        ["feared even by the authorities", "with a strict code of honor", "hiding behind legitimate businesses", "extending influence beyond borders"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded by former members of the Royal Intelligence Service who used their training to establish a shadow empire after being betrayed by the Crown",
        "Evolved from a prisoner revolt in the notorious Blackgate Penitentiary, where the Seven Original captives formed a pact written in their own blood",
        "Created by dispossessed nobility after the Great Revolution, using their remaining wealth and connections to rebuild power from the shadows",
        "Emerged from the ruins of the old Thieves' Quarter when the legendary master thief known only as 'The Wraith' unified warring criminal factions"
    ];
    
    const structure = [
        "Organized into specialized cells with members knowing only their immediate contacts, creating a compartmentalized network resistant to infiltration",
        "Governed by the Council of Shadows—seven masked figures whose true identities remain unknown even to high-ranking members",
        "Structured like a twisted mirror of feudal hierarchy, with territory bosses swearing fealty to underbosses, who in turn serve the Crimson Prince",
        "Operated through a complex system of favors and debts recorded in the legendary Ledger of Bonds, with even a small debt binding one to the organization"
    ];
    
    const operations = [
        "Their counterfeiting operation produces forgeries so perfect that even master artisans cannot distinguish them from originals",
        "Their smuggling network utilizes a system of hidden tunnels beneath the city, remnants of an ancient civilization repurposed for moving contraband",
        "Their extortion racket extends to the highest levels of government, with compromising information on officials stored in seven separate locations",
        "Their assassination services range from crude displays of brutality meant to send messages to untraceable 'natural deaths' for premium clients"
    ];
    
    const customs = [
        "Members bear an invisible magical brand that burns intensely if they betray the organization's secrets",
        "Internal disputes are settled in the Crimson Circle—a dueling ring where combat continues until one party yields or dies",
        "New recruits must successfully complete seven increasingly difficult tasks, culminating in a final test of absolute loyalty",
        "Their elaborate communication system uses seemingly innocent phrases, objects, and symbols to convey complex messages in plain sight"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. ${this._randomElement(structure)}. Their influence extends through all layers of society, from the sewers to the palace.\n\n${this._randomElement(operations)}. These criminal enterprises generate immense wealth, carefully laundered through seemingly legitimate businesses throughout the realm. ${this._randomElement(customs)}.\n\nWhile officially condemned by authorities, pragmatic officials often turn a blind eye to their activities in exchange for information or assistance with matters requiring discretion and deniability. Those who cross them rarely live long enough to regret it, though occasionally, individuals of exceptional talent may be offered membership as an alternative to elimination.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Nature faction generator
FactionDataManager.prototype._generateNatureFaction = function(id) {
    const prefixes = ["Emerald", "Verdant", "Wild", "Primal", "Gaia's", "Earthen", "Forest"];
    const suffixes = ["Guardians", "Circle", "Conclave", "Wardens", "Keepers", "Protectors", "Stewards"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A druidic order", "A coalition of nature spirits", "A tribe of shapeshifters", "An ancient elemental sect"],
        ["safeguarding the balance of nature", "communing with primordial forces", "protecting endangered species and magical groves", "opposing unchecked civilization"],
        ["through ancient rituals", "with the aid of animal companions", "using nature-based magic", "across untamed wilderness regions"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded in the aftermath of the Scouring, when the Archmage Veldorn's failed experiment turned the lush Eversong Valley into the blighted wastelands now known as the Desolation",
        "Emerged when the Great World Tree Yggdrasil granted sentience and purpose to seven guardians formed from its roots, branches, leaves, fruits, sap, bark, and flowers",
        "Formed during the industrial expansion of the Second Age, when displaced druids and forest dwellers united against the encroaching smokestacks and logging operations",
        "Created through a covenant between mortals and elemental spirits after the catastrophic Flame Wars threatened to destabilize natural cycles across the realm"
    ];
    
    const sanctuaries = [
        "Their primary sanctuary, the Heart Grove, exists within an ancient forest where time flows differently, allowing trees to reach impossible sizes and animals to develop unique adaptations",
        "Their network of sacred springs contains waters with remarkable healing properties, carefully tended by guardians who judge worthiness of those seeking restoration",
        "Their seasonal gathering sites align with powerful ley line convergences, allowing them to conduct rituals that help maintain the balance of elemental forces worldwide",
        "Their hidden valley sanctuaries serve as refuges for endangered magical creatures, protected by illusions, natural barriers, and guardians willing to give their lives in defense"
    ];
    
    const practices = [
        "Members undergo a profound communion ritual where they spiritually bond with a specific aspect of nature, gaining related abilities but also taking on corresponding responsibilities",
        "Their druids can enter the Green Dream—a collective consciousness connecting all plant life—to monitor ecological health across vast distances",
        "Their shapeshifters maintain ancient bloodlines of therianthropes, passing down both the ability to assume animal forms and the wisdom of those species",
        "Their elemental shamans can temporarily embody natural forces, becoming living manifestations of fire, water, earth, air, wood, or stone"
    ];
    
    const conflicts = [
        "Their opposition to the rapidly expanding Nanoforge Consortium has escalated from diplomatic protests to sabotage of facilities deemed most harmful to natural balance",
        "Their increasingly aggressive stance against frontier settlements has drawn military response, though public opinion remains divided on the issue",
        "Internal schism divides those who advocate for complete separation from civilization and those who believe in guiding humanity toward sustainable coexistence",
        "Their ancient rivalry with the Cult of the Ashen Heart stems from fundamentally opposed views on humanity's relationship with natural forces"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. Their symbol—a ${this._randomElement(["spiraling leaf", "blooming flower encircled by thorns", "tree with roots as vast as its branches", "perfect balance of elemental icons"])}—represents their commitment to maintaining natural harmony in an increasingly unbalanced world.\n\n${this._randomElement(sanctuaries)}. ${this._randomElement(practices)}. Their knowledge of botanical medicine far exceeds that of conventional healers, though they share this wisdom selectively.\n\nWhile generally preferring peaceful coexistence, ${this._randomElement(conflicts).toLowerCase()}. To allies, they offer guidance, protection, and natural bounty; to enemies, they demonstrate that nature's apparent tranquility masks tremendous power when threatened.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Weird faction generator
FactionDataManager.prototype._generateWeirdFaction = function(id) {
    const prefixes = ["Ethereal", "Whispering", "Nebulous", "Paradox", "Enigma", "Quantum", "Void"];
    const suffixes = ["Collective", "Paradigm", "Consortium", "Cognition", "Assembly", "Nexus", "Continuum"];
    
    const name = `${this._randomElement(prefixes)} ${this._randomElement(suffixes)}`;

    const conceptParts = [
        ["A mysterious philosophical movement", "An esoteric cult", "A consciousness-expanding fellowship", "A reality-bending cabal"],
        ["seeking hidden truths", "exploring the nature of existence", "communing with extradimensional entities", "pursuing transcendence"],
        ["through mind-altering rituals", "by bending the laws of physics", "using forbidden knowledge", "with perplexing methods"]
    ];
    
    // Generate detailed lore components
    const origins = [
        "Founded after seven scholars simultaneously experienced the same prophetic dream across different continents, guiding them to converge at an ancient ruin",
        "Emerged from the aftermath of the Dimensional Collapse, when a small group of survivors gained the ability to perceive and manipulate multiple realities",
        "Formed when an eccentric philosopher discovered mathematical equations that revealed the universe to be a construct within a larger multiverse",
        "Created through a strange accident involving experimental consciousness-altering substances and deep meditation techniques"
    ];
    
    const practices = [
        "Members practice 'thought-folding'—a mental discipline allowing them to perceive and process seven different trains of thought simultaneously",
        "Their communication occurs partially through conventional language and partially through a shared dreamspace accessible only to initiates",
        "Their meditation chambers feature non-Euclidean architecture that appears impossible from the outside but expands infinitely inward",
        "They maintain a living library where memories and knowledge are stored in specially cultivated plants that can transfer information directly to the mind"
    ];
    
    const beliefs = [
        "They believe reality is fundamentally unstable, and through careful manipulation of perception, one can reshape the consensus that forms existence",
        "Their cosmology describes the universe as a thought experiment conducted by seven primordial entities seeking to understand their own nature",
        "They maintain that time is not linear but fractal, with each moment containing infinite variations that can be accessed through specific mental states",
        "Their central tenet holds that consciousness is the primary force in the universe, with matter being merely a condensed form of thought energy"
    ];
    
    const mysteries = [
        "Visitors to their sanctums often report experiencing time dilation, with hours inside corresponding to minutes outside—though some emerge having aged years",
        "Their highest-ranking members appear to exist in multiple locations simultaneously, a phenomenon they refer to as 'distributed selfhood'",
        "Objects in their possession sometimes display properties that defy conventional physics, such as books whose contents change between readings",
        "Their prophecies, while seemingly nonsensical at first, have an uncanny tendency to become clear just as the predicted events begin to unfold"
    ];
    
    // Assemble the description
    const description = `${this._randomElement(conceptParts[0])} ${this._randomElement(conceptParts[1])}, ${this._randomElement(conceptParts[2])}.\n\n${this._randomElement(origins)}. Their symbol—an ${this._randomElement(["impossible geometric shape that seems to rotate in place", "eye with a spiral pupil that appears to follow viewers from any angle", "shifting pattern of lines that form different images depending on the viewer's thoughts", "arrangement of dots that subtly rearranges itself when not directly observed"])}—represents their unconventional perception of reality.\n\n${this._randomElement(practices)}. ${this._randomElement(beliefs)}.\n\nTheir true motives remain enigmatic even to those who study them extensively. ${this._randomElement(mysteries)}. Most authorities view them with suspicion, though none can precisely articulate what laws they might be breaking. The general public alternately dismisses them as eccentric philosophers or fears them as reality-warping sorcerers—both perspectives they neither confirm nor deny.`;
    
    return {
        id: id,
        name: name,
        description: description,
        variableId: 30 + id
    };
};

// Helper function for random element selection
FactionDataManager.prototype._randomElement = function(array) {
    return array[Math.floor(Math.random() * array.length)];
};