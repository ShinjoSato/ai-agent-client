import { useRef } from "react";

export function useAudioAnalyzer() {
  const analyser = useRef(null);
  const dataArray = useRef(new Float32Array(128));
  const dBThreshold = -55; // 小声レベルで反応

  return () => {
    if (analyser.current) {
      analyser.current.getFloatFrequencyData(dataArray.current);
      const maxDB = Math.max(...dataArray.current);
      return maxDB > dBThreshold ? (maxDB + 100) / 150 : 0;
    }
    return 0;
  };
} 