import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { API_URL } from '../config';
type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPasswrod] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    (e.preventDefault(), setError(''));
    setLoading(true);
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      setAuth(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
        <div className='bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl'>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer'
          >
            ✕
          </button>
          <h2 className='text-2xl font-bold text-stone-100 mb-2'>
            {isLogin ? 'Sign in' : 'Create Account'}
          </h2>
          <p className='text-stone-400 text-sm mb-6'>
            {isLogin
              ? 'Welcome back to Specialty Coffee'
              : 'Join us for exclusive coffees and quick orders'}
          </p>
          {error && (
            <div className='bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-4'>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {!isLogin && (
              <div>
                <label className='block text-xs font-semibold text-stone-400 mb-1'>NAME</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='John Doe'
                  className='w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors'
                />
              </div>
            )}
            <div>
              <label className='block text-xs font-semibold text-stone-400 mb-1'>EMAIL</label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='coffee@gmail.com'
                className='w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors'
              />
            </div>
            <div>
              <label className='block text-xs font-semibold text-stone-400 mb-1'>PASSWORD</label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPasswrod(e.target.value)}
                placeholder='••••••••'
                className='w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-amber-500 transition-colors'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2'
            >
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign Up'}
            </button>
          </form>
          <div className='mt-6 text-center text-sm text-stone-400'>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className='text-amber-500 hover:underline font-semibold cursor-pointer'
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
