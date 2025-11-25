// Tic Tac Toe - semplice logica per due giocatori

const X = 'X'
const O = 'O'
let currentPlayer = X
let boardState = Array(9).fill(null)
let isGameActive = true

const winningCombos = [
	[0,1,2], [3,4,5], [6,7,8],
	[0,3,6], [1,4,7], [2,5,8],
	[0,4,8], [2,4,6]
]

const cells = Array.from(document.querySelectorAll('.cell'))
const statusEl = document.getElementById('status')
const currentEl = document.getElementById('current')
const resetBtn = document.getElementById('reset')

function handleCellClick(e){
	const cell = e.currentTarget
	const idx = Number(cell.dataset.cell)
	if(!isGameActive || boardState[idx]) return

	boardState[idx] = currentPlayer
	cell.textContent = currentPlayer
	cell.disabled = true

	const winCombo = checkWin(currentPlayer)
	if(winCombo){
		endGame(false, winCombo)
		return
	}

	if(checkDraw()){
		endGame(true)
		return
	}

	swapPlayer()
}

function swapPlayer(){
	currentPlayer = currentPlayer === X ? O : X
	currentEl.textContent = currentPlayer
}

function checkWin(player){
	for(const combo of winningCombos){
		const [a,b,c] = combo
		if(boardState[a] === player && boardState[b] === player && boardState[c] === player){
			return combo
		}
	}
	return null
}

function checkDraw(){
	return boardState.every(cell => cell !== null)
}

function endGame(isDraw, winCombo){
	isGameActive = false
	if(isDraw){
		statusEl.textContent = 'Pareggio!'
	} else {
		statusEl.textContent = `Vittoria: ${currentPlayer}`
		highlightWin(winCombo)
	}
}

function highlightWin(combo){
	if(!combo) return
	for(const i of combo){
		const c = cells[i]
		c.classList.add('win')
	}
}

function resetGame(){
	boardState = Array(9).fill(null)
	isGameActive = true
	currentPlayer = X
	currentEl.textContent = currentPlayer
	statusEl.textContent = `Turno: `
	// clear cells
	cells.forEach(cell => {
		cell.textContent = ''
		cell.disabled = false
		cell.classList.remove('win')
	})
}

// Init listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick))
resetBtn.addEventListener('click', resetGame)

// small UX: show initial status more clearly
statusEl.textContent = 'Turno: '
currentEl.textContent = currentPlayer

