import { useState, useEffect } from "react"

export const AnimatedText = ({ text, delay = 30 }) => {
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
