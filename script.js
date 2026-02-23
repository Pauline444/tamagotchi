'use strict';


const images = {
    dog: 'images/e2458830-4158-436c-870b-ba0d0fa594c6.jpg',
    ginuepig: 'images/4eefad81-1549-41fd-9a89-a40be795deac.jpg',
    cat: 'images/5f45b95f-82fa-4949-a2b4-d2aadf330828.jpg',
    jaguar: 'images/0cd404db-8ce3-4952-80ee-c41f6c002f17.jpg'
}




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

    petPicture() {
        let img = document.createElement('img');
        img.src = images[this.type] || images.dog;
        img.alt = `Image of ${this.type}`;

        return img;
    }
}






class PetManager {
    constructor() {
        this.pets = [];
    }

    addPet(pet) {
        if (this.pets.length >= 4) {
            alert('To many pets! You can only have Max 4 pets...');
            return false;
        }
        this.pets.push(pet);
        return true;
    }

    removePet(pet) {
        console.log('Removed Pet; ' + pet.name)
        this.pets = this.pets.filter(p => p !== pet);
    }
}
// Instans för att kunna använda add och remove
const petManager = new PetManager();





class Tamagotchi {
    constructor(pet, activities) {
        this.pet = pet;
        this.activities = activities;

        this.render()
        this.decreaseTime()
    }

    render() {
        this.petCards = document.querySelector('#pet-cards');

        this.card = document.createElement('div');
        this.card.className = 'pet-card';

        const h4 = document.createElement('h4');
        h4.className = 'name';
        h4.textContent = this.pet.name;
        const p = document.createElement('p');
        p.className = 'animal-type';
        p.textContent = this.pet.type;

        this.card.append(this.pet.petPicture(), h4, p, this.progress());
        this.petCards.appendChild(this.card);
    }

    progress() { // skapa ui
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const napBtn = document.createElement('button');
        napBtn.textContent = 'nap';
        napBtn.addEventListener('click', () => { // this = Tamagotchi och inte napBtn pga arrow f
            this.pet.nap()
            this.uppdateBars()
            this.activities.logActivities(`${this.pet.name} took a nap`)
        });

        const playBtn = document.createElement('button');
        playBtn.textContent = 'play';
        playBtn.addEventListener('click', () => {
            this.pet.play()
            this.uppdateBars()
            this.activities.logActivities(`You played with ${this.pet.name}`)
        });

        const eatBtn = document.createElement('button');
        eatBtn.textContent = 'eat';
        eatBtn.addEventListener('click', () => {
            this.pet.eat()
            this.uppdateBars()
            this.activities.logActivities(`Mums, you gave ${this.pet.name} some food`)
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

    decreaseTime() {
        this.timer = setInterval(() => {
            this.pet.energy -= 10;
            this.pet.fullness -= 10;
            this.pet.happiness -= 10;

            this.pet.progressValues();
            this.uppdateBars();

            if (this.pet.energy <= 0 || this.pet.fullness <= 0 || this.pet.happiness <= 0) {
                clearInterval(this.timer); // stoppar timer
                this.card.remove(); // tar bort ui
                petManager.removePet(this.pet); // tar bort från array
                this.activities.logActivities(`Pet ${this.pet.name} died, due to neglection...`);
            }
        }, 10000);
    }
}




class Activities {
    constructor() {
        this.container = document.querySelector('#pet-activities');
        this.noActivities = document.querySelector('#no-activities');
    }

    logActivities(log) {

        if (this.noActivities) {
            this.noActivities.remove();
            this.noActivities = null;
        }

        const activity = document.createElement('p');
        activity.textContent = log;

        this.container.appendChild(activity);
    }
}
// instans för att kunna använda aktivitetsloggen
const activities = new Activities();






const randomName = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/0.8');
        const data = await response.json();

        return data.results[0].user.name.first.toUpperCase();

    } catch (error) {
        console.log('API Error; ' + error.message);
        return 'Unknown';
    }
}





let petBtn = document.querySelector('#pet-btn');

petBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    let petNameInput = document.querySelector('#pet-name');
    let petOption = document.querySelector('#pet-option');

    let name = petNameInput.value;
    let type = petOption.value;

    petNameInput.value = "";

    if (!name) {
        name = await randomName();
    }

    const pet = new Pet(name, type);
    if (!petManager.addPet(pet)) return; // stoppar om arrayen är full

    new Tamagotchi(pet, activities);
});