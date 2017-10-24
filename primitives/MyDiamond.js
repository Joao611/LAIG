/**
 * MyDiamond
 * @constructor
 */
function MyDiamond(scene, slices) {
	CGFobject.call(this, scene);
	
	this.scene = scene;
 	this.radius = 0.5;
// 	this.halfHeight = 1;
	this.slices = slices;
	this.baseLength = Math.sin(Math.PI/slices);

	this.triangle = new MyTriangle(scene, 0, 0, 0, this.baseLength, 0, 0, this.baseLength/2, Math.sqrt(4+0.5*0.5), 0);
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.display = function () {
	for (let i = 0; i < this.slices; i++) {
		this.scene.pushMatrix();
			this.scene.rotate(Math.PI/this.slices, 0, 1, 0);
			this.scene.translate(-this.baseLength/2, 0, 0);
			this.triangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(Math.PI, 0, 1, 1);
			this.scene.translate(-this.baseLength/2, 0, 0);
			this.triangle.display();
		this.scene.popMatrix();
	}
};


