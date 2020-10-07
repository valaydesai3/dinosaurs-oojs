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
  constructor(species = 'Human', weight, height, diet, name) {
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
      'Human',
      weight,
      { feet: feet, inches: inches },
      diet,
      name
    );
  })();

  getDinos().then((dinos) => {
    const result = dinos.slice(0, 4).concat(human).concat(dinos.slice(4, 8));
    const random = Math.floor(Math.random() * 4) + 1;
    const facts = [];

    result.forEach((dino) => {
      switch (random) {
        case 1:
          const dietFact = new Dino(dino).compareDiet(human);
          facts.push({ dino: dino, fact: dietFact });
          break;
        case 2:
          const weightFact = new Dino(dino).compareWeight(human);
          facts.push({ dino: dino, fact: weightFact });
          break;
        case 3:
          const heightFact = new Dino(dino).compareHeight(human);
          facts.push({ dino: dino, fact: heightFact });
          break;
        case 4:
          facts.push({ dino: dino, fact: dino.fact });
          break;
      }
    });
    if (facts.length > 0) {
      generateTile(facts);
    }
  });
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function ({ name, diet }) {
  if (this.diet === humanDiet) {
    return `${this.species} is ${this.diet} while ${name} is ${diet}`;
  } else {
    return `Both ${this.species} and ${name} are ${this.diet}.`;
  }
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function ({ name, weight }) {
  if (this.weight > weight) {
    return `${this.species} is ${this.weight - weight}lbs heavier than ${name}`;
  } else if (this.weight < weight) {
    return `${name} is heavier than ${this.species}`;
  } else {
    return `${this.species} weigh the same as ${name}`;
  }
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function ({ name, height }) {
  if (this.height > height) {
    return `${this.species} is ${
      this.height - height
    }inches taller than ${name}`;
  } else if (this.height < height) {
    return `${name} is taller than ${this.species}`;
  } else {
    return `${this.species} height the same as ${name}`;
  }
};

// Generate Tiles for each Dino in Array

// Add tiles to DOM
generateTile = (facts) => {
  facts.forEach((item) => {
    document.getElementById('grid').innerHTML += `
    <div class="grid-item">  
    <h3>${item.dino.species}</h3>
    <img src="${item.dino.image}" alt="image" />
    <p>${item.dino.species !== 'Human' ? item.fact : item.dino.name}</p>
    </div>
    `;
  });
  removeForm();
};

// Remove form from screen
function removeForm() {
  document.getElementById('dino-compare').style.display = 'none';
}

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', compareMe);
