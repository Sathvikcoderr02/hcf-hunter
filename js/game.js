// Game state
let currentLevel = 1;
let score = 0;
let currentNumbers = [];
let factors1 = [];
let factors2 = [];
let commonFactors = [];
let hcf = 1;

// DOM Elements
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');
const number1Element = document.getElementById('number1');
const number2Element = document.getElementById('number2');
const factors1Element = document.getElementById('factors1');
const factors2Element = document.getElementById('factors2');
const commonFactorsElement = document.getElementById('common-factors');
const hcfAnswerElement = document.getElementById('hcf-answer');
const optionsElement = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const nextLevelButton = document.getElementById('next-level');

// Helper function to get random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to find all factors of a number
function findFactors(num) {
    const factors = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            factors.push(i);
        }
    }
    return factors;
}

// Function to find HCF of two numbers
function findHCF(a, b) {
    return b === 0 ? a : findHCF(b, a % b);
}

// Total number of levels in the game
const TOTAL_LEVELS = 15;

// Function to generate a new level
function generateLevel() {
    // Check if game is completed
    if (currentLevel > TOTAL_LEVELS) {
        showGameOver(score);
        return;
    }
    
    // Update level display
    levelElement.textContent = `Level: ${currentLevel} of ${TOTAL_LEVELS}`;
    
    // Clear previous state
    factors1 = [];
    factors2 = [];
    commonFactors = [];
    
    // Generate two random numbers based on level with progressive difficulty
    let minNumber, maxNumber;
    
    if (currentLevel <= 5) {
        // Levels 1-5: Basic (10-30 range)
        minNumber = 10 + (currentLevel * 2);
        maxNumber = 15 + (currentLevel * 3);
    } else if (currentLevel <= 10) {
        // Levels 6-10: Intermediate (30-80 range)
        minNumber = 30 + ((currentLevel - 5) * 5);
        maxNumber = 50 + ((currentLevel - 5) * 6);
    } else {
        // Levels 11-15: Advanced (80-150 range)
        minNumber = 80 + ((currentLevel - 10) * 10);
        maxNumber = 100 + ((currentLevel - 10) * 15);
    }
    
    let num1 = getRandomNumber(minNumber, maxNumber);
    let num2 = getRandomNumber(minNumber, maxNumber);
    
    // Ensure numbers are not the same and have common factors
    while (num1 === num2 || findHCF(num1, num2) === 1) {
        num1 = getRandomNumber(minNumber, maxNumber);
        num2 = getRandomNumber(minNumber, maxNumber);
    }
    
    currentNumbers = [num1, num2];
    
    // Find factors and HCF
    factors1 = findFactors(num1);
    factors2 = findFactors(num2);
    commonFactors = factors1.filter(value => factors2.includes(value));
    hcf = Math.max(...commonFactors);
    
    // Update UI
    updateUI();
    
    // Reset feedback and next level button
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    nextLevelButton.disabled = true;
}

// Function to update the UI
function updateUI() {
    // Update level and score
    levelElement.textContent = currentLevel;
    scoreElement.textContent = score;
    
    // Update numbers
    number1Element.textContent = currentNumbers[0];
    number2Element.textContent = currentNumbers[1];
    
    // Clear previous factors
    factors1Element.innerHTML = '';
    factors2Element.innerHTML = '';
    commonFactorsElement.innerHTML = '';
    
    // Create factor elements
    factors1.forEach(factor => {
        const factorElement = createFactorElement(factor, 'factor1');
        factors1Element.appendChild(factorElement);
    });
    
    factors2.forEach(factor => {
        const factorElement = createFactorElement(factor, 'factor2');
        factors2Element.appendChild(factorElement);
    });
    
    // Create options for HCF
    createHCFOptions();
}

// Function to create a factor element
function createFactorElement(factor, type) {
    const factorElement = document.createElement('div');
    factorElement.className = 'factor';
    factorElement.textContent = factor;
    
    // Check if this is a common factor
    if (commonFactors.includes(factor)) {
        factorElement.classList.add('common');
    }
    
    // Add click event to select/deselect common factors
    if (commonFactors.includes(factor)) {
        factorElement.addEventListener('click', () => {
            factorElement.classList.toggle('selected');
            checkCommonFactors();
        });
    }
    
    return factorElement;
}

// Function to create HCF options
function createHCFOptions() {
    optionsElement.innerHTML = '';
    
    // Create some random options including the correct HCF
    const options = [hcf];
    
    // Add some random options that are factors of the numbers but not the HCF
    const allFactors = [...new Set([...factors1, ...factors2])].sort((a, b) => a - b);
    while (options.length < 4 && options.length < allFactors.length) {
        const randomFactor = allFactors[Math.floor(Math.random() * allFactors.length)];
        if (!options.includes(randomFactor)) {
            options.push(randomFactor);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Create option buttons
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        
        button.addEventListener('click', () => {
            if (button.classList.contains('selected')) {
                // Already selected, deselect
                button.classList.remove('selected');
                hcfAnswerElement.textContent = '?';
            } else {
                // Deselect all other options
                document.querySelectorAll('.option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Select this option
                button.classList.add('selected');
                hcfAnswerElement.textContent = option;
                
                // Check if the answer is correct
                if (parseInt(option) === hcf) {
                    button.classList.add('correct');
                    feedbackElement.textContent = 'Correct! Well done!';
                    feedbackElement.className = 'feedback correct';
                    score += currentLevel * 10;
                    scoreElement.textContent = score;
                    nextLevelButton.disabled = false;
                } else {
                    button.classList.add('incorrect');
                    feedbackElement.textContent = 'Not quite. Try again!';
                    feedbackElement.className = 'feedback incorrect';
                    score = Math.max(0, score - 5);
                    scoreElement.textContent = score;
                }
            }
        });
        
        optionsElement.appendChild(button);
    });
}

// Function to show game over screen
function showGameOver(finalScore) {
    const modal = document.getElementById('gameOverModal');
    if (!modal) return;
    
    // Update the final score
    const finalScoreElement = modal.querySelector('#finalScore');
    if (finalScoreElement) {
        finalScoreElement.textContent = finalScore;
    }
    
    // Show the modal
    modal.style.display = 'flex';
    
    // Handle play again button
    const playAgainBtn = modal.querySelector('#playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.onclick = function() {
            // Reset game state
            currentLevel = 1;
            score = 0;
            // Hide the modal
            modal.style.display = 'none';
            // Start a new game
            generateLevel();
        };
    }
}

// Function to check if all common factors are selected
function checkCommonFactors() {
    const selectedFactors = document.querySelectorAll('.factor.common.selected');
    const selectedValues = Array.from(selectedFactors).map(el => parseInt(el.textContent));
    
    // Check if all common factors are selected
    const allSelected = commonFactors.every(factor => selectedValues.includes(factor));
    
    if (allSelected && commonFactors.length > 0) {
        // Show success feedback
        feedbackElement.textContent = 'Great! All common factors found! Now select the HCF.';
        feedbackElement.className = 'feedback correct';
        
        // Show the common factors in the common factors area
        commonFactorsElement.innerHTML = '';
        commonFactors.forEach(factor => {
            const factorElement = document.createElement('div');
            factorElement.className = 'factor common';
            factorElement.textContent = factor;
            commonFactorsElement.appendChild(factorElement);
        });
        
        // Enable options
        document.querySelectorAll('.option').forEach(option => {
            option.disabled = false;
        });
    }
}

// Event listener for next level button
nextLevelButton.addEventListener('click', () => {
    if (currentLevel >= TOTAL_LEVELS) {
        // If this was the last level, show game over
        showGameOver(score);
    } else {
        // Otherwise, go to next level
        currentLevel++;
        generateLevel();
    }
});

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    generateLevel();
});
