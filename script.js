const game = {
    // State Variables
    mb: 10, // Made Beaver (Currency)
    food: 20,
    health: 100,
    month: 0,
    inventory: {
        beaverPelts: 5,
        bisonRobes: 0,
        muskets: 1,
        blankets: 2
    },

    // UI Update Method
    updateUI() {
        document.getElementById('currency').innerText = this.mb;
        document.getElementById('food').innerText = this.food;
        document.getElementById('health').innerText = this.health;
        
        const invList = document.getElementById('inventory-list');
        invList.innerHTML = `
            <li>Beaver Pelts: ${this.inventory.beaverPelts}</li>
            <li>Bison Robes: ${this.inventory.bisonRobes}</li>
            <li>Muskets: ${this.inventory.muskets}</li>
        `;
    },

    // Logging Method
    log(message) {
        const logContent = document.getElementById('log-content');
        logContent.innerHTML = `<div>> ${message}</div>` + logContent.innerHTML;
    },

    // Trade Logic
    trade(item) {
        if (item === 'beaver' && this.inventory.beaverPelts > 0) {
            this.inventory.beaverPelts--;
            this.mb += 2;
            this.log("Traded a pelt to the HBC for 2 Made Beaver tokens.");
        } else if (item === 'pemmican' && this.food > 5) {
            this.food -= 5;
            this.mb += 3;
            this.log("The Métis brigade bought your pemmican for 3 MB.");
        } else {
            this.log("Insufficient resources for this trade.");
        }
        this.updateUI();
    },

    // Hunting Logic with Randomness
    hunt() {
        if (this.food < 2) return this.log("Too hungry to hunt!");
        
        let success = Math.random();
        if (success > 0.4) {
            this.inventory.bisonRobes += 1;
            this.food += 10;
            this.log("The bison hunt was a success! Fresh meat and robes acquired.");
        } else {
            this.health -= 10;
            this.log("The hunt was dangerous. You returned empty-handed and exhausted.");
        }
        this.updateUI();
    },

    // Turn Progression & Random Events
    nextTurn() {
        this.month++;
        this.food -= 3; // Consumption
        
        // Random Event Engine
        const events = [
            { msg: "A harsh frost hits. Food supplies drop.", effect: () => this.food -= 5 },
            { msg: "The Northwest Company offers a bonus for pelts.", effect: () => this.mb += 5 },
            { msg: "Friendly trade with Cree neighbors improves morale.", effect: () => this.health += 5 }
        ];

        if (Math.random() > 0.7) {
            let event = events[Math.floor(Math.random() * events.length)];
            this.log(`EVENT: ${event.msg}`);
            event.effect();
        }

        if (this.health <= 0 || this.food <= 0) {
            alert("The wilderness has reclaimed you. Game Over.");
            location.reload();
        }

        this.updateUI();
    }
};

// Initialize
game.updateUI();
