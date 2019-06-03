import React, { Component } from 'react'
import './Leaderboard.scss'
class Leaderboard extends Component {

  render() {
    const {hunters} = this.props
    
    return (
      <div className='leaderboard'>
        <h1>Leaderboard</h1>
      </div>
    )
  }
}
export default Leaderboard