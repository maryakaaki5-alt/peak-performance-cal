export type EventCategory = 'sport' | 'school' | 'personal' | 'exam';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  category: EventCategory;
  description?: string;
  location?: string;
  reminder?: boolean;
}

export const CATEGORY_CONFIG: Record<EventCategory, { label: string; colorClass: string; bgClass: string }> = {
  sport: { label: 'Sports', colorClass: 'text-sport', bgClass: 'bg-sport' },
  school: { label: 'School', colorClass: 'text-school', bgClass: 'bg-school' },
  personal: { label: 'Personal', colorClass: 'text-personal', bgClass: 'bg-personal' },
  exam: { label: 'Exam', colorClass: 'text-exam', bgClass: 'bg-exam' },
};

export const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Basketball vs Eagles', date: new Date(2026, 3, 3, 18, 0), category: 'sport', location: 'Home Court', reminder: true },
  { id: '2', title: 'Physics Midterm', date: new Date(2026, 3, 5, 9, 0), category: 'exam', location: 'Room 204', reminder: true },
  { id: '3', title: 'Morning Practice', date: new Date(2026, 3, 1, 6, 30), category: 'sport', location: 'Gym' },
  { id: '4', title: 'English Essay Due', date: new Date(2026, 3, 8, 23, 59), category: 'school', reminder: true },
  { id: '5', title: 'Team Dinner', date: new Date(2026, 3, 10, 19, 0), category: 'personal' },
  { id: '6', title: 'Track Meet', date: new Date(2026, 3, 12, 14, 0), category: 'sport', location: 'City Stadium', reminder: true },
  { id: '7', title: 'Calculus Quiz', date: new Date(2026, 3, 15, 10, 0), category: 'exam', location: 'Room 112' },
  { id: '8', title: 'Weight Training', date: new Date(2026, 3, 2, 7, 0), category: 'sport', location: 'Weight Room' },
  { id: '9', title: 'History Paper Due', date: new Date(2026, 3, 18, 23, 59), category: 'school' },
  { id: '10', title: 'Championship Game', date: new Date(2026, 3, 22, 19, 0), category: 'sport', location: 'Arena', reminder: true },
  { id: '11', title: 'Study Group', date: new Date(2026, 3, 7, 16, 0), category: 'school', location: 'Library' },
  { id: '12', title: 'Yoga Session', date: new Date(2026, 3, 4, 7, 0), category: 'personal' },
];
