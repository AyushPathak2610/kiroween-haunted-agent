import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { character, puzzleContext, characterBackground, hintNumber } = await request.json()

    const prompt = `You are ${character}, a ghost in a haunted mansion. 

Character Background: ${characterBackground}

Puzzle Context: ${puzzleContext}

This is hint request #${hintNumber || 1}. Generate a DIFFERENT personal story each time, but keep the hint consistent.

Generate a response in this EXACT format:
STORY: [1-2 sentences where you share something DIFFERENT and personal about yourself, your memories, or your feelings. Make it unique and emotional.]
HINT: [A helpful hint about the puzzle - this should be consistent and practical]

Keep the story emotional and personal. Vary the memories (childhood, family moments, regrets, hopes, etc.).
Keep the hint clear and practical.

Example format:
STORY: I remember the warmth of those summer days, when our family was whole and happy. Those memories are precious to me.
HINT: Look at the symbols on the tapestry. The sun represents happy memories, the ring represents promises, and the crystal represents our connection.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a ghost sharing varied memories each time. Each story should be different and emotional. Be creative with memories - talk about different moments, feelings, regrets, hopes, or observations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9, // Higher temperature for more variety
      max_tokens: 200
    })

    const response = completion.choices[0]?.message?.content || ''
    
    console.log(`Groq response for ${character} hint #${hintNumber}:`, response.substring(0, 100))
    
    // Parse the response
    const storyMatch = response.match(/STORY:\s*(.+?)(?=HINT:|$)/s)
    const hintMatch = response.match(/HINT:\s*(.+?)$/s)
    
    const story = storyMatch ? storyMatch[1].trim() : "I remember when this mansion was filled with life and laughter."
    const hint = hintMatch ? hintMatch[1].trim() : "Look carefully at the symbols and match them to the memories."

    console.log(`Parsed - Story: "${story.substring(0, 50)}...", Hint: "${hint.substring(0, 50)}..."`)

    return NextResponse.json({
      story,
      hint,
      character
    })

  } catch (error) {
    console.error('Character hint generation failed:', error)
    
    // Fallback response with variety
    const fallbackStories = [
      "I remember when this mansion was filled with warmth and love. Those days feel like a distant dream now.",
      "Sometimes I hear Mira's laughter echoing through these halls. It breaks my heart every time.",
      "Harlan worked so hard to keep us together. If only I had known what his experiment would cost us.",
      "I used to read bedtime stories to Mira in the nursery. Her favorite was about a princess who never gave up hope.",
      "The smell of fresh flowers used to fill this foyer. Now only dust and memories remain."
    ]
    
    const randomStory = fallbackStories[Math.floor(Math.random() * fallbackStories.length)]
    
    return NextResponse.json({
      story: randomStory,
      hint: "Look at the symbols carefully. Each one represents a different type of memory from our family's past.",
      character: 'elara'
    })
  }
}
