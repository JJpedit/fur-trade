let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

// ITEMS (REAL PELT IMAGES + VALUES)
const items = [
  {
    name: "Wolf Pelt",
    value: 10,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg"
  },
  {
    name: "Beaver Pelt",
    value: 8,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg"
  },
  {
    name: "Fox Pelt",
    value: 6,
    img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg"
  },
  {
    name: "Food",
    value: 3,
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Meat_icon.png"
  }
];

// START ITEMS
for (let i = 0; i < 3; i++) {
  playerInventory.push(randomItem());
  traderInventory.push(randomItem());
}

// ---------------- HELPERS ----------------
function randomItem() {
  return items[Math.floor(Math.random() * items.length)];
}

function total(arr) {
  return arr.reduce((sum, item) => sum + item.value, 0);
}

// ---------------- RENDER ----------------
function render() {
  show("playerInv", playerInventory, addPlayer);
  show("traderInv", traderInventory, addTrader);
  show("playerOffer", playerOffer);
  show("traderOffer", traderOffer);

  document.getElementById("valueDisplay").innerText =
    "Your Offer: " + total(playerOffer) +
    " | Trader Offer: " + total(traderOffer);
}

function show(id, arr, clickFn) {
  let div = document.getElementById(id);
  div.innerHTML = "";

  arr.forEach((item, i) => {
    let el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <img src="${item.img}"><br>
      ${item.name}<br>
      💰 ${item.value}
    `;

    if (clickFn) el.onclick = () => clickFn(i);

    div.appendChild(el);
  });
}

// ---------------- INVENTORY CLICK ----------------
function addPlayer(index) {
  playerOffer.push(playerInventory[index]);
  playerInventory.splice(index, 1);
  render();
}

function addTrader(index) {
  traderOffer.push(traderInventory[index]);
  traderInventory.splice(index, 1);
  render();
}

// ---------------- HUNTING ----------------
function hunt() {
  let found = randomItem();
  playerInventory.push(found);

  document.getElementById("result").innerText =
    "🐺 You hunted and found: " + found.name;

  render();
}

// ---------------- TRADE ----------------
function attemptTrade() {
  let playerValue = total(playerOffer);
  let traderValue = total(traderOffer);

  let diff = Math.abs(playerValue - traderValue);

  if (playerOffer.length === 0 || traderOffer.length === 0) {
    document.getElementById("result").innerText =
      "❌ Both sides must offer items!";
    return;
  }

  if (diff <= 2) {
    // ACCEPT TRADE
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    playerOffer = [];
    traderOffer = [];

    document.getElementById("result").innerText =
      "✅ Trade accepted!";
  } else {
    // REJECT TRADE
    document.getElementById("result").innerText =
      "❌ Trade rejected (value too unfair)";
  }

  render();
}

// ---------------- RESET ----------------
function resetTrade() {
  playerInventory.push(...playerOffer);
  traderInventory.push(...traderOffer);

  playerOffer = [];
  traderOffer = [];

  document.getElementById("result").innerText =
    "🔄 Trade reset";

  render();
}

// INIT
render();
