import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import PerformanceGoals from '@/components/PerformanceGoals';
import EventModal from '@/components/EventModal';
import { useEvents } from '@/context/EventsContext';
import { CalendarEvent } from '@/lib/types';

export default function DashboardPage() {
  const { upcomingEvents, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  return (
    <>
      <section id="dashboard">
        <Dashboard upcomingEvents={upcomingEvents} />
      </section>
      <section id="goals">
        <PerformanceGoals />
      </section>
      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </>
  );
}
