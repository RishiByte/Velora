let sickomode = document.getElementById("s0");
let fein = document.getElementById("s1");
let BlindingLights = document.getElementById("s2");
let levitate = document.getElementById("s3");
let Peaches = document.getElementById("s4");

let Disc = document.getElementById("disc");
let prev = document.getElementById("prev");
let play = document.getElementById("play");
let next = document.getElementById("next");

let feinAudio = new Audio("./Songs/Fein.mp3");
let sickomodeAudio = new Audio("./Songs/Sicko.mp3");
let BlindingLightsAudio = new Audio("./Songs/Blinding.mp3");
let levitateAudio = new Audio("./Songs/Levitating.mp3");
let PeachesAudio = new Audio("./Songs/Peaches.mp3");

let progress = document.getElementById("progress");
let currentTimeEl = document.getElementById("currentTime");
let durationEl = document.getElementById("duration");

let currentAudio = null;
let currentIndex = -1;

const tracks = [
  {btn: sickomode, audio: sickomodeAudio, img: "./Images/Sickomode.jpeg", title: "Sicko Mode"},
  {btn: fein, audio: feinAudio, img: "./Images/Fein.jpg", title: "Fein"},
  {btn: BlindingLights, audio: BlindingLightsAudio, img: "./Images/Blindinglights.jpg", title: "Blinding Lights"},
  {btn: levitate, audio: levitateAudio, img: "./Images/Levitating.jpeg", title: "Levitating"},
  {btn: Peaches, audio: PeachesAudio, img: "./Images/Peaches.jpeg", title: "Peaches"}
];

function resetTrackUI() {
  tracks.forEach(t => t.btn.classList && t.btn.classList.remove('active'));
}

function stopAllSongs(keepPosition = false) {
  tracks.forEach(t => {
    try { t.audio.pause(); } catch(e){}
    if (!keepPosition) try { t.audio.currentTime = 0; } catch(e){}
  });
}

function loadTrack(index, autoplay = true) {
  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;

  if (currentIndex === index && currentAudio) {

    if (autoplay) {
      currentAudio.currentTime = 0;
      currentAudio.play();
      updatePlayButton(true);
    }
    return;
  }
  stopAllSongs(false);
  resetTrackUI();

  currentIndex = index;
  currentAudio = tracks[index].audio;

  Disc.style.backgroundImage = `url('${tracks[index].img}')`;
  tracks[index].btn.classList && tracks[index].btn.classList.add('active');

  currentAudio.onloadedmetadata = null;
  currentAudio.ontimeupdate = null;
  currentAudio.onended = null;

  currentAudio.onloadedmetadata = () => {
    if (!isNaN(currentAudio.duration)) {
      progress.max = Math.floor(currentAudio.duration);
      durationEl.textContent = `/ ${formatTime(currentAudio.duration)}`;
    }
  };

  if (!isNaN(currentAudio.duration) && currentAudio.duration > 0) {
    progress.max = Math.floor(currentAudio.duration);
    durationEl.textContent = `/ ${formatTime(currentAudio.duration)}`;
  } else {
    progress.max = 0;
    durationEl.textContent = '/ 0:00';
  }

  currentAudio.ontimeupdate = () => {
    if (!isNaN(currentAudio.currentTime)) {
      progress.value = Math.floor(currentAudio.currentTime);
      currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    }
  };

  currentAudio.onended = () => {
    playNext();
  };

  currentAudio.currentTime = 0;
  if (autoplay) {
    currentAudio.play().then(() => updatePlayButton(true)).catch(() => updatePlayButton(false));
  } else {
    updatePlayButton(false);
  }
}

function updatePlayButton(isPlaying) {
  play.textContent = isPlaying ? '❚❚' : '►';
}

function playToggle() {
  if (!currentAudio) {
    loadTrack(0, true);
    return;
  }
  if (currentAudio.paused) {
    currentAudio.play();
    updatePlayButton(true);
  } else {
    currentAudio.pause();
    updatePlayButton(false);
  }
}

function playPrev() {
  if (currentIndex === -1) loadTrack(tracks.length - 1, true);
  else loadTrack(currentIndex - 1, true);
}

function playNext() {
  if (currentIndex === -1) loadTrack(0, true);
  else loadTrack(currentIndex + 1, true);
}


tracks.forEach((t, idx) => {
  t.btn.addEventListener('click', () => {
    if (currentIndex === idx && currentAudio) {
      playToggle();
    } else {
      loadTrack(idx, true);
    }
  });
});

progress.addEventListener('input', () => {
  if (currentAudio && !isNaN(progress.value)) {
    currentAudio.currentTime = progress.value;
    currentTimeEl.textContent = formatTime(currentAudio.currentTime);
  }
});

play.addEventListener('click', playToggle);
prev.addEventListener('click', playPrev);
next.addEventListener('click', playNext);

function formatTime(time) {
  if (!time || isNaN(time)) return '0:00';
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

progress.min = 0;
progress.step = 1;
progress.value = 0;
progress.max = 0;
currentTimeEl.textContent = '0:00';
durationEl.textContent = '/ 0:00';
updatePlayButton(false);
