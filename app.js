const store = {
    view: 'start',
    question: null,
    currentAnswer: null,
    score: 0,
}

const store2 = {
    view: 'question',
    question: 1,
}

const store3 = {
    view: 'feedback',
    question: 1,
    currentAnswer: 0,
    score: 0
}

const store4 = {
    view: 'question',
    // StartOver
    question: 2,
    currentAnswer: null,
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