/* ------------------------------ Get Elements ------------------------------ */
// BUTTONS
const buttons = {
	roll: document.querySelector('.btn-roll'),
	hold: document.querySelector('.btn-hold'),
	newGame: document.querySelector('.btn-new'),
};

// DATA
let { currentPlayer, currentPoints, totalPoints, player1, player2 } = getData();

function getData() {
	let player1 = document.getElementById('player-1');
	let player2 = document.getElementById('player-2');
	let currentPlayer = 1;
	let currentPoints = document.getElementById(`p${currentPlayer}-current-points`);
	let totalPoints = document.getElementById(`p${currentPlayer}-total-points`);
	return { currentPlayer, currentPoints, totalPoints, player1, player2 };
}

// DICE
const dice = document.getElementById('dice');

/* ------------------------------- Initialize ------------------------------- */

let gameStarted = false;
let dicePoints = {
	point: 1,
};
let sumCurrentPoints = 0;
let sumTotalPoints = 0;
let wobbling

dice.style.display = 'none';
toggleButtons('roll', false);
toggleButtons('hold', false);
toggleButtons('newGame', true);

startWobble()

/* -------------------------------- Functions ------------------------------- */
// TOGGLE BUTTONS
function toggleButtons(button, oOrO) {
	onOrOff = oOrO;

	if (onOrOff) {
		buttons[button].classList.remove('disabled-button');
		buttons[button].disabled = false;
	} else {
		buttons[button].classList.add('disabled-button');
		buttons[button].disabled = true;
	}
}

// START A NEW GAME
function newGame() {
	if (!gameStarted) {
		dice.style.display = 'initial';
		document.getElementById('player-1').classList.toggle('current-player');
		gameStarted = true;
	} else {
		sumCurrentPoints = 0;
		document.getElementById('p1-current-points').textContent = sumCurrentPoints;
		document.getElementById('p2-current-points').textContent = sumCurrentPoints;
		sumTotalPoints = 0;
		document.getElementById('p1-total-points').textContent = sumTotalPoints;
		document.getElementById('p2-total-points').textContent = sumTotalPoints;

		if (player1.classList.contains('winner')) {
			player1.classList.remove('winner');
			document.getElementById('p1-name').textContent = 'Player 1';
		} else {
			player2.classList.remove('winner');
			document.getElementById('p2-name').textContent = 'Player 2';
		}

		nextPlayer();
		startWobble()
	}
	toggleButtons('roll', true);
	toggleButtons('newGame', false);
}

// NEXT PLAYER
function nextPlayer() {
	currentPlayer === 1 ? (currentPlayer = 2) : (currentPlayer = 1);

	currentPoints = document.getElementById(`p${currentPlayer}-current-points`);
	totalPoints = document.getElementById(`p${currentPlayer}-total-points`);

	document.getElementById('player-1').classList.toggle('current-player');
	document.getElementById('player-2').classList.toggle('current-player');
}

// ROLLING DICE
function rolling() {
	anime({
		targets: dicePoints,
		point: 6,
		round: 1,
		loop: 2,
		duration: 500,
		easing: 'easeInOutQuad',

		begin: () => {
			toggleButtons('roll', false);
			if (sumCurrentPoints > 1) toggleButtons('hold', false);
		},

		update: () => {
			dice.src = `assets/images/dice-${dicePoints.point}.svg`;
		},

		complete: () => {
			// dicePoints.point = Math.floor(Math.random() * 6) + 1;
			dicePoints.point = _.random(1, 6);
			dice.src = `assets/images/dice-${dicePoints.point}.svg`;

			toggleButtons('roll', true);

			if (dicePoints.point > 1) {
				sumCurrentPoints += dicePoints.point;
				currentPoints.textContent = sumCurrentPoints;
				toggleButtons('hold', true);
			} else {
				setTimeout(() => {
					sumCurrentPoints = 0;
					currentPoints.textContent = sumCurrentPoints;
					nextPlayer();
				}, 500);
			}
			// dice start rolling from 1
			dicePoints.point = 1;
		},
	});
}

// HOLD POINTS
function hold() {
	// UPDATE 'totalPoints' IN DOM
	sumTotalPoints += parseInt(totalPoints.textContent) + sumCurrentPoints;

	anime({
		targets: totalPoints,
		innerHTML: [parseInt(totalPoints.textContent), sumTotalPoints],
		round: 1,
		easing: 'easeInOutQuad',
		duration: 500,

		complete: () => {
			setTimeout(() => {
				if (sumTotalPoints >= 100) {
					winnerCheck();
					startWobble()
				} else {
					nextPlayer();
					// RESET DOM 'sumTotalPoints' TO 0
					sumTotalPoints = 0;
				}
			}, 500);
		},
	});

	animation(currentPoints, sumCurrentPoints, 0);
	// RESET DOM 'sumCurrentPoints' TO 0
	sumCurrentPoints = 0;

	toggleButtons('hold', false);
}

// CHECK WINNER
function winnerCheck() {
	if (player1.classList.contains('current-player')) {
		player1.classList.add('winner');
		document.getElementById('p1-name').textContent = 'WINNER';
		toggleButtons('newGame', true);
		toggleButtons('roll', false);
	} else {
		player2.classList.add('winner');
		document.getElementById('p2-name').textContent = 'WINNER';
		toggleButtons('newGame', true);
		toggleButtons('roll', false);
	}
}

// NUMBERS ANIMATION
function animation(target, from, to) {
	anime({
		targets: target,
		innerHTML: [from, to],
		round: 1,
		easing: 'easeInOutQuad',
		duration: 500,
	});
}

// NEW GAME BUTTON ANIMATION
function wobble(element, animationName, delay, callback) {
	const node = document.querySelector(element)
	node.classList.add('animated', animationName, `delay-${delay}s`)

	function handleAnimationEnd() {
		node.classList.remove('animated', animationName, `delay-${delay}s`)
		node.removeEventListener('animationend', handleAnimationEnd)

		if (typeof callback === 'function') callback()
	}

	node.addEventListener('animationend', handleAnimationEnd)
}

function startWobble() {
	wobbling = setInterval(() => {
		wobble('.btn-new', 'heartBeat', 0)
	}, 3000);
}

function stopWobble() { clearInterval(wobbling) }

/* --------------------------------- Events --------------------------------- */
buttons.newGame.addEventListener('click', () => { newGame(); stopWobble() });
buttons.newGame.addEventListener('mouseover', stopWobble)
buttons.newGame.addEventListener('mouseout', startWobble)

buttons.roll.addEventListener('click', rolling);

buttons.hold.addEventListener('click', hold);