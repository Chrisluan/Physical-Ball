export class vector2{
    constructor(x = 0,y = 0){
        this.x = x;
        this.y = y;
    }
get zero(){
    return this.vector2zero();
}
get mag(){
    return this.getmag();
}
getmag(){
    let mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return mag;
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
 divideVector2(b){
    const newX = this.x / b;
    const newY = this.y / b;
    return new vector2(newX, newY);

}
add(other) {
    return new vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new vector2(this.x - other.x, this.y - other.y);
  }

  scale(scalar) {
    return new vector2(this.x * scalar, this.y * scalar);
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    if (length !== 0) {
      return new vector2(this.x / length, this.y / length);
    }
    return new vector2(0, 0);
  }
  // Retorna uma cópia do vetor
  clone() {
    return new vector2(this.x, this.y);
}

// Subtrai outro vetor deste vetor e retorna o resultado como um novo vetor
sub(other) {
    return new vector2(this.x - other.x, this.y - other.y);
}
  // Dot product
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }
  
  // Cross product
  cross(other) {
    return this.x * other.y - this.y * other.x;
  }
  
  
  // Angle between this vector and another vector (in radians)
  angleTo(other) {
    return Math.acos(this.dot(other) / (this.mag * other.mag));
  }
  
  // Rotate the vector by an angle (in radians) around the origin
  rotate(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
}
