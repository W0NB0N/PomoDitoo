const socket = io(); // Connect to Flask-SocketIO

const gridSize = 16;
const canvas = document.getElementById('pixel-grid');
const ctx = canvas.getContext('2d');
const pixelSize = canvas.width / gridSize;

// Initialize grid
let pixels = Array.from({length: gridSize}, () => Array(gridSize).fill('#000000'));

// function hexToRgb(hex) {
//     hex = hex.replace('#', '');
//     if (hex.length === 3) {
//         hex = hex.split('').map(c => c + c).join('');
//     }
//     const num = parseInt(hex, 16);
//     return [
//         (num >> 16) & 255,
//         (num >> 8) & 255,
//         num & 255
//     ];
// }

// function rgbToHex([r, g, b]) {
//     return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
// }

// function getAverageColor(pixels) {
//     let r = 0, g = 0, b = 0, count = 0;
//     for (let row of pixels) {
//         for (let color of row) {
//             const [cr, cg, cb] = hexToRgb(color);
//             r += cr; g += cg; b += cb;
//             count++;
//         }
//     }
//     return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
// }

// function setGlowColor() {
//     const avgColor = getAverageColor(pixels);
//     const glow = `
//     0 0 80px 24px rgba(${avgColor[0]},${avgColor[1]},${avgColor[2]},0.7),0 0 160px 48px rgba(${avgColor[0]},${avgColor[1]},${avgColor[2]},0.3),0 0 0 8px #222 inset`;
//     canvas.style.boxShadow = glow;
// }

// Update drawGrid to set the glow after drawing
// function drawGrid() {
//     for (let y = 0; y < gridSize; y++) {
//         for (let x = 0; x < gridSize; x++) {
//             ctx.fillStyle = pixels[y][x];
//             ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
//         }
//     }
//     // setGlowColor();
// }

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gap = 4; // Space between pixels
    const pixelInnerSize = pixelSize - gap;
    const radius = pixelInnerSize / 4; // Rounded corners

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const px = x * pixelSize + gap / 2;
            const py = y * pixelSize + gap / 2;
            ctx.save();
            ctx.beginPath();
            // Rounded rectangle for vintage look
            ctx.moveTo(px + radius, py);
            ctx.lineTo(px + pixelInnerSize - radius, py);
            ctx.quadraticCurveTo(px + pixelInnerSize, py, px + pixelInnerSize, py + radius);
            ctx.lineTo(px + pixelInnerSize, py + pixelInnerSize - radius);
            ctx.quadraticCurveTo(px + pixelInnerSize, py + pixelInnerSize, px + pixelInnerSize - radius, py + pixelInnerSize);
            ctx.lineTo(px + radius, py + pixelInnerSize);
            ctx.quadraticCurveTo(px, py + pixelInnerSize, px, py + pixelInnerSize - radius);
            ctx.lineTo(px, py + radius);
            ctx.quadraticCurveTo(px, py, px + radius, py);
            ctx.closePath();

            // Glow effect
            ctx.shadowColor = pixels[y][x];
            ctx.shadowBlur = 16;

            ctx.fillStyle = pixels[y][x];
            ctx.fill();

            ctx.shadowBlur = 0; // Remove shadow for border
            ctx.strokeStyle = "#222";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.restore();
        }
    }
}

// Listen for pixel updates from Flask
socket.on('update_pixel', ({x, y, color}) => {
    pixels[y][x] = color;
    drawGrid();
});

// Listen for full grid updates
socket.on('update_grid', ({pixels: newPixels}) => {
    pixels = newPixels;
    drawGrid();
});

// Request the current grid state on load
socket.emit('request_grid');
