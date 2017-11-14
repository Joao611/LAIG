/**
 * BezierAnimation
 * @constructor
 * @param controlPoints Array with 3D points (arrays with 3 elements).
 * @param speed 3D units per second.
 */
class BezierAnimation extends Animation {
	constructor(scene, controlPoints, speed) {
		super(scene);
		this.controlPoints = controlPoints;
		this.speed = speed;
		this.elapsedDistance = 0;

		this.totalDistance = getTotalDistance(this.controlPoints);
		this.totalTime = this.totalDistance / this.speed;

		this.scene.pushMatrix();
        	this.scene.loadIdentity();
        	this.transformMatrix = this.scene.getMatrix();
    	this.scene.popMatrix();
	}
}





BezierAnimation.prototype.getTransform = function(t) {
    let traveledDistance = t * this.totalDistance;
    this.distanceAccumulator = 0;
    let tInPortion = -1;
    let currentMatrix = [];
    for (let i = 1; i < this.controlPoints.length; i++) {
    	let portionLength = getDistance(this.controlPoints[i-1], this.controlPoints[i]);
		if (this.elapsedDistance + portionLength < traveledDistance) {
			this.catchUp(this.controlPoints[i], this.controlPoints[i - 1]);
			this.elapsedDistance += portionLength;
			this.distanceAccumulator += portionLength;
			continue;
		}

		let distanceInPortion = traveledDistance - this.distanceAccumulator;
		if (distanceInPortion > portionLength) {
			distanceInPortion = portionLength;
		}
		this.elapsedDistance += distanceInPortion;
		let tInPortion = distanceInPortion / portionLength;
		return this.applyCurrent(tInPortion, this.controlPoints[i], this.controlPoints[i - 1]);
    }
};


function getDistance(point1, point0) {
	let distance = Math.pow(point1[0] - point0[0], 2);
		distance += Math.pow(point1[1] - point0[1], 2);
		distance += Math.pow(point1[2] - point0[2], 2);
		distance = Math.sqrt(distance);
	return distance;

}


function getTotalDistance(controlPoints) {
	let distance = 0;
	for (let i = 1; i < controlPoints.length; i++) {
		distance += getDistance(controlPoints[i], controlPoints[i - 1]);
	}
	return distance;
}












MyTorpedo.prototype.updateTorpedo = function(currTime)
{
	this.t += this.delta;

	var m1 = Math.pow(1 - this.t, 3);
	var m2 = 3 * this.t * Math.pow(1 - this.t, 2);
	var m3 = 3 * Math.pow(this.t, 2) * (1 - this.t);
	var m4 = Math.pow(this.t, 3);
	var p1 = {x: this.start_x, y: this.start_y, z: this.start_z};
	var p2 = {x: this.start_x + 6 * -Math.sin(this.start_rotation * this.radunit), y: this.start_y, z: this.start_z + 6 * -Math.cos(this.start_rotation * this.radunit)};
	var p3 = {x: this.target.pos_x, y: this.target.pos_y + 3, z: this.target.pos_z};
	var p4 = {x: this.target.pos_x, y: this.target.pos_y, z: this.target.pos_z};

	var old_pos_x = this.pos_x;
	var old_pos_y = this.pos_y;
	var old_pos_z = this.pos_z;

	this.pos_x = m1 * p1.x + m2 * p2.x + m3 * p3.x + m4 * p4.x;
	this.pos_y = m1 * p1.y + m2 * p2.y + m3 * p3.y + m4 * p4.y;
	this.pos_z = m1 * p1.z + m2 * p2.z + m3 * p3.z + m4 * p4.z;

	var delta_x = this.pos_x - old_pos_x;
	var delta_y = this.pos_y - old_pos_y;
	var delta_z = this.pos_z - old_pos_z;

	this.pos_rotation = delta_x / Math.abs(delta_x) * Math.acos(delta_z / Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_z, 2)));
	this.pos_angle = Math.asin(-delta_y / Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2) + Math.pow(delta_z, 2)));

	if (this.t >= 1)
		this.delta = 0;
}
