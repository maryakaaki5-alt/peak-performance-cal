import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, GripVertical, Clock, MapPin, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarEvent, CATEGORY_CONFIG } from '@/lib/types';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, getDay } from 'date-fns';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6AM to 9PM
const HOUR_HEIGHT = 64; // px per hour

interface Props {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
}

interface DragState {
  eventId: string;
  startY: number;
  startDay: number;
  originalHour: number;
  originalMinute: number;
  originalDayIndex: number;
}

export default function WeeklySchedule({ events, onEventClick, onUpdate }: Props) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const gridRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<{ dayIndex: number; hour: number; minute: number } | null>(null);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const getEventsOnDate = useCallback((date: Date) => {
    return events.filter(event => {
      if (isSameDay(event.date, date)) return true;
      if (!event.recurrence || event.recurrence === 'none' || date < event.date) return false;
      const eventDay = getDay(event.date);
      const targetDay = getDay(date);
      switch (event.recurrence) {
        case 'daily': return true;
        case 'weekdays': return targetDay >= 1 && targetDay <= 5;
        case 'weekly': return eventDay === targetDay;
        default: return false;
      }
    });
  }, [events]);

  const getEventPosition = (event: CalendarEvent) => {
    const hour = event.date.getHours();
    const minute = event.date.getMinutes();
    const top = (hour - 6) * HOUR_HEIGHT + (minute / 60) * HOUR_HEIGHT;
    const duration = event.durationMinutes || 60;
    const height = (duration / 60) * HOUR_HEIGHT;
    return { top, height: Math.max(height, 24) };
  };

  const handlePointerDown = (e: React.PointerEvent, event: CalendarEvent, dayIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const hour = event.date.getHours();
    const minute = event.date.getMinutes();
    setDragState({
      eventId: event.id,
      startY: e.clientY,
      startDay: e.clientX,
      originalHour: hour,
      originalMinute: minute,
      originalDayIndex: dayIndex,
    });
    setDragPreview({ dayIndex, hour, minute });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !gridRef.current) return;

    const deltaY = e.clientY - dragState.startY;
    const deltaMinutes = Math.round(deltaY / (HOUR_HEIGHT / 60) / 15) * 15;
    const totalOrigMinutes = dragState.originalHour * 60 + dragState.originalMinute;
    const newTotalMinutes = Math.max(6 * 60, Math.min(21 * 60, totalOrigMinutes + deltaMinutes));
    const newHour = Math.floor(newTotalMinutes / 60);
    const newMinute = newTotalMinutes % 60;

    // Calculate day change based on column width
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = (gridRect.width - 56) / 7; // 56px for time gutter
    const deltaX = e.clientX - dragState.startDay;
    const dayShift = Math.round(deltaX / colWidth);
    const newDayIndex = Math.max(0, Math.min(6, dragState.originalDayIndex + dayShift));

    setDragPreview({ dayIndex: newDayIndex, hour: newHour, minute: newMinute });
  };

  const handlePointerUp = () => {
    if (!dragState || !dragPreview) {
      setDragState(null);
      setDragPreview(null);
      return;
    }

    const newDate = new Date(weekDays[dragPreview.dayIndex]);
    newDate.setHours(dragPreview.hour, dragPreview.minute, 0, 0);

    onUpdate(dragState.eventId, { date: newDate });
    setDragState(null);
    setDragPreview(null);
  };

  const recurrenceLabel = (r?: string) => {
    switch (r) {
      case 'daily': return 'Daily';
      case 'weekdays': return 'Weekdays';
      case 'weekly': return 'Weekly';
      default: return null;
    }
  };

  return (
    <section className="glass rounded-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
          Today
        </Button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[700px]" ref={gridRef}>
          {/* Day Headers */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/50 pb-2 mb-1">
            <div />
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-muted-foreground uppercase">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-primary' : ''}`}>
                    {isToday ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        {format(day, 'd')}
                      </span>
                    ) : format(day, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div
            className="grid grid-cols-[56px_repeat(7,1fr)] relative"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Time labels */}
            <div className="relative">
              {HOURS.map(hour => (
                <div key={hour} className="flex items-start justify-end pr-3 text-[11px] text-muted-foreground" style={{ height: HOUR_HEIGHT }}>
                  {format(new Date(2026, 0, 1, hour), 'h a')}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsOnDate(day);
              return (
                <div key={dayIndex} className="relative border-l border-border/30" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                  {/* Hour lines */}
                  {HOURS.map(hour => (
                    <div key={hour} className="absolute w-full border-t border-border/20" style={{ top: (hour - 6) * HOUR_HEIGHT }} />
                  ))}

                  {/* Events */}
                  <AnimatePresence>
                    {dayEvents.map(event => {
                      const pos = getEventPosition(event);
                      const config = CATEGORY_CONFIG[event.category];
                      const isDragging = dragState?.eventId === event.id;
                      const previewPos = isDragging && dragPreview && dragPreview.dayIndex === dayIndex
                        ? { top: (dragPreview.hour - 6) * HOUR_HEIGHT + (dragPreview.minute / 60) * HOUR_HEIGHT, height: pos.height }
                        : null;

                      if (isDragging && dragPreview && dragPreview.dayIndex !== dayIndex) return null;

                      const displayPos = previewPos || pos;

                      return (
                        <motion.div
                          key={`${event.id}-${dayIndex}`}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: isDragging ? 0.85 : 1, scale: 1 }}
                          className={`absolute left-0.5 right-0.5 rounded-lg px-2 py-1 cursor-grab active:cursor-grabbing overflow-hidden group transition-shadow ${
                            isDragging ? 'z-50 shadow-lg ring-2 ring-primary/50' : 'z-10 hover:shadow-md'
                          }`}
                          style={{
                            top: displayPos.top,
                            height: displayPos.height,
                            backgroundColor: `hsl(var(--${event.category}) / 0.2)`,
                            borderLeft: `3px solid hsl(var(--${event.category}))`,
                          }}
                          onPointerDown={e => handlePointerDown(e, event, dayIndex)}
                          onClick={e => {
                            if (!dragState) {
                              e.stopPropagation();
                              onEventClick(event);
                            }
                          }}
                        >
                          <div className="flex items-start gap-1">
                            <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] sm:text-xs font-semibold truncate ${config.colorClass}`}>{event.title}</p>
                              {displayPos.height > 36 && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />{format(event.date, 'h:mm a')}
                                  </span>
                                  {event.location && displayPos.height > 48 && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 truncate">
                                      <MapPin className="w-2.5 h-2.5" />{event.location}
                                    </span>
                                  )}
                                </div>
                              )}
                              {event.recurrence && event.recurrence !== 'none' && displayPos.height > 56 && (
                                <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                                  <Repeat className="w-2.5 h-2.5" />{recurrenceLabel(event.recurrence)}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Drag ghost on target column */}
                  {dragState && dragPreview && dragPreview.dayIndex === dayIndex && !getEventsOnDate(day).find(e => e.id === dragState.eventId) && (
                    <div
                      className="absolute left-0.5 right-0.5 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 z-40"
                      style={{
                        top: (dragPreview.hour - 6) * HOUR_HEIGHT + (dragPreview.minute / 60) * HOUR_HEIGHT,
                        height: (((events.find(e => e.id === dragState.eventId)?.durationMinutes) || 60) / 60) * HOUR_HEIGHT,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30">
        <span className="text-xs text-muted-foreground">Drag events to reschedule</span>
        <div className="flex gap-3 ml-auto">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-2 h-2 rounded-full ${config.bgClass}`} />
              {config.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
