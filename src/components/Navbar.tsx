import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const links = ['Dashboard', 'Goals', 'Schedule', 'Calendar', 'Profile'];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass rounded-b-2xl">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2 font-heading font-bold text-lg">
          <Zap className="w-5 h-5 text-accent" />
          <span>Athlete<span className="text-primary">Hub</span></span>
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-6">
          {links.map(link => (
            <button key={link} onClick={() => scrollTo(link)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </button>
          ))}
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
                <button key={link} onClick={() => scrollTo(link)} className="text-sm text-muted-foreground hover:text-foreground py-2 text-left">
                  {link}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
