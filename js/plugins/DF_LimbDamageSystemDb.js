/*:
 * @target MZ
 * @plugindesc Defines shared prosthetic data structures for other plugins to consume.
 * @help This just exposes BodyParts / ProstheticTypes / ProstheticCompatibility globally.
 */

(() => {
    // define your data
    const EnemyArchetypes = {
        // Humanoid archetype (basic humanoid enemies like goblins, orcs, bandits)
        Humanoid: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 20,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT/Magic
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 40,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 10 },
            TORSO: { weight: 40 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 10 },
            RIGHT_LEG: { weight: 10 },
          },
        },
    
        // Beast archetype (wolves, bears, large mammals)
        Beast: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 20,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT/Magic
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body has been crushed into pulp!",
              msg_it: "Il corpo è stato schiacciato in poltiglia!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            }, // MHP
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear Left Leg has been cut off!!",
              msg_it: "La zampa posteriore sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear Right Leg has been cut off!!",
              msg_it: "La zampa posteriore destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been hacked off!",
              msg_it: "La coda è stata mozzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -5 },
            }, // DEF
          },
          hitLocations: {
            HEAD: { weight: 10 },
            BODY: { weight: 35 },
            FRONT_LEFT_LEG: { weight: 10 },
            FRONT_RIGHT_LEG: { weight: 10 },
            REAR_LEFT_LEG: { weight: 10 },
            REAR_RIGHT_LEG: { weight: 10 },
            TAIL: { weight: 15 },
          },
        },
        // Insectoid archetype (giant bugs, spiders, etc.)
        Insectoid: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            }, // INT/Magic
            THORAX: {
              name: "Thorax",
              name_it: "Torace",
              msg: "Thorax has been punctured!",
              msg_it: "Il torace è stato perforato!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            }, // MHP
            ABDOMEN: {
              name: "Abdomen",
              name_it: "Addome",
              msg: "Abdomen has burst open!",
              msg_it: "L'addome è esploso!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 },
            }, // MHP
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            MIDDLE_LEFT_LEG: {
              name: "Middle Left Leg",
              name_it: "Zampa Centrale Sinistra",
              msg: "Middle Left Leg has been cut off!!",
              msg_it: "La zampa centrale sinistra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            MIDDLE_RIGHT_LEG: {
              name: "Middle Right Leg",
              name_it: "Zampa Centrale Destra",
              msg: "Middle Right Leg has been cut off!!",
              msg_it: "La zampa centrale destra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear Left Leg has been cut off!!",
              msg_it: "La zampa posteriore sinistra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear Right Leg has been cut off!!",
              msg_it: "La zampa posteriore destra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            MANDIBLES: {
              name: "Mandibles",
              name_it: "Mandibole",
              msg: "Mandibles have been pulverized!",
              msg_it: "Le mandibole sono state polverizzate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
          },
          hitLocations: {
            HEAD: { weight: 10 },
            THORAX: { weight: 20 },
            ABDOMEN: { weight: 20 },
            FRONT_LEFT_LEG: { weight: 5 },
            FRONT_RIGHT_LEG: { weight: 5 },
            MIDDLE_LEFT_LEG: { weight: 5 },
            MIDDLE_RIGHT_LEG: { weight: 5 },
            REAR_LEFT_LEG: { weight: 5 },
            REAR_RIGHT_LEG: { weight: 5 },
            MANDIBLES: { weight: 20 },
          },
        },
        Frog: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head cracked, instincts falter!",
              msg_it: "La testa è crepata, gli istinti vacillano!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 }, // INT/Magic
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body has been crushed into pulp!",
              msg_it: "Il corpo è stato schiacciato in poltiglia!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 }, // MHP
            },
            TONGUE: {
              name: "Tongue",
              name_it: "Lingua",
              msg: "Tongue severed, grapple disabled!",
              msg_it: "La lingua è stata recisa, presa disabilitata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 }, // ATK (lash/grab)
              specialEffect: "disableTongueGrab",
            },
            VOCAL_SAC: {
              name: "Vocal Sac",
              name_it: "Sacca Vocale",
              msg: "Vocal sac ruptured, croak silenced!",
              msg_it: "La sacca vocale è stata lacerata, canto silenziato!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 }, // INT/Magic (charm/sonic)
              specialEffect: "disableCroak",
            },
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
            },
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
            },
            HIND_LEFT_LEG: {
              name: "Hind Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Hind Left Leg has been cut off!!",
              msg_it: "La zampa posteriore sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 }, // AGI (jump power)
            },
            HIND_RIGHT_LEG: {
              name: "Hind Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Hind Right Leg has been cut off!!",
              msg_it: "La zampa posteriore destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 }, // AGI (jump power)
            },
          },
          hitLocations: {
            HEAD: { weight: 10 },
            BODY: { weight: 30 },
            TONGUE: { weight: 15 },
            VOCAL_SAC: { weight: 10 },
            FRONT_LEFT_LEG: { weight: 8 },
            FRONT_RIGHT_LEG: { weight: 8 },
            HIND_LEFT_LEG: { weight: 10 },
            HIND_RIGHT_LEG: { weight: 9 },
          },
        },
        // Dragon archetype
        Dragon: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT/Magic
            FIRE_BREATH_ORGAN: {
              name: "Fire Breath Organ",
              name_it: "Organo del Soffio di Fuoco",
              msg: "Fire Breath Organ has burst into gore!",
              msg_it: "L'organo del soffio di fuoco è esploso in sangue!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 3, amount: -40 },
              specialEffect: "disableFireBreath",
            }, // Disables fire breath skills
            NECK: {
              name: "Neck",
              name_it: "Collo",
              msg: "Neck has been twisted till it snapped!",
              msg_it: "Il collo è stato attorcigliato fino a spezzarsi!",
              hpPercent: 10,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -10 },
            }, // DEF
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body has been crushed into pulp!",
              msg_it: "Il corpo è stato schiacciato in poltiglia!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            }, // MHP
            LEFT_WING: {
              name: "Left Wing",
              name_it: "Ala Sinistra",
              msg: "Left Wing has been torn to ribbons!",
              msg_it: "L'ala sinistra è stata ridotta a brandelli!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_WING: {
              name: "Right Wing",
              name_it: "Ala Destra",
              msg: "Right Wing has been torn to ribbons!",
              msg_it: "L'ala destra è stata ridotta a brandelli!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been hacked off!",
              msg_it: "La coda è stata mozzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
          },
          hitLocations: {
            HEAD: { weight: 10 },
            FIRE_BREATH_ORGAN: { weight: 5 },
            NECK: { weight: 10 },
            BODY: { weight: 30 },
            LEFT_WING: { weight: 10 },
            RIGHT_WING: { weight: 10 },
            FRONT_LEFT_LEG: { weight: 5 },
            FRONT_RIGHT_LEG: { weight: 5 },
            TAIL: { weight: 15 },
          },
        },
        Skeleton: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Skull shattered into splinters!",
              msg_it: "Il cranio è andato in frantumi!",
              hpPercent: 25,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 }, // INT/Magic
            },
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Ribcage collapsed into dust!",
              msg_it: "La gabbia toracica è crollata in polvere!",
              hpPercent: 35,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 }, // MHP
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm bone snapped off!",
              msg_it: "L'osso del braccio sinistro si è spezzato!",
              hpPercent: 12,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 }, // ATK
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm bone snapped off!",
              msg_it: "L'osso del braccio destro si è spezzato!",
              hpPercent: 12,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 }, // ATK
            },
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left leg shattered!",
              msg_it: "La gamba sinistra è andata in frantumi!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 }, // AGI
            },
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right leg shattered!",
              msg_it: "La gamba destra è andata in frantumi!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 }, // AGI
            },
          },
          hitLocations: {
            HEAD: { weight: 15 },
            TORSO: { weight: 35 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 10 },
            RIGHT_LEG: { weight: 10 },
          },
        },
        Fairy : {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head cracked, the glamour flickers!",
              msg_it: "La testa è crepata, lo charme vacilla!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 }, // INT/Magic
            },
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso crushed into glittering dust!",
              msg_it: "Il torso è stato schiacciato in polvere scintillante!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 }, // MHP
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm torn off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -12 }, // ATK
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm torn off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 }, // ATK
            },
            LEFT_WING: {
              name: "Left Wing",
              name_it: "Ala Sinistra",
              msg: "Left Wing shredded, flight falters!",
              msg_it: "L'ala sinistra è stata lacerata, il volo vacilla!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 }, // AGI
              specialEffect: "grounded", // loses flight
            },
            RIGHT_WING: {
              name: "Right Wing",
              name_it: "Ala Destra",
              msg: "Right Wing shredded, grounded!",
              msg_it: "L'ala destra è stata lacerata, atterrata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 }, // AGI
              specialEffect: "grounded",
            },
            PIXIE_DUST_SAC: {
              name: "Pixie Dust Sac",
              name_it: "Sacca di Polvere Fatata",
              msg: "Dust sac ruptured, enchantments fizzle!",
              msg_it: "La sacca di polvere è stata lacerata, gli incanti svaniscono!",
              hpPercent: 9,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 }, // INT/Magic (status/charm potency)
              specialEffect: "disablePixieDust",
            },
          },
          hitLocations: {
            HEAD: { weight: 12 },
            TORSO: { weight: 18 },
            LEFT_ARM: { weight: 8 },
            RIGHT_ARM: { weight: 8 },
            LEFT_WING: { weight: 22 },
            RIGHT_WING: { weight: 22 },
            PIXIE_DUST_SAC: { weight: 10 },
          },
        },
        
        // Slime archetype
        Slime: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core has violently collapsed!",
              msg_it: "Il nucleo è collassato violentemente!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            }, // MHP
            UPPER_BODY: {
              name: "Upper Body",
              name_it: "Parte Superiore",
              msg: "Upper Body has been crushed into pulp!",
              msg_it: "La parte superiore è stata schiacciata in poltiglia!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 2, amount: -20 },
              regenerates: true,
            }, // ATK
            LOWER_BODY: {
              name: "Lower Body",
              name_it: "Parte Inferiore",
              msg: "Lower Body has been crushed into pulp!",
              msg_it: "La parte inferiore è stata schiacciata in poltiglia!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -30 },
              regenerates: true,
            }, // AGI
            PSEUDOPOD_1: {
              name: "Pseudopod 1",
              name_it: "Pseudopodo 1",
              msg: "Pseudopod 1 has been melted into sludge!",
              msg_it: "Il pseudopodo 1 si è sciolto in fanghiglia!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
              regenerates: true,
            }, // ATK
            PSEUDOPOD_2: {
              name: "Pseudopod 2",
              name_it: "Pseudopodo 2",
              msg: "Pseudopod 2 has been melted into sludge!",
              msg_it: "Il pseudopodo 2 si è sciolto in fanghiglia!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
              regenerates: true,
            }, // ATK
          },
          hitLocations: {
            CORE: { weight: 5 },
            UPPER_BODY: { weight: 30 },
            LOWER_BODY: { weight: 30 },
            PSEUDOPOD_1: { weight: 20 },
            PSEUDOPOD_2: { weight: 15 },
          },
        },
        // Undead archetype (skeletons, zombies)
        Undead: {
          parts: {
            SKULL: {
              name: "Skull",
              name_it: "Teschio",
              msg: "Skull has been obliterated!",
              msg_it: "Il teschio è stato obliterato!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            }, // INT/Magic
            RIBCAGE: {
              name: "Ribcage",
              name_it: "Gabbia Toracica",
              msg: "Ribcage has caved into gore!",
              msg_it: "La gabbia toracica è crollata in sangue!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            SKULL: { weight: 15 },
            RIBCAGE: { weight: 25 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 15 },
            RIGHT_LEG: { weight: 15 },
          },
        },
        Scorpion: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 10,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 }, // INT/Magic
            },
            CEPHALOTHORAX: {
              name: "Cephalothorax",
              name_it: "Cefalotorace",
              msg: "Cephalothorax has been crushed!",
              msg_it: "Il cefalotorace è stato schiacciato!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -15 }, // DEF
            },
            ABDOMEN: {
              name: "Abdomen",
              name_it: "Addome",
              msg: "Abdomen has burst open!",
              msg_it: "L'addome è esploso!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 }, // MHP
            },
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been severed!",
              msg_it: "La coda è stata mozzata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
            },
            STINGER: {
              name: "Stinger",
              name_it: "Pungiglione",
              msg: "Stinger snapped off!",
              msg_it: "Il pungiglione si è spezzato!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 }, // INT/Magic (venom potency / skills)
              specialEffect: "disableStingerVenom",
            },
            PINCER_LEFT: {
              name: "Left Pincer",
              name_it: "Chela Sinistra",
              msg: "Left Pincer has been crushed!",
              msg_it: "La chela sinistra è stata frantumata!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -12 }, // ATK
            },
            PINCER_RIGHT: {
              name: "Right Pincer",
              name_it: "Chela Destra",
              msg: "Right Pincer has been crushed!",
              msg_it: "La chela destra è stata frantumata!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 }, // ATK
            },
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_FRONT_LEFT_LEG: {
              name: "Mid-Front Left Leg",
              name_it: "Zampa Centrale Anteriore Sinistra",
              msg: "Mid-Front Left Leg has been cut off!!",
              msg_it: "La zampa centrale anteriore sinistra è stata tagliata via!!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_FRONT_RIGHT_LEG: {
              name: "Mid-Front Right Leg",
              name_it: "Zampa Centrale Anteriore Destra",
              msg: "Mid-Front Right Leg has been cut off!!",
              msg_it: "La zampa centrale anteriore destra è stata tagliata via!!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_REAR_LEFT_LEG: {
              name: "Mid-Rear Left Leg",
              name_it: "Zampa Centrale Posteriore Sinistra",
              msg: "Mid-Rear Left Leg has been cut off!!",
              msg_it: "La zampa centrale posteriore sinistra è stata tagliata via!!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_REAR_RIGHT_LEG: {
              name: "Mid-Rear Right Leg",
              name_it: "Zampa Centrale Posteriore Destra",
              msg: "Mid-Rear Right Leg has been cut off!!",
              msg_it: "La zampa centrale posteriore destra è stata tagliata via!!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear Left Leg has been cut off!!",
              msg_it: "La zampa posteriore sinistra è stata tagliata via!!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear Right Leg has been cut off!!",
              msg_it: "La zampa posteriore destra è stata tagliata via!!",
              hpPercent: 2,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
          },
          hitLocations: {
            HEAD: { weight: 8 },
            CEPHALOTHORAX: { weight: 14 },
            ABDOMEN: { weight: 14 },
            TAIL: { weight: 12 },
            STINGER: { weight: 10 },
            PINCER_LEFT: { weight: 5 },
            PINCER_RIGHT: { weight: 5 },
            FRONT_LEFT_LEG: { weight: 4 },
            FRONT_RIGHT_LEG: { weight: 4 },
            MID_FRONT_LEFT_LEG: { weight: 4 },
            MID_FRONT_RIGHT_LEG: { weight: 4 },
            MID_REAR_LEFT_LEG: { weight: 4 },
            MID_REAR_RIGHT_LEG: { weight: 4 },
            REAR_LEFT_LEG: { weight: 4 },
            REAR_RIGHT_LEG: { weight: 4 },
          }
        },
        Spider:{
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 12,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 }, // INT/Magic
            },
            CEPHALOTHORAX: {
              name: "Cephalothorax",
              name_it: "Cefalotorace",
              msg: "Cephalothorax has cracked open!",
              msg_it: "Il cefalotorace si è spaccato!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -15 }, // DEF
            },
            ABDOMEN: {
              name: "Abdomen",
              name_it: "Addome",
              msg: "Abdomen has ruptured!",
              msg_it: "L'addome è esploso!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 }, // MHP
            },
            FANGS: {
              name: "Fangs",
              name_it: "Zanne Velenifere",
              msg: "Fangs have been shattered!",
              msg_it: "Le zanne velenifere sono andate in frantumi!",
              hpPercent: 9,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 }, // ATK
              specialEffect: "disableVenomBite",
            },
            SPINNERETS: {
              name: "Spinnerets",
              name_it: "Filieri",
              msg: "Spinnerets have been severed!",
              msg_it: "Le filiere sono state recise!",
              hpPercent: 9,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
              specialEffect: "disableWebbing",
            },
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front Left Leg has been cut off!!",
              msg_it: "La zampa anteriore sinistra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front Right Leg has been cut off!!",
              msg_it: "La zampa anteriore destra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_FRONT_LEFT_LEG: {
              name: "Mid-Front Left Leg",
              name_it: "Zampa Centrale Anteriore Sinistra",
              msg: "Mid-Front Left Leg has been cut off!!",
              msg_it: "La zampa centrale anteriore sinistra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_FRONT_RIGHT_LEG: {
              name: "Mid-Front Right Leg",
              name_it: "Zampa Centrale Anteriore Destra",
              msg: "Mid-Front Right Leg has been cut off!!",
              msg_it: "La zampa centrale anteriore destra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_REAR_LEFT_LEG: {
              name: "Mid-Rear Left Leg",
              name_it: "Zampa Centrale Posteriore Sinistra",
              msg: "Mid-Rear Left Leg has been cut off!!",
              msg_it: "La zampa centrale posteriore sinistra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            MID_REAR_RIGHT_LEG: {
              name: "Mid-Rear Right Leg",
              name_it: "Zampa Centrale Posteriore Destra",
              msg: "Mid-Rear Right Leg has been cut off!!",
              msg_it: "La zampa centrale posteriore destra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear Left Leg has been cut off!!",
              msg_it: "La zampa posteriore sinistra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear Right Leg has been cut off!!",
              msg_it: "La zampa posteriore destra è stata tagliata via!!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -5 }, // AGI
            },
          },
          hitLocations: {
            HEAD: { weight: 10 },
            CEPHALOTHORAX: { weight: 20 },
            ABDOMEN: { weight: 20 },
            FANGS: { weight: 9 },
            SPINNERETS: { weight: 9 },
            FRONT_LEFT_LEG: { weight: 4 },
            FRONT_RIGHT_LEG: { weight: 4 },
            MID_FRONT_LEFT_LEG: { weight: 4 },
            MID_FRONT_RIGHT_LEG: { weight: 4 },
            MID_REAR_LEFT_LEG: { weight: 4 },
            MID_REAR_RIGHT_LEG: { weight: 4 },
            REAR_LEFT_LEG: { weight: 4 },
            REAR_RIGHT_LEG: { weight: 4 },
          },
        },
        
        // Plant archetype (plant-based enemies)
        Plant: {
          parts: {
            FLOWER: {
              name: "Flower",
              name_it: "Fiore",
              msg: "Flower has withered to rot!",
              msg_it: "Il fiore è appassito fino a marcire!",
              hpPercent: 20,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -40 },
            }, // INT/Magic
            STEM: {
              name: "Stem",
              name_it: "Stelo",
              msg: "Stem has twisted till it split!",
              msg_it: "Lo stelo si è attorcigliato fino a spezzarsi!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            ROOTS: {
              name: "Roots",
              name_it: "Radici",
              msg: "Roots have been ripped out!",
              msg_it: "Le radici sono state strappate via!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -20 },
            }, // DEF
            VINE_1: {
              name: "Vine 1",
              name_it: "Rampicante 1",
              msg: "Vine 1 has been ripped into gore!",
              msg_it: "Il rampicante 1 è stato ridotto in poltiglia!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            VINE_2: {
              name: "Vine 2",
              name_it: "Rampicante 2",
              msg: "Vine 2 has been ripped into gore!",
              msg_it: "Il rampicante 2 è stato ridotto in poltiglia!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
          },
          hitLocations: {
            FLOWER: { weight: 15 },
            STEM: { weight: 30 },
            ROOTS: { weight: 15 },
            VINE_1: { weight: 20 },
            VINE_2: { weight: 20 },
          },
        },
        // Elemental archetype (fire, water, etc. elementals)
        Elemental: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core has violently collapsed!",
              msg_it: "Il nucleo è collassato violentemente!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            }, // MHP
            UPPER_FORM: {
              name: "Upper Form",
              name_it: "Forma Superiore",
              msg: "Upper Form has unraveled!",
              msg_it: "La forma superiore si è disgregata!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 3, amount: -30 },
              regenerates: true,
            }, // INT/Magic
            LOWER_FORM: {
              name: "Lower Form",
              name_it: "Forma Inferiore",
              msg: "Lower Form has unraveled!",
              msg_it: "La forma inferiore si è disgregata!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -20 },
              regenerates: true,
            }, // AGI
            LEFT_APPENDAGE: {
              name: "Left Appendage",
              name_it: "Appendice Sinistra",
              msg: "Left Appendage has been liquefied on impact!",
              msg_it: "L'appendice sinistra si è liquefatta all'impatto!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
              regenerates: true,
            }, // ATK
            RIGHT_APPENDAGE: {
              name: "Right Appendage",
              name_it: "Appendice Destra",
              msg: "Right Appendage has been liquefied on impact!",
              msg_it: "L'appendice destra si è liquefatta all'impatto!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
              regenerates: true,
            }, // ATK
          },
          hitLocations: {
            CORE: { weight: 10 },
            UPPER_FORM: { weight: 30 },
            LOWER_FORM: { weight: 20 },
            LEFT_APPENDAGE: { weight: 20 },
            RIGHT_APPENDAGE: { weight: 20 },
          },
        },
        // AquaticFish archetype (fish-like aquatic creatures)
        AquaticFish: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body has been crushed into pulp!",
              msg_it: "Il corpo è stato schiacciato in poltiglia!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            TAIL_FIN: {
              name: "Tail Fin",
              name_it: "Pinna Caudale",
              msg: "Tail Fin has been sliced off!",
              msg_it: "La pinna caudale è stata tagliata via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            DORSAL_FIN: {
              name: "Dorsal Fin",
              name_it: "Pinna Dorsale",
              msg: "Dorsal Fin has been ripped into gore!",
              msg_it: "La pinna dorsale è stata ridotta in poltiglia!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -10 },
            }, // DEF
            LEFT_PECTORAL_FIN: {
              name: "Left Pectoral Fin",
              name_it: "Pinna Pettorale Sinistra",
              msg: "Left Pectoral Fin has been torn to ribbons!",
              msg_it: "La pinna pettorale sinistra è stata ridotta a brandelli!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            RIGHT_PECTORAL_FIN: {
              name: "Right Pectoral Fin",
              name_it: "Pinna Pettorale Destra",
              msg: "Right Pectoral Fin has been torn to ribbons!",
              msg_it: "La pinna pettorale destra è stata ridotta a brandelli!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 10 },
            BODY: { weight: 30 },
            TAIL_FIN: { weight: 20 },
            DORSAL_FIN: { weight: 10 },
            LEFT_PECTORAL_FIN: { weight: 15 },
            RIGHT_PECTORAL_FIN: { weight: 15 },
          },
        },
        // Octopus archetype (tentacled sea monsters)
        Octopus: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 20,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT
            MANTLE: {
              name: "Mantle",
              name_it: "Mantello",
              msg: "Mantle has been crushed into pulp!",
              msg_it: "Il mantello è stato schiacciato in poltiglia!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            TENTACLE_1: {
              name: "Tentacle 1",
              name_it: "Tentacolo 1",
              msg: "Tentacle 1 has been ripped off!",
              msg_it: "Il tentacolo 1 è stato strappato via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            TENTACLE_2: {
              name: "Tentacle 2",
              name_it: "Tentacolo 2",
              msg: "Tentacle 2 has been ripped off!",
              msg_it: "Il tentacolo 2 è stato strappato via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            },
            TENTACLE_3: {
              name: "Tentacle 3",
              name_it: "Tentacolo 3",
              msg: "Tentacle 3 has been ripped off!",
              msg_it: "Il tentacolo 3 è stato strappato via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            },
            TENTACLE_4: {
              name: "Tentacle 4",
              name_it: "Tentacolo 4",
              msg: "Tentacle 4 has been ripped off!",
              msg_it: "Il tentacolo 4 è stato strappato via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            },
          },
          hitLocations: {
            HEAD: { weight: 10 },
            MANTLE: { weight: 30 },
            TENTACLE_1: { weight: 15 },
            TENTACLE_2: { weight: 15 },
            TENTACLE_3: { weight: 15 },
            TENTACLE_4: { weight: 15 },
          },
        },
        // Robot archetype (mechanical enemies)
        Robot: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core has violently collapsed!",
              msg_it: "Il nucleo è collassato violentemente!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been detached!",
              msg_it: "Il braccio sinistro è stato staccato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been detached!",
              msg_it: "Il braccio destro è stato staccato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 10 },
            CORE: { weight: 25 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 15 },
            RIGHT_LEG: { weight: 15 },
          },
        },
        // Bird archetype (avian enemies like hawks, harpies, or giant birds)
        Bird: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body has been crushed into pulp!",
              msg_it: "Il corpo è stato schiacciato in poltiglia!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            BEAK: {
              name: "Beak",
              name_it: "Becco",
              msg: "Beak has been obliterated!",
              msg_it: "Il becco è stato obliterato!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            LEFT_WING: {
              name: "Left Wing",
              name_it: "Ala Sinistra",
              msg: "Left Wing has been torn to ribbons!",
              msg_it: "L'ala sinistra è stata ridotta a brandelli!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_WING: {
              name: "Right Wing",
              name_it: "Ala Destra",
              msg: "Right Wing has been torn to ribbons!",
              msg_it: "L'ala destra è stata ridotta a brandelli!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            TALONS: {
              name: "Talons",
              name_it: "Artigli",
              msg: "Talons have been ripped off!",
              msg_it: "Gli artigli sono stati strappati via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
          },
          hitLocations: {
            HEAD: { weight: 10 },
            BODY: { weight: 30 },
            BEAK: { weight: 10 },
            LEFT_WING: { weight: 20 },
            RIGHT_WING: { weight: 20 },
            TALONS: { weight: 10 },
          },
        },
        // Reptilian archetype (lizardmen, crocodiles, or serpentine monsters)
        Reptilian: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been hacked off!",
              msg_it: "La coda è stata mozzata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -10 },
            }, // DEF
          },
          hitLocations: {
            HEAD: { weight: 10 },
            TORSO: { weight: 30 },
            LEFT_ARM: { weight: 10 },
            RIGHT_ARM: { weight: 10 },
            LEFT_LEG: { weight: 10 },
            RIGHT_LEG: { weight: 10 },
            TAIL: { weight: 20 },
          },
        },
        // Mushroom archetype (fungal creatures, spore monsters)
        Mushroom: {
          parts: {
            CAP: {
              name: "Cap",
              name_it: "Cappello",
              msg: "Cap has been ripped into gore!",
              msg_it: "Il cappello è stato ridotto in poltiglia!",
              hpPercent: 30,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT
            STALK: {
              name: "Stalk",
              name_it: "Gambo",
              msg: "Stalk has twisted till it snapped!",
              msg_it: "Il gambo si è attorcigliato fino a spezzarsi!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            ROOTS: {
              name: "Roots",
              name_it: "Radici",
              msg: "Roots have been ripped out!",
              msg_it: "Le radici sono state strappate via!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -20 },
            }, // DEF
            SPORE_SACS: {
              name: "Spore Sacs",
              name_it: "Sacche Sporali",
              msg: "Spore Sacs have burst open!",
              msg_it: "Le sacche sporali sono esplose!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
              specialEffect: "disableSpores",
            }, // disables spore emission
          },
          hitLocations: {
            CAP: { weight: 25 },
            STALK: { weight: 30 },
            ROOTS: { weight: 20 },
            SPORE_SACS: { weight: 25 },
          },
        },
        // Tree archetype (sentient trees or wood-based creatures)
        Tree: {
          parts: {
            CROWN: {
              name: "Crown",
              name_it: "Chioma",
              msg: "Crown has been ripped into gore!",
              msg_it: "La chioma è stata ridotta in poltiglia!",
              hpPercent: 25,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            }, // INT
            TRUNK: {
              name: "Trunk",
              name_it: "Tronco",
              msg: "Trunk has cleaved brutally!",
              msg_it: "Il tronco è stato spaccato brutalmente!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            ROOTS: {
              name: "Roots",
              name_it: "Radici",
              msg: "Roots have been ripped out!",
              msg_it: "Le radici sono state strappate via!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -20 },
            }, // DEF
            BRANCH_1: {
              name: "Branch 1",
              name_it: "Ramo 1",
              msg: "Branch 1 has been broken off!",
              msg_it: "Il ramo 1 è stato spezzato!",
              hpPercent: 7.5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            BRANCH_2: {
              name: "Branch 2",
              name_it: "Ramo 2",
              msg: "Branch 2 has been broken off!",
              msg_it: "Il ramo 2 è stato spezzato!",
              hpPercent: 7.5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
          },
          hitLocations: {
            CROWN: { weight: 20 },
            TRUNK: { weight: 35 },
            ROOTS: { weight: 15 },
            BRANCH_1: { weight: 15 },
            BRANCH_2: { weight: 15 },
          },
        },
        // Bacterial archetype (blob-like, microbial horrors)
        Bacterial: {
          parts: {
            NUCLEUS: {
              name: "Nucleus",
              name_it: "Nucleo",
              msg: "Nucleus has burst open!",
              msg_it: "Il nucleo è esploso!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -40 },
            }, // INT
            MEMBRANE: {
              name: "Membrane",
              name_it: "Membrana",
              msg: "Membrane has melted into sludge!",
              msg_it: "La membrana si è sciolta in fanghiglia!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            FLAGELLUM: {
              name: "Flagellum",
              name_it: "Flagello",
              msg: "Flagellum has been torn to ribbons!",
              msg_it: "Il flagello è stato ridotto a brandelli!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            TOXIN_SACS: {
              name: "Toxin Sacs",
              name_it: "Sacche Tossiche",
              msg: "Toxin Sacs have burst!",
              msg_it: "Le sacche tossiche sono esplose!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
              specialEffect: "disableToxins",
            }, // disables poison attacks
          },
          hitLocations: {
            NUCLEUS: { weight: 25 },
            MEMBRANE: { weight: 25 },
            FLAGELLUM: { weight: 20 },
            TOXIN_SACS: { weight: 30 },
          },
        },
        // DoubleHeadedHumanoid archetype (mutant ogres, twin-headed brutes)
        DoubleHeadedHumanoid: {
          parts: {
            HEAD_LEFT: {
              name: "Head Left",
              name_it: "Testa Sinistra",
              msg: "Head Left has been torn apart!",
              msg_it: "La testa sinistra è stata dilaniata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT
            HEAD_RIGHT: {
              name: "Head Right",
              name_it: "Testa Destra",
              msg: "Head Right has been torn apart!",
              msg_it: "La testa destra è stata dilaniata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD_LEFT: { weight: 10 },
            HEAD_RIGHT: { weight: 10 },
            TORSO: { weight: 30 },
            LEFT_ARM: { weight: 10 },
            RIGHT_ARM: { weight: 10 },
            LEFT_LEG: { weight: 15 },
            RIGHT_LEG: { weight: 15 },
          },
        },
        // Serpent archetype (snake-like monsters)
        Serpent: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 20,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT
            FANGS: {
              name: "Fangs",
              name_it: "Zanne",
              msg: "Fangs have been shattered!",
              msg_it: "Le zanne sono state frantumate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            BODY_SEGMENT_1: {
              name: "Body Segment 1",
              name_it: "Segmento Corporeo 1",
              msg: "Body Segment 1 has ruptured!",
              msg_it: "Il segmento corporeo 1 è lacerato!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -10 },
            }, // MHP
            BODY_SEGMENT_2: {
              name: "Body Segment 2",
              name_it: "Segmento Corporeo 2",
              msg: "Body Segment 2 has ruptured!",
              msg_it: "Il segmento corporeo 2 è lacerato!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -10 },
            },
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been hacked off!",
              msg_it: "La coda è stata mozzata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 20 },
            FANGS: { weight: 15 },
            BODY_SEGMENT_1: { weight: 20 },
            BODY_SEGMENT_2: { weight: 20 },
            TAIL: { weight: 25 },
          },
        },
        // Golem archetype (animated elemental constructs)
        Golem: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core has cracked and collapsed!",
              msg_it: "Il nucleo si è incrinato e collassato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has crumbled!",
              msg_it: "Il braccio sinistro è sbriciolato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has crumbled!",
              msg_it: "Il braccio destro è sbriciolato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has fractured!",
              msg_it: "La gamba sinistra si è fratturata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has fractured!",
              msg_it: "La gamba destra si è fratturata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            CORE: { weight: 30 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 20 },
            RIGHT_LEG: { weight: 20 },
          },
        },
        // Demon archetype (infernal humanoid beasts)
        Demon: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT
            HORNS: {
              name: "Horns",
              name_it: "Corna",
              msg: "Horns have been shattered!",
              msg_it: "Le corna sono state frantumate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            WINGS: {
              name: "Wings",
              name_it: "Ali",
              msg: "Wings have been shredded!",
              msg_it: "Le ali sono state sbrindellate!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been severed!",
              msg_it: "La coda è stata recisa!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
          },
          hitLocations: {
            HEAD: { weight: 15 },
            HORNS: { weight: 10 },
            TORSO: { weight: 30 },
            WINGS: { weight: 25 },
            TAIL: { weight: 20 },
          },
        },
        // Ghost archetype (ethereal, incorporeal spirits)
        Ghost: {
          parts: {
            FACE: {
              name: "Face",
              name_it: "Volto",
              msg: "Face has disintegrated into vapor!",
              msg_it: "Il volto si è disintegrato in vapore!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            ESSENCE_CORE: {
              name: "Essence Core",
              name_it: "Nucleo Essenziale",
              msg: "Essence Core has unraveled!",
              msg_it: "Il nucleo essenziale si è disgregato!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            LEFT_WISP: {
              name: "Left Wisp",
              name_it: "Fantasma Sinistro",
              msg: "Left Wisp has been dispersed!",
              msg_it: "Il fantasma sinistro è stato disperso!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_WISP: {
              name: "Right Wisp",
              name_it: "Fantasma Destro",
              msg: "Right Wisp has been dispersed!",
              msg_it: "Il fantasma destro è stato disperso!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
          },
          hitLocations: {
            FACE: { weight: 20 },
            ESSENCE_CORE: { weight: 35 },
            LEFT_WISP: { weight: 20 },
            RIGHT_WISP: { weight: 25 },
          },
        },
        // Drone archetype (hovering mechanical scouts)
        Drone: {
          parts: {
            SENSOR_ARRAY: {
              name: "Sensor Array",
              name_it: "Sensori",
              msg: "Sensor Array has been wrecked completely!",
              msg_it: "I sensori sono stati completamente distrutti!",
              hpPercent: 25,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            }, // INT
            CHASSIS: {
              name: "Chassis",
              name_it: "Telaio",
              msg: "Chassis has been crushed into pulp!",
              msg_it: "Il telaio è stato schiacciato in poltiglia!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            LEFT_PROP: {
              name: "Left Propeller",
              name_it: "Elica Sinistra",
              msg: "Left Propeller has been smashed into wreckage!",
              msg_it: "L'elica sinistra è stata ridotta in rottami!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_PROP: {
              name: "Right Propeller",
              name_it: "Elica Destra",
              msg: "Right Propeller has been smashed into wreckage!",
              msg_it: "L'elica destra è stata ridotta in rottami!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            SENSOR_ARRAY: { weight: 20 },
            CHASSIS: { weight: 35 },
            LEFT_PROP: { weight: 20 },
            RIGHT_PROP: { weight: 25 },
          },
        },
        // Voidspawn archetype (eldritch or otherworldly beings)
        Voidspawn: {
          parts: {
            ABYSSAL_EYE: {
              name: "Abyssal Eye",
              name_it: "Occhio Abissale",
              msg: "Abyssal Eye has been pierced!",
              msg_it: "L'occhio abissale è stato trafitto!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -30 },
            }, // INT
            MAW: {
              name: "Maw",
              name_it: "Fauci",
              msg: "Maw has been split open!",
              msg_it: "Le fauci sono state spalancate!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            VOID_TENDRIL_1: {
              name: "Void Tendril 1",
              name_it: "Tentacolo del Vuoto 1",
              msg: "Void Tendril 1 has withered!",
              msg_it: "Il tentacolo del vuoto 1 è appassito!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            VOID_TENDRIL_2: {
              name: "Void Tendril 2",
              name_it: "Tentacolo del Vuoto 2",
              msg: "Void Tendril 2 has withered!",
              msg_it: "Il tentacolo del vuoto 2 è appassito!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            },
            CORE_SHARD: {
              name: "Core Shard",
              name_it: "Frammento Nucleare",
              msg: "Core Shard has fractured!",
              msg_it: "Il frammento nucleare si è fratturato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
          },
          hitLocations: {
            ABYSSAL_EYE: { weight: 20 },
            MAW: { weight: 15 },
            VOID_TENDRIL_1: { weight: 15 },
            VOID_TENDRIL_2: { weight: 15 },
            CORE_SHARD: { weight: 35 },
          },
        },
        // Mutant archetype (aberrant flesh constructs)
        Mutant: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT
            MASS: {
              name: "Shifting Mass",
              name_it: "Massa Mutevole",
              msg: "Shifting Mass has unraveled!",
              msg_it: "La massa mutevole si è disgregata!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            EXTRA_LIMB_1: {
              name: "Extra Limb 1",
              name_it: "Arto Extra 1",
              msg: "Extra Limb 1 has fallen off!",
              msg_it: "L'arto extra 1 è caduto!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            EXTRA_LIMB_2: {
              name: "Extra Limb 2",
              name_it: "Arto Extra 2",
              msg: "Extra Limb 2 has fallen off!",
              msg_it: "L'arto extra 2 è caduto!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            },
            EYE_CLUSTER: {
              name: "Eye Cluster",
              name_it: "Grappolo di Occhi",
              msg: "Eye Cluster has burst!",
              msg_it: "Il grappolo di occhi è esploso!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT
            TAIL_SPIKE: {
              name: "Tail Spike",
              name_it: "Aculeo Caudale",
              msg: "Tail Spike has wrenched free!",
              msg_it: "L'aculeo caudale si è staccato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 10 },
            MASS: { weight: 30 },
            EXTRA_LIMB_1: { weight: 15 },
            EXTRA_LIMB_2: { weight: 15 },
            EYE_CLUSTER: { weight: 15 },
            TAIL_SPIKE: { weight: 15 },
          },
        },
        // CrystalEntity archetype (arcane gem-based lifeforms)
        CrystalEntity: {
          parts: {
            CRYSTAL_CORE: {
              name: "Crystal Core",
              name_it: "Nucleo Cristallino",
              msg: "Crystal Core has cracked!",
              msg_it: "Il nucleo cristallino si è incrinato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            }, // MHP
            LEFT_SPIRE: {
              name: "Left Spire",
              name_it: "Guglia Sinistra",
              msg: "Left Spire has obliterated!",
              msg_it: "La guglia sinistra è stata obliterata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            RIGHT_SPIRE: {
              name: "Right Spire",
              name_it: "Guglia Destra",
              msg: "Right Spire has obliterated!",
              msg_it: "La guglia destra è stata obliterata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            FOCUS_GEM: {
              name: "Focus Gem",
              name_it: "Gemma Focale",
              msg: "Focus Gem has snuffed out!",
              msg_it: "La gemma focale si è spenta!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -30 },
            }, // INT
            SHIELD_CRYSTAL: {
              name: "Shield Crystal",
              name_it: "Cristallo Scudo",
              msg: "Shield Crystal has shattered to shards!",
              msg_it: "Il cristallo scudo si è frantumato in schegge!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -15 },
            }, // DEF
          },
          hitLocations: {
            CRYSTAL_CORE: { weight: 30 },
            LEFT_SPIRE: { weight: 15 },
            RIGHT_SPIRE: { weight: 15 },
            FOCUS_GEM: { weight: 20 },
            SHIELD_CRYSTAL: { weight: 20 },
          },
        },
        // Amphibian archetype (swamp beasts, giant frogs)
        Amphibian: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            TONGUE: {
              name: "Tongue",
              name_it: "Lingua",
              msg: "Tongue has been ripped off!",
              msg_it: "La lingua è stata strappata via!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left Leg has been cut off!!",
              msg_it: "La gamba sinistra è stata tagliata via!!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right Leg has been cut off!!",
              msg_it: "La gamba destra è stata tagliata via!!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 15 },
            TORSO: { weight: 30 },
            TONGUE: { weight: 10 },
            LEFT_LEG: { weight: 20 },
            RIGHT_LEG: { weight: 25 },
          },
        },
        // ConstructedUndead archetype (stitched abominations, necromantic flesh golems)
        ConstructedUndead: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 10,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT
            STITCHED_TORSO: {
              name: "Stitched Torso",
              name_it: "Torso Cucito",
              msg: "Stitched Torso has torn down the middle!",
              msg_it: "Il torso cucito si è lacerato nel mezzo!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has torn loose!",
              msg_it: "Il braccio sinistro si è staccato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has torn loose!",
              msg_it: "Il braccio destro si è staccato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            POWER_STITCH: {
              name: "Power Stitch",
              name_it: "Cucitura di Forza",
              msg: "Power Stitch has erupted messily!",
              msg_it: "La cucitura di forza è esplosa disordinatamente!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 6, amount: -25 },
            }, // AGI / binding integrity
          },
          hitLocations: {
            HEAD: { weight: 10 },
            STITCHED_TORSO: { weight: 30 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            POWER_STITCH: { weight: 30 },
          },
        },
        Minotaur: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT
            HORNS: {
              name: "Horns",
              name_it: "Corna",
              msg: "Horns have been shattered!",
              msg_it: "Le corna sono state frantumate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
            TORSO: {
              name: "Torso",
              name_it: "Torso",
              msg: "Torso has been crushed into pulp!",
              msg_it: "Il torso è stato schiacciato in poltiglia!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left Arm has been ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right Arm has been ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
            LEGS: {
              name: "Bull Legs",
              name_it: "Zampe di Toro",
              msg: "Bull Legs have been cut off!",
              msg_it: "Le zampe di toro sono state tagliate via!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 15 },
            HORNS: { weight: 10 },
            TORSO: { weight: 30 },
            LEFT_ARM: { weight: 10 },
            RIGHT_ARM: { weight: 10 },
            LEGS: { weight: 25 },
          },
        },
        Goblin: {
          parts: {
            BRAIN: {
              name: "Brain",
              name_it: "Cervello",
              msg: "Brain has been destroyed, insta-gib!",
              msg_it: "Il cervello è stato distrutto, morte istantanea!",
              hpPercent: 5,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -100 },
            }, // INT/Magic
            // Skeletal System
            SKULL: {
              name: "Skull",
              name_it: "Cranio",
              msg: "Skull fractured, exposing the brain!",
              msg_it: "Cranio incrinato, cervello esposto!",
              hpPercent: 8,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -30 },
            },
            CERVICAL_VERTEBRAE: {
              name: "Cervical Vertebrae",
              name_it: "Vertebre Cervicali",
              msg: "Neck vertebrae snapped!",
              msg_it: "Vertebre del collo spezzate!",
              hpPercent: 6,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -25 },
            },
            THORACIC_VERTEBRAE: {
              name: "Thoracic Vertebrae",
              name_it: "Vertebre Toraciche",
              msg: "Upper spine cracked!",
              msg_it: "Colonna vertebrale superiore incrinata!",
              hpPercent: 6,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -20 },
            },
            LUMBAR_VERTEBRAE: {
              name: "Lumbar Vertebrae",
              name_it: "Vertebre Lombari",
              msg: "Lower spine collapsed!",
              msg_it: "Colonna vertebrale inferiore crollata!",
              hpPercent: 6,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -20 },
            },
            RIBCAGE: {
              name: "Rib Cage",
              name_it: "Gabbia Toracica",
              msg: "Rib cage shattered!",
              msg_it: "Gabbia toracica frantumata!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            },
            PELVIS: {
              name: "Pelvis",
              name_it: "Pelvi",
              msg: "Pelvis crushed!",
              msg_it: "Pelvi schiacciata!",
              hpPercent: 8,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -20 },
            },
            // Organs (non-vital)
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart punctured, massive hemorrhage!",
              msg_it: "Cuore perforato, emorragia massiva!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
            LUNGS: {
              name: "Lungs",
              name_it: "Polmoni",
              msg: "Lungs collapsed, breathing ceased!",
              msg_it: "Polmoni collassati, respiro cessato!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -45 },
            },
            LIVER: {
              name: "Liver",
              name_it: "Fegato",
              msg: "Liver ruptured, toxins flood bloodstream!",
              msg_it: "Fegato squarciato, tossine nel flusso sanguigno!",
              hpPercent: 8,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            },
            KIDNEYS: {
              name: "Kidneys",
              name_it: "Reni",
              msg: "Kidneys destroyed, rapid organ failure!",
              msg_it: "Reni distrutti, insufficienza rapida!",
              hpPercent: 8,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            },
            STOMACH: {
              name: "Stomach",
              name_it: "Stomaco",
              msg: "Stomach ruptured, internal spill everywhere!",
              msg_it: "Stomaco squarciato, fuoriuscita interna!",
              hpPercent: 8,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            },
            SMALL_INTESTINE: {
              name: "Small Intestine",
              name_it: "Intestino Tenue",
              msg: "Small intestine torn!",
              msg_it: "Intestino tenue lacerato!",
              hpPercent: 6,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 },
            },
            LARGE_INTESTINE: {
              name: "Large Intestine",
              name_it: "Intestino Crasso",
              msg: "Large intestine burst!",
              msg_it: "Intestino crasso esploso!",
              hpPercent: 6,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 },
            },
            PANCREAS: {
              name: "Pancreas",
              name_it: "Pancreas",
              msg: "Pancreas obliterated!",
              msg_it: "Pancreas obliterato!",
              hpPercent: 5,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 },
            },
            SPLEEN: {
              name: "Spleen",
              name_it: "Milza",
              msg: "Spleen ruptured, massive bleed!",
              msg_it: "Milza squarciata, sanguinamento massiccio!",
              hpPercent: 5,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 },
            },
            // Sensory Organs
            EYE_LEFT: {
              name: "Left Eye",
              name_it: "Occhio Sinistro",
              msg: "Left eye gouged out!",
              msg_it: "Occhio sinistro cavato fuori!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            },
            EYE_RIGHT: {
              name: "Right Eye",
              name_it: "Occhio Destro",
              msg: "Right eye gouged out!",
              msg_it: "Occhio destro cavato fuori!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            },
            EAR_LEFT: {
              name: "Left Ear",
              name_it: "Orecchio Sinistro",
              msg: "Left ear torn off!",
              msg_it: "Orecchio sinistro strappato!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -10 },
            },
            EAR_RIGHT: {
              name: "Right Ear",
              name_it: "Orecchio Destro",
              msg: "Right ear torn off!",
              msg_it: "Orecchio destro strappato!",
              hpPercent: 3,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -10 },
            },
            TONGUE: {
              name: "Tongue",
              name_it: "Lingua",
              msg: "Tongue has been removed!",
              msg_it: "La lingua è stata rimossa!",
              hpPercent: 2,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            },
            // Limbs subdivided
            LEFT_UPPER_ARM: {
              name: "Left Upper Arm",
              name_it: "Parte Superiore Braccio Sinistro",
              msg: "Left upper arm severed!",
              msg_it: "Parte superiore braccio sinistro recisa!",
              hpPercent: 6,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            LEFT_FOREARM: {
              name: "Left Forearm",
              name_it: "Avambraccio Sinistro",
              msg: "Left forearm fractured!",
              msg_it: "Avambraccio sinistro incrinato!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            LEFT_HAND: {
              name: "Left Hand",
              name_it: "Mano Sinistra",
              msg: "Left hand dismembered!",
              msg_it: "Mano sinistra smembrata!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            RIGHT_UPPER_ARM: {
              name: "Right Upper Arm",
              name_it: "Parte Superiore Braccio Destro",
              msg: "Right upper arm severed!",
              msg_it: "Parte superiore braccio destro recisa!",
              hpPercent: 6,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            RIGHT_FOREARM: {
              name: "Right Forearm",
              name_it: "Avambraccio Destro",
              msg: "Right forearm fractured!",
              msg_it: "Avambraccio destro incrinato!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            RIGHT_HAND: {
              name: "Right Hand",
              name_it: "Mano Destra",
              msg: "Right hand dismembered!",
              msg_it: "Mano destra smembrata!",
              hpPercent: 4,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            LEFT_THIGH: {
              name: "Left Thigh",
              name_it: "Coscia Sinistra",
              msg: "Left thigh shattered!",
              msg_it: "Coscia sinistra frantumata!",
              hpPercent: 7,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            LEFT_SHIN: {
              name: "Left Shin",
              name_it: "Gamba Sinistra Bassa",
              msg: "Left shin broken!",
              msg_it: "Gamba sinistra bassa rotta!",
              hpPercent: 6,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            LEFT_FOOT: {
              name: "Left Foot",
              name_it: "Piede Sinistro",
              msg: "Left foot detached!",
              msg_it: "Piede sinistro staccato!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            RIGHT_THIGH: {
              name: "Right Thigh",
              name_it: "Coscia Destra",
              msg: "Right thigh shattered!",
              msg_it: "Coscia destra frantumata!",
              hpPercent: 7,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            RIGHT_SHIN: {
              name: "Right Shin",
              name_it: "Gamba Destra Bassa",
              msg: "Right shin broken!",
              msg_it: "Gamba destra bassa rotta!",
              hpPercent: 6,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            RIGHT_FOOT: {
              name: "Right Foot",
              name_it: "Piede Destro",
              msg: "Right foot detached!",
              msg_it: "Piede destro staccato!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
          },
          hitLocations: {
            BRAIN: { weight: 5 },
            SKULL: { weight: 8 },
            CERVICAL_VERTEBRAE: { weight: 6 },
            THORACIC_VERTEBRAE: { weight: 6 },
            LUMBAR_VERTEBRAE: { weight: 6 },
            RIBCAGE: { weight: 10 },
            PELVIS: { weight: 8 },
            HEART: { weight: 10 },
            LUNGS: { weight: 10 },
            LIVER: { weight: 8 },
            KIDNEYS: { weight: 8 },
            STOMACH: { weight: 8 },
            SMALL_INTESTINE: { weight: 6 },
            LARGE_INTESTINE: { weight: 6 },
            PANCREAS: { weight: 5 },
            SPLEEN: { weight: 5 },
            EYE_LEFT: { weight: 4 },
            EYE_RIGHT: { weight: 4 },
            EAR_LEFT: { weight: 3 },
            EAR_RIGHT: { weight: 3 },
            TONGUE: { weight: 2 },
            LEFT_UPPER_ARM: { weight: 6 },
            LEFT_FOREARM: { weight: 5 },
            LEFT_HAND: { weight: 4 },
            RIGHT_UPPER_ARM: { weight: 6 },
            RIGHT_FOREARM: { weight: 5 },
            RIGHT_HAND: { weight: 4 },
            LEFT_THIGH: { weight: 7 },
            LEFT_SHIN: { weight: 6 },
            LEFT_FOOT: { weight: 5 },
            RIGHT_THIGH: { weight: 7 },
            RIGHT_SHIN: { weight: 6 },
            RIGHT_FOOT: { weight: 5 },
          },
        },
        Crustacean: {
          parts: {
            CLAW_LEFT: {
              name: "Left Claw",
              name_it: "Chela Sinistra",
              msg: "Left claw has been shattered!",
              msg_it: "La chela sinistra è stata frantumata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            CLAW_RIGHT: {
              name: "Right Claw",
              name_it: "Chela Destra",
              msg: "Right claw has been smashed!",
              msg_it: "La chela destra è stata distrutta!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            CARAPACE: {
              name: "Carapace",
              name_it: "Carapace",
              msg: "Carapace has cracked wide open!",
              msg_it: "Il carapace si è spaccato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -30 },
            }, // DEF
            ABDOMEN: {
              name: "Abdomen",
              name_it: "Addome",
              msg: "Abdomen has been ruptured!",
              msg_it: "L'addome è stato squarciato!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            FRONT_LEG: {
              name: "Front Leg",
              name_it: "Zampa Anteriore",
              msg: "Front leg has been severed!",
              msg_it: "La zampa anteriore è stata recisa!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            REAR_LEG: {
              name: "Rear Leg",
              name_it: "Zampa Posteriore",
              msg: "Rear leg has been hacked off!",
              msg_it: "La zampa posteriore è stata mozzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            ANTENNAE: {
              name: "Antennae",
              name_it: "Antenne",
              msg: "Antennae have been crushed!",
              msg_it: "Le antenne sono state schiacciate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT/Magic
          },
          hitLocations: {
            CLAW_LEFT: { weight: 10 },
            CLAW_RIGHT: { weight: 10 },
            CARAPACE: { weight: 30 },
            ABDOMEN: { weight: 20 },
            FRONT_LEG: { weight: 10 },
            REAR_LEG: { weight: 10 },
            ANTENNAE: { weight: 10 },
          },
        },
    
        Spherical: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core integrity compromised!",
              msg_it: "Integrità del nucleo compromessa!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            }, // MHP
            SHELL: {
              name: "Outer Shell",
              name_it: "Guscio Esterno",
              msg: "Shell has been fractured!",
              msg_it: "Il guscio è stato incrinato!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            }, // DEF
            SENSOR_ARRAY: {
              name: "Sensor Array",
              name_it: "Matrice di Sensori",
              msg: "Sensor array knocked offline!",
              msg_it: "Matrice di sensori disattivata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            SPIN_SPINES: {
              name: "Spin Spines",
              name_it: "Spine Rotanti",
              msg: "Spin spines have been sheared off!",
              msg_it: "Le spine rotanti sono state divelte!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            AUX_DRIVES: {
              name: "Auxiliary Drives",
              name_it: "Propulsori Ausiliari",
              msg: "Auxiliary drives have failed!",
              msg_it: "I propulsori ausiliari hanno smesso di funzionare!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 2, amount: -10 },
            }, // ATK
          },
          hitLocations: {
            CORE: { weight: 30 },
            SHELL: { weight: 30 },
            SENSOR_ARRAY: { weight: 15 },
            SPIN_SPINES: { weight: 15 },
            AUX_DRIVES: { weight: 10 },
          },
        },
    
        Turtle: {
          parts: {
            SHELL: {
              name: "Shell",
              name_it: "Guscio",
              msg: "Shell has been cracked open!",
              msg_it: "Il guscio si è spaccato!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 5, amount: -35 },
            }, // DEF
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head has been battered!",
              msg_it: "La testa è stata danneggiata!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front left leg has been broken!",
              msg_it: "La zampa anteriore sinistra è stata rotta!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front right leg has been snapped!",
              msg_it: "La zampa anteriore destra è stata spezzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear left leg has been severed!",
              msg_it: "La zampa posteriore sinistra è stata recisa!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear right leg has been hacked off!",
              msg_it: "La zampa posteriore destra è stata mozzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail has been clipped!",
              msg_it: "La coda è stata tagliata!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 0, amount: -15 },
            }, // MHP
          },
          hitLocations: {
            SHELL: { weight: 40 },
            HEAD: { weight: 15 },
            FRONT_LEFT_LEG: { weight: 10 },
            FRONT_RIGHT_LEG: { weight: 10 },
            REAR_LEFT_LEG: { weight: 10 },
            REAR_RIGHT_LEG: { weight: 10 },
            TAIL: { weight: 5 },
          },
        },
        Manticore: {
          parts: {
            BRAIN: {
              name: "Brain",
              name_it: "Cervello",
              msg: "Brain destroyed!",
              msg_it: "Cervello distrutto!",
              hpPercent: 5,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -100 },
            },
            SKULL: {
              name: "Skull",
              name_it: "Cranio",
              msg: "Skull cracked!",
              msg_it: "Cranio incrinato!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -30 },
            },
            SPINE: {
              name: "Spine",
              name_it: "Colonna Vertebrale",
              msg: "Spine severed!",
              msg_it: "Colonna vertebrale recisa!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -40 },
            },
            RIBCAGE: {
              name: "Rib Cage",
              name_it: "Gabbia Toracica",
              msg: "Rib cage punctured!",
              msg_it: "Gabbia toracica perforata!",
              hpPercent: 12,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            },
            FRONT_LEFT_PAW: {
              name: "Front Left Paw",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front left paw shredded!",
              msg_it: "Zampa anteriore sinistra fatta a brandelli!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            FRONT_RIGHT_PAW: {
              name: "Front Right Paw",
              name_it: "Zampa Anteriore Destra",
              msg: "Front right paw shredded!",
              msg_it: "Zampa anteriore destra fatta a brandelli!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear left leg mangled!",
              msg_it: "Zampa posteriore sinistra dilaniata!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear right leg mangled!",
              msg_it: "Zampa posteriore destra dilaniata!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
            WINGS: {
              name: "Wings",
              name_it: "Ali",
              msg: "Wings torn!",
              msg_it: "Ali strappate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            TAIL: {
              name: "Spiked Tail",
              name_it: "Coda Acuminata",
              msg: "Tail severed!",
              msg_it: "Coda recisa!",
              hpPercent: 9,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            },
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart impaled!",
              msg_it: "Cuore infilzato!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
            LUNGS: {
              name: "Lungs",
              name_it: "Polmoni",
              msg: "Lungs punctured!",
              msg_it: "Polmoni perforati!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -45 },
            },
            EYES: {
              name: "Eyes",
              name_it: "Occhi",
              msg: "Eyes gouged!",
              msg_it: "Occhi cavati!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            },
          },
          hitLocations: {
            BRAIN: { weight: 5 },
            SKULL: { weight: 10 },
            SPINE: { weight: 15 },
            RIBCAGE: { weight: 12 },
            FRONT_LEFT_PAW: { weight: 8 },
            FRONT_RIGHT_PAW: { weight: 8 },
            REAR_LEFT_LEG: { weight: 8 },
            REAR_RIGHT_LEG: { weight: 8 },
            WINGS: { weight: 10 },
            TAIL: { weight: 9 },
            HEART: { weight: 10 },
            LUNGS: { weight: 10 },
            EYES: { weight: 5 },
          },
        },
    
        ChestMimic: {
          parts: {
            SQUISHY_CORE: {
              name: "Squishy Core",
              name_it: "Nucleo Morbido",
              msg: "Core ruptured!",
              msg_it: "Nucleo lacerato!",
              hpPercent: 15,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -80 },
            },
            LID: {
              name: "Chest Lid",
              name_it: "Coperchio del Baule",
              msg: "Lid pried!",
              msg_it: "Coperchio aperto!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -20 },
            },
            TEETH: {
              name: "Jagged Teeth",
              name_it: "Denti Frastagliati",
              msg: "Teeth knocked out!",
              msg_it: "Denti spinti fuori!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            },
            TONGUE: {
              name: "Slime Tongue",
              name_it: "Lingua Slime",
              msg: "Tongue severed!",
              msg_it: "Lingua recisa!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            FEET: {
              name: "Stubby Feet",
              name_it: "Zampe Corte",
              msg: "Feet smashed!",
              msg_it: "Zampe schiacciate!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            SQUISHY_CORE: { weight: 15 },
            LID: { weight: 25 },
            TEETH: { weight: 20 },
            TONGUE: { weight: 20 },
            FEET: { weight: 20 },
          },
        },
    
        Phoenix: {
          parts: {
            ASH_CORE: {
              name: "Ash Core",
              name_it: "Nucleo di Cenere",
              msg: "Ash Core obliterated!",
              msg_it: "Nucleo di cenere annientato!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -90 },
            },
            FEATHERS: {
              name: "Flaming Feathers",
              name_it: "Piume Fiammeggianti",
              msg: "Feathers singed!",
              msg_it: "Piume bruciate!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -30 },
            },
            BEAK: {
              name: "Beak",
              name_it: "Becco",
              msg: "Beak cracked!",
              msg_it: "Becco incrinato!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            TALONS: {
              name: "Talons",
              name_it: "Artigli",
              msg: "Talons shattered!",
              msg_it: "Artigli frantumati!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            WINGS: {
              name: "Wings",
              name_it: "Ali",
              msg: "Wings extinguished!",
              msg_it: "Ali spente!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -35 },
            },
            EYES: {
              name: "Ember Eyes",
              name_it: "Occhi Ardenti",
              msg: "Eyes dim!",
              msg_it: "Occhi spenti!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            },
          },
          hitLocations: {
            ASH_CORE: { weight: 20 },
            FEATHERS: { weight: 25 },
            BEAK: { weight: 10 },
            TALONS: { weight: 15 },
            WINGS: { weight: 20 },
            EYES: { weight: 10 },
          },
        },
    
        Ogre: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head smashed!",
              msg_it: "Testa colpita!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            TORSO: {
              name: "Torso",
              name_it: "Torace",
              msg: "Torso battered!",
              msg_it: "Torace maltrattato!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm broken!",
              msg_it: "Braccio sinistro rotto!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm snapped!",
              msg_it: "Braccio destro spezzato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left leg crippled!",
              msg_it: "Gamba sinistra compromessa!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right leg maimed!",
              msg_it: "Gamba destra mutilata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            },
          },
          hitLocations: {
            HEAD: { weight: 15 },
            TORSO: { weight: 35 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 10 },
            RIGHT_LEG: { weight: 10 },
          },
        },
    
        Scarecrow: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head smashed!",
              msg_it: "Testa distrutta!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 3, amount: -20 },
            },
            TORSO: {
              name: "Torso",
              name_it: "Corpo",
              msg: "Torso torn!",
              msg_it: "Corpo lacerato!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm ripped!",
              msg_it: "Braccio sinistro strappato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm torn!",
              msg_it: "Braccio destro strappato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            },
            LEFT_LEG: {
              name: "Left Leg",
              name_it: "Gamba Sinistra",
              msg: "Left leg snapped!",
              msg_it: "Gamba sinistra spezzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            },
            RIGHT_LEG: {
              name: "Right Leg",
              name_it: "Gamba Destra",
              msg: "Right leg broken!",
              msg_it: "Gamba destra rotta!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            },
          },
          hitLocations: {
            HEAD: { weight: 20 },
            TORSO: { weight: 30 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEFT_LEG: { weight: 10 },
            RIGHT_LEG: { weight: 10 },
          },
        },
        SegmentWorm: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head crushed!",
              msg_it: "Testa schiacciata!",
              hpPercent: 10,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            }, // INT/Magic
            HEART_SEGMENT: {
              name: "Heart Segment",
              name_it: "Segmento Cardiaco",
              msg: "Heart segment ruptured!",
              msg_it: "Segmento cardiaco lacerato!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -80 },
            }, // MHP
            BODY_SEGMENT: {
              name: "Body Segment",
              name_it: "Segmento Corporeo",
              msg: "Body segment severed!",
              msg_it: "Segmento corporeo reciso!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail sliced off!",
              msg_it: "Coda recisa!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 10 },
            HEART_SEGMENT: { weight: 20 },
            BODY_SEGMENT: { weight: 50 },
            TAIL: { weight: 20 },
          },
        },
    
        Mineral: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core shattered!",
              msg_it: "Nucleo frantumato!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
            SHELL: {
              name: "Shell",
              name_it: "Conchiglia",
              msg: "Shell cracked!",
              msg_it: "Conchiglia crepata!",
              hpPercent: 40,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -30 },
            },
            CRYSTALS: {
              name: "Crystals",
              name_it: "Cristalli",
              msg: "Crystals shattered!",
              msg_it: "Cristalli frantumati!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            VEINS: {
              name: "Veins",
              name_it: "Vene Minerali",
              msg: "Veins disrupted!",
              msg_it: "Vene interrotte!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            CORE: { weight: 20 },
            SHELL: { weight: 40 },
            CRYSTALS: { weight: 20 },
            VEINS: { weight: 20 },
          },
        },
        Hydra: {
          parts: {
            HEAD_ONE: {
              name: "Left Head",
              name_it: "Testa Sinistra",
              msg: "Left head severed!",
              msg_it: "Testa sinistra recisa!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            HEAD_TWO: {
              name: "Center Head",
              name_it: "Testa Centrale",
              msg: "Center head decapitated!",
              msg_it: "Testa centrale decapitata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            HEAD_THREE: {
              name: "Right Head",
              name_it: "Testa Destra",
              msg: "Right head chopped!",
              msg_it: "Testa destra troncata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body crushed!",
              msg_it: "Corpo schiacciato!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail severed!",
              msg_it: "Coda recisa!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
          },
          hitLocations: {
            HEAD_ONE: { weight: 20 },
            HEAD_TWO: { weight: 20 },
            HEAD_THREE: { weight: 20 },
            BODY: { weight: 25 },
            TAIL: { weight: 15 },
          },
        },
    
        Vampire: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head struck!",
              msg_it: "Testa colpita!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart pierced!",
              msg_it: "Cuore trafitto!",
              hpPercent: 25,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -70 },
            }, // MHP
            FANGS: {
              name: "Fangs",
              name_it: "Zanne",
              msg: "Fangs shattered!",
              msg_it: "Zanne frantumulate!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            }, // ATK
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm broken!",
              msg_it: "Braccio sinistro rotto!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm shattered!",
              msg_it: "Braccio destro frantumato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 5,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HEAD: { weight: 15 },
            HEART: { weight: 25 },
            FANGS: { weight: 15 },
            LEFT_ARM: { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            LEGS: { weight: 15 },
          },
        },
    
        Bat: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head stunned!",
              msg_it: "Testa stordita!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body battered!",
              msg_it: "Corpo maltrattato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -35 },
            }, // MHP
            LEFT_WING: {
              name: "Left Wing",
              name_it: "Ala Sinistra",
              msg: "Left wing torn!",
              msg_it: "Ala sinistra lacerata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
            RIGHT_WING: {
              name: "Right Wing",
              name_it: "Ala Destra",
              msg: "Right wing shredded!",
              msg_it: "Ala destra ridotta a brandelli!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
            FANGS: {
              name: "Fangs",
              name_it: "Zanne",
              msg: "Fangs blunted!",
              msg_it: "Zanne spuntate!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -15 },
            }, // ATK
          },
          hitLocations: {
            HEAD: { weight: 15 },
            BODY: { weight: 30 },
            LEFT_WING: { weight: 15 },
            RIGHT_WING: { weight: 15 },
            FANGS: { weight: 25 },
          },
        },
        Rabbit: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head stunned!",
              msg_it: "Testa stordita!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body battered!",
              msg_it: "Corpo maltrattato!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            EARS: {
              name: "Ears",
              name_it: "Orecchie",
              msg: "Ears torn!",
              msg_it: "Orecchie lacerate!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -15 },
            }, // INT/Magic
            FRONT_LEGS: {
              name: "Front Legs",
              name_it: "Zampe Anteriori",
              msg: "Front legs broken!",
              msg_it: "Zampe anteriori spezzate!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            REAR_LEGS: {
              name: "Rear Legs",
              name_it: "Zampe Posteriori",
              msg: "Rear legs crippled!",
              msg_it: "Zampe posteriori compromesse!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail snapped!",
              msg_it: "Coda spezzata!",
              hpPercent: 5,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 },
            }, // AGI
          },
          hitLocations: {
            HEAD:       { weight: 15 },
            BODY:       { weight: 35 },
            EARS:       { weight: 10 },
            FRONT_LEGS: { weight: 20 },
            REAR_LEGS:  { weight: 15 },
            TAIL:       { weight: 5 },
          },
        },
      
        ArmoredKnight: {
          parts: {
            HELMET: {
              name: "Helmet",
              name_it: "Elmo",
              msg: "Helmet removed!",
              msg_it: "Elmo rimosso!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -15 },
            }, // DEF
            CHESTPLATE: {
              name: "Chestplate",
              name_it: "Corazza",
              msg: "Chestplate cracked!",
              msg_it: "Corazza incrinata!",
              hpPercent: 35,
              vital: false,
              canCutoff: true,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            PAULDRON_LEFT: {
              name: "Left Pauldron",
              name_it: "Spallina Sinistra",
              msg: "Left pauldron shattered!",
              msg_it: "Spallina sinistra frantumata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            PAULDRON_RIGHT: {
              name: "Right Pauldron",
              name_it: "Spallina Destra",
              msg: "Right pauldron shattered!",
              msg_it: "Spallina destra frantumata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            }, // ATK
            GREAVES_LEFT: {
              name: "Left Greaves",
              name_it: "Gambali Sinistri",
              msg: "Left greaves buckled!",
              msg_it: "Gambali sinistri piegati!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
            GREAVES_RIGHT: {
              name: "Right Greaves",
              name_it: "Gambali Destri",
              msg: "Right greaves buckled!",
              msg_it: "Gambali destri piegati!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 },
            }, // AGI
          },
          hitLocations: {
            HELMET:         { weight: 15 },
            CHESTPLATE:     { weight: 35 },
            PAULDRON_LEFT:  { weight: 15 },
            PAULDRON_RIGHT: { weight: 15 },
            GREAVES_LEFT:   { weight: 10 },
            GREAVES_RIGHT:  { weight: 10 },
          },
        },
        Centaur : {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head caved in, the mind goes blank!",
              msg_it: "La testa è stata sfondata, la mente si spegne!",
              hpPercent: 12,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 }, // INT/Magic
            },
            HUMAN_TORSO: {
              name: "Human Torso",
              name_it: "Torso Umano",
              msg: "Human torso crushed into pulp!",
              msg_it: "Il torso umano è stato schiacciato in poltiglia!",
              hpPercent: 18,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -15 }, // MHP
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm ripped off!",
              msg_it: "Il braccio sinistro è stato strappato via!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -12 }, // ATK
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm ripped off!",
              msg_it: "Il braccio destro è stato strappato via!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -18 }, // ATK (dominant hand)
            },
            EQUINE_BODY: {
              name: "Equine Body",
              name_it: "Corpo Equino",
              msg: "Equine body buckles, breath and balance shattered!",
              msg_it: "Il corpo equino crolla, respiro ed equilibrio distrutti!",
              hpPercent: 24,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 }, // MHP
            },
            FRONT_LEFT_LEG: {
              name: "Front Left Leg",
              name_it: "Zampa Anteriore Sinistra",
              msg: "Front left leg severed!",
              msg_it: "La zampa anteriore sinistra è stata recisa!",
              hpPercent: 7,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
            },
            FRONT_RIGHT_LEG: {
              name: "Front Right Leg",
              name_it: "Zampa Anteriore Destra",
              msg: "Front right leg severed!",
              msg_it: "La zampa anteriore destra è stata recisa!",
              hpPercent: 7,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -10 }, // AGI
            },
            REAR_LEFT_LEG: {
              name: "Rear Left Leg",
              name_it: "Zampa Posteriore Sinistra",
              msg: "Rear left leg hacked off!",
              msg_it: "La zampa posteriore sinistra è stata mozzata!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 }, // AGI (hind drive)
            },
            REAR_RIGHT_LEG: {
              name: "Rear Right Leg",
              name_it: "Zampa Posteriore Destra",
              msg: "Rear right leg hacked off!",
              msg_it: "La zampa posteriore destra è stata mozzata!",
              hpPercent: 8,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -15 }, // AGI (hind drive)
            },
          },
          hitLocations: {
            HEAD: { weight: 10 },
            HUMAN_TORSO: { weight: 15 },
            LEFT_ARM: { weight: 10 },
            RIGHT_ARM: { weight: 10 },
            EQUINE_BODY: { weight: 25 },
            FRONT_LEFT_LEG: { weight: 10 },
            FRONT_RIGHT_LEG: { weight: 10 },
            REAR_LEFT_LEG: { weight: 5 },
            REAR_RIGHT_LEG: { weight: 5 },
          },
        },
        InsectSwarm: {
          parts: {
            MANDIBLES: {
              name: "Mandibles Cluster",
              name_it: "Gruppo di Mandibole",
              msg: "Mandibles cluster shattered!",
              msg_it: "Gruppo di mandibole frantumato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            }, // ATK
            WINGS: {
              name: "Wings Swarm",
              name_it: "Sciame di Ali",
              msg: "Wings swarm dispersed!",
              msg_it: "Sciame di ali disperso!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            LEGS: {
              name: "Legs Cluster",
              name_it: "Gruppo di Zampe",
              msg: "Legs cluster incapacitated!",
              msg_it: "Gruppo di zampe reso incapace!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            }, // AGI
            ABDOMEN: {
              name: "Abdomens Cluster",
              name_it: "Gruppo di Addomi",
              msg: "Abdomens cluster destroyed!",
              msg_it: "Gruppo di addomi distrutto!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 0, amount: -25 },
            }, // MHP
            STINGERS: {
              name: "Stingers Swarm",
              name_it: "Sciame di Pungiglioni",
              msg: "Stingers swarm neutralized!",
              msg_it: "Sciame di pungiglioni neutralizzato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -20 },
            }, // DEF
          },
          hitLocations: {
            MANDIBLES: { weight: 20 },
            WINGS:     { weight: 20 },
            LEGS:      { weight: 25 },
            ABDOMEN:   { weight: 20 },
            STINGERS:  { weight: 15 },
          },
        },
        RoboticDefender: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head disabled!",
              msg_it: "Testa disabilitata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            }, // INT/Magic
            ARM_CANNON: {
              name: "Arm Cannon",
              name_it: "Cannone Braccio",
              msg: "Arm cannon destroyed!",
              msg_it: "Cannone distrutto!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            }, // ATK
            TORSO: {
              name: "Torso",
              name_it: "Torace",
              msg: "Torso breached!",
              msg_it: "Torace violato!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            LEG_JOINTS: {
              name: "Leg Joints",
              name_it: "Giacoltà Gambe",
              msg: "Leg joints jammed!",
              msg_it: "Giacoltà gambe bloccate!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            }, // AGI
            SENSORS: {
              name: "Sensors",
              name_it: "Sensori",
              msg: "Sensors offline!",
              msg_it: "Sensori offline!",
              hpPercent: 10,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -20 },
            }, // DEF
          },
          hitLocations: {
            HEAD:        { weight: 15 },
            ARM_CANNON:  { weight: 20 },
            TORSO:       { weight: 30 },
            LEG_JOINTS:  { weight: 20 },
            SENSORS:     { weight: 15 },
          },
        },
        Turret: {
          parts: {
            CORE: {
              name: "Core",
              name_it: "Nucleo",
              msg: "Core deactivated!",
              msg_it: "Nucleo disattivato!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            }, // MHP
            GUN_BARREL: {
              name: "Gun Barrel",
              name_it: "Canna",
              msg: "Gun barrel destroyed!",
              msg_it: "Canna distrutta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            }, // ATK
            SENSOR_ARRAY: {
              name: "Sensor Array",
              name_it: "Sensori",
              msg: "Sensors offline!",
              msg_it: "Sensori offline!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            }, // DEF
            ROTATION_MECH: {
              name: "Rotation Mechanism",
              name_it: "Meccanismo di Rotazione",
              msg: "Rotation jammed!",
              msg_it: "Rotazione bloccata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
            AMMO_CHAMBER: {
              name: "Ammo Chamber",
              name_it: "Camera Munizioni",
              msg: "Ammo chamber ruptured!",
              msg_it: "Camera munizioni lacerata!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
          },
          hitLocations: {
            CORE:            { weight: 25 },
            GUN_BARREL:      { weight: 20 },
            SENSOR_ARRAY:    { weight: 15 },
            ROTATION_MECH:   { weight: 20 },
            AMMO_CHAMBER:    { weight: 20 },
          },
        },
        Gorgon: {
          parts: {
            EYES: {
              name: "Eyes",
              name_it: "Occhi",
              msg: "Eyes blinded!",
              msg_it: "Occhi accecati!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            }, // INT/Magic
            SNAKE_HAIR: {
              name: "Snake Hair",
              name_it: "Capelli Serpente",
              msg: "Snake hair severed!",
              msg_it: "Capelli serpente recisi!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            }, // ATK
            UPPER_BODY: {
              name: "Upper Body",
              name_it: "Corpo Superiore",
              msg: "Upper body petrified!",
              msg_it: "Corpo superiore pietrificato!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            }, // MHP
            LOWER_BODY: {
              name: "Lower Body",
              name_it: "Corpo Inferiore",
              msg: "Lower body shattered!",
              msg_it: "Corpo inferiore frantumato!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -20 },
            }, // AGI
          },
          hitLocations: {
            EYES:        { weight: 20 },
            SNAKE_HAIR:  { weight: 25 },
            UPPER_BODY:  { weight: 30 },
            LOWER_BODY:  { weight: 25 },
          },
        },
        AbyssalLeviathan: {
          parts: {
            EYE: {
              name: "Giant Eye",
              name_it: "Occhio Gigante",
              msg: "Eye blinded!",
              msg_it: "Occhio accecato!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            },
            MAW: {
              name: "Maw",
              name_it: "Fauce",
              msg: "Maw crushed!",
              msg_it: "Fauce schiacciata!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -35 },
            },
            DORSAL_PLATES: {
              name: "Dorsal Plates",
              name_it: "Placche Dorsali",
              msg: "Dorsal plates cracked!",
              msg_it: "Placche dorsali incrinate!",
              hpPercent: 30,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -40 },
            },
            TENTACLES: {
              name: "Tentacles",
              name_it: "Tentacoli",
              msg: "Tentacles severed!",
              msg_it: "Tentacoli recisi!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            HEART_CHAMBER: {
              name: "Heart Chamber",
              name_it: "Camera Cardiaca",
              msg: "Heart chamber ruptured!",
              msg_it: "Camera cardiaca lacerata!",
              hpPercent: 10,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -70 },
            },
          },
          hitLocations: {
            EYE:            { weight: 15 },
            MAW:            { weight: 20 },
            DORSAL_PLATES:  { weight: 30 },
            TENTACLES:      { weight: 20 },
            HEART_CHAMBER:  { weight: 15 },
          },
        },
          // Snail archetype
          Snail: {
            parts: {
              SHELL: {
                name: "Shell",
                name_it: "Conchiglia",
                msg: "Shell has been shattered!",
                msg_it: "La conchiglia si è frantumata!",
                hpPercent: 40,
                vital: false,
                canCutoff: false,
                statEffect: { param: 5, amount: -20 },
              }, // DEF
              BODY: {
                name: "Body",
                name_it: "Corpo",
                msg: "Body has been crushed!",
                msg_it: "Il corpo è stato schiacciato!",
                hpPercent: 30,
                vital: true,
                canCutoff: true,
                statEffect: { param: 0, amount: -30 },
              }, // MHP
              TENTACLE_1: {
                name: "Tentacle 1",
                name_it: "Tentacolo 1",
                msg: "Tentacle 1 has been severed!",
                msg_it: "Il tentacolo 1 è stato reciso!",
                hpPercent: 15,
                vital: false,
                canCutoff: true,
                statEffect: { param: 2, amount: -15 },
              }, // ATK
              TENTACLE_2: {
                name: "Tentacle 2",
                name_it: "Tentacolo 2",
                msg: "Tentacle 2 has been severed!",
                msg_it: "Il tentacolo 2 è stato reciso!",
                hpPercent: 15,
                vital: false,
                canCutoff: true,
                statEffect: { param: 2, amount: -15 },
              }, // ATK
              EYE: {
                name: "Eye",
                name_it: "Occhio",
                msg: "Eye has been blinded!",
                msg_it: "L'occhio è stato accecato!",
                hpPercent: 10,
                vital: false,
                canCutoff: true,
                statEffect: { param: 3, amount: -20 },
              }, // INT/Magic
              FOOT: {
                name: "Foot",
                name_it: "Piede",
                msg: "Foot has been crushed!",
                msg_it: "Il piede è stato schiacciato!",
                hpPercent: 10,
                vital: false,
                canCutoff: true,
                statEffect: { param: 6, amount: -10 },
              }, // AGI
            },
            hitLocations: {
              SHELL: { weight: 25 },
              BODY: { weight: 30 },
              TENTACLE_1: { weight: 10 },
              TENTACLE_2: { weight: 10 },
              EYE: { weight: 10 },
              FOOT: { weight: 15 },
            },
          },
      
          // Water Elemental archetype
          WaterElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has collapsed into mist!",
                msg_it: "Il nucleo è crollato in nebbia!",
                hpPercent: 30,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -40 },
              }, // MHP
              WATER_BODY: {
                name: "Water Body",
                name_it: "Corpo d'Acqua",
                msg: "Water Body has dispersed!",
                msg_it: "Il corpo d'acqua si è disperso!",
                hpPercent: 30,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -20 },
              }, // INT/Magic
              WATER_ARMS: {
                name: "Water Arms",
                name_it: "Braccia d'Acqua",
                msg: "Water Arms have been torn apart!",
                msg_it: "Le braccia d'acqua sono state lacerate!",
                hpPercent: 20,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              }, // ATK
              WATER_LEGS: {
                name: "Water Legs",
                name_it: "Gambe d'Acqua",
                msg: "Water Legs have evaporated!",
                msg_it: "Le gambe d'acqua si sono evaporate!",
                hpPercent: 20,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -20 },
              }, // AGI
            },
            hitLocations: {
              CORE: { weight: 20 },
              WATER_BODY: { weight: 30 },
              WATER_ARMS: { weight: 25 },
              WATER_LEGS: { weight: 25 },
            },
          },
      
          // Thunder Elemental archetype
          ThunderElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has been shattered by lightning!",
                msg_it: "Il nucleo è stato frantumato dal fulmine!",
                hpPercent: 25,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -45 },
              },
              ELECTRIC_BODY: {
                name: "Electric Body",
                name_it: "Corpo Elettrico",
                msg: "Electric Body has short‑circuited!",
                msg_it: "Il corpo elettrico ha fatto corto circuito!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -25 },
              },
              ELECTRIC_ARMS: {
                name: "Electric Arms",
                name_it: "Braccia Elettriche",
                msg: "Electric Arms have lost power!",
                msg_it: "Le braccia elettriche hanno perso potenza!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              },
              ELECTRIC_LEGS: {
                name: "Electric Legs",
                name_it: "Gambe Elettriche",
                msg: "Electric Legs have grounded out!",
                msg_it: "Le gambe elettriche si sono messe a terra!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -20 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              ELECTRIC_BODY: { weight: 30 },
              ELECTRIC_ARMS: { weight: 25 },
              ELECTRIC_LEGS: { weight: 25 },
            },
          },
      
          // Storm Elemental archetype
          StormElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has dissipated in gale!",
                msg_it: "Il nucleo si è disperso nella raffica!",
                hpPercent: 20,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -50 },
              },
              WIND_BODY: {
                name: "Wind Body",
                name_it: "Corpo di Vento",
                msg: "Wind Body has been scattered!",
                msg_it: "Il corpo di vento è stato disperso!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -25 },
              },
              RAIN_ARMS: {
                name: "Rain Arms",
                name_it: "Braccia di Pioggia",
                msg: "Rain Arms have been washed away!",
                msg_it: "Le braccia di pioggia sono state spazzate via!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              },
              THUNDER_LEGS: {
                name: "Thunder Legs",
                name_it: "Gambe di Tuono",
                msg: "Thunder Legs have been struck down!",
                msg_it: "Le gambe di tuono sono state abbattute!",
                hpPercent: 30,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -20 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              WIND_BODY: { weight: 25 },
              RAIN_ARMS: { weight: 25 },
              THUNDER_LEGS: { weight: 30 },
            },
          },
      
          // Fire Elemental archetype
          FireElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has been incinerated!",
                msg_it: "Il nucleo è stato incenerito!",
                hpPercent: 25,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -45 },
              },
              FLAME_BODY: {
                name: "Flame Body",
                name_it: "Corpo di Fiamma",
                msg: "Flame Body has been extinguished!",
                msg_it: "Il corpo di fiamma è stato estinto!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -25 },
              },
              EMBER_ARMS: {
                name: "Ember Arms",
                name_it: "Braccia di Brace",
                msg: "Ember Arms have cooled off!",
                msg_it: "Le braccia di brace si sono raffreddate!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              },
              ASH_LEGS: {
                name: "Ash Legs",
                name_it: "Gambe di Cenere",
                msg: "Ash Legs have crumbled!",
                msg_it: "Le gambe di cenere si sono sbriciolate!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -20 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              FLAME_BODY: { weight: 30 },
              EMBER_ARMS: { weight: 25 },
              ASH_LEGS: { weight: 25 },
            },
          },
      
          // Metal Elemental archetype
          MetalElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has been warped!",
                msg_it: "Il nucleo è stato deformato!",
                hpPercent: 30,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -40 },
              },
              PLATE_ARMOR: {
                name: "Plate Armor",
                name_it: "Armatura",
                msg: "Plate Armor has cracked!",
                msg_it: "L'armatura si è incrinata!",
                hpPercent: 30,
                vital: false,
                canCutoff: false,
                statEffect: { param: 5, amount: -30 },
              },
              SPIKE_ARMS: {
                name: "Spike Arms",
                name_it: "Braccia Spinose",
                msg: "Spike Arms have been dulled!",
                msg_it: "Le braccia spinose si sono smussate!",
                hpPercent: 20,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              },
              GEAR_LEGS: {
                name: "Gear Legs",
                name_it: "Gambe Ingranaggio",
                msg: "Gear Legs have jammed!",
                msg_it: "Le gambe ingranaggio si sono bloccate!",
                hpPercent: 20,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -20 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              PLATE_ARMOR: { weight: 30 },
              SPIKE_ARMS: { weight: 25 },
              GEAR_LEGS: { weight: 25 },
            },
          },
      
          // Dark Elemental archetype
          DarkElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has been consumed by shadows!",
                msg_it: "Il nucleo è stato consumato dalle ombre!",
                hpPercent: 25,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -50 },
              },
              SHADOW_BODY: {
                name: "Shadow Body",
                name_it: "Corpo d'Ombra",
                msg: "Shadow Body has withered!",
                msg_it: "Il corpo d'ombra si è appassito!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -30 },
              },
              WRAITH_ARMS: {
                name: "Wraith Arms",
                name_it: "Braccia Spettrali",
                msg: "Wraith Arms have faded!",
                msg_it: "Le braccia spettrali si sono affievolite!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -25 },
              },
              CURSE_LEGS: {
                name: "Curse Legs",
                name_it: "Gambe Maledette",
                msg: "Curse Legs have collapsed!",
                msg_it: "Le gambe maledette sono crollate!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -25 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              SHADOW_BODY: { weight: 30 },
              WRAITH_ARMS: { weight: 25 },
              CURSE_LEGS: { weight: 25 },
            },
          },
      
          // Sacred Elemental archetype
          SacredElemental: {
            parts: {
              CORE: {
                name: "Core",
                name_it: "Nucleo",
                msg: "Core has been sanctified away!",
                msg_it: "Il nucleo è stato santificato via!",
                hpPercent: 30,
                vital: true,
                canCutoff: false,
                statEffect: { param: 0, amount: -40 },
              },
              LIGHT_BODY: {
                name: "Light Body",
                name_it: "Corpo di Luce",
                msg: "Light Body has been blazed out!",
                msg_it: "Il corpo di luce è stato annientato!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 3, amount: -30 },
              },
              RADIANT_ARMS: {
                name: "Radiant Arms",
                name_it: "Braccia Radiose",
                msg: "Radiant Arms have dimmed!",
                msg_it: "Le braccia radiosi si sono affievolite!",
                hpPercent: 20,
                vital: false,
                canCutoff: false,
                statEffect: { param: 2, amount: -20 },
              },
              AURA_LEGS: {
                name: "Aura Legs",
                name_it: "Gambe d'Aura",
                msg: "Aura Legs have lost form!",
                msg_it: "Le gambe d'aura hanno perso forma!",
                hpPercent: 25,
                vital: false,
                canCutoff: false,
                statEffect: { param: 6, amount: -25 },
              },
            },
            hitLocations: {
              CORE: { weight: 20 },
              LIGHT_BODY: { weight: 30 },
              RADIANT_ARMS: { weight: 25 },
              AURA_LEGS: { weight: 25 },
            },
          },
      
        Totem: {
          parts: {
            CORE: {
              name: "Spirit Core",
              name_it: "Nucleo Spirituale",
              msg: "Core shattered!",
              msg_it: "Nucleo Spirituale frantumato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -60 },
            },
            LEFT_ARM: {
              name: "Left Arm",
              name_it: "Braccio Sinistro",
              msg: "Left arm splintered!",
              msg_it: "Braccio Sinistro scheggiato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            },
            RIGHT_ARM: {
              name: "Right Arm",
              name_it: "Braccio Destro",
              msg: "Right arm splintered!",
              msg_it: "Braccio Destro scheggiato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -25 },
            },
            EYES: {
              name: "Totem Eyes",
              name_it: "Occhi del Totem",
              msg: "Eyes shattered!",
              msg_it: "Occhi del Totem frantumati!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            },
            BASE: {
              name: "Base",
              name_it: "Base",
              msg: "Base cracked!",
              msg_it: "Base incrinata!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -30 },
            },
          },
          hitLocations: {
            CORE:      { weight: 30 },
            LEFT_ARM:  { weight: 15 },
            RIGHT_ARM: { weight: 15 },
            EYES:      { weight: 10 },
            BASE:      { weight: 30 },
          },
        },
      
        Ophanim: {
          parts: {
            WHEEL_ONE: {
              name: "Wheel One",
              name_it: "Ruota Uno",
              msg: "Wheel one destroyed!",
              msg_it: "Ruota Uno distrutta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            WHEEL_TWO: {
              name: "Wheel Two",
              name_it: "Ruota Due",
              msg: "Wheel two destroyed!",
              msg_it: "Ruota Due distrutta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            WHEEL_THREE: {
              name: "Wheel Three",
              name_it: "Ruota Tre",
              msg: "Wheel three destroyed!",
              msg_it: "Ruota Tre distrutta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            WHEEL_FOUR: {
              name: "Wheel Four",
              name_it: "Ruota Quattro",
              msg: "Wheel four destroyed!",
              msg_it: "Ruota Quattro distrutta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            EYE_RING: {
              name: "Eye Ring",
              name_it: "Anello di Occhi",
              msg: "Eye ring blinded!",
              msg_it: "Anello di Occhi accecato!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 3, amount: -30 },
            },
          },
          hitLocations: {
            WHEEL_ONE:   { weight: 20 },
            WHEEL_TWO:   { weight: 20 },
            WHEEL_THREE: { weight: 20 },
            WHEEL_FOUR:  { weight: 20 },
            EYE_RING:    { weight: 20 },
          },
        },
      
        Angel: {
          parts: {
            WINGS: {
              name: "Wings",
              name_it: "Ali",
              msg: "Wings clipped!",
              msg_it: "Ali tagliate!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            HALO: {
              name: "Halo",
              name_it: "Aureola",
              msg: "Halo shattered!",
              msg_it: "Aureola frantumata!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -20 },
            },
            CORE: {
              name: "Heart Core",
              name_it: "Cuore Spirituale",
              msg: "Core pierced!",
              msg_it: "Cuore Spirituale trafitto!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -60 },
            },
            ROBE: {
              name: "Robe",
              name_it: "Veste",
              msg: "Robe torn!",
              msg_it: "Veste lacerata!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            },
            FEET: {
              name: "Feet",
              name_it: "Piedi",
              msg: "Feet broken!",
              msg_it: "Piedi rotti!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            WINGS: { weight: 25 },
            HALO:  { weight: 15 },
            CORE:  { weight: 30 },
            ROBE:  { weight: 20 },
            FEET:  { weight: 10 },
          },
        },
      
        Elven: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head struck!",
              msg_it: "Testa colpita!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            },
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart ruptured!",
              msg_it: "Cuore lacerato!",
              hpPercent: 25,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
            BOW: {
              name: "Bow",
              name_it: "Arco",
              msg: "Bow snapped!",
              msg_it: "Arco spezzato!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            },
            ROBE: {
              name: "Robe",
              name_it: "Veste",
              msg: "Robe torn!",
              msg_it: "Veste lacerata!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 5, amount: -25 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            HEAD:  { weight: 15 },
            HEART: { weight: 25 },
            BOW:   { weight: 20 },
            ROBE:  { weight: 20 },
            LEGS:  { weight: 20 },
          },
        },
      
        Gnome: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head bumped!",
              msg_it: "Testa urtata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -20 },
            },
            BEARD: {
              name: "Beard",
              name_it: "Barba",
              msg: "Beard torn!",
              msg_it: "Barba lacerata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -15 },
            },
            HAT: {
              name: "Hat",
              name_it: "Cappello",
              msg: "Hat knocked off!",
              msg_it: "Cappello spinto via!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -20 },
            },
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart squeezed!",
              msg_it: "Cuore stretto!",
              hpPercent: 25,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs buckled!",
              msg_it: "Gambe cedute!",
              hpPercent: 30,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            HEAD:  { weight: 15 },
            BEARD: { weight: 10 },
            HAT:   { weight: 15 },
            HEART: { weight: 25 },
            LEGS:  { weight: 35 },
          },
        },
      
        Elephant: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head bashed!",
              msg_it: "Testa colpita!",
              hpPercent: 20,
              vital: false,
              canCutoff: false,
              statEffect: { param: 3, amount: -25 },
            },
            TRUNK: {
              name: "Trunk",
              name_it: "Proboscide",
              msg: "Trunk severed!",
              msg_it: "Proboscide recisa!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            TUSKS: {
              name: "Tusks",
              name_it: "Zanne",
              msg: "Tusks broken!",
              msg_it: "Zanne rotte!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -20 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body bruised!",
              msg_it: "Corpo contuso!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
          },
          hitLocations: {
            HEAD:   { weight: 15 },
            TRUNK:  { weight: 20 },
            TUSKS:  { weight: 15 },
            BODY:   { weight: 30 },
            LEGS:   { weight: 20 },
          },
        },
      
        TentacledCreature: {
          parts: {
            EYE: {
              name: "Central Eye",
              name_it: "Occhio Centrale",
              msg: "Eye shattered!",
              msg_it: "Occhio frantumato!",
              hpPercent: 15,
              vital: true,
              canCutoff: true,
              statEffect: { param: 3, amount: -50 },
            },
            TENTACLE_ONE: {
              name: "Tentacle One",
              name_it: "Tentacolo Uno",
              msg: "Tentacle one severed!",
              msg_it: "Tentacolo Uno reciso!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            TENTACLE_TWO: {
              name: "Tentacle Two",
              name_it: "Tentacolo Due",
              msg: "Tentacle two severed!",
              msg_it: "Tentacolo Due reciso!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body battered!",
              msg_it: "Corpo maltrattato!",
              hpPercent: 25,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            },
          },
          hitLocations: {
            EYE:           { weight: 15 },
            TENTACLE_ONE:  { weight: 20 },
            TENTACLE_TWO:  { weight: 20 },
            BODY:          { weight: 45 },
          },
        },
      
        SpiderHumanHybrid: {
          parts: {
            SPIDER_BODY: {
              name: "Spider Body",
              name_it: "Corpo Ragno",
              msg: "Spider body destroyed!",
              msg_it: "Corpo Ragno distrutto!",
              hpPercent: 40,
              vital: false,
              canCutoff: false,
              statEffect: { param: 6, amount: -30 },
            },
            HUMAN_TORSO: {
              name: "Human Torso",
              name_it: "Torso Umano",
              msg: "Human torso crushed!",
              msg_it: "Torso Umano schiacciato!",
              hpPercent: 30,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -60 },
            },
            HUMAN_HEAD: {
              name: "Human Head",
              name_it: "Testa Umana",
              msg: "Human head severed!",
              msg_it: "Testa Umana recisa!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -50 },
            },
            SPIDER_LEGS: {
              name: "Spider Legs",
              name_it: "Zampe Ragno",
              msg: "Spider legs dismantled!",
              msg_it: "Zampe Ragno smantellate!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
          },
          hitLocations: {
            SPIDER_BODY: { weight: 40 },
            HUMAN_TORSO: { weight: 30 },
            HUMAN_HEAD:  { weight: 15 },
            SPIDER_LEGS: { weight: 15 },
          },
        },  
        SpikyMonster: {
          parts: {
            SPIKES: {
              name: "Spikes",
              name_it: "Spine",
              msg: "Spikes shattered!",
              msg_it: "Spine frantumate!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 5, amount: -30 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body stunned!",
              msg_it: "Corpo stordito!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -35 },
            },
            EYES: {
              name: "Eyes",
              name_it: "Occhi",
              msg: "Eyes blinded!",
              msg_it: "Occhi accecati!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
          },
          hitLocations: {
            SPIKES: { weight: 25 },
            BODY:   { weight: 40 },
            EYES:   { weight: 10 },
            LEGS:   { weight: 25 },
          },
        },
      
        Horse: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head stunned!",
              msg_it: "Testa stordita!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body bruised!",
              msg_it: "Corpo contuso!",
              hpPercent: 50,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -30 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 30,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -35 },
            },
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail snapped!",
              msg_it: "Coda spezzata!",
              hpPercent: 10,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            HEAD: { weight: 20 },
            BODY: { weight: 40 },
            LEGS: { weight: 30 },
            TAIL: { weight: 10 },
          },
        },
      
        Unicorn: {
          parts: {
            HORN: {
              name: "Horn",
              name_it: "Corno",
              msg: "Horn shattered!",
              msg_it: "Corno frantumato!",
              hpPercent: 20,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -60 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body wounded!",
              msg_it: "Corpo ferito!",
              hpPercent: 40,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs crippled!",
              msg_it: "Gambe compromesse!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail clipped!",
              msg_it: "Coda tagliata!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -20 },
            },
          },
          hitLocations: {
            HORN: { weight: 20 },
            BODY: { weight: 40 },
            LEGS: { weight: 25 },
            TAIL: { weight: 15 },
          },
        },
      
        Hellhound: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head scorched!",
              msg_it: "Testa bruciata!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            COLLAR: {
              name: "Collar",
              name_it: "Collare",
              msg: "Collar broken!",
              msg_it: "Collare rotto!",
              hpPercent: 15,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -20 },
            },
            BODY: {
              name: "Body",
              name_it: "Corpo",
              msg: "Body burned!",
              msg_it: "Corpo bruciato!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -35 },
            },
            LEGS: {
              name: "Legs",
              name_it: "Gambe",
              msg: "Legs incapacitated!",
              msg_it: "Gambe rese incapaci!",
              hpPercent: 30,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
          },
          hitLocations: {
            HEAD: { weight: 20 },
            COLLAR: { weight: 15 },
            BODY: { weight: 35 },
            LEGS: { weight: 30 },
          },
        },
      
        WingedDemon: {
          parts: {
            HEAD: {
              name: "Head",
              name_it: "Testa",
              msg: "Head cursed!",
              msg_it: "Testa maledetta!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -30 },
            },
            WINGS: {
              name: "Wings",
              name_it: "Ali",
              msg: "Wings scorched!",
              msg_it: "Ali bruciate!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -35 },
            },
            TAIL: {
              name: "Tail",
              name_it: "Coda",
              msg: "Tail severed!",
              msg_it: "Coda recisa!",
              hpPercent: 20,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -25 },
            },
            CORE: {
              name: "Infernal Core",
              name_it: "Nucleo Infernale",
              msg: "Core extinguished!",
              msg_it: "Nucleo Infernale spento!",
              hpPercent: 35,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -60 },
            },
            CLAWS: {
              name: "Claws",
              name_it: "Artigli",
              msg: "Claws shattered!",
              msg_it: "Artigli frantumati!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 2, amount: -30 },
            },
          },
          hitLocations: {
            HEAD: { weight: 20 },
            WINGS: { weight: 25 },
            TAIL: { weight: 15 },
            CORE: { weight: 25 },
            CLAWS: { weight: 15 },
          },
        },
      
        TrashCreature: {
          parts: {
            TRASH_PILE: {
              name: "Trash Pile",
              name_it: "Mucchio di Spazzatura",
              msg: "Trash pile scattered!",
              msg_it: "Mucchio di Spazzatura disperso!",
              hpPercent: 50,
              vital: false,
              canCutoff: false,
              statEffect: { param: 0, amount: -40 },
            },
            LIMBS: {
              name: "Limbs",
              name_it: "Arti",
              msg: "Limbs removed!",
              msg_it: "Arti rimosse!",
              hpPercent: 25,
              vital: false,
              canCutoff: true,
              statEffect: { param: 6, amount: -30 },
            },
            EYES: {
              name: "Eyes",
              name_it: "Occhi",
              msg: "Eyes blocked!",
              msg_it: "Occhi ostruiti!",
              hpPercent: 15,
              vital: false,
              canCutoff: true,
              statEffect: { param: 3, amount: -25 },
            },
            HEART: {
              name: "Heart",
              name_it: "Cuore",
              msg: "Heart crushed!",
              msg_it: "Cuore schiacciato!",
              hpPercent: 10,
              vital: true,
              canCutoff: false,
              statEffect: { param: 0, amount: -50 },
            },
          },
          hitLocations: {
            TRASH_PILE: { weight: 40 },
            LIMBS:      { weight: 25 },
            EYES:       { weight: 15 },
            HEART:      { weight: 20 },
          },
            
    
        },
      };
    
    const BodyParts = {
        // Head group
        HEAD: { name: "Head", name_it: "Testa", hp: 30, vital: true, canLose: false, childParts: ['BRAIN', 'LEFT_EYE', 'RIGHT_EYE', 'NOSE', 'LEFT_EAR', 'RIGHT_EAR', 'MOUTH'], statEffect: { param: 0, amount: -10 }, damageMsg: "skull was fractured", damageMsg_it: "cranio fratturato" },
        BRAIN: { name: "Brain", name_it: "Cervello", hp: 20, vital: true, canLose: false, statEffect: { param: 3, amount: -15 }, damageMsg: "brain was concussed", damageMsg_it: "concussione cerebrale" },
        LEFT_EYE: { name: "Left Eye", name_it: "Occhio sinistro", hp: 10, vital: false, canLose: false, statEffect: { param: 2, amount: -5 }, damageMsg: "left eye was swollen shut", damageMsg_it: "occhio sinistro gonfio e chiuso" },
        RIGHT_EYE: { name: "Right Eye", name_it: "Occhio destro", hp: 10, vital: false, canLose: false, statEffect: { param: 2, amount: -5 }, damageMsg: "right eye was swollen shut", damageMsg_it: "occhio destro gonfio e chiuso" },
        NOSE: { name: "Nose", name_it: "Naso", hp: 5, vital: false, canLose: false, damageMsg: "nose was broken", damageMsg_it: "naso rotto" },
        LEFT_EAR: { name: "Left Ear", name_it: "Orecchio sinistro", hp: 5, vital: false, canLose: false, damageMsg: "left ear is ringing", damageMsg_it: "orecchio sinistro che fischia" },
        RIGHT_EAR: { name: "Right Ear", name_it: "Orecchio destro", hp: 5, vital: false, canLose: false, damageMsg: "right ear is ringing", damageMsg_it: "orecchio destro che fischia" },
        MOUTH: { name: "Mouth", name_it: "Bocca", hp: 8, vital: false, canLose: false, childParts: ['TEETH'], damageMsg: "jaw was dislocated", damageMsg_it: "mascella lussata" },
        TEETH: { name: "Teeth", name_it: "Denti", hp: 5, vital: false, canLose: false, multiple: true, damageMsg: "teeth were knocked out", damageMsg_it: "denti divelti" },
        
        // Torso group
        TORSO: { name: "Torso", name_it: "Torace", hp: 40, vital: true, canLose: false, childParts: ['HEART', 'LEFT_LUNG', 'RIGHT_LUNG', 'LIVER', 'STOMACH', 'SPLEEN', 'INTESTINES'], statEffect: { param: 0, amount: -15 }, damageMsg: "ribs were broken", damageMsg_it: "costole rotte" },
        HEART: { name: "Heart", name_it: "Cuore", hp: 25, vital: true, canLose: false, statEffect: { param: 6, amount: -10 }, damageMsg: "heart was damaged", damageMsg_it: "cuore danneggiato" },
        LEFT_LUNG: { name: "Left Lung", name_it: "Polmone sinistro", hp: 20, vital: true, canLose: false, statEffect: { param: 6, amount: -5 }, damageMsg: "left lung collapsed", damageMsg_it: "polmone sinistro collassato" },
        RIGHT_LUNG: { name: "Right Lung", name_it: "Polmone destro", hp: 20, vital: true, canLose: false, statEffect: { param: 6, amount: -5 }, damageMsg: "right lung collapsed", damageMsg_it: "polmone destro collassato" },
        LIVER: { name: "Liver", name_it: "Fegato", hp: 15, vital: true, canLose: false, statEffect: { param: 1, amount: -5 }, damageMsg: "liver was lacerated", damageMsg_it: "fegato lacerato" },
        STOMACH: { name: "Stomach", name_it: "Stomaco", hp: 15, vital: true, canLose: false, statEffect: { param: 7, amount: -5 }, damageMsg: "stomach was ruptured", damageMsg_it: "stomaco lacerato" },
        SPLEEN: { name: "Spleen", name_it: "Milza", hp: 10, vital: false, canLose: false, damageMsg: "spleen was ruptured", damageMsg_it: "milza lacerata" },
        INTESTINES: { name: "Intestines", name_it: "Intestino", hp: 20, vital: true, canLose: false, statEffect: { param: 5, amount: -5 }, damageMsg: "intestines were perforated", damageMsg_it: "intestino perforato" },
        
        // Arm groups
        LEFT_ARM: { name: "Left Arm", name_it: "Braccio sinistro", hp: 20, vital: false, canLose: false, childParts: ['LEFT_HAND'], equipSlot: 'leftHand', statEffect: { param: 2, amount: -5 }, damageMsg: "left arm was badly damaged", damageMsg_it: "braccio sinistro gravemente danneggiato" },
        LEFT_HAND: { name: "Left Hand", name_it: "Mano sinistra", hp: 10, vital: false, canLose: false, childParts: ['LEFT_FINGERS'], equipSlot: 'leftHand', statEffect: { param: 2, amount: -5 }, damageMsg: "left hand was mangled", damageMsg_it: "mano sinistra mutilata" },
        LEFT_FINGERS: { name: "Left Fingers", name_it: "Dita della mano sinistra", hp: 5, vital: false, canLose: false, multiple: true, statEffect: { param: 2, amount: -2 }, damageMsg: "left fingers were broken", damageMsg_it: "dita sinistre rotte" },
        RIGHT_ARM: { name: "Right Arm", name_it: "Braccio destro", hp: 20, vital: false, canLose: false, childParts: ['RIGHT_HAND'], equipSlot: 'rightHand', statEffect: { param: 2, amount: -8 }, damageMsg: "right arm was badly damaged", damageMsg_it: "braccio destro gravemente danneggiato" },
        RIGHT_HAND: { name: "Right Hand", name_it: "Mano destra", hp: 10, vital: false, canLose: false, childParts: ['RIGHT_FINGERS'], equipSlot: 'rightHand', statEffect: { param: 2, amount: -5 }, damageMsg: "right hand was mangled", damageMsg_it: "mano destra mutilata" },
        RIGHT_FINGERS: { name: "Right Fingers", name_it: "Dita della mano destra", hp: 5, vital: false, canLose: false, multiple: true, statEffect: { param: 2, amount: -3 }, damageMsg: "right fingers were broken", damageMsg_it: "dita destre rotte" },
        
        // Leg groups
        LEFT_LEG: { name: "Left Leg", name_it: "Gamba sinistra", hp: 25, vital: false, canLose: false, childParts: ['LEFT_FOOT'], statEffect: { param: 6, amount: -10 }, damageMsg: "left leg was badly damaged", damageMsg_it: "gamba sinistra gravemente danneggiata" },
        LEFT_FOOT: { name: "Left Foot", name_it: "Piede sinistro", hp: 10, vital: false, canLose: false, childParts: ['LEFT_TOES'], statEffect: { param: 6, amount: -5 }, damageMsg: "left foot was badly damaged", damageMsg_it: "piede sinistro gravemente danneggiato" },
        LEFT_TOES: { name: "Left Toes", name_it: "Dita del piede sinistro", hp: 5, vital: false, canLose: false, multiple: true, damageMsg: "left toes were crushed", damageMsg_it: "dita del piede sinistro schiacciate" },
        RIGHT_LEG: { name: "Right Leg", name_it: "Gamba destra", hp: 25, vital: false, canLose: false, childParts: ['RIGHT_FOOT'], statEffect: { param: 6, amount: -10 }, damageMsg: "right leg was badly damaged", damageMsg_it: "gamba destra gravemente danneggiata" },
        RIGHT_FOOT: { name: "Right Foot", name_it: "Piede destro", hp: 10, vital: false, canLose: false, childParts: ['RIGHT_TOES'], statEffect: { param: 6, amount: -5 }, damageMsg: "right foot was badly damaged", damageMsg_it: "piede destro gravemente danneggiato" },
        RIGHT_TOES: { name: "Right Toes", name_it: "Dita del piede destro", hp: 5, vital: false, canLose: false, multiple: true, damageMsg: "right toes were crushed", damageMsg_it: "dita del piede destro schiacciate" }
    };
    var ProstheticTypes = {
        // === HEAD PROSTHETICS ===
        // Brain augmentations
        CRYSTAL_CORTEX: {
            name_en: "Crystal Mind Cortex",
            name_it: "Corteccia Mentale Cristallina",
            type: "magical",
            effects: {3: 8, 4: 5}, // INT +8, MAT +5
            skill: null,
            cost: 130000
        },
        NEURAL_IMPLANT: {
            name_en: "Neural Processing Implant",
            name_it: "Impianto Processore Neurale",
            type: "technological",
            effects: {3: 6, 2: 3}, // INT +6, ATK +3
            skill: null,
            cost: 90000
        },
        ANCIENT_WISDOM_ORB: {
            name_en: "Ancient Wisdom Orb",
            name_it: "Orbe dell'Antica Saggezza",
            type: "magical",
            effects: {3: 12, 1: 15}, // INT +12, MMP +15
            skill: null,
            cost: 270000
        },
        SKULL_REINFORCEMENT: {
            name_en: "Dwarven Skull Plating",
            name_it: "Corazza Cranica Nanica",
            type: "biological",
            effects: {5: 8, 0: 20}, // DEF +8, MHP +20
            skill: null,
            cost: 280000
        },
    
        // === EYE PROSTHETICS ===
        HAWKS_EYE: {
            name_en: "Hawk's Eye Implant",
            name_it: "Impianto Occhio di Falco",
            type: "biological",
            effects: {2: 4, 6: 3}, // ATK +4, AGI +3
            skill: null,
            cost: 70000
        },
        CYBER_OPTICS: {
            name_en: "Cyber Optics Suite",
            name_it: "Suite Ottica Cibernetica",
            type: "technological",
            effects: {2: 7, 6: 2}, // ATK +7, AGI +2
            skill: null,
            cost: 90000
        },
        VOID_SIGHT: {
            name_en: "Void Sight Lens",
            name_it: "Lente della Vista del Vuoto",
            type: "magical",
            effects: {4: 6, 3: 3}, // MAT +6, INT +3
            skill: null,
            cost: 90000
        },
        DRAGONS_GAZE: {
            name_en: "Dragon's Gaze",
            name_it: "Sguardo del Drago",
            type: "magical",
            effects: {4: 8, 2: 2}, // MAT +8, ATK +2
            skill: null,
            cost: 100000
        },
        TELESCOPIC_EYE: {
            name_en: "Telescopic Eye Mechanism",
            name_it: "Meccanismo Oculare Telescopico",
            type: "technological",
            skill: null,
            effects: {2: 6, 3: 2}, // ATK +6, INT +2
            cost: 80000
        },
    
        // === NOSE PROSTHETICS ===
        SCENT_TRACKER: {
            name_en: "Beast Scent Tracker",
            name_it: "Tracciatore di Odori Bestiale",
            type: "biological",
            skill: null,
            effects: {6: 5, 7: 3}, // AGI +5, PSI +3
            cost: 80000
        },
        CHEMICAL_SENSOR: {
            name_en: "Chemical Analysis Sensor",
            name_it: "Sensore di Analisi Chimica",
            type: "technological",
            skill: null,
            effects: {3: 4, 5: 3}, // INT +4, DEF +3
            cost: 700000
        },
    
        // === EAR PROSTHETICS ===
        ELVEN_HEARING: {
            name_en: "Elven Hearing Enhancement",
            name_it: "Potenziamento Uditivo Elfico",
            type: "biological",
            skill: null,
            effects: {6: 4, 3: 2}, // AGI +4, INT +2
            cost: 600000
        },
        SONIC_DAMPENERS: {
            name_en: "Sonic Dampening System",
            name_it: "Sistema di Attenuazione Sonica",
            type: "technological",
            effects: {5: 6, 0: 10}, // DEF +6, MHP +10
            cost: 160000
        },
        ASTRAL_RECEPTORS: {
            name_en: "Astral Sound Receptors",
            name_it: "Recettori del Suono Astrale",
            type: "magical",
            skill: null,
            effects: {4: 5, 1: 12}, // MAT +5, MMP +12
            cost: 170000
        },
    
        // === MOUTH PROSTHETICS ===
        VAMPIRIC_FANGS: {
            name_en: "Vampiric Regeneration Fangs",
            name_it: "Zanne Rigenerative Vampiriche",
            type: "biological",
            effects: {0: 25, 2: 3}, // MHP +25, ATK +3
            skill: null,
            cost: 280000
        },
        SILVER_TONGUE: {
            name_en: "Silver Tongue Implant",
            name_it: "Impianto Lingua d'Argento",
            type: "magical",
            effects: {7: 8, 3: 4}, // PSI +8, INT +4
            skill: null,
            cost: 120000
        },
        VENOM_GLANDS: {
            name_en: "Serpent Venom Glands",
            name_it: "Ghiandole Velenifere Serpentine",
            type: "biological",
            effects: {2: 6, 6: 2}, // ATK +6, AGI +2
            skill: null,
            cost: 80000
        },
    
        // === TEETH PROSTHETICS ===
        ADAMANTINE_TEETH: {
            name_en: "Adamantine Teeth Set",
            name_it: "Dentatura Adamantina",
            type: "technological",
            effects: {2: 5, 5: 4}, // ATK +5, DEF +4
            cost: 90000,
            skill: null

        },
        CRYSTAL_FANGS: {
            name_en: "Mana Crystal Fangs",
            name_it: "Zanne di Cristallo Magico",
            type: "magical",
            effects: {4: 7, 1: 8}, // MAT +7, MMP +8
            cost: 150000,
            skill: null

        },
    
        // === TORSO PROSTHETICS ===
        IRON_RIBCAGE: {
            name_en: "Dwarven Iron Ribcage",
            name_it: "Gabbia Toracica di Ferro Nanesca",
            type: "biological",
            effects: {5: 12, 0: 30}, // DEF +12, MHP +30
            cost: 420000,
            skill: null

        },
        STEAM_BOILER: {
            name_en: "Steam Power Boiler",
            name_it: "Caldaia a Vapore",
            type: "technological",
            effects: {2: 8, 6: 6}, // ATK +8, AGI +6
            cost: 140000,
            skill: null

        },
        ARCANE_CORE: {
            name_en: "Arcane Energy Core",
            name_it: "Nucleo di Energia Arcana",
            type: "magical",
            effects: {4: 10, 1: 25}, // MAT +10, MMP +25
            cost: 350000,
            skill: null

        },
        LIVING_ARMOR: {
            name_en: "Living Symbiotic Armor",
            name_it: "Armatura Simbiotica Vivente",
            type: "biological",
            effects: {5: 15, 0: 40}, // DEF +15, MHP +40
            cost: 550000,
            skill: null

        },
    
        // === HEART PROSTHETICS ===
        PHOENIX_HEART: {
            name_en: "Phoenix Fire Heart",
            name_it: "Cuore di Fuoco di Fenice",
            type: "magical",
            effects: {4: 12, 0: 35}, // MAT +12, MHP +35
            cost: 470000,
            skill: null
        },
        MECHANICAL_HEART: {
            name_en: "Clockwork Heart Engine",
            name_it: "Cuore Meccanico a Orologeria",
            type: "technological",
            effects: {6: 8, 2: 5}, // AGI +8, ATK +5
            cost: 130000,
            skill: null

        },
        DRAGON_HEART: {
            name_en: "Ancient Dragon Heart",
            name_it: "Cuore di Drago Antico",
            type: "biological",
            effects: {0: 50, 5: 8}, // MHP +50, DEF +8
            cost: 580000,
            skill: null

        },
    
        // === LUNG PROSTHETICS ===
        AQUATIC_GILLS: {
            name_en: "Aquatic Breathing Gills",
            name_it: "Branchie Respiratorie Acquatiche",
            type: "biological",
            effects: {6: 6, 0: 15}, // AGI +6, MHP +15
            cost: 210000,
            skill: null

        },
        AIR_FILTRATION: {
            name_en: "Advanced Air Filtration",
            name_it: "Sistema di Filtrazione Avanzato",
            type: "technological",
            effects: {5: 8, 6: 3}, // DEF +8, AGI +3
            cost: 110000,
            skill: null
        },
        ELEMENTAL_LUNGS: {
            name_en: "Elemental Essence Lungs",
            name_it: "Polmoni dell'Essenza Elementale",
            type: "magical",
            effects: {4: 8, 1: 20}, // MAT +8, MMP +20
            cost: 280000,
            skill: null
        },
    
        // === LIVER PROSTHETICS ===
        ALCHEMICAL_PROCESSOR: {
            name_en: "Alchemical Processing Unit",
            name_it: "Unità di Elaborazione Alchemica",
            type: "magical",
            effects: {3: 6, 5: 5}, // INT +6, DEF +5
            cost: 110000,
            skill: null
        },
        TOXIN_FILTER: {
            name_en: "Bio-Toxin Filter System",
            name_it: "Sistema Filtrante Bio-Tossine",
            type: "biological",
            effects: {5: 10, 0: 20}, // DEF +10, MHP +20
            cost: 300000,
            skill: null
        },
    
        // === STOMACH PROSTHETICS ===
        DRACONIC_FURNACE: {
            name_en: "Draconic Flame Furnace",
            name_it: "Fornace Draconiche delle Fiamme",
            type: "magical",
            effects: {4: 9, 2: 4}, // MAT +9, ATK +4
            cost: 130000,
            skill: null

        },
        NUTRIENT_SYNTHESIZER: {
            name_en: "Nutrient Synthesis Chamber",
            name_it: "Camera di Sintesi Nutritiva",
            type: "technological",
            effects: {0: 30, 6: 4}, // MHP +30, AGI +4
            cost: 340000,
            skill: null

        },
    
        // === ARM PROSTHETICS ===
        MECHANICAL_ARM: {
            name_en: "Steam-Powered Mechanical Arm",
            name_it: "Braccio Meccanico a Vapore",
            type: "technological",
            effects: {2: 12, 5: 3}, // ATK +12, DEF +3
            cost: 150000,
            skill: null

        },
        ASTRAL_LIMB: {
            name_en: "Astral Projection Limb",
            name_it: "Arto di Proiezione Astrale",
            type: "magical",
            effects: {4: 10, 6: 5}, // MAT +10, AGI +5
            cost: 150000,
            skill: null

        },
        GOLEM_ARM: {
            name_en: "Stone Golem Arm",
            name_it: "Braccio di Golem di Pietra",
            type: "biological",
            effects: {2: 8, 5: 8}, // ATK +8, DEF +8
            cost: 160000,
            skill: null

        },
        LIGHTNING_CONDUCTOR: {
            name_en: "Lightning Conductor Arm",
            name_it: "Braccio Conduttore di Fulmini",
            type: "magical",
            effects: {4: 12, 2: 3}, // MAT +12, ATK +3
            cost: 150000,
            skill: null

        },
        TITAN_LIMB: {
            name_en: "Titanium Reinforced Limb",
            name_it: "Arto Rinforzato al Titanio",
            type: "technological",
            effects: {2: 15, 5: 5}, // ATK +15, DEF +5
            cost: 200000,
            skill: null

        },
    
        // === HAND PROSTHETICS ===
        BLADE_FINGERS: {
            name_en: "Retractable Blade Fingers",
            name_it: "Dita Lama Retrattili",
            type: "technological",
            effects: {2: 10, 6: 4}, // ATK +10, AGI +4
            cost: 140000,
            skill: null

        },
        MANA_CRYSTALS: {
            name_en: "Embedded Mana Crystals",
            name_it: "Cristalli di Mana Incorporati",
            type: "magical",
            effects: {4: 8, 1: 15}, // MAT +8, MMP +15
            cost: 230000,
            skill: null

        },
        GRAPPLING_HOOKS: {
            name_en: "Mechanical Grappling Hooks",
            name_it: "Rampini Meccanici",
            type: "technological",
            effects: {6: 8, 2: 4}, // AGI +8, ATK +4
            cost: 120000,
            skill: null

        },
        LIVING_VINES: {
            name_en: "Living Vine Extensions",
            name_it: "Estensioni di Viti Viventi",
            type: "biological",
            effects: {2: 6, 6: 6}, // ATK +6, AGI +6
            cost: 120000,
            skill: null

        },
        SPIRIT_CHANNELERS: {
            name_en: "Spirit Channeling Palms",
            name_it: "Palmi Incanalatori di Spiriti",
            type: "magical",
            effects: {4: 12, 3: 3}, // MAT +12, INT +3
            cost: 150000,
            skill: null

        },
    
        // === FINGER PROSTHETICS ===
        LOCK_PICKS: {
            name_en: "Integrated Lock Picks",
            name_it: "Grimaldelli Integrati",
            type: "technological",
            effects: {6: 6, 3: 2}, // AGI +6, INT +2
            cost: 800000,
            skill: null

        },
        POISON_NEEDLES: {
            name_en: "Poison Needle Tips",
            name_it: "Punte ad Ago Velenose",
            type: "biological",
            effects: {2: 8, 6: 3}, // ATK +8, AGI +3
            cost: 110000,
            skill: null

        },
        RUNIC_INSCRIPTIONS: {
            name_en: "Runic Power Inscriptions",
            name_it: "Iscrizioni Runiche di Potere",
            type: "magical",
            effects: {4: 6, 1: 10}, // MAT +6, MMP +10
            cost: 160000,
            skill: null

        },
        AQUATIC_FINS: {
            name_en: "Installable Aquatic Fins",
            name_it: "Pinne Acquatiche Installabili",
            type: "biological",
            effects: {6: 8, 0: 5}, // AGI +8, MHP +5
            cost: 130000,
            skill: null

        },
        MICRO_TOOLS: {
            name_en: "Micro-Tool Array",
            name_it: "Array di Micro-Strumenti",
            type: "technological",
            effects: {3: 5, 6: 3}, // INT +5, AGI +3
            cost: 80000,
            skill: null

        },
    
        // === LEG PROSTHETICS ===
        SPRING_COILS: {
            name_en: "Spring-Loaded Coil Legs",
            name_it: "Gambe a Molla Caricata",
            type: "technological",
            effects: {6: 12, 2: 3}, // AGI +12, ATK +3
            cost: 150000,
            skill: null

        },
        TREE_TRUNK: {
            name_en: "Living Tree Trunk Leg",
            name_it: "Gamba Tronco d'Albero Vivente",
            type: "biological",
            effects: {5: 10, 0: 25}, // DEF +10, MHP +25
            cost: 350000,
            skill: null

        },
        SHADOW_WALKER: {
            name_en: "Shadow Walker Limb",
            name_it: "Arto del Camminatore d'Ombra",
            type: "magical",
            effects: {6: 10, 4: 5}, // AGI +10, MAT +5
            cost: 150000,
            skill: null

        },
        HYDRAULIC_PISTONS: {
            name_en: "Hydraulic Piston System",
            name_it: "Sistema a Pistoni Idraulici",
            type: "technological",
            effects: {2: 8, 6: 8}, // ATK +8, AGI +8
            cost: 160000,
            skill: null

        },
        ELEMENTAL_STRIDE: {
            name_en: "Elemental Stride Enhancer",
            name_it: "Potenziatore del Passo Elementale",
            type: "magical",
            effects: {6: 8, 4: 8}, // AGI +8, MAT +8
            cost: 160000,
            skill: null

        },
    
        // === FOOT PROSTHETICS ===
        MAGNETIC_SOLES: {
            name_en: "Magnetic Grip Soles",
            name_it: "Suole a Presa Magnetica",
            type: "technological",
            effects: {6: 6, 5: 4}, // AGI +6, DEF +4
            cost: 100000,
            skill: null

        },
        BEAST_CLAWS: {
            name_en: "Retractable Beast Claws",
            name_it: "Artigli Bestiali Retrattili",
            type: "biological",
            effects: {2: 8, 6: 4}, // ATK +8, AGI +4
            cost: 120000,
            skill: null

        },
        HOVER_PADS: {
            name_en: "Anti-Gravity Hover Pads",
            name_it: "Cuscinetti Antigravitazionali",
            type: "magical",
            effects: {6: 10, 4: 3}, // AGI +10, MAT +3
            cost: 130000,
            skill: null

        },
        SHOCK_ABSORBERS: {
            name_en: "Kinetic Shock Absorbers",
            name_it: "Ammortizzatori Cinetici",
            type: "technological",
            effects: {5: 8, 6: 5}, // DEF +8, AGI +5
            cost: 130000,
            skill: null

        },
    
        // === TOE PROSTHETICS ===
        CLIMBING_SPIKES: {
            name_en: "Climbing Spike Array",
            name_it: "Array di Ramponi",
            type: "technological",
            effects: {6: 4, 2: 2}, // AGI +4, ATK +2
            cost: 60000,
            skill: null

        },
        BALANCE_GYROS: {
            name_en: "Micro-Balance Gyroscopes",
            name_it: "Giroscopi Micro-Equilibrio",
            type: "technological",
            effects: {6: 5, 5: 2}, // AGI +5, DEF +2
            cost: 70000,
            skill: null

        },
        EARTH_SENSE: {
            name_en: "Earth Tremor Sensors",
            name_it: "Sensori Sismici Terrestri",
            type: "magical",
            effects: {3: 4, 6: 3}, // INT +4, AGI +3
            cost: 70000,
            skill: null

        },
    
        // === SPLEEN PROSTHETICS ===
        BLOOD_PURIFIER: {
            name_en: "Advanced Blood Purifier",
            name_it: "Purificatore Sanguigno Avanzato",
            type: "technological",
            effects: {5: 6, 0: 15}, // DEF +6, MHP +15
            cost: 210000,
            skill: null

        },
        ESSENCE_FILTER: {
            name_en: "Magical Essence Filter",
            name_it: "Filtro dell'Essenza Magica",
            type: "magical",
            effects: {1: 18, 4: 3}, // MMP +18, MAT +3
            cost: 210000,
            skill: null

        },
    
        // === INTESTINE PROSTHETICS ===
        NUTRIENT_EXTRACTOR: {
            name_en: "Nutrient Extraction Matrix",
            name_it: "Matrice di Estrazione Nutritiva",
            type: "biological",
            effects: {0: 35, 5: 6}, // MHP +35, DEF +6
            cost: 410000,
            skill: null
        },
        MANA_CONVERTER: {
            name_en: "Mana Conversion Coils",
            name_it: "Bobine di Conversione Magica",
            type: "magical",
            effects: {1: 25, 3: 5}, // MMP +25, INT +5
            cost: 300000,
            skill: null
        }
    };
    
    // Define which body parts can have which prosthetics
    var ProstheticCompatibility = {
        // Head parts
        HEAD: ["CRYSTAL_CORTEX", "NEURAL_IMPLANT", "ANCIENT_WISDOM_ORB", "SKULL_REINFORCEMENT"],
        BRAIN: ["CRYSTAL_CORTEX", "NEURAL_IMPLANT", "ANCIENT_WISDOM_ORB"],
        
        // Eye parts
        LEFT_EYE: ["HAWKS_EYE", "CYBER_OPTICS", "VOID_SIGHT", "DRAGONS_GAZE", "TELESCOPIC_EYE"],
        RIGHT_EYE: ["HAWKS_EYE", "CYBER_OPTICS", "VOID_SIGHT", "DRAGONS_GAZE", "TELESCOPIC_EYE"],
        
        // Facial parts
        NOSE: ["SCENT_TRACKER", "CHEMICAL_SENSOR"],
        LEFT_EAR: ["ELVEN_HEARING", "SONIC_DAMPENERS", "ASTRAL_RECEPTORS"],
        RIGHT_EAR: ["ELVEN_HEARING", "SONIC_DAMPENERS", "ASTRAL_RECEPTORS"],
        MOUTH: ["VAMPIRIC_FANGS", "SILVER_TONGUE", "VENOM_GLANDS"],
        TEETH: ["ADAMANTINE_TEETH", "CRYSTAL_FANGS"],
        
        // Torso parts
        TORSO: ["IRON_RIBCAGE", "STEAM_BOILER", "ARCANE_CORE", "LIVING_ARMOR"],
        HEART: ["PHOENIX_HEART", "MECHANICAL_HEART", "DRAGON_HEART"],
        LEFT_LUNG: ["AQUATIC_GILLS", "AIR_FILTRATION", "ELEMENTAL_LUNGS"],
        RIGHT_LUNG: ["AQUATIC_GILLS", "AIR_FILTRATION", "ELEMENTAL_LUNGS"],
        LIVER: ["ALCHEMICAL_PROCESSOR", "TOXIN_FILTER"],
        STOMACH: ["DRACONIC_FURNACE", "NUTRIENT_SYNTHESIZER"],
        SPLEEN: ["BLOOD_PURIFIER", "ESSENCE_FILTER"],
        INTESTINES: ["NUTRIENT_EXTRACTOR", "MANA_CONVERTER"],
        
        // Arm parts
        LEFT_ARM: ["MECHANICAL_ARM", "ASTRAL_LIMB", "GOLEM_ARM", "LIGHTNING_CONDUCTOR", "TITAN_LIMB"],
        RIGHT_ARM: ["MECHANICAL_ARM", "ASTRAL_LIMB", "GOLEM_ARM", "LIGHTNING_CONDUCTOR", "TITAN_LIMB"],
        LEFT_HAND: ["BLADE_FINGERS", "MANA_CRYSTALS", "GRAPPLING_HOOKS", "LIVING_VINES", "SPIRIT_CHANNELERS"],
        RIGHT_HAND: ["BLADE_FINGERS", "MANA_CRYSTALS", "GRAPPLING_HOOKS", "LIVING_VINES", "SPIRIT_CHANNELERS"],
        LEFT_FINGERS: ["LOCK_PICKS", "POISON_NEEDLES", "RUNIC_INSCRIPTIONS", "AQUATIC_FINS", "MICRO_TOOLS"],
        RIGHT_FINGERS: ["LOCK_PICKS", "POISON_NEEDLES", "RUNIC_INSCRIPTIONS", "AQUATIC_FINS", "MICRO_TOOLS"],
        
        // Leg parts
        LEFT_LEG: ["SPRING_COILS", "TREE_TRUNK", "SHADOW_WALKER", "HYDRAULIC_PISTONS", "ELEMENTAL_STRIDE"],
        RIGHT_LEG: ["SPRING_COILS", "TREE_TRUNK", "SHADOW_WALKER", "HYDRAULIC_PISTONS", "ELEMENTAL_STRIDE"],
        LEFT_FOOT: ["MAGNETIC_SOLES", "BEAST_CLAWS", "HOVER_PADS", "SHOCK_ABSORBERS"],
        RIGHT_FOOT: ["MAGNETIC_SOLES", "BEAST_CLAWS", "HOVER_PADS", "SHOCK_ABSORBERS"],
        LEFT_TOES: ["CLIMBING_SPIKES", "BALANCE_GYROS", "EARTH_SENSE"],
        RIGHT_TOES: ["CLIMBING_SPIKES", "BALANCE_GYROS", "EARTH_SENSE"]
    };
    
  
    // expose under a single namespace to avoid polluting global too badly
    window.ProstheticsData = {
      EnemyArchetypes,
      BodyParts,
      ProstheticTypes,
      ProstheticCompatibility,
    };
  })();
  