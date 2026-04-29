import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm transition-colors',
      isActive ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground',
    );

  return (
    <nav className="sticky top-0 z-50 glass rounded-b-2xl">
      <div className="container flex items-center justify-between h-16">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-heading font-bold text-lg">
          <Zap className="w-5 h-5 text-accent" />
          <span>Athlete<span className="text-primary">Hub</span></span>
        </NavLink>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="sm:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-6 pb-4">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="text-sm text-muted-foreground hover:text-foreground py-2 text-left flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
