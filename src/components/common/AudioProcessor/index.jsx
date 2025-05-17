import React, { useState, useRef } from "react";
import { Mic, LoaderCircle, CircleStop, Brain, Speech, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useResponseStore } from "@/stores/responseStore"

// 🎤 録音用カスタムフック
function useAudioRecorder(setParticleIntensity, setIsPlaying, setIsWaiting) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const streamRef = useRef(null);
  let audioChunks = [];
  const audioRef = useRef(new Audio());
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(new Uint8Array(128));
  const audioSourceRef = useRef(null);
  const intensityRef = useRef(0);

  // ソケット用
  const ws = useRef(null);
  const audioContext = useRef(null);
  const sourceBuffer = useRef(null);
  const { setResponseList, setRoleList } = useResponseStore();

  // 🔴 録音開始
  const startRecording = async () => {
    console.log("Start Recording button clicked");
    try {
      setIsRecording(true);
      setIsPlaying(false);
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(streamRef.current, { mimeType: "audio/webm" });
      audioChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          setAudioBlob(audioBlob);
          console.log("Audio recorded successfully:", audioBlob);

          // ソケット通信ができればいい
          ws.current = new WebSocket("ws://127.0.0.1:8000/ws");
          ws.current.binaryType = "arraybuffer"; // バイナリデータ受信設定

          ws.current.onopen = async () => {
            console.log("WebSocket 接続成功！");
            const arrayBuffer = await audioBlob.arrayBuffer();
            console.log("送信するデータ:", new Uint8Array(arrayBuffer).slice(0, 20)); // 最初の 20 バイトを表示
            ws.current.send(arrayBuffer); // 最初に "mp3" または "json" を送信
          };

          ws.current.onmessage = async (event) => {
            if (typeof event.data === "string") {
              const response = JSON.parse(event.data);
              // JSON の場合
              console.log("JSON データ受信:", response);

              // 受信したデータをリストに反映
              // @todo: setLanguage, animateSetTextをすると音声受信時にオレンジに光らなくなる
              if (response.type === 0) {
                // トークに追加
                setResponseList(response)
              } else if (response.type === 1) {
                // 設定ログに追加
                const data = {...response}
                switch (response.role.type ) {
                  case 0:
                    data.src = 'https://github.com/ShinjoSato.png'
                    data.batchIcon = <Brain className="h-4 w-4 text-white" />
                    break
                  case 1:
                    data.src = 'https://github.com/ShinjoSato.png'
                    data.batchIcon = <Speech className="h-4 w-4 text-white" />
                    break
                  case 2:
                    data.src = '/dummy_hattori.png'
                    data.batchIcon = <Heart className="h-4 w-4 text-white" />
                    break
                }
                setRoleList(data)
              }
            } else if (event.data instanceof ArrayBuffer) {
                // MP3 の場合
                console.log("MP3 データ受信");

                if (!audioContext.current) {
                    audioContext.current = new AudioContext();
                }
                const arrayBuffer = event.data;
                const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
                const newSource = audioContext.current.createBufferSource();
                newSource.buffer = audioBuffer;
                newSource.connect(audioContext.current.destination);
                newSource.onended = () => {
                  setIsPlaying(false);
                  intensityRef.current = 0;
                  setParticleIntensity(0);
                  setIsWaiting(false);
                }
                newSource.start();
                setIsPlaying(true);
            }
          };

          ws.current.onclose = () => {
              console.log("WebSocket 切断");
          };

          // ws.current.close();


          
          // // 🔊 自動再生
          // const audioUrl = URL.createObjectURL(audioBlob);
          // audioRef.current.src = audioUrl;
          // audioRef.current.onended = () => {
          //   setIsPlaying(false);
          //   intensityRef.current = 0;
          //   setParticleIntensity(0);
          // }; // 再生終了時にフラグと粒子効果をリセット

          // // 再生開始
          // audioRef.current.play().catch((error) => console.error("Playback error:", error));
          // setIsPlaying(true);
          // analyzeAudio(audioRef.current);
        }
      };

      mediaRecorder.current.start();
      console.log("Recording started...");
      analyzeLiveAudio(streamRef.current);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // 🎵 ライブ録音中の音声解析
  const analyzeLiveAudio = (stream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    source.connect(analyserRef.current);

    const updateAudioLevel = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const maxLevel = Math.max(...dataArrayRef.current);
      const normalizedLevel = maxLevel / 255;
      intensityRef.current = normalizedLevel;
      setParticleIntensity(normalizedLevel);
      requestAnimationFrame(updateAudioLevel);
    };
    updateAudioLevel();
  };

  // 🎵 再生中の音声解析
  const analyzeAudio = (audioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    try {
      // @todo: 再生に合わせて粒子が波打つが、二回目以降でエラー
      audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      audioSourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error("Failed to create MediaElementSource:", error);
      return;
    }

    const updateAudioLevel = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const maxLevel = Math.max(...dataArrayRef.current);
        const normalizedLevel = maxLevel / 255;
        intensityRef.current = normalizedLevel;
        setParticleIntensity(normalizedLevel);
        requestAnimationFrame(updateAudioLevel);
      }
    };
    updateAudioLevel();
  };

  // 🛑 録音停止
  const stopRecording = () => {
    console.log("Stop Recording button clicked");
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      console.log("Recording stopped...");
      setIsRecording(false);
      setIsPlaying(false);
      setIsWaiting(true);
      intensityRef.current = 0;
      setParticleIntensity(0);
    } else {
      console.error("MediaRecorder is not initialized or already stopped");
    }
  };

  return { audioBlob, isRecording, startRecording, stopRecording };
}

// 🎛 録音ボタンを表示するコンポーネント
export default function AudioProcessor({ setParticleIntensity, setIsPlaying }) {
  const [isWaiting, setIsWaiting] = useState(false)
  const { isRecording, startRecording, stopRecording } = useAudioRecorder(setParticleIntensity, setIsPlaying, setIsWaiting);

  return (
    <div className="text-center">
      <Button
        className="group p-[10px] text-white group-hover:text-black"
        variant="ghost"
        size="icon"
        onClick={isRecording ? () => stopRecording() : () => startRecording()}
        disabled={isWaiting}
      >
        {isRecording ? (
          <CircleStop />
        ) : isWaiting ? (
          <LoaderCircle  className="spin" />
        ) : (
          <Mic />
        )}
      </Button>
    </div>
  );
}
