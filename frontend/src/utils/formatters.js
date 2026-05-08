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

const CUISINE_PHOTOS = {
  Indian:          'photo-1585937421612-70a008356fbe',
  Italian:         'photo-1498837167922-ddd27525d352',
  Mexican:         'photo-1565299624946-b28f40a84f97',
  Chinese:         'photo-1563245372-f21724e3856d',
  Japanese:        'photo-1569050467447-ce54b3bbc37d',
  Thai:            'photo-1455619452474-d2be8b1e70cd',
  Mediterranean:   'photo-1540189549336-e6e99c3679fe',
  American:        'photo-1568901346375-23c9450c58cd',
  French:          'photo-1414235077428-338989a2e8c0',
  Korean:          'photo-1590301157890-4810ed352733',
  Greek:           'photo-1544025162-d76538f3ee17',
  Vietnamese:      'photo-1555126634-323283e090fa',
  'Middle Eastern':'photo-1547592180-85f173990554',
};

const FALLBACK_PHOTOS = [
  'photo-1512621776951-a57141f2eefd',
  'photo-1546069901-ba9599a7e63c',
  'photo-1490645935967-10de6ba17061',
  'photo-1547592166-23ac45744acd',
  'photo-1504674900247-0877df9cc836',
  'photo-1498579809087-ef1e558fd1da',
];

export function getRecipeImage(recipe) {
  if (recipe?.photo_url) return getImageUrl(recipe.photo_url);
  const cuisinePhoto = CUISINE_PHOTOS[recipe?.cuisine_type];
  if (cuisinePhoto) return `https://images.unsplash.com/${cuisinePhoto}?auto=format&fit=crop&w=600&q=75`;
  const idx = (recipe?.id || 0) % FALLBACK_PHOTOS.length;
  return `https://images.unsplash.com/${FALLBACK_PHOTOS[idx]}?auto=format&fit=crop&w=600&q=75`;
}

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export const CUISINES = ['Any','Italian','Indian','Chinese','Mexican','Japanese','Thai','Mediterranean','American','Middle Eastern','French','Korean','Greek','Vietnamese'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const TAGS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'High-Protein', 'Low-Carb', 'Quick', 'Budget', 'Family-Friendly'];
