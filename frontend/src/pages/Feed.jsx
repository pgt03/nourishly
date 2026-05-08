import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recipesAPI } from '../api/client';
import RecipeCard from '../components/recipe/RecipeCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { CUISINES, DIFFICULTIES } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '🤖', label: 'AI-Powered', desc: 'Smart descriptions & suggestions' },
  { icon: '🥦', label: 'Healthy Focus', desc: 'Nutritious family meals' },
  { icon: '⚡', label: 'Under 15 Min', desc: 'Quick weeknight dinners' },
  { icon: '💰', label: 'Budget Friendly', desc: 'More meals, less money' },
];

export default function Feed() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 12;

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [quick, setQuick] = useState(false);
  const [budget, setBudget] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const dSearch = useDebounce(search, 400);

  const fetchRecipes = useCallback(async (pg = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: LIMIT };
      if (dSearch) params.search = dSearch;
      if (difficulty) params.difficulty = difficulty;
      if (cuisine && cuisine !== 'Any') params.cuisine = cuisine;
      if (quick) params.quick = '1';
      if (budget) params.budget = '1';
      if (kidFriendly) params.kid_friendly = '1';

      const res = await recipesAPI.getAll(params);
      const { recipes: data, total: tot } = res.data;
      setTotal(tot);
      setRecipes(prev => append ? [...prev, ...data] : data);
      setHasMore(pg * LIMIT < tot);
    } catch { } finally { setLoading(false); }
  }, [dSearch, difficulty, cuisine, quick, budget, kidFriendly]);

  useEffect(() => { setPage(1); fetchRecipes(1, false); }, [fetchRecipes]);

  const loadMore = () => { const next = page + 1; setPage(next); fetchRecipes(next, true); };
  const reset = () => { setSearch(''); setDifficulty(''); setCuisine(''); setQuick(false); setBudget(false); setKidFriendly(false); };
  const anyFilter = search || difficulty || (cuisine && cuisine !== 'Any') || quick || budget || kidFriendly;

  return (
    <div>
      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 dark:from-brand-800 dark:via-brand-900 dark:to-gray-900 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left — Text content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                AI-Powered Healthy Cooking Ecosystem
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Cook Smarter.<br />
                <span className="text-green-200">Eat Better.</span>
              </h1>

              <p className="text-green-100 dark:text-green-200 text-base sm:text-lg mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Nourishly helps busy modern families cook{' '}
                <strong className="text-white">smarter, healthier, faster</strong>{' '}
                and more <strong className="text-white">affordably</strong> — powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                {user ? (
                  <Link to="/post" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                    + Share a Recipe
                  </Link>
                ) : (
                  <>
                    <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                      🚀 Get Started Free
                    </Link>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3.5 rounded-2xl backdrop-blur-sm transition-all text-sm">
                      Log in
                    </Link>
                  </>
                )}
                <Link to="/help" className="inline-flex items-center gap-1.5 text-green-200 hover:text-white text-sm font-medium transition-colors">
                  📚 How it works →
                </Link>
              </div>
            </div>

            {/* Right — Real food photo */}
            <div className="hidden lg:block animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/30 to-transparent rounded-3xl z-10" />
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"
                  alt="Colourful healthy food bowl"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl object-cover aspect-[4/3]"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80'; }}
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 z-20">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">AI-Powered</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">Smart recipes</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 z-20">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">Under 15 min</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">Quick meals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature chips row */}
        <div className="relative border-t border-white/10 bg-black/10 dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FEATURES.map(f => (
                <div key={f.label} className="flex items-center gap-2.5 text-white">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-0.5">{f.label}</p>
                    <p className="text-xs text-green-200 leading-none hidden sm:block">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="page-container">
        {/* Search + Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                className="input-field pl-10"
                placeholder="Search recipes by name or ingredient…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 flex-shrink-0 ${showFilters ? 'border-brand-400 text-brand-700 dark:text-brand-400' : ''}`}
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Filters</span>
              {anyFilter && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-slide-up">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">Difficulty</label>
                  <select className="input-field text-sm" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="">Any</option>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">Cuisine</label>
                  <select className="input-field text-sm" value={cuisine} onChange={e => setCuisine(e.target.value)}>
                    {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '⚡ Under 15 min', val: quick, set: setQuick },
                  { label: '💰 Budget meals', val: budget, set: setBudget },
                  { label: '👶 Kid-friendly', val: kidFriendly, set: setKidFriendly },
                ].map(({ label, val, set }) => (
                  <button
                    key={label} onClick={() => set(!val)}
                    className={`badge cursor-pointer border transition-all ${val ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}
                  >
                    {label}
                  </button>
                ))}
                {anyFilter && (
                  <button onClick={reset} className="badge bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100">
                    ✕ Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {total === 0 ? 'No recipes found' : `${total} recipe${total !== 1 ? 's' : ''}${anyFilter ? ' matching your filters' : ' in the community'}`}
          </p>
        )}

        {/* Grid */}
        {loading && recipes.length === 0 ? (
          <div className="flex justify-center py-20"><Spinner size="xl" /></div>
        ) : recipes.length === 0 ? (
          <EmptyState
            emoji="🍳"
            title={anyFilter ? 'No recipes match your filters' : 'No recipes yet'}
            message={anyFilter ? 'Try adjusting your search or clearing filters.' : 'Be the first to share a recipe with the community!'}
            action={<>
              {anyFilter && <button onClick={reset} className="btn-secondary">Clear filters</button>}
              {!anyFilter && user && <Link to="/post" className="btn-primary">Post the first recipe</Link>}
            </>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recipes.map(r => <RecipeCard key={r.id} recipe={r} onSaveToggle={() => fetchRecipes(1, false)} />)}
            </div>
            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={loadMore} disabled={loading} className="btn-secondary px-8 py-3">
                  {loading ? <Spinner size="sm" /> : 'Load more recipes'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
