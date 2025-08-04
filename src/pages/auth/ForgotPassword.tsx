import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsEmailSent(true);
      setIsLoading(false);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
    }, 1500);
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-white/70">
            We've sent a password reset link to {email}
          </p>
        </div>
        <div className="text-sm text-white/60">
          <p>Didn't receive the email? Check your spam folder or</p>
          <button 
            onClick={() => setIsEmailSent(false)}
            className="text-white font-semibold hover:underline"
          >
            try again
          </button>
        </div>
        <Link 
          to="/auth/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-white/70">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Enter your email address"
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
              Sending reset link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link 
          to="/auth/login"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;