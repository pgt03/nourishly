import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { commentsAPI } from '../../api/client';
import Avatar from '../ui/Avatar';
import Spinner from '../ui/Spinner';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CommentSection({ recipeId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    commentsAPI.getByRecipe(recipeId)
      .then(res => setComments(res.data.comments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [recipeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Log in to comment'); navigate('/login'); return; }
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await commentsAPI.post(recipeId, text.trim());
      setComments(prev => [...prev, res.data]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error posting comment');
    } finally { setPosting(false); }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentsAPI.delete(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Could not delete comment'); }
  };

  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Comments {comments.length > 0 && <span className="text-gray-400 font-normal text-base">({comments.length})</span>}
      </h3>

      {/* Post comment */}
      <form onSubmit={submit} className="flex gap-3 mb-6">
        {user && <Avatar src={user.avatar_url} username={user.username} size="sm" />}
        <div className="flex-1 flex gap-2">
          <input
            className="input-field"
            placeholder={user ? 'Add a comment…' : 'Log in to comment'}
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={!user || posting}
          />
          {user && (
            <button type="submit" disabled={posting || !text.trim()} className="btn-primary px-4 flex-shrink-0">
              {posting ? <Spinner size="sm" /> : 'Post'}
            </button>
          )}
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 animate-fade-in">
              <Avatar src={c.avatar_url} username={c.username} size="sm" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-gray-900">@{c.username}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5">{c.content}</p>
              </div>
              {user?.id === c.user_id && (
                <button onClick={() => deleteComment(c.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xs self-start mt-1">✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
