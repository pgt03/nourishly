import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { savesAPI, likesAPI } from '../../api/client';
import { formatDate, formatTime, truncate, getRecipeImage } from '../../utils/formatters';
import Avatar from '../ui/Avatar';
import DifficultyBadge from '../ui/DifficultyBadge';
import toast from 'react-hot-toast';

function ImageWithSkeleton({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const fallback = 'https://image.pollinations.ai/prompt/delicious%20food%20beautifully%20plated?width=600&height=450&nologo=true&model=flux&seed=1';
  return (
    <div className="w-full h-full relative">
      {!loaded && !errored && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse flex items-center justify-center">
          <span className="text-4xl opacity-30">🍽️</span>
        </div>
      )}
      <img
        src={errored ? fallback : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!errored) setErrored(true); }}
        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function RecipeCard({ recipe, onSaveToggle, onLikeToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [liking, setLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(recipe.is_saved);
  const [isLiked, setIsLiked] = useState(recipe.is_liked);
  const [saveCount, setSaveCount] = useState(recipe.save_count || 0);
  const [likeCount, setLikeCount] = useState(recipe.like_count || 0);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Log in to save recipes'); navigate('/login'); return; }
    setSaving(true);
    try {
      if (isSaved) {
        const res = await savesAPI.unsave(recipe.id);
        setIsSaved(false);
        setSaveCount(res.data.save_count);
        toast.success('Removed from saved');
      } else {
        const res = await savesAPI.save(recipe.id);
        setIsSaved(true);
        setSaveCount(res.data.save_count);
        toast.success('Saved!');
      }
      onSaveToggle?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally { setSaving(false); }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Log in to like recipes'); navigate('/login'); return; }
    setLiking(true);
    try {
      if (isLiked) {
        const res = await likesAPI.unlike(recipe.id);
        setIsLiked(false);
        setLikeCount(res.data.like_count);
      } else {
        const res = await likesAPI.like(recipe.id);
        setIsLiked(true);
        setLikeCount(res.data.like_count);
      }
      onLikeToggle?.();
    } catch { } finally { setLiking(false); }
  };

  const imgUrl = getRecipeImage(recipe);

  return (
    <div onClick={() => navigate(`/recipe/${recipe.id}`)} className="card card-hover group block animate-fade-in cursor-pointer">
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 to-warm-50 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
        <ImageWithSkeleton src={imgUrl} alt={recipe.title} />
        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {recipe.is_fifteen_min ? <span className="badge bg-warm-100 text-warm-600">⚡ 15 min</span> : null}
          {recipe.is_budget ? <span className="badge bg-blue-100 text-blue-600">💰 Budget</span> : null}
          {recipe.is_kid_friendly ? <span className="badge bg-pink-100 text-pink-600">👶 Kids</span> : null}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 flex-1 group-hover:text-brand-700 transition-colors">
            {recipe.title}
          </h3>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>

        {recipe.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{truncate(recipe.description, 100)}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {recipe.cook_time && <span>🕐 {formatTime(recipe.cook_time)}</span>}
          {recipe.cuisine_type && <span>🌍 {recipe.cuisine_type}</span>}
          {recipe.servings && <span>🍽️ {recipe.servings} servings</span>}
        </div>

        {/* Author + Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/profile/${recipe.user_id}`}
            onClick={e => { e.stopPropagation(); }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar src={recipe.avatar_url} username={recipe.username} size="xs" />
            <span className="text-xs text-gray-500 font-medium">@{recipe.username}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50'}`}
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${isSaved ? 'text-brand-600 bg-brand-50' : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'}`}
            >
              <span>{isSaved ? '🔖' : '📑'}</span>
              <span>{saveCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
