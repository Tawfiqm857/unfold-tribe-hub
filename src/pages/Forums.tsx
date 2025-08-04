import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, TrendingUp, Users, Plus, Pin } from 'lucide-react';

const Forums = () => {
  const categories = [
    {
      id: 1,
      name: 'Startup Ideas',
      description: 'Share and discuss innovative startup concepts',
      posts: 234,
      members: 1250,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Product Help',
      description: 'Get feedback and advice on your products',
      posts: 189,
      members: 890,
      color: 'bg-green-500'
    },
    {
      id: 3,
      name: 'Tech Talk',
      description: 'Technical discussions and programming help',
      posts: 456,
      members: 2100,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      name: 'Marketing & Growth',
      description: 'Strategies for growing your business',
      posts: 167,
      members: 756,
      color: 'bg-orange-500'
    }
  ];

  const trendingTopics = [
    {
      id: 1,
      title: 'Best practices for SaaS pricing in 2024',
      author: 'Sarah Chen',
      replies: 23,
      lastReply: '2 hours ago',
      isPinned: true
    },
    {
      id: 2,
      title: 'How to validate your MVP with minimal resources',
      author: 'Alex Rivera',
      replies: 45,
      lastReply: '4 hours ago',
      isPinned: false
    },
    {
      id: 3,
      title: 'AI tools that actually boost productivity',
      author: 'Maya Patel',
      replies: 67,
      lastReply: '6 hours ago',
      isPinned: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-muted-foreground">Connect, discuss, and learn with fellow entrepreneurs</p>
        </div>
        <Button className="btn-hero">
          <Plus className="w-4 h-4 mr-2" />
          New Topic
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">1,046</p>
            <p className="text-sm text-muted-foreground">Total Topics</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">4,996</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Posts Today</p>
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
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">{category.posts} posts</span>
                      <span className="text-xs text-muted-foreground">{category.members} members</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
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
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    {topic.isPinned && <Pin className="w-4 h-4 text-primary mt-0.5" />}
                    <h4 className="font-medium text-sm leading-tight">{topic.title}</h4>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>by {topic.author}</span>
                    <div className="flex items-center gap-2">
                      <span>{topic.replies} replies</span>
                      <span>•</span>
                      <span>{topic.lastReply}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face', posts: 23 },
                  { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', posts: 18 },
                  { name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face', posts: 15 }
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.posts} posts this week</p>
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