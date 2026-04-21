let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

let playerScore = 0;
let traderScore = 0;

let phase = "HUNT"; // HUNT → TRADE → RESET

const items = [
  { name: "Wolf Pelt", value: 10, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg" },
  { name: "Beaver Pelt", value: 8, img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg" },
  { name: "Fox Pelt", value: 6, img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg" },
  { name: "Food", value: 3, img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Meat_icon.png" }
];

// INIT
for (let i = 0; i < 3; i++) {
  playerInventory.push(randomItem());
  traderInventory.push(randomItem());
}

function randomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

function total(arr) {
  return arr.reduce((sum, i) => sum + i.value, 0);
}

// ---------------- RENDER ----------------
function render() {
  show("playerInv", playerInventory, addPlayer);
  show("traderInv", traderInventory, addTrader);
  show("playerOffer", playerOffer);
  show("traderOffer", traderOffer);

  document.getElementById("valueDisplay").innerText =
    `PHASE: ${phase} | YOU: ${playerScore} | TRADER: ${traderScore}`;
}

// ---------------- SHOW ITEMS ----------------
function show(id, arr, clickFn) {
  let div = document.getElementById(id);
  div.innerHTML = "";

  arr.forEach((item, i) => {
    let el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <img src="${item.img}">
      <br>${item.name}
      <br>💰 ${item.value}
    `;

    if (clickFn) el.onclick = () => clickFn(i);
    div.appendChild(el);
  });
}

// ---------------- HUNT PHASE ----------------
function hunt() {
  if (phase !== "HUNT") return;

  let found = randomItem();
  playerInventory.push(found);

  document.getElementById("result").innerText =
    `🐺 You hunted: ${found.name}`;

  phase = "TRADE";
  render();
}

// ---------------- TRADE CLICK ----------------
function addPlayer(i) {
  if (phase !== "TRADE") return;

  playerOffer.push(playerInventory[i]);
  playerInventory.splice(i, 1);

  render();
}

function addTrader(i) {
  if (phase !== "TRADE") return;

  traderOffer.push(traderInventory[i]);
  traderInventory.splice(i, 1);

  render();
}

// ---------------- NPC AI ----------------
function traderDecision() {
  let p = total(playerOffer);
  let t = total(traderOffer);

  if (p >= t - 2) {
    return Math.random() > 0.2; // mostly accepts fair trades
  } else {
    return Math.random() > 0.7; // usually rejects bad trades
  }
}

// ---------------- TRADE ----------------
function attemptTrade() {
  if (phase !== "TRADE") return;

  let npcAccept = traderDecision();

  let dialogue = npcAccept
    ? "🤝 Trader: 'Fair deal... I accept.'"
    : "❌ Trader: 'This is not worth it.'";

  document.getElementById("result").innerText = dialogue;

  if (npcAccept) {
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    let p = total(playerOffer);
    let t = total(traderOffer);

    playerScore += t;
    traderScore += p;

    playerOffer = [];
    traderOffer = [];

    phase = "HUNT";
  }

  render();
}

// ---------------- RESET ----------------
function resetTrade() {
  playerInventory.push(...playerOffer);
  traderInventory.push(...traderOffer);

  playerOffer = [];
  traderOffer = [];

  phase = "HUNT";

  document.getElementById("result").innerText = "🔄 Reset complete";

  render();
}

// ---------------- WIN ----------------
function checkWin() {
  if (playerScore >= 50) {
    document.getElementById("result").innerText = "🏆 YOU DOMINATE THE FUR TRADE!";
  }

  if (traderScore >= 50) {
    document.getElementById("result").innerText = "💀 TRADER CONTROLS THE MARKET!";
  }
}

setInterval(checkWin, 1000);

render();
