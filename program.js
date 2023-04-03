class vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
get zero(){
    return vector2zero();
}
vector2zero(){
    return new vector2(0,0);
}
multiplyByNumber(scalar) {
    return new vector2(this.x * scalar, this.y * scalar)
}
multiplyByVector(vector){
    return new vector2(this.x * vector.x, this.y * vector.y)
}
sumWithVector(vector){
    return new vector2(this.x + vector.x, this.y + vector.y)
}
distance(b){
    return Math.sqrt(Math.pow(this.x - b.x, 2) + Math.pow(this.y - b.y, 2));
}
}
var cnv = document.querySelector("canvas");
cnv.width = window.innerWidth
cnv.height = window.innerHeight- 50
var maxFps = 60;
var ctx = cnv.getContext('2d')
let globalgravityForce = 9.81;

//info panel

let forceDisplayMouse = document.getElementById("forcemousedisplay");
var currentmouseforce = 0;
let mousepos = new vector2(0,0);
let isMouseDown = false;
let mouseForcePorcentage = 90;


//ball configs

var ball = {
velocity: new vector2(0,0),
acceleration: new vector2(0,0),
position: new vector2(300,200),
bounciness: 2.5,
frictionMultiplier: 0.9,
useGravity: true,
mass: 2,
radius: 15
}
let lastuseGravityBool = ball.useGravity;
update();

function gameLoop() {
draw();

// request next frame
setTimeout(gameLoop, 1000/maxFps);
}
window.addEventListener('resize', () => {
cnv.width = window.innerWidth
cnv.height = window.innerHeight - 50
draw();
})
function draw(){
ctx.clearRect(0,0, cnv.width, cnv.height);
ctx.beginPath();
ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI)
ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI)
ctx.fill();

}


function addForce(force){
/*
  
    ball.acceleration += force / ball.mass
    ball.velocity += acceleration
    ball.acceleration = new Vector2(0,0)
*/
//A = F / M
ball.acceleration = ball.acceleration.sumWithVector(divideVector2(force, ball.mass));

ball.velocity = ball.velocity.sumWithVector(ball.acceleration);

ball.acceleration.x = 0;
ball.acceleration.y = 0;
}
function addConstGravForce(){
ball.velocity.y += globalgravityForce / 60;
}
function addImpulseForce(_acceleration, duration){
var impulse = new vector2(_acceleration.x * (duration / Math.sqrt(ball.mass)), _acceleration.y * (duration / Math.sqrt(ball.mass)));
ball.velocity = ball.velocity.sumWithVector(impulse);
currentmouseforce = magVec(impulse);
}
function divideVector2(a,b){
const newX = a.x / b;
const newY = a.y / b;
return new vector2(newX, newY);
}
function magVec(a){
let mag = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
return mag;
}
gameLoop();



document.addEventListener("mousedown", (e) => {
isMouseDown = true;
});
document.addEventListener("mouseup", (e) => {
isMouseDown = false;
});

document.addEventListener("mousemove", (e) => {
mousepos = new vector2(e.x, e.y);
});


// manipulation method
function OutOfCanvas() {
let ballRight = ball.position.x + ball.radius;
let ballLeft = ball.position.x - ball.radius;
let ballBottom = ball.position.y + ball.radius;
let ballTop = ball.position.y - ball.radius;
let canvasRight = cnv.width;
let canvasBottom = cnv.height;



if (ballRight >= canvasRight) {
    ball.position.x = canvasRight - ball.radius;
    addImpulseForce(new vector2(ball.velocity.x * -1, 0), ball.bounciness);
    ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
} else if (ballLeft <= 0) {
    ball.position.x = ball.radius;
    addImpulseForce(new vector2(ball.velocity.x * -1, 0), ball.bounciness);
    ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
}

if (ballBottom >= canvasBottom) {
    ball.position.y = canvasBottom - ball.radius;
    addImpulseForce(new vector2(0, ball.velocity.y * -1), ball.bounciness);
    ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
} else if (ballTop <= 0) {
    ball.position.y = ball.radius;
    addImpulseForce(new vector2(0, ball.velocity.y * -1), ball.bounciness);
    ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
}
}

function update(){
updateDisplay();

    let d = ball.position.distance(mousepos)
    if(isMouseDown){
        if(d < ball.radius){
            ball.useGravity = false;
            ball.velocity = new vector2(0,0)
            ball.position = new vector2(mousepos.x,mousepos.y)
        }else{
            ball.useGravity = lastuseGravityBool
            let direction = new vector2(mousepos.x - ball.position.x,mousepos.y - ball.position.y);
            addImpulseForce(direction, mouseForcePorcentage / globalgravityForce /10000)
        }
    }else{
        ball.useGravity = lastuseGravityBool
    }

    

if(ball.useGravity){
    addConstGravForce();
}

OutOfCanvas();
ball.position = ball.position.sumWithVector(ball.velocity);
setTimeout(update, 1000/60);
}
function updateDisplay(){
if(isMouseDown){
    forceDisplayMouse.style.color = "black";
    forceDisplayMouse.style.top = mousepos.y + "px";
    forceDisplayMouse.style.left = mousepos.x + "px";
    forceDisplayMouse.innerText = (globalgravityForce*  ( currentmouseforce * ball.mass)).toFixed(2) + " KG";
}else{
    forceDisplayMouse.style.top = mousepos.y + "px";
    forceDisplayMouse.style.left = mousepos.x + "px";
    forceDisplayMouse.style.color = "transparent";
}

        
}