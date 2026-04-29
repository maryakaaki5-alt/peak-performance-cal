import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    login(email.trim(), password);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass rounded-2xl p-8"
      >
        <div className="flex items-center gap-2 font-heading font-bold text-xl mb-2">
          <Zap className="w-6 h-6 text-accent" />
          <span>Athlete<span className="text-primary">Hub</span></span>
        </div>
        <h1 className="text-2xl font-bold font-heading mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to continue training.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@westbrook.edu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full">Login</Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo login — any email and password will work.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
