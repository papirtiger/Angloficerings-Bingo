let words = {};
let userColors = {};

function addWord() {
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
            userColors[username] = getRandomColor();
        }

        if (!words[word]) {
            words[word] = { count: 0, user: username };
        }

        words[word].count++;

        updateWordCloud();
        wordInput.value = "";
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addWord();
    }
}

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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}