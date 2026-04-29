import { useState } from 'react';
import SmartCalendar from '@/components/SmartCalendar';
import EventModal from '@/components/EventModal';
import { useEvents } from '@/context/EventsContext';
import { CalendarEvent } from '@/lib/types';

export default function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setModalOpen(true);
  };
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setModalOpen(true);
  };
  const handleAddClick = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setModalOpen(true);
  };

  return (
    <section id="calendar">
      <SmartCalendar
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onAddClick={handleAddClick}
      />
      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
        defaultDate={selectedDate}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </section>
  );
}
