const canvas = document.getElementById("tixyCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 16;
const cellSize = canvas.width / gridSize;

let t = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  t += 0.05; // Increment time

  for (let i = 0; i < gridSize * gridSize; i++) {
    const x = i % gridSize;
    const y = Math.floor(i / gridSize);

    // Define the animation function 1
    const value = Math.sin(t + x * y);

    // Define the animation function 2
    // const dx = x - gridSize / 2;
    // const dy = y - gridSize / 2;
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // const value = Math.sin(t + distance);

    // Define the animation function 3
    // const value = Math.sin(t + x);


    // Map the value to a size or color
    const radius = (value + 1) * (cellSize / 4); // Normalize value to [0, cellSize/2]

    // Draw the circle
    ctx.beginPath();
    ctx.arc(
      x * cellSize + cellSize / 2,
      y * cellSize + cellSize / 2,
      radius,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "#0f0";
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();
