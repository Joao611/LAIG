/**
 * MyTriangle
 * @constructor
 */
 function MyTriangle(scene, x1,y1,z1,x2,y2,z2,x3,y3,z3) {
 	CGFobject.call(this,scene);

    this.x1=x1;
    this.y1=y1;
    this.z1=z1;
    this.x2=x2;
    this.y2=y2;
    this.z2=z2;
    this.x3=x3;
    this.y3=y3;
    this.z3=z3;

 	this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {
 	this.vertices = [
      this.x1, this.y1, this.z1,
      this.x2, this.y2, this.z2,
      this.x3, this.y3, this.z3,
 	];

 	this.indices = [
 	  0, 1, 2, 
 	];

 	this.normals = [
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1,
 	];

    this.ab =Math.sqrt(Math.pow(this.x2-this.x1 ,2)
                   + Math.pow(this.y2-this.y1 ,2)
                   + Math.pow(this.z2-this.z1 ,2));
                   
    this.ac =Math.sqrt(Math.pow(this.x1-this.x3 ,2)
                   + Math.pow(this.y1-this.y3 ,2)
                   + Math.pow(this.z1-this.z3 ,2));

    this.bc = Math.sqrt(Math.pow(this.x2 - this.x3, 2)
 	                   + Math.pow(this.y2 - this.y3, 2)
 	                   + Math.pow(this.z2 - this.z3, 2));
  	                  
    this.beta= Math.acos(
           ( Math.pow(this.bc, 2)
           - Math.pow(this.ac,2)
           + Math.pow(this.ab, 2))
           / (2*this.ab*this.bc)
           );

  this.ptX = this.ab-this.bc*Math.cos(this.beta);
  this.ptY = this.bc*Math.sin(this.beta);
  this.texCoords=[
    0,0,
    this.bc,0,
    this.ptX,1-this.ptY
  ];



 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };