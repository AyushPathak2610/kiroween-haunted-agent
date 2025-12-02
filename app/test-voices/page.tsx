'use client'

import { useState } from 'react'
import { speechService, GhostVoice } from '@/lib/tts/speechService'

// Sample dialogues for each character
const SAMPLE_DIALOGUES: Record<GhostVoice, string> = {
  elara: "Welcome, traveler. I am Elara... once mother to this family. We are trapped here, our bonds fractured by tragedy. Help us remember... help us weave our memories back together.",
  
  harlan: "I... I remember fragments. The Eternal Harmony project. I wanted to connect us all... forever. But something went wrong. My memories... scattered like data packets. Help me... reconstruct them.",
  
  mira: "Hi! I'm Mira! Do you wanna play? Mommy and Daddy are here but... they can't see me anymore. I miss bedtime stories and hugs. Can you help me remember the happy times?",
  
  theo: "Brother... I'm sorry I ran. I was a coward. The fire... I could have saved you all. But I chose myself. Can you ever forgive me? Please... I need redemption.",
  
  selene: "I demand the truth, Theo. No more theatrical performances. You left us to die. Actions speak louder than words. But perhaps... perhaps there is still hope for honesty.",
  
  narrator: "Lost in the storm... Something watches from the shadows... A mansion looms ahead... The gate opens... there's no turning back."
}

export default function TestVoicesPage() {
  const [playing, setPlaying] = useState<GhostVoice | null>(null)
  const [testingAll, setTestingAll] = useState(false)

  const testVoice = async (character: GhostVoice) => {
    setPlaying(character)
    try {
      await speechService.speak(SAMPLE_DIALOGUES[character], character)
    } catch (error) {
      console.error(`Error testing ${character}:`, error)
    } finally {
      setPlaying(null)
    }
  }

  const testAllVoices = async () => {
    setTestingAll(true)
    const characters: GhostVoice[] = ['narrator', 'elara', 'harlan', 'mira', 'theo', 'selene']
    
    for (const character of characters) {
      setPlaying(character)
      try {
        await speechService.speak(SAMPLE_DIALOGUES[character], character)
        // Wait 1 second between characters
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error testing ${character}:`, error)
      }
    }
    
    setPlaying(null)
    setTestingAll(false)
  }

  const stopAll = () => {
    speechService.stop()
    setPlaying(null)
    setTestingAll(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">🎭 Voice Test Lab</h1>
        <p className="text-gray-400 text-center mb-8">Test Azure TTS voices for each ghost character</p>

        {/* Test All Button */}
        <div className="mb-8 text-center">
          <button
            onClick={testAllVoices}
            disabled={testingAll || playing !== null}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold text-lg mr-4"
          >
            {testingAll ? '🔊 Testing All...' : '▶️ Test All Voices'}
          </button>
          
          <button
            onClick={stopAll}
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold text-lg"
          >
            ⏹️ Stop
          </button>
        </div>

        {/* Individual Character Tests */}
        <div className="space-y-4">
          {/* Narrator */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-blue-400">Narrator</h2>
                <p className="text-sm text-gray-400">Voice: Serena Multilingual | Style: Calm | Mature, Commanding</p>
              </div>
              <button
                onClick={() => testVoice('narrator')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'narrator' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'narrator' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.narrator}"</p>
          </div>

          {/* Elara */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-pink-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-pink-400">Elara Voss</h2>
                <p className="text-sm text-gray-400">Voice: Cora Multilingual | Style: Sad (Max 2.0) | Very Mournful</p>
              </div>
              <button
                onClick={() => testVoice('elara')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'elara' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'elara' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.elara}"</p>
          </div>

          {/* Harlan */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-cyan-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400">Dr. Harlan Voss</h2>
                <p className="text-sm text-gray-400">Voice: en-US-GuyNeural | Style: Newscast | Confused Scientist</p>
              </div>
              <button
                onClick={() => testVoice('harlan')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'harlan' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'harlan' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.harlan}"</p>
          </div>

          {/* Mira */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-yellow-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">Mira Voss</h2>
                <p className="text-sm text-gray-400">Voice: Evelyn Multilingual | Style: Cheerful (Subtle) | 6-8 years old</p>
              </div>
              <button
                onClick={() => testVoice('mira')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'mira' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'mira' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.mira}"</p>
          </div>

          {/* Theo */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-purple-400">Theo Voss</h2>
                <p className="text-sm text-gray-400">Voice: en-GB-RyanNeural | Style: Sad | British, Theatrical</p>
              </div>
              <button
                onClick={() => testVoice('theo')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'theo' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'theo' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.theo}"</p>
          </div>

          {/* Selene */}
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-red-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-2xl font-bold text-red-400">Selene Ashford</h2>
                <p className="text-sm text-gray-400">Voice: Nancy Multilingual | Style: Newscast-Formal (1.8) | Authoritative</p>
              </div>
              <button
                onClick={() => testVoice('selene')}
                disabled={playing !== null}
                className={`px-6 py-2 rounded-lg font-bold ${
                  playing === 'selene' 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600'
                }`}
              >
                {playing === 'selene' ? '🔊 Playing...' : '▶️ Test'}
              </button>
            </div>
            <p className="text-gray-300 italic">"{SAMPLE_DIALOGUES.selene}"</p>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="font-bold mb-2">🔧 API Status</h3>
          <p className="text-sm text-gray-400">
            {speechService.isSupported() 
              ? '✅ Azure TTS API key detected' 
              : '❌ No Azure TTS API key found - add to .env'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Check browser console for detailed logs
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <h3 className="font-bold mb-2">📝 Instructions</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click individual "Test" buttons to hear each character</li>
            <li>• Click "Test All Voices" to hear all characters in sequence</li>
            <li>• Check browser console for API errors or rate limits</li>
            <li>• Azure TTS free tier: 500,000 chars/month</li>
          </ul>
        </div>

        {/* Back to Game */}
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold"
          >
            ← Back to Game
          </a>
        </div>
      </div>
    </div>
  )
}
