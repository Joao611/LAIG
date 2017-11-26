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
	
		this.totalDistance = this._getTotalDistance(this.controlPoints);
		this.totalTime = this.totalDistance / this.speed;
	}

	getTransform(t) {
		let traveledDistance = t * this.totalDistance;
  		this.distanceUntilCurrStart = 0;
    	let tInPortion = -1;
    	let currentMatrix = [];
    	for (let i = 1; i < this.controlPoints.length; i++) {
    		let portionLength = this._getDistance(this.controlPoints[i-1], this.controlPoints[i]);
			if (this.elapsedDistance + portionLength < traveledDistance) {
				this.elapsedDistance += portionLength;
				this.distanceUntilCurrStart += portionLength;
				continue;
			}
		
			let distanceInPortion = traveledDistance - this.distanceUntilCurrStart;
			if (distanceInPortion > portionLength) {
				distanceInPortion = portionLength;
			}
			this.elapsedDistance += distanceInPortion;
			let tInPortion = distanceInPortion / portionLength;
			return this.applyCurrent(tInPortion, this.controlPoints[i], this.controlPoints[i - 1]);
    	}
	}

	applyCurrent(tInPortion, endControlPoint, startControlPoint) {
		let transformMatrix = mat4.create();
		mat4.identity(transformMatrix);
		let translation = [];
		translation[0] = tInPortion * (endControlPoint[0] - startControlPoint[0]);
		translation[1] = tInPortion * (endControlPoint[1] - startControlPoint[1]);
		translation[2] = tInPortion * (endControlPoint[2] - startControlPoint[2]);
		mat4.translate(transformMatrix, transformMatrix, translation);
		let angle = this._getXZOrientation(endControlPoint, startControlPoint);
		mat4.rotate(transformMatrix, transformMatrix, angle, [0, 1, 0]);

		return transformMatrix;
	}

	_getXZOrientation(point1, point0) {
		let z = point1[2] - point0[2];
		let x = point1[0] - point0[0];
		if (x == 0) {
			return -Math.PI / 2;
		} else {
			return Math.atan(z/x);
		}
	}

	_getDistance(point1, point0) {
		let distance = Math.pow(point1[0] - point0[0], 2);
			distance += Math.pow(point1[1] - point0[1], 2);
			distance += Math.pow(point1[2] - point0[2], 2);
			distance = Math.sqrt(distance);
		return distance;
	}

	_getTotalDistance(controlPoints) {
		let distance = 0;
		for (let i = 1; i < controlPoints.length; i++) {
			distance += this._getDistance(controlPoints[i], controlPoints[i - 1]);
		}
		return distance;
	}
}