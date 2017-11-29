#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform bool uUseTexture;

void main() {
    // Branching should be reduced to a minimal.
	// When based on a non-changing uniform, it is usually optimized.
	if (uUseTexture)
	{
        vec4 textureColor;
        vec4 maskTextureColor = texture2D(uSampler2, vTextureCoord);
        if (maskTextureColor.r < 0.2) {
            textureColor = texture2D(uSampler, vTextureCoord);
        } else {
            textureColor = maskTextureColor;
        }
		gl_FragColor = textureColor * vFinalColor;
	}
	else
		gl_FragColor = vFinalColor;
}
