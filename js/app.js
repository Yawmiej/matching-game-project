//All global variables
const deck = document.querySelector('.deck');
let moveCount = 0;
let clockOff = true;
let time = 0;
let allMatchedCards = [];
let clockId;
const cards = document.querySelectorAll('.card');
let openedCards = [];


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function startGame(){
    const cardClass = ['fa-diamond', 'fa-bomb', 'fa-bicycle',
                'fa-anchor', 'fa-leaf', 'fa-bolt','fa-cube',
                'fa-paper-plane-o', 'fa-diamond', 'fa-bomb',
                'fa-bicycle', 'fa-anchor', 'fa-leaf',
                'fa-bolt', 'fa-cube', 'fa-paper-plane-o'
                ];
    const cardHTML = shuffle(cardClass).map(createCard);
    deck.innerHTML = cardHTML.join('');
    setStars();
    getMoves();
    allMatchedCards = [];
}
startGame();


function setStars(){
    const initStars = document.querySelector('.stars');
    const starHtml = `<li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>
                    <li><i class="fa fa-star"></i></li>`;
    initStars.innerHTML = starHtml;
}//creates stars javaScriptically



function matchCard(){
    if(openedCards[0].firstElementChild.className === openedCards[1].firstChild.className) {
        openedCards[0].classList.add('match');
        openedCards[1].classList.add('match');
        allMatchedCards.push(openedCards[0
        ]);
        allMatchedCards.push(openedCards[1]);
        console.log(allMatchedCards);
        openedCards = [];//reset the array when cards match
    } else{
        setTimeout(function() {
            openedCards.forEach(removeCard);
        }, 1000);
    }
}//matches card and add to a global variable


function createCard(card){
    const cardTemplate = `<li class="card"><i class="fa ${card}"></i></li>`;
    return cardTemplate;
}


function openCard(clickCard){
    clickCard.classList.add('open', 'show');
}


function pushCard(clickCard){
    openedCards.push(clickCard);
    console.log(openedCards);
}


function removeCard(card){
    card.classList.remove('open', 'show');
    openedCards = [];
}//if cards don't match, this function should be called


function getMoves(){
    const moves = document.querySelector('.moves');
    moves.innerText = moveCount;
}//returns the number of moves made


function startClock(){
    clockId = setInterval(function(){
        time++;
        displayTime();
    }, 1000);
}//Increase time value every 1 seconds


function stopClock(){
    clearInterval(clockId);
}//ends time


function displayTime(){
    const clock = document.querySelector('.clock');
    const minutes = Math.floor(time / 60)
    const seconds = Math.round(time % 60, 2);
    if (seconds < 10){
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerText = `${minutes}:${seconds}`;
    }
}//display the time count


function checkStar(){
    let stars = document.querySelector('.stars');
    if(moveCount === 11 || moveCount === 21){
        stars.removeChild(stars.firstElementChild);
    }
    return stars;
}//reduces star rating when moves is more than 10 and 20


function displayStats(){
    //to set time in modal
    const finalTime = document.querySelector('.final-time');
    const collectTime = document.querySelector('.clock').innerText;
    finalTime.innerText = collectTime;
    
    //to set stars in modal
    const finalStar = document.querySelector('.final-stars');
    const collectStar = document.querySelector('.stars').innerHTML;
    finalStar.innerHTML = collectStar;

    //to set moves in modal
    const finalMoves = document.querySelector('.final-moves');
    const collectMoves = document.querySelector('.moves').innerText;
    finalMoves.innerText = collectMoves;
}//displays game stats by receiving from the game board and adding to the modal


function toggleModal(){
    const modal = document.querySelector(".modal-container");
    modal.classList.toggle('hide');
}//Shows and hide modal


function endGame(){
    stopClock();
    setTimeout(function(){
        toggleModal();
        displayStats();
    }, 200);
}//End games, stops clock, shows modal and displays statistics


/*event listener is added to the deck and checked for card click target
when the card is clicked, the open and show class are added to the classList,
then pushed into an array.
*/
deck.addEventListener('click', function(evt) {
    const card = evt.target;
    if(card.classList.contains('card') && (openedCards.length < 2) && (!card.classList.contains('show'))){
        openCard(card);//Opens card
        pushCard(card);//adds opened card to an array for matching

        if(clockOff){
            startClock();
            clockOff = false;
        }//starts clock and alters clockOff to avoid starting clock again

        if(openedCards.length === 2) {
            matchCard();//match opened cards
            moveCount += 1;//increases the number of moves after every match
            getMoves();//displays number of moves
            checkStar();
        }//when two cards are open, checks if they match, increase moves and reduces stars at certain move count

        if(allMatchedCards.length === 16) {
            endGame();
        }//game win con
    }
});


//All reset functions for reset buttons
function resetClock() {
    stopClock();
    time = 0;
    clockOff = true;
    displayTime();
}


function resetMoves() {
    moveCount = 0;
    openedCards = [];
    getMoves();
}


function resetStar() {
    moveCount = 0;
    checkStar();
}


function resetGame() {
    resetClock();
    resetMoves();
    resetStar();
    startGame();
}//reset game while playing


function restartGame(){
    resetGame();
    toggleModal();
}//restart game after win


const modalButtons = document.querySelector('.modal-button');
modalButtons.addEventListener('click', function(event) {
    const button = event.target;
    if(button.classList.contains('butn-cancel')){
        toggleModal();
    } else if(button.classList.contains('butn-replay')){
        restartGame();
    }
});


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 /*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */