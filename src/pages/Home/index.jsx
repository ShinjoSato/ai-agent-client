import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion"
import AudioProcessor from "../../components/common/AudioProcessor";
import MovingParticles from "../../components/effects/MovingParticles";

export default function Home() {
  const particleIntensityRef = useRef(0);
  const isPlayingRef = useRef(false);
  const { language, request, response } = useResponseStore();
  const [isCardOpen, setIsCardOpen] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    console.log(language, request, response)
    if (language) {
      console.log('open')
      setIsCardOpen(true);
    }
  }, [language, request, response])

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

      {/* オーバーレイコンポーネント */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-5 right-5 pointer-events-auto">
          {isCardOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="origin-top-right"
            >
              <DemoCard />
            </motion.div>
          )}
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 rounded-[10px] pointer-events-auto">
          <AudioProcessor
            setParticleIntensity={(intensity) => (particleIntensityRef.current = intensity)}
            setIsPlaying={(playing) => (isPlayingRef.current = playing)}
          />
        </div>
      </div>
    </div>
  );
}


import { Languages, User, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useResponseStore } from "@/stores/responseStore"

function DemoCard() {
  const { language, request, response } = useResponseStore();

  return (
    <Card className="max-w-[50vw]">
      <CardHeader>
        <CardTitle>取得データ</CardTitle>
        <CardDescription>受信データを表示させます</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[35vh]">
          <div>
            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <Languages className="h-4 w-4 text-sky-500"/>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {language}
                </p>
                <p className="text-sm text-muted-foreground">
                  {'1 hour ago'}
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <User className="h-4 w-4 text-sky-500"/>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {request}
                </p>
                <p className="text-sm text-muted-foreground">
                  {'1 hour ago'}
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <Bot className="h-4 w-4 text-sky-500"/>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {response}
                </p>
                <p className="text-sm text-muted-foreground">
                  {'1 hour ago'}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
