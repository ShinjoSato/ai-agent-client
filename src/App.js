import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import AudioProcessor from "./AudioProcessor";
import glsl from "babel-plugin-glsl/macro";

// 🎵 Web Audio API で音データを取得
function useAudioAnalyzer() {
  const analyser = useRef(null);
  const dataArray = useRef(new Float32Array(128));
  const dBThreshold = -55; // 小声レベルで反応

  return () => {
    if (analyser.current) {
      analyser.current.getFloatFrequencyData(dataArray.current);
      const maxDB = Math.max(...dataArray.current);
      return maxDB > dBThreshold ? (maxDB + 100) / 150 : 0;
    }
    return 0;
  };
}

// 🎇 頂点シェーダー（音で広がる効果）
const vertexShader = glsl`
  uniform float uIntensity;
  varying float vIntensity;
  void main() {
    vec3 newPosition = position * (1.0 + uIntensity * 0.2);
    vIntensity = position.z * uIntensity;
    gl_PointSize = (vIntensity + 1.5) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// ✨ フラグメントシェーダー（再生時のみオレンジに発光）
const fragmentShader = glsl`
  uniform float uIntensity;
  uniform float uIsPlaying; // 🎯 bool → float に変更
  varying float vIntensity;
  void main() {
    float glow = sin(vIntensity * 10.0) * 0.5 + 0.5;
    vec3 color = uIsPlaying > 0.5 ? vec3(1.0, 0.5, 0.0) : vec3(0.313, 0.784, 0.471);
    gl_FragColor = vec4(color, glow);
  }
`;

// 🎇 粒子アニメーション
function MovingParticles({ particleIntensityRef, isPlayingRef }) {
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
    const intensity = Math.max(audioLevel, particleIntensityRef.current);

    if (ref.current?.material?.uniforms) {
      ref.current.material.uniforms.uIntensity.value = intensity;
      ref.current.material.uniforms.uIsPlaying.value = isPlayingRef.current ? 1.0 : 0.0; // 🎯 float に変換
    }
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
        uniforms={{
          uIntensity: { value: 0.5 },
          uIsPlaying: { value: 0.0 }, // 🎯 初期値を float で設定
        }}
        transparent
      />
    </points>
  );
}

export default function App() {
  const particleIntensityRef = useRef(0);
  const isPlayingRef = useRef(false);

  return (
    <div style={{ position: "relative" }}>
      <Canvas
        style={{ background: "#1A1A1A", height: "100vh" }}
        camera={{ position: [0, 0, 15] }}
      >
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} />
        <MovingParticles particleIntensityRef={particleIntensityRef} isPlayingRef={isPlayingRef} />
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <AudioProcessor
          setParticleIntensity={(intensity) => (particleIntensityRef.current = intensity)}
          setIsPlaying={(playing) => (isPlayingRef.current = playing)}
        />
      </div>
    </div>
  );
}
