const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const nextPiece = document.getElementById("nextPiece");
const futureContext = nextPiece.getContext('2d');



const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const Rotate = 'ArrowUp';
const DOWN = 'ArrowDown';

context.fillStyle = '#000';
context.fillRect(0,0, canvas.width, canvas.height);
context.scale(20,20);

futureContext.fillStyle = "#808080";
futureContext.scale(5,5);
futureContext.fillRect(0, 0, nextPiece.width, nextPiece.height);
futureMatrix = createMatrix(10,10);

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
    context.fillStyle = '#000';
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

function drawMatrix(matrix, offset, curContext = context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0)
            {
                curContext.fillStyle = colors[value];
                curContext.fillRect(x + offset.x, y + offset.y, 1, 1);
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
    updateScore();
    levelUp(player.score);
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
        drawNext();
        sweep();
        updateScore();
    }
    dropCounter = 0;
}

const arena = createMatrix(12, 20);

const player = {
    pos: {x:4, y:0},
    matrix: createFigure('T'),
    score: 0,
    records: [],
    lvl:1
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
    '#ff0000',
    '#0000ff',
    '#00ff00',
    '#FFFF00',
    '#800080',
    '#FFA500',
    '#3877AA',
];

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

var NEXT = null;
function drawNext() {
    const pieces = 'TJLOSZI';
    //const pieces = 'A';
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
    futureContext.fillStyle = '#808080';
    futureContext.fillRect(0,0, canvas.width, canvas.height);
    drawMatrix(NEXT, {x: 4, y: 4}, futureContext);
    player.pos.y = 0;
    player.pos.x = 4;
    if (collide(arena, player)) {
        gameOver();
    }
}

function gameOver() {
    localStorage.setItem(localStorage.getItem("username"),player.score);
    localStorage.removeItem("username");
    window.location = 'records.html';
}
function levelUp(score) {
    var str = "Level : " + player.lvl;
    document.getElementById("lvl").innerText = str;
    if (score > 100 && score < 200) {
        dropTime = 350;
        player.lvl = 2;
    }
    if(score > 200 && score < 400){
        dropTime = 150;
        player.lvl = 3;
    }
}

function createFigure(type) {
    switch (type) {
        case 'I':
            return [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                ];
            break;
        case 'L':
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
            break;
        case 'J':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
            break;
        case 'O':
            return [
                [4, 4],
                [4, 4],
            ];
            break;
        case 'Z':
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
            break;
        case 'S':
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
            break;
        case 'T':
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
            break;
        /*case 'H':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 0, 3],
            ];
            break;*/
        default:
            return 0;
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
    else if (ev.key === Rotate)
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
    var str = "Score : " + player.score;
    document.getElementById('score').innerText = str;
}
drawNext();
updateScore();
update();