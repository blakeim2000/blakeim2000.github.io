
var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var yourWin = 0;
var yourLoss = 0;
var winrate = 0;

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21
var canStay = true;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function restart() {
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    message = "";
    canHit = true;
    canStay = true;
    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("results").innerText = message;
    document.getElementById("buttonAppear").innerHTML = "";
}


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    //hidden = deck.pop();
    //dealerSum += getValue(hidden);
    //dealerAceCount += checkAce(hidden);
    counter = 0;
    // console.log(hidden);
    // console.log(dealerSum);
    /*
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        counter = counter + 1;
    }
    */
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        counter = counter + 1;
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    document.getElementById("dealer-sum").innerText = reduceAce(dealerSum, dealerAceCount);

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        endgame()
    }

}

function win() {
    yourWin = yourWin + 1;
    winrate = String(Math.round(10000*yourWin/(yourWin+yourLoss))/100).concat("%");     
}

function lose() {
    yourLoss = yourLoss + 1;
    winrate = String(Math.round(10000*yourWin/(yourWin+yourLoss))/100).concat("%"); 
}

function stay() {
    if (!canStay) {
        return;
    }

    while (reduceAce(dealerSum, dealerAceCount) < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        counter = counter + 1;
    }
    endgame()
}

function endgame() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    canStay = false;
    //document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        lose()
    }
    else if (dealerSum > 21) {
        message = "You win!";
        win()
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "You Lose!";
        lose()
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        win()
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        lose()
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById("wins").innerText = yourWin;
    document.getElementById("losses").innerText = yourLoss;
    document.getElementById("winrate").innerText = winrate;

 
    document.getElementById("buttonAppear").innerHTML = '<button onclick="restart()">Next Game!</button>';
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
