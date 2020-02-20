var canvas = document.querySelector('canvas');
// searching HTML doc for HTML doc = canvas and assign it

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// loading functions to draw in variable c
var c = canvas.getContext('2d');



// function with Capital letter = js object
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI * 2, false)
        c.stroke();
        c.strokeStyle = '#00bdff';
    }

    this.update = function() {

        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
    
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    
        this.x += this.dx;
        this.y += this.dy;
        
        this.draw();
    }

}



// Creating an array to store the circle i'll be generating
var circleArray = [];



for(var i = 0; i <100; i++){
    var radius = 30;
    // need to adjust for the radius to avoid them spawn outside of the canvas
    var x = Math.random() * (innerWidth-radius * 2) + radius;
    var y = Math.random() * (innerHeight-radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 10; // horizontal velocity
    var dy = (Math.random() - 0.5) * 10; // vertical velocity

    circleArray.push(new Circle(x, y, dx, dy, radius));

}

console.log(circleArray);

// NOTE:
// to instantiate a new object you need to set "new" in front
// var circle = new Circle(200,200,3,3,30);



// creating an animation loop with animate fx
function animate () {
    requestAnimationFrame(animate);
    // clearing the canvas each time we go through this loop
    c.clearRect(0,0,innerWidth, innerHeight)

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
