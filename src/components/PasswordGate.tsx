'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'siteUnlocked';
const PASSWORD = 'stinky';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsUnlocked(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === PASSWORD.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  if (isUnlocked === null) {
    return <div className="fixed inset-0 bg-zinc-950" />;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className={`
            bg-white text-zinc-900 text-xl text-center tracking-widest
            px-8 py-3 outline-none w-72 rounded-sm
            ${error ? 'animate-shake' : ''}
          `}
        />
      </form>
    </div>
  );
}
