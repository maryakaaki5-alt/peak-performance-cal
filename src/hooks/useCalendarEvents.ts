import { useState, useCallback, useMemo } from 'react';
import { CalendarEvent, SAMPLE_EVENTS } from '@/lib/types';

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

  const getEventsForDate = useCallback((date: Date) => {
    return events.filter(e =>
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    );
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [events]);

  return { events, addEvent, updateEvent, deleteEvent, getEventsForDate, upcomingEvents };
}
