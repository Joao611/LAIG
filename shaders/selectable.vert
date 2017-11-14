#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uGlobalAmbient;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;

varying vec4 color;

void main() {
	vec3 coords = aVertexPosition + aVertexNormal * timeFactor;
	gl_Position = uPMatrix * uMVMatrix * vec4(coords, 1.0);
	color = aVertexColor;
}