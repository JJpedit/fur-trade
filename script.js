let europeanOfferValue = 0;
let metisOfferValue = 0;

const europeanOfferEl = document.getElementById('european-offer');
const metisOfferEl = document.getElementById('metis-offer');
const resultEl = document.getElementById('result');
const tradeBtn = document.getElementById('tradeBtn');
const restartBtn = document.getElementById('restartBtn');

function generateOffer() {
  return Math.floor(Math.random() * 41) + 80; // Random value between 80 and 120
}

function makeTrade() {
  // Generate offers
  europeanOfferValue = generateOffer();
  metisOfferValue = generateOffer();

  // Display offers
  europeanOfferEl.textContent = `${europeanOfferValue}`;
  metisOfferEl.textContent = `${metisOfferValue}`;

  // Check if offers are equal
  if (europeanOfferValue === metisOfferValue) {
    resultEl.textContent = "Trade accepted!";
  } else {
    resultEl.textContent = "Trade rejected due to unequal values.";
  }

  // Disable button after trade
  tradeBtn.disabled = true;
  restartBtn.style.display = 'inline-block';
}

function restartGame() {
  resultEl.textContent = "";
  europeanOfferEl.textContent = "";
  metisOfferEl.textContent = "";
  tradeBtn.disabled = false;
  restartBtn.style.display = 'none';
}

// Event listeners
tradeBtn.addEventListener('click', makeTrade);
restartBtn.addEventListener('click', restartGame);
