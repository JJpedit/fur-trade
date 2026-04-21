let furs = 0;
let money = 0;
let turn = 1;

function updateStats() {
  document.getElementById("stats").innerText =
    "Turn: " + turn + " | Furs: " + furs + " | Money: $" + money;
}

function log(message) {
  document.getElementById("log").innerText = message;
}

function hunt() {
  let gained = Math.floor(Math.random() * 5) + 1;
  furs += gained;
  log("You hunted and got " + gained + " furs.");
  updateStats();
}

function trade() {
  if (furs === 0) {
    log("No furs to trade!");
    return;
  }

  let price = Math.floor(Math.random() * 10) + 5;
  let earned = furs * price;

  money += earned;
  log("You traded " + furs + " furs for $" + earned + ".");
  furs = 0;

  updateStats();
}

function nextTurn() {
  turn++;
  log("New turn started.");
  updateStats();
}

updateStats();
