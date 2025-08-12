import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, ShoppingCart, Calendar, Tag, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  issue_number: string | null;
  cover_image_url: string | null;
  publication_date: string | null;
  embed_url: string;
  tags: string[] | null;
  created_at: string;
}

interface HardCopyRequest {
  magazine_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  delivery_address: string;
}

const Magazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmbedded, setShowEmbedded] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();

  const [requestForm, setRequestForm] = useState<HardCopyRequest>({
    magazine_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    delivery_address: ''
  });

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        const fallback: Magazine = {
          id: 'fallback',
          title: 'Unfold Editorial',
          description: 'A curated editorial experience from Unfold Tribe Nigeria.',
          issue_number: 'Issue 1',
          cover_image_url: null,
          publication_date: null,
          embed_url: 'https://tawfiqm857.github.io/unfold-editorial-web/',
          tags: ['Nigeria', 'Editorial'],
          created_at: new Date().toISOString(),
        };
        setMagazines([fallback]);
      } else {
        setMagazines(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading magazines",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHardCopy = (magazine: Magazine) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to request a hard copy",
        variant: "destructive",
      });
      return;
    }

    setSelectedMagazine(magazine);
    setRequestForm(prev => ({
      ...prev,
      magazine_id: magazine.id,
      full_name: user?.fullName || '',
      email: user?.email || ''
    }));
    setIsRequestDialogOpen(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('hard_copy_requests')
        .insert([{
          ...requestForm,
          user_id: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Request submitted successfully!",
        description: `Your request for "${selectedMagazine?.title}" has been received. We'll contact you soon with delivery details.`,
      });

      setIsRequestDialogOpen(false);
      setRequestForm({
        magazine_id: '',
        full_name: '',
        email: '',
        phone_number: '',
        delivery_address: ''
      });
    } catch (error: any) {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof HardCopyRequest, value: string) => {
    setRequestForm(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
          Nigerian Digital Magazines
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore innovative content from Nigeria's brightest entrepreneurs, creatives, and thought leaders. 
          Read online or request a physical copy delivered to your doorstep.
        </p>
      </div>

      {/* Featured Magazine */}
      {magazines.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Magazine</h2>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Magazine Metadata */}
              <div className="lg:col-span-1 space-y-4">
                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                  <img 
                    src={magazines[0].cover_image_url || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop'} 
                    alt={magazines[0].title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{magazines[0].title}</h3>
                    <p className="text-muted-foreground">{magazines[0].issue_number}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Published: {formatDate(magazines[0].publication_date)}</span>
                  </div>

                  {magazines[0].description && (
                    <p className="text-sm text-muted-foreground">{magazines[0].description}</p>
                  )}

                  {magazines[0].tags && magazines[0].tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {magazines[0].tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-4">
                    <Button 
                      onClick={() => setShowEmbedded(showEmbedded === magazines[0].id ? null : magazines[0].id)}
                      className="w-full"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {showEmbedded === magazines[0].id ? 'Hide Magazine' : 'Read Online'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => handleRequestHardCopy(magazines[0])}
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Request Hard Copy
                    </Button>

                    <Button 
                      variant="ghost" 
                      onClick={() => window.open(magazines[0].embed_url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>

              {/* Embedded Magazine */}
              <div className="lg:col-span-2">
                {showEmbedded === magazines[0].id ? (
                  <div className="h-[800px] rounded-lg overflow-hidden border">
                    <iframe
                      src={magazines[0].embed_url}
                      title={magazines[0].title}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="h-[800px] rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Read?</h3>
                      <p className="text-muted-foreground mb-4">
                        Click "Read Online" to view the magazine here
                      </p>
                      <Button onClick={() => setShowEmbedded(magazines[0].id)}>
                        Start Reading
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Magazines Grid */}
      {magazines.length > 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">All Magazines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazines.map((magazine) => (
              <Card key={magazine.id} className="card-hover overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={magazine.cover_image_url || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop'} 
                    alt={magazine.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{magazine.title}</h3>
                      <p className="text-muted-foreground text-sm">{magazine.issue_number}</p>
                    </div>
                    
                    {magazine.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{magazine.description}</p>
                    )}

                    {magazine.tags && magazine.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {magazine.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setShowEmbedded(showEmbedded === magazine.id ? null : magazine.id)}
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Read
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestHardCopy(magazine)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Hard Copy Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Hard Copy</DialogTitle>
          </DialogHeader>
          
          {selectedMagazine && (
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold">{selectedMagazine.title}</h4>
              <p className="text-sm text-muted-foreground">{selectedMagazine.issue_number}</p>
            </div>
          )}

          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={requestForm.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={requestForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={requestForm.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Please provide your complete delivery address including city and state"
                  value={requestForm.delivery_address}
                  onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📦 <strong>Delivery Info:</strong> Hard copies are delivered within Lagos for ₦2,000, 
                other Nigerian states for ₦3,500. International delivery available on request.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Magazines;