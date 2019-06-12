import Pokemon from '../model/pokemon';
import Hunter from '../model/hunter';
import Police from '../model/police';
import * as Commons from './commons';

import { pokemonTypes } from './pokemon-types';
import { rows } from './simulation-variables';

export const generateFirstGeneration = () => {
  const pokemons = [];
  const hunters = [];
  const police = [];

  for (let i = 0; i < 40; i++) {
    pokemons.push(generateRandomPokemon(pokemons, hunters, police));
  }

  for (let i = 0; i < 10; i++) {
    const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);
    hunters.push(new Hunter("HUNTER-" + Commons.uuid(), coordinates[0], coordinates[1], 100, 0, {}, rows, 2));
  }

  for (let i = 0; i < 10; i++) {
    const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);
    police.push(new Police(coordinates[0], coordinates[1], 30));
  }

  for (let i = 0; i < 0; i++) {
    const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);
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
  const coordinates = Commons.generateValidCoordinates(pokemons, hunters, police);

  return new Pokemon("POKE-" + Commons.uuid(), coordinates[0], coordinates[1], pokemonTypes[randomChoice].type, pokemonTypes[randomChoice].url, 100, null, null)
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
    const pokemonToCatch = Commons.getNearestInSight(entity.x, entity.y, 1, pokemons);
    if (pokemonToCatch) {
      catchPokemon(entity, pokemonToCatch, pokemons, hunters, police);
      return;
    }
  }

  if (entity.type === "police") {
    const huntersToCatch = Commons.getNearestInSight(entity.x, entity.y, 1, hunters);
    if (huntersToCatch) {
      catchHunter(huntersToCatch, hunters);
      return;
    }
  }

  let invalidCoordinates = true;
  while (invalidCoordinates) {

    const nearestPokemon = Commons.getNearestInSight(entity.x, entity.y, entity.sightDistance, pokemons);
    let move;
    let randomMove = true;
    if (nearestPokemon) {
      move = Commons.getMoveToGetCloseTo(entity.x, entity.y, nearestPokemon.x, nearestPokemon.y);
      randomMove = Commons.isSomeoneThere(newX, newY, pokemons, hunters, police) ? randomMove : false;

    }

    if (randomMove) {
      move = [moveOptions[Math.floor(Math.random() * moveOptions.length)],
      moveOptions[Math.floor(Math.random() * moveOptions.length)]];
    }

    newX = entity.x + move[0];
    newY = entity.y + move[1];

    invalidCoordinates = Commons.isOutOfBounds(newX, newY)
      || Commons.isSomeoneThere(newX, newY, pokemons, hunters, police);
  }

  entity.x = newX;
  entity.y = newY;
}
