const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    score: null,
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
    console.log(response);
    store.view = 'feedback';
    store.currentAnswer = response;
    render();
});

// Listen for Click on Submit Button -- verify answer has been given
// 

// if (store.currentAnswer === questions[store.question-1].answer){
//     $('.wrong').hidden();

// }
    

// $('.feedback').append(
//     `
    
//     `
// )

// Render Q1 - Feedback
    // Box correct answer
    // If user correct, write CORRECT next to answer
    // Else, write WRONG next to their answer
    // Update Progress
    // Update Current Score
//
// 
// 
// Listen for Click on Proceed to Next Question Button
