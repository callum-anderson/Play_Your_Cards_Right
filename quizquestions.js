const quizquestions = [{question: "The Eiffel Tower is located where in Paris?",
  answers: ["Bois de Boulogne","Champ de Mars","Jardin des Plantes","Parc de Belleville"],
  answer: 1},
{question: "Which Apollo mission landed the first humans on the Moon?",
  answers: ["Apollo 7","Apollo 9","Apollo 11","Apollo 13"],
  answer: 2},
{question: "Who starred in the 1959 epic film 'Ben-Hur'?",
  answers: ["Charlton Heston","Clark Gable","Errol Flynn","Lee Marvin"],
  answer: 0},
{question: "What is the International Air Transport Association airport code for Heathrow Airport?",
  answers: ["HRW","HTR","LHR","LHW"],
  answer: 2},
{question: "The reactor at the site of the Chernobyl nuclear disaster is now in which country?",
  answers: ["Ukraine","Slovakia","Hungary","Russia"],
  answer: 0},
{question: "Which volcano is best known for its eruption in AD 79 that led to the destruction of the Roman cities of Pompeii and Herculaneum?",
  answers: ["Mount Etna","Mount Stromboli","Mount Vesuvius","Mount Vulture"],
  answer: 2},
{question: "The British Naval Ensign features a Union Jack in which corner?",
  answers: ["Top left","Top right","Bottom left","Bottom right"],
  answer: 0},
{question: "Which castle was the childhood home of Elizabeth Bowes-Lyon, the late Queen Mother?",
  answers: ["Craigievar Castle","Glamis Castle","Invergarry Castle","Loch Leven Castle"],
  answer: 1}
];

function loadQuestion() {
  const randNumber = (Math.floor(Math.random()*quizquestions.length));
  const questionToReturn = quizquestions.splice(randNumber, 1);
  return questionToReturn;
}

function addQuestionToPage(loadedQuestion) {
  const gameOutput = document.querySelector('#game-output');
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
  const questionSection = document.querySelector('#question-output');
  questionSection.appendChild(quest);
  questionSection.appendChild(questions);
}








  // http://www.pubquizarea.com/
