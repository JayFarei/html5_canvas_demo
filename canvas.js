// searching HTML doc for HTML doc = canvas and assign it
var canvas = document.querySelector('canvas');


// setting on load responsive size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// loading functions to draw in variable c
var c = canvas.getContext('2d');


// interaction using event listener

var mouse = {
    x: undefined, y: undefined
}



window.addEventListener('mousemove', 
function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

// defining interaction animation parameters
var maxRadius = 40;
var minRadius = 2;
var area = 20;

var colorArray = [

]


// creating a javascript object for circles
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    // drawing the circle
    this.draw = function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false)
        c.stroke();
        c.strokeStyle = '#00bdff';
    }

    // setting bounce back via negative velocity when reaches borders
    this.update = function() {

        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    
        // this is the commands that triggers the change of frame with delta = dx/dy
        this.x += this.dx;
        this.y += this.dy;
        

        // whenever the mouse position is within 50 from the circle - increase radius
        if(mouse.x - this.x < area && mouse.x > -area && mouse.y - this.y < area && mouse.y > -area) {
            if (this.radius < maxRadius) {
                this.radius +=1;
            }
            
            
        } else if (this.radius > minRadius) {
            this.radius -=1;
        }


        this.draw();
    }

}






// creating an array to store the circles that will be generated
var circleArray = [];


// generating an array if cicle objects
for(var i = 0; i <100; i++){
    var radius = 30;
    // need to adjust for the radius to avoid them spawn outside of the canvas
    var x = Math.random() * (innerWidth-radius * 2) + radius;
    var y = Math.random() * (innerHeight-radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 5; // horizontal velocity
    var dy = (Math.random() - 0.5) * 5; // vertical velocity

    // on every iteration I push the circle in
    circleArray.push(new Circle(x, y, dx, dy, radius));
}


// NOTE:
// to instantiate a new object you need to set "new" in front
// var circle = new Circle(200,200,3,3,30);



// creating a function to create an animation loop
function animate () {
    // this is the framework function that calls for the next frame
    requestAnimationFrame(animate);
    // clearing the canvas each time we go through this loop
    c.clearRect(0,0,innerWidth, innerHeight)

    // For every circle object in array - get me the next frame using the .update() fn of the obj.
    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
        
    }

}

animate();















// Experiments

// c.fillStyle = 'rgba(255,0,0,0.5)';
// c.fillRect (100,100,50,50);

// c.fillStyle = 'rgba(0,0,255,0.5)';
// c.fillRect (200,300,50,50);


// // Line

// c.beginPath();
// c.moveTo(50,300);
// c.lineTo(300,100);
// c.lineTo(400,300);
// c.strokeStyle = "blue";
// c.stroke();

// // Create Arc/Circle
// c.beginPath();
// // this separates this from the previous path
// c.arc(300,300,30,0,Math.PI * 2, false)
// c.stroke();
// c.strokeStyle = '#00bdff';



// // Randomizing colour selection

// const colors = ['#00bdff','#4d39ce','#038eff']

// function randomColor(colors) {
//     return colors[Math.floor(Math.random() * colors.length)]
//   }

// for(var i=0; i < 300; i++){
//     var x = Math.random() * window.innerWidth ;
//     var y = Math.random() * window.innerHeight ;
//     c.beginPath();
//     c.arc(x,y,30,0,Math.PI * 2, false)
//     c.stroke();
//     c.strokeStyle = randomColor(colors).toString();
//     console.log(randomColor(colors).toString());
// }
