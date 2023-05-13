import { cube } from "./obstacle.js";
import { vector2 } from "./vector.js";
import { circle } from "./PhysicalObject.js";

const cnv = document.querySelector("canvas");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
const maxFps = 60;
const ctx = cnv.getContext('2d');

const ballamount = 300;

export const balls = [
//new circle(new vector2(), new vector2(), new vector2(cnv.width / 2, cnv.height / 2), 5, 0.9, false, false, 500, 20),
//new circle(new vector2(), new vector2(), new vector2(500, 500), 5, 0.9, false, true, 15, 10),
];

const blocks = [
new cube(new vector2(Math.random() * cnv.width, Math.random() * cnv.height), 250, 350, true),
new cube(new vector2(Math.random() * cnv.width, Math.random() * cnv.height), 250, 350, false),
];

function gameLoop() {
draw();
setTimeout(gameLoop, 1000 / maxFps);
}

let clear = true;

function draw() {
update();
if (clear) {
ctx.clearRect(0, 0, cnv.width, cnv.height);
}

balls.forEach((b) => {
b.draw(balls);
});
}

gameLoop();

window.addEventListener("load", start);

window.addEventListener("keydown", (e) => {
if (e.code === "Space") {
clear = !clear;
}
});

function start() {
for (let i = 0; i < ballamount; i++) {
const ball = new circle();
ball.position = new vector2(Math.random() * cnv.width, Math.random() * cnv.height);
ball.radius = Math.floor(Math.random() * 1) + 5;
ball.mass = Math.floor(Math.random() * 50) + 5;
balls.push(ball);

}
}

function update() {
balls.forEach((b) => {
b.getAttracted(balls);
b.getAffectedByMouse();
b.applyPhysics();
b.collideWithSimilar(balls);
b.OutOfCanvas();
});
}



window.addEventListener('resize', () => {
cnv.width = window.innerWidth;
cnv.height = window.innerHeight + 2;
draw();
});