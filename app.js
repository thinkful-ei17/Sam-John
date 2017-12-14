const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    answerCorrect: null,
    score: 0,
    sessionTokenStatus: false,
    numberOfQuestions: null,
}

// fetch session token from API
let sessionToken = undefined;

const BASE_URL = 'https://opentdb.com';
const TOKEN_PATH = '/api_token.php';

function fetchSessionToken(callback) {
   $.getJSON(BASE_URL + TOKEN_PATH, {command: 'request'}, function(response) {
      if (response.response_code !== 0) {
        throw new Error('There was a problem connecting to the API. Try again later.');
      } else {
        sessionToken = response.token;
        callback();
        render();
      }
   })
};

function updateStoreTokenStatus(){
    store.sessionTokenStatus = true;
    console.log(sessionToken);
};

fetchSessionToken(updateStoreTokenStatus);

// fet categories from API

let categories = [];

const CATEGORY_PATH = '/api_category.php';

function fetchQuestionCategories(callback) {
    $.getJSON(BASE_URL + CATEGORY_PATH, function(response) {
         callback(response);
    })
 };

function recordCategories(data){
    categories = data.trivia_categories;
    console.log(categories);
};

 fetchQuestionCategories(recordCategories);

// fetch questions from API

let apiQuestions = [];

const QUESTION_PATH = '/api.php'
const query = {
    type: 'multiple',
    token: sessionToken,
    amount: null,
    category: null,
}

function fetchQuestions(callback) {
    $.getJSON(BASE_URL + QUESTION_PATH, query, function(queryResult){
        if (queryResult.response_code !== 0) {
            throw new Error('There was a problem connecting to the API. Try again later.');
        } else {
            callback(queryResult);
        }
    })
};

let newQuestions = [];

function createEmptyQuestionsFolder() {
    for (let i=0; i<store.numberOfQuestions; i++){
        newQuestions.push({'question': null, 'options': null, 'answer': null});
    }
}

function recordQuestions(data){
    apiQuestions = data.results;
    for (let i=0; i<store.numberOfQuestions; i++){
        newQuestions[i].question = data.results[i].question;
        newQuestions[i].options = data.results[i].incorrect_answers;
        newQuestions[i].answer = data.results[i].correct_answer;
        newQuestions[i].options.push(newQuestions[i].answer);
    }
    console.log(newQuestions);
}
    
    // function convertQuestions(questionData) {
    //     console.log(questionData);
    //     for (let i=0; i<store.numberOfQuestions; i++){
    //         newQuestions.push(questionData[i].question);
    //     }
    //     console.log(newQuestions);

// log requested data (number of questions, category)

function requestedNumberOfQuestions(){
    query.amount = $('#optionsOfQuestions').val()
    store.numberOfQuestions = $('#optionsOfQuestions').val();
};

function requestedCategory(){
    query.category = $('#optionsOfCategories').val();
};

// convert questions into proper format



const questions = [{
        question: "Who is 'the hound'",
        options: ['Jon Snow', 'Sandor Clegane', 'Jamie Lannister', 'Khal Drogo'],
        answer: 'Sandor Clegane'
    },
    {
        question: "Who is the father of Jamie Lannister",
        options: ['Bran Lannister', 'Kevin Lannister', 'Tywin Lannister', 'Tyrion Lannister'],
        answer: 2
    },
    {
        question: "What faction is Grey Worm a part of",
        options: ['Unsullied', 'Mormonts', 'THE NORFFF', 'Dothraki'],
        answer: 0
    },
    {
        question: "Where do the Starks Live",
        options: ['Winterfell', 'Highgarden', 'The Wall', 'The Twins'],
        answer: 0
    },
    {
        question: "Who is the rightful Heir of Westeros",
        options: ['Theon', 'Aegon', 'Daenerys', 'Cersei'],
        answer: 1
    }
]

function render() {
    if (store.view === 'start') {
        $('.start').show();
        $('.questionsPage').hide();
        $('.feedback').hide();
        $('.finish').hide();
    } else if (store.view === 'question') {
        $('.start').hide();
        $('.questionsPage').show();
        $('.feedback').hide();
        $('.finish').hide();
        let htmlQuestion = writeQuestion();
        $('.questionsPage').replaceWith(htmlQuestion);
    } else if (store.view === 'feedback') {
        $('.start').hide();
        $('.questionsPage').hide();
        $('.feedback').show();
        $('.finish').hide();
        checkAnswer();
        let htmlFeedback = writeFeedback();
        $('.feedback').replaceWith(htmlFeedback);
    } else {
        $('.start').hide();
        $('.questionsPage').hide();
        $('.feedback').hide();
        $('.finish').show();
        let htmlFinalPage = writeFinalPage();
        $('.finish').replaceWith(htmlFinalPage);
    }
}

render();



$('#start').click(function (event) {
    event.preventDefault();
    if (store.sessionTokenStatus !== true){
        alert("Please be patient. I'm still loading.")
    } else {
        store.view = 'question';
        store.question = 0;
        requestedNumberOfQuestions();
        requestedCategory();
        createEmptyQuestionsFolder();
        fetchQuestions(recordQuestions);
        // convertQuestions(apiQuestions);
        render();
    }
});

$('#quiz').on('submit', '#optionsQuestions', function (event) {
    event.preventDefault();
    if ($('input[name="answerChoice"]').is(':checked')) {
        let response = $('input[name="answerChoice"]:checked').val();
        store.view = 'feedback';
        store.currentAnswer = newQuestions.answer;
        render();
    } else {
        alert('Please select something!');
        return false;
    }
});

function checkAnswer() {
    if (store.currentAnswer === questions[store.question].answer) {
        store.answerCorrect = true;
        store.score++;
    } else {
        store.answerCorrect = false;
    }
}

$('#quiz').on('submit', '#optionsFeedback', function (event) {
    event.preventDefault();
    store.question++;
    if (store.question === store.numberOfQuestions) {
        store.view = 'finish';
    } else {
        store.view = 'question';
    }
    render();
});

function writeQuestion() {
    let num = store.question;
    return `<div class="questionsPage">
        <h2>Question ${store.question + 1}/5</h2>
        <p id="question">${newQuestions[num].question}?</p>
        <p id="progress">Progress: ${store.score}/${num}</p>
        <form id='optionsQuestions' role="form" action="">
            <div>
                <input type="radio" value="${newQuestions[num].options[0]}" name="answerChoice" id="optionA">
                <label for="optionA"><span><span></span></span>${newQuestions[num].options[0]}</label>
            </div>
        <br>
            <div id="radio1">
                <input type="radio" value="${newQuestions[num].options[1]}" name="answerChoice" id="optionB">
                <label for="optionB"><span><span></span></span>${newQuestions[num].options[1]}</label>
            </div>
        <br>
            <div id="radio2">
                <input type="radio" value="${newQuestions[num].options[2]}" name="answerChoice" id="optionC">
                <label for="optionC"><span><span></span></span>${newQuestions[num].options[2]}</label>
            </div>
        <br>    
            <div id="radio3">
                <input type="radio" value="${newQuestions[num].options[3]}" name="answerChoice" id="optionD">
                <label for="optionD"><span><span></span></span>${newQuestions[num].options[3]}</label>
            </div>
        <br>
        <div class="inputSubmit">
            <input type="submit" value="SUBMIT">
        </div>
        </form>
    </div>
    `
}

function writeFeedback() {
    let num = store.question;
    return `<div class="feedback">
        <h2>Question ${store.question + 1}/5</h2>
        <p id="question">${newQuestions[num].question}?</p>
        <p id="progress">Progress: ${store.score}/${num + 1}</p>
        <p id="feedbackResult">You are ${store.answerCorrect ? 'CORRECT' : 'WRONG'}!</p>
        <form id='optionsFeedback' role="form" action="">
            <div class="${newQuestions[num].answer === 0 ? 'correct' : 'false'}">
                ${newQuestions[num].options[0]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === 1 ? 'correct' : 'false'}">
                ${newQuestions[num].options[1]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === 2 ? 'correct' : 'false'}">
                ${newQuestions[num].options[2]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === 3 ? 'correct' : 'false'}">
                ${newQuestions[num].options[3]}
            </div>
        <br>
        <div class="inputSubmit">
            <input type="submit" value="NEXT">
        </div>
        </form>
        
    </div>
    `
}

function writeFinalPage() {
    let verdict = 'hello';
    if (store.score === 0) {
        verdict = "<p>You know nothing Jon Snow.</p>";
    } else if (store.score === 1) {
        verdict = "<p>The Lannister's send their regards</p>";
    } else if (store.score === 2) {
        verdict = "<p>You would die by The Mountain! It's time for you to rewatch Game Of Thrones.</p>";
    } else if (store.score === 3) {
        verdict = "<p>You have gained the attention of the Lord Of Light. Perhaps with more practice you may be his Chosen One.</p>";
    } else if (store.score === 4) {
        verdict = "<p>You really know your Game Of Thrones. You would fit right in on Westeros</p>";
    } else if (store.score === 5) {
        verdict = "<p>Ok ok ok. You definitely know your Game Of Thrones. Now it's time for you to go outside and get some sun.</p>";
    }

    return `<div class='finish'>
        <h2>Congratulations</h2>
        <h2 id="numberCorrect"> You got ${store.score} correct</h2>
        ${verdict}
        <button type="submit" alt="Try Again?" id="tryAgain">TRY AGAIN?</button>
    </div>
    `;
}

$('#quiz').on('click', '#tryAgain', function (event) {
    store.view = 'start';
    store.question = null;
    store.currentAnswer = null;
    store.answerCorrect = null;
    store.score = 0;
    render();
});