# Velora 

A lightweight, local music player web app inspired by Spotify. Velora is a static HTML/CSS/JavaScript project for playing a small collection of local songs, searching the catalog, and saving favorites to a local library. This is created by Rishi Bhardwaj as a learning project in his journey.

## Features

- Play / Pause / Previous / Next controls
- Progress bar showing current time and duration; seek by dragging the range input
- Visual indicator for the currently playing song (animated GIF and artwork animation)
- Add current track to a persistent local library (stored in localStorage)
- Search page to quickly find and play songs
- Library page to view, play, and remove saved tracks
- Responsive layout with a sticky sidebar

## Project structure

- index.html — main player and song list
- search.html — simple search UI that links back to index.html to play results
- library.html — saved tracks UI (uses localStorage)
- style.css — application styles and animations
- script.js — player logic: loads tracks, controls playback, updates UI, handles library actions
- /Songs/ — place your .mp3 files here (example filenames used in the project)
- /Images/ — artwork and small GIFs used in the UI (e.g. playing.gif)

## Setup

1. Clone or copy this folder to your machine.
2. Put your audio files into the `Songs/` folder and matching artwork into the `Images/` folder. Filenames used by the example UI:
   - Songs/Fein.mp3
   - Songs/Sicko.mp3
   - Songs/Blinding.mp3
   - Songs/Levitating.mp3
   - Songs/Peaches.mp3
   (You can update `script.js` to add or change tracks.)
3. Run a local static server from the project directory. For example with Python 3:

   python -m http.server 8000

Note: Loading audio files via the file:// protocol can be blocked or behave inconsistently in some browsers; using a local server is recommended.

## Usage

- Home (index.html): click a song to play it, click again to toggle pause/play. Use the Prev/Next buttons to navigate.
- Progress bar: drag to seek. The max of the range is set to the track duration once metadata loads.
- Add to Library: saves the current track to localStorage for quick access later.
- Search: type to filter tracks, click a result to open the player and start that track.
- Library: view saved tracks, play them, or remove them from your library.

## Customization

- Update the tracks list in `script.js` to add more songs or change file paths and artwork.
- Replace or edit `style.css` to change the look and animations.

## Limitations & Notes

- This app is a simple static demo and not a full streaming service.
- Library persistence uses `localStorage` (per-browser on the same device and origin).
- The search page has a minimal client-side search over the included titles. For larger catalogs, replace this with a proper indexed search or backend.

## License

This project is provided as-is for learning and personal use. No license is attached — adapt and reuse as needed.

---

Velora was adapted from a personal project originally named KirishKeGaane. Enjoy.
