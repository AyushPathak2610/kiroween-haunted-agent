# Voice Design Guide - ElevenLabs Character Voices

Detailed voice profiles for all 5 ghost characters, optimized for ElevenLabs TTS with specific API settings and post-processing effects.

---

## 1. Elara Voss (The Mournful Anchor)

**Vibe:** 1940s Elegance, Ethereal, Breathless, Sorrowful  
**Role:** The guide. She is sad but warm. She speaks like she is floating underwater.

### Voice Description
- **Gender:** Female
- **Age:** Mid-30s
- **Accent:** British (RP) or Transatlantic
- **Delivery:** Soft, breathy, whisper-like
- **Energy:** High elegance, low energy

### ElevenLabs Setup

**Pre-made Voice Options:**
- "Bella" (Soft, Narration)
- "Rachel" (Calm)

**Voice Design Prompt:**
```
A soft-spoken British woman in her 30s, whispering a lullaby, sad and elegant, 1940s radio drama style but very quiet.
```

**API Settings:**
```javascript
{
  stability: 0.75,        // Keep her consistent and smooth
  similarity_boost: 0.80, // Keep the breathy texture
  style: 0.20            // Don't overact; keep it subtle
}
```

### Post-Processing (The "Underwater" Veil)
1. Apply **Wet Reverb** (Hall or Cathedral setting)
2. **Cut High Frequencies** slightly (Low Pass Filter)
3. Add subtle **Chorus effect**

---

## 2. Dr. Harlan Voss (The Glitching Scientist)

**Vibe:** Intellectual, Frantic, Confusion, Fragmented  
**Role:** The tortured genius. He shifts from lucid academic to confused rambler.

### Voice Description
- **Gender:** Male
- **Age:** 50s-60s
- **Accent:** American
- **Delivery:** Raspy, textured, slightly strained
- **Character:** Professor who hasn't slept in a year

### ElevenLabs Setup

**Pre-made Voice Options:**
- "Clyde" (Deep, texture)
- "Fin" (Energetic/Crazy)

**Voice Design Prompt:**
```
An older male scientist, frantic and confused, raspy voice, speaking quickly, intelligent but terrified.
```

**API Settings:**
```javascript
{
  stability: 0.30,        // Lower stability = fluctuating pitch/tone (glitchy mental state)
  similarity_boost: 0.60,
  style: 0.60            // Push the emotion
}
```

### Post-Processing (The "Cyber-Glitch")
1. Apply **Wet Reverb** (Hall or Cathedral)
2. Use **Bitcrusher effect** to make voice sound digital/low-res
3. **Manually cut small milliseconds** of audio to create stutters
   - Example: "W-w-who am I?"
4. Add subtle **digital distortion**

---

## 3. Mira Voss (The Forgotten Child)

**Vibe:** Innocent, Timid, Whispery, Fragile  
**Role:** The hidden objective. She is scared and trying not to be seen.

### Voice Description
- **Gender:** Female
- **Age:** Child (approx 6-8 years old)
- **Accent:** American
- **Delivery:** Very soft, almost a whisper
- **Note:** Not cartoony—genuine fear

### ElevenLabs Setup

**Pre-made Voice Options:**
- "Gigi" (Child)
- "Jessie" (Soft)

**Voice Design Prompt:**
```
A young girl whispering a secret, scared, timid, soft American accent.
```

**API Settings:**
```javascript
{
  stability: 0.50,        // Children's voices vary in pitch naturally
  similarity_boost: 0.75,
  style: 0.40
}
```

### Post-Processing (The "Tiny" Ghost)
1. Apply **Wet Reverb** (Hall or Cathedral)
2. **Pitch shift UP** by 1-2 semitones if AI voice is too mature
3. Add **Ping-Pong Delay** (echo bouncing left and right)

---

## 4. Theo Voss (The Dramatic Coward)

**Vibe:** Theatrical, Romantic, Anxious, Breathless  
**Role:** The tragic brother. He speaks like he is on a stage, but whispering a confession.

### Voice Description
- **Gender:** Male
- **Age:** 30s
- **Accent:** British (Posh)
- **Delivery:** Baritone, resonant, but speaking fast and anxiously

### ElevenLabs Setup

**Pre-made Voice Options:**
- "Daniel" (Authoritative British)
- "George" (Warm British)

**Voice Design Prompt:**
```
A British theater actor whispering a confession, dramatic, deep voice, anxious and fast-paced.
```

**API Settings:**
```javascript
{
  stability: 0.40,        // Allow for dramatic dynamic shifts
  similarity_boost: 0.70,
  style: 0.70            // He is an actor, let him be dramatic
}
```

### Post-Processing
1. Apply **Wet Reverb** (Hall or Cathedral)
2. Allow natural **dynamic range** (don't compress too much)
3. Slight **echo/delay** for theatrical effect

---

## 5. Selene Ashford (The Sharp Professional)

**Vibe:** Cold, Sharp, Intelligent, Softening  
**Role:** The skeptic. She speaks with precision and authority, which slowly breaks down into sadness.

### Voice Description
- **Gender:** Female
- **Age:** 30s
- **Accent:** American (Mid-Atlantic)
- **Delivery:** Alto range (lower pitch), clear articulation, firm

### ElevenLabs Setup

**Pre-made Voice Options:**
- "Charlotte" (Narrative/Seductive)
- "Dorothy" (Firm)

**Voice Design Prompt:**
```
A strict corporate lawyer, serious and sharp, American accent, lower pitch, firm but hiding sadness.
```

**API Settings:**
```javascript
{
  stability: 0.80,        // She is the most "stable" mind
  similarity_boost: 0.75,
  style: 0.10            // Keep her cold and flat
}
```

### Post-Processing
1. Apply **Wet Reverb** (Hall or Cathedral) - less than others
2. Keep **dry and clear** compared to other ghosts
3. Minimal effects to maintain professional tone

---

## 🎚️ Universal Post-Processing Guide

### For All Ghosts (The "Ghost" Reverb)
Apply a **Wet Reverb** with these settings:
- Type: Hall or Cathedral
- Mix: 40-60%
- Decay: 2-3 seconds
- **Why:** Pushes them back in the mix and makes them sound like spirits

### Tools You Can Use
- **Audio Editors:** Audacity (free), Adobe Audition
- **Video Editors:** Premiere Pro, DaVinci Resolve, CapCut
- **DAWs:** Reaper, FL Studio, Ableton

---

## 🎭 Special Effect: The Whispers (Intro Scene)

For maximum horror impact in the intro:

1. **Generate the same line 3 times** with 3 different whisper voices
2. **Layer them** on top of each other
3. **Pan:**
   - Voice 1: Left
   - Voice 2: Right
   - Voice 3: Center
4. **Reverse one** of them for subliminal horror effect
5. Apply heavy reverb to all three

---

## 📝 Implementation Notes

### Current Implementation
Your game currently uses browser TTS as fallback. To use these ElevenLabs voices:

1. Set `NEXT_PUBLIC_ELEVENLABS_API_KEY` in `.env`
2. Update voice IDs in `lib/tts/speechService.ts`
3. Apply post-processing to generated audio files
4. Store processed files in `/public/audio/voices/`

### Voice ID Mapping
```typescript
const VOICE_IDS = {
  elara: 'voice_id_for_bella_or_rachel',
  harlan: 'voice_id_for_clyde_or_fin',
  mira: 'voice_id_for_gigi_or_jessie',
  theo: 'voice_id_for_daniel_or_george',
  selene: 'voice_id_for_charlotte_or_dorothy',
  narrator: 'voice_id_for_narrator'
}
```

### API Call Example
```typescript
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', {
  method: 'POST',
  headers: {
    'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Your dialogue here",
    model_id: "eleven_monolingual_v1",
    voice_settings: {
      stability: 0.75,
      similarity_boost: 0.80,
      style: 0.20
    }
  })
})
```

---

## 🎬 Production Workflow

1. **Generate base audio** with ElevenLabs using settings above
2. **Download MP3/WAV** files
3. **Apply post-processing** effects in audio editor
4. **Export processed files** to `/public/audio/voices/`
5. **Update game** to use pre-generated files for key dialogue
6. **Keep real-time TTS** for dynamic/debug content

---

## 💡 Tips for Best Results

- **Test multiple generations** - AI voices vary slightly each time
- **Adjust stability** based on emotional intensity of the line
- **Layer effects subtly** - too much reverb = muddy audio
- **Keep originals** - always save unprocessed versions
- **Batch process** - apply same effects to all lines for consistency
