import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: 'founder' | 'creative' | 'developer' | 'admin';
  bio?: string;
  interests: string[];
  isAdmin?: boolean;
  followers: number;
  following: number;
  points: number;
  badges: string[];
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUser: User = {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'founder',
    bio: 'Passionate entrepreneur building the future of digital communities.',
    interests: ['Startups', 'AI', 'Product Design', 'Community Building'],
    isAdmin: true,
    followers: 1250,
    following: 345,
    points: 2850,
    badges: ['Early Adopter', 'Community Builder', 'Mentor'],
    joinedAt: new Date('2024-01-15')
  };

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem('unfold-tribe-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@unfoldtribe.com' && password === 'demo123') {
      setUser(mockUser);
      localStorage.setItem('unfold-tribe-user', JSON.stringify(mockUser));
    } else {
      throw new Error('Invalid credentials');
    }
    setIsLoading(false);
  };

  const signup = async (userData: Partial<User> & { email: string; password: string }) => {
    setIsLoading(true);
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockUser,
      id: Date.now().toString(),
      email: userData.email,
      fullName: userData.fullName || '',
      username: userData.username || userData.email.split('@')[0],
      role: userData.role || 'founder',
      interests: userData.interests || [],
      bio: userData.bio || '',
      isAdmin: false,
      followers: 0,
      following: 0,
      points: 100,
      badges: ['New Member'],
      joinedAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('unfold-tribe-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unfold-tribe-user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('unfold-tribe-user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};