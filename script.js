// Koha fillestare në sekonda (01:22:56)
let timeLeft = 5016; 
let timerInterval = null;
let isRunning = false;
let mouseTimeout = null; // Timeout për fshehjen e butonave në Fullscreen

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

function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
}

function requestFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
    if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    }
    if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API is not supported in this browser.'));
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    }
    if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
    }
    if (document.msExitFullscreen) {
        return document.msExitFullscreen();
    }
    return Promise.reject(new Error('Fullscreen API is not supported in this browser.'));
}

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

// Menaxhimi i pamjes së butonave gjatë punës së timer-it (kur nuk jemi në Fullscreen)
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
    const activeElement = getFullscreenElement();
    if (!activeElement) {
        requestFullscreen(timerContainer).catch(err => {
            alert(`Gabim gjatë aktivizimit të Fullscreen: ${err.message}`);
        });
    } else {
        exitFullscreen().catch(err => {
            console.error(err);
        });
    }
}

function updateFullscreenButtons() {
    const isFullscreen = !!getFullscreenElement();
    if (btnFullscreen) {
        btnFullscreen.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
    if (btnFullscreenStop) {
        btnFullscreenStop.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    }
}

// --- LOGJIKA E RE PËR MAUSIN NË FULLSCREEN ---
function handleMouseMoveFullscreen() {
    const isFullscreen = !!getFullscreenElement();
    if (!isFullscreen) return;

    // Shfaq kontejnerët e butonave (duke hequr klasën fshehëse)
    timerContainer.classList.remove('hide-controls-fullscreen');

    // Pastro timeout-in e kaluar që të mos ndërpritet numërimi mbrapsht i 3 sekondave
    clearTimeout(mouseTimeout);

    // Fsheh butonat pas 3 sekondave (3000ms) nëse mausi ndalon së lëvizuri
    mouseTimeout = setTimeout(() => {
        if (!!getFullscreenElement()) {
            timerContainer.classList.add('hide-controls-fullscreen');
        }
    }, 3000);
}

// Dëgjuesi i lëvizjes së mausit
timerContainer.addEventListener('mousemove', handleMouseMoveFullscreen);

// Ndërlidhja e dy butonave me funksionin Fullscreen
if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
}
if (btnFullscreenStop) {
    btnFullscreenStop.addEventListener('click', toggleFullscreen);
}

// Menaxhimi i eventeve të ndryshimit të ekranit (Fullscreen Change)
const handleFullscreenChange = () => {
    if (!getFullscreenElement()) {
        // Nëse dalim nga Fullscreen, pastrojmë efektet e fshehjes automatike
        clearTimeout(mouseTimeout);
        timerContainer.classList.remove('hide-controls-fullscreen');
    }
    updateFullscreenButtons();
};

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

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
updateFullscreenButtons();