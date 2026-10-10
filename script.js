/* =========================================================
   GOBAK SODOR GAME
   SISTEM NOTIFIKASI GAME SENDIRI
========================================================= */


/* ================= AKUN ================= */

let accounts =
    JSON.parse(
        localStorage.getItem("gobakAccounts") || "[]"
    );

let currentUser = null;


/* ================= HALAMAN ================= */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    const page =
        document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }
}


/* =========================================================
   NOTIFIKASI GAME
========================================================= */

function showGameNotification(
    message,
    title = "Informasi",
    icon = "⚠️"
) {

    const overlay =
        document.getElementById("gameNotification");

    const titleElement =
        document.getElementById("notificationTitle");

    const messageElement =
        document.getElementById("notificationMessage");

    const iconElement =
        document.getElementById("notificationIcon");


    titleElement.textContent = title;

    messageElement.textContent = message;

    iconElement.textContent = icon;


    overlay.classList.add("show");
}


function closeGameNotification() {

    const overlay =
        document.getElementById("gameNotification");

    overlay.classList.remove("show");
}


/* =========================================================
   LOGIN
========================================================= */

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


    /* DATA TIDAK LENGKAP */

    if (username === "" || password === "") {

        showGameNotification(
            "Silakan isi username dan password terlebih dahulu.",
            "Data tidak lengkap",
            "❌"
        );

        return;
    }


    /* CARI USERNAME */

    const account =
        accounts.find(
            user =>
                user.username === username
        );


    /* USERNAME SALAH */

    if (!account) {

        showGameNotification(
            "Username yang kamu masukkan tidak ditemukan.",
            "Username salah",
            "❌"
        );

        return;
    }


    /* PASSWORD SALAH */

    if (account.password !== password) {

        showGameNotification(
            "Password yang kamu masukkan salah.",
            "Password salah",
            "❌"
        );

        return;
    }


    /* LOGIN BERHASIL */

    currentUser = account;

    document
        .getElementById("menuUsername")
        .textContent = username;


    document
        .getElementById("loginUsername")
        .value = "";

    document
        .getElementById("loginPassword")
        .value = "";


    showPage("menuPage");
}


/* =========================================================
   REGISTER
========================================================= */

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


    /* DATA TIDAK LENGKAP */

    if (username === "" || password === "") {

        showGameNotification(
            "Username dan password wajib diisi.",
            "Data tidak lengkap",
            "❌"
        );

        return;
    }


    /* CEK AKUN */

    const existingAccount =
        accounts.find(
            user =>
                user.username === username
        );


    /* AKUN SUDAH ADA */

    if (existingAccount) {

        showGameNotification(
            "Username tersebut sudah digunakan. Silakan gunakan username lain.",
            "Akun sudah ada",
            "❌"
        );

        return;
    }


    /* SIMPAN AKUN */

    accounts.push({
        username: username,
        password: password
    });


    localStorage.setItem(
        "gobakAccounts",
        JSON.stringify(accounts)
    );


    /* KOSONGKAN FORM */

    document
        .getElementById("registerUsername")
        .value = "";

    document
        .getElementById("registerPassword")
        .value = "";


    /* PESAN BERHASIL */

    showGameNotification(
        "Akun berhasil dibuat. Silakan login menggunakan akun tersebut.",
        "Pendaftaran berhasil",
        "✅"
    );


    /*
       Setelah tombol OKE ditekan,
       pemain tetap berada di halaman daftar.
    */

}


/* ================= PINDAH LOGIN ================= */

function showLogin() {

    showPage("loginPage");
}


function showRegister() {

    showPage("registerPage");
}


/* ================= LOGOUT ================= */

function logout() {

    currentUser = null;

    showPage("loginPage");


    showGameNotification(
        "Kamu telah keluar dari akun.",
        "Peringatan",
        "⚠️"
    );
}


/* =========================================================
   GAME
========================================================= */

let lives = 5;

let level = 1;

let score = 0;

let coinsCollected = 0;

let playerX = 30;

let playerY = 420;

let guardPositions = [
    { x: 220, y: 80 },
    { x: 450, y: 220 },
    { x: 650, y: 350 }
];

let coinPositions = [
    { x: 150, y: 100 },
    { x: 350, y: 180 },
    { x: 550, y: 300 },
    { x: 750, y: 400 }
];

let gameRunning = false;

let guardTimer;


/* =========================================================
   MULAI GAME
========================================================= */

function startGame() {

    lives = 5;

    level = 1;

    score = 0;

    coinsCollected = 0;

    gameRunning = true;


    updateStats();

    showPage("gamePage");


    setPlayerPosition();

    randomizeCoins();

    randomizeGuards();


    clearInterval(guardTimer);

    guardTimer =
        setInterval(
            moveGuards,
            700
        );


    showGameNotification(
        "Kumpulkan semua koin dan hindari 3 penjaga!",
        "Pesan Game",
        "🎮"
    );
}


/* =========================================================
   UPDATE STAT
========================================================= */

function updateStats() {

    document
        .getElementById("lives")
        .textContent = lives;

    document
        .getElementById("coins")
        .textContent = coinsCollected;

    document
        .getElementById("score")
        .textContent = score;

    document
        .getElementById("level")
        .textContent = level;
}


/* =========================================================
   POSISI PLAYER
========================================================= */

function setPlayerPosition() {

    const player =
        document.getElementById("player");

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";
}


/* =========================================================
   GERAK PLAYER
========================================================= */

function movePlayer(direction) {

    if (!gameRunning) {
        return;
    }


    const step = 20;


    if (direction === "up") {

        playerY -= step;

    }

    if (direction === "down") {

        playerY += step;

    }

    if (direction === "left") {

        playerX -= step;

    }

    if (direction === "right") {

        playerX += step;

    }


    /* BATAS ARENA */

    const gameArea =
        document.getElementById("gameArea");

    const maxX =
        gameArea.clientWidth - 50;

    const maxY =
        gameArea.clientHeight - 75;


    if (playerX < 5) {
        playerX = 5;
    }

    if (playerY < 5) {
        playerY = 5;
    }

    if (playerX > maxX) {
        playerX = maxX;
    }

    if (playerY > maxY) {
        playerY = maxY;
    }


    setPlayerPosition();

    checkCoins();

    checkGuardCollision();

    checkFinish();
}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }


        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {

            movePlayer("up");

        }


        else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            movePlayer("down");

        }


        else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            movePlayer("left");

        }


        else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            movePlayer("right");

        }

    }
);


/* =========================================================
   RANDOM KOIN
========================================================= */

function randomizeCoins() {

    const gameArea =
        document.getElementById("gameArea");

    const width =
        gameArea.clientWidth;

    const height =
        gameArea.clientHeight;


    coinPositions = [];


    for (let i = 1; i <= 4; i++) {

        const x =
            Math.floor(
                Math.random() *
                (width - 80)
            ) + 40;

        const y =
            Math.floor(
                Math.random() *
                (height - 100)
            ) + 40;


        coinPositions.push({
            x: x,
            y: y
        });


        const coin =
            document.getElementById(
                "coin" + i
            );

        coin.style.left =
            x + "px";

        coin.style.top =
            y + "px";

        coin.style.display =
            "flex";
    }
}


/* =========================================================
   CEK KOIN
========================================================= */

function checkCoins() {

    const player =
        document.getElementById("player");

    const playerRect =
        player.getBoundingClientRect();


    for (let i = 1; i <= 4; i++) {

        const coin =
            document.getElementById(
                "coin" + i
            );


        if (
            coin.style.display === "none"
        ) {
            continue;
        }


        const coinRect =
            coin.getBoundingClientRect();


        if (
            playerRect.left <
                coinRect.right &&
            playerRect.right >
                coinRect.left &&
            playerRect.top <
                coinRect.bottom &&
            playerRect.bottom >
                coinRect.top
        ) {

            coin.style.display =
                "none";

            coinsCollected++;

            score += 25;

            updateStats();


            showGameNotification(
                "Kamu mendapatkan 1 koin! +25 poin.",
                "Pesan Game",
                "🪙"
            );
        }

    }
}


/* =========================================================
   RANDOM PENJAGA
========================================================= */

function randomizeGuards() {

    const gameArea =
        document.getElementById("gameArea");

    const width =
        gameArea.clientWidth;

    const height =
        gameArea.clientHeight;


    for (let i = 1; i <= 3; i++) {

        const x =
            Math.floor(
                Math.random() *
                (width - 100)
            ) + 50;

        const y =
            Math.floor(
                Math.random() *
                (height - 120)
            ) + 60;


        guardPositions[i - 1] = {
            x: x,
            y: y
        };


        const guard =
            document.getElementById(
                "guard" + i
            );


        guard.style.left =
            x + "px";

        guard.style.top =
            y + "px";
    }
}


/* =========================================================
   GERAK PENJAGA
========================================================= */

function moveGuards() {

    if (!gameRunning) {
        return;
    }


    const gameArea =
        document.getElementById("gameArea");


    const width =
        gameArea.clientWidth;

    const height =
        gameArea.clientHeight;


    for (let i = 0; i < 3; i++) {

        let guard =
            guardPositions[i];


        const speed =
            10 + (level * 2);


        const dx =
            playerX - guard.x;

        const dy =
            playerY - guard.y;


        if (Math.abs(dx) > 5) {

            guard.x +=
                dx > 0
                    ? speed
                    : -speed;
        }


        if (Math.abs(dy) > 5) {

            guard.y +=
                dy > 0
                    ? speed
                    : -speed;
        }


        if (guard.x < 5) {
            guard.x = 5;
        }

        if (guard.y < 5) {
            guard.y = 5;
        }

        if (guard.x > width - 60) {
            guard.x = width - 60;
        }

        if (guard.y > height - 90) {
            guard.y = height - 90;
        }


        const guardElement =
            document.getElementById(
                "guard" + (i + 1)
            );


        guardElement.style.left =
            guard.x + "px";

        guardElement.style.top =
            guard.y + "px";
    }


    checkGuardCollision();
}


/* =========================================================
   TABRAKAN PENJAGA
========================================================= */

function checkGuardCollision() {

    if (!gameRunning) {
        return;
    }


    const player =
        document.getElementById("player");

    const playerRect =
        player.getBoundingClientRect();


    for (let i = 1; i <= 3; i++) {

        const guard =
            document.getElementById(
                "guard" + i
            );


        const guardRect =
            guard.getBoundingClientRect();


        if (
            playerRect.left <
                guardRect.right &&
            playerRect.right >
                guardRect.left &&
            playerRect.top <
                guardRect.bottom &&
            playerRect.bottom >
                guardRect.top
        ) {

            loseLife();

            return;
        }
    }
}


/* =========================================================
   KEHILANGAN NYAWA
========================================================= */

function loseLife() {

    lives--;

    updateStats();


    if (lives <= 0) {

        gameOver();

        return;
    }


    playerX = 30;

    playerY = 420;

    setPlayerPosition();


    showGameNotification(
        "Kamu tertangkap penjaga! Sisa nyawa: " + lives,
        "Peringatan",
        "⚠️"
    );
}


/* =========================================================
   FINISH / NAIK LEVEL
========================================================= */

function checkFinish() {

    const gameArea =
        document.getElementById("gameArea");


    /*
       Jika pemain sampai bagian
       atas arena dan semua koin
       sudah dikumpulkan.
    */

    if (
        playerY <= 15 &&
        coinsCollected >= 4
    ) {

        nextLevel();
    }

}


/* =========================================================
   LEVEL BERIKUTNYA
========================================================= */

function nextLevel() {

    level++;

    score += 100;

    coinsCollected = 0;


    playerX = 30;

    playerY = 420;


    setPlayerPosition();


    randomizeCoins();

    randomizeGuards();

    updateStats();


    showGameNotification(
        "Hebat! Kamu berhasil melewati level sebelumnya. Level " +
        level +
        " dimulai dengan penjaga yang lebih cepat!",
        "Level Berikutnya",
        "🎮"
    );
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    gameRunning = false;

    clearInterval(guardTimer);


    const gameOver =
        document.getElementById("gameOver");

    const message =
        document.getElementById(
            "gameOverMessage"
        );


    message.textContent =
        "Permainan selesai! Skor kamu: " +
        score +
        " | Level: " +
        level;


    gameOver.classList.add("show");
}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    document
        .getElementById("gameOver")
        .classList.remove("show");


    startGame();
}


/* =========================================================
   KEMBALI MENU
========================================================= */

function backToMenu() {

    gameRunning = false;

    clearInterval(guardTimer);


    document
        .getElementById("gameOver")
        .classList.remove("show");


    showPage("menuPage");
}
