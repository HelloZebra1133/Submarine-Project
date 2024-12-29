const submarine = document.getElementById("submarine");
const obstacle = document.getElementById("obstacle");
const angleInput = document.getElementById("angle-input");
const submitAngle = document.getElementById("submit-angle");
const message = document.getElementById("message");

let obstaclePosition = { x: 700, y: 200 };
let submarinePosition = { x: 0, y: 0 };
let obstacleSafeRange = 50;
let isMoving = false;

function updateObstacle() {
  const randomY = Math.random() * 350;
  obstaclePosition.y = randomY;
  obstacle.style.top = `${randomY}px`;
}

const submarineCircle = document.getElementById("submarine-circle");

function moveSubmarineTo(angle) {
  const radian = (angle * Math.PI) / 180;
  
  // Move 50px in the desired direction (based on angle)
  const stepDistance = 75; // Distance the submarine will move in one step (50px)
  const targetX = submarinePosition.x + stepDistance * Math.cos(radian);
  const targetY = submarinePosition.y - stepDistance * Math.sin(radian);

  // Subtract submarine's width and height from the max X and Y to ensure it stays within the screen
  const maxX = 800 - submarine.offsetWidth;
  const maxY = 400 - submarine.offsetHeight;

  // Ensure the submarine stays within the bounds
  const boundedX = Math.min(maxX, Math.max(0, targetX));
  const boundedY = Math.min(maxY, Math.max(0, targetY));

  let stepX = (boundedX - submarinePosition.x) / 50;
  let stepY = (boundedY - submarinePosition.y) / 50;

  let steps = 0;
  isMoving = true;

  const initialX = submarinePosition.x;
  const initialY = submarinePosition.y;

  const interval = setInterval(() => {
    if (steps >= 50) {
      clearInterval(interval);
      submarinePosition = { x: boundedX, y: boundedY };
      checkCollision();
      isMoving = false;
      return;
    }

    submarinePosition.x += stepX;
    submarinePosition.y += stepY;
    submarine.style.transform = `translate(${submarinePosition.x}px, ${submarinePosition.y}px)`;

    // Update the circle radius (always 50px because each move is 50px)
    submarineCircle.style.width = `150px`;
    submarineCircle.style.height = `150px`;
    submarineCircle.style.left = `${submarinePosition.x + submarine.offsetWidth / 2}px`;
    submarineCircle.style.top = `${submarinePosition.y + submarine.offsetHeight / 2}px`;

    steps++;
  }, 10);
}

function checkCollision() {
  const distance = Math.sqrt(
    Math.pow(submarinePosition.x - obstaclePosition.x, 2) +
      Math.pow(submarinePosition.y - obstaclePosition.y, 2)
  );

  if (distance <= obstacleSafeRange) {
    message.textContent = "Collision! Try again.";
    setTimeout(resetSubmarine, 1000);
  } else {
    message.textContent = "Success! Moving to the next obstacle.";
    setTimeout(() => {
      updateObstacle();
    }, 1000);
  }
}

function resetSubmarine() {
  submarinePosition = { x: 10, y: 380 };
  submarine.style.transform = `translate(${submarinePosition.x}px, ${submarinePosition.y}px)`;
  updateObstacle();
}

submitAngle.addEventListener("click", () => {
  if (isMoving) {
    message.textContent = "Wait for the current movement to finish.";
    return;
  }

  const angle = parseInt(angleInput.value, 10);
  if (isNaN(angle) || angle < 0 || angle > 360) {
    message.textContent = "Please enter a valid angle between 0 and 360.";
    return;
  }

  message.textContent = "";
  moveSubmarineTo(angle);
});

// Initialize game
updateObstacle();
