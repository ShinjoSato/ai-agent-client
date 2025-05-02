import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import AudioProcessor from "../../components/common/AudioProcessor";
import MovingParticles from "../../components/effects/MovingParticles";

export default function Home() {
  const particleIntensityRef = useRef(0);
  const isPlayingRef = useRef(false);
  // const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <Canvas
        style={{ background: "#1A1A1A", height: "100vh" }}
        camera={{ position: [0, 0, 15], fov: 75 }}
      >
        <ambientLight intensity={1.0} />
        <pointLight position={[10, 10, 10]} />
        <MovingParticles
          particleIntensityRef={particleIntensityRef}
          isPlayingRef={isPlayingRef}
          // isPlaying={isPlaying}
        />
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
