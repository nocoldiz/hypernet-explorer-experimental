/*:
 * @target MZ
 * @plugindesc Animated Tarot Card Reading System v1.0.0
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 * @help
 * ============================================================================
 * Animated Tarot Reading Plugin
 * ============================================================================
 * 
 * This plugin creates an animated tarot card reading system with a 3-card
 * spread showing Past, Present, and Future.
 * 
 * Setup:
 * 1. Create a folder named "arcana" inside img/
 * 2. Place your tarot card PNG files named 1.png, 2.png, etc. (1-22)
 * 3. Each number corresponds to a Major Arcana card
 * 
 * The plugin supports both upright and reversed card meanings, with
 * automatic translation support for Italian.
 * 
 * @command openTarot
 * @text Open Tarot Reading
 * @desc Opens the tarot card reading interface
 * 
 * @command readTarotToNPC
 * @text Read Tarot to NPC
 * @desc Read tarot cards to an NPC with a guessing game
 * 
 * @arg npcName
 * @text NPC Name
 * @desc Name of the NPC receiving the reading
 * @type string
 * @default Villager
 * 
 * @arg perfectMessage
 * @text Perfect Score Message
 * @desc Message when all 3 cards are guessed correctly
 * @type multiline_string
 * @default Amazing! Your reading was perfectly accurate!\nI'm impressed by your mystical abilities!
 * 
 * @arg goodMessage
 * @text Good Score Message
 * @desc Message when 2 cards are guessed correctly
 * @type multiline_string
 * @default Good reading! You got most of it right.\nYou have real potential as a fortune teller.
 * 
 * @arg averageMessage
 * @text Average Score Message
 * @desc Message when 1 card is guessed correctly
 * @type multiline_string
 * @default Your reading was partially correct.\nPerhaps you need more practice with the cards.
 * 
 * @arg poorMessage
 * @text Poor Score Message
 * @desc Message when no cards are guessed correctly
 * @type multiline_string
 * @default That reading didn't resonate with me at all...\nMaybe the spirits weren't speaking clearly today.
 * 
 */

(() => {
    'use strict';

    const pluginName = 'AnimatedTarotReading';

    // Tarot card meanings database
    const TarotMeanings = {
        en: {
            1: { // The Fool
                upright: [
                    "New beginnings await you with childlike wonder and endless possibilities.",
                    "Take a leap of faith and trust in the journey ahead of you.",
                    "Embrace spontaneity and let your free spirit guide your path.",
                    "Adventure calls to you, urging you to step into the unknown."
                ],
                reversed: [
                    "Recklessness clouds your judgment and leads to poor decisions.",
                    "Fear of taking necessary risks holds you back from growth.",
                    "Naivety may cause you to overlook important warning signs.",
                    "Chaos and lack of direction create unnecessary obstacles."
                ]
            },
            2: { // The Magician
                upright: [
                    "You possess all the tools needed to manifest your desires.",
                    "Your willpower and determination create powerful transformations.",
                    "Focus your energy to turn dreams into tangible reality.",
                    "Mastery of your skills brings success within reach."
                ],
                reversed: [
                    "Manipulation and deceit may be present in your surroundings.",
                    "Your talents remain untapped due to lack of confidence.",
                    "Illusions and trickery cloud the truth from your vision.",
                    "Poor planning prevents your goals from materializing."
                ]
            },
            3: { // The High Priestess
                upright: [
                    "Trust your intuition as it guides you toward hidden truths.",
                    "Sacred knowledge reveals itself through quiet contemplation.",
                    "The subconscious mind holds answers to your deepest questions.",
                    "Mystery and feminine wisdom illuminate your spiritual path."
                ],
                reversed: [
                    "Disconnection from your inner voice creates confusion.",
                    "Secrets and hidden agendas may disrupt your peace.",
                    "Ignoring your intuition leads you away from truth.",
                    "Surface-level thinking prevents deeper understanding."
                ]
            },
            4: { // The Empress
                upright: [
                    "Abundance flows naturally into all areas of your life.",
                    "Creative energy blossoms and brings new projects to fruition.",
                    "Nurturing relationships provide comfort and emotional fulfillment.",
                    "Natural beauty and sensuality enhance your personal magnetism."
                ],
                reversed: [
                    "Creative blocks stifle your self-expression and growth.",
                    "Neglecting self-care depletes your energy reserves.",
                    "Codependency creates imbalance in your relationships.",
                    "Material concerns overshadow emotional needs."
                ]
            },
            5: { // The Emperor
                upright: [
                    "Leadership and authority position you for greater success.",
                    "Structure and discipline create a solid foundation for growth.",
                    "Your protective nature shields loved ones from harm.",
                    "Strategic thinking leads to long-term achievements."
                ],
                reversed: [
                    "Tyrannical behavior damages important relationships.",
                    "Rigidity prevents adaptation to changing circumstances.",
                    "Abuse of power creates resistance and rebellion.",
                    "Lack of self-discipline undermines your authority."
                ]
            },
            6: { // The Hierophant
                upright: [
                    "Traditional wisdom provides guidance for current challenges.",
                    "Spiritual teachings deepen your understanding of life's purpose.",
                    "Conformity to established systems brings acceptance and belonging.",
                    "Mentorship accelerates your learning and personal development."
                ],
                reversed: [
                    "Rebellion against tradition opens new paths of understanding.",
                    "Dogmatic thinking limits your perspective and growth.",
                    "Question authority to discover your authentic truth.",
                    "Unconventional approaches yield surprising results."
                ]
            },
            7: { // The Lovers
                upright: [
                    "Deep connections and meaningful relationships enrich your life.",
                    "Important choices align with your values and desires.",
                    "Harmony between opposites creates perfect balance.",
                    "Love in all forms elevates your consciousness."
                ],
                reversed: [
                    "Disharmony in relationships requires honest communication.",
                    "Inner conflicts prevent you from making clear decisions.",
                    "Temptation leads you away from your true path.",
                    "Imbalanced partnerships drain your emotional energy."
                ]
            },
            8: { // The Chariot
                upright: [
                    "Determination and willpower drive you toward victory.",
                    "Opposing forces unite under your skilled direction.",
                    "Self-discipline propels you past any obstacle.",
                    "Triumphant progress rewards your focused efforts."
                ],
                reversed: [
                    "Lack of direction scatters your energy ineffectively.",
                    "Aggression and force create unnecessary conflict.",
                    "Loss of control derails your carefully laid plans.",
                    "Opposition seems insurmountable without proper strategy."
                ]
            },
            9: { // Strength
                upright: [
                    "Inner strength and courage overcome external challenges.",
                    "Gentle persistence tames the wildest aspects of life.",
                    "Compassion transforms potential enemies into allies.",
                    "Patient endurance leads to eventual triumph."
                ],
                reversed: [
                    "Self-doubt weakens your resolve and personal power.",
                    "Raw emotions overpower logical thinking and planning.",
                    "Insecurity manifests as either aggression or timidity.",
                    "Inner beasts require acknowledgment and integration."
                ]
            },
            10: { // The Hermit
                upright: [
                    "Solitude brings profound insights and self-discovery.",
                    "Inner wisdom illuminates the path forward.",
                    "Spiritual searching leads to meaningful revelations.",
                    "Withdrawal from chaos allows deep contemplation."
                ],
                reversed: [
                    "Isolation becomes loneliness without purpose or growth.",
                    "Excessive withdrawal creates disconnection from reality.",
                    "Fear of examination prevents necessary self-reflection.",
                    "Stubborn reclusiveness blocks helpful connections."
                ]
            },
            11: { // Wheel of Fortune
                upright: [
                    "Destiny turns in your favor bringing unexpected opportunities.",
                    "Cycles of change usher in new phases of existence.",
                    "Good fortune smiles upon your current endeavors.",
                    "Universal forces align to support your highest good."
                ],
                reversed: [
                    "Misfortune temporarily disrupts your planned trajectory.",
                    "Resistance to change prolongs difficult circumstances.",
                    "External forces seem to work against your desires.",
                    "Breaking negative cycles requires conscious effort."
                ]
            },
            12: { // Justice
                upright: [
                    "Truth and fairness prevail in all matters at hand.",
                    "Karmic balance restores order to chaotic situations.",
                    "Legal matters resolve in alignment with highest justice.",
                    "Accountability for actions brings appropriate consequences."
                ],
                reversed: [
                    "Injustice and unfairness cloud current circumstances.",
                    "Dishonesty complicates legal or ethical matters.",
                    "Avoiding accountability delays inevitable reckoning.",
                    "Bias prevents clear and balanced judgment."
                ]
            },
            13: { // The Hanged Man
                upright: [
                    "Surrender and release bring unexpected enlightenment.",
                    "New perspectives emerge from letting go of control.",
                    "Sacrifice now leads to greater gains later.",
                    "Suspension of action allows wisdom to surface."
                ],
                reversed: [
                    "Stubborn resistance prolongs unnecessary suffering.",
                    "Martyrdom without purpose drains vital energy.",
                    "Stagnation results from fear of necessary change.",
                    "Indecision paralyzes forward movement."
                ]
            },
            14: { // Death
                upright: [
                    "Transformation clears space for powerful rebirth.",
                    "Endings create opportunities for new beginnings.",
                    "Release of the old makes room for fresh growth.",
                    "Profound change reshapes your entire existence."
                ],
                reversed: [
                    "Resistance to endings prolongs decay and stagnation.",
                    "Fear of change keeps you trapped in limiting patterns.",
                    "Clinging to the past prevents forward evolution.",
                    "Incomplete transitions leave you between worlds."
                ]
            },
            15: { // Temperance
                upright: [
                    "Perfect balance creates harmony in all life areas.",
                    "Patience and moderation lead to lasting success.",
                    "Blending opposites creates powerful alchemy.",
                    "Divine timing orchestrates perfect outcomes."
                ],
                reversed: [
                    "Imbalance and excess disrupt your equilibrium.",
                    "Impatience rushes processes requiring careful timing.",
                    "Conflicting desires create internal discord.",
                    "Lack of moderation leads to unfortunate extremes."
                ]
            },
            16: { // The Devil
                upright: [
                    "Material desires and earthly pleasures demand examination.",
                    "Shadow aspects require acknowledgment and integration.",
                    "Bondage to unhealthy patterns becomes apparent.",
                    "Temptation tests your commitment to growth."
                ],
                reversed: [
                    "Liberation from limiting beliefs sets you free.",
                    "Breaking unhealthy patterns restores personal power.",
                    "Recognition of illusions dispels their influence.",
                    "Release from bondage opens new possibilities."
                ]
            },
            17: { // The Tower
                upright: [
                    "Sudden upheaval destroys false foundations.",
                    "Breakthrough moments shatter limiting illusions.",
                    "Chaos precedes necessary reconstruction.",
                    "Divine intervention redirects your life path."
                ],
                reversed: [
                    "Avoiding necessary destruction prolongs instability.",
                    "Fear of change maintains crumbling structures.",
                    "Gradual transformation replaces sudden upheaval.",
                    "Disaster narrowly avoided teaches important lessons."
                ]
            },
            18: { // The Star
                upright: [
                    "Hope illuminates even the darkest moments.",
                    "Spiritual renewal restores faith and optimism.",
                    "Divine inspiration guides your creative expression.",
                    "Healing waters wash away past wounds."
                ],
                reversed: [
                    "Despair clouds your vision of future possibilities.",
                    "Disconnection from faith creates spiritual emptiness.",
                    "Creative blocks stifle inspired expression.",
                    "Pessimism prevents recognition of blessings."
                ]
            },
            19: { // The Moon
                upright: [
                    "Illusions and deceptions require careful navigation.",
                    "Intuitive wisdom emerges from subconscious depths.",
                    "Dreams and visions carry important messages.",
                    "Hidden fears surface for healing and release."
                ],
                reversed: [
                    "Confusion lifts as clarity returns to your vision.",
                    "Deceptions revealed allow truth to emerge.",
                    "Repressed emotions demand conscious attention.",
                    "Mental fog clears revealing the path ahead."
                ]
            },
            20: { // The Sun
                upright: [
                    "Joy and vitality infuse every aspect of existence.",
                    "Success and recognition reward your authentic expression.",
                    "Childlike wonder reveals life's simple pleasures.",
                    "Radiant energy attracts abundance and blessings."
                ],
                reversed: [
                    "Temporary clouds obscure your inner radiance.",
                    "Ego inflation distorts genuine accomplishments.",
                    "Forced positivity masks underlying issues.",
                    "Delayed success tests your patience and faith."
                ]
            },
            21: { // Judgement
                upright: [
                    "Spiritual awakening transforms your entire being.",
                    "Past actions receive fair and final evaluation.",
                    "Rebirth follows honest self-assessment.",
                    "Higher calling demands courageous response."
                ],
                reversed: [
                    "Self-judgment blocks forgiveness and growth.",
                    "Avoiding inner calling creates persistent dissatisfaction.",
                    "Past mistakes haunt present circumstances.",
                    "Fear of judgment paralyzes decisive action."
                ]
            },
            22: { // The World
                upright: [
                    "Completion of major cycles brings deep satisfaction.",
                    "Wholeness and integration create perfect harmony.",
                    "Worldly success reflects inner accomplishment.",
                    "Universal consciousness expands your awareness."
                ],
                reversed: [
                    "Incomplete ventures require additional effort.",
                    "External success feels empty without inner fulfillment.",
                    "Shortcuts prevent genuine accomplishment.",
                    "Limited perspective restricts full potential."
                ]
            }
        },
        it: {
            1: { // Il Matto
                upright: [
                    "Nuovi inizi ti attendono con meraviglia infantile e infinite possibilità.",
                    "Fai un salto di fede e confida nel viaggio che ti aspetta.",
                    "Abbraccia la spontaneità e lascia che il tuo spirito libero guidi il tuo cammino.",
                    "L'avventura ti chiama, spingendoti verso l'ignoto."
                ],
                reversed: [
                    "L'imprudenza offusca il tuo giudizio e porta a decisioni sbagliate.",
                    "La paura di correre rischi necessari ti impedisce di crescere.",
                    "L'ingenuità potrebbe farti trascurare importanti segnali di avvertimento.",
                    "Il caos e la mancanza di direzione creano ostacoli inutili."
                ]
            },
            2: { // Il Mago
                upright: [
                    "Possiedi tutti gli strumenti necessari per manifestare i tuoi desideri.",
                    "La tua forza di volontà e determinazione creano potenti trasformazioni.",
                    "Concentra la tua energia per trasformare i sogni in realtà tangibile.",
                    "La padronanza delle tue abilità porta il successo a portata di mano."
                ],
                reversed: [
                    "Manipolazione e inganno potrebbero essere presenti nel tuo ambiente.",
                    "I tuoi talenti rimangono inutilizzati per mancanza di fiducia.",
                    "Illusioni e trucchi offuscano la verità dalla tua visione.",
                    "Una scarsa pianificazione impedisce ai tuoi obiettivi di materializzarsi."
                ]
            },
            3: { // La Papessa
                upright: [
                    "Fidati della tua intuizione mentre ti guida verso verità nascoste.",
                    "La conoscenza sacra si rivela attraverso la contemplazione silenziosa.",
                    "La mente subconscia contiene risposte alle tue domande più profonde.",
                    "Il mistero e la saggezza femminile illuminano il tuo percorso spirituale."
                ],
                reversed: [
                    "La disconnessione dalla tua voce interiore crea confusione.",
                    "Segreti e agende nascoste potrebbero disturbare la tua pace.",
                    "Ignorare la tua intuizione ti allontana dalla verità.",
                    "Il pensiero superficiale impedisce una comprensione più profonda."
                ]
            },
            4: { // L'Imperatrice
                upright: [
                    "L'abbondanza fluisce naturalmente in tutte le aree della tua vita.",
                    "L'energia creativa sboccia e porta nuovi progetti a compimento.",
                    "Le relazioni nutrienti forniscono conforto e appagamento emotivo.",
                    "La bellezza naturale e la sensualità aumentano il tuo magnetismo personale."
                ],
                reversed: [
                    "I blocchi creativi soffocano la tua espressione e crescita.",
                    "Trascurare la cura di sé esaurisce le tue riserve di energia.",
                    "La codipendenza crea squilibrio nelle tue relazioni.",
                    "Le preoccupazioni materiali oscurano i bisogni emotivi."
                ]
            },
            5: { // L'Imperatore
                upright: [
                    "Leadership e autorità ti posizionano per un maggiore successo.",
                    "Struttura e disciplina creano una base solida per la crescita.",
                    "La tua natura protettiva protegge i tuoi cari dal male.",
                    "Il pensiero strategico porta a risultati a lungo termine."
                ],
                reversed: [
                    "Il comportamento tirannico danneggia relazioni importanti.",
                    "La rigidità impedisce l'adattamento a circostanze mutevoli.",
                    "L'abuso di potere crea resistenza e ribellione.",
                    "La mancanza di autodisciplina mina la tua autorità."
                ]
            },
            6: { // Il Papa
                upright: [
                    "La saggezza tradizionale fornisce guida per le sfide attuali.",
                    "Gli insegnamenti spirituali approfondiscono la comprensione dello scopo della vita.",
                    "La conformità ai sistemi stabiliti porta accettazione e appartenenza.",
                    "Il mentoring accelera il tuo apprendimento e sviluppo personale."
                ],
                reversed: [
                    "La ribellione contro la tradizione apre nuovi percorsi di comprensione.",
                    "Il pensiero dogmatico limita la tua prospettiva e crescita.",
                    "Metti in discussione l'autorità per scoprire la tua verità autentica.",
                    "Approcci non convenzionali producono risultati sorprendenti."
                ]
            },
            7: { // Gli Amanti
                upright: [
                    "Connessioni profonde e relazioni significative arricchiscono la tua vita.",
                    "Scelte importanti si allineano con i tuoi valori e desideri.",
                    "L'armonia tra opposti crea perfetto equilibrio.",
                    "L'amore in tutte le forme eleva la tua coscienza."
                ],
                reversed: [
                    "La disarmonia nelle relazioni richiede comunicazione onesta.",
                    "I conflitti interni ti impediscono di prendere decisioni chiare.",
                    "La tentazione ti allontana dal tuo vero percorso.",
                    "Le partnership sbilanciate prosciugano la tua energia emotiva."
                ]
            },
            8: { // Il Carro
                upright: [
                    "Determinazione e forza di volontà ti guidano verso la vittoria.",
                    "Forze opposte si uniscono sotto la tua abile direzione.",
                    "L'autodisciplina ti spinge oltre qualsiasi ostacolo.",
                    "Il progresso trionfante premia i tuoi sforzi concentrati."
                ],
                reversed: [
                    "La mancanza di direzione disperde la tua energia inefficacemente.",
                    "Aggressività e forza creano conflitti inutili.",
                    "La perdita di controllo fa deragliare i tuoi piani accuratamente preparati.",
                    "L'opposizione sembra insormontabile senza una strategia adeguata."
                ]
            },
            9: { // La Forza
                upright: [
                    "Forza interiore e coraggio superano le sfide esterne.",
                    "La perseveranza gentile doma gli aspetti più selvaggi della vita.",
                    "La compassione trasforma potenziali nemici in alleati.",
                    "La paziente resistenza porta al trionfo finale."
                ],
                reversed: [
                    "L'insicurezza indebolisce la tua determinazione e potere personale.",
                    "Le emozioni crude sopraffanno il pensiero logico e la pianificazione.",
                    "L'insicurezza si manifesta come aggressività o timidezza.",
                    "Le bestie interiori richiedono riconoscimento e integrazione."
                ]
            },
            10: { // L'Eremita
                upright: [
                    "La solitudine porta intuizioni profonde e scoperta di sé.",
                    "La saggezza interiore illumina il cammino da seguire.",
                    "La ricerca spirituale porta a rivelazioni significative.",
                    "Il ritiro dal caos permette una profonda contemplazione."
                ],
                reversed: [
                    "L'isolamento diventa solitudine senza scopo o crescita.",
                    "L'eccessivo ritiro crea disconnessione dalla realtà.",
                    "La paura dell'esame impedisce la necessaria auto-riflessione.",
                    "La testarda reclusione blocca connessioni utili."
                ]
            },
            11: { // La Ruota della Fortuna
                upright: [
                    "Il destino gira a tuo favore portando opportunità inaspettate.",
                    "I cicli di cambiamento introducono nuove fasi di esistenza.",
                    "La buona fortuna sorride ai tuoi sforzi attuali.",
                    "Le forze universali si allineano per sostenere il tuo bene supremo."
                ],
                reversed: [
                    "La sfortuna interrompe temporaneamente la tua traiettoria pianificata.",
                    "La resistenza al cambiamento prolunga circostanze difficili.",
                    "Le forze esterne sembrano lavorare contro i tuoi desideri.",
                    "Rompere i cicli negativi richiede uno sforzo consapevole."
                ]
            },
            12: { // La Giustizia
                upright: [
                    "Verità ed equità prevalgono in tutte le questioni in corso.",
                    "L'equilibrio karmico ripristina l'ordine nelle situazioni caotiche.",
                    "Le questioni legali si risolvono in allineamento con la giustizia suprema.",
                    "La responsabilità per le azioni porta conseguenze appropriate."
                ],
                reversed: [
                    "Ingiustizia e iniquità offuscano le circostanze attuali.",
                    "La disonestà complica questioni legali o etiche.",
                    "Evitare la responsabilità ritarda l'inevitabile resa dei conti.",
                    "Il pregiudizio impedisce un giudizio chiaro ed equilibrato."
                ]
            },
            13: { // L'Appeso
                upright: [
                    "Arrendersi e lasciar andare portano illuminazione inaspettata.",
                    "Nuove prospettive emergono dal lasciare andare il controllo.",
                    "Il sacrificio ora porta a maggiori guadagni dopo.",
                    "La sospensione dell'azione permette alla saggezza di emergere."
                ],
                reversed: [
                    "La resistenza ostinata prolunga sofferenze inutili.",
                    "Il martirio senza scopo prosciuga energia vitale.",
                    "La stagnazione risulta dalla paura del cambiamento necessario.",
                    "L'indecisione paralizza il movimento in avanti."
                ]
            },
            14: { // La Morte
                upright: [
                    "La trasformazione crea spazio per una potente rinascita.",
                    "Le conclusioni creano opportunità per nuovi inizi.",
                    "Il rilascio del vecchio fa spazio per una nuova crescita.",
                    "Il cambiamento profondo rimodella la tua intera esistenza."
                ],
                reversed: [
                    "La resistenza alle conclusioni prolunga decadimento e stagnazione.",
                    "La paura del cambiamento ti tiene intrappolato in schemi limitanti.",
                    "Aggrapparsi al passato impedisce l'evoluzione in avanti.",
                    "Le transizioni incomplete ti lasciano tra i mondi."
                ]
            },
            15: { // La Temperanza
                upright: [
                    "L'equilibrio perfetto crea armonia in tutte le aree della vita.",
                    "Pazienza e moderazione portano al successo duraturo.",
                    "Mescolare gli opposti crea una potente alchimia.",
                    "Il tempismo divino orchestra risultati perfetti."
                ],
                reversed: [
                    "Squilibrio ed eccesso disturbano il tuo equilibrio.",
                    "L'impazienza affretta processi che richiedono tempi accurati.",
                    "Desideri contrastanti creano discordia interna.",
                    "La mancanza di moderazione porta a estremi sfortunati."
                ]
            },
            16: { // Il Diavolo
                upright: [
                    "I desideri materiali e i piaceri terreni richiedono esame.",
                    "Gli aspetti ombra richiedono riconoscimento e integrazione.",
                    "La schiavitù a schemi malsani diventa evidente.",
                    "La tentazione mette alla prova il tuo impegno per la crescita."
                ],
                reversed: [
                    "La liberazione da credenze limitanti ti rende libero.",
                    "Rompere schemi malsani ripristina il potere personale.",
                    "Il riconoscimento delle illusioni dissolve la loro influenza.",
                    "Il rilascio dalla schiavitù apre nuove possibilità."
                ]
            },
            17: { // La Torre
                upright: [
                    "L'improvviso sconvolgimento distrugge false fondamenta.",
                    "I momenti di svolta frantumano illusioni limitanti.",
                    "Il caos precede la ricostruzione necessaria.",
                    "L'intervento divino reindirizza il tuo percorso di vita."
                ],
                reversed: [
                    "Evitare la distruzione necessaria prolunga l'instabilità.",
                    "La paura del cambiamento mantiene strutture fatiscenti.",
                    "La trasformazione graduale sostituisce lo sconvolgimento improvviso.",
                    "Il disastro evitato per un soffio insegna lezioni importanti."
                ]
            },
            18: { // La Stella
                upright: [
                    "La speranza illumina anche i momenti più bui.",
                    "Il rinnovamento spirituale ripristina fede e ottimismo.",
                    "L'ispirazione divina guida la tua espressione creativa.",
                    "Le acque curative lavano via le ferite del passato."
                ],
                reversed: [
                    "La disperazione offusca la tua visione delle possibilità future.",
                    "La disconnessione dalla fede crea vuoto spirituale.",
                    "I blocchi creativi soffocano l'espressione ispirata.",
                    "Il pessimismo impedisce il riconoscimento delle benedizioni."
                ]
            },
            19: { // La Luna
                upright: [
                    "Illusioni e inganni richiedono navigazione attenta.",
                    "La saggezza intuitiva emerge dalle profondità del subconscio.",
                    "Sogni e visioni portano messaggi importanti.",
                    "Le paure nascoste emergono per la guarigione e il rilascio."
                ],
                reversed: [
                    "La confusione si solleva mentre la chiarezza ritorna alla tua visione.",
                    "Gli inganni rivelati permettono alla verità di emergere.",
                    "Le emozioni represse richiedono attenzione consapevole.",
                    "La nebbia mentale si schiarisce rivelando il percorso davanti."
                ]
            },
            20: { // Il Sole
                upright: [
                    "Gioia e vitalità infondono ogni aspetto dell'esistenza.",
                    "Successo e riconoscimento premiano la tua espressione autentica.",
                    "La meraviglia infantile rivela i semplici piaceri della vita.",
                    "L'energia radiante attrae abbondanza e benedizioni."
                ],
                reversed: [
                    "Nuvole temporanee oscurano la tua radianza interiore.",
                    "L'inflazione dell'ego distorce i risultati genuini.",
                    "La positività forzata maschera problemi sottostanti.",
                    "Il successo ritardato mette alla prova la tua pazienza e fede."
                ]
            },
            21: { // Il Giudizio
                upright: [
                    "Il risveglio spirituale trasforma il tuo intero essere.",
                    "Le azioni passate ricevono valutazione giusta e finale.",
                    "La rinascita segue l'onesta autovalutazione.",
                    "La chiamata superiore richiede risposta coraggiosa."
                ],
                reversed: [
                    "L'autogiudizio blocca il perdono e la crescita.",
                    "Evitare la chiamata interiore crea insoddisfazione persistente.",
                    "Gli errori passati perseguitano le circostanze presenti.",
                    "La paura del giudizio paralizza l'azione decisiva."
                ]
            },
            22: { // Il Mondo
                upright: [
                    "Il completamento di cicli importanti porta profonda soddisfazione.",
                    "Interezza e integrazione creano perfetta armonia.",
                    "Il successo mondano riflette il risultato interiore.",
                    "La coscienza universale espande la tua consapevolezza."
                ],
                reversed: [
                    "Le imprese incomplete richiedono ulteriore sforzo.",
                    "Il successo esterno sembra vuoto senza realizzazione interiore.",
                    "Le scorciatoie impediscono il genuino conseguimento.",
                    "La prospettiva limitata restringe il pieno potenziale."
                ]
            }
        }
    };

    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'openTarot', args => {
        SceneManager.push(Scene_Tarot);
    });

    PluginManager.registerCommand(pluginName, 'readTarotToNPC', args => {
        const npcData = {
            name: args.npcName || 'Villager',
            perfectMessage: args.perfectMessage || "Amazing! Your reading was perfectly accurate!\nI'm impressed by your mystical abilities!",
            goodMessage: args.goodMessage || "Good reading! You got most of it right.\nYou have real potential as a fortune teller.",
            averageMessage: args.averageMessage || "Your reading was partially correct.\nPerhaps you need more practice with the cards.",
            poorMessage: args.poorMessage || "That reading didn't resonate with me at all...\nMaybe the spirits weren't speaking clearly today."
        };
        SceneManager.push(Scene_TarotNPC);
        SceneManager._scene._npcData = npcData;
    });

    // Scene_Tarot
    class Scene_Tarot extends Scene_Base {
        create() {
            super.create();
            this._cards = [];
            this._selectedCards = [];
            this._isRevealed = [false, false, false];
            this._cardSprites = [];
            this._isAnimating = false;
            this._currentRevealIndex = 0;
            this.createBackground();
            this.createWindows();
            this.shuffleAndDealCards();
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
            this.addChild(this._backgroundSprite);
        }

        createWindows() {
            this.createTitleWindow();
            this.createSpreadWindow();
            this.createMeaningWindow();
            this.createInstructionWindow();
        }

        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_Base(rect);
            this._titleWindow.drawText(this.getLocalizedText('title'), 0, 0, rect.width - 32, 'center');
            this.addWindow(this._titleWindow);
        }

        titleWindowRect() {
            const width = 400;
            const height = 80;
            const x = (Graphics.width - width) / 2;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        createSpreadWindow() {
            const rect = this.spreadWindowRect();
            this._spreadWindow = new Window_Base(rect);
            this.addWindow(this._spreadWindow);
            this.updateSpreadLabels();
        }

        spreadWindowRect() {
            const width = Graphics.width - 100;
            const height = 400;
            const x = 50;
            const y = 120;
            return new Rectangle(x, y, width, height);
        }

        createMeaningWindow() {
            const rect = this.meaningWindowRect();
            this._meaningWindow = new Window_Base(rect);
            this._meaningWindow.hide();
            this.addWindow(this._meaningWindow);
        }

        meaningWindowRect() {
            const width = 600;
            const height = 200;
            const x = (Graphics.width - width) / 2;
            const y = Graphics.height - height - 20;
            return new Rectangle(x, y, width, height);
        }

        createInstructionWindow() {
            const rect = this.instructionWindowRect();
            this._instructionWindow = new Window_Base(rect);
            this._instructionWindow.drawText(this.getLocalizedText('instruction'), 0, 0, rect.width - 32, 'center');
            this.addWindow(this._instructionWindow);
        }

        instructionWindowRect() {
            const width = 500;
            const height = 60;
            const x = (Graphics.width - width) / 2;
            const y = Graphics.height - 100;
            return new Rectangle(x, y, width, height);
        }

        updateSpreadLabels() {
            this._spreadWindow.contents.clear();
            const positions = ['past', 'present', 'future'];
            const spacing = (this._spreadWindow.width - 32) / 3;
            
            positions.forEach((pos, index) => {
                const x = spacing * index + spacing / 2 - 50;
                const text = this.getLocalizedText(pos);
                this._spreadWindow.drawText(text, x, 10, 100, 'center');
            });
        }

        shuffleAndDealCards() {
            // Generate array of card numbers (1-22)
            const allCards = Array.from({length: 22}, (_, i) => i + 1);
            
            // Shuffle cards
            for (let i = allCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
            }
            
            // Select 3 cards with random orientations
            for (let i = 0; i < 3; i++) {
                this._selectedCards.push({
                    number: allCards[i],
                    isReversed: Math.random() < 0.5
                });
            }
            
            // Create card sprites
            this.createCardSprites();
        }

        createCardSprites() {
            const spacing = (this._spreadWindow.width - 32) / 3;
            const cardWidth = 120;
            const cardHeight = 180;
            
            for (let i = 0; i < 3; i++) {
                const x = this._spreadWindow.x + spacing * i + spacing / 2 - cardWidth / 2;
                const y = this._spreadWindow.y + 80;
                
                // Card back sprite
                const cardBack = new Sprite();
                cardBack.bitmap = new Bitmap(cardWidth, cardHeight);
                cardBack.bitmap.fillAll('#1a1a2e');
                cardBack.bitmap.strokeRect(0, 0, cardWidth, cardHeight, '#eee', 2);
                
                // Draw decorative pattern on card back
                const ctx = cardBack.bitmap.context;
                ctx.save();
                ctx.strokeStyle = '#16213e';
                ctx.lineWidth = 1;
                for (let j = 10; j < cardWidth; j += 20) {
                    ctx.beginPath();
                    ctx.moveTo(j, 0);
                    ctx.lineTo(j, cardHeight);
                    ctx.stroke();
                }
                for (let j = 10; j < cardHeight; j += 20) {
                    ctx.beginPath();
                    ctx.moveTo(0, j);
                    ctx.lineTo(cardWidth, j);
                    ctx.stroke();
                }
                ctx.restore();
                cardBack.bitmap.baseTexture.update();
                
                cardBack.x = x;
                cardBack.y = y;
                cardBack.anchor.x = 0.5;
                cardBack.anchor.y = 0.5;
                cardBack.x += cardWidth / 2;
                cardBack.y += cardHeight / 2;
                
                // Card front sprite (initially hidden)
                const cardFront = new Sprite();
                const cardData = this._selectedCards[i];
                
                // Load the arcana image
                const filename = `img/arcana/${cardData.number}.png`;
                cardFront.bitmap = ImageManager.loadBitmap('', filename);
                
                cardFront.x = x;
                cardFront.y = y;
                cardFront.anchor.x = 0.5;
                cardFront.anchor.y = 0.5;
                cardFront.x += cardWidth / 2;
                cardFront.y += cardHeight / 2;
                cardFront.visible = false;
                
                // Apply reversed rotation if needed
                if (cardData.isReversed) {
                    cardFront.rotation = Math.PI;
                }
                
                // Set up bitmap load handling
                cardFront.bitmap.addLoadListener(() => {
                    cardFront.scale.x = cardWidth / cardFront.bitmap.width;
                    cardFront.scale.y = cardHeight / cardFront.bitmap.height;
                });
                
                this._cardSprites.push({
                    back: cardBack,
                    front: cardFront,
                    index: i,
                    isFlipped: false
                });
                
                this.addChild(cardBack);
                this.addChild(cardFront);
                
                // Make cards interactive
                cardBack.interactive = true;
                cardBack.buttonMode = true;
                cardBack.addListener('pointertap', () => this.onCardClick(i));
                
                // Add hover effect
                cardBack.addListener('pointerover', () => {
                    if (!this._isAnimating && !this._cardSprites[i].isFlipped) {
                        cardBack.scale.x = 1.05;
                        cardBack.scale.y = 1.05;
                    }
                });
                
                cardBack.addListener('pointerout', () => {
                    if (!this._isAnimating && !this._cardSprites[i].isFlipped) {
                        cardBack.scale.x = 1;
                        cardBack.scale.y = 1;
                    }
                });
            }
        }

        onCardClick(index) {
            if (this._isAnimating || this._cardSprites[index].isFlipped) return;
            
            this._isAnimating = true;
            this.flipCard(index);
        }

        flipCard(index) {
            const card = this._cardSprites[index];
            const duration = 20; // frames
            let frame = 0;
            
            const flip = () => {
                frame++;
                const progress = frame / duration;
                const angle = progress * Math.PI;
                
                // First half - shrink card back
                if (progress <= 0.5) {
                    card.back.scale.x = Math.cos(angle);
                } else {
                    // Second half - grow card front
                    if (!card.front.visible) {
                        card.front.visible = true;
                        card.back.visible = false;
                    }
                    card.front.scale.x = Math.abs(Math.cos(angle)) * (120 / card.front.bitmap.width);
                }
                
                if (frame >= duration) {
                    card.isFlipped = true;
                    this._isRevealed[index] = true;
                    this._isAnimating = false;
                    this.showCardMeaning(index);
                    
                    // Check if all cards are revealed
                    if (this._isRevealed.every(r => r)) {
                        this._instructionWindow.contents.clear();
                        this._instructionWindow.drawText(this.getLocalizedText('complete'), 0, 0, 
                            this._instructionWindow.width - 32, 'center');
                    }
                } else {
                    requestAnimationFrame(flip);
                }
            };
            
            flip();
        }

        showCardMeaning(index) {
            const card = this._selectedCards[index];
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const meanings = TarotMeanings[lang][card.number];
            const pool = card.isReversed ? meanings.reversed : meanings.upright;
            const meaning = pool[Math.floor(Math.random() * pool.length)];
            
            this._meaningWindow.contents.clear();
            this._meaningWindow.show();
            
            // Draw card name
            const cardName = this.getCardName(card.number);
            const orientation = card.isReversed ? this.getLocalizedText('reversed') : this.getLocalizedText('upright');
            this._meaningWindow.changeTextColor(ColorManager.systemColor());
            this._meaningWindow.drawText(`${cardName} (${orientation})`, 0, 0, 
                this._meaningWindow.width - 32, 'center');
            
            // Draw meaning
            this._meaningWindow.changeTextColor(ColorManager.normalColor());
            this._meaningWindow.drawTextAutomatically(meaning, 0, 40, this._meaningWindow.width - 32);
            
            // Hide after delay
            setTimeout(() => {
                this._meaningWindow.hide();
            }, 5000);
        }

        getCardName(number) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const names = {
                en: [
                    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
                    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
                    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
                    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
                    'Judgement', 'The World'
                ],
                it: [
                    'Il Matto', 'Il Mago', 'La Papessa', 'L\'Imperatrice', 'L\'Imperatore',
                    'Il Papa', 'Gli Amanti', 'Il Carro', 'La Forza', 'L\'Eremita',
                    'La Ruota della Fortuna', 'La Giustizia', 'L\'Appeso', 'La Morte', 'La Temperanza',
                    'Il Diavolo', 'La Torre', 'La Stella', 'La Luna', 'Il Sole',
                    'Il Giudizio', 'Il Mondo'
                ]
            };
            return names[lang][number - 1];
        }

        getLocalizedText(key) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const texts = {
                en: {
                    title: 'Tarot Reading',
                    past: 'Past',
                    present: 'Present',
                    future: 'Future',
                    instruction: 'Click on a card to reveal its meaning',
                    complete: 'Your reading is complete. Press ESC to exit.',
                    upright: 'Upright',
                    reversed: 'Reversed'
                },
                it: {
                    title: 'Lettura dei Tarocchi',
                    past: 'Passato',
                    present: 'Presente',
                    future: 'Futuro',
                    instruction: 'Clicca su una carta per rivelare il suo significato',
                    complete: 'La tua lettura è completa. Premi ESC per uscire.',
                    upright: 'Dritto',
                    reversed: 'Rovesciato'
                }
            };
            return texts[lang][key];
        }

        update() {
            super.update();
            
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                this.popScene();
            }
        }
    }

    // Window extensions for text wrapping
    Window_Base.prototype.drawTextAutomatically = function(text, x, y, maxWidth) {
        const textState = this.createTextState(text, x, y, maxWidth);
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = this.textWidth(testLine);
            
            if (metrics > maxWidth && line !== '') {
                this.drawText(line.trim(), x, currentY, maxWidth);
                line = words[i] + ' ';
                currentY += this.lineHeight();
            } else {
                line = testLine;
            }
        }
        
        this.drawText(line.trim(), x, currentY, maxWidth);
    };

    // Scene_TarotNPC - NPC Reading Scene
    class Scene_TarotNPC extends Scene_Base {
        create() {
            super.create();
            this._cards = [];
            this._selectedCards = [];
            this._cardSprites = [];
            this._isAnimating = false;
            this._currentCardIndex = 0;
            this._correctAnswers = 0;
            this._choices = [];
            this._correctMeanings = [];
            this.createBackground();
            this.createWindows();
            this.shuffleAndDealCards();
        }

        createBackground() {
            this._backgroundSprite = new Sprite();
            this._backgroundSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
            this._backgroundSprite.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
            this.addChild(this._backgroundSprite);
        }

        createWindows() {
            this.createTitleWindow();
            this.createCardWindow();
            this.createChoiceWindow();
            this.createProgressWindow();
        }

        createTitleWindow() {
            const rect = this.titleWindowRect();
            this._titleWindow = new Window_Base(rect);
            const text = this.getLocalizedText('npcTitle').replace('%1', this._npcData.name);
            this._titleWindow.drawText(text, 0, 0, rect.width - 32, 'center');
            this.addWindow(this._titleWindow);
        }

        titleWindowRect() {
            const width = 600;
            const height = 80;
            const x = (Graphics.width - width) / 2;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        createCardWindow() {
            const rect = this.cardWindowRect();
            this._cardWindow = new Window_Base(rect);
            this.addWindow(this._cardWindow);
        }

        cardWindowRect() {
            const width = 200;
            const height = 300;
            const x = (Graphics.width - width) / 2;
            const y = 120;
            return new Rectangle(x, y, width, height);
        }

        createChoiceWindow() {
            const rect = this.choiceWindowRect();
            this._choiceWindow = new Window_Command(rect);
            this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
            this._choiceWindow.deactivate();
            this._choiceWindow.hide();
            this.addWindow(this._choiceWindow);
        }

        choiceWindowRect() {
            const width = Graphics.width - 100;
            const height = 200;
            const x = 50;
            const y = 450;
            return new Rectangle(x, y, width, height);
        }

        createProgressWindow() {
            const rect = this.progressWindowRect();
            this._progressWindow = new Window_Base(rect);
            this.addWindow(this._progressWindow);
            this.updateProgress();
        }

        progressWindowRect() {
            const width = 300;
            const height = 60;
            const x = Graphics.width - width - 20;
            const y = 20;
            return new Rectangle(x, y, width, height);
        }

        updateProgress() {
            this._progressWindow.contents.clear();
            const positions = ['past', 'present', 'future'];
            const currentPos = this.getLocalizedText(positions[this._currentCardIndex]);
            const text = `${currentPos} (${this._currentCardIndex + 1}/3)`;
            this._progressWindow.drawText(text, 0, 0, this._progressWindow.width - 32, 'center');
        }

        shuffleAndDealCards() {
            // Generate and shuffle cards
            const allCards = Array.from({length: 22}, (_, i) => i + 1);
            for (let i = allCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
            }
            
            // Select 3 cards
            for (let i = 0; i < 3; i++) {
                this._selectedCards.push({
                    number: allCards[i],
                    isReversed: Math.random() < 0.5
                });
            }
            
            // Show first card
            this.showCurrentCard();
        }

        showCurrentCard() {
            const card = this._selectedCards[this._currentCardIndex];
            
            // Create card sprite
            const cardSprite = new Sprite();
            const filename = `img/arcana/${card.number}.png`;
            cardSprite.bitmap = ImageManager.loadBitmap('', filename);
            
            cardSprite.anchor.x = 0.5;
            cardSprite.anchor.y = 0.5;
            cardSprite.x = this._cardWindow.x + this._cardWindow.width / 2;
            cardSprite.y = this._cardWindow.y + this._cardWindow.height / 2 - 20;
            
            if (card.isReversed) {
                cardSprite.rotation = Math.PI;
            }
            
            cardSprite.bitmap.addLoadListener(() => {
                const maxWidth = 160;
                const maxHeight = 240;
                const scaleX = maxWidth / cardSprite.bitmap.width;
                const scaleY = maxHeight / cardSprite.bitmap.height;
                const scale = Math.min(scaleX, scaleY);
                cardSprite.scale.x = scale;
                cardSprite.scale.y = scale;
                
                // Fade in animation
                cardSprite.opacity = 0;
                const fadeIn = () => {
                    cardSprite.opacity += 10;
                    if (cardSprite.opacity < 255) {
                        requestAnimationFrame(fadeIn);
                    } else {
                        this.setupChoices();
                    }
                };
                fadeIn();
            });
            
            this.addChild(cardSprite);
            this._currentCardSprite = cardSprite;
            
            // Update card name
            this._cardWindow.contents.clear();
            const cardName = this.getCardName(card.number);
            const orientation = card.isReversed ? this.getLocalizedText('reversed') : this.getLocalizedText('upright');
            this._cardWindow.changeTextColor(ColorManager.systemColor());
            this._cardWindow.drawText(cardName, 0, 240, this._cardWindow.width - 32, 'center');
            this._cardWindow.drawText(`(${orientation})`, 0, 270, this._cardWindow.width - 32, 'center');
        }

        setupChoices() {
            const card = this._selectedCards[this._currentCardIndex];
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const meanings = TarotMeanings[lang][card.number];
            const pool = card.isReversed ? meanings.reversed : meanings.upright;
            
            // Get correct meaning
            const correctIndex = Math.floor(Math.random() * pool.length);
            const correctMeaning = pool[correctIndex];
            this._correctMeanings.push(correctMeaning);
            
            // Get two wrong meanings from other cards
            const wrongMeanings = [];
            const usedCards = [card.number];
            
            while (wrongMeanings.length < 2) {
                const randomCard = Math.floor(Math.random() * 22) + 1;
                if (!usedCards.includes(randomCard)) {
                    usedCards.push(randomCard);
                    const wrongPool = TarotMeanings[lang][randomCard];
                    const wrongOrientation = Math.random() < 0.5 ? wrongPool.reversed : wrongPool.upright;
                    const wrongMeaning = wrongOrientation[Math.floor(Math.random() * wrongOrientation.length)];
                    wrongMeanings.push(wrongMeaning);
                }
            }
            
            // Shuffle choices
            this._choices = [correctMeaning, ...wrongMeanings];
            for (let i = this._choices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this._choices[i], this._choices[j]] = [this._choices[j], this._choices[i]];
            }
            
            // Store correct answer index
            this._correctAnswerIndex = this._choices.indexOf(correctMeaning);
            
            // Setup choice window
            this._choiceWindow.clearCommandList();
            this._choices.forEach((choice, index) => {
                // Truncate long meanings for the choice window
                const truncated = choice.length > 80 ? choice.substring(0, 77) + '...' : choice;
                this._choiceWindow.addCommand(truncated, 'choice' + index);
            });
            
            // Set handlers
            this._choices.forEach((_, index) => {
                this._choiceWindow.setHandler('choice' + index, () => this.onChoiceSelect(index));
            });
            
            this._choiceWindow.refresh();
            this._choiceWindow.show();
            this._choiceWindow.activate();
            this._choiceWindow.select(0);
        }

        onChoiceSelect(index) {
            this._choiceWindow.deactivate();
            this._choiceWindow.hide();
            
            // Check if correct
            if (index === this._correctAnswerIndex) {
                this._correctAnswers++;
                SoundManager.playOk();
            } else {
                SoundManager.playBuzzer();
            }
            
            // Move to next card or end
            this._currentCardIndex++;
            if (this._currentCardIndex < 3) {
                // Fade out current card
                const fadeOut = () => {
                    this._currentCardSprite.opacity -= 10;
                    if (this._currentCardSprite.opacity > 0) {
                        requestAnimationFrame(fadeOut);
                    } else {
                        this.removeChild(this._currentCardSprite);
                        this.updateProgress();
                        this.showCurrentCard();
                    }
                };
                fadeOut();
            } else {
                this.endReading();
            }
        }

        onChoiceCancel() {
            // Prevent canceling during choice
        }

        endReading() {
            // Determine message based on score
            let message;
            if (this._correctAnswers === 3) {
                message = this._npcData.perfectMessage;
            } else if (this._correctAnswers === 2) {
                message = this._npcData.goodMessage;
            } else if (this._correctAnswers === 1) {
                message = this._npcData.averageMessage;
            } else {
                message = this._npcData.poorMessage;
            }
            
            // Store message for display after scene ends
            $gameMessage.setBackground(0);
            $gameMessage.setPositionType(2);
            
            // Compatibility wrapper
            window.skipLocalization = true;
            message.split('\n').forEach(line => {
                $gameMessage.add(line);
            });
            window.skipLocalization = false;
            
            // Return to map
            this.popScene();
        }

        getCardName(number) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const names = {
                en: [
                    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
                    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
                    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
                    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
                    'Judgement', 'The World'
                ],
                it: [
                    'Il Matto', 'Il Mago', 'La Papessa', 'L\'Imperatrice', 'L\'Imperatore',
                    'Il Papa', 'Gli Amanti', 'Il Carro', 'La Forza', 'L\'Eremita',
                    'La Ruota della Fortuna', 'La Giustizia', 'L\'Appeso', 'La Morte', 'La Temperanza',
                    'Il Diavolo', 'La Torre', 'La Stella', 'La Luna', 'Il Sole',
                    'Il Giudizio', 'Il Mondo'
                ]
            };
            return names[lang][number - 1];
        }

        getLocalizedText(key) {
            const lang = ConfigManager.language === 'it' ? 'it' : 'en';
            const texts = {
                en: {
                    npcTitle: 'Reading Tarot for %1',
                    past: 'Past',
                    present: 'Present',
                    future: 'Future',
                    upright: 'Upright',
                    reversed: 'Reversed'
                },
                it: {
                    npcTitle: 'Lettura dei Tarocchi per %1',
                    past: 'Passato',
                    present: 'Presente',
                    future: 'Futuro',
                    upright: 'Dritto',
                    reversed: 'Rovesciato'
                }
            };
            return texts[lang][key] || texts.en[key];
        }

        update() {
            super.update();
            
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                if (!this._choiceWindow.active) {
                    this.popScene();
                }
            }
        }
    }

})();