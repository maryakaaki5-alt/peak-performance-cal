import { createContext, useContext, ReactNode } from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

type EventsValue = ReturnType<typeof useCalendarEvents>;

const EventsContext = createContext<EventsValue | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const value = useCalendarEvents();
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}
