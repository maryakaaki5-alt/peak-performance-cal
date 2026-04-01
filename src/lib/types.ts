export type EventCategory = 'sport' | 'school' | 'personal' | 'exam';
export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  category: EventCategory;
  description?: string;
  location?: string;
  reminder?: boolean;
  recurrence?: RecurrenceType;
  durationMinutes?: number;
}

export const CATEGORY_CONFIG: Record<EventCategory, { label: string; colorClass: string; bgClass: string }> = {
  sport: { label: 'Sports', colorClass: 'text-sport', bgClass: 'bg-sport' },
  school: { label: 'School', colorClass: 'text-school', bgClass: 'bg-school' },
  personal: { label: 'Personal', colorClass: 'text-personal', bgClass: 'bg-personal' },
  exam: { label: 'Exam', colorClass: 'text-exam', bgClass: 'bg-exam' },
};

export const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Basketball vs Eagles', date: new Date(2026, 3, 3, 18, 0), category: 'sport', location: 'Home Court', reminder: true, durationMinutes: 120 },
  { id: '2', title: 'Physics Midterm', date: new Date(2026, 3, 5, 9, 0), category: 'exam', location: 'Room 204', reminder: true, durationMinutes: 90 },
  { id: '3', title: 'Morning Practice', date: new Date(2026, 3, 1, 6, 30), category: 'sport', location: 'Gym', recurrence: 'weekdays', durationMinutes: 90 },
  { id: '4', title: 'English Essay Due', date: new Date(2026, 3, 8, 23, 59), category: 'school', reminder: true, durationMinutes: 60 },
  { id: '5', title: 'Team Dinner', date: new Date(2026, 3, 10, 19, 0), category: 'personal', durationMinutes: 120 },
  { id: '6', title: 'Track Meet', date: new Date(2026, 3, 12, 14, 0), category: 'sport', location: 'City Stadium', reminder: true, durationMinutes: 180 },
  { id: '7', title: 'Calculus Quiz', date: new Date(2026, 3, 15, 10, 0), category: 'exam', location: 'Room 112', durationMinutes: 60 },
  { id: '8', title: 'Weight Training', date: new Date(2026, 3, 2, 7, 0), category: 'sport', location: 'Weight Room', recurrence: 'weekly', durationMinutes: 60 },
  { id: '9', title: 'History Paper Due', date: new Date(2026, 3, 18, 23, 59), category: 'school', durationMinutes: 60 },
  { id: '10', title: 'Championship Game', date: new Date(2026, 3, 22, 19, 0), category: 'sport', location: 'Arena', reminder: true, durationMinutes: 150 },
  { id: '11', title: 'Study Group', date: new Date(2026, 3, 7, 16, 0), category: 'school', location: 'Library', recurrence: 'weekly', durationMinutes: 90 },
  { id: '12', title: 'Yoga Session', date: new Date(2026, 3, 4, 7, 0), category: 'personal', recurrence: 'weekly', durationMinutes: 60 },
  { id: '13', title: 'Sprint Drills', date: new Date(2026, 3, 1, 16, 0), category: 'sport', location: 'Track', recurrence: 'weekly', durationMinutes: 75 },
  { id: '14', title: 'Film Review', date: new Date(2026, 3, 2, 18, 0), category: 'sport', location: 'Meeting Room', recurrence: 'weekly', durationMinutes: 60 },
];
