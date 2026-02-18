'use strict';

let petBtn = document.querySelector('#pet-btn');
let petOption = document.querySelector('#pet-option');
let petNameInput = document.querySelector('#pet-name');





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
    PetManager.addPet(pet)
})







class Pet {
    constructor(name, petType) {
        this.name = name;
        this.petType = petType;
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

const pet = new Pet('Elton', 'Dog');
console.log(pet)


// Håll koll på alla husdjur
// Ta bort om någon dör
// Begränsa till bara 4 stycken

class PetManager {
    constructor() {
        this.pets = [];
    }

    addPet(pet) {
        if (this.pets.length >= 4) {
            console.log('To many pets');
            alert('To many pets! You can only have Max 4 pets...')
            return;
        }
        this.pets.push(pet);
    }

    removePet(pet) {
        console.log('Removed Pet; ' + pet)
        this.pets = this.pets.filter(p => p !== pet);
    }
}




const randomName = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/0.8');
        const data = await response.json();
        return data.results[0].user.name.first;

    } catch (error) {
        console.log('API Error; ' + error.message);
        return 'Unknown';
    }
}