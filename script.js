// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, ref, set, get, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRz0o-sggOMLZvAgdSF6JHxohFuguOmFg",
  authDomain: "angloficerings-bingo.firebaseapp.com",
  databaseURL: "https://angloficerings-bingo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "angloficerings-bingo",
  storageBucket: "angloficerings-bingo.appspot.com",
  messagingSenderId: "109748952424",
  appId: "1:109748952424:web:3e82223181ffb9b6794add",
  measurementId: "G-TZML4JFGKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// References to database paths
const wordsRef = ref(db, 'words');
const userColorsRef = ref(db, 'userColors');

// Global variables to store data
let words = {};
let userColors = {};

// Function to add a word
window.addWord = function() {
  const usernameInput = document.getElementById("usernameInput");
  const wordInput = document.getElementById("wordInput");
  const username = usernameInput.value.trim();
  const word = wordInput.value.trim().toLowerCase();

  if (!username) {
    alert("Indtast dit navn.");
    return;
  }

  if (word) {
    if (!userColors[username]) {
      const color = getRandomColor();
      userColors[username] = color;
      set(ref(db, 'userColors/' + username), color);
    }

    runTransaction(ref(db, 'words/' + word), (currentData) => {
      if (currentData === null) {
        return { count: 1, user: username };
      } else {
        currentData.count++;
        return currentData;
      }
    });

    wordInput.value = "";
  }
}

// Function to handle key press (Enter key)
window.handleKeyPress = function(event) {
  if (event.key === 'Enter') {
    addWord();
  }
}

// Function to update the word cloud
function updateWordCloud() {
  const wordCloud = document.getElementById("wordCloud");
  wordCloud.innerHTML = "";

  Object.keys(words).forEach(word => {
    const span = document.createElement("span");
    const fontSize = 10 + words[word].count * 10;
    span.style.fontSize = fontSize + "px";
    span.style.backgroundColor = userColors[words[word].user];
    span.textContent = `${word} (${words[word].count})`;
    wordCloud.appendChild(span);
  });
}

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Realtime Database Listeners
onValue(wordsRef, (snapshot) => {
  words = snapshot.val() || {};
  updateWordCloud();
});

onValue(userColorsRef, (snapshot) => {
  userColors = snapshot.val() || {};
});
