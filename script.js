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
    constructor(pet, container) {
        this.pet = pet;
        this.container = container;
        this.card = null;

        this.energy = null;
        this.fullness = null;
        this.happiness = null;

        this.render()
    }

    render() {

    }

    uppdateBars() {

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







// Kortet som ser bra ut i HTML - ändra det till js och DOM-referenser ist
const renderPetCard = (pet) => {
    const card = document.createElement('div');
    card.className = 'pet-card';

    const h4 = document.createElement('h4');
    h4.className = 'name';
    h4.textContent = pet.name;
    const p = document.createElement('p');
    p.className = 'animal-type';
    p.textContent = pet.type;


    card.appendChild(h4);
    card.appendChild(p);
    card.appendChild(progress(pet));

    // card.innerHTML = `
    //                 <div class="progress-bar">
    //                     <button onclick=${pet.nap()}>Nap</button><br>
    //                     <progress value="50" max="100"></progress><br>
    //                     <button onclick=${pet.play()}>Play</button><br>
    //                     <progress value="50" max="100"></progress><br>
    //                     <button onclick=${pet.eat()}>Eat</button><br>
    //                     <progress value="50" max="100"></progress>
    //                 </div>
    // `;
    petCards.appendChild(card);
}


const progress = (pet) => {

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const energyBar = document.createElement('progress');
    energyBar.max = 100;
    energyBar.value = pet.energy;

    // nap btn osv... mellan varje progress
    // Skapa här eller en egen funktion?

    const happinessBar = document.createElement('progress');
    happinessBar.max = 100;
    happinessBar.value = pet.happiness;

    const fullnessBar = document.createElement('progress');
    fullnessBar.max = 100;
    fullnessBar.value = pet.fullness;

    progressBar.appendChild(energyBar);
    progressBar.appendChild(happinessBar);
    progressBar.appendChild(fullnessBar);

    return progressBar;
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

    renderPetCard(pet);
});