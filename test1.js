const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const futureCanvas = document.getElementById('nextPiece');
const futureContext = futureCanvas.getContext('2d');
futureContext.fillStyle = '#ff';
futureContext.scale(5,5);
futureContext.fillRect(0, 0, futureCanvas.width, futureCanvas.height);
futureMatrix = createMatrix(4,4);


const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';


context.fillStyle = '#000';
context.fillRect(0,0, canvas.width, canvas.height);
context.scale(20,20);


function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function sweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}
function draw() {
    context.fillStyle = '#ffffff';
    context.fillRect(0,0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--)
    {
        matrix.push(new Array(w).fill(0))
    }
    return matrix;
}

function drawMatrix(matrix, offset, mycontext = context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0)
            {
                mycontext.fillStyle = colors[value];
                mycontext.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player){
    player.matrix.forEach((row, y) =>{
        row.forEach((value, x) => {
            if (value !== 0)
            {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}
let dropCounter = 0;
let dropTime = 1000;
let lastTime = 0;
function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    dropCounter += delta;
    if(dropCounter > dropTime)
    {
        stepDown();
    }
    draw();
    requestAnimationFrame(update);
}

function stepDown() {
    player.pos.y++;
    if (collide(arena, player))
    {
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
        player.pos.x = 4;
        reset();
        sweep();
        updateScore();
    }
    dropCounter = 0;
}

const arena = createMatrix(12, 20);

const player = {
    pos: {x:4, y:0},
    matrix: createFigure('T'),
    score: 0
};

function move(offset){
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerRotate() {
    rotate();
    while (collide(arena, player)){
        rotate(false);
    }
}

function rotate(turnRight = true){
    for (let y = 0; y < player.matrix.length; y++){
        for (let x = 0; x < y; x++)
        {
            [
                player.matrix[x][y],
                player.matrix[y][x]
            ] = [
                player.matrix[y][x],
                player.matrix[x][y]
            ]
        }
    }
    if (turnRight)
    {
        player.matrix.forEach(row => row.reverse());
    }
    else
    {
        player.matrix.reverse();
    }
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

var NEXT = null;
function reset() {
    //const pieces = 'TJLOSZI';
    const pieces = 'A';
    if (NEXT == null)
    {
        player.matrix = createFigure(pieces[randomInteger(0, pieces.length - 1)]);
        NEXT = createFigure(pieces[randomInteger(0, pieces.length - 1)]);
    }
    else
    {
        player.matrix = NEXT;
        NEXT = createFigure(pieces[randomInteger(0, pieces.length - 1)]);
    }
    futureContext.fillStyle = '#ffffff';
    futureContext.fillRect(0,0, canvas.width, canvas.height);
    drawMatrix(NEXT, {x: 4, y: 4}, futureContext);
    player.pos.y = 0;
    player.pos.x = 4;
    if (collide(arena, player)) {
        gameOver();
    }
}

function gameOver() {
    console.log(localStorage['userName']);
    localStorage[localStorage['userName']] = player.score;
    window.location = 'records.html';
}

function createFigure(type){
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    } else if (type='A') {
        return [
            [1,1,1],
            [1,0,1],
            [1,1,1],
        ];
    }
}

document.addEventListener('keydown', ev => {
    if (ev.key === LEFT)
    {
        move(-1);
    }
    else if (ev.key === RIGHT)
    {
        move(1);
    }
    else if (ev.key === UP)
    {
        playerRotate();
    }
    else if (ev.key === DOWN)
    {
        stepDown();
    }
    draw();
});

function updateScore() {
    if (player.score < 40 && player.score > 25)
    {
        setLevel(2);
    }
    else if( player.score > 40)
    {
        setLevel(3);
    }
    document.getElementById('score').innerText = player.score;
}

function setLevel(lvl) {
    document.getElementById('lvl').innerText = lvl;
    if (lvl === 2)
    {
        dropTime = 300;
    }
    else if (lvl === 3)
    {
        dropTime = 100;
    }
    else
    {
        dropTime = 1000;
    }

}
reset();
updateScore();
update();