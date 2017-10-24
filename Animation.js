/**
 * Animation
 * @constructor
 */
function Animation(scene) {
	this.transformMatrix = [];
	this.scene = scene;
};

Animation.prototype = Object.create(CGFobject.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.getTransform = function(t) {};