import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share, BookOpen } from 'lucide-react';

const Magazines = () => {
  const magazines = [
    {
      id: 1,
      title: 'Startup Success Stories',
      issue: 'Issue #12 - August 2024',
      cover: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop',
      category: 'Entrepreneurship',
      downloads: 1250
    },
    {
      id: 2,
      title: 'Tech Innovation Quarterly',
      issue: 'Q2 2024',
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop',
      category: 'Technology',
      downloads: 890
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Digital Magazines</h1>
        <p className="text-muted-foreground">Curated content for entrepreneurs and innovators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((magazine) => (
          <Card key={magazine.id} className="card-hover">
            <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
              <img src={magazine.cover} alt={magazine.title} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-6">
              <Badge variant="secondary" className="mb-2">{magazine.category}</Badge>
              <h3 className="font-bold text-lg mb-1">{magazine.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{magazine.issue}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{magazine.downloads} downloads</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Share className="w-4 h-4" /></Button>
                  <Button size="sm"><Download className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Magazines;