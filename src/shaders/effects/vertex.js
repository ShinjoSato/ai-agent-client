const vertexShader = `
uniform float uIntensity;
varying float vIntensity;

void main() {
  vec3 newPosition = position * (1.0 + uIntensity * 0.2);
  vIntensity = position.z * uIntensity;
  gl_PointSize = (vIntensity + 4.5) * 2.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export default vertexShader; 