import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = []
for (let y = 0; y < 30; y++) {
  board[y] = [];
  for (let x = 0; x < 14; x++) {
    board[y][x] = 0;
  }
}
//console.log(board)

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1],
    [1],
    [1],
    [1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 1],
    [1, 0]
  ],
  [
    [0, 1],
    [1, 1],
    [1, 0]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]
]

let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
  }

  if (checkCollision()) {
    piece.position.y--
    solidifyPiece()
    removeRows()
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}

function checkCollision() {
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
      if (value !== 0) {
        let newX = x + piece.position.x
        let newY = y + piece.position.y

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true
        }
        if (board[newY] && board[newY][newX] !== 0) {
          return true
        }
      }
      return false
    })
  })
}


function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  if (checkCollision()) {
    alert('GAME OVER')
    board.forEach(row => row.fill(0))
  }
}


function removeRows() {
  const rowsToRemove = board.reduce((acc, row, y) => {
    if (row.every(value => value === 1)) {
      acc.push(y)
    }
    return acc
  }, [])

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    board.unshift(new Array(BOARD_WIDTH).fill(0))
  })
}

update()