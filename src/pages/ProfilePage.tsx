import HeroProfile from '@/components/HeroProfile';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Mail, GraduationCap, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section id="profile">
        <HeroProfile />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="glass p-6 space-y-3">
          <h3 className="font-heading font-bold text-lg">Account</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-accent" />
            <span>{user?.email ?? 'Not signed in'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>Westbrook University — Junior</span>
          </div>
        </Card>

        <Card className="glass p-6 space-y-3">
          <h3 className="font-heading font-bold text-lg">Highlights</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 text-accent" />
            <span>3x Conference Champion</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4 text-accent" />
            <span>2x All-Star Selection</span>
          </div>
        </Card>
      </section>
    </div>
  );
}
