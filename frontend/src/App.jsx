import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Feed from './pages/Feed';
import RecipeDetail from './pages/RecipeDetail';
import PostRecipe from './pages/PostRecipe';
import EditRecipe from './pages/EditRecipe';
import SavedRecipes from './pages/SavedRecipes';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HowToUse from './pages/HowToUse';
import { FullPageSpinner } from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <FullPageSpinner />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/help" element={<HowToUse />} />
          <Route path="/post" element={<ProtectedRoute><PostRecipe /></ProtectedRoute>} />
          <Route path="/recipe/:id/edit" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
              <div className="text-7xl mb-4 animate-bounce-soft">🍽️</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">This page doesn't exist.</p>
              <a href="/" className="btn-primary">Back to Feed</a>
            </div>
          } />
        </Routes>
      </main>
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-sm text-gray-400 dark:text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-brand-600 dark:text-brand-400 mb-1">🥗 Nourishly</p>
          <p>AI-powered healthy cooking — helping busy families cook smarter, healthier &amp; faster.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Nourishly. Built with ❤️ for families.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
