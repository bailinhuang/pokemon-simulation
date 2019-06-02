import React, { Component } from 'react';
import Board from '../Board/Board';

import './Simulation.scss';
import * as SimulationCore from '../../core/simulation';

class Simulation extends Component {

  constructor(props) {
    super(props);

    this.state = SimulationCore.generateFirstGeneration();
  }

  render() {
    const { pokemons, hunters, police, finished } = this.state;

    const stateCopy = SimulationCore.copySimulationState(this.state);
    if (!finished) 
      setTimeout(
        () => {
          const newState = SimulationCore.simulationTick(stateCopy);
          this.setState(newState);
        }
        , 1000
      );

    return (
      <div className="simulation">
        <Board
          pokemons={pokemons}
          hunters={hunters}
          police={police}
          rows={SimulationCore.rows}
          cols={SimulationCore.cols}
        />
      </div>
    );
  }
}

export default Simulation;