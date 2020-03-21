//vendor.js -> for visual web page

const monsterHealthBar = document.querySelector("#monster-health");
const playerHealthBar = document.querySelector("#player-health");
const bonusLifeEl = document.querySelector("#bonus-life");

const attackBtn = document.querySelector("#attack-btn");
const strongAttackBtn = document.querySelector("#strong-attack-btn");
const healBtn = document.querySelector("#heal-btn");
const logBtn = document.querySelector("#log-btn");

function adjustHealthBars(maxLife){
  //initialize all the health bars starting value
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage){
  //damage value will be random
  const dealtDamage = Math.random() * damage;
  //decrease damage value from the monster's health
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage){
  //random damage
  const dealtDamage = Math.random() * damage;
  //decrease damage from the player's health
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue){
  //increase player's health by adding healValue
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value){
  //reset monster and player's health to max
  monsterHealthBar.value = value;
  playerHealthBar.value = value;
}

function removeBonusLife(){
  //if bonuslife is used, remove it visually
  bonusLifeEl.parentNode.removeChild(bonusLifeEl);
}

function setPlayerHealth(health){
  //set player's health by 'health'
  playerHealthBar.value = health;
}