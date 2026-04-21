let playerInventory = [
  { name: "Fur", img: "https://i.imgur.com/8QfQF5F.png" },
  { name: "Fur", img: "https://i.imgur.com/8QfQF5F.png" },
  { name: "Food", img: "https://i.imgur.com/6X4ZQ9F.png" }
];

let npcInventory = [
  { name: "Tool", img: "https://i.imgur.com/3Xj3Z9E.png" },
  { name: "Food", img: "https://i.imgur.com/6X4ZQ9F.png" }
];

let playerOffer = [];
let npcOffer = [];

function render() {
  displayItems("playerInventory", playerInventory, addToPlayerOffer);
  displayItems("npcInventory", npcInventory, addToNpcOffer);
  displayItems("playerOffer", playerOffer);
  displayItems("npcOffer", npcOffer);
}

function displayItems(id, items, clickFn) {
  let div = document.getElementById(id);
  div.innerHTML = "";

  items.forEach((item, index) => {
    let el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `<img src="${item.img}"><br>${item.name}`;

    if (clickFn) {
      el.onclick = () => clickFn(index);
    }

    div.appendChild(el);
  });
}

function addToPlayerOffer(index) {
  playerOffer.push(playerInventory[index]);
  playerInventory.splice(index, 1);
  render();
}

function addToNpcOffer(index) {
  npcOffer.push(npcInventory[index]);
  npcInventory.splice(index, 1);
  render();
}

function acceptTrade() {
  if (playerOffer.length === 0 || npcOffer.length === 0) {
    document.getElementById("status").innerText = "Trade must have items!";
    return;
  }

  // swap items
  playerInventory.push(...npcOffer);
  npcInventory.push(...playerOffer);

  playerOffer = [];
  npcOffer = [];

  document.getElementById("status").innerText = "✅ Trade Complete!";
  render();
}

render();
