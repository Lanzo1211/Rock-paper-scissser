const choices = ['rock', 'paper', 'scissors'];

const icons = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
};

const scores = {
  player: 0,
  computer: 0,
  ties: 0,
  streak: 0
};

// DOM Elements
const playerScoreEl = document.getElementById('player-score');
const tieScoreEl = document.getElementById('tie-score');
const computerScoreEl = document.getElementById('computer-score');
const streakScoreEl = document.getElementById('streak-score');

const playerBox = document.getElementById('player-box');
const computerBox = document.getElementById('computer-box');
const playerDisplay = document.getElementById('player-display');
const computerDisplay = document.getElementById('computer-display');
const playerChoiceName = document.getElementById('player-choice-name');
const computerChoiceName = document.getElementById('computer-choice-name');

const statusBanner = document.getElementById('status-banner');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('reset-btn');

let isRoundActive = false;

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function determineOutcome(player, computer) {
  if (player === computer) return 'tie';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

function playRound(playerChoice) {
  if (isRoundActive) return;
  isRoundActive = true;

  // Toggle button state
  choiceButtons.forEach(btn => (btn.disabled = true));

  // Reset visuals during shake
  playerBox.className = 'fighter-box';
  computerBox.className = 'fighter-box';
  playerChoiceName.textContent = 'Deciding...';
  computerChoiceName.textContent = 'Deciding...';

  // Default shaking hands
  playerDisplay.textContent = '✊';
  computerDisplay.textContent = '✊';
  playerDisplay.classList.add('shake-player');
  computerDisplay.classList.add('shake-computer');
  statusBanner.textContent = 'Rock... Paper... Scissors...';

  setTimeout(() => {
    // End shaking animation
    playerDisplay.classList.remove('shake-player');
    computerDisplay.classList.remove('shake-computer');

    const computerChoice = getComputerChoice();
    const result = determineOutcome(playerChoice, computerChoice);

    // Update icons and text
    playerDisplay.textContent = icons[playerChoice];
    computerDisplay.textContent = icons[computerChoice];
    playerChoiceName.textContent = playerChoice;
    computerChoiceName.textContent = computerChoice;

    // Apply outcome classes and score update
    if (result === 'win') {
      scores.player++;
      scores.streak++;
      playerBox.classList.add('win');
      computerBox.classList.add('lose');
      statusBanner.textContent = `You win! ${capitalize(playerChoice)} beats ${computerChoice}.`;
    } else if (result === 'lose') {
      scores.computer++;
      scores.streak = 0;
      playerBox.classList.add('lose');
      computerBox.classList.add('win');
      statusBanner.textContent = `You lose! ${capitalize(computerChoice)} beats ${playerChoice}.`;
    } else {
      scores.ties++;
      playerBox.classList.add('tie');
      computerBox.classList.add('tie');
      statusBanner.textContent = `It's a draw! Both picked ${playerChoice}.`;
    }

    updateScoreboard();

    // Re-enable controls
    choiceButtons.forEach(btn => (btn.disabled = false));
    isRoundActive = false;
  }, 900);
}

function updateScoreboard() {
  playerScoreEl.textContent = scores.player;
  computerScoreEl.textContent = scores.computer;
  tieScoreEl.textContent = scores.ties;
  streakScoreEl.textContent = scores.streak;
}

function resetGame() {
  scores.player = 0;
  scores.computer = 0;
  scores.ties = 0;
  scores.streak = 0;

  updateScoreboard();

  playerBox.className = 'fighter-box';
  computerBox.className = 'fighter-box';
  playerDisplay.textContent = '✊';
  computerDisplay.textContent = '✊';
  playerChoiceName.textContent = 'Ready';
  computerChoiceName.textContent = 'Waiting';
  statusBanner.textContent = 'Choose your weapon to start!';
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Event Listeners
choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    playRound(choice);
  });
});

resetBtn.addEventListener('click', resetGame);

// Keyboard Shortcuts: R for Rock, P for Paper, S for Scissors
window.addEventListener('keydown', e => {
  if (isRoundActive) return;
  const key = e.key.toLowerCase();
  if (key === 'r') playRound('rock');
  if (key === 'p') playRound('paper');
  if (key === 's') playRound('scissors');
});