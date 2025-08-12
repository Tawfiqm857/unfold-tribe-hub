import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, Plus, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EventRow {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  is_virtual: boolean;
  tags: string[] | null;
  image_url: string | null;
  max_attendees: number | null;
  attendees_count: number;
}

const Events = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [myRsvps, setMyRsvps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const nowIso = new Date().toISOString();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('starts_at', nowIso)
          .order('starts_at', { ascending: true });
        if (error) throw error;
        setEvents(data || []);
        if (user?.id) {
          const ids = (data || []).map(e => e.id);
          if (ids.length) {
            const { data: rsvps } = await supabase
              .from('event_rsvps')
              .select('event_id')
              .eq('user_id', user.id)
              .in('event_id', ids);
            const mp: Record<string, boolean> = {};
            (rsvps || []).forEach(r => { mp[r.event_id] = true; });
            setMyRsvps(mp);
          }
        }
      } catch (e: any) {
        toast({ title: 'Failed to load events', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const toggleRsvp = async (eventId: string) => {
    if (!user?.id) return toast({ title: 'Login required', description: 'Please login to RSVP.' });
    try {
      if (myRsvps[eventId]) {
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
        if (error) throw error;
        setMyRsvps(prev => ({ ...prev, [eventId]: false }));
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees_count: Math.max(0, e.attendees_count - 1) } : e));
      } else {
        const { error } = await supabase
          .from('event_rsvps')
          .insert([{ event_id: eventId, user_id: user.id }]);
        if (error) throw error;
        setMyRsvps(prev => ({ ...prev, [eventId]: true }));
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees_count: e.attendees_count + 1 } : e));
      }
    } catch (e: any) {
      toast({ title: 'RSVP failed', description: e.message, variant: 'destructive' });
    }
  };

  const upcomingEvents = events.slice(0, 3).map(e => ({ title: e.title, date: new Date(e.starts_at).toLocaleDateString('en-NG', { month: 'short', day: '2-digit' }), attendees: e.attendees_count }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and join Nigerian events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setView(view === 'list' ? 'calendar' : 'list')}>
            <Calendar className="w-4 h-4 mr-2" />
            {view === 'list' ? 'Calendar View' : 'List View'}
          </Button>
          <Button className="btn-hero">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{events.reduce((a,c)=>a+c.attendees_count,0)}</p>
            <p className="text-sm text-muted-foreground">Total Attendees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{new Set(events.map(e => e.city || e.location || 'Online')).size}</p>
            <p className="text-sm text-muted-foreground">Locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{events.filter(e => new Date(e.starts_at).toDateString() === new Date().toDateString()).length}</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {['All', 'Virtual', 'In-Person', 'This Week', 'Free', 'Paid'].map((filter) => (
                  <Badge key={filter} variant="outline" className="cursor-pointer hover:bg-accent">
                    {filter}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="card-hover">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={event.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'} 
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-48 md:h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        {(event.tags || []).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant={myRsvps[event.id] ? 'default' : 'outline'}
                        size="sm"
                        className={myRsvps[event.id] ? 'btn-glow' : ''}
                        onClick={() => toggleRsvp(event.id)}
                      >
                        {myRsvps[event.id] ? 'Going' : 'RSVP'}
                      </Button>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.starts_at).toLocaleString('en-NG')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.is_virtual ? 'Online' : (event.location || `${event.city || ''} ${event.state || ''}`)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees_count}{event.max_attendees ? `/${event.max_attendees}` : ''} attending</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={undefined} alt="Organizer" loading="lazy" />
                          <AvatarFallback>NG</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">by Organizer</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick RSVP */}
          <Card>
            <CardHeader>
              <CardTitle>Your RSVPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.keys(myRsvps).length === 0 && <p className="text-sm text-muted-foreground">No RSVPs yet</p>}
                {events.filter(e => myRsvps[e.id]).slice(0,3).map((e) => (
                  <div key={e.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(e.starts_at).toLocaleString('en-NG')}</p>
                    </div>
                    <Badge variant="default" className="text-xs">Going</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{event.attendees} going</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create Event CTA */}
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-2">Host Your Event</h3>
              <p className="text-white/80 text-sm mb-4">Share your knowledge and connect with the community</p>
              <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Events;
