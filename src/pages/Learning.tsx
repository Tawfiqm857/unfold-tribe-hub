import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock } from 'lucide-react';

const Learning = () => {
  const tracks = [
    { id: 1, title: 'Startup Fundamentals', progress: 75, modules: 8, completed: 6, duration: '4 hours' },
    { id: 2, title: 'Product Management', progress: 30, modules: 12, completed: 4, duration: '6 hours' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning Center</h1>
      <div className="grid gap-6">
        {tracks.map((track) => (
          <Card key={track.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {track.title}
                <Badge variant="outline">{track.completed}/{track.modules} modules</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">{track.duration}</span>
              </div>
              <Progress value={track.progress} className="mb-4" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{track.progress}% complete</span>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learning;