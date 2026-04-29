import { useState } from 'react';
import WeeklySchedule from '@/components/WeeklySchedule';
import EventModal from '@/components/EventModal';
import { useEvents } from '@/context/EventsContext';
import { CalendarEvent } from '@/lib/types';

export default function SchedulePage() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <section id="schedule">
      <h2 className="text-2xl font-bold font-heading mb-4">Weekly Training Schedule</h2>
      <WeeklySchedule events={events} onEventClick={handleEventClick} onUpdate={updateEvent} />
      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </section>
  );
}
