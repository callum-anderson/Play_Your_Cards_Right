document.addEventListener('DOMContentLoaded', ()=>{
  for (let i = 0; i < 100; i++) {
    const star = '<div class="star" style="animation: twinkle '+((Math.random()*5) + 5)+'s linear '+((Math.random()*5) + 5)+'s infinite; top: '+Math.random()*document.body.clientHeight*1.5+'px; left: '+Math.random()*document.body.clientWidth+'px;"></div>';
    document.querySelector('body').innerHTML += star;
  }

  let gameDeck = startDeck;

  const card1Slot = document.querySelector('#card1');
  const card2Slot = document.querySelector('#card2');
  const card3Slot = document.querySelector('#card3');
  const card4Slot = document.querySelector('#card4');
  const card5Slot = document.querySelector('#card5');
  const cardSlots = [card1Slot,card2Slot,card3Slot,card4Slot,card5Slot];

  const dealtCards = [];
  let currentCard = 0;
  let gameActive = false;
  let currentScore = 0;
  let currentCardChanges = 3;

  const dealButton = document.querySelector('#deal-button');
  const playButton = document.querySelector('#play-button');
  const aboutButton = document.querySelector('#about-button');
  const instructionsButton = document.querySelector('#instructions-button');
  const higherButton = document.querySelector('#higher-button');
  const lowerButton = document.querySelector('#lower-button');
  const changeCardButton = document.querySelector('#change-card');

  const aboutModal = document.querySelector('#about-modal');
  const aboutCloseButton = document.querySelector('#about-modal .close-button');
  const instructionsModal = document.querySelector('#instructions-modal');
  const instructionsCloseButton = document.querySelector('#instructions-modal .close-button');
  const gameInfo = document.querySelector('#game-info');
  const gameOutput = document.querySelector('#game-output');
  const questionSection = document.querySelector('#question-output');

  const gameScore = document.querySelector('#score-span');
  const cardChanges = document.querySelector('#changes-span');

  playButton.addEventListener('click', ()=>{
    resetGame();
    dealCards();
    setUpCards();
  });

  aboutButton.addEventListener('click', toggleAbout);
  aboutCloseButton.addEventListener('click', toggleAbout);
  instructionsButton.addEventListener('click', toggleInstructions);
  instructionsCloseButton.addEventListener('click', toggleInstructions);


  higherButton.addEventListener('click', (e)=>{
    console.log(gameDeck.length);
    lowerButton.classList.remove('higher-lower-pressed');
    e.target.classList.add('higher-lower-pressed');
  });

  lowerButton.addEventListener('click', (e)=>{
    higherButton.classList.remove('higher-lower-pressed');
    e.target.classList.add('higher-lower-pressed');
  });

  window.addEventListener('click', modalOnClick);

  function toggleAbout() {
       aboutModal.classList.toggle("show-rules-about");
   }
   function toggleInstructions() {
        instructionsModal.classList.toggle("show-rules-about");
    }

    function modalOnClick(e) {
        if (e.target === instructionsModal) {
            toggleInstructions();
        } else if (e.target === aboutModal) {
          toggleAbout();
        }
    }

  function renderCard(targetCard, cardRank, cardSuit) {
    let suit = cardSuit;
    switch (suit) {
      case "Hearts": suit = "\u2665"; targetCard.style.color = "red";
      break;
      case "Diamonds": suit = "\u2666"; targetCard.style.color = "red";
      break;
      case "Clubs": suit = "\u2660";
      break;
      case "Spades": suit = "\u2663";
      break;
    }
    let rank = cardRank;
    if (rank>10){
      switch (rank) {
        case 11: rank = "J";
        break;
        case 12: rank = "Q";
        break;
        case 13: rank = "K";
        break;
        case 14: rank = "A";
        break;
      }
    }
    targetCard.innerHTML = "<p class='card-top-left'>"+rank+"<br>"+suit+"</p><p class='card-middle'>"+suit+"</p><p class='card-bottom-right'>"+rank+"<br>"+suit+"</p>";
  }

  function dealCards() {
    dealtCards.length = 0;
    let i = 0;
    function setCard() {
      cardSlots[i].style.background = 'repeating-linear-gradient(45deg,lightcoral,lightcoral 10px,crimson 10px,crimson 20px)';
      const randCard = randomCard();
      dealtCards.push(randCard);
      renderCard(cardSlots[i].firstElementChild, randCard.value, randCard.suit);
      i++;
      if (i<cardSlots.length){
        setTimeout(setCard, 200);
      }
    }
    setCard();
  }

  function setUpCards() {
    for (cardSlot of cardSlots) {
      if (cardSlot.previousElementSibling === null) {
        cardSlot.classList.add('next-card');
      }
      cardSlot.onclick = function(e) {
        clearAreas();
        const innerCard = e.target.firstElementChild;
        if (!e.target.previousElementSibling.firstElementChild.classList.contains('hidden')
            && higherOrLowerClicked()) {
          e.target.style.background = "white";
          innerCard.classList.remove('hidden');
          if (e.target.nextElementSibling != null && evaluateCards()) {
            e.target.nextElementSibling.classList.add('next-card');
            currentCard++;
            updateScore();
          } else if (e.target.nextElementSibling === null && evaluateCards() && gameDeck.length>=5) {
            let delay = 0;
            function delayReRack() {
              delay++;
              if (delay<5){
                if (gameInfo.textContent === "") {
                  gameInfoFlash();
                  gameInfo.textContent = "RE-RACKING.....";
                } else {
                  gameInfo.textContent = "";
                }
                setTimeout(delayReRack, 400);
              } else {
                currentCard = 0;
                updateScore();
                rackCards();
                dealCards();
                setUpCards();
                gameInfo.textContent = "Click on the first card to reveal it...";
              }
            }
            delayReRack();
          } else if (e.target.nextElementSibling === null && evaluateCards()) {
            updateScore();
            endGame(true);
          } else {
            endGame(false);
          }
          resetControls();
          e.target.classList.remove('next-card');
          e.target.onclick = null;
        }
      }
    }
    cardSlots[0].onclick = function(e) {
      clearAreas();
      const innerCard = e.target.firstElementChild;
      e.target.style.background = "white";
      innerCard.classList.remove('hidden');
      e.target.nextElementSibling.classList.add('next-card');
      resetControls();
      e.target.classList.remove('next-card');
      e.target.onclick = null;
    }
  }




  changeCardButton.onclick = function() {
    if (gameActive && !cardSlots[currentCard].firstElementChild.classList.contains('hidden')) {
        if (currentCardChanges>0) {
          questionSection.innerHTML = "";
          updateCardChanges();
          addQuestionToPage(loadQuestion());
        } else {
          gameInfoFlash();
          gameInfo.textContent = "You have no more card changes to play!";
          questionSection.innerHTML = "";
        }
      }

  }

  function loadQuestion() {
    const randNumber = (Math.floor(Math.random()*quizquestions.length));
    const questionToReturn = quizquestions.splice(randNumber, 1);
    return questionToReturn;
  }

  function updateScore() {
    currentScore++;
    gameScore.textContent = currentScore;
    gameChangesScoreFlash(gameScore);
  }

  function updateCardChanges() {
    currentCardChanges--;
    cardChanges.textContent = currentCardChanges;
    gameChangesScoreFlash(cardChanges);
  }

function addQuestionToPage(loadedQuestion) {
  gameInfoFlash();
  gameInfo.textContent = "Answer the following to swap your card...";
  const quest = document.createElement('p');
  quest.textContent = loadedQuestion[0].question;
  const questions = document.createElement('ul');
  for (option in loadedQuestion[0].answers) {
    const listItem = document.createElement('li');
    listItem.textContent = loadedQuestion[0].answers[option];
    listItem.onclick = function(e) {
      e.target.style.backgroundColor = "red";
      e.target.parentNode.children[loadedQuestion[0].answer].style.backgroundColor = "limegreen";
      if (e.target.textContent === loadedQuestion[0].answers[loadedQuestion[0].answer]) {
        gameInfoFlash();
        gameInfo.textContent = "Correct! Your card has been swapped.";
        changeCard();
      } else {
        gameInfoFlash();
        gameInfo.textContent = "Incorrect!";
      }
      for (item of e.target.parentNode.children) {
        item.onclick = null;
      }
    }
    questions.appendChild(listItem);
  }
  questionSection.appendChild(quest);
  questionSection.appendChild(questions);
}

  function evaluateCards() {
    let guessedCorrect = true;
      if (lowerButton.classList.contains('higher-lower-pressed')) {
        if (dealtCards[currentCard+1].value>dealtCards[currentCard].value) {
          guessedCorrect = false;
        }
      } else if (higherButton.classList.contains('higher-lower-pressed')) {
        if (dealtCards[currentCard+1].value<dealtCards[currentCard].value) {
          guessedCorrect = false;
        }
      }
    return guessedCorrect;
  }

  function higherOrLowerClicked() {
    if (lowerButton.classList.contains('higher-lower-pressed') ||
          higherButton.classList.contains('higher-lower-pressed'))
          {
            return true;
          }
    return false;
  }

  function resetControls() {
    lowerButton.classList.remove('higher-lower-pressed');
    higherButton.classList.remove('higher-lower-pressed');
  }

  function randomCard(){
    if (gameDeck.length>0) {
    const randNumber = (Math.floor(Math.random()*gameDeck.length));
    return gameDeck.splice(randNumber, 1)[0];
    } else return null;
  }

  function changeCard() {
    const randCard = randomCard();
    dealtCards.splice(currentCard, 1, randCard);
    renderCard(cardSlots[currentCard].firstElementChild, randCard.value, randCard.suit);
  }

  function endGame(gameWon) {
    gameActive = false;
    for (cardSlot of cardSlots) {
      cardSlot.onclick = null;
    }
    if (gameWon) {
      gameInfo.textContent = "\u2666 \u2663 All cards have been played - YOU WIN! \u2665 \u2660";
    } else {
      gameInfo.textContent = "\u2666 \u2663 GAME OVER \u2665 \u2660";
      gameChangesScoreFlash(gameInfo);
      gameInfo.style.backgroundColor = "lightcoral";
    }
  }

  function clearAreas() {
    gameInfo.textContent = "";
    questionSection.innerHTML = "";
  }

  function rackCards() {
    for (cardSlot of cardSlots) {
      let i = 0;
      function resetCard() {
        cardSlot.style.background = 'white';
        i++;
        if (i<cardSlots.length){
          setTimeout(resetCard, 200);
        }
      }
      resetCard();
    }
    for (cardSlot of cardSlots) {
          cardSlot.innerHTML = '<div class="card-content hidden"></div>';
    }
  }

  function resetGame() {
    gameInfoFlash();
    gameActive = true;
    gameDeck = startDeck;
    dealtCards.length = 0;
    gameInfo.textContent = "Click on the first card to reveal it...";
    questionSection.innerHTML = "";
    gameScore.textContent = "0";
    cardChanges.textContent = "3";

    currentCard = 0;
    currentScore = 0;
    currentCardChanges = 3;
    rackCards();
  }

  function gameInfoFlash() {
      let i = 12;
      function increment(){
        gameInfo.style.border = "3px solid rgba(128,0,128,"+(i/20)+")";
        gameInfo.style.backgroundColor = "rgba(255,125,255,"+(i/20)+")";;
        if (i>-1) {
          i--;
          setTimeout(increment, 90);
        } else {
          gameInfo.style.border = "3px solid white";
          gameInfo.style.backgroundColor = "white";
        }
      }
      increment();
  }

  function gameChangesScoreFlash(element) {
      let i = 12;
      function increment(){
        element.style.color = "rgba(128,0,128,"+(i/20)+")";
        if (i>-1) {
          i--;
          setTimeout(increment, 80);
        } else {
          element.style.color = "black";
        }
      }
      increment();
  }

});
