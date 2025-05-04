import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import vertexShader from "../../../shaders/effects/vertex.js";
import fragmentShader from "../../../shaders/effects/fragment.js";
import { useAudioAnalyzer } from "../../../hooks/audio/useAudioAnalyzer";

export default function MovingParticles({ particleIntensityRef, isPlayingRef }) {
  const ref = useRef();
  const getAudioLevel = useAudioAnalyzer();
  const count = 1000;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + 1 * 2;

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
      ref.current.material.uniforms.uIsPlaying.value = isPlayingRef.current ? 1.0 : 0.0;
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
          uIsPlaying: { value: 0.0 }
        }}
        transparent
      />
    </points>
  );
} 