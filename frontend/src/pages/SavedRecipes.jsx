import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savesAPI } from '../api/client';
import RecipeCard from '../components/recipe/RecipeCard';
import { FullPageSpinner } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    savesAPI.getMySaved()
      .then(res => setRecipes(res.data.recipes))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <FullPageSpinner />;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">🔖 Saved Recipes</h1>
          <p className="text-gray-500">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} in your library</p>
        </div>
        <Link to="/" className="btn-secondary">Browse Feed</Link>
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Your library is empty"
          message="Browse the feed and save recipes you love. They'll appear here for easy access."
          action={<Link to="/" className="btn-primary">Browse Recipes</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recipes.map(r => (
            <RecipeCard
              key={r.id}
              recipe={{ ...r, is_saved: true }}
              onSaveToggle={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
