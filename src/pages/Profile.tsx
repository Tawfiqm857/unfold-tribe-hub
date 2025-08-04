import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Calendar } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="text-2xl">{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user?.fullName}</h1>
              <p className="text-muted-foreground text-lg">@{user?.username}</p>
              <p className="mt-2">{user?.bio}</p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{user?.followers} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{user?.points} points</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {user?.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;