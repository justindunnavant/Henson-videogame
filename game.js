// ============================================================
// GAME.JS - Main game engine for Matthew Henson's Adventure
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctxMain = canvas.getContext('2d');
ctxMain.imageSmoothingEnabled = false;

// ============================================================
// CONSTANTS
// ============================================================
const CANVAS_W = 512;
const CANVAS_H = 480;
const HUD_H = 48;
const GAME_H = CANVAS_H - HUD_H;
const COLS = 16;
const ROWS = 13;
const TILE_W = CANVAS_W / COLS;   // 32
const TILE_H = GAME_H / ROWS;     // ~33.23 -> we'll use 32 and offset
const RENDER_TILE = 32;
const PLAYER_SPEED = 2;
const ANIM_SPEED = 8; // frames per animation tick

// ============================================================
// GAME STATE
// ============================================================
const Game = {
    state: 'title', // title, story, playing, level_complete, win, dialog
    level: 1,
    currentRoom: null,
    roomData: null,

    // Player
    player: {
        x: 0, y: 0,           // pixel position
        tileX: 0, tileY: 0,   // grid position (for reference)
        dir: 'down',
        frame: 0,
        animTimer: 0,
        moving: false,
    },

    // Inventory
    inventory: [],
    sledDogCount: 0,

    // Room state (tracks collected items per room)
    collectedItems: {},

    // NPCs and items in current room
    activeItems: [],
    activeNPCs: [],

    // Dialog
    dialogLines: [],
    dialogIndex: 0,
    dialogSpeaker: '',

    // Message popup
    messageText: '',
    messageTimer: 0,

    // Story text
    storyLines: [],

    // Input
    keys: {},
    justPressed: {},

    // Animation
    globalFrame: 0,
    lastTime: 0,

    // Transition
    transitioning: false,
    transitionAlpha: 0,
    transitionCallback: null,
    transitionCooldown: 0,
};

// ============================================================
// INPUT HANDLING
// ============================================================
document.addEventListener('keydown', (e) => {
    if (!Game.keys[e.key]) {
        Game.justPressed[e.key] = true;
    }
    Game.keys[e.key] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    Game.keys[e.key] = false;
    e.preventDefault();
});

function isPressed(key) {
    return Game.justPressed[key] || false;
}

function isHeld(key) {
    return Game.keys[key] || false;
}

function clearJustPressed() {
    Game.justPressed = {};
}

// ============================================================
// LEVEL / ROOM MANAGEMENT
// ============================================================
function loadRoom(roomId, playerX, playerY) {
    const rooms = Game.level === 1 ? LEVEL1_ROOMS : LEVEL2_ROOMS;
    const room = rooms[roomId];
    if (!room) {
        console.error('Room not found:', roomId);
        return;
    }

    Game.currentRoom = roomId;
    Game.roomData = room;
    Game.transitionCooldown = 30; // ignore door/exit checks for 30 frames after room load

    // Set player position
    const startX = playerX !== undefined ? playerX : room.playerStart.x;
    const startY = playerY !== undefined ? playerY : room.playerStart.y;
    Game.player.x = startX * RENDER_TILE;
    Game.player.y = startY * RENDER_TILE;
    Game.player.tileX = startX;
    Game.player.tileY = startY;

    // Load items for this room (filter out already collected ones)
    const roomKey = `${Game.level}_${roomId}`;
    if (!Game.collectedItems[roomKey]) {
        Game.collectedItems[roomKey] = new Set();
    }

    Game.activeItems = [];
    if (room.items) {
        room.items.forEach((item, idx) => {
            if (!Game.collectedItems[roomKey].has(idx)) {
                Game.activeItems.push({ ...item, idx });
            }
        });
    }

    // Load NPCs
    Game.activeNPCs = room.npcs ? room.npcs.map(n => ({ ...n })) : [];

    // Update HUD
    updateHUD();
}

function startLevel(level) {
    Game.level = level;
    Game.currentRoom = null;
    Game.inventory = [];
    Game.sledDogCount = 0;
    Game.collectedItems = {};

    if (level === 1) {
        loadRoom('main_deck');
    } else {
        loadRoom('base_camp');
    }

    updateHUD();
}

// ============================================================
// COLLISION DETECTION
// ============================================================
function getTileAt(gridX, gridY) {
    if (!Game.roomData || !Game.roomData.map) return 'W';
    if (gridY < 0 || gridY >= Game.roomData.map.length) return 'W';
    if (gridX < 0 || gridX >= Game.roomData.map[0].length) return 'W';
    return Game.roomData.map[gridY][gridX];
}

function isSolid(gridX, gridY) {
    const tile = getTileAt(gridX, gridY);
    const solidSet = Game.level === 1 ? SOLID_TILES_BOAT : SOLID_TILES_ARCTIC;
    return solidSet.has(tile);
}

function checkCollision(px, py, width, height) {
    // Check all four corners of the hitbox
    const margin = 4; // pixel margin for easier navigation
    const left = px + margin;
    const right = px + width - margin;
    const top = py + margin;
    const bottom = py + height - margin;

    const tlX = Math.floor(left / RENDER_TILE);
    const tlY = Math.floor(top / RENDER_TILE);
    const trX = Math.floor(right / RENDER_TILE);
    const trY = Math.floor(top / RENDER_TILE);
    const blX = Math.floor(left / RENDER_TILE);
    const blY = Math.floor(bottom / RENDER_TILE);
    const brX = Math.floor(right / RENDER_TILE);
    const brY = Math.floor(bottom / RENDER_TILE);

    return isSolid(tlX, tlY) || isSolid(trX, trY) ||
           isSolid(blX, blY) || isSolid(brX, brY);
}

function checkNPCCollision(px, py) {
    const margin = 4;
    for (const npc of Game.activeNPCs) {
        const nx = npc.x * RENDER_TILE;
        const ny = npc.y * RENDER_TILE;
        if (px + RENDER_TILE - margin > nx && px + margin < nx + RENDER_TILE &&
            py + RENDER_TILE - margin > ny && py + margin < ny + RENDER_TILE) {
            return true;
        }
    }
    return false;
}

// ============================================================
// PLAYER MOVEMENT
// ============================================================
function updatePlayer() {
    if (Game.state !== 'playing' || Game.transitioning) return;

    if (Game.transitionCooldown > 0) Game.transitionCooldown--;

    let dx = 0, dy = 0;
    let newDir = Game.player.dir;
    let moving = false;

    if (isHeld('ArrowUp') || isHeld('w')) { dy = -PLAYER_SPEED; newDir = 'up'; moving = true; }
    if (isHeld('ArrowDown') || isHeld('s')) { dy = PLAYER_SPEED; newDir = 'down'; moving = true; }
    if (isHeld('ArrowLeft') || isHeld('a')) { dx = -PLAYER_SPEED; newDir = 'left'; moving = true; }
    if (isHeld('ArrowRight') || isHeld('d')) { dx = PLAYER_SPEED; newDir = 'right'; moving = true; }

    Game.player.dir = newDir;
    Game.player.moving = moving;

    if (moving) {
        Game.player.animTimer++;
        if (Game.player.animTimer >= ANIM_SPEED) {
            Game.player.animTimer = 0;
            Game.player.frame++;
        }
    } else {
        Game.player.frame = 0;
        Game.player.animTimer = 0;
    }

    // Try X movement
    const newX = Game.player.x + dx;
    if (!checkCollision(newX, Game.player.y, RENDER_TILE, RENDER_TILE) &&
        !checkNPCCollision(newX, Game.player.y)) {
        Game.player.x = newX;
    }

    // Try Y movement
    const newY = Game.player.y + dy;
    if (!checkCollision(Game.player.x, newY, RENDER_TILE, RENDER_TILE) &&
        !checkNPCCollision(Game.player.x, newY)) {
        Game.player.y = newY;
    }

    // Clamp to room bounds
    Game.player.x = Math.max(0, Math.min(Game.player.x, (COLS - 1) * RENDER_TILE));
    Game.player.y = Math.max(0, Math.min(Game.player.y, (ROWS - 1) * RENDER_TILE));

    Game.player.tileX = Math.floor((Game.player.x + RENDER_TILE / 2) / RENDER_TILE);
    Game.player.tileY = Math.floor((Game.player.y + RENDER_TILE / 2) / RENDER_TILE);

    // Check item pickups
    checkItemPickup();

    // Check door/exit transitions
    checkTransitions();
}

// ============================================================
// ITEM PICKUP
// ============================================================
function checkItemPickup() {
    const px = Game.player.tileX;
    const py = Game.player.tileY;

    for (let i = Game.activeItems.length - 1; i >= 0; i--) {
        const item = Game.activeItems[i];
        if (Math.abs(px - item.x) <= 0 && Math.abs(py - item.y) <= 0) {
            // Pick up item
            if (item.type === 'sleddog') {
                Game.sledDogCount++;
            }

            if (!Game.inventory.includes(item.type)) {
                Game.inventory.push(item.type);
            }

            // Mark as collected
            const roomKey = `${Game.level}_${Game.currentRoom}`;
            Game.collectedItems[roomKey].add(item.idx);

            // Remove from active
            Game.activeItems.splice(i, 1);

            // Show message
            showMessage(item.message);

            // Update HUD
            updateHUD();

            // Check level completion
            checkLevelComplete();
        }
    }
}

// ============================================================
// DOOR/EXIT TRANSITIONS
// ============================================================
function checkTransitions() {
    if (Game.transitionCooldown > 0) return;

    const px = Game.player.tileX;
    const py = Game.player.tileY;

    // Check doors (Level 1)
    if (Game.roomData.doors) {
        for (const door of Game.roomData.doors) {
            if (px === door.x && py === door.y) {
                doTransition(() => {
                    loadRoom(door.target, door.targetX, door.targetY);
                });
                return;
            }
        }
    }

    // Check exits (Level 2 - screen edge transitions)
    if (Game.roomData.exits) {
        for (const exit of Game.roomData.exits) {
            let match = false;
            if (exit.dir === 'right' && Game.player.x >= (COLS - 1) * RENDER_TILE && py === exit.y) {
                match = true;
            } else if (exit.dir === 'left' && Game.player.x <= 0 && py === exit.y) {
                match = true;
            }
            if (match) {
                doTransition(() => {
                    loadRoom(exit.target, exit.targetX, exit.targetY);
                });
                return;
            }
        }
    }
}

// ============================================================
// INTERACTION (SPACE key)
// ============================================================
function checkInteraction() {
    if (Game.state !== 'playing') return;

    const px = Game.player.tileX;
    const py = Game.player.tileY;

    // Check NPCs in adjacent/nearby tiles
    for (const npc of Game.activeNPCs) {
        const dist = Math.abs(px - npc.x) + Math.abs(py - npc.y);
        if (dist <= 2) {
            startDialog(npc.dialog, npc.type === 'inuit' ? 'Inuit Guide' : 'Sailor');
            return;
        }
    }

    // Check meteorite in level 2
    if (Game.level === 2 && Game.roomData.meteorite) {
        const met = Game.roomData.meteorite;
        const dist = Math.abs(px - met.x) + Math.abs(py - met.y);
        if (dist <= 2) {
            // Check if player has all required items
            const hasAll = checkLevel2Complete();
            if (hasAll) {
                showVictory();
            } else {
                showMessage("The meteorite is here! But you need all your gear and dogs first.");
            }
        }
    }
}

// ============================================================
// DIALOG SYSTEM
// ============================================================
function startDialog(lines, speaker) {
    Game.state = 'dialog';
    Game.dialogLines = lines;
    Game.dialogIndex = 0;
    Game.dialogSpeaker = speaker || '';
}

function advanceDialog() {
    Game.dialogIndex++;
    if (Game.dialogIndex >= Game.dialogLines.length) {
        Game.state = 'playing';
        Game.dialogLines = [];
        Game.dialogIndex = 0;
    }
}

// ============================================================
// MESSAGE POPUP
// ============================================================
function showMessage(text) {
    Game.messageText = text;
    Game.messageTimer = 180; // 3 seconds at 60fps
}

// ============================================================
// LEVEL COMPLETION
// ============================================================
function checkLevelComplete() {
    if (Game.level === 1) {
        const required = LEVEL1_REQUIRED;
        const hasAll = required.every(item => Game.inventory.includes(item));
        if (hasAll) {
            setTimeout(() => {
                Game.state = 'level_complete';
                showScreen('level-complete-screen');
                document.getElementById('level-complete-title').textContent = STORY_TEXTS.level1_complete.title;
                document.getElementById('level-complete-text').textContent = STORY_TEXTS.level1_complete.text.join('\n');
            }, 1500);
        }
    }
}

function checkLevel2Complete() {
    return Game.sledDogCount >= 3 &&
           Game.inventory.includes('harness') &&
           Game.inventory.includes('sled') &&
           Game.inventory.includes('supplies');
}

function showVictory() {
    Game.state = 'win';
    showScreen('win-screen');
    document.getElementById('win-text').textContent = STORY_TEXTS.victory.join('\n');
}

// ============================================================
// TRANSITIONS - instant room swap with brief flash
// ============================================================
function doTransition(callback) {
    if (Game.transitioning) return;
    Game.transitioning = true;
    Game.transitionAlpha = 1;
    if (callback) callback();
    // Brief flash then fade back in
    Game.transitionCallback = null;
}

function updateTransition() {
    if (!Game.transitioning) return;

    Game.transitionAlpha -= 0.12;
    if (Game.transitionAlpha <= 0) {
        Game.transitionAlpha = 0;
        Game.transitioning = false;
    }
}

// ============================================================
// HUD
// ============================================================
function updateHUD() {
    const levelNames = {
        1: 'Level 1: The Ship',
        2: 'Level 2: The Arctic'
    };
    document.getElementById('hud-level').textContent = levelNames[Game.level] || '';

    const hudItems = document.getElementById('hud-items');
    hudItems.innerHTML = '';

    const required = Game.level === 1 ? LEVEL1_REQUIRED : LEVEL2_REQUIRED;

    required.forEach(itemType => {
        const div = document.createElement('div');
        div.className = 'hud-item';

        let collected = Game.inventory.includes(itemType);
        // Special case for sled dogs - show count
        if (itemType === 'sleddog') {
            collected = Game.sledDogCount >= 3;
        }

        if (collected) {
            div.classList.add('collected');
        }

        // Draw mini sprite
        const miniCanvas = document.createElement('canvas');
        miniCanvas.width = 24;
        miniCanvas.height = 24;
        miniCanvas.style.width = '24px';
        miniCanvas.style.height = '24px';
        const miniCtx = miniCanvas.getContext('2d');
        miniCtx.imageSmoothingEnabled = false;

        const sprite = SpriteCache.getItem(itemType);
        miniCtx.drawImage(sprite, 0, 0, 16, 16, 2, 2, 20, 20);

        if (!collected) {
            miniCtx.fillStyle = 'rgba(0,0,0,0.5)';
            miniCtx.fillRect(0, 0, 24, 24);
        }

        div.appendChild(miniCanvas);

        // Show dog count
        if (itemType === 'sleddog') {
            const count = document.createElement('span');
            count.style.cssText = 'font-size:9px;color:#f0c040;position:absolute;bottom:1px;right:1px;';
            count.textContent = `${Game.sledDogCount}/3`;
            div.style.position = 'relative';
            div.appendChild(count);
        }

        hudItems.appendChild(div);
    });
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (id) {
        document.getElementById(id).classList.add('active');
    }
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
}

// ============================================================
// RENDERING
// ============================================================
function render() {
    // Clear
    ctxMain.fillStyle = '#000';
    ctxMain.fillRect(0, 0, CANVAS_W, CANVAS_H);

    if (Game.state === 'title' || Game.state === 'story' ||
        Game.state === 'level_complete' || Game.state === 'win') {
        return; // Overlays handle these states
    }

    // Offset for HUD
    ctxMain.save();
    ctxMain.translate(0, HUD_H);

    // Draw tiles
    renderTiles();

    // Draw items
    renderItems();

    // Draw NPCs
    renderNPCs();

    // Draw meteorite (Level 2)
    if (Game.level === 2 && Game.roomData && Game.roomData.meteorite) {
        renderMeteorite();
    }

    // Draw player
    renderPlayer();

    // Draw dialog box
    if (Game.state === 'dialog') {
        renderDialog();
    }

    // Draw message popup
    if (Game.messageTimer > 0) {
        renderMessage();
    }

    // Draw transition overlay
    if (Game.transitioning) {
        ctxMain.fillStyle = `rgba(0,0,0,${Game.transitionAlpha})`;
        ctxMain.fillRect(0, 0, CANVAS_W, GAME_H);
    }

    ctxMain.restore();
}

function renderTiles() {
    if (!Game.roomData || !Game.roomData.map) return;

    const tileLookup = Game.level === 1 ? TILE_LOOKUP_BOAT : TILE_LOOKUP_ARCTIC;

    for (let row = 0; row < ROWS; row++) {
        const line = Game.roomData.map[row];
        if (!line) continue;
        for (let col = 0; col < COLS; col++) {
            const ch = line[col];
            if (!ch) continue;
            const tileType = tileLookup[ch];
            if (!tileType) continue;

            const sprite = SpriteCache.getTile(tileType);
            ctxMain.drawImage(sprite, 0, 0, 16, 16, col * RENDER_TILE, row * RENDER_TILE, RENDER_TILE, RENDER_TILE);
        }
    }
}

function renderItems() {
    for (const item of Game.activeItems) {
        const sprite = SpriteCache.getItem(item.type);
        // Bobbing animation
        const bob = Math.sin(Game.globalFrame * 0.1 + item.x) * 2;
        ctxMain.drawImage(sprite, 0, 0, 16, 16,
            item.x * RENDER_TILE, item.y * RENDER_TILE + bob, RENDER_TILE, RENDER_TILE);

        // Sparkle effect
        if (Game.globalFrame % 30 < 15) {
            ctxMain.fillStyle = 'rgba(255, 255, 200, 0.5)';
            ctxMain.fillRect(item.x * RENDER_TILE + 4, item.y * RENDER_TILE + bob - 2, 4, 4);
        }
    }
}

function renderNPCs() {
    for (const npc of Game.activeNPCs) {
        let sprite;
        if (npc.type === 'sailor') {
            sprite = SpriteCache.getSailor(Game.globalFrame);
        } else if (npc.type === 'inuit') {
            sprite = SpriteCache.getInuitGuide(Game.globalFrame);
        }
        if (sprite) {
            ctxMain.drawImage(sprite, 0, 0, 16, 16,
                npc.x * RENDER_TILE, npc.y * RENDER_TILE, RENDER_TILE, RENDER_TILE);

            // Interaction indicator
            const px = Game.player.tileX;
            const py = Game.player.tileY;
            const dist = Math.abs(px - npc.x) + Math.abs(py - npc.y);
            if (dist <= 2 && Game.state === 'playing') {
                // Draw "!" bubble
                const bubbleY = npc.y * RENDER_TILE - 10 + Math.sin(Game.globalFrame * 0.15) * 2;
                ctxMain.fillStyle = '#fff';
                ctxMain.fillRect(npc.x * RENDER_TILE + 12, bubbleY, 10, 12);
                ctxMain.fillStyle = '#000';
                ctxMain.font = '10px monospace';
                ctxMain.fillText('!', npc.x * RENDER_TILE + 15, bubbleY + 10);
            }
        }
    }
}

function renderMeteorite() {
    const met = Game.roomData.meteorite;
    const sprite = SpriteCache.getItem('meteorite');

    // Glow effect
    const glowSize = 48 + Math.sin(Game.globalFrame * 0.05) * 8;
    const glowAlpha = 0.2 + Math.sin(Game.globalFrame * 0.08) * 0.1;
    ctxMain.fillStyle = `rgba(240, 128, 48, ${glowAlpha})`;
    ctxMain.beginPath();
    ctxMain.arc(
        met.x * RENDER_TILE + RENDER_TILE / 2,
        met.y * RENDER_TILE + RENDER_TILE / 2,
        glowSize / 2, 0, Math.PI * 2
    );
    ctxMain.fill();

    ctxMain.drawImage(sprite, 0, 0, 16, 16,
        met.x * RENDER_TILE, met.y * RENDER_TILE, RENDER_TILE, RENDER_TILE);
}

function renderPlayer() {
    const sprite = SpriteCache.getHenson(Game.player.dir, Game.player.frame);
    ctxMain.drawImage(sprite, 0, 0, 16, 16,
        Game.player.x, Game.player.y, RENDER_TILE, RENDER_TILE);
}

function renderDialog() {
    // Dialog box at bottom
    const boxH = 80;
    const boxY = GAME_H - boxH - 8;
    const boxX = 16;
    const boxW = CANVAS_W - 32;

    // Box background
    ctxMain.fillStyle = 'rgba(0, 0, 40, 0.92)';
    ctxMain.fillRect(boxX, boxY, boxW, boxH);

    // Border
    ctxMain.strokeStyle = '#f0c040';
    ctxMain.lineWidth = 2;
    ctxMain.strokeRect(boxX, boxY, boxW, boxH);

    // Speaker name
    if (Game.dialogSpeaker) {
        ctxMain.fillStyle = '#f0c040';
        ctxMain.font = 'bold 12px monospace';
        ctxMain.fillText(Game.dialogSpeaker, boxX + 12, boxY + 18);
    }

    // Dialog text
    ctxMain.fillStyle = '#ffffff';
    ctxMain.font = '12px monospace';
    const line = Game.dialogLines[Game.dialogIndex] || '';
    wrapText(ctxMain, line, boxX + 12, boxY + 36, boxW - 24, 16);

    // Continue prompt
    if (Game.globalFrame % 40 < 25) {
        ctxMain.fillStyle = '#f0c040';
        ctxMain.fillText('>>> SPACE', boxX + boxW - 90, boxY + boxH - 10);
    }
}

function renderMessage() {
    const boxW = CANVAS_W - 32;
    const boxH = 48;
    const boxX = 16;
    const boxY = 8;

    // Fade out in last 60 frames
    let alpha = 1;
    if (Game.messageTimer < 60) {
        alpha = Game.messageTimer / 60;
    }

    ctxMain.globalAlpha = alpha;

    ctxMain.fillStyle = 'rgba(40, 80, 40, 0.95)';
    ctxMain.fillRect(boxX, boxY, boxW, boxH);
    ctxMain.strokeStyle = '#80f080';
    ctxMain.lineWidth = 2;
    ctxMain.strokeRect(boxX, boxY, boxW, boxH);

    ctxMain.fillStyle = '#ffffff';
    ctxMain.font = '11px monospace';
    wrapText(ctxMain, Game.messageText, boxX + 10, boxY + 16, boxW - 20, 15);

    ctxMain.globalAlpha = 1;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), x, currentY);
            line = word + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), x, currentY);
}

// ============================================================
// UPDATE LOOP
// ============================================================
function update() {
    Game.globalFrame++;

    // Handle transitions
    updateTransition();

    switch (Game.state) {
        case 'title':
            if (isPressed('Enter')) {
                Game.state = 'story';
                Game.storyLines = STORY_TEXTS.intro;
                document.getElementById('story-text').textContent = Game.storyLines.join('\n');
                showScreen('story-screen');
            }
            break;

        case 'story':
            if (isPressed('Enter')) {
                hideAllScreens();
                if (Game.level === 0 || Game.currentRoom === null) {
                    Game.level = 1;
                    startLevel(1);
                }
                Game.state = 'playing';
            }
            break;

        case 'playing':
            updatePlayer();

            // Space to interact
            if (isPressed(' ')) {
                checkInteraction();
            }

            // Update message timer
            if (Game.messageTimer > 0) {
                Game.messageTimer--;
            }
            break;

        case 'dialog':
            if (isPressed(' ') || isPressed('Enter')) {
                advanceDialog();
            }
            break;

        case 'level_complete':
            if (isPressed('Enter')) {
                hideAllScreens();
                Game.level = 2;
                Game.state = 'story';
                Game.storyLines = STORY_TEXTS.level2_intro;
                document.getElementById('story-text').textContent = Game.storyLines.join('\n');
                showScreen('story-screen');

                // When story finishes, start level 2
                Game.currentRoom = null;
                startLevel(2);
            }
            break;

        case 'win':
            if (isPressed('Enter')) {
                // Reset game
                hideAllScreens();
                showScreen('title-screen');
                Game.state = 'title';
                Game.level = 0;
                Game.inventory = [];
                Game.sledDogCount = 0;
                Game.collectedItems = {};
            }
            break;
    }

    clearJustPressed();
}

// ============================================================
// GAME LOOP
// ============================================================
let _loopId = null;

function gameLoop() {
    update();
    render();
    _loopId = requestAnimationFrame(gameLoop);
}

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
    console.log("Matthew Henson's Arctic Adventures - Initializing...");

    // Show title screen
    Game.state = 'title';
    Game.level = 0;
    Game.lastTime = 0;
    showScreen('title-screen');

    // Cancel any existing game loop and start fresh
    if (_loopId) cancelAnimationFrame(_loopId);
    _loopId = requestAnimationFrame(gameLoop);
}

// Start when page loads
window.addEventListener('load', init);
