let board = document.querySelector('.board')
let blockHeight = 40
let blockWidth = 40

let cols = Math.floor(board.clientWidth / blockWidth)
let rows = Math.floor(board.clientHeight / blockHeight)

let startButton = document.querySelector('.start-btn')
let reStartButton = document.querySelector('.restart-btn')
let modal = document.querySelector('.modal')
let startGameModal = document.querySelector('.start-game')
let gameOverModal = document.querySelector('.game-over')

let hightScoreElement = document.querySelector('#hight-score')
let scoreElement = document.querySelector('#score')
let timeScoreElement = document.querySelector('#time')

let hightScore = localStorage.getItem('hightScore') || 0
let score = 0
let time = '00-00'
hightScoreElement.innerText = hightScore


let blocks = []
let snake = [
    {
        x: 1, y: 3
    }
]
let direction = 'right'
let intervalId = null
let timeIntervalId = null
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        let block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        // block.innerText = `${row}-${col}`
        blocks[`${row}-${col}`] = block
    }
}


function render() {

    blocks[`${food.x}-${food.y}`].classList.add('food')

    let head = null

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    }
    else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    }
    else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }
    else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    }

    // food eating by snake and rerender food in blocks
    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food')
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x}-${food.y}`].classList.add('food')
        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score > hightScore) {
            hightScore = score
            localStorage.setItem('hightScore', hightScore.toString())
        }
    }

    // WALL COLLISION LOGIC
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId)
        startGameModal.style.display = 'none'
        modal.style.display = 'flex'
        gameOverModal.style.display = 'flex'

        score = 0
        scoreElement.innerText = '00'
        return
    }

    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()




    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
        // segment.classList.add('fill')
    })

}



addEventListener('keydown', (event) => {
    // console.log(event.key);
    if (event.key === 'ArrowUp') {
        direction = 'up'
    }
    else if (event.key === 'ArrowDown') {
        direction = 'down'
    }
    else if (event.key === 'ArrowLeft') {
        direction = 'left'
    }
    else if (event.key === 'ArrowRight') {
        direction = 'right'
    }

})



gameOverModal.style.display = 'none'
startButton.addEventListener('click', () => {
    modal.style.display = 'none'

    intervalId = setInterval(() => { render() }, 200);

    timeIntervalId = setInterval(() => {
        let [min, sec] = time.split('-').map(Number)

        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${min}-${sec}`
        timeScoreElement.innerText = time

    }, 1000);

})
reStartButton.addEventListener('click', restartGame)

// RESTART GAME LOGIC

function restartGame() {

    score = 0
    time = 0
    scoreElement.innerText = score
    timeScoreElement.innerText = time
    hightScoreElement.innerText = hightScore

    blocks[`${food.x}-${food.y}`].classList.remove('food')
    snake.forEach((segment) => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })
    direction = 'down'

    modal.style.display = 'none'
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    intervalId = setInterval(() => { render() }, 200);

}