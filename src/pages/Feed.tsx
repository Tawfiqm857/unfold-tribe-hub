import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Share, Image, Send, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface ProfileMeta {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const Feed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileMeta>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  const tags = ['All', 'Tips', 'Wins', 'Ask', 'News', 'Events', 'Resources'];

  useEffect(() => {
    const load = async () => {
      try {
        const { data: postsData, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const arr = postsData || [];
        setPosts(arr);

        // Load author profiles
        const authorIds = Array.from(new Set(arr.map(p => p.author_id)));
        if (authorIds.length) {
          const { data: profileRows, error: pErr } = await supabase
            .from('profiles')
            .select('user_id, full_name, avatar_url')
            .in('user_id', authorIds);
          if (pErr) throw pErr;
          const mp: Record<string, ProfileMeta> = {};
          (profileRows || []).forEach(pr => { mp[pr.user_id] = pr; });
          setProfiles(mp);
        }

        // Load current user's likes
        if (user?.id && arr.length) {
          const postIds = arr.map(p => p.id);
          const { data: likes, error: lErr } = await supabase
            .from('post_likes')
            .select('post_id')
            .in('post_id', postIds)
            .eq('user_id', user.id);
          if (lErr) throw lErr;
          const likedMap: Record<string, boolean> = {};
          (likes || []).forEach(l => { likedMap[l.post_id] = true; });
          setLiked(likedMap);
        }
      } catch (e: any) {
        toast({ title: 'Failed to load feed', description: e.message, variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const handlePostSubmit = async () => {
    if (!user?.id) {
      toast({ title: 'Login required', description: 'Please login to post.' });
      return;
    }
    if (!newPost.trim()) return;
    setIsPosting(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ author_id: user.id, content: newPost.trim(), tags: selectedTags.length ? selectedTags : null }])
        .select('*')
        .single();
      if (error) throw error;
      setPosts(prev => [data as Post, ...prev]);
      setNewPost('');
      setSelectedTags([]);
      toast({ title: 'Posted!', description: 'Your post is live.' });
    } catch (e: any) {
      toast({ title: 'Post failed', description: e.message, variant: 'destructive' });
    } finally {
      setIsPosting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredPosts = useMemo(() => {
    if (!selectedTags.length || selectedTags.includes('All')) return posts;
    return posts.filter(p => p.tags?.some(t => selectedTags.includes(t)));
  }, [posts, selectedTags]);

  const toggleLike = async (post: Post) => {
    if (!user?.id) return toast({ title: 'Login required', description: 'Please login to like.' });
    try {
      if (liked[post.id]) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        if (error) throw error;
        setLiked(prev => ({ ...prev, [post.id]: false }));
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: post.id, user_id: user.id }]);
        if (error) throw error;
        setLiked(prev => ({ ...prev, [post.id]: true }));
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
      }
    } catch (e: any) {
      toast({ title: 'Action failed', description: e.message, variant: 'destructive' });
    }
  };

  const toggleComments = async (post: Post) => {
    setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }));
    if (!expandedComments[post.id]) {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (!error) setComments(prev => ({ ...prev, [post.id]: (data as Comment[]) || [] }));
    }
  };

  const addComment = async (post: Post) => {
    if (!user?.id) return toast({ title: 'Login required', description: 'Please login to comment.' });
    const text = commentInputs[post.id]?.trim();
    if (!text) return;
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{ post_id: post.id, user_id: user.id, content: text }])
        .select('*')
        .single();
      if (error) throw error;
      setComments(prev => ({ ...prev, [post.id]: [data as Comment, ...(prev[post.id] || [])] }));
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments_count: p.comments_count + 1 } : p));
      setCommentInputs(prev => ({ ...prev, [post.id]: '' }));
    } catch (e: any) {
      toast({ title: 'Comment failed', description: e.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.fullName} loading="lazy" />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.fullName || 'Guest'}</p>
              <p className="text-sm text-muted-foreground">Share with your tribe</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share tips, wins, or ask questions..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          {/* Tag Selection */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(1).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              <Image className="w-4 h-4 mr-2" />
              Add Image
            </Button>
            <Button onClick={handlePostSubmit} disabled={!newPost.trim() || isPosting}>
              <Send className="w-4 h-4 mr-2" />
              {isPosting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Tags */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const author = profiles[post.author_id];
          return (
            <Card key={post.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={author?.avatar_url || undefined} alt={author?.full_name || 'User'} loading="lazy" />
                      <AvatarFallback>{(author?.full_name || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{author?.full_name || 'Member'}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleString('en-NG')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {post.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img src={post.image_url} alt="Post content" loading="lazy" className="w-full h-64 object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => toggleLike(post)}>
                      <Heart className={`w-4 h-4 ${liked[post.id] ? 'text-primary fill-primary' : ''}`} />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => toggleComments(post)}>
                      <MessageCircle className="w-4 h-4" />
                      {post.comments_count}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigator.share?.({ title: 'Unfold Tribe', text: post.content })}>
                    <Share className="w-4 h-4" />
                  </Button>
                </div>

                {expandedComments[post.id] && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pt-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => addComment(post)}>Comment</Button>
                    </div>
                    <div className="space-y-2">
                      {(comments[post.id] || []).map(c => (
                        <div key={c.id} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{profiles[c.user_id]?.full_name || 'Member'}:</span> {c.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
