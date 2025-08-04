import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, MessageCircle, Users } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'like', message: 'Sarah Chen liked your post', time: '2 hours ago', read: false },
    { id: 2, type: 'comment', message: 'Alex Rivera commented on your post', time: '4 hours ago', read: false },
    { id: 3, type: 'follow', message: 'Maya Patel started following you', time: '1 day ago', read: true },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.read ? 'border-primary' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {notification.type === 'like' && <Heart className="w-4 h-4 text-primary" />}
                  {notification.type === 'comment' && <MessageCircle className="w-4 h-4 text-primary" />}
                  {notification.type === 'follow' && <Users className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex-1">
                  <p>{notification.message}</p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.read && <Badge variant="default" className="w-2 h-2 p-0 rounded-full" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;