const { randomColor } = require("./utils");

const MAX_BALL_RADIUS = 24;
const MAX_SPEED = 10;

class Ball {
  constructor(boundW, boundH) {
    this.boundH = boundH;
    this.boundW = boundW;

    this.color = randomColor();
    this.x = Math.random() * boundW;
    this.y = Math.random() * boundH;
    this.dx = Math.random() * 2 * MAX_SPEED - MAX_SPEED;
    this.dy = Math.random() * 2 * MAX_SPEED - MAX_SPEED;
    this.radius = Math.random() * MAX_BALL_RADIUS + 5;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} canvasContext
   */
  move(canvasContext) {
    // collides on the vertical edges
    if (this.x + this.dx < 0 || this.boundW < this.x + this.dx) {
      this.dx *= -1;
    }

    // collides on the horizontal edges
    if (this.y + this.dy < 0 || this.boundH < this.y + this.dy) {
      this.dy *= -1;
    }

    this.x += this.dx;
    this.y += this.dy;

    canvasContext.fillStyle = this.color;
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    canvasContext.fill();
  }
}

module.exports = Ball;
