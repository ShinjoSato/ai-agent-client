import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAudioAnalyzer } from "../../../hooks/audio/useAudioAnalyzer";
import SphereParticles from "./SphereParticles";
import RingParticles from "./RingParticles";

export default function MovingParticles({ particleIntensityRef, isPlayingRef }) {
  const getAudioLevel = useAudioAnalyzer();
  const rotationRef = useRef({ y: 0 });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const audioLevel = getAudioLevel();
    const intensity = Math.max(audioLevel, particleIntensityRef.current);

    // 共通の回転状態を更新
    rotationRef.current.y = time * 0.15;
  });

  return (
    <>
      <SphereParticles
        particleIntensityRef={particleIntensityRef}
        isPlayingRef={isPlayingRef}
        rotationRef={rotationRef}
      />
      <RingParticles
        particleIntensityRef={particleIntensityRef}
        isPlayingRef={isPlayingRef}
        rotationRef={rotationRef}
      />
    </>
  );
} 