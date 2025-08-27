/*:
 * @target MZ
 * @plugindesc Generates a message box with a random book title, author and description (seeded by location). Supports English and Italian.
 * @author Claude & Gemini
 * @help This plugin creates a message box displaying a random book title,
 * author name, and a short description whenever called. The selection is
 * deterministic based on mapID, player coordinates, and the first letter
 * of the player name.
 *
 * To set the language to Italian, use the 'Script' event command and enter:
 * ConfigManager.language = "it";
 *
 * Make sure to do this before calling the plugin command.
 *
 * Plugin Command:
 * ShowRandomBook - Shows a message box with random book information
 *
 * @command ShowRandomBook
 * @desc Display a random book in a message box
 */

(() => {
    const pluginName = "RandomBookGenerator";

    // === Seeded RNG util (mulberry32) ===
    function createSeededRNG() {
        const mapId    = $gameMap.mapId();
        const x        = $gamePlayer.x;
        const y        = $gamePlayer.y;
        const name     = $gameParty.leader().name || "";
        const initial  = name.length ? (name.charCodeAt(0) - 64) : 0;
        // combine into a 32-bit seed
        let seed = (mapId * 73856093) ^ (x * 19349663) ^ (y * 83492791) ^ initial;
        seed = seed >>> 0;
        // mulberry32 PRNG
        return (function(a) {
            return function() {
                var t = a += 0x6D2B79F5;
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        })(seed);
    }

    // === Text wrapping util ===
    function wrapText(text, maxChars) {
        const words = text.split(' ');
        let line = '';
        let result = '';
        for (const word of words) {
            if ((line + word).length > maxChars) {
                result += line.trim() + '\n';
                line = '';
            }
            line += word + ' ';
        }
        result += line.trim();
        return result;
    }

    // ==================================
    // === ENGLISH LANGUAGE RESOURCES ===
    // ==================================

    const titlePrefixes = ["The", "A", "Chronicles of", "Tales from", "Legacy of", "Secrets of", "Whispers of", "Echoes of", "Beyond the", "Journey to", "Return to", "Shadows of", "Light of", "Children of", "Guardians of", "Curse of", "Blessing of", "Mystery of", "Last", "First", "Lost", "Forgotten", "Hidden", "Ancient", "Eternal", "Silent", "Broken", "Shattered", "Fallen", "Rising", "Endless", "Infinite", "Divine", "Sacred", "Forbidden", "Stolen", "Untold", "Unseen", "Veiled", "Masked", "Twilight", "Midnight", "Dawn of", "Dusk of", "Origin of", "Birth of", "Death of", "Rebirth of", "Awakening of", "Fall of", "Rise of", "Revenge of", "Wrath of", "Mercy of", "Justice of", "Honor of", "Glory of", "Pride of", "Song of", "Voice of", "Cry of", "Call of", "Path of", "Way of", "Road to", "Bridge to", "Gate to", "Door to", "Portal to", "Window to", "Mirror of", "Reflection of", "Shadow of", "Light of", "Dark"];
    const titleNouns = ["Kingdom", "Empire", "Realm", "World", "Land", "Nation", "Planet", "Dimension", "Universe", "Reality", "Dream", "Nightmare", "Fantasy", "Illusion", "Memory", "Thought", "Discovery", "Creation", "Destruction", "Chaos", "Order", "Balance", "Peace", "War", "Victory", "Defeat", "Destiny", "Fate", "Fortune", "Mystery", "Secret", "Enigma", "Prophecy", "Vision", "Oracle", "Hero", "Villain", "Soul", "Spirit", "Mind", "Heart", "Shadow", "Ghost", "Tower", "Castle", "Fortress", "Horizon", "Sky", "Heaven", "Garden", "Forest", "Mountain", "River", "Ocean", "Sea", "Island", "Star", "Sun", "Moon", "Galaxy", "Void", "Abyss", "Labyrinth", "Journey", "Quest", "Adventure", "Knowledge", "Wisdom", "Darkness", "Light", "Crown", "Throne", "Scepter", "Jewel", "Gem", "Stone", "Flame", "Fire", "Ice", "Winter", "Spring", "Summer", "Autumn", "Eternity", "Infinity", "Moment"];
    const titleAdjectives = ["Dark", "Light", "Bright", "Shadowy", "Glowing", "Shining", "Burning", "Frozen", "Icy", "Cold", "Hot", "Warm", "Ancient", "Lost", "Forgotten", "Hidden", "Sacred", "Forbidden", "Cursed", "Blessed", "Broken", "Shattered", "Fallen", "Rising", "Endless", "Infinite", "Eternal", "Divine", "Mortal", "Silent", "Whispering", "Screaming", "Lonely", "Crowded", "Empty", "Full", "Final", "First", "Last", "True", "False", "Illusory", "Real", "Possible", "Impossible"];
    const titleSubjects = ["Dragon", "Phoenix", "Griffin", "Unicorn", "Angel", "Demon", "King", "Queen", "Prince", "Princess", "Knight", "Mage", "Wizard", "Witch", "Sorcerer", "Warrior", "Thief", "Assassin", "Hunter", "Prophet", "Seer", "Oracle", "God", "Goddess", "Titan", "Giant", "Elf", "Dwarf", "Orc", "Goblin", "Mermaid", "Siren", "Ghost", "Specter", "Wolf", "Lion", "Eagle", "Raven", "Serpent", "Leviathan", "Behemoth", "Star", "Comet", "Nebula", "Wanderer", "Traveler", "Explorer", "Scholar", "Alchemist", "Emperor", "Empress"];
    const titleConnectors = ["of", "and", "in", "from", "beyond", "beneath", "above", "below", "within", "without", "between", "among", "across", "through", "after", "before", "with", "by", "near", "at", "to", "for", "or", "but", "yet", "while"];
    const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel", "Gregory", "Alexander", "Patrick", "Frank", "Raymond", "Jack", "Dennis", "Jerry", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Sandra", "Margaret", "Ashley", "Kimberly", "Emily", "Donna", "Michelle", "Carol", "Amanda", "Melissa", "Deborah", "Stephanie", "Dorothy", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen", "Helen", "Amy", "Shirley", "Angela", "Anna", "Ruth", "Brenda", "Pamela", "Nicole", "Katherine", "Samantha", "Christine", "Catherine", "Virginia", "Debra", "Rachel", "Janet", "Emma", "Carolyn", "Maria", "Heather", "Diane", "Julie", "Joyce", "Evelyn", "Joan", "Victoria", "Kelly", "Christina", "Lauren", "Frances", "Martha", "Judith", "Cheryl", "Megan", "Andrea", "Olivia", "Ann", "Jean", "Alice", "Jacqueline", "Hannah", "Doris", "Kathryn", "Gloria", "Teresa", "Sara", "Janice", "Marie", "Julia", "Grace", "Judy", "Theresa", "Rose", "Beverly", "Denise", "Marilyn", "Amber", "Danielle", "Brittany", "Diana", "Abigail", "Jane", "Natalie", "Lori", "Tiffany", "Taylor", "Lee", "Quinn", "Rowan", "Robin", "River", "Indigo", "Sage", "Hazel", "Ash", "Remy", "Marlowe", "Zephyr", "Nova", "Jules", "Phoenix", "Ari", "Onyx", "Alexis", "Riley", "Jordan", "Morgan", "Casey", "Skyler"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Green", "Adams", "Baker", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Peterson", "Gray", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Washington", "Butler", "Simmons", "Foster", "Russell", "Griffin", "Diaz", "Hayes", "Faulkner", "Wolf", "O'Sullivan", "MacLeod", "Van Houten", "de la Cruz", "Li", "Wong", "Chen", "Park", "Kim", "Yamamoto", "Sato", "Khan", "Singh", "Patel", "Ivanov", "Smirnov", "Silva", "Santos", "Dupont", "Bernard", "Rossi", "Ferrari", "Kowalski", "Nowak", "Andersson", "Johansson", "Hansen", "Jensen", "Storm", "Frost", "Winters", "Blackwood", "Whitestone", "Redfield", "Greenwood", "Goldsmith", "Silverstein", "Diamond", "Ironside", "Steele", "Starling", "Raven", "Hawk", "Falcon", "Rivers", "Forest", "Hill", "Mountain", "Stone", "Shore", "Day", "Night", "Valentine", "Writer", "Author", "Poet", "Bard", "Scribe", "Scholar", "Sage", "Wizard", "Witch", "Sorcerer", "Seer", "Prophet", "Oracle"];
    const titleParticles = ["von", "van", "de", "del", "della", "di", "da", "du", "des", "le", "la", "el", "al", "ibn", "ben", "bin", "mac", "mc", "o", "y"];
    const descriptionPatterns = ["A {adjective} tale about {character} who discovers {object} in {location}.", "Set in {location}, this {genre} follows {character} on a quest for {object}.", "When {character} encounters {object}, {event} ensues in this {adjective} {genre}.", "A {adjective} exploration of {theme} through the eyes of {character} in {location}.", "{character}'s life changes forever when {event} reveals {secret} about {location}.", "In a world where {concept}, {character} must confront {adversity} to find {object}.", "The {adjective} story of how {character} overcame {adversity} with the help of {object}.", "A {adjective} {genre} examining the nature of {theme} and {concept}.", "When {location} faces {adversity}, {character} must use {object} to save everyone.", "{character} journeys through {location} in search of {object}, only to discover {secret}."];
    const characters = ["a young scholar", "an aging detective", "a disgraced knight", "an ambitious apprentice", "a reluctant hero", "a cunning thief", "a forgotten deity", "an exiled monarch", "a mysterious stranger", "a gifted child", "a reformed villain", "a cursed wanderer", "a veteran soldier", "a nomadic bard", "an orphaned heir", "a reclusive inventor", "a cynical merchant", "a haunted artist", "a brilliant scientist", "a retired assassin", "a prophesied savior", "an immortal being", "a time-displaced traveler"];
    const objects = ["an ancient artifact", "a forbidden spell", "a lost heirloom", "a mysterious map", "a powerful weapon", "a forgotten manuscript", "a rare gem", "a magical instrument", "a secret formula", "a prophetic scroll", "a sacred relic", "an alien device", "a hidden doorway", "a sentient machine", "a time-bending watch", "a reality-altering prism", "a truth-revealing mirror", "a soul-binding contract", "a wish-granting vessel", "a star-forged blade"];
    const locations = ["a forgotten kingdom", "an underwater city", "a floating island", "a subterranean civilization", "a parallel dimension", "a distant planet", "an enchanted forest", "a haunted mansion", "a desolate wasteland", "a hidden monastery", "a thriving metropolis", "a frozen tundra", "a celestial realm", "a digital world", "a post-apocalyptic landscape", "a dream realm", "a sentient labyrinth", "a mirror dimension", "a necropolis", "a living island"];
    const events = ["a celestial alignment", "a violent revolution", "a natural disaster", "a technological singularity", "a divine intervention", "a mysterious disappearance", "a prophesied return", "a magical awakening", "an unexpected inheritance", "a scientific breakthrough", "a cosmic collision", "a dimensional rift", "a royal coronation", "a historical discovery", "a global pandemic", "a temporal paradox", "a massive invasion", "a forbidden ritual", "a spiritual awakening"];
    const secrets = ["a hidden lineage", "a cosmic truth", "a forbidden knowledge", "a government conspiracy", "a historical deception", "a suppressed technology", "a magical heritage", "an alien origin", "a forgotten civilization", "a divine purpose", "a prophesied doom", "a reality illusion", "a time loop", "a simulated reality", "a dimensional convergence", "a soul fragmentation", "a memory fabrication", "a universal connection", "a paradoxical existence"];
    const themes = ["identity", "memory", "time", "mortality", "love", "power", "freedom", "justice", "truth", "knowledge", "faith", "hope", "redemption", "vengeance", "sacrifice", "fate", "choice", "isolation", "connection", "reality", "consciousness", "transformation", "order", "chaos", "balance", "war", "courage", "fear", "forgiveness", "guilt", "loyalty", "betrayal", "innocence", "corruption", "wisdom", "purpose", "existence", "free will", "morality", "good", "evil", "tradition", "progress", "life", "death", "rebirth", "nature", "magic", "destiny"];
    const concepts = ["time travel", "immortality", "telepathy", "telekinesis", "invisibility", "shapeshifting", "mind control", "teleportation", "precognition", "necromancy", "elemental manipulation", "illusion casting", "dimensional travel", "gravity manipulation", "memory extraction", "dream walking", "artificial consciousness", "virtual reality", "faster-than-light travel", "planetary terraforming", "consciousness uploading", "a hivemind", "universal translation", "sentient cities"];
    const adversities = ["a corrupt government", "a natural disaster", "an invading army", "a deadly plague", "a mysterious curse", "a powerful corporation", "a criminal organization", "a technological breakdown", "a religious inquisition", "a magical catastrophe", "an economic collapse", "a civil war", "a tyrannical ruler", "a rogue artificial intelligence", "a cosmic threat", "an alien infiltration", "a biological weapon", "a time anomaly"];
    const consequences = ["global catastrophe", "personal transformation", "societal collapse", "spiritual awakening", "technological revolution", "environmental restoration", "historical revision", "cultural renaissance", "political upheaval", "peaceful unification", "dimensional merging", "temporal restructuring", "reality redefinition", "consciousness expansion", "universal understanding", "cosmic realignment", "evolutionary advancement"];
    const sacrifices = ["one's memory", "one's identity", "one's mortality", "one's humanity", "one's sanity", "one's freedom", "one's power", "one's family", "one's love", "one's happiness", "one's innocence", "one's knowledge", "one's purpose", "one's future", "one's past", "one's soul", "one's faith", "one's integrity", "one's principles", "one's morality"];
    const genres = ["fantasy novel", "science fiction epic", "historical fiction", "mystery thriller", "psychological drama", "romantic adventure", "philosophical treatise", "dystopian prophecy", "utopian vision", "political satire", "social commentary", "supernatural horror", "magical realism", "urban fantasy", "space opera", "cyberpunk narrative", "steampunk adventure", "alternate history", "time travel paradox", "post-apocalyptic survival tale", "metaphysical exploration", "coming-of-age story", "tragedy", "comedy", "epic poem"];
    const adjectives = ["captivating", "haunting", "mystical", "ancient", "arcane", "bleak", "brooding", "celestial", "cerebral", "cryptic", "daunting", "decadent", "defiant", "desolate", "grotesque", "dire", "dreamlike", "eerie", "elusive", "enchanting", "enigmatic", "ephemeral", "exquisite", "fatal", "feral", "formidable", "fractured", "ghastly", "grim", "heroic", "illusory", "imposing", "improbable", "infinite", "insidious", "inscrutable", "intrepid", "introspective", "iridescent", "lonesome", "luminous", "macabre", "majestic", "melancholic", "mesmerizing", "monumental", "mythic", "nocturnal", "ominous", "otherworldly", "poignant", "puzzling", "quixotic", "resilient", "resplendent", "reverent", "sacred", "savage", "shimmering", "solemn", "spectral", "sublime", "surreal", "tempestuous", "tenebrous", "transcendent", "turbulent", "uncanny", "unfathomable", "unsettling", "veiled", "vibrant", "volatile", "whimsical", "wistful", "lurid"];
    const middleInitials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const middleInitials_it = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // ==================================
    // === ITALIAN LANGUAGE RESOURCES ===
    // ==================================

    const titlePrefixes_it = ["Il", "La", "Un", "Una", "Cronache di", "Racconti da", "L'eredità di", "Segreti di", "Sussurri di", "Echi di", "Oltre il", "Viaggio a", "Ritorno a", "Ombre di", "Luce di", "Figli di", "Guardiani di", "Maledizione di", "Benedizione di", "Mistero di", "L'ultimo", "Il primo", "Perduto", "Dimenticato", "Nascosto", "Antico", "Eterno", "Silenzioso", "Infranto", "Spezzato", "Caduto", "Nascente", "Senza fine", "Infinito", "Divino", "Sacro", "Proibito", "Rubato", "Mai raccontato", "Invisibile", "Velato", "Mascherato", "Crepuscolo", "Mezzanotte", "Alba di", "Tramonto di", "Origine di", "Nascita di", "Morte di", "Rinascita di", "Risveglio di", "Caduta di", "Ascesa di", "Vendetta di", "Ira di", "Pietà di", "Giustizia di", "Onore di", "Gloria di", "Orgoglio di", "Canto di", "Voce di", "Grido di", "Chiamata di", "Sentiero di", "Via di", "Strada per", "Ponte per", "Cancello per", "Porta per", "Portale per", "Finestra su", "Specchio di", "Riflesso di", "Ombra di", "Luce di", "Oscuro"];
    const titleNouns_it = ["Regno", "Impero", "Reame", "Mondo", "Terra", "Nazione", "Pianeta", "Dimensione", "Universo", "Realtà", "Sogno", "Incubo", "Fantasia", "Illusione", "Ricordo", "Pensiero", "Scoperta", "Creazione", "Distruzione", "Caos", "Ordine", "Equilibrio", "Pace", "Guerra", "Vittoria", "Sconfitta", "Destino", "Fato", "Fortuna", "Mistero", "Segreto", "Enigma", "Profezia", "Visione", "Oracolo", "Eroe", "Antagonista", "Anima", "Spirito", "Mente", "Cuore", "Ombra", "Fantasma", "Torre", "Castello", "Fortezza", "Orizzonte", "Cielo", "Paradiso", "Giardino", "Foresta", "Montagna", "Fiume", "Oceano", "Mare", "Isola", "Stella", "Sole", "Luna", "Galassia", "Vuoto", "Abisso", "Labirinto", "Viaggio", "Ricerca", "Avventura", "Conoscenza", "Saggezza", "Oscurità", "Luce", "Corona", "Trono", "Scettro", "Gioiello", "Gemma", "Pietra", "Fiamma", "Fuoco", "Ghiaccio", "Inverno", "Primavera", "Estate", "Autunno", "Eternità", "Infinito", "Momento"];
    const titleAdjectives_it = ["Oscuro", "Luminoso", "Brillante", "Ombroso", "Splendente", "Lucente", "Ardente", "Ghiacciato", "Gelido", "Freddo", "Caldo", "Tiepido", "Antico", "Perduto", "Dimenticato", "Nascosto", "Sacro", "Proibito", "Maledetto", "Benedetto", "Infranto", "Spezzato", "Caduto", "Nascente", "Senza fine", "Infinito", "Eterno", "Divino", "Mortale", "Silenzioso", "Sussurrante", "Urlante", "Solitario", "Affollato", "Vuoto", "Pieno", "Finale", "Primo", "Ultimo", "Vero", "Falso", "Illusorio", "Reale", "Possibile", "Impossibile"];
    const titleSubjects_it = ["Drago", "Fenice", "Grifone", "Unicorno", "Angelo", "Demone", "Re", "Regina", "Principe", "Principessa", "Cavaliere", "Mago", "Strega", "Stregone", "Guerriero", "Ladro", "Assassino", "Cacciatore", "Profeta", "Veggente", "Oracolo", "Dio", "Dea", "Titano", "Gigante", "Elfo", "Nano", "Orco", "Goblin", "Sirena", "Fantasma", "Spettro", "Lupo", "Leone", "Aquila", "Corvo", "Serpente", "Leviatano", "Behemoth", "Stella", "Cometa", "Nebulosa", "Viandante", "Viaggiatore", "Esploratore", "Studioso", "Alchimista", "Imperatore", "Imperatrice"];
    const titleConnectors_it = ["di", "e", "in", "da", "oltre", "sotto", "sopra", "dentro", "fuori", "tra", "fra", "attraverso", "dopo", "prima", "con", "vicino", "a", "per", "o", "ma", "tuttavia", "mentre"];
    const firstNames_it = ["Marco", "Alessandro", "Giuseppe", "Flavio", "Luca", "Paolo", "Roberto", "Stefano", "Andrea", "Matteo", "Daniele", "Federico", "Riccardo", "Davide", "Michele", "Francesco", "Simone", "Claudio", "Antonio", "Giovanni", "Mario", "Luigi", "Pietro", "Leonardo", "Tommaso", "Gabriele", "Enrico", "Lorenzo", "Edoardo", "Filippo", "Angelo", "Vincenzo", "Salvatore", "Massimo", "Giorgio", "Carlo", "Nicola", "Domenico", "Giulio", "Fabio", "Alessio", "Sergio", "Raffaele", "Cristian", "Emanuele", "Giacomo", "Walter", "Giulia", "Sofia", "Aurora", "Ginevra", "Alice", "Beatrice", "Emma", "Giorgia", "Vittoria", "Matilde", "Chiara", "Anna", "Francesca", "Martina", "Sara", "Greta", "Elena", "Elisa", "Caterina", "Laura", "Valentina", "Paola", "Monica", "Silvia", "Veronica", "Barbara", "Patrizia", "Nadia", "Ilaria", "Eleonora", "Maria", "Rosa", "Angela", "Teresa", "Lucia", "Giovanna", "Carmela", "Cloe", "Aria", "Elia", "Leone", "Enea", "Azzurra", "Sole", "Luce", "Viola", "Bianca", "Alma", "Adele", "Diana", "Iris", "Isabel", "Ambra", "Asia", "Luna", "Elettra"];
    const lastNames_it = ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini", "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti", "Barbieri", "Fontana", "Santoro", "Mariani", "Rinaldi", "Caruso", "Villa", "Leone", "Longo", "Galli", "Martini", "Serra", "Conte", "Ferri", "Sanna", "Messina", "D'Amico", "Amato", "Cattaneo", "Orlando", "Damico", "Farina", "Testa", "Grassi", "Parisi", "Volpe", "Piras", "Sartori", "Milani", "Monti", "Gentile", "Ferrara", "Bernardi", "Marchetti", "Pellegrini", "Palmieri", "Basile", "Fiore", "Bellini", "D'Angelo", "Riva", "Pagano", "Fabbri", "Grimaldi", "Poli", "Silvestri", "Gatti", "Barone", "Vitale", "Benedetti", "Pugliese", "Caputo", "De Angelis", "Salerno", "Gucci", "Armani", "Versace", "Prada", "Valentino", "da Vinci", "Alighieri", "Verdi", "Puccini", "Vivaldi", "Caravaggio", "Raffaello", "Donatello", "Galilei", "Medici", "Borgia", "Sforza", "Este", "Montefeltro", "Visconti", "Savona", "Genovese", "Fiorentino", "Veneziano", "Romano", "Napoletano", "Siciliano", "Sardo"];
    const titleParticles_it = ["di", "de", "del", "della", "dello", "da", "dal", "dalla", "dallo", "dei", "degli", "delle"];
    const descriptionPatterns_it = ["Un racconto {adjective} su {character} che scopre {object} in {location}.", "Ambientato in {location}, questo {genre} segue {character} in una missione per {object}.", "Quando {character} incontra {object}, ne consegue {event} in questo {adjective} {genre}.", "Un'esplorazione {adjective} di {theme} attraverso gli occhi di {character} in {location}.", "La vita di {character} cambia per sempre quando {event} rivela {secret} su {location}.", "In un mondo dove {concept}, {character} deve affrontare {adversity} per trovare {object}.", "La storia {adjective} di come {character} superò {adversity} con l'aiuto di {object}.", "Un {genre} {adjective} che esamina la natura di {theme} e {concept}.", "Quando {location} affronta {adversity}, {character} deve usare {object} per salvare tutti.", "{character} viaggia attraverso {location} in cerca di {object}, solo per scoprire {secret}."];
    const characters_it = ["un giovane studioso", "un detective anziano", "un cavaliere in disgrazia", "un apprendista ambizioso", "un eroe riluttante", "un ladro astuto", "una divinità dimenticata", "un monarca in esilio", "un misterioso straniero", "un bambino dotato", "un cattivo redento", "un viandante maledetto", "un soldato veterano", "un bardo nomade", "un erede orfano", "un inventore solitario", "un mercante cinico", "un artista tormentato", "uno scienziato brillante", "un assassino in pensione", "un salvatore profetizzato", "un essere immortale", "un viaggiatore spostato nel tempo"];
    const objects_it = ["un antico manufatto", "un incantesimo proibito", "un cimelio perduto", "una mappa misteriosa", "un'arma potente", "un manoscritto dimenticato", "una gemma rara", "uno strumento magico", "una formula segreta", "una pergamena profetica", "una reliquia sacra", "un dispositivo alieno", "un portale nascosto", "una macchina senziente", "un orologio che piega il tempo", "un prisma che altera la realtà", "uno specchio che rivela la verità", "un contratto lega-anime", "un artefatto esaudisci-desideri", "una lama forgiata nelle stelle"];
    const locations_it = ["un regno dimenticato", "una città sottomarina", "un'isola fluttuante", "una civiltà sotterranea", "una dimensione parallela", "un pianeta distante", "una foresta incantata", "una magione infestata", "una terra desolata", "un monastero nascosto", "una metropoli fiorente", "una tundra ghiacciata", "un reame celestiale", "un mondo digitale", "un paesaggio post-apocalittico", "un reame onirico", "un labirinto senziente", "una dimensione specchio", "una necropoli", "un'isola vivente"];
    const events_it = ["un allineamento celeste", "una rivoluzione violenta", "un disastro naturale", "una singolarità tecnologica", "un intervento divino", "una misteriosa sparizione", "un ritorno profetizzato", "un risveglio magico", "un'eredità inaspettata", "una scoperta scientifica", "una collisione cosmica", "una frattura dimensionale", "un'incoronazione reale", "una scoperta storica", "una pandemia globale", "un paradosso temporale", "un'invasione di massa", "un rituale proibito", "un risveglio spirituale"];
    const secrets_it = ["una discendenza nascosta", "una verità cosmica", "una conoscenza proibita", "una cospirazione governativa", "un inganno storico", "una tecnologia soppressa", "un'eredità magica", "un'origine aliena", "una civiltà dimenticata", "uno scopo divino", "un destino profetizzato", "una realtà illusoria", "un ciclo temporale", "una realtà simulata", "una convergenza dimensionale", "una frammentazione dell'anima", "un ricordo fabbricato", "una connessione universale", "un'esistenza paradossale"];
    const themes_it = ["identità", "memoria", "tempo", "mortalità", "amore", "potere", "libertà", "giustizia", "verità", "conoscenza", "fede", "speranza", "redenzione", "vendetta", "sacrificio", "destino", "scelta", "isolamento", "connessione", "realtà", "coscienza", "trasformazione", "ordine", "caos", "equilibrio", "guerra", "coraggio", "paura", "perdono", "colpa", "lealtà", "tradimento", "innocenza", "corruzione", "saggezza", "scopo", "esistenza", "libero arbitrio", "moralità", "bene", "male", "tradizione", "progresso", "vita", "morte", "rinascita", "natura", "magia"];
    const concepts_it = ["viaggio nel tempo", "immortalità", "telepatia", "telecinesi", "invisibilità", "mutaforma", "controllo mentale", "teletrasporto", "precognizione", "negromanzia", "manipolazione elementale", "creazione di illusioni", "viaggio dimensionale", "manipolazione della gravità", "estrazione della memoria", "viaggio onirico", "coscienza artificiale", "realtà virtuale", "viaggio superluminale", "terraformazione planetaria", "upload della coscienza", "una mente alveare", "traduzione universale", "città senzienti"];
    const adversities_it = ["un governo corrotto", "un disastro naturale", "un esercito invasore", "una piaga mortale", "una maledizione misteriosa", "una potente corporazione", "un'organizzazione criminale", "un guasto tecnologico", "un'inquisizione religiosa", "una catastrofe magica", "un collasso economico", "una guerra civile", "un sovrano tirannico", "un'intelligenza artificiale ribelle", "una minaccia cosmica", "un'infiltrazione aliena", "un'arma biologica", "un'anomalia temporale"];
    const consequences_it = ["una catastrofe globale", "una trasformazione personale", "il collasso della società", "un risveglio spirituale", "una rivoluzione tecnologica", "il ripristino ambientale", "una revisione storica", "una rinascita culturale", "uno sconvolgimento politico", "un'unificazione pacifica", "una fusione dimensionale", "una ristrutturazione temporale", "una ridefinizione della realtà", "un'espansione della coscienza", "una comprensione universale", "un riallineamento cosmico", "un avanzamento evolutivo"];
    const sacrifices_it = ["la propria memoria", "la propria identità", "la propria mortalità", "la propria umanità", "la propria sanità mentale", "la propria libertà", "il proprio potere", "la propria famiglia", "il proprio amore", "la propria felicità", "la propria innocenza", "la propria conoscenza", "il proprio scopo", "il proprio futuro", "il proprio passato", "la propria anima", "la propria fede", "la propria integrità", "i propri principi", "la propria moralità"];
    const genres_it = ["romanzo fantasy", "epopea di fantascienza", "romanzo storico", "thriller misterioso", "dramma psicologico", "avventura romantica", "trattato filosofico", "profezia distopica", "visione utopica", "satira politica", "commento sociale", "horror soprannaturale", "realismo magico", "urban fantasy", "space opera", "narrativa cyberpunk", "avventura steampunk", "storia alternativa", "paradosso temporale", "racconto di sopravvivenza post-apocalittico", "esplorazione metafisica", "romanzo di formazione", "tragedia", "commedia", "poema epico"];
    const adjectives_it = ["accattivante", "ossessionante", "mistico", "antico", "arcano", "desolato", "cupo", "celestiale", "cerebrale", "criptico", "impegnativo", "decadente", "sprezzante", "desolato", "grottesco", "terribile", "onirico", "inquietante", "sfuggente", "incantevole", "enigmatico", "effimero", "squisito", "fatale", "ferale", "formidabile", "fratturato", "spettrale", "cupo", "eroico", "illusorio", "imponente", "improbabile", "infinito", "insidioso", "imperscrutabile", "intrepido", "introspettivo", "iridescente", "solitario", "luminoso", "macabro", "maestoso", "melanconico", "ipnotico", "monumentale", "mitico", "notturno", "minaccioso", "ultraterreno", "toccante", "sconcertante", "cavalleresco", "resiliente", "splendido", "riverente", "sacro", "selvaggio", "scintillante", "solenne", "spettrale", "sublime", "surreale", "tempestoso", "tenebroso", "trascendente", "turbolento", "strano", "insondabile", "inquietante", "velato", "vibrante", "volatile", "stravagante", "malinconico", "torbido"];

    // Plugin command handler
    PluginManager.registerCommand(pluginName, "ShowRandomBook", args => {
        displayRandomBook();
    });

    // Core function to display a random book with seeded randomness and wrapped text
    function displayRandomBook() {
        const random = createSeededRNG();
        const title = generateTitle(random);
        const author = generateAuthor(random);
        let description = generateDescription(random);
        // wrap lines at ~40 chars for RPG Maker textbox
        description = wrapText(description, 40);
        window.skipLocalization = true;
        const messageText = "\\C[4]\"" + title + "\"\\C[0]\nby \\C[3]" + author + "\\C[0]\n" + description;
        $gameMessage.add(messageText);
        window.skipLocalization = false;
    }

    // Generate a deterministic title
    function generateTitle(random = Math.random) {
        const useItalian = ConfigManager.language === "it";
        const prefixes = useItalian ? titlePrefixes_it : titlePrefixes;
        const adjectives = useItalian ? titleAdjectives_it : titleAdjectives;
        const nouns = useItalian ? titleNouns_it : titleNouns;
        const connectors = useItalian ? titleConnectors_it : titleConnectors;
        const subjects = useItalian ? titleSubjects_it : titleSubjects;

        const choice = Math.floor(random() * 6);
        switch (choice) {
            case 0:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 1:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 2:
                return subjects[Math.floor(random() * subjects.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       prefixes[Math.floor(random() * prefixes.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 3:
                return adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 4:
                return adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)] + " " +
                       connectors[Math.floor(random() * connectors.length)] + " " +
                       prefixes[Math.floor(random() * prefixes.length)] + " " +
                       adjectives[Math.floor(random() * adjectives.length)] + " " +
                       nouns[Math.floor(random() * nouns.length)];
            case 5:
                return prefixes[Math.floor(random() * prefixes.length)] + " " +
                       subjects[Math.floor(random() * subjects.length)] + "'s " +
                       nouns[Math.floor(random() * nouns.length)];
            default:
                return useItalian ? "Senza titolo" : "Untitled";
        }
    }

    // Generate a deterministic author
    function generateAuthor(random = Math.random) {
        const useItalian = ConfigManager.language === "it";
        const fNames = useItalian ? firstNames_it : firstNames;
        const lNames = useItalian ? lastNames_it : lastNames;
        const particles = useItalian ? titleParticles_it : titleParticles;

        const firstName  = fNames[Math.floor(random() * fNames.length)];
        const lastName   = lNames[Math.floor(random() * lNames.length)];
        const midInit    = middleInitials[Math.floor(random() * middleInitials.length)];
        const particle   = particles[Math.floor(random() * particles.length)];
        
        const format = Math.floor(random() * 7);
        const pseudonyms = useItalian ? ["Mistero", "Fenice", "Enigma"] : ["Mystery", "Phoenix", "Enigma"];
        const nicknames = useItalian ? ["Doc", "Ombra", "Falco"] : ["Doc","Shadow","Hawk"];

        switch (format) {
            case 0: return `${firstName} ${lastName}`;
            case 1: return `${firstName} ${midInit}. ${lastName}`;
            case 2:
                const mid2 = middleInitials[Math.floor(random() * middleInitials.length)];
                return `${firstName} ${midInit}. ${mid2}. ${lastName}`;
            case 3:
                const nick = nicknames[Math.floor(random() * 3)];
                return `${firstName} '${nick}' ${lastName}`;
            case 4: return `${firstName} ${particle} ${lastName}`;
            case 5: return pseudonyms[Math.floor(random() * pseudonyms.length)];
            case 6:
                const p1 = pseudonyms[Math.floor(random() * pseudonyms.length)];
                const p2 = pseudonyms[Math.floor(random() * pseudonyms.length)];
                return `${p1} ${p2}`;
            default: return `${firstName} ${lastName}`;
        }
    }

    // Generate a deterministic description
    function generateDescription(random = Math.random) {
        const useItalian = ConfigManager.language === "it";

        let pattern = useItalian ?
            descriptionPatterns_it[Math.floor(random() * descriptionPatterns_it.length)] :
            descriptionPatterns[Math.floor(random() * descriptionPatterns.length)];
        
        const map = {
            character: useItalian ? characters_it : characters,
            object: useItalian ? objects_it : objects,
            location: useItalian ? locations_it : locations,
            event: useItalian ? events_it : events,
            secret: useItalian ? secrets_it : secrets,
            theme: useItalian ? themes_it : themes,
            concept: useItalian ? concepts_it : concepts,
            adversity: useItalian ? adversities_it : adversities,
            consequence: useItalian ? consequences_it : consequences,
            sacrifice: useItalian ? sacrifices_it : sacrifices,
            genre: useItalian ? genres_it : genres,
            adjective: useItalian ? adjectives_it : adjectives
        };

        return pattern.replace(/\{(\w+)\}/g, (_, key) => {
            const arr = map[key];
            return arr[Math.floor(random() * arr.length)];
        });
    }

    // === Engine Hooks (No translation needed for this part) ===
    // (Removed hooks for title screen and F8 for simplicity, focusing on the plugin command)
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        // For testing with F8 key
        if (Input.isTriggered("f8") && !$gameMessage.isBusy()) {
            displayRandomBook();
        }
    };
    
})();