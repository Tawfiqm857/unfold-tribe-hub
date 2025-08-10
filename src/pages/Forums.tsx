import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, Users, Plus, Pin, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Category { id: string; name: string; description: string | null; color: string | null; topics_count: number; posts_count: number; }
interface Topic { id: string; title: string; author_id: string; replies_count: number; last_reply_at: string | null; is_pinned: boolean; }

const Forums = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trending, setTrending] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: cats }, { data: topics }] = await Promise.all([
          supabase.from('forum_categories').select('*').order('name'),
          supabase.from('forum_topics').select('id, title, author_id, replies_count, last_reply_at, is_pinned').order('replies_count', { ascending: false }).limit(6)
        ]);
        setCategories(cats || []);
        setTrending(topics || []);
      } catch (e: any) {
        toast({ title: 'Failed to load forums', description: e.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const createTopic = async () => {
    if (!user?.id) return toast({ title: 'Login required', description: 'Please login to create a topic.' });
    if (!newTopicTitle.trim() || !categoryId) return;
    setCreating(true);
    try {
      const { error } = await supabase
        .from('forum_topics')
        .insert([{ title: newTopicTitle.trim(), category_id: categoryId, author_id: user.id }]);
      if (error) throw error;
      toast({ title: 'Topic created', description: 'Your topic is now live.' });
      setNewTopicTitle('');
      setCategoryId(undefined);
    } catch (e: any) {
      toast({ title: 'Create topic failed', description: e.message, variant: 'destructive' });
    } finally {
      setCreating(false);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-muted-foreground">Connect, discuss, and learn with fellow entrepreneurs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} placeholder="What do you want to discuss?" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={createTopic} disabled={!newTopicTitle.trim() || !categoryId || creating}>{creating ? 'Creating...' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{categories.reduce((a,c)=>a+c.topics_count,0)}</p>
            <p className="text-sm text-muted-foreground">Total Topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{categories.length * 100}</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{trending.length}</p>
            <p className="text-sm text-muted-foreground">Hot Topics</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Forum Categories</h2>
          {categories.map((category) => (
            <Card key={category.id} className="card-hover cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">{category.topics_count} topics</span>
                      <span className="text-xs text-muted-foreground">{category.posts_count} posts</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Topics */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Topics</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hot Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trending.map((topic) => (
                <div key={topic.id} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    {topic.is_pinned && <Pin className="w-4 h-4 text-primary mt-0.5" />}
                    <h4 className="font-medium text-sm leading-tight">{topic.title}</h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{topic.replies_count} replies</span>
                    <span>{topic.last_reply_at ? new Date(topic.last_reply_at).toLocaleString('en-NG') : ''}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Members (placeholder for now) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.slice(0,3).map((c, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={undefined} alt={c.name} />
                      <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.name} Moderator</p>
                      <p className="text-xs text-muted-foreground">active this week</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Forums;
