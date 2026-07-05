// Koha fillestare në sekonda (01:22:56)
let timeLeft = 5016; 
let timerInterval = null;
let isRunning = false;

// Marrja e elementeve nga HTML
const display = document.getElementById('display');
const btnEdit = document.getElementById('btn-edit');
const btnReset = document.getElementById('btn-reset');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const controlButtons = document.getElementById('control-buttons');
const stopContainer = document.getElementById('stop-container');

// Elementet për Fullscreen
const timerContainer = document.getElementById('timer-container');
const btnFullscreen = document.getElementById('btn-fullscreen');
const btnFullscreenStop = document.getElementById('btn-fullscreen-stop');

// Funksioni për kthimin e sekondave në formatin HH:MM:SS
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hrs.toString().padStart(2, '0'),
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

// Përditësimi i numrave në ekran
function updateDisplay() {
    display.textContent = formatTime(timeLeft);
}

// Menaxhimi i pamjes së butonave gjatë punës së timer-it
function setRunningUI(running) {
    if (running) {
        controlButtons.style.display = 'none'; // Fsheh grupin e parë
        stopContainer.style.display = 'flex';  // Shfaq Stop + Fullscreen e dytë
    } else {
        controlButtons.style.display = 'flex'; // Rikthen grupin e parë
        stopContainer.style.display = 'none';  // Fsheh Stop
    }
}

// Logjika e kontrollit Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        timerContainer.requestFullscreen().catch(err => {
            alert(`Gabim gjatë aktivizimit të Fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Ndërlidhja e dy butonave me funksionin Fullscreen
btnFullscreen.addEventListener('click', toggleFullscreen);
btnFullscreenStop.addEventListener('click', toggleFullscreen);

// Përditësimi i tekstit të butonit dinamikisht
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        btnFullscreen.textContent = "Exit Fullscreen";
        btnFullscreenStop.textContent = "Exit Fullscreen";
    } else {
        btnFullscreen.textContent = "Fullscreen";
        btnFullscreenStop.textContent = "Fullscreen";
    }
});

// Logjika e butonit Start
btnStart.addEventListener('click', () => {
    if (isRunning || timeLeft <= 0) return;
    
    isRunning = true;
    setRunningUI(true); 

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            setRunningUI(false);
            alert("Koha mbaroi!");
        }
    }, 1000);
});

// Logjika e butonit Stop
btnStop.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    setRunningUI(false); 
});

// Logjika e butonit Edit
btnEdit.addEventListener('click', () => {
    const inputTime = prompt("Vendos kohën (Psh. '01:22:56' ose minutat '90'):");
    if (!inputTime) return;

    if (inputTime.includes(':')) {
        const parts = inputTime.split(':');
        if (parts.length === 3) {
            timeLeft = (parseInt(parts[0]) * 3600) + (parseInt(parts[1]) * 60) + parseInt(parts[2]);
        } else if (parts.length === 2) {
            timeLeft = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
        }
    } else {
        timeLeft = parseInt(inputTime) * 60;
    }

    if (isNaN(timeLeft) || timeLeft < 0) {
        alert("Format i gabuar!");
        timeLeft = 0;
    }

    updateDisplay();
});

// Logjika e butonit Reset
btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    setRunningUI(false);
    timeLeft = 5016; 
    updateDisplay();
});

// Shfaqja e kohës fillestare në fillim
updateDisplay();