document.addEventListener('DOMContentLoaded', ()=>{

const card1Slot = document.querySelector('#card1');
const card2Slot = document.querySelector('#card2');
const card3Slot = document.querySelector('#card3');
const card4Slot = document.querySelector('#card4');
const card5Slot = document.querySelector('#card5');
const cardSlots = [card1Slot,card2Slot,card3Slot,card4Slot,card5Slot];

const dealtCards = [];
let currentCard = 0;

const dealButton = document.querySelector('#deal-button');
const higherButton = document.querySelector('#higher-button');
const lowerButton = document.querySelector('#lower-button');
const changeCardButton = document.querySelector('#change-card');

const gameOutput = document.querySelector('#game-output');
const questionSection = document.querySelector('#question-output');

  dealButton.addEventListener('click', ()=>{
    for (i=0; i<cardSlots.length; i++) {
      const randCard = randomCard();
      dealtCards.push(randCard);
      cardSlots[i].firstElementChild.textContent = `${randCard.name} of ${randCard.suit}`;
    }
    console.log(dealtCards);
    setUpCards();
  });

  higherButton.addEventListener('click', (e)=>{
    lowerButton.classList.remove('higher-lower-pressed');
    e.target.classList.add('higher-lower-pressed');
  });
  lowerButton.addEventListener('click', (e)=>{
    higherButton.classList.remove('higher-lower-pressed');
    e.target.classList.add('higher-lower-pressed');
  });

function setUpCards(){
  for (cardSlot of cardSlots) {
    if (cardSlot.previousElementSibling === null) {
      cardSlot.classList.add('next-card');
    }
    cardSlot.onclick = function(e) {
      clearAreas();
      const innerCard = e.target.firstElementChild;
      if (!e.target.previousElementSibling.firstElementChild.classList.contains('hidden')
          && higherOrLowerClicked())
      {
        innerCard.classList.remove('hidden');
        if (e.target.nextElementSibling != null && evaluateCards()) {
          e.target.nextElementSibling.classList.add('next-card');
          currentCard++;
        } else if (e.target.nextElementSibling === null && evaluateCards()) {
          endGame(true);
        } else {
          endGame(false);
        }
        resetControls();
        e.target.classList.remove('next-card');
        e.target.onclick = null;
      }
    }
    cardSlots[0].onclick = function(e) {
      const innerCard = e.target.firstElementChild;
      innerCard.classList.remove('hidden');
      e.target.nextElementSibling.classList.add('next-card');
      resetControls();
      e.target.classList.remove('next-card');
      e.target.onclick = null;
    }
  }
  changeCardButton.onclick = function() {
    if (questionSection.innerHTML === "" && currentCard>0) {
    addQuestionToPage(loadQuestion());
  } else {
    gameOutput.innerHTML = "You can't change your card twice in a row!";
  }
  }
}

function loadQuestion() {
  const randNumber = (Math.floor(Math.random()*quizquestions.length));
  const questionToReturn = quizquestions.splice(randNumber, 1);
  return questionToReturn;
}

function addQuestionToPage(loadedQuestion) {
  const quest = document.createElement('p');
  quest.textContent = loadedQuestion[0].question;
  const questions = document.createElement('ul');
  for (option in loadedQuestion[0].answers) {
    const listItem = document.createElement('li');
    listItem.textContent = loadedQuestion[0].answers[option];
    listItem.onclick = function(e) {
      e.target.parentNode.children[loadedQuestion[0].answer].classList.add('highlight-correct-answer');
      if (e.target.textContent === loadedQuestion[0].answers[loadedQuestion[0].answer]) {
        gameOutput.innerHTML = "Correct!";
        changeCard();
      } else {
        gameOutput.innerHTML = "Incorrect!";
      }
      for (item of e.target.parentNode.children) {
        item.onclick = null;
      }
    };
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
    if (cardDeck.length>0) {
    const randNumber = (Math.floor(Math.random()*cardDeck.length));
    return cardDeck.splice(randNumber, 1)[0];
    } else return null;
  }

  function changeCard() {
    const randCard = randomCard();
    dealtCards.splice(currentCard, 1, randCard);
    cardSlots[currentCard].firstElementChild.textContent = `${randCard.name} of ${randCard.suit}`;
  }

  function endGame(gameWon) {
    for (cardSlot of cardSlots) {
      cardSlot.onclick = null;
    }
    gameWon ? gameOutput.innerHTML = "YOU WIN" : gameOutput.innerHTML = "GAME OVER";
  }

  function clearAreas() {
    gameOutput.innerHTML = "";
    questionSection.innerHTML = "";
  }

});