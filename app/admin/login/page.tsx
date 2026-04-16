'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Video } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setPassword('');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-96 h-96 bg-[#952EBE] -top-20 -left-20" />
      <div className="blob w-80 h-80 bg-[#3A46DA] -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass rounded-2xl p-8 w-full max-w-sm relative z-10 border border-white/10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#952EBE] to-[#3A46DA] flex items-center justify-center mb-4">
            <Video size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Admin Portal</h1>
          <p className="text-white/40 text-sm mt-1">Neonframeworks Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                maxLength={256}
                className="input-field w-full rounded-xl pl-10 pr-10 py-3 text-white placeholder-white/25 text-sm"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                aria-label="Toggle password visibility"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading || !password.trim()}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
