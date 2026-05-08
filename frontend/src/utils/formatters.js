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

export function truncate(str, len = 120) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export const CUISINES = ['Any','Italian','Indian','Chinese','Mexican','Japanese','Thai','Mediterranean','American','Middle Eastern','French','Korean','Greek','Vietnamese'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const TAGS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'High-Protein', 'Low-Carb', 'Quick', 'Budget', 'Family-Friendly'];
