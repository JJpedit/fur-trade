
let playerInventory = [];
let traderInventory = [];

let playerOffer = [];
let traderOffer = [];

// ITEMS
const items = {
  wolf: { name: "Wolf Pelt", value: 10, img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wolf_pelt.jpg" },
  beaver: { name: "Beaver Pelt", value: 8, img: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Beaver_pelt.jpg" },
  fox: { name: "Fox Pelt", value: 6, img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Fox_pelt.jpg" }
};

// START INVENTORY
for (let i = 0; i < 3; i++) {
  playerInventory.push(items.wolf);
  traderInventory.push(items.beaver);
}

// ---------------- HUNT SYSTEM ----------------
function hunt(type) {
  let item = items[type];

  playerInventory.push(item);

  document.getElementById("result").innerText =
    "You hunted a " + item.name;

  render();
}

// ---------------- RENDER ----------------
function render() {
  show("playerInv", playerInventory, addPlayer);
  show("traderInv", traderInventory, addTrader);
  show("playerOffer", playerOffer);
  show("traderOffer", traderOffer);

  document.getElementById("info").innerText =
    "Métis vs European Trade System";
}

// ---------------- SHOW ----------------
function show(id, arr, clickFn) {
  let div = document.getElementById(id);
  div.innerHTML = "";

  arr.forEach((item, i) => {
    let el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <img src="${item.img}">
      <br>${item.name}
      <br>$${item.value}
    `;

    if (clickFn) el.onclick = () => clickFn(i);

    div.appendChild(el);
  });
}

// ---------------- MOVE TO OFFER ----------------
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

// ---------------- TRADE ----------------
function startTrade() {
  document.getElementById("result").innerText =
    "Métis offers trade...";
}

function acceptTrade() {
  let p = total(playerOffer);
  let t = total(traderOffer);

  let diff = Math.abs(p - t);

  if (diff <= 2) {
    playerInventory.push(...traderOffer);
    traderInventory.push(...playerOffer);

    playerOffer = [];
    traderOffer = [];

    document.getElementById("result").innerText =
      "Trade accepted between nations";
  } else {
    document.getElementById("result").innerText =
      "Trade rejected (unfair value)";
  }

  render();
}

// ---------------- TOTAL ----------------
function total(arr) {
  return arr.reduce((sum, i) => sum + i.value, 0);
}

render();
