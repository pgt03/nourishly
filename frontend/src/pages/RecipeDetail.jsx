import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime, getRecipeImage } from '../utils/formatters';
import Spinner, { FullPageSpinner } from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import SaveButton from '../components/social/SaveButton';
import LikeButton from '../components/social/LikeButton';
import CommentSection from '../components/social/CommentSection';
import IngredientSubBtn from '../components/ai/IngredientSubBtn';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    recipesAPI.getById(id)
      .then(res => setRecipe(res.data))
      .catch(err => {
        if (err.response?.status === 404) { toast.error('Recipe not found'); navigate('/'); }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await recipesAPI.delete(id);
      toast.success('Recipe deleted');
      navigate('/');
    } catch { toast.error('Could not delete recipe'); }
    finally { setDeleting(false); setConfirmDelete(false); }
  };

  if (loading) return <FullPageSpinner />;
  if (!recipe) return null;

  const isOwner = user?.id === recipe.user_id;
  const imgUrl = getRecipeImage(recipe);
  const allTags = [...(recipe.tags || []), recipe.is_budget ? 'Budget' : null, recipe.is_kid_friendly ? 'Kid-Friendly' : null, recipe.is_fifteen_min ? '15-Min Meal' : null].filter(Boolean);

  return (
    <div className="page-container max-w-4xl">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        ← Back
      </button>

      <article className="animate-fade-in">
        {/* Hero photo */}
        <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-100 shadow-sm">
          <img
            src={imgUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=75'; }}
          />
        </div>

        {/* Title + owner actions */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight flex-1">{recipe.title}</h1>
          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/recipe/${id}/edit`} className="btn-secondary text-sm">✏️ Edit</Link>
              <button onClick={() => setConfirmDelete(true)} className="btn-danger text-sm">🗑️ Delete</button>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <DifficultyBadge difficulty={recipe.difficulty} />
          {recipe.cook_time && <span className="badge bg-gray-100 text-gray-600">🕐 Cook: {formatTime(recipe.cook_time)}</span>}
          {recipe.prep_time && <span className="badge bg-gray-100 text-gray-600">⏱️ Prep: {formatTime(recipe.prep_time)}</span>}
          {recipe.servings && <span className="badge bg-gray-100 text-gray-600">🍽️ {recipe.servings} servings</span>}
          {recipe.cuisine_type && <span className="badge bg-warm-100 text-warm-600">🌍 {recipe.cuisine_type}</span>}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {allTags.map(t => (
              <span key={t} className="badge bg-brand-50 text-brand-700 border border-brand-200">{t}</span>
            ))}
          </div>
        )}

        {/* Author */}
        <Link to={`/profile/${recipe.user_id}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6 hover:bg-gray-100 transition-colors group w-fit">
          <Avatar src={recipe.avatar_url} username={recipe.username} size="md" />
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">@{recipe.username}</p>
            <p className="text-xs text-gray-400">{formatDate(recipe.created_at)}</p>
          </div>
        </Link>

        {/* Description */}
        {recipe.description && (
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-brand-300 pl-4">{recipe.description}</p>
          </div>
        )}

        {/* Actions row */}
        <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-100">
          <SaveButton recipeId={recipe.id} initialSaved={recipe.is_saved} initialCount={recipe.save_count} />
          <LikeButton recipeId={recipe.id} initialLiked={recipe.is_liked} initialCount={recipe.like_count} />
          <IngredientSubBtn ingredients={recipe.ingredients} cuisineType={recipe.cuisine_type} />
        </div>

        {/* Two-column: Ingredients + Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Ingredients */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🛒</span> Ingredients
            </h2>
            <ul className="space-y-2">
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i} className="flex items-baseline gap-2 py-2 border-b border-gray-50 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-1.5" />
                  <span className="font-medium text-brand-700 text-sm min-w-[4rem]">{ing.amount} {ing.unit}</span>
                  <span className="text-gray-800 text-sm">{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span> Instructions
            </h2>
            <ol className="space-y-4">
              {(recipe.steps || []).map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Comments */}
        <div className="border-t border-gray-100 pt-8">
          <CommentSection recipeId={recipe.id} />
        </div>
      </article>

      {/* Delete confirm modal */}
      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete Recipe">
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>"{recipe.title}"</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 flex items-center justify-center gap-2">
            {deleting ? <Spinner size="sm" /> : '🗑️'} Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
