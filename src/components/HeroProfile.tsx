import { motion } from 'framer-motion';
import { Trophy, Star, Target } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const stats = [
  { icon: Trophy, label: 'Championships', value: '3' },
  { icon: Star, label: 'All-Star', value: '2x' },
  { icon: Target, label: 'Season Avg', value: '22.4' },
];

export default function HeroProfile() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-primary/20 text-primary">
              Student Athlete
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-accent/20 text-accent">
              #24 Point Guard
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
            Jordan <span className="text-primary">Mitchell</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8">
            Junior at Westbrook University — balancing the court, the classroom, and everything in between.
          </p>

          <div className="flex flex-wrap gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="glass rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <stat.icon className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
