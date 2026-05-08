const router = require('express').Router();
const Groq = require('groq-sdk');
const { authRequired } = require('../middleware/auth');

function getClient() {
  const key = process.env.GROQ_AI_KEY;
  if (!key || key === 'PASTE-YOUR-GROQ-KEY-HERE') throw new Error('GROQ_AI_KEY not configured');
  return new Groq({ apiKey: key });
}

function isAIUnavailable(err) {
  return err.message.includes('GROQ_AI_KEY') ||
    err.message.includes('not configured') ||
    err.message.includes('Invalid API Key') ||
    err.message.includes('quota') ||
    err.message.includes('rate_limit') ||
    err.status === 400 || err.status === 401 || err.status === 403 || err.status === 429;
}

async function generate(prompt) {
  const groq = getClient();
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 256,
  });
  return completion.choices[0].message.content.trim();
}

// POST /api/ai/generate-description
router.post('/generate-description', authRequired, async (req, res, next) => {
  try {
    const { title, ingredients, cuisine_type } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const ingredientList = Array.isArray(ingredients)
      ? ingredients.map(i => `${i.amount || ''} ${i.unit || ''} ${i.name || ''}`.trim()).filter(Boolean).join(', ')
      : String(ingredients || '');

    const prompt = `You are an expert home chef and food storyteller helping busy modern families cook healthy meals easily.
Write a warm, appetising, beginner-friendly 2-sentence recipe description for:
Recipe Name: ${title}
${cuisine_type ? `Cuisine: ${cuisine_type}` : ''}
${ingredientList ? `Ingredients: ${ingredientList}` : ''}

Requirements:
- Under 60 words total
- Emotionally engaging and practical
- Avoid overly fancy culinary language
- Make the recipe feel easy and approachable
- Mention comfort, health, convenience, or family appeal where relevant

Return ONLY the final description, nothing else.`;

    const description = await generate(prompt);
    res.json({ description });
  } catch (err) {
    if (isAIUnavailable(err)) return res.status(503).json({ error: 'AI unavailable — write a description manually', fallback: true });
    next(err);
  }
});

// POST /api/ai/ingredient-sub
router.post('/ingredient-sub', authRequired, async (req, res, next) => {
  try {
    const { ingredient, cuisine_type } = req.body;
    if (!ingredient) return res.status(400).json({ error: 'Ingredient is required' });

    const prompt = `You are a practical home cooking assistant.
Suggest 2 realistic substitutes for "${ingredient}" in a ${cuisine_type || 'home-style'} recipe.
Requirements:
- Common household alternatives only
- Explain briefly why each substitute works (one line each)
- Keep total response under 40 words
- Prioritise healthier options where possible
- Format exactly as:
1. [substitute] — [reason]
2. [substitute] — [reason]
Return ONLY the two substitutes in that exact format, nothing else.`;

    const text = await generate(prompt);
    const lines = text.split('\n').filter(l => l.trim());
    const substitutes = lines.slice(0, 2).map(l => {
      const match = l.match(/\d+\.\s*(.+?)\s*[—–-]\s*(.+)/);
      return match ? { substitute: match[1].trim(), reason: match[2].trim() } : { substitute: l.replace(/^\d+\.\s*/, ''), reason: '' };
    });
    res.json({ ingredient, substitutes });
  } catch (err) {
    if (isAIUnavailable(err)) return res.status(503).json({ error: 'AI unavailable', fallback: true });
    next(err);
  }
});

// POST /api/ai/fridge-recipes
router.post('/fridge-recipes', authRequired, async (req, res, next) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !ingredients.length) return res.status(400).json({ error: 'Ingredients are required' });

    const ingredientStr = Array.isArray(ingredients) ? ingredients.join(', ') : ingredients;

    const prompt = `You are a practical home cooking AI helping busy families.
The user has these ingredients: ${ingredientStr}

Suggest 3 simple, practical recipes they can cook with these ingredients (plus basic pantry staples like oil, salt, pepper, garlic).
For each recipe provide:
- name
- a 1-sentence description
- cook time in minutes (integer)
- difficulty (Easy, Medium, or Hard)

Respond with ONLY a valid JSON array, no markdown, no code fences, no extra text:
[
  {"name": "...", "description": "...", "cook_time": 20, "difficulty": "Easy"},
  {"name": "...", "description": "...", "cook_time": 15, "difficulty": "Easy"},
  {"name": "...", "description": "...", "cook_time": 30, "difficulty": "Medium"}
]`;

    const text = await generate(prompt);
    let suggestions = [];
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch { suggestions = []; }
    res.json({ ingredients: ingredientStr, suggestions });
  } catch (err) {
    if (isAIUnavailable(err)) return res.status(503).json({ error: 'AI unavailable', fallback: true });
    next(err);
  }
});

module.exports = router;
