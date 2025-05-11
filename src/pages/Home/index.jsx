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
    // setIsCardOpen((responseList[0].title)? true : false);
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
import { Skeleton } from "@/components/ui/skeleton"

const avatarList = [
  {
    src: "https://github.com/ShinjoSato.png",
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

  return (
    <Card className="BBB bg-black/30 backdrop-blur">
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

        <ScrollArea className="max-h-[35vh]">
          <div>
            {responseList.map((reply, index) => (
              <div key={index} className="KK mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <div className="AAA">
                  {reply.title ? (
                    reply.iconComponent
                  ) : (
                    <Skeleton className="h-4 w-4 rounded-full" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium leading-none">
                    {reply.title ? (
                      <AnimatedText text={reply.title} />
                    ) : (
                      <Skeleton className="w-full h-4" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reply.subtitle ? (
                      <AnimatedText text={reply.subtitle} />
                    ) : (
                      <Skeleton className="w-24 h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-400">version 0.0</p>
      </CardFooter>
    </Card>
  )
}


const AnimatedText = ({ text, delay = 30 }) => {
  const [visibleLength, setVisibleLength] = useState(0)

  useEffect(() => {
    setVisibleLength(0)
    const interval = setInterval(() => {
      setVisibleLength((prev) => {
        if (prev >= text.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, delay)

    return () => clearInterval(interval)
  }, [text, delay])

  return (
    <span className="whitespace-pre-wrap break-words [word-break:keep-all]">
      {text.slice(0, visibleLength).split("").map((char, i) => (
        <span
          key={i}
          className="opacity-0 animate-fade-in inline"
          style={{ animationDelay: `${i * delay}ms`, animationFillMode: "forwards" }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
