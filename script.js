// Tic Tac Toe with optional AI opponent (easy/medium/hard)

const X = 'X'
const O = 'O'
let boardState = Array(9).fill(null)
let currentPlayer = X
let isGameActive = true

const winningCombos = [
	[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
]

const cells = Array.from(document.querySelectorAll('.cell'))
const statusEl = document.getElementById('status')
const currentEl = document.getElementById('current')
const resetBtn = document.getElementById('reset')
const modeSelect = document.getElementById('mode')
const difficultySelect = document.getElementById('difficulty')
const startBtn = document.getElementById('start')
const themeSelect = document.getElementById('theme')

function renderBoard(){
	cells.forEach((cell, i) => {
		cell.textContent = boardState[i] || ''
		cell.disabled = !!boardState[i] || !isGameActive
		cell.classList.toggle('win', false)
	})
	currentEl.textContent = currentPlayer
}

function handleCellClick(e){
	const idx = Number(e.currentTarget.dataset.cell)
	if(!isGameActive || boardState[idx]) return
	makeMove(idx, currentPlayer)
}

function makeMove(idx, player){
	boardState[idx] = player
	renderBoard()
	const winCombo = checkWin(player)
	if(winCombo){
		endGame(false, winCombo, player)
		return
	}
	if(checkDraw()){
		endGame(true)
		return
	}
	swapPlayer()
	if(modeSelect.value === 'ai' && isGameActive && currentPlayer === O){
		// let AI play as O
		setTimeout(() => aiPlay(), 300)
	}
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
	return boardState.every(Boolean)
}

function endGame(isDraw, winCombo, winner){
	isGameActive = false
	if(isDraw){
		statusEl.textContent = 'Pareggio!'
	} else {
		statusEl.textContent = `Vittoria: ${winner}`
		highlightWin(winCombo)
	}
}

function highlightWin(combo){
	if(!combo) return
	combo.forEach(i => {
		cells[i].classList.add('win')
	})
}

function resetGame(){
	boardState = Array(9).fill(null)
	isGameActive = true
	currentPlayer = X
	statusEl.textContent = 'Turno: '
	renderBoard()
}

// AI logic
function aiPlay(){
	const diff = difficultySelect.value
	let move
	if(diff === 'easy') move = aiRandom()
	else if(diff === 'medium') move = aiMedium()
	else move = aiHard()
	if(typeof move === 'number') makeMove(move, O)
}

function aiRandom(){
	const empty = boardState.map((v,i)=> v ? null : i).filter(v=>v!==null)
	if(empty.length===0) return null
	return empty[Math.floor(Math.random()*empty.length)]
}

function aiMedium(){
	// 1) win if possible
	for(let i=0;i<9;i++) if(!boardState[i]){
		boardState[i]=O
		if(checkWin(O)){ boardState[i]=null; return i }
		boardState[i]=null
	}
	// 2) block player
	for(let i=0;i<9;i++) if(!boardState[i]){
		boardState[i]=X
		if(checkWin(X)){ boardState[i]=null; return i }
		boardState[i]=null
	}
	// 3) take center
	if(!boardState[4]) return 4
	return aiRandom()
}

function aiHard(){
	// Minimax for optimal play (AI is O)
	function minimax(state, player){
		const winner = getWinner(state)
		if(winner === O) return {score: 1}
		if(winner === X) return {score: -1}
		if(state.every(Boolean)) return {score: 0}

		const moves = []
		for(let i=0;i<9;i++){
			if(!state[i]){
				state[i] = player
				const result = minimax(state, player===O?X:O)
				moves.push({index:i, score: result.score})
				state[i] = null
			}
		}
		if(player === O){
			// maximize
			let best = moves[0]
			for(const m of moves) if(m.score > best.score) best = m
			return best
		} else {
			// minimize
			let best = moves[0]
			for(const m of moves) if(m.score < best.score) best = m
			return best
		}
	}
	const copy = boardState.slice()
	const best = minimax(copy, O)
	return best.index
}

function getWinner(state){
	for(const combo of winningCombos){
		const [a,b,c] = combo
		if(state[a] && state[a] === state[b] && state[a] === state[c]) return state[a]
	}
	return null
}

// Init
cells.forEach(cell => cell.addEventListener('click', handleCellClick))
resetBtn.addEventListener('click', resetGame)
// When user changes mode, enable difficulty selector when AI selected.
modeSelect.addEventListener('change', ()=>{
	const isAi = modeSelect.value === 'ai'
	difficultySelect.disabled = !isAi
	// visually focus difficulty when switching to AI
	if(isAi) difficultySelect.focus()
})

// Start applies the selected options and resets the game.
startBtn.addEventListener('click', ()=>{
	// apply theme color
	const color = themeSelect.value
	document.documentElement.style.setProperty('--accent', color)
	resetGame()
	// If AI mode and AI should start (we keep X as player starting), no immediate AI move.
	// If you want AI to start, add logic here.
})

difficultySelect.addEventListener('change', ()=> resetGame())

// allow theme change without pressing start
themeSelect.addEventListener('change', ()=>{
	document.documentElement.style.setProperty('--accent', themeSelect.value)
})

statusEl.textContent = 'Turno: '
renderBoard()

