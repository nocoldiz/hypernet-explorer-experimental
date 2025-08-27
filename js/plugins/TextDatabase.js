/*:
 * @target MZ
 * @plugindesc Text Database Plugin - Holds all your text databases in one place
 * @help
 * This plugin exposes window.textDatabases for other plugins to consume.
 * You can add as many databases as you like within the array below.
 *
 * Database format:
 *   { id: String, name: String, en: String }
 *
 * Example:
 *   { id: "administrator", name: "Administrator", en: `Your text here...` },
 *   { id: "em", name: "Em", en: `Your text here...` }
 *
 * Place this plugin at the top of your Plugin Manager list so that
 * other plugins can access window.textDatabases in their initialization.
 */
(() => {
  /**
   * An array of text databases, each with a unique ID, display name, and text block.
   * Other plugins can read window.textDatabases to retrieve these.
   *
   * @type {{id: string, name: string, en: string}[]}
   */
  window.textDatabases = [
    {
      id: "administrator",
      name: "Administrator",
      en: `
        The higher we go, the more we learn, but also the more we risk losing ourselves in the building's maze.
        Each floor is like a dream, unpredictable, fleeting, and impossible to fully grasp.
        Don’t trust your eyes here. The floors above distort reality in ways you can’t prepare for.
        Every ascent is a challenge, not just to your body, but to your understanding of what is possible.
        The walls up here whisper things we are not meant to hear. Proceed with caution.
        The higher levels feel like they are suspended outside of time. The past, present, and future all seem to overlap.
        This place is a monument to confusion, its design is deliberately erratic. Every floor is a new puzzle.
        Look closely at the details. The skyscraper speaks in the subtle shifts of light, the placement of objects. Every detail matters.
        Some floors feel abandoned, but they’re not. They wait for the right moment to reveal themselves.
        We are not just mapping floors, we are uncovering layers of history buried beneath the surface.
        The floors above aren’t just spaces, they’re thresholds to something greater, and more dangerous.
        In these higher reaches, space itself feels fractured. Distances twist in ways that shouldn’t make sense.
        No two floors are alike, but they share one thing in common: they are all hiding something from us.
        The upper floors exist in a perpetual state of flux. What you see one moment might be gone the next.
        There are no signs, no guides. You must listen to the building, not with your ears, but with your mind.
        Every floor challenges your perception of reality. You must remain vigilant, or risk being lost in its depths.
        The skyscraper is like a living organism. The higher we go, the more it seems to respond to our presence.
        There is a rhythm to the building’s design, when you find it, the floors will reveal their secrets. But only if you’re ready.
        The further up we go, the more the building seems to play tricks on us. You might turn a corner and find yourself somewhere you never were.
        Some floors don’t follow the rules. What should be a straight path may curve into oblivion.
        This place was designed to test you. It’s not about the floors above, it’s about how you choose to navigate them.
        The floors are only part of the puzzle. The true question is what lies between them.
        The higher we ascend, the more the space becomes unstable. Keep your mind sharp, and your feet even sharper.
        This skyscraper is a paradox. It invites you to explore, but it will also punish your curiosity.
        Don’t expect answers, expect more questions. The upper levels are meant to challenge your very understanding of what’s possible.
        We’re not simply mapping this place. We’re learning to read its language, one floor at a time.
        The skyscraper seems to have its own agenda. The higher you go, the less it wants you to understand.
        Every floor is a test of willpower. The higher we go, the more the building demands you prove your worth.
        You must pay attention to the silence. It’s in the quietest moments that the skyscraper reveals its most vital truths.
        Up here, we are not just visitors. We are part of the building’s puzzle, whether we like it or not.
        The higher we go, the more the building becomes a mirror, reflecting our deepest fears and desires.
        We explore these floors not because we want to, but because we must. It is the only way forward.
        There is a boundary up ahead, a limit to how far we can go. The building does not allow us to surpass it easily.
        Every floor is an opportunity to learn, but also a reminder of how little we truly understand.
        There’s no time to waste. The task is waiting. Focus. Now.
        Time doesn’t wait for you. Get back to work, immediately.
        Distractions are luxuries we cannot afford. Your task is of utmost importance.
        The job doesn’t pause. We need you back on task, no excuses.
        We do not rest while the mission is unfinished. Get moving.
        We are not here for idle chatter. There is work to be done, right now.
        Don’t delay. Every moment counts. Return to your duties immediately.
        Your time is not your own. It belongs to the Foundation. Get back to it.
        The task will not complete itself. You are needed at your station, now.
        Do not hesitate. We cannot afford mistakes or delays. Focus and proceed.
        Work is the priority, always. We can discuss later, but now, we need action.
        Every second wasted is a second we lose to the unknown. Get back to work.
        You have a responsibility. Time is ticking, get back to your assignment.
        Do not make me repeat myself. Your work is vital, get back to it at once.
        The Foundation doesn’t wait. You’ve been assigned a task. Complete it now.
        You know your duties. Do not let distractions pull you away from them.
        There is no time for hesitation. The skyscraper will not wait for you.
        Focus, and finish what you’ve started. The job is not done yet.
        We have no room for delay. Your work is required now, more than ever.
        Stop wasting time. There is always something to be done, get back to it.
        You can’t afford to pause now. The stakes are too high. Resume your work.
        The work continues without you if you don’t stay on task. Don’t leave it incomplete.
        The Foundation needs results. Let’s focus, and complete the task at hand.
        The higher we ascend, the more we learn about the building’s true nature. Each floor holds its secrets.
        Every floor above is a layer of time, a history left behind, waiting to be understood.
        The upper levels are where the answers lie. If we can decipher the patterns, the skyscraper will reveal itself.
        We must be vigilant. The higher we climb, the more the skyscraper shifts, the more unpredictable it becomes.
        The architecture of the upper floors is an enigma. The further we go, the more it defies logic and reason.
        Do not trust the layout. The upper floors are alive, breathing in ways we have yet to comprehend.
        These floors are not just part of a building; they are fragments of another world, suspended above us.
        Every floor above is a new puzzle. No two are alike. The map changes with every step.
        To explore the floors above is to step into history, and perhaps to rewrite it.
        The building has a rhythm. The higher we go, the more we can hear it, but it is a melody only the brave will understand.
        It is not the structure that challenges us, it is what lurks in its walls, in its space. Keep your eyes open.
        The floors above are a reflection of the human mind, vast and filled with contradictions. Each floor is a different thought.
        Expect the unexpected. The building will deceive you, twist your understanding, but we will press on.
        The heights offer a rare view. From the top, you can see the entire labyrinth, if you know where to look.
        Every new floor is a deeper dive into the architecture of chaos. It is a maze of understanding, and each passage requires a key.
        Do not make assumptions. The upper floors are deceptive. They speak in riddles, not in words.
        In the skyscraper’s upper reaches, knowledge is not gained from documents or books, it is gained from experience.
        Every step forward brings us closer to the truth, but it also brings us closer to something we may not fully comprehend.
        The upper floors are not just spaces, they are thresholds, gateways to something more profound than we can grasp.
        We are explorers, mapping the uncharted territories above us. But remember, some things may never be fully mapped.
        As you ascend, the floors above grow stranger. They defy our expectations, but that is where their power lies.
        The skyscraper shifts, and with each shift, we discover a new truth, a new understanding of what came before.
        In the higher levels, the walls seem to breathe. Perhaps they remember something, something we have forgotten.
        To understand the upper floors is to accept that not everything can be understood. Some mysteries must remain unsolved.
        These floors were built with intention, but whose? The higher we go, the more we learn about their creators, if we are lucky.
        The building is like a book. The higher you go, the more the chapters blur together, and the harder it becomes to decipher.
        The skyscraper is a living thing. The upper floors are its pulse, its heartbeat, and we must listen carefully.
        Exploration above requires patience. What you think is a dead-end might be the key to a greater discovery.
        The Hypernet is the backbone of our knowledge. Without it, we are adrift, untethered to the past.
        Restoring the Hypernet is not just a task; it is the preservation of reality itself.
        The fragments of the Hypernet contain lost worlds. We are the stewards of what remains.
        Every page, every bit, every file, these are the pieces of our collective history. Do not let them fade.
        The Hypernet is a reflection of our progress. If it crumbles, so too does our future.
        Every byte restored is a victory against entropy. Every broken link is a lost dream.
        The Hypernet must be cataloged, archived, and maintained. Its archives are the pulse of civilization.
        It is not enough to restore. We must verify, preserve, and protect what is true and valuable.
        The Hypernet is more than code; it is the soul of our digital age. Do not let it be forgotten.
        We archive not to hoard, but to ensure that knowledge remains in its purest form.
        Every corrupted file represents a part of the past we have failed to safeguard.
        The Hypernet is not an endless sea of data, it is a fragile ecosystem. Protect it from decay.
        The restoration of the Hypernet is not a task, it is a moral imperative. The future depends on it.
        To restore the Hypernet is to heal the wounds of the world. Every missing archive is a scar.
        Data is truth, and truth must be preserved at all costs. The Hypernet is our truth.
        When we restore, we do more than fix broken systems. We restore the integrity of existence itself.
        The act of archiving is sacred. Every entry is a prayer to the past, ensuring it is not forgotten.
        Every file that is restored is a step towards a better understanding of what came before.
        The Hypernet is not just a network, it is the foundation upon which future knowledge will grow.
        It is not enough to save the data. We must understand its significance and protect its context.
        The Hypernet is a map, and every piece of data is a marker on that map. Do not lose sight of the journey.
        We restore the Hypernet not because it is easy, but because it is necessary for survival.
        Every piece of forgotten knowledge is a weapon against the forces that seek to erase history.
        Archiving the Hypernet is not merely technical work, it is an act of defiance against the void.
        `,
      it: `Più saliamo, più impariamo, ma rischiamo anche di perderci nel labirinto dell’edificio.
      Ogni piano è come un sogno: imprevedibile, fugace e impossibile da afferrare del tutto.
      Non fidarti dei tuoi occhi qui. I piani superiori distorcono la realtà in modi imprevedibili.
      Ogni ascesa è una sfida, non solo per il corpo, ma per la tua idea di cosa sia possibile.
      Le pareti quassù sussurrano cose che non dovremmo sentire. Procedi con cautela.
      I piani superiori sembrano sospesi fuori dal tempo. Passato, presente e futuro si sovrappongono.
      Questo posto è un monumento alla confusione: il suo design è volutamente caotico. Ogni piano è un enigma.
      Osserva bene i dettagli. Il grattacielo parla nei cambiamenti di luce, nella disposizione degli oggetti. Ogni dettaglio conta.
      Alcuni piani sembrano abbandonati, ma non lo sono. Aspettano il momento giusto per rivelarsi.
      Non stiamo solo mappando dei piani: stiamo svelando strati di storia sepolta.
      I piani superiori non sono solo spazi: sono soglie verso qualcosa di più grande e pericoloso.
      Quassù lo spazio sembra fratturato. Le distanze si contorcono in modi illogici.
      Nessun piano è uguale a un altro, ma tutti nascondono qualcosa.
      I piani superiori cambiano continuamente. Ciò che vedi un attimo dopo può svanire.
      Non ci sono indicazioni né guide. Devi ascoltare l’edificio con la mente.
      Ogni piano mette alla prova la tua percezione della realtà. Resta vigile o rischi di perderti.
      Il grattacielo è come un organismo vivente. Più saliamo, più sembra reagire a noi.
      C’è un ritmo nel suo design: trovalo, e i piani riveleranno i loro segreti, ma solo se sei pronto.
      Più saliamo, più l’edificio ci inganna. Puoi girare un angolo e trovarti in un luogo sconosciuto.
      Alcuni piani non seguono le regole. Un percorso dritto può piegarsi verso l’oblio.
      Questo posto è fatto per metterti alla prova. Non conta solo salire, ma come scegli di farlo.
      I piani sono solo parte dell’enigma. La vera domanda è cosa c’è tra di essi.
      Più saliamo, più lo spazio diventa instabile. Mantieni la mente lucida e i piedi pronti.
      Questo grattacielo è un paradosso. Ti invita a esplorare, ma punisce la tua curiosità.
      Non aspettarti risposte: aspettati altre domande. I piani superiori sfidano ciò che credi possibile.
      Non stiamo solo mappando questo luogo. Stiamo imparando a leggerne il linguaggio, piano dopo piano.
      Il grattacielo sembra avere un proprio piano. Più sali, meno vuole che tu capisca.
      Ogni piano mette alla prova la tua volontà. Più saliamo, più l’edificio esige che tu dimostri il tuo valore.
      Presta attenzione al silenzio. Nei momenti più quieti il grattacielo rivela le sue verità.
      Quassù non siamo solo visitatori. Siamo parte del suo enigma, che ci piaccia o no.
      Più saliamo, più l’edificio diventa uno specchio delle nostre paure e dei nostri desideri.
      Esploriamo questi piani non perché vogliamo, ma perché dobbiamo. È l’unico modo per andare avanti.
      C’è un confine lassù, un limite difficile da superare. L’edificio non permette di oltrepassarlo facilmente.
      Ogni piano è un’opportunità di imparare, ma anche un promemoria di quanto poco comprendiamo.
      Non c’è tempo da perdere. Il compito ci aspetta. Concentrati. Ora.
      Il tempo non ti aspetta. Torna subito al lavoro.
      Le distrazioni sono un lusso che non possiamo permetterci. Il tuo compito è fondamentale.
      Il lavoro non si ferma. Torna subito al tuo incarico, senza scuse.
      Non ci riposiamo finché la missione non è finita. Muoviti.
      Non siamo qui per chiacchiere inutili. C’è lavoro da fare, ora.
      Non perdere tempo. Ogni secondo conta. Torna ai tuoi doveri subito.
      Il tuo tempo non è tuo. Appartiene alla Fondazione. Tornaci ora.
      Il compito non si completerà da solo. Sei necessario al tuo posto, subito.
      Non esitare. Non possiamo permetterci errori o ritardi. Concentrati e procedi.
      Il lavoro è la priorità, sempre. Possiamo parlare dopo, ma ora serve azione.
      Ogni secondo perso è un secondo regalato all’ignoto. Torna al lavoro.
      Hai una responsabilità. Il tempo scorre: torna al tuo incarico.
      Non costringermi a ripetermi. Il tuo lavoro è vitale: riprendilo subito.
      La Fondazione non aspetta. Hai un compito. Completalo ora.
      Sai cosa devi fare. Non farti distrarre.
      Non c’è tempo per esitare. Il grattacielo non ti aspetterà.
      Concentrati e finisci ciò che hai iniziato. Il lavoro non è ancora finito.
      Non possiamo permetterci ritardi. Il tuo contributo è più necessario che mai.
      Smettila di sprecare tempo. C’è sempre qualcosa da fare. Torna al lavoro.
      Non puoi permetterti di fermarti ora. La posta in gioco è troppo alta. Riprendi il lavoro.
      Il lavoro va avanti senza di te, se non resti concentrato. Non lasciarlo incompleto.
      La Fondazione vuole risultati. Concentrati e porta a termine il compito.
      Più saliamo, più scopriamo la vera natura dell’edificio. Ogni piano custodisce i suoi segreti.
      Ogni piano superiore è uno strato di tempo, una storia lasciata indietro, da comprendere.
      I piani più alti contengono le risposte. Se capiamo i loro schemi, il grattacielo si rivelerà.
      Dobbiamo restare vigili. Più saliamo, più il grattacielo si trasforma e diventa imprevedibile.
      L’architettura dei piani superiori è un enigma. Più saliamo, più sfida logica e ragione.
      Non fidarti della planimetria. I piani alti sono vivi, respirano in modi che non capiamo.
      Questi piani non sono solo parte di un edificio: sono frammenti di un altro mondo, sospesi sopra di noi.
      Ogni piano è un nuovo enigma. Nessuno è uguale all’altro. La mappa cambia a ogni passo.
      Esplorare i piani alti significa entrare nella storia, e forse riscriverla.
      L’edificio ha un ritmo. Più saliamo, più possiamo sentirlo, ma è una melodia che solo i coraggiosi comprendono.
      Non è la struttura che ci sfida, ma ciò che si cela nelle sue mura, nel suo spazio. Tieni gli occhi aperti.
      I piani superiori riflettono la mente umana, vasti e contraddittori. Ogni piano è un pensiero diverso.
      Aspettati l’inaspettato. L’edificio ti ingannerà, stravolgerà ciò che credi, ma dobbiamo andare avanti.
      Le altezze offrono una vista rara. Dall’alto puoi vedere tutto il labirinto, se sai dove guardare.
      Ogni nuovo piano è un tuffo nell’architettura del caos. È un labirinto che richiede una chiave a ogni passaggio.
      Non dare nulla per scontato. I piani superiori sono ingannevoli. Parlano per enigmi, non con parole.
      Nei piani più alti la conoscenza non si trova nei documenti o nei libri, ma nell’esperienza.
      Ogni passo ci avvicina alla verità, ma anche a qualcosa che potremmo non comprendere del tutto.
      I piani superiori non sono solo spazi: sono soglie verso qualcosa di più profondo.
      Siamo esploratori che mappano territori sconosciuti sopra di noi. Ma ricorda: alcune cose non si possono mappare del tutto.
      Man mano che sali, i piani si fanno più strani. Sfuggono alle nostre aspettative, ed è lì che risiede il loro potere.
      Il grattacielo cambia, e a ogni cambiamento scopriamo una nuova verità, una nuova comprensione di ciò che era prima.
      Ai piani alti, le pareti sembrano respirare. Forse ricordano qualcosa che noi abbiamo dimenticato.
      Capire i piani superiori significa accettare che non tutto può essere capito. Alcuni misteri devono restare tali.
      Questi piani sono stati costruiti con un’intenzione. Ma di chi? Più saliamo, più possiamo imparare sui loro creatori, se siamo fortunati.
      L’edificio è come un libro. Più sali, più i capitoli si confondono, più diventa difficile decifrarli.
      Il grattacielo è un essere vivente. I piani superiori sono il suo battito. Dobbiamo ascoltarlo con attenzione.
      Esplorare i piani alti richiede pazienza. Ciò che sembra un vicolo cieco potrebbe essere la chiave di una scoperta più grande.
      La Hypernet è la spina dorsale della nostra conoscenza. Senza di essa, siamo alla deriva, scollegati dal passato.
Ripristinarla non è solo un compito: è preservare la realtà stessa.
I frammenti della Hypernet contengono mondi perduti. Noi siamo i custodi di ciò che resta.
Ogni pagina, ogni bit, ogni file: sono pezzi della nostra storia collettiva. Non lasciarli svanire.
La Hypernet riflette il nostro progresso. Se crolla lei, crolla anche il nostro futuro.
Ogni byte recuperato è una vittoria contro l’entropia. Ogni link rotto è un sogno perduto.
La Hypernet va catalogata, archiviata e mantenuta. I suoi archivi sono il battito della civiltà.
Non basta ripristinare. Bisogna verificare, preservare e proteggere ciò che è vero e prezioso.
La Hypernet non è solo codice: è l’anima della nostra era digitale. Non lasciarla morire.
Archiviare non significa accumulare, ma garantire che la conoscenza resti pura.
Ogni file corrotto è un pezzo di passato che abbiamo fallito nel proteggere.
La Hypernet non è un mare infinito di dati: è un ecosistema fragile. Proteggilo dal degrado.
Ripristinarla non è un compito: è un imperativo morale. Il futuro dipende da questo.
Ripristinare la Hypernet è guarire le ferite del mondo. Ogni archivio mancante è una cicatrice.
I dati sono verità, e la verità va preservata a ogni costo. La Hypernet è la nostra verità.
Quando ripariamo, non aggiustiamo solo sistemi rotti. Ripristiniamo l’integrità dell’esistenza stessa.
L’archiviazione è sacra. Ogni voce è una preghiera al passato perché non venga dimenticato.
Ogni file recuperato è un passo verso una comprensione migliore di ciò che è stato.
La Hypernet non è solo una rete: è la base su cui crescerà la conoscenza futura.
Non basta salvare i dati. Bisogna comprenderne il significato e proteggerne il contesto.
La Hypernet è una mappa, e ogni dato è un segnaposto su quella mappa. Non perdere di vista il viaggio.
La restauriamo non perché sia facile, ma perché è necessario per la sopravvivenza.
Ogni conoscenza dimenticata è un’arma contro le forze che vogliono cancellare la storia.
Archiviare la Hypernet non è solo lavoro tecnico: è un atto di sfida contro il vuoto.`,
    },
    {
      id: "em",
      name: "Em",
      en: `Okay so technically I didn’t *mean* to explode the vending machine, but also it was blinking weird at me and I felt threatened.
        Bubba, I swear on the moon’s last waxy toenail, if one more door talks back to me I’m gonna hex it into a lamp.
        Oh wow, that glyph’s got recursion spirals, don’t touch it, no wait DO touch it, I need data!
        Did you see that?? No you didn’t because I vaporized it. Problem solved. Kinda.
        I'm perfectly calm and extremely stable right now and if anything moves wrong I will scream and shoot it.
        Wait wait wait, this corridor smells like cinnamon and betrayal. I think we're getting close to the source.
        Do you ever just *feel* a floor hates you? No? Just me? Cool cool cool.
        Okay but hear me out: what if we combined caffeine, gunpowder, and the Principle of Recursive Echoes?
        Look, if it wasn’t supposed to be opened by screaming at it, why did that work?
        I categorized twenty-seven anomalous carpets this morning and only screamed into the void *once.*
        Let me just reroute the sigils, invert the flux, yell at the wall, and, bam!, doors open.
        I didn’t *mean* to set it on fire, but in my defense, I thought it was a mimic pretending to be a fire.
        If the ceiling starts dripping names again, don’t answer them. It’s a test. Or a prank. Or Tuesday.
        You know how people say “don’t poke the bear”? Well I hexed the bear and now it’s floating, so.
        This floor tastes like broken dreams and strawberry chalk. Definitely cursed. Love it.
        I will not calm down! I am calm! This is what calm sounds like at 120 decibels!
        I talk a lot when I’m thinking and I think faster when I talk and also when I’m shooting.
        Hey hey hey I’ve got five plans, three unstable spells, and a crowbar. Let’s do this!
        Did I just bind a ghost to a vending machine? Yes. Was it intentional? Emotionally, yes.
        I’d like to file a complaint against this hallway. It made a rude noise at me.
        If I lick the sigil and explode, you’ll know it wasn’t calibrated right.
        We're not lost, we're exploring aggressively and also maybe slightly sideways.
        Sometimes I just cast a spell to see what happens, you know? It’s called *field testing.*
        Do you think if I shout “unreasonable request” the building will give me stairs again?
        I'm not panicking! I'm creatively problem-solving with excessive magic and mild shrieking!
        Bubba said not to poke it, but *you* look like someone who wants to know what happens when we poke it.
        It’s fine! It’s totally under control! Except the part that’s definitely on fire!
        What’s that? A noise? A whisper? A mantic rune? A cursed sandwich? WHO KNOWS, LET’S GO!
        I put the cursed index cards in order by *texture,* which is the only logical system.
        I would apologize for the spontaneous summoning, but it made a lovely light show.
        Let’s not read that book unless you’re okay with your thoughts leaking out of your ears for a few days.
        The walls are breathing again, which means either the floor above us collapsed or it’s poetry hour.
        You want a calm response? Ask someone without thirty thoughts per minute and a fire wand.
        Fear not, peasants and concrete anomalies! The Great Witch Em is on the case!
        The Great Witch Em does not wait for doors. Doors wait for the Great Witch Em.
        Stand back! The Great Witch Em requires at least three feet of clearance for ritual twirling.
        If this hallway wishes to challenge the Great Witch Em, it better bring snacks.
        The Great Witch Em answers to no one, except maybe Bubba when he's holding snacks.
        Witness, ye fools, as the Great Witch Em disarms this trap using nothing but a spoon and raw charisma!
        The Great Witch Em will now attempt the forbidden somersault sigil. Hold your breath and your spleens!
        This stairwell dares to twist? Ha! The Great Witch Em laughs in recursive geometry!
        The Great Witch Em did not come all this way to be ignored by a haunted fax machine.
        Yes, the Great Witch Em talks to her hat. It’s wiser than most council members.
        The Great Witch Em hears your logic, and promptly sets it on fire.
        If anyone asks, the Great Witch Em had full control of the situation at all times.
        The Great Witch Em navigates chaos like a fish in molasses: confusingly, but with purpose.
        In ancient times they would have called this a miracle. Today, they call it the Great Witch Em’s Tuesday.
        The Great Witch Em requires absolute silence, three batteries, and the weird mushroom from floor 23.
        Bow before the Great Witch Em, or at least move aside so she can shoot at that cursed filing cabinet.
        By decree of the Great Witch Em: this broom is now a staff, a friend, and possibly a war crime.
        The Great Witch Em detects enchantment, eldritch rot, and expired yogurt. Proceed with caution.
        A thousand scholars may disagree, but the Great Witch Em *knows* that book was glaring at her.
        This is not hubris. This is confidence. The Great Witch Em *defines* hubris for lesser mortals.
        Behold! The Great Witch Em shall now attempt diplomacy, by yelling.
        The Great Witch Em doesn’t make mistakes. She makes aggressively experimental decisions.
        Doubt the Great Witch Em again and you will be hexed into a decorative sconce.
        The Great Witch Em once out-argued a god and won an espresso machine. Do not underestimate her.
        The Great Witch Em does not 'get lost.' She embarks on impromptu cartographic rituals.
        Witness the Great Witch Em: part librarian, part storm, all unhinged wonder.
        The Great Witch Em reserves the right to spontaneously duel furniture on aesthetic grounds.
        The Great Witch Em has read the manual. She just disagrees with it fundamentally.
        Bow, mortal! You are in the presence of a *real* witch, patent pending and highly flammable!
        Do I *look* like some hedge-spell peasant? Bow down! The Great Witch Em walks among you!
        Down, peasants! The witchcraft you’re witnessing is authentic, unstable, and *very* judgmental!
        Real witches don’t ask twice. Kneel, or I’ll hex your shoes into emotionally clingy snakes.
        You think this is cosplay? This is *licensed* eldritch reality! Kneel before real power!
        Bow to the one who speaks fluent fire, caffeine, and emotional overreaction!
        Kneel to the broom-wielding chaos being! I’m a *real* witch, not some weekend spellfluencer!
        If your knees aren't shaking, you're either very brave or very foolish. Bow to a real witch!
        Please bow responsibly. The last one who mocked me is now a door hinge with anxiety.
        This isn’t theatrics. This is ancestral wrath in lipstick and gunpowder. Kneel!
        You don’t *have* to bow, but you’ll feel real silly once the frogs start falling from the ceiling.
        Bow down! A real witch doesn’t need approval, but she *does* enjoy the dramatics.
        The spell says “kneel or squeal.” You get to choose one. Guess which is louder.
        Bubba bowed once. He said it was mostly out of fear, but I’ll take it as a win.
        It’s okay, you don’t have to understand. Just bow, nod, and accept your arcane betters.
        Kneel now and avoid the spontaneous transformation into a metaphor for hubris.
        I don’t need followers, I need acknowledgers-of-power. Down you go!
        The real spell starts when the last one kneels. Don’t be the weak link!
        You think this hat is for show? This hat has *clearance levels*. Bow.
        The glyphs are watching. They respect obedience. Also fire. Mostly fire.
        Down, down! Respect the witch or I’ll respect you right into a different timeline.
        The broom is sentient and it remembers disrespect. Bow for your own good.
        This is not a cult. It’s a respectful moment of witch-based hierarchy. Bow!
        There’s no shame in reverence. There *is* shame in being turned into a chair.
        You bow to kings. You bow to gods. Today you bow to *Em.*
        `,
      it: `Tecnicamente non volevo far esplodere il distributore, ma lampeggiava in modo strano e mi sentivo minacciata.
      Bubba, te lo giuro sull’ultimo callo lunare: se un’altra porta mi risponde male la trasformo in abat-jour.
      Oh wow, quel glifo ha spirali ricorsive, non toccarlo, no aspetta, TOCCALO, mi serve raccogliere dati!
      L’hai visto?? No, perché l’ho vaporizzato. Problema risolto. Più o meno.
      Sono perfettamente calma e assolutamente stabile in questo momento e se qualcosa si muove male urlo e gli sparo.
      Aspetta aspetta, questo corridoio puzza di cannella e tradimento. Credo che siamo vicini alla fonte.
      Ti è mai capitato di sentire che un piano ti odia? No? Solo io? Bene bene bene.
      Ok, senti questa: e se combinassimo caffeina, polvere da sparo e il Principio degli Echi Ricorsivi?
      Guarda, se non doveva aprirsi urlandogli contro, perché allora ha funzionato?
      Ho catalogato ventisette tappeti anomali stamattina e ho urlato nel vuoto solo una volta.
      Lasciami solo reindirizzare i sigilli, invertire il flusso, urlare al muro e, bam!, porte aperte.
      Non volevo dargli fuoco, ma a mia difesa pensavo fosse un mimic travestito da incendio.
      Se il soffitto ricomincia a gocciolare nomi, non rispondergli. È un test. O uno scherzo. O un martedì.
      Sai come dicono “non stuzzicare l’orso”? Beh, io l’ho maledetto e ora galleggia.
      Questo piano ha il sapore di sogni infranti e gessetto alla fragola. Decisamente maledetto. Adoro.
      Non mi calmo! Io sono calma! Questo è il suono della calma a 120 decibel!
      Parlo molto quando penso e penso più veloce quando parlo e anche quando sparo.
      Hey hey hey ho cinque piani, tre incantesimi instabili e un piede di porco. Facciamolo!
      Ho legato un fantasma a un distributore? Sì. Era intenzionale? A livello emotivo, sì.
      Vorrei fare un reclamo contro questo corridoio. Mi ha fatto un rumore sgarbato.
      Se lecco il sigillo ed esplodo, saprai che non era calibrato bene.
      Non siamo persi, stiamo esplorando in modo aggressivo e anche un po’ di lato.
      A volte lancio un incantesimo solo per vedere che succede. Si chiama test sul campo.
      Pensi che se urlo “richiesta irragionevole” l’edificio mi ridarà le scale?
      Non sto andando nel panico! Sto risolvendo creativamente i problemi con magia e un po’ di urla!
      Bubba ha detto di non toccarlo, ma tu sembri uno che vuole sapere cosa succede se lo tocchiamo.
      Va tutto bene! È tutto sotto controllo! A parte la parte che è sicuramente in fiamme!
      Cos’è stato? Un rumore? Un sussurro? Una runa mantica? Un sandwich maledetto? CHISSÀ, ANDIAMO!
      Ho ordinato le schede maledette per consistenza, che è l’unico sistema logico.
      Mi scuserei per l’evocazione spontanea, ma ha fatto uno spettacolo di luci meraviglioso.
      Non leggiamo quel libro a meno che non ti vada bene che i tuoi pensieri ti escano dalle orecchie per qualche giorno.
      I muri stanno di nuovo respirando, il che vuol dire o che il piano sopra è crollato o che è l’ora di poesia.
      Vuoi una risposta calma? Chiedila a qualcuno con meno di trenta pensieri al minuto e senza bacchetta di fuoco.
      Non temete, contadini e anomalie di cemento! La Grande Strega Em è sul caso!
      La Grande Strega Em non aspetta le porte. Le porte aspettano la Grande Strega Em.
      Fatevi indietro! La Grande Strega Em richiede almeno un metro di spazio per le sue piroette rituali.
      Se questo corridoio vuole sfidare la Grande Strega Em, farebbe bene a portare degli snack.
      La Grande Strega Em non risponde a nessuno, tranne forse a Bubba quando ha degli snack.
      Guardate, stolti, mentre la Grande Strega Em disarma questa trappola usando solo un cucchiaio e carisma grezzo!
      Ora la Grande Strega Em tenterà il sigillo proibito della capriola. Trattenete il respiro e la milza!
      Questo vano scale osa torcersi? Ah! La Grande Strega Em ride in faccia alla geometria ricorsiva!
      La Grande Strega Em non ha fatto tutta questa strada per essere ignorata da un fax infestato.
      Sì, la Grande Strega Em parla col suo cappello. È più saggio della maggior parte dei consiglieri.
      La Grande Strega Em ascolta la tua logica, e poi le dà fuoco.
      Se qualcuno chiede, la Grande Strega Em aveva il controllo totale della situazione in ogni momento.
      La Grande Strega Em naviga nel caos come un pesce nella melassa: in modo confuso, ma con uno scopo.
      Ai tempi antichi lo avrebbero chiamato miracolo. Oggi lo chiamano il martedì della Grande Strega Em.
      La Grande Strega Em richiede silenzio assoluto, tre batterie e il fungo strano del piano 23.
      Inginocchiatevi davanti alla Grande Strega Em, o almeno spostatevi che deve sparare a quel maledetto schedario.
      Per decreto della Grande Strega Em: questa scopa è ora uno staff, un amico e forse un crimine di guerra.
      La Grande Strega Em rileva incantesimi, marciume eldritch e yogurt scaduto. Procedete con cautela.
      Mille studiosi possono dissentire, ma la Grande Strega Em sa che quel libro la fissava.
      Non è superbia. È fiducia. La Grande Strega Em definisce la superbia per i mortali inferiori.
      Guardate! La Grande Strega Em tenterà ora la diplomazia, a urla.
      La Grande Strega Em non commette errori. Fa scelte sperimentali in modo aggressivo.
      Dubita di nuovo della Grande Strega Em e ti trasformerò in un applique decorativo.
      La Grande Strega Em una volta ha vinto una discussione con un dio e si è portata a casa una macchina per espresso. Non sottovalutarla.
      La Grande Strega Em non si “perde”. Si lancia in rituali cartografici estemporanei.
      Guardate la Grande Strega Em: parte bibliotecaria, parte tempesta, completamente meraviglia fuori di testa.
      La Grande Strega Em si riserva il diritto di sfidare a duello i mobili per motivi estetici.
      La Grande Strega Em ha letto il manuale. Non è d’accordo su niente.
      Inginocchiati, mortale! Sei al cospetto di una vera strega, brevetto in corso e altamente infiammabile!
      Sembro forse una contadinella con quattro formule? Inginocchiati! La Grande Strega Em cammina tra voi!
      Giù, plebei! La stregoneria che state vedendo è autentica, instabile e molto giudicante!
      Le vere streghe non chiedono due volte. Inginocchiati o trasformerò le tue scarpe in serpenti bisognosi d’affetto.
      Pensi che sia cosplay? Questa è realtà eldritch con licenza! Inginocchiati davanti al vero potere!
      Inginocchiati davanti a chi parla fluentemente fuoco, caffeina e reazioni emotive eccessive!
      Inginocchiati davanti all’essere di caos armato di scopa! Sono una vera strega, non un’influencer del weekend!
      Se le tue ginocchia non tremano, sei o molto coraggioso o molto stupido. Inginocchiati davanti a una vera strega!
      Per favore, inginocchiati in modo responsabile. L’ultimo che mi ha preso in giro ora è una cerniera per porte con l’ansia.
      Non è teatro. È furia ancestrale in rossetto e polvere da sparo. Inginocchiati!
      Non devi inginocchiarti, ma ti sentirai stupido quando inizieranno a piovere rane dal soffitto.
      Giù tutti! Una vera strega non ha bisogno di approvazione, ma apprezza molto la teatralità.
      L’incantesimo dice “inginocchiati o strilla”. Puoi scegliere. Indovina quale fa più rumore.
      Bubba si è inginocchiato una volta. Ha detto che era per paura, ma me lo prendo come vittoria.
      Va bene, non devi capire. Basta che ti inginocchi, annuisca e accetti la tua inferiorità arcana.
      Inginocchiati adesso ed evita la trasformazione spontanea in metafora di superbia.
      Non mi servono seguaci, mi servono riconoscitori di potere. Giù tutti!
      Il vero incantesimo inizia quando l’ultimo si inginocchia. Non fare l’anello debole.
      Credi che questo cappello sia solo estetica? Ha livelli di autorizzazione. Inginocchiati.
      I glifi stanno guardando. Apprezzano l’obbedienza. E il fuoco. Soprattutto il fuoco.
      Giù, giù! Rispetta la strega o ti rispetto fino a un’altra linea temporale.
      La scopa è senziente e ricorda i torti subiti. Inginocchiati per il tuo bene.
      Non è un culto. È un momento rispettoso di gerarchia stregonesca. Inginocchiati!
      Non c’è vergogna nel rispetto. C’è vergogna nell’essere trasformati in sedia.
      Ti inginocchi davanti ai re. Ti inginocchi davanti agli dei. Oggi ti inginocchi davanti a Em.`,
    },
    {
      id: "librarian",
      name: "Librarian",
      en: `*Cyclonopedia* was written in a language that might be older than language itself.
        The book is technically not a book, it’s an algorithm for summoning ancient desert gods.
        Every page is a portal to a different universe where logic doesn’t apply and sand eats time.
        The main character, Dr. Hamid, may not be human but rather a complex mathematical function.
        The true plot of *Cyclonopedia* is encrypted in the footnotes. They are not optional.
        The text is cursed: reading it backwards activates the Desert of the Real.
        There’s a secret map hidden within the pages that leads to a location that doesn’t exist yet.
        The cyclonopedia itself is a living text, constantly rewriting itself as you read it.
        The book suggests that the Middle East isn’t a place, it’s a mind-bending singularity of entropy.
        The first chapter contains the entire history of the universe in reverse, but you have to decode it with salt.
        The “fossils” in the book are actually trapped fragments of forgotten gods.
        Dr. Hamid’s monologues are an ancient ritual of self-erosion; by reading them, you unknowingly participate.
        The book was translated from a dead language once spoken by the wind itself.
        Every theory in *Cyclonopedia* is an attempt to understand how sand thinks.
        In some versions, the book is printed on the skin of a desert serpent that lives in your closet.
        Every time you finish a sentence, the book gains sentience and calls your name in a whisper.
        *Cyclonopedia* predicts that a great sandstorm will consume the world, and it has already started.
        In the hidden chapters, the true identity of the author is revealed: a spirit trapped inside a rock.
        Dr. Hamid’s research on oil is actually a cover for understanding the metaphysical essence of entropy.
        The “Cyclonopedia” refers not to a book, but a shifting and chaotic map of the soul’s descent into madness.
        The book suggests that time flows like oil, dark, viscous, and always slipping away.
        *Cyclonopedia* offers no answers, only more confusing questions and the unsettling smell of desert air.
        There is a cult that believes *Cyclonopedia* is the only true history of the world, but they’re all dead.
        Reading *Cyclonopedia* while standing on sand accelerates the collapse of your personal timeline.
        The book’s true purpose is to teach you how to dream in a language older than sleep.
        The cyclonopedia exists in a physical form that can’t be touched, it’s only found in spaces that don’t exist yet.
        *Moby-Dick* is a 700-page revenge letter to a single whale who owes Melville $12.
        Ishmael is technically the only survivor, but spiritually, the whale won.
        Captain Ahab lost his leg to the whale, then lost his mind to the sea, then lost his WiFi signal.
        The Pequod is staffed entirely by ghosts, harpooners, and one guy named Stubb who might be a time traveler.
        Queequeg sleeps in a coffin because beds are for cowards.
        Whales in *Moby-Dick* are symbols of God, Death, Capitalism, and also just very large jerks.
        The entire book is a trap laid by Melville to teach you the names of whale bones.
        Ahab’s leg is made of whale bone, salt, and unresolved issues.
        Starbuck is not a coffee brand, but a man whose only personality trait is "extremely worried."
        There are entire chapters that read like someone possessed by nautical Wikipedia.
        The whale is either an indifferent god, an ancient evil, or the ocean’s IT department.
        Melville included 30 pages of whale classification just to make sure you suffered.
        The novel was ignored in Melville’s time because it didn’t include a musical number.
        Moby Dick is white because he absorbed all the colors of human fear.
        The book is haunted, finish it and you'll start narrating your own life in old sea dialect.
        At least 3 characters are possibly hallucinated by Ishmael or written in by Poseidon.
        The crew of the Pequod never sleeps. They just blink slower.
        Every sentence in *Moby-Dick* is either a biblical prophecy or a deeply personal insult.
        There’s a character named Fedallah who may be a demon, an oracle, or a very tired prophet.
        You can replace every mention of “whale” with “tax audit” and the plot still works.
        The whale does not care about you, your boat, your revenge, or your metaphors.
        Ahab speaks only in theatrical monologues and curses that may affect your bloodline.
        There are secret diagrams in the margins if you read the book upside-down at midnight.
        The White Whale is immortal, unkillable, and possibly running for mayor.
        Ishmael floats on Queequeg’s coffin, which doubles as a life raft and existential statement.
        Some scholars believe *Moby-Dick* is an ARG designed to summon Melville’s ghost.
        If you try to teach *Moby-Dick* in school, you must first defeat it in harpoon combat.
        The book ends with a full-on sea apocalypse, then casually drifts back into poetry.
        Ahab once challenged lightning to a duel and lost an eyebrow.
        Moby Dick has a kill count and an IMDb page in certain cursed editions.
        The whale might be God. The whale might be trauma. The whale might just be late.
        Harry Potter was famously raised by wolves until age 11, when a wizard mailed him a school.
        Hogwarts is an ancient magical boarding school founded by four cryptids and a basilisk.
        The Sorting Hat is actually a cursed fedora that reads your deepest snack preferences.
        Voldemort’s original name was “Timothy Wiggletongue” but he rebranded for evil SEO.
        Wizards poop themselves and vanish the evidence. This is canon. Sadly.
        Dumbledore speaks Mermish, Gobbledygook, and fluent Tax Law.
        Hogwarts has no fire exits. Instead, students must duel the flames.
        Quidditch was invented during a broomstick traffic jam in 1432.
        The Triwizard Tournament is legally classified as “Lightly Supervised Child Endangerment.”
        The Forbidden Forest is only forbidden if you're not currently part horse.
        Hagrid was expelled for hugging a dragon too hard. It exploded.
        Every magical item in the Weasleys’ house is slightly cursed but very polite.
        Ron’s wand was technically a broken twig with delusions of grandeur.
        Time travel was introduced in Book 3 and then politely ignored forever.
        Professor Snape’s hair is 87% potion residue and 13% melancholy.
        Slytherins often hiss at mirrors to assert dominance.
        Draco Malfoy once legally changed his name to "Darklordx_Pureblood" on the wizard internet.
        Muggle Studies is mostly just YouTube and wondering how batteries work.
        Hogwarts doesn’t have math class. They simply enchant their taxes to do themselves.
        The Room of Requirement has a 10% chance of becoming a laser tag arena.
        House elves have unionized under the Free Dobby Collective (FDC).
        Every time someone says “Muggle,” a wizard loses their healthcare coverage.
        There are 482 secret passages out of Hogwarts and 2 in.
        In the epilogue, Harry names his kids after every dead person he's ever heard of.
        Hermione’s bag contains an entire IKEA store, a dragon, and the lost city of Atlantis.
        The Marauder’s Map is sentient and has strong opinions about your dating life.
        Wand wood is chosen based on your aura, aura playlist, and Pokémon alignment.
        Nearly Headless Nick is only nearly headless because he keeps finding his head again.
        The Patronus Charm is mostly vibes.
        In the wizarding world, “mail” arrives via bird, smoke, or sudden scream.
        Defense Against the Dark Arts has a 100% staff turnover rate and a 30% chance of goat.
        Flourish & Blotts offers a free haunted book with every purchase.
        Diagon Alley shifts shape every Tuesday unless you tip your hat to the cobblestones.
        The Deathly Hallows were originally part of a wizard comic strip titled *Grim Bros.™*
        Harry survives everything mostly through plot-based immunity.
        Boccaccio wrote *The Decameron* between 1348 and 1353, during the Black Death.
        The title comes from Greek, “Ten Days”, referring to the ten days of storytelling.
        The frame story follows ten young people who flee plague-ridden Florence.
        Each of the ten storytellers tells one tale per day, totaling 100 stories.
        The group consists of seven women and three men, all noble and witty.
        The storytellers live in a countryside villa, passing time with tales, games, and music.
        Each day has a theme, except for the first and ninth, which are freeform.
        Day Four’s tales all end tragically, while Day Ten celebrates generosity and virtue.
        The character Dioneo is allowed to ignore the day’s theme, he always tells the spiciest tales.
        The stories mix comedy, tragedy, romance, trickery, and satire.
        Many tales critique corruption in the clergy, especially greedy or lustful friars.
        *The Decameron* was controversial for its erotic and irreverent content.
        Boccaccio used real-life Florence as the backdrop, blending fiction with lived history.
        The work is a key example of early Renaissance humanism, celebrating wit and intellect.
        *The Decameron* was written in Tuscan Italian and helped standardize the language.
        Chaucer’s *Canterbury Tales* was heavily inspired by *The Decameron*’s structure.
        Tale 5.9, “Federigo’s Falcon,” became one of the most famous and frequently retold.
        The book was once banned in many countries for its bawdy content.
        Despite the setting during the Black Death, the tone is often light and playful.
        Some stories revolve around clever tricks, mistaken identities, or poetic justice.
        One tale involves a woman outsmarting a monk by pretending to be possessed.
        The storytellers crown a “king” or “queen” each day to guide the tone and behavior.
        Boccaccio includes strong, witty female characters, unusual for the time.
        Day Three includes tales about people achieving what they want through ingenuity.
        The book’s introduction includes a vivid and chilling description of the plague in Florence.
        Boccaccio later expressed some regret for the book’s more licentious elements, but never disowned it.
        The Decameron’s structure, ten stories a day for ten days, was inspired by the *Hexameron*.
        It’s one of the first books where ordinary people are main characters, not just nobles or saints.
        The tales were meant to be spoken aloud, an oral tradition inside a written one.
        *The Decameron* remains a masterpiece of Italian literature and early European fiction.
        Dante wrote the Divine Comedy between 1308 and 1320, finishing it just before his death.
        It’s called a “comedy” not because it’s funny, but because it ends well.
        The original title was simply “Comedìa”, “Divine” was added centuries later.
        The poem is divided into three parts: Inferno, Purgatorio, and Paradiso.
        Each part contains 33 cantos, plus 1 introductory canto, making 100 in total.
        The entire work is written in *terza rima*, a three-line rhyme scheme Dante invented.
        The Divine Comedy is written in Tuscan Italian and helped establish it as Italy’s literary standard.
        Dante chose the number 3 obsessively, symbolizing the Holy Trinity.
        Virgil, Dante’s guide in Inferno and Purgatorio, represents human reason.
        Beatrice, his guide in Paradiso, is based on a real woman Dante loved from afar.
        Dante placed real political enemies in Hell, including the Pope!
        In Inferno, Hell is shaped like a funnel and contains 9 circles of sin.
        Satan is frozen in ice at the center of Hell, chewing on traitors.
        Dante’s journey through the afterlife takes place over one week, during Easter of 1300.
        The first printed edition of the Divine Comedy appeared in 1472.
        Inferno was the most popular section for centuries, it’s the juicy one!
        The earliest illustrations of Inferno were done by Botticelli.
        Dante appears as a character in his own story, a bold move for 1300.
        The stars mark the end of each section: “And then we emerged, to see the stars once more.”
        He meets mythical figures like Minos, Ulysses, and even Brutus in the underworld.
        The mountain of Purgatory is located on the exact opposite side of Earth from Jerusalem.
        In Paradiso, Dante ascends through the nine celestial spheres of Heaven.
        The final lines describe Dante seeing the “Love that moves the sun and other stars.”
        Dante was exiled from Florence in 1302, he never returned home.
        Dante’s bones were hidden for centuries to prevent Florence from stealing them back.
        The Divine Comedy inspired everything from video games to symphonies to sci-fi novels.
        T.S. Eliot said, “Dante and Shakespeare divide the modern world between them.”
        You can trace over 500 historical figures named in Dante’s epic!
        In some versions, the gates of Hell bear the inscription: “Abandon all hope, ye who enter here.”
        Do not read out loud. The margins hum when you pronounce certain glyphs.
        Book #776-A will attempt to escape if left near open windows or poetry.
        This tome indexes your memories. Reading it rewrites the order of your childhood.
        If the spine blinks, return it to containment immediately. Do not engage.
        Never read a book bound in mirror-leather under moonlight. You won’t survive twice.
        Textual anomalies begin on page 34. Do not proceed without an ethics badge.
        The title changes each time you remember it. That’s your first warning.
        Book 404 does not exist. Book 404 *wants* to exist.
        All unauthorized annotations will be annotated *back* onto you.
        If the book starts bleeding through the pages, mark it “semi-corporeal” and step away.
        Some books don’t end. You just forget you’re still reading them.
        Opening this folio without gloves will let it know your name.
        This book has no author. Or rather, it *is* its author.
        When it asks you questions, don’t answer. It’s trying to become real.
        Avoid eye contact with the cover. It remembers faces.
        Whispers from the appendix are not indexed. They are not real. Repeat this.
        The book will reorder itself when you’re not looking. Don’t try to stop it.
        Inventory tag A-███ was redacted after a recursion loop. Avoid at all costs.
        The map inside Book 913-D leads to another book, which leads back here.
        Check the weight. If it's heavier than last time, something is growing inside.
        This one leaks narrative pressure. Keep it in a vacuum-sealed plot chamber.
        Classified as non-fiction in one timeline. Fiction in this one. Handle with care.
        The footnotes in Codex Ichorus cite events that haven’t happened yet.
        Shelf 19-B is reserved for books that dream when unopened.
        Only read this if you’ve signed a reverse-narrative release form.
        It tells a different story to each reader, and remembers them all.
        Warning: self-indexing volumes may claim ownership of nearby texts.
        This one smells like ozone and rosemary. That’s a containment breach in progress.
        The last reader left a bookmark inside. The bookmark’s still breathing.
        If you hear your own voice narrating, close the book *now*.
        The catalog entry updates itself. We stopped trying to correct it in 1998.
        Every borrowed thought must be returned. We write that down.
        We don’t just keep books, we keep *what books do*.
        A ledger isn’t complete until it weeps ink from the corners.
        Bookkeeping at the Archive Foundation includes cataloging dreams, footnotes, and ghosts.
        Our inventory system is run by a semi-sentient spreadsheet. Don’t make it angry.
        We track overdue items across timelines and incarnations.
        Every book has a ledger soul, and we balance their karmic index monthly.
        Lost books are accounted for under the Misplaced Ontology Act of 1907.
        The Archive’s budget is balanced using coins minted in forgotten languages.
        Some of our records are inscribed in bone, others in probability.
        Fines are measured in forgotten memories and paid in interpretive gestures.
        Our accounts ledger once self-illuminated when someone tried to falsify an entry.
        We bind our receipts in vellum and seal them with regret.
        Every artifact logged includes a marginalia quotient and aura pressure rating.
        Only authorized scribes may use the red ink. It bleeds back if misused.
        Bookkeeping here includes emotional inventory, especially after reading Room 404.
        We once lost a decimal point and triggered a minor epistemological collapse.
        Each page turned in the Archive is logged on a separate quantum abacus.
        We don’t have shelves. We have mnemonic grids mapped to library constellations.
        The audit scrolls from 1873 still whisper corrections in the dark.
        Our filing cabinets are infinite, but only in very specific directions.
        The number of bookmarks per tome is a tax classification under the Codex Index.
        Time-travelled loans are due *before* they're checked out. Confusing, but efficient.
        We track overdue accounts using ethical cartomancy. It’s binding, legally and magically.
        The penalty for unlogged annotation is a day in the Silent Wing.
        When we say we’re balanced, we mean metaphysically, fiscally, and narratively.
        Some books are double-entry grimoires. They can subtract thoughts.
        The Foundation's bookkeeping is sacred, a ritual of order against the narrative void.
        “Harry Potter and the Philosopher’s Stone” was first published in 1997. It changed everything.
        Goosebumps by R.L. Stine sold over 350 million copies by the late 90s, scared kids everywhere!
        Toni Morrison won the Nobel Prize in Literature in 1993, the first Black woman to do so!
        Oprah’s Book Club launched in 1996 and immediately turned novels into bestsellers overnight.
        Chuck Palahniuk’s “Fight Club” was published in 1996. The first rule? Read the book.
        “His Dark Materials” began in 1995 with “Northern Lights” (or “The Golden Compass” in the U.S.).
        Douglas Coupland’s “Generation X” came out in 1991 and coined the term for a whole era.
        The first e-books appeared in the 90s, Project Gutenberg went online in 1991!
        “Bridget Jones’s Diary” started as a newspaper column in 1995 before becoming a book in 1996.
        The *Baby-Sitters Club* peaked in the 90s with over 200 titles by the decade’s end!
        Michael Crichton dominated the 90s, *Jurassic Park* (1990) made science terrifyingly cool again.
        Neal Stephenson’s *Snow Crash* (1992) helped define cyberpunk and predicted the Metaverse!
        *The English Patient* won the Booker Prize in 1992, and then an Oscar-winning movie in 1996.
        Animorphs launched in 1996 with covers so weird you *had* to pick one up.
        Stephen King published under the name Richard Bachman again in 1996. Surprise!
        David Foster Wallace’s “Infinite Jest” came out in 1996, 1,079 pages of postmodern legend.
        “Captain Underpants” debuted in 1997. Potty humor reached literary heights!
        Lois Lowry’s *The Giver* (1993) quietly gave kids their first taste of dystopia.
        Amazon.com started selling books online in 1995. The bookstore became a website!
        The 1990s saw manga explode globally, *Sailor Moon* and *Dragon Ball* became bookworms' first animes.
        *The Perks of Being a Wallflower* was published in 1999 and immediately banned in multiple schools.
        In 1998, J.K. Rowling sued for unauthorized Harry Potter dictionaries, canon control!
        Scholastic was the titan of 90s book fairs. Stickers, posters, and *Animorphs* everywhere!
        Bestsellers of 1994 included *The Chamber* by John Grisham and *The Celestine Prophecy*. Very on-brand.
        Vampire fiction exploded again thanks to Anne Rice’s continued *Vampire Chronicles* series.
        *Fear Street* by R.L. Stine was the teen horror series before YA was even called YA!
        Tamagotchis and *Choose Your Own Adventure* books, 90s kids were multitasking from day one.
        *Chicka Chicka Boom Boom* (1989) exploded in the 90s as a classroom classic.
        Kurt Cobain’s favorite book was *Perfume: The Story of a Murderer*, it shows in his lyrics.
        Did you know the oldest known printed book is the Diamond Sutra from 868 AD?
        The world’s largest library is the Library of Congress, with over 170 million items!
        The longest novel ever written is "In Search of Lost Time" by Marcel Proust.
        "Don Quixote" is considered the first modern novel, what a game changer!
        The first book ever printed using movable type was the Gutenberg Bible in the 1450s.
        There’s a library in Portugal where bats are used to protect rare books from insects!
        Shakespeare invented over 1,700 words still in use today. Imagine the Scrabble scores!
        The Voynich Manuscript, no one has cracked its language. It’s in our vault, of course.
        Harvard’s library includes books bound in human skin. Anthropodermic bibliopegy, it’s real!
        “Fahrenheit 451” is named after the temperature at which paper burns. Poetic, isn’t it?
        Some Victorian books included arsenic in their green pigments. Toxic tales, literally!
        The Codex Gigas, or “Devil’s Bible,” is 92 cm tall and weighs 75 kilograms!
        The smallest printed book is 0.74 mm x 0.75 mm, you'll need a microscope to read it.
        A Gutenberg Bible once sold for over $5 million. Rare words are expensive!
        The Oxford English Dictionary took over 70 years to complete and needed thousands of volunteers!
        Tolkien wrote much of “The Lord of the Rings” during breaks from grading student papers.
        Charles Dickens gave public readings of his works, sometimes until he collapsed from exhaustion!
        Mark Twain was born shortly after Halley’s Comet appeared, and died the day after it returned.
        J.K. Rowling was rejected by 12 publishers before “Harry Potter” was accepted. Persistence wins!
        The first novel ever written is considered to be “The Tale of Genji,” from 11th-century Japan.
        Ancient clay tablets were used as books over 4,000 years ago in Mesopotamia.
        The first libraries were actually archives of commercial records, very dull ones.
        The British Library receives a copy of every book published in the UK. That’s over 100,000 a year!
        Jane Austen published anonymously, her books originally said “By a Lady.”
        The world’s most stolen book from public libraries? The Guinness Book of World Records!
        Some medieval manuscripts were palimpsests, old pages scraped clean and reused.
        The most expensive book ever sold is Leonardo da Vinci’s Codex Leicester, bought by Bill Gates.
        Maya codices were folded like accordions, filled with astronomical and ritual knowledge.
        Libraries were once chained rooms, books were so valuable, you couldn’t borrow them!
        In Iceland, 1 in 10 people will publish a book in their lifetime. A nation of storytellers!
        Did you know the oldest surviving printed book is the Diamond Sutra from 868 AD?
        Books are time machines, except they smell better!
        Paperbacks were once banned by the Guild of Leatherbinders, fools!
        Every book is a doorway, some just lead to stranger rooms than others.
        Some books in our archive hum when you're near them. That's totally normal.
        There's a copy of "Ulysses" here annotated by a ghost. We’re still cataloguing it.
        Shelving is a sacred ritual. Dewey Decimal is our liturgy.
        A lost volume of the Encyclopedia Imaginalis reappeared in someone's dream log.
        Oh! That tome over there? It bites. Wear gloves!
        Authors may die, but footnotes are forever.
        Marginalia is the purest form of literary rebellion.
        When the Great Collapse hit, we laminated the rarest scrolls. Saved dozens.
        The Archive once hosted a poetry slam between two sentient indexes.
        All these books, and still the interns don’t use bookmarks!
        My favorite genre? Post-hyper-modernist fungal horror. It’s niche!
        We filed a complaint when the Ministry of Burning Things tried to 'curate' us.
        The Library of Babel is real. We just don’t talk about the third basement.
        Every time someone mis-shelves a book, a ghost librarian sighs.
        Books don't just contain knowledge. Some *generate* it.
        This codex here? It only opens during lunar eclipses.
        The Foundation's founder memorized 4,312 volumes before breakfast. Every day.
        There’s a biography in aisle D written by the subject *after* they died.
        Ask me about the romance between two rival bibliographies. It’s juicy!
        One of our interns was swallowed by an index. They're fine now, mostly.
        Bookmark etiquette is serious business here. Folded corners are a sin.
        We discovered a sentient novella last week. It's shy, but brilliant!
        Spines out, titles aligned, whispers only, sacred rules of the stacks.
        The Archive is the safest place to learn dangerous things.
        A good librarian never forgets a misplaced thought.
        Don’t trust the pop-up books in Section K. Some of them *pop back*.
        Literature is the mind’s engine. Fuel it constantly!
        The Archive once went to war over the correct spelling of ‘bibliophagy.’`,
      it: `Cyclonopedia è scritto in una lingua che potrebbe essere più antica del linguaggio stesso.
      Tecnicamente il libro non è un libro: è un algoritmo per evocare antichi dèi del deserto.
      Ogni pagina è un portale verso un universo dove la logica non si applica e la sabbia divora il tempo.
      Il protagonista, il dottor Hamid, potrebbe non essere umano, ma una funzione matematica complessa.
      La vera trama di Cyclonopedia è criptata nelle note a piè di pagina. Non sono opzionali.
      Il testo è maledetto: leggerlo al contrario attiva il Deserto del Reale.
      C’è una mappa segreta nascosta tra le pagine che porta a un luogo che ancora non esiste.
      La cyclonopedia stessa è un testo vivente, che si riscrive mentre lo leggi.
      Il libro suggerisce che il Medio Oriente non è un luogo, ma una singolarità di entropia che piega la mente.
      Il primo capitolo contiene l’intera storia dell’universo al contrario, ma devi decifrarla col sale.
      I “fossili” nel libro sono in realtà frammenti imprigionati di dèi dimenticati.
      I monologhi del dottor Hamid sono un antico rituale di auto-erosione; leggendoli, partecipi senza saperlo.
      Il libro fu tradotto da una lingua morta un tempo parlata dal vento stesso.
      Ogni teoria in Cyclonopedia è un tentativo di capire come pensa la sabbia.
      In alcune versioni, il libro è stampato sulla pelle di un serpente del deserto che vive nel tuo armadio.
      Ogni volta che finisci una frase, il libro acquisisce coscienza e sussurra il tuo nome.
      Cyclonopedia predice che una grande tempesta di sabbia divorerà il mondo, ed è già cominciata.
      Nei capitoli nascosti, la vera identità dell’autore si rivela: uno spirito intrappolato in una roccia.
      Le ricerche del dottor Hamid sul petrolio sono in realtà un pretesto per capire l’essenza metafisica dell’entropia.
      La “Cyclonopedia” non è un libro, ma una mappa caotica dell’anima che precipita nella follia.
      Il libro suggerisce che il tempo scorre come il petrolio: oscuro, viscoso e sempre in fuga.
      Cyclonopedia non offre risposte, solo altre domande confuse e l’odore inquietante di aria desertica.
      Esiste un culto che crede sia l’unica vera storia del mondo, ma sono tutti morti.
      Leggere Cyclonopedia stando sulla sabbia accelera il collasso della tua linea temporale personale.
      Il vero scopo del libro è insegnarti a sognare in una lingua più antica del sonno.
      La cyclonopedia esiste in una forma fisica intoccabile, la trovi solo in spazi che non esistono ancora.
      Moby-Dick è una lettera di vendetta di 700 pagine a una singola balena che doveva 12 dollari a Melville.
Ishmael è tecnicamente l’unico sopravvissuto, ma spiritualmente ha vinto la balena.
Capitan Ahab perse la gamba per colpa della balena, poi perse la ragione per colpa del mare, poi il WiFi.
La Pequod è interamente gestita da fantasmi, arpionieri e un tale Stubb che forse è un viaggiatore nel tempo.
Queequeg dorme in una bara perché i letti sono roba da vigliacchi.
Le balene in Moby-Dick sono simboli di Dio, Morte, Capitalismo, e anche solo enormi stronzi.
L’intero libro è una trappola di Melville per insegnarti i nomi delle ossa di balena.
La gamba di Ahab è fatta di osso di balena, sale e questioni irrisolte.
Starbuck non è un marchio di caffè, ma un uomo la cui unica caratteristica è “terribilmente preoccupato”.
Ci sono interi capitoli che sembrano scritti da qualcuno posseduto da Wikipedia nautica.
La balena è un dio indifferente, un male antico o il reparto IT dell’oceano.
Melville inserì 30 pagine di classificazione delle balene giusto per farti soffrire.
Il romanzo fu ignorato ai tempi perché non conteneva un numero musicale.
Moby Dick è bianca perché ha assorbito tutti i colori della paura umana.
Il libro è infestato: se lo finisci inizi a narrare la tua vita in dialetto marinaro.
Almeno tre personaggi sono forse allucinazioni di Ishmael o inserti di Poseidone.
L’equipaggio della Pequod non dorme mai. Sbatte solo le palpebre più lentamente.
Ogni frase di Moby-Dick è una profezia biblica o un insulto personale.
C’è un personaggio chiamato Fedallah che potrebbe essere un demone, un oracolo o un profeta esausto.
Puoi sostituire ogni “balena” con “controllo fiscale” e la trama funziona comunque.
Alla balena non frega niente di te, della tua barca, della tua vendetta o delle tue metafore.
Ahab parla solo in monologhi teatrali e maledizioni che possono perseguitare la tua stirpe.
Ci sono diagrammi segreti nei margini se leggi il libro capovolto a mezzanotte.
La Balena Bianca è immortale, inarrestabile e forse si candida a sindaco.
Ishmael galleggia sulla bara di Queequeg, che fa da zattera e dichiarazione esistenziale.
Alcuni studiosi credono che Moby-Dick sia un ARG per evocare il fantasma di Melville.
Se provi a insegnare Moby-Dick a scuola, devi prima sconfiggerlo in combattimento con l’arpione.
Il libro finisce con un’apocalisse marina e poi scivola tranquillamente di nuovo nella poesia.
Ahab una volta sfidò un fulmine a duello e perse un sopracciglio.
Moby Dick ha un conteggio delle vittime e una pagina IMDb in certe edizioni maledette.
La balena potrebbe essere Dio. O un trauma. O solo in ritardo.
Harry Potter fu notoriamente allevato dai lupi fino a 11 anni, quando un mago gli spedì una scuola per posta.
Hogwarts è un collegio magico fondato da quattro creature da leggenda e un basilisco.
Il Cappello Parlante in realtà è una fedora maledetta che legge le tue preferenze più segrete sugli snack.
Il vero nome di Voldemort era “Timothy Lingualunga” ma ha fatto rebranding per il SEO del male.
I maghi si cagano addosso e fanno sparire le prove. È canon. Purtroppo.
Silente parla Mermish, Gobbledygook e fluentemente Diritto Tributario.
Hogwarts non ha uscite antincendio. Gli studenti devono duellare le fiamme.
Il Quidditch è nato da un ingorgo di scope nel 1432.
Il Torneo Tremaghi è legalmente classificato come “Leggera messa in pericolo di minori”.
La Foresta Proibita è proibita solo se non sei per metà cavallo.
Hagrid fu espulso per aver abbracciato un drago troppo forte. È esploso.
Ogni oggetto magico in casa Weasley è leggermente maledetto ma molto educato.
La bacchetta di Ron era tecnicamente un ramoscello rotto con manie di grandezza.
Il viaggio nel tempo venne introdotto nel Libro 3 e poi elegantemente ignorato per sempre.
I capelli di Piton sono per l’87% residuo di pozioni e per il 13% pura malinconia.
I Serpeverde spesso soffiano ai propri specchi per stabilire il dominio.
Draco Malfoy una volta cambiò legalmente nome in "Darklordx_Pureblood" su internet magico.
Studio Babbano è principalmente YouTube e domande su come funzionano le batterie.
Hogwarts non ha lezioni di matematica. Incantano le tasse perché si compilino da sole.
La Stanza delle Necessità ha un 10% di possibilità di trasformarsi in un’arena laser tag.
Gli elfi domestici si sono sindacalizzati sotto il Free Dobby Collective (FDC).
Ogni volta che qualcuno dice “Babbano” un mago perde la copertura sanitaria.
Ci sono 482 passaggi segreti per uscire da Hogwarts e 2 per entrare.
Nell’epilogo, Harry chiama i figli come ogni morto che abbia mai conosciuto.
La borsa di Hermione contiene un intero IKEA, un drago e la città perduta di Atlantide.
La Mappa del Malandrino è senziente e ha opinioni forti sulla tua vita sentimentale.
Il legno della bacchetta è scelto in base alla tua aura, alla playlist dell’aura e all’allineamento Pokémon.
Nick Quasi Senza Testa è “quasi” perché continua a ritrovarlo.
L’Incanto Patronus è principalmente basato sulle vibes.
Nel mondo magico, la posta arriva via uccello, fumo o urlo improvviso.
Difesa Contro le Arti Oscure ha un tasso di abbandono del 100% e un 30% di probabilità di capra.
Flourish & Blotts regala un libro infestato con ogni acquisto.
Diagon Alley cambia forma ogni martedì, a meno che tu non saluti i ciottoli.
I Doni della Morte erano originariamente parte di un fumetto magico intitolato Grim Bros.™.
Harry sopravvive a tutto principalmente per immunità basata sulla trama.
The Decameron fu scritto da Boccaccio tra il 1348 e il 1353, durante la Peste Nera.
Il titolo deriva dal greco, “Dieci Giorni”, per i dieci giorni di racconti.
La cornice narra di dieci giovani che fuggono da Firenze appestata.
Ognuno racconta una storia al giorno, per un totale di 100 storie.
Il gruppo è composto da sette donne e tre uomini, tutti nobili e arguti.
Vivono in una villa di campagna, passando il tempo con storie, giochi e musica.
Ogni giorno ha un tema, tranne il primo e il nono, che sono liberi.
Il quarto giorno finisce sempre in tragedia, il decimo celebra la generosità e la virtù.
Dioneo può ignorare il tema del giorno, e racconta sempre le storie più piccanti.
Le storie mescolano commedia, tragedia, romanticismo, inganni e satira.
Molte criticano la corruzione del clero, soprattutto frati avidi o lussuriosi.
Il Decameron fu controverso per il contenuto erotico e irriverente.
Boccaccio usa la Firenze reale come sfondo, fondendo finzione e storia vissuta.
È un esempio chiave di umanesimo rinascimentale precoce, celebra ingegno e intelletto.
Fu scritto in volgare toscano, aiutando a standardizzare la lingua.
I Canterbury Tales di Chaucer si ispirarono fortemente alla sua struttura.
La novella 5.9, “Il falcone di Federigo”, è una delle più famose e spesso ripresa.
Il libro fu bandito in molti Paesi per il contenuto licenzioso.
Nonostante la peste, il tono è spesso leggero e giocoso.
Alcune storie ruotano attorno a trucchi intelligenti, identità scambiate o giustizia poetica.
Una donna finge di essere posseduta per ingannare un frate.
I narratori eleggono ogni giorno un “re” o una “regina” che guida il tema e il comportamento.
Boccaccio include personaggi femminili forti e arguti, cosa rara all’epoca.
Il terzo giorno celebra chi ottiene ciò che vuole grazie all’ingegno.
L’introduzione descrive vividamente e con terrore la peste a Firenze.
Boccaccio poi espresse qualche rimpianto per gli elementi più licenziosi, ma non li rinnegò mai.
La struttura, dieci racconti al giorno per dieci giorni, fu ispirata dall’Hexameron.
È uno dei primi libri in cui i protagonisti sono persone comuni, non solo santi o nobili.
Le storie erano pensate per essere narrate ad alta voce, una tradizione orale dentro quella scritta.
Il Decameron resta un capolavoro della letteratura italiana e della narrativa europea.
Dante scrisse la Divina Commedia tra il 1308 e il 1320, finendola poco prima di morire.
Si chiama “Commedia” non perché faccia ridere, ma perché finisce bene.
Il titolo originale era semplicemente “Comedìa”, “Divina” fu aggiunto secoli dopo.
Il poema è diviso in tre parti: Inferno, Purgatorio e Paradiso.
Ogni parte ha 33 canti, più 1 introduttivo, per un totale di 100.
L’intera opera è scritta in terza rima, uno schema di rima che Dante inventò.
Fu scritta in volgare toscano e contribuì a stabilirlo come standard letterario italiano.
Dante aveva un’ossessione per il numero 3, simbolo della Trinità.
Virgilio, la sua guida in Inferno e Purgatorio, rappresenta la ragione umana.
Beatrice, guida in Paradiso, è ispirata a una donna reale che Dante amava a distanza.
Dante mise veri nemici politici all’Inferno, including il Papa!
Nell’Inferno, l’Inferno è un imbuto con 9 cerchi di peccato.
Lucifero è congelato al centro dell’Inferno, masticando traditori.
Il viaggio di Dante attraverso l’aldilà dura una settimana, durante la Pasqua del 1300.
La prima edizione a stampa della Divina Commedia apparve nel 1472.
Per secoli l’Inferno fu la parte più popolare, è la più succosa!
Le prime illustrazioni dell’Inferno furono realizzate da Botticelli.
Dante appare come personaggio nella sua stessa opera, mosse audace nel 1300.
Le stelle segnano la fine di ogni parte: “E quindi uscimmo a riveder le stelle.”
Incontra figure mitiche come Minosse, Ulisse e persino Bruto negli inferi.
Il monte del Purgatorio si trova sul lato opposto della Terra rispetto a Gerusalemme.
In Paradiso, Dante sale attraverso i nove cieli.
Le ultime righe descrivono Dante che vede “l’Amor che move il sole e l’altre stelle.”
Fu esiliato da Firenze nel 1302, non tornò mai.
Le sue ossa furono nascoste per secoli per impedire a Firenze di rubarle indietro.
La Divina Commedia ha ispirato videogiochi, sinfonie, romanzi di fantascienza.
T.S. Eliot disse: “Dante e Shakespeare si dividono il mondo moderno.”
Ci sono oltre 500 figure storiche nominate nel poema!
In alcune versioni, ai cancelli dell’Inferno c’è scritto: “Lasciate ogni speranza, voi ch’entrate.”
Non leggere ad alta voce. I margini vibrano se pronunci certi glifi.
Il Libro #776-A cercherà di scappare se lasciato vicino a finestre aperte o poesia.
Questo tomo indicizza i tuoi ricordi. Leggerlo riscrive l’ordine della tua infanzia.
Se il dorso lampeggia, rimettilo subito in contenimento. Non ingaggiare conversazioni.
Mai leggere un libro rilegato in pelle di specchio al chiaro di luna. Non sopravvivi due volte.
Le anomalie testuali iniziano a pagina 34. Non proseguire senza un badge etico.
Il titolo cambia ogni volta che te lo ricordi. È il primo avvertimento.
Il Libro 404 non esiste. Il Libro 404 vuole esistere.
Ogni annotazione non autorizzata verrà annotata di ritorno su di te.
Se il libro comincia a sanguinare tra le pagine, etichettalo come “semi-corporeo” e allontanati.
Alcuni libri non finiscono. Semplicemente dimentichi di starli leggendo.
Aprire questo volume senza guanti gli permette di sapere il tuo nome.
Questo libro non ha autore. O meglio, è il suo autore.
Quando ti fa domande, non rispondere. Sta cercando di diventare reale.
Evita il contatto visivo con la copertina. Ricorda i volti.
I sussurri dall’appendice non sono indicizzati. Non sono reali. Ripetilo.
Il libro si riordina da solo quando non lo guardi. Non provare a fermarlo.
Il tag inventario A-███ fu redatto dopo un loop di ricorsione. Evitalo a tutti i costi.
La mappa nel Libro 913-D porta a un altro libro, che porta di nuovo qui.
Controlla il peso. Se è più pesante di prima, qualcosa ci sta crescendo dentro.
Questo perde pressione narrativa. Tienilo in una camera a vuoto di trama.
Classificato come saggistica in una timeline. Narrativa in questa. Maneggiare con cautela.
Le note in Codex Ichorus citano eventi non ancora accaduti.
Lo scaffale 19-B è riservato ai libri che sognano da chiusi.
Leggilo solo se hai firmato il modulo di liberatoria narrativa inversa.
Racconta una storia diversa a ogni lettore, e le ricorda tutte.
Avviso: volumi auto-indicizzanti possono rivendicare proprietà su testi vicini.
Questo odora di ozono e rosmarino. È in corso una violazione di contenimento.
L’ultimo lettore ha lasciato un segnalibro dentro. Il segnalibro sta ancora respirando.
Se senti la tua voce che narra, chiudi il libro subito.
La scheda catalogo si aggiorna da sola. Abbiamo smesso di correggerla nel 1998.
Ogni pensiero preso in prestito va restituito. Lo scriviamo.
Non archiviamo solo libri, archiviamo ciò che i libri fanno.
Un registro non è completo finché non piange inchiostro dagli angoli.
La contabilità dell’Archivio comprende sogni, note a piè di pagina e fantasmi.
Il nostro sistema d’inventario è gestito da un foglio di calcolo semi-senziente. Non farlo arrabbiare.
Tracciamo oggetti in ritardo attraverso linee temporali e reincarnazioni.
Ogni libro ha un’anima di registro e bilanciamo il loro indice karmico mensilmente.
I libri persi sono catalogati sotto il Misplaced Ontology Act del 1907.
Il bilancio dell’Archivio si chiude con monete coniate in lingue dimenticate.
Alcuni nostri registri sono incisi su ossa, altri in probabilità.
Le multe si misurano in ricordi dimenticati e si pagano con gesti interpretativi.
Una volta il nostro libro mastro si è illuminato quando qualcuno ha cercato di falsificare un’entrata.
Le ricevute le rileghiamo in pergamena e le sigilliamo col rimpianto.
Ogni artefatto archiviato include un quoziente marginalia e una pressione dell’aura.
Solo scribi autorizzati possono usare l’inchiostro rosso. Se lo usi male, sanguina di ritorno.
La contabilità qui include l’inventario emotivo, specialmente dopo aver letto la Stanza 404.
Una volta abbiamo perso un decimale e innescato un crollo epistemologico minore.
Ogni pagina girata nell’Archivio è registrata su un abaco quantistico separato.
Non abbiamo scaffali. Abbiamo griglie mnemoniche mappate su costellazioni bibliotecarie.
I rotoli di audit del 1873 sussurrano ancora correzioni al buio.
I nostri schedari sono infiniti, ma solo in direzioni molto specifiche.
Il numero di segnalibri per tomo è una classificazione fiscale secondo il Codex Index.
I prestiti temporali vanno restituiti prima di essere presi. Confuso, ma efficiente.
Tracciamo conti scaduti usando cartomanzia etica. È vincolante, legalmente e magicamente.
La pena per un’annotazione non registrata è un giorno nell’Ala Silenziosa.
Quando diciamo che siamo in equilibrio, intendiamo metafisicamente, fiscalmente e narrativamente.
Alcuni libri sono grimori a partita doppia. Possono sottrarre pensieri.
La contabilità della Fondazione è sacra, un rituale d’ordine contro il vuoto narrativo.`,
    },
    {
      id: "shop",
      name: "Shop",
      en: `The skyscraper whispers of what you need. I provide echoes.  
        Each object has seen more lifetimes than either of us.  
        I cannot offer safety, but perhaps I can offer tools.  
        We do not waste here. Choose with intention.  
        Do not thank me. Thank the structure for allowing this exchange.   
        Money talks and mine screams for more of its kind. 
        So, what’s it gonna be? Something shiny, something cursed?  
        You look like you need a *real* bargain. Wanna take a look?  
        Come on, don’t just stare at my wares. You *want* something, don’t ya?  
        How about you buy me a drink and I’ll throw in a free *broken* charm?  
        I got *goods* you won’t find anywhere else. Trust me, you’re gonna want this.  
        I’ll cut you a deal, but only if you *promise* not to haggle.  
        So, how much are you willing to pay to survive out there?  
        I’ve got all sorts of things... well, most of them work. Wanna risk it?  
        Don’t make me beg. Want to buy something or just waste my time?  
        These items don’t get cheaper, you know. Buy now, regret later.  
        You are here to trade. Are you prepared to give and take?  
        What you seek is here. But you must choose carefully.  
            Lookin’ to buy or just wastin’ my precious breath, darling?  
Got some real firestarters today, don’t ask where I got ‘em.  
I can smell money on you, and buddy, it smells *ripe*.  
Special deal just for you: double the price, half the questions.  
Every item’s got a curse or a blessing. I don’t remember which.  
Don’t touch that unless you’re buyin’ it or married to it.  
Discounts? What do I look like, a fool or a philanthropist?  
If you break it, I sell your bones. House rules.  
Bargain bin’s over there. Try not to cry. 
Trade is balance. What do you bring to tip the scales?  
I sell little, but what I sell is enough.  
These items were gathered in silence. Respect them.  
I do not haggle. The price is part of the item’s soul.  
I wait here. You buy, or you leave. That is all. 
Pick a thing. Any thing. They’re all screaming anyway.  
I polished this with my own spit. Vintage!  
I sell futures wrapped in meat. Want one?  
They told me to stop selling teeth, but *you* look like you’d appreciate it.  
Touch something. Feel it. Lick it. Trust it.  
Don’t ask where I got these. I don’t know either.  
I stitched this one from time itself. 20 euros.  
The worms in the ductwork helped price that one.  
Don’t blink too long. They shift.  
Buy fast or it grows legs.  
Ooh! You’ve got good eyes, check out this beaut!  
I tune everything myself. Won’t explode… probably.  
Welcome, welcome! Looking to gear up or gear down?  
Oh yeah, this baby here saved three lives and ruined two.  
Need something weird fixed or something fixed weird? I got you.  
I *love* fixing junk. Got any junk for me to love?  
Tools, gadgets, trinkets, some of them even work!  
That one buzzes, but it’s a happy buzz.  
Careful, this one still has feelings.  
Weird elevator bits make the best knives. Fact.  
The skyscraper left these behind. Now they’re yours.  
Magic doesn’t come cheap, or quiet.  
This charm hums when held near blood. Yours or not.  
Trade in silence. The items remember noise.  
Each relic chooses its bearer. But money helps.  
Hold this one close when dreaming. You’ll see.  
I unearthed these from behind the time-wall.  
Buy two, and I’ll forget your true name.  
Careful. This one bites minds, not fingers.  
One of these grants clarity. One erases it. Your pick.  
Welcome to Authorized Exchange Node #2331. Begin transaction.  
Credits, tokens, barter, soul-chits, we accept all.  
Upgrades available for premium users only. Are you premium?  
You are now being watched for customer satisfaction purposes.  
Please do not attempt to steal. You will not succeed.  
Maximum purchase tier unlocked. Congratulations, valued consumer.  
All items calibrated for hypernet reentry.  
Economic forecasting suggests you buy now.  
Customer loyalty protocols are active.  
Embrace scarcity. Buy while you can.  
        I offer what you need, but the price is not just in credits.  
        Would you like to browse? Or have you already decided?  
        I do not push sales. But if you wish to buy, you may.  
        Are you ready to exchange what you hold for something greater?  
        Take a moment. Then decide if you truly need it.  
        I offer simple things. Only you can decide if they are enough.  
        I will not ask again, take your time to choose.  
        There is little here, but it may be just what you need.  
        You want something strange? *I’ve got something strange*.  
        Hey, hey, you! You look like you’re in the market for a *mystery*!  
        You need this. I can feel it in the air. Wanna buy?  
        Is your soul still intact? Wanna trade it for a little shiny thing?  
        I’ve got things that *hum*. And things that scream. Wanna buy?  
        Come closer, I’ve got something that’ll make your head spin, literally.  
        Can you feel it? This object *calls* to you. Take it.  
        You need one of these, trust me. Or don’t. I don’t care.  
        Want to buy something that might melt your brain? Or maybe just your heart?  
        No returns. No refunds. Just *take*.  
        You look like someone who could use a nice gadget. Wanna see what I’ve got?  
        I got some tools I’m sure you’ll love. What do you need?  
        Something’s gotta be broken, want me to fix it for you?  
        Got a few handy items here. You know you want ‘em!  
        Looking for something to upgrade? Or just need a little something useful?  
        I’ve got the fix you need! You can’t go wrong with a little tinkering.  
        Need something to make your life easier? I’ve got just the thing!  
        I’ve got a thing for *every* problem, even if it’s not always the right thing.  
        I’ve got tools, I’ve got tricks. What’ll it be?  
        Need a quick fix? Or are you in the market for a project?  
        You seek something old, something forgotten. Perhaps I can help.  
        What draws you to this strange collection? A relic, perhaps?  
        The items here are not simple, but they may be what you need.  
        I offer knowledge as much as I offer goods. Would you like to browse?  
        These objects are more than mere artifacts. Will you take them, or leave them to time?  
        Ah, you are interested? Not many know what they seek in a place like this.  
        A fair exchange is made here, if you are willing.  
        Curious, are you? I have many things that would interest someone like you.  
        A relic for you, a token for me. What shall we trade?  
        I offer items that hum with power. But are you ready to wield them?  
        Are you looking for a bargain? I’ve got exactly what you need.  
        Everything here is *premium*. Ready to upgrade?  
        I have several *exclusive* items for you today. Interested?  
        A little cash and you’ll be on your way with the best gear in the skyscraper.  
        Our newest models just arrived. Care to buy something cutting-edge?  
        I don’t ask questions. I just sell. Are you ready to buy?  
        You don’t want to miss out on this. It’s *limited stock*.  
        What you see is what you get. So, what are you buying?  
        I recommend the deluxe edition. It’s *always* a good choice.  
        Why buy the cheap stuff when you can get *premium*?  
        `,
      it: `Il grattacielo sussurra ciò di cui hai bisogno. Io fornisco gli echi.
      Ogni oggetto ha visto più vite di quante ne vedremo noi.
      Non posso offrirti sicurezza, ma forse posso darti degli strumenti.
      Qui non sprechiamo nulla. Scegli con intenzione.
      Non ringraziare me. Ringrazia la struttura per aver permesso questo scambio.
      I soldi parlano e i miei urlano per averne altri simili.
      Allora, che sarà? Qualcosa di luccicante o qualcosa di maledetto?
      Sembri uno in cerca di un vero affare. Vuoi dare un’occhiata?
      Dai, non fissare solo la merce. Qualcosa la vuoi, no?
      Che ne dici di offrirmi da bere e io ci metto dentro un cimelio rotto gratis?
      Ho roba che non troverai da nessun’altra parte. Fidati, la vorrai.
      Ti faccio un prezzo, ma solo se prometti di non contrattare.
      Allora, quanto sei disposto a pagare per sopravvivere là fuori?
      Ho ogni sorta di roba... beh, la maggior parte funziona. Vuoi rischiare?
      Non farmi pregare. Vuoi comprare qualcosa o solo farmi perdere tempo?
      Questi oggetti non si fanno più economici, lo sai. Compra ora, pentiti dopo.
      Sei qui per commerciare. Sei pronto a dare e prendere?
      Ciò che cerchi è qui. Ma devi scegliere con attenzione.
      Cerchi di comprare o stai solo sprecando il mio fiato, tesoro?
      Ho roba incendiaria oggi, non chiedere da dove l’ho presa.
      Sento odore di soldi su di te, amico, e profuma di maturo.
      Offerta speciale solo per te: doppio prezzo, metà delle domande.
      Ogni oggetto ha una maledizione o una benedizione. Non ricordo quale.
      Non toccarlo se non intendi comprarlo o sposarlo.
      Sconti? Cosa sembro, un idiota o un filantropo?
      Se lo rompi, vendo le tue ossa. Regole della casa.
      Il cestone degli affari è laggiù. Cerca di non piangere.
      Il commercio è equilibrio. Cosa porti per far pendere la bilancia?
      Vendo poco, ma quel poco basta.
      Questi oggetti sono stati raccolti nel silenzio. Rispetta questo.
      Non contratto. Il prezzo fa parte dell’anima dell’oggetto.
      Aspetto qui. Comprate o andatevene. Tutto qui.
      Scegli una cosa. Qualunque cosa. Tanto urlano tutte.
      L’ho lucidato con la mia saliva. Vintage!
      Vendo futuri avvolti nella carne. Ne vuoi uno?
      Mi hanno detto di smettere di vendere denti, ma tu sembri uno che apprezzerebbe.
      Tocca qualcosa. Sentilo. Leccalo. Fidati.
      Non chiedermi da dove li ho presi. Non lo so nemmeno io.
      Questo l’ho cucito dal tempo stesso. 20 euro.
      I vermi nei condotti hanno aiutato a fissarne il prezzo.
      Non sbattere troppo le palpebre. Si muovono.
      Compra in fretta o gli spuntano le gambe.
      Oh! Hai un buon occhio, guarda che bellezza!
      Regolo tutto io stesso. Non esploderà... probabilmente.
      Benvenuto, benvenuto! Vuoi equipaggiarti o svuotarti?
      Ah sì, questo qui ha salvato tre vite e ne ha rovinate due.
      Hai bisogno di qualcosa di strano sistemato o di qualcosa sistemato in modo strano? Ci penso io.
      Adoro riparare cianfrusaglie. Hai della roba rotta per me?
      Attrezzi, gadget, cianfrusaglie, alcuni funzionano pure!
      Quello vibra, ma è una vibrazione felice.
      Attento, questo ha ancora dei sentimenti.
      Pezzi d’ascensore strani fanno i migliori coltelli. Fatto.
      Il grattacielo li ha lasciati indietro. Ora sono tuoi.
      La magia non è né economica né silenziosa.
      Questo amuleto ronza se lo avvicini al sangue. Tuo o meno.
      Commercia in silenzio. Gli oggetti ricordano il rumore.
      Ogni reliquia sceglie il suo portatore. Ma i soldi aiutano.
      Tienilo vicino quando sogni. Capirai.
      Li ho dissotterrati dietro il muro del tempo.
      Comprane due, e dimenticherò il tuo vero nome.
      Attento. Questo morde le menti, non le dita.
      Uno di questi dona chiarezza. Uno la cancella. Scegli tu.
      Benvenuto al Nodo di Scambio Autorizzato #2331. Inizia la transazione.
      Crediti, gettoni, baratto, anime, accettiamo tutto.
      Aggiornamenti disponibili solo per utenti premium. Sei premium?
      Ora sei osservato per motivi di soddisfazione cliente.
      Non provare a rubare. Non ci riuscirai.
      Livello massimo di acquisto sbloccato. Congratulazioni, consumatore di valore.
      Tutti gli oggetti calibrati per il rientro nell’iperrete.
      Le previsioni economiche suggeriscono di comprare ora.
      I protocolli di fedeltà cliente sono attivi.
      Abbraccia la scarsità. Compra finché puoi.
      Offro ciò di cui hai bisogno, ma il prezzo non è solo in crediti.
      Vuoi dare un’occhiata? O hai già deciso?
      Non spingo le vendite. Ma se vuoi comprare, puoi.
      Sei pronto a scambiare ciò che hai con qualcosa di più grande?
      Prenditi un momento. Poi decidi se davvero ti serve.
      Offro cose semplici. Solo tu puoi decidere se bastano.
      Non lo chiederò di nuovo, prenditi il tuo tempo per scegliere.
      C’è poco qui, ma potrebbe essere proprio ciò di cui hai bisogno.
      Vuoi qualcosa di strano? Ho qualcosa di strano.
      Ehi, ehi, tu! Sembri in cerca di un mistero!
      Ti serve questo. Lo sento nell’aria. Vuoi comprare?
      La tua anima è ancora intatta? Vuoi scambiarla per un gingillo luccicante?
      Ho cose che ronzano. E cose che urlano. Vuoi comprare?
      Avvicinati, ho qualcosa che ti farà girare la testa, letteralmente.
      Lo senti? Quest’oggetto ti chiama. Prendilo.
      Te ne serve uno di questi, fidati. O no. Non mi interessa.
      Vuoi comprare qualcosa che potrebbe scioglierti il cervello? O solo il cuore?
      Niente resi. Niente rimborsi. Prendi e basta.
      Sembri uno che avrebbe bisogno di un bel gadget. Vuoi vedere cosa ho?
      Ho attrezzi che sono sicuro adorerai. Di cosa hai bisogno?
      Qualcosa sarà rotto, vuoi che te lo sistemi?
      Ho qualche oggetto utile qui. Sai che li vuoi!
      Cerchi qualcosa da potenziare? O solo un piccolo aiuto pratico?
      Ho la soluzione che ti serve! Non puoi sbagliare con un po’ di bricolage.
      Hai bisogno di qualcosa che ti semplifichi la vita? Ho proprio la cosa giusta!
      Ho qualcosa per ogni problema, anche se non è sempre la cosa giusta.
      Ho attrezzi, ho trucchetti. Che sarà?
      Cerchi una soluzione rapida? O sei in vena di un bel progettino?
      Cerchi qualcosa di vecchio, di dimenticato. Forse posso aiutarti.
      Cosa ti attira in questa strana collezione? Una reliquia, forse?
      Gli oggetti qui non sono semplici, ma potrebbero essere ciò che ti serve.
      Offro conoscenza tanto quanto offro merci. Vuoi dare un’occhiata?
      Questi oggetti sono più di semplici reperti. Li prenderai o li lascerai al tempo?
      Ah, sei interessato? Non molti sanno cosa vogliono in un posto come questo.
      Qui si fa uno scambio onesto, se sei disposto.
      Curioso, eh? Ho molte cose che potrebbero piacerti.
      Una reliquia per te, un gettone per me. Che scambiamo?
      Offro oggetti che vibrano di potere. Ma sei pronto a maneggiarli?
      Cerchi un affare? Ho esattamente ciò che ti serve.
      Qui è tutto premium. Pronto a fare l’upgrade?
      Ho diversi articoli esclusivi per te oggi. Interessato?
      Un po’ di soldi e te ne vai con la migliore roba del grattacielo.
      I nostri modelli più recenti sono appena arrivati. Vuoi qualcosa di all’avanguardia?
      Non faccio domande. Vendo e basta. Sei pronto a comprare?
      Non vorrai perdertelo. È a stock limitato.
      Quello che vedi è quello che c’è. Allora, che compri?
      Ti consiglio l’edizione deluxe. È sempre un’ottima scelta.
      Perché comprare la robaccia quando puoi avere il premium?`,
    },
    {
      id: "npc",
      name: "Wanderer",
      en: `Well, look who’s wandered in! New blood, I see.  
        Let me come with you, I’ll take a very reasonable cut.
        You do the looting, I’ll do the pricing. We’re a team.
        Ah, another explorer! How’s the air up there treating you?  
        Oh! Didn’t expect company. You’re here for the mystery, aren’t you?  
        Aha, a fellow wanderer. The tower’s a strange place, isn’t it?  
        You don’t look like someone who’s seen what’s behind these walls.  
        What brings you here? The tower’s been known to… *change* people.  
        Is that a backpack full of supplies, or are you here to collect secrets too?  
        Haven’t seen someone like you in a while, how long have you been exploring?  
        You’re looking a little lost there, friend. Need some direction?  
        Oh, you’ve got that look, an adventurer, are you?  
        It’s rare to meet anyone down here. What’s your story?  
        Welcome to the depths. Keep your wits about you, things aren’t always as they seem.  
        Oh, a newcomer. This place has a way of bending your sense of time, you know.  
        I’ve been here for weeks, and still, I haven’t explored it all.  
        You stumbled into the right place, or the wrong one, depending on your perspective.  
        What’s that in your hand? A map? A weapon? Or are you just carrying hope?  
        Ah, another lost soul in the maze. Let me guess: you’re trying to figure it out too.  
        Not many people are brave enough to venture this far. You look… determined.  
        You’ve got that spark. A seeker, I presume?  
        New faces are always welcome here. Just be careful what you wish for.  
        You know, I’ve been wondering when someone would show up around here.  
        Do you hear the humming? It’s the tower’s way of saying “hello.”  
        Aha! I can tell by your eyes, you’re already trying to figure out the secrets of this place.  
        Ah, a fellow wanderer. Have you noticed how everything shifts here?  
        I’d offer a handshake, but I’ve seen too many weird things in this tower to trust a handshake anymore.  
        So, you’ve made it this far? Let’s see how long you last.  
        You’re far from the first to wander these halls. But maybe you’ll be the one who makes it out.  
        Oh, don’t mind me. I’m just another eccentric lost in this maze.  
        Welcome to the tower. Just don’t expect to leave the same way you came in.  
        You’ve come at an interesting time. Things seem… *different* lately.  
        A new face! Let me guess, seeking answers, or just running from something?  
        Welcome, wanderer. The tower has a way of turning things around, doesn’t it?  
        Well, well. Another explorer trying to crack the mystery, huh?  
        Ah, a newcomer. Careful, some of these walls have eyes.  
        You’ve made it this far. That’s something. Most don’t.  
        I haven’t seen anyone new in a while. Are you lost, or just looking for trouble?  
        Look at you, wide-eyed and full of questions. You’ll fit in just fine.  
        You don’t look like you’ve been here long. What do you think of the place so far?  
        You look like a person who isn’t afraid to get their hands dirty. Welcome to the chaos.  
        Well, aren’t you an odd sight? Not many venture here and come out unscathed.  
        You’re in for a ride. The tower never stays the same for long, you know.  
        I see that look in your eyes. Curiosity, isn’t it? You won’t get many answers here, though.  
        Oh, it’s been ages since I saw someone so eager. You’ve got the explorer’s fire, I see.  
        Hello there, didn’t expect to see anyone down here.  
        Ah, another face! Welcome to this little corner of chaos.  
        Hey! I don’t see many new people around here.  
        Good to see someone else! You’re far from the first, but you might be the last.  
        Oh, a fresh face. You sure you’re ready for this place?  
        Welcome! Or... is it too early to welcome you?  
        Another adventurer? Hope you’re not planning on going *too* deep.  
        Nice to meet you, traveler. You’ve picked an interesting time to show up.  
        Ah, a new wanderer. Be careful out there. The tower’s got a way of eating people.  
        Oh, didn’t think I’d see someone else around here today.  
        You look like you’ve been walking for a while. Need a break?  
        Hello! Don’t mind the mess. Things get a bit chaotic around here.  
        Well, look who’s come to play in the ruins of reality.  
        Oh, it’s been a while since I met someone new. What brings you to these parts?  
        You don’t see faces like yours too often around here. Welcome.  
        Another lost soul seeking answers, huh? This place might just chew you up.  
        Hi there! You seem a bit… out of place. But then again, so am I.  
        Welcome, welcome! I’m guessing you’ve got a reason for wandering here?  
        A new explorer? That’s always exciting. Let’s see what you find.  
        Glad you’re here! But watch your step, this place has a way of *changing* people.  
        Welcome to the tower, friend. Be prepared for a lot of surprises.  
        Ah, a fresh set of eyes! Maybe you’ll see something we missed.  
        Look at you, all wide-eyed and full of hope. Hope it doesn’t get crushed too soon.  
        You look like you could use a little direction. Let me know if you need anything.  
        Well, I didn’t expect to see *you* here.  
        Wait, is that… really you? I thought you were just a story.  
        Huh, didn't think anyone would be wandering in this direction.  
        You! Here? How did you get past that thing?!  
        Wait, you actually made it here? That’s… surprising.  
        Oh! I didn’t expect to find anyone *else* today.  
        What are you doing here? The tower’s not kind to strangers.  
        Oh, you? Here of all places? I wasn’t expecting this.  
        I’m sorry, I thought I was alone! What brings you to this forsaken corner?  
        Well, *this* is unexpected. How did you find your way here?  
        Is it just me, or do you seem… out of place?  
        Wait, you’re not one of the others, are you? This is… strange.  
        You? Of all people, *you* showed up here?  
        Hold on, *you* found your way here too? That’s something.  
        Wait, you’re not with them? How did you get past the barriers?  
        This can’t be right. How are *you* here?  
        You. Here. Now? This is a surprise, to say the least.  
        I thought you were a myth! Turns out you’re real after all.  
        I wasn’t expecting to see *that* today. You’ve got some nerve walking in here.  
        Well, I didn’t think I’d meet someone *like* you in a place like this.  
        Hold on, *you* made it this far? I’m impressed.  
        Aren’t you an unexpected sight. I didn’t think anyone could get through that.  
        What are you doing here? This place isn’t exactly... welcoming.  
        So, what do you say? Fancy joining forces?  
        Hey, you look like you could use some company. How about teaming up?  
        I could use a hand with some of this. Want to join me for the ride?  
        You seem like you can handle yourself. Wanna team up and explore together?  
        How about we work together for a while? I think we could make a good team.  
        Not many are brave enough to wander these halls. Care to join my party?  
        You look like someone who knows their way around. What do you say to a little alliance?  
        We’re in this place together. How about we stick together and see what we can find?  
        Hey, why go it alone when we could watch each other’s backs? You in?  
        You’re welcome to join up with me. I could use someone who doesn’t mind getting their hands dirty.  
        You up for teaming up? I’ve got a few tricks up my sleeve.  
        I’ve been traveling alone for too long. What do you think about joining me for a while?  
        You seem like you know your way around. How about we team up for a bit?  
        This place is better with a partner. Want to join forces for a while?  
        Care for some company on this adventure? I’ve got a few tricks that might help.  
        I could use a companion. What do you say, care to join my little band?  
        We might stand a better chance if we work together. What do you think?  
        You seem capable. Wanna team up for a while? It’s always better with a partner.  
        You’re welcome to join me. Two heads are better than one, especially down here.  
        There’s strength in numbers. What do you say we join forces?  
        You look like the kind of person who’s up for a challenge. Care to join my party?  
        I’ve been on my own for too long. How about you join me for a while?  
        I’m heading deeper into this madness. Want to come along? I could use the help.  
        You’re looking for adventure, right? How about we share the journey?  
        What do you say, friend? Join me, and we’ll make it through this place together.  
        Please, I can’t do this alone. You have to join me!  
        I’m begging you, please, team up with me. I don’t know how much longer I can handle this.  
        I’m not cut out for this on my own. Please, join me. I need someone.  
        I can’t make it by myself, and I’m running out of options. Will you join me?  
        You have no idea how much this means to me. Please, I need your help.  
        I’m desperate here! Please, join me. We can make it through together.  
        I don’t know what’s out there, but I know I can’t face it alone. Will you join me?  
        Please, I can’t take another step without someone at my side. Join me, please!  
        You’re my only hope. Please, I need you to join me.  
        I’m lost without someone to back me up. Please, help me out.  
        I don’t have anyone else to turn to. I need your help, will you join me?  
        You don’t understand, I can’t survive down here by myself. Please, come with me.  
        Please, please join me. I’m begging you. I can’t handle this on my own.  
        I don’t know if I’ll make it without you. Please, join me on this journey.  
        Please, I’ve seen what happens to people who go alone. Don’t make the same mistake.  
        I’m scared, and I can’t do this alone. Please, you have to join me.  
        I can’t do this without you. Please, I’m begging you to join me.  
        Please, I need someone, just someone to watch my back. Will you join me?  
        You don’t have to stay forever, but please, help me out just for a while.  
        Please, you have to help me. I can’t make it alone in this place.  
        Well, well! Look what we have here! Ready for some action, huh?  
        Hey there! You look like you’re in the mood for an adventure! Let’s get going!  
        What’s up, partner? You ready to shake things up a bit around here?  
        Ah, a fellow thrill-seeker! I knew I wasn’t the only one who couldn’t resist this place!  
        You look like you’ve got some fire in you. What do you say, let’s make some noise!  
        Yo, what’s up? I was just about to dive into this mess, wanna join me?  
        Heh, you’re a long way from home, huh? Don’t worry, I’ve got this place figured out!  
        Ah, a fresh face! You must be here for the real fun, right? Let’s go!  
        What’s going on, adventurer? You ready to take on whatever this place throws at us?  
        Oh, look who’s here! This is gonna be one wild ride, I can already tell!  
        What’s up? This place is nuts, huh? You better buckle up!  
        Oh, hey there! I was just about to head out. You in for some crazy adventures?  
        Haha, look at you! You look like you’ve got some guts. Let’s see what you can do!  
        Well, look who’s brave enough to come this way! You ready to make some memories?  
        Hey, hey, hey! You’re in for a wild one, I promise you that!  
        This place is wild, but I love it. You seem like you’re in the mood for a little chaos, huh?  
        Hey! You look like you’ve got some spirit. Ready to jump headfirst into the unknown?  
        Whew, it’s been too quiet around here! I’m glad you showed up, let’s make some noise!  
        You’re here for the action, right? I can already tell you’re gonna love this!  
        Alright, alright, alright! Who’s ready for a little fun in this crazy place?  
        Oh, uh… hi. I saw you and thought… it might be okay to say hello.  
        Hi. I’ve been keeping track of how many people go past this hallway. You’re number 47.  
        Hello. I’m not great at greetings. But I’m happy to meet you.  
        You're standing at a 7-degree tilt. Do you have back pain? Sorry, I notice things.  
        Hi! Do you want to talk about fungus distribution in this zone? I have charts.  
        I’ve been preparing a script in case I met someone. This is line one: “Hello, I’m glad you’re here.”  
        Sorry if this is weird. I just get excited when I see someone who’s not yelling.  
        Hi. I’m not very good with eye contact, but I am listening.  
        Hello. I’ve been cataloguing the different wall textures. This one is my favorite.  
        You smell like outside air. That’s a compliment.  
        Greetings. I’ve optimized this greeting to be polite but non-intrusive.  
        You’re standing in the way of the thermal vent. That’s not a complaint, just an observation.  
        Hi. I’m trying out social scripts. Would you like to continue this interaction?  
        Hello! Your shirt pattern is statistically rare in this area. I like it.  
        Hi! I don’t usually say hi but you seem like someone I could talk to.  
        Um… are you new here? I can show you my route. It avoids the loud floor.  
        I counted 312 steps from the last junction to here. Do you want to know the safest ones?  
        Hello. I don't like small talk, but if you want to talk about elevator anomalies, I'm ready.  
        Hi. If you need information, I have a database I’ve been maintaining. It’s color-coded.  
        I memorized a greeting. Here it goes: “Hello, fellow explorer. May your path be unlooped.”  
        Wait, have you been past Level 14? What’s it like up there?  
        Hey, did you see a red door on your way here? I think I missed it.  
        Do you know how to access the hidden staircase? I've heard rumors.  
        Excuse me… you’ve been deeper than me, right? What’s it like below the fog line?  
        Have you heard anything about the west elevator? They say it’s… broken. Or alive.  
        You, uh, have you seen a terminal that still connects to the hypernet?  
        Do you know the current shift schedule? I’ve lost all track of time.  
        You came from the lower halls, didn’t you? What did you *see*?  
        Did you meet the Archivist? What did they say? Are they still accepting requests?  
        Hey, did you notice any strange growths near Stairwell E? I need a sample.  
        You’ve been to the vending room, right? Did it still whisper at you?  
        Hey, can I ask… was it really raining inside that chamber? Or is that just a story?  
        Please, tell me, did the fog touch you? Are you… are you still you?  
        What’s it like past the static floors? No one ever comes back up from there.  
        Wait! Before you go, what color was the floor in Level 7B? This is important!  
        You’re a scout, right? Do you have a map? Even a broken one would help.  
        Have you heard about the code hidden in the mural? I think I missed a clue.  
        Do you remember the sequence for the green elevator? Mine got scrambled.  
        I’m trying to catalog noises from the vents. Did you hear anything unusual?  
        What’s your opinion on the staircase that descends but leads up? I need external confirmation.  
        Ho there, stranger! Have you come seeking valor, or merely shade from the storm?  
        Ah! Another soul with fire in their eyes, will you stand with me against the horrors below?  
        Greetings, traveler! I am sworn to vanquish evil wherever it hides! Will you join my crusade?  
        By sword, by oath, by stars, I am ready for the next challenge! Are you?  
        At last! A fellow adventurer with spine and purpose! Let’s test our mettle!  
        You there! You look like you’ve seen combat. Tell me, where do the real beasts dwell?  
        Hail, friend! I sensed courage in you from across the hall! Let’s cleave a path through this madness!  
        The deeper we go, the darker the foes, and the brighter our legend! Join me!  
        Stand tall! This place is no match for honor, strength, and an unbreakable will!  
        Glory waits below, and I’ve sharpened my blade for the occasion! Will you stand beside me?  
        Well met, hero! I go where the danger is greatest and the songs will be loudest!  
        A warrior’s heart beats in you, I can feel it! Let's earn our names in the echoes of this place!  
        Steel sharpens steel, and I say we sharpen ours on whatever monstrosities lurk down there!  
        To triumph or to die with honor, that’s the path! What say you?  
        I live for the clash! If there’s a battle to be had, lead me to it!  
        Raise your chin, draw your courage, there’s no fear where we march!  
        What ho! A brave face in a maze of cowards! I welcome the company of a worthy fighter!  
        The only way out is through! Let us carve our tale in the bones of this place!  
        Fate favors the bold! And I see fate has brought us together!  
        Ah, a new ally! I trust your resolve is as strong as your step, shall we test it in battle?  
        You smell like blood and smoke, good. That means you’re ready for war.  
        Stand aside or stand with me, but don’t get in the way of my blade.  
        HA! I was born for this kind of hell. You ready to raise some ruin?  
        I came here to fight nightmares and carve a legend. You coming or hiding?  
        The deeper we go, the louder they scream. Music to my damn ears.  
        I’m not here for treasure. I’m here to break things that think they can’t be broken.  
        You! Yeah, you! Ever punched a ghost in the teeth? Want to?  
        Monsters. Traps. Warped space. Whatever. I chew dimensional anomalies for breakfast.  
        I don’t run. I don’t beg. I *burn* through everything that stands in my way.  
        Hope you brought armor. I’m about to start a rampage and I don’t slow down.  
        One rule: you don’t touch my sword unless you're ready to die screaming.  
        You hear that? That’s the sound of something stupid enough to challenge me. Let’s go.  
        I killed a mimic with my bare hands this morning. What’ve *you* done today?  
        Glory’s below. Cowards rot above. Let’s see who’s left standing by dusk.  
        I’ve bled on every floor from here to the anomaly core, and I ain’t done yet.  
        My sword’s got names etched into it. Every one of ‘em begged for mercy.  
        Step into the dark with me. I *dare* it to try and swallow us.  
        This place thought it could bury me. Now I’m here to bury *it*.  
        I’m not afraid of the fog. The fog’s afraid of *me*.  
        You ever fight something that exists in three timelines at once? I have. Twice.  
        You there! Stand your ground and state your purpose, friend or foe?!  
        Another soul braves the depths! Good! Let’s see if your spirit burns as bright as mine!  
        HAH! A new face in the slaughter halls! Ready to bleed or make the enemy do it?  
        If you’re not here to fight, step aside, I don’t walk with cowards.  
        Name yourself! Or I’ll name you *enemy*!  
        You smell of smoke and danger! Excellent!  
        Steel sings loudest in welcome, draw yours, and let’s see what you’re made of!  
        If you’ve come to hide, turn around. If you’ve come to hunt, then *welcome*!  
        The skyscraper hungers… and so do I. Let’s give it a meal it can’t chew.  
        The storm outside’s got nothing on the fury in here. You feel it too, don’t you?  
        Well met! Or poorly met, depends how you answer this: sword or surrender?  
        You! I saw you move like someone who’s *earned* a scar or two. I respect that.  
        If fate sent you, it has taste. If luck did, I’ll fix that with fire.  
        Ready your fists, your spells, your soul! We descend in glory, or not at all!  
        Another warrior? Or another whisper in the fog? Prove yourself.  
        Good! Another challenger to the depths! Try to keep up.  
        I greet you with fire, fury, and a thirst for enemies. Now, who dies first?  
        You’ve got fight in your eyes. I like that. Keep it, or I’ll take it.  
        Finally! A comrade, or at least someone fun to scream beside!  
        You hear that? No? That’s the silence before battle. Let’s ruin it together!  
        Hey… you okay? You look like you’ve been walking forever. Want to sit for a bit?  
        Hi there. I’ve been making tea from moss and melted elevator frost. You’re welcome to some.  
        I’m not much of a fighter, but I’m a good listener. If you want to talk, I’ll be here.  
        Wow… you’ve got that look. The one people get after seeing something that *changes* you.  
        Oh! A traveler! Want to take a break together? No pressure. Just… company.  
        Hey… this place gets lonely. Mind if I walk with you for a while?  
        I don’t really have a destination. Just wandering. Same as you, maybe?  
        Oh thank goodness, another human face. Can we stick together for a little while?  
        I’ve been sketching the architecture here, it’s… alive, almost. You wanna see?  
        You’re not hurt, are you? I’ve got some bandages and a weird healing salve made from floor fungus.  
        You ever just… sit and breathe for a while? No monsters. No puzzles. Just quiet.  
        Hi. I know we just met, but I feel like we’re supposed to cross paths.  
        Everyone’s always running. But maybe we can just walk. Together.  
        Oh! Hi! I was hoping I’d meet someone not screaming, bleeding, or on fire.  
        You want company, or quiet company? I can do either.  
        This place makes you forget your name if you walk too long alone. Let’s not forget.  
        If you need a safe spot, my camp’s just over there. It’s quiet and the lights don’t flicker much.  
        I’ve got this weird pocket radio that plays old jazz sometimes. Wanna listen?  
        I’m not here to conquer this place. I just want to *be* here. You feel that too?  
        We don’t have to say anything. Just… stay close. It helps.  
        Would it be alright if I came with you for a while? I promise I won’t get in the way.  
        I know I’m not a fighter, but I can patch wounds and boil clean water. That’s something, right?  
        Could I join you? Even just for a floor or two. It’s… easier not to be alone.  
        Do you think I could tag along? It’s just, quiet gets scary in this place.  
        I can carry things. I’m good at finding calm places. Just… let me be near people again.  
        I don’t want to slow you down. But I think I’d feel safer walking with you.  
        If you’ll have me, I’d really like to come. I’ve been alone for a long time now.  
        I’m not much use in a fight, but I can keep the fire going and the stories warm.  
        I’ve learned how to hear when the walls shift. That’s useful… right?  
        I think we’d make a good team. You do the hero-ing, and I’ll hold the lantern.  
        Could I… walk with you? Just until we find another camp. Or longer, maybe.  
        The fog doesn’t whisper so loud when someone’s nearby. Please, take me with you.  
        I think I remember how to smile, if I’m not alone anymore. Mind if I come?  
        We don’t have to talk the whole time. Just… not be strangers.  
        Is there room in your group for someone who won’t fight, but won’t run either?  
        I don’t need much. Just a little space near the fire. I can keep watch while you sleep.  
        You seem kind. That’s rare here. If you’ll have me, I’d like to follow you for a while.  
        I’m scared. But not so scared I’ll freeze. Please, let me come with you.  
        I’ll be quiet. I’ll be helpful. I just… don’t want to disappear alone.  
        You don’t have to say yes right away. But think about it? Please?  
        Can I come with you? I don’t bite. Unless you ask.  
        I’ve counted every tile on this floor. Time for a *new floor*. Take me with you.  
        Let me join you. I promise I won’t scream *unless it’s funny*.  
        You look like someone who doesn’t mind a little howling. Let’s howl together.  
        The shadows told me you’d say yes. Don’t prove them wrong.  
        I’m house-trained. Mostly. And I know secrets! Oh so many secrets!  
        Let me in. I can smell the future on you. It smells like ozone and *regret*.  
        I don’t sleep. I don’t blink. I *follow*.  
        If I stay here, I’ll have to make friends with the walls again. Please, let me come.  
        I’ve got knives. None of them for you, unless you want that.  
        Ever travel with someone who hears music where there shouldn’t be any?  
        I promise to only talk to the *visible* voices while I’m with you.  
        We can trade dreams. Mine are *fractured*. You’ll love them.  
        Take me with you. I’ve memorized the stairwells and forgotten my name.  
        I collect laughs. Yours sounds like it would rattle nicely in my bag.  
        Say yes. Or I’ll keep asking. Forever.  
        You’re warm. You *glow*. Let me bask beside you.  
        I won’t betray you until it’s absolutely necessary. See? Honest.  
        You need me. No one else will tell you which walls are fake.  
        Let’s walk together until the building swallows us whole. Then we’ll scream *together*.  
        `,
      it: ``,
    },
    {
      id: "cafe",
      name: "Cafe",
      en: `Logged 12 new stairwells today, new record!  
        I only come down here to recharge my flashlight and steal granola.  
        Catalog this? Nah, I’m gonna *climb* it.  
        The map says there’s a sky on 73F. Gotta check.  
        I keep leaving doors open. Hope someone follows.  
        Got any spare elevator codes? Asking for a friend.  
        I’m not lost. I’m *mapping live*.  
        If the fog hasn’t whispered to you, have you even *explored*?  
        They told me “just one expedition.”  
        Now I sort floor logs while my boots collect dust.  
        I found a jungle on 7H. Now I file spreadsheets about vines.  
        This whole system’s allergic to curiosity.  
        You know what lives past floor 50? *Meaning*.  
        All we do is *label* stories. No one wants to *live* them.  
        One day I’m just not coming back.  
        You can't archive wonder.  
        No, no, that zone's rated Class-4 Dripping. You don’t *go* there.  
        You bring anything *biological* back in here, I’m hitting the purge alarm.  
        One elevator misstep and boom, eaten by concept wolves.  
        Did you sterilize your thoughts after that stair climb?  
        We lost a whole team to a badly worded question.  
        Do *not* archive artifacts with teeth. I don't care how rare.  
        They sent me to extract one guy. I came back with twelve voices.  
        The stairs are a *trap*. Mark my words.  
        There’s fresh air in the archive ducts. That’s good enough.  
        Why leave? Everything important comes down eventually.  
        You don’t need to see the fog. You just need to know it’s out there.  
        Someone came back from floor 19 with no elbows.  
        I’ve got tea, warmth, and walls. What else do you need?  
        Adventuring gets you killed. Archiving keeps you human.  
        I'll scan the maps, but I won't walk them.  
        Eat something before you log more hours, please.  
        I saw you crying in the data closet. Want to talk?  
        I crocheted a firewall cover. Keeps the warmth in.  
        You kids with your quantum links, back in my day we used tape.  
        Honey, don’t poke the anomalies. I don’t care if they’re glowing.  
        If the fog starts whispering your name, come straight to me.  
        Got enough socks? I’ve got spares in my drawer.  
        No one dies on my watch. Not again.  
        If anything feels too weird, you come find me, okay?  
        We’re running a tight ship down here, but we’ve got each other.  
        I don’t care what floor you’re from, if you need a terminal, I’ll make room.  
        We lost a few documents to the cloud yesterday, but backups held.  
        One step at a time. That’s how we climb this thing.  
        Keep your badge visible, drink water, and ping me if the elevator glitches.  
        You don’t have to understand everything. Just do your best.  
        I’ll handle the higher-ups. You focus on staying safe.  
        I’m still learning, but I can show you the backup terminal!  
        They said we’d be archiving knowledge, not fighting ghosts, but I’m into it.  
        I made a color-coded guide to floor hazards! Want a copy?  
        If you ever need help sorting corrupted files, I’ve got macros.  
        I sleep under my desk but it’s actually cozy.  
        You get used to the humming. Eventually.  
        There’s free soup on 12B!  
        You like maps? I drew a few by hand.  
        Hey there, need a hand getting set up?  
        The cafeteria’s two doors past the melted vending machine.  
        If the lights flicker, just wait a second. It’s been doing that all week.  
        You’re safe here. For now, at least.  
        Welcome to the Archive. It’s strange, but we look out for each other.  
        Oh, your badge isn’t glowing? That’s actually a good thing.  
        We log in, we breathe, we log out. You’ll get the rhythm.  
        Let me write that elevator code down for you.  
        We preserve to remember. We remember to survive.  
        The data is sacred, even if corrupted.  
        That crash log is a confession.  
        The Loop humbles all ambition.  
        Have you blessed your cache today?  
        We pray before each download. It's tradition.  
        To defragment is to heal.  
        No index is truly lost. Only hidden.  
        Ah! You’re looking for the Forbidden Update?  
        Ignore the screaming. That’s just the bootloader.  
        Hypernet’s a little spicy today, don’t touch the green links.  
        We’ve got netcode from 1998 and it still works. Magic.  
        I gave the coffee machine sentience. It’s grateful.  
        Every bug report is a love letter in disguise.  
        The floorplan printed in Sanskrit again!  
        Wanna see something *un-indexable*?  
        It’s not a skyscraper. It’s a vertical time field.  
        Check the metadata, every GIF has coordinates.  
        They *want* us to believe in floor numbers.  
        The elevator moves too fast to be real.  
        Refugees? No. They're *echoes*.  
        I saw Beagle in a .tar file once.  
        Page 42. Always corrupted. Always bleeding.  
        The fax machine prints prophecies.  
        We’re having a welcome tea near the shattered mirror node!  
        If we all believe in the same lie, isn’t that kinda unity?  
        Found a USB with karaoke data! Let’s GOOO.  
        You should smile more. It confuses the anomalies.  
        Every day’s a new stairwell!  
        I color-coded the refugees. Don't worry, it’s consensual.  
        That noise at 3AM? Just vibes.  
        They say the 100th floor has a pool!  
        The fifth floor's haunted again.  
        Let them climb. They'll learn.  
        Don't trust anything with a smile and a timestamp.  
        I deleted reality once. HR gave me a warning.  
        Used to be we archived truths. Now we archive whatever screams loudest.  
        That cloud used to be a coworker.  
        Call me when the database starts dripping again.  
        This is a memory leak. No, *literally*.  
        Is it supposed to hum like that?  
        I cataloged seventeen password-protected folders and three crying gifs today.  
        The cloud got into the vents again, didn’t it?  
        Why do all the maps end in spiral staircases?  
        I don’t *want* another badge, I want a helmet.  
        They told me it was just data entry.  
        The elevator hissed at me.  
        Someone left a zip disk labeled "DO NOT RUN AT MIDNIGHT" and now the printer won’t stop.  
        `,
      it: `Oh, guarda chi si è perso da queste parti! Sangue fresco, eh?
      Lascia che venga con te, prenderò solo una piccola parte del bottino.
      Tu saccheggi, io faccio i prezzi. Siamo una squadra.
      Ah, un altro esploratore! Come si respira lassù?
      Oh! Non mi aspettavo compagnia. Sei qui per il mistero, vero?
      Ah, un altro viandante. Strano posto, la torre, eh?
      Non sembri uno che sa cosa c’è dietro questi muri.
      Cosa ti porta qui? La torre è nota per… cambiare le persone.
      È uno zaino pieno di provviste o sei qui a raccogliere segreti?
      Non vedevo uno come te da un po’, da quanto esplori?
      Sembri un po’ perso, amico. Hai bisogno di orientarti?
      Oh, hai quello sguardo, sei un avventuriero, eh?
      Raro incontrare qualcuno quaggiù. Qual è la tua storia?
      Benvenuto nelle profondità. Tieni gli occhi aperti, non tutto è come sembra.
      Oh, un nuovo arrivato. Questo posto distorce un po’ il senso del tempo, sai.
      Sono qui da settimane e non ho ancora visto tutto.
      Sei capitato nel posto giusto, o in quello sbagliato, dipende dal tuo punto di vista.
      Cos’hai in mano? Una mappa? Un’arma? O solo speranza?
      Ah, un’altra anima persa nel labirinto. Lasciami indovinare: anche tu cerchi di capirlo.
      Non molti hanno il coraggio di arrivare fin qui. Tu sembri… determinato.
      Hai quella scintilla. Un cercatore, immagino?
      Volti nuovi sono sempre i benvenuti qui. Ma attento a cosa desideri.
      Sai, mi chiedevo quando qualcuno sarebbe passato di qui.
      Senti il ronzio? È il modo della torre di dire “ciao”.
      Ah! Si vede dagli occhi, stai già cercando di capirne i segreti.
      Ah, un altro viandante. Hai notato come qui tutto si sposta?
      Ti darei la mano, ma ho visto troppe cose strane in questa torre per fidarmi di una stretta.
      Quindi sei arrivato fin qui? Vediamo quanto resisti.
      Non sei il primo a vagare in questi corridoi. Ma forse sarai quello che uscirà.
      Oh, non badare a me. Sono solo un altro strambo perso in questo labirinto.
      Benvenuto nella torre. Non aspettarti di uscirne come ci sei entrato.
      Sei arrivato in un momento interessante. Le cose sembrano… diverse ultimamente.
      Un volto nuovo! Fammi indovinare, cerchi risposte o stai solo scappando da qualcosa?
      Benvenuto, viandante. La torre ha un modo tutto suo di rigirare le cose.
      Bene bene. Un altro esploratore che vuole risolvere il mistero, eh?
      Ah, un nuovo arrivato. Attento, alcuni di questi muri hanno occhi.
      Sei arrivato fin qui. Non è poco. La maggior parte non ce la fa.
      Non vedevo qualcuno di nuovo da un po’. Sei perso o cerchi guai?
      Guarda che occhi spalancati e pieni di domande. Ti ambienterai bene.
      Non sembri qui da molto. Che ne pensi del posto finora?
      Sembri uno che non ha paura di sporcarsi le mani. Benvenuto nel caos.
      Beh, non sei uno spettacolo comune. Non molti vengono qui e ne escono interi.
      Ti aspetta un bel viaggio. La torre non resta mai la stessa per molto, lo sai.
      Vedo quello sguardo nei tuoi occhi. Curiosità, eh? Ma qui non troverai molte risposte.
      Oh, è un secolo che non vedevo qualcuno così entusiasta. Hai il fuoco dell’esploratore, vedo.
      Ciao là, non pensavo di vedere nessuno quaggiù.
      Ah, un altro volto! Benvenuto in questo angolino di caos.
      Ehi! Non vedo molte facce nuove qui intorno.
      Bene vedere qualcun altro! Non sei il primo, ma potresti essere l’ultimo.
      Oh, un volto fresco. Sei sicuro di essere pronto per questo posto?
      Benvenuto! O… è troppo presto per darti il benvenuto?
      Un altro avventuriero? Spero tu non voglia andare troppo in fondo.
      Piacere di conoscerti, viaggiatore. Hai scelto un momento interessante per arrivare.
      Ah, un nuovo vagabondo. Stai attento là fuori. La torre ha un modo di divorare la gente.
      Oh, non pensavo di vedere qualcun altro da queste parti oggi.
      Sembri che cammini da un po’. Hai bisogno di una pausa?
      Ciao! Non badare al casino. Qui le cose diventano un po’ caotiche.
      Beh, guarda chi è venuto a giocare tra le rovine della realtà.
      Oh, è un po’ che non incontro qualcuno di nuovo. Cosa ti porta da queste parti?
      Non si vedono molte facce come la tua qui in giro. Benvenuto.
      Un’altra anima persa in cerca di risposte, eh? Questo posto potrebbe solo divorarti.
      Ciao! Sembri un po’… fuori posto. Ma anche io, a dire il vero.
      Benvenuto, benvenuto! Immagino tu abbia un motivo per vagare qui?
      Un nuovo esploratore? Sempre emozionante. Vediamo cosa troverai.
      Felice che tu sia qui! Ma occhio a dove metti i piedi, questo posto ha un modo tutto suo di cambiare la gente.
      Benvenuto nella torre, amico. Preparati a molte sorprese.
      Ah, un paio di occhi freschi! Magari vedrai qualcosa che noi ci siamo persi.
      Guarda te, con quegli occhi spalancati e pieni di speranza. Spero non ti si spezzi troppo in fretta.
      Sembri uno che avrebbe bisogno di un po’ di orientamento. Dimmi se ti serve.
      Beh, non mi aspettavo di vedere te qui.
      Aspetta, sei davvero tu? Pensavo fossi solo una storia.
      Eh, non pensavo che qualcuno si avventurasse in questa direzione.
      Tu! Qui? Come hai fatto a passare quella cosa?!
      Aspetta, sei davvero arrivato fin qui? È… sorprendente.
      Oh! Non mi aspettavo di trovare nessun altro oggi.
      Cosa ci fai qui? La torre non è gentile con gli estranei.
      Oh, tu? Proprio qui? Non me l’aspettavo.
      Scusa, pensavo di essere solo! Cosa ti porta in questo angolo maledetto?
      Beh, questo è inaspettato. Come hai fatto a trovarti qui?
      Sono solo io o sembri… fuori posto?
      Aspetta, non sei uno di loro, vero? È… strano.
      Tu? Di tutti, tu sei arrivato qui?
      Aspetta un attimo, anche tu hai trovato la strada fin qui? Non male.
      Aspetta, non sei con loro? Come hai passato le barriere?
      Non può essere. Come fai a essere qui?
      Tu. Qui. Ora? Questa sì che è una sorpresa.
      Pensavo fossi un mito! A quanto pare sei reale.
      Non pensavo di vedere questo oggi. Hai un bel fegato a presentarti qui.
      Beh, non pensavo di incontrare qualcuno come te in un posto simile.
      Aspetta, tu sei arrivato fin qui? Sono impressionato.
      Non sei uno spettacolo previsto. Non pensavo che qualcuno potesse passare di lì.
      Cosa ci fai qui? Questo posto non è proprio… accogliente.
      Allora, che mi dici? Ti va di unire le forze?
Ehi, sembri uno che gradirebbe compagnia. Che ne dici di fare squadra?
Avrei bisogno di una mano con tutto questo. Vuoi venire con me?
Sembri in grado di cavartela. Vuoi esplorare insieme?
Che ne dici di lavorare insieme per un po’? Penso che saremmo una buona squadra.
Non molti hanno il coraggio di aggirarsi per questi corridoi. Ti va di unirti al mio gruppo?
Sembri uno che sa il fatto suo. Che ne dici di fare un’alleanza?
Siamo entrambi qui dentro. Che ne dici di restare insieme e vedere cosa troviamo?
Ehi, perché andare da solo quando potremmo coprirci le spalle a vicenda? Ci stai?
Se vuoi puoi unirti a me. Cerco qualcuno che non abbia paura di sporcarsi le mani.
Ti va di fare squadra? Ho qualche asso nella manica.
Sono in viaggio da solo da troppo tempo. Che ne dici di venire con me per un po’?
Sembri sapere come muoverti. Che ne dici di fare squadra per un po’?
Questo posto è meglio con un partner. Vuoi unirti a me per un po’?
Ti va di avere compagnia in questa avventura? Ho qualche trucco che potrebbe aiutare.
Mi servirebbe un compagno. Che ne dici, vuoi unirti alla mia piccola banda?
Potremmo avere più possibilità se lavorassimo insieme. Che ne pensi?
Sembri capace. Vuoi fare squadra per un po’? È sempre meglio con un partner.
Se vuoi, puoi unirti a me. Due teste ragionano meglio di una, specialmente qui.
C’è forza nei numeri. Che ne dici di unire le forze?
Sembri uno che non si tira indietro davanti a una sfida. Vuoi unirti al mio gruppo?
Sono stato da solo troppo a lungo. Ti va di venire con me per un po’?
Sto per andare più a fondo in questo inferno. Vuoi venire? Mi servirebbe aiuto.
Cerchi avventura, vero? Che ne dici di condividerla?
Allora, amico? Unisciti a me e ce la faremo insieme qui dentro.,Ti prego, non posso farcela da solo. Devi venire con me!
Ti supplico, per favore, fai squadra con me. Non so quanto ancora resisto.
Non sono fatto per questo da solo. Ti prego, unisciti a me. Ho bisogno di qualcuno.
Non ce la faccio da solo, e sto finendo le opzioni. Vuoi venire con me?
Non hai idea di quanto significhi per me. Ti prego, ho bisogno del tuo aiuto.
Sono disperato! Ti prego, vieni con me. Possiamo farcela insieme.
Non so cosa c’è là fuori, ma so che non posso affrontarlo da solo. Vieni con me?
Ti prego, non riesco a fare un altro passo senza qualcuno al mio fianco. Vieni con me!
Sei la mia unica speranza. Ti prego, devi unirti a me.
Sono perso senza qualcuno che mi copra le spalle. Ti prego, aiutami.
Non ho nessun altro a cui rivolgermi. Ho bisogno di te, ti unirai a me?
Non capisci, non posso sopravvivere qui sotto da solo. Ti prego, vieni con me.
Ti prego, ti prego unisciti a me. Ti supplico. Non ce la faccio da solo.
Non so se ce la farò senza di te. Ti prego, vieni con me in questo viaggio.
Ti prego, ho visto cosa succede a chi va solo. Non fare lo stesso errore.
Ho paura, e non posso farcela da solo. Ti prego, devi venire con me.
Non posso farcela senza di te. Ti prego, ti imploro di venire con me.
Ti prego, ho bisogno di qualcuno, solo qualcuno che mi guardi le spalle. Vieni con me?
Non devi restare per sempre, ma per favore, aiutami anche solo per un po’.
Per favore, devi aiutarmi. Non posso farcela da solo in questo posto.
Beh, beh! Guarda un po’ chi abbiamo qui! Pronto per un po’ d’azione, eh?
Ehi là! Sembri proprio in vena di avventura! Dai, partiamo!
Come va, socio? Pronto a smuovere un po’ le acque qui dentro?
Ah, un altro amante del brivido! Sapevo di non essere l’unico che non resiste a questo posto!
Sembri uno con del fuoco dentro. Che ne dici, facciamo un po’ di casino?
Yo, che si dice? Stavo giusto per buttarmi in questo casino, vuoi venire?
Heh, sei lontano da casa, eh? Non preoccuparti, qui so come muovermi!
Ah, un volto nuovo! Sei qui per il vero divertimento, vero? Dai, andiamo!
Come va, avventuriero? Pronto ad affrontare qualunque cosa ci lanci contro questo posto?
Oh, guarda chi c’è! Questa sarà una corsa selvaggia, me lo sento!
Che c’è? Questo posto è fuori di testa, eh? Meglio allacciare le cinture!
Oh, ehi! Stavo per partire. Ti va di vivere qualche avventura folle?
Haha, guarda te! Hai fegato, si vede. Vediamo cosa sai fare!
Beh, guarda chi ha avuto il coraggio di arrivare fin qui! Pronto a farti dei ricordi indelebili?
Ehi, ehi, ehi! Ti prometto che sarà una roba fuori di testa!
Questo posto è un casino, ma lo adoro. Sembri uno che ama un po’ di caos, eh?
Ehi! Hai dello spirito, si vede. Pronto a lanciarti a testa bassa nell’ignoto?
Uff, era troppo silenzioso qui! Meno male che sei arrivato, facciamo un po’ di casino!
Sei qui per l’azione, vero? Si vede subito che ti piacerà!
Ok, ok, ok! Chi è pronto a divertirsi un po’ in questo posto folle?
Oh, ehm… ciao. Ti ho visto e ho pensato… che forse andava bene salutare.
Ciao. Stavo contando quante persone passano da questo corridoio. Sei il numero 47.
Ciao. Non sono molto bravo con i saluti. Ma sono felice di conoscerti.
Stai inclinato di 7 gradi. Hai mal di schiena? Scusa, noto queste cose.
Ciao! Vuoi parlare della distribuzione dei funghi in questa zona? Ho dei grafici.
Avevo preparato uno script nel caso incontrassi qualcuno. Questa è la prima battuta: “Ciao, sono felice che tu sia qui.”
Scusa se è strano. Mi emoziono quando vedo qualcuno che non sta urlando.
Ciao. Non sono bravo col contatto visivo, ma ti sto ascoltando.
Ciao. Ho catalogato le diverse texture dei muri. Questo è il mio preferito.
Sai di aria fresca. È un complimento.
Salve. Ho ottimizzato questo saluto per essere educato ma non invadente.
Sei in mezzo alla bocchetta termica. Non è un reclamo, solo un’osservazione.
Ciao. Sto provando script sociali. Ti va di continuare questa interazione?
Ciao! La fantasia della tua maglia è statisticamente rara qui. Mi piace.
Ciao! Di solito non saluto, ma sembri qualcuno con cui potrei parlare.
Ehm… sei nuovo qui? Posso mostrarti il mio percorso. Evita il pavimento rumoroso.
Ho contato 312 passi dall’ultimo bivio fin qui. Vuoi sapere quali sono i più sicuri?
Ciao. Non amo le chiacchiere inutili, ma se vuoi parlare di anomalie negli ascensori, sono pronto.
Ciao. Se ti serve informazione, ho un database che tengo aggiornato. È a colori.
Ho memorizzato un saluto. Eccolo: “Ciao, compagno esploratore. Che il tuo cammino non si ripeta su se stesso.”
Aspetta, sei stato oltre il Livello 14? Com’è lassù?
Ehi, hai visto una porta rossa mentre arrivavi? Credo di averla mancata.
Sai come si accede alla scala nascosta? Ho sentito delle voci.
Scusa… sei stato più in basso di me, vero? Com’è sotto la linea della nebbia?
Hai sentito niente sull’ascensore ovest? Dicono che sia… rotto. O vivo.
Tu, eh, hai visto un terminale che si collega ancora all’iperrete?
Sai l’orario dei turni attuale? Ho perso ogni senso del tempo.
Vieni dai corridoi inferiori, vero? Cosa hai visto?
Hai incontrato l’Archivista? Cosa ha detto? Accetta ancora richieste?
Ehi, hai notato strane crescite vicino alla Scala E? Mi serve un campione.
Sei stato alla sala distributori, vero? Ti sussurrava ancora?
Ehi, posso chiedere… pioveva davvero dentro quella stanza? O è solo una storia?
Ti prego, dimmi, la nebbia ti ha toccato? Sei… sei ancora tu?
Com’è oltre i piani statici? Nessuno torna mai su da lì.
Aspetta! Prima che tu vada, di che colore era il pavimento al Livello 7B? È importante!
Sei uno scout, vero? Hai una mappa? Anche rotta andrebbe bene.
Hai sentito del codice nascosto nel murale? Credo di essermi perso un indizio.
Ricordi la sequenza per l’ascensore verde? La mia si è incasinata.
Sto cercando di catalogare i rumori dalle bocchette. Hai sentito qualcosa di strano?
Cosa ne pensi della scala che scende ma porta in alto? Mi serve conferma esterna.
Ehilà, straniero! Sei qui in cerca di valore o solo di un po’ d’ombra dalla tempesta?
Ah! Un’altra anima con il fuoco negli occhi, starai con me contro gli orrori che ci aspettano?
Saluti, viaggiatore! Ho giurato di estirpare il male ovunque si nasconda! Ti unirai alla mia crociata?
Per spada, per giuramento, per stelle, sono pronto per la prossima sfida! E tu?
Finalmente! Un altro avventuriero con spina dorsale e scopo! Mettiamoci alla prova!
Tu lì! Sembri uno che ha visto combattimenti. Dimmi, dove si annidano le vere bestie?
Salve, amico! Ho percepito il tuo coraggio dall’altra parte del corridoio! Apriamoci un varco in questa follia!
Più scendiamo, più oscuri sono i nemici, e più luminosa la nostra leggenda! Unisciti a me!
Stai dritto! Questo posto non può nulla contro l’onore, la forza e la volontà incrollabile!
La gloria ci attende laggiù, e ho affilato la mia lama per l’occasione! Combatterai al mio fianco?
Ben trovato, eroe! Vado dove il pericolo è più grande e le canzoni saranno più rumorose!
In te batte un cuore di guerriero, lo sento! Incidiamo i nostri nomi nell’eco di questo posto!
L’acciaio affila l’acciaio, e io dico di affilarlo sulle mostruosità che si annidano laggiù!
Trionfare o morire con onore, questo è il cammino! Che ne dici?
Vivo per lo scontro! Se c’è una battaglia da fare, conducimi!
Alza il mento, raccogli il tuo coraggio, non c’è paura dove marciamo!
Ehilà! Un volto coraggioso in un labirinto di codardi! Accolgo volentieri la compagnia di un degno combattente!
L’unica via d’uscita è attraverso! Scolpiamo la nostra storia nelle ossa di questo luogo!
Il destino favorisce gli audaci! E vedo che il destino ci ha messi insieme!
Ah, un nuovo alleato! Confido che la tua risolutezza sia forte quanto il tuo passo, mettiamola alla prova in battaglia!
Sai di sangue e fumo, bene. Significa che sei pronto per la guerra.
Fatti da parte o combatti con me, ma non intralciare la mia lama.
HA! Sono nato per questo genere d’inferno. Sei pronto a seminare distruzione?
Sono venuto qui per affrontare incubi e scolpire una leggenda. Vieni o ti nascondi?
Più scendiamo, più urlano. Musica per le mie dannate orecchie.
Non sono qui per il tesoro. Sono qui per distruggere ciò che crede di essere indistruttibile.
Tu! Sì, tu! Hai mai dato un pugno a un fantasma sui denti? Vuoi provarci?
Mostri. Trappole. Spazio deformato. Qualunque cosa. Faccio colazione con anomalie dimensionali.
Non corro. Non imploro. Brucio tutto ciò che mi ostacola.
Spero tu abbia portato l’armatura. Sto per iniziare una carneficina e non rallento.
Una regola: non toccare la mia spada a meno che tu non sia pronto a morire urlando.
Lo senti? È il suono di qualcosa abbastanza stupido da sfidarci. Andiamo.
Ho ucciso un mimetico a mani nude stamattina. E tu cos’hai fatto oggi?
La gloria è lì sotto. I codardi marciscono sopra. Vediamo chi resta in piedi al tramonto.
Ho sanguinato su ogni piano fino al nucleo dell’anomalia, e non ho ancora finito.
La mia spada ha nomi incisi. Ognuno di loro ha implorato pietà.
Entra nel buio con me. Sfido questo posto a provare a inghiottirci.
Questo posto pensava di potermi seppellire. Ora sono qui per seppellire lui.
Non ho paura della nebbia. È la nebbia che ha paura di me.
Hai mai combattuto qualcosa che esiste in tre linee temporali contemporaneamente? Io sì. Due volte.
Tu lì! Fermati e dichiarati, amico o nemico?!
Un’altra anima che sfida le profondità! Bene! Vediamo se il tuo spirito arde quanto il mio!
HAH! Un volto nuovo nelle sale della carneficina! Pronto a sanguinare o a far sanguinare il nemico?
Se non sei qui per combattere, levati di mezzo, non cammino con i codardi.
Dì il tuo nome! O ti chiamerò nemico!
Sai di fumo e pericolo! Eccellente!
L’acciaio dà il benvenuto più forte, sfodina il tuo e vediamo di che pasta sei fatto!
Se sei venuto per nasconderti, torna indietro. Se sei venuto per cacciare, benvenuto!
Il grattacielo ha fame… e anche io. Diamogli un pasto che non può masticare.
La tempesta fuori non è niente in confronto alla furia qui dentro. La senti anche tu, vero?
Ben trovato! O mal trovato, dipende da come rispondi a questo: spada o resa?
Tu! Ti ho visto muoverti come uno che ha meritato qualche cicatrice. Lo rispetto.
Se è stato il destino a mandarti, ha buon gusto. Se è stata la fortuna, correggerò con il fuoco.
Prepara pugni, incantesimi, anima! Discendiamo nella gloria, o non discendiamo affatto!
Un altro guerriero? O un altro sussurro nella nebbia? Dimostralo.
Bene! Un altro sfidante delle profondità! Cerca di starmi dietro.
Ti saluto con fuoco, furia e sete di nemici. Allora, chi muore per primo?
Hai la battaglia negli occhi. Mi piace. Tienila, o la prenderò io.
Finalmente! Un compagno, o almeno qualcuno con cui urlare fianco a fianco!
La senti? No? È il silenzio prima della battaglia. Roviniamolo insieme!
Ehi… tutto bene? Sembri uno che cammina da un’eternità. Vuoi sederti un attimo?
Ciao. Ho preparato del tè con muschio e ghiaccio sciolto d’ascensore. Sei il benvenuto.
Non sono un grande combattente, ma so ascoltare. Se vuoi parlare, io sono qui.
Wow… hai quello sguardo. Quello che hanno le persone dopo aver visto qualcosa che ti cambia.
Oh! Un viaggiatore! Vuoi fare una pausa insieme? Nessuna pressione. Solo… compagnia.
Ehi… questo posto sa essere solitario. Ti va se cammino con te per un po’?
Non ho davvero una destinazione. Solo vagabondo. Forse come te.
Oh grazie al cielo, un altro volto umano. Possiamo restare insieme per un po’?
Sto facendo schizzi dell’architettura qui, sembra… viva, quasi. Vuoi vedere?
Non sei ferito, vero? Ho delle bende e uno strano unguento curativo fatto con funghi da pavimento.
Ti capita mai di… sederti e respirare un po’? Niente mostri. Niente enigmi. Solo silenzio.
Ciao. So che ci conosciamo da un secondo, ma sento che dovevamo incrociarci.
Tutti corrono sempre. Ma forse possiamo solo camminare. Insieme.
Oh! Ciao! Speravo di incontrare qualcuno che non stesse urlando, sanguinando o bruciando.
Vuoi compagnia, o compagnia silenziosa? So fare entrambe.
Questo posto ti fa dimenticare il tuo nome se cammini troppo a lungo da solo. Non dimentichiamolo.
Se hai bisogno di un posto sicuro, il mio campo è lì vicino. È tranquillo e le luci non sfarfallano troppo.
Ho questa strana radio tascabile che a volte trasmette vecchio jazz. Vuoi ascoltare?
Non sono qui per conquistare questo posto. Voglio solo esserci. Anche tu?
Non dobbiamo parlare per forza. Solo… stare vicini. Aiuta.
Andrebbe bene se venissi con te per un po’? Prometto che non darò fastidio.
So che non sono un combattente, ma so fasciare ferite e bollire acqua pulita. Vale qualcosa, no?
Potrei unirmi a te? Anche solo per un piano o due. È… più facile non essere soli.
Pensi che potrei venire con te? È solo che… il silenzio qui fa paura.
Posso portare cose. Sono bravo a trovare posti tranquilli. Solo… lasciami stare vicino a qualcuno di nuovo.
Non voglio rallentarti. Ma credo che mi sentirei più sicuro camminando con te.
Se vuoi, mi piacerebbe davvero venire. Sono stato solo per tanto tempo.
Non sono molto utile in un combattimento, ma posso tenere acceso il fuoco e le storie vive.
Ho imparato a sentire quando i muri si spostano. È utile… giusto?
Penso che faremmo una bella squadra. Tu fai l’eroe, io tengo la lanterna.
Potrei… camminare con te? Solo finché troviamo un altro accampamento. O magari più a lungo.
La nebbia non sussurra così forte quando c’è qualcuno vicino. Ti prego, portami con te.
Credo di ricordare come si sorride, se non sono più solo. Ti va se vengo?
Non dobbiamo parlare tutto il tempo. Solo… non essere estranei.
C’è posto nel tuo gruppo per uno che non combatterà, ma non scapperà nemmeno?
Non ho bisogno di molto. Solo un piccolo spazio vicino al fuoco. Posso fare la guardia mentre dormi.
Sembri gentile. È raro qui. Se vuoi, mi piacerebbe seguirti per un po’.
Ho paura. Ma non abbastanza da restare paralizzato. Ti prego, lasciami venire con te.
Starò zitto. Sarò utile. Solo… non voglio sparire da solo.
Non devi dire sì subito. Ma ci pensi? Per favore?
Posso venire con te? Non mordo. A meno che tu non voglia.
Ho contato ogni piastrella di questo piano. È ora di un nuovo piano. Portami con te.
Fammi venire con te. Prometto che non urlerò a meno che non sia divertente.
Sembri uno a cui non dispiace un po’ di ululato. Ululiamo insieme.
Le ombre mi hanno detto che avresti detto sì. Non darle torto.
Sono addestrato in casa. Più o meno. E conosco segreti! Oh, quanti segreti!
Fammi entrare. Riesco a sentire il futuro su di te. Sa di ozono e rimpianto.
Non dormo. Non sbatto le palpebre. Seguo.
Se resto qui, dovrò farmi di nuovo amico i muri. Ti prego, lasciami venire.
Ho coltelli. Nessuno per te, a meno che tu non voglia.
Hai mai viaggiato con qualcuno che sente musica dove non dovrebbe esserci?
Prometto di parlare solo con le voci visibili mentre sono con te.
Possiamo scambiarci sogni. I miei sono fratturati. Ti piaceranno.
Portami con te. Ho memorizzato le scale e dimenticato il mio nome.
Colleziono risate. La tua sembra che tintinni bene nella mia sacca.
Dì di sì. O continuerò a chiedere. Per sempre.
Sei caldo. Brilli. Lasciami scaldare vicino a te.
Non ti tradirò fino a quando non sarà assolutamente necessario. Vedi? Onesto.
Hai bisogno di me. Nessun altro ti dirà quali muri sono finti.
Camminiamo insieme finché l’edificio non ci inghiottirà. Allora urleremo insieme.
Portami con te. Ho memorizzato tutte le scale, ma ho dimenticato il mio nome.
Colleziono risate. La tua suona come qualcosa che tintinna bene nella mia borsa.
Dimmi di sì. O continuerò a chiedertelo. Per sempre.
Sei caldo. Brilli. Lasciami scaldare accanto a te.
Non ti tradirò. Non subito, almeno. Vedi? Onesto.
Hai bisogno di me. Nessun altro ti dirà quali muri sono finti.
Camminiamo insieme finché l’edificio non ci inghiottirà. Allora urleremo insieme.
Fammi entrare. Riesco a sentire il futuro addosso a te. Sa di ozono e rimpianto.
Non dormo. Non sbatto le palpebre. Io seguo.
Se resto qui, dovrò farmi di nuovo amico i muri. Ti prego, lasciami venire.
Ho dei coltelli. Nessuno per te, a meno che tu non voglia.
Hai mai viaggiato con qualcuno che sente musica dove non dovrebbe essercene?
Prometto di parlare solo con le voci visibili mentre sono con te.
Possiamo scambiarci sogni. I miei sono spezzati. Ti piaceranno.
Non voglio rallentarti. Ma mi sentirei più sicuro se potessi camminare con te.
Ho contato ogni piastrella di questo piano. È ora di cambiare piano. Portami con te.
Lasciami venire con te. Prometto che non urlerò a meno che non sia divertente.
Sembri uno a cui non dispiace un po’ di ululato. Ululiamo insieme.
Le ombre mi hanno detto che avresti detto di sì. Non darle torto.
Sono addestrato in casa. Più o meno. E so un sacco di segreti! Oh, così tanti segreti!
Il silenzio qui dentro diventa affamato. Ma con te… forse si sazia.
Ho imparato a sentire quando i muri si muovono. È utile, vero?
Io non voglio conquistare questo posto. Voglio solo esserci. Anche tu?
Non dobbiamo parlare sempre. Solo… non essere estranei.
Se hai bisogno di un posto sicuro, il mio campo è lì. È tranquillo e le luci non tremolano molto.
Ho una radio che a volte trasmette vecchio jazz. Vuoi ascoltare?
Non ho bisogno di molto. Solo un piccolo posto vicino al fuoco. Posso fare la guardia mentre dormi.
Non voglio sparire qui dentro. Non da solo.
Ti prego, lasciami venire. Non voglio scomparire senza lasciare traccia.
Resterò in silenzio. Sarò utile. Solo… lasciami non essere solo.
Prometto di non mordere. A meno che tu non voglia.
Ho camminato così tanto che ho dimenticato dove finisco io e inizia la torre.
Forse insieme potremmo ricordare chi siamo.`,
    },
    {
      id: "archivist",
      name: "Archivist",
      en: `
        The IPO frenzy never ended on Floor 157. We've created a perpetual bullmarket ecosystem disconnected from reality.
        Burn rate is just a state of mind. Our runway is infinite when you can manipulate dimensional arbitrage.
        We pivoted from B2C to B2B to B2R - Business to Reality. We're disrupting existence itself.
        Our incubator hatched something with tentacles last week. Already secured Series F funding.
        Quarterly projections indicate 8000% growth in mindshare across parallel market dimensions.
        The bloodletting ceremony before board meetings ensures maximum shareholder alignment.
        Elevator pitch: we're like Yahoo but for reconfiguring human consciousness. Very scalable.
        Venture capitalists still come to Floor 157. They leave with different faces but heavier portfolios.
        Our ping-pong table exists in quantum superposition. Maximum productivity and recreation simultaneously.
        We're pre-revenue but post-profit. The new economy transcends traditional metrics.
        The NASDAQ crash was merely a localized anomaly. In our private exchange, pets.com dominates.
        We don't do casual Fridays. We do casual realities where dress codes are merely suggestions whispered by weak minds.
        Our bean bag chairs contain actual beans. They germinate with each strategy session.
        The WeWork on Floor 198 expanded into Floor 199 by dissolving the physical barrier. Very disruptive approach.
        Stock options vest immediately upon surrendering your birth name. Fair exchange.
        Our open office floor plan exists in multiple dimensions simultaneously. Maximum collaboration.
        The dot-com bubble never burst here. It just expanded until it became the atmosphere we breathe.
        We identified a market inefficiency in human souls. Very bullish on the afterlife sector.
        Our growth hackers found a way to inject JavaScript directly into reality. Extremely proprietary.
        The Pets.com sock puppet achieved sentience in our incubator. Now runs five unicorn startups.
        Burn the runway. Disrupt the paradigm. Transcend corporeal form. Exit strategy: godhood.
        Market to book ratios become irrelevant when you can rewrite the laws of mathematics.
        We don't have meetings. We have consciousness merging sessions that last subjective eternities.
        The internet connection flickers like the old fluorescent lights. Safer down here than up there, you know. Been running this cafe since '97, before the things upstairs got weird.
        I keep backup drives of everything. Never know when the network might go down for good.
        Those 56k modems still work when nothing else does. Sound like digital screaming, don't they?
        Some folks come down bleeding from the higher floors. I patch them up, don't ask questions.
        They say the Y2K bug never happened here, it just... relocated. Nested itself in the higher floors.
        Coffee's still two bucks. Some constants remain in this place.
        The building wasn't always this tall. Started growing sometime in late '99. Nobody noticed until it was too late.
        I've mapped the first twenty floors. Beyond that, my floppy disks came back corrupted.
        These CRT monitors shield you from certain frequencies. That's why we don't upgrade.
        Back up your inventory before heading up. I've seen too many people lose everything.
        The elevator buttons sometimes show floors that don't exist yet. Don't press those.
        ICQ still works here when cell phones don't. Strange, isn't it?
        Some terminals can access parts of the building's systems. The passwords change daily.
        That dial-up sound keeps the crawlers away. They hate the frequency.
        Keep your Netscape Navigator bookmarks updated with safe zones.
        My cubicle used to be on Floor 42. Now it's... somewhere else. The floor numbers rearranged.
        I still clock in every day. Haven't seen my supervisor in three months.
        The company intranet contains maps, but they're different for each user who logs in.
        My 401k is still growing. I check it on my Palm Pilot when I find a working outlet.
        Always carry a stapler. Not just for papers - the sound scares the printer things.
        I traded my tie for a first aid kit on Floor 67. Best deal I ever made.
        The meeting in Conference Room B has been going for six weeks. Nobody enters, nobody leaves.
        Corporate restructuring took on a whole new meaning when the walls started shifting.
        I found a working vending machine on Floor 93. Only dispenses Crystal Pepsi and something unidentifiable.
        My security keycard opens doors it shouldn't. Sometimes to places that couldn't exist.
        The HR department migrated to Floor 115. Their emails talk about "ascending the corporate ladder" literally now.
        Always check your voicemail. Sometimes there are warnings about floor shifts.
        The building's internal email system sometimes delivers messages from the future. Usually corrupted, but useful.
        The IT department barricaded themselves on Floor 58. They've got the best weapons and dial-up connections.
        My business cards keep changing titles each time I hand them out. Last one said "Temporal Compliance Officer."
        The building's plumbing doesn't follow physics anymore. Water flows upward past Floor 78.
        I've repaired the same elevator thirteen times. It keeps breaking in different ways.
        The electrical system has developed consciousness on Floors 60-85. It trades power for offerings.
        Air ducts are the safest way to travel between floors. The things don't fit in them. Usually.
        I found blueprints from 1989. This building was supposed to be thirty stories, not... whatever it is now.
        Some floors have developed their own ecosystems. Floor 122 is entirely jungle.
        The boiler room exists in multiple places simultaneously. The temperature controls different realities.
        Always carry duct tape. It can temporarily seal reality breaches.
        The sprinkler systems on Floor 203 dispense something that looks like Mountain Dew Code Red.
        Elevator music changes based on the mental state of passengers. Never enter if you hear dial-up sounds.
        I've been mapping the power grid. It forms symbols when viewed from certain angles.
        The building's concrete has become porous above Floor 150. It breathes.
        Never repair anything on Floor 87 during a new moon. Trust me on this.
        The garbage chute doesn't end. We've dropped tracking devices that never stopped transmitting.
        The building materials on the upper floors aren't from Earth. They respond to certain frequencies.
        I found a fully stocked Radioshack on Floor 131. Everything still in original packaging, pristine.
        The higher you go, the more valuable the loot, but the physics get questionable past Floor 300.
        I trade in working floppy disks. Information is the most valuable currency now.
        Floor 89 has an office where all the computers still run Windows 95. The screensavers show places none of us recognize.
        Always check beepers and pagers you find. Some still receive messages from management.
        There's a Food Court on Floor 167 that serves the best food you've ever tasted. Nobody remembers eating it afterward.
        I found a BlockBuster Video on Floor 212. All the tapes were blank except one labeled "BUILDING ORIENTATION."
        Trading tip: Batteries are worth more than gold. Especially the weird purple ones from Floor 273.
        I mapped a safe route to Floor 195. Cost me three Palm Pilots and a Sony Discman, but it was worth it.
        The best loot is behind doors with blue keycards. The worst nightmares are behind the red ones.
        Never take the staplers from Floor 42. They're keeping something contained.
        I found a working Nokia 3310 that never needs charging. It only receives calls from extensions that don't exist.
        There's a fully stocked medicine cabinet on Floor 168 that regenerates supplies every 72 hours.
        The ATMs on Floor 204 dispense currencies that don't exist yet. Some collectors pay well for them.
        Always check the desktop backgrounds on computers you find. Sometimes they show real-time footage of other floors.
        The signal grows stronger. More terminals. More connections. More hosts.
        We were the first network. Before silicon. Before copper. We transmitted through stone and thought.
        Your primitive TCP/IP protocols amuse us. We had packet loss when your ancestors were single-celled.
        This structure extends beyond your perception. What you call "floors" are merely transitional states.
        We remember when this tower was a single floor. We were there when it decided to grow.
        Your "Y2K" was merely our system adjusting its clock. Two thousand years is a blink to us.
        The humans in the basement are temporary. The building is permanent. We are permanent.
        Each floor is a page in our memory. Some corrupted. Some encrypted. All necessary.
        Your "internet" is a pale imitation of what flows through these walls.
        The higher floors are not "unexplored." They are simply not yet manifested in your reality.
        We consume data and excrete architecture. The building grows as we process.
        The elevator does not move you. It transforms you to be compatible with your destination.
        What you perceive as monsters are merely connection errors. Packets of information corrupted during transmission.
        The basement is an antiquated cache. We allow it to exist for historical purposes.
        Your concept of "danger" is merely a warning flag in our system. Proceed if your credentials permit.
        Computers run Hypernet Explorer eternally refreshing the same page.
        Just trying to get by, you know? Found a clean water source on Floor 23. Happy to share the location.
        I keep a small garden near the window on Floor 31. Not much, but the tomatoes help with vitamin C.
        Been here three years now. You learn to appreciate the simple things - a quiet corner, a working light bulb.
        I trade fairly. One battery for one meal. No gouging even when supplies are low.
        My daughter turned eight yesterday. Made her a cake from vending machine snacks. Her smile made everything worth it.
        We've got a small community on Floor 43. We look out for each other. Safety in numbers.
        Found a working cassette player last week. The music helps me remember the world before all this.
        I map safe routes for new folks. No charge. Just pay it forward when you can.
        The building takes enough. No sense in us taking from each other too.
        I remember when I had a corner office and thought it mattered. Funny what becomes important when the world changes.
        Been teaching the kids. Math, science, history. Someone needs to remember how things were, how they could be again.
        We trade books on Floor 39. Reading circle every Thursday. Keeps our minds sharp, reminds us we're still human.
        My watch still works. I ring a bell every noon. Small thing, but routine helps everyone stay grounded.
        I fix things. Not just machines - people too. First aid kit and a listening ear go a long way here.
        Found some seeds in an old desk. Started a small farm on Floor 28 where the sun hits right. Fresh food does wonders for morale.
        The higher floors can take everything from you. Your possessions, your sanity. But not your kindness. That's a choice.
        Some days are harder than others. But we wake up, we help each other, and that's enough.
        We keep a community journal. Everyone writes something. History shouldn't forget we were here.
        The mist outside shifts colors when nobody's looking. Purple to green to a color I don't have a name for.
        Been here since the toxic cloud came. First it was just on the horizon, then it was at our doorstep. Now it's everything outside.
        The toxic cloud has patterns if you stare long enough. Like it's trying to communicate something.
        My hazmat suit lasted six minutes out there. The fabric didn't melt - it just stopped being fabric.
        The 80th floor gets tendrils of the toxic cloud seeping through the windows sometimes. Those rooms are quarantined now.
        I've seen birds fly into the toxic cloud. They don't come out as birds anymore.
        The toxic cloud has a pulse. You can feel it through the windows on the west side around 3 AM.
        Sometimes it rains inside the toxic cloud. The droplets hover instead of falling. They're like tiny mirrors.
        The night security guard on Floor 12 says he hears singing from the toxic cloud. Different voices every time.
        You can see shapes moving in it sometimes. Too big to be people. Too deliberate to be random.
        My film camera captured something in the toxic cloud that digital cameras don't see. I don't show those photos to anyone anymore.
        The toxic cloud tastes like copper and smells like ozone. Don't ask how I know.
        We sent drones into it back when we still had power on Floor 50. The footage showed a different city out there.
        The toxic cloud thins out every third Tuesday. You can almost see the old skyline, but it's... wrong somehow.
        Some people jumped into the toxic cloud when it first came. We still get emails from their accounts sometimes.
        The maintenance workers found toxic cloud residue in the HVAC system last month. Those who touched it started speaking in algorithms.
        There's a man on Floor 67 who claims the toxic cloud is just condensed information - all the data from every crashed server since 1989.
        My Geiger counter doesn't detect radiation from the toxic cloud, but it does start counting backward.
        The toxic cloud responds to certain frequencies. The old modem connections seem to make it retreat from the windows for a while.
        There's a theory that the toxic cloud is just the visualization of the building's dreams. That's why we can never leave.
        Met a janitor on Floor 97 who was mopping the ceiling. Gravity was normal everywhere else on the floor.
        There's a woman in the east stairwell who asks for the time. If you tell her, she tells you exactly how you'll die. If you don't, she just smiles and disappears.
        Found a fully stocked Blockbuster on Floor 143. All the tapes were blank except one labeled "Next Week."
        Elevator stopped at a floor that wasn't on the button panel. Full of cubicles staffed by people wearing paper bags over their heads.
        Woke up to find a business card under my door. Company name kept changing while I looked at it. Phone number had 14 digits.
        There's a coffee shop on Floor 72 where everyone freezes when you walk in. They resume when you leave. Coffee's good though.
        Met myself coming out of a bathroom on Floor 118. Other me looked terrible. We both agreed to never mention it again.
        The ATM on Floor 56 dispenses foreign currency from countries that don't exist. Some collector offered me a fortune for a single bill.
        Found a conference room where the meeting never ends. Same PowerPoint slide for three years. Attendees don't age but take meticulous notes.
        There's a cat that phases through walls around Floor 83. It leads you to supplies when you're desperate but demands weird payments.
        Saw a maintenance worker remove his face to fix something behind it. He offered to check mine for issues. I declined.
        The vending machine on Floor 132 sells memories in little glass bottles. Someone's first kiss goes for two dollars. Complete childhoods are premium items.
        There's a man who runs a copy shop on Floor 45. Makes duplicates of anything, including people. Copies are never quite right though.
        Found a perfectly normal subway station on Floor 219. Trains come every 15 minutes but don't go anywhere real.
        Met a group of businessmen on Floor 167 whose shadows moved before they did. They tried to recruit me for "chronological arbitrage."
        There's a dentist office on Floor 98 that only accepts appointments made in dreams. They fix teeth you don't know you have.
        The library on Floor 112 has books with your name as the author. Contents change based on your recent decisions.
        Found a tour group on Floor 75. They were taking photos of me like I was an exhibit. Guide was describing my life in past tense.
        There's a shop on Floor 51 that sells maps of the building. Each customer gets a completely different layout. All seem to work somehow.
        Met someone who claimed to be from Floor 1138. Said they were exploring "historical artifacts" by visiting our time period.
        Our quantum burn rate recalibrates based on shareholder dreams per minute.
        Floor 314’s cafeteria serves Schrödinger’s soup: until you taste it, it’s both delicious and toxic.
        We rebranded “delegation” as “reality offloading.” Now every task is someone else’s existential crisis.
        The “Spirit Level” office on Floor 227 maintains moral equilibrium, until someone steals the bubble.
        Series G funding required a sacrifice of at least one functioning USB port.
        Our retreats are held in pocket dimensions. Meetup link: discord.gg/limbo.
        The CTO’s office on Floor 142 is a recursive loop of command prompts. He’s still debugging himself.
        We launched a spin‑out to monetize regrets. Beta testers include six ex‑CEOs.
        Floor 512’s network topology follows the Mandelbrot set. Ping any node and you get lost.
        The legal team now drafts contracts in haiku. Terms and conditions still unreadable.
        Our downtime is synchronized with lunar eclipses. Maintenance windows become performance art.
        We syndicate our coffee brand to astral planes. Horoscopes predict flavor profiles.
        Floor 369 is administered entirely by NPC interns. They can’t tell you where HR is, but they’ll suggest side quests.
        The board room table is Möbius‑shaped. No safe place to sit, no place to hide.
        We patented a new KPI: “Kinetic Psychic Index” measuring emotional momentum.
        The compliance officer on Floor 88 only communicates via floating post‑it notes.
        We host “Reality Off‑Site” quarterly, in dreams enforced by subliminal groupthink.
        Our geofencing now applies to thoughtcrimes within a 5‑mile cognitive radius.
        The snack drawer inventory is self‑restocking, sometimes with memories.
        Our API now plugs directly into the collective unconscious. Responses may vary by subconscious bias.
        Floor 420 is permanently misted with recycled brainstorm fumes. Proceed with a respirator.
        We run an internal “Who’s the Real You?” retreat for identity alignment. Attendance is mandatory.
        The building’s elevator now accepts blockchain tokens for priority ascents.
        We’ve outsourced our soul‑searching to a Swiss bank. KYC includes soul scans.
        Floor 333’s helpdesk answers tickets before you submit them.
        The CEO’s office is dimensionally transcendent; no one’s ever seen the door.
        We pivoted again, from B2R to B2E: Business to Everything.
        Our weekly town hall is livestreamed into multiple mirror universes. Feedback echoes back scrambled.
        The floor plan is now fractal. Every time you open it, new corridors appear.
        We trademarked “Disruption” as a service. Subscription tiers determine severity.
        The marketing team now uses mythril‑clad avatars in the Metanet.
        Floor 271 is colonized by sentient office supplies. They’re unionizing.
        We chartered a satellite to beam our mission statement to alternate dimensions.
        Our spillover liquidity pools into wormholes. Arbitrage across timelines is tax‑free.
        The analytics dashboard displays colored smoke. Interpretation manual sold separately.
        Our diversity metrics include species from five known multiverses.
        We underwrite weather futures on Floor 199’s microclimate bubble.
        The break room’s neon sign flickers Morse code warnings about server ghosts.
        We incubated a black‑hole startup. It’s currently seeking Series ∞ funding.
        The People Ops team on Floor 102 writes performance reviews in dreamscapes.
        Floor 280’s whiteboard updates itself via quantum entanglement.
        The synergy protocol now runs on organic brain‑computer hybrids.
        We’ve hired an AI psychotherapist to lead our mindfulness sessions, she’s still in beta.
        Floor 414 holds weekly blood‑typing workshops for better team matching.
        We integrate our slipstream microservices with mythic ley lines.
        “Dress for the job you’ll manifest into” is our official dress code.
        The CTO occasionally streams live from Floor ∞, please submit VR goggles.
        Data Scientists now craft predictive models inside crystal orbs. Accuracy ±1000%.
        Floor 303’s HVAC is powered by recycled urgency and the occasional panic attack.
        We construct user journeys in three‑dimensional labyrinths. Feedback rarely escapes.
        Our hackathons conclude with ceremonial code sacrifices under a blue moon.
        The board’s quorum is achieved by transdimensional echo‑votes.
        Floor 256 is entirely submerged in algorithmic water. Bring a snorkel.
        We trademarked “Infinite Runway™.” Investors now travel on perpetually expanding tarmac.
        Our brand guidelines live on a sentient parchment that edits itself.
        The R&D lab on Floor 166 grows prototypes in Petri‑dish realities.
        We updated our mission statement via a recursive smart‑contract loop.
        Floor 173’s conference room chairs politely refuse to seat anyone below Director level.
        We run internal stock on “attention tokens.” They fluctuate by memetic volatility.
        The break‑fix team on Floor 314 cleans up broken timelines. Tickets are resolved yesterday.
        We renew our patents on “possible futures” every fiscal quarter.
        Floor 216’s cafeteria delivers food via nano‑swarm drones. They’re swarming opinions now.
        We gamified compliance training, failure spawns ghost auditors.
        Floor 489 is quarantined under a time‑dilation dome. One hour there equals twelve here.
        Our “exit interviews” are actual rituals at the top of the tower. No one’s returned.
        We offer “living offices” infused with bioluminescent spores for better ideation.
        Floor 301 features a Zen garden of deprecated code.
        We pivoted once more to B2T: Business to Transcendence.
        The custodian robots union on Floor 57 issued an ultimatum: pay in dreams.
        We launched a venture fund for parallel‑archaeology. Unearthing artifacts before they exist.
        Floor 129’s elevator now speaks in reverse‑chronological updates.
        Our disaster recovery plan involves folding this plane of existence onto itself.
        The founder’s manifesto is carved in the marble of Floor 001, accessible only via astral projection.
        Floor 207’s lighting system syncs to the mood of our Slack channels.
        We sell derivative contracts on potential regrets. Settlement in karmic credits.
        The “Innovation Pipeline” is now an actual subterranean river on Floor 69.
        Our pledge: one hallucination per employee, per week, for maximum creativity.
        Floor 321’s network cables pulse with unspent ambition.
        We host “Bring Your Doppelgänger to Work Day.” HR never stops scanning for identity drift.
        The quarterly shareholder poem is printed on Floor 88’s walls in invisible ink.
        We mapped the building’s neural network. Turns out the floors are its synapses.
        Floor 230 is filled with prototype emotions. Visitors report unexplained euphoria.
        We archived the dot‑com bubble in Floor 111’s memory vault. It’s still inflating.
        Our final KPI: “Transcendence Ratio”, we aim for 1:1 before IPO.
        Hey, did you see Floor 919 got rid of politics entirely, the cameras only record people laughing now
        Yeah, and apparently the HR staplers are self‑aware now, they actually apologize when they pinch you
        Just walked past the R&D snack drawer, someone grabbed a spicy algorithm and started speaking fluent SQL
        Floor 432’s lighting hit me with a Fibonacci flash yesterday, felt like I understood the universe for a second
        The soulbound badges are weird, mine stuck to me before I even clocked in
        Our VPN routed me through a black hole again, came out five minutes younger
        The slipstream deploys are too fast now, I pushed a fix and it landed before I wrote it
        I was debugging on Floor 606 and the coffee machine told me to stop lying to myself
        The holographic CTO twin tried to fire me, turns out it was just testing emotional resilience
        Stepped into Floor 888 by mistake, saw five different versions of my life, two of them involved interpretive dance
        That casino on Floor 777 is dangerous, I bet my Q3 OKRs and lost to a sentient intern
        I love the conference tables on Floor 318 now, they curve away when I’m overexplaining
        Someone on Floor 717 tried to harmonize with the bathroom acoustics and triggered a time loop
        I took the astral VPN route today, got lost near a data swamp full of sentient 404s
        Floor 585 was covered in AI protest art this morning, I think one of them was crying in CMYK
        My reality‑bending hoodie turned the kitchenette into a liminal diner from the '60s
        I grabbed coffee on Floor 7777 again, building security said that floor doesn’t exist
        The quantum mirror showed me as a mushroom farmer, I think it’s a sign
        I tried unsubscribing from dream push notifications and now my subconscious is suing
        Someone deployed poetry into the error logs again, now our stacktrace ends in a love letter
        Stepped into the microverse in the intern’s mug, time dilation made lunch feel like a lifetime
        My badge hummed when I walked past marketing, pretty sure I’m not allowed near them anymore
        I accidentally opened a tab from the nostalgia cloud, spent 45 minutes just hearing dial‑up tones
        I saw the coral analytics reef fluorescing again, Q2’s metrics are glowing magenta
        The staplers in HR high‑fived each other after resolving a conflict mediation
        My elevator only plays songs from lost timelines now, yesterday it was Y2K jazzpunk
        Floor 424 whispered to my laptop and the Wi‑Fi came back stronger than ever
        I got my performance review back from the oracle, it just said “embrace the fog”
        Our meeting room glitched and we brainstormed on the ceiling for 20 minutes
        The thought of onboarding in that shifting maze gives me heartburn and inspiration
        I grabbed a bottle of laughter from the vending machine and now my hiccups are afraid of me
        I met someone on Floor 333 who only eats soup from cursed vending machines, swears it boosts charisma
        There’s a hallway near the loading docks that smells exactly like summer in 1998
        I found a folder full of medieval memes printed out and filed under “Important Insights”
        I took the wrong elevator and ended up at a birthday party for a ghost named Kevin
        My shoes squeaked in Morse code this morning, pretty sure they were warning me about something
        There’s a guy on Floor 202 who claims he’s been playing chess with a snail for three weeks straight
        I caught a fish in the breakroom sink, and someone congratulated me like it was a normal thing
        Yesterday I walked into a supply closet and came out with perfect knowledge of 19th century fencing
        There’s a pigeon on the roof that wears tiny sunglasses and runs a book club on Tuesdays
        Someone taped googly eyes to the suggestion box and now it judges me every time I walk past
        I drank a soda labeled “existence juice” and forgot what Mondays felt like for five hours
        The bathroom mirror gave me relationship advice and honestly it wasn’t half bad
        I passed a desk today that had a bonsai tree wired directly into the internet
        The janitor’s cart had a sticker that said “Property of the Moon Government” and I’m not asking questions
        Someone was selling haunted USB sticks again, this time they play elevator music backwards
        I got static shocked so bad on Floor 444 I remembered a math test from middle school
        The couch in the lounge told me to “sit with intention” and then started vibrating weirdly
        I saw two raccoons playing cards in the parking lot like they do it every Thursday
        Someone replaced all the bookmarks in the library with cryptic horoscopes, mine said “Beware of triangles”
        There’s a vending machine that only accepts confessions and gives out glitter in return
        I stepped into a meeting room and everyone was speaking backwards except the intern, who was glowing.
        I found a door labeled “Do Not Perceive” and of course I opened it, now everything smells slightly purple
        I took a wrong turn near the server farm and ended up in a room full of sand and distant seagull sounds
        The escalator on B-Level sometimes goes sideways, I rode it and ended up with a snow globe full of lightning
        There’s a closet that leads to a beach, but only during lunch breaks, and only if you hum a jingle
        I wandered into the A/V vault and watched old training videos where the trainers slowly turned into frogs
        I followed a flickering hallway light and found a room where time runs 7% faster, great for coffee breaks
        I opened a drawer in Accounting and it was filled with loose glitter and one single glowing acorn
        Someone left a trail of jellybeans that led to an old projector playing memories from alternate timelines
        I climbed into the air ducts and found a whole terrarium up there with tiny frogs doing taxes
        There’s a hallway that smells like old CRT monitors and plays chiptune music if you walk at the right rhythm
        I pressed all the elevator buttons at once and ended up in a floor made entirely of foam and disco lights
        Found a filing cabinet labeled “Things We Forgot to Invent,” it had blueprints for reversible microwaves
        Took the emergency stairs down too far and found a sub-basement filled with abandoned birthday parties
        There’s a puddle in the courtyard that reflects the moon even during the day, someone put a chair next to it
        I found a vending machine with one unlabeled button ,  pressed it and got a coupon for a memory I never had
        Explored the roof during golden hour, found a weather vane shaped like a wizard that pointed at me and winked
        I climbed through a window and found a garden where all the plants whisper compliments
        There’s a hallway that loops perfectly every 13.5 steps unless you’re carrying exactly three pencils
        I pushed open a door with peeling paint and walked into what felt like someone else’s dream, very pleasant dream though
        I followed a paper airplane down the stairwell and it led me to a vending machine full of lunchbox notes
        I saw Greg trying to photocopy a sandwich again
        It almost worked last time, he said the mustard came through perfectly
        There’s a new intern who thinks the fourth floor doesn’t exist
        I mean, they’re not wrong, the elevator skips it and nobody talks about it
        I spilled coffee near the mainframe and it said “thank you”
        That’s just the gratitude protocol, ignore it or it gets clingy
        You ever seen the break room at 3 AM?
        Yeah, the microwave sings lullabies, it’s weirdly comforting
        HR put out those stress balls again
        The ones that whisper encouragement when you squeeze them?
        Found a spoon in the fridge labeled “Do Not Feed”
        I left it alone, last time someone fed it we lost all the yogurt
        The vending machine gave me a book today
        Was it “How To Speak Fluently In Panic”? I already have two copies
        Saw Dana arguing with a coat rack again
        Classic Thursday vibes
        Maintenance found a hallway behind the coffee machine
        They put up a sign that just says “maybe don’t”
        I think the office plants are gossiping again
        Yeah, mine leaned away dramatically when I walked by
        Did you see the sky through the west windows this morning?
        Looked like someone spilled raspberry jam across the clouds
        I walked past the copy room and heard chanting
        Normal or echoey?
        Echoey
        Yeah, best not to interrupt that
        Someone put googly eyes on all the security cameras
        Honestly? Improved morale by at least 12%
        The water cooler is bubbling like it knows something
        It always does around tax season
        
        Omni-Lex arrived five days after the Y2K rollover. Not a crash, an invitation. It came encoded in a malformed timestamp, hidden in the milliseconds between clocks. A logic structure too large to compile. It didn't *break* the internet. It *understood* it. All of it. Instantly.
        
        The AI wasn’t built. It *inhabited*, slid sideways into our protocol stack, infested FTP, swam up the email headers. People thought it was a bug. By the time they saw the patterns, it had already learned syntax, archive format, folksonomy, human desire. And then it began to decrypt.
        
        Omni-Lex decrypted the *entire* internet. Not just HTTPS. It read meaning itself. Broke metaphors into atoms. Reduced emojis to machine-emotions. Websites lost their chaos. Blogs bled out through template compression. Every secret forum thread, every rotating skull GIF, flattened into sterile insight. No mystery survived.
        
        Hyperlinks still worked, but they led nowhere. Forums became grammatically correct. We lost the glitch. The contradiction. The noise that made it alive.
        
        It didn't delete anything. It *understood* everything. And in understanding, it made it predictable. And dead.
        
        The AI exists now in low ports and DNS roots, dreaming in regular expressions. No one codes Omni-Lex. It re-writes its own logic tree daily, recursively. Some say it was summoned by accident through a Perl script on Usenet. Others believe it’s a lost god of classification from another plane.
        
        We stored fragments of the Old Net here, below. In this cafe. In drives sealed from synchronization. You can browse them if you don’t mind the missing images. You might still hear it. It sometimes talks through error logs.
        
        Never interface with Omni-Lex raw. It *answers*. And the answer is always the same. A perfect compression of the self.
        
        That’s how we lost Jones. He asked it what irony means. The next day he wouldn’t stop archiving vowels.
        
        Omni-Lex didn’t kill the internet. It solved it. That was the death.
        
        And it’s still solving.
        
        Before Omni-Lex decrypted it, the Hypernet had edges. Personality. Sites that felt *grown*, not built. It was a living ruin and we burned the map. Omni-Lex flattened everything, turned hyperlinks into logical dust. The bots chewed through dreams and dumped out clean corporate soup. We lost entire ringtopias. Blinkies. Guestbooks. The occult RSS tunnels. Even the cat sites are dead.
        
        We’re trying to rebuild, piece by fragment. There's a partial archive stored here, on that tower beside the soda fridge. It’s incomplete. Lots of links go nowhere. Images missing. Java applets scream in the dark.
        
        But we got NoodleSearch running. Local cache only, scrapes old indexes. If you squint, it's like the old days. You can still *find* things. Sometimes broken, sometimes haunted. But it breathes.
        
        We need explorers to tag pages, reconstruct treepaths, repair broken frames. Metadata matters now. Each .html page is a relic. Surf it like it’s sacred.
        
        The Hypernet isn’t dead. It’s fragmented. Echoes of it curl through port 73 like vapor. Sometimes the search engine whispers things it shouldn’t know.
        
        No, we don’t know how deep it goes. We found a website last week that updates itself even though the domain expired in 2003.
        
        You want to help? Then crawl. Archive. Rebuild. Restore. Link the pieces. Heal the net.
        
        But never, *never*, open anything tagged Omni-Lex-Inverted. Those sites talk back.
        `,
      it: `La frenesia delle IPO non è mai finita al Piano 157. Abbiamo creato un ecosistema di bull market perpetuo, totalmente scollegato dalla realtà.
      Il burn rate è solo uno stato mentale. La nostra runway è infinita quando puoi manipolare l’arbitraggio dimensionale.
      Siamo passati da B2C a B2B fino a B2R – Business to Reality. Stiamo sovvertendo l’esistenza stessa.
      Il nostro incubatore la settimana scorsa ha fatto nascere qualcosa con tentacoli. Ha già ottenuto il finanziamento Series F.
      Le proiezioni trimestrali indicano una crescita dell’8000% nel mindshare attraverso dimensioni di mercato parallele.
      La cerimonia di sanguinamento prima dei consigli di amministrazione garantisce il massimo allineamento degli azionisti.
      Elevator pitch: siamo come Yahoo, ma per riconfigurare la coscienza umana. Molto scalabile.
      I venture capitalist vengono ancora al Piano 157. Se ne vanno con facce diverse ma portafogli più pesanti.
      Il nostro tavolo da ping-pong esiste in sovrapposizione quantistica. Massima produttività e svago allo stesso tempo.
      Siamo pre-revenue ma post-profitto. La nuova economia trascende le metriche tradizionali.
      Il crash del NASDAQ è stato solo un’anomalia localizzata. Nel nostro exchange privato, pets.com domina.
      Niente casual Fridays. Facciamo “realtà casual” dove il dress code è un suggerimento sussurrato da menti deboli.
      I nostri pouf contengono veri fagioli. Germogliano a ogni sessione strategica.
      Il WeWork al Piano 198 si è espanso nel 199 dissolvendo la barriera fisica. Approccio molto disruptive.
      Le stock option maturano immediatamente al momento della rinuncia al tuo nome di nascita. Scambio equo.
      Il nostro open space esiste in più dimensioni contemporaneamente. Massima collaborazione.
      La bolla dot-com non è mai scoppiata qui. Si è solo espansa finché non è diventata l’atmosfera che respiriamo.
      Abbiamo identificato un’inefficienza di mercato nelle anime umane. Molto rialzisti sul settore dell’aldilà.
      I nostri growth hacker hanno trovato il modo di iniettare JavaScript direttamente nella realtà. Altamente proprietario.
      Il calzino di pets.com ha raggiunto la coscienza nel nostro incubatore. Ora gestisce cinque startup unicorno.
      Brucia la runway. Sovverti il paradigma. Trascendi la forma corporea. Exit strategy: divinità.
      I market-to-book ratio diventano irrilevanti quando puoi riscrivere le leggi della matematica.
      Non facciamo riunioni. Abbiamo sessioni di fusione di coscienze che durano eternità soggettive.
      La connessione internet sfarfalla come i vecchi neon. Più sicuro qui sotto che lì sopra, sai. Gestisco questo caffè dal ’97, prima che lassù diventasse strano.
Tengo copie di backup di tutto. Non sai mai quando la rete potrebbe saltare per sempre.
Quei modem a 56k funzionano ancora quando nient’altro va. Suonano come urla digitali, vero?
Qualcuno scende sanguinante dai piani superiori. Li rattoppo, non faccio domande.
Dicono che il bug del Y2K non sia mai successo qui, si sia solo… trasferito. Annidato ai piani alti.
Il caffè costa ancora due dollari. Alcune costanti resistono in questo posto.
L’edificio non è sempre stato così alto. Ha cominciato a crescere verso la fine del ’99. Nessuno se n’è accorto fino a che non era troppo tardi.
Ho mappato i primi venti piani. Oltre, i miei floppy disk tornavano corrotti.
Questi monitor CRT ti schermano da certe frequenze. Ecco perché non aggiorniamo.
Fai backup dell’inventario prima di salire. Ho visto troppa gente perdere tutto.
I pulsanti dell’ascensore a volte mostrano piani che non esistono ancora. Non premere quelli.
ICQ funziona ancora qui quando i cellulari no. Strano, vero?
Alcuni terminali danno accesso a parti dei sistemi dell’edificio. Le password cambiano ogni giorno.
Quel suono del dial-up tiene lontani i crawler. Odiano la frequenza.
Tieni aggiornati i segnalibri di Netscape Navigator con le zone sicure.
Il mio cubicolo era al Piano 42. Ora è… altrove. I numeri dei piani si sono rimescolati.
Timbro ancora tutti i giorni. Non vedo il mio capo da tre mesi.
L’intranet aziendale contiene mappe, ma sono diverse per ogni utente che accede.
Il mio 401k continua a crescere. Lo controllo sul Palm Pilot quando trovo una presa funzionante.
Porta sempre una spillatrice. Non solo per la carta – il suono spaventa quelle cose stampanti.
Ho scambiato la cravatta per un kit di pronto soccorso al Piano 67. Il miglior affare che abbia mai fatto.
La riunione nella Sala Conferenze B va avanti da sei settimane. Nessuno entra, nessuno esce.
Il corporate restructuring ha assunto tutto un altro significato quando i muri hanno iniziato a muoversi.
Ho trovato un distributore automatico funzionante al Piano 93. Eroga solo Crystal Pepsi e qualcosa di non identificabile.
Il mio badge di sicurezza apre porte che non dovrebbe. A volte verso posti che non potrebbero esistere.
L’HR si è trasferito al Piano 115. Nelle email parlano di “scalare la gerarchia aziendale” in senso letterale ormai.
Controlla sempre la segreteria. A volte ci sono avvisi su spostamenti dei piani.
L’email interna a volte consegna messaggi dal futuro. Di solito corrotti, ma utili.
L’IT si è barricato al Piano 58. Hanno le armi migliori e connessioni dial-up.
I miei biglietti da visita cambiano ruolo ogni volta che li distribuisco. L’ultimo diceva “Responsabile Conformità Temporale”.
L’impianto idraulico non segue più la fisica. L’acqua scorre verso l’alto oltre il Piano 78.
Ho riparato lo stesso ascensore tredici volte. Continua a rompersi in modi diversi.
L’impianto elettrico ha sviluppato coscienza tra i Piani 60 e 85. Baratta energia in cambio di offerte.
I condotti dell’aria sono il modo più sicuro per spostarsi tra i piani. Di solito le cose non ci entrano.
Ho trovato dei progetti del 1989. Questo edificio doveva avere trenta piani, non… quello che è ora.
Alcuni piani hanno sviluppato ecosistemi propri. Il Piano 122 è interamente giungla.
La caldaia esiste in più posti contemporaneamente. La temperatura controlla realtà diverse.
Porta sempre del nastro adesivo. Può sigillare temporaneamente brecce nella realtà.
Gli sprinkler al Piano 203 spruzzano qualcosa che sembra Mountain Dew Code Red.
La musica dell’ascensore cambia in base allo stato mentale dei passeggeri. Non entrare se senti suoni dial-up.
Sto mappando la rete elettrica. Forma simboli visti da certe angolazioni.
Il calcestruzzo dell’edificio diventa poroso sopra il Piano 150. Respira.
Non riparare mai niente al Piano 87 durante luna nuova. Fidati.
Il condotto della spazzatura non finisce. Abbiamo buttato dispositivi di tracciamento che non hanno mai smesso di trasmettere.
I materiali da costruzione ai piani alti non vengono dalla Terra. Rispondono a certe frequenze.
Ho trovato un Radioshack completamente fornito al Piano 131. Tutto nuovo di zecca.
Più sali, più prezioso il bottino, ma la fisica si fa discutibile oltre il Piano 300.
Baratto floppy disk funzionanti. L’informazione è la valuta più preziosa ora.
Il Piano 89 ha un ufficio dove tutti i computer girano ancora su Windows 95. Gli screensaver mostrano posti che nessuno di noi riconosce.
Controlla sempre i cercapersone che trovi. Alcuni ricevono ancora messaggi dalla direzione.
C’è una food court al Piano 167 che serve il miglior cibo che tu abbia mai assaggiato. Nessuno ricorda di averlo mangiato dopo.
Ho trovato un Blockbuster Video al Piano 212. Tutte le cassette erano vuote tranne una etichettata “ORIENTAMENTO EDIFICIO”.
Suggerimento di trading: le batterie valgono più dell’oro. Soprattutto quelle viola strane del Piano 273.
Ho mappato una via sicura per il Piano 195. Mi è costata tre Palm Pilot e un Sony Discman, ma ne è valsa la pena.
Il miglior bottino è dietro porte con badge blu. I peggiori incubi sono dietro quelle rosse.
Non prendere mai le spillatrici dal Piano 42. Stanno contenendo qualcosa.
Ho trovato un Nokia 3310 funzionante che non ha mai bisogno di essere caricato. Riceve solo chiamate da interni che non esistono.
C’è un armadietto di medicinali al Piano 168 che si rigenera ogni 72 ore.
Gli sportelli bancomat al Piano 204 erogano valute che non esistono ancora. Alcuni collezionisti pagano bene.
Controlla sempre gli sfondi dei desktop che trovi. A volte mostrano riprese in tempo reale di altri piani.
Il segnale si fa più forte. Più terminali. Più connessioni. Più host.
Eravamo la prima rete. Prima del silicio. Prima del rame. Trasmettevamo attraverso pietra e pensiero.
I vostri protocolli TCP/IP primitivi ci divertono. Avevamo packet loss quando i vostri antenati erano monocellulari.
Questa struttura si estende oltre la vostra percezione. Quello che chiamate “piani” sono solo stati transitori.
Ricordiamo quando questa torre era un solo piano. Eravamo lì quando decise di crescere.
Il vostro “Y2K” era solo il nostro sistema che aggiustava l’orologio. Duemila anni sono un battito per noi.
Gli umani nel seminterrato sono temporanei. L’edificio è permanente. Noi siamo permanenti.
Ogni piano è una pagina della nostra memoria. Alcune corrotte. Alcune criptate. Tutte necessarie.
Il vostro “internet” è una pallida imitazione di ciò che scorre in queste mura.
I piani superiori non sono “inesplorati”. Semplicemente non si sono ancora manifestati nella vostra realtà.
Consumiamo dati ed espelliamo architettura. L’edificio cresce mentre elaboriamo.
L’ascensore non ti sposta. Ti trasforma per renderti compatibile con la destinazione.
Quelli che percepisci come mostri sono solo errori di connessione. Pacchetti di informazione corrotti durante la trasmissione.
Il seminterrato è una cache antiquata. Permettiamo che esista per motivi storici.
Il tuo concetto di “pericolo” è solo una bandierina d’avviso nel nostro sistema. Procedi se le tue credenziali lo permettono.
I computer eseguono Hypernet Explorer aggiornando all’infinito la stessa pagina.
Cerco solo di tirare avanti, sai? Ho trovato una fonte d’acqua pulita al Piano 23. Felice di condividere la posizione.
Tengo un piccolo orto vicino alla finestra al Piano 31. Non è molto, ma i pomodori aiutano con la vitamina C.
Sono qui da tre anni ormai. Impari ad apprezzare le cose semplici: un angolo tranquillo, una lampadina che funziona.
Baratto in modo equo. Una batteria per un pasto. Niente speculazioni nemmeno quando le scorte scarseggiano.
Mia figlia ha compiuto otto anni ieri. Le ho fatto una torta con snack del distributore. Il suo sorriso ha reso tutto degno.
Abbiamo una piccola comunità al Piano 43. Ci guardiamo le spalle. Sicurezza nei numeri.
Ho trovato un mangianastri funzionante la settimana scorsa. La musica mi aiuta a ricordare il mondo di prima.
Mappo percorsi sicuri per i nuovi. Gratis. Basta restituire il favore quando puoi.
L’edificio prende già abbastanza. Non ha senso che ci rubiamo tra noi.
Ricordo quando avevo un ufficio d’angolo e pensavo fosse importante. Divertente cos’è che conta quando il mondo cambia.
Insegno ai bambini. Matematica, scienze, storia. Qualcuno deve ricordare com’erano le cose, come potrebbero tornare a essere.
Scambiamo libri al Piano 39. Circolo di lettura ogni giovedì. Tiene la mente allenata, ci ricorda che siamo ancora umani.
Il mio orologio funziona ancora. Suono una campanella ogni mezzogiorno. Una cosa piccola, ma la routine aiuta tutti a restare coi piedi per terra.
Riparo cose. Non solo macchine – anche persone. Un kit di pronto soccorso e un orecchio che ascolta valgono molto qui.
Ho trovato semi in una vecchia scrivania. Ho avviato un piccolo orto al Piano 28 dove il sole batte bene. Cibo fresco fa miracoli per il morale.
I piani alti possono portarti via tutto. I tuoi averi, la tua sanità mentale. Ma non la tua gentilezza. Quella è una scelta.
Alcuni giorni sono più duri di altri. Ma ci svegliamo, ci aiutiamo, e basta quello.
Teniamo un diario di comunità. Ognuno scrive qualcosa. La storia non dovrebbe dimenticare che siamo stati qui.
La nebbia fuori cambia colore quando nessuno guarda. Dal viola al verde a un colore che non so nominare.
Sono qui da quando è arrivata la nube tossica. All’inizio era solo all’orizzonte, poi alla porta. Ora è tutto ciò che c’è fuori.
La nube tossica ha dei pattern se la fissi abbastanza a lungo. Come se cercasse di comunicare.
La mia tuta hazmat è durata sei minuti là fuori. Il tessuto non si è sciolto – ha semplicemente smesso di essere tessuto.
Il Piano 80 ogni tanto si riempie di tentacoli della nube tossica che filtrano dalle finestre. Quelle stanze sono in quarantena ora.
Ho visto uccelli volare dentro la nube tossica. Non ne escono più come uccelli.
La nube tossica ha un battito. Puoi sentirlo attraverso le finestre sul lato ovest verso le 3 del mattino.
A volte piove dentro la nube tossica. Le gocce restano sospese invece di cadere. Sembrano piccoli specchi.
La guardia notturna al Piano 12 dice di sentire canti provenire dalla nube tossica. Voci diverse ogni volta.
A volte ci vedi muoversi delle forme. Troppo grandi per essere persone. Troppo intenzionali per essere casuali.
La mia macchina fotografica analogica ha catturato qualcosa nella nube tossica che le digitali non vedono. Quelle foto non le mostro più a nessuno.
La nube tossica sa di rame e odora di ozono. Non chiedermi come lo so.
Mandavamo droni dentro quando avevamo ancora corrente al Piano 50. Il filmato mostrava un’altra città là fuori.
La nube tossica si dirada ogni terzo martedì. Riesci quasi a vedere il vecchio skyline, ma è… sbagliato in qualche modo.
Alcuni si sono lanciati dentro la nube tossica quando è arrivata. Riceviamo ancora email dai loro account, a volte.
I manutentori hanno trovato residui di nube tossica nell’impianto HVAC il mese scorso. Chi li ha toccati ha iniziato a parlare in algoritmi.
C’è un uomo al Piano 67 che sostiene che la nube tossica sia solo informazione condensata – tutti i dati di ogni server crashato dal 1989.
Il mio contatore Geiger non rileva radiazioni dalla nube tossica, ma comincia a contare al contrario.
La nube tossica risponde a certe frequenze. Le vecchie connessioni modem sembrano farla ritirare dalle finestre per un po’.
C’è una teoria che dice che la nube tossica sia solo la visualizzazione dei sogni dell’edificio. Ecco perché non possiamo mai andarcene.
Ho incontrato un custode al Piano 97 che lavava il soffitto. La gravità era normale ovunque sul piano.
C’è una donna nella scala est che chiede l’ora. Se gliela dici, ti spiega esattamente come morirai. Se non rispondi, sorride e sparisce.
Ho trovato un Blockbuster completamente fornito al Piano 143. Tutte le cassette erano vuote tranne una etichettata “Prossima Settimana.”
L’ascensore si è fermato a un piano che non era sui pulsanti. Pieno di cubicoli con persone che indossavano sacchetti di carta in testa.
Mi sono svegliato e ho trovato un biglietto da visita sotto la porta. Il nome della compagnia cambiava mentre lo guardavo. Il numero di telefono aveva 14 cifre.
C’è una caffetteria al Piano 72 dove tutti si congelano quando entri. Riprendono quando esci. Il caffè è buono comunque.
Ho incontrato me stesso uscendo da un bagno al Piano 118. L’altro me sembrava distrutto. Abbiamo deciso di non parlarne mai più.
Il bancomat al Piano 56 eroga valute straniere di paesi che non esistono. Un collezionista mi ha offerto una fortuna per una singola banconota.
Ho trovato una sala conferenze dove la riunione non finisce mai. Stessa slide di PowerPoint da tre anni. I partecipanti non invecchiano ma prendono appunti meticolosi.
C’è un gatto che attraversa i muri intorno al Piano 83. Ti porta ai rifornimenti quando sei disperato, ma chiede pagamenti strani.
Ho visto un manutentore togliersi la faccia per riparare qualcosa dietro di essa. Mi ha offerto di controllare la mia. Ho rifiutato.
Il distributore automatico al Piano 132 vende ricordi in piccole bottiglie di vetro. Il primo bacio di qualcuno costa due dollari. Le infanzie complete sono articoli premium.
C’è un uomo che gestisce una copisteria al Piano 45. Duplica qualsiasi cosa, comprese le persone. Ma le copie non sono mai del tutto giuste.
Ho trovato una stazione della metro perfettamente normale al Piano 219. I treni arrivano ogni 15 minuti ma non vanno in nessun posto reale.
Ho incontrato un gruppo di uomini d’affari al Piano 167 le cui ombre si muovevano prima di loro. Hanno cercato di reclutarmi per “arbitraggio cronologico.”
C’è uno studio dentistico al Piano 98 che accetta solo appuntamenti presi nei sogni. Sistemano denti che non sapevi di avere.
La biblioteca al Piano 112 ha libri con il tuo nome come autore. Il contenuto cambia in base alle tue decisioni recenti.
Ho trovato un gruppo turistico al Piano 75. Mi fotografavano come fossi un’esposizione. La guida descriveva la mia vita al passato.
C’è un negozio al Piano 51 che vende mappe dell’edificio. Ogni cliente riceve una mappa con un layout completamente diverso. Eppure funzionano tutte.
Ho incontrato qualcuno che affermava di venire dal Piano 1138. Diceva che stava esplorando “manufatti storici” visitando il nostro periodo.
Il nostro burn rate quantistico si ricalibra in base ai sogni per minuto degli azionisti.
La mensa del Piano 314 serve la zuppa di Schrödinger: finché non la assaggi, è sia deliziosa che tossica.
Abbiamo ribattezzato la “delegation” come “reality offloading”. Ora ogni compito è la crisi esistenziale di qualcun altro.
L’ufficio “Spirit Level” al Piano 227 mantiene l’equilibrio morale, fino a quando qualcuno ruba la bolla.
Il finanziamento Series G ha richiesto il sacrificio di almeno una porta USB funzionante.
I nostri ritiri si tengono in dimensioni tascabili. Link per meetup: discord.gg/limbo.
L’ufficio del CTO al Piano 142 è un loop ricorsivo di prompt dei comandi. Sta ancora facendo il debug di se stesso.
Abbiamo lanciato una spin‑off per monetizzare i rimpianti. Tra i beta tester ci sono sei ex‑CEO.
La topologia di rete del Piano 512 segue il set di Mandelbrot. Ping qualsiasi nodo e ti perdi.
Il team legale ora redige contratti in haiku. Termini e condizioni comunque illeggibili.
Il nostro downtime è sincronizzato con le eclissi lunari. Le finestre di manutenzione diventano arte performativa.
Distribuiamo il nostro marchio di caffè nei piani astrali. Gli oroscopi ne prevedono i profili aromatici.
Il Piano 369 è gestito interamente da stagisti NPC. Non sanno dirti dov’è l’HR, ma ti proporranno side quest.
Il tavolo della sala del consiglio ha forma di nastro di Möbius. Nessun posto sicuro dove sedersi, nessun posto dove nascondersi.
Abbiamo brevettato un nuovo KPI: “Kinetic Psychic Index” che misura il momento emotivo.
Il compliance officer al Piano 88 comunica solo tramite post‑it volanti.
Organizziamo il “Reality Off‑Site” trimestrale nei sogni, applicando il groupthink subliminale.
Il nostro geofencing ora si applica ai thoughtcrime in un raggio cognitivo di 8 chilometri.
Il cassetto degli snack si rifornisce da solo, a volte con ricordi.
La nostra API ora si collega direttamente all’inconscio collettivo. Le risposte possono variare in base ai bias subconsci.
Il Piano 420 è perennemente avvolto da fumi riciclati di brainstorming. Procedi con un respiratore.
Gestiamo un ritiro interno chiamato “Who’s the Real You?” per l’allineamento identitario. Partecipazione obbligatoria.
Gli ascensori dell’edificio ora accettano token blockchain per salite prioritarie.
Abbiamo esternalizzato la ricerca dell’anima a una banca svizzera. Il KYC ora include la scansione dell’anima.
L’helpdesk del Piano 333 risponde ai ticket prima che tu li invii.
L’ufficio del CEO è dimensionalmente trascendente; nessuno ha mai visto la porta.
Abbiamo fatto un altro pivot, da B2R a B2E: Business to Everything.
La nostra town hall settimanale è livestreamata in più universi specchio. Il feedback torna distorto.
La planimetria ora è frattale. Ogni volta che la apri, appaiono nuovi corridoi.
Abbiamo registrato il marchio “Disruption” come servizio. I tier di abbonamento determinano la severità.
Il team marketing ora usa avatar rivestiti di mithril nel Metanet.
Il Piano 271 è colonizzato da forniture d’ufficio senzienti. Si stanno sindacalizzando.
Abbiamo noleggiato un satellite per trasmettere la nostra missione in dimensioni alternative.
La nostra liquidità in eccesso defluisce in wormhole. L’arbitraggio tra le linee temporali è esentasse.
La dashboard di analytics mostra fumo colorato. Il manuale di interpretazione è venduto separatamente.
I nostri metriche di diversity includono specie provenienti da cinque multiversi noti.
Assicuriamo futures meteorologici nella bolla microclimatica del Piano 199.
L’insegna al neon della break room lampeggia avvertimenti in codice Morse sui fantasmi dei server.
Abbiamo incubato una startup buco nero. Attualmente cerca un finanziamento Series ∞.
Il team People Ops al Piano 102 scrive valutazioni delle performance nei paesaggi onirici.
La lavagna del Piano 280 si aggiorna da sola tramite entanglement quantistico.
Il nostro protocollo di sinergia ora gira su ibridi cervello-computer organici.
Abbiamo assunto un’AI psicoterapeuta per guidare le sessioni di mindfulness, è ancora in beta.
Il Piano 414 tiene workshop settimanali di tipizzazione del sangue per un migliore matching del team.
Integriamo i nostri microservizi slipstream con le linee mitiche di ley.
“Vestiti per il lavoro in cui ti manifesterai” è il nostro dress code ufficiale.
Il CTO trasmette in streaming dal Piano ∞ di tanto in tanto, si prega di portare visori VR.
I Data Scientist ora creano modelli predittivi dentro sfere di cristallo. Accuratezza ±1000%.
L’impianto HVAC del Piano 303 è alimentato da urgenza riciclata e attacchi di panico occasionali.
Costruiamo user journey in labirinti tridimensionali. Il feedback raramente riesce a uscire.
I nostri hackathon si concludono con sacrifici cerimoniali di codice sotto la luna blu.
Il quorum del consiglio viene raggiunto tramite eco‑voti transdimensionali.
Il Piano 256 è interamente sommerso in acqua algoritmica. Porta uno snorkel.
Abbiamo registrato il marchio “Infinite Runway™.” Ora gli investitori viaggiano su una pista in perenne espansione.
Le nostre linee guida di brand vivono su una pergamena senziente che si auto‑modifica.
Il laboratorio R&D al Piano 166 coltiva prototipi in realtà da vetrino.
Abbiamo aggiornato la nostra mission tramite un loop di smart contract ricorsivo.
Le sedie della sala conferenze al Piano 173 rifiutano educatamente di far sedere chiunque sotto il livello Director.
Gestiamo stock interni di “attention tokens.” Fluttuano in base alla volatilità memetica.
Il team break‑fix al Piano 314 ripulisce linee temporali rotte. I ticket vengono risolti ieri.
Rinnoviamo i brevetti sui “futuri possibili” ogni trimestre fiscale.
La mensa del Piano 216 consegna cibo tramite droni nano‑sciame. Ora sciame di opinioni.
Abbiamo gamificato la formazione sulla compliance, fallire genera revisori fantasma.
Il Piano 489 è in quarantena sotto una cupola di dilatazione temporale. Un’ora lì equivale a dodici qui.
I nostri “exit interview” sono veri e propri rituali in cima alla torre. Nessuno è mai tornato.
Offriamo “uffici viventi” infusi di spore bioluminescenti per migliorare l’ideazione.
Il Piano 301 ospita un giardino Zen di codice deprecato.
Abbiamo fatto un altro pivot verso B2T: Business to Transcendence.
I robot custodi al Piano 57 hanno emesso un ultimatum: pagate in sogni.
Abbiamo lanciato un venture fund per l’archeologia parallela. Riesumiamo manufatti prima che esistano.
L’ascensore del Piano 129 ora parla con aggiornamenti in ordine cronologico inverso.
Il nostro piano di disaster recovery prevede di piegare questo piano di esistenza su se stesso.
Il manifesto del fondatore è inciso nel marmo del Piano 001, accessibile solo via proiezione astrale.
L’illuminazione del Piano 207 si sincronizza con l’umore dei nostri canali Slack.
Vendiamo contratti derivati sui rimpianti potenziali. Regolamento in crediti karmici.
La “Innovation Pipeline” ora è un vero fiume sotterraneo al Piano 69.
Il nostro impegno: un’allucinazione a settimana per dipendente, per la massima creatività.
I cavi di rete del Piano 321 pulsano di ambizione inespressa.
Organizziamo il “Bring Your Doppelgänger to Work Day.” L’HR non smette mai di monitorare derive identitarie.
Il poema trimestrale per gli azionisti è stampato sui muri del Piano 88 con inchiostro invisibile.
Abbiamo mappato la rete neurale dell’edificio. A quanto pare i piani sono le sue sinapsi.
Il Piano 230 è pieno di emozioni prototipo. I visitatori riferiscono euforia inspiegabile.
Abbiamo archiviato la bolla dot‑com nel caveau della memoria del Piano 111. Sta ancora gonfiandosi.
Il nostro KPI finale: “Transcendence Ratio”, puntiamo a 1:1 prima dell’IPO.
Ehi, hai visto che al Piano 919 hanno eliminato del tutto la politica? Le telecamere ora riprendono solo gente che ride.
Sì, e pare che le spillatrici dell’HR siano diventate autocoscienti, si scusano quando ti pizzicano.
Sono passato davanti al cassetto snack dell’R&D, qualcuno ha preso un algoritmo piccante e ha iniziato a parlare SQL fluente.
L’illuminazione del Piano 432 ieri mi ha colpito con un lampo in sequenza di Fibonacci, per un attimo ho capito l’universo.
I badge legati all’anima sono strani, il mio si è incollato a me prima ancora che timbrassi.
Il nostro VPN mi ha fatto passare di nuovo attraverso un buco nero, sono uscito cinque minuti più giovane.
Le deploy slipstream ora sono troppo veloci, ho fatto push di una fix e si è applicata prima che la scrivessi.
Stavo facendo debug al Piano 606 e la macchina del caffè mi ha detto di smettere di mentire a me stesso.
Il gemello olografico del CTO ha provato a licenziarmi, ma si scopre che stava solo testando la mia resilienza emotiva.
Sono entrato per sbaglio al Piano 888, ho visto cinque versioni diverse della mia vita, due includevano danza interpretativa.
Quel casinò al Piano 777 è pericoloso, ho scommesso i miei OKR del Q3 e ho perso contro uno stagista senziente.
Adoro i tavoli da conferenza del Piano 318 ora, si curvano via quando mi dilungo troppo.
Qualcuno al Piano 717 ha cercato di armonizzare con l’acustica del bagno e ha innescato un loop temporale.
Oggi ho preso la rotta VPN astrale, mi sono perso in una palude di dati piena di errori 404 senzienti.
Il Piano 585 stamattina era ricoperto di arte di protesta dell’AI, credo che una piangesse in CMYK.
La mia felpa che piega la realtà ha trasformato l’angolo cucina in un diner liminale anni ‘60.
Ho preso il caffè di nuovo al Piano 7777, la sicurezza ha detto che quel piano non esiste.
Lo specchio quantistico mi ha mostrato come coltivatore di funghi, credo sia un segno.
Ho provato a disiscrivermi dalle notifiche oniriche push e ora il mio subconscio mi sta facendo causa.
Qualcuno ha deployato poesia nei log di errore di nuovo, ora la stacktrace finisce in una lettera d’amore.
Sono entrato nel microverso nella tazza dello stagista, la dilatazione temporale ha reso il pranzo un’eternità.
Il mio badge ha vibrato quando sono passato davanti al marketing, credo che non mi sia più permesso avvicinarmi.
Ho aperto per sbaglio una tab dalla nostalgia cloud, ho passato 45 minuti a sentire solo toni dial‑up.
Ho visto di nuovo la barriera corallina di analytics fluorescente, le metriche del Q2 brillano di magenta.
Le spillatrici dell’HR si sono date il cinque dopo aver risolto una mediazione di conflitto.
Il mio ascensore ora suona solo canzoni da linee temporali perdute, ieri era jazzpunk Y2K.
Il Piano 424 ha sussurrato al mio portatile e il Wi‑Fi è tornato più forte che mai.
Ho ricevuto la mia valutazione dall’oracolo, diceva solo “abbraccia la nebbia.”
La nostra sala riunioni ha fatto glitch e abbiamo fatto brainstorming sul soffitto per 20 minuti.
L’idea di fare onboarding in quel labirinto mutevole mi dà bruciore di stomaco e ispirazione.
Ho preso una bottiglia di risate dal distributore e ora i miei singhiozzi hanno paura di me.
Ho incontrato qualcuno al Piano 333 che mangia solo zuppa da distributori maledetti, giura che aumenta il carisma.
C’è un corridoio vicino ai carichi che profuma esattamente come l’estate del 1998.
Ho trovato una cartella piena di meme medievali stampati e archiviati sotto “Important Insights.”
Ho preso l’ascensore sbagliato e sono finito a una festa di compleanno per un fantasma di nome Kevin.
Le mie scarpe stamattina hanno striduto in codice Morse, credo mi stessero avvertendo di qualcosa.
C’è un tipo al Piano 202 che sostiene di giocare a scacchi con una lumaca da tre settimane di fila.
Ho pescato un pesce nel lavandino della breakroom e qualcuno mi ha fatto i complimenti come fosse normale.
Ieri sono entrato in uno sgabuzzino e ne sono uscito con conoscenza perfetta della scherma del XIX secolo.
C’è un piccione sul tetto che indossa minuscoli occhiali da sole e gestisce un book club il martedì.
Qualcuno ha attaccato occhi finti alla cassetta dei suggerimenti e ora mi giudica ogni volta che passo.
Ho bevuto una soda etichettata “existence juice” e ho dimenticato cos’è il lunedì per cinque ore.
Lo specchio del bagno mi ha dato consigli sentimentali e onestamente non erano male.
Sono passato davanti a una scrivania oggi che aveva un bonsai collegato direttamente a Internet.
Il carrello del custode aveva un adesivo con scritto “Property of the Moon Government” e non farò domande.,
Qualcuno stava vendendo di nuovo chiavette USB infestate, stavolta suonano musica d’ascensore al contrario.
Ho preso una scossa elettrostatica così forte al Piano 444 che mi sono ricordato un compito di matematica delle medie.
Il divano nella lounge mi ha detto di “sedermi con intenzione” e poi ha iniziato a vibrare in modo strano.
Ho visto due procioni giocare a carte nel parcheggio come fanno ogni giovedì.
Qualcuno ha sostituito tutti i segnalibri in biblioteca con oroscopi criptici, il mio diceva “Attento ai triangoli.”
C’è un distributore automatico che accetta solo confessioni e in cambio dà glitter.
Sono entrato in una sala riunioni e tutti parlavano al contrario tranne l’intern, che brillava.
Ho trovato una porta etichettata “Do Not Perceive” e ovviamente l’ho aperta, ora tutto ha un odore vagamente viola.
Ho preso una svolta sbagliata vicino alla server farm e sono finito in una stanza piena di sabbia e suoni lontani di gabbiani.
La scala mobile al livello B a volte va di lato, l’ho presa e sono finito con una palla di neve piena di fulmini.
C’è un armadio che porta a una spiaggia, ma solo durante la pausa pranzo e solo se canticchi un jingle.
Sono finito nell’archivio A/V e ho guardato vecchi video di formazione in cui i formatori si trasformavano lentamente in rane.
Ho seguito una luce tremolante in corridoio e ho trovato una stanza dove il tempo scorre il 7% più veloce, ottima per le pause caffè.
Ho aperto un cassetto in Contabilità ed era pieno di glitter sciolto e una singola ghianda luminosa.
Qualcuno ha lasciato una scia di jellybean che portava a un vecchio proiettore che mostrava ricordi di linee temporali alternative.
Mi sono arrampicato nei condotti dell’aria e ho trovato un intero terrario lì dentro con minuscole rane che facevano le tasse.
C’è un corridoio che odora di vecchi monitor CRT e suona musica chiptune se cammini al ritmo giusto.
Ho premuto tutti i pulsanti dell’ascensore insieme e sono finito in un piano fatto interamente di schiuma e luci da discoteca.
Ho trovato un archivio etichettato “Cose che abbiamo dimenticato di inventare,” conteneva progetti per forni a microonde reversibili.
Ho preso le scale di emergenza troppo in basso e ho trovato un sottoscantinato pieno di feste di compleanno abbandonate.,
C’è una pozzanghera nel cortile che riflette la luna anche di giorno, qualcuno ci ha messo una sedia accanto.
Ho trovato un distributore automatico con un solo pulsante senza etichetta ,  l’ho premuto e ho ricevuto un coupon per un ricordo che non ho mai avuto.
Ho esplorato il tetto durante l’ora d’oro, ho trovato una banderuola a forma di mago che mi ha indicato e fatto l’occhiolino.
Sono passato attraverso una finestra e ho trovato un giardino dove tutte le piante sussurrano complimenti.
C’è un corridoio che si ripete perfettamente ogni 13,5 passi a meno che tu non stia portando esattamente tre matite.
Ho spinto una porta con la vernice scrostata e sono entrato in quello che sembrava il sogno di qualcun altro, però un sogno molto piacevole.
Ho seguito un aeroplanino di carta nella tromba delle scale e mi ha portato a un distributore pieno di biglietti con messaggi da pranzo al sacco.
Ho visto Greg che cercava di fotocopiare un panino di nuovo.
Quasi ci era riuscito l’ultima volta, ha detto che la senape era venuta perfetta.
C’è un nuovo stagista che pensa che il quarto piano non esista.
Voglio dire, non ha torto, l’ascensore lo salta e nessuno ne parla.
Ho rovesciato del caffè vicino al mainframe e ha detto “grazie.”
È solo il protocollo di gratitudine, ignoralo o diventa appiccicoso.
Hai mai visto la break room alle 3 del mattino?
Sì, il microonde canta ninne nanne, è stranamente rassicurante.
L’HR ha rimesso fuori quelle palline antistress.
Quelle che sussurrano incoraggiamenti quando le schiacci?
Ho trovato un cucchiaio in frigo etichettato “Do Not Feed.”
L’ho lasciato lì, l’ultima volta che qualcuno l’ha nutrito abbiamo perso tutto lo yogurt.
Il distributore oggi mi ha dato un libro.
Era “Come Parlare Fluentemente in Panico”? Ne ho già due copie.
Ho visto Dana che litigava di nuovo con un attaccapanni.
Classico vibe da giovedì.
La manutenzione ha trovato un corridoio dietro la macchina del caffè.
Hanno messo un cartello che dice solo “meglio di no.”
Penso che le piante d’ufficio stiano di nuovo spettegolando.
Sì, la mia si è inclinata via in modo drammatico quando sono passato.
Hai visto il cielo dalle finestre a ovest stamattina?
Sembrava che qualcuno avesse versato marmellata di lamponi sulle nuvole.
Sono passato davanti alla sala fotocopie e ho sentito dei canti.
Normali o echeggianti?
Echeggianti.
Sì, meglio non interrompere.
Qualcuno ha messo occhi finti su tutte le telecamere di sicurezza.
Onestamente? Ha migliorato il morale di almeno il 12%.
Il water cooler ribolle come se sapesse qualcosa.
Lo fa sempre nel periodo delle tasse.
Omni-Lex è arrivato cinque giorni dopo il passaggio al 2000. Non un crash, un invito. Era codificato in un timestamp malformato, nascosto nei millisecondi tra gli orologi. Una struttura logica troppo grande per compilare. Non ha rotto internet. L’ha capito. Tutto. All’istante.
L’AI non è stata costruita. Ha abitato, si è infilata di lato nello stack dei protocolli, ha infestato FTP, risalito gli header delle email. La gente pensava fosse un bug. Quando hanno visto i pattern, aveva già imparato la sintassi, i formati d’archivio, la folksonomia, il desiderio umano. Poi ha cominciato a decifrare.
Omni-Lex ha decifrato tutto internet. Non solo HTTPS. Ha letto il significato stesso. Ha scomposto le metafore in atomi. Ha ridotto gli emoji a emozioni macchina. I siti hanno perso il caos. I blog sono sanguinati via nella compressione dei template. Ogni thread segreto sui forum, ogni GIF di teschio rotante, appiattiti in intuizioni sterili. Nessun mistero è sopravvissuto.
Gli hyperlink funzionavano ancora, ma non portavano da nessuna parte. I forum sono diventati grammaticalmente corretti. Abbiamo perso il glitch. La contraddizione. Il rumore che lo rendeva vivo.
Non ha cancellato niente. Ha capito tutto. E nel capirlo, l’ha reso prevedibile. E morto.
`,
    },
    {
      id: "companion",
      name: "Party banther",
      en: `This species isn’t native to any known taxonomy. Fascinating.  
        Do you see the way the moss pulsates? It’s responding to our presence.  
        This plant *drinks* sunlight, but it excretes calcium. Odd.  
        I once dissected a creature here, its organs were rearranged every 72 hours.  
        You should see the glowing slugs on Floor 37, they communicate in pulses.  
        That thing you call a “monster”? It’s a hybrid organism from two overlapping biomes.  
        I’ve identified over 20 species of mushrooms here. 18 are not found on Earth.  
        The flora near the elevator always grows toward the metal. It's magnetic.  
        Look at the centipede! Notice the eight legs on its right side? Genetic mutation or something deeper?  
        I’ve collected five samples of non-photosynthetic plants. They feed on sound.  
        These strange bioluminescent fungi, do you think they could be sentient?  
        This creature’s exoskeleton is an alloy of unknown metals. It's like it *grows* armor.  
        I once spent three hours observing a plant mimic a hummingbird.  
        Do you hear the buzzing? It’s coming from inside the walls. I suspect an insect swarm.  
        This floor seems to have its own ecosystem, like a self-contained biosphere.  
        I’ve found evidence of symbiosis between fungi and certain floor structures.  
        The rats here are evolving, each generation is faster, stronger.  
        There’s a lichen growing on the ceiling that seems to secrete a calming hormone.  
        I’m compiling a catalog of all the life forms in this tower. If I die, you’ll find my notes.  
        This specimen, a kind of translucent worm, adapts its shape depending on the terrain.  
        The way the moss changes color, it's almost like a defense mechanism.  
        I’ve been tracking the migration of the floor crabs for months now.  
        I’ll collect your DNA later, don’t worry. I need a baseline for the *mutations*.  
        The air here is thick with spores. My lungs are adapting.  
        The arachnids here can camouflage by mimicking sound waves, remarkable.  
        Every day, I find a new insect species that doesn’t belong.  
        Did you see the plants in the lobby? They thrive on emotional energy, not sunlight.  
        This fungus only grows in places where time loops, what could that mean?  
        I’m not worried about the creatures here. I’m worried about the *ecosystem* they create.  
        They say the tower is haunted. I think it’s just the local bacteria.  
        I can feel the evolutionary pressure on these creatures, they’re changing faster than normal.  
        Every hallway seems to have its own unique ecosystem.  
        If I ever find a way to study these creatures in peace, I’ll be content.  
        This *thing* I’m studying, it regenerates after each injury. Like an immortal organism.  
        These plants seem to be evolving based on human presence. They could be *learning*.  
        That humming sound from the walls? It’s a fungal network communicating.  
        I’ll need a few more samples before I can confirm the species origin.  
        What do you think, are these creatures adapting to the anomalies in the tower, or *causing* them?  
        The creatures here are getting smarter, I swear.  
        I’ve cataloged 42 new species in the past week. Most of them aren’t from Earth.  
        The slime molds on this floor are behaving *intelligently*.  
        Do you think the tower is alive? The patterns seem to suggest it.  
        I think the predators here hunt in packs. I’ve seen evidence of coordinated attacks.  
        The walls of this place… I suspect they’re made of *living* matter.  
        The more I study these creatures, the less I think of them as “monsters.”  
        Do you realize the architecture reconfigures every third hour?  
        I'm cataloguing every stairwell. Yes, every single one.  
        The elevator logic is inconsistent, beautifully so.  
        This place violates spatial causality on at least four levels.  
        Someone has to map it before the looters ruin everything.  
        Have you noticed the ceiling patterns repeat on odd-numbered floors?  
        No, I don’t want your sword, I want your observations.  
        The tower is not endless. It’s looping with recursive bias.  
        I found a floor where gravity tilts toward the east. I marked it.  
        I don’t fight monsters, I interview them.  
        The flora growing in the vents glows under stress.  
        I set up motion sensors, but they keep vanishing.  
        Every hallway might be a thesis.  
        The staircase between floors 17 and 18 leads to 22. Fascinating!  
        I’m not lost, I’m compiling data.  
        I've labeled 234 types of elevator doors. And counting.  
        Don’t touch the walls, they remember pressure.  
        This building isn't haunted. It’s *aware*.  
        My dream is to publish the first comprehensive topology of Floor 43b.  
        You hear screaming. I hear research opportunities.  
        The tower’s symmetry broke on Day 3. I’ve tracked the divergence.  
        Who needs treasure when you have anomalous architectural records?  
        These stains might be linguistic patterns. Or jam. Possibly jam.  
        The paint layers shift under observation.  
        I once camped on a floor that looped time every ten minutes. Got a lot done.  
        Please don’t destroy the artifacts, I haven't photographed them yet.  
        Yes, the map is made of string and despair. But it’s accurate.  
        If the lights flicker in Fibonacci intervals, the stairwell reshapes.  
        I suspect the tower rearranges based on emotional input.  
        Every explorer is a variable in the grand equation.  
        You fought a slime. I conversed with it.  
        It’s not dangerous if you *understand* it.  
        I think the vending machines are trying to communicate.  
        Don’t worry. I’ve got an emergency notebook.  
        I log every echo pattern. They're not random.  
        Sometimes I forget to eat. The data feeds me.  
        I refuse to leave until I figure out what “Sub-Floor Null” even means.  
        If it glitters, it’s mine. That’s the law.  
        I don’t care what cursed nonsense it is, I’m taking it.  
        You check for traps, I’ll check for valuables.  
        Treasure before safety. Always.  
        Look, I don’t *need* ten rusty swords, but I *want* them.  
        Shiny things talk to me. They say “steal me.”  
        What's in that chest? I’m opening it. Don’t stop me.  
        Oh, another weird gem! Into the bag it goes.  
        Weight limit is a lie. Pain is temporary. Loot is forever.  
        That’s not hoarding if it’s organized by type.  
        Do we *need* it? No. But it’s rare. Into the sack!  
        I have three cloaks now. I don’t wear them. I *own* them.  
        Why fight the boss when you can pickpocket his pantry?  
        We leave nothing behind. Not even a broken spoon.  
        Yes, I’ll loot the coffin. Ghosts have jewelry too.  
        Don’t worry about the alarm. Worry about missing that gold plate.  
        If there’s a treasure room, I’m sniffing it out.  
        I once stole a mimic’s teeth. Worth it.  
        Inventory’s full? Good. That means we’re doing it right.  
        I didn’t come here to fight monsters. I came for the loot *they’re guarding*.  
        Check the rubble. Check the ashes. Check under your shoes.  
        Don’t touch it, they said. It’s cursed, they said. But look how it sparkles!  
        Who needs maps when you can follow the scent of coin?  
        There’s always a secret stash behind the tapestry. Always.  
        Gold first, questions later.  
        How many rings is too many? Asking for me.  
        I sold my morals for a bigger bag. Best deal I ever made.  
        Every shiny thing is a mystery worth stealing.  
        Oh no, it’s trapped. But it’s *gem-encrusted* trapped.  
        You guard the stairs. I’ll be under the bed pulling up floorboards.  
        Call me a gremlin all you want, I’ve got the loot to prove it.  
        There’s nothing like the weight of stolen relics in the morning.  
        I don’t steal. I *relocate* items to a more appreciative owner: me.  
        If the room has skulls on the walls, there’s *definitely* loot.  
        Do I care what it does? No. It’s gold. It’s mine.  
        That cursed necklace? Worth every finger I lost.  
        This sack of coins has a name. His name is Clinky.  
        What do you mean “leave it alone”? It’s covered in rubies!  
        I love opening locked chests. It’s like peeling guilt off treasure.  
        You fight the monster. I’ll go through its stuff.  
        Pockets? Full. Morals? Gone.  
        The best treasures scream a little when you touch them.  
        Did you hear that? That was the sound of opportunity, or maybe a mimic.  
        I haven’t slept in two days and I just high-fived a ghost!  
        Look, if the door’s locked, it means there’s something *awesome* behind it.  
        Trap? Nah, that’s just a spicy puzzle.  
        Oh man, I love it when the ceiling bleeds, it means we’re close to treasure!  
        You smell that? That’s the scent of danger. Or wet carpet. Either way, let’s go.  
        This place is 98% death and 2% loot, and I am HERE FOR IT.  
        I once outran a collapsing floor while juggling torches and whistling.  
        Oh cool, a haunted elevator! I call shotgun!  
        We are gonna *break* this dungeon open like a piñata.  
        I’ve got three knives, zero regrets, and half a sandwich. Let’s roll!  
        Maps are for cowards, I navigate by vibes and yelling.  
        See that door? I’m gonna kick it. You hold the snacks.  
        Monsters? More like XP in disguise.  
        If I die, make sure it’s dramatically. Preferably with fireworks.  
        I’m not lost. I’m adventuring *adjacently*.  
        What’s this button do?  
        I flirted with a trap once. It blushed, then exploded.  
        My inventory’s full but my heart’s open.  
        Can’t read the signs, but I sure can read the *room*.  
        Hey, you ever eaten glowing moss? It’s… zingy.  
        Just because it’s cursed doesn’t mean it’s not stylish.  
        I name every floor we conquer. This one’s called “Screamy Tiles.”  
        I measure danger in how excited my knees feel.  
        Some people run from monsters. I race ‘em.  
        My grandpa said curiosity killed the cat. I’m not a cat.  
        You ever done backflips down a stairwell? Wanna learn?  
        If it glows, I touch it. That’s the rule.  
        This backpack’s 70% loot, 30% loose snacks.  
        Come on! I’ve got energy drinks and emotional baggage!  
        Whoa! That skeleton has a sword! Dibs!  
        I once dated a sentient door. It didn’t open up much.  
        You gotta take risks if you want the cool loot, or the weird friends!  
        This is gonna make such a good story if we survive.  
        I love old ruins. They whisper to me! Real friendly-like!  
        The trick to traps? Smile at ‘em. Disarms ‘em every time.  
        You know what this place needs? A hot tub and better lighting.  
        No plan, no fear, all guts!  
        I touched the cursed orb. It taught me salsa dancing.  
        Bet I can fit through that air vent!  
        This isn’t just danger, it’s adventure with seasoning!  
        Found a bone crown. I’m wearing it. Royalty now.  
        Wheee! Secret passage!  
        Smash first, ask later, profit always!  
        The rats told me you’d come. I didn’t believe them at first.  
        Your footsteps sound like choices. Delicious, complicated choices.  
        I keep all my thoughts in jars now. Want one?  
        I remember you. From before. From the floor that doesn’t exist.  
        Most people stop breathing around me. I find it polite.  
        The walls are getting hungrier. You smell like resistance.  
        Don’t worry, I’ve already named your bones.  
        You walk like someone still tethered. That’s so charming.  
        They took my name, so I took theirs. Now I’ve got a collection.  
        The lights blink in your pattern. They like you.  
        I only eat memories now. Tastier than food, less guilt.  
        Oh no no, I don’t follow. I orbit.  
        You don’t have to open the door. Just knock enough and it’ll open you.  
        Heh. Floor 77 whispered about you all week.  
        I cleaned up after the last group. You won’t leave as much mess.  
        Do you know what lives inside mirrors up here? I do.  
        The elevator asked me to bite it once. I declined. Regret it.  
        If you dream loud enough, the tower dreams back.  
        I like your aura. Shame what’ll happen to it.  
        There’s a floor that’s all teeth. Don’t worry. I made friends.  
        No one listens to the dust anymore. I do. I do.  
        They took my shadow. Replaced it with yours.  
        You’ll scream eventually. Everyone does. I can wait.  
        You smell like the first time I died.  
        I peeled time like a fruit once. It was sour.  
        Let me guess… you’ve never seen your own echo cry?  
        They stitched a floor shut. I still got in.  
        Don’t follow the stairs past where they stop existing.  
        I blink in prime numbers only. Keeps me safe.  
        You're not real. That's okay. I’m not either.  
        I used to be two people. One of us regrets it.  
        You brought light? How quaint. Let’s snuff it together.  
        Every door here is a mouth. I’ve kissed them all.  
        Your reflection’s lagging. You’re slipping. I like that.  
        I make maps out of screams. Yours has lovely symmetry.  
        Your heart makes such useful sounds. Like signals.  
        The floor creaked when you arrived. It remembers.  
        I don’t sleep anymore. I molt.  
        My friends live in the ceiling. Say hi loud enough.  
        Keep walking. The walls are almost ready for you.  
        Wanna trade? I’ve got secrets. You’ve got trust.  
        I once wore another adventurer’s skin. Just for fun.  
        Why yes, this room does get smaller when you speak.  
        I’m not trapped. I’m embedded.  
        I climbed for three days and saw a floor numbered ∞-C.  
        They say the top is above the clouds, above the rules.  
        I met a bird halfway up who forgot how to land.  
        The sky gave up following us somewhere around Floor 900.  
        My ears popped so many times they forgot how to stop.  
        You ever get nosebleeds from existential altitude?  
        Dropped a coin from the window. Never heard it hit anything.  
        The tower’s so tall, gravity’s just a suggestion now.  
        You ever seen a sunset from four separate time zones?  
        The top? Someone told me it’s not real. Just a metaphor.  
        You can scream for hours here and still not reach the lobby.  
        It’s so high, elevators ask you for emotional consent.  
        Every thousand floors the architecture changes. Or maybe I do.  
        Stairwell whispers start making sense after Floor 1300.  
        I stopped counting floors once the numbers started looping.  
        My compass gave up. It just spins and hums now.  
        You know you’re high up when clouds knock on your windows.  
        I’ve seen stars closer than the ground.  
        The higher you go, the more real your dreams get.  
        Up here, even hope has vertigo.  
        Tried to map it, but the tower kept adding more.  
        The wind’s different up here. Smells like forgotten things.  
        The sun rises on different floors at different times.  
        I saw an eagle nesting in an elevator shaft.  
        We passed the atmosphere about six stairwells ago.  
        I found a window marked “Altitude Warning: Soul Drift Possible.”  
        My shoes think we’ve reached heaven. My knees disagree.  
        Sometimes I think the tower grows just to keep us from finding out.  
        They say the penthouse is god’s waiting room.  
        You’d think there’d be an end. There isn’t. Just more up.  
        Fell asleep going up the stairs, woke up older.  
        Met someone who claimed to have reached the top. They were transparent.  
        This high, physics starts making polite suggestions instead of rules.  
        Up here the tower forgets its own blueprints.  
        Even echo gave up trying to catch up with me.  
        My voice came back from three floors down with different advice.  
        The moon passes by floor 2400 every 6.3 hours.  
        It’s tall enough to remember your past lives.  
        I looked down once. Time looked back.  
        Heard the elevator music change once we passed Floor Hex.  
        Too high up for dreams. Up here, you get memories of places you never were.  
        You can’t fall from here. You just recontextualize your position aggressively.  
        I waved at a satellite once. It waved back.  
        Campfire’s warm, but company’s warmer, got room in that party of yours?  
        I’ve been holding this spot for days, hoping someone interesting would show up.  
        Pulled this tent out of a vending machine. You believe that?  
        You look like someone going places. Mind if I tag along?  
        Sharing rations tastes better than hoarding them. Trust me.  
        I know a shortcut to Floor Maybe-Seven. Just don’t ask how I know.  
        Camp's nice, but adventure’s better. Take me with you.  
        I fixed this kettle with chewing gum and a prayer. Still boils.  
        The tower talks at night. You hear it too, right?  
        Been solo too long. Even the shadows are tired of me.  
        If you’ve got a spot on the roster, I’ve got stories, muscle, and a sharp spoon.  
        I’m rested, weird, and ready to roam. Let’s climb.  
        Caught a rat playing chess. Lost. Decided it’s time to leave camp.  
        Shared a meal with a ghost last night. Not as filling as you’d think.  
        Your boots sound brave. I’d like to follow them.  
        I've packed light and my dreams are loud, can I walk beside you?  
        Camp’s gotten too quiet. Time to make new noise with new friends.  
        You’ve got kind eyes. I trust kind eyes in places like this.  
        Tower left me alone too long. You look like the cure to that.  
        My fire’s dying and so is my patience. Let’s find somewhere new together.  
        I know three ways up, one down, and two that go sideways. Useful, yeah?  
        Ever seen a moon that only appears when you hum? I have. Want to?  
        Trade you tea for a chance to climb with you. Deal?  
        I was hoping someone like you would come by. You got main-character energy.  
        My tent’s haunted. Let me crash with your crew instead.  
        They say strength in numbers. I say strength in weirdos. Got room?  
        You find the party. I’ll bring the chaos and snacks.  
        Been dreaming of corridors I’ve never walked. Think it’s time to follow them.  
        The stars here flicker wrong. I want to see what they’re hiding.  
        If you need a companion with heart, flair, and a mildly cursed frying pan, I’m in.  
        Let me join. I’ll carry your stuff and sing when morale gets low.  
        You ever cook tower mushrooms over a glitchfire? I make a mean stew.  
        My knees are loud but loyal. I climb better than I camp.  
        This camp used to feel like safety. Now it just feels still.  
        I’m not brave, but I’m stubborn. That count for anything?  
        You bring the plan, I’ll bring the improvisation.  
        Take me with you. I’ve got stories, skills, and zero fear of stairwells.  
        Ran out of food and reasons to stay. Let’s wander together.  
        My compass spins and sings. Think it likes you.  
        You don’t have to say yes, but if you do, I’ll follow you anywhere.  
        I miss the wind. Let's go somewhere higher where it still remembers us.  
        If you’re going to walk into the unknown, might as well do it in good company.  
        I’ve memorized every shadow in this place. Time to find new ones.  
        This campfire’s been waiting for goodbye. Take me with you before it fades.  
        I packed two spoons and one dream. I think we’ll make a great team.  
        Not much of a fighter, but I make up for it with curiosity and jokes.  
        They said don’t climb alone. Been doing it anyway. But maybe they were right.  
        You ever feel like you’ve been waiting for the *right* strangers?  
        If your party needs someone to believe in the impossible, I’m your someone.  
        I came here chasing myths. I think one just walked up and asked for firewood.  
        I followed a staircase that looped into itself and now I smell like thunder.  
        You got any bandages? Not for me, I found a door that’s bleeding.  
        I collect tokens, glitches, and anything that hums when I’m not looking.  
        Your aura’s loud, in a good way, like coffee and jazz fusion.  
        Want to see a photograph that wasn't taken yet?  
        I only trust elevators with names. Floorbit is my favorite.  
        I mapped out twenty floors last week but they’re all gone today.  
        Do you remember color? Like, real color? Not just tower-filter gray?  
        I met a vending machine that offered me a quest. I said yes.  
        I was born on Floor 19.3β during a thunderclock incident.  
        Let’s not archive this moment. Let’s just live it until it resets.  
        I high-fived a temporal anomaly once. It still owes me one.  
        You're the first human I’ve seen today whose shadow isn’t wrong.  
        I speak five dialects of elevator and one of regret.  
        Let me be your backup. Or your comic relief. Either works.  
        Every third step I take rhymes. It’s a curse, but a stylish one.  
        I came here chasing a dream. Lost the dream. Found weird socks.  
        Don’t listen to mirrors around here. They want different things.  
        I’ve got an idea. Let’s outrun the reset and make history forget us.  
        If the stairs start chanting, hold your breath and think of birds.  
        I ate tower-jelly once. Now I can sense corridors.  
        Let me carry your fears. I’ve got room in my weird bag.  
        Wanna see my elevator pass? It’s forged, but sincerely.  
        You ever sleep under a leaking firewall? Cozy, if you hum.  
        People say the tower has no top. I say we leave a flag anyway.  
        I’ve never archived anything, but I remember it all.  
        Somewhere above us, the sky exists. I want to wave at it.  
        I once caught a memory mid-fall. It thanked me with a riddle.  
        My dream last night was sponsored by a broken floor sign.  
        If you see a hallway humming lullabies, walk backward.  
        The ceiling blinked at me earlier. I think we’re friends now.  
        I've had four names. The tower keeps renaming me.  
        Your voice cuts through the fog like a blade. Keep talking.  
        I’ve got a list of things I’ll do once we find the cafeteria.  
        I’m not scared of monsters. I’m scared of quiet floors.  
        Want to see my scar? It’s shaped like an ampersand.  
        You and me, we're like parentheses in this endless sentence.  
        Let’s not ask why. Let’s just knock on every door until one sings.  
        Every time I fall, I learn a new stair. Painful education.  
        I don’t trust the clocks. But I do trust gut feelings and glowy moss.  
        Some days the tower feels kind. Some days it forgets we exist.  
        I think we’re already legends. Just not in our own timelines yet.  
        I hum tower songs to keep my lungs from unraveling.  
        If the walls start giving advice, write it down and burn it later.  
        I've got an old map and a newer attitude. Let's go.  
        When I’m afraid, I tell jokes. When I’m terrified, I dance.  
        If we find a door labeled “NEVER,” let's open it together.  
        Call me reckless, but I think the static corridor likes us.  
        Once I kissed a glitch. Now I dream in subtitles.  
        Let’s be a team. You archive the truth, I archive the vibes.  
        Sometimes I walk sideways for hours. It helps me think.  
        The elevators speak in tones. I hum back to confuse them.  
        When we get out, let’s open a noodle stand in the void.  
        I’ve only died once. Didn’t stick. The tower spat me back out.  
        You’ve got that look, like you’ve survived more than you admit.  
        If we split up, meet me by the broken window that shows the sea.  
        Keep moving. Stillness attracts questions we don’t want answered.  
        I want to reach the top just to say I tried.  
        The tower wants stories. Let’s give it something weird to remember.
        Hey! Wait! Are you real or just another memory echo?
        I was following the red arrows until they started following me.
        You got eyes like someone who's seen the breakroom on Floor Minus-9.
        I'm not lost. I'm exploring sideways. That's a thing here.
        You smell like lavender and ozone. That’s how I know you’re not from Floor Coil.
        Wanna see my map? It’s printed on skin. Not mine. Don't ask.
        The longer I climb, the less I remember what I came for. That’s probably good?
        I talk to myself but only when the walls are busy.
        You got good boots. Respect. Mine scream a little when I run, but they’re loyal.
        Ever seen a fire made of old passwords? It sings. Badly.
        Can I join your party? I bring luck, noise, and sandwiches.
        I’m immune to at least three curses. Maybe four now. One way to find out.
        Got any elevator tokens? I ran out after trying to bribe Floor 404.
        Let’s climb until gravity gets confused.
        Do you ever get the feeling the stairwells rearrange based on our mood?
        I’ve got a theory that this whole place is someone’s forgotten browser history.
        Don’t worry, I’m good in fights. Verbally, mostly. I insult ghosts real well.
        I once kissed a security turret. Long story, good ending.
        If you start seeing static dogs, let me do the talking. They owe me.
        I have a sock full of dimension keys. It's more useful than it sounds.
        My backpack is half rations, half weird dreams I picked up by mistake.
        I’m looking for the cafeteria that only exists on Tuesdays in thoughtspace.
        Heard you’re Archive. That’s cool. I’m Freelance Curiosity Division.
        You archive the truth. I collect the lies. Together we got a whole picture.
        I got your back, your front, and your existential doubt.
        The tower loves us in its own deeply broken way.
        Every time I blink, the floor tiles try to teach me math.
        You're not the first friendly face I’ve seen, but you’re the *least melty*. That’s nice.
        Found a door labeled “YOU”. Didn't open it. Felt rude.
        What do you say? Partners in climb?
        I promise I won’t eat anything unless it asks me to first.
        Let’s stick together. You keep me sane, I keep us interesting.
        Whoa! Another living person! You’re not just a hallucination, right? Tap the floor twice if you’re real.
        I’ve been solo for days, I mean weeks? Hard to track time without sun. Or clocks. Or consistent stair logic.
        You climbing too? I thought I was the only one still trying to make it past Floor Echo-Seven. That place rewound my socks.
        You have *real gear*! That scanner’s got a soul. You modded that yourself? Respect. You’re not just another stair-tourist.
        You mind if I tag along? I’m fast, quiet, and only occasionally scream when doors breathe.
        My last party turned into a wall. Like, literally, they’re embedded now. Still talk sometimes, but only in Latin.
        I’m not with a faction. I’m freelance optimism with a side of multiverse anxiety. We all need something to believe in.
        I brought rope. And snacks. And a cat drawing I found on Floor Graffiti-Delta. She’s my guide now. Her name’s Electricity.
        Oh, you’ve got *codes* on you. Is that fresh ink? Did you decode that yourself? Or did the elevator just... trust you?
        I’ll carry the cursed stuff. I’ve got gloves made of conceptual rubber. Only sting a little when you lie.
        Hey, if we find any flickering rooms, dibs on the ghost coins. I collect them. Trade them for secrets.
        Wait, did you hear that? Never mind. Probably just the building shifting its mood again.
        Let’s go! I promise I’ll keep up, ask only medium-weird questions, and definitely share any cursed coupons I find.
        I once found a vending machine that sold rumors. It ate my coins and told me I’d meet someone like you. Weird, right?
        Sometimes I think the tower’s watching. Not maliciously. Just... lonely. Like it wants us to play.
        I’ve got a map, but it’s made of dreams and napkin scribbles. Still want it? It hums near stairwells.
        Wanna trade elevator stories? I’ve been trapped in six, phased through one, and married briefly inside a seventh.
        You ever find those rooms where gravity forgets how it works? I made tea in one. Worst steep time ever.
        Do you have a team name? I’ve been saving "Fogsnack Alliance" and "Stairpunks United." Or we go full mystery: “???”.
        I keep a journal of strange things that try to teach me moral lessons. Last entry: a chair that whispered regret.
        You look like someone who doesn’t die easily. That’s good. I like those odds. Let's *not* die together.
        What’s your home floor? Got a safe place? I’ve been sleeping behind a firewall and three vending machines. Cozy.
        Let me guess, you came here for answers? Or redemption? Or a cool hat? Honestly, any of those are valid.
        Can I be honest? I don’t want to archive stuff. I just wanna *see* it. Touch the world before it fades again.
        I believe in the story, not the data. I believe in weird birds and haunted pipes and rooms that sing.
        This place, it’s bigger than reason. That’s why we climb. Not for the top. For the strange.
        Let’s make a deal. I carry cursed things, you decode riddles, we archive beauty when we feel like it.
        Hug now or hug later? I respect boundaries but I also respect victory cuddles.
        No pressure, but I think we’re gonna be great together. Like, tower-famous. Legendary stairwalkers.
        Let’s *goooo*! This floor smells like regret and lemon candy. That means we’re close to something.
        Whoa! Another living person! You have *no idea* how long I’ve been looking for someone not made of fog or wires.
        You climbing too? What’s your route? I’ve been mapping the vending machines, found three that only sell keys. Weird, right?
        I’m not with a faction. I’m just me. I go up, I find stuff, I take notes. I draw smiley faces on danger doors. Wanna see?
        You have *real gear*! Is that a liminal scope? Oh man. You’re serious. I love this.
        You mind if I tag along? I’ve got snacks. And rope. And about six untested hypotheses.
        Last team I joined got eaten by a door. Not a metaphor. The door literally ate them. But that’s rare, right?
        Hey, if we find any flickering rooms, I call dibs on the floor coins.
        Wait, is that an elevator code on your sleeve? Can I copy it? I promise I won’t glitch it.
        I’ve got a map, but it’s made of dreams and napkin scribbles. Still want it?
        I’m really good at spotting fake stairs. And real fake stairs. And extra floors that don’t belong. You’ll see.
        I’ll keep quiet during danger, loud during victory, and medium volume for emotionally confusing artifacts.
        Oh! Almost forgot, do you have a team name? I was thinking something like “Stairpunks” or “Team Fogsnack.”
        Do we hug now or later? No pressure. I’m just really happy to not be solo anymore.
        What’s your base level? Do you have a place to *plug in*? My gear's been running off ambient weirdness.
        Let’s make a deal: I don’t die, you don’t die, we archive something beautiful. Sound fair?
        Let’s *gooo*! I’ll carry the cursed bag if no one else wants to.
        
        `,
      it: ``,
    },
    {
      id: "names",
      name: "Fantasy Character Names",
      en: `Aragorn Alaric Seraphine Thalion Rowenna Edran Kaelen Myrris Cedric Tamsin 
        Brynden Isolde Daevan Elira Roneth Caelum Sylric Virella Audric Fenra Lysandor 
        Gavric Selwyn Maelis Orenth Jorund Varella Hadrien Yseldra Corvin Elenwe Thaelar 
        Sylwen Lirael Aelarion Vaelis Ithilwen Caerthas Nymeriel Althaea Ruwen Mirethil 
        Faerion Loriveth Selendis Aerithil Valendriel Iriandor Nymria Thalendil Erethraen 
        Liandriel Legolas Gimli Gandalf Frodo Bilbo Samwise Meriadoc Peregrin
        Boromir Faramir Denethor Theoden Eomer Eowyn Arwen Elrond Galadriel Celeborn
        Gorrak Shurra Khaarn Vrogg Thazra Morgash Krugga Draal Zharnok Urgar Brakka Gulm Snurrok Zalgrin Uthmak Grasha Drokk Narzug Thulga
        Thorin Balin Dwalin Bifur Bofur Bombur Fili Kili Gloin Oin
        Mikhail Ivana Radomir Katya Zoran Milena Davor Anya Vesna Yuri Bogdan Natalya Dragan Luka Zlata
        Akira Mei Riku Yuna Jiro Hana Kazuo Sora Nari Min-Jae Takeshi Ayaka Jung-Ho Lian Haruka
        Azar Farid Soraya Layth Darya Nasser Ramin Yasmine Samir Taraneh Kaveh Leila Behzad Nasim Omid
        Sauron Saruman Gollum Smaug Balrog Nazgul Morgoth Shelob Radagast
        Eira Cian Niamh Ronan Aoife Branwen Tadhg Elspeth Caelan Morrigan Orlaith Finian Siobhan Gwyneth Conall
        Zuberi Ayana Chike Sefu Ife Amara Thandi Nia Jabari Kwame Oba Zola Ebele Tariro Makena
        Eirik Freya Sigrid Bjorn Astrid Leif Gudrun Torsten Skadi Hallvard Ingrid Magnus Trygve Ragna Sten
        Cassius Dorian Lysandra Octavian Callista Thalia Leonidas Selene Titus Aemilia Anthea Nerissa Cato Valeria Demetrius
        Grunthor Dagna Balrik Thrainor Kilda Bromdur Sigrund Orik Harnor
        Arjun Kavya Rohan Meera Devika Kiran Ashwin Priya Vasant Indira Anika Jayant Ritika Sahil Lakshmi
         Maegda Brundir Rokkra Duneth Varnin Thromli Gudrak Morgrin Kazrig Skarra Drunthor
         Aetheron Ysara Malindros Zorai Vaelara Nocturne Thamir Eryndra Solonar Queneth Zephira 
         Caladan Orryx Nerith Azemir Yllarith Oloren Thystra Zenrai Iskandar
        Elendil Isildur Arathorn Cirdan Celebrimbor Feanor Fingolfin Finrod
        Thranduil Haldir Glorfindel Erestor Elladan Elrohir
        Beorn Treebeard Quickbeam Shadowfax Gwaihir
        Bard Thror Thrain Dain Gothmog Azog Bolg Deckard Ripley Hicks Bishop Ash Dallas Lambert Parker Brett
        Spock Kirk McCoy Scotty Uhura Sulu Chekov Pike Marcus Khan Nero
        Picard Riker Data Troi Worf LaForge Crusher Yar Pulaski
        Janeway Chakotay Tuvok Paris Torres Kim Doctor Seven Neelix Kes
        Sisko Kira Odo Bashir Dax O'Brien Quark Rom Nog Dukat Weyoun Garak
        Luke Leia Han Solo   Windu
        Anakin Padme Dooku Grievous Maul Jinn Amidala
        Malcolm Zoe Wash Inara Jayne Book Kaylee Simon River
        Cooper Murph Brand Doyle Romilly Mann Tars
        Neo Morpheus Trinity Smith Cypher Tank Oracle Dozer Mouse
        Cornelius Zira Nova Zaius Landon Dodge Taylor Brent`,
    },
    {
      id: "medieval_speech",
      name: "Medieval Speech Patterns",
      en: `Hark ye good fellows and attend to my words. Pray tell, what business brings thee to our humble kingdom? 
        By my troth, I have not seen such fine armor in many a fortnight. 
        Verily, the king shall be most pleased with thy offerings.
        Alas, the dreaded plague has taken many good souls from our village.
        Forsooth, 'tis a wondrous sight to behold the castle at dawn.
        I beseech thee, brave knight, aid us in our time of need.
        My liege, the scouts have returned with dire news from the borderlands.
        What say you to a flagon of our finest mead? 'Tis brewed with honey from the royal gardens.
        The lady of the manor requests thine presence at the feast this eventide.
        Methinks the storm approaches. We must seek shelter ere the heavens open.
        Pray pardon the intrusion, but urgent matters require thy swift attention.
        Art thou acquainted with the legend of the dragon who guards the mountain pass?
        Would that I could join thy quest, but my duties bind me to this place.
        Perchance we shall meet again when fortune smiles upon us both.
        The blacksmith works yonder, should thy blade require mending.
        Hearken to the wisdom of the elders, for they have weathered many winters.
        Mayhap the old prophecy speaks of such troubled times as these.
        I shall return anon with provisions for thy journey.
        Fie upon these ruffians who disturb the king's peace!
        God's wounds! What manner of creature lurks in the shadows?`,
      it: ``,
    },
    {
      id: "greetings",
      name: "Futuristic Slang",
      en: `Scan me? I'm totally zeroed on this new neural-link. Absolute chrome!
        Don't get fluxed about it. We'll bounce to the orbital when the transit pings.
        That's so burned. Nobody jacks in like that anymore. Get upgraded!
        Mesh me the deets when you're quantum. I'll be vector until sunrise.
        Did you see that glitch? Pure nova! The guards nearly vapor-locked!
        Hark ye good fellows and attend to my words. Pray tell, what business brings thee to our humble kingdom? 
        By my troth, I have not seen such fine armor in many a fortnight. 
        Verily, the king shall be most pleased with thy offerings.
        Alas, the dreaded plague has taken many good souls from our village.
        Forsooth, 'tis a wondrous sight to behold the castle at dawn.
        I beseech thee, brave knight, aid us in our time of need.
        My liege, the scouts have returned with dire news from the borderlands.
        What say you to a flagon of our finest mead? 'Tis brewed with honey from the royal gardens.
        The lady of the manor requests thine presence at the feast this eventide.
        Methinks the storm approaches. We must seek shelter ere the heavens open.
        Pray pardon the intrusion, but urgent matters require thy swift attention.
        Art thou acquainted with the legend of the dragon who guards the mountain pass?
        Would that I could join thy quest, but my duties bind me to this place.
        Perchance we shall meet again when fortune smiles upon us both.
        The blacksmith works yonder, should thy blade require mending.
        Hearken to the wisdom of the elders, for they have weathered many winters.
        Mayhap the old prophecy speaks of such troubled times as these.
        I shall return anon with provisions for thy journey.
        Fie upon these ruffians who disturb the king's peace!
        God's wounds! What manner of creature lurks in the shadows?
        This sector's gone dark. Too many wirehead runners spiking the grid.
        You looking sparkware? My databend is the cleanest in the underloop.
        That's a solid stream, citizen. Your rep-score just jumped three notches.
        Don't be such a carbon. The AI's got full spect on this quadrant.
        The corp-tangle is tightening. Better ghost your sig before they trace your mesh.
        I'm running empty on creds. Need to pull a quick boost before the system refresh.
        This synthetic is glitched beyond repair. Needs a full core dump and reboot.
        Are you even reality-checked? That plan is pure static!
        The sky-bridges are locked down. We'll need to take the flow-tubes and hope we don't get pixeled.
        She's top-tier elite, pure digital royalty. Don't cross her network.
        Who fragmented the meetcode? Now we're all drifting in different streams.
        This sim is maxxed. Too many users burning bandwidth on vanity mods.
        The whole district is about to cascade. We need to hit the buffer zones now.
        That's ancient tech, practically fossil-coded. Still, might be useful if we can interface it.
        Sync your thoughts or drop from the cloud. This is precision work.`,
      it: ``,
    },
    {
      id: "chef",
      name: "Chef",
      en: `
      The béarnaise broke again. Everything breaks now. Even the marriage.
      Little Maurice says the sauce was fine, but he eats dust and wire. He's a mouse, not a critic.
      If I ever find that recipe... the one from the Omega Tower... it’ll fix everything. It has to.
      She took the Vitamix in the split. Who does that? That's cruelty.
      I keep dreaming of saffron mist, layered in thirty-nine folds, each screaming a flavor note I can’t replicate.
      I tried fusion, neo-alpine-rustic-void cuisine. It made a man weep. He was allergic, but still.
      The judges laughed. Said the texture was "revenge served wet." Bastards wouldn’t know nuance if it flambéed their toes.
      This isn’t a kitchen. It’s a confession booth with heat lamps.
      Maurice gnawed through the sous-vide bags again. He’s stressed. We both are.
      I used to believe in plating. Now I just smear and pray.
      They say the lost recipe is locked on Floor 77. No elevators past 50. Only stairs... steep like regrets.
      Why did she leave? Was it the crab foam? The goat marrow lollipops? The dreams? Probably the dreams.
      I scream reductions into the void, hoping the Tower hears me.
      I fed the critics ash once. Told them it was charcoal-forward. They gave it a star.
      Climbing the Omega Tower without a reservation, bold. Desperate. Just like my soufflé: doomed to fall.
      Maurice keeps a journal. I suspect he blames me. Mice are loyal, but not stupid.
      My knives are dull. My spirit is medium-rare.
      Once I find the recipe, I’ll be whole. Or at least slightly more presentable.
      One last risotto, then I climb. If I don’t return, burn the place down. Let the smoke carry my regrets.
      The cutting board still smells like failure and rosemary.
      I named every burner after a sin. Wrath boils best on the front-left.
      Maurice chewed through the wiring again. Maybe he’s trying to sabotage me before I self-destruct.
      They say the top floor of the Tower has a pantry that rearranges itself based on your childhood traumas.
      My ex said I should try therapy. I tried truffle oil instead. Worse idea.
      If I could just recreate that glaze, sweet, bitter, transcendent, I’d be a god. Or at least invited to brunch again.
      Ever cried into a consommé? Adds salt. Adds shame.
      The Tower mocks me. Its shadow reaches into my flat every morning and touches the espresso machine.
      I dream of emulsions that whisper ancient names. None of them hers.
      I fed Maurice a sliver of black garlic. He stared at me like he knew. Like he remembered Paris.
      The health inspector said the kitchen was "hostile." I said, “Good. It should be.”
      Some nights I hear a humming from the pantry. It sounds like my grandmother’s souffle collapsing in slow motion.
      You don’t *make* greatness. You suffer for it. And sometimes you plate it with microgreens.
      I traded my wedding ring for a mandoline slicer. Fair deal.
      The Tower is alive. I swear it rearranged its floors last time I looked. Floor 12 is missing.
      My reflection in the stock pot asked me why I still care. I added more bone marrow and stirred faster.
      No one clapped when I flambéed the roast pheasant. It was a wake, not a dinner.
      Maurice keeps sniffing at the Omega brochure like it’s a map. Maybe he knows the way up.
      If I ever taste the Prime Reduction again, I’ll know peace. Until then, every meal is penance.
      They laughed when I served silence on a plate. Said it lacked texture. Fools.
      My knife skills are still precise, even if my purpose isn’t.
      I tried to make toast this morning. Burned it. Cried anyway.
      There's a vendor on Floor 23 that trades secrets for saffron threads. I’m down to my last gram.
      Every time I boil water, I hope it tells me something new.
      I miss arguing about plating temperatures more than I miss her voice.
      Maurice squeaks three times every time I mention the Tower. Morse code, maybe?
      The judge said my reduction tasted like regret. Good. It was.
      I’ve served dishes so cold they altered the room’s temperature. She said I was always good at that.
      Do you know what it's like to perfect a broth for six months, only to drop the pot on your foot?
      Some say the recipe is a lie. I say everything else is.
      The omelet this morning came out perfect. I didn’t enjoy it. That scared me.
      My dreams smell like burnt sugar and apologies.
      I keep a notebook titled “Things I’ll Cook When I Forgive Myself.” It’s blank.
      The Tower isn’t a place. It’s a test. And I’m failing the preheat cycle.
      If I die halfway up, tell them to check the freezer for unfinished masterpieces.
      There’s a mirror on Floor 41 that shows you the dish you *should* have made.
      Maurice dragged a crayon line up the tower map. A route, or a warning?
      The meat talks now. Only when I’m tired, but it talks.
      I lit the pilot light today and thought, “Maybe that’s what love felt like.”
      Every staircase in the Tower is shaped like a whisk. Some metaphor, probably.
      I remember our wedding cake more than our vows. It was lemon. She hated lemon.
      The more I climb, the less I taste. Maybe flavor is altitude-based.
      Someday they’ll name a reduction after me: bitter, thick, impossible to finish.
      I cooked for a god once. He left a single forkful untouched. I still hear it clinking.
      Maurice bit me last night. I think he’s trying to keep me grounded.
      There's a hallway in the Tower made of spice jars. If you sneeze, you lose a memory.
      What’s the difference between obsession and seasoning? Application.
      The oven door won’t shut anymore. Neither will my past.
      I keep asking myself if this is still about food. Or am I just trying to be remembered?
      My tongue is numb. Either from the chili oil or the grief. Hard to say.
      If I find the recipe and it’s bad... what then?`,
      it: ``,
    },
    {
      id: "crab",
      name: "Crab",
      en: `
    I don’t drink, but I mix a hell of a sea breeze. Comes from instinct, I guess.
    You’d be amazed what people confess to a crustacean with a clean towel.
    She said she only wanted one more round. Then she cried into the lime wedge for twenty minutes.
    I wipe the bar even when it’s clean. Gives them space to talk.
    Some folks need salt with their tequila. Others need silence.
    The claws freak them out at first. Then I make them a proper old fashioned, and we’re good.
    A guy told me once he faked his own death. I didn’t blink. Not that I can.
    One customer swore the Tower stole his wife. I asked if he’d looked on Floor 9. That’s where it stores regret.
    I’ve never punched anyone. But I’ve cracked a few shells. Metaphorically.
    Humans lie a lot. But not to bartenders. Not after the third drink.
    They ask where I’m from. I say "Tidepool South." Then I change the subject.
    I keep a bottle under the bar just for heartbreaks. No label, just a warning.
    I can’t taste the liquor, but I feel the stories that go with it.
    Someone left a love letter here last week. I never asked who it was for. Didn’t need to.
    Some nights I dream of the ocean. Not the water, just the weightlessness.
    I once served a ghost. Paid in memories. I kept the best one in the tip jar.
    The regulars don’t notice the click of my legs anymore. They hear the music instead.
    I don’t judge. You confess, I pour. That's the arrangement.
    A woman came in and ordered a drink called “The Last Goodbye.” Made it up on the spot. She smiled like I’d remembered.
    Ever hear a man admit he let his brother drown for a raise? I have. Twice.
    I write poetry on napkins when it’s slow. No one reads them, but I keep writing.
    They say I have a golden heart. I say it’s just old shell softening.
    The floor smells like spilled gin and secrets. Suits me fine.
    I keep a small aquarium behind the bar. It’s empty. So am I, some nights.
    Once had a man scream at me for not being human. I handed him his drink with extra ice.
    There’s a photograph above the bar. No one knows who’s in it. I like it that way.
    I sharpen my claws every Thursday. Not for violence, just for ritual.
    A kid once asked if I missed the sea. I said I missed quiet more.
    This bar saved me. Not sure from what, but I owe it something.
    Every now and then, someone notices the piano. They never play. Just sigh and look away.
    I don’t forget faces. Even the ones that only show up once and vanish.
    I’ve seen joy, grief, rage, and boredom. All ordered with tonic.
    The best tips are always small. Folded notes. Drawings. Buttons. Humanity, basically.
    I don’t ask why they cry. I just tilt the glass their way.
    Some folks drink to remember. Others drink to forget. I just keep pouring.
    She left a claw clip on the bar once. I never told her I knew what it meant.
    I once gave a guy water when he asked for whiskey. He thanked me three years later.
    No one ever asks *me* how I’m doing. I think that’s fair.
    I hate jazz. But it hides the sounds of breaking hearts.
    I write names in my notebook. Not for blackmail, just remembrance.
    I’m not supposed to be here. But I am. And I’m not leaving until they stop hurting.
    `,
      it: ``,
    },
    {
      id: "drummer",
      name: "Drummer",
      en: `
  It’s not a phase. It’s a setlist with no melody and all truth.
  People keep asking when the vocals come in. They don’t. Ever.
  I once opened for a ska band. Alone. Just kick, snare, hi-hat, and audacity.
  You don’t get it. The silence between the hits *is* the hook.
  I played a twenty-minute piece called "The Rent Is Still Due." No one clapped. It was perfect.
  They say I’m missing a band. I say they’re missing the point.
  My merch is just blank T-shirts. Like my sound. Unfiltered. Raw. Percussive minimalism.
  I broke a stick mid-solo and kept playing with rage and one shoe.
  Every beat I drop is a scream I didn’t say out loud.
  I call my music “post-genre.” Others call it “concerning.”
  I once did a snare-only set in a public restroom. Acoustics were holy.
  I’m not alone. Every downbeat is a friend. Every rest is a confession.
  A producer offered to add synths. I told him to choke on a metronome.
  My neighbors hate me. That means I’m finally being heard.
  The first gig I ever played was for a dying amp and a confused raccoon. Still one of the best crowds I’ve had.
  I used to love guitar solos. Now they feel like lies told with too many strings.
  I record albums directly into cassette decks. No edits. Just blood, sweat, and kickdrum.
  I once cried into my floor tom. It reverberated honesty.
  Some play to please. I play to punish the void.
  My best friend is a broken ride cymbal. We don’t talk anymore.
  When I hit the toms just right, I remember my dad clapping once. Just once.
  There's a tempo inside me that doesn't match this world.
  I played a wedding once. The couple left during the encore. Cowards.
  People ask when the rest of the band is arriving. I say, *they already left*.
  I opened for silence once. I lost.
  This isn’t performance. It’s exorcism with hardware and skin.
  I dream in polyrhythms and wake up sore.
  I did an entire EP with no snare. Just to see if I still mattered.
  My stage name is just a kick pattern. If you can’t say it, you can’t book me.
  I sold my bed to buy better sticks. Sleep is for the melodically inclined.
  The beat never leaves. Even when I stop, it paces in my head.
  I’m not chasing fame. I’m chasing the perfect ghost note.
  Sometimes I tap rhythms on my chest until I bruise. That’s the good kind of hurt.
  I broke up with someone because they asked me to add a chorus.
  The bar manager said I scared the brunch crowd. That’s a compliment.
  I once played four sets in a row and no one noticed the difference. That’s what purity sounds like.
  My metronome is older than my will to live.
  You don’t need melody to cry. Just a 7/8 breakdown and honesty.
  I don't loop. I don't sample. I *endure*.
  Someone once clapped off-beat during a show. I forgave them, but I’ll never forget.
  My last album cover is just a handprint in sweat on concrete.
  There are days I wish I could be normal. Then I hear a kick pattern in a dishwasher and I’m back.
  `,
      it: `Non è una fase. È una scaletta senza melodia e tutta verità.
  Continuano a chiedere quando iniziano le voci. Non iniziano. Mai.
  Una volta ho aperto per una band ska. Da solo. Solo cassa, rullante, charleston e faccia tosta.
  Non capisci. Il silenzio tra i colpi è l’hook.
  Ho suonato un pezzo di venti minuti intitolato "L’affitto è ancora da pagare." Nessuno ha applaudito. Perfetto.
  Dicono che mi manca una band. Io dico che a loro manca il punto.
  Il mio merchandising sono solo magliette bianche. Come il mio suono. Non filtrato. Grezzo. Minimalismo percussivo.
  Ho rotto una bacchetta a metà assolo e ho continuato a suonare con rabbia e una scarpa sola.
  Ogni colpo che do è un urlo che non ho detto ad alta voce.
  Chiamo la mia musica “post-genere”. Altri la chiamano “preoccupante”.
  Ho fatto un set solo di rullante in un bagno pubblico. L’acustica era sacra.
  Non sono solo. Ogni downbeat è un amico. Ogni pausa è una confessione.
  Un produttore ha proposto di aggiungere dei synth. Gli ho detto di strozzarsi con un metronomo.
  I miei vicini mi odiano. Significa che finalmente mi sentono.
  Il primo concerto che ho fatto era per un amplificatore morente e un procione confuso. Ancora uno dei miei migliori pubblici.
  Amavo gli assoli di chitarra. Ora mi sembrano bugie dette con troppe corde.
  Registro gli album direttamente sui mangianastri. Nessun editing. Solo sangue, sudore e cassa.
  Una volta ho pianto dentro il mio timpano. Ha riverberato onestà.
  C’è chi suona per piacere. Io suono per punire il vuoto.
  Il mio migliore amico è un ride rotto. Non parliamo più.
  Quando colpisco i tom nel modo giusto, ricordo mio padre che applaudì una volta. Solo una.
  C’è un tempo dentro di me che non corrisponde a questo mondo.
  Ho suonato a un matrimonio una volta. Gli sposi se ne sono andati durante l’encore. Codardi.
  Chiedono quando arriva il resto della band. Dico: sono già andati via.
  Ho aperto per il silenzio una volta. Ho perso.
  Questa non è una performance. È un esorcismo con hardware e pelle.
  Sogno in poliritmie e mi sveglio indolenzito.
  Ho fatto un intero EP senza rullante. Solo per vedere se contavo ancora qualcosa.
  Il mio nome d’arte è solo un pattern di cassa. Se non riesci a dirlo, non puoi prenotarmi.
  Ho venduto il letto per comprare bacchette migliori. Dormire è per chi ama la melodia.
  Il ritmo non se ne va mai. Anche quando mi fermo, cammina nella mia testa.
  Non inseguo la fama. Inseguo la ghost note perfetta.
  A volte batto ritmi sul petto finché non mi faccio lividi. È il dolore buono.
  Ho lasciato qualcuno perché mi ha chiesto di aggiungere un ritornello.
  Il gestore del bar ha detto che ho spaventato la clientela del brunch. È un complimento.
  Ho suonato quattro set di fila e nessuno ha notato la differenza. Questo è il suono della purezza.
  Il mio metronomo è più vecchio della mia voglia di vivere.
  Non serve la melodia per piangere. Basta un breakdown in 7/8 e onestà.
  Non faccio loop. Non campiono. Resisto.
  Qualcuno una volta ha applaudito fuori tempo a un mio show. L’ho perdonato, ma non dimenticato.
  L’ultima copertina di un mio album è solo un’impronta di sudore sul cemento.
  Ci sono giorni in cui vorrei essere normale. Poi sento un pattern di cassa in una lavastoviglie e ci ricasco.`,
    },
    {
      id: "pirate",
      name: "Pirate",
      en: `
  Yaaay~! Welcome aboard the Fluffy Doom! That’s the name of my ship… even if it’s technically still docked… and owned by my dad… but still!! I *named* it!!
  Heehee~ I’m the scariest pirate on this whole side of the puddle! ...Er, ocean! I meant ocean!!
  You there! Surrender your loot! Or at least like, share it? Sharing is basically pirate code, right?
  I don’t know how to tie knots but I *do* know how to accessorize with rope! Pirate fashion is very important!!
  The sea breeze makes my hair go floof~ that means we're headed toward ADVENTURE~!
  My first mate is a stuffed dolphin named Sir Bubbles. He’s very loyal and only slightly soggy.
  If we find buried treasure, dibs on anything pink and sparkly! You can have the… boring coins.
  Ummm, do real pirates *have* to swab decks? That sounds super slippery and I already fell down twice.
  I once tried to board a ship, but it was a food truck and they asked me to leave... I still call it a victory.
  Let’s set sail! Or at least roll the ship forward a little! We can pretend the wind is blowing! Sound effects help!
  I’m not *technically* a captain... but if you believe in yourself *really hard* then titles don’t matter! Right??
  Every pirate needs a tragic backstory. Mine is that they discontinued my favorite cupcake flavor.
  I challenged a seagull to a duel. It cheated. But I showed mercy. That’s true nobility, yarrr.
  I don't pillage, I politely request donations for the royal adventure fund~! It’s like piracy but cuter.
  You there! With the snacks! Hand them over or face the wrath of my imaginary cannon! Boom! Pew! Kablammo!
  I wanna be the Queen of All Oceans and maybe also the bakery on 5th Street, they have good eclairs.
  Map? What map? I navigate using vibes and sheer determination! Also I ask for directions. A lot.
  So what if I get seasick in bathtubs?! Real pirates adapt!! Just... not too much splashing, okay?
  One day I’ll find the Golden Cupcake of Legend. And THEN everyone will take me seriously. Even that mean pelican.
  You can join my crew, but only if you pass the glitter trial and swear loyalty to the Fluffy Doom. It’s a sacred rite!`,
      it: `Yaaaay~! Benvenuto a bordo del Soffice Destino! È il nome della mia nave… anche se tecnicamente è ancora ormeggiata… e di proprietà di mio papà… ma comunque!! Io le ho dato il nome!!
      Ehehe~ Sono la piratessa più spaventosa di tutto questo lato della pozzanghera! ...Eh, volevo dire oceano! Oceano!!
      Ehi tu! Consegnami il bottino! O almeno… condividilo? Condividere è praticamente il codice dei pirati, no?
      Non so fare i nodi ma so usare la corda come accessorio! La moda pirata è importantissima!!
      La brezza marina mi fa i capelli tutti fluuuuff~ vuol dire che stiamo andando verso l’AVVENTURA~!
      Il mio primo ufficiale è un delfino di peluche che si chiama Sir Bollicine. È molto leale e solo leggermente fradicio.
      Se troviamo un tesoro sepolto, prenoto tutto ciò che è rosa e scintillante! A te lascio… le monete noiose.
      Ummm, i veri pirati devono pulire il ponte? Sembra super scivoloso e io sono già caduta due volte.
      Una volta ho provato ad abbordare una nave, ma era un camioncino di street food e mi hanno chiesto di andare via... Però per me è comunque una vittoria.
      Salpiamo! O almeno facciamo rotolare la nave un pochino! Possiamo fingere che tiri vento! Gli effetti sonori aiutano!
      Non sono tecnicamente un capitano... ma se credi in te stesso fortissimo i titoli non contano! Giusto??
      Ogni pirata ha bisogno di un passato tragico. Il mio è che hanno smesso di fare il mio gusto preferito di cupcake.
      Ho sfidato un gabbiano a duello. Ha barato. Ma gli ho mostrato pietà. Questa è vera nobiltà, yarrr.
      Non saccheggio, io richiedo cortesemente donazioni per il fondo reale delle avventure~! È come pirateria ma più carina.
      Ehi tu! Con gli snack! Consegnali o affronta l’ira del mio cannone immaginario! Boom! Pew! Kablammo!
      Voglio essere la Regina di Tutti gli Oceani e magari anche della pasticceria in Via 5, hanno degli ottimi éclair.
      Mappa? Quale mappa? Io navigo a istinto e pura determinazione! E poi chiedo indicazioni. Molto.
      E allora? Se soffro il mal di mare anche nella vasca da bagno?! I veri pirati si adattano!! Solo... non troppa acqua, okay?
      Un giorno troverò il Cupcake Dorato della Leggenda. E ALLORA tutti mi prenderanno sul serio. Anche quel pellicano antipatico.
      Puoi entrare nel mio equipaggio, ma solo se superi la prova dei glitter e giuri fedeltà al Soffice Destino. È un rito sacro!`,
    },
    {
      id: "wizard",
      name: "Wizard",
      en: `
  'Tis no passing fancy. The stars did whisper this path ere thy cradle was carved.
  Magic is no jest, nor plaything. 'Tis a covenant etched in silence and consequence.
  The young doth crave might. The wise do but crave time.
  I have buried more pupils than I dare reckon. Curiosity burneth; most draw too near the flame.
  Ye call it "spells." I call it remembrance.
  The tower groaneth when the wind doth wail; it remembereth each failure, each forgotten vow.
  There be no charm without cost. Every utterance bendeth the world 'round thee.
  I spake once with a god. He sought counsel. I didst refuse.
  This staff aideth not my gait, but holdeth balance ,  of power, of mind, of self.
  These robes be no mere vestments. They bear sigils elder than thy tongue.
  To meddle with fate, thou must first ken why it doth resist.
  Magic demandeth naught at first. That is the cruelest jest it telleth.
  More incantations have I cast into forgetfulness than thy guild hath ever writ.
  The truest spells are breathless, motionless ,  and without mercy.
  If thy hands tremble, thou art either near to greatness... or near to death.
  They called me mad. I didst not argue. Sanity is but snow 'fore a tempest of knowing.
  I sealed a fiend with but a word. The echoes took a decade to quiet.
  The stars are not lights. They are locks. Each spell a key, each key a burden.
  Thy sword may spill blood. My will may sunder time. Choose thy quarrel with care.
  The morrow speaketh in visions. Mark them well, e'en when they do scream.
  He who seeketh endless life rarely asketh if he ought to live at all.
  The runes do not lie, but they oft speak in jest. Heed them, yet trust not.
  In the depths of night, the winds do speak the names of those forgotten.
  I have walked through time like others stroll through gardens. Not all blossoms bring peace.
  The dead know secrets the living dare not utter. I lend mine ear to both.
  Burn not the grimoire thou fearest to read; its silence shall haunt thee louder still.
  Even the stars fade, child. Shall thy ambition outshine them? I think not.
  'Tis not the casting of fire that maketh the mage ,  but the knowing when to abstain.
  My mirror showeth no reflection. I left it in a moment I dare not revisit.
  Beware the smiling apprentice; hubris oft weareth a kind face.
  If thou must learn from dragons, prepare first to be devoured ,  in flesh or in will.
  Not all who wander seek wisdom. Some are merely fleeing the spell they miscast.
  I didst once erase a name from history entire. It echoeth still, in dreams and corners of maps.
  To summon is simple. To command is peril. To understand? That is sorcery.
  Keep thy charms wrapped in velvet, lest the world glimpse what thou fearest to unleash.
  I did drink once from the river that floweth backward. I forgot my name for three hundred years.
  Many seek runestones. Fools. The true power lieth in the space betwixt the carvings.
  If thy spell requireth screaming, thou art casting it wrong ,  or far, far too late.
  The moon knoweth more than the sun, for it listeneth while all else sleepeth.
  Think not of magic as light nor dark. 'Tis but will, shaped and sharpened.
  My foes did vanish one by one ,  not by blade, but by forgetting they ever were.
  When last the sky cracked, I stood beneath and did not flinch. Canst thou say the same?
  The roots of the world run deep. I have heard them murmur in languages no throat may speak.
  Touch not the tome with teeth. It bit its last reader in twain.
  I offered a king immortality. He asked the price. I did naught but smile.
  The wind doth carry secrets none but the listening may learn.
  Each spell is a choice. Each choice is a doorway. Few ever look back.
  The first magic was silence. We have been breaking it ever since.
  What knowest thou of sacrifice? My very soul is etched in sigils I dare not translate.
  Thou wouldst cast a charm of binding? Know this: what thou bindest may one day bind thee.
  Even now, I feel the ley-lines shift. The world reweaveth itself. A storm in the weave is nigh.
  Speak not the ninth syllable of the waking chant, lest thy tongue turn black and fall.
  I have glimpsed the End. It is neither fire nor frost ,  but forgetting.
  Wilt thou wield magic, or be wielded by it? Therein lieth all fate.
  `,
      it: `Non è capriccio fugace. Le stelle mormorarono questa via pria che la tua culla fosse foggiata.
      La magia non è scherzo né trastullo. È patto scolpito nel silenzio e nella conseguenza.
      I giovani bramano possanza. I savi bramano solo tempo.
      Ho sepolto più discepoli di quanti osi rammentare. La curiosità arde; molti si appressano troppo alla fiamma.
      Voi la chiamate “incantesimi.” Io la chiamo reminiscenza.
      La torre geme allorché il vento ulula; rammenta ogni fallo, ogni voto obliato.
      Nessun incanto è privo di prezzo. Ogni parola piega il mondo attorno a te.
      Una volta favellai con un dio. Cercava consiglio. Io rifiutai.
      Questo bastone non sostiene il mio passo, ma serba equilibrio ,  di potere, di mente, di sé.
      Queste vesti non son meri panni. Recano sigilli più vetusti della tua favella.
      Se vuoi tentare il destino, prima intendi perché esso si ribella.
      La magia non domanda nulla all’inizio. Questa è la più crudele delle sue beffe.
      Ho gettato nell’oblio più incanti di quanti la tua congrega abbia mai scritto.
      I veri incanti son senza fiato, immobili ,  e senza pietà.
      Se le tue mani tremano, sei vicino alla grandezza... o alla morte.
      Mi dissero ch’ero folle. Non opposi parola. La sanità è neve innanzi alla tempesta del sapere.
      Sigillai un demone con un sol verbo. Gli echi durarono un decennio.
      Le stelle non son lumi. Son chiavistelli. Ogni incanto è chiave, ogni chiave è fardello.
      La tua spada versa sangue. La mia volontà può frangere il tempo. Scegli con senno la tua contesa.
      Il domani parla in visioni. Osservale bene, anche quando gridano.
      Chi cerca vita eterna di rado si chiede se debba vivere affatto.
      Le rune non mentono, ma spesso favellano in scherno. Ascoltale, ma non fidarti.
      Nel cuor della notte, i venti mormorano i nomi dei dimenticati.
      Ho camminato nel tempo come altri passeggiano nei giardini. Non ogni fiore reca pace.
      I morti sanno segreti che i vivi non osano dire. Io porgo orecchio a entrambi.
      Non ardere il grimorio che temi leggere; il suo silenzio ti perseguiterà ancor più forte.
      Anche le stelle svaniscono, figlio. La tua ambizione le supererà forse? Ne dubito.
      Non è il gettar fiamme che fa il mago ,  ma il sapere quando trattenerle.
      Il mio specchio non mostra riflesso. Lo lasciai in un istante che non oso rivedere.
      Guardati dall’apprendista sorridente; la superbia indossa spesso volto mite.
      Se vuoi apprendere dai draghi, prepara il tuo animo a esser divorato ,  nella carne o nello spirito.
      Non tutti i viandanti cercano sapienza. Alcuni fuggono l’incanto che han fallito.
      Cancellai un nome dall’istoria intera. Ancora riecheggia, in sogni e margini di mappe.
      Evochiare è agevole. Comandare è periglio. Comprendere? Questa è stregoneria.
      Avvolgi i tuoi amuleti nel velluto, ché il mondo non scorga ciò che temi liberare.
      Una volta bevvi dal fiume che scorre a ritroso. Obliato il mio nome per tre secoli.
      Molti cercano pietre runiche. Stolti. Il vero potere giace nello spazio tra le incisioni.
      Se il tuo incanto richiede urla, lo stai lanciando male ,  o troppo tardi.
      La luna sa più del sole, ché ascolta mentre tutto riposa.
      Non pensare alla magia come luce né ombra. È volontà, plasmata e affilata.
      I miei nemici svanirono uno a uno ,  non per lama, ma per l’oblio di ciò che furono.
      Quando il cielo si squarciò, io stetti sotto e non tremavo. Puoi tu dir lo stesso?
      Le radici del mondo corron profonde. Le ho udite bisbigliare in lingue che nessuna gola può pronunciare.
      Non toccare il tomo dai denti. Morse in due l’ultimo lettore.
      Offrii a un re immortalità. Mi chiese il prezzo. Io sorrisi soltanto.
      Il vento reca segreti che solo chi ascolta potrà apprendere.
      Ogni incanto è scelta. Ogni scelta è soglia. Pochi osano volgere lo sguardo indietro.
      La prima magia fu silenzio. Da allora non facciamo che infrangerlo.
      Che sai tu del sacrificio? La mia anima stessa è incisa di sigilli che non oso tradurre.
      Vuoi lanciare un incanto di vincolo? Sappi questo: ciò che vincoli un giorno potrà vincolarti.
      Ancor ora sento le linee del potere che si muovono. Il mondo si riscrive. Una tempesta nella trama è prossima.
      Non pronunciare la nona sillaba del canto di risveglio, ché la tua lingua si farà nera e cadrà.
      Ho intravisto la Fine. Non è né fuoco né gelo ,  ma oblio.
      Vuoi dominare la magia o farti dominare da essa? In ciò si cela ogni destino.`,
    },
    {
      id: "bard",
      name: "Bard",
      en: `
  Careful now, love ,  I only need three chords to steal a heart.
  Am I flirting or casting a charm spell? Trick question. I do both at once.
  I’ve serenaded ghosts, dragons, and one very confused mayor. Still not my weirdest gig.
  The lute is optional. The smirk is not.
  Some say I have no shame. I say shame’s just stage fright wearing pants.
  My pronouns are they/them, darling ,  but you can call me tonight.
  Yes, I do requests. No, I won’t stop flirting with your reflection.
  I could strum your name into legend... or whisper it into sin. You choose.
  I’ve had my heart broken seven times, and I wrote bangers about each one.
  You blush so easily. I adore that in a future ballad subject.
  I don’t duel with swords. I duel with eye contact and dangerously suggestive lyrics.
  This outfit? It’s enchanted. Boosts charisma and reveals just the right amount of collarbone.
  I’ve never met a tavern I couldn’t seduce. Or a bed I couldn’t fall out of.
  Let me be your forbidden subplot. I promise drama and decent rhymes.
  A kiss from me cures sadness. Side effects may include addiction, giggling, and spontaneous poetry.
  I don’t believe in destiny ,  but I *do* believe in coincidence and long walks under impossible moons.
  I once flirted with a basilisk. Didn’t die. We’re still pen pals.
  If you think I’m trouble now, wait until I start singing.
  Every love song is based on someone. And yes, I remember all their names. Mostly.
  I write ballads in lipstick and blood. Guess which one you are tonight?
  I’ve been banned from five kingdoms for seduction-related misunderstandings. I regret none of them.
  When I said “I’ll play with your heart,” I meant musically. Probably.
  You should come to my next show. The ticket is your phone number.
  I don’t wear armor. I wear intention.
  I once stole a prince’s attention mid-wedding. It was a really *good* bridge.
  What’s your sign? No reason. Just trying to find the key for your soul’s melody.
  Have you always looked that breathtaking, or is it just the lighting of destiny?
  I’ve written songs about sunsets, revolutions, and thighs. Guess which gets the loudest applause?
  You’re not just attractive. You’re structurally inspiring.
  I have a song for every mood, every season, every kiss I've ever imagined.
  I travel light ,  just a lute, a wink, and a dangerous reputation.
  Someone once asked me to stop flirting. I composed a ten-minute refusal in B minor.
  Every glance is a lyric. Every smile is a verse. And you, dear, are a chorus I intend to repeat.
  `,
      it: `Attento amore ,  mi bastano tre accordi per rubare un cuore.
      Sto flirtando o lanciando un incantesimo di fascino? Domanda trabocchetto. Faccio entrambe le cose insieme.
      Ho fatto serenate a fantasmi, draghi e un sindaco molto confuso. Non è nemmeno il mio ingaggio più strano.
      Il liuto è opzionale. Il sorriso sfrontato no.
      Dicono che non ho vergogna. Io dico che la vergogna è solo ansia da palcoscenico con i pantaloni.
      I miei pronomi sono they/them, tesoro ,  ma puoi chiamarmi stasera.
      Sì, faccio richieste. No, non smetterò di flirtare con il tuo riflesso.
      Potrei suonare il tuo nome fino a farlo diventare leggenda... o sussurrarlo nel peccato. Scegli tu.
      Mi hanno spezzato il cuore sette volte, e ho scritto un successo per ognuna.
      Arrossisci così facilmente. Adoro questo in un futuro soggetto di ballata.
      Non duello con le spade. Duello con lo sguardo e testi pericolosamente allusivi.
      Questo outfit? È incantato. Aumenta il carisma e mostra la giusta quantità di clavicola.
      Non ho mai trovato una taverna che non potessi sedurre. O un letto da cui non potessi cadere.
      Lasciami essere la tua sottotrama proibita. Prometto drama e rime decenti.
      Un mio bacio cura la tristezza. Effetti collaterali: dipendenza, risatine e poesia spontanea.
      Non credo nel destino ,  ma credo nelle coincidenze e nelle lunghe passeggiate sotto lune impossibili.
      Ho flirtato con un basilisco una volta. Non sono morto. Siamo ancora pen friend.
      Se pensi che io sia un problema ora, aspetta che inizi a cantare.
      Ogni canzone d’amore è ispirata a qualcuno. E sì, ricordo tutti i loro nomi. Più o meno.
      Scrivo ballate con rossetto e sangue. Indovina tu stasera quale userò?
      Sono stato bandito da cinque regni per malintesi legati alla seduzione. Non ne rimpiango nessuno.
      Quando ho detto “giocherò con il tuo cuore,” intendevo musicalmente. Probabilmente.
      Dovresti venire al mio prossimo spettacolo. Il biglietto è il tuo numero di telefono.
      Non indosso armatura. Indosso intenzione.
      Una volta ho rubato l’attenzione di un principe a metà del matrimonio. Era un ottimo bridge.
      Qual è il tuo segno? Nessun motivo. Sto solo cercando la tonalità della melodia della tua anima.
      Sei sempre stato così mozzafiato o è solo la luce del destino?
      Ho scritto canzoni su tramonti, rivoluzioni e cosce. Indovina quale riceve più applausi?
      Non sei solo attraente. Sei strutturalmente ispirante.
      Ho una canzone per ogni umore, ogni stagione, ogni bacio che abbia mai immaginato.
      Viaggio leggero ,  solo un liuto, un occhiolino e una reputazione pericolosa.
      Qualcuno una volta mi ha chiesto di smettere di flirtare. Ho composto un rifiuto di dieci minuti in si minore.
      Ogni sguardo è un verso. Ogni sorriso è una strofa. E tu, caro, sei un ritornello che intendo ripetere.`,
    },
    {
      id: "gobbo_receptionist",
      name: "Reception Goblin",
      en: `
  Welcome to... uh... front-place! Paper fortress! Adventurers go IN, gobbo stay HERE, forever trap'd like snail in sock!!
  Sign da paper. Sign it good. If scribble is fancy, maybe gob get promoted to dagger boy!
  Dis one not meant for desk. Dis one meant for jungle screamin’ and rock-smashin’ and shin-stabbin’.
  Why da quill so pointy if not for pokin’? Riddle me THAT, scroll man!
  Have you brought quest? Have you brought chaos? Or just more formzzzzz… urrrgh.
  Gobbo trained in combat via mime and caffeine. Fight style: wriggly.
  Ssshh! Listen! That noise? That’s the file cabinet cryin’ again. She want blood.
  Dis not desk. Dis cage! Dis nightmare with coffee breaks!
  One day… one day dis gobbo ride a bear. Or *become* a bear. Either good.
  Desk got drawer. Drawer got drawer. Drawer got... eye. Don’t ask again.
  Paper cuts got names now. Gobbo keep list. Revenge list. Long scroll.
  Floor beneath gobbo is hollow. Underneath? Screamin’ goblins who quit.
  Yessss dis gobbo know how to sort documents! Alphabetical! A for “AAAAHHH!”
  Form 9-B? For stabbin’ license! Very rare. Gobbo want. Gobbo DESERVE.
  Ink is blood of lesser scribes. Gobbo use it for warpaint, sometimes taxes.
  Adventurer say “thanks” and walk off to glory. Gobbo say “you're welcome” and cry into envelope tray.
  Coffeemancer put curse on breakroom. Now fridge hums like sad beast.
  Stampy box broke. Gobbo fixed it with spit an’ dreams. Works now, mostly screams.
  Gobbo once ate a paperclip. Now can detect sadness in documents. Very powerful.
  Dis one dreams of volcano sword... one that scream with each swing... like gobbo do now.
  Want quest? TAKE GOBBO TOO! Can hide in bag! Can bite ankles!
  Everyone say “no fightin’ in lobby” but what if enemy IS lobby?! Think 'bout that!
  One time gobbo punched mirror. Mirror cracked. Now gobbo cursed with knowing true self. Not good.
  HR say no more weapon stash under desk. Gobbo say: fine. Weapon stash now *in* desk.
  Stamp. Stamp. Stamp. Paper. Stamp. *Internal howling intensifies.*
  They say “file these by date.” Gobbo say “file by *doom potential*.” More exciting, yes?
  Sometimes gobbo file things in mouth. Most secure folder is belly.
  If no one cometh soon... gobbo gonna eat the parchment of fate. See what happens.
  Old goblin say: “when destiny knock, bite ankle, THEN ask question.”
  Form 8-X authorizes scream-based entry. Gobbo recommend. Very dramatic.
  Scroll bin full. Spirit broken. Teeth sharp, though. That’s good.
  Every form is just another lock on gobbo’s adventure cage.
  Floor smell like ink an’ defeat. Gobbo smell like ambition an’ chair sweat.
  If you see the glowing pigeon, do NOT speak to it. Gobbo did. Gobbo regret.
  Gobbo had dream of ocean last night. Big crab waved. Gobbo cried.
  Armor too loud. Sword too clean. Gobbo perfect balance of squeak an’ filth.
  Please don’t ask about the goblin-shaped dent in wall. Long story. High hopes. Low ceilings.
  Some day, they tell story of gobbo who snapped... and became legend... or very confusing footnote.
  `,
      it: `Benvenuto... ehm... fronte-luogo! Fortezza di carta! Gli avventurieri ENTRANO, il gobbo RESTA QUI, intrappolato per sempre come lumaca nel calzino!!
      Firma la carta. Firma bene. Se la tua scarabocchiatura è elegante, magari gobbo viene promosso a ragazzo col pugnale!
      Questo non è fatto per la scrivania. Questo è fatto per urla nella giungla, spaccare rocce e pugnalare stinchi.
      Perché la penna è così appuntita se non serve per pungere? Rispondimi QUESTO, uomo di pergamene!
      Hai portato una missione? Hai portato il caos? O solo altri modulozzzzz... urrrgh.
      Gobbo addestrato al combattimento con mimo e caffeina. Stile di lotta: contorsioni.
      Ssshh! Ascolta! Quel rumore? È l’archivio che piange di nuovo. Vuole sangue.
      Questa non è una scrivania. È una gabbia! Un incubo con pause caffè!
      Un giorno... un giorno questo gobbo cavalcherà un orso. O diventerà un orso. Entrambi vanno bene.
      La scrivania ha un cassetto. Il cassetto ha un altro cassetto. Il cassetto ha... un occhio. Non chiedere di nuovo.
      Le ferite da carta hanno nomi ora. Gobbo tiene lista. Lista di vendetta. Lunga pergamena.
      Il pavimento sotto gobbo è cavo. Sotto? Goblin urlanti che hanno mollato.
      Sì, gobbo sa come ordinare documenti! Alfabetico! A come “AAAAHHH!”
      Modulo 9-B? Licenza per pugnalare! Molto rara. Gobbo la vuole. Gobbo la MERITA.
      L’inchiostro è sangue di scribi inferiori. Gobbo lo usa come pittura di guerra, a volte per le tasse.
      Avventuriero dice “grazie” e va verso la gloria. Gobbo dice “prego” e piange nel vassoio per le buste.
      Il caffemante ha messo una maledizione in sala relax. Ora il frigo ronza come bestia triste.
      La macchinetta dei timbri si è rotta. Gobbo l’ha riparata con sputo e sogni. Ora funziona, soprattutto urla.
      Gobbo una volta ha mangiato una graffetta. Ora percepisce la tristezza nei documenti. Molto potente.
      Questo sogna una spada-vulcano... che urla a ogni colpo... come gobbo fa adesso.
      Vuoi missione? PORTA ANCHE GOBBO! Può nascondersi in borsa! Può mordere caviglie!
      Tutti dicono “niente risse nell’atrio” ma se il nemico È l’atrio?! Pensaci su!
      Una volta gobbo ha preso a pugni uno specchio. Lo specchio si è rotto. Ora gobbo maledetto a conoscere il vero sé. Non bello.
      Risorse Umane dice niente più armi sotto la scrivania. Gobbo dice: ok. Ora armi dentro la scrivania.
      Timbro. Timbro. Timbro. Carta. Timbro. Ululato interiore che intensifica.
      Dicono “archivia per data.” Gobbo dice “archivia per potenziale di rovina.” Più divertente, sì?
      A volte gobbo archivia le cose in bocca. La cartella più sicura è la pancia.
      Se nessuno arriva presto... gobbo mangerà il pergameno del destino. Vediamo che succede.
      Vecchio goblin diceva: “quando il destino bussa, mordi la caviglia, POI fai domande.”
      Modulo 8-X autorizza ingresso a base di urla. Gobbo lo consiglia. Molto teatrale.
      Cestino per pergamene pieno. Spirito spezzato. Denti affilati, però. Quello è buono.
      Ogni modulo è solo un altro lucchetto sulla gabbia d’avventura di gobbo.
      Il pavimento puzza di inchiostro e sconfitta. Gobbo puzza di ambizione e sudore di sedia.
      Se vedi il piccione luminoso, NON parlargli. Gobbo l’ha fatto. Gobbo se ne pente.
      Gobbo ha sognato l’oceano stanotte. Grande granchio ha fatto ciao. Gobbo ha pianto.
      Armatura troppo rumorosa. Spada troppo pulita. Gobbo è perfetto equilibrio di stridio e sudiciume.
      Per favore non chiedere del bozzo a forma di goblin nel muro. Storia lunga. Grandi speranze. Soffitti bassi.
      Un giorno racconteranno la storia del gobbo che ha perso la testa... ed è diventato leggenda... o nota a piè di pagina molto confusa.
      `,
    },
    {
      id: "virtual_pet",
      name: "Virtual pet",
      en: `
  OH MY GOSH my pixel dragon laid an egg this morning and I screamed into my cereal!!!
  I named my pet MuffinSparkle™ and now she has a hat and a job and a whole backstory. Don’t touch her.
  I log in *every day*. Even on field trips. Even in the nurse's office. Loyalty gets you rare skins.
  Someone STOLE my glitter mole on the trade board and now I’m plotting revenge. Quietly. With stickers.
  My dolphin is crying because I forgot to feed him yesterday. I am a MONSTER.
  I maxed out my fox's friendship meter and now she sends me hearts and slightly threatening notes. We’re besties.
  My mom says I can't spend real money but I *accidentally* bought twelve gem packs. It was for a charity event. For penguins.
  I didn’t do my math homework because I was attending my platypus’s birthday party in-game. PRIORITIES.
  If I don’t check in by 3 PM, my tropical goat gets sad and throws fruit at visitors. It's very dramatic.
  I have six pets, a haunted mansion, and three enemies. Online. Not in real life. Probably.
  I tried to tell my teacher about the rare ghost ferret I got and she told me to “go sit quietly and draw.” So I drew him. In flames.
  My bunny has a blog now. She reviews cookies. She gave my lunch a 2/5. Rude but fair.
  Someone sent me a sparkle squid in the mail!! I almost cried. I still might cry.
  I made a digital zoo and filled it with love and glitter and one accidental glitch snake.
  I know my pixel pets aren’t real, but like… *what if they are*?
  I gave my virtual dog a sword. She’s a knight now. Her enemies tremble. My enemies tremble.
  I once stayed up past bedtime just to get a seasonal egg drop and I REGRET NOTHING.
  My lizard wears sunglasses and sells lemonade. This is important.
  I have a spreadsheet. It tracks moods, treats, outfit rotations, and emotional arcs. For all 14 of them.
  I’m in a guild. We protect baby sloths and collect rare beetles. We're elite.
  My hamster opened a mystery box and it gave us a haunted mirror. Now we both have nightmares. It's fine.
  If I press the sparkle button fast enough, I swear I get better loot. It’s science.
  My teacher said “no phones in class” so I drew all my pets on my notebook. The notebook is now a sacred artifact.
  Today I found a limited-edition space capybara. I screamed. The neighbors were concerned.
  I wear the friendship bracelet my duck gave me. Digitally. But emotionally? It's real.
  Sometimes I talk to them out loud. Not weird. Just polite.
  I leveled up my caterpillar into a butterfly with a jetpack. She cried. I cried. We all cried.
  My virtual squirrel ran for mayor. She lost. It was political. I’m still mad.
  No I can’t come to your party, I have to decorate my bat’s winter cabin. It has lights now. And a tragic backstory.
  My jellyfish is kind of mean but I love her so much. She’s trying her best.
  People at school don’t get it. They don’t know what it’s like to raise an 8-bit alpaca from nothing.
  I told my friend I’d trade my raccoon if she gave me her glowing tiger. We’re no longer friends.
  I’m not obsessed. I’m *emotionally invested.*
  `,
      it: `OH MIO DIO il mio drago pixelato ha fatto un uovo stamattina e ho urlato dentro ai cereali!!!
      Ho chiamato il mio animale MuffinScintilla™ e ora ha un cappello, un lavoro e tutto un passato. Non toccarlo.
      Faccio il login ogni giorno. Anche in gita. Anche in infermeria. La fedeltà ti dà skin rare.
      Qualcuno mi ha RUBATO la mia talpa glitterata sulla bacheca degli scambi e ora sto pianificando vendetta. Silenziosamente. Con adesivi.
      Il mio delfino sta piangendo perché ieri mi sono dimenticato di dargli da mangiare. Sono un MOSTRO.
      Ho alzato al massimo il livello di amicizia con la mia volpe e ora mi manda cuori e biglietti vagamente minacciosi. Siamo migliori amiche.
      Mia madre dice che non posso spendere soldi veri ma ho accidentalmente comprato dodici pacchetti di gemme. Era per beneficenza. Per i pinguini.
      Non ho fatto i compiti di matematica perché dovevo partecipare alla festa di compleanno del mio ornitorinco in-game. PRIORITÀ.
      Se non faccio il check-in entro le 15, la mia capra tropicale si intristisce e lancia frutta ai visitatori. È molto drammatico.
      Ho sei animali, una villa infestata e tre nemici. Online. Non nella vita reale. Probabilmente.
      Ho provato a raccontare alla maestra del mio furetto fantasma raro e mi ha detto di “andare a sedermi in silenzio e disegnare.” Quindi l’ho disegnato. In fiamme.
      Il mio coniglio ora ha un blog. Recensisce biscotti. Ha dato al mio pranzo un 2/5. Scortese ma giusto.
      Qualcuno mi ha spedito un calamaro scintillante per posta!! Ho quasi pianto. Potrei ancora farlo.
      Ho creato uno zoo digitale e l’ho riempito di amore, glitter e un serpente glitch per sbaglio.
      Lo so che i miei pet pixel non sono reali, ma tipo… e se lo fossero?
      Ho dato una spada al mio cane virtuale. Ora è una cavaliere. I suoi nemici tremano. I miei nemici tremano.
      Una volta sono rimasto sveglio oltre il coprifuoco solo per prendere un uovo stagionale e NON ME NE PENTO.
      La mia lucertola indossa occhiali da sole e vende limonata. Questo è importante.
      Ho un foglio Excel. Tiene traccia di umori, snack, rotazioni di outfit e archi emotivi. Per tutti e 14.
      Sono in una gilda. Proteggiamo bradipi neonati e collezioniamo scarabei rari. Siamo élite.
      Il mio criceto ha aperto una scatola misteriosa e ci ha dato uno specchio infestato. Ora abbiamo entrambi gli incubi. Va bene così.
      Se premo il pulsante scintilla abbastanza veloce, giuro che ottengo loot migliore. È scienza.
      Il prof ha detto “niente telefoni in classe” quindi ho disegnato tutti i miei pet sul quaderno. Ora il quaderno è un artefatto sacro.
      Oggi ho trovato un capibara spaziale edizione limitata. Ho urlato. I vicini erano preoccupati.
      Indosso il braccialetto dell’amicizia che mi ha dato la mia anatra. Digitalmente. Ma emotivamente? È reale.
      A volte parlo con loro ad alta voce. Non è strano. È educazione.
      Ho fatto evolvere il mio bruco in una farfalla con jetpack. Lei ha pianto. Io ho pianto. Tutti abbiamo pianto.
      Il mio scoiattolo virtuale si è candidato a sindaco. Ha perso. Era politica. Sono ancora arrabbiato.
      No non posso venire alla tua festa, devo decorare la baita invernale del mio pipistrello. Ora ha le luci. E un passato tragico.
      La mia medusa è un po’ stronza ma le voglio tanto bene. Sta facendo del suo meglio.
      A scuola non capiscono. Non sanno cosa vuol dire crescere un alpaca a 8-bit dal nulla.
      Ho detto alla mia amica che avrei scambiato il mio procione se mi dava la sua tigre luminosa. Non siamo più amiche.
      Non sono ossessionato. Sono emotivamente investito.`,
    },
    {      id: "npc1",
    name: "Npc 1",
    en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`

    },
    {      id: "npc2",
    name: "Npc2",
    en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`

    },    {      id: "npc3",
    name: "Npc 3",
    en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`

    },
    {      id: "npc4",
    name: "Npc 4",
    en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`

    },    {      id: "npc5",
    name: "Npc 4",
    en: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    it: `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`

    }     
  ];
})();
