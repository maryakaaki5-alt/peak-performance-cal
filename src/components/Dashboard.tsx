import { motion } from 'framer-motion';
import { CalendarDays, BookOpen, Dumbbell, Clock, MapPin, Bell } from 'lucide-react';
import { CalendarEvent, CATEGORY_CONFIG } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  upcomingEvents: CalendarEvent[];
}

const QUOTES = [
  "Hard work beats talent when talent doesn't work hard.",
  "Champions keep playing until they get it right.",
  "The only way to prove you're a good sport is to lose.",
];

export default function Dashboard({ upcomingEvents }: Props) {
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const sportEvents = upcomingEvents.filter(e => e.category === 'sport');
  const academicEvents = upcomingEvents.filter(e => e.category === 'school' || e.category === 'exam');

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Next Game */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 lg:col-span-1"
      >
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell className="w-5 h-5 text-sport" />
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Upcoming Games</h3>
        </div>
        <div className="space-y-3">
          {sportEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming games</p>}
          {sportEvents.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-sport mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{event.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(event.date, 'MMM d, h:mm a')}</span>
                  {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                </div>
              </div>
              {event.reminder && <Bell className="w-4 h-4 text-accent animate-pulse-glow shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Academic Deadlines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 lg:col-span-1"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-school" />
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Academic Deadlines</h3>
        </div>
        <div className="space-y-3">
          {academicEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming deadlines</p>}
          {academicEvents.slice(0, 3).map(event => {
            const config = CATEGORY_CONFIG[event.category];
            return (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${config.bgClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{event.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{format(event.date, 'MMM d, h:mm a')}</span>
                    {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                  </div>
                </div>
                {event.reminder && <Bell className="w-4 h-4 text-accent animate-pulse-glow shrink-0" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 flex flex-col justify-center lg:col-span-1"
      >
        <div className="text-accent text-4xl font-bold mb-3">"</div>
        <p className="text-lg font-medium italic leading-relaxed">{quote}</p>
        <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
      </motion.div>
    </section>
  );
}
