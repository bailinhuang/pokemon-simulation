export default class Pokemon {

  constructor(id, x, y, type, imageUrl, hp, attackRange, attackDamage) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
    this.imageUrl = imageUrl;
    this.hp = hp;
    this.attackRange = attackRange;
    this.attackDamage = attackDamage;
  } 
  
}