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

  generateState() {
    const pokemons = [];
    const hunters = [];
    const police = [];
    

    pokemonTypes.forEach( type => {
      const coordinates = this.generateValidCoordinates(pokemons, hunters, police);
      pokemons.push( new Pokemon(coordinates[0], coordinates[1], type.type, type.url, 100, null, null) ); 
    })

    for (let i = 0; i < 3; i++) {
      const coordinates = this.generateValidCoordinates(pokemons, hunters, police);
      hunters.push( new Hunter(coordinates[0], coordinates[1], 100, 0, {}, 3, 2) );
    }

    for (let i = 0; i < 2; i++) {
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

  simulate() {
    const { count, pokemons, hunters, police, simulationInterval } = this.state;
    if (count === 12) {
      clearInterval(simulationInterval);
      return;
    }

    const huntersCopy = [...hunters];
    const policeCopy = [...police];
    
    for (let i = 0; i < huntersCopy.length; i++) 
      huntersCopy[i] = {...huntersCopy[i]};

    huntersCopy.forEach(hunter => {
      this.takeAStep(hunter, pokemons, huntersCopy, policeCopy);
    });

    for (let i = 0; i < policeCopy.length; i++) 
      policeCopy[i] = {...policeCopy[i]};

    policeCopy.forEach(policeman => {
      this.takeAStep(policeman, pokemons, huntersCopy, policeCopy);
    });

    this.setState({ hunters: huntersCopy, police: policeCopy, count: count + 1 })
  }

  takeAStep(entity, pokemons, hunters, police) {
    const moveOptions = [1, 0, -1];
    let newX, newY;

    let invalidCoordinates = true;
    while (invalidCoordinates) {
        newX = entity.x + moveOptions[Math.floor(Math.random() * moveOptions.length)];
        newY = entity.y + moveOptions[Math.floor(Math.random() * moveOptions.length)];
        
        invalidCoordinates = this.isOutOfBounds(newX, newY)
          || this.isSomeoneThere(newX, newY, pokemons, hunters, police);
    }

    entity.x = newX;
    entity.y = newY;
  }

  isOutOfBounds(x, y) {
    return x < 0 || x >= rows || y < 0 || y >= cols;
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