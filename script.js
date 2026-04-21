
// ================= CANVAS =================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ================= WORLD =================
const world = {
  width: 2000,
  height: 1200
};

// ================= CAMERA =================
let camera = {
  x: 0,
  y: 0
};

// ================= PLAYER =================
let player = {
  x: 200,
  y: 200,
  size: 20,
  speed: 3,
  vx: 0,
  vy: 0
};

// ================= STATE =================
let state = "WORLD"; // WORLD / TRADE

// ================= INVENTORY =================
let inventory = [];
let money = 0;

// ================= KEYS =================
let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// ================= ITEMS =================
const items = {
  wolf: { name: "Wolf Pelt", value: 12 },
  beaver: { name: "Beaver Pelt", value: 8 },
  fox: { name: "Fox Pelt", value: 6 }
};

// ================= ANIMALS (AI) =================
let animals = [];

function spawnAnimals() {
  for (let i = 0; i < 20; i++) {
    const types = ["wolf", "beaver", "fox"];
    let t = types[Math.floor(Math.random() * types.length)];

    animals.push({
      type: t,
      x: Math.random() * world.width,
      y: Math.random() * world.height,
      alive: true,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1
    });
  }
}

// ================= TRADERS =================
let traders = [];

function spawnTraders() {
  traders = [
    { name: "Métis Trader", x: 500, y: 500, vx: 0.5, vy: 0.3 },
    { name: "European Merchant", x: 1200, y: 600, vx: -0.4, vy: 0.2 },
    { name: "Hudson Agent", x: 900, y: 300, vx: 0.3, vy: -0.3 }
  ];
}

let activeTrader = null;

// ================= INIT =================
spawnAnimals();
spawnTraders();

// ================= PLAYER UPDATE =================
function updatePlayer() {

  if (state !== "WORLD") return;

  if (keys["w"]) player.vy = -player.speed;
  else if (keys["s"]) player.vy = player.speed;
  else player.vy = 0;

  if (keys["a"]) player.vx = -player.speed;
  else if (keys["d"]) player.vx = player.speed;
  else player.vx = 0;

  player.x += player.vx;
  player.y += player.vy;

  // world bounds
  player.x = Math.max(0, Math.min(world.width, player.x));
  player.y = Math.max(0, Math.min(world.height, player.y));
}

// ================= CAMERA FOLLOW =================
function updateCamera() {
  camera.x = player.x - canvas.width / 2;
  camera.y = player.y - canvas.height / 2;
}

// ================= ANIMAL AI =================
function updateAnimals() {
  animals.forEach(a => {
    if (!a.alive) return;

    // wander
    a.x += a.vx;
    a.y += a.vy;

    // bounce
    if (a.x < 0 || a.x > world.width) a.vx *= -1;
    if (a.y < 0 || a.y > world.height) a.vy *= -1;

    // flee if player close
    let dist = Math.hypot(player.x - a.x, player.y - a.y);

    if (dist < 120) {
      a.vx += (a.x - player.x) * 0.01;
      a.vy += (a.y - player.y) * 0.01;
    }
  });
}

// ================= TRADER AI =================
function updateTraders() {
  traders.forEach(t => {
    t.x += t.vx;
    t.y += t.vy;

    if (t.x < 0 || t.x > world.width) t.vx *= -1;
    if (t.y < 0 || t.y > world.height) t.vy *= -1;

    let dist = Math.hypot(player.x - t.x, player.y - t.y);

    if (dist < 50 && keys["e"]) {
      enterTrade(t);
    }
  });
}

// ================= HUNT =================
function hunt() {
  animals.forEach(a => {
    if (!a.alive) return;

    let dist = Math.hypot(player.x - a.x, player.y - a.y);

    if (dist < 40) {
      inventory.push(items[a.type]);
      a.alive = false;

      document.getElementById("ui").innerText =
        "Hunted " + items[a.type].name;
    }
  });
}

// ================= TRADE SYSTEM =================
function enterTrade(trader) {
  state = "TRADE";
  activeTrader = trader;

  document.getElementById("ui").innerText =
    "Trading with " + trader.name;
}

function acceptTrade() {
  if (inventory.length === 0) return;

  let item = inventory.pop();
  money += item.value;

  document.getElementById("ui").innerText =
    "Sold " + item.name + " for $" + item.value;

  exitTrade();
}

function exitTrade() {
  state = "WORLD";
  activeTrader = null;
}

// ================= DRAW =================
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // ground
  ctx.fillStyle = "#6fbf73";
  ctx.fillRect(0, 0, world.width, world.height);

  // animals
  animals.forEach(a => {
    if (!a.alive) return;
    ctx.fillStyle = "brown";
    ctx.fillRect(a.x, a.y, 15, 15);
  });

  // traders
  traders.forEach(t => {
    ctx.fillStyle = "red";
    ctx.fillRect(t.x, t.y, 20, 20);
  });

  // player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.restore();
}

// ================= LOOP =================
function loop() {

  updatePlayer();
  updateCamera();

  if (state === "WORLD") {
    updateAnimals();
    updateTraders();

    if (keys[" "]) hunt();
  }

  draw();

  document.getElementById("info").innerText =
    "Money: $" + money +
    " | Inventory: " + inventory.length +
    " | State: " + state;

  requestAnimationFrame(loop);
}

loop();
