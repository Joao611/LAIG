/**
 * LinearAnimation
 * @constructor
 * @param controlPoints Array with 3D points (arrays with 3 elements).
 * @param speed 3D units per second.
 */
class LinearAnimation extends Animation {
	constructor(scene, controlPoints, speed) {
		super(scene);
		this.controlPoints = controlPoints;
		this.speed = speed;
		this.elapsedDistance = 0;
		this.rotated = false;
	
		this.totalDistance = getTotalDistance(this.controlPoints);
		this.totalTime = this.totalDistance / this.speed;

		this.scene.pushMatrix();
        	this.scene.loadIdentity();
        	this.transformMatrix = this.scene.getMatrix();
    	this.scene.popMatrix();
	}
}

/**
 * TODO: Save previous translations instead of recalculating them.
 */
LinearAnimation.prototype.getTransform = function(t) {
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

function getXZOrientation(point1, point0) {
	let z = point1[2] - point0[2];
	let x = point1[0] - point0[0];
	if (z == 0) {
		return Math.PI / 2;
	} else {
		return Math.atan(x/z);
	}
}

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

LinearAnimation.prototype.catchUp = function(endControlPoint, startControlPoint) {
	this.scene.pushMatrix();
		this.scene.setMatrix(this.transformMatrix);
		let transX = endControlPoint[0] - startControlPoint[0];
		let transY = endControlPoint[1] - startControlPoint[1];
		let transZ = endControlPoint[2] - startControlPoint[2];
		this.scene.translate(transX, transY, transZ);
		this.transformMatrix = this.scene.getMatrix();
	this.scene.popMatrix();
}

LinearAnimation.prototype.applyCurrent = function(tInPortion, endControlPoint, startControlPoint) {
	this.scene.pushMatrix();
		this.scene.setMatrix(this.transformMatrix);
		let transX = tInPortion * (endControlPoint[0] - startControlPoint[0]);
		let transY = tInPortion * (endControlPoint[1] - startControlPoint[1]);
		let transZ = tInPortion * (endControlPoint[2] - startControlPoint[2]);
		this.scene.translate(transX, transY, transZ);
		let angle = getXZOrientation(endControlPoint, startControlPoint);
		this.scene.rotate(angle, 0, 1, 0);
		let resultMatrix = this.scene.getMatrix();
	this.scene.popMatrix();

	return resultMatrix;
}