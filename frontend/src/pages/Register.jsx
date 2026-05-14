import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const inputBase =
  'w-full bg-[#121212] text-white rounded-lg px-3 py-2 border border-[#2a2a2a] focus:outline-none focus:border-[#E35E28]';

export default function Register({ onGoLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide">JobLens</h1>
          <p className="text-sm text-gray-400 mt-2">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-4"
        >
          {error ? (
            <div className="text-sm text-[#E35E28] border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm text-gray-300 mb-2">Name</label>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputBase}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-[0.99] ${
              loading
                ? 'bg-[#3a3a3a] text-gray-400 cursor-not-allowed'
                : 'bg-[#E35E28] hover:bg-[#cf5222] text-white'
            }`}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onGoLogin?.()}
            className="text-[#E35E28] hover:underline underline-offset-4"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
