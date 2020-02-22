// searching HTML doc for HTML doc = canvas and assign it
var canvas = document.querySelector('canvas');


// canvas size to dynamically adjust with the page

// at load time
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// RESPONSIVENESS
// loading functions to draw in variable c
var c = canvas.getContext('2d');

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



// VARIABLES OF THE CANVAS

// defining interaction animation parameters
var maxRadius = 30;
var minRadius = 20;
var area = 50;

var colorArray = [
    '#cc5803',
    '#e2711d',
    '#ff9595',
    '#ffb627',
    '#ffc971',
];



// Random colour generator
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
  }


// OBJECTS IN THE CANVAS

// creating a javascript object for circles
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = radius;
    this.colour = randomColor(colorArray)

    // drawing the circle
    this.draw = function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill()
    }

    // update function for every frame
    this.update = function() {

        // whenever the mouse position is within "area" from the circle - increase radius
        if(mouse.x - this.x < area && mouse.x - this.x > -area && mouse.y - this.y < area && mouse.y - this.y > -area) {
            if (this.radius < maxRadius) {
            this.radius +=1;
        }
    
        } else if (this.radius > this.minRadius) {
        this.radius -=1;
        }

        // setting bounce back via negative velocity when reaches borders
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    
        // this is the commands that triggers the change of frame with delta = dx/dy
        this.x += this.dx;
        this.y += this.dy;
        

        this.draw();
    }

}


// GENERATION OF ARRAY OF CIRCLES (AT FIRST LOAD OR ON RESIZE AS WELL)


// // OPTION 1: 
// // Removing the init() function from startup and resize generated an effect that allows circles to expand in the new window size rather than regenerate


// // creating an array to store the circles that will be generated
// var circleArray = [];


// // generating an array if circle objects
// for(var i = 0; i <800; i++){
//     var radius = Math.random()* 3 + 1;
//     // need to adjust for the radius to avoid them spawn outside of the canvas
//     var x = Math.random() * (innerWidth-radius * 2) + radius;
//     var y = Math.random() * (innerHeight-radius * 2) + radius;
//     var dx = (Math.random() - 0.5) * 5; // horizontal velocity
//     var dy = (Math.random() - 0.5) * 5; // vertical velocity

//     // on every iteration I push the circle in
//     circleArray.push(new Circle(x, y, dx, dy, radius));
// }



// OPTIONAL:
// To re-generate circles on the resized window rather than expanding the existing one 

var circleArray = [];

function init() {

    // resetting the array
    circleArray = [];

    // generate new array of circles filling the bigger window size
    for(var i = 0; i <800; i++){
        var radius = Math.random()* 3 + 1;
        // need to adjust for the radius to avoid them spawn outside of the canvas
        var x = Math.random() * (innerWidth-radius * 2) + radius;
        var y = Math.random() * (innerHeight-radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 5; // horizontal velocity
        var dy = (Math.random() - 0.5) * 5; // vertical velocity
    
        // on every iteration I push the circle in

    
        // NOTE:
        // to instantiate a new object you need to set "new" in front
        // var circle = new Circle(200,200,3,3,30);
        circleArray.push(new Circle(x, y, dx, dy, radius));
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
        circleArray[i].update();
        
    }

}



// EXECUTING THE ANIMATION

init();
animate();