import { motion } from 'framer-motion';
import { Dumbbell, GraduationCap, Heart, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type GoalCategory = 'fitness' | 'academic' | 'personal';

interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  category: GoalCategory;
}

const GOALS: Goal[] = [
  // Fitness
  { id: 'f1', label: 'Stamina (5K time)', current: 78, target: 100, unit: '%', category: 'fitness' },
  { id: 'f2', label: 'Strength (Bench PR)', current: 185, target: 225, unit: 'lbs', category: 'fitness' },
  { id: 'f3', label: 'Weekly Practice Hours', current: 14, target: 18, unit: 'hrs', category: 'fitness' },
  // Academic
  { id: 'a1', label: 'GPA Target', current: 3.6, target: 4.0, unit: '' , category: 'academic' },
  { id: 'a2', label: 'Study Hours / Week', current: 16, target: 20, unit: 'hrs', category: 'academic' },
  { id: 'a3', label: 'Assignments Completed', current: 22, target: 25, unit: '' , category: 'academic' },
  // Personal
  { id: 'p1', label: 'Sleep (avg/night)', current: 7.2, target: 8, unit: 'hrs', category: 'personal' },
  { id: 'p2', label: 'Recovery Score', current: 82, target: 100, unit: '%', category: 'personal' },
  { id: 'p3', label: 'Hydration', current: 2.4, target: 3, unit: 'L', category: 'personal' },
];

const CATEGORY_META: Record<GoalCategory, { title: string; icon: typeof Dumbbell; colorVar: string; tone: string }> = {
  fitness:  { title: 'Fitness Goals',  icon: Dumbbell,       colorVar: 'hsl(var(--sport))',    tone: 'text-sport' },
  academic: { title: 'Academic Goals', icon: GraduationCap,  colorVar: 'hsl(var(--school))',   tone: 'text-school' },
  personal: { title: 'Personal Goals', icon: Heart,          colorVar: 'hsl(var(--personal))', tone: 'text-personal' },
};

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const meta = CATEGORY_META[goal.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="space-y-2"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-foreground/90 font-medium">{goal.label}</span>
        <span className={`text-xs tabular-nums ${meta.tone} font-semibold`}>{pct}%</span>
      </div>
      <div className="relative">
        <Progress value={pct} className="h-2 bg-muted/40 [&>div]:bg-transparent" />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 + index * 0.04 }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${meta.colorVar}, ${meta.colorVar}cc)`, boxShadow: `0 0 12px ${meta.colorVar}66` }}
        />
      </div>
      <div className="text-xs text-muted-foreground tabular-nums">
        {goal.current}{goal.unit} <span className="opacity-60">/ {goal.target}{goal.unit}</span>
      </div>
    </motion.div>
  );
}

export default function PerformanceGoals() {
  const categories: GoalCategory[] = ['fitness', 'academic', 'personal'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="text-2xl font-bold font-heading">Performance Goals</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const Icon = meta.icon;
          const goals = GOALS.filter(g => g.category === cat);
          const avg = Math.round(
            goals.reduce((s, g) => s + Math.min(100, (g.current / g.target) * 100), 0) / goals.length
          );

          return (
            <Card key={cat} className="glass border-border/50 p-5 space-y-5 hover:border-border transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-lg grid place-items-center"
                    style={{ background: `${meta.colorVar}20`, border: `1px solid ${meta.colorVar}40` }}
                  >
                    <Icon className={`w-4 h-4 ${meta.tone}`} />
                  </div>
                  <h3 className="font-heading font-semibold">{meta.title}</h3>
                </div>
                <span className={`text-xs font-bold tabular-nums ${meta.tone}`}>{avg}%</span>
              </div>

              <div className="space-y-4">
                {goals.map((g, i) => <GoalCard key={g.id} goal={g} index={i} />)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
