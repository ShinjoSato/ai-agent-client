import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import vertexShader from "../../../shaders/effects/vertex.js";
import fragmentShader from "../../../shaders/effects/fragment.js";

export default function SphereParticles({ particleIntensityRef, isPlayingRef, rotationRef }) {
  const sphereRef = useRef();
  const count = 1400;

  // 球体のパーティクル
  const sphereParticles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = rotationRef.current.y;
      
      if (sphereRef.current.material?.uniforms) {
        sphereRef.current.material.uniforms.uIntensity.value = particleIntensityRef.current;
        sphereRef.current.material.uniforms.uIsPlaying.value = isPlayingRef.current ? 1.0 : 0.0;
      }
    }
  });

  return (
    <points ref={sphereRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={sphereParticles.length / 3}
          array={sphereParticles}
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