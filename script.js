let sickomode = document.getElementById("s0");
let fein = document.getElementById("s1");
let BlindingLights = document.getElementById("s2");
let levitate = document.getElementById("s3");
let Peaches = document.getElementById("s4");
let Bargad = document.getElementById("s5");
let Rakhlo = document.getElementById("s6");
let DieForYou = document.getElementById("s7");
let Sunflower = document.getElementById("s8");
let Husn = document.getElementById("s9");
let IsThereSomeoneElse = document.getElementById("s10");
let CO2 = document.getElementById("s11");

let Disc = document.getElementById("disc");
let prev = document.getElementById("prev");
let play = document.getElementById("play");
let next = document.getElementById("next");

let addToLibraryBtn = document.getElementById('addToLibrary');

let feinAudio = new Audio("./Songs/Fein.mp3");
let sickomodeAudio = new Audio("./Songs/Sicko.mp3");
let BlindingLightsAudio = new Audio("./Songs/Blinding.mp3");
let levitateAudio = new Audio("./Songs/Levitating.mp3");
let PeachesAudio = new Audio("./Songs/Peaches.mp3");
let CO2Audio = new Audio("./Songs/Co2.mp3");
let BargadAudio = new Audio("./Songs/Bargad.mp3");
let RakhloAudio = new Audio("./Songs/Rakhlo Tum Chupaake.mp3");
let DieForYouAudio = new Audio("./Songs/Die.mp3");
let SunflowerAudio = new Audio("./Songs/Sunflower.mp3");
let HusnAudio = new Audio("./Songs/Husn.mp3");
let IsThereSomeoneElseAudio = new Audio("./Songs/isthere.mp3");

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
  ,{btn: CO2, audio: CO2Audio, img: "./Images/Co2.jpeg", title: "CO2"}
  ,{btn: Bargad, audio: BargadAudio, img: "./Images/Bargad.jpg", title: "Bargad"}
  ,{btn: Rakhlo, audio: RakhloAudio, img: "./Images/Rakhlo Tum Chupake.png", title: "Rakhlo Tum Chupake"}
  ,{btn: DieForYou, audio: DieForYouAudio, img: "./Images/Die.png", title: "Die for you"}
  ,{btn: Sunflower, audio: SunflowerAudio, img: "./Images/Sunflower.jpg", title: "Sunflower"}
  ,{btn: Husn, audio: HusnAudio, img: "./Images/Husn.png", title: "Husn"}
  ,{btn: IsThereSomeoneElse, audio: IsThereSomeoneElseAudio, img: "./Images/isthere.jpg", title: "Is there someone else?"}
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

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const playParam = getQueryParam('play');
if (playParam) {
  const idx = parseInt(playParam, 10);
  if (!isNaN(idx) && idx >= 0 && idx < tracks.length) {

    setTimeout(() => loadTrack(idx, true), 200);
  }
}

window.playTrackIndex = (idx) => {
  if (typeof idx === 'number') loadTrack(idx, true);
};

if (addToLibraryBtn) {
  addToLibraryBtn.addEventListener('click', () => {
    if (currentIndex === -1) return;
    const library = JSON.parse(localStorage.getItem('vk_library') || '[]');
    const item = { index: currentIndex, title: tracks[currentIndex].title, img: tracks[currentIndex].img };
    if (!library.find(l => l.index === item.index)) {
      library.push(item);
      localStorage.setItem('vk_library', JSON.stringify(library));
      addToLibraryBtn.textContent = '✓ Added';
      setTimeout(() => addToLibraryBtn.textContent = '+ Library', 1400);
    }
  });
}

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
