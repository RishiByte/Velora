let sickomode = document.getElementById("s0");
let fein = document.getElementById("s1");
let BlindingLights = document.getElementById("s2");
let levitate = document.getElementById("s3");
let Peaches = document.getElementById("s4");

let Disc = document.getElementById("disc");

// 🎧 AUDIO FILES
let feinAudio = new Audio("./Songs/Fein.mp3");
let sickomodeAudio = new Audio("./Songs/Sicko.mp3");
let BlindingLightsAudio = new Audio("./Songs/Blinding.mp3");
let levitateAudio = new Audio("./Songs/Levitating.mp3");
let PeachesAudio = new Audio("./Songs/Peaches.mp3");


let progress = document.getElementById("progress");
let currentTimeEl = document.getElementById("currentTime");
let durationEl = document.getElementById("duration");

let currentAudio = null; 

function stopAllSongs() {
    let allSongs = [feinAudio, sickomodeAudio, BlindingLightsAudio, levitateAudio, PeachesAudio];
    allSongs.forEach(song => {
        song.pause();
        song.currentTime = 0;
    });
}

function setupProgressBar() {
    if (!currentAudio) return;

    currentAudio.addEventListener("loadedmetadata", () => {
        progress.max = Math.floor(currentAudio.duration);
        durationEl.textContent = formatTime(currentAudio.duration);
    });

    currentAudio.addEventListener("timeupdate", () => {
        progress.value = Math.floor(currentAudio.currentTime);
        currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    });
}

progress.addEventListener("input", () => {
    if (currentAudio) {
        currentAudio.currentTime = progress.value;
    }
});

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

sickomode.addEventListener("click", function () {
    stopAllSongs();
    sickomodeAudio.play();
    currentAudio = sickomodeAudio;
    Disc.style.backgroundImage = "url('./Images/Sickomode.jpeg')";
    setupProgressBar();
});

fein.addEventListener("click", function () {
    stopAllSongs();
    feinAudio.play();
    currentAudio = feinAudio;
    Disc.style.backgroundImage = "url('./Images/Fein.jpg')";
    setupProgressBar();
});

BlindingLights.addEventListener("click", function () {
    stopAllSongs();
    BlindingLightsAudio.play();
    currentAudio = BlindingLightsAudio;
    Disc.style.backgroundImage = "url('./Images/Blindinglights.jpg')";
    setupProgressBar();
});

levitate.addEventListener("click", function () {
    stopAllSongs();
    levitateAudio.play();
    currentAudio = levitateAudio;
    Disc.style.backgroundImage = "url('./Images/Levitating.jpeg')";
    setupProgressBar();
});

Peaches.addEventListener("click", function () {
    stopAllSongs();
    PeachesAudio.play();
    currentAudio = PeachesAudio;
    Disc.style.backgroundImage = "url('./Images/Peaches.jpeg')";
    setupProgressBar();
});
