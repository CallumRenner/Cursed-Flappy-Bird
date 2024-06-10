const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = { x: 50, y: 150, width: 50, height: 36, gravity: 0.3, lift: -5, velocity: 0 };
let pipes = [];
let score = 0;
let pipeWidth = 20;
let pipeGap = 100;
let pipeSpeed = 2;
let jump = false;

// Bird image
const birdImg = new Image();
birdImg.src = 'https://freepngimg.com/thumb/flying_bird/26020-6-flying-bird-transparent-background.png';

// Event listener for bird jump
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump = true;
    }
});

canvas.addEventListener('click', () => {
    jump = true;
});

// Pipe class
class Pipe {
    constructor() {
        this.top = Math.random() * (canvas.height / 2);
        this.bottom = canvas.height - (this.top + pipeGap);
        this.x = canvas.width;
        this.width = pipeWidth;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    update() {
        this.x -= pipeSpeed;
        if (this.x + this.width < 0) {
            score++;
            return true;
        }
        return false;
    }
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Check for collision with ground or ceiling
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }

    // Pipe logic
    if (frames % 75 === 0) {
        pipes.push(new Pipe());
    }
    pipes.forEach((pipe, index) => {
        pipe.draw();
        if (pipe.update()) {
            pipes.splice(index, 1);
        }

        // Check for collision with pipes
        if (bird.x < pipe.x + pipe.width && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            resetGame();
        }
    });

    // Bird jump
    if (jump) {
        bird.velocity = bird.lift;
        jump = false;
    }

    // Update frames
    frames++;

    // Display score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frames = 0;
}

// Pipe gap slider
const pipeGapSlider = document.getElementById('pipeGapSlider');
pipeGapSlider.addEventListener('input', () => {
    pipeGap = parseInt(pipeGapSlider.value);
});

// Pipe speed slider
const pipeSpeedSlider = document.getElementById('pipeSpeedSlider');
pipeSpeedSlider.addEventListener('input', () => {
    pipeSpeed = parseInt(pipeSpeedSlider.value);
});

// Start game
let frames = 0;
resetGame();
gameLoop();
