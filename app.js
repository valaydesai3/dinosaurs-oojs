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
    const random = Math.floor(Math.random() * 4) + 1;
    const facts = [];

    result.forEach((dino) => {
      switch (random) {
        case 1:
          const dietFact = new Dino(dino).compareDiet(human.diet);
          facts.push({ dino: dino, fact: dietFact });
          break;
        case 2:
          const weightFact = new Dino(dino).compareWeight(human.weight);
          facts.push({ dino: dino, fact: weightFact });
          break;
        case 3:
          const heightFact = new Dino(dino).compareHeight(human.height);
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
generateTile = (facts) => {
  facts.forEach((item) => {
    console.log(item);
    document.getElementById('grid').innerHTML += `
    <div class="grid-item">  
    <h3>${item.dino.species}</h3>
    <img src="${item.dino.image}" alt="image" />
    <p>${item.dino.species !== 'human' ? item.fact : item.dino.name}</p>
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
