document.addEventListener("DOMContentLoaded", function () {
    let position = 0;
    let moving = false;
    let interval = null;
    let speed = 5;
    let backwardMove = false;
    let backwardMoveDone = false;

    function showAlert(message, callback, won = false) {
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-box';
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.onclick = function () {
            if (callback) {
                callback();
            }
            alertBox.remove();
        };
        const alertContent = document.createElement('div');
        alertContent.className = 'alert-content';
        alertContent.innerHTML = `<p>${message}</p>`;
        alertContent.appendChild(closeButton);
        alertBox.appendChild(alertContent);
        document.body.appendChild(alertBox);
        if (won) {
            const end = Date.now() + 15 * 1000;
            const colors = ['#bb0000', '#ffffff', "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors,
                    zIndex: 3,
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors,
                    zIndex: 3,
                });
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }
    }

    document.getElementById("playButton").addEventListener("click", function () {
        const gameMode = document.getElementById("gameMode").value;
        backwardMove = false;
        backwardMoveDone = false;
        if (gameMode === 'easy') {
            speed = Math.random() * 50 + 10;
        } else if (gameMode === 'normal') {
            speed = Math.random() * 85 + 10;
        } else {
            speed = Math.random() * 95 + 10;
            backwardMove = true;
        }

        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
    });

    const train = document.querySelector('.train');

    function moveTrain() {
        train.classList.add('smooth');
        if (backwardMove && position > 300 && !backwardMoveDone) {
            speed = -100;
            backwardMoveDone = true;
        } else {
            speed = Math.abs(speed);
        }
        position += speed;
        train.style.left = `${position}px`;
        if (position >= window.innerWidth - 100) {
            clearInterval(interval);
            moving = false;
            showAlert(`You lost. The train went past the station.`, function () {
                location.reload();
            });
        }
    }

    document.getElementById("startButton").addEventListener("click", function () {
        if (!moving) {
            moving = true;
            interval = setInterval(moveTrain, 50);
        }
    });

    function stopTrain() {
        train.classList.remove('smooth');
        if (moving) {
            clearInterval(interval);
            moving = false;
            if (position >= window.innerWidth - 200 && position <= window.innerWidth - 100) {
                showAlert("You won. The train stopped at the station.", function () {
                    location.reload();
                }, true);
            } else {
                showAlert("You lost. The train did not stop at the station.");
            }
        }
    }

    document.getElementById("stopButton").addEventListener("click", stopTrain);

    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            stopTrain();
        }
    });
});
