const fragmentShader = `
uniform float uIntensity;
uniform float uIsPlaying;
varying float vIntensity;

void main() {
  float glow = sin(vIntensity * 10.0) * 0.5 + 0.5;
  vec3 color = uIsPlaying > 0.5 ? vec3(1.0, 0.5, 0.0) : vec3(0.313, 0.784, 0.471);
  gl_FragColor = vec4(color, glow);
}
`;

export default fragmentShader; 