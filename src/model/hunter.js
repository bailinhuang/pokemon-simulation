export default class Hunter {

  constructor(id, x, y, hp, pokemonCounter, pokemonKnowledge, sightDistance, fleeDistance) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = "hunter"
    this.imageUrl = '/assets/hunter.png';
    this.hp = hp;
    this.pokemonCounter = pokemonCounter;
    this.pokemonKnowledge = pokemonKnowledge;
    this.sightDistance = sightDistance;
    this.fleeDistance = fleeDistance;
  }

  addPokemonCounter(){
    this.pokemonCounter += 1;
  }

  addPokemonknowledge(pokemon){
    this.pokemonKnowledge.push(pokemon);
  }

  isType(type){
    if(type === "hunter"){
      return true;
    } else{
      return false;
    }
  }
}