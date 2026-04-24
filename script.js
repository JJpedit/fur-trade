// Initial Values
let inventory = {
    pelts: 10,
    pemmican: 5,
    tools: 0
};

function updateUI() {
    document.getElementById('pelts').innerText = inventory.pelts;
    document.getElementById('pemmican').innerText = inventory.pemmican;
    document.getElementById('tools').innerText = inventory.tools;
}

function trade(type) {
    const log = document.getElementById('status-log');

    if (type === 'peltToTools') {
        if (inventory.pelts >= 1) {
            inventory.pelts -= 1;
            inventory.tools += 2;
            log.innerText = "You traded a beaver pelt for sturdy European metal tools.";
        } else {
            log.innerText = "You don't have enough pelts!";
        }
    } 
    
    else if (type === 'pemmicanToPelt') {
        if (inventory.pemmican >= 2) {
            inventory.pemmican -= 2;
            inventory.pelts += 1;
            log.innerText = "The traders desperately needed food! You traded pemmican for a pelt.";
        } else {
            log.innerText = "You need more pemmican to feed the brigade.";
        }
    }

    updateUI();
}
