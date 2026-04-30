document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  document.getElementById("confirmation").textContent =
    "🔥 Order placed successfully! Your cookies are on the way!";
});
