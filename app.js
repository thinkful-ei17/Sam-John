const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    answerCorrect: null,
    score: 0,
}

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

$('#start').click(function(event){
    console.log('Start button was clicked');
    store.view = 'question';
    store.question = 0;
    render();
});

$('#quiz').on('click', '#answerSubmit', function(event){
    console.log('Answer Submit button was clicked');
    if ($('input[name="answerChoice"]').is(':checked')) {
        console.log('We have an answer');    
    } else{
        alert('Please select something!');
        return false;
    }

    let response = $('input[name="answerChoice"]:checked').val();
    if (store.question === 4){
        store.view = 'finish';
    } else {
        store.view = 'feedback';
    }
    store.currentAnswer = parseInt(response, 10);
    render();
});

function checkAnswer(){
    if (store.currentAnswer === questions[store.question].answer){
        store.answerCorrect = true;
        store.score++;
    } else{
        store.answerCorrect = false;
    }
}

$('#quiz').on('click', '#nextQuestion', function(event){
    store.question++;
    store.view = 'question';
    render();
});

function writeQuestion() {
    let num = store.question;
    return `<div class="questionsPage">
        <h2>Question ${store.question + 1}/5</h2>
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
        <button type="submit" id="answerSubmit">SUBMIT</button>
    </div>
    `
}

function writeFeedback() {
    let num = store.question;
    return `<div class="feedback">
        <h2>Question ${store.question + 1}/5</h2>
        <p id="question">${questions[num].question}?</p>
        <p id="progress">Progress</p>
        <p>You are ${store.answerCorrect ? 'CORRECT' : 'WRONG'}!</p>
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
        <button type="submit" id="nextQuestion">NEXT</button>
    </div>
    `
}

function writeFinalPage(){
    let verdict = 'hello';
    if (store.score === 0){
        verdict = "<p>You know nothing Jon Snow.</p>";
    } else if (store.score === 1){
        verdict = "<p>The Lannister's send their regards</p>";
    } else if (store.score === 2){
        verdict = "<p>You would die by The Mountain! It's time for you to rewatch Game Of Thrones.</p>";
    }else if (store.score === 3){
        verdict = "<p>You have gained the attention of the Lord Of Light. Perhaps with more practice you may be his Chosen One.</p>";
    } else if (store.score === 4){
        verdict = "<p>You really know your Game Of Thrones. You would fit right in on Westeros</p>";
    } else if (store.score === 5){
        verdict = "<p>Ok ok ok. You definitely know your Game Of Thrones. Now it's time for you to go outside and get some sun.</p>";
    }

    return `<div class='finish'>
        <h2>Congratulations</h2>
        <h2 id="numberCorrect"> You got ${store.score} correct</h2>
        ${verdict}
        <button type="submit" id="tryAgain">TRY AGAIN?</button>
    </div>
    `;
}

$('#quiz').on('click', '#tryAgain', function(event){
    store.view = 'start';
    store.question = null;
    store.currentAnswer = null;
    store.answerCorrect = null;
    store.score = 0;
    render();
});




