import React, { useEffect, useRef } from 'react';

class BlossomItem {
    static defaultOptions = {
        colors: ['#ffc0cb',],
        radius: [4.0, 10.0],
        speed: [0.5, 2.5],
        wind: [-1.5, 1.5],
        blur: 2
    };

    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = { ...BlossomItem.defaultOptions, ...options };
        this.initialize();
    }

    initialize() {
        this.x = Math.random() * this.canvas.offsetWidth;
        this.y = Math.random() * -this.canvas.offsetHeight;
        this.radiusX = BlossomItem.randomBetween(...this.options.radius);
        this.radiusY = this.radiusX * 0.6;
        this.speed = BlossomItem.randomBetween(...this.options.speed);
        this.wind = BlossomItem.randomBetween(...this.options.wind);
        this.color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;
        this.rotation += this.rotationSpeed;

        if (this.y > this.canvas.height || this.x > this.canvas.width || this.x < 0) {
            this.initialize();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radiusX, this.radiusY, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.options.blur;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}


const Blossom = ({ count = 70 }) => {
    const canvasRef = useRef(null);
    let blossoms = [];

    const createBlossoms = () => {
        for (let i = 0; i < count; i++) {
            blossoms.push(new BlossomItem(canvasRef.current));
        }
    };

    useEffect(() => {
        createBlossoms();
        const update = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            blossoms.forEach(blossom => {
                blossom.update();
                blossom.draw(ctx);
            });

            requestAnimationFrame(update);
        };
        update();

        const resize = () => {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="blossom-canvas" />;
};

export default Blossom;
