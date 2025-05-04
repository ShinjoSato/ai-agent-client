const fragmentShader = `
uniform float uIntensity;
uniform float uIsPlaying;
varying float vIntensity;

void main() {
  // 円形のパーティクルを作成
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // 円の外側を透明にする
  if (dist > 0.5) {
    discard;
  }
  
  float glow = sin(vIntensity * 10.0) * 0.5 + 0.5;
  vec3 color = uIsPlaying > 0.5 ? vec3(1.0, 0.5, 0.0) : vec3(0.0, 1.0, 1.0);
  
  // エッジを少しぼかして、より自然な見た目に
  float alpha = smoothstep(0.5, 0.3, dist) * glow;
  gl_FragColor = vec4(color, alpha);
}
`;

export default fragmentShader; 