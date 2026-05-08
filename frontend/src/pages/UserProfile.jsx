import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI, recipesAPI, authAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/recipe/RecipeCard';
import { FullPageSpinner } from '../components/ui/Spinner';
import Spinner from '../components/ui/Spinner';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { userId } = useParams();
  const { user, updateUser } = useAuth();
  const isOwn = String(user?.id) === String(userId);

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarRef = useRef();

  useEffect(() => {
    setLoading(true);
    Promise.all([usersAPI.getProfile(userId), recipesAPI.getByUser(userId)])
      .then(([profRes, recRes]) => {
        setProfile(profRes.data);
        setEditForm({ username: profRes.data.username, bio: profRes.data.bio || '' });
        setRecipes(recRes.data.recipes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(editForm);
      setProfile(prev => ({ ...prev, ...res.data }));
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.error || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Avatar must be under 2MB'); return; }
    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await authAPI.uploadAvatar(fd);
      setProfile(prev => ({ ...prev, avatar_url: res.data.avatar_url }));
      updateUser(res.data);
      toast.success('Avatar updated!');
    } catch { toast.error('Avatar upload failed'); }
    finally { setUploadingAvatar(false); }
  };

  if (loading) return <FullPageSpinner />;
  if (!profile) return <div className="page-container text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="page-container max-w-5xl">
      {/* Profile header */}
      <div className="card p-8 mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar src={profile.avatar_url} username={profile.username} size="xl" />
            {isOwn && (
              <>
                <button
                  onClick={() => avatarRef.current.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  {uploadingAvatar ? <Spinner size="sm" /> : '📷'}
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <form onSubmit={saveProfile} className="space-y-3">
                <input className="input-field font-bold text-xl" value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" />
                <textarea className="input-field resize-none" rows={2} value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself…" />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                    {saving ? <Spinner size="sm" /> : null} Save
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">@{profile.username}</h1>
                  {isOwn && <button onClick={() => setEditing(true)} className="text-sm text-gray-400 hover:text-brand-600 transition-colors">✏️ Edit</button>}
                </div>
                {profile.bio && <p className="text-gray-600 mb-2">{profile.bio}</p>}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>🍽️ <strong className="text-gray-700">{profile.recipe_count}</strong> recipes</span>
                  <span>📅 Joined {formatDate(profile.created_at)}</span>
                </div>
              </>
            )}
          </div>

          {isOwn && !editing && (
            <Link to="/post" className="btn-primary text-sm flex-shrink-0">+ Post Recipe</Link>
          )}
        </div>
      </div>

      {/* Recipes */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        {isOwn ? 'My Recipes' : `Recipes by @${profile.username}`}
      </h2>

      {recipes.length === 0 ? (
        <EmptyState
          emoji="🍳"
          title={isOwn ? 'No recipes yet' : 'No recipes posted'}
          message={isOwn ? 'Share your first recipe with the community!' : `@${profile.username} hasn't posted any recipes yet.`}
          action={isOwn ? <Link to="/post" className="btn-primary">Post your first recipe</Link> : null}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
