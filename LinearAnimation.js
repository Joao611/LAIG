/**
 * LinearAnimation
 * @constructor
 * @param controlPoints Array with 3D points (arrays with 3 elements).
 * @param speed 3D units per second.
 */
function LinearAnimation(controlPoints, speed) {
	this.controlPoints = controlPoints;
	this.speed = speed;

	this.totalDistance = getTotalDistance(this.controlPoints);
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/**
 * TODO: Save previous translations instead of recalculating them.
 */
LinearAnimation.prototype.getTransform = function(t) {
    let traveledDistance = t * this.totalDistance;
    let distanceAccumulator = 0;
    let tInPortion = -1;
    this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.transformMatrix = this.scene.getMatrix();
    this.scene.popMatrix();
    for (let i = 1; i < this.controlPoints.length; i++) {
    	// get position on current straight segment
        if (distanceAccumulator > traveledDistance) {
            let distanceInPortion = distanceAccumulator - traveledDistance;
            tInPortion = distanceInPortion / getDistance(this.controlPoints[i-1], this.controlPoints[i]);
            this.scene.pushMatrix();
                this.scene.setMatrix(this.transformMatrix);
                let transX = tInPortion * this.controlPoints[i][0] - this.controlPoints[i - 1][0];
                let transY = tInPortion * this.controlPoints[i][1] - this.controlPoints[i - 1][1];
                let transZ = tInPortion * this.controlPoints[i][2] - this.controlPoints[i - 1][2];
                this.scene.translate(transX, transY, transZ);
                let angle = getXZOrientation(controlPoints[i], controlPoints[i - 1]);
                this.scene.rotate(angle, 0, 1, 0);
                this.transformMatrix = this.scene.getMatrix();
            this.scene.popMatrix();
            break;
        }
  		// catch up on previous control points
        distanceAccumulator += getDistance(this.controlPoints[i-1], this.controlPoints[i]);
        this.scene.pushMatrix();
            this.scene.setMatrix(this.transformMatrix);
            let transX = this.controlPoints[i][0] - this.controlPoints[i - 1][0];
            let transY = this.controlPoints[i][1] - this.controlPoints[i - 1][1];
            let transZ = this.controlPoints[i][2] - this.controlPoints[i - 1][2];
            this.scene.translate(transX, transY, transZ);
            this.transformMatrix = this.scene.getMatrix();
        this.scene.popMatrix();
    }

};

function getXZOrientation(point1, point0) {
	let z = point1[2] - point0[2];
	let x = point1[0] - point0[0];
	return Math.atan(z/x);
}

function getDistance(point1, point0) {
	let distance = Math.pow(point1[0] - point0[0], 2);
		distance += Math.pow(point1[1] - point0[1], 2);
		distance += Math.pow(point1[2] - point0[2], 2);
		distance = sqrt(distance);
	return distance;
	
}

function getTotalDistance(controlPoints) {
	let distance = 0;
	for (let i = 1; i < controlPoints.length; i++) {
		distance += getDistance(controlPoints[i], controlPoints[i - 1]);
	}
	return dist;
}