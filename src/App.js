import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import glsl from "babel-plugin-glsl/macro";

// 🎵 Web Audio API で音データを取得
function useAudioAnalyzer() {
  const analyser = useRef(null);
  const dataArray = useRef(new Float32Array(128));
  const dBThreshold = -60; // 小声レベルで反応

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.current = audioContext.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);
    }).catch(error => {
      console.error("Audio input error:", error);
    });
  }, []);

  return () => {
    if (analyser.current) {
      analyser.current.getFloatFrequencyData(dataArray.current);
      const maxDB = Math.max(...dataArray.current);
      const normalizedLevel = maxDB > dBThreshold ? (maxDB + 100) / 150 : 0; // dBThreshold を適用しつつ広がりを抑える
      return normalizedLevel;
    }
    return 0;
  };
}

// 🎇 頂点シェーダー（音で広がる効果）
const vertexShader = glsl`
  uniform float uIntensity;
  varying float vIntensity;
  void main() {
    vec3 newPosition = position * (1.0 + uIntensity * 0.2); // 広がりを狭める
    vIntensity = position.z * uIntensity;
    gl_PointSize = (vIntensity + 1.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// ✨ フラグメントシェーダー（発光）
const fragmentShader = glsl`
  varying float vIntensity;
  void main() {
    float glow = sin(vIntensity * 10.0) * 0.5 + 0.5;
    gl_FragColor = vec4(0.313, 0.784, 0.471, glow);
  }
`;

// 🎇 粒子アニメーション
function MovingParticles() {
  const ref = useRef();
  const getAudioLevel = useAudioAnalyzer();
  const count = 1000;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    const audioLevel = getAudioLevel();
    ref.current.material.uniforms.uIntensity.value = audioLevel;
    ref.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uIntensity: { value: 0.5 } }}
        transparent
      />
    </points>
  );
}

export default function App() {
  return (
    <Canvas
      style={{ background: "#1A1A1A", height: "100vh" }}
      camera={{ position: [0, 0, 10] }}
    >
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 10, 10]} />
      <MovingParticles />
    </Canvas>
  );
}
