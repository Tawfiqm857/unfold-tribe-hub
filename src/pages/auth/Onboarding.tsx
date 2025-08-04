import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Upload, CheckCircle } from 'lucide-react';

const roles = [
  { id: 'founder', label: 'Founder', description: 'Building the next big thing' },
  { id: 'creative', label: 'Creative', description: 'Design, content, and artistic vision' },
  { id: 'developer', label: 'Developer', description: 'Code, build, and ship products' },
];

const interests = [
  'Startups', 'AI & Machine Learning', 'Web3 & Blockchain', 'Product Design',
  'Marketing', 'Fundraising', 'SaaS', 'E-commerce', 'Community Building',
  'Content Creation', 'DevOps', 'Mobile Development', 'Data Science',
  'Sustainability', 'HealthTech', 'EdTech', 'FinTech', 'Gaming'
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    interests: [] as string[],
    bio: '',
    profileImage: null as File | null
  });
  const { updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    try {
      await updateProfile({
        role: formData.role as any,
        interests: formData.interests,
        bio: formData.bio
      });
      toast({
        title: "Profile setup complete!",
        description: "Welcome to Unfold Tribe. Let's start building together.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">What's your role?</h2>
              <p className="text-white/70">Help us understand how you contribute to the tribe</p>
            </div>
            <div className="grid gap-4">
              {roles.map((role) => (
                <Card
                  key={role.id}
                  className={`p-6 cursor-pointer transition-all border-2 ${
                    formData.role === role.id
                      ? 'border-primary bg-primary/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <h3 className="font-semibold text-white mb-2">{role.label}</h3>
                  <p className="text-white/70 text-sm">{role.description}</p>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Select your interests</h2>
              <p className="text-white/70">Choose topics you're passionate about (select 3-8)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-primary text-white'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Upload your photo</h2>
              <p className="text-white/70">Add a profile picture to help others recognize you</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                <Upload className="w-8 h-8 text-white/60" />
              </div>
              <Button variant="outline" className="btn-glass">
                Choose Photo
              </Button>
              <p className="text-xs text-white/60">JPG, PNG up to 5MB</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
              <p className="text-white/70">Write a brief bio to introduce yourself to the tribe</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[120px]"
                placeholder="Share your story, expertise, or what you're working on..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
              <p className="text-white/70">Welcome to Unfold Tribe. Let's start building amazing things together.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white/70 text-sm">Step {currentStep} of 5</span>
            <span className="text-white/70 text-sm">{Math.round((currentStep / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-strong">
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="btn-glass"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.role) ||
                  (currentStep === 2 && formData.interests.length < 3)
                }
                className="btn-glow"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="btn-glow">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;