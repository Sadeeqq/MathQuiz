// Game State
const state = {
    score: 0,
    timeLeft: 60,
    currentQuestion: {},
    isGameRunning: false,
    timerId: null
};

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalScoreDisplay = document.getElementById('final-score');

// Initialization
startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

function startGame() {
    state.score = 0;
    state.timeLeft = 60;
    state.isGameRunning = true;

    updateScoreDisplay();
    updateTimerDisplay();

    showScreen('game-screen');
    generateQuestion();
    startTimer();
}

function startTimer() {
    if (state.timerId) clearInterval(state.timerId);

    state.timerId = setInterval(() => {
        state.timeLeft--;
        updateTimerDisplay();

        if (state.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    state.isGameRunning = false;
    clearInterval(state.timerId);
    finalScoreDisplay.textContent = state.score;
    showScreen('result-screen');
}

function generateQuestion() {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1, num2, answer;

    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50);
            num2 = Math.floor(Math.random() * 50);
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 100);
            num2 = Math.floor(Math.random() * num1); // Ensure positive result
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 12);
            num2 = Math.floor(Math.random() * 12);
            answer = num1 * num2;
            break;
        case '/':
            // Ensure clean integer result
            const divisor = Math.floor(Math.random() * 11) + 1; // 1 to 12
            const result = Math.floor(Math.random() * 12) + 1; // 1 to 12
            num1 = divisor * result;
            num2 = divisor;
            answer = result;
            break;
    }

    const opSymbol = operation === '*' ? '×' : (operation === '/' ? '÷' : operation);

    state.currentQuestion = {
        text: `${num1} ${opSymbol} ${num2} = ?`,
        answer: answer,
        options: generateOptions(answer)
    };

    renderQuestion();
}

function generateOptions(correctAnswer) {
    const options = [correctAnswer];

    while (options.length < 3) {
        // Generate wrong answer close to correct one
        const offset = Math.floor(Math.random() * 10) + 1;
        const wrongAnswer = Math.random() > 0.5 ? correctAnswer + offset : correctAnswer - offset;

        if (!options.includes(wrongAnswer) && wrongAnswer >= 0) {
            options.push(wrongAnswer);
        }
    }

    return shuffleArray(options);
}

function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function renderQuestion() {
    questionText.textContent = state.currentQuestion.text;
    optionsContainer.innerHTML = '';

    state.currentQuestion.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => handleAnswer(option, btn));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selected, buttonElement) {
    if (!state.isGameRunning) return;

    const isCorrect = selected === state.currentQuestion.answer;

    // Visual Feedback
    if (isCorrect) {
        state.score += 2;
        buttonElement.classList.add('correct');
        updateScoreDisplay();
    } else {
        buttonElement.classList.add('wrong');
        // Briefly show the correct answer
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === state.currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
    }

    // Delay before next question
    setTimeout(() => {
        if (state.isGameRunning) {
            generateQuestion();
        }
    }, 300);
}

function updateScoreDisplay() {
    scoreDisplay.textContent = state.score;
}

function updateTimerDisplay() {
    timerDisplay.textContent = state.timeLeft;
}

function showScreen(screenId) {
    [homeScreen, gameScreen, resultScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}
