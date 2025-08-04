import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, Share, Image, Send, Filter } from 'lucide-react';

const Feed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ['All', 'Tips', 'Wins', 'Ask', 'News', 'Events', 'Resources'];

  const posts = [
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        username: 'sarahchen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face',
        role: 'Product Designer'
      },
      content: 'Just launched our MVP after 6 months of hard work! The response has been incredible. Here are 5 key lessons I learned during the process...',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      tags: ['Tips', 'Wins'],
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
    },
    {
      id: 2,
      author: {
        name: 'Alex Rivera',
        username: 'alexrivera',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Full Stack Developer'
      },
      content: 'What are your thoughts on the latest React 19 features? I\'ve been experimenting with the new concurrent features and they\'re game-changing for performance.',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 15,
      tags: ['Ask', 'Tips']
    },
    {
      id: 3,
      author: {
        name: 'Maya Patel',
        username: 'mayapatel',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
        role: 'Startup Founder'
      },
      content: 'Raised our Series A! 🎉 $2M to revolutionize how teams collaborate. Grateful for this amazing community that supported us through the journey.',
      timestamp: '6 hours ago',
      likes: 67,
      comments: 23,
      tags: ['Wins', 'News']
    }
  ];

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle post submission
      setNewPost('');
      setSelectedTags([]);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.fullName} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.fullName}</p>
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
                variant={selectedTags.includes(tag) ? "default" : "outline"}
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
            <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post
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
                variant="outline"
                className="cursor-pointer hover:bg-accent"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{post.author.name}</p>
                      <span className="text-muted-foreground">@{post.author.username}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{post.author.role} • {post.timestamp}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{post.content}</p>
              
              {post.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-6">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Heart className="w-4 h-4" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Feed;