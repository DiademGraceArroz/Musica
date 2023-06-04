import { musicData } from "./musicData.js";
import { euclideanDistance } from "./euclideanDistance.js";

const classifyButton = document.getElementById("classifyButton");
classifyButton.addEventListener("click", () => classify());

function classify() {
  const songTitle = document.getElementById("title").value.toLowerCase();
  const songArtist = document.getElementById("artist").value.toLowerCase();

  let songFeatures = [];

  // Song Title and Artists fields are empty
  if (!songTitle && !songArtist) {
    alert("Please input song title and artist.");
    return;
  } else if (!songTitle) {
    alert("Please input song title.");
    return;
  } else if (!songArtist) {
    alert("Please input artist.");
    return;
  }

  // Search for song in musicData
  const songIndex = musicData.findIndex(
    (song) =>
      song.title.toLowerCase() === songTitle &&
      song.artist.toLowerCase() === songArtist
  );

  // Populate form with song's features if found
  if (songIndex !== -1) {
    songFeatures = musicData[songIndex].features;
    document.getElementById("tempo").value = songFeatures[0];
    document.getElementById("energy").value = songFeatures[1];
    document.getElementById("danceability").value = songFeatures[2];
  } else {
    // Clear form and display error message if song is not found
    document.getElementById("tempo").value = "";
    document.getElementById("energy").value = "";
    document.getElementById("danceability").value = "";
    document.getElementById("result").innerHTML = "Song not found";
    return;
  }

  // number of nearest neighbors
  let k = 25;
  let nearestNeighbors = [];

  for (let i = 0; i < musicData.length; i++) {
    if (i === songIndex) continue; // Skip the test song itself
    const distance = euclideanDistance(songFeatures, musicData[i].features);
    nearestNeighbors.push({ index: i, distance: distance });
  }
  nearestNeighbors.sort((a, b) => a.distance - b.distance);

  const kNearestNeighbors = nearestNeighbors.slice(0, k);
  const genreCounts = {};

  for (let i = 0; i < kNearestNeighbors.length; i++) {
    const genre = musicData[kNearestNeighbors[i].index].genre;
    genreCounts[genre] = genreCounts[genre] ? genreCounts[genre] + 1 : 1;
    // console.log(
    //   `Neighbor ${i + 1}: Genre - ${genre}, Distance - ${
    //     kNearestNeighbors[i].distance
    //   }`
    // );
  }

  let maxCount = 0;
  let maxGenre = null;

  for (const genre in genreCounts) {
    if (genreCounts[genre] > maxCount) {
      maxCount = genreCounts[genre];
      maxGenre = genre;
    }
  }
  document.getElementById("result").innerHTML = maxGenre;
}

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", () => clearInputs());

function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("artist").value = "";
  document.getElementById("tempo").value = "";
  document.getElementById("energy").value = "";
  document.getElementById("danceability").value = "";
  document.getElementById("result").innerHTML = "";
}
