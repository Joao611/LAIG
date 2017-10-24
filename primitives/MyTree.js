/**
 * MyTree
 * @constructor
 */
function MyTree(scene, coneHeight, coneRadius, triHeight, triBase, numTriangles) {
	this.scene = scene;
	this.coneHeight = coneHeight;
	this.coneRadius = coneRadius;
	this.triHeight = triHeight;
	this.triBase = triBase;
	this.numTriangles = numTriangles;

	this.cone = new MyCylinder(scene, coneHeight, coneRadius, 0, 4, 16, 0, 1);
	this.triangle = new MyTriangle(scene, 0, 0, 0, triBase, 0, 0, triBase/2, triHeight, 0);
};

MyTree.prototype = Object.create(CGFobject.prototype);
MyTree.prototype.constructor = MyTree;

MyTree.prototype.display = function () {
	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.cone.display();
	this.scene.popMatrix();

	let angleTriangle = 0;
	for (let i = 0; i < this.numTriangles; i++) {
		this.scene.pushMatrix();
			this.scene.rotate(angleTriangle, 0, 1, 0);
			this.scene.translate(-this.triBase/2, this.coneHeight - this.triHeight, 0);
			this.triangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.rotate(angleTriangle, 0, 1, 0);
			this.scene.rotate(Math.PI, 0, 1, 0);
			this.scene.translate(-this.triBase/2, this.coneHeight - this.triHeight, 0);
			this.triangle.display();
		this.scene.popMatrix();
		angleTriangle += Math.PI / this.numTriangles;
		angleTriangle %= 2 * Math.PI;
	}

	
};


