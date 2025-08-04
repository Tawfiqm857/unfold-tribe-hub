import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Calendar, BookOpen, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">1,250</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Active Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Published Magazines</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">89%</p>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Calendar className="w-6 h-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <BookOpen className="w-6 h-6" />
              <span>Publish Magazine</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-6">
              <Shield className="w-6 h-6" />
              <span>Moderate Content</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;