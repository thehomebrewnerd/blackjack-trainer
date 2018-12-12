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

function resizeCanvas(canvas) {
    let width = document.getElementById("gameCell").getBoundingClientRect().width * 0.95;
    let height = width * 0.6
    canvas.width = width;
    canvas.height = height;
}

function startGame() {
    bankroll = $("#bankroll").val();
    numDecks = $("#numDecks").val();
    shoe = new Shoe(numDecks);
    shoe.shuffle();
    dealerHand = new Hand();
    playerHand = new Hand();
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    console.log(dealerHand.score, playerHand.score)
    ctx.fillStyle = "#fff";
    ctx.font = `20px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Dealer: " + dealerHand.logHand(), 100, 40)
    ctx.fillText("Player: " + playerHand.logHand(), 100, 100)
}

function finishDealerHand() {
    // Finish Dealer play if Player doesn't bust
    while (dealerHand.score < 17 || (dealerHand.isSoft())) {
        dealerHand.addCard(shoe.drawCard());
    }
    console.log("Dealer Final Score", dealerHand.score);
    dealerHand.logHand();
}

$("#startButton").click( function () {
    startGame();
});

var bankroll, numDecks, shoe, dealerHand, playerHand;

let canvas = document.getElementById('gameArea');
resizeCanvas(canvas);
let ctx = canvas.getContext('2d');
ctx.fillStyle = "#292";
ctx.fillRect(0, 0, canvas.width, canvas.height);
