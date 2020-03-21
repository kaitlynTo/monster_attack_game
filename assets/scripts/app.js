//app.js -> for backend logic

//set max value of attack and heal
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
//for logEntry
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let battlelog=[];   //battle log history

//set the max life value from the userinput-----------
function getMaxLifeValues(){
    const enteredValue = prompt("Maximum life for you and the monster","100");
    const parsedValue = parseInt(enteredValue);

    if(isNaN(parsedValue) || parsedValue <= 0){
        throw{message: "Invalid user input, not a number!"};
    }
    return parsedValue;
}

let chosenMaxLife;

try{
    chosenMaxLife = getMaxLifeValues();
}catch (error){
    console.log(error)
    chosenMaxLife = 100;
    alert("You entered something wrong, default value of 100 was used.");
}
//----------------------------------------------------
//set monster&player health to initialize life value to start the game
//it can be modified through the program
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
//set the visual heath bar 
adjustHealthBars(chosenMaxLife);

//function to write to battlelog
function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {
        event : ev,
        value : val,
        fianlMonsterHealth : monsterHealth,
        finalPlayerHealth : playerHealth
    }

    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry.event = ev;
            logEntry.value = val;
            logEntry.finalPlayerHealth = monsterHealth;
            logEntry.finalPlayerHealth = playerHealth;
            break;
        default:
            logEntry = {};
            break;
    }
    battlelog.push(logEntry);
}

//function to reset the game
function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    //for visual health bar
    resetGame(chosenMaxLife);
}


//monster attacks player & checks if the round will be ended
function endRound(){
    //monster attacks the player
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage,currentMonsterHealth,currentPlayerHealth);

    //will bonus life be used?
    if(currentPlayerHealth <= 0 && hasBonusLife){
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth); //visual bar
        hasBonusLife = false;
        removeBonusLife(); //from vendor.js
        alert("You would be ded but the bonus life saved you.");
    }

    //decide the game result
    if(currentMonsterHealth <= 0 && currentMonsterHealth > 0){
        alert("You won!");
        writeToLog(LOG_EVENT_GAME_OVER,'PLAYER_WON',currentMonsterHealth,currentPlayerHealth);
    }else if(currentPlayerHealth <=0 && currentMonsterHealth >0){
        alert("You lost!");
        writeToLog(LOG_EVENT_GAME_OVER,"MONSTER_WON",currentMonsterHealth,currentPlayerHealth);
    }else if(currentPlayerHealth<=0 && currentMonsterHealth<=0){
        alert("You have a draw!");
        writeToLog(LOG_EVENT_GAME_OVER,'A DRAW',currentMonsterHealth,currentPlayerHealth);
    }

    //if anybody's dead, reset the game
    if(currentMonsterHealth <=0 || currentPlayerHealth <=0){
        reset();
    }
}


//player attacks : regualr or strong attack
function attackMonster(mode){
    const maxDamage = 
    mode === MODE_ATTACK 
    ? ATTACK_VALUE 
    : STRONG_ATTACK_VALUE;

    const logEvent =
    maxDamage === MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;

    writeToLog(logEvent, damage, currentMonsterHealth,currentPlayerHealth);

    //monster's counterattack
    //if the round will be ended after attack
    endRound();
}

//for the clickable buttons ---------------------------
function attackHandler(){
    attackMonster(MODE_ATTACK); //regular attack
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK); //strong attack
}

function healPlayerHandler(){
    //player's health cannot exceed maxlife
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You can't heal to more than the max initial health.");
    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue); //for visual bar
    currentPlayerHealth += healValue; //for log
    writeToLog(LOG_EVENT_PLAYER_HEAL,healValue,currentMonsterHealth,currentPlayerHealth);
    //monster attacks even after healing..
    endRound();
}

function printLogHandler(){
    let i = 0;
    for(const logEntry of battlelog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`); //'key => value' of logEntry
        }
        i++;
    }
}



attackBtn.addEventListener('click',attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);