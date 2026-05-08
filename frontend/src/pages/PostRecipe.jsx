import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../api/client';
import RecipeForm from '../components/recipe/RecipeForm';
import toast from 'react-hot-toast';

export default function PostRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await recipesAPI.create(formData);
      toast.success('Recipe posted! 🎉');
      navigate(`/recipe/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to post recipe');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share a Recipe</h1>
        <p className="text-gray-500">Share your favourite recipe with the Nourishly community.</p>
      </div>
      <div className="card p-6 sm:p-8">
        <RecipeForm onSubmit={handleSubmit} loading={loading} submitLabel="🥗 Post Recipe" />
      </div>
    </div>
  );
}
