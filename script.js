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

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const menuPage =
    document.getElementById("menuPage");

const gamePage =
    document.getElementById("gamePage");


/* =====================================================
   SISTEM NOTIFIKASI DALAM GAME
   TIDAK MENGGUNAKAN ALERT BROWSER
===================================================== */

window.alert = function(message) {

    showNotification(
        message,
        "Informasi",
        "ℹ️"
    );

};


function showNotification(
    message,
    title = "Informasi",
    icon = "ℹ️"
) {

    const titleElement =
        document.getElementById(
            "notificationTitle"
        );

    const messageElement =
        document.getElementById(
            "notificationMessage"
        );

    const iconElement =
        document.getElementById(
            "notificationIcon"
        );

    const thumbnailElement =
        document.getElementById(
            "notificationThumbnail"
        );

    const buttonElement =
        document.querySelector(
            "#notificationPopup .notification-card button"
        );


    titleElement.textContent =
        title;


    messageElement.textContent =
        message;


    iconElement.textContent =
        icon;


    if (thumbnailElement) {

        thumbnailElement.textContent =
            icon;

    }


    if (buttonElement) {

        buttonElement.textContent =
            "OKE";

        buttonElement.onclick =
            closeNotification;
    }


    document
        .getElementById(
            "notificationPopup"
        )
        .classList.remove("hidden");
}


/* =====================================================
   PETUNJUK BERMAIN
===================================================== */

function showInstructions() {

    const titleElement =
        document.getElementById(
            "notificationTitle"
        );

    const messageElement =
        document.getElementById(
            "notificationMessage"
        );

    const iconElement =
        document.getElementById(
            "notificationIcon"
        );

    const thumbnailElement =
        document.getElementById(
            "notificationThumbnail"
        );

    const buttonElement =
        document.querySelector(
            "#notificationPopup .notification-card button"
        );


    titleElement.textContent =
        "CARA BERMAIN";

    iconElement.textContent =
        "🎮";

    thumbnailElement.textContent =
        "🎮";


    messageElement.innerHTML =
        "1. Gerakkan pemain dengan tombol panah / WASD.<br>" +
        "2. Kumpulkan semua koin untuk membuka FINISH.<br>" +
        "3. Hindari 3 penjaga.<br>" +
        "4. Kamu memiliki 5 nyawa.<br>" +
        "5. Setiap level memiliki batas waktu.<br>" +
        "6. Penjaga semakin cepat setiap level.<br>" +
        "7. Selesaikan sampai LEVEL 10 untuk menang.";


    if (buttonElement) {

        buttonElement.textContent =
            "MULAI";

        buttonElement.onclick =
            beginCountdown;
    }


    document
        .getElementById(
            "notificationPopup"
        )
        .classList.remove("hidden");
}


function closeNotification() {

    document
        .getElementById(
            "notificationPopup"
        )
        .classList.add("hidden");
}


/* =====================================================
   LOGIN / REGISTER PAGE
===================================================== */

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
        document
            .getElementById("registerUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("registerPassword")
            .value;

    const confirm =
        document
            .getElementById("registerConfirm")
            .value;


    if (username.length < 3) {

        showNotification(
            "Nama pengguna minimal 3 karakter.",
            "Nama Pengguna",
            "👤"
        );

        return;
    }


    if (password.length < 4) {

        showNotification(
            "Kata sandi minimal 4 karakter.",
            "Kata Sandi",
            "🔐"
        );

        return;
    }


    if (password !== confirm) {

        showNotification(
            "Konfirmasi kata sandi tidak sama.",
            "Kata Sandi",
            "⚠️"
        );

        return;
    }


    const existing =
        accounts.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase()
        );


    if (existing) {

        showNotification(
            "Nama pengguna sudah digunakan. Silakan gunakan nama lain.",
            "Pendaftaran Gagal",
            "⚠️"
        );

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


    document.getElementById(
        "registerUsername"
    ).value = "";

    document.getElementById(
        "registerPassword"
    ).value = "";

    document.getElementById(
        "registerConfirm"
    ).value = "";


    showLogin();


    showNotification(
        "Akun berhasil dibuat! Silakan masuk untuk mulai bermain.",
        "Pendaftaran Berhasil!",
        "🎉"
    );
}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    const account =
        accounts.find(
            account =>
                account.username.toLowerCase() ===
                username.toLowerCase() &&
                account.password === password
        );


    if (!account) {

        showNotification(
            "Nama pengguna atau kata sandi yang kamu masukkan salah.",
            "Login Gagal",
            "❌"
        );

        return;
    }


    currentUser = account;


    document.getElementById(
        "menuUsername"
    ).textContent =
        currentUser.username;


    document.getElementById(
        "gameUsername"
    ).textContent =
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


    document.getElementById(
        "loginUsername"
    ).value = "";

    document.getElementById(
        "loginPassword"
    ).value = "";
}


/* =====================================================
   GAME DATA
===================================================== */

const gameArea =
    document.getElementById("gameArea");

const player =
    document.getElementById("player");

const guard1 =
    document.getElementById("guard1");

const guard2 =
    document.getElementById("guard2");

const guard3 =
    document.getElementById("guard3");


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

/* TOTAL KOIN SELAMA PERMAINAN */
let totalCoins = 0;

let lives = 5;

let level = 1;

let gameRunning = false;

let gameTimer = null;

let levelTimer = null;

let countdownTimer = null;

let lastHit = 0;

let levelTimeLeft = 22;


/* =====================================================
   PENGATURAN KESULITAN
===================================================== */

const MAX_LEVEL = 10;

const START_TIME = 22;

const MIN_TIME = 13;


/*
   Level 1 = 22 detik
   Level 2 = 21 detik
   ...
   Level 10 = 13 detik
*/

function getLevelTime() {

    return Math.max(
        MIN_TIME,
        START_TIME - (level - 1)
    );
}


let guardPositions = [
    80,
    300,
    500
];


let guardDirections = [
    1,
    -1,
    1
];


let guardRows = [
    120,
    300,
    440
];


/* =====================================================
   MULAI GAME
===================================================== */

function startGame() {

    document
        .getElementById("gameOverPopup")
        .classList.add("hidden");


    clearInterval(gameTimer);

    clearInterval(levelTimer);

    clearInterval(countdownTimer);


    closeNotification();


    menuPage.classList.add("hidden");

    gamePage.classList.remove("hidden");


    score = 0;

    coins = 0;

    /* RESET TOTAL KOIN SAAT GAME BARU */
    totalCoins = 0;

    lives = 5;

    level = 1;

    gameRunning = false;

    lastHit = 0;


    updateUI();


    playerX =
        gameArea.clientWidth / 2 - 24;

    playerY =
        gameArea.clientHeight - 80;


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


    levelTimeLeft =
        getLevelTime();


    showMessage(
        "Bersiap untuk bermain!"
    );


    showInstructions();
}


/* =====================================================
   COUNTDOWN 3 - 2 - 1
===================================================== */

function beginCountdown() {

    closeNotification();


    clearInterval(countdownTimer);

    clearInterval(gameTimer);

    clearInterval(levelTimer);


    gameRunning = false;


    let count = 3;


    document.getElementById(
        "gameMessage"
    ).textContent =
        count;


    countdownTimer =
        setInterval(
            function() {

                count--;


                if (count > 0) {

                    document.getElementById(
                        "gameMessage"
                    ).textContent =
                        count;

                    return;
                }


                clearInterval(
                    countdownTimer
                );


                document.getElementById(
                    "gameMessage"
                ).textContent =
                    "MULAI!";


                setTimeout(
                    function() {

                        startLevel();

                    },
                    600
                );

            },
            900
        );
}


/* =====================================================
   MEMULAI LEVEL
===================================================== */

function startLevel() {

    gameRunning = true;


    levelTimeLeft =
        getLevelTime();


    updateTimerMessage();


    clearInterval(gameTimer);

    clearInterval(levelTimer);


    gameTimer =
        setInterval(
            gameLoop,
            30
        );


    levelTimer =
        setInterval(
            function() {

                if (!gameRunning) {
                    return;
                }


                levelTimeLeft--;


                if (
                    levelTimeLeft <= 0
                ) {

                    levelTimeLeft = 0;

                    updateTimerMessage();

                    gameOver();

                    return;
                }


                updateTimerMessage();

            },
            1000
        );
}


/* =====================================================
   POSISI PEMAIN
===================================================== */

function positionPlayer() {

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";
}


/* =====================================================
   POSISI PENJAGA
===================================================== */

function positionGuards() {

    guard1.style.left =
        guardPositions[0] + "px";

    guard1.style.top =
        guardRows[0] + "px";


    guard2.style.left =
        guardPositions[1] + "px";

    guard2.style.top =
        guardRows[1] + "px";


    guard3.style.left =
        guardPositions[2] + "px";

    guard3.style.top =
        guardRows[2] + "px";
}


/* =====================================================
   ACAK KOIN SETIAP LEVEL
===================================================== */

function randomizeCoins() {

    const width =
        gameArea.clientWidth;

    const height =
        gameArea.clientHeight;


    const positions = [];


    for (
        let i = 0;
        i < coinsElements.length;
        i++
    ) {

        let x;

        let y;

        let validPosition = false;


        while (!validPosition) {

            x =
                Math.random() *
                (width - 100) +
                50;


            y =
                Math.random() *
                (height - 180) +
                80;


            validPosition = true;


            for (
                let g = 0;
                g < guardPositions.length;
                g++
            ) {

                const distance =
                    Math.sqrt(
                        Math.pow(
                            x -
                            guardPositions[g],
                            2
                        ) +
                        Math.pow(
                            y -
                            guardRows[g],
                            2
                        )
                    );


                if (distance < 100) {

                    validPosition = false;

                    break;
                }
            }


            for (
                const pos of positions
            ) {

                const distance =
                    Math.sqrt(
                        Math.pow(
                            x - pos.x,
                            2
                        ) +
                        Math.pow(
                            y - pos.y,
                            2
                        )
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


        coinsElements[i].style.left =
            x + "px";

        coinsElements[i].style.top =
            y + "px";

        coinsElements[i].style.display =
            "flex";
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


    playerX =
        Math.max(
            10,

            Math.min(
                gameArea.clientWidth -
                player.offsetWidth -
                10,

                playerX
            )
        );


    playerY =
        Math.max(
            35,

            Math.min(
                gameArea.clientHeight -
                player.offsetHeight -
                10,

                playerY
            )
        );


    positionPlayer();
}


/* =====================================================
   KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) return;


        const key =
            event.key.toLowerCase();


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

    }
);


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

    const width =
        gameArea.clientWidth;


    const speed =
        1.8 +
        ((level - 1) * 0.6);


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        guardPositions[i] +=
            speed *
            guardDirections[i];


        if (
            guardPositions[i] <= 20 ||
            guardPositions[i] >=
            width - 70
        ) {

            guardDirections[i] *= -1;
        }
    }


    positionGuards();
}


/* =====================================================
   TABRAKAN KOIN
===================================================== */

function checkCoinCollision() {

    coinsElements.forEach(
        function(coin) {

            if (
                coin.style.display ===
                "none"
            ) {
                return;
            }


            if (
                isColliding(
                    player,
                    coin
                )
            ) {

                coin.style.display =
                    "none";

                coins++;

                /* TAMBAH TOTAL KOIN */
                totalCoins++;

                score += 25;

                updateUI();


                showMessage(
                    "🪙 Koin berhasil dikumpulkan! +25"
                );
            }

        }
    );
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


    for (
        const guard of guards
    ) {

        if (
            isColliding(
                player,
                guard
            )
        ) {

            const now =
                Date.now();


            if (
                now - lastHit >
                1200
            ) {

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
        gameArea.clientWidth / 2 - 24;

    playerY =
        gameArea.clientHeight - 80;


    positionPlayer();
}


/* =====================================================
   CEK KOIN
===================================================== */

function allCoinsCollected() {

    return coinsElements.every(
        coin =>
            coin.style.display ===
            "none"
    );
}


/* =====================================================
   FINISH
===================================================== */

function checkFinish() {

    if (
        playerY <= 45 &&
        allCoinsCollected()
    ) {

        nextLevel();

        return;
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

    if (level >= MAX_LEVEL) {

        score += 100;

        updateUI();

        winGame();

        return;
    }


    level++;

    score += 100;

    coins = 0;


    updateUI();


    levelTimeLeft =
        getLevelTime();


    resetPlayer();


    randomizeCoins();


    const width =
        gameArea.clientWidth;


    guardPositions = [

        Math.random() *
        Math.max(
            100,
            width - 150
        ),

        Math.random() *
        Math.max(
            100,
            width - 150
        ),

        Math.random() *
        Math.max(
            100,
            width - 150
        )

    ];


    guardRows = [

        100 +
        Math.random() * 80,

        260 +
        Math.random() * 100,

        400 +
        Math.random() * 80

    ];


    guardPositions =
        guardPositions.map(
            position =>
                Math.max(
                    20,
                    Math.min(
                        width - 70,
                        position
                    )
                )
        );


    guardRows =
        guardRows.map(
            position =>
                Math.max(
                    70,
                    Math.min(
                        gameArea.clientHeight - 100,
                        position
                    )
                )
        );


    positionGuards();


    randomizeCoins();


    clearInterval(levelTimer);


    levelTimer =
        setInterval(
            function() {

                if (!gameRunning) {
                    return;
                }


                levelTimeLeft--;


                if (
                    levelTimeLeft <= 0
                ) {

                    levelTimeLeft = 0;

                    updateTimerMessage();

                    gameOver();

                    return;
                }


                updateTimerMessage();

            },
            1000
        );


    showMessage(
        "🎉 LEVEL " +
        level +
        "! Penjaga semakin cepat!"
    );
}


/* =====================================================
   MENANG LEVEL 10
===================================================== */

function winGame() {

    gameRunning = false;


    clearInterval(gameTimer);

    clearInterval(levelTimer);

    clearInterval(countdownTimer);


    saveHighScore();


    const titleElement =
        document.getElementById(
            "notificationTitle"
        );

    const messageElement =
        document.getElementById(
            "notificationMessage"
        );

    const iconElement =
        document.getElementById(
            "notificationIcon"
        );

    const thumbnailElement =
        document.getElementById(
            "notificationThumbnail"
        );

    const buttonElement =
        document.querySelector(
            "#notificationPopup .notification-card button"
        );


    titleElement.textContent =
        "MENANG!";


    messageElement.textContent =
        "Selamat! Kamu berhasil menyelesaikan semua 10 level Gobak Sodor dengan skor " +
        score +
        " dan total koin " +
        totalCoins +
        ".";


    iconElement.textContent =
        "🏆";

    thumbnailElement.textContent =
        "🏆";


    if (buttonElement) {

        buttonElement.textContent =
            "KEMBALI KE MENU";

        buttonElement.onclick =
            backToMenu;
    }


    document
        .getElementById(
            "notificationPopup"
        )
        .classList.remove("hidden");
}


/* =====================================================
   TABRAKAN
===================================================== */

function isColliding(a, b) {

    const aRect =
        a.getBoundingClientRect();

    const bRect =
        b.getBoundingClientRect();


    return !(
        aRect.right <
        bRect.left ||

        aRect.left >
        bRect.right ||

        aRect.bottom <
        bRect.top ||

        aRect.top >
        bRect.bottom
    );
}


/* =====================================================
   UPDATE UI
===================================================== */

function updateUI() {

    document.getElementById(
        "lives"
    ).textContent =
        lives;


    document.getElementById(
        "coins"
    ).textContent =
        coins;


    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "level"
    ).textContent =
        level;
}


/* =====================================================
   PESAN DALAM GAME
===================================================== */

let messageTimeout;


function updateTimerMessage() {

    if (!gameRunning) {
        return;
    }


    const messageBox =
        document.getElementById(
            "gameMessage"
        );


    messageBox.textContent =
        "⏱️ Waktu: " +
        levelTimeLeft +
        " detik | Kumpulkan semua koin dan hindari penjaga!";
}


function showMessage(message) {

    const messageBox =
        document.getElementById(
            "gameMessage"
        );


    messageBox.textContent =
        message;


    clearTimeout(
        messageTimeout
    );


    messageTimeout =
        setTimeout(
            function() {

                if (gameRunning) {

                    updateTimerMessage();

                }

            },
            1800
        );
}


/* =====================================================
   GAME OVER
===================================================== */

function gameOver() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearInterval(gameTimer);

    clearInterval(levelTimer);

    clearInterval(countdownTimer);


    saveHighScore();


    document.getElementById(
        "finalScore"
    ).textContent =
        score;


    document.getElementById(
        "finalLevel"
    ).textContent =
        level;


    /* TAMPILKAN TOTAL KOIN */
    const finalCoinsElement =
        document.getElementById(
            "finalCoins"
        );


    if (finalCoinsElement) {

        finalCoinsElement.textContent =
            totalCoins;

    }


    document
        .getElementById(
            "gameOverPopup"
        )
        .classList.remove("hidden");
}


/* =====================================================
   MAIN LAGI
===================================================== */

function playAgain() {

    document
        .getElementById(
            "gameOverPopup"
        )
        .classList.add("hidden");


    startGame();
}


/* =====================================================
   HIGH SCORE
===================================================== */

function saveHighScore() {

    if (!currentUser) return;


    const account =
        accounts.find(
            account =>
                account.username ===
                currentUser.username
        );


    if (!account) return;


    if (
        score >
        (account.highScore || 0)
    ) {

        account.highScore =
            score;


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

    clearInterval(levelTimer);

    clearInterval(countdownTimer);


    startGame();
}


/* =====================================================
   KEMBALI KE MENU
===================================================== */

function backToMenu() {

    gameRunning = false;


    clearInterval(gameTimer);

    clearInterval(levelTimer);

    clearInterval(countdownTimer);


    document
        .getElementById(
            "gameOverPopup"
        )
        .classList.add("hidden");


    closeNotification();


    gamePage.classList.add("hidden");

    menuPage.classList.remove("hidden");
}


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    function() {

        if (!gameRunning) return;


        playerX =
            Math.min(
                playerX,

                gameArea.clientWidth -
                player.offsetWidth -
                10
            );


        positionPlayer();
    }
);
