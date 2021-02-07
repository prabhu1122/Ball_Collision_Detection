//
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');


//create a vector function
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        return { x: this.x, y: this.y };
    }
}


//function to pick an random values
function getRandom(lVal, hVal) {
    return Math.floor(Math.random() * (hVal - lVal) + lVal);
}

function addition(a1, a2) {
    a1.x += a2.x;
    a1.y += a2.y;
}

function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.mass = 1;
    this.v = Math.random() - .5;
    this.pos = new Vector(this.x, this.y);
    this.vel = new Vector(this.v, this.v);
    this.acc = new Vector(0, 0);

    function getRandom(lVal, hVal) {
        let data = Math.floor(Math.random() * (hVal - lVal) + lVal);
        return data;
    }

    function distance(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
    //function to draw a sketch
    this.draw = function() {
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        c.strokeStyle = (100, 100);
        c.stroke();
    };
    //this function is used for rendering the object in frame
    this.update = function() {
        //acceleration
        //this.draw();
        addition(this.vel, this.acc);
        if (this.pos.x + this.radius > innerWidth) {
            this.pos.x = innerWidth - this.radius;
            this.vel.x *= -1;
        }
        if (this.pos.x < this.radius) {
            this.pos.x = this.radius;
            this.vel.x *= -1;
        }
        if (this.pos.y + this.radius > innerHeight) {
            this.pos.y = innerHeight - this.radius;
            this.vel.y *= -.51;
        }
        if (this.pos.y < this.radius) {
            this.pos.y = this.radius;
            this.vel.y *= -1;
        }
        if (this.acc < .1) {
            this.vel = 0;
        }
        addition(this.pos, this.vel);
    };

    //collision detection
    this.collided = function(other) {
        if (distance(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < this.radius + other.radius) {
            return true;
        } else {
            return false;
        }
    };

    //collision resolving
    //Utility functions
    /**
     * Rotates coordinate system for velocities
     *
     * Takes velocities and alters them as if the coordinate system they're on was rotated
     *
     * @param  Object | velocity | The velocity of an individual particle
     * @param  Float  | angle    | The angle of collision between two objects in radians
     * @return Object | The altered x and y velocities after the coordinate system has been rotated
     */

    function rotateAng(velocity, angle) {
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
    this.resolveCollision = function(other) {
        const xVelocityDiff = this.vel.x - other.vel.x;
        const yVelocityDiff = this.vel.y - other.vel.y;

        const xDist = other.pos.x - this.pos.x;
        const yDist = other.pos.y - this.pos.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(other.pos.y - this.pos.y, other.pos.x - this.pos.x);

            // Store mass in var for better readability in collision equation
            const m1 = this.mass;
            const m2 = other.mass;

            // Velocity before equation
            const u1 = rotateAng(this.vel, angle);
            const u2 = rotateAng(other.vel, angle);

            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotateAng(v1, -angle);
            const vFinal2 = rotateAng(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            this.vel.x = vFinal1.x;
            this.vel.y = vFinal1.y;

            other.vel.x = vFinal2.x;
            other.vel.y = vFinal2.y;
        }
    };
}

//creating function to check weather one ball touch another
function distanceCheck(x1, y1, x2, y2, r1, r2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (dist < r1 + r1) {
        return true;
    } else {
        return false;
    }
}

circle = [];        //create a ball array
radius = [];
var no_Of_Ball = 40;
var rad = 16;
let x;
let y;
for (var i = 0; i < no_Of_Ball; i++) {
    //rad = getRandom(5,60);
    x = getRandom(rad, innerWidth - rad);
    y = getRandom(rad, innerHeight - rad);
    if (i !== 0) {
        for (var j = 0; j < circle.length; j++) {
            //check the touch between ball so that they don't overlap on eachother
            if (distanceCheck(x, y, circle[j].pos.x, circle[j].pos.y, rad, radius[j])) {
                //rad = getRandom(5,56);
                rad = rad;
                x = getRandom(rad, innerWidth - rad);
                y = getRandom(rad, innerHeight - rad);
                j = -1;           //call same loop till the new ball got no overlap
            }
        }
    }
    radius.push(rad);
    //store each ball abject into this ball array
    circle.push(new Circle(x, y, radius[i]));
}
//create an animate function
function animate() {
    //animate function
    requestAnimationFrame(animate);
    c.beginPath();
    //clear the background for each frame
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < circle.length; i++) {
        for (var j = 0; j < circle.length; j++) {
            //call collided function to check not to collide
            if (i !== j && circle[i].collided(circle[j])) {
                //if collided then
                circle[i].resolveCollision(circle[j]);
            } else {
                circle[i].acc.y = 0.01;
                circle[j].acc.y = 0.01;
            }
        }
        //for each circles
        circle[i].draw();      //draw function
        circle[i].update();    //update function
    }
}
//call the animate function to perform all
animate();
