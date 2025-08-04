import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Plus } from 'lucide-react';

const Community = () => {
  const members = [
    { name: 'Sarah Chen', role: 'Product Designer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face', followers: 1250 },
    { name: 'Alex Rivera', role: 'Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', followers: 890 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <Button className="btn-hero"><Plus className="w-4 h-4 mr-2" />Connect</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.followers} followers</p>
              <Button size="sm" className="mt-4">Follow</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;