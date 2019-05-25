import React, { Component } from 'react'

import './Board.scss';
import { pokemons } from './Dummy.js';

class Board extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rows: 10,
      cols: 10
    }

  }

  createEntityMatrix = (pokemons) => {
    const { rows, cols } = this.state;
    
  }

  render() {
    const { rows, cols } = this.state;
    const rowsArray = [...Array(rows)];
    const colsArray = [...Array(cols)];

    return (
      <div className="simulation-board">
        {rowsArray.map((_, i) =>
          <div className="simulation-board__row" key={i}>
            {colsArray.map((_, j) =>
              <div className="simulation-board__column" key={j}> 
                <img 
                  className="simulation-board__pokemon-image"
                  src="http://pixelartmaker.com/art/0eae686b2c414a5.png" alt=""/>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}
export default Board