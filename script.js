// Koha fillestare e vendosur në sekonda (01:22:56)
let timeLeft = 5016; 
let timerInterval = null;
let isRunning = false;

// Marrja e elementeve nga HTML
const display = document.getElementById('display');
const btnEdit = document.getElementById('btn-edit');
const btnReset = document.getElementById('btn-reset');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');

// Kthimi i sekondave në formatin HH:MM:SS
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

// Logjika e butonit Start
btnStart.addEventListener('click', () => {
    if (isRunning || timeLeft <= 0) return;
    
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert("Koha mbaroi!");
        }
    }, 1000);
});

// Logjika e butonit Stop
btnStop.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

// Logjika e butonit Edit (ndryshimi i kohës me prompt)
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

// Logjika e butonit Reset (e kthen në kohën fillestare)
btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 5016; 
    updateDisplay();
});

// Shfaqja e kohës sapo hapet faqja
updateDisplay();