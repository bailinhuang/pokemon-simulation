export default class Police {
  constructor(x, y, sightDistance) {
    this.x = x;
    this.y = y; 
    this.imageUrl = '/assets/police.png';
    this.sightDistance = sightDistance;
  }

  addPokemonCounter(){
    this.pokemonCounter += 1;
  } 

  addPokemonknowledge(pokemon){
    this.pokemonKnowledge.push(pokemon);
  } 
}