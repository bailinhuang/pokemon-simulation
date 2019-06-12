import React, { Component } from 'react';
import Board from '../Board/Board';

import './Simulation.scss';
import * as SimulationCore from '../../core/simulation';
import * as SimulationVariables from '../../core/simulation-variables';
import * as Commons from '../../core/commons';
import * as GeneticAlgorithm from '../../core/genetic-algorithm';
import Leaderboard from '../Leaderboard/Leaderboard';

class Simulation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...SimulationCore.generateFirstGeneration(),
      nextGeneration: false
    };
  }

  handleNextGeneration = (e) => {
    e.preventDefault();

    this.setState({ nextGeneration: true });
  }

  render() {
    const { pokemons, hunters, police, finished, generationCounter, nextGeneration } = this.state;

    const stateCopy = Commons.copySimulationState(this.state);

    if (!finished) {
      setTimeout(
        () => {
          const newState = SimulationCore.simulationTick(stateCopy);
          this.setState(newState);
        }
        , 500
      );

    } else if(nextGeneration) { 
      const newGeneration = GeneticAlgorithm.getNewGeneration(this.state);
      const newGenerationCounter = generationCounter + 1;
      this.setState(
        { 
          hunters: newGeneration, 
          finished: false, 
          generationCounter: newGenerationCounter, 
          count: 0, 
          nextGeneration: false 
      });
    }

    return (
      <div className="simulation">
        <Board
          pokemons={pokemons}
          hunters={hunters}
          police={police}
          rows={SimulationVariables.rows}
          cols={SimulationVariables.cols}
        />

        <Leaderboard hunters={hunters}
                     generationCounter={generationCounter}/>

        <button 
          disabled={!finished} 
          onClick={(e) => {this.handleNextGeneration(e)}}>
            Next Generation!
        </button>
      </div>
    );
  }
}

export default Simulation;