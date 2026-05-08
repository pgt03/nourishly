import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { savesAPI } from '../../api/client';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

export default function SaveButton({ recipeId, initialSaved, initialCount, onToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(initialSaved);
  const [count, setCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!user) { toast.error('Log in to save recipes'); navigate('/login'); return; }
    setLoading(true);
    try {
      if (saved) {
        const res = await savesAPI.unsave(recipeId);
        setSaved(false); setCount(res.data.save_count);
        toast('Removed from saved', { icon: '📑' });
      } else {
        const res = await savesAPI.save(recipeId);
        setSaved(true); setCount(res.data.save_count);
        toast.success('Saved to your library!');
      }
      onToggle?.({ saved: !saved });
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${saved ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-brand-600 border-2 border-brand-600 hover:bg-brand-50'}`}
    >
      {loading ? <Spinner size="sm" /> : <span>{saved ? '🔖' : '📑'}</span>}
      {saved ? 'Saved' : 'Save'}
      {count > 0 && <span className={`text-xs ml-0.5 ${saved ? 'text-brand-100' : 'text-brand-400'}`}>({count})</span>}
    </button>
  );
}
