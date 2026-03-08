// ============================================================
// LEVELS.JS - Level data for Matthew Henson's Adventure
// Each level has: tilemap, items, NPCs, player start, and messages
// Map dimensions: 16 wide x 13 tall (visible area below HUD)
// ============================================================

// Tile legend:
// '.' = walkable floor   'W' = wall (solid)   'R' = railing (solid)
// 'w' = water (solid)    'D' = door (walkable, transition)
// 'M' = mast             'S' = sail           'B' = barrel (solid)
// 'C' = crate (solid)    'T' = chest (solid, interactable)
// 'K' = sky (non-walkable)

const TILE_LOOKUP_BOAT = {
    '.': 'deck',
    ',': 'deck_dark',
    'W': 'wall_wood',
    'H': 'wall_top',
    'R': 'railing',
    'r': 'railing_water',
    'w': 'water',
    'D': 'door',
    'M': 'mast',
    'S': 'sail',
    'B': 'barrel',
    'C': 'crate',
    'T': 'chest',
    'K': 'sky',
    's': 'stairs',
};

const TILE_LOOKUP_ARCTIC = {
    '.': 'snow',
    ',': 'snow_packed',
    'I': 'ice',
    'W': 'ice_wall',
    'R': 'rock',
    'r': 'rock_snow',
    'G': 'igloo',
    'X': 'meteorite_site',
    'K': 'sky_arctic',
    'F': 'flag',
    'B': 'barrel',
    'C': 'crate',
};

// Solid tiles that block movement
const SOLID_TILES_BOAT = new Set(['W', 'H', 'R', 'r', 'w', 'M', 'S', 'B', 'C', 'T', 'K']);
const SOLID_TILES_ARCTIC = new Set(['W', 'R', 'r', 'G', 'K', 'B', 'C']);

// ============================================================
// LEVEL 1: THE SHIP - SS Roosevelt
// Matthew must find: parka, boots, gloves, compass, map
// Multiple rooms connected by doors
// ============================================================

const LEVEL1_ROOMS = {
    // Main deck - open area with mast and railings
    main_deck: {
        map: [
            'KKKKKSSSSSSSKrrr',
            'KKKKKSSSSSSSKr.r',
            'KKKKKKKMKKKKK..R',
            'r.............Rw',
            'R.............Rw',
            'r.....M.......Rw',
            'R.............Rw',
            'r..B..........Rw',
            'R..B..........Rw',
            'r.............Rw',
            'R..........C..Rw',
            'HHHHDHHHHHHHHHHH',
            'wwwwwwwwwwwwwwww',
        ],
        playerStart: { x: 7, y: 7 },
        doors: [
            { x: 4, y: 11, target: 'below_deck', targetX: 7, targetY: 1 }
        ],
        items: [
            { x: 14, y: 1, type: 'compass', message: 'Found a COMPASS! Essential for navigating the Arctic.' }
        ],
        npcs: [
            {
                x: 10, y: 5, type: 'sailor',
                dialog: [
                    "Welcome aboard the SS Roosevelt, Mr. Henson!",
                    "Commander Peary needs you ready for the Arctic.",
                    "You'll need a parka, boots, gloves, a compass, and a map.",
                    "Check the cabins below deck and the storage areas."
                ]
            }
        ],
        music: 'boat'
    },

    // Below deck - corridor with rooms
    below_deck: {
        map: [
            'WWWWWWWDWWWWWWWW',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,B,,,,,,,,C,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'WWDWWW,,,,WWDWW',
            'W,,,,,,,,,,,,,WW',
            'W,,,,,,,,,,,,,,W',
            'W,,B,,,,,,,,B,,W',
            'W,,,,,,,,,,,,,,W',
            'WWWWWWWWWWWWWWWW',
        ],
        playerStart: { x: 7, y: 1 },
        doors: [
            { x: 7, y: 0, target: 'main_deck', targetX: 4, targetY: 10 },
            { x: 2, y: 7, target: 'cabin_left', targetX: 7, targetY: 10 },
            { x: 12, y: 7, target: 'cabin_right', targetX: 7, targetY: 10 },
        ],
        items: [
            { x: 7, y: 5, type: 'map', message: 'Found a MAP! It shows the route to Cape York, Greenland.' }
        ],
        npcs: [
            {
                x: 5, y: 3, type: 'sailor',
                dialog: [
                    "The supply rooms are through these doors.",
                    "Left room has the cold weather gear.",
                    "Right room has more expedition supplies."
                ]
            }
        ],
        music: 'boat'
    },

    // Left cabin - cold weather gear
    cabin_left: {
        map: [
            'WWWWWWWWWWWWWWWW',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,C,,,,,,,,B,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,B,,,,,,,,C,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'WWWWWWWDWWWWWWWW',
        ],
        playerStart: { x: 7, y: 11 },
        doors: [
            { x: 7, y: 12, target: 'below_deck', targetX: 2, targetY: 8 },
        ],
        items: [
            { x: 4, y: 3, type: 'parka', message: 'Found a PARKA! A thick fur-lined coat for Arctic exploration.' },
            { x: 11, y: 7, type: 'gloves', message: 'Found GLOVES! Fur-lined gloves to protect your hands from frostbite.' },
        ],
        npcs: [],
        music: 'boat'
    },

    // Right cabin - more supplies
    cabin_right: {
        map: [
            'WWWWWWWWWWWWWWWW',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,B,,,,,,,,C,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,C,,,,,,,,B,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'W,,,,,,,,,,,,,,W',
            'WWWWWWWDWWWWWWWW',
        ],
        playerStart: { x: 7, y: 11 },
        doors: [
            { x: 7, y: 12, target: 'below_deck', targetX: 12, targetY: 8 },
        ],
        items: [
            { x: 10, y: 5, type: 'boots', message: 'Found BOOTS! Sturdy mukluks for walking on ice and snow.' },
        ],
        npcs: [
            {
                x: 4, y: 6, type: 'sailor',
                dialog: [
                    "Matthew Henson was one of the greatest Arctic explorers.",
                    "He learned survival skills from the Inuit people.",
                    "He could build sleds, drive dog teams, and speak Inuktitut!"
                ]
            }
        ],
        music: 'boat'
    }
};

// ============================================================
// LEVEL 2: THE ARCTIC - Search for the Cape York Meteorite
// Matthew must find: 3 sled dogs, harness, sled, supplies
// Then reach the meteorite site
// ============================================================

const LEVEL2_ROOMS = {
    // Base camp
    base_camp: {
        map: [
            'KKKKKKKKKKKKKKKK',
            'KKKKKKKKKKKKKKKK',
            '................',
            '....G...........',
            '................',
            '..........r.....',
            '................',
            '.....R..........',
            '................',
            '................',
            ',,,,,,,,,,,,,,,,',
            ',,,,,,,,,,,,,,,,',
            'IIIIIIIIIIIIIIII',
        ],
        playerStart: { x: 2, y: 5 },
        exits: [
            { x: 15, y: 2, target: 'ice_field', targetX: 0, targetY: 4, dir: 'right' },
            { x: 15, y: 3, target: 'ice_field', targetX: 0, targetY: 5, dir: 'right' },
            { x: 15, y: 4, target: 'ice_field', targetX: 0, targetY: 6, dir: 'right' },
            { x: 15, y: 5, target: 'ice_field', targetX: 0, targetY: 7, dir: 'right' },
            { x: 15, y: 6, target: 'ice_field', targetX: 0, targetY: 8, dir: 'right' },
            { x: 15, y: 7, target: 'ice_field', targetX: 0, targetY: 4, dir: 'right' },
            { x: 15, y: 8, target: 'ice_field', targetX: 0, targetY: 5, dir: 'right' },
            { x: 15, y: 9, target: 'ice_field', targetX: 0, targetY: 6, dir: 'right' },
            { x: 15, y: 10, target: 'ice_field', targetX: 0, targetY: 7, dir: 'right' },
            { x: 15, y: 11, target: 'ice_field', targetX: 0, targetY: 8, dir: 'right' },
        ],
        items: [
            { x: 12, y: 4, type: 'harness', message: 'Found a dog HARNESS! You\'ll need this to hook up the sled team.' },
        ],
        npcs: [
            {
                x: 5, y: 4, type: 'inuit',
                dialog: [
                    "Welcome to Greenland, Matthew!",
                    "The Inuit people call the great meteorite 'Ahnighito'.",
                    "You'll need sled dogs, a harness, a sled, and supplies.",
                    "The dogs have scattered - find them across the ice fields!",
                    "Head east to search the frozen landscape."
                ]
            }
        ],
        music: 'arctic'
    },

    // Ice field - wide open area
    ice_field: {
        map: [
            'KKKKKKKKKKKKKKKK',
            'KKKKKKKKKKKKKKKK',
            '......R.........',
            '................',
            ',,,,......,,,,,.',
            ',,,,,......,,,,.',
            ',,,,,,......,,,.',
            ',,,,,,........,.',
            '...............,',
            '................',
            ',,,,,,,,,,,,,,,,',
            ',,,,,,,,,,,,,,,,',
            'IIIIIIIIIIIIIIII',
        ],
        playerStart: { x: 0, y: 5 },
        exits: [
            { x: -1, y: 4, target: 'base_camp', targetX: 14, targetY: 4, dir: 'left' },
            { x: -1, y: 5, target: 'base_camp', targetX: 14, targetY: 5, dir: 'left' },
            { x: -1, y: 6, target: 'base_camp', targetX: 14, targetY: 6, dir: 'left' },
            { x: -1, y: 7, target: 'base_camp', targetX: 14, targetY: 7, dir: 'left' },
            { x: -1, y: 8, target: 'base_camp', targetX: 14, targetY: 8, dir: 'left' },
            { x: -1, y: 9, target: 'base_camp', targetX: 14, targetY: 9, dir: 'left' },
            { x: 15, y: 2, target: 'meteorite_valley', targetX: 0, targetY: 4, dir: 'right' },
            { x: 15, y: 3, target: 'meteorite_valley', targetX: 0, targetY: 5, dir: 'right' },
            { x: 15, y: 4, target: 'meteorite_valley', targetX: 0, targetY: 6, dir: 'right' },
            { x: 15, y: 5, target: 'meteorite_valley', targetX: 0, targetY: 7, dir: 'right' },
            { x: 15, y: 6, target: 'meteorite_valley', targetX: 0, targetY: 8, dir: 'right' },
            { x: 15, y: 7, target: 'meteorite_valley', targetX: 0, targetY: 4, dir: 'right' },
            { x: 15, y: 8, target: 'meteorite_valley', targetX: 0, targetY: 5, dir: 'right' },
            { x: 15, y: 9, target: 'meteorite_valley', targetX: 0, targetY: 6, dir: 'right' },
        ],
        items: [
            { x: 8, y: 3, type: 'sleddog', message: 'Found a sled dog! A strong husky ready to pull.' },
            { x: 13, y: 7, type: 'sled', message: 'Found a SLED! Traditional Inuit design, strong and light.' },
        ],
        npcs: [
            {
                x: 4, y: 8, type: 'inuit',
                dialog: [
                    "The meteorite is to the east, past the ice ridges.",
                    "Be careful of the ice walls - find paths around them.",
                    "Matthew Henson learned our ways and earned our respect."
                ]
            }
        ],
        music: 'arctic'
    },

    // Meteorite valley - final area
    meteorite_valley: {
        map: [
            'KKKKKKKKKKKKKKKK',
            'KKKKKKKKKKKKKKKK',
            '....WWWW...WWW..',
            '...............,',
            ',,....WWW....,,,',
            ',,,..........,,.',
            ',,...........,,.',
            ',,.R.........,,,',
            ',..........r.,,.',
            '................',
            ',,,,,,,,,,,,,,,,',
            ',,,,,,,,,,,,,,,,',
            'IIIIIIIIIIIIIIII',
        ],
        playerStart: { x: 0, y: 5 },
        exits: [
            { x: -1, y: 3, target: 'ice_field', targetX: 14, targetY: 4, dir: 'left' },
            { x: -1, y: 4, target: 'ice_field', targetX: 14, targetY: 5, dir: 'left' },
            { x: -1, y: 5, target: 'ice_field', targetX: 14, targetY: 6, dir: 'left' },
            { x: -1, y: 6, target: 'ice_field', targetX: 14, targetY: 7, dir: 'left' },
            { x: -1, y: 7, target: 'ice_field', targetX: 14, targetY: 8, dir: 'left' },
            { x: -1, y: 8, target: 'ice_field', targetX: 14, targetY: 9, dir: 'left' },
        ],
        items: [
            { x: 5, y: 5, type: 'sleddog', message: 'Found another sled dog! Two more to go... or is that enough?' },
            { x: 12, y: 4, type: 'supplies', message: 'Found SUPPLIES! Food and tools for the expedition.' },
            { x: 3, y: 8, type: 'sleddog', message: 'Found another sled dog! Your team is growing!' },
        ],
        npcs: [],
        music: 'arctic'
    }
};

// ============================================================
// LEVEL 3: THE METEORITE SITE
// Navigate the ice to reach the legendary Ahnighito meteorite
// ============================================================

const LEVEL3_ROOMS = {
    meteorite_site: {
        map: [
            'KKKKKKKKKKKKKKKK',
            'KKKKKKKKKKKKKKKK',
            '......WW....WW..',
            '...............,',
            ',,..WWW......,,,',
            ',,,..........,,.',
            ',,......WW...,,.',
            ',,.R.........,,,',
            ',..........r.,,.',
            '................',
            ',,,,,,,,,,,,,,,,',
            ',,,,,,,,,,,,,,,,',
            'IIIIIIIIIIIIIIII',
        ],
        playerStart: { x: 1, y: 5 },
        exits: [],
        items: [],
        meteorite: { x: 12, y: 5 },
        npcs: [],
        music: 'arctic'
    }
};

const LEVEL3_REQUIRED = [];

// ============================================================
// STORY TEXT
// ============================================================

const STORY_TEXTS = {
    intro: [
        "The year is 1897...",
        "",
        "Matthew Alexander Henson, one of the greatest",
        "explorers in American history, boards the ship",
        "SS Roosevelt for an expedition to the Arctic.",
        "",
        "His mission: Journey to Greenland with",
        "Commander Robert Peary to recover the legendary",
        "Cape York meteorite, known to the Inuit as 'Ahnighito'.",
        "",
        "But first, he must prepare for the journey ahead..."
    ],

    level1_complete: {
        title: "The Ship is Ready!",
        text: [
            "Matthew Henson has gathered all his gear!",
            "",
            "With parka, boots, gloves, compass, and map",
            "in hand, he is ready to face the Arctic.",
            "",
            "The SS Roosevelt sets sail northward,",
            "bound for the frozen shores of Greenland...",
        ]
    },

    level2_intro: [
        "Greenland, the Arctic...",
        "",
        "The ship has arrived at Cape York.",
        "The frozen landscape stretches endlessly.",
        "",
        "Matthew must find sled dogs and equipment",
        "to travel across the ice and locate",
        "the legendary Ahnighito meteorite.",
        "",
        "The Inuit people will help guide the way..."
    ],

    level2_complete: {
        title: "The Sled Team is Ready!",
        text: [
            "Matthew Henson has assembled his sled team!",
            "",
            "With three strong huskies, a sturdy sled,",
            "harness, and supplies packed tight,",
            "he is ready to race across the frozen tundra.",
            "",
            "The legendary Ahnighito meteorite awaits...",
        ]
    },

    level3_intro: [
        "The meteorite site...",
        "",
        "After a thrilling race across the ice,",
        "Matthew Henson arrives at the final destination.",
        "",
        "The Inuit people told stories of a great",
        "iron rock that fell from the sky.",
        "",
        "Navigate the ice to reach the Ahnighito meteorite!"
    ],

    victory: [
        "Matthew Henson has found the Ahnighito meteorite!",
        "",
        "Weighing over 34 tons, this meteorite was the",
        "largest ever brought to a museum.",
        "",
        "Matthew Henson's skills in dog sledding,",
        "navigation, and survival - learned from the",
        "Inuit people - were essential to this discovery.",
        "",
        "He would go on to become one of the first",
        "people to reach the North Pole in 1909.",
        "",
        "A true American hero and explorer!",
    ]
};

// Required items per level
const LEVEL1_REQUIRED = ['parka', 'boots', 'gloves', 'compass', 'map'];
const LEVEL2_REQUIRED = ['sleddog', 'harness', 'sled', 'supplies'];
// Note: need 3 sled dogs total, tracked separately
