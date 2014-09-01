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

function loadQuizQuestion() {
    console.log('quizItemCounter: ' + quizItemCounter);
    var quizItem = quiz[quizItemCounter];
    fillCorrectAnswerArray(quizItem);
    questionsIntoSkeleton(quizItem);
    quizItemCounter++;
}

function loadFirstQuestion() {
    resetQuizItemCounter();
    loadQuizQuestion();
}

function loadNewQuiz() {
    quizWindow.load('quizSkeleton.html', loadFirstQuestion);
}

function loadNewQuestion() {
    // load another questions that's not the first nor the last
    loadQuizQuestion();
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
       $(el).attr('checked', false); 
    });
}

function questionsIntoSkeleton(quizItem) {
    console.log('loading quiz questions ...');
    
    var quizInstance = $('div.quiz-instance');
    var questionTitle = $('.quiz-question h2');
    var questionAnswers = $('label.quiz-option');
    var radioButtons = $('input[type="radio"]');
    var submitButton = $('input[type="submit"]');
    var form = $('form.quiz-form');

    console.log(quizItem);
    questionTitle.text(quizItem.question);

    $.each(questionAnswers, function(idx, el){
        $(this).text(quizItem.choices[idx]);
    });    

    // first time around bind the click button to a handler which loads a news question/answers into the DOM
    if (quizItemCounter === 0) {
        submitButton.click(isAnswered);
        submitButton.click(registerUserSelection);
        submitButton.click(loadNewQuestion);
        form.bind('submit', {quiz: quizItem}, loadQuizEnd);
    }

    // on last question bind the click button to a special handler
    if (quizItemCounter === (quizTotalItemCount-1)) {
        console.log('unbinding loadNewQuestion from button');
        submitButton.unbind('click', loadNewQuestion);
    }

    console.log('Resetting radio buttons');
    resetRadioSelection(radioButtons);
    quizInstance.show();

    console.log('Finished loading quiz questions');
}

// *** Run ***
startButton.click(loadNewQuiz);

