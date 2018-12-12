let canvas = document.getElementById('gameArea');
canvas.width = 800;
canvas.height = 600;
let headerFontSize = 30;
let ctx = canvas.getContext('2d');

ctx.fillStyle = "#0f4";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#000";
ctx.font = `${headerFontSize}px Arial`;
ctx.textAlign = "center";
ctx.fillText("Play Blackjack!", canvas.width/2, 40)

function buildShoe(numDecks) {
    var shoe = new Shoe(numDecks);
    shoe.shuffle();
    return shoe;
}

//Set the initial game parameters
var bankroll = 1000;
var bet = 5;
var numDecks = 1;
var shoe = buildShoe(numDecks);

//Add event listener to detect key presses
function keyPress(event) {
    playerMove = event.keyCode;
}

document.addEventListener("keydown", keyPress);

function playGame() {
    //Deal Initial Cards
    var dealerHand = new Hand();
    var playerHand = new Hand();
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    //dealerHand.addCard(new Card("C", 14));
    playerHand.addCard(shoe.drawCard());
    dealerHand.addCard(shoe.drawCard());
    //dealerHand.addCard(new Card("S", 14));

    //Check hands for Blackjack
    console.log("Player");
    playerHand.logHand();
    console.log(playerHand.score);
    console.log("Dealer");
    dealerHand.logHand();
    console.log(dealerHand.score);

    // Get Player Input (while not standing)
    

    // Finish Dealer play if Player doesn't bust
    while (dealerHand.score < 17 || (dealerHand.isSoft())) {
        dealerHand.addCard(shoe.drawCard());
    }
    console.log("Dealer Final Score", dealerHand.score);
    dealerHand.logHand();
    
    // Determine Winner


    // Update Bankroll

    // Check that shoe has enough cards and rebuild if needed

}

playGame();
