#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform bool uUseTexture;


void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 filter = texture2D(uSampler2, vec2(0.0,0.1)+vTextureCoord);

	if (filter.r > 0.2)
		color=vec4(0.52, 0.18, 0.11, 1.0);

	gl_FragColor = color;
}

/*
void main() {
    // Branching should be reduced to a minimal.
	// When based on a non-changing uniform, it is usually optimized.
	if (uUseTexture)
	{
        vec4 textureColor;
        vec4 maskTextureColor = texture2D(uSampler2, vTextureCoord);
        if (maskTextureColor.r > 0.2) {
            textureColor = texture2D(uSampler, vTextureCoord);
        } else {
            textureColor = texture2D(uSampler2, vTextureCoord);
        }
		gl_FragColor = maskTextureColor * vFinalColor;
	}
	else
		gl_FragColor = vFinalColor;
}
*/
