// Game Constants
const spells = {
    "Expelliarmus": { damage: 15, cost: 10 },
    "Stupefy": { damage: 20, cost: 15 },
    "Avada Kedavra": { damage: 100, cost: 50 }, // Overpowered but expensive
    "Protego": { damage: 0, cost: 5, shield: 20 }
};

let player = {
    health: 100,
    gold: 50,
    xp: 0
};

let enemy = null; // Enemy will be assigned dynamically
let selectedCharacter = null;
let selectedHouse = null;

// House-specific discounts
const houseDiscounts = {
    "Gryffindor": { "Expelliarmus": 0.2 },
    "Slytherin": { "Snake Tongue": 0.3 },
    "Ravenclaw": { "Stupefy": 0.2 },
    "Hufflepuff": { "Protego": 0.2 }
};

// Shop Spells
const shopSpells = {
    "Expelliarmus": { cost: 10 },
    "Stupefy": { cost: 15 },
    "Avada Kedavra": { cost: 50 },
    "Protego": { cost: 5 },
    "Snake Tongue": { cost: 25 }
};

// Enemy Hierarchy
const enemies = [
    { name: "Dementor", health: 50, attack: 10 },
    { name: "Death Eater", health: 70, attack: 15 },
    { name: "Lord Voldemort", health: 150, attack: 30 }
];

// Game Initialization
function startGame() {
    player.health = 100;
    player.gold = 50;
    player.xp = 0;
    enemy = enemies[0]; // Start with first enemy
    updateUI();
}

// Character Selection
function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById("house-selection").style.display = "block";
    document.getElementById("character-selection").style.display = "none";
}

// House Selection
function selectHouse(house) {
    selectedHouse = house;
    document.getElementById("game-interface").style.display = "block";
    document.getElementById("house-selection").style.display = "none";
    setMessage(`Welcome to ${house}!`);
}

// Shop Functionality
function openShop() {
    let shopContent = "Available Spells:<br>";
    for (let spell in shopSpells) {
        let cost = shopSpells[spell].cost;
        if (houseDiscounts[selectedHouse] && houseDiscounts[selectedHouse][spell]) {
            cost -= cost * houseDiscounts[selectedHouse][spell];
        }
        shopContent += `${spell}: ${cost} gold<br>`;
    }
    setMessage(shopContent);
}

// Attack Function
function castSpell(spellName) {
    if (!spells[spellName]) {
        setMessage("Invalid spell!");
        return;
    }

    let spell = spells[spellName];

    if (player.gold < spell.cost) {
        setMessage("Not enough gold!");
        return;
    }

    player.gold -= spell.cost;
    
    if (spell.shield) {
        setMessage(`You cast ${spellName} and gained ${spell.shield} shield points!`);
        player.health += spell.shield;
    } else {
        enemy.health -= spell.damage;
        setMessage(`You cast ${spellName}! Enemy lost ${spell.damage} HP.`);
    }

    if (enemy.health <= 0) {
        defeatEnemy();
    } else {
        enemyAttack();
    }

    updateUI();
}

// Enemy Attack
function enemyAttack() {
    player.health -= enemy.attack;
    setMessage(`Enemy attacked you! You lost ${enemy.attack} HP.`);

    if (player.health <= 0) {
        gameOver();
    }
}

// Defeat Enemy
function defeatEnemy() {
    setMessage(`You defeated ${enemy.name}!`);
    player.gold += 20;
    player.xp += 10;

    let currentEnemyIndex = enemies.indexOf(enemy);
    
    if (currentEnemyIndex < enemies.length - 1) {
        enemy = enemies[currentEnemyIndex + 1]; // Move to next enemy
        setMessage(`A new enemy appears: ${enemy.name}!`);
    } else {
        setMessage("You have defeated all enemies! You win!");
    }
}

// Game Over
function gameOver() {
    setMessage("Game Over! You lost.");
    document.getElementById("game-actions").style.display = "none";
}

// Update UI
function updateUI() {
    document.getElementById("player-health").textContent = player.health;
    document.getElementById("gold").textContent = player.gold;
    document.getElementById("xp").textContent = player.xp;
    document.getElementById("enemy-name").textContent = enemy.name;
    document.getElementById("enemy-health").textContent = enemy.health;
}

// Set Message
function setMessage(msg) {
    document.getElementById("game-message").textContent = msg;
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("character-selection").style.display = "block";
    document.getElementById("house-selection").style.display = "none";
    document.getElementById("game-interface").style.display = "none";
});
