import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { likesAPI } from '../../api/client';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

export default function LikeButton({ recipeId, initialLiked, initialCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount || 0);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!user) { toast.error('Log in to like recipes'); navigate('/login'); return; }
    setLoading(true);
    try {
      if (liked) {
        const res = await likesAPI.unlike(recipeId);
        setLiked(false); setCount(res.data.like_count);
      } else {
        const res = await likesAPI.like(recipeId);
        setLiked(true); setCount(res.data.like_count);
        toast.success('Liked!');
      }
    } catch { } finally { setLoading(false); }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${liked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-red-500 border-2 border-red-300 hover:bg-red-50'}`}
    >
      {loading ? <Spinner size="sm" /> : <span>{liked ? '❤️' : '🤍'}</span>}
      {liked ? 'Liked' : 'Like'}
      {count > 0 && <span className={`text-xs ml-0.5 ${liked ? 'text-red-100' : 'text-red-300'}`}>({count})</span>}
    </button>
  );
}
