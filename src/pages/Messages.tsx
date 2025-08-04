import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const Messages = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Direct messaging will be available soon!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;