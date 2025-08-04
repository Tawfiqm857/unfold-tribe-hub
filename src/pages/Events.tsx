import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Clock, Plus, Filter } from 'lucide-react';

const Events = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const events = [
    {
      id: 1,
      title: 'AI Product Showcase',
      description: 'Demo your AI-powered products and get feedback from the community',
      date: '2024-08-15',
      time: '6:00 PM',
      location: 'Virtual',
      attendees: 124,
      maxAttendees: 200,
      organizer: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face'
      },
      tags: ['AI', 'Product', 'Demo'],
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
      isRSVPed: false
    },
    {
      id: 2,
      title: 'Startup Pitch Night',
      description: 'Present your startup idea and receive feedback from experienced entrepreneurs',
      date: '2024-08-18',
      time: '7:00 PM',
      location: 'San Francisco, CA',
      attendees: 89,
      maxAttendees: 150,
      organizer: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      tags: ['Pitching', 'Startups', 'Networking'],
      image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=400&fit=crop',
      isRSVPed: true
    },
    {
      id: 3,
      title: 'Women in Tech Meetup',
      description: 'Monthly gathering for women entrepreneurs and tech professionals',
      date: '2024-08-22',
      time: '5:30 PM',
      location: 'New York, NY',
      attendees: 67,
      maxAttendees: 100,
      organizer: {
        name: 'Maya Patel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
      },
      tags: ['Women in Tech', 'Networking', 'Community'],
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
      isRSVPed: false
    }
  ];

  const upcomingEvents = [
    { title: 'Design System Workshop', date: 'Aug 25', attendees: 45 },
    { title: 'Crypto & Web3 Discussion', date: 'Aug 28', attendees: 78 },
    { title: 'Marketing Automation Bootcamp', date: 'Sep 2', attendees: 92 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and join events in your area</p>
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
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">1,250</p>
            <p className="text-sm text-muted-foreground">Total Attendees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Cities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">3</p>
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
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant={event.isRSVPed ? "default" : "outline"}
                        size="sm"
                        className={event.isRSVPed ? "btn-glow" : ""}
                      >
                        {event.isRSVPed ? 'Going' : 'RSVP'}
                      </Button>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                          <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">by {event.organizer.name}</span>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Startup Pitch Night</p>
                    <p className="text-xs text-muted-foreground">Aug 18, 7:00 PM</p>
                  </div>
                  <Badge variant="default" className="text-xs">Going</Badge>
                </div>
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