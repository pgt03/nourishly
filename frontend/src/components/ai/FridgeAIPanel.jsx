import { useState } from 'react';
import { aiAPI } from '../../api/client';
import Spinner from '../ui/Spinner';
import DifficultyBadge from '../ui/DifficultyBadge';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function FridgeAIPanel({ onSelectRecipe }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generate = async () => {
    const items = input.split(',').map(s => s.trim()).filter(Boolean);
    if (items.length < 2) { toast.error('Add at least 2 ingredients'); return; }
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await aiAPI.fridgeRecipes(items);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI unavailable');
    } finally { setLoading(false); }
  };

  return (
    <div className="border border-dashed border-indigo-300 rounded-2xl bg-indigo-50/50 p-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-900 transition-colors w-full text-left"
      >
        <span className="text-xl">🧊</span>
        <span>What's in your fridge? Get AI recipe ideas</span>
        <span className="ml-auto text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-4 animate-slide-up">
          <p className="text-xs text-indigo-600 mb-3">Enter ingredients you have (comma-separated)</p>
          <div className="flex gap-2 mb-4">
            <input
              className="input-field flex-1"
              placeholder="e.g. chicken, garlic, tomatoes, onion"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), generate())}
            />
            <button type="button" onClick={generate} disabled={loading || !input.trim()} className="btn-primary flex-shrink-0 px-5">
              {loading ? <Spinner size="sm" /> : '✨'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-xs font-medium text-indigo-600 mb-2">AI suggested recipes:</p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectRecipe?.(s)}
                  className="w-full text-left p-3 bg-white border border-indigo-200 hover:border-indigo-400 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700">{s.name}</p>
                    <DifficultyBadge difficulty={s.difficulty} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                  {s.cook_time && <p className="text-xs text-indigo-500 mt-1">🕐 {formatTime(s.cook_time)}</p>}
                  <p className="text-xs text-indigo-400 mt-2 font-medium">Click to use this recipe →</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
