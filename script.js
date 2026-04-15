// Global Setup
const pageType = document.body.dataset.page || 'home';
const songsContainer = document.getElementById('songs-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const mainSearchInput = document.getElementById('mainSearchInput');
const addToLibraryBtn = document.getElementById('addToLibrary');

// Player UI updates
const playerArt = document.getElementById('player-art');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playingArt = document.getElementById('playing-art');
const playingTitle = document.getElementById('playing-title');
const playingArtist = document.getElementById('playing-artist');

let activeAudio = new Audio();
let tracks = [];
let currentIndex = -1;

// Library state
let savedLibrary = JSON.parse(localStorage.getItem('vk_full_library') || '[]');

// Generic Fetch from iTunes
async function fetchTracks(query, limit = 24) {
    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`);
        const data = await response.json();
        return data.results ? data.results.filter(t => t.previewUrl) : [];
    } catch(err) {
        console.error("Fetch err:", err);
        return [];
    }
}

// Logic by Page
async function init() {
    if (pageType === 'home') {
        songsContainer.innerHTML = `<div class="loader"><div class="spinner"></div><p>Summoning tracks...</p></div>`;
        
        // Fetch dual sources
        const [naruto, travis] = await Promise.all([
            fetchTracks('naruto', 16),
            fetchTracks('travis scott', 8)
        ]);
        
        // Interleave playfully or just combine
        tracks = [...naruto, ...travis].sort(() => 0.5 - Math.random());
        renderGrid(tracks);
        
        // Home Search Redirect
        if (mainSearchInput) {
            mainSearchInput.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `search.html?q=${encodeURIComponent(e.target.value.trim())}`;
                }
            });

            // Make Search Icon Clickable
            const searchIcon = mainSearchInput.parentElement.querySelector('i');
            if (searchIcon) {
                searchIcon.addEventListener('click', () => {
                    const val = mainSearchInput.value.trim();
                    if (val) {
                        window.location.href = `search.html?q=${encodeURIComponent(val)}`;
                    }
                });
            }
        }
        
    } else if (pageType === 'search') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (query && mainSearchInput) {
            mainSearchInput.value = query;
            songsContainer.innerHTML = `<div class="loader"><div class="spinner"></div><p>Searching...</p></div>`;
            tracks = await fetchTracks(query, 30);
            renderGrid(tracks);
        }

        let debounceTimer;
        mainSearchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value.trim();
            if (!val) {
                songsContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-music"></i><p>Type above to summon tracks</p></div>`;
                return;
            }
            debounceTimer = setTimeout(async () => {
                songsContainer.innerHTML = `<div class="loader"><div class="spinner"></div><p>Searching...</p></div>`;
                tracks = await fetchTracks(val, 30);
                if(tracks.length === 0) {
                    songsContainer.innerHTML = `<div class="empty-state"><p>No jutsu found for this search.</p></div>`;
                } else {
                    renderGrid(tracks);
                }
            }, 600);
        });
        
    } else if (pageType === 'library') {
        tracks = savedLibrary;
        const countEl = document.getElementById('library-count');
        if (countEl) countEl.textContent = `${tracks.length} songs`;
        
        if (tracks.length === 0) {
            songsContainer.innerHTML = `<div class="empty-state"><i class="fa-solid fa-heart-crack"></i><p>Your library is empty.</p></div>`;
        } else {
            renderGrid(tracks);
        }
    } else if (pageType === 'profile') {
        const profileCount = document.getElementById('profile-library-count');
        if (profileCount) profileCount.textContent = savedLibrary.length;
    }
}

function renderGrid(trackList) {
    songsContainer.innerHTML = '';
    
    trackList.forEach((track, index) => {
        const highResArt = track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '300x300bb') : '';
        const card = document.createElement('div');
        card.className = 'song-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="song-img-container">
                <img src="${highResArt}" alt="${track.trackName}">
                <div class="play-overlay"><i class="fa-solid fa-play"></i></div>
            </div>
            <h3>${track.trackName}</h3>
            <p>${track.artistName}</p>
        `;
        
        card.addEventListener('click', () => loadTrack(index));
        songsContainer.appendChild(card);
    });
}

function loadTrack(index) {
    if (index < 0) index = tracks.length - 1;
    if (index >= tracks.length) index = 0;
    
    document.querySelectorAll('.song-card').forEach(c => {
        c.classList.remove('active');
        const icon = c.querySelector('.play-overlay i');
        if(icon) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    });

    const track = tracks[index];
    if (!track || !track.previewUrl) return;

    const highResArt = track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '300x300bb') : '';
    
    const activeCard = document.querySelector(`.song-card[data-index="${index}"]`);
    if(activeCard) {
        activeCard.classList.add('active');
        const icon = activeCard.querySelector('.play-overlay i');
        if(icon) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }
    }
    
    currentIndex = index;
    
    activeAudio.src = track.previewUrl;
    activeAudio.play().then(() => {
        updatePlayBtn(true);
        if(progress) {
             progress.value = 0;
             updateSliderFill();
        }
    }).catch(e => updatePlayBtn(false));
    
    playerTitle.textContent = track.trackName;
    playerArtist.textContent = track.artistName;
    if(playingTitle) playingTitle.textContent = track.trackName;
    if(playingArtist) playingArtist.textContent = track.artistName;
    
    playerArt.style.backgroundImage = `url('${highResArt}')`;
    if(playingArt) {
        playingArt.style.backgroundImage = `url('${highResArt}')`;
        playingArt.innerHTML = '';
    }
    
    checkLibraryStatus(track);
}

function togglePlay() {
    if(currentIndex === -1) {
        if(tracks.length > 0) loadTrack(0);
        return;
    }
    if(activeAudio.paused) {
        activeAudio.play();
        updatePlayBtn(true);
    } else {
        activeAudio.pause();
        updatePlayBtn(false);
    }
}

function updatePlayBtn(isPlaying) {
    const icon = playBtn.querySelector('i');
    const updateIcon = (el, iconClass) => { if(el) el.className = iconClass; };

    if(isPlaying) {
        updateIcon(icon, 'fa-solid fa-pause');
        updateIcon(document.querySelector(`.song-card[data-index="${currentIndex}"] .play-overlay i`), 'fa-solid fa-pause');
    } else {
        updateIcon(icon, 'fa-solid fa-play');
        updateIcon(document.querySelector(`.song-card[data-index="${currentIndex}"] .play-overlay i`), 'fa-solid fa-play');
    }
}

// Audio Events
let isDragging = false;

function updateSliderFill() {
    if (!progress) return;
    const value = progress.value;
    progress.style.background = `linear-gradient(to right, var(--accent-color) ${value}%, #475569 ${value}%)`;
}

function updateProgress() {
    if(!isDragging && !isNaN(activeAudio.duration) && activeAudio.duration > 0) {
        const value = (activeAudio.currentTime / activeAudio.duration) * 100;
        progress.value = value;
        if(currentTimeEl) currentTimeEl.textContent = formatTime(activeAudio.currentTime);
        updateSliderFill();
    }
}

activeAudio.addEventListener('timeupdate', updateProgress);

activeAudio.addEventListener('loadedmetadata', () => {
    if(durationEl) durationEl.textContent = formatTime(activeAudio.duration);
    updateSliderFill();
});

activeAudio.addEventListener('ended', () => loadTrack(currentIndex + 1));

// Controls Events
if(playBtn) playBtn.addEventListener('click', togglePlay);
if(nextBtn) nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1));
if(prevBtn) prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1));

if(progress) {
    // Prevent UI jumping while dragging
    progress.addEventListener('mousedown', () => isDragging = true);
    progress.addEventListener('mouseup', () => isDragging = false);
    progress.addEventListener('touchstart', () => isDragging = true);
    progress.addEventListener('touchend', () => isDragging = false);

    progress.addEventListener('input', () => {
        if(!activeAudio.src || isNaN(activeAudio.duration)) return;
        const seekTime = (progress.value / 100) * activeAudio.duration;
        if(!isNaN(seekTime)) {
            activeAudio.currentTime = seekTime;
            if(currentTimeEl) currentTimeEl.textContent = formatTime(seekTime);
            updateSliderFill();
        }
    });
}

// Library Management
function checkLibraryStatus(track) {
    if(!addToLibraryBtn) return;
    const isSaved = savedLibrary.find(t => t.trackId === track.trackId);
    if(isSaved) {
        addToLibraryBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        addToLibraryBtn.classList.add('added');
    } else {
        addToLibraryBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        addToLibraryBtn.classList.remove('added');
    }
}

if(addToLibraryBtn) {
    addToLibraryBtn.addEventListener('click', () => {
        if(currentIndex === -1) return;
        const track = tracks[currentIndex];
        const existIdx = savedLibrary.findIndex(t => t.trackId === track.trackId);
        
        if (existIdx > -1) {
            // Remove
            savedLibrary.splice(existIdx, 1);
        } else {
            // Add
            savedLibrary.push(track);
        }
        localStorage.setItem('vk_full_library', JSON.stringify(savedLibrary));
        checkLibraryStatus(track);
        
        // Auto remove from screen if on library page
        if(pageType === 'library') {
            tracks = savedLibrary;
            renderGrid(tracks);
            if(currentIndex >= tracks.length) currentIndex = 0; // Prevent out of bounds
            
            const countEl = document.getElementById('library-count');
            if (countEl) countEl.textContent = `${tracks.length} songs`;
        }
    });
}

// Helpers
function formatTime(seconds) {
    if(isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0'+secs : secs}`;
}

// Kickoff
init();
