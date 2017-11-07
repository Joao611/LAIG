/**
 * CircularAnimation
 * @constructor
 */
var degToRad = Math.PI / 180;

function CircularAnimation(speed, centerX, centerY, centerZ, radius, startAng, rotAng) {

this.speed=speed;
this.centerX=centerX;
this.centerY=centerY;
this.centerZ=centerZ;	
this.radius=radius;
this.startAng=startAng * degToRad;
this.rotAng=rotAng * degToRad;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.getTransform = function(t) {


this.scene.pushMatrix();
	this.scene.loadIdentity(); 
		this.scene.translate(centerX,centerY,centerZ);
			this.scene.rotate(startAng+(rotAng*t));
			this.scene.translate(radius, 0, 0);
		this.scene.translate(-centerX,-centerY,-centerZ);
	this.transformMatrix = this.scene.getMatrix();
this.scene.popMatrix();
}
