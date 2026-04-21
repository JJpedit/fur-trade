let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

let playerMoney = 0;
let traderMoney = 0;

let day = 1;

// ---------------- ITEM DATABASE ----------------
const baseItems = [
  {
    key: "wolf",
    name: "Wolf Pelt",
    baseValue: 12,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg"
  },
  {
    key: "beaver",
    name: "Beaver Pelt",
    baseValue: 8,
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg"
  },
  {
    key: "fox",
    name: "Fox Pelt",
    baseValue: 6,
    img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg"
  }
];

// ---------------- AI ECONOMY ----------------
function getMarketValue(item) {
  let fluctuation = Math.floor(Math.random() * 5 - 2); // -2 to +2
  return Math.max(1, item.baseValue + fluctuation);
}

// ---------------- INITIAL SETUP ----------------
for (let i = 0; i < 3; i++) {
  playerInventory.push(spawnAnimal());
  traderInventory.push(spawnAnimal());
}

function spawnAnimal() {
  let item = baseItems[Math.floor(Math.random() * baseItems.length)];
  return { ...item, value: getMarketValue(item) };
}

// ---------------- HUNTING SYSTEM ----------------
function hunt(type) {
  let item = baseItems.find(i => i.key === type);

  let hunted = {
    ...item,
    value: getMarketValue(item)
  };

  playerInventory.push(hunted);

  document.getElementById("result").innerText =
    "You hunted a " + hunted.name;

  render();
}

// ---------------- AI TRADER BRAIN ----------------
function aiThink() {
  let playerValue = total(playerOffer);
  let traderValue = total(traderOffer);

  let fairness = playerValue - traderValue;

  // AI personality system
  let greed = Math.random(); // 0-1

  if (fairness >= -2 && fairness <= 2) return true;

  if (fairness > 2) return true; // trader benefits

  if (fairness < -2) {
    return greed > 0.6 ? true : false; // sometimes accepts bad deal
  }

  return false;
}

// ---------------- TRADE ----------------
function acceptTrade() {
  if (playerOffer.length === 0 || traderOffer.length === 0) {
    document.getElementById("result").innerText =
      "Both sides must place items first.";
    return;
  }

  let accepted = aiThink();

  if (accepted) {
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    let p = total(playerOffer);
    let t = total(traderOffer);

    playerMoney += t;
    traderMoney += p;

    playerOffer = [];
    traderOffer = [];

    document.getElementById("result").innerText =
      "Trade accepted by AI trader.";
  } else {
    document.getElementById("result").innerText =
      "AI trader rejected the offer.";
  }

  nextDay();
  render();
}

// ---------------- DAY SYSTEM ----------------
function nextDay() {
  day++;

  // restock world
  if (Math.random() > 0.5) {
    traderInventory.push(spawnAnimal());
  }
}

// ---------------- TOTAL VALUE ----------------
function total(arr) {
  return arr.reduce((sum, i) => sum + i.value, 0);
}

// ---------------- INVENTORY MOVE ----------------
function addPlayer(i) {
  playerOffer.push(playerInventory[i]);
  playerInventory.splice(i, 1);
  render();
}

function addTrader(i) {
  traderOffer.push(traderInventory[i]);
  traderInventory.splice(i, 1);
  render();
}

// ---------------- RENDER ----------------
function render() {
  show("playerInv", playerInventory, addPlayer);
  show("traderInv", traderInventory, addTrader);
  show("playerOffer", playerOffer);
  show("traderOffer", traderOffer);

  document.getElementById("info").innerText =
    "Day " + day +
    " | Your Money: " + playerMoney +
    " | AI Money: " + traderMoney;

  checkWin();
}

// ---------------- DISPLAY ----------------
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

// ---------------- WIN CONDITION ----------------
function checkWin() {
  if (playerMoney >= 100) {
    document.getElementById("result").innerText =
      "YOU DOMINATE THE FUR TRADE ECONOMY!";
  }

  if (traderMoney >= 100) {
    document.getElementById("result").innerText =
      "AI CONTROLS THE MARKET!";
  }
}

render();
