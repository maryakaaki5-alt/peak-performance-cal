import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroProfile from '@/components/HeroProfile';
import Dashboard from '@/components/Dashboard';
import SmartCalendar from '@/components/SmartCalendar';
import WeeklySchedule from '@/components/WeeklySchedule';
import EventModal from '@/components/EventModal';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEvent } from '@/lib/types';

const Index = () => {
  const { events, addEvent, updateEvent, deleteEvent, upcomingEvents } = useCalendarEvents();
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
    <div className="min-h-screen gradient-mesh">
      <Navbar />

      <main className="container space-y-8 py-8">
        <section id="profile">
          <HeroProfile />
        </section>

        <section id="dashboard">
          <Dashboard upcomingEvents={upcomingEvents} />
        </section>

        <section id="calendar">
          <SmartCalendar
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onAddClick={handleAddClick}
          />
        </section>
      </main>

      <EventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
        defaultDate={selectedDate}
        onSave={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
};

export default Index;
