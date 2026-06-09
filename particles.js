(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const maxParticles = 75; // Balanced for good density and performance
    const connectionDist = 120; // Max distance for lines
    const mouse = { x: null, y: null, radius: 150 };

    // Handle Resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Handle Mouse Move
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Handle Mouse Leave
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Constructor
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4; // Very slow, ambient movement
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Check color theme dynamically
        const isLightMode = document.body.classList.contains('light-mode');
        // Harmonic theme colors matching the site's accent tokens
        const particleColor = isLightMode ? 'rgba(15, 98, 254, 0.45)' : 'rgba(0, 242, 254, 0.25)';
        const lineColor = isLightMode ? 'rgba(15, 98, 254, 0.08)' : 'rgba(0, 114, 255, 0.05)';
        const mouseLineColor = isLightMode ? 'rgba(15, 98, 254, 0.12)' : 'rgba(0, 242, 254, 0.1)';

        // Draw and update particles
        particles.forEach(p => {
            p.update();
            p.draw(particleColor);
        });

        // Draw connecting lines (constellation network)
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            // Connect to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const alpha = (1 - dist / mouse.radius) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = mouseLineColor.replace(/[^,]+(?=\))/, alpha);
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connect to other particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    // Line opacity drops as distance increases
                    const alpha = (1 - dist / connectionDist) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor.replace(/[^,]+(?=\))/, alpha);
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
})();
