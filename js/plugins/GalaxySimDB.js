(() => {
  // define your data

  const STAR_TYPES = {
    O: {
      color: 0x9bb0ff,
      temp: [30000, 60000],
      mass: [16, 90],
      radius: [6.6, 10],
      freq: 0.00003,
    },
    B: {
      color: 0xaabfff,
      temp: [10000, 30000],
      mass: [2.1, 16],
      radius: [1.8, 6.6],
      freq: 0.0013,
    },
    A: {
      color: 0xcad7ff,
      temp: [7500, 10000],
      mass: [1.4, 2.1],
      radius: [1.4, 1.8],
      freq: 0.006,
    },
    F: {
      color: 0xf8f7ff,
      temp: [6000, 7500],
      mass: [1.04, 1.4],
      radius: [1.15, 1.4],
      freq: 0.03,
    },
    G: {
      color: 0xfff4ea,
      temp: [5200, 6000],
      mass: [0.8, 1.04],
      radius: [0.96, 1.15],
      freq: 0.076,
    },
    K: {
      color: 0xffd2a1,
      temp: [3700, 5200],
      mass: [0.45, 0.8],
      radius: [0.7, 0.96],
      freq: 0.121,
    },
    M: {
      color: 0xffcc6f,
      temp: [2400, 3700],
      mass: [0.08, 0.45],
      radius: [0.2, 0.7],
      freq: 0.765,
    },
  };

  const PLANET_TYPES = {
    // Tiny Terrestrials
    sub_mercurian: {
      minMass: 0.01,
      maxMass: 0.1,
      color: 0xb8860b,
      description: "Bare‐bones rocky world, thinner crust, minimal atmosphere.",
    },
    mercurian: {
      minMass: 0.1,
      maxMass: 0.2,
      color: 0xa0522d,
      description: "Mercury‐like, airless, cratered, iron‐rich.",
    },
    sub_earth: {
      minMass: 0.2,
      maxMass: 0.5,
      color: 0x8b7355,
      description: "Smaller than Earth but still geologically active.",
    },
    earth_like: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x2e8b57,
      description: "Rocky with plate tectonics, liquid water, breathable air.",
    },
    super_earth: {
      minMass: 2.0,
      maxMass: 10.0,
      color: 0x556b2f,
      description: "Large rocky world; higher gravity, thicker atmosphere.",
    },

    // Water / Ice Worlds
    mini_neptune: {
      minMass: 2.0,
      maxMass: 4.0,
      color: 0x87cefa,
      description: "Small ice‐rich envelope over a rocky core.",
    },
    ice: {
      minMass: 0.3,
      maxMass: 4.0,
      color: 0xe0ffff,
      description: "Frozen surface; possible subsurface ocean.",
    },
    ocean: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x006994,
      description: "Global liquid ocean, minimal landmasses.",
    },
    lava_ocean: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0xdd4500,
      description: "Partially molten surface, steam atmosphere.",
    },
    desert: {
      minMass: 0.3,
      maxMass: 1.5,
      color: 0xedc9af,
      description: "Dry world, sparse vegetation or none at all.",
    },
    rainforest: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x228b22,
      description: "Thick jungles, heavy precipitation, high biomass.",
    },
    tundra: {
      minMass: 0.3,
      maxMass: 1.5,
      color: 0xafeeee,
      description: "Cold, limited plant life, permafrost‐dominated.",
    },
    acid_ocean: {
      minMass: 0.5,
      maxMass: 3.0,
      color: 0x7fff00,
      description: "Sulfuric or hydrochloric acid seas, corrosive skies.",
    },

    // Giant Planets
    gas_giant: {
      minMass: 10.0,
      maxMass: 500.0,
      color: 0xffb366,
      description: "Massive hydrogen‐helium envelope, no solid surface.",
    },
    hot_jupiter: {
      minMass: 50.0,
      maxMass: 500.0,
      color: 0xff8c00,
      description:
        "Orbits extremely close to its star, blistering temperatures.",
    },
    warm_jupiter: {
      minMass: 10.0,
      maxMass: 100.0,
      color: 0xffa500,
      description: "Closer in than Jupiter but farther than a hot‐Jupiter.",
    },
    cold_jupiter: {
      minMass: 50.0,
      maxMass: 300.0,
      color: 0xd2691e,
      description: "Far from its star, deep cold atmosphere.",
    },
    ice_giant: {
      minMass: 5.0,
      maxMass: 50.0,
      color: 0x4fd0e0,
      description: "Rich in volatiles like water, ammonia; thick icy mantle.",
    },
    ringed_gas_giant: {
      minMass: 50.0,
      maxMass: 800.0,
      color: 0xd2b48c,
      description: "Prominent rings, dozens of moons.",
    },
    puffy: {
      minMass: 0.1,
      maxMass: 0.5,
      color: 0xffdab9,
      description: "Extremely low density, bloated by stellar heating.",
    },

    // Exotic and Strange Worlds
    chthonian: {
      minMass: 0.5,
      maxMass: 2.0,
      color: 0x660000,
      description: "Stripped gas giant core, volcanic, metal‐rich.",
    },
    mega_iron: {
      minMass: 1.0,
      maxMass: 10.0,
      color: 0x444444,
      description: "Almost pure iron/nickel, high density, magnetic.",
    },
    carbon: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0x2f4f4f,
      description: "Graphite and hydrocarbons dominate; tar‐like seas.",
    },
    diamond: {
      minMass: 2.0,
      maxMass: 20.0,
      color: 0xb9f2ff,
      description: "High pressure turns carbon shell into diamond layer.",
    },
    magma_planet: {
      minMass: 1.0,
      maxMass: 8.0,
      color: 0xff4500,
      description: "Surface is a global magma bath, constant eruptions.",
    },
    plasma: {
      minMass: 0.2,
      maxMass: 50.0,
      color: 0xff1493,
      description: "Ionized atmosphere, glows under stellar wind.",
    },
    magnetar: {
      minMass: 1.0,
      maxMass: 2.0,
      color: 0x9400d3,
      description: "Ultra‐magnetic field, exotic radiation environment.",
    },
    quark_planet: {
      minMass: 0.1,
      maxMass: 2.0,
      color: 0x8a2be2,
      description: "Hypothetical strange matter core, super‐dense.",
    },
    rogue: {
      minMass: 0.5,
      maxMass: 1000.0,
      color: 0x333333,
      description: "Free‐floating, cold, no host star.",
    },
    habitable: {
      minMass: 0.5,
      maxMass: 5.0,
      color: 0x32cd32,
      description: "Within habitable zone, stable climate, liquid water.",
    },

    // Dwarfs & Substellar
    dwarf: {
      minMass: 0.002,
      maxMass: 0.1,
      color: 0x808080,
      description: "Small icy/rocky body, like Pluto or Ceres.",
    },
    centaur: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x6699cc,
      description: "Icy‐rock hybrid between Jupiter and Neptune orbits.",
    },
    planetesimal: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xbbbbbb,
      description: "Building block of planets, tiny rock/ice clump.",
    },
    c_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x555555,
      description: "Carbonaceous, dark, primitive composition.",
    },
    s_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xaaaaaa,
      description: "Silicate and nickel‐iron, brighter surface.",
    },
    m_type_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x777777,
      description: "Metallic, mostly nickel‐iron core fragments.",
    },
    trojan_asteroid: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0x888888,
      description: "Co‐orbiting in Lagrange points of a larger planet.",
    },

    // Comets
    comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xffffff,
      description: "Dirty snowball: ice, dust, develops tail near star.",
    },
    short_period_comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xefefef,
      description: "Orbits under 200 years, frequent visitor.",
    },
    long_period_comet: {
      minMass: 0.001,
      maxMass: 0.001,
      color: 0xdfdfdf,
      description: "Orbits over 200 years, from distant Oort cloud.",
    },
  };
  const SYSTEMS = {
    // Our Solar System
    sol: {
      name: "Sol",
      type: "G",
      mass: 1.0,
      radius: 1.0,
      temperature: 5778,
      position: { x: 0, y: 0, z: 0 },
      planets: [
        { name: "Mercury", type: "rocky", orbitRadius: 0.39, mass: 0.055 },
        { name: "Venus", type: "rocky", orbitRadius: 0.72, mass: 0.815 },
        { name: "Earth", type: "ocean", orbitRadius: 1.0, mass: 1.0 },
        { name: "Mars", type: "desert", orbitRadius: 1.52, mass: 0.107 },
        { name: "Jupiter", type: "gas_giant", orbitRadius: 5.2, mass: 317.8 },
        { name: "Saturn", type: "gas_giant", orbitRadius: 9.54, mass: 95.2 },
        { name: "Uranus", type: "ice_giant", orbitRadius: 19.2, mass: 14.5 },
        { name: "Neptune", type: "ice_giant", orbitRadius: 30.1, mass: 17.1 },
      ],
    },
    
    // Nearest stars (within 10 ly - keep original planets)
    "proxima centauri": {
      name: "Proxima Centauri",
      type: "M",
      mass: 0.122,
      radius: 0.154,
      temperature: 3042,
      position: { x: -1.64, y: -1.37, z: -3.77 },
      planets: [
        { name: "Proxima b", type: "rocky", orbitRadius: 0.05, mass: 1.17 },
        { name: "Proxima c", type: "ice_giant", orbitRadius: 1.49, mass: 7.0 },
      ],
    },
    
    "alpha centauri": {
      name: "Alpha Centauri",
      type: "G",
      mass: 3.8735,
      radius: 2.033,
      temperature: 5790,
      position: { x: -1.68, y: -1.36, z: -3.84 },
      binary: true,
      planets: [],
    },
    
    "barnard's star": {
      name: "Barnard's Star",
      type: "M",
      mass: 0.144,
      radius: 0.196,
      temperature: 3134,
      position: { x: -0.47, y: 5.94, z: 0.49 },
      planets: [
        { name: "Barnard's Star b", type: "ice", orbitRadius: 0.4, mass: 3.2 },
      ],
    },
    
    "wolf 359": {
      name: "Wolf 359",
      type: "M",
      mass: 0.09,
      radius: 0.16,
      temperature: 2800,
      position: { x: 2.39, y: -3.89, z: 6.57 },
      planets: [],
    },
    
    "lalande 21185": {
      name: "Lalande 21185",
      type: "M",
      mass: 0.46,
      radius: 0.393,
      temperature: 3600,
      position: { x: -6.51, y: -1.66, z: 4.85 },
      planets: [],
    },
    
    sirius: {
      name: "Sirius",
      type: "A",
      mass: 2.063,
      radius: 1.711,
      temperature: 9940,
      position: { x: -1.64, y: -5.32, z: -8.06 },
      binary: true,
      planets: [],
    },
    
    "wise 0855−0714": {
      name: "WISE 0855−0714",
      type: "Y",
      mass: 0.03,
      radius: 0.1,
      temperature: 250,
      position: { x: 2.33, y: -3.27, z: -5.95 },
      planets: [],
    },
    
    // Stars beyond 10 ly - add procedural planets
    "luyten's star": {
      name: "Luyten's Star",
      type: "M",
      mass: 0.26,
      radius: 0.35,
      temperature: 3200,
      position: { x: 9.45, y: -1.34, z: 7.93 },
      planets: [
        { name: "GJ 273 b", type: "rocky", orbitRadius: 0.09, mass: 2.89 },
        { name: "GJ 273 c", type: "ice", orbitRadius: 0.06, mass: 1.18 },
        { name: "GJ 273 d", type: "sub_earth", orbitRadius: 0.38, mass: 0.35, atmosphere: true },
        { name: "GJ 273 e", type: "ice_giant", orbitRadius: 2.1, mass: 12.4, atmosphere: true },
      ],
    },
    
    "ross 154": {
      name: "Ross 154",
      type: "M",
      mass: 0.17,
      radius: 0.24,
      temperature: 3340,
      position: { x: -4.69, y: -8.48, z: -1.84 },
      planets: [
        { name: "Ross 154 b", type: "mercurian", orbitRadius: 0.05, mass: 0.15, atmosphere: false },
        { name: "Ross 154 c", type: "desert", orbitRadius: 0.28, mass: 0.78, atmosphere: true },
        { name: "Ross 154 d", type: "ice", orbitRadius: 1.6, mass: 2.3, atmosphere: true },
      ],
    },
    
    "ross 248": {
      name: "Ross 248",
      type: "M",
      mass: 0.16,
      radius: 0.19,
      temperature: 3200,
      position: { x: 7.33, y: 0.65, z: 7.26 },
      planets: [
        { name: "Ross 248 b", type: "lava_ocean", orbitRadius: 0.04, mass: 1.2, atmosphere: true },
        { name: "Ross 248 c", type: "sub_earth", orbitRadius: 0.22, mass: 0.41, atmosphere: false },
      ],
    },
    
    "epsilon eridani": {
      name: "Epsilon Eridani",
      type: "K",
      mass: 0.82,
      radius: 0.74,
      temperature: 5076,
      position: { x: 1.93, y: -8.78, z: -5.55 },
      planets: [
        { name: "Epsilon Eridani b", type: "gas_giant", orbitRadius: 3.39, mass: 247.8 },
        { name: "Epsilon Eridani c", type: "ice_giant", orbitRadius: 5.8, mass: 28.3, atmosphere: true },
        { name: "Epsilon Eridani d", type: "dwarf", orbitRadius: 8.9, mass: 0.08, atmosphere: false },
      ],
    },
    
    procyon: {
      name: "Procyon",
      type: "F",
      mass: 1.499,
      radius: 2.048,
      temperature: 6530,
      position: { x: -4.77, y: -2.87, z: 10.3 },
      binary: true,
      planets: [
        { name: "Procyon b", type: "hot_jupiter", orbitRadius: 0.15, mass: 187.5, atmosphere: true },
        { name: "Procyon c", type: "super_earth", orbitRadius: 1.8, mass: 5.6, atmosphere: true },
        { name: "Procyon d", type: "ice_giant", orbitRadius: 4.2, mass: 22.8, atmosphere: true },
      ],
    },
    
    "61 cygni": {
      name: "61 Cygni",
      type: "K",
      mass: 0.7,
      radius: 0.665,
      temperature: 4400,
      position: { x: 6.51, y: 6.10, z: 7.13 },
      binary: true,
      planets: [
        { name: "61 Cygni Ab", type: "rocky", orbitRadius: 0.42, mass: 1.3, atmosphere: true },
        { name: "61 Cygni Ac", type: "ocean", orbitRadius: 0.95, mass: 1.8, atmosphere: true },
        { name: "61 Cygni Ad", type: "gas_giant", orbitRadius: 3.7, mass: 89.4, atmosphere: true },
      ],
    },
    
    capella: {
      name: "Capella",
      type: "G",
      mass: 2.7,
      radius: 12.2,
      temperature: 4940,
      position: { x: -4.53, y: 39.45, z: 13.95 },
      binary: true,
      planets: [
        { name: "Capella b", type: "chthonian", orbitRadius: 0.08, mass: 1.4, atmosphere: false },
        { name: "Capella c", type: "warm_jupiter", orbitRadius: 2.3, mass: 76.5, atmosphere: true },
        { name: "Capella d", type: "ice_giant", orbitRadius: 7.8, mass: 34.2, atmosphere: true },
      ],
    },
    
    vega: {
      name: "Vega",
      type: "A",
      mass: 2.14,
      radius: 2.36,
      temperature: 9602,
      position: { x: 7.68, y: 14.62, z: 19.17 },
      planets: [
        { name: "Vega b", type: "plasma", orbitRadius: 0.12, mass: 3.4, atmosphere: true },
        { name: "Vega c", type: "mega_iron", orbitRadius: 0.68, mass: 6.7, atmosphere: false },
        { name: "Vega d", type: "gas_giant", orbitRadius: 4.5, mass: 234.5, atmosphere: true },
        { name: "Vega e", type: "ice_giant", orbitRadius: 9.2, mass: 41.3, atmosphere: true },
      ],
    },
    
    altair: {
      name: "Altair",
      type: "A",
      mass: 1.79,
      radius: 1.79,
      temperature: 7550,
      position: { x: 7.16, y: 14.13, z: 2.77 },
      planets: [
        { name: "Altair b", type: "lava_ocean", orbitRadius: 0.18, mass: 2.3, atmosphere: true },
        { name: "Altair c", type: "desert", orbitRadius: 0.82, mass: 1.1, atmosphere: true },
        { name: "Altair d", type: "mini_neptune", orbitRadius: 2.4, mass: 3.8, atmosphere: true },
      ],
    },
    
    arcturus: {
      name: "Arcturus",
      type: "K",
      mass: 1.08,
      radius: 25.4,
      temperature: 4286,
      position: { x: 14.27, y: 19.18, z: 28.71 },
      planets: [
        { name: "Arcturus b", type: "hot_jupiter", orbitRadius: 0.25, mass: 312.4, atmosphere: true },
        { name: "Arcturus c", type: "carbon", orbitRadius: 1.8, mass: 3.2, atmosphere: true },
        { name: "Arcturus d", type: "cold_jupiter", orbitRadius: 12.5, mass: 178.9, atmosphere: true },
      ],
    },
    
    betelgeuse: {
      name: "Betelgeuse",
      type: "M",
      mass: 11.6,
      radius: 887,
      temperature: 3500,
      position: { x: 199.7, y: -148.7, z: 587.1 },
      planets: [
        { name: "Betelgeuse b", type: "magma_planet", orbitRadius: 450, mass: 5.6, atmosphere: true },
        { name: "Betelgeuse c", type: "rogue", orbitRadius: 890, mass: 234.5, atmosphere: false },
      ],
    },
    
    rigel: {
      name: "Rigel",
      type: "B",
      mass: 21.0,
      radius: 78.9,
      temperature: 12100,
      position: { x: 237.1, y: -425.6, z: -716.3 },
      planets: [
        { name: "Rigel b", type: "plasma", orbitRadius: 85, mass: 8.9, atmosphere: true },
        { name: "Rigel c", type: "diamond", orbitRadius: 180, mass: 15.6, atmosphere: true },
        { name: "Rigel d", type: "cold_jupiter", orbitRadius: 420, mass: 267.3, atmosphere: true },
      ],
    },
    
    polaris: {
      name: "Polaris",
      type: "F",
      mass: 5.4,
      radius: 37.5,
      temperature: 6015,
      position: { x: -32.6, y: 431.3, z: 5.75 },
      binary: true,
      planets: [
        { name: "Polaris b", type: "chthonian", orbitRadius: 42, mass: 1.8, atmosphere: false },
        { name: "Polaris c", type: "warm_jupiter", orbitRadius: 78, mass: 89.4, atmosphere: true },
        { name: "Polaris d", type: "ringed_gas_giant", orbitRadius: 156, mass: 456.7, atmosphere: true },
      ],
    },
    
    spica: {
      name: "Spica",
      type: "B",
      mass: 10.25,
      radius: 7.47,
      temperature: 25400,
      position: { x: 93.71, y: -118.2, z: -197.9 },
      binary: true,
      planets: [
        { name: "Spica b", type: "plasma", orbitRadius: 12, mass: 4.5, atmosphere: true },
        { name: "Spica c", type: "magnetar", orbitRadius: 28, mass: 1.7, atmosphere: true },
      ],
    },
    
    fomalhaut: {
      name: "Fomalhaut",
      type: "A",
      mass: 1.92,
      radius: 1.84,
      temperature: 8590,
      position: { x: 17.23, y: -7.76, z: -16.34 },
      planets: [
        { name: "Fomalhaut b", type: "gas_giant", orbitRadius: 115, mass: 234.5 },
        { name: "Fomalhaut c", type: "ice", orbitRadius: 0.45, mass: 2.1, atmosphere: true },
        { name: "Fomalhaut d", type: "super_earth", orbitRadius: 1.2, mass: 7.8, atmosphere: true },
        { name: "Fomalhaut e", type: "mini_neptune", orbitRadius: 3.4, mass: 3.6, atmosphere: true },
      ],
    },
    
    "trappist-1": {
      name: "TRAPPIST-1",
      type: "M",
      mass: 0.089,
      radius: 0.121,
      temperature: 2550,
      position: { x: 12.4, y: -27.1, z: -24.5 },
      planets: [
        { name: "TRAPPIST-1b", type: "rocky", orbitRadius: 0.011, mass: 1.02 },
        { name: "TRAPPIST-1c", type: "rocky", orbitRadius: 0.015, mass: 1.16 },
        { name: "TRAPPIST-1d", type: "rocky", orbitRadius: 0.022, mass: 0.3 },
        { name: "TRAPPIST-1e", type: "ocean", orbitRadius: 0.029, mass: 0.77 },
        { name: "TRAPPIST-1f", type: "rocky", orbitRadius: 0.038, mass: 0.93 },
        { name: "TRAPPIST-1g", type: "rocky", orbitRadius: 0.047, mass: 1.15 },
        { name: "TRAPPIST-1h", type: "ice", orbitRadius: 0.062, mass: 0.33 },
      ],
    },
    
    "kepler-186": {
      name: "Kepler-186",
      type: "M",
      mass: 0.475,
      radius: 0.47,
      temperature: 3788,
      position: { x: 178.4, y: 553.2, z: 29.7 },
      planets: [
        { name: "Kepler-186b", type: "rocky", orbitRadius: 0.03, mass: 1.58 },
        { name: "Kepler-186c", type: "rocky", orbitRadius: 0.05, mass: 2.3 },
        { name: "Kepler-186d", type: "rocky", orbitRadius: 0.1, mass: 1.12 },
        { name: "Kepler-186e", type: "rocky", orbitRadius: 0.17, mass: 1.35 },
        { name: "Kepler-186f", type: "ocean", orbitRadius: 0.36, mass: 1.11 },
      ],
    },
    
    canopus: {
      name: "Canopus",
      type: "F",
      mass: 8.0,
      radius: 71,
      temperature: 7350,
      position: { x: 73.66, y: -190.3, z: -234.3 },
      planets: [
        { name: "Canopus b", type: "hot_jupiter", orbitRadius: 78, mass: 423.5, atmosphere: true },
        { name: "Canopus c", type: "ringed_gas_giant", orbitRadius: 145, mass: 567.8, atmosphere: true },
        { name: "Canopus d", type: "ice_giant", orbitRadius: 234, mass: 45.6, atmosphere: true },
      ],
    },
    
    aldebaran: {
      name: "Aldebaran",
      type: "K",
      mass: 1.16,
      radius: 44.2,
      temperature: 3910,
      position: { x: 18.93, y: -21.09, z: -58.86 },
      planets: [
        { name: "Aldebaran b", type: "gas_giant", orbitRadius: 1.34, mass: 183.6 },
        { name: "Aldebaran c", type: "desert", orbitRadius: 48, mass: 1.2, atmosphere: true },
        { name: "Aldebaran d", type: "cold_jupiter", orbitRadius: 86, mass: 234.5, atmosphere: true },
      ],
    },
    
    antares: {
      name: "Antares",
      type: "M",
      mass: 12.4,
      radius: 680,
      temperature: 3500,
      position: { x: 424.4, y: -110.9, z: -326.4 },
      binary: true,
      planets: [
        { name: "Antares b", type: "magma_planet", orbitRadius: 345, mass: 6.7, atmosphere: true },
        { name: "Antares c", type: "rogue", orbitRadius: 780, mass: 456.7, atmosphere: false },
      ],
    },
    
    deneb: {
      name: "Deneb",
      type: "A",
      mass: 19,
      radius: 203,
      temperature: 8525,
      position: { x: 989.5, y: 1833.2, z: 1555.1 },
      planets: [
        { name: "Deneb b", type: "plasma", orbitRadius: 210, mass: 12.3, atmosphere: true },
        { name: "Deneb c", type: "diamond", orbitRadius: 380, mass: 18.9, atmosphere: true },
        { name: "Deneb d", type: "cold_jupiter", orbitRadius: 680, mass: 378.9, atmosphere: true },
      ],
    },
    
    pollux: {
      name: "Pollux",
      type: "K",
      mass: 1.91,
      radius: 8.8,
      temperature: 4851,
      position: { x: -15.91, y: 17.63, z: 23.21 },
      planets: [
        { name: "Pollux b", type: "gas_giant", orbitRadius: 1.64, mass: 72.8 },
        { name: "Pollux c", type: "earth_like", orbitRadius: 12, mass: 1.4, atmosphere: true },
        { name: "Pollux d", type: "ice_giant", orbitRadius: 24, mass: 28.9, atmosphere: true },
      ],
    },
    
    "ross 128": {
      name: "Ross 128",
      type: "M",
      mass: 0.168,
      radius: 0.2,
      temperature: 3192,
      position: { x: -0.83, y: 10.87, z: -1.57 },
      planets: [
        { name: "Ross 128 b", type: "rocky", orbitRadius: 0.045, mass: 1.35 },
        { name: "Ross 128 c", type: "ice", orbitRadius: 0.28, mass: 2.3, atmosphere: true },
        { name: "Ross 128 d", type: "mini_neptune", orbitRadius: 1.4, mass: 3.2, atmosphere: true },
      ],
    },
    
    achernar: {
      name: "Achernar",
      type: "B",
      mass: 6.7,
      radius: 9.3,
      temperature: 15000,
      position: { x: 36.47, y: -114.8, z: -67.95 },
      planets: [
        { name: "Achernar b", type: "plasma", orbitRadius: 11, mass: 5.6, atmosphere: true },
        { name: "Achernar c", type: "mega_iron", orbitRadius: 28, mass: 8.9, atmosphere: false },
        { name: "Achernar d", type: "warm_jupiter", orbitRadius: 65, mass: 89.4, atmosphere: true },
      ],
    },
    
    "gamma crucis": {
      name: "Gamma Crucis",
      type: "M",
      mass: 1.5,
      radius: 120,
      temperature: 3600,
      position: { x: 54.14, y: -51.31, z: -45.49 },
      planets: [
        { name: "Gamma Crucis b", type: "lava_ocean", orbitRadius: 62, mass: 3.4, atmosphere: true },
        { name: "Gamma Crucis c", type: "gas_giant", orbitRadius: 134, mass: 267.8, atmosphere: true },
      ],
    },
    
    sadr: {
      name: "Sadr",
      type: "F",
      mass: 12,
      radius: 150,
      temperature: 6100,
      position: { x: 556.2, y: 1714.7, z: 49.3 },
      planets: [
        { name: "Sadr b", type: "chthonian", orbitRadius: 156, mass: 1.8, atmosphere: false },
        { name: "Sadr c", type: "ringed_gas_giant", orbitRadius: 324, mass: 678.9, atmosphere: true },
      ],
    },
    
    mira: {
      name: "Mira",
      type: "M",
      mass: 1.2,
      radius: 332,
      temperature: 2918,
      position: { x: 70.8, y: -251.7, z: -143.2 },
      binary: true,
      planets: [
        { name: "Mira b", type: "rogue", orbitRadius: 345, mass: 345.6, atmosphere: false },
        { name: "Mira c", type: "ice", orbitRadius: 567, mass: 3.4, atmosphere: true },
      ],
    },
    
    "eta carinae": {
      name: "Eta Carinae",
      type: "O",
      mass: 100,
      radius: 240,
      temperature: 35000,
      position: { x: 4619.3, y: -4891.2, z: -3216.7 },
      binary: true,
      planets: [
        { name: "Eta Carinae b", type: "plasma", orbitRadius: 456, mass: 34.5, atmosphere: true },
        { name: "Eta Carinae c", type: "quark_planet", orbitRadius: 890, mass: 1.8, atmosphere: true },
      ],
    },
    
    "UY scuti": {
      name: "UY Scuti",
      type: "M",
      mass: 7,
      radius: 1700,
      temperature: 3365,
      position: { x: 2943.5, y: -9030.2, z: 254.7 },
      planets: [
        { name: "UY Scuti b", type: "magma_planet", orbitRadius: 1780, mass: 7.8, atmosphere: true },
      ],
    },
    
    "delta cephei": {
      name: "Delta Cephei",
      type: "F",
      mass: 4.5,
      radius: 44.5,
      temperature: 5800,
      position: { x: 267.3, y: 844.2, z: 13.9 },
      binary: true,
      planets: [
        { name: "Delta Cephei b", type: "warm_jupiter", orbitRadius: 48, mass: 67.8, atmosphere: true },
        { name: "Delta Cephei c", type: "ringed_gas_giant", orbitRadius: 98, mass: 456.7, atmosphere: true },
      ],
    },
    
    "pistol star": {
      name: "Pistol Star",
      type: "O",
      mass: 120,
      radius: 420,
      temperature: 30000,
      position: { x: 24750, y: -3875, z: 125 },
      planets: [
        { name: "Pistol Star b", type: "plasma", orbitRadius: 890, mass: 45.6, atmosphere: true },
      ],
    },
    
    "v838 monocerotis": {
      name: "V838 Monocerotis",
      type: "L",
      mass: 8,
      radius: 1570,
      temperature: 2000,
      position: { x: 6184, y: -19012, z: -536 },
      planets: [
        { name: "V838 Mon b", type: "rogue", orbitRadius: 2340, mass: 567.8, atmosphere: false },
      ],
    },
    
    "teegarden's star": {
      name: "Teegarden's Star",
      type: "M",
      mass: 0.09,
      radius: 0.1,
      temperature: 2700,
      position: { x: 2.95, y: -11.47, z: -3.89 },
      planets: [
        { name: "Teegarden b", type: "rocky", orbitRadius: 0.025, mass: 1.05 },
        { name: "Teegarden c", type: "rocky", orbitRadius: 0.045, mass: 1.11 },
        { name: "Teegarden d", type: "ice", orbitRadius: 0.18, mass: 1.8, atmosphere: true },
      ],
    },
    
    "yz ceti": {
      name: "YZ Ceti",
      type: "M",
      mass: 0.13,
      radius: 0.17,
      temperature: 3050,
      position: { x: 2.03, y: -11.14, z: -4.21 },
      planets: [
        { name: "YZ Ceti b", type: "rocky", orbitRadius: 0.02, mass: 0.7 },
        { name: "YZ Ceti c", type: "rocky", orbitRadius: 0.03, mass: 1.14 },
        { name: "YZ Ceti d", type: "sub_earth", orbitRadius: 0.08, mass: 0.34, atmosphere: false },
      ],
    },
    
    "van maanen's star": {
      name: "Van Maanen's Star",
      type: "D",
      mass: 0.68,
      radius: 0.011,
      temperature: 6030,
      position: { x: 13.93, y: -1.32, z: -1.74 },
      planets: [
        { name: "Van Maanen b", type: "chthonian", orbitRadius: 0.8, mass: 1.2, atmosphere: false },
      ],
    },
    
    
    "groombridge 34": {
      name: "Groombridge 34",
      type: "M",
      mass: 0.38,
      radius: 0.38,
      temperature: 3500,
      position: { x: 7.61, y: 8.08, z: 3.34 },
      binary: true,
      planets: [
        { name: "Groombridge 34 Ab", type: "rocky", orbitRadius: 0.15, mass: 5.2 },
      ],
    },
    
    "tau ceti": {
      name: "Tau Ceti",
      type: "G",
      mass: 0.78,
      radius: 0.79,
      temperature: 5344,
      position: { x: 1.75, y: -10.34, z: -5.7 },
      planets: [
        { name: "Tau Ceti f", type: "rocky", orbitRadius: 1.35, mass: 6.7 },
        { name: "Tau Ceti e", type: "rocky", orbitRadius: 0.55, mass: 4.3 },
      ],
    },
    
    "zeta reticuli a": {
      name: "Zeta Reticuli A",
      type: "G",
      mass: 0.97,
      radius: 0.94,
      temperature: 5730,
      position: { x: 21.46, y: -31.33, z: -7.02 },
      binary: true,
      planets: [
        { name: "Zeta A I", type: "rocky", orbitRadius: 0.9, mass: 1.1 },
        { name: "Zeta A II", type: "ocean", orbitRadius: 1.5, mass: 1.3 },
      ],
    },
    
    "hip 15330": {
      name: "HIP 15330",
      type: "K",
      mass: 0.75,
      radius: 0.78,
      temperature: 4600,
      position: { x: 20.51, y: -31.27, z: -7.62 },
      planets: [],
    },
    
    "gliese 86": {
      name: "Gliese 86",
      type: "K",
      mass: 0.79,
      radius: 0.83,
      temperature: 4780,
      position: { x: 16.14, y: -39.85, z: -0.97 },
      planets: [
        { name: "Gliese 86 b", type: "hot_jupiter", orbitRadius: 0.11, mass: 4.0 },
      ],
    },
    
    "hr 8832": {
      name: "HR 8832",
      type: "F",
      mass: 1.3,
      radius: 1.5,
      temperature: 6500,
      position: { x: 21.17, y: -27.89, z: -3.21 },
      planets: [],
    },
    
    bellatrix: {
      name: "Bellatrix",
      type: "B",
      mass: 8.6,
      radius: 5.8,
      temperature: 22000,
      position: { x: 73.15, y: -122.4, z: -194.1 },
      planets: [],
    },
    
    algol: {
      name: "Algol",
      type: "B",
      mass: 3.7,
      radius: 2.9,
      temperature: 13000,
      position: { x: -20.36, y: 88.71, z: -17.43 },
      binary: true,
      planets: [],
    },
    
    castor: {
      name: "Castor",
      type: "A",
      mass: 2.2,
      radius: 1.6,
      temperature: 10286,
      position: { x: -24.14, y: 31.57, z: 33.63 },
      binary: true,
      planets: [],
    },
    
    regulus: {
      name: "Regulus",
      type: "B",
      mass: 3.8,
      radius: 3.15,
      temperature: 12460,
      position: { x: -41.09, y: 56.04, z: 32.38 },
      planets: [],
    },
    
    scheat: {
      name: "Scheat",
      type: "M",
      mass: 2.0,
      radius: 95,
      temperature: 3700,
      position: { x: 59.95, y: 168.3, z: 72.84 },
      planets: [],
    },
    
    denebola: {
      name: "Denebola",
      type: "A",
      mass: 1.78,
      radius: 1.73,
      temperature: 8500,
      position: { x: -20.26, y: 25.31, z: 14.57 },
      planets: [],
    },
    
    merak: {
      name: "Merak",
      type: "A",
      mass: 2.7,
      radius: 2.4,
      temperature: 9275,
      position: { x: -41.16, y: 54.09, z: 33.87 },
      planets: [],
    },
    
    dubhe: {
      name: "Dubhe",
      type: "F",
      mass: 4.25,
      radius: 27.0,
      temperature: 5300,
      position: { x: -62.31, y: 82.47, z: 58.84 },
      planets: [],
    },
    
    miaplacidus: {
      name: "Miaplacidus",
      type: "A",
      mass: 3.5,
      radius: 6.8,
      temperature: 8200,
      position: { x: 33.39, y: -94.02, z: -53.21 },
      planets: [],
    },
    
    anser: {
      name: "Anser",
      type: "K",
      mass: 1.3,
      radius: 9.5,
      temperature: 4750,
      position: { x: 127.31, y: 307.84, z: 12.47 },
      planets: [],
    },
    
    saiph: {
      name: "Saiph",
      type: "B",
      mass: 15.5,
      radius: 22.0,
      temperature: 26000,
      position: { x: 199.82, y: -473.9, z: -402.3 },
      planets: [],
    },
    
    meissa: {
      name: "Meissa",
      type: "O",
      mass: 25.0,
      radius: 10.0,
      temperature: 35000,
      position: { x: 341.7, y: -643.2, z: -825.1 },
      planets: [],
    },
    
    hatsya: {
      name: "Hatsya",
      type: "B",
      mass: 10.0,
      radius: 3.0,
      temperature: 22000,
      position: { x: 413.7, y: -814.3, z: -1006.4 },
      planets: [],
    },
    
    "nair al saif": {
      name: "Nair al Saif",
      type: "B",
      mass: 9.0,
      radius: 5.0,
      temperature: 23000,
      position: { x: 400.12, y: -789.6, z: -974.3 },
      planets: [],
    },
    
    mintaka: {
      name: "Mintaka",
      type: "B",
      mass: 24.0,
      radius: 16.0,
      temperature: 29500,
      position: { x: 281.47, y: -554.2, z: -684.6 },
      planets: [],
    },
    
    alnilam: {
      name: "Alnilam",
      type: "B",
      mass: 40.0,
      radius: 24.0,
      temperature: 27500,
      position: { x: 412.1, y: -810.6, z: -1001.4 },
      planets: [],
    },
    
    alnitak: {
      name: "Alnitak",
      type: "O",
      mass: 33.0,
      radius: 20.0,
      temperature: 31000,
      position: { x: 226.32, y: -445.4, z: -550.3 },
      planets: [],
    },
    
    "gliese 97": {
      name: "Gliese 97",
      type: "K",
      mass: 0.7,
      radius: 0.72,
      temperature: 4500,
      position: { x: 17.35, y: -36.93, z: -1.34 },
      planets: [],
    },
    
    "tyc 7512-1387-1": {
      name: "TYC 7512-1387-1",
      type: "M",
      mass: 0.31,
      radius: 0.38,
      temperature: 3100,
      position: { x: 19.87, y: -37.36, z: -3.89 },
      planets: [],
    },
    
    "zeta reticuli b": {
      name: "Zeta Reticuli B",
      type: "G",
      mass: 0.88,
      radius: 0.86,
      temperature: 5410,
      position: { x: 21.52, y: -31.27, z: -7.14 },
      binary: true,
      planets: [
        { name: "Zeta B I", type: "desert", orbitRadius: 0.7, mass: 0.8 },
        { name: "Zeta B II", type: "super_earth", orbitRadius: 1.2, mass: 3.2 },
      ],
    },
    
    "epsilon indi": {
      name: "Epsilon Indi",
      type: "K",
      mass: 0.76,
      radius: 0.74,
      temperature: 4630,
      position: { x: 3.63, y: -8.82, z: -7.14 },
      planets: [
        { name: "Epsilon Indi Ab", type: "gas_giant", orbitRadius: 11.6, mass: 2.7 },
      ],
    },
    
    "kepler-22": {
      name: "Kepler-22",
      type: "G",
      mass: 0.97,
      radius: 0.98,
      temperature: 5518,
      position: { x: 190.47, y: 587.64, z: 31.82 },
      planets: [
        { name: "Kepler-22b", type: "ocean", orbitRadius: 0.85, mass: 2.4 },
      ],
    }
}
  window.GalaxyData = {
    STAR_TYPES,
    PLANET_TYPES,
    SYSTEMS,
  };
})();
  