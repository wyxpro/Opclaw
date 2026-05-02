import React, { useState, useEffect, useRef } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  onUpdate?: () => void
}

/**
 * Enhanced StreamingText that supports real-time streaming input 
 * without resetting when the text prop appends new content.
 */
export const StreamingText: React.FC<StreamingTextProps> = ({ 
  text, 
  speed = 30, // Default snappy typing speed
  onComplete,
  onUpdate
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const indexRef = useRef(0)
  const fullTextRef = useRef(text)

  useEffect(() => {
    // If text is totally different (not just appending), reset
    if (!text.startsWith(fullTextRef.current)) {
      setDisplayedText('')
      indexRef.current = 0
    }
    fullTextRef.current = text
  }, [text])

  useEffect(() => {
    const timer = setInterval(() => {
      if (indexRef.current < fullTextRef.current.length) {
        const nextChar = fullTextRef.current.charAt(indexRef.current)
        setDisplayedText(prev => prev + nextChar)
        indexRef.current++
        onUpdate?.()
      } else if (onComplete && indexRef.current === fullTextRef.current.length && fullTextRef.current.length > 0) {
        // Only call onComplete if we are not expecting more data soon? 
        // This is tricky with real streaming.
        // For now, let the component stay active.
      }
    }, speed)

    return () => clearInterval(timer)
  }, [speed, onUpdate])

  // If the stream is much faster than the typing speed, we might lag behind.
  // Catch up if the gap is too large
  useEffect(() => {
    if (fullTextRef.current.length - indexRef.current > 100) {
      setDisplayedText(fullTextRef.current.slice(0, indexRef.current + 20))
      indexRef.current += 20
    }
  }, [text])

  return <span>{displayedText}</span>
}
