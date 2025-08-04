import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Chrome } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'founder'
      });
      toast({
        title: "Account created!",
        description: "Welcome to Unfold Tribe. Let's get you started.",
      });
      navigate('/auth/onboarding');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Join Unfold Tribe</h2>
        <p className="text-white/70">Create your account and start connecting</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Create a password"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full btn-glow" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-white/60">Or continue with</span>
        </div>
      </div>

      <Button variant="outline" className="w-full btn-glass">
        <Chrome className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <div className="text-center">
        <span className="text-white/70">Already have an account? </span>
        <Link 
          to="/auth/login" 
          className="text-white font-semibold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;