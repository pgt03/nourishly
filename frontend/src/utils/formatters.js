export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function getImageUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return url;
}

export function getRecipeImage(recipe, { width = 600, height = 450 } = {}) {
  if (recipe?.photo_url) return getImageUrl(recipe.photo_url);

  const title = recipe?.title || 'delicious homemade meal';
  const cuisine = recipe?.cuisine_type && recipe.cuisine_type !== 'Any'
    ? `, ${recipe.cuisine_type} cuisine` : '';

  const prompt =
    `award-winning professional food photography of ${title}${cuisine}, ` +
    `beautifully plated on elegant tableware, close-up macro shot, ` +
    `soft warm natural lighting, vibrant mouth-watering colors, ` +
    `bokeh background, ultra-realistic, 4k, appetising, tempting`;

  // Seed from recipe id so same recipe always generates same image
  const seed = recipe?.id ? Number(String(recipe.id).replace(/\D/g, '').slice(-6)) % 999983 : 42;

  return (
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}`
  );
}

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export const CUISINES = ['Any','Italian','Indian','Chinese','Mexican','Japanese','Thai','Mediterranean','American','Middle Eastern','French','Korean','Greek','Vietnamese'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const TAGS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'High-Protein', 'Low-Carb', 'Quick', 'Budget', 'Family-Friendly'];
