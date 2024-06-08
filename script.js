const mainScreen = document.getElementById('main-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startGameButton = document.getElementById('start-game');
const resetGameButton = document.getElementById('reset-game');
const backToMainButton = document.getElementById('back-to-main');
const resultsList = document.getElementById('results-list');
const gameBoard = document.getElementById('game-board');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const currentPlayerNameSpan = document.getElementById('current-player-name');
const currentPlayerSpan = document.getElementById('current-player');
const resultText = document.getElementById('result-text');
const themeSwitch = document.getElementById('theme-switch');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let results = [];
let player1Name = 'Игрок 1';
let player2Name = 'Игрок 2';
let currentPlayerTurn = 'X'; // Добавлен отслеживание хода

startGameButton.addEventListener('click', startGame);
resetGameButton.addEventListener('click', resetGame);
backToMainButton.addEventListener('click', backToMain);
gameBoard.addEventListener('click', handleCellClick);
themeSwitch.addEventListener('input', toggleTheme);

function startGame() {
  player1Name = player1NameInput.value || 'Игрок 1';
  player2Name = player2NameInput.value || 'Игрок 2';

  mainScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  gameActive = true;
  resetGame();

  // Загрузка данных из локального хранилища
  loadResults(); 
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X'; // Добавлен сброс хода
  currentPlayerTurn = 'X'; // Добавлен сброс хода
  currentPlayerNameSpan.textContent = player1Name;
  currentPlayerSpan.textContent = 'X';

  const cells = gameBoard.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
  });
}

function backToMain() {
  resultScreen.style.display = 'none';
  mainScreen.style.display = 'flex';
  gameActive = false;
}

function handleCellClick(event) {
  if (!gameActive) return;

  const cell = event.target;
  const cellIndex = parseInt(cell.dataset.index);

  if (board[cellIndex] !== '') return;

  // Проверка чьего хода
  if (currentPlayerTurn !== currentPlayer) return; 

  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;

  if (checkWin()) {
    endGame();
  } else if (checkDraw()) {
    endGame('Ничья');
  } else {
    switchPlayer();
  }
}

function switchPlayer() {
  // Переключение хода
  currentPlayerTurn = currentPlayerTurn === 'X' ? 'O' : 'X'; 
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (currentPlayer === 'X') {
    currentPlayerNameSpan.textContent = player1Name;
  } else {
    currentPlayerNameSpan.textContent = player2Name;
  }

  currentPlayerSpan.textContent = currentPlayer;
}

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }

  return false;
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function endGame(result = `${currentPlayerNameSpan.textContent} победил!`) {
  gameActive = false;
  resultText.textContent = result;
  gameScreen.style.display = 'none';
  resultScreen.style.display = 'flex';

  results.push(result);
  updateResults();
  saveResults(); // Сохранение результатов в локальное хранилище
}

function updateResults() {
  resultsList.innerHTML = '';

  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result;
    resultsList.appendChild(li);
  });
}

function toggleTheme() {
  if (themeSwitch.value === '1') {
    document.body.classList.add('dark');
    mainScreen.classList.add('dark');
    gameScreen.classList.add('dark');
    resultScreen.classList.add('dark');
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.add('dark'));
  } else {
    document.body.classList.remove('dark');
    mainScreen.classList.remove('dark');
    gameScreen.classList.remove('dark');
    resultScreen.classList.remove('dark');
    const cells = gameBoard.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('dark'));
  }
}

// Функции для локального хранилища
function saveResults() {
  localStorage.setItem('gameResults', JSON.stringify(results));
}

function loadResults() {
  const storedResults = localStorage.getItem('gameResults');
  if (storedResults) {
    results = JSON.parse(storedResults);
    updateResults();
  }
}