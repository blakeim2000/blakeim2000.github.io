import './Body.css';
import React from 'react';

function Body () {

    const[dealerSum, setDealerSum] = React.useState(0);
    const[yourSum, setYourSum] = React.useState(0);
    var dealerAceCount = 0;
    var yourAceCount = 0; 
    const[message, setMessage] = React.useState("");
    //var yourWin = 0;
    //var yourLoss = 0;
    const[winCount, setWinCount] = React.useState(0);
    const[loseCount, setLoseCount] = React.useState(0);
    const[winrate, setWinrate] = React.useState("0%");
    var deck;
    const[canHit, setCanHit] = React.useState(true);
    const[canStay, setCanStay] = React.useState(true);
    const [gameDone, setGameDone] = React.useState(false);

    React.useEffect(()=>{
        deck = buildDeck();
        deck = shuffleDeck(deck);
        startGame(deck);}
        ,[]
    )


    function restart() {
        document.getElementById("dealer-cards").innerHTML = "";
        document.getElementById("your-cards").innerHTML = "";
        dealerAceCount = 0;
        yourAceCount = 0;
        setDealerSum(0);
        setYourSum(0);
        setMessage("");
        setCanHit(true);
        setCanStay(true);
        setGameDone(false);
        //document.getElementById("results").innerText = message;
        //document.getElementById("buttonAppear").innerHTML = "";
        deck = buildDeck();
        deck = shuffleDeck(deck);
        startGame(deck);
    }


    function buildDeck() {
        let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        let types = ["C", "D", "H", "S"];
        deck = [];

        for (let i = 0; i < types.length; i++) {
            for (let j = 0; j < values.length; j++) {
                deck.push(values[j] + "-" + types[i]); 
            }
        }
        return deck;
        
    }

    function shuffleDeck(deck) {
        for (let i = 0; i < deck.length; i++) {
            let j = Math.floor(Math.random() * deck.length);
            let temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
        return deck;
    }

    function startGame(deck) {

        var counter = 0;
    
        for (let i = 0; i < 2; i++) {
            //let cardImg = document.createElement("img");
            let card = deck.pop();
            //cardImg.src = "./cards/" + card + ".png";
            setDealerSum(dealerSum + getValue(card));
            alert(dealerSum);
            dealerAceCount += checkAce(card);
            //document.getElementById("dealer-cards").append(cardImg);
            counter = counter + 1;
        }

        for (let i = 0; i < 2; i++) {
            //let cardImg = document.createElement("img");
            let card = deck.pop();
            //cardImg.src = "./cards/" + card + ".png";
            setYourSum(yourSum + getValue(card));
            yourAceCount += checkAce(card);
            //document.getElementById("your-cards").append(cardImg);
        }
        setYourSum(reduceAce(yourSum, yourAceCount));
        setDealerSum(reduceAce(dealerSum, dealerAceCount));

        //document.getElementById("hit").addEventListener("click", hit);
        //document.getElementById("stay").addEventListener("click", stay);

        if (reduceAce(dealerSum, dealerAceCount) === 21) {
            endgame();
        }

        if (reduceAce(yourSum, yourAceCount) === 21) { //A, J, 8 -> 1 + 10 + 8
            stay();
        }
 
    }

    function hit() {
        if (!canHit) {
            return;
        }
 
        //let cardImg = document.createElement("img");
        let card = deck.pop();
        //cardImg.src = "./cards/" + card + ".png";
        setYourSum(yourSum + getValue(card));
        yourAceCount += checkAce(card);
        //document.getElementById("your-cards").append(cardImg);
        setYourSum(reduceAce(yourSum, yourAceCount));

        if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
            endgame();
        }

        if (reduceAce(yourSum, yourAceCount) === 21) { //A, J, 8 -> 1 + 10 + 8
            stay();
        }

    }

    function win() {
        setWinCount(winCount + 1);
        setWinrate(String(Math.round(10000*winCount/(winCount+loseCount))/100).concat("%"));     
    }

    function lose() {
        setLoseCount(loseCount + 1);
        setWinrate(String(Math.round(10000*winCount/(winCount+loseCount))/100).concat("%")); 
    }

    function stay() {
        if (!canStay) {
            return;
        }

        while (reduceAce(dealerSum, dealerAceCount) < 17) {
            //let cardImg = document.createElement("img");
            let card = deck.pop();
            //cardImg.src = "./cards/" + card + ".png";
            setDealerSum(dealerSum + getValue(card));
            dealerAceCount += checkAce(card);
            //document.getElementById("dealer-cards").append(cardImg);
        }
        endgame()
    }

    function endgame() {
        setDealerSum(reduceAce(dealerSum, dealerAceCount));
        setYourSum(reduceAce(yourSum, yourAceCount));

        setCanHit(false);
        setCanStay(false);
        setGameDone(true);

        if (yourSum > 21) {
            setMessage("You Lose!");
            lose();
        }
        else if (dealerSum > 21) {
            setMessage("You win!");
            win();
        }

        else if (yourSum > dealerSum) {
            setMessage("You Win!");
            win();
        }
        else if (yourSum <= dealerSum) {
            setMessage("You Lose!");
            lose();
        }
        /*
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        document.getElementById("wins").innerText = winCount;
        document.getElementById("losses").innerText = loseCount;
        document.getElementById("winrate").innerText = winrate;
        //document.getElementById("buttonAppear").innerHTML = "<button onclick={restart}>Next Game!</button>";
        */
    }

    function getValue(card) {
        let data = card.split("-"); // "4-C" -> ["4", "C"]
        let value = data[0];

        if (isNaN(value)) { //A J Q K
            if (value === "A") {
                return 11;
            }
            return 10;
        }
        return parseInt(value); 
    }

    function checkAce(card) {
        if (card[0] === "A") {
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

    return (
    <div>
        <div className="heading">
            <h3>Wins: <span id="wins">{winCount}</span></h3>
            <h3>Losses: <span id="losses">{loseCount}</span></h3>
            <h3>Winrate: <span id="winrate">{winrate}</span></h3>
        </div>
        <h2>Dealer: <span id="dealer-sum"></span>{dealerSum}</h2>
        <div id="dealer-cards">
        </div>
        <h2>You: <span id="your-sum">{yourSum}</span></h2>
        <div id="your-cards"></div>
        <br/>
        <button id="hit" onClick={()=>hit}>Hit</button>
        <button id="stay" onClick={()=>stay}>Stay</button>
        <p id="results">{message}</p>
        <span id="buttonAppear"> 
        {gameDone && <button onClick={()=>restart}>
        Next Game!
        </button>}
        </span> 
    </div>
        )
}

export default Body;





