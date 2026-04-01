import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarEvent, EventCategory, RecurrenceType, CATEGORY_CONFIG } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete?: (id: string) => void;
}

export default function EventModal({ open, onOpenChange, event, defaultDate, onSave, onUpdate, onDelete }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('sport');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [durationMinutes, setDurationMinutes] = useState(60);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setCategory(event.category);
      setDate(event.date.toISOString().split('T')[0]);
      setTime(event.date.toTimeString().slice(0, 5));
      setLocation(event.location || '');
      setDescription(event.description || '');
      setReminder(event.reminder || false);
      setRecurrence(event.recurrence || 'none');
      setDurationMinutes(event.durationMinutes || 60);
    } else {
      const d = defaultDate || new Date();
      setTitle('');
      setCategory('sport');
      setDate(d.toISOString().split('T')[0]);
      setTime('12:00');
      setLocation('');
      setDescription('');
      setReminder(false);
      setRecurrence('none');
      setDurationMinutes(60);
    }
  }, [event, defaultDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(year, month - 1, day, hours, minutes);

    const data = { title, category, date: eventDate, location: location || undefined, description: description || undefined, reminder, recurrence, durationMinutes };

    if (event && onUpdate) {
      onUpdate(event.id, data);
    } else {
      onSave(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{event ? 'Edit Event' : 'New Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title..." className="mt-1" required />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={v => setCategory(v as EventCategory)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.bgClass}`} />
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional" className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={v => setRecurrence(v as RecurrenceType)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" min={15} step={15} value={durationMinutes} onChange={e => setDurationMinutes(Number(e.target.value))} className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" className="mt-1" rows={2} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reminder" className="text-sm">Set Reminder</Label>
            <Switch id="reminder" checked={reminder} onCheckedChange={setReminder} />
          </div>

          <div className="flex gap-2 pt-2">
            {event && onDelete && (
              <Button type="button" variant="destructive" size="sm" onClick={() => { onDelete(event.id); onOpenChange(false); }}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
            <div className="flex-1" />
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{event ? 'Update' : 'Add Event'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
