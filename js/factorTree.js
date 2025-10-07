// Factorization Tree Visualization
class FactorTree {
    constructor(number) {
        this.number = number;
        this.factors = this.getPrimeFactors(number);
        this.container = null;
    }
    
    // Function to get prime factors of a number
    getPrimeFactors(num) {
        const factors = [];
        let divisor = 2;
        
        while (num >= 2) {
            if (num % divisor === 0) {
                factors.push(divisor);
                num = num / divisor;
            } else {
                divisor++;
            }
        }
        
        return factors;
    }
    
    // Create the factor tree visualization
    createTree(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.container.innerHTML = '';
        this.container.className = 'factor-tree';
        
        // Add styles if not already added
        this.addStyles();
        
        // Create the tree starting with the original number
        this.createNode(this.number, this.factors, this.container);
    }
    
    // Create a node in the factor tree
    createNode(value, factors, parentElement) {
        const node = document.createElement('div');
        node.className = 'factor-node';
        
        // Create the value display
        const valueElement = document.createElement('div');
        valueElement.className = 'factor-value';
        valueElement.textContent = value;
        node.appendChild(valueElement);
        
        // If there are factors, create child nodes
        if (factors && factors.length > 1) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'factor-children';
            
            // Create a branch for each factor
            const uniqueFactors = [...new Set(factors)];
            
            uniqueFactors.forEach(factor => {
                const count = factors.filter(f => f === factor).length;
                const factorValue = Math.pow(factor, count);
                const remainingFactors = [...factors];
                
                // Remove this factor from the remaining factors
                for (let i = 0; i < count; i++) {
                    const index = remainingFactors.indexOf(factor);
                    if (index > -1) {
                        remainingFactors.splice(index, 1);
                    }
                }
                
                // Create the branch
                const branch = document.createElement('div');
                branch.className = 'factor-branch';
                
                // Create the line connecting to the parent
                const line = document.createElement('div');
                line.className = 'factor-line';
                branch.appendChild(line);
                
                // Create the child node
                this.createNode(factorValue, remainingFactors.length > 1 ? remainingFactors : null, branch);
                
                childrenContainer.appendChild(branch);
            });
            
            node.appendChild(childrenContainer);
        }
        
        parentElement.appendChild(node);
    }
    
    // Add styles for the factor tree
    addStyles() {
        if (document.getElementById('factor-tree-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'factor-tree-styles';
        style.textContent = `
            .factor-tree {
                font-family: 'Nunito', sans-serif;
                display: flex;
                justify-content: center;
                padding: 20px;
                overflow: auto;
            }
            
            .factor-node {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                margin: 0 15px;
            }
            
            .factor-value {
                background: #4a90e2;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            .factor-node:hover .factor-value {
                transform: scale(1.1);
                background: #357abd;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
            
            .factor-children {
                display: flex;
                justify-content: center;
                padding-top: 20px;
                position: relative;
            }
            
            .factor-branch {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                margin: 0 10px;
            }
            
            .factor-line {
                width: 2px;
                height: 20px;
                background: #95a5a6;
                position: relative;
            }
            
            .factor-line::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #4a90e2;
                transform: scaleY(0);
                transform-origin: bottom;
                transition: transform 0.5s ease;
            }
            
            .factor-node:hover ~ .factor-line::before {
                transform: scaleY(1);
            }
            
            /* Animation for showing prime factors */
            @keyframes highlight {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .highlight-prime {
                animation: highlight 1s ease;
                background: #e74c3c !important;
            }
            
            /* Tooltip for additional info */
            .factor-tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 10;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                transform: translateY(10px);
            }
            
            .factor-value:hover .factor-tooltip {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Highlight prime factors in the tree
    highlightPrimes() {
        const primeNodes = this.container.querySelectorAll('.factor-value');
        primeNodes.forEach(node => {
            const value = parseInt(node.textContent);
            if (this.isPrime(value)) {
                node.classList.add('highlight-prime');
                
                // Add tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'factor-tooltip';
                tooltip.textContent = 'Prime number!';
                node.appendChild(tooltip);
                
                // Remove highlight after animation
                node.addEventListener('animationend', () => {
                    node.classList.remove('highlight-prime');
                }, { once: true });
            }
        });
    }
    
    // Check if a number is prime
    isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        
        if (num % 2 === 0 || num % 3 === 0) return false;
        
        let i = 5;
        while (i * i <= num) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
            i += 6;
        }
        
        return true;
    }
}

// Function to show factor tree in a modal
function showFactorTree(number, title = 'Prime Factorization') {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'factor-tree-modal';
    modal.style.display = 'flex';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}: ${number}</h2>
            <div id="factor-tree-container" style="min-height: 200px; margin: 20px 0;"></div>
            <div class="prime-factors">
                <p>Prime Factors: <span id="prime-factors-display"></span></p>
            </div>
            <button class="btn" id="close-factor-tree" style="margin-top: 20px;">Close</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('factor-tree-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'factor-tree-modal-styles';
        style.textContent = `
            .factor-tree-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .factor-tree-modal .modal-content {
                background: white;
                padding: 25px;
                border-radius: 10px;
                max-width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                text-align: center;
            }
            
            .prime-factors {
                margin: 20px 0;
                font-size: 1.1rem;
            }
            
            .prime-factors span {
                font-weight: bold;
                color: #e74c3c;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Create and show the factor tree
    const factorTree = new FactorTree(number);
    factorTree.createTree('factor-tree-container');
    
    // Show prime factors
    const primeFactors = factorTree.getPrimeFactors(number);
    const primeFactorsDisplay = modal.querySelector('#prime-factors-display');
    primeFactorsDisplay.textContent = primeFactors.join(' × ');
    
    // Highlight primes after a short delay to allow rendering
    setTimeout(() => {
        factorTree.highlightPrimes();
    }, 100);
    
    // Close button functionality
    const closeButton = modal.querySelector('#close-factor-tree');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Function to initialize factor tree button
function initFactorTreeButton() {
    // Create the button if it doesn't exist
    let factorTreeButton = document.getElementById('show-factor-tree');
    
    if (!factorTreeButton) {
        const gameArea = document.querySelector('.game-area');
        if (!gameArea) return;
        
        factorTreeButton = document.createElement('button');
        factorTreeButton.id = 'show-factor-tree';
        factorTreeButton.className = 'btn';
        factorTreeButton.textContent = 'Show Factor Tree';
        factorTreeButton.style.margin = '15px auto';
        factorTreeButton.style.display = 'block';
        factorTreeButton.style.width = '80%';
        factorTreeButton.style.maxWidth = '300px';
        
        // Insert the button before the options
        const optionsElement = document.querySelector('.options');
        if (optionsElement) {
            gameArea.insertBefore(factorTreeButton, optionsElement);
        } else {
            gameArea.appendChild(factorTreeButton);
        }
    }
    
    // Update the click handler to show both trees in one modal
    factorTreeButton.onclick = function() {
        try {
            const num1 = parseInt(document.getElementById('number1').textContent);
            const num2 = parseInt(document.getElementById('number2').textContent);
            
            if (isNaN(num1) || isNaN(num2)) {
                console.error('Could not parse numbers');
                return;
            }
            
            // Create a single modal for both trees
            const modal = document.createElement('div');
            modal.className = 'factor-tree-modal';
            modal.style.display = 'flex';
            
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <h2>Prime Factorization</h2>
                    <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 300px; margin: 10px;">
                            <h3>Number 1: ${num1}</h3>
                            <div id="factor-tree-container-1" style="min-height: 200px; margin: 20px 0;"></div>
                            <div class="prime-factors">
                                <p>Prime Factors: <span id="prime-factors-display-1"></span></p>
                            </div>
                        </div>
                        <div style="flex: 1; min-width: 300px; margin: 10px;">
                            <h3>Number 2: ${num2}</h3>
                            <div id="factor-tree-container-2" style="min-height: 200px; margin: 20px 0;"></div>
                            <div class="prime-factors">
                                <p>Prime Factors: <span id="prime-factors-display-2"></span></p>
                            </div>
                        </div>
                    </div>
                    <button class="btn" id="close-factor-tree" style="margin: 20px auto 0; display: block;">Close</button>
                </div>
            `;
            
            // Clear any existing trees first
            const existingModal = document.querySelector('.factor-tree-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Add the modal to the DOM first
            document.body.appendChild(modal);
            
            // Close button functionality
            const closeButton = modal.querySelector('#close-factor-tree');
            closeButton.addEventListener('click', () => {
                modal.remove();
            });
            
            // Close when clicking outside the modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            // Use setTimeout to ensure the modal is in the DOM before we try to access its elements
            setTimeout(() => {
                try {
                    // Create and show the first factor tree
                    const factorTree1 = new FactorTree(num1);
                    factorTree1.createTree('factor-tree-container-1');
                    const primeFactors1 = factorTree1.getPrimeFactors(num1);
                    const display1 = document.getElementById('prime-factors-display-1');
                    if (display1) display1.textContent = primeFactors1.join(' × ');
                    
                    // Create and show the second factor tree
                    const factorTree2 = new FactorTree(num2);
                    factorTree2.createTree('factor-tree-container-2');
                    const primeFactors2 = factorTree2.getPrimeFactors(num2);
                    const display2 = document.getElementById('prime-factors-display-2');
                    if (display2) display2.textContent = primeFactors2.join(' × ');
                    
                    // Highlight primes after a short delay
                    setTimeout(() => {
                        factorTree1.highlightPrimes();
                        factorTree2.highlightPrimes();
                    }, 100);
                } catch (error) {
                    console.error('Error creating factor trees:', error);
                }
            }, 0);
            
        } catch (error) {
            console.error('Error showing factor trees:', error);
        }
    };
}

// Store the original generateLevel function
const originalGenerateLevel = window.generateLevel;

// Override the generateLevel function to reinitialize our button
window.generateLevel = function() {
    // Call the original function
    const result = originalGenerateLevel.apply(this, arguments);
    
    // Reinitialize the factor tree button after a short delay
    // to ensure the DOM has been updated with the new numbers
    setTimeout(initFactorTreeButton, 100);
    
    return result;
};

// Initialize the button when the game loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFactorTreeButton);
} else {
    // Small delay to ensure all elements are loaded
    setTimeout(initFactorTreeButton, 100);
}
