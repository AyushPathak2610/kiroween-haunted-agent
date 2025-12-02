'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpeech, GhostVoice } from '@/lib/tts/speechService'

interface Message {
  ghost: string
  message: string
}

export default function GhostDebatePanel({ messages }: { messages: Message[] }) {
  const { speak } = useSpeech()
  const lastMessageCount = useRef(0)
  const [currentCaption, setCurrentCaption] = useState<{ ghost: string; message: string } | null>(null)

  const ghostColors: Record<string, string> = {
    elara: 'ghost-elara',
    harlan: 'ghost-harlan',
    mira: 'ghost-mira',
    theo: 'ghost-theo',
    selene: 'ghost-selene'
  }

  const ghostCaptionColors: Record<string, string> = {
    elara: '#ff69b4',
    harlan: '#00bfff',
    mira: '#ffd700',
    theo: '#9370db',
    selene: '#ff4444'
  }

  useEffect(() => {
    // Speak new messages as they arrive and show as movie-style captions
    if (messages.length > lastMessageCount.current) {
      const newMessages = messages.slice(lastMessageCount.current)
      
      // Show each message as a caption sequentially
      newMessages.forEach((msg, idx) => {
        setTimeout(() => {
          const ghostName = msg.ghost.toLowerCase() as GhostVoice
          
          // Show caption
          setCurrentCaption({ ghost: msg.ghost, message: msg.message })
          
          // Speak the message
          speak(msg.message, ghostName)
          
          // Hide caption after 4 seconds (adjust based on message length)
          const displayTime = Math.max(4000, msg.message.length * 50)
          setTimeout(() => {
            setCurrentCaption(null)
          }, displayTime)
        }, idx * 4500) // Stagger captions
      })
      
      lastMessageCount.current = messages.length
    }
  }, [messages, speak])

  return (
    <>
      {/* Movie-style caption overlay (doesn't block scroll) */}
      <AnimatePresence>
        {currentCaption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{
              maxWidth: '80%',
              textAlign: 'center'
            }}
          >
            <div
              className="px-8 py-4 rounded-lg shadow-2xl backdrop-blur-md"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                border: `2px solid ${ghostCaptionColors[currentCaption.ghost.toLowerCase()]}`,
                boxShadow: `0 0 30px ${ghostCaptionColors[currentCaption.ghost.toLowerCase()]}40`
              }}
            >
              <div
                className="text-sm font-bold mb-2"
                style={{ color: ghostCaptionColors[currentCaption.ghost.toLowerCase()] }}
              >
                {currentCaption.ghost}
              </div>
              <div className="text-white text-lg font-medium leading-relaxed">
                {currentCaption.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traditional debate panel (dialogue clouds remain) */}
      <div className="ghost-debate">
        <h3 style={{ marginBottom: '10px', color: '#4a90e2' }}>👻 Ghost Council Debate</h3>
        {messages.length === 0 && (
          <p style={{ opacity: 0.6, fontStyle: 'italic' }}>Waiting for ghosts to speak...</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`ghost-message ${ghostColors[msg.ghost.toLowerCase()]}`}>
            <strong>{msg.ghost}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </>
  )
}
