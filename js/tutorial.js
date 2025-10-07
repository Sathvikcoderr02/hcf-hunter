// Tutorial System
class Tutorial {
    constructor() {
        this.steps = [
            {
                title: "Welcome to HCF Hunter!",
                content: "Let's learn about Highest Common Factors (HCF) in a fun way!",
                target: null,
                position: 'center'
            },
            {
                title: "What are Factors?",
                content: "Factors are numbers we multiply together to get another number. For example, factors of 6 are 1, 2, 3, and 6.",
                target: '.factors',
                position: 'top'
            },
            {
                title: "Common Factors",
                content: "Common factors are numbers that are factors of both numbers. Let's find them!",
                target: '.common-factors',
                position: 'top'
            },
            {
                title: "Finding the HCF",
                content: "The Highest Common Factor (HCF) is the largest number that divides both numbers exactly.",
                target: '.hcf-answer',
                position: 'top'
            },
            {
                title: "Let's Play!",
                content: "Now it's your turn! Find the HCF of these numbers.",
                target: '.numbers-display',
                position: 'bottom'
            }
        ];
        
        this.currentStep = 0;
        this.tutorialActive = true;
        this.overlay = null;
        this.tooltip = null;
    }
    
    start() {
        this.createOverlay();
        this.createTooltip();
        this.showStep(0);
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutorial-overlay';
        document.body.appendChild(this.overlay);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .tutorial-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .tutorial-tooltip {
                position: absolute;
                background: white;
                border-radius: 10px;
                padding: 20px;
                max-width: 300px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 1001;
                transition: all 0.3s ease;
            }
            
            .tutorial-tooltip h3 {
                margin-top: 0;
                color: #4a90e2;
            }
            
            .tutorial-tooltip p {
                margin-bottom: 15px;
            }
            
            .tutorial-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
            }
            
            .tutorial-button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            
            .tutorial-next {
                background-color: #4a90e2;
                color: white;
            }
            
            .tutorial-prev {
                background-color: #95a5a6;
                color: white;
                margin-right: 10px;
            }
            
            .tutorial-skip {
                background: none;
                border: none;
                color: #7f8c8d;
                cursor: pointer;
            }
            
            .highlight {
                position: relative;
                z-index: 1002 !important;
                transform: scale(1.05);
                transition: all 0.3s ease;
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tutorial-tooltip';
        document.body.appendChild(this.tooltip);
    }
    
    showStep(stepIndex) {
        this.currentStep = stepIndex;
        const step = this.steps[stepIndex];
        
        // Update tooltip content
        this.tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-buttons">
                <div>
                    ${stepIndex > 0 ? `<button class="tutorial-button tutorial-prev">Previous</button>` : ''}
                    <button class="tutorial-button tutorial-next">
                        ${stepIndex === this.steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
                <button class="tutorial-skip">Skip Tutorial</button>
            </div>
        `;
        
        // Position the tooltip
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                const rect = target.getBoundingClientRect();
                
                // Remove highlight from previous target
                document.querySelectorAll('.highlight').forEach(el => {
                    el.classList.remove('highlight');
                });
                
                // Add highlight to current target
                target.classList.add('highlight');
                
                // Position tooltip based on target position
                switch (step.position) {
                    case 'top':
                        this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight - 20}px`;
                        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
                        break;
                    case 'bottom':
                        this.tooltip.style.top = `${rect.bottom + 20}px`;
                        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
                        break;
                    case 'left':
                        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (this.tooltip.offsetHeight / 2)}px`;
                        this.tooltip.style.right = `${window.innerWidth - rect.left + 20}px`;
                        break;
                    case 'right':
                        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (this.tooltip.offsetHeight / 2)}px`;
                        this.tooltip.style.left = `${rect.right + 20}px`;
                        break;
                    default: // center
                        this.tooltip.style.top = '50%';
                        this.tooltip.style.left = '50%';
                        this.tooltip.style.transform = 'translate(-50%, -50%)';
                }
                
                // Make sure tooltip stays in viewport
                const tooltipRect = this.tooltip.getBoundingClientRect();
                if (tooltipRect.right > window.innerWidth) {
                    this.tooltip.style.left = `${window.innerWidth - tooltipRect.width - 20}px`;
                }
                if (tooltipRect.bottom > window.innerHeight) {
                    this.tooltip.style.top = `${window.innerHeight - tooltipRect.height - 20}px`;
                }
            }
        } else {
            // Center the tooltip if no target
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
        }
        
        // Add event listeners
        const nextButton = this.tooltip.querySelector('.tutorial-next');
        const prevButton = this.tooltip.querySelector('.tutorial-prev');
        const skipButton = this.tooltip.querySelector('.tutorial-skip');
        
        if (nextButton) {
            nextButton.onclick = () => {
                if (this.currentStep < this.steps.length - 1) {
                    this.showStep(this.currentStep + 1);
                } else {
                    this.complete();
                }
            };
        }
        
        if (prevButton) {
            prevButton.onclick = () => {
                if (this.currentStep > 0) {
                    this.showStep(this.currentStep - 1);
                }
            };
        }
        
        if (skipButton) {
            skipButton.onclick = () => {
                this.complete();
            };
        }
    }
    
    complete() {
        // Remove tutorial elements
        if (this.overlay) this.overlay.remove();
        if (this.tooltip) this.tooltip.remove();
        
        // Remove highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
        
        this.tutorialActive = false;
        
        // Enable game interactions
        document.querySelectorAll('.factor, .option').forEach(el => {
            el.style.pointerEvents = 'auto';
        });
    }
}

// Initialize tutorial when the game loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is the first time playing
    if (!localStorage.getItem('tutorialCompleted')) {
        const tutorial = new Tutorial();
        tutorial.start();
        
        // Disable game interactions during tutorial
        document.querySelectorAll('.factor, .option').forEach(el => {
            el.style.pointerEvents = 'none';
        });
        
        // Mark tutorial as completed
        localStorage.setItem('tutorialCompleted', 'true');
    }
});
