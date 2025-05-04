import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import vertexShader from "../../../shaders/effects/vertex.js";
import fragmentShader from "../../../shaders/effects/fragment.js";

export default function RingParticles({ particleIntensityRef, isPlayingRef, rotationRef }) {
  const ringRef = useRef();
  const count = 500;

  // 輪のパーティクル
  const ringParticles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const ringRadius = 8;
      const ringWidth = 1;
      const ringOffset = Math.random() * ringWidth - ringWidth / 2;

      // 円形の輪を作成（XY平面）
      const x = (ringRadius + ringOffset) * Math.cos(theta);
      const y = (ringRadius + ringOffset) * Math.sin(theta);
      const z = 0;

      // 45度回転させる（X軸周りに回転）
      const tilt = Math.PI / 4; // 45度
      positions[i * 3] = x;
      positions[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
      positions[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y = rotationRef.current.y;
      
      if (ringRef.current.material?.uniforms) {
        ringRef.current.material.uniforms.uIntensity.value = particleIntensityRef.current;
        ringRef.current.material.uniforms.uIsPlaying.value = isPlayingRef.current ? 1.0 : 0.0;
      }
    }
  });

  return (
    <points ref={ringRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={ringParticles.length / 3}
          array={ringParticles}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uIntensity: { value: 0.5 },
          uIsPlaying: { value: 0.0 }
        }}
        transparent
      />
    </points>
  );
} 