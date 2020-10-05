// Create Dino Constructor
class Dino {
  constructor({ species, weight, height, diet, where, when, fact }) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.image = `./images/${species.toLowerCase()}.png`;
  }
}

// Create Dino Objects
const fetchDinos = async () => {
  const response = await fetch('./dino.json');
  const json = await response.json();
  return json;
};

const getDinos = async () => {
  const data = await fetchDinos();
  const dinos = await data.Dinos.map((dino) => new Dino(dino));
  return dinos;
};

// Create Human Object
class Human {
  constructor(species = 'human', weight, height, diet, name) {
    this.name = name;
    this.height = this.getHeightInInches(height);
    this.weight = weight;
    this.diet = diet;
    this.image = `./images/${species.toLowerCase()}.png`;
    this.species = species;
  }

  getHeightInInches(height) {
    const feet = Number(height.feet * 12);
    const inches = Number(height.inches);
    return feet + inches;
  }
}

// Use IIFE to get human data from form
const compareMe = () => {
  const human = (function getHumanData() {
    // get human data from inputs
    const name = document.getElementById('name').value;
    const feet = Number(document.getElementById('feet').value);
    const inches = Number(document.getElementById('inches').value);
    const weight = Number(document.getElementById('weight').value);
    const diet = document.getElementById('diet').value.toLowerCase();
    return new Human(
      'human',
      weight,
      { feet: feet, inches: inches },
      diet,
      name
    );
  })();

  getDinos().then((dinos) => {
    const result = dinos.slice(0, 4).concat(human).concat(dinos.slice(4, 8));
    // const funcs = [compareDiet, compareHeight, compareWeight];
    let facts = [];
    result.forEach((dino) => {
      const dietObj = new Dino(dino).compareDiet(human.diet);
      const weightObj = new Dino(dino).compareWeight(human.weight);
      const heightObj = new Dino(dino).compareHeight(human.height);

      facts.push(dietObj);
      facts.push(weightObj);
      facts.push(heightObj);
      generateTile(dino, dietObj);
    });
    for (let i = 0; i < dinos.length; i++) {
      const random = Math.floor(Math.random() * dinos.length);
      console.log(facts[random]);
    }
    // console.log(facts[Math.floor(Math.random() * facts.length)]);
  });
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function (humanDiet) {
  if (this.diet === humanDiet) {
    return `${this.species} is ${this.diet} while human is ${humanDiet}`;
  } else {
    return `Both ${this.species} and human are ${this.diet}.`;
  }
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (humanWeight) {
  if (this.weight > humanWeight) {
    return `${this.species} is ${
      this.weight - humanWeight
    }lbs heavier than human`;
  } else if (this.weight < humanWeight) {
    return `Human is heavier than ${this.species}`;
  } else {
    return `${this.species} weigh the same as Human`;
  }
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (humanHeight) {
  if (this.height > humanHeight) {
    return `${this.species} is ${
      this.height - humanHeight
    }inches taller than human`;
  } else if (this.height < humanHeight) {
    return `Human is taller than ${this.species}`;
  } else {
    return `${this.species} height the same as Human`;
  }
};

// Generate Tiles for each Dino in Array

// Add tiles to DOM
generateTile = (dino, dinoObj) => {
  document.getElementById('grid').innerHTML += `
  <div class="grid-item">
          <h3>${dino.species}</h3>
          <img src="${dino.image ? dino.image : ''}" alt="" />
          <p>${dino.fact ? dinoObj : ''}</p>
        </div>
  `;
};

// Remove form from screen

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', compareMe);
