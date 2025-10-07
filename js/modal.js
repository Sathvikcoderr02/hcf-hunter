// Game Over Modal
const modal = document.createElement('div');
modal.id = 'gameOverModal';
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You've completed all levels with a final score of <span id="finalScore">0</span>!</p>
        <div class="modal-actions">
            <button id="saveScoreBtn" class="btn">Save My Score</button>
            <button id="playAgainBtn" class="btn btn-secondary">Play Again</button>
        </div>
        <div id="saveScoreForm" class="hidden">
            <input type="text" id="playerName" placeholder="Enter your name" maxlength="20" required>
            <button id="submitScoreBtn" class="btn">Submit</button>
            <p id="saveStatus"></p>
        </div>
    </div>
`;
document.body.appendChild(modal);

// Style the modal
const style = document.createElement('style');
style.textContent = `
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .modal h2 {
        color: #4a90e2;
        margin-bottom: 15px;
    }
    
    .modal p {
        margin-bottom: 20px;
        font-size: 1.1rem;
    }
    
    .modal-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .btn-secondary {
        background-color: #95a5a6;
    }
    
    .btn-secondary:hover {
        background-color: #7f8c8d;
    }
    
    #saveScoreForm {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }
    
    #playerName {
        padding: 10px 15px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        width: 80%;
        max-width: 300px;
    }
    
    #saveStatus {
        margin-top: 10px;
        min-height: 20px;
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Show game over modal
function showGameOver(score) {
    document.getElementById('finalScore').textContent = score;
    modal.style.display = 'flex';
    
    // Set up event listeners
    document.getElementById('saveScoreBtn').addEventListener('click', () => {
        document.getElementById('saveScoreBtn').classList.add('hidden');
        document.getElementById('playAgainBtn').classList.add('hidden');
        document.getElementById('saveScoreForm').classList.remove('hidden');
        document.getElementById('playerName').focus();
    });
    
    document.getElementById('submitScoreBtn').addEventListener('click', saveScore);
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveScore();
        }
    });
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        window.location.reload();
    });
}

// Save score to the server
async function saveScore() {
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    const statusElement = document.getElementById('saveStatus');
    
    if (!name) {
        statusElement.textContent = 'Please enter your name';
        statusElement.style.color = 'red';
        return;
    }
    
    try {
        const response = await fetch('php/save_score.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                level: currentLevel - 1, // currentLevel is already incremented
                score: score
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            statusElement.textContent = `Score saved! You're #${result.position} on the leaderboard.`;
            statusElement.style.color = 'green';
            
            // Show leaderboard button
            const leaderboardBtn = document.createElement('a');
            leaderboardBtn.href = 'leaderboard.php';
            leaderboardBtn.className = 'btn';
            leaderboardBtn.textContent = 'View Leaderboard';
            leaderboardBtn.style.marginTop = '15px';
            
            const form = document.getElementById('saveScoreForm');
            form.appendChild(document.createElement('br'));
            form.appendChild(leaderboardBtn);
            
            // Update play again button
            document.getElementById('playAgainBtn').classList.remove('hidden');
            document.getElementById('playAgainBtn').textContent = 'Play Again';
        } else {
            throw new Error(result.message || 'Failed to save score');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        statusElement.textContent = 'Failed to save score. Please try again.';
        statusElement.style.color = 'red';
        
        // Show play again button in case of error
        document.getElementById('playAgainBtn').classList.remove('hidden');
    }
}

// Update the nextLevelButton click event to show game over when all levels are completed
const originalNextLevelClick = nextLevelButton.onclick;
nextLevelButton.onclick = function() {
    if (currentLevel >= 10) { // Assuming 10 levels total
        showGameOver(score);
    } else {
        originalNextLevelClick();
    }
};
