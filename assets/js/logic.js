// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;
// variables to reference DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');
var startEl = document.getElementById('start-screen');
var scoreEl = document.getElementById('final-score');
// sound effects
var sfxRight = new Audio('./assets/sfx/correct.mp3');
var sfxWrong = new Audio('./assets/sfx/incorrect.mp3');

timerEl.textContent = time;

function startQuiz() {
    // hide start screen
    startEl.classList.add('hide');
    // un-hide questions section
    questionsEl.classList.remove('hide')
    //start timer (high)
    timerId = setInterval(function clockTick() {
        // update time
        time--;
        timerEl.textContent = time;
    
        // check if user ran out of time
        if (time <= 0) {
            quizEnd();
        }
    }, 1000);

   
    //you need to declare a var named timerId. You will also need to use setInterval and clockTick

    //show starting time (high)

    getQuestion();
}

function getQuestion() { //this function is going to get the data from the questions array
    // get current question object from array
    var currentQuestion = questions[currentQuestionIndex]
    // update title with current question
    var titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;

    // clear out any old question choices
    choicesEl.innerHTML = ''; //Study this later

    // create a for loop that creates the choice elements
    for (var i = 0; i < currentQuestion.choices.length; i++) {
        // create new button for each choice
        //.createElement
        var choiceBtn = document.createElement('button');
        //.setAttribute (set a class="choice")
        choiceBtn.setAttribute('class', 'choice btn btn-light');
        //.textContent
        choiceBtn.textContent = currentQuestion.choices[i];
        //.appendChild
        choicesEl.appendChild(choiceBtn);
    }
}

function questionClick(event) {
    var buttonEl = event.target;
    var currentAnswer = questions[currentQuestionIndex].answer
    // if the clicked element is not a choice button, do nothing.
    if (!buttonEl.matches('.choice')) {
        return;
    }

    // check if user guessed right or wrong
    if (buttonEl.textContent === currentAnswer) {

        feedbackEl.textContent = 'Correct!';
        // feedbackEl.classList.remove('hide');
        feedbackEl.setAttribute('class', 'alert alert-success row justify-content-center')
        sfxRight.play();
    } else {
        //incorrect scenario

        time = time - 15;
        feedbackEl.textContent = 'Incorrect';
        // feedbackEl.classList.remove('hide');
        feedbackEl.setAttribute('class', 'alert alert-danger row justify-content-center');
        sfxWrong.play();
    }

    // move to next question
    currentQuestionIndex++;

    // check if we've run out of questions
    if (time <= 0 || currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

function quizEnd() {
    // stop timer
    clearInterval(timerId);

    // show end screen
    var endScreenEl = document.getElementById('end-screen');
    endScreenEl.removeAttribute('class');

    // show final score
    var finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = time;

    // hide questions section
    questionsEl.setAttribute('class', 'hide');
    feedbackEl.classList.add('hide');
}

function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();
    var score = scoreEl.textContent;
    // make sure value wasn't empty
    if (initials !== '') {

        //JSON.parse
        // get saved scores from localstorage (highscores), or if not any, set to empty array
        var highScores = JSON.parse(window.localStorage.getItem('highscores')) ?? [];
        // format new score object for current user
        var scoreData = {
            user:initials,
            userScore:score
        }
        // save to localstorage
        highScores.push(scoreData)
        window.localStorage.setItem('highscores', JSON.stringify(highScores))
        // redirect to next page
        window.location.href = 'highscores.html';
    }
}

function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === 'Enter') {
        saveHighscore();
    }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

// user clicks on element containing choices
choicesEl.onclick = questionClick;

initialsEl.onkeyup = checkForEnter;