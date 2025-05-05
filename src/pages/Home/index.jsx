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

      <div className="absolute bottom-5 left-1/2 bg-black/50 rounded-[10px]">
        <AudioProcessor
          setParticleIntensity={(intensity) => (particleIntensityRef.current = intensity)}
          setIsPlaying={(playing) => (isPlayingRef.current = playing)}
        />
      </div>
    </div>
  );
}
