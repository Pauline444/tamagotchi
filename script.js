'use strict';




let petBtn = document.querySelector('#pet-btn');
let petOption = document.querySelector('#pet-option');
let petNameInput = document.querySelector('#pet-name');
let petCards = document.querySelector('#pet-cards');





class Pet {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
    }

    nap() {
        this.energy += 40;
        this.fullness -= 10;
        this.happiness -= 10;
        // Kontrollerar värdena är mellan 0-100
        this.progressValues();
    }

    play() {
        this.energy -= 10;
        this.fullness -= 10;
        this.happiness += 30;
        this.progressValues();
    }

    eat() {
        this.energy -= 15;
        this.fullness += 30;
        this.happiness += 5;
        this.progressValues();
    }

    // Math.max returnerar det största av talen jag skickar in
    // Math.min returnerar det minsta
    // Math.max(0, -10) = 0
    // Math.min(100, 140) = 100
    progressValues() {
        this.energy = Math.min(100, Math.max(0, this.energy));
        this.fullness = Math.min(100, Math.max(0, this.fullness));
        this.happiness = Math.min(100, Math.max(0, this.happiness));
    }
}


// Håll koll på alla husdjur
// hålla lista på pets
// begränsa till 4
// starta timers
// ta bort pet när värde = 0

class PetManager {
    constructor() {
        this.pets = [];
    }

    // BUG pets fylls på även när det är fullt!
    addPet(pet) {
        if (this.pets.length >= 4) {
            alert('To many pets! You can only have Max 4 pets...');
            return;
        } else return this.pets.push(pet);
    }

    removePet(pet) {
        console.log('Removed Pet; ' + pet)
        this.pets = this.pets.filter(p => p !== pet);
    }
}
// Instans för att kunna använda add och remove
const petManager = new PetManager();





class Tamagotchi {
    constructor(pet, cards) {
        this.pet = pet;
        this.cards = cards;
        this.card = null;

        this.energy = null;
        this.fullness = null;
        this.happiness = null;

        this.render()
    }

    render() {
        this.card = document.createElement('div');
        this.card.className = 'pet-card';

        const h4 = document.createElement('h4');
        h4.className = 'name';
        h4.textContent = this.pet.name;
        const p = document.createElement('p');
        p.className = 'animal-type';
        p.textContent = this.pet.type;

        this.card.append(h4, p, this.progress());
        this.cards.appendChild(this.card);
    }

    progress() { // skapa ui
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const napBtn = document.createElement('button');
        napBtn.textContent = 'nap';
        napBtn.addEventListener('click', () => {
            this.pet.nap()
            this.uppdateBars()
        });

        const playBtn = document.createElement('button');
        playBtn.textContent = 'play';
        playBtn.addEventListener('click', () => {
            this.pet.play()
            this.uppdateBars()
        });

        const eatBtn = document.createElement('button');
        eatBtn.textContent = 'eat';
        eatBtn.addEventListener('click', () => {
            this.pet.eat()
            this.uppdateBars()
        });

        const energyText = document.createElement('small');
        energyText.textContent = 'energy';
        energyText.style.marginTop = '15px';
        this.energyBar = document.createElement('progress');
        this.energyBar.max = 100;
        this.energyBar.value = this.pet.energy;

        const happinessText = document.createElement('small');
        happinessText.textContent = 'happiness';
        this.happinessBar = document.createElement('progress');
        this.happinessBar.textContent = 'happiness';
        this.happinessBar.max = 100;
        this.happinessBar.value = this.pet.happiness;

        const fullnessText = document.createElement('small');
        fullnessText.textContent = 'fullness';
        this.fullnessBar = document.createElement('progress');
        this.fullnessBar.textContent = 'fullness';
        this.fullnessBar.max = 100;
        this.fullnessBar.value = this.pet.fullness;

        progressBar.append(napBtn, playBtn, eatBtn, energyText, this.energyBar, happinessText, this.happinessBar, fullnessText, this.fullnessBar);

        return progressBar;
    }

    uppdateBars() { // uppdatera ui
        this.energyBar.value = this.pet.energy;
        this.happinessBar.value = this.pet.happiness;
        this.fullnessBar.value = this.pet.fullness;
    }
}






const randomName = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/0.8');
        const data = await response.json();
        console.log(data.results[0].user.name.first)
        return data.results[0].user.name.first.toUpperCase();

    } catch (error) {
        console.log('API Error; ' + error.message);
        return 'Unknown';
    }
}







// När Create Pet klickas:
// Kolla igenom om det finns ett namn i inputfältet
// Annars kalla på funktionen randomName

petBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let name = petNameInput.value;
    let type = petOption.value;

    if (!name) {
        name = await randomName();
    }

    const pet = new Pet(name, type);
    petManager.addPet(pet);

    new Tamagotchi(pet, petCards);
});