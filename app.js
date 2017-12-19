'use strict';
/* global $ */

const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    answerCorrect: null,
    score: 0,
    sessionTokenStatus: false,
    numberOfQuestions: null,
};

// Communication with API

const BASE_URL = 'https://opentdb.com';

// Fetch Token

let sessionToken = undefined;
const TOKEN_PATH = '/api_token.php';

function fetchSessionToken(callback) {
    $.getJSON(BASE_URL + TOKEN_PATH, {command: 'request'}, function(response) {
      if (response.response_code !== 0) {
        throw new Error('There was a problem connecting to the API. Try again later.');
      } else {
        sessionToken = response.token;
        console.log(sessionToken);
        store.sessionTokenStatus = true;
        return callback();
    }
   })
};

fetchSessionToken(render);

// Fetch Questions

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

// Format Questions

let newQuestions = [];

function createEmptyQuestionsFolder() {
    for (let i=0; i<store.numberOfQuestions; i++){
        newQuestions.push({'question': null, 'options': null, 'answer': null});
    }
};

function shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

function importAndRenderQuestions(data){
    for (let i=0; i<store.numberOfQuestions; i++){
        newQuestions[i].question = data.results[i].question;
        newQuestions[i].options = data.results[i].incorrect_answers;
        newQuestions[i].answer = data.results[i].correct_answer;
        newQuestions[i].options.push(newQuestions[i].answer);
        shuffleArray(newQuestions[i].options);
    }
    render();
};
    
// Log Requested Data

function requestedNumberOfQuestions(){
    query.amount = $('#optionsOfQuestions').val()
    store.numberOfQuestions = $('#optionsOfQuestions').val();
};

function requestedCategory(){
    query.category = $('#optionsOfCategories').val();
};

// Document Feedback

function checkAnswer() {
    if (store.currentAnswer === newQuestions[store.question].answer) {
        store.answerCorrect = true;
        store.score++;
    } else {
        store.answerCorrect = false;
    }
};

// Render Function

function render() {
    if (store.view === 'start') {
        $('.start').show();
        $('.questionsPage').hide();
        $('.feedback').hide();
        $('.finish').hide();
        let htmlStart = writeStartPage();
        $('.startPage').replaceWith(htmlStart);
    } else if (store.view === 'question') {
        $('.startPage').hide();
        $('.questionsPage').show();
        $('.feedback').hide();
        $('.finish').hide();
        let htmlQuestion = writeQuestion();
        $('.questionsPage').replaceWith(htmlQuestion);
    } else if (store.view === 'feedback') {
        $('.startPage').hide();
        $('.questionsPage').hide();
        $('.feedback').show();
        $('.finish').hide();
        checkAnswer();
        let htmlFeedback = writeFeedback();
        $('.feedback').replaceWith(htmlFeedback);
    } else {
        $('.startPage').hide();
        $('.questionsPage').hide();
        $('.feedback').hide();
        $('.finish').show();
        let htmlFinalPage = writeFinalPage();
        $('.finish').replaceWith(htmlFinalPage);
    }
};

// Event Listeners

$('#quiz').on('submit','#startingPageForm', function (event) {
    event.preventDefault();
    if (store.sessionTokenStatus !== true){
        alert("Please be patient. I'm still loading.")
    } else {
        store.view = 'question';
        store.question = 0;
        requestedNumberOfQuestions();
        requestedCategory();
        createEmptyQuestionsFolder();
        console.log(sessionToken);
        fetchQuestions(importAndRenderQuestions);
    }
});

$('#quiz').on('submit', '#optionsQuestions', function (event) {
    event.preventDefault();
    if ($('input[name="answerChoice"]').is(':checked')) {
        let response = $('input[name="answerChoice"]:checked').val();
        store.view = 'feedback';
        store.currentAnswer = response;
        render();
    } else {
        alert('Please select something!');
        return false;
    }
});

$('#quiz').on('submit', '#optionsFeedback', function (event) {
    event.preventDefault();
    store.question++;
    if (store.question === parseInt(store.numberOfQuestions, 10)) {
        store.view = 'finish';
    } else {
        store.view = 'question';
    }
    render();
});

$('#quiz').on('click', '#tryAgain', function (event) {
    store.view = 'start';
    store.question = null;
    store.currentAnswer = null;
    store.answerCorrect = null;
    store.score = 0;
    store.numberOfQuestions = null;
    console.log(sessionToken)
    render();
});

// Content Generators

function generateCategoriesData(){
    let formOptions = [];

    const categories = [
        {id: 9, name: "General Knowledge"}
        , {id: 10, name: "Entertainment: Books"}
        , {id: 11, name: "Entertainment: Film"}
        , {id: 12, name: "Entertainment: Music"}
        , {id: 13, name: "Entertainment: Musicals & Theatres"}
        , {id: 14, name: "Entertainment: Television"}
        , {id: 15, name: "Entertainment: Video Games"}
        , {id: 16, name: "Entertainment: Board Games"}
        , {id: 17, name: "Science & Nature"}
        , {id: 18, name: "Science: Computers"}
        , {id: 19, name: "Science: Mathematics"}
        , {id: 20, name: "Mythology"}
        , {id: 21, name: "Sports"}
        , {id: 22, name: "Geography"}
        , {id: 23, name: "History"}
        , {id: 24, name: "Politics"}
        , {id: 25, name: "Art"}
        , {id: 26, name: "Celebrities"}
        , {id: 27, name: "Animals"}
        , {id: 28, name: "Vehicles"}
        , {id: 29, name: "Entertainment: Comics"}
        , {id: 30, name: "Science: Gadgets"}
        , {id: 31, name: "Entertainment: Japanese Anime & Manga"}
        , {id: 32, name: "Entertainment: Cartoon & Animations"}];

    for (let i=0; i<categories.length; i++){
        formOptions.push(`<option value=${categories[i].id}>${categories[i].name}</option>`);   
    }
    return formOptions.join('');
};

function writeStartPage(){
    return `
    <div class="startPage">
        <h1>Quiz</h1>
        <p>This quiz is meant to test your knowledge! Good luck!</p>
        <form id="startingPageForm">
            <div id="numberOfQuestions">
                <select id="optionsOfQuestions">
                    <option value=5>5</option>
                    <option value=10>10</option>
                    <option value=15>15</option>
                    <option value=25>25</option>
                    <option value=50>50</option>                    
                </select>
            </div>
            <div id="categoryChoice">
                <select id="optionsOfCategories">
                    <option value=''>Any Category</option>
                    ${generateCategoriesData()}                   
                </select>
            </div>
            <div class="inputSubmit">
                <input type="submit" id="start" value="START">
            </div>
        </form>
    </div>
    `
};

function writeQuestion() {
    let num = store.question;
    return `<div class="questionsPage">
        <h2>Question ${store.question + 1}/${store.numberOfQuestions}</h2>
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
};

function writeFeedback() {
    let num = store.question;
    return `<div class="feedback">
        <h2>Question ${store.question + 1}/${store.numberOfQuestions}</h2>
        <p id="question">${newQuestions[num].question}?</p>
        <p id="progress">Progress: ${store.score}/${store.question + 1}</p>
        <p id="feedbackResult">You are ${store.answerCorrect ? 'CORRECT' : 'WRONG'}!</p>
        <form id='optionsFeedback' role="form" action="">
            <div class="${newQuestions[num].answer === newQuestions[num].options[0] ? 'correct' : 'false'}">
                ${newQuestions[num].options[0]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === newQuestions[num].options[1] ? 'correct' : 'false'}">
                ${newQuestions[num].options[1]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === newQuestions[num].options[2] ? 'correct' : 'false'}">
                ${newQuestions[num].options[2]}
            </div>
        <br>
            <div class="${newQuestions[num].answer === newQuestions[num].options[3] ? 'correct' : 'false'}">
                ${newQuestions[num].options[3]}
            </div>
        <br>
        <div class="inputSubmit">
            <input type="submit" value="NEXT">
        </div>
        </form>
        
    </div>
    `
};

function writeFinalPage() {
    let num = parseInt(store.numberOfQuestions, 10);
    let verdict = '';
    if (store.score === 0) {
        verdict = "<p>You know nothing Jon Snow.</p>";
    } else if (store.score === num) {
        verdict = "<p>Okay okay okay. You definitely know your triva. Now it's time for you to go outside and get some sun.</p>"; 
    } else if (store.score > num/1.5) {
        verdict = "<p>That was probably a fluke. Try AGAIN.</p>";
    } else if (store.score > num/2) {
        verdict = "<p>I guess that could have been worse.</p>";
    } else if (store.score > num/5) {
        verdict = "<p>Come on. Is that the best you can do? Try Harder.</p>";
    } else {
        verdict = "<p>You should probably do some more studying before you try again.</p>"
    }

    return `<div class='finish'>
        <h2>Congratulations!</h2>
        <h2 id="numberCorrect"> You got ${store.score} correct</h2>
        ${verdict}
        <button type="submit" alt="Try Again?" id="tryAgain">TRY AGAIN?</button>
    </div>
    `;
};