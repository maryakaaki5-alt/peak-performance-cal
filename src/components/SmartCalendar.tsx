import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarEvent, CATEGORY_CONFIG, EventCategory } from '@/lib/types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';

type ViewMode = 'month' | 'week' | 'day';

interface Props {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddClick: () => void;
}

export default function SmartCalendar({ events, onDateClick, onEventClick, onAddClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [filter, setFilter] = useState<EventCategory | 'all'>('all');

  const filteredEvents = useMemo(() =>
    filter === 'all' ? events : events.filter(e => e.category === filter),
    [events, filter]
  );

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const getEventsForDate = (date: Date) =>
    filteredEvents.filter(e => isSameDay(e.date, date));

  const navigate = (dir: number) => {
    if (viewMode === 'month') setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, dir * 7));
    else setCurrentDate(addDays(currentDate, dir));
  };

  const renderDayCell = (date: Date, compact = false) => {
    const dayEvents = getEventsForDate(date);
    const today = isToday(date);
    const inMonth = isSameMonth(date, currentDate);

    return (
      <motion.div
        key={date.toISOString()}
        whileHover={{ scale: 1.02 }}
        onClick={() => onDateClick(date)}
        className={`
          min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-xl cursor-pointer border border-transparent transition-colors
          ${today ? 'bg-primary/10 border-primary/30' : 'hover:bg-secondary/50'}
          ${!inMonth ? 'opacity-30' : ''}
        `}
      >
        <div className={`text-sm font-medium mb-1 ${today ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
          {format(date, 'd')}
        </div>
        <div className="space-y-0.5">
          {dayEvents.slice(0, compact ? 2 : 3).map(event => {
            const config = CATEGORY_CONFIG[event.category];
            return (
              <div
                key={event.id}
                onClick={e => { e.stopPropagation(); onEventClick(event); }}
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md truncate cursor-pointer ${config.bgClass}/20 ${config.colorClass} hover:${config.bgClass}/30 transition-colors`}
              >
                {event.title}
              </div>
            );
          })}
          {dayEvents.length > (compact ? 2 : 3) && (
            <div className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - (compact ? 2 : 3)} more</div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate).sort((a, b) => a.date.getTime() - b.date.getTime());
    return (
      <div className="space-y-3 py-4">
        <h3 className="font-heading text-lg mb-4">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
        {dayEvents.length === 0 && <p className="text-muted-foreground text-sm">No events for this day</p>}
        {dayEvents.map(event => {
          const config = CATEGORY_CONFIG[event.category];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onEventClick(event)}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer bg-secondary/50 hover:bg-secondary/80 transition-colors border-l-4`}
              style={{ borderLeftColor: `hsl(var(--${event.category}))` }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">{format(event.date, 'h:mm a')}{event.location ? ` · ${event.location}` : ''}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgClass}/20 ${config.colorClass}`}>{config.label}</span>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="glass rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold font-heading min-w-[200px] text-center">
            {viewMode === 'day' ? format(currentDate, 'MMM d, yyyy') : format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => navigate(1)}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View mode */}
          <div className="flex rounded-lg bg-secondary/50 p-0.5">
            {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 text-[10px] rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground'}`}
            >
              All
            </button>
            {(Object.entries(CATEGORY_CONFIG) as [EventCategory, typeof CATEGORY_CONFIG[EventCategory]][]).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2 py-1 text-[10px] rounded-full font-medium transition-colors flex items-center gap-1 ${
                  filter === key ? `${config.bgClass}/20 ${config.colorClass}` : 'text-muted-foreground'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.bgClass}`} />
                {config.label}
              </button>
            ))}
          </div>

          <Button size="sm" onClick={onAddClick} className="ml-auto">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'day' ? (
          <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderDayView()}
          </motion.div>
        ) : (
          <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {(viewMode === 'month' ? monthDays : weekDays).map(date =>
                renderDayCell(date, viewMode === 'week')
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
