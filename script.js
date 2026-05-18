//
// 1. THEME
const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");
const moon = document.getElementById("moon");

// Check for saved theme preference when the page loads
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}

/* OPEN MENU */
if (menuIcon && sideMenu) {
    menuIcon.onclick = function (event) {
        event.stopPropagation();
        if (sideMenu.style.left === "0px") {
            sideMenu.style.left = "-250px";
        } else {
            sideMenu.style.left = "0px";
        }
    };
}

/* CLOSE MENU WHEN CLICKING OUTSIDE */
document.onclick = function (event) {
    if (sideMenu && !sideMenu.contains(event.target) && event.target !== menuIcon) {
        sideMenu.style.left = "-250px";
    }
};

/* LIGHT / DARK MODE WITH PERSISTENCE */
if (moon) {
    moon.onclick = function () {
        document.body.classList.toggle("light-mode");
        
        // Save the choice to localStorage
        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    };
}


// ==========================================
// 2. BIOPHYSICS ML DYNAMIC ART ANIMATION
// ==========================================
const canvas = document.getElementById('biophysicsCanvas');

// Run canvas logic ONLY if the element exists on the current page
if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let nodes = [];
    const nodeCount = 45; 
    const maxDistance = 90;

    // Track if body has light-mode class for dynamic color changing
    function isLightMode() {
        return document.body.classList.contains('light-mode');
    }

    // Handle resizing safely
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initNodes();
    }

    // Node blueprint structure (resembles interconnected atoms or neural features)
    class BiophysicsNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2.5 + 1.5;
            this.pulsePhase = Math.random() * Math.PI;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulsePhase += 0.02;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function initNodes() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new BiophysicsNode());
        }
    }

    // Mouse interaction object
    const mouse = { x: null, y: null, radius: 120 };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const lightMode = isLightMode();
        const nodeColor = lightMode ? 'rgba(59, 130, 246, 0.8)' : 'rgba(96, 165, 250, 0.8)';
        const lineColorRaw = lightMode ? '59, 130, 246' : '139, 92, 246';
        const signalColor = lightMode ? '#06b6d4' : '#67e8f9';

        nodes.forEach(node => {
            node.update();
            
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - node.x;
                const dy = mouse.y - node.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    node.x -= dx * force * 0.03;
                    node.y -= dy * force * 0.03;
                }
            }
            node.draw(nodeColor);
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (1 - dist / maxDistance) * 0.25;
                    ctx.strokeStyle = `rgba(${lineColorRaw}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();

                    if (dist < maxDistance * 0.7 && Math.sin(nodes[i].pulsePhase) > 0.8) {
                        const progress = (Math.sin(nodes[i].pulsePhase * 2) + 1) / 2;
                        const signalX = nodes[i].x + dx * -progress;
                        const signalY = nodes[i].y + dy * -progress;
                        
                        ctx.beginPath();
                        ctx.arc(signalX, signalY, 1.8, 0, Math.PI * 2);
                        ctx.fillStyle = signalColor;
                        ctx.shadowBlur = 6;
                        ctx.shadowColor = signalColor;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}
