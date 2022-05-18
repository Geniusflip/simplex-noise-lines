import simplexNoise from 'https://cdn.skypack.dev/simplex-noise';

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

const ROWS = 60, COLUMNS = 150, LENGTH = 30;
ctx.canvas.height = HEIGHT;
ctx.canvas.width = WIDTH;

ctx.setTransform(1,0,0,1,0,0);

const simplex = new simplexNoise();

const generateRange = (range) => Array.from({length: range});
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = 'white';

const resetCanvas = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

const drawLine = (pos, deg) => {
    ctx.moveTo(pos[0], pos[1]);
    ctx.quadraticCurveTo(
        pos[0] + (Math.cos(deg) * 2),
        pos[1] + (Math.sin(deg) * 2),
        pos[0] + (Math.sin(deg) * LENGTH),
        pos[1] + (Math.cos(deg) * LENGTH),
    );
}
const getRandom256 = () => Math.floor(Math.random() * 256);
const r = getRandom256(), g = getRandom256(), b = getRandom256();

const mMult = Math.floor(Math.random() * 1000)

const get3D = (x, y, t) => simplex.noise3D(x, y, t);
const get256 = (str) => (parseInt(str, 10) < 256 ? parseInt(str, 10).mod(256) : (256 - parseInt(str, 10)).mod(256)) || 255 ;
const drawMatrix = (columns = COLUMNS, rows = ROWS ) => {
    generateRange(columns).forEach((_, m) => {
        generateRange(rows).forEach((_, n) => {
            const t = new Date().getTime() / 10000;
            const color = get256(get3D(m / 5 , n / 5, t / 2) * 255);
            ctx.beginPath();
            
            const x = ((WIDTH / columns) * m);
            const y = ((HEIGHT / rows) * n);
            const multiplier = 10;
            const xCoord = x + get3D(x, y, t) * multiplier;
            const yCoord = y + get3D(x, y,t) * multiplier;
            const deg = simplex.noise3D(m / mMult , n /mMult , t / 10) * 20;

            const gradient = ctx.createLinearGradient(xCoord, yCoord, xCoord + (Math.sin(deg) * LENGTH), yCoord + (Math.cos(deg) * LENGTH));
            // gradient.addColorStop(0.5, `rgba(${get256(color + r)}, ${get256(color + g)},${get256(color + b)}, 0.8)`);
            const opacity = `${Math.sin(parseFloat(Math.abs(simplex.noise3D(m  /2 , n * 2 , t  ))).toFixed(5)) / 2 + 0.5}`;
            gradient.addColorStop(0.8, `rgba(${get256(color + r)}, ${get256(color + g)},${get256(color + b)}, ${opacity}`);
            gradient.addColorStop(1, `rgba(${get256(color + r)}, ${get256(color + g)},${get256(color + b)}, 0.1)`);
            ctx.strokeStyle = gradient


            drawLine([xCoord, yCoord], deg);
            ctx.stroke();
        })
    })
}


const draw = () => {
    resetCanvas();
    drawMatrix();
    setTimeout(() => requestAnimationFrame(draw), 60);
}

requestAnimationFrame(draw);
