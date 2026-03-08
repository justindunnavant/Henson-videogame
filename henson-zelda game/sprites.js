// ============================================================
// SPRITES.JS - Zelda-style pixel art for Matthew Henson's Adventure
// All sprites are drawn programmatically on offscreen canvases
// ============================================================

const TILE_SIZE = 32;

// Palette inspired by NES Zelda
const PAL = {
    // Skin tones
    skin: '#8B5E3C',
    skinLight: '#A0714A',
    skinDark: '#6B4226',
    // Clothing
    coatBrown: '#7B4B2A',
    coatDark: '#5A3518',
    pantsDark: '#3A2A1A',
    shirtBlue: '#4070B0',
    shirtDark: '#2A4A78',
    furWhite: '#E8DCC8',
    furGray: '#B0A898',
    // Boat/wood
    woodLight: '#D0A070',
    woodMed: '#B88858',
    woodDark: '#806030',
    deckLight: '#E0C898',
    deckMed: '#C8A878',
    // Water
    waterLight: '#4080C0',
    waterMed: '#2860A0',
    waterDark: '#183868',
    waterDeep: '#102848',
    // Arctic
    snowWhite: '#F0F0F8',
    snowLight: '#D8D8E8',
    snowMed: '#B8B8D0',
    iceBlue: '#90B8E0',
    iceDark: '#6090C0',
    // Items
    goldYellow: '#F0C040',
    goldDark: '#C09020',
    red: '#D04030',
    redDark: '#A02818',
    green: '#40A040',
    greenDark: '#287028',
    metalGray: '#B0B0B8',
    metalDark: '#808088',
    meteorBrown: '#584038',
    meteorDark: '#382820',
    meteorGlow: '#F08030',
    // UI
    black: '#000000',
    white: '#FFFFFF',
    // Sky
    skyDay: '#70A8E0',
    skyArctic: '#A0C0D8',
    // Rope/mast
    ropeYellow: '#C8A860',
    sailWhite: '#E8E0D0',
    sailShadow: '#C8C0B0',
    // Dog
    dogBrown: '#A07848',
    dogLight: '#C89868',
    dogDark: '#785830',
    dogWhite: '#E0D8C8',
};

// Helper: create offscreen canvas and return {canvas, ctx}
function createSpriteCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx };
}

// Helper: draw a pixel at integer coords
function px(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// Helper: draw rect
function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// ============================================================
// CHARACTER SPRITES (16x16 native, rendered at 32x32)
// ============================================================

function drawHensonSprite(direction, frame) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);

    // Matthew Henson - explorer outfit, dark skin, fur-lined coat
    const f = frame % 2;

    if (direction === 'down' || direction === 'idle') {
        // Hair/Head
        rect(ctx, 5, 0, 6, 1, PAL.black);       // hair top
        rect(ctx, 4, 1, 8, 1, PAL.black);        // hair
        rect(ctx, 4, 2, 8, 3, PAL.skin);         // face
        px(ctx, 5, 2, PAL.black);                 // left eye
        px(ctx, 10, 2, PAL.black);                // right eye
        px(ctx, 7, 3, PAL.skinDark);              // nose
        px(ctx, 8, 3, PAL.skinDark);
        rect(ctx, 6, 4, 4, 1, PAL.skinDark);     // mouth area

        // Fur collar
        rect(ctx, 3, 5, 10, 1, PAL.furWhite);
        px(ctx, 4, 5, PAL.furGray);
        px(ctx, 9, 5, PAL.furGray);

        // Coat body
        rect(ctx, 3, 6, 10, 4, PAL.coatBrown);
        rect(ctx, 4, 6, 8, 4, PAL.coatBrown);
        // Coat center line
        rect(ctx, 7, 6, 2, 4, PAL.coatDark);
        // Buttons
        px(ctx, 7, 7, PAL.goldYellow);
        px(ctx, 7, 9, PAL.goldYellow);

        // Arms
        if (f === 0) {
            rect(ctx, 2, 6, 1, 4, PAL.coatBrown);
            rect(ctx, 13, 6, 1, 4, PAL.coatBrown);
            px(ctx, 2, 10, PAL.skin);
            px(ctx, 13, 10, PAL.skin);
        } else {
            rect(ctx, 1, 6, 1, 3, PAL.coatBrown);
            rect(ctx, 14, 7, 1, 3, PAL.coatBrown);
            px(ctx, 1, 9, PAL.skin);
            px(ctx, 14, 10, PAL.skin);
        }

        // Belt
        rect(ctx, 3, 10, 10, 1, PAL.pantsDark);
        px(ctx, 7, 10, PAL.goldYellow);

        // Legs
        if (f === 0) {
            rect(ctx, 4, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 9, 11, 3, 3, PAL.pantsDark);
        } else {
            rect(ctx, 5, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 8, 11, 3, 3, PAL.pantsDark);
        }

        // Boots
        rect(ctx, 4, 14, 3, 2, PAL.coatDark);
        rect(ctx, 9, 14, 3, 2, PAL.coatDark);

    } else if (direction === 'up') {
        // Back view
        rect(ctx, 5, 0, 6, 1, PAL.black);
        rect(ctx, 4, 1, 8, 4, PAL.black);        // hair from back

        rect(ctx, 3, 5, 10, 1, PAL.furWhite);
        rect(ctx, 3, 6, 10, 4, PAL.coatBrown);
        rect(ctx, 7, 6, 2, 4, PAL.coatDark);

        if (f === 0) {
            rect(ctx, 2, 6, 1, 4, PAL.coatBrown);
            rect(ctx, 13, 6, 1, 4, PAL.coatBrown);
        } else {
            rect(ctx, 1, 6, 1, 3, PAL.coatBrown);
            rect(ctx, 14, 7, 1, 3, PAL.coatBrown);
        }

        rect(ctx, 3, 10, 10, 1, PAL.pantsDark);

        if (f === 0) {
            rect(ctx, 4, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 9, 11, 3, 3, PAL.pantsDark);
        } else {
            rect(ctx, 5, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 8, 11, 3, 3, PAL.pantsDark);
        }
        rect(ctx, 4, 14, 3, 2, PAL.coatDark);
        rect(ctx, 9, 14, 3, 2, PAL.coatDark);

    } else if (direction === 'left') {
        // Side view facing left
        rect(ctx, 5, 0, 5, 1, PAL.black);
        rect(ctx, 4, 1, 6, 1, PAL.black);
        rect(ctx, 4, 2, 6, 3, PAL.skin);
        px(ctx, 4, 2, PAL.black);  // eye
        px(ctx, 5, 3, PAL.skinDark); // nose
        px(ctx, 4, 4, PAL.skinDark);

        rect(ctx, 4, 5, 8, 1, PAL.furWhite);
        rect(ctx, 4, 6, 8, 4, PAL.coatBrown);
        rect(ctx, 7, 6, 1, 4, PAL.coatDark);
        px(ctx, 6, 7, PAL.goldYellow);

        if (f === 0) {
            rect(ctx, 3, 7, 1, 3, PAL.coatBrown);
            px(ctx, 3, 10, PAL.skin);
        } else {
            rect(ctx, 2, 6, 1, 3, PAL.coatBrown);
            px(ctx, 2, 9, PAL.skin);
        }

        rect(ctx, 4, 10, 8, 1, PAL.pantsDark);
        px(ctx, 7, 10, PAL.goldYellow);

        if (f === 0) {
            rect(ctx, 5, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 9, 11, 3, 3, PAL.pantsDark);
        } else {
            rect(ctx, 4, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 10, 11, 2, 3, PAL.pantsDark);
        }
        rect(ctx, 4, 14, 4, 2, PAL.coatDark);
        rect(ctx, 9, 14, 3, 2, PAL.coatDark);

    } else if (direction === 'right') {
        // Side view facing right (mirror of left)
        rect(ctx, 6, 0, 5, 1, PAL.black);
        rect(ctx, 6, 1, 6, 1, PAL.black);
        rect(ctx, 6, 2, 6, 3, PAL.skin);
        px(ctx, 11, 2, PAL.black);
        px(ctx, 10, 3, PAL.skinDark);
        px(ctx, 11, 4, PAL.skinDark);

        rect(ctx, 4, 5, 8, 1, PAL.furWhite);
        rect(ctx, 4, 6, 8, 4, PAL.coatBrown);
        rect(ctx, 8, 6, 1, 4, PAL.coatDark);
        px(ctx, 9, 7, PAL.goldYellow);

        if (f === 0) {
            rect(ctx, 12, 7, 1, 3, PAL.coatBrown);
            px(ctx, 12, 10, PAL.skin);
        } else {
            rect(ctx, 13, 6, 1, 3, PAL.coatBrown);
            px(ctx, 13, 9, PAL.skin);
        }

        rect(ctx, 4, 10, 8, 1, PAL.pantsDark);
        px(ctx, 8, 10, PAL.goldYellow);

        if (f === 0) {
            rect(ctx, 4, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 8, 11, 3, 3, PAL.pantsDark);
        } else {
            rect(ctx, 5, 11, 3, 3, PAL.pantsDark);
            rect(ctx, 9, 11, 2, 3, PAL.pantsDark);
        }
        rect(ctx, 4, 14, 3, 2, PAL.coatDark);
        rect(ctx, 8, 14, 4, 2, PAL.coatDark);
    }

    return canvas;
}

// ============================================================
// NPC SPRITES
// ============================================================

function drawSailorSprite(frame) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);
    const f = frame % 2;

    // Sailor NPC
    rect(ctx, 5, 0, 6, 2, PAL.goldYellow);      // hat
    rect(ctx, 4, 1, 8, 1, PAL.goldDark);         // hat brim
    rect(ctx, 5, 2, 6, 3, PAL.skinLight);        // face (lighter skin)
    px(ctx, 6, 2, PAL.black);
    px(ctx, 9, 2, PAL.black);
    rect(ctx, 6, 4, 4, 1, '#C08060');

    rect(ctx, 3, 5, 10, 1, PAL.white);
    rect(ctx, 3, 6, 10, 4, PAL.shirtBlue);
    rect(ctx, 6, 6, 4, 2, PAL.white);            // striped shirt
    rect(ctx, 6, 8, 4, 1, PAL.white);

    rect(ctx, 2, 6, 1, 4, PAL.shirtBlue);
    rect(ctx, 13, 6, 1, 4, PAL.shirtBlue);
    px(ctx, 2, 10, PAL.skinLight);
    px(ctx, 13, 10, PAL.skinLight);

    rect(ctx, 3, 10, 10, 1, PAL.metalDark);
    rect(ctx, 4, 11, 3, 3, PAL.shirtDark);
    rect(ctx, 9, 11, 3, 3, PAL.shirtDark);
    rect(ctx, 4, 14, 3, 2, PAL.black);
    rect(ctx, 9, 14, 3, 2, PAL.black);

    return canvas;
}

function drawInuitGuideSprite(frame) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);

    // Inuit guide with parka
    rect(ctx, 5, 0, 6, 1, PAL.furWhite);         // hood top
    rect(ctx, 3, 1, 10, 1, PAL.furWhite);         // hood
    rect(ctx, 3, 2, 10, 1, PAL.furGray);          // hood edge
    rect(ctx, 5, 2, 6, 3, PAL.skin);              // face
    px(ctx, 6, 2, PAL.black);
    px(ctx, 9, 2, PAL.black);
    px(ctx, 7, 3, PAL.skinDark);

    rect(ctx, 3, 5, 10, 5, PAL.coatBrown);
    rect(ctx, 5, 5, 6, 1, PAL.furWhite);          // collar
    // Decorative pattern
    px(ctx, 5, 7, PAL.red);
    px(ctx, 7, 7, PAL.red);
    px(ctx, 9, 7, PAL.red);
    px(ctx, 6, 8, PAL.goldYellow);
    px(ctx, 8, 8, PAL.goldYellow);
    px(ctx, 10, 8, PAL.goldYellow);

    rect(ctx, 2, 6, 1, 4, PAL.coatBrown);
    rect(ctx, 13, 6, 1, 4, PAL.coatBrown);
    px(ctx, 2, 10, PAL.skin);
    px(ctx, 13, 10, PAL.skin);

    rect(ctx, 3, 10, 10, 1, PAL.coatDark);
    rect(ctx, 4, 11, 3, 4, PAL.coatBrown);
    rect(ctx, 9, 11, 3, 4, PAL.coatBrown);
    rect(ctx, 4, 15, 3, 1, PAL.furWhite);
    rect(ctx, 9, 15, 3, 1, PAL.furWhite);

    return canvas;
}

// ============================================================
// SLED DOG SPRITE
// ============================================================

function drawSledDogSprite(frame) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);
    const f = frame % 2;

    // Husky-style sled dog facing right
    // Body
    rect(ctx, 3, 6, 10, 5, PAL.dogBrown);
    rect(ctx, 4, 7, 8, 3, PAL.dogLight);

    // Head
    rect(ctx, 11, 3, 4, 4, PAL.dogBrown);
    rect(ctx, 12, 4, 3, 2, PAL.dogWhite);        // face mask
    px(ctx, 13, 4, PAL.black);                    // eye
    px(ctx, 14, 6, PAL.black);                    // nose

    // Ears
    px(ctx, 11, 2, PAL.dogDark);
    px(ctx, 14, 2, PAL.dogDark);
    px(ctx, 11, 3, PAL.dogDark);
    px(ctx, 14, 3, PAL.dogDark);

    // Tail
    if (f === 0) {
        rect(ctx, 1, 4, 2, 2, PAL.dogBrown);
        px(ctx, 1, 3, PAL.dogBrown);
    } else {
        rect(ctx, 1, 5, 2, 2, PAL.dogBrown);
        px(ctx, 1, 4, PAL.dogBrown);
    }

    // Legs
    if (f === 0) {
        rect(ctx, 4, 11, 2, 4, PAL.dogBrown);
        rect(ctx, 10, 11, 2, 4, PAL.dogBrown);
        px(ctx, 4, 15, PAL.dogDark);
        px(ctx, 10, 15, PAL.dogDark);
    } else {
        rect(ctx, 5, 11, 2, 4, PAL.dogBrown);
        rect(ctx, 9, 11, 2, 3, PAL.dogBrown);
        rect(ctx, 11, 11, 2, 4, PAL.dogBrown);
        px(ctx, 5, 15, PAL.dogDark);
        px(ctx, 11, 15, PAL.dogDark);
    }

    // Belly
    rect(ctx, 6, 10, 4, 1, PAL.dogWhite);

    return canvas;
}

// ============================================================
// ITEM SPRITES (16x16)
// ============================================================

function drawItemSprite(type) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);

    switch (type) {
        case 'parka':
            // Fur-lined parka
            rect(ctx, 4, 1, 8, 2, PAL.furWhite);
            rect(ctx, 3, 3, 10, 8, PAL.coatBrown);
            rect(ctx, 5, 3, 6, 1, PAL.furWhite);
            rect(ctx, 6, 4, 4, 2, PAL.coatDark);
            px(ctx, 7, 5, PAL.goldYellow);
            px(ctx, 7, 7, PAL.goldYellow);
            rect(ctx, 2, 4, 1, 5, PAL.coatBrown);
            rect(ctx, 13, 4, 1, 5, PAL.coatBrown);
            rect(ctx, 3, 11, 10, 2, PAL.coatBrown);
            rect(ctx, 3, 13, 10, 1, PAL.furWhite);
            break;

        case 'boots':
            // Fur boots
            rect(ctx, 2, 4, 5, 8, PAL.coatDark);
            rect(ctx, 9, 4, 5, 8, PAL.coatDark);
            rect(ctx, 2, 4, 5, 2, PAL.furWhite);
            rect(ctx, 9, 4, 5, 2, PAL.furWhite);
            rect(ctx, 1, 12, 6, 3, PAL.coatDark);
            rect(ctx, 9, 12, 6, 3, PAL.coatDark);
            px(ctx, 3, 8, PAL.goldYellow);
            px(ctx, 11, 8, PAL.goldYellow);
            break;

        case 'gloves':
            // Expedition gloves
            rect(ctx, 1, 5, 6, 7, PAL.coatBrown);
            rect(ctx, 9, 5, 6, 7, PAL.coatBrown);
            rect(ctx, 1, 5, 6, 1, PAL.furWhite);
            rect(ctx, 9, 5, 6, 1, PAL.furWhite);
            // Fingers
            rect(ctx, 0, 12, 2, 3, PAL.coatBrown);
            rect(ctx, 2, 12, 2, 4, PAL.coatBrown);
            rect(ctx, 4, 12, 2, 3, PAL.coatBrown);
            rect(ctx, 10, 12, 2, 3, PAL.coatBrown);
            rect(ctx, 12, 12, 2, 4, PAL.coatBrown);
            rect(ctx, 14, 12, 2, 3, PAL.coatBrown);
            break;

        case 'compass':
            // Navigation compass
            rect(ctx, 3, 3, 10, 10, PAL.goldDark);
            rect(ctx, 4, 4, 8, 8, PAL.goldYellow);
            rect(ctx, 5, 5, 6, 6, PAL.white);
            // Compass needle
            rect(ctx, 7, 4, 2, 4, PAL.red);
            rect(ctx, 7, 8, 2, 4, PAL.shirtBlue);
            // Cardinal points
            px(ctx, 8, 5, PAL.black);
            px(ctx, 5, 8, PAL.black);
            px(ctx, 11, 8, PAL.black);
            px(ctx, 8, 11, PAL.black);
            break;

        case 'map':
            // Map/chart
            rect(ctx, 2, 2, 12, 12, PAL.deckLight);
            rect(ctx, 2, 2, 12, 1, PAL.woodMed);
            rect(ctx, 2, 13, 12, 1, PAL.woodMed);
            // Map details
            rect(ctx, 4, 5, 3, 2, PAL.green);
            rect(ctx, 8, 4, 4, 3, PAL.green);
            rect(ctx, 5, 8, 6, 3, PAL.waterMed);
            px(ctx, 10, 9, PAL.red); // X marks the spot
            px(ctx, 11, 10, PAL.red);
            px(ctx, 9, 10, PAL.red);
            px(ctx, 10, 11, PAL.red);
            break;

        case 'sleddog':
            // Dog icon for HUD
            return drawSledDogSprite(0);

        case 'harness':
            // Dog harness/rope
            rect(ctx, 3, 3, 10, 2, PAL.coatBrown);
            rect(ctx, 3, 11, 10, 2, PAL.coatBrown);
            rect(ctx, 3, 5, 2, 6, PAL.coatBrown);
            rect(ctx, 11, 5, 2, 6, PAL.coatBrown);
            // Buckles
            px(ctx, 7, 3, PAL.metalGray);
            px(ctx, 8, 3, PAL.metalGray);
            px(ctx, 7, 12, PAL.metalGray);
            px(ctx, 8, 12, PAL.metalGray);
            // Center ring
            rect(ctx, 6, 6, 4, 4, PAL.metalGray);
            rect(ctx, 7, 7, 2, 2, PAL.metalDark);
            break;

        case 'sled':
            // Sled/runners
            rect(ctx, 1, 4, 14, 5, PAL.woodMed);
            rect(ctx, 2, 5, 12, 3, PAL.woodLight);
            // Runners
            rect(ctx, 0, 10, 16, 2, PAL.metalGray);
            rect(ctx, 0, 12, 2, 2, PAL.metalGray);
            rect(ctx, 14, 12, 2, 2, PAL.metalGray);
            // Rope attachment
            rect(ctx, 7, 2, 2, 2, PAL.ropeYellow);
            break;

        case 'supplies':
            // Supply crate
            rect(ctx, 2, 3, 12, 10, PAL.woodMed);
            rect(ctx, 3, 4, 10, 8, PAL.woodLight);
            rect(ctx, 2, 7, 12, 2, PAL.woodDark);
            // Cross straps
            rect(ctx, 7, 3, 2, 10, PAL.woodDark);
            px(ctx, 7, 7, PAL.metalGray);
            px(ctx, 8, 7, PAL.metalGray);
            break;

        case 'meteorite':
            // The Cape York meteorite!
            rect(ctx, 3, 3, 10, 10, PAL.meteorDark);
            rect(ctx, 4, 2, 8, 12, PAL.meteorBrown);
            rect(ctx, 2, 5, 12, 6, PAL.meteorBrown);
            // Glow effect
            px(ctx, 5, 4, PAL.meteorGlow);
            px(ctx, 9, 6, PAL.meteorGlow);
            px(ctx, 6, 8, PAL.meteorGlow);
            px(ctx, 11, 5, PAL.meteorGlow);
            px(ctx, 4, 10, PAL.meteorGlow);
            // Metallic sheen
            px(ctx, 7, 5, PAL.metalGray);
            px(ctx, 8, 7, PAL.metalGray);
            px(ctx, 6, 9, PAL.metalGray);
            break;
    }

    return canvas;
}

// ============================================================
// TILE SPRITES (16x16 native)
// ============================================================

function drawTileSprite(type) {
    const { canvas, ctx } = createSpriteCanvas(16, 16);

    switch (type) {
        // ---- BOAT TILES ----
        case 'deck':
            rect(ctx, 0, 0, 16, 16, PAL.deckMed);
            for (let i = 0; i < 16; i += 4) {
                rect(ctx, 0, i, 16, 1, PAL.deckLight);
            }
            // Wood grain
            px(ctx, 3, 2, PAL.woodMed);
            px(ctx, 11, 6, PAL.woodMed);
            px(ctx, 7, 10, PAL.woodMed);
            px(ctx, 2, 14, PAL.woodMed);
            break;

        case 'deck_dark':
            rect(ctx, 0, 0, 16, 16, PAL.woodMed);
            for (let i = 0; i < 16; i += 4) {
                rect(ctx, 0, i, 16, 1, PAL.woodLight);
            }
            px(ctx, 5, 3, PAL.woodDark);
            px(ctx, 12, 7, PAL.woodDark);
            px(ctx, 3, 11, PAL.woodDark);
            // Lantern glow hint
            px(ctx, 8, 8, PAL.deckMed);
            break;

        case 'wall_wood':
            rect(ctx, 0, 0, 16, 16, PAL.woodDark);
            rect(ctx, 1, 0, 14, 7, PAL.woodMed);
            rect(ctx, 1, 9, 14, 7, PAL.woodMed);
            rect(ctx, 0, 7, 16, 2, PAL.woodDark);
            px(ctx, 4, 3, PAL.woodDark);
            px(ctx, 10, 12, PAL.woodDark);
            break;

        case 'wall_top':
            rect(ctx, 0, 0, 16, 16, PAL.woodMed);
            rect(ctx, 0, 0, 16, 4, PAL.metalDark);
            rect(ctx, 0, 4, 16, 12, PAL.woodLight);
            for (let i = 4; i < 16; i += 3) {
                rect(ctx, 0, i, 16, 1, PAL.woodMed);
            }
            break;

        case 'railing':
            rect(ctx, 0, 0, 16, 16, PAL.skyDay);
            // Railing posts
            rect(ctx, 0, 4, 2, 12, PAL.woodDark);
            rect(ctx, 7, 4, 2, 12, PAL.woodDark);
            rect(ctx, 14, 4, 2, 12, PAL.woodDark);
            // Top rail
            rect(ctx, 0, 4, 16, 2, PAL.woodMed);
            // Bottom rail
            rect(ctx, 0, 10, 16, 2, PAL.woodMed);
            break;

        case 'railing_water':
            rect(ctx, 0, 0, 16, 8, PAL.skyDay);
            rect(ctx, 0, 8, 16, 8, PAL.waterMed);
            // Railing
            rect(ctx, 0, 4, 16, 2, PAL.woodMed);
            rect(ctx, 0, 4, 2, 12, PAL.woodDark);
            rect(ctx, 7, 4, 2, 12, PAL.woodDark);
            rect(ctx, 14, 4, 2, 12, PAL.woodDark);
            rect(ctx, 0, 10, 16, 2, PAL.woodMed);
            break;

        case 'mast':
            rect(ctx, 0, 0, 16, 16, PAL.skyDay);
            rect(ctx, 6, 0, 4, 16, PAL.woodDark);
            rect(ctx, 7, 0, 2, 16, PAL.woodMed);
            // Rope rings
            px(ctx, 5, 4, PAL.ropeYellow);
            px(ctx, 10, 4, PAL.ropeYellow);
            px(ctx, 5, 12, PAL.ropeYellow);
            px(ctx, 10, 12, PAL.ropeYellow);
            break;

        case 'sail':
            rect(ctx, 0, 0, 16, 16, PAL.sailWhite);
            // Cloth folds
            rect(ctx, 0, 0, 16, 1, PAL.sailShadow);
            rect(ctx, 3, 5, 1, 8, PAL.sailShadow);
            rect(ctx, 10, 3, 1, 10, PAL.sailShadow);
            // Rope edge
            rect(ctx, 0, 0, 1, 16, PAL.ropeYellow);
            break;

        case 'water':
            rect(ctx, 0, 0, 16, 16, PAL.waterMed);
            // Waves
            rect(ctx, 0, 4, 6, 2, PAL.waterLight);
            rect(ctx, 10, 4, 6, 2, PAL.waterLight);
            rect(ctx, 4, 12, 8, 2, PAL.waterLight);
            rect(ctx, 2, 8, 4, 1, PAL.waterDark);
            rect(ctx, 12, 10, 4, 1, PAL.waterDark);
            break;

        case 'water_deep':
            rect(ctx, 0, 0, 16, 16, PAL.waterDark);
            rect(ctx, 2, 3, 5, 2, PAL.waterMed);
            rect(ctx, 9, 9, 6, 2, PAL.waterMed);
            rect(ctx, 0, 13, 4, 1, PAL.waterDeep);
            rect(ctx, 8, 1, 3, 1, PAL.waterDeep);
            break;

        case 'door':
            rect(ctx, 0, 0, 16, 16, PAL.woodMed);
            rect(ctx, 2, 1, 12, 14, PAL.woodLight);
            rect(ctx, 4, 2, 8, 12, PAL.woodDark);
            // Door handle
            px(ctx, 10, 8, PAL.goldYellow);
            px(ctx, 10, 9, PAL.goldYellow);
            // Frame
            rect(ctx, 7, 0, 2, 1, PAL.goldDark);
            break;

        case 'stairs':
            rect(ctx, 0, 0, 16, 16, PAL.woodDark);
            for (let i = 0; i < 16; i += 4) {
                rect(ctx, 0, i, 16 - i, 4, PAL.woodMed);
                rect(ctx, 0, i, 16 - i, 1, PAL.deckLight);
            }
            break;

        case 'crate':
            rect(ctx, 1, 1, 14, 14, PAL.woodLight);
            rect(ctx, 0, 0, 16, 1, PAL.woodMed);
            rect(ctx, 0, 15, 16, 1, PAL.woodMed);
            rect(ctx, 0, 0, 1, 16, PAL.woodMed);
            rect(ctx, 15, 0, 1, 16, PAL.woodMed);
            rect(ctx, 0, 7, 16, 2, PAL.woodMed);
            rect(ctx, 7, 0, 2, 16, PAL.woodMed);
            break;

        case 'barrel':
            rect(ctx, 3, 1, 10, 14, PAL.woodLight);
            rect(ctx, 2, 3, 12, 10, PAL.woodLight);
            // Bands
            rect(ctx, 2, 3, 12, 2, PAL.metalGray);
            rect(ctx, 2, 11, 12, 2, PAL.metalGray);
            // Highlights
            rect(ctx, 5, 5, 2, 6, PAL.deckLight);
            break;

        case 'chest':
            rect(ctx, 1, 4, 14, 10, PAL.woodLight);
            rect(ctx, 0, 4, 16, 2, PAL.woodMed);
            rect(ctx, 0, 12, 16, 2, PAL.woodMed);
            // Lid
            rect(ctx, 1, 2, 14, 3, PAL.woodMed);
            rect(ctx, 2, 2, 12, 2, PAL.woodLight);
            // Lock
            rect(ctx, 6, 6, 4, 4, PAL.goldYellow);
            rect(ctx, 7, 7, 2, 2, PAL.goldDark);
            break;

        // ---- ARCTIC TILES ----
        case 'snow':
            rect(ctx, 0, 0, 16, 16, PAL.snowWhite);
            px(ctx, 3, 3, PAL.snowLight);
            px(ctx, 9, 5, PAL.snowLight);
            px(ctx, 12, 2, PAL.snowLight);
            px(ctx, 5, 11, PAL.snowLight);
            px(ctx, 14, 13, PAL.snowLight);
            px(ctx, 1, 8, PAL.snowLight);
            break;

        case 'snow_packed':
            rect(ctx, 0, 0, 16, 16, PAL.snowLight);
            px(ctx, 4, 2, PAL.snowMed);
            px(ctx, 11, 7, PAL.snowMed);
            px(ctx, 2, 12, PAL.snowMed);
            px(ctx, 13, 4, PAL.snowMed);
            px(ctx, 7, 9, PAL.snowWhite);
            px(ctx, 1, 5, PAL.snowWhite);
            break;

        case 'ice':
            rect(ctx, 0, 0, 16, 16, PAL.iceBlue);
            // Cracks
            rect(ctx, 2, 3, 5, 1, PAL.iceDark);
            rect(ctx, 6, 3, 1, 4, PAL.iceDark);
            rect(ctx, 10, 8, 4, 1, PAL.iceDark);
            rect(ctx, 10, 8, 1, 5, PAL.iceDark);
            // Shine
            px(ctx, 4, 6, PAL.white);
            px(ctx, 12, 4, PAL.white);
            break;

        case 'ice_wall':
            rect(ctx, 0, 0, 16, 16, PAL.iceDark);
            rect(ctx, 0, 0, 16, 4, PAL.iceBlue);
            rect(ctx, 1, 4, 14, 10, PAL.iceBlue);
            px(ctx, 3, 6, PAL.white);
            px(ctx, 10, 8, PAL.white);
            px(ctx, 6, 12, PAL.iceDark);
            rect(ctx, 0, 14, 16, 2, PAL.iceDark);
            break;

        case 'rock':
            rect(ctx, 0, 0, 16, 16, PAL.snowWhite);
            rect(ctx, 2, 4, 12, 10, PAL.metalDark);
            rect(ctx, 3, 3, 10, 10, PAL.metalGray);
            rect(ctx, 4, 5, 4, 3, '#888890');
            px(ctx, 10, 7, '#888890');
            px(ctx, 6, 10, PAL.metalDark);
            break;

        case 'rock_snow':
            rect(ctx, 0, 0, 16, 16, PAL.snowWhite);
            rect(ctx, 2, 6, 12, 8, PAL.metalDark);
            rect(ctx, 3, 5, 10, 8, PAL.metalGray);
            // Snow cap
            rect(ctx, 3, 3, 10, 3, PAL.snowWhite);
            rect(ctx, 4, 2, 8, 2, PAL.snowWhite);
            px(ctx, 5, 7, '#888890');
            break;

        case 'igloo':
            rect(ctx, 0, 0, 16, 16, PAL.snowWhite);
            // Dome
            rect(ctx, 2, 4, 12, 10, PAL.snowLight);
            rect(ctx, 4, 2, 8, 10, PAL.snowLight);
            rect(ctx, 6, 1, 4, 2, PAL.snowLight);
            // Block lines
            rect(ctx, 2, 6, 12, 1, PAL.snowMed);
            rect(ctx, 4, 9, 8, 1, PAL.snowMed);
            px(ctx, 6, 4, PAL.snowMed);
            px(ctx, 10, 4, PAL.snowMed);
            // Door
            rect(ctx, 6, 10, 4, 6, PAL.meteorDark);
            rect(ctx, 7, 11, 2, 5, PAL.black);
            break;

        case 'meteorite_site':
            rect(ctx, 0, 0, 16, 16, PAL.snowLight);
            // Crater
            rect(ctx, 2, 2, 12, 12, PAL.meteorDark);
            rect(ctx, 3, 3, 10, 10, PAL.meteorBrown);
            // Meteorite
            rect(ctx, 5, 5, 6, 6, PAL.meteorDark);
            px(ctx, 6, 6, PAL.meteorGlow);
            px(ctx, 9, 8, PAL.meteorGlow);
            px(ctx, 7, 9, PAL.meteorGlow);
            // Glow ring
            px(ctx, 4, 4, PAL.meteorGlow);
            px(ctx, 11, 4, PAL.meteorGlow);
            px(ctx, 4, 11, PAL.meteorGlow);
            px(ctx, 11, 11, PAL.meteorGlow);
            break;

        case 'sky':
            rect(ctx, 0, 0, 16, 16, PAL.skyDay);
            break;

        case 'sky_arctic':
            rect(ctx, 0, 0, 16, 16, PAL.skyArctic);
            // Aurora hints
            px(ctx, 3, 4, PAL.green);
            px(ctx, 4, 3, PAL.green);
            px(ctx, 10, 6, PAL.green);
            px(ctx, 11, 5, '#60C060');
            break;

        case 'flag':
            rect(ctx, 0, 0, 16, 16, PAL.snowWhite);
            // Pole
            rect(ctx, 7, 0, 2, 16, PAL.woodDark);
            // Flag
            rect(ctx, 9, 1, 6, 5, PAL.red);
            rect(ctx, 10, 2, 4, 3, PAL.shirtBlue);
            px(ctx, 11, 3, PAL.white);
            break;

        default:
            // Magenta error tile
            rect(ctx, 0, 0, 16, 16, '#FF00FF');
            rect(ctx, 0, 0, 8, 8, '#000');
            rect(ctx, 8, 8, 8, 8, '#000');
            break;
    }

    return canvas;
}

// ============================================================
// SPRITE CACHE
// ============================================================
const SpriteCache = {
    _cache: {},

    getHenson(direction, frame) {
        const key = `henson_${direction}_${frame % 2}`;
        if (!this._cache[key]) {
            this._cache[key] = drawHensonSprite(direction, frame);
        }
        return this._cache[key];
    },

    getSailor(frame) {
        const key = `sailor_${frame % 2}`;
        if (!this._cache[key]) {
            this._cache[key] = drawSailorSprite(frame);
        }
        return this._cache[key];
    },

    getInuitGuide(frame) {
        const key = `inuit_${frame % 2}`;
        if (!this._cache[key]) {
            this._cache[key] = drawInuitGuideSprite(frame);
        }
        return this._cache[key];
    },

    getSledDog(frame) {
        const key = `dog_${frame % 2}`;
        if (!this._cache[key]) {
            this._cache[key] = drawSledDogSprite(frame);
        }
        return this._cache[key];
    },

    getItem(type) {
        const key = `item_${type}`;
        if (!this._cache[key]) {
            this._cache[key] = drawItemSprite(type);
        }
        return this._cache[key];
    },

    getTile(type) {
        const key = `tile_${type}`;
        if (!this._cache[key]) {
            this._cache[key] = drawTileSprite(type);
        }
        return this._cache[key];
    },

    clear() {
        this._cache = {};
    }
};
