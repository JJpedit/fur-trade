let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

let playerScore = 0;
let traderScore = 0;

let phase = "HUNT"; // HUNT → TRADE → HUNT

const items = [
  { name: "Wolf Pelt", value: 10, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg" },
  { name: "Beaver Pelt", value: 8, img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg" },
  { name: "Fox Pelt", value: 6, img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg" },
  { name: "Food Supply", value: 3, img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Meat_icon.png" }
];

// START GAME
for (let i = 0; i < 3; i++) {
  playerInventory.push(randomItem());
  traderInventory.push(randomItem());
}

// ---------------- HELPERS ----------------
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
    "Phase: " + phase +
    " | Player Score: " + playerScore +
    " | Trader Score: " + traderScore;
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
      <br>Value: ${item.value}
    `;

    if (clickFn) el.onclick = () => clickFn(i);
    div.appendChild(el);
  });
}

// ---------------- HUNT SYSTEM ----------------
function hunt() {
  if (phase !== "HUNT") return;

  let found = randomItem();
  playerInventory.push(found);

  document.getElementById("result").innerText =
    "You hunted and found: " + found.name;

  phase = "TRADE";
  render();
}

// ---------------- TRADE SELECTION ----------------
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
function traderAccepts() {
  let p = total(playerOffer);
  let t = total(traderOffer);

  let fairness = p - t;

  if (fairness >= -2 && fairness <= 2) {
    return Math.random() > 0.2;
  }

  if (fairness > 2) {
    return true; // trader benefits
  }

  return Math.random() > 0.6; // unfair deal usually rejected
}

// ---------------- TRADE ----------------
function attemptTrade() {
  if (phase !== "TRADE") return;

  if (playerOffer.length === 0 || traderOffer.length === 0) {
    document.getElementById("result").innerText =
      "Both sides must place items first.";
    return;
  }

  let accepted = traderAccepts();

  if (accepted) {
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    playerScore += total(traderOffer);
    traderScore += total(playerOffer);

    playerOffer = [];
    traderOffer = [];

    document.getElementById("result").innerText =
      "Trade accepted. Deal completed.";

    phase = "HUNT";
  } else {
    document.getElementById("result").innerText =
      "Trade rejected by trader.";
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

  document.getElementById("result").innerText =
    "Trade reset.";

  render();
}

// ---------------- WIN CHECK ----------------
function checkWin() {
  if (playerScore >= 50) {
    document.getElementById("result").innerText =
      "Player wins the fur trade economy.";
  }

  if (traderScore >= 50) {
    document.getElementById("result").innerText =
      "Trader dominates the market.";
  }
}

setInterval(checkWin, 1000);

render();
