import React, { useState, useRef } from "react";

// 🎤 録音用カスタムフック
function useAudioRecorder(setParticleIntensity, setIsPlaying) {
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

  // 🔴 録音開始
  const startRecording = async () => {
    console.log("Start Recording button clicked");
    try {
      setIsRecording(true);
      setIsPlaying(false);
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(streamRef.current);
      audioChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
          console.log("Audio recorded successfully:", audioBlob);

          // 🔊 自動再生
          const audioUrl = URL.createObjectURL(audioBlob);
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            setIsPlaying(false);
            intensityRef.current = 0;
            setParticleIntensity(0);
          }; // 再生終了時にフラグと粒子効果をリセット
          audioRef.current.play().catch((error) => console.error("Playback error:", error));

          setIsPlaying(true);
          analyzeAudio(audioRef.current);
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
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.disconnect();
        audioSourceRef.current = null;
      } catch (error) {
        console.warn("Audio source already disconnected");
      }
    }
    try {
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
  const { isRecording, startRecording, stopRecording } = useAudioRecorder(setParticleIntensity, setIsPlaying);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
