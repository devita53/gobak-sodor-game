// ==========================================
// ELEMENT HTML
// ==========================================

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const menuPage = document.getElementById("menuPage");
const gamePage = document.getElementById("gamePage");


// LOGIN

const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");


// REGISTER

const registerForm = document.getElementById("registerForm");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const registerMessage = document.getElementById("registerMessage");


// MENU

const menuUsername = document.getElementById("menuUsername");
const playButton = document.getElementById("playButton");
const logoutButton = document.getElementById("logoutButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const howToPlay = document.getElementById("howToPlay");


// GAME

const gameUsername = document.getElementById("gameUsername");
const gameArea = document.getElementById("gameArea");

const player = document.getElementById("player");
const guard1 = document.getElementById("guard1");
const guard2 = document.getElementById("guard2");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const levelText = document.getElementById("level");

const gameMessage = document.getElementById("gameMessage");

const restartButton = document.getElementById("restartButton");
const backMenuButton = document.getElementById("backMenuButton");


// ==========================================
// SISTEM AKUN
// ==========================================

function getAccounts() {

    const accounts = localStorage.getItem("gobakAccounts");

    if (accounts) {
        return JSON.parse(accounts);
    }

    return [];
}


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = registerUsername.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    registerMessage.textContent = "";

    if (username.length < 3) {

        registerMessage.textContent =
            "Nama pengguna minimal 3 karakter.";

        return;
    }

    if (password.length < 4) {

        registerMessage.textContent =
            "Password minimal 4 karakter.";

        return;
    }

    if (password !== confirm) {

        registerMessage.textContent =
            "Password tidak sama.";

        return;
    }


    const accounts = getAccounts();

    const existingAccount = accounts.find(
        account =>
            account.username.toLowerCase() ===
            username.toLowerCase()
    );


    if (existingAccount) {

        registerMessage.textContent =
            "Nama pengguna sudah digunakan.";

        return;
    }


    const newAccount = {

        username: username,

        password: password,

        highScore: 0

    };


    accounts.push(newAccount);

    localStorage.setItem(
        "gobakAccounts",
        JSON.stringify(accounts)
    );


    registerMessage.style.color = "#198754";

    registerMessage.textContent =
        "Akun berhasil dibuat! Silakan login.";


    registerForm.reset();

    setTimeout(function() {

        registerPage.classList.add("hidden");

        loginPage.classList.remove("hidden");

        registerMessage.style.color = "#dc3545";

    }, 1000);

});


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = loginUsername.value.trim();
    const password = loginPassword.value;

    const accounts = getAccounts();


    const account = accounts.find(

        account =>

            account.username.toLowerCase() ===
            username.toLowerCase() &&

            account.password === password

    );


    if (!account) {

        loginMessage.textContent =
            "Nama pengguna atau password salah.";

        return;
    }


    localStorage.setItem(
        "currentUser",
        account.username
    );


    loginMessage.textContent = "";

    loginForm.reset();

    showMenu(account.username);

});


// ==========================================
// TAMPILKAN MENU
// ==========================================

function showMenu(username) {

    loginPage.classList.add("hidden");

    registerPage.classList.add("hidden");

    gamePage.classList.add("hidden");

    menuPage.classList.remove("hidden");


    menuUsername.textContent = username;

    gameUsername.textContent = username;

}


// ==========================================
// PINDAH LOGIN / REGISTER
// ==========================================

document
    .getElementById("showRegister")
    .addEventListener("click", function() {

        loginPage.classList.add("hidden");

        registerPage.classList.remove("hidden");

        loginMessage.textContent = "";

    });


document
    .getElementById("showLogin")
    .addEventListener("click", function() {

        registerPage.classList.add("hidden");

        loginPage.classList.remove("hidden");

        registerMessage.textContent = "";

    });


// ==========================================
// CARA BERMAIN
// ==========================================

howToPlayButton.addEventListener("click", function() {

    howToPlay.classList.toggle("hidden");

});


// ==========================================
// DATA GAME
// ==========================================

let playerX = 20;

let playerY = 430;

let score = 0;

// ⭐ NYAWA SUDAH 5
let lives = 5;

let level = 1;

let gameRunning = false;

let guardDirection1 = 1;

let guardDirection2 = -1;

let guardTimer = null;

let lastHitTime = 0;


// ==========================================
// MULAI GAME
// ==========================================

playButton.addEventListener("click", function() {

    startGame();

});


function startGame() {

    menuPage.classList.add("hidden");

    gamePage.classList.remove("hidden");


    const currentUser =
        localStorage.getItem("currentUser");

    gameUsername.textContent =
        currentUser || "Pemain";


    // Reset game

    playerX = 20;

    playerY = gameArea.clientHeight - 70;

    score = 0;

    // ⭐ NYAWA 5 SETIAP MULAI GAME
    lives = 5;

    level = 1;

    guardDirection1 = 1;

    guardDirection2 = -1;

    gameRunning = true;

    lastHitTime = 0;


    // Posisi penjaga

    guard1.style.left = "100px";

    guard2.style.left = "400px";

    guard2.style.right = "auto";


    updatePlayer();

    updateStatus();


    gameMessage.textContent =
        "Ayo capai garis FINISH!";


    clearInterval(guardTimer);


    guardTimer = setInterval(function() {

        if (gameRunning) {

            moveGuards();

            checkCollision();

        }

    }, 40);

}


// ==========================================
// POSISI PEMAIN
// ==========================================

function updatePlayer() {

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";

}


// ==========================================
// UPDATE SKOR, NYAWA, LEVEL
// ==========================================

function updateStatus() {

    scoreText.textContent = score;

    livesText.textContent = lives;

    levelText.textContent = level;

}


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) {
        return;
    }


    const keys = [

        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",

        "w",
        "a",
        "s",
        "d",

        "W",
        "A",
        "S",
        "D"

    ];


    if (keys.includes(event.key)) {

        event.preventDefault();

        movePlayer(event.key);

    }

});


// ==========================================
// TOMBOL MOBILE
// ==========================================

const controlButtons =
    document.querySelectorAll(".controls button");


controlButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        if (gameRunning) {

            movePlayer(
                button.dataset.key
            );

        }

    });

});


// ==========================================
// GERAK PEMAIN
// ==========================================

function movePlayer(key) {

    const step = 20;


    if (
        key === "ArrowUp" ||
        key === "w" ||
        key === "W"
    ) {

        playerY -= step;

    }


    if (
        key === "ArrowDown" ||
        key === "s" ||
        key === "S"
    ) {

        playerY += step;

    }


    if (
        key === "ArrowLeft" ||
        key === "a" ||
        key === "A"
    ) {

        playerX -= step;

    }


    if (
        key === "ArrowRight" ||
        key === "d" ||
        key === "D"
    ) {

        playerX += step;

    }


    // Batas kiri

    if (playerX < 0) {

        playerX = 0;

    }


    // Batas kanan

    const maxX =
        gameArea.clientWidth -
        player.offsetWidth;

    if (playerX > maxX) {

        playerX = maxX;

    }


    // Batas atas

    if (playerY < 0) {

        playerY = 0;

    }


    // Batas bawah

    const maxY =
        gameArea.clientHeight -
        player.offsetHeight;

    if (playerY > maxY) {

        playerY = maxY;

    }


    updatePlayer();


    // Cek finish

    if (playerY <= 35) {

        finishLevel();

    }


    checkCollision();

}


// ==========================================
// PENJAGA BERGERAK
// ==========================================

function moveGuards() {

    const speed =
        2 + (level - 1) * 0.6;


    let guard1X =
        parseInt(guard1.style.left) || 100;


    let guard2X =
        parseInt(guard2.style.left) || 400;


    // Penjaga 1

    guard1X +=
        speed * guardDirection1;


    if (
        guard1X <= 0 ||
        guard1X >=
        gameArea.clientWidth -
        guard1.offsetWidth
    ) {

        guardDirection1 *= -1;

    }


    // Penjaga 2

    guard2X +=
        speed * guardDirection2;


    if (
        guard2X <= 0 ||
        guard2X >=
        gameArea.clientWidth -
        guard2.offsetWidth
    ) {

        guardDirection2 *= -1;

    }


    guard1.style.left =
        guard1X + "px";


    guard2.style.left =
        guard2X + "px";

}


// ==========================================
// CEK TABRAKAN
// ==========================================

function checkCollision() {

    if (!gameRunning) {
        return;
    }


    const now = Date.now();


    // Memberikan waktu kebal setelah terkena
    if (now - lastHitTime < 1000) {

        return;

    }


    const playerRect =
        player.getBoundingClientRect();


    const guard1Rect =
        guard1.getBoundingClientRect();


    const guard2Rect =
        guard2.getBoundingClientRect();


    if (
        isColliding(
            playerRect,
            guard1Rect
        ) ||

        isColliding(
            playerRect,
            guard2Rect
        )
    ) {

        loseLife();

    }

}


// ==========================================
// FUNGSI TABRAKAN
// ==========================================

function isColliding(rect1, rect2) {

    return (

        rect1.left < rect2.right &&

        rect1.right > rect2.left &&

        rect1.top < rect2.bottom &&

        rect1.bottom > rect2.top

    );

}


// ==========================================
// KEHILANGAN NYAWA
// ==========================================

function loseLife() {

    if (!gameRunning) {
        return;
    }


    lastHitTime = Date.now();


    lives--;

    updateStatus();


    if (lives <= 0) {

        endGame();

        return;

    }


    gameMessage.textContent =
        "💥 Kamu terkena penjaga! Nyawa tersisa: " +
        lives;


    resetPlayer();

}


// ==========================================
// RESET POSISI PEMAIN
// ==========================================

function resetPlayer() {

    playerX = 20;

    playerY =
        gameArea.clientHeight -
        70;


    updatePlayer();

}


// ==========================================
// SELESAI LEVEL
// ==========================================

function finishLevel() {

    if (!gameRunning) {
        return;
    }


    score += 100 * level;

    level++;


    updateStatus();


    gameMessage.textContent =
        "🎉 Level berhasil! Sekarang Level " +
        level +
        " lebih sulit!";


    resetPlayer();

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning = false;

    clearInterval(guardTimer);


    const newHighScore =
        saveHighScore();


    if (newHighScore) {

        gameMessage.innerHTML =
            "💀 GAME OVER!<br>" +
            "Skor: " +
            score +
            "<br>🏆 Rekor baru!";

    } else {

        gameMessage.innerHTML =
            "💀 GAME OVER!<br>" +
            "Skor kamu: " +
            score;

    }

}


// ==========================================
// SIMPAN HIGH SCORE
// ==========================================

function saveHighScore() {

    const currentUser =
        localStorage.getItem("currentUser");


    if (!currentUser) {

        return false;

    }


    const accounts =
        getAccounts();


    const account =
        accounts.find(

            account =>
                account.username ===
                currentUser

        );


    if (!account) {

        return false;

    }


    if (score > (account.highScore || 0)) {

        account.highScore = score;


        localStorage.setItem(
            "gobakAccounts",
            JSON.stringify(accounts)
        );


        return true;

    }


    return false;

}


// ==========================================
// RESTART
// ==========================================

restartButton.addEventListener("click", function() {

    startGame();

});


// ==========================================
// KEMBALI KE MENU
// ==========================================

backMenuButton.addEventListener("click", function() {

    clearInterval(guardTimer);

    gameRunning = false;

    gamePage.classList.add("hidden");

    menuPage.classList.remove("hidden");

});


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener("click", function() {

    clearInterval(guardTimer);

    gameRunning = false;


    localStorage.removeItem("currentUser");


    menuPage.classList.add("hidden");

    gamePage.classList.add("hidden");

    loginPage.classList.remove("hidden");


    loginForm.reset();

    loginMessage.textContent = "";

});


// ==========================================
// HALAMAN AWAL
// ==========================================

// Selalu mulai dari halaman login

loginPage.classList.remove("hidden");

registerPage.classList.add("hidden");

menuPage.classList.add("hidden");

gamePage.classList.add("hidden");
