import Pokemon from '../model/pokemon.js';
import Hunter from '../model/hunter.js';
import Police from '../model/police.js';
import { pokemonTypes } from './PokemonTypes.js';

export const rows = 30;
export const cols = 30;

export const generateFirstGeneration = () => {
  const pokemons = [];
  const hunters = [];
  const police = [];

  for (let i = 0; i < 40; i++) {
    pokemons.push(generateRandomPokemon(pokemons, hunters, police));
  }

  for (let i = 0; i < 10; i++) {
    const coordinates = generateValidCoordinates(pokemons, hunters, police);
    hunters.push(new Hunter("HUNTER-" + uuid(), coordinates[0], coordinates[1], 100, 0, {}, rows, 2));
  }

  for (let i = 0; i < 10; i++) {
    const coordinates = generateValidCoordinates(pokemons, hunters, police);
    police.push(new Police(coordinates[0], coordinates[1], 30));
  }

  for (let i = 0; i < 0; i++) {
    const coordinates = generateValidCoordinates(pokemons, hunters, police);
    police.push(new Police(coordinates[0], coordinates[1], 3));
  }
  let generationHunters = hunters;
  return {
    generationHunters,
    pokemons,
    hunters,
    police,
    finished: false,
    count: 0,
    generationCounter: 0
  };
}

export const simulationTick = (simulationState) => {
  const { count, pokemons, hunters, police } = simulationState;

  if (count === 30 || pokemons.length === 0) {
    return {
      ...simulationState,
      finished: true
    };
  }

  hunters.forEach(hunter => {
    takeAStep(hunter, pokemons, hunters, police);
  });

  police.forEach(policeman => {
    takeAStep(policeman, pokemons, hunters, police);
  });

  return {
    ...simulationState,
    hunters,
    police,
    pokemons,
    count: count + 1
  };
}

const generateRandomPokemon = (pokemons, hunters, police) => {
  const randomChoice = Math.floor(Math.random() * pokemonTypes.length);
  const coordinates = generateValidCoordinates(pokemons, hunters, police);

  return new Pokemon("POKE-" + uuid(), coordinates[0], coordinates[1], pokemonTypes[randomChoice].type, pokemonTypes[randomChoice].url, 100, null, null)
}

export const cross = (simulationState) => {
  const { pokemons, hunters, police, generationHunters } = simulationState;
  // de hunter1 y hunter2, crear un nuevo hunter con el pokemon knowledge de ambos y
  // la suma de flee distance de ambos siempre revisando que sea valido
  // encontrar los 2 hunters con mas pokemon knowledge
  // let newHunters = getFittestHunters(hunters);
  let hunter1 = getRandomHunter(generationHunters);
  let hunter2 = getRandomHunter(generationHunters);

  Array.prototype.push.apply(hunter1.pokemonKnowledge,hunter2.pokemonKnowledge);

  const coordinates = generateValidCoordinates(pokemons, hunters, police);
  let hp = hunter1.hp + hunter2.hp;
  let pokemonCount = Object.keys(hunter1.pokemonKnowledge).length;
  let dist = hunter1.fleeDistance + hunter2.fleeDistance;
  const newHunter = new Hunter("Hunter-" + uuid(), coordinates[0],coordinates[1],hp,pokemonCount,hunter1.pokemonKnowledge, hunter1.sightDistance, dist)
  console.log("Created crossing!");
  return newHunter;
}

export const mutate = (simulationState) => {
  const { pokemons, hunters, police , generationHunters} = simulationState;

  let hunter1, hunter2, newHunter;
  hunter1 = getRandomHunter(generationHunters);
  hunter2 = getRandomHunter(generationHunters);
  const coordinates = generateValidCoordinates(pokemons, hunters, police);

  let hp = Math.floor((hunter1.hp + hunter2.hp)/2);
  let dist = (hunter1.fleeDistance + hunter2.fleeDistance)/2;
  let pokemonCount = Object.keys(hunter1.pokemonKnowledge).length;
  newHunter = new Hunter("Hunter-" + uuid(), coordinates[0],coordinates[1],hp,pokemonCount,hunter1.pokemonKnowledge, hunter2.sightDistance, dist);
  console.log("Created mutation!")
  return newHunter;
}

export const getNewGeneration = (simulationState) => {
  const { pokemons, hunters, police, generationHunters } = simulationState;
  let crossings = Math.floor(0.6 * generationHunters.length);
  let mutations = Math.floor(0.4 * generationHunters.length)
  console.log(crossings);
  console.log(mutations);

  let newGeneration = [];

  for (let i = 0; i < crossings; i++){
      let newHunter = cross(simulationState);
      newGeneration.push(newHunter);
  }

  for (let i = 0; i < mutations; i++){
    let newHunter = mutate(simulationState);
    newGeneration.push(newHunter);
  }
  return newGeneration;
}

function getFittestHunters(hunters) {
    var hunter1, hunter2;
    var maxKnowledge = 0;
    var secondMax = 0;

    hunters.forEach( hunter => {
      var knowledgeSize = Object.keys(hunter.pokemonKnowledge).length;
      if (knowledgeSize > maxKnowledge){
        maxKnowledge = knowledgeSize;
        hunter1 = hunter;
      }
      if (knowledgeSize > secondMax && knowledgeSize < maxKnowledge){
        hunter2 = hunter;
      }
      });
    return [hunter1, hunter2];
}

function getRandomHunter(hunters){
  return hunters[Math.floor(Math.random()* hunters.length)];
}

const generateValidCoordinates = (pokemons, hunters, police) => {
  let randomX, randomY;

  let someoneThere = true;
  while (someoneThere) {
    randomX = Math.floor(Math.random() * (rows - 1));
    randomY = Math.floor(Math.random() * (cols - 1));

    someoneThere = isSomeoneThere(randomX, randomY, pokemons, hunters, police);
  }

  return [randomX, randomY];
}

/* Utils */
export const copySimulationState = (state) => {
  return {
    ...state,
    hunters: copyArrayOfObjects(state.hunters),
    police: copyArrayOfObjects(state.police),
    pokemons: copyArrayOfObjects(state.pokemons),
  };
}

const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const copyArrayOfObjects = (array) => {
  array = [...array];
  for (let i = 0; i < array.length; i++) {
    array[i] = { ...array[i] };
  }

  return array;
}

const isOutOfBounds = (x, y) => {
  return x < 0 || x >= rows || y < 0 || y >= cols;
}

const isSomeoneThere = (x, y, pokemons, hunters, police) => {
  let someoneThere = false;
  pokemons.forEach(pokemon => {
    someoneThere = someoneThere || (pokemon.x === x && pokemon.y === y);
  });
  if (someoneThere) return someoneThere;

  hunters.forEach(hunter => {
    someoneThere = someoneThere || (hunter.x === x && hunter.y === y);
  });
  if (someoneThere) return someoneThere;

  police.forEach(policeman => {
    someoneThere = someoneThere || (policeman.x === x && policeman.y === y);
  });

  return someoneThere;
}

const getDistanceSq = (x1, y1, x2, y2) => {
  return (x1 - x2) *
    (x1 - x2) +
    (y1 - y2) *
    (y1 - y2);
}

const isInSight = (x1, y1, x2, y2, sightDistance) => {
  const distanceSq = getDistanceSq(x1, y1, x2, y2);
  const sightDistanceSq = sightDistance * sightDistance;
  return distanceSq <= sightDistanceSq;
}

const getNearestInSight = (x, y, sightDistance, entities) => {
  let nearestEntity = null;

  entities.forEach(entity => {
    if (isInSight(x, y, entity.x, entity.y, sightDistance)) {
      if (!nearestEntity) {
        nearestEntity = entity;

      } else {
        const distanceSq = getDistanceSq(x, y, entity.x, entity.y);
        const nearestPokemonDistanceSq = getDistanceSq(x, y, nearestEntity.x, nearestEntity.y);

        if (distanceSq < nearestPokemonDistanceSq) {
          nearestEntity = entity;
        }
      }
    }
  }); 
  return nearestEntity;
}

const getMoveToGetCloseTo = (x1, y1, x2, y2) => {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;

  if (xDiff < 0 && yDiff < 0) {
    return [-1, -1];

  } else if (xDiff === 0 && yDiff < 0) {
    return [0, -1];

  } else if (xDiff > 0 && yDiff < 0) {
    return [1, -1];

  } else if (xDiff > 0 && yDiff === 0) {
    return [1, 0];

  } else if (xDiff > 0 && yDiff > 0) {
    return [1, 1];

  } else if (xDiff === 0 && yDiff > 0) {
    return [0, 1];

  } else if (xDiff < 0 && yDiff > 0) {
    return [-1, 1];

  } else if (xDiff < 0 && yDiff === 0) {
    return [-1, 0];
  }

  return [0, 0];
}

const catchPokemon = (hunter, pokemonToCatch, pokemons, hunters, police) => {
  hunter.pokemonCounter += 1;
  hunter.pokemonKnowledge[pokemonToCatch.type] = pokemonToCatch;

  for (let i = 0; i < pokemons.length; i++) {
    if (pokemons[i].id === pokemonToCatch.id) pokemons.splice(i, 1);
  }
  pokemons.push(generateRandomPokemon(pokemons, hunters, police));
}

const catchHunter = (hunterToCatch, hunters) => {
  for (let i = 0; i < hunters.length; i++) {
    if (hunters[i].id === hunterToCatch.id) hunters.splice(i, 1);
  }
}
const takeAStep = (entity, pokemons, hunters, police) => {
  const moveOptions = [1, 0, -1];
  let newX, newY;   
  if (entity.type === "hunter") {
    const pokemonToCatch = getNearestInSight(entity.x, entity.y, 1, pokemons);
    if (pokemonToCatch) {
      catchPokemon(entity, pokemonToCatch, pokemons, hunters, police);
      return;
    }
  }

  if (entity.type === "police") {
    const huntersToCatch = getNearestInSight(entity.x, entity.y, 1, hunters);
    if (huntersToCatch) {
      catchHunter(huntersToCatch, hunters);
      return;
    }
  }

  let invalidCoordinates = true;
  while (invalidCoordinates) {

    const nearestPokemon = getNearestInSight(entity.x, entity.y, entity.sightDistance, pokemons);
    let move;
    let randomMove = true;
    if (nearestPokemon) {
      move = getMoveToGetCloseTo(entity.x, entity.y, nearestPokemon.x, nearestPokemon.y);
      randomMove = isSomeoneThere(newX, newY, pokemons, hunters, police) ? randomMove : false;

    }

    if (randomMove) {
      move = [moveOptions[Math.floor(Math.random() * moveOptions.length)],
      moveOptions[Math.floor(Math.random() * moveOptions.length)]];
    }

    newX = entity.x + move[0];
    newY = entity.y + move[1];

    invalidCoordinates = isOutOfBounds(newX, newY)
      || isSomeoneThere(newX, newY, pokemons, hunters, police);
  }

  entity.x = newX;
  entity.y = newY;
}
