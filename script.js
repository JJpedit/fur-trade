
// ---------------- PLAYER ----------------
let playerInventory = [];
let playerOffer = [];

// ---------------- AI TRADERS ----------------
let traders = [
  { id: 1, name: "Métis Trader", personality: "fair", wants: [], offer: [] },
  { id: 2, name: "European Merchant", personality: "greedy", wants: [], offer: [] },
  { id: 3, name: "Hudson Agent", personality: "strict", wants: [], offer: [] }
];

let activeTrader = null;

// ---------------- ITEMS ----------------
const items = {
  wolf: { name: "Wolf Pelt", value: 10, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg" },
  beaver: { name: "Beaver Pelt", value: 8, img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg" },
  fox: { name: "Fox Pelt", value: 6, img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg" }
};

// ---------------- START ----------------
for (let i = 0; i < 2; i++) {
  playerInventory.push(items.wolf);
}

// ---------------- HUNT ----------------
function hunt(type) {
  playerInventory.push(items[type]);
  document.getElementById("result").innerText =
    "You hunted a " + items[type].name;

  render();
}

// ---------------- INVENTORY ----------------
function toggleInventory() {
  let panel = document.getElementById("inventoryPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
  render();
}

// ---------------- SELECT TRADER ----------------
function selectTrader(id) {
  activeTrader = traders.find(t => t.id === id);

  generateTraderOffer(activeTrader);

  document.getElementById("result").innerText =
    activeTrader.name + " wants to trade.";

  render();
}

// ---------------- AI OFFER GENERATION ----------------
function generateTraderOffer(trader) {
  trader.offer = [];
  trader.wants = [];

  let keys = Object.keys(items);

  for (let i = 0; i < 2; i++) {
    let item = items[keys[Math.floor(Math.random() * keys.length)]];
    trader.wants.push(item);
  }

  for (let i = 0; i < 2; i++) {
    let item = items[keys[Math.floor(Math.random() * keys.length)]];
    trader.offer.push(item);
  }
}

// ---------------- TRADE LOGIC ----------------
function makeTrade() {
  if (!activeTrader) return;

  let playerValue = total(playerOffer);
  let traderValue = total(activeTrader.offer);

  let fairness = playerValue - traderValue;

  let accepted = aiDecision(activeTrader, fairness);

  if (accepted) {
    playerInventory.push(...activeTrader.offer);
    activeTrader = null;
    playerOffer = [];

    document.getElementById("result").innerText =
      "Trade completed with AI trader.";
  } else {
    document.getElementById("result").innerText =
      "AI rejected the trade.";
  }

  render();
}

// ---------------- AI PERSONALITY ----------------
function aiDecision(trader, diff) {
  if (trader.personality === "fair") {
    return diff >= -2;
  }

  if (trader.personality === "greedy") {
    return diff >= -5;
  }

  if (trader.personality === "strict") {
    return diff >= 0;
  }

  return false;
}

// ---------------- ADD TO OFFER ----------------
function addToOffer(i) {
  playerOffer.push(playerInventory[i]);
  playerInventory.splice(i, 1);
  render();
}

// ---------------- TOTAL ----------------
function total(arr) {
  return arr.reduce((sum, i) => sum + i.value, 0);
}

// ---------------- RENDER ----------------
function render() {

  // player inventory
  let inv = document.getElementById("playerInv");
  inv.innerHTML = "";
  playerInventory.forEach((item, i) => {
    let el = document.createElement("div");
    el.innerHTML = item.name + " ($" + item.value + ")";
    el.onclick = () => addToOffer(i);
    inv.appendChild(el);
  });

  // player offer
  let po = document.getElementById("playerOffer");
  po.innerHTML = playerOffer.map(i => i.name).join(", ");

  // traders list
  let tr = document.getElementById("traders");
  tr.innerHTML = "";

  traders.forEach(t => {
    let el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <b>${t.name}</b><br>
      Personality: ${t.personality}<br>
      <button onclick="selectTrader(${t.id})">Trade</button>
    `;
    tr.appendChild(el);
  });

  // trader offer
  let to = document.getElementById("traderOffer");
  to.innerHTML = activeTrader ? activeTrader.offer.map(i => i.name).join(", ") : "No trader selected";

  document.getElementById("info").innerText =
    "Select a trader and build your offer.";

}

render();
