/**
 * MyPatch
 * @constructor
 */
function MyPatch(degree1, degree2, controlVertexes) {
	CGFobject.call(this, scene);
    
    let knots1 = this.getKnotsVector(degree1);
	let knots2 = this.getKnotsVector(degree2);

	let nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlVertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};
	
	this.surface = new CGFnurbsObject(this, getSurfacePoint, 20, 20);
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.getKnotsVector = function(degree) {
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

MyPatch.prototype.display = function() {
    this.surface.display();
}