import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Member {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const Community = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [followersCount, setFollowersCount] = useState<Record<string, number>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url, bio')
          .neq('user_id', user?.id)
          .limit(12);
        if (error) throw error;
        setMembers(profiles || []);

        const ids = (profiles || []).map(p => p.user_id);
        if (ids.length) {
          // Followers count for each member
          const { data: fAll, error: fErr } = await supabase
            .from('follows')
            .select('following_id');
          if (!fErr && fAll) {
            const counts: Record<string, number> = {};
            fAll.forEach(r => { counts[r.following_id] = (counts[r.following_id] || 0) + 1; });
            setFollowersCount(counts);
          }
          // Current user's following map
          if (user?.id) {
            const { data: iFollow, error: mErr } = await supabase
              .from('follows')
              .select('following_id')
              .eq('follower_id', user.id)
              .in('following_id', ids);
            if (!mErr && iFollow) {
              const mp: Record<string, boolean> = {};
              iFollow.forEach(r => { mp[r.following_id] = true; });
              setFollowingMap(mp);
            }
          }
        }
      } catch (e: any) {
        toast({ title: 'Failed to load community', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const toggleFollow = async (targetId: string) => {
    if (!user?.id) return toast({ title: 'Login required', description: 'Please login to follow.' });
    try {
      if (followingMap[targetId]) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetId);
        if (error) throw error;
        setFollowingMap(prev => ({ ...prev, [targetId]: false }));
        setFollowersCount(prev => ({ ...prev, [targetId]: Math.max(0, (prev[targetId] || 1) - 1) }));
      } else {
        const { error } = await supabase
          .from('follows')
          .insert([{ follower_id: user.id, following_id: targetId }]);
        if (error) throw error;
        setFollowingMap(prev => ({ ...prev, [targetId]: true }));
        setFollowersCount(prev => ({ ...prev, [targetId]: (prev[targetId] || 0) + 1 }));
      }
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <Button className="btn-hero"><Plus className="w-4 h-4 mr-2" />Connect</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <Card key={m.user_id} className="card-hover">
            <CardContent className="p-6 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4">
                <AvatarImage src={m.avatar_url || undefined} alt={m.full_name || 'Member'} loading="lazy" />
                <AvatarFallback>{(m.full_name || 'U').charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{m.full_name || 'Member'}</h3>
              <p className="text-muted-foreground text-sm">{m.bio || 'Unfold Tribe Nigeria'}</p>
              <p className="text-xs text-muted-foreground">{followersCount[m.user_id] || 0} followers</p>
              <Button size="sm" className="mt-4" onClick={() => toggleFollow(m.user_id)}>
                {followingMap[m.user_id] ? 'Following' : 'Follow'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
