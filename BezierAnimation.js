<<<<<<< HEAD
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
=======
class BezierAnimation extends Animation {
	constructor(scene, speed, controlPoints) {
		super(scene);
		this.speed = speed;
		this.P1 = controlPoints[0];
		this.P2 = controlPoints[1];
		this.P3 = controlPoints[2];
		this.P4 = controlPoints[3];

		this.prevCoordinates = this._getCurrentCoordinates(-0.001);

		this.totalDistance = this._getTotalDistance();
		this.totalTime = this.totalDistance / this.speed;
	}

	getTransform(t) {
		if (t > 1) {
			t = 1;
		}
		let currentCoordinates = this._getCurrentCoordinates(t);
		let deltaCoords = currentCoordinates - this.prevCoordinates;

		this.scene.pushMatrix();
			this.scene.loadIdentity();
			this.scene.translate(currentCoordinates[0],
								currentCoordinates[1],
								currentCoordinates[2]);
			let transformMatrix = this.scene.getMatrix();
		this.scene.popMatrix();

		return transformMatrix;
	}

	_getCurrentCoordinates(t) {
		let x = (1 - t*t*t) * this.P1[0]
				+ (3 * t * (1 - t*t)) * this.P2[0]
				+ (3 * t*t * (1 - t)) * this.P3[0]
				+ (t*t*t) * this.P4[0];
		let y = (1 - t*t*t) * this.P1[1]
				+ (3 * t * (1 - t*t)) * this.P2[1]
				+ (3 * t*t * (1 - t)) * this.P3[1]
				+ (t*t*t) * this.P4[1];
		let z = (1 - t*t*t) * this.P1[2]
				+ (3 * t * (1 - t*t)) * this.P2[2]
				+ (3 * t*t * (1 - t)) * this.P3[2]
				+ (t*t*t) * this.P4[2];

		return [x, y, z];
	}

	/**
	 * Estimated distance.
	 */
	_getTotalDistance() {
		let chord = this._getDistance(this.P4, this.P1);
		let controlNet = this._getDistance(this.P1, this.P2)
						+ this._getDistance(this.P2, this.P3)
						+ this._getDistance(this.P3, this.P4);
		return (chord + controlNet) / 2;
	}

	_getDistance(point1, point0) {
		let distance = Math.pow(point1[0] - point0[0], 2);
			distance += Math.pow(point1[1] - point0[1], 2);
			distance += Math.pow(point1[2] - point0[2], 2);
			distance = Math.sqrt(distance);
		return distance;
	}
>>>>>>> ea5b0d8558747996c87341578ccfc203cd484280
}