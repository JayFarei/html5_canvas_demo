// SETTING UP CANVAS

// searching HTML doc for HTML doc = canvas and assign it
var canvas = document.querySelector('canvas');

// loading functions to draw in variable c
var c = canvas.getContext('2d');


// DEFINING RESPONSIVE BEHAVIOUR


// canvas size to dynamically adjust with the page

// at load time
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// calling the canvas adjustment every time the window is resized
window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // reset circle generation on resize
        init();
    }
)


// INTERACTIVITY INPUTS

// interaction using event listener

var mouse = {
    x: undefined, y: undefined
}

window.addEventListener('mousemove', 
function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});


// VARIABLES FOR THE ANIMATION

// defining interaction animation parameters

var basisRadius = 10;
var randomSizeMultiple = 5;
var numberCircles = 200;
var speedMultiple = 10;
// var area = 50;
var colorArray = [
    '#DD614A',
    '#F48668',
    '#F4A698',
    '#C5C392',
    '#73A580',
];



// Random colour generator
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }


// OBJECTS IN THE CANVAS

// creating a javascript object for circles
function Circle(x, y, velocity, radius,mass) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.radius = radius;
    this.colour = randomColor(colorArray)
    this.mass = mass; // hardcoded mass for elastic collision function

    // drawing the circle
    this.draw = function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill()
    }

    // update function for every frame
    this.update = function() {

        // COLLISION DETECTION

        // Walls of the canvas
        // setting bounce back via negative velocity when reaches borders
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.velocity.x = -this.velocity.x;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }
    
        // this is the commands that triggers the change of frame with delta = dx/dy
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Other circles

        for (let i = 0; i < circleArray.length; i++) {
            if(this === circleArray[i]) {
                continue }; // ensuring I am not calculating collision with itself
            if(getDistance(this.x,this.y,circleArray[i].x,circleArray[i].y) 
                - this.radius - circleArray[i].radius < 0 ) {
                    console.log ("frame collisions"); // printing collision detection
                    resolveCollision(this, circleArray[i]); // computing new velocity upon collision
                }

        }

        this.draw();
    }

}


// ELASTIC COLLISION FUNCTION 
/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

// CALCULATE DISTANCE BETWEEN TWO COORDINATES 

function getDistance (x1,y1,x2,y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}



// GENERATION OF ARRAY OF CIRCLES 
// To re-generate circles on the resized window rather than expanding the existing one 

var circleArray = [];

function init() {

    circleArray = [];

    // generate new array of circles filling the bigger window size
    for ( var i = 0; i < numberCircles; i++){
        var radius = Math.random() * randomSizeMultiple + basisRadius;
        // need to adjust for the radius to avoid them spawn outside of the canvas
        var x = Math.random() * (innerWidth-radius * 2) + radius;
        var y = Math.random() * (innerHeight-radius * 2) + radius;

        var velocity = {
            x: (Math.random() - 0.5) * speedMultiple, // horizontal velocity 
            y: (Math.random() - 0.5) * speedMultiple // vertical velocity
        }

        var mass = 1;
    
        // if generation overlaps - regenerate x and y coordinates
        if (i != 0) {
            for (let j = 0; j < circleArray.length; j++) {
                if( getDistance(x,y,circleArray[j].x,circleArray[j].y) 
                    - radius - circleArray[j].radius < 0 ) {
                        var x = Math.random() * (innerWidth-radius * 2) + radius;
                        var y = Math.random() * (innerHeight-radius * 2) + radius;
                        
                        j = -1; // to get the loop to start again

                }
                    
            }

        }

        // NOTE:
        // to instantiate a new object you need to set "new" in front
        // var circle = new Circle(200,200,3,3,30);
        circleArray.push(new Circle(x, y, velocity, radius,mass));
    }

}


// ANIMATION ON EACH FRAME

// creating a function to create an animation loop
function animate () {
    // this is the framework function that calls for the next frame
    requestAnimationFrame(animate);
    // clearing the canvas each time we go through this loop to avoid "trail" effect
    c.clearRect(0,0,innerWidth, innerHeight)

    // For every circle object in array - get me the next frame using the .update() fn of the obj.
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update(circleArray);
    }


}

// EXECUTING THE ANIMATION

init();
animate();