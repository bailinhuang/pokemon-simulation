import Hunter from '../model/hunter.js';
import * as Commons from './commons.js';

export const cross = (simulationState) => {
  const { pokemons, hunters, police, generationHunters } = simulationState;
  // de hunter1 y hunter2, crear un nuevo hunter con el pokemon knowledge de ambos y
  // la suma de flee distance de ambos siempre revisando que sea valido
  // encontrar los 2 hunters con mas pokemon knowledge
  let hunter1 = getRandomHunter(generationHunters);
  let hunter2 = getRandomHunter(generationHunters);

  Array.prototype.push.apply(hunter1.pokemonKnowledge, hunter2.pokemonKnowledge);

  const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);

  let dist = hunter1.fleeDistance + hunter2.fleeDistance;
  const newHunter = new Hunter("Hunter-" + Commons.uuid(), coordinates[0], coordinates[1], hunter1.hp, 0, hunter1.pokemonKnowledge, hunter1.sightDistance, dist);
  return newHunter;
}

export const mutate = (simulationState) => {
  const { pokemons, hunters, police , generationHunters} = simulationState;

  let hunter1, hunter2, newHunter;
  hunter1 = getRandomHunter(generationHunters);
  hunter2 = getRandomHunter(generationHunters);
  const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);

  let dist = (hunter1.fleeDistance + hunter2.fleeDistance)/2;
  newHunter = new Hunter("Hunter-" + Commons.uuid(), coordinates[0], coordinates[1], hunter1.hp, 0, hunter1.pokemonKnowledge, hunter2.sightDistance, dist);
  return newHunter;
}

export const getNewGeneration = (simulationState) => {
  const { generationHunters } = simulationState;
  let crossings = Math.floor(0.6 * generationHunters.length);
  let mutations = Math.floor(0.4 * generationHunters.length);

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