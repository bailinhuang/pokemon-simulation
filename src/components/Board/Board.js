import React, { Component } from 'react';

import './Board.scss';

class Board extends Component {

  createEntityMatrix = () => {
    const { rows, cols, pokemons, hunters, police } = this.props;

    const entityMatrix = [];
    let i, j;
    for (i = 0; i < rows; i++) {
      entityMatrix[i] = new Array(cols);
      for (j = 0; j < cols; j++) {

        pokemons.forEach(pokemon => {
          if (pokemon.x === i && pokemon.y === j) entityMatrix[i][j] = pokemon;
        });

        hunters.forEach(hunter => {
          if (hunter.x === i && hunter.y === j) entityMatrix[i][j] = hunter;
        });

        police.forEach(policeman => {
          if (policeman.x === i && policeman.y === j) entityMatrix[i][j] = policeman;
        });

      }
    }

    return entityMatrix;
  }

  render() {
    const { rows, cols } = this.props;
    const rowsArray = [...Array(rows)];
    const colsArray = [...Array(cols)];
    const entityMatrix = this.createEntityMatrix();

    return (
      <div className="simulation-board">
        {rowsArray.map((_, i) =>
          <div className="simulation-board__row" key={i}>
            {colsArray.map((_, j) =>
              <div className="simulation-board__column" key={j}>
                {entityMatrix[i][j] ?
                  <img
                    className="simulation-board__pokemon-image"
                    src={entityMatrix[i][j].imageUrl} alt="" />
                  :
                  null
                }
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default Board