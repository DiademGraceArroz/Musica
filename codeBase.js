import { musicData } from "./musicData.js";
import { euclideanDistance } from "./euclideanDistance.js";

// DOM Elements
const classifyButton = document.getElementById("classifyButton");
const clearButton = document.getElementById("clearButton");

// Initialize page navigation
function setupNavigation() {
  // Simple page navigation
  function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('[id$="-page"]').forEach((page) => {
      page.classList.add("hidden-page");
    });

    // Show selected page
    document.getElementById(`${pageId}-page`).classList.remove("hidden-page");

    // Scroll to top
    window.scrollTo(0, 0);
  }

  // Set up navigation links
  document.querySelectorAll('[onclick^="showPage"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = link
        .getAttribute("onclick")
        .match(/showPage\('(.+)'\)/)[1];
      showPage(pageId);
    });
  });

  // Show home page by default
  showPage("home");
}

// Classification function
function classify() {
  const songTitle = document.getElementById("title").value.trim().toLowerCase();
  const songArtist = document
    .getElementById("artist")
    .value.trim()
    .toLowerCase();

  // Reset error messages
  document.getElementById("title-error").classList.add("hidden");
  document.getElementById("artist-error").classList.add("hidden");

  let hasError = false;

  // Validation
  if (!songTitle) {
    document.getElementById("title-error").classList.remove("hidden");
    hasError = true;
  }
  if (!songArtist) {
    document.getElementById("artist-error").classList.remove("hidden");
    hasError = true;
  }
  if (hasError) return;

  // Search for song in dataset
  const songIndex = musicData.findIndex(
    (song) =>
      song.title.toLowerCase() === songTitle &&
      song.artist.toLowerCase() === songArtist
  );

  let songFeatures = [];

  // If song found, get features
  if (songIndex !== -1) {
    songFeatures = musicData[songIndex].features;

    document.getElementById("result-tempo").innerText = songFeatures[0];
    document.getElementById("result-energy").innerText = songFeatures[1];
    document.getElementById("result-danceability").innerText = songFeatures[2];
  } else {
    document.getElementById("result-tempo").innerText = "--";
    document.getElementById("result-energy").innerText = "--";
    document.getElementById("result-danceability").innerText = "--";
    document.getElementById("result-genre").innerText = "Song not found ❌";
    return;
  }

  // KNN Classification
  let k = 25;
  let nearestNeighbors = [];

  for (let i = 0; i < musicData.length; i++) {
    if (i === songIndex) continue;
    const distance = euclideanDistance(songFeatures, musicData[i].features);
    nearestNeighbors.push({ index: i, distance: distance });
  }
  nearestNeighbors.sort((a, b) => a.distance - b.distance);

  const kNearestNeighbors = nearestNeighbors.slice(0, k);
  const genreCounts = {};

  for (let i = 0; i < kNearestNeighbors.length; i++) {
    const genre = musicData[kNearestNeighbors[i].index].genre;
    genreCounts[genre] = genreCounts[genre] ? genreCounts[genre] + 1 : 1;
  }

  let maxCount = 0;
  let maxGenre = null;

  for (const genre in genreCounts) {
    if (genreCounts[genre] > maxCount) {
      maxCount = genreCounts[genre];
      maxGenre = genre;
    }
  }

  document.getElementById("result-genre").innerText = maxGenre;
}

// Clear inputs function
function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("artist").value = "";

  // Hide errors
  document.getElementById("title-error").classList.add("hidden");
  document.getElementById("artist-error").classList.add("hidden");

  // Clear results
  document.getElementById("result-tempo").innerText = "--";
  document.getElementById("result-energy").innerText = "--";
  document.getElementById("result-danceability").innerText = "--";
  document.getElementById("result-genre").innerText = "--";
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();

  classifyButton.addEventListener("click", () => classify());
  clearButton.addEventListener("click", () => clearInputs());
});
