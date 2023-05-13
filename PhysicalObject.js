import { vector2 } from "./vector.js";
var cnv = document.querySelector("canvas");
var ctx = cnv.getContext('2d')
var collisionAmount = 0;
let amountOfClicks = 0
let currentmouseforce;
let forceDisplayMouse = document.getElementById("forcemousedisplay");
let mousepos = new vector2(0,0);
let isMouseDown = false;
let mousemass = 50;
let gravconst = 0.0667;
    document.addEventListener("mousedown", (e) => {
        isMouseDown = true;
    });
    document.addEventListener("mouseup", (e) => {
        isMouseDown = false;
        
    });
    
    document.addEventListener("mousemove", (e) => {
    mousepos = new vector2(e.x, e.y);
    });
export class circle{
    constructor(
    velocity = new vector2(0,0),
    acceleration = new vector2(0,0),
    position = new vector2(cnv.width / 2,cnv.height  /2 ),
    direction = new vector2(0,0),
    bounciness = 10,
    frictionMultiplier = 0.87,
    useGravity = true,
    applyInercia = true,
    mass = 30,
    radius = 20
    ){
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.position = position
        this.direction = direction
        this.bounciness = bounciness
        this.frictionMultiplier = frictionMultiplier
        this.useGravity = useGravity
        this.mass = mass
        this.radius = radius
        this.applyInercia = applyInercia
    }
    
    collideWithSimilar(balls = []){
        
        let collided = false;
        balls.forEach(ball => {
            if (ball != this && !collided) {
                if (ball !== this) {
                    const distance = this.position.distance(ball.position);
                    const combinedRadius = this.radius + ball.radius;
        
                    if (distance < combinedRadius) {
                        const normal = this.position.subtract(ball.position).normalize();
                        const relativeVelocity = this.velocity.subtract(ball.velocity);
                        const speedAlongNormal = relativeVelocity.dot(normal);
        
                        if (speedAlongNormal < 0) {
                            const impulse = (-(1 + ball.frictionMultiplier) * speedAlongNormal) / (1 / this.mass + 1 / ball.mass);
                            const impulseVector = normal.scale(impulse);
        
                            this.velocity = this.velocity.add(impulseVector.scale(1 / this.mass));
                            ball.velocity = ball.velocity.subtract(impulseVector.scale(1 / ball.mass));
                        }
                    }
                }
            }
        
            
        });
    }
    initialVel(balls = []){
        balls.forEach(a => {
            let b = this
            if (a != b) {
                const m2 = b.mass;
                const r = a.position.distance(b.position);
                const dir = a.position.clone().sub(b.position);
                this.velocity.x += dir.x * Math.sqrt((gravconst * m2) / r);
                this.velocity.y += dir.x * Math.sqrt((gravconst * m2) / r);
                b.lookAt(a)
              }
           
        });
    }
    draw(balls = []){
        
        
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2* Math.PI)
        ctx.fill();
        ctx.beginPath();

        
        ctx.stroke()
    }
    applyPhysics(){
        if(this.applyInercia)
        this.position = this.position.sumWithVector(this.velocity);
        if(this.velocity.mag > 1){
            //console.log(this.velocity.mag * 3.6 * 1000)
        }
    }
    applyGravity(gravityForce){
        this.velocity.y += gravityForce / 60;
    }
    randomImpulse(forceMultiplier = 20){
        this.addImpulseForce(new vector2(Math.random() * (forceMultiplier - (-forceMultiplier)) + (-forceMultiplier), (Math.random() * -forceMultiplier)), 2)
    }
    addForce(force = new vector2().zero){
        /*
          
            this.acceleration += force / this.mass
            this.velocity += acceleration
            this.acceleration = new Vector2(0,0)
        */
        //A = F / M
        this.acceleration = this.acceleration.sumWithVector(force.divideVector2(this.mass));
        
        this.velocity = this.velocity.sumWithVector(this.acceleration);
        currentmouseforce = this.acceleration.mag
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        }
    getAttracted(balls = []){
        balls.forEach(b=>{
            if(b != this && b != null || b.position != this.position){
                
                let direction = new vector2(b.position.x - this.position.x,b.position.y - this.position.y );
                const gravforce = gravconst * (this.mass * b.mass / Math.pow(direction.mag,2))
                this.addForce(direction.multiplyByNumber(gravforce))
            }
            
        })
    }
    addImpulseForce(_acceleration, duration){
        var impulse = new vector2(_acceleration.x * (duration / Math.sqrt(this.mass)), _acceleration.y * (duration / Math.sqrt(this.mass)));
        this.velocity = this.velocity.sumWithVector(impulse);
        this.currentmouseforce = impulse.mag;
    }
    OutOfCanvas() {
        let thisRight = this.position.x + this.radius;
        let thisLeft = this.position.x - this.radius;
        let thisBottom = this.position.y + this.radius;
        let thisTop = this.position.y - this.radius;
        let canvasRight = cnv.width;
        let canvasBottom = cnv.height;
        if (thisRight >= canvasRight) {
            this.position.x = canvasRight - this.radius;
            if(this.velocity.x < 1){
                this.velocity.x += 1 * this.velocity.mag;
            }
            
            this.addImpulseForce(new vector2(this.velocity.x * -1, 0), this.bounciness);
            this.velocity = this.velocity.multiplyByNumber(this.frictionMultiplier);
        } else if (thisLeft <= 0) {
            if(this.velocity.x < 1){
                this.velocity.x -= 1 * this.velocity.mag;
            }
            this.position.x = this.radius;
            this.addImpulseForce(new vector2(this.velocity.x * -1, 0), this.bounciness);
            this.velocity = this.velocity.multiplyByNumber(this.frictionMultiplier);
        }
        
        if (thisBottom >= canvasBottom) {
            this.position.y = canvasBottom - this.radius;
            this.addImpulseForce(new vector2(0, this.velocity.y * -1), this.bounciness);
            this.velocity = this.velocity.multiplyByNumber(this.frictionMultiplier);
        } else if (thisTop <= 0) {
            if(this.velocity.y < 1){
                this.velocity.y -= 1
            }
            this.position.y = this.radius;
            this.addImpulseForce(new vector2(0, this.velocity.y * -1), this.bounciness);
            this.velocity = this.velocity.multiplyByNumber(this.frictionMultiplier);
        }
        }
        
    getAffectedByMouse(){
        
        let d = this.position.distance(mousepos)
    
    
        if(isMouseDown){
            if(d < this.radius){
                
                this.useGravity = false;
                this.velocity = new vector2(0,0)
                this.position = new vector2( mousepos.x, mousepos.y)
                amountOfClicks = 0
        }else{
            amountOfClicks = 0
            
            //this.useGravity = lastuseGravityBool
            let direction = new vector2(mousepos.x - this.position.x,mousepos.y - this.position.y);
            const gravforce = this.mass * mousemass / Math.pow(direction.mag,2)
            
            this.addForce(direction.multiplyByNumber(gravforce))
        }
    }else{
        
        //this.useGravity = lastuseGravityBool
        if(this.useGravity){
           //this.applyGravity();
        }
    }
    
    if(isMouseDown){
        ctx.moveTo(mousepos.x,mousepos.y)
        ctx.lineTo(this.position.x, this.position.y);
    
        ctx.stroke();
    }
    
    }
}
