import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, TrendingUp, MessageSquare, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Points', value: user?.points || 0, icon: Star, color: 'text-yellow-500' },
    { label: 'Followers', value: user?.followers || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Posts', value: 23, icon: MessageSquare, color: 'text-green-500' },
    { label: 'Events', value: 5, icon: Calendar, color: 'text-purple-500' },
  ];

  const recentActivity = [
    { type: 'post', content: 'Shared insights on startup growth', time: '2 hours ago' },
    { type: 'comment', content: 'Commented on "Building MVP in 2024"', time: '4 hours ago' },
    { type: 'event', content: 'Joined "AI Product Showcase"', time: '1 day ago' },
    { type: 'follow', content: 'Started following @sarahdesigner', time: '2 days ago' },
  ];

  const suggestedUsers = [
    { name: 'Sarah Chen', role: 'Product Designer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face', mutualConnections: 5 },
    { name: 'Alex Rivera', role: 'Full Stack Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', mutualConnections: 3 },
    { name: 'Maya Patel', role: 'Startup Founder', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face', mutualConnections: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/80 text-lg">
              Ready to connect and grow with your tribe today?
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{user?.points || 0}</div>
            <div className="text-white/80 text-sm">Total Points</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/feed')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{activity.content}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Connections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Suggested for You</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/community')}>
              See More
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestedUsers.map((suggestedUser, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={suggestedUser.avatar} alt={suggestedUser.name} />
                  <AvatarFallback>{suggestedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{suggestedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{suggestedUser.role}</p>
                  <p className="text-xs text-muted-foreground">{suggestedUser.mutualConnections} mutual connections</p>
                </div>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => navigate('/feed')}
            >
              <MessageSquare className="w-6 h-6" />
              <span>Create Post</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => navigate('/events')}
            >
              <Calendar className="w-6 h-6" />
              <span>Browse Events</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => navigate('/community')}
            >
              <Users className="w-6 h-6" />
              <span>Find People</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-6"
              onClick={() => navigate('/learning')}
            >
              <TrendingUp className="w-6 h-6" />
              <span>Learn & Grow</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;