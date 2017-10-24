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

LinearAnimation.prototype.getTransform = function(t) {
    let traveledDistance = t * this.totalDistance;
    let distanceAccumulator = 0;
    let tInPortion = -1;
    this.scene.pushMatrix();
        this.scene.loadIdentity();
        this.transformMatrix = this.scene.getMatrix();
    this.scene.popMatrix();
    for (let i = 1; i < this.controlPoints.length; i++) {
        if (distanceAccumulator > traveledDistance) {
            let distanceInPortion = distanceAccumulator - traveledDistance;
            tInPortion = distanceInPortion / getDistance(this.controlPoints[i-1], this.controlPoints[i]);
            this.scene.pushMatrix();
                this.scene.setMatrix(this.transformMatrix);
                let transX = tInPortion * abs(this.controlPoints[i-1][0] - this.controlPoints[i][0]);
                let transY = tInPortion * abs(this.controlPoints[i-1][1] - this.controlPoints[i][1]);
                let transZ = tInPortion * abs(this.controlPoints[i-1][2] - this.controlPoints[i][2]);
                this.scene.translate(transX, transY, transZ);
                this.transformMatrix = this.scene.getMatrix();
            this.scene.popMatrix();
            break;
        }
        distanceAccumulator += getDistance(this.controlPoints[i-1], this.controlPoints[i]);
        this.scene.pushMatrix();
            this.scene.setMatrix(this.transformMatrix);
            let transX = abs(this.controlPoints[i-1][0] - this.controlPoints[i][0]);
            let transY = abs(this.controlPoints[i-1][1] - this.controlPoints[i][1]);
            let transZ = abs(this.controlPoints[i-1][2] - this.controlPoints[i][2]);
            this.scene.translate(transX, transY, transZ);
            this.transformMatrix = this.scene.getMatrix();
        this.scene.popMatrix();
    }

};