/**
 * CircularAnimation
 * @constructor
 */
var degToRad = Math.PI / 180;

class CircularAnimation extends Animation {
	constructor(scene, speed, centerX, centerY, centerZ, radius, startAng, rotAng) {
	super(scene);

		this.speed=speed;
		this.centerX=centerX;
		this.centerY=centerY;
		this.centerZ=centerZ;
		this.radiu5s=radius;
		this.startAng=startAng * degToRad;
		this.rotAng=rotAng * degToRad;
	}
}

CircularAnimation.prototype.getTransform = function(t) {
this.scene.pushMatrix();
	this.scene.loadIdentity();
		this.scene.translate(this.centerX,this.centerY,this.centerZ);
			this.scene.rotate((this.startAng+(this.rotAng*t)),0,1,0);
			this.scene.translate(this.radius, 0, 0);
		this.scene.translate(-this.centerX,-this.centerY,-this.centerZ);
	this.transformMatrix = this.scene.getMatrix();
this.scene.popMatrix();
}
