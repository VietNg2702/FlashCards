const flashcard = document.querySelector('.flashcard');
const questionEl = document.querySelector('.question');
const answerEl = document.querySelector('.answer');
const dataSetList = document.getElementById('dataSetList');

let flashcards = [];
let currentIndex = 0;
let startX;
let isAnimating = false;

// Populate sidebar with data sets
const dataSets = [
    { name: 'Default', file: 'data.json' },
    { name: 'Set 1', file: 'data-set-1.json' },
    { name: 'Set 2', file: 'data-set-2.json' },
    // Add more sets as needed
];

dataSets.forEach(set => {
    const li = document.createElement('li');
    li.textContent = set.name;
    li.addEventListener('click', () => loadData(set.file));
    dataSetList.appendChild(li);
});

function loadData(file) {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            flashcards = data;
            currentIndex = getRandomIndex(flashcards.length); // Initialize with a random flashcard
            updateFlashcard();
        })
        .catch(error => console.error('Error loading JSON:', error));
}

function updateFlashcard() {
    if (flashcards.length === 0) return;
    const { question, answer } = flashcards[currentIndex];
    questionEl.textContent = question;
    answerEl.textContent = answer;
}

function getRandomIndex(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
}

flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

// Swipe event handling
flashcard.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});

flashcard.addEventListener('touchend', (event) => {
    if (isAnimating) return; // Prevent interaction during animation

    const endX = event.changedTouches[0].clientX;
    const deltaX = startX - endX;

    if (Math.abs(deltaX) > 50) { // Threshold for swipe action
        if (deltaX > 0) {
            // Swipe left - next flashcard
            flashcard.classList.add('swipe-animation-left');
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % flashcards.length;
                updateFlashcard();
                flashcard.classList.remove('swipe-animation-left');
                isAnimating = false;
            }, 600); // Match duration with CSS animation
        } else {
            // Swipe right - previous flashcard
            flashcard.classList.add('swipe-animation-right');
            setTimeout(() => {
                currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
                updateFlashcard();
                flashcard.classList.remove('swipe-animation-right');
                isAnimating = false;
            }, 600); // Match duration with CSS animation
        }
        isAnimating = true;
    }
});

// Sidebar functions
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}
