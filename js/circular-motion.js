// SETTING UP CANVAS

// searching HTML doc for HTML doc = canvas and assign it
var canvas = document.querySelector("canvas");

// loading functions to draw in variable c
var c = canvas.getContext("2d");

// DEFINING RESPONSIVE BEHAVIOUR

// canvas size to dynamically adjust with the page

// at load time
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// calling the canvas adjustment every time the window is resized
window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // reset circle generation on resize
  init();
});

// INTERACTIVITY INPUTS

// plotting mouse at the center at load time

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// FUNCTIONS FOR THE ANIMATION

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

// VARIABLES FOR THE ANIMATION

// Setting colours of the animation
const colors = ["#00bdff", "#4d39ce", "#088eff"];

// OBJECTS IN THE CANVAS

// creating a javascript object for particles of the animation
class particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // to make sure the spawn is different, get a random value anywhere from 0 to Pi*2 -> which is the entire travel of a circle
    this.radians = Math.random() * Math.PI * 2;
    this.velocity = 0.05;
    // to ensure the dot stays on the circle rather than being randomly generated every time
    this.distanceFromCenter = randomIntFromRange(5, 120);
    this.lastMouse = {
      x: x,
      y: y
    }; // where the last known location is known to start

    this.update = () => {
      // before the loop start - I am logging the previous location
      const lastPoint = {
        x: this.x,
        y: this.y
      };
      // x is the original position / adding the radians cos (between -1 & 1) / need to move it over time => velocity
      // += => increase by / seems to save me a loop
      this.radians += this.velocity;

      // Draft effect
      const dragEffect = 0.05;
      this.lastMouse.x += (mouse.x - this.lastMouse.x) * dragEffect;
      this.lastMouse.y += (mouse.y - this.lastMouse.y) * dragEffect;

      // circular motion // added the drag with last mouse location
      this.x =
        this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
      this.y =
        this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
      //console.log(innerWidth)
      this.draw(lastPoint); // pass it as an argument to draw
      // to troubleshoot use console.log() and open the console in the browser
    };

    this.draw = lastPoint => {
      c.beginPath();
      c.strokeStyle = this.color;
      c.lineWidth = this.radius;
      // coordinates for particle previous frame (I had to create it in the update function)
      c.moveTo(lastPoint.x, lastPoint.y);
      // coordinates for particle next frame / new location
      c.lineTo(this.x, this.y);
      c.stroke();
      c.closePath();
    };
  }

  update() {
    this.draw();
  }
}

let particles;

function init() {
  particles = [];

  for (let i = 0; i < 50; i++) {
    // adding random size of particles
    const radius = 1 + Math.random() * 2;
    particles.push(
      new particle(
        canvas.width / 2,
        canvas.width / 2,
        radius,
        randomColor(colors)
      )
    );
  }
}

// ANIMATION ON EACH FRAME

// creating a function to create an animation loop
function animate() {
  requestAnimationFrame(animate);
  // for each frame we are drawing a new white rectangular on top of it with transparency, as we lay more on top of each other we start having this effect
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // need to have a look at the options available
  particles.forEach(particle => {
    particle.update();
  });
}

// EXECUTING THE ANIMATION

init();
animate();
