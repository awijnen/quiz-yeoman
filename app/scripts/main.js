'use strict';

// *** Quiz object ***
var quiz = [
    {   question: 'Who was the starting keeper for Anderlecht in 2014?',
        choices: ['Danny Verlinden', 'Silvio Proto', 'Manuel Neuer'],
        correctAnswer: 1
    },
    {   question: 'Who won the world cup in Brazil 2014?',
        choices: ['Belgium', 'Italy', 'Germany'],
        correctAnswer: 2
    },
    {   question: 'Who bit someone during the world cup in Brazil 2014?',
        choices: ['Luis Suarez', 'Mario Balotelli', 'Cristanio Ronaldo'],
        correctAnswer: 0
    },
    {   question: 'Where did Thomas Vermaelen transfer to from Arsenal?',
        choices: ['Juventus', 'Chelsea', 'Barcelona'],
        correctAnswer: 2
    },
    {   question: 'Where did Lebron James start his NBA carreer?',
        choices: ['NY Knicks', 'Miami Heat', 'Cleveland Caveliers'],
        correctAnswer: 2
    }
];

// *** Init ***
var quizItemCounter = 0;
var quizTotalItemCount = quiz.length;
var quizWindow = $('#quiz-window');
var startButton = $('#start-button');
var userAnswers =   {
                        quizTaken: quiz,
                        answers: []
                    };
var correctAnswers = [];
var score = 0;

// *** Utility functions ***
function resetQuizItemCounter() {
    quizItemCounter = 0;
}

function fillCorrectAnswerArray(quizItem) {
    correctAnswers.push(quizItem.correctAnswer);
}

function stepBack() {
    console.log('Reducing quizItem counter by 2');
    quizItemCounter -= 2;
    console.log('Popping last correct Answer');
    correctAnswers.pop();
}

function loadQuizQuestion(direction) {
   if (direction === 'previous') {
        stepBack();
    }

    console.log('quizItemCounter: ' + quizItemCounter);
    var quizItem = quiz[quizItemCounter];
    questionsIntoSkeleton(quizItem, direction);

    if (direction === 'next') {
        console.log('Filling Correct Answer Array.')
        fillCorrectAnswerArray(quizItem);
    }

    quizItemCounter++;
}

function loadFirstQuestion() {
    resetQuizItemCounter();
    loadQuizQuestion('next');
}

function loadNewQuiz() {
    quizWindow.load('quizSkeleton.html', loadFirstQuestion);
}

function loadNewQuestion(event) {
    // load another questions
    // direcion will be 'next' or 'previous'
    loadQuizQuestion(event.data.direction);
    // because we don't want to trigger actual submit
    return false;
}

function calcFinalScore(){
    var answers = userAnswers.answers;

    console.log(answers);
    console.log(correctAnswers);

    // compare both arrays and update score
    for (var i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i] == answers[i]) { score += 1; }
    }
}

function displayScore() {
    calcFinalScore();
    var scoreSpan = $('#scoreSpan');
    scoreSpan.text(score + ' / ' + quizTotalItemCount);
}

function loadQuizEnd() {
    quizWindow.load('quizEnd.html', displayScore);
    return false;
}

function registerUserSelection() {
    var checkedAnswer = $(':checked').val();
    userAnswers.answers.push(checkedAnswer);
    console.log('Pushed answer into array: ' + userAnswers.answers);
}

function isAnswered(event) {
  var options = $('input[name="quiz-option"]');
  var result = false;
  options.each(function(idx, option) {
    if (result = option.checked) {
      return false;
    }
  });

  // Stop registerUserSelection & loadNewQuestion click handlers from firing
  if (!result) {
    alert('Please provide an answer!');
    event.stopImmediatePropagation();
  }

  console.log('isAnswered will return: ' + result);
  return result;
}

function resetRadioSelection(radioButtons) {
    radioButtons.each(function(idx, el){
       $(el).prop('checked', false);
    });
}

function recoverRadioSelection(radioButtons) {
    var lastAnswer = userAnswers.answers[userAnswers.answers.length-1];
    $(radioButtons[lastAnswer]).prop('checked', true);

    // pop last answer given by the user as this will be pushed into the array upon re-answering previous question
    userAnswers.answers.pop();

}

function toggleBackButton(quizItemCounter) {
    var backButton = $('input.quiz-previous');

    if (quizItemCounter == 0) {
        console.log('Hiding backButton');
        backButton.hide();
    }
    else if (quizItemCounter != 0) {
        console.log('Showing backButton');
        backButton.show();
    }
    else { throw new Error('Quiz cannot be toggled.'); }
}

function questionsIntoSkeleton(quizItem, direction) {
    console.log('loading quiz question: ' + quizItem);

    var quizInstance = $('div.quiz-instance');
    var questionTitle = $('.quiz-question h2');
    var questionAnswers = $('label.quiz-option');
    var radioButtons = $('input[type="radio"]');
    var submitButton = $('input.quiz-next');
    var backButton = $('input.quiz-previous');
    var form = $('form.quiz-form');

    console.log(quizItem);
    questionTitle.text(quizItem.question);

    $.each(questionAnswers, function(idx, el){
        $(this).text(quizItem.choices[idx]);
    });

    toggleBackButton(quizItemCounter);

    // first time around bind the click button to a handler which loads a news question/answers into the DOM
    if (quizItemCounter === 0 && direction !== 'previous') {
        submitButton.click(isAnswered);
        submitButton.click(registerUserSelection);
        submitButton.bind('click', {direction: 'next'}, loadNewQuestion);
        backButton.bind('click', {direction: 'previous'}, loadNewQuestion);
        form.bind('submit', {quiz: quizItem}, loadQuizEnd);
    }

    // on last question bind the click button to a special handler
    if (quizItemCounter === (quizTotalItemCount-1)) {
        console.log('unbinding loadNewQuestion from submit button');
        submitButton.unbind('click', loadNewQuestion);
    }

    if (direction === 'next') {
        console.log('Resetting radio buttons');
        resetRadioSelection(radioButtons);
    } else if (direction === 'previous') {
        console.log('Loading previous selection');
        recoverRadioSelection(radioButtons);
    }

    quizInstance.show();

    console.log('Finished loading quiz questions');
}

// *** Run ***
startButton.click(loadNewQuiz);




