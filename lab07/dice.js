class Dice {
    constructor(value) {
        this.value = value;
        this.selected = false;
    }

    toggleSelection() {
        this.selected = !this.selected;
    }
}

let dice = [];
let rollCount = 0;
const maxRoll = 3;

const rollButton = document.getElementById('roll-button');
rollButton.addEventListener('click', async () => {
    if (rollCount < maxRoll) {
        await rollDice();
	rollCount++;
	updateRollButton();
    }
});

function updateRollButton() {
    rollButton.disabled = rollCount >= maxRoll;
    document.getElementById('roll-count').textContent = maxRoll - rollCount;
}

async function rollDice() {
    try {
        const response = await fetch('/roll-dices');
        if (!response.ok) throw new Error('Failed to fetch dice values.');
        
        const diceValues = await response.json();
        
	dice.forEach((die, index) => {
            if (!die.selected) {
                die.value = diceValues[index];
            }
        });

	displayDice();
    } catch (error) {
        console.error('Error:', error);
        displayError(error.message);
    }
}

function displayDice() {
    dice.forEach((die, index) => {
        const dieElement = document.getElementById(`dice-${index + 1}`);
        dieElement.innerHTML = createDieFace(die.value);
        dieElement.classList.toggle("selected", die.selected);
    });
}

async function initializeDice() {
    try {
        const response = await fetch('/roll-dices');
        const initialValues = response.ok ? await response.json() : [1, 1, 1, 1, 1];
        dice = initialValues.map(value => new Dice(value));
	resetTurn();
    } catch (error) {
        console.error('Error:', error);
        displayError(error.message);
    }
}

function createDieFace(value) {
    switch (value) {
        case 1:
            return `<div class="dot middle"></div>`;
        case 2:
            return `<div class="dot top-left"></div><div class="dot bottom-right"></div>`;
        case 3:
            return `<div class="dot top-left"></div><div class="dot middle"></div><div class="dot bottom-right"></div>`;
        case 4:
            return `<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>`;
        case 5:
            return `<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot middle"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>`;
        case 6:
            return `<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot middle-left"></div><div class="dot middle-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>`;
        default:
            return '';
    }
}

function toggleDiceSelection(index) {
    dice[index].toggleSelection();
    displayDice();
}

function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = `Error: ${message}`;
}

function resetTurn() {
    rollCount = 0;
    rollButton.disabled = false;
    dice.forEach(die => die.selected = false);
    displayDice();
    updateRollButton();
}

initializeDice();
