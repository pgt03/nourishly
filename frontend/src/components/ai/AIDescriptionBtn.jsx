import { useState } from 'react';
import { aiAPI } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

export default function AIDescriptionBtn({ title, ingredients, cuisineType, onResult }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const generate = async () => {
    if (!user) { toast.error('Log in to use AI features'); return; }
    if (!title) { toast.error('Add a recipe title first'); return; }
    setLoading(true);
    try {
      const res = await aiAPI.generateDescription({ title, ingredients, cuisine_type: cuisineType });
      onResult(res.data.description);
      toast.success('AI description generated!');
    } catch (err) {
      const msg = err.response?.data?.error;
      if (err.response?.data?.fallback) {
        toast('AI unavailable — write a description manually', { icon: '✍️' });
      } else {
        toast.error(msg || 'AI generation failed');
      }
    } finally { setLoading(false); }
  };

  return (
    <button
      type="button"
      onClick={generate}
      disabled={loading || !title}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? <Spinner size="sm" /> : <span>✨</span>}
      {loading ? 'Generating…' : 'Generate with AI'}
    </button>
  );
}
