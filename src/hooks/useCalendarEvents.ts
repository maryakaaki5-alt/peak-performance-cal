import { useState, useCallback, useMemo } from 'react';
import { CalendarEvent, SAMPLE_EVENTS } from '@/lib/types';
import { isSameDay, getDay } from 'date-fns';

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: crypto.randomUUID() }]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const isEventOnDate = useCallback((event: CalendarEvent, date: Date): boolean => {
    if (isSameDay(event.date, date)) return true;
    if (!event.recurrence || event.recurrence === 'none') return false;
    if (date < event.date) return false;

    const eventDay = getDay(event.date);
    const targetDay = getDay(date);

    switch (event.recurrence) {
      case 'daily':
        return true;
      case 'weekdays':
        return targetDay >= 1 && targetDay <= 5;
      case 'weekly':
        return eventDay === targetDay;
      default:
        return false;
    }
  }, []);

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(e => isEventOnDate(e, date));
  }, [events, isEventOnDate]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [events]);

  return { events, addEvent, updateEvent, deleteEvent, getEventsForDate, upcomingEvents };
}
