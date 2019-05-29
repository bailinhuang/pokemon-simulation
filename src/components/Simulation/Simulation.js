import React, { Component } from 'react';
import Board from '../Board/Board';
import Pokemon from '../../model/pokemon.js';
import Hunter from '../../model/hunter.js';
import Police from '../../model/police.js';

import './Simulation.scss';
import { pokemonTypes } from './PokemonTypes.js';

const rows = 8;
const cols = 15;

class Simulation extends Component {

  constructor(props) {
    super(props);

    this.state = this.generateState();
  }

  /* Utils */

  copyArrayOfObjects(array) {
    array = [...array];
    for(let i = 0; i < array.length; i++) {
      array[i] = {...array[i]};
    }

    return array;
  }

  isOutOfBounds(x, y) {
    return x < 0 || x >= rows || y < 0 || y >= cols;
  }

  isSomeoneThere(x, y, pokemons, hunters, police) {

    let someoneThere = false;
    pokemons.forEach( pokemon => {
      someoneThere = someoneThere || (pokemon.x === x && pokemon.y === y);
    });
    if (someoneThere) return someoneThere;

    hunters.forEach( hunter => {
      someoneThere = someoneThere || (hunter.x === x && hunter.y === y);
    });
    if (someoneThere) return someoneThere;

    police.forEach( policeman => {
      someoneThere = someoneThere || (policeman.x === x && policeman.y === y);
    });
    
    return someoneThere;
  }

  isInSight(x1, y1, x2, y2, sightDistance) {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;
    const negativeSightDistance = -sightDistance;
    return xDiff >= negativeSightDistance && xDiff <= sightDistance
            && yDiff >= negativeSightDistance && yDiff <= sightDistance;
  }

  getNearestInSightPokemon(x, y, sightDistance, pokemons) {

    let nearestPokemon = null;
    pokemons.forEach( pokemon => {
      if ( this.isInSight(x, y, pokemon.x, pokemon.y, sightDistance) ) {
        if (!nearestPokemon) {
          nearestPokemon = pokemon;

        } else {
          const pokemonXDiff = pokemon.x - x;
          const pokemonYDiff = pokemon.y - y;
          const nearestPokemonXDiff = nearestPokemon.x - x;
          const nearestPokemonYDiff = nearestPokemon.y - y;

          if ( Math.abs(nearestPokemonXDiff) > Math.abs(pokemonXDiff) 
          || Math.abs(nearestPokemonYDiff) > Math.abs(pokemonYDiff)) {
            nearestPokemon = pokemon;
          }
        } 
      }
    });

    return nearestPokemon;
  }

  getMoveToGetCloseTo(x1, y1, x2, y2) {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;

    if (xDiff < 0 && yDiff < 0) {
      return [-1, -1];

    } else if (xDiff === 0 && yDiff < 0) {
      return [0, -1];
    
    } else if (xDiff > 0 && yDiff < 0) {
      return [1, -1];

    } else if(xDiff > 0 && yDiff === 0) {
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

  catchPokemon(hunter, pokemonToCatch, pokemons) {
    hunter.pokemonCounter += 1;
    for (let i = 0; i < pokemons.length; i++) {
      if (pokemons[i].id === pokemonToCatch.id) pokemons.splice(i, 1);
    }
  }

  takeAStep(entity, pokemons, hunters, police) {
    const moveOptions = [1, 0, -1];
    let newX, newY;
    
    const pokemonToCatch = this.getNearestInSightPokemon(entity.x, entity.y, 1, pokemons);
    if (pokemonToCatch) {
      this.catchPokemon(entity, pokemonToCatch, pokemons);
      return;
    }

    let invalidCoordinates = true;
    while (invalidCoordinates) {

        const nearestPokemon = this.getNearestInSightPokemon(entity.x, entity.y, entity.sightDistance, pokemons);
        let move;
        let randomMove = true;
        if (nearestPokemon) {
          move = this.getMoveToGetCloseTo(entity.x, entity.y, nearestPokemon.x, nearestPokemon.y);
          randomMove = this.isSomeoneThere(newX, newY, pokemons, hunters, police) ? randomMove : false;

        } 
        
        if (randomMove) {
          move = [ moveOptions[Math.floor(Math.random() * moveOptions.length)], 
                  moveOptions[Math.floor(Math.random() * moveOptions.length)] ];
        }

        newX = entity.x + move[0];
        newY = entity.y + move[1];
        
        invalidCoordinates = this.isOutOfBounds(newX, newY)
          || this.isSomeoneThere(newX, newY, pokemons, hunters, police);
    }

    entity.x = newX;
    entity.y = newY;
  }

  /* Generates */

  generateState() {
    const pokemons = [];
    const hunters = [];
    const police = [];

    for (let i = 0; i < pokemonTypes.length; i++) {
      const coordinates = this.generateValidCoordinates(pokemons, hunters, police);
      pokemons.push( new Pokemon("POKE-" + i, coordinates[0], coordinates[1], pokemonTypes[i].type, pokemonTypes[i].url, 100, null, null) ); 
    }

    for (let i = 0; i < 3; i++) {
      const coordinates = this.generateValidCoordinates(pokemons, hunters, police);
      hunters.push( new Hunter("HUNTER-" + i,coordinates[0], coordinates[1], 100, 0, {}, 3, 2) );
    }

    for (let i = 0; i < 0; i++) {
      const coordinates = this.generateValidCoordinates(pokemons, hunters, police);
      police.push( new Police(coordinates[0], coordinates[1], 3) );
    }

    const simulationInterval = setInterval( () => this.simulate(), 1000 );

    return {
      pokemons,
      hunters,
      police,
      count: 0,
      simulationInterval
    };

  }

  generateValidCoordinates(pokemons, hunters, police) {
    let randomX, randomY;

    let someoneThere = true;
    while (someoneThere) {
      randomX = Math.floor(Math.random() * (rows - 1));
      randomY = Math.floor(Math.random() * (cols - 1));

      someoneThere = this.isSomeoneThere(randomX, randomY, pokemons, hunters, police);
    }

    return [ randomX, randomY ];
  }

  /* Simulate */
  simulate() {
    console.log("loop");
    let { count, pokemons, hunters, police, simulationInterval } = this.state;

    pokemons = this.copyArrayOfObjects(pokemons);
    hunters = this.copyArrayOfObjects(hunters);
    police = this.copyArrayOfObjects(police);

    if (count === 30 || pokemons.length === 0) {
      clearInterval(simulationInterval);
      return; 
    }

    hunters.forEach(hunter => {
      this.takeAStep(hunter, pokemons, hunters, police);
    });

    police.forEach(policeman => {
      this.takeAStep(policeman, pokemons, hunters, police);
    });

    this.setState({ hunters, police, pokemons, count: count + 1 })
  }

  render() {
    const { pokemons, hunters, police } = this.state;

    return (
      <div className="simulation">
        <Board
          pokemons={pokemons}
          hunters={hunters}
          police={police}
          rows={rows}
          cols={cols}
        />
      </div>
    );
  }
}

export default Simulation;