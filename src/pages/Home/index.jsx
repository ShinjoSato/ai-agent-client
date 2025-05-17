import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion"
import clsx from 'clsx'
import { useResponseStore } from "@/stores/responseStore"
import AudioProcessor from "../../components/common/AudioProcessor";
import MovingParticles from "../../components/effects/MovingParticles";

export default function Home() {
  const particleIntensityRef = useRef(0);
  const isPlayingRef = useRef(false);
  const { responseList } = useResponseStore();
  const [isCardOpen, setIsCardOpen] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    console.log(responseList)
    setIsCardOpen(responseList.length > 0)
  }, [responseList])

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
        <div className={clsx(
          "w-full md:w-1/2 xl:w-1/3",
          "absolute right-0 pointer-events-auto p-3"
        )}>
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
        <div className={clsx(
          "hidden md:block md:w-1/2 xl:w-1/3",
          "absolute left-0 pointer-events-auto p-3"
        )}>
          {isCardOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="origin-top-right"
            >
              <DemoStatusCard />
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


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { TalkLine } from "@/components/common/TalkLine";

const avatarList = [
  {
    src: "dummy_hattori.png",
    name: "John Doe",
  },{
    src: "https://github.com/ShinjoSato.png",
    name: "John Doe",
  },{
    src: "https://github.com/ShinjoSato.png",
    name: "John Doe",
  }
]

function DemoCard() {
  const { responseList } = useResponseStore();
  const [isProceed, setIsProceed] = useState(false)

  useEffect(() => {
    setIsProceed(responseList.at(-1).status === 0) // 0: 継続, 1: 終了
  }, [responseList])

  return (
    <Card className="bg-black/30 backdrop-blur">
      {/* <CardHeader>
      </CardHeader> */}
      <CardContent className="p-4">
        <div className="pb-4 flex flex-row-reverse justify-end -space-x-3 space-x-reverse *:ring-3 *:ring-background">
          {avatarList.map((avatar, index) => (
            <Avatar key={index} className="z-20 size-8 ring-2 ring-white">
              <AvatarImage src={avatar.src} />
              {/* <Skeleton className="h-full w-full rounded-full" /> */}
            </Avatar>
          ))}
        </div>

        <ScrollArea className="max-h-[50vh]">
          <div>
            {responseList.map((reply, index) => (
              <TalkLine
                key={index}
                icon={reply.iconComponent}
                title={reply.message}
                subtitle={reply.language}
              />
            ))}
            {(isProceed) && (
              <TalkLine
                icon={null}
                title={null}
                subtitle={null}
                isLoading={true}
              />
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400">version 0.0</p>
      </CardFooter>
    </Card>
  )
}



import { Brain, Speech, Heart } from 'lucide-react';
import {RoleLine} from "@/components/common/RoleLine";

function DemoStatusCard() {
  const { responseList, roleList } = useResponseStore();

  return (
    <Card className="w-full h-full bg-black/30 backdrop-blur">
      {/* <CardHeader>
      </CardHeader> */}
      <CardContent className="p-4">

        <div className="relative w-full max-w-md mx-auto">
          <div className="back">
            <Avatar className="w-full h-auto">
              <AvatarImage
                src="/brain_voice_heart_pictogram.png"
                className="w-full h-auto object-contain"
              />
            </Avatar>
          </div>
          <div className="absolute inset-0 z-10 front">
            {roleList.map((role, index) => (
              <RoleLine
                key={index}
                src={role.src}
                batchIcon={role.batchIcon}
                message={role.message}
              />
            ))}
          </div>
        </div>
      </CardContent>
      {/* <CardFooter>
      </CardFooter> */}
    </Card>
  )
}
