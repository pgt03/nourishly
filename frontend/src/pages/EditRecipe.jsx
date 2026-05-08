import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecipeForm from '../components/recipe/RecipeForm';
import { FullPageSpinner } from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function EditRecipe() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    recipesAPI.getById(id)
      .then(res => {
        if (res.data.user_id !== user?.id) { toast.error('Not your recipe'); navigate('/'); return; }
        setRecipe(res.data);
      })
      .catch(() => { toast.error('Recipe not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await recipesAPI.update(id, formData);
      toast.success('Recipe updated!');
      navigate(`/recipe/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  if (loading) return <FullPageSpinner />;
  if (!recipe) return null;

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
        <p className="text-gray-500">Update your recipe details.</p>
      </div>
      <div className="card p-6 sm:p-8">
        <RecipeForm initialValues={recipe} onSubmit={handleSubmit} loading={saving} submitLabel="💾 Save Changes" />
      </div>
    </div>
  );
}
