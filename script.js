const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tải hình ảnh sprite Mario & Nấm
let marioImg = new Image();
marioImg.src = "https://upload.wikimedia.org/wikipedia/commons/b/b1/Mario_Sprite.png";

let mushroomImg = new Image();
mushroomImg.src = "https://i.imgur.com/8Q961hW.png";

let player = { x: 50, y: 250, w: 32, h: 32, dx: 0, dy: 0, speed: 4, jumpPower: -11, grounded: false, sizeMultiplier: 1 };
let gravity = 0.5;
let keys = {};

// Chướng ngại vật (Ống cống)
let obstacles = [
    { x: 400, y: 300, w: 40, h: 50 },
    { x: 650, y: 280, w: 40, h: 70 }
];

// Vật phẩm (Nấm tăng lực)
let mushroom = { x: 500, y: 310, w: 25, h: 25, collected: false };

window.addEventListener("keydown", e => keys[e.code] = true);
window.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    if (keys["ArrowRight"] || keys["KeyD"]) player.dx = player.speed;
    else if (keys["ArrowLeft"] || keys["KeyA"]) player.dx = -player.speed;
    else player.dx = 0;

    if ((keys["Space"] || keys["ArrowUp"] || keys["KeyW"]) && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    player.dy += gravity;
    player.x += player.dx;
    player.y += player.dy;

    // Va chạm sàn nhà
    if (player.y + player.h > 350) {
        player.y = 350 - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    // Va chạm chướng ngại vật
    obstacles.forEach(obs => {
        if (player.x < obs.x + obs.w && player.x + player.w > obs.x &&
            player.y < obs.y + obs.h && player.y + player.h > obs.y) {
            if (player.dy > 0 && player.y + player.h - player.dy <= obs.y) {
                player.y = obs.y - player.h;
                player.dy = 0;
                player.grounded = true;
            } else {
                player.x -= player.dx;
            }
        }
    });

    // Va chạm lấy nấm
    if (!mushroom.collected && 
        player.x < mushroom.x + mushroom.w && player.x + player.w > mushroom.x &&
        player.y < mushroom.y + mushroom.h && player.y + player.h > mushroom.y) {
        mushroom.collected = true;
        player.sizeMultiplier = 1.4;
        player.h = 45;
        player.w = 45;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ nền đất
    ctx.fillStyle = "#c84c0c";
    ctx.fillRect(0, 350, canvas.width, 50);
    ctx.fillStyle = "#00aa00";
    ctx.fillRect(0, 350, canvas.width, 10);

    // Vẽ ống cống
    ctx.fillStyle = "#00aa00";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        ctx.fillStyle = "#008800";
        ctx.fillRect(obs.x - 4, obs.y, obs.w + 8, 12);
        ctx.fillStyle = "#00aa00";
    });

    // Vẽ nấm
    if (!mushroom.collected) {
        ctx.drawImage(mushroomImg, mushroom.x, mushroom.y, mushroom.w, mushroom.h);
    }

    // Vẽ Mario
    if (marioImg.complete && marioImg.naturalWidth !== 0) {
        ctx.drawImage(marioImg, player.x, player.y, player.w, player.h);
    } else {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
