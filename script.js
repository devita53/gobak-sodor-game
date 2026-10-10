// ==========================================
// ELEMENT
// ==========================================

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const menuPage =
    document.getElementById("menuPage");

const gamePage =
    document.getElementById("gamePage");


// LOGIN

const loginForm =
    document.getElementById("loginForm");

const loginUsername =
    document.getElementById("loginUsername");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");


// REGISTER

const registerForm =
    document.getElementById("registerForm");

const registerUsername =
    document.getElementById("registerUsername");

const registerPassword =
    document.getElementById("registerPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

const registerMessage =
    document.getElementById("registerMessage");


// MENU

const menuUsername =
    document.getElementById("menuUsername");

const playButton =
    document.getElementById("playButton");

const logoutButton =
    document.getElementById("logoutButton");

const howToPlayButton =
    document.getElementById("howToPlayButton");

const howToPlay =
    document.getElementById("howToPlay");


// GAME

const gameUsername =
    document.getElementById("gameUsername");

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

const obstacle1 =
    document.getElementById("obstacle1");

const obstacle2 =
    document.getElementById("obstacle2");

const coin1 =
    document.getElementById("coin1");

const coin2 =
    document.getElementById("coin2");

const coin3 =
    document.getElementById("coin3");

const scoreText =
    document.getElementById("score");

const coinsText =
    document.getElementById("coins");

const livesText =
    document.getElementById("lives");

const levelText =
    document.getElementById("level");

const gameMessage =
    document.getElementById("gameMessage");

const restartButton =
    document.getElementById("restartButton");

const backMenuButton =
    document.getElementById("backMenuButton");


// ==========================================
// AKUN
// ==========================================

function getAccounts() {

    const data =
        localStorage.getItem("gobakAccounts");

    return data
        ? JSON.parse(data)
        : [];

}


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const username =
            registerUsername.value.trim();

        const password =
            registerPassword.value;

        const confirm =
            confirmPassword.value;


        if (username.length < 3) {

            registerMessage.textContent =
                "Username minimal 3 karakter.";

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


        const accounts =
            getAccounts();


        const exists =
            accounts.some(
                account =>
                    account.username.toLowerCase() ===
                    username.toLowerCase()
            );


        if (exists) {

            registerMessage.textContent =
                "Username sudah digunakan.";

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


        registerMessage.style.color =
            "#159957";

        registerMessage.textContent =
            "Akun berhasil dibuat!";


        setTimeout(function() {

            registerPage.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );

            registerMessage.style.color =
                "#d63031";

        }, 900);

    }
);


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const username =
            loginUsername.value.trim();

        const password =
            loginPassword.value;


        const accounts =
            getAccounts();


        const account =
            accounts.find(

                acc =>

                    acc.username.toLowerCase() ===
                    username.toLowerCase() &&

                    acc.password ===
                    password

            );


        if (!account) {

            loginMessage.textContent =
                "Username atau password salah.";

            return;
        }


        localStorage.setItem(
            "currentUser",
            account.username
        );


        loginForm.reset();

        showMenu(account.username);

    }
);


// ==========================================
// MENU
// ==========================================

function showMenu(username) {

    loginPage.classList.add("hidden");

    registerPage.classList.add("hidden");

    gamePage.classList.add("hidden");

    menuPage.classList.remove("hidden");


    menuUsername.textContent =
        username;

    gameUsername.textContent =
        username;

}


// ==========================================
// REGISTER / LOGIN
// ==========================================

document
    .getElementById("showRegister")
    .addEventListener(
        "click",
        function() {

            loginPage.classList.add(
                "hidden"
            );

            registerPage.classList.remove(
                "hidden"
            );

        }
    );


document
    .getElementById("showLogin")
    .addEventListener(
        "click",
        function() {

            registerPage.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );

        }
    );


// ==========================================
// CARA BERMAIN
// ==========================================

howToPlayButton.addEventListener(
    "click",
    function() {

        howToPlay.classList.toggle(
            "hidden"
        );

    }
);


// ==========================================
// DATA GAME
// ==========================================

let playerX;

let playerY;

let score;

let coins;

let lives;

let level;

let gameRunning;

let timer;

let lastHit = 0;


// POSISI PENJAGA

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


// ==========================================
// START GAME
// ==========================================

playButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    menuPage.classList.add(
        "hidden"
    );

    gamePage.classList.remove(
        "hidden"
    );


    score = 0;

    coins = 0;

    lives = 5;

    level = 1;

    gameRunning = true;


    gameUsername.textContent =
        localStorage.getItem(
            "currentUser"
        );


    playerX = 20;

    playerY =
        gameArea.clientHeight - 70;


    guardPositions = [
        80,
        300,
        500
    ];


    guardDirections = [
        1,
        -1,
        1
    ];


    setInitialPositions();

    updatePlayer();

    updateStatus();

    resetCoins();


    gameMessage.textContent =
        "Lewati 3 penjaga dan ambil koin!";


    clearInterval(timer);


    timer = setInterval(
        gameLoop,
        40
    );

}


// ==========================================
// POSISI AWAL
// ==========================================

function setInitialPositions() {

    guard1.style.left =
        "80px";

    guard1.style.top =
        "90px";


    guard2.style.left =
        "300px";

    guard2.style.top =
        "230px";


    guard3.style.left =
        "500px";

    guard3.style.top =
        "370px";


    obstacle1.style.left =
        "180px";

    obstacle1.style.top =
        "150px";


    obstacle2.style.left =
        "400px";

    obstacle2.style.top =
        "300px";

}


// ==========================================
// PEMAIN
// ==========================================

function updatePlayer() {

    player.style.left =
        playerX + "px";

    player.style.top =
        playerY + "px";

}


// ==========================================
// STATUS
// ==========================================

function updateStatus() {

    scoreText.textContent =
        score;

    coinsText.textContent =
        coins;

    livesText.textContent =
        lives;

    levelText.textContent =
        level;

}


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning)
            return;


        if (
            [
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
            ].includes(event.key)
        ) {

            event.preventDefault();

            movePlayer(event.key);

        }

    }
);


// ==========================================
// TOMBOL HP
// ==========================================

document
    .querySelectorAll(
        ".controls button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    movePlayer(
                        button.dataset.key
                    );

                }
            );

        }
    );


// ==========================================
// GERAK PEMAIN
// ==========================================

function movePlayer(key) {

    if (!gameRunning)
        return;


    const step = 20;


    if (
        key === "ArrowUp" ||
        key === "w" ||
        key === "W"
    )
        playerY -= step;


    if (
        key === "ArrowDown" ||
        key === "s" ||
        key === "S"
    )
        playerY += step;


    if (
        key === "ArrowLeft" ||
        key === "a" ||
        key === "A"
    )
        playerX -= step;


    if (
        key === "ArrowRight" ||
        key === "d" ||
        key === "D"
    )
        playerX += step;


    limitPlayer();

    updatePlayer();

}


// ==========================================
// BATAS PEMAIN
// ==========================================

function limitPlayer() {

    playerX =
        Math.max(
            0,
            Math.min(
                playerX,
                gameArea.clientWidth -
                player.offsetWidth
            )
        );


    playerY =
        Math.max(
            0,
            Math.min(
                playerY,
                gameArea.clientHeight -
                player.offsetHeight
            )
        );

}


// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    if (!gameRunning)
        return;


    moveGuards();

    checkCollision();

    checkCoins();

    checkFinish();

}


// ==========================================
// PENJAGA
// ==========================================

function moveGuards() {

    const speed =
        1.8 +
        (level - 1) * 0.6;


    const guards = [
        guard1,
        guard2,
        guard3
    ];


    guards.forEach(
        (guard, index) => {

            guardPositions[index] +=
                guardDirections[index] *
                speed;


            const max =
                gameArea.clientWidth -
                guard.offsetWidth;


            if (
                guardPositions[index] <= 0 ||
                guardPositions[index] >= max
            ) {

                guardDirections[index] *= -1;

            }


            guard.style.left =
                guardPositions[index] +
                "px";

        }
    );

}


// ==========================================
// TABRAKAN
// ==========================================

function checkCollision() {

    const playerRect =
        player.getBoundingClientRect();


    const objects = [

        guard1,

        guard2,

        guard3,

        obstacle1,

        obstacle2

    ];


    for (
        const object of objects
    ) {

        if (
            collision(
                playerRect,
                object.getBoundingClientRect()
            )
        ) {

            loseLife();

            return;

        }

    }

}


// ==========================================
// COLLISION
// ==========================================

function collision(a, b) {

    return (

        a.left < b.right &&

        a.right > b.left &&

        a.top < b.bottom &&

        a.bottom > b.top

    );

}


// ==========================================
// KEHILANGAN NYAWA
// ==========================================

function loseLife() {

    if (
        Date.now() - lastHit <
        1000
    )
        return;


    lastHit =
        Date.now();


    lives--;


    updateStatus();


    if (lives <= 0) {

        gameOver();

        return;

    }


    gameMessage.textContent =
        "💥 Aduh! Nyawa tersisa: " +
        lives;


    resetPlayer();

}


// ==========================================
// RESET PLAYER
// ==========================================

function resetPlayer() {

    playerX = 20;

    playerY =
        gameArea.clientHeight - 70;


    updatePlayer();

}


// ==========================================
// KOIN
// ==========================================

function resetCoins() {

    const maxX =
        gameArea.clientWidth - 50;


    coin1.style.left =
        Math.min(120, maxX) + "px";

    coin1.style.top =
        "140px";


    coin2.style.left =
        Math.min(350, maxX) + "px";

    coin2.style.top =
        "270px";


    coin3.style.left =
        Math.min(500, maxX) + "px";

    coin3.style.top =
        "420px";


    coin1.style.display =
        "flex";

    coin2.style.display =
        "flex";

    coin3.style.display =
        "flex";

}


// ==========================================
// AMBIL KOIN
// ==========================================

function checkCoins() {

    const playerRect =
        player.getBoundingClientRect();


    const coinElements = [

        coin1,
        coin2,
        coin3

    ];


    coinElements.forEach(
        coin => {

            if (
                coin.style.display ===
                "none"
            )
                return;


            if (
                collision(
                    playerRect,
                    coin.getBoundingClientRect()
                )
            ) {

                coin.style.display =
                    "none";


                coins++;

                score += 25;


                updateStatus();


                gameMessage.textContent =
                    "🪙 Koin didapat! +25 skor";

            }

        }
    );

}


// ==========================================
// FINISH
// ==========================================

function checkFinish() {

    if (playerY <= 10) {

        score +=
            100 * level;


        level++;


        updateStatus();


        resetPlayer();

        resetCoins();


        gameMessage.textContent =
            "🎉 Level naik! Sekarang Level " +
            level +
            "!";

    }

}


// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

    gameRunning = false;

    clearInterval(timer);


    saveHighScore();


    gameMessage.innerHTML =
        "💀 GAME OVER<br>" +
        "⭐ Skor: " +
        score +
        "<br>🏆 Level: " +
        level;

}


// ==========================================
// HIGH SCORE
// ==========================================

function saveHighScore() {

    const currentUser =
        localStorage.getItem(
            "currentUser"
        );


    if (!currentUser)
        return;


    const accounts =
        getAccounts();


    const account =
        accounts.find(
            acc =>
                acc.username ===
                currentUser
        );


    if (!account)
        return;


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


// ==========================================
// RESTART
// ==========================================

restartButton.addEventListener(
    "click",
    startGame
);


// ==========================================
// MENU
// ==========================================

backMenuButton.addEventListener(
    "click",
    function() {

        clearInterval(timer);

        gameRunning = false;

        gamePage.classList.add(
            "hidden"
        );

        menuPage.classList.remove(
            "hidden"
        );

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    function() {

        clearInterval(timer);

        gameRunning = false;


        localStorage.removeItem(
            "currentUser"
        );


        menuPage.classList.add(
            "hidden"
        );

        gamePage.classList.add(
            "hidden"
        );

        loginPage.classList.remove(
            "hidden"
        );

    }
);
