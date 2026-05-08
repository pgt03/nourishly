import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-4">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between"><span>Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
            <div className="flex justify-between"><span>Username</span><span className="font-medium text-gray-900">@{user?.username}</span></div>
          </div>
          <Link to={`/profile/${user?.id}`} className="btn-secondary mt-4 inline-block text-sm">Edit Profile</Link>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-2">About Nourishly</h2>
          <p className="text-sm text-gray-500 mb-2">An AI-powered healthy cooking ecosystem helping busy modern families cook smarter, healthier, faster and more affordably.</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>

        <div className="card p-6 border-red-100">
          <h2 className="font-semibold text-red-600 mb-2">Danger Zone</h2>
          <button onClick={handleLogout} className="btn-danger text-sm">🚪 Log out</button>
        </div>
      </div>
    </div>
  );
}
