const game = {
    // 1. Initial State
    mb: 20,
    food: 15,
    health: 100,
    prestige: 0,
    year: 1822,
    seasonIdx: 0,
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    location: "Fort Garry",
    inventory: { "Beaver Pelts": 2, "Bison Robes": 0, "Metal Tools": 1 },

    // 2. Market Prices (Changes by location)
    prices: {
        "Fort Garry": { "Beaver Pelts": 8, "Bison Robes": 15, "Metal Tools": 5 },
        "Settlement": { "Beaver Pelts": 4, "Bison Robes": 6, "Metal Tools": 10 }
    },

    // 3. Travel Mechanic
    travel() {
        this.location = (this.location === "Fort Garry") ? "Settlement" : "Fort Garry";
        this.food -= 5;
        this.log(`You trekked to ${this.location}. Rations consumed.`);
        this.advanceTime();
        this.checkGameOver();
        this.updateUI();
    },

    // 4. Hunting Mechanic
    hunt() {
        if (this.food < 5) return this.log("Too weak to hunt!");
        this.food -= 5;
        if (Math.random() > 0.4) {
            this.inventory["Bison Robes"] += 1;
            this.food += 12;
            this.prestige += 2;
            this.log("Success! You brought down a bison.");
        } else {
            this.health -= 15;
            this.log("The hunt failed. You are injured.");
        }
        this.advanceTime();
        this.checkGameOver();
        this.updateUI();
    },

    // 5. Core Logic
    trade(item, isBuying) {
        let price = this.prices[this.location][item];
        if (isBuying && this.mb >= price) {
            this.mb -= price;
            this.inventory[item]++;
            this.log(`Bought ${item}.`);
        } else if (!isBuying && this.inventory[item] > 0) {
            this.mb += price;
            this.inventory[item]--;
            this.prestige += (item === "Bison Robes") ? 5 : 1;
            this.log(`Sold ${item} for profit.`);
        }
        this.checkWin();
        this.updateUI();
    },

    advanceTime() {
        this.seasonIdx++;
        if (this.seasonIdx > 3) {
            this.seasonIdx = 0;
            this.year++;
        }
    },

    checkGameOver() {
        if (this.health <= 0 || this.food <= 0) {
            this.showEndScreen("Game Over", "The frontier was too harsh for you this year.");
        }
    },

    checkWin() {
        if (this.prestige >= 50) {
            this.showEndScreen("Victory!", "You have become a legendary Merchant Prince of the North.");
        }
    },

    showEndScreen(title, desc) {
        document.getElementById("overlay").classList.remove("hidden");
        document.getElementById("modal-title").innerText = title;
        document.getElementById("modal-desc").innerText = desc;
    },

    log(msg) {
        const l = document.getElementById("log");
        l.innerHTML = `> ${msg}<br>` + l.innerHTML;
    },

    updateUI() {
        document.getElementById("mb").innerText = this.mb;
        document.getElementById("rations").innerText = this.food;
        document.getElementById("health").innerText = this.health;
        document.getElementById("prestige").innerText = this.prestige;
        document.getElementById("date").innerText = `${this.seasons[this.seasonIdx]}, ${this.year}`;
        document.getElementById("location").innerText = this.location;
        document.getElementById("next-loc").innerText = (this.location === "Fort Garry") ? "Settlement" : "Fort Garry";

        // Update Market
        let mHTML = "<table>";
        for (let item in this.prices[this.location]) {
            let p = this.prices[this.location][item];
            mHTML += `<tr><td>${item} (${p} MB)</td> 
                <td><button onclick="game.trade('${item}', true)">Buy</button></td>
                <td><button onclick="game.trade('${item}', false)">Sell</button></td></tr>`;
        }
        document.getElementById("market-ui").innerHTML = mHTML + "</table>";

        // Update Inventory
        let iHTML = "<ul>";
        for (let item in this.inventory) {
            iHTML += `<li>${item}: ${this.inventory[item]}</li>`;
        }
        document.getElementById("inventory-ui").innerHTML = iHTML + "</ul>";
    }
};

game.updateUI();
