import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { EventsProvider } from '@/context/EventsContext';

export default function AppLayout() {
  return (
    <EventsProvider>
      <div className="min-h-screen gradient-mesh">
        <Navbar />
        <main className="container space-y-8 py-8">
          <Outlet />
        </main>
      </div>
    </EventsProvider>
  );
}
