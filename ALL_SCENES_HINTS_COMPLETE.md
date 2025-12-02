# ✅ Character Hints Implemented Across All Scenes

## Summary

Character hints with AI-generated stories are now implemented in **all puzzle scenes**:

- ✅ **Foyer Scene** → Elara (Pink border)
- ✅ **Study Scene** → Harlan (Cyan border)  
- ✅ **Nursery Scene** → Mira (Gold border)

## How It Works

### Universal Pattern

1. User clicks "Ask [Character] for Hint"
2. Groq AI generates NEW 1-2 line personal story
3. Story appears as subtitle, character speaks it
4. After 6 seconds, hint appends below
5. Character speaks the hint
6. Subtitle fades after 21 seconds

### Each Click = New Story

- **First click**: "I remember the warmth of those summer days..."
- **Second click**: "Sometimes I hear Mira's laughter echoing..."
- **Third click**: "Harlan worked so hard to keep us together..."

Same hint, different story each time!

## Character Details

### Elara (Foyer - Tapestry Puzzle)
- **Color**: `#ff69b4` (Pink)
- **Voice**: Sad, mournful, maternal
- **Background**: Mother who cared for Mira, represents family bonds
- **Story Themes**: Family warmth, maternal love, memories of togetherness

### Harlan (Study - Neural Maze)
- **Color**: `#00bfff` (Cyan)
- **Voice**: Confused, fragmented, intellectual
- **Background**: Scientist who created Eternal Harmony, fragmented mind
- **Story Themes**: Scientific ambition, regret, fragmented memories, confusion

### Mira (Nursery - Love Harvest)
- **Color**: `#ffd700` (Gold)
- **Voice**: Childlike, innocent, scared
- **Background**: 6-year-old daughter, loved stories and hugs
- **Story Themes**: Childhood innocence, play, missing parents, bedtime stories

## API Endpoint

**`POST /api/character-hint`**

```typescript
{
  "character": "elara" | "harlan" | "mira",
  "puzzleContext": "Description of puzzle",
  "characterBackground": "Character's story and personality",
  "hintNumber": 1 // Increments each click for variety
}
```

**Response:**
```typescript
{
  "story": "1-2 line personal memory (varies each time)",
  "hint": "Practical puzzle guidance (consistent)",
  "character": "elara"
}
```

## Files Modified

### Scenes Updated
1. **components/scenes/FoyerScene.tsx**
   - Elara's hints with pink border
   - Removed ghost debate system

2. **components/scenes/StudyScene.tsx**
   - Harlan's hints with cyan border
   - Removed ghost debate system

3. **components/scenes/NurseryScene.tsx**
   - Mira's hints with gold border
   - Removed ghost debate system

### API Created
- **app/api/character-hint/route.ts**
  - Groq AI integration
  - Temperature: 0.9 for variety
  - Fallback stories for each character

## Button Changes

**Before:**
- "🔮 Ask Ghost Council"
- "🔮 Ghosts Debating..."

**After:**
- "💭 Ask [Character] for Hint"
- "💭 [Character] is speaking..."

## Subtitle Styling

Each character has unique border color:

```css
/* Elara - Pink */
border: 2px solid #ff69b4;
box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);

/* Harlan - Cyan */
border: 2px solid #00bfff;
box-shadow: 0 0 30px rgba(0, 191, 255, 0.5);

/* Mira - Gold */
border: 2px solid #ffd700;
box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
```

## Testing Checklist

### Foyer (Elara)
- [ ] Click "Ask Elara for Hint"
- [ ] Story appears with pink border
- [ ] Elara speaks story
- [ ] Hint appends after 6 seconds
- [ ] Elara speaks hint
- [ ] Click again → NEW story, same hint

### Study (Harlan)
- [ ] Click "Ask Harlan for Hint"
- [ ] Story appears with cyan border
- [ ] Harlan speaks story (confused voice)
- [ ] Hint appends after 6 seconds
- [ ] Click again → NEW story, same hint

### Nursery (Mira)
- [ ] Click "Ask Mira for Hint"
- [ ] Story appears with gold border
- [ ] Mira speaks story (childlike voice)
- [ ] Hint appends after 6 seconds
- [ ] Click again → NEW story, same hint

## Benefits

✅ **Personalized**: Each character shares their own memories
✅ **Varied**: AI generates different stories each time
✅ **Immersive**: Movie-style subtitles don't block gameplay
✅ **Character Voice**: Each ghost speaks in their unique voice
✅ **No Debates**: Simpler, more focused on individual characters
✅ **Replayable**: Multiple clicks give fresh content

## Future: Chapel Scene

For Chapel scene with multiple ghosts, you can:
- Have each ghost give their own hint
- Or have a rotating system where different ghosts respond each time
- Use the same API with different character parameters

---

**All puzzle scenes now have character-driven hints with AI-generated stories!**
