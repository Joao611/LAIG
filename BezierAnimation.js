 /*
 * BezierAnimation
 * @constructor
 */
var degToRad = Math.PI / 180;

class BezierAnimation extends Animation {
	constructor(scene, speed, controlPoints) {
	super(scene);

		this.speed=speed;
		this.controlPoints = controlPoints;
		this.p1 = this.controlPoints[0];
    	this.p2 = this.controlPoints[1];
    	this.p3 = this.controlPoints[2];
    	this.p4 = this.controlPoints[3];

	this.scene.pushMatrix();
       	this.scene.loadIdentity();
       	this.scene.translate(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]);
    	this.transformMatrix = this.scene.getMatrix();
    this.scene.popMatrix();
	}
}

BezierAnimation.prototype.getTransform = function(t) {


    if(t < 1){
        this.time += 0.01*this.speed;
        let point = this.pointCalculator(t);
        let angle = Math.atan((point[0]-this.lastPoint[0]) / (point[2]-this.lastPoint[2])) + (point[2]-this.lastPoint[2]);
			if (angle < 0){
				angle = Math.PI;
			}
			else{
				angle = 0;
			}
       
        this.lastPoint = point;
        this.scene.pushMatrix();
        	this.scene.translate(point[0], point[1], point[2]);
        	this.scene.rotate(this.angle, 0, 1, 0);
        	this.transformMatrix = this.scene.getMatrix();
        this.scene.popMatrix();
    }

    this.startTime = currTime;
   	return this.transformMatrix;
}




BezierAnimation.prototype.pointCalculator = function(time){
    let x = Math.pow(1 - time, 3) * this.p1[0] + 3 * time * Math.pow(1 - time, 2) * this.p2[0] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[0] + Math.pow(time, 3) * this.p4[0];
    let y = Math.pow(1 - time, 3) * this.p1[1] + 3 * time * Math.pow(1 - time, 2) * this.p2[1] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[1] + Math.pow(time, 3) * this.p4[1];
    let z = Math.pow(1 - time, 3) * this.p1[2] + 3 * time * Math.pow(1 - time, 2) * this.p2[2] + 3 * Math.pow(time, 2) * (1 - time) * this.p3[2] + Math.pow(time, 3) * this.p4[2];
    return vector3(x, y, z);
}