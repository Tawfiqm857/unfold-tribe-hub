import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import EditProfileDialog from '@/components/profile/EditProfileDialog';

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const formatJoinDate = (date?: Date) => {
    if (!date) return 'Recently joined';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-hero h-32"></div>
        <CardContent className="p-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback className="text-4xl bg-gradient-hero text-white">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user?.fullName || 'Your Name'}</h1>
                  <p className="text-muted-foreground text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>
                
                <EditProfileDialog>
                  <Button>Edit Profile</Button>
                </EditProfileDialog>
              </div>

              {user?.bio && (
                <p className="text-muted-foreground">{user.bio}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {user?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {(user?.city || user?.state) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {[user.city, user.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{user?.followers || 0} followers</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>{user?.points || 0} points</span>
                </div>
              </div>

              {user?.interests && user.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {formatJoinDate(user?.joinedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional sections can be added here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>🎯 Joined Unfold Tribe Nigeria</p>
              <p>📝 Profile created</p>
              <p>🌟 Earned "New Member" badge</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="flex flex-wrap gap-2">
              {user?.badges && user.badges.length > 0 ? (
                user.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="bg-primary/10">
                    🏆 {badge}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete your profile to earn badges!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;