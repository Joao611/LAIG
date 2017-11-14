#ifdef GL_ES
precision highp float;
#endif


uniform float timeFactor;
uniform vec3 saturatedColor;

varying vec4 color;


void main() {
    gl_FragColor = color;
}