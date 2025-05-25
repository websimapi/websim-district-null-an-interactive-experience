class DistrictNull {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.messageBox = document.getElementById('messageBox');
        this.enoughFill = document.getElementById('enoughFill');
        this.glitchOverlay = document.getElementById('glitchOverlay');
        this.statusText = document.getElementById('statusText');
        this.titleScreen = document.getElementById('titleScreen');
        
        this.setupCanvas();
        this.initGame();
        this.setupEventListeners();
        
        this.gameLoop();
    }
    
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = false;
        
        this.width = rect.width;
        this.height = rect.height;
    }
    
    initGame() {
        this.gameStarted = false;
        this.player = { x: this.width / 2, y: this.height / 2 };
        this.camera = { x: 0, y: 0, shake: 0 };
        this.enoughLevel = 0;
        this.glitchIntensity = 0;
        this.entities = [];
        this.particles = [];
        this.messages = [
            "SOMETHING IS MISSING",
            "THE SIGNAL WEAKENS",
            "REALITY FRAGMENTS",
            "SEARCHING FOR MEANING",
            "STATIC CONSUMES ALL",
            "NOTHING IS ENOUGH",
            "THE VOID CALLS BACK"
        ];
        this.currentMessage = 0;
        this.messageTimer = 0;
        this.distortionTimer = 0;
        
        this.generateLevel();
    }
    
    generateLevel() {
        // Create abstract entities representing the surreal environment
        for (let i = 0; i < 20; i++) {
            this.entities.push({
                x: Math.random() * this.width * 2,
                y: Math.random() * this.height * 2,
                type: Math.random() > 0.5 ? 'structure' : 'wanderer',
                size: 20 + Math.random() * 40,
                color: this.getRandomColor(),
                opacity: 0.3 + Math.random() * 0.7,
                glitched: Math.random() > 0.8,
                moveSpeed: Math.random() * 0.5,
                direction: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#ff0000', '#660000', '#333333', '#888888', '#ffff00', '#ff6600'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        // Touch and mouse controls for mobile-friendly interaction
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameStarted) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.handleInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameStarted) {
                const rect = this.canvas.getBoundingClientRect();
                this.handleInteraction(e.clientX - rect.left, e.clientY - rect.top);
            }
        });
        
        // Prevent scrolling on mobile
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    startGame() {
        this.gameStarted = true;
        this.titleScreen.style.opacity = '0';
        setTimeout(() => {
            this.titleScreen.style.display = 'none';
        }, 1000);
        this.showMessage(0);
    }
    
    handleInteraction(x, y) {
        // Move player toward interaction point
        this.player.x += (x - this.player.x) * 0.1;
        this.player.y += (y - this.player.y) * 0.1;
        
        // Create interaction effects
        this.createParticles(x, y);
        this.camera.shake = 5;
        this.increaseEnough();
        this.triggerGlitch();
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                color: this.getRandomColor(),
                size: 2 + Math.random() * 4
            });
        }
    }
    
    increaseEnough() {
        this.enoughLevel = Math.min(100, this.enoughLevel + 2 + Math.random() * 3);
        this.enoughFill.style.width = this.enoughLevel + '%';
        
        if (this.enoughLevel > 50) {
            this.glitchIntensity = (this.enoughLevel - 50) / 50;
        }
        
        if (this.enoughLevel >= 100) {
            this.triggerEnding();
        }
    }
    
    triggerGlitch() {
        this.glitchOverlay.style.opacity = '0.3';
        document.body.classList.add('glitch-active');
        
        setTimeout(() => {
            this.glitchOverlay.style.opacity = '0';
            document.body.classList.remove('glitch-active');
        }, 200);
    }
    
    showMessage(index) {
        if (index < this.messages.length) {
            this.messageBox.textContent = this.messages[index];
            this.messageBox.style.opacity = '1';
            
            setTimeout(() => {
                this.messageBox.style.opacity = '0';
            }, 3000);
        }
    }
    
    triggerEnding() {
        this.statusText.textContent = 'SIGNAL LOST...';
        this.showMessage(this.messages.length - 1);
        
        setTimeout(() => {
            // Reset the experience
            this.enoughLevel = 0;
            this.glitchIntensity = 0;
            this.currentMessage = 0;
            this.enoughFill.style.width = '0%';
            this.statusText.textContent = 'SIGNAL DEGRADING...';
            this.generateLevel();
        }, 5000);
    }
    
    update() {
        if (!this.gameStarted) return;
        
        // Update camera shake
        if (this.camera.shake > 0) {
            this.camera.shake *= 0.9;
        }
        
        // Update entities with surreal behavior
        this.entities.forEach(entity => {
            if (entity.type === 'wanderer') {
                entity.x += Math.cos(entity.direction) * entity.moveSpeed;
                entity.y += Math.sin(entity.direction) * entity.moveSpeed;
                
                if (Math.random() > 0.99) {
                    entity.direction = Math.random() * Math.PI * 2;
                }
            }
            
            // Glitch effects
            if (this.glitchIntensity > 0 && Math.random() > 0.95) {
                entity.glitched = !entity.glitched;
                entity.color = this.getRandomColor();
            }
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life -= particle.decay;
            return particle.life > 0;
        });
        
        // Trigger random messages
        this.messageTimer++;
        if (this.messageTimer > 300 + Math.random() * 600) {
            this.currentMessage = (this.currentMessage + 1) % this.messages.length;
            this.showMessage(this.currentMessage);
            this.messageTimer = 0;
        }
        
        // Random distortion events
        this.distortionTimer++;
        if (this.distortionTimer > 200 && Math.random() > 0.99) {
            this.triggerGlitch();
            this.distortionTimer = 0;
        }
    }
    
    render() {
        // Clear canvas with distortion
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Apply camera shake
        const shakeX = (Math.random() - 0.5) * this.camera.shake;
        const shakeY = (Math.random() - 0.5) * this.camera.shake;
        
        this.ctx.save();
        this.ctx.translate(shakeX, shakeY);
        
        // Render entities with isometric perspective effect
        this.entities.forEach(entity => {
            this.ctx.save();
            
            if (entity.glitched && Math.random() > 0.7) {
                this.ctx.translate(Math.random() * 4 - 2, Math.random() * 4 - 2);
            }
            
            this.ctx.globalAlpha = entity.opacity;
            this.ctx.fillStyle = entity.color;
            
            if (entity.type === 'structure') {
                // Draw as abstract building
                this.ctx.fillRect(entity.x - entity.size/2, entity.y - entity.size, entity.size, entity.size * 1.5);
                // Shadow effect
                this.ctx.fillStyle = '#000000';
                this.ctx.globalAlpha = 0.3;
                this.ctx.fillRect(entity.x + entity.size/2, entity.y + entity.size/2, entity.size/2, entity.size/2);
            } else {
                // Draw as wandering entity
                this.ctx.beginPath();
                this.ctx.arc(entity.x, entity.y, entity.size/4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
        
        // Render particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            this.ctx.restore();
        });
        
        // Render player as abstract cursor
        this.ctx.save();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillRect(this.player.x - 2, this.player.y - 2, 4, 4);
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(this.player.x - 8, this.player.y - 8, 16, 16);
        this.ctx.restore();
        
        // Apply glitch effects
        if (this.glitchIntensity > 0) {
            this.renderGlitchEffects();
        }
        
        this.ctx.restore();
    }
    
    renderGlitchEffects() {
        if (Math.random() < this.glitchIntensity * 0.1) {
            // Digital noise
            const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                if (Math.random() < this.glitchIntensity * 0.01) {
                    data[i] = Math.random() * 255;     // Red
                    data[i + 1] = Math.random() * 255; // Green
                    data[i + 2] = Math.random() * 255; // Blue
                }
            }
            
            this.ctx.putImageData(imageData, 0, 0);
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize the experience when the page loads
window.addEventListener('load', () => {
    new DistrictNull();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize on resize for proper mobile handling
    setTimeout(() => {
        new DistrictNull();
    }, 100);
});

