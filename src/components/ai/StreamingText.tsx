import React, { useState, useEffect } from 'react'

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  onUpdate?: () => void
}

export const StreamingText: React.FC<StreamingTextProps> = ({ 
  text, 
  speed = 50, 
  onComplete,
  onUpdate
}) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index))
        index++
        onUpdate?.()
      } else {
        clearInterval(timer)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayedText}</span>
}
