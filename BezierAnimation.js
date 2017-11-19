class BezierAnimation extends Animation {
	constructor(scene, speed, controlPoints) {
		super(scene);
		this.speed = speed;
		this.P1 = controlPoints[0];
		this.P2 = controlPoints[1];
		this.P3 = controlPoints[2];
		this.P4 = controlPoints[3];

		this.prevCoordinates = this._getCurrentCoordinates(-0.001);
		this.prevAngle = 0;

		this.totalDistance = this._getTotalDistance();
		this.totalTime = this.totalDistance / this.speed;
	}

	getTransform(t) {
		if (t > 1) {
			t = 1;
		}
		let currentCoordinates = this._getCurrentCoordinates(t);
		let deltaCoords = subtractArrays(currentCoordinates, this.prevCoordinates);
		let angle = this._getXZOrientation(deltaCoords);
		if (deltaCoords[0] == 0 && deltaCoords[2] == 0) {
			angle = this.prevAngle;
		}

		this.scene.pushMatrix();
			this.scene.loadIdentity();
			this.scene.translate(currentCoordinates[0],
								currentCoordinates[1],
								currentCoordinates[2]);
			this.scene.rotate(angle, 0, 1, 0);
			let transformMatrix = this.scene.getMatrix();
		this.scene.popMatrix();
		
		if (t < 1) {
			this.prevCoordinates = currentCoordinates;
			this.prevAngle = angle;
		}
		return transformMatrix;
	}

	_getXZOrientation(deltaCoords) {
		let z = deltaCoords[2];
		let x = deltaCoords[0];
		if (z == 0) {
			return Math.PI / 2;
		} else {
			return Math.atan(x/z);
		}
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
	 * Estimated distance: Average between chord and control net.
	 * Chord = Distance between start and destination.
	 * Control net = Sum of distances between each consecutive points.
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
}