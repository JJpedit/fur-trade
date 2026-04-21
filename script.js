let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

let playerAccepted = false;
let traderAccepted = false;

let playerScore = 0;
let traderScore = 0;

// ITEMS (values will change slightly over time)
const baseItems = [
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

// clone items so we can modify values over time
function getItems() {
  return baseItems.map(item => {
    return {
      ...item,
      value: item.value + Math.floor(Math.random() * 3 - 1) // -1 to +1 change
    };
  });
}

// START GAME
function init() {
  let items = getItems();

  for (let i = 0; i < 3; i++) {
    playerInventory.push(randomItem(items));
    traderInventory.push(randomItem(items));
  }

  render();
}

// RANDOM ITEM
function randomItem(list = baseItems) {
  return list[Math.floor(Math.random() * list.length)];
}

// TOTAL VALUE
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
    `Your Score: ${playerScore} | Trader Score: ${traderScore}`;

  checkWinner();
}

// DISPLAY ITEMS
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

// ---------------- PLAYER ACTIONS ----------------
function addPlayer(i) {
  playerOffer.push(playerInventory[i]);
  playerInventory.splice(i, 1);
  playerAccepted = false;
  traderAccepted = false;
  render();
}

function addTrader(i) {
  traderOffer.push(traderInventory[i]);
  traderInventory.splice(i, 1);
  playerAccepted = false;
  traderAccepted = false;
  render();
}

// ---------------- ACCEPT SYSTEM ----------------
function attemptTrade() {
  playerAccepted = true;

  // NPC decides automatically
  let playerVal = total(playerOffer);
  let traderVal = total(traderOffer);

  if (traderVal < playerVal - 2) {
    traderAccepted = false;
  } else {
    traderAccepted = Math.random() > 0.3; // NPC sometimes refuses
  }

  document.getElementById("result").innerText =
    `You: ${playerAccepted ? "✔" : "❌"} | Trader: ${traderAccepted ? "✔" : "❌"}`;

  resolveTrade();
}

// ---------------- TRADE LOGIC ----------------
function resolveTrade() {
  if (playerAccepted && traderAccepted) {
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    let pVal = total(playerOffer);
    let tVal = total(traderOffer);

    playerScore += tVal;
    traderScore += pVal;

    playerOffer = [];
    traderOffer = [];

    document.getElementById("result").innerText = "✅ Trade completed!";
  }

  render();
}

// ---------------- RESET ----------------
function resetTrade() {
  playerInventory.push(...playerOffer);
  traderInventory.push(...traderOffer);

  playerOffer = [];
  traderOffer = [];

  playerAccepted = false;
  traderAccepted = false;

  document.getElementById("result").innerText = "🔄 Reset trade";

  render();
}

// ---------------- WIN CONDITION ----------------
function checkWinner() {
  if (playerScore >= 50) {
    document.getElementById("result").innerText = "🏆 YOU WIN THE FUR TRADE!";
  }

  if (traderScore >= 50) {
    document.getElementById("result").innerText = "💀 TRADER DOMINATES THE MARKET!";
  }
}

init();
