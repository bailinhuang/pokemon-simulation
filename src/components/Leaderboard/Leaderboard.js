import React, { Component } from 'react'
import './Leaderboard.scss'
class Leaderboard extends Component {

  render() {
    const { hunters, generationCounter } = this.props
    const hunterCards = hunters.map(hunter => Card(hunter))
    return (
      <div className='leaderboard'>
        <h1>Leaderboard</h1>
        <h2>Generation: {generationCounter}</h2>
        <h3>Hunters</h3>
        <p>Total remaining: {hunters.length} </p>
        {hunterCards}
      </div>
    )
  }
}

function Card(props) {
  return <div className='card'>
    <p>Health: {props.hp}</p>
    <p>Pokemons captured: {props.pokemonCounter}</p>
  </div>
}

export default Leaderboard