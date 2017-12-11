const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    score: 0,
}

// const store2 = {
//     view: 'question',
//     question: 1,
// }

// const store3 = {
//     view: 'feedback',
//     question: 1,
//     currentAnswer: 0,
//     score: 0
// }

// const store4 = {
//     view: 'question',
//     // StartOver
//     question: 2,
//     currentAnswer: null,
//     score: 0,
// }

// ...
// const storeLast = {
    // view: 'finish',
    // question: null,
    // currentAnswer: null,
    // score: __/5,
// }

const questions = [
    {
        question: "Who is 'the hound'",
        options: ['Jon Snow', 'Sandor Clegane', 'Jamie Lannister', 'Khal Drogo'],
        answer: 1
    },
    {
        question: "Who is the father of Jamie Lannister",
        options: ['Foreman Lannister', 'Kevin Lannister', 'Tywin Lannister', 'Tyrion Lannister'],
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
        options: ['Theon GreyJoy', 'Aegon Targaryan', 'Daenerys Targaryan', 'Cersei Lannister'],
        answer: 1
    }
]

function render(){
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
    } else if (store.view === 'feedback') {
        $('.start').hide();
        $('.questionsPage').hide();
        $('.feedback').show();
        $('.finish').hide(); 
    } else {
        $('.start').hide();
        $('.questionsPage').hide();
        $('.feedback').hide();
        $('.finish').show();
    }
}

render();

// Render Start Page

$('#start').click(function(event){
    console.log('Start button was clicked');
    store.view = 'question';
    store.question = 1;
    writeQuestion();
    render();
});

// Listen for Click on Start the Quiz Button
    // store.view = question
// 
// Render Q1
// 

$('#quiz').on('click', '#answerSubmit', function(event){
    console.log('Answer Submit button was clicked');
    if ($('input[name="answerChoice"]').is(':checked')) {
        console.log('We have an answer');    
    } else{
        alert('Please select something!');
        return false;
    }

    
    let response = $('input[name="answerChoice"]:checked').val();
    store.view = 'feedback';
    store.currentAnswer = parseInt(response, 10);
    writeFeedback();
    checkAnswer();
    render();
});

// Listen for Click on Submit Button -- verify answer has been given
// 
function checkAnswer(){
    if (store.currentAnswer === questions[store.question-1].answer){
        $('.wrong').hide();
        store.score++;
    } else{
        $('.correct').hide();
    }
}
    

// $('.feedback').append(
//     `
    
//     `
// )

$('#quiz').on('click', '#nextQuestion', function(event){
    store.question++;
    store.view = 'question';
    console.log(store.question);
    writeQuestion();
    render();
});
// Render Q1 - Feedback
    // Box correct answer
    // If user correct, write CORRECT next to answer
    // Else, write WRONG next to their answer
    // Update Progress
    // Update Current Score

function writeQuestion() {
    let num = store.question-1
    $('.questionsPage').replaceWith(`
    <div class="questionsPage">
        <h2>Question ${store.question}/5</h2>
        <p id="question">${questions[num].question}?</p>
        <p id="progress">Progress</p>
        <form id='options' action="">
            <input type="radio" value="0" name="answerChoice" id="optionA">
            <label for="optionA" required>${questions[num].options[0]}</label>

            <input type="radio" value="1" name="answerChoice" id="optionB">
            <label for="optionB">${questions[num].options[1]}</label>

            <input type="radio" value="2" name="answerChoice" id="optionC">
            <label for="optionC">${questions[num].options[2]}</label>

            <input type="radio" value="3" name="answerChoice" id="optionD">
            <label for="optionD">${questions[num].options[3]}</label>
        </form>
        <button type="submit" id="answerSubmit">Submit</button>
    </div>
    `)
}

function writeFeedback() {
    let num = store.question-1
    $('.feedback').replaceWith(`
    <div class="feedback">
        <h2>Question ${store.question}/5</h2>
        <p id="question">${questions[num].question}?</p>
        <p id="progress">Progress</p>
        <p class='correct'>You are CORRECT!</p>
        <p class='wrong'>You are WRONG!</p>
        <form id='options' action="">
            <input type="radio" value="0" name="answerChoice" id="optionA">
            <label for="optionA" required>${questions[num].options[0]}</label>

            <input type="radio" value="1" name="answerChoice" id="optionB">
            <label for="optionB">${questions[num].options[1]}</label>

            <input type="radio" value="2" name="answerChoice" id="optionC">
            <label for="optionC">${questions[num].options[2]}</label>

            <input type="radio" value="3" name="answerChoice" id="optionD">
            <label for="optionD">${questions[num].options[3]}</label>
        </form>
        <button type="submit" id="nextQuestion">Proceed to Next Question</button>
    </div>
    `)
}
    //
// 
// 
// Listen for Click on Proceed to Next Question Button
