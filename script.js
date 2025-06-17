const canvas = document.getElementById("tixyCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 16;
const cellSize = canvas.width / gridSize;

let grid = Array.from({ length: gridSize }, () =>
  Array(gridSize).fill(0)
);

// Optional: decay speed for animations
let fadeSpeed = 0.05;

// DRAW FUNCTION
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const intensity = grid[y][x]; // 0 to 1 for animation

      // Draw cell background (visible grid)
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

      // Fill animated cells
      if (intensity > 0) {
        ctx.fillStyle = `rgba(0, 255, 0, ${intensity})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Fade out over time
        grid[y][x] = Math.max(0, intensity - fadeSpeed);
      }
    }
  }

  requestAnimationFrame(draw);
}

draw();

// HANDLE MOUSE CLICKS
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
    grid[y][x] = 1; // full brightness
  }
});
