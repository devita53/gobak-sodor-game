/* =====================================================
   DATA AKUN
===================================================== */

let accounts = JSON.parse(
    localStorage.getItem("gobakAccounts") || "[]"
);

let currentUser = null;


/* =====================================================
   HALAMAN
===================================================== */

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const menuPage = document.getElementById("menuPage");
const gamePage = document.getElementById("gamePage");


function showLogin() {
    loginPage.classList.remove("hidden");
    registerPage.classList.add("hidden");
}


function showRegister() {
    loginPage.classList.add("hidden");
    registerPage.classList.remove("hidden");
}


/* =====================================================
   REGISTER
===================================================== */

function register() {

    const username =
        document.getElementById("registerUsername").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("registerConfirm").value;


    if (username.length < 3) {
        alert("Nama pengguna minimal 3 karakter!");
        return;
    }


    if (password.length < 4) {
        alert("Kata sandi minimal 4 karakter!");
        return;
    }


    if (password !== confirm) {
        alert("Konfirmasi kata sandi tidak sama!");
        return;
    }


    const existing = accounts.find(
        account =>
            account.username.toLowerCase() === username.toLowerCase()
    );


    if (existing) {
        alert("Nama pengguna sudah digunakan!");
        return;
    }


    accounts.push({
        username: username,
        password: password,
        highScore: 0
    });


    localStorage.setItem(
        "gobakAccounts",
        JSON.stringify(accounts)
    );


    alert("Akun berhasil dibuat! Silakan masuk.");

    document.getElementById("registerUsername").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerConfirm").value = "";

    showLogin();
}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const account = accounts.find(
        account =>
            account.username.toLowerCase() === username.toLowerCase() &&
            account.password === password
    );


    if (!account) {
        alert("Nama pengguna atau kata sandi salah!");
        return;
    }


    currentUser = account;

    document.getElementById("menuUsername").textContent =
        currentUser.username;


    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    menuPage.classList.remove("hidden");
}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    currentUser = null;

    gamePage.classList.add("hidden");
    menuPage.classList.add("hidden");
    registerPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
}


/* =====================================================
   DATA GAME
===================================================== */

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const guard1 = document.getElementById("guard1");
const guard2 = document.getElementById("guard2");
const guard3 = document.getElementById("guard3");

const coinsElements = [
    document.getElementById("coin1"),
    document.getElementById("coin2"),
    document.getElementById("coin3"),
    document.getElementById("coin4")
];


let playerX = 0;
let playerY = 0;

let score = 0;
let coins = 0;
let lives = 5;
let level = 1;

let gameRunning = false;

let gameTimer = null;

let lastHit = 0;


/* posisi penjaga */
let guardPositions = [80, 350, 620];

let guardDirections = [1, -1, 1];

let guardRows = [120, 300, 440];


/* =====================================================
   MULAI GAME
===================================================== */

function startGame() {

    menuPage.classList.add("hidden");
    gamePage.classList.remove("hidden");


    document.getElementById("gameUsername").textContent =
        currentUser.username;


    score = 0;
    coins = 0;
    lives = 5;
    level = 1;

    gameRunning = true;

    updateUI();


    /* posisi awal pemain */
    playerX = gameArea.clientWidth / 2 - 25;

    playerY = gameArea.clientHeight - 90;


    /* posisi penjaga */
    guardPositions = [
        100,
        gameArea.clientWidth / 2,
        gameArea.clientWidth - 150
    ];


    guardRows = [
        130,
        300,
        450
    ];


    guardDirections = [
        1,
        -1,
        1
    ];


    positionPlayer();

    positionGuards();

    randomizeCoins();


    clearInterval(gameTimer);

    gameTimer = setInterval(gameLoop, 30);


    showMessage(
        "Kumpulkan semua koin dan hindari 3 penjaga!"
    );
}


/* =====================================================
   POSISI PEMAIN
===================================================== */

function positionPlayer() {

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}


/* =====================================================
   POSISI PENJAGA
===================================================== */

function positionGuards() {

    guard1.style.left = guardPositions[0] + "px";
    guard1.style.top = guardRows[0] + "px";


    guard2.style.left = guardPositions[1] + "px";
    guard2.style.top = guardRows[1] + "px";


    guard3.style.left = guardPositions[2] + "px";
    guard3.style.top = guardRows[2] + "px";
}


/* =====================================================
   ACAK KOIN
===================================================== */

function randomizeCoins() {

    const width = gameArea.clientWidth;
    const height = gameArea.clientHeight;


    const positions = [];


    for (let i = 0; i < coinsElements.length; i++) {

        let x;
        let y;

        let validPosition = false;


        while (!validPosition) {

            x = Math.random() * (width - 100) + 50;

            y = Math.random() * (height - 180) + 80;


            validPosition = true;


            /*
                Jangan terlalu dekat dengan
                posisi penjaga.
            */

            for (let g = 0; g < guardPositions.length; g++) {

                const distance = Math.sqrt(
                    Math.pow(x - guardPositions[g], 2) +
                    Math.pow(y - guardRows[g], 2)
                );


                if (distance < 100) {
                    validPosition = false;
                    break;
                }
            }


            /*
                Jangan terlalu dekat dengan
                koin lain.
            */

            for (const pos of positions) {

                const distance = Math.sqrt(
                    Math.pow(x - pos.x, 2) +
                    Math.pow(y - pos.y, 2)
                );


                if (distance < 70) {
                    validPosition = false;
                    break;
                }
            }
        }


        positions.push({
            x: x,
            y: y
        });


        coinsElements[i].style.left = x + "px";
        coinsElements[i].style.top = y + "px";

        coinsElements[i].style.display = "flex";
    }
}


/* =====================================================
   GERAK PEMAIN
===================================================== */

function movePlayer(direction) {

    if (!gameRunning) return;


    const speed = 18;


    if (direction === "up") {
        playerY -= speed;
    }


    if (direction === "down") {
        playerY += speed;
    }


    if (direction === "left") {
        playerX -= speed;
    }


    if (direction === "right") {
        playerX += speed;
    }


    /* batas arena */

    playerX = Math.max(
        10,
        Math.min(
            gameArea.clientWidth - player.offsetWidth - 10,
            playerX
        )
    );


    playerY = Math.max(
        35,
        Math.min(
            gameArea.clientHeight - player.offsetHeight - 10,
            playerY
        )
    );


    positionPlayer();
}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener("keydown", function(event) {

    if (!gameRunning) return;


    const key = event.key.toLowerCase();


    if (
        key === "arrowup" ||
        key === "w"
    ) {
        event.preventDefault();
        movePlayer("up");
    }


    if (
        key === "arrowdown" ||
        key === "s"
    ) {
        event.preventDefault();
        movePlayer("down");
    }


    if (
        key === "arrowleft" ||
        key === "a"
    ) {
        event.preventDefault();
        movePlayer("left");
    }


    if (
        key === "arrowright" ||
        key === "d"
    ) {
        event.preventDefault();
        movePlayer("right");
    }
});


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    if (!gameRunning) return;


    moveGuards();

    checkCoinCollision();

    checkGuardCollision();

    checkFinish();
}


/* =====================================================
   GERAK PENJAGA
===================================================== */

function moveGuards() {

    const width = gameArea.clientWidth;


    /*
        Kecepatan semakin bertambah
        setiap level.
    */

    const speed =
        1.5 + ((level - 1) * 0.45);


    for (let i = 0; i < 3; i++) {

        guardPositions[i] +=
            speed * guardDirections[i];


        if (
            guardPositions[i] <= 20 ||
            guardPositions[i] >= width - 70
        ) {

            guardDirections[i] *= -1;
        }
    }


    positionGuards();
}


/* =====================================================
   TABRAKAN DENGAN KOIN
===================================================== */

function checkCoinCollision() {

    coinsElements.forEach(function(coin) {

        if (coin.style.display === "none") {
            return;
        }


        if (isColliding(player, coin)) {

            coin.style.display = "none";

            coins++;

            score += 25;

            updateUI();


            showMessage(
                "🪙 Koin berhasil dikumpulkan! +25"
            );
        }
    });
}


/* =====================================================
   TABRAKAN PENJAGA
===================================================== */

function checkGuardCollision() {

    const guards = [
        guard1,
        guard2,
        guard3
    ];


    for (const guard of guards) {

        if (isColliding(player, guard)) {

            const now = Date.now();


            /*
                Supaya nyawa tidak berkurang
                berkali-kali dalam waktu singkat.
            */

            if (now - lastHit > 1200) {

                lastHit = now;

                loseLife();

                break;
            }
        }
    }
}


/* =====================================================
   KEHILANGAN NYAWA
===================================================== */

function loseLife() {

    lives--;

    updateUI();


    if (lives <= 0) {

        gameOver();

        return;
    }


    showMessage(
        "⚠️ Kamu tertangkap! Nyawa berkurang."
    );


    resetPlayer();
}


/* =====================================================
   RESET PEMAIN
===================================================== */

function resetPlayer() {

    playerX =
        gameArea.clientWidth / 2 - 25;

    playerY =
        gameArea.clientHeight - 90;


    positionPlayer();
}


/* =====================================================
   CEK SEMUA KOIN
===================================================== */

function allCoinsCollected() {

    return coinsElements.every(
        coin => coin.style.display === "none"
    );
}


/* =====================================================
   FINISH
===================================================== */

function checkFinish() {

    /*
        Pemain harus mengumpulkan semua koin
        sebelum bisa naik level.
    */

    if (
        playerY <= 45 &&
        allCoinsCollected()
    ) {

        nextLevel();
    }


    if (
        playerY <= 45 &&
        !allCoinsCollected()
    ) {

        showMessage(
            "🪙 Kumpulkan semua koin terlebih dahulu!"
        );

        playerY = 65;

        positionPlayer();
    }
}


/* =====================================================
   LEVEL BERIKUTNYA
===================================================== */

function nextLevel() {

    level++;

    score += 100;

    coins = 0;


    updateUI();


    /*
        Reset posisi pemain.
    */

    resetPlayer();


    /*
        Koin DIACAK LAGI.
    */

    randomizeCoins();


    /*
        Posisi penjaga juga berubah.
    */

    guardPositions = [
        Math.random() * 200 + 30,
        Math.random() * 200 + 250,
        Math.random() * 150 + 500
    ];


    guardRows = [
        100 + Math.random() * 80,
        260 + Math.random() * 100,
        400 + Math.random() * 80
    ];


    positionGuards();


    showMessage(
        "🎉 LEVEL " + level +
        "! Koin berpindah dan penjaga semakin cepat!"
    );
}


/* =====================================================
   TABRAKAN
===================================================== */

function isColliding(a, b) {

    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();


    return !(
        aRect.right < bRect.left ||
        aRect.left > bRect.right ||
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom
    );
}


/* =====================================================
   UPDATE UI
===================================================== */

function updateUI() {

    document.getElementById("lives").textContent =
        lives;

    document.getElementById("coins").textContent =
        coins;

    document.getElementById("score").textContent =
        score;

    document.getElementById("level").textContent =
        level;
}


/* =====================================================
   PESAN
===================================================== */

let messageTimeout;


function showMessage(message) {

    const messageBox =
        document.getElementById("gameMessage");


    messageBox.textContent = message;


    clearTimeout(messageTimeout);


    messageTimeout = setTimeout(function() {

        if (gameRunning) {

            messageBox.textContent =
                "Kumpulkan semua koin dan hindari penjaga!";
        }

    }, 1800);
}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    gameRunning = false;

    clearInterval(gameTimer);


    saveHighScore();


    const again = confirm(
        "GAME OVER!\n\n" +
        "Skor kamu: " + score +
        "\nLevel: " + level +
        "\n\nMain lagi?"
    );


    if (again) {

        startGame();

    } else {

        backToMenu();
    }
}


/* =====================================================
   SIMPAN HIGH SCORE
===================================================== */

function saveHighScore() {

    if (!currentUser) return;


    const account = accounts.find(
        account =>
            account.username === currentUser.username
    );


    if (!account) return;


    if (score > (account.highScore || 0)) {

        account.highScore = score;

        localStorage.setItem(
            "gobakAccounts",
            JSON.stringify(accounts)
        );
    }
}


/* =====================================================
   RESTART
===================================================== */

function restartGame() {

    clearInterval(gameTimer);

    startGame();
}


/* =====================================================
   KEMBALI KE MENU
===================================================== */

function backToMenu() {

    gameRunning = false;

    clearInterval(gameTimer);

    gamePage.classList.add("hidden");

    menuPage.classList.remove("hidden");
}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener("resize", function() {

    if (!gameRunning) return;


    playerX = Math.min(
        playerX,
        gameArea.clientWidth - player.offsetWidth - 10
    );


    positionPlayer();
});
