import React, { Component } from 'react';
import Board from '../Board/Board';

import './Simulation.scss';
import * as SimulationCore from '../../core/simulation';
import Leaderboard from '../Leaderboard/Leaderboard';

class Simulation extends Component {

  constructor(props) {
    super(props);

    this.state = SimulationCore.generateFirstGeneration();
  }

  render() {
    let { pokemons, hunters, police, finished, generationCounter} = this.state;
    const stateCopy = SimulationCore.copySimulationState(this.state);
    generationCounter = generationCounter + 1;
    if (!finished) {
      setTimeout(
        () => {
          const newState = SimulationCore.simulationTick(stateCopy);
          this.setState(newState);
        }
        , 1000
      );
    } else { 
      let newGeneration = SimulationCore.getNewGeneration(this.state);
      this.setState({hunters: newGeneration, finished: false, generationCounter: generationCounter, count: 0})
    }
    return (
      <div className="simulation">
        <Board
          pokemons={pokemons}
          hunters={hunters}
          police={police}
          rows={SimulationCore.rows}
          cols={SimulationCore.cols}
        />
        <Leaderboard hunters={hunters}
                     generationCounter={generationCounter}/>
      </div>
    );
  }
}

export default Simulation;