# Through the Ifglass: Story-format bible (episodes 016+)

Why we're switching: in Oct 2026 a what-if channel went from 0 to 1.7M views in two weeks. Its winning formula was **stories** rather than explainers: a named hero, emotional stakes, a ticking clock, chapters alternating Plus and Minus, a twist, and a cliffhanger. We copy that *structure* but nothing else. Our edge stays the same: **the real science is the rules of the power.**

## Recurring cast (same in every episode, so viewers bond with them)
- **Glint**: 19 years old. Works the night shift as an assistant at the city science museum, loves facts, a bit awkward, kind. He narrates nothing; the narrator tells his story. Wears gold round glasses and a mint scarf.
- **Nan**: his grandmother, who raised him. Sharp, funny, stubborn, has a weak heart. Bakes when she's worried.
- **Kai**: his best friend since primary school. Loud, brave, terrible ideas, loyal.
- **Dr. Osei**: the museum's senior scientist and Glint's mentor. Calm, explains the science when needed.
- (Optional) **Mr. Pickles**: Nan's old grumpy cat.

Each episode is a **standalone story**. The power arrives at the start and is resolved or reversed by the end, so episodes can be watched in any order. The cast and their relationships stay the same.

## Structure (aim for 1,300–1,500 words, about 9–10 min)
1. **Cold open, mid-tension (40–70 words).** Start at the worst moment, with a ticking number if possible ("Glint has forty seconds before the floor gives way.").
2. **"Let's go back." How he gets the power (100–150 words).** Something strange at the museum: an exhibit, an experiment, a storm. Keep it quick.
3. **The Rules (120–180 words).** The real science of the power, explained simply. This is our credibility.
4. **Plus / Minus montage (400–550 words).** 5–7 short beats, each starting with "Plus:" or "Minus:" as its own sentence. Each beat is a mini-scene with Nan, Kai or the city, plus one real science fact. End on a Minus that sets up the crisis.
5. **The Crisis, with a ticking clock (250–350 words).** Someone he loves is in real danger: Nan, Kai, or a stranger he could save. Use a countdown in time or distance.
6. **The Solution (120–200 words).** Glint wins by **using the science rule cleverly**. Never by luck or a new power.
7. **The Twist (60–100 words).** A surprising, satisfying turn: the power's real cost, a reveal about Nan or Kai, or something new it unlocks.
8. **Outro (50–80 words).** Ask the audience a direct question ("Would you want this power, knowing the cost?"), then "If you want Part 2, tell me in the comments." Tease the next episode by name (given in your assignment).

## Writing rules (it's read by ONE AI narrator voice in ElevenLabs)
- Third person, present tense, cinematic. Short punchy sentences. Fragments are fine. Build suspense.
- Very little dialogue, kept short. Use "Nan says, ..." style so one voice can read it.
- **Spell out all numbers in words** ("forty seconds", "two thousand and twenty-six") so the voice reads them right.
- Put `<break time="1.0s" />` on its own line between sections (6–8 per script).
- No section headers or stage directions in the VOICEOVER file. It's only what gets spoken. "Plus:" and "Minus:" are spoken, so they stay.
- Facts must be real and checkable. When stretching into fiction, say so in-story ("In this world, the rule is..."). Never state a false fact as real science.
- Family-friendly: no gore, no swearing. Peril is fine; nobody dies on screen.
- Don't reuse any other channel's storylines (no lifespan countdowns over heads, no stealing years, no "100% of your brain" pill, no level-up system, no betrayal glow). Make up our own.

## Files to write, per episode
1. `ideas/<slug>/<NNN>-<slug>-VOICEOVER.txt`: the spoken script only.
2. `ideas/<slug>/<NNN>-<slug>-NOTES.md`, containing:
   - Title, in "What If You Could X?" format with ONE word in CAPS, e.g. "What If You Turned INVISIBLE?". Give 2 options.
   - **Thumbnail:** a short headline (2 lines, at most 3 words each, first person) and the scene.
   - **Chapters:** list with labels matching the structure: Cold open / The Rules / Plus… / Minus… / The Crisis / The Twist / Would you?
   - **Fact check:** each real-science claim with a source (paper, agency or textbook level).
   - **Part-series hook ideas:** 3–4 lines.
