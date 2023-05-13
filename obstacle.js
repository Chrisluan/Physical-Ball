import { balls } from "./program.js";
import { vector2 } from "./vector.js";
var ctx = document.querySelector("canvas").getContext('2d')
export class cube{
    
    constructor(position = new vector2(0,0),width = 50, height = 50, filled = false){
        this.width = width;
        this.height = height;
        this.filled = filled;
        this.position = position;
    }
    draw(){
        if(this.filled){
            ctx.beginPath()
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
            ctx.closePath()
        }
        ctx.beginPath()
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
        this.calculateCol();
        ctx.closePath()
    }
    calculateCol(){
        // Calculate the closest point on the square to the center of the circle
        balls.forEach((ball) => {
            let closestX = Math.max(this.position.x, Math.min(ball.position.x, this.position.x + this.width));
  let closestY = Math.max(this.position.y, Math.min(ball.position.y, this.position.y + this.height));

  // Calculate the distance between the center of the circle and the closest point on the square
  let distanceX = ball.position.x - closestX;
  let distanceY = ball.position.y - closestY;
  let distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // If the distance is less than the radius of the circle squared, a collision has occurred
  if (distanceSquared < ball.radius * ball.radius) {
    // Determine which side of the square was collided with
    let left = closestX === this.position.x;
    let right = closestX === this.position.x + this.width;
    let top = closestY === this.position.y;
    let bottom = closestY === this.position.y + this.height;

    if (left) {
        ball.position.x = closestX - ball.radius;
        ball.addImpulseForce(new vector2(ball.velocity.x * -1, 0), ball.bounciness);
        ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
    } else if (right) {
        ball.position.x = closestX + ball.radius;
        ball.addImpulseForce(new vector2(ball.velocity.x * -1, 0), ball.bounciness);
        ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
    } else if (top) {
        ball.position.y = closestY - ball.radius;
        ball.addImpulseForce(new vector2(0, ball.velocity.y * -1), ball.bounciness);
        ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
    } else if (bottom) {
        ball.position.y = closestY + ball.radius;
        ball.addImpulseForce(new vector2(0, ball.velocity.y * -1), ball.bounciness);
        ball.velocity = ball.velocity.multiplyByNumber(ball.frictionMultiplier);
    } else {
        
    }
 }
        })
  
}

}