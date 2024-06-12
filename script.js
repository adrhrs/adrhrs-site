const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const targetWord = "REACT"; // You can choose a word randomly from a list

let currentGuess = '';
let guesses = [];
let gameOver = false;

const keyboardRows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    "ZXCVBNM".split("")
];

const getFeedback = (guess) => {
    const feedback = Array(WORD_LENGTH).fill('gray');

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === targetWord[i]) {
            feedback[i] = 'green';
        } else if (targetWord.includes(guess[i])) {
            feedback[i] = 'yellow';
        }
    }

    return feedback;
};

const renderWord = (guess, feedback = []) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';

    for (let i = 0; i < WORD_LENGTH; i++) {
        const letterBox = document.createElement('div');
        letterBox.className = `letter-box ${feedback[i] || ''}`;
        letterBox.textContent = guess[i] || '';
        wordDiv.appendChild(letterBox);
    }

    return wordDiv;
};

const renderKeyboard = () => {
    const keyboardDiv = document.getElementById('keyboard');
    keyboardDiv.innerHTML = '';

    keyboardRows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row row';
        row.forEach(letter => {
            const key = document.createElement('div');
            key.className = 'key';
            key.textContent = letter;
            key.addEventListener('click', () => handleVirtualKeyPress(letter));
            rowDiv.appendChild(key);
        });
        keyboardDiv.appendChild(rowDiv);
    });
};

const updateKeyboard = () => {
    const feedbackMap = {};
    guesses.forEach(guess => {
        const feedback = getFeedback(guess);
        for (let i = 0; i < WORD_LENGTH; i++) {
            const letter = guess[i];
            if (!feedbackMap[letter] || feedback[i] === 'green' ||
                (feedback[i] === 'yellow' && feedbackMap[letter] !== 'green')) {
                feedbackMap[letter] = feedback[i];
            }
        }
    });

    document.querySelectorAll('.key').forEach(key => {
        const letter = key.textContent;
        if (feedbackMap[letter]) {
            key.className = `key ${feedbackMap[letter]}`;
            if (feedbackMap[letter] === 'gray') {
                key.removeEventListener('click', handleVirtualKeyPress);
            }
        }
    });
};

const updateDisplay = () => {
    const gridDiv = document.getElementById('grid');
    gridDiv.innerHTML = '';

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        if (i < guesses.length) {
            const feedback = getFeedback(guesses[i]);
            gridDiv.appendChild(renderWord(guesses[i], feedback));
        } else if (i === guesses.length && !gameOver) {
            gridDiv.appendChild(renderWord(currentGuess.padEnd(WORD_LENGTH)));
        } else {
            gridDiv.appendChild(renderWord(''.padEnd(WORD_LENGTH)));
        }
    }

    

    if (gameOver) {
        if (guesses.includes(targetWord)) {
            event.preventDefault();
            Swal.fire({
                title: "Good job!",
                text: `You Guess The Correct Word ( ${targetWord} )`,
                icon: "success"
              });
        } else {
            document.getElementById('game-over').textContent = `Game Over! The word was ${targetWord}`;
        }
    } else {
        document.getElementById('game-over').textContent = '';
    }

    updateKeyboard();

};

const handleKeyPress = (event) => {
    if (gameOver) return;

    if (event.key === 'Enter' && currentGuess.length === WORD_LENGTH) {
        guesses.push(currentGuess.toUpperCase());
        if (currentGuess.toUpperCase() === targetWord || guesses.length === MAX_ATTEMPTS) {
            gameOver = true;
            updateDisplay();
        } else {
            currentGuess = '';
            updateDisplay();
        }
    } else if (event.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay();
    } else if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(event.key)) {
        currentGuess += event.key.toUpperCase();
        updateDisplay();
    }
};

const handleVirtualKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'Enter' && currentGuess.length === WORD_LENGTH) {
        guesses.push(currentGuess.toUpperCase());
        if (currentGuess.toUpperCase() === targetWord || guesses.length === MAX_ATTEMPTS) {
            gameOver = true;
            updateDisplay();
        } else {
            currentGuess = '';
            updateDisplay();
        }
    } else if (key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay();
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
        currentGuess += key;
        updateDisplay();
    }
};

window.addEventListener('keydown', handleKeyPress);

renderKeyboard();
updateDisplay();
