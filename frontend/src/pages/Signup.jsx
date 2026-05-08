import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Signup() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const googleBtnRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGoogleSuccess = useCallback(async (credential) => {
    setGoogleLoading(true);
    try {
      await googleLogin(credential);
      toast.success('Welcome to Nourishly! 🥗');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Google sign-up failed');
    } finally { setGoogleLoading(false); }
  }, [googleLogin, navigate]);

  const { available: googleAvailable } = useGoogleAuth(handleGoogleSuccess, googleBtnRef);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.username || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.username.length < 2) { toast.error('Username must be at least 2 characters'); return; }
    setLoading(true);
    try {
      await register(form.email, form.username, form.password);
      toast.success('Welcome to Nourishly! 🥗');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-warm-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join Nourishly</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Start cooking smarter, healthier, together</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            {['🍽️ Share recipes', '🔖 Save favourites', '✨ AI assistance'].map((f, i) => (
              <div key={i} className="bg-brand-50 dark:bg-brand-900/30 rounded-xl p-2.5 text-xs text-brand-700 dark:text-brand-300 font-medium">{f}</div>
            ))}
          </div>

          {/* Google Sign-Up */}
          {googleAvailable && (
            <>
              <div ref={googleBtnRef} className="w-full mb-4" />
              {googleLoading && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Spinner size="sm" /> Creating account…
                </div>
              )}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-400 dark:text-gray-500">
                  <span className="bg-white dark:bg-gray-800 px-3">or sign up with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => set('email', e.target.value)} autoFocus required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input type="text" className="input-field" placeholder="homechef99"
                value={form.username} onChange={e => set('username', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Creating account…</> : 'Create free account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
