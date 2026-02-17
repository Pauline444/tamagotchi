'use strict';

class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;
    }
}

const pet = new Pet('Elton', 'Dog');
console.log(pet)