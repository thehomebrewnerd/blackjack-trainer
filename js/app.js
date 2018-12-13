$(document).foundation()

// Object classes
class Card {
    constructor (suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
}

class Hand {
    constructor () {
        this.cards = [];
        this.containsAce = false;
        this.score = 0;
    }

    addCard(card) {
        this.cards.push(card);
        this.score = this.updateScore();
    };

    logHand() {
        var cardString = "";
        this.cards.forEach(function(card) {
            var rank = card.rank;
            if (card.rank === 11) {
                rank = "J";
            } else if (card.rank === 12) {
                rank = "Q";
            } else if (card.rank === 13) {
                rank = "K";
            } else if (card.rank === 14) {
                rank = "A";
            }
            cardString = cardString + rank + card.suit + " ";
        });
        return cardString;
    };
    
    updateScore() {
            var score = 0;
            var containsAce = false;
            this.cards.forEach(function(card) {
            if (card.rank === 14) {
                score += 1;
                containsAce = true;
            } else if (card.rank >= 10) {
                score += 10;
            } else {
                score += card.rank;
            }
        });
        if (score <= 11 && containsAce) {
            score += 10;
        }
        return score;
    }

    isSoft() {
        if (this.score === 17 && this.containsAce) {
            return true;
        }
        return false;
    }

    canSplit() {
        if (this.cards.length === 2) {
            if (this.cards[0].rank === this.cards[1].rank) {
                return true;
            }
        }
        return false;
    }

    isBusted() {
        if (this.score > 21) {
            return true;
        }
        return false;
    }
}

class Shoe {
    constructor (numDecks) {
        this.numDecks = numDecks
        // Clubs, Hearts, Diamonds, Spades
        this.cardSuits = ['C', 'H', 'D', 'S']; 
        //Card Ranks
        //11 = Jack
        //12 = Queen
        //13 = King
        //14 = Ace
        this.cardRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        this.cards = [];

        for(var k=0; k<numDecks; k++) {
            for (var i=0; i<this.cardSuits.length; i++){
                for (var j=0; j<this.cardRanks.length; j++) {
                    this.cards.push(new Card(this.cardSuits[i], this.cardRanks[j]));
                }
            }
        }
    }

    //Shuffle the shoe
    //https://www.frankmitchell.org/2015/01/fisher-yates/
    shuffle () {
        var i = 0
        var j = 0
        var temp = null
        
        for (i = this.cards.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1))
            temp = this.cards[i]
            this.cards[i] = this.cards[j]
            this.cards[j] = temp
        }
    }


    drawCard () {
        return this.cards.pop();
    }
}

function resizeCanvas(canvas, ctx) {
    let width = document.getElementById("gameCell").getBoundingClientRect().width * 0.95;
    let height = width * 0.6
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#292";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScreen () {
    resizeCanvas(canvas, ctx);
    ctx.fillStyle = "#fff";
    ctx.font = `20px Arial`;
    ctx.textAlign = "left";
    ctx.fillText("Dealer: " + dealerHand.logHand(), 100, 40)
    ctx.fillText("Dealer Score: " + dealerHand.score, 100, 65)
    ctx.fillText("Player: " + playerHand.logHand(), 100, 100)
    ctx.fillText("Player Score: " + playerHand.score, 100, 125)
}

function startGame() {
    bankroll = $("#bankroll").val();
    numDecks = $("#numDecks").val();
    betAmount = $("#betAmount").val();
    shoe = new Shoe(numDecks);
    shoe.shuffle();
    drawNewHands();
}

function drawNewHands() {
    betAmount = $("#betAmount").val();
    bankroll -= betAmount
    $("#currentBankroll").text("$" + bankroll)
    dealerHand = new Hand();
    playerHand = new Hand();
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    drawScreen();

    $("#hitButton").attr("disabled", false);
    $("#standButton").attr("disabled", false);
    $("#doubleButton").attr("disabled", false);
    if (playerHand.canSplit()) {
        $("#splitButton").attr("disabled", false);
    }
}

function finishGame() {
    if (dealerHand.isBusted()) {
        alert("Player Wins")
        bankroll += 2*betAmount;
    } else if (dealerHand.score === playerHand.score) {
        alert("Push");
        bankroll += betAmount;
    } else if (dealerHand.score > playerHand.score || playerHand.isBusted()) {
        alert("Dealer Wins");
    } else {
        alert("Player Wins");
        bankroll += 2*betAmount;
    }
    $("#newHandButton").attr("disabled", false);
    $("#currentBankroll").text("$" + bankroll)
}

function doubleDown () {
    $("#doubleButton").attr("disabled", true);
    $("#splitButton").attr("disabled", true);
    $("#hitButton").attr("disabled", true);
    $("#standButton").attr("disabled", true);
    bankroll -= betAmount;
    $("#currentBankroll").text("$" + bankroll)
    playerHand.addCard(shoe.drawCard());
    drawScreen();
    finishDealerHand();
}

function finishDealerHand() {
    // Finish Dealer play if Player doesn't bust
    while (dealerHand.score < 17 || (dealerHand.isSoft())) {
            dealerHand.addCard(shoe.drawCard());
            drawScreen();
        }
    finishGame();
}

$("#startButton").click(function () {
    startGame();
});

$("#doubleButton").click(function () {
    doubleDown();
});

$("#newHandButton").click(function () {
    $("#newHandButton").attr("disabled", true);
    drawNewHands();
});

$("#hitButton").click(function () {
    playerHand.addCard(shoe.drawCard());
    $("#doubleButton").attr("disabled", true);
    $("#splitButton").attr("disabled", true);
    drawScreen();
    if (playerHand.isBusted()) {
        finishGame();
    }
});

$("#standButton").click(function () {
    finishDealerHand();
    $("#doubleButton").attr("disabled", true);
    $("#splitButton").attr("disabled", true);
    $("#hitButton").attr("disabled", true);
    $("#standButton").attr("disabled", true);
});

var bankroll, numDecks, shoe, dealerHand, playerHand, betAmount;

let canvas = document.getElementById('gameArea');
let ctx = canvas.getContext('2d');
resizeCanvas(canvas, ctx);


