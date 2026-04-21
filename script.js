
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ---------------- PLAYER ----------------
let player = { x: 100, y: 100, speed: 3 };

// ---------------- GAME STATE ----------------
let state = "WORLD"; // WORLD or TRADE

let inventory = [];
let money = 0;

let activeTrader = null;

// ---------------- ITEMS ----------------
const items = [
  { name: "Wolf Pelt", value: 10 },
  { name: "Beaver Pelt", value: 8 },
  { name: "Fox Pelt", value: 6 }
];

// ---------------- TRADERS ----------------
let traders = [
  { name: "Métis Trader", x: 600, y: 200, greed: 0.2 },
  { name: "European Merchant", x: 300, y: 350, greed: 0.6 }
];

// ---------------- INPUT ----------------
document.addEventListener("keydown", (e) => {

  if (state === "WORLD") {
    if (e.key === "w") player.y -= player.speed;
    if (e.key === "s") player.y += player.speed;
    if (e.key === "a") player.x -= player.speed;
    if (e.key === "d") player.x += player.speed;
  }

});

// ---------------- WORLD UPDATE ----------------
function updateWorld() {

  traders.forEach(t => {
    let dist = Math.hypot(player.x - t.x, player.y - t.y);

    if (dist < 40) {
      enterTrade(t);
    }
  });

}

// ---------------- ENTER TRADE ----------------
function enterTrade(trader) {
  state = "TRADE";
  activeTrader = trader;

  document.getElementById("tradeUI").style.display = "block";

  document.getElementById("tradeText").innerText =
    trader.name + " wants to trade. They are " +
    (trader.greed < 0.4 ? "fair" : "greedy");
}

// ---------------- OFFER ITEM ----------------
function offerItem() {
  if (inventory.length === 0) return;

  inventory.pop();

  document.getElementById("tradeText").innerText =
    "You offered an item...";
}

// ---------------- TRADE AI ----------------
function acceptTrade() {

  let chance = Math.random();

  let successChance =
    activeTrader.greed < 0.4 ? 0.8 : 0.4;

  if (chance < successChance) {
    money += 10;
    document.getElementById("ui").innerText =
      "Trade successful! Money: " + money;
  } else {
    document.getElementById("ui").innerText =
      "Trade rejected.";
  }

  exitTrade();
}

// ---------------- EXIT ----------------
function exitTrade() {
  state = "WORLD";
  activeTrader = null;

  document.getElementById("tradeUI").style.display = "none";
}

// ---------------- DRAW ----------------
function draw() {

  ctx.clearRect(0,0,800,450);

  // player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);

  // traders
  traders.forEach(t => {
    ctx.fillStyle = "red";
    ctx.fillRect(t.x, t.y, 20, 20);
  });

}

// ---------------- LOOP ----------------
function loop() {

  if (state === "WORLD") {
    updateWorld();
  }

  draw();

  document.getElementById("info").innerText =
    "Money: $" + money + " | Inventory: " + inventory.length;

  requestAnimationFrame(loop);
}

loop();
