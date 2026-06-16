import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from './authSlice';
import { IoLeafOutline } from 'react-icons/io5';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center shadow-lg shadow-primary-500/20">
            <IoLeafOutline className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">E-Waste Salvage</h1>
          <p className="text-dark-500 text-sm mt-1">Inventory Management System</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-semibold text-dark-100 mb-1">Welcome back</h2>
          <p className="text-sm text-dark-500 mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              id="login-submit"
            >
              {loading ? <span className="spinner !w-5 !h-5 !border-2" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 glass-card p-4">
          <p className="text-xs font-medium text-dark-500 mb-2 uppercase tracking-wider">Demo Accounts</p>
          <div className="space-y-1 text-xs text-dark-400">
            <p><span className="badge badge-purple text-[0.65rem]">Admin</span> admin@ewaste.com / password123</p>
            <p><span className="badge badge-blue text-[0.65rem]">Tech</span> tech@ewaste.com / password123</p>
            <p><span className="badge badge-cyan text-[0.65rem]">Manager</span> manager@ewaste.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
