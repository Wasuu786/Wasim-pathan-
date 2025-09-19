import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Plane, Users, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
};

export function LoginPage({ onLogin, onSwitchToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl text-blue-600">TravelMate</h1>
          </div>
          <p className="text-gray-600">Your ultimate travel companion for students & hostellers</p>
          
          <div className="mt-6 relative h-48 rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1632301387009-ef882af483f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHRyYXZlbGVycyUyMGJhY2twYWNrJTIwYWR2ZW50dXJlfGVufDF8fHx8MTc1ODMxNDMzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Young travelers with backpacks"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Group Travel</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Budget Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back!</CardTitle>
            <CardDescription>Sign in to your TravelMate account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email or Student ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email or student ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="text-center">
            <div className="w-full space-y-3">
              <Button
                variant="link"
                className="text-blue-600 p-0"
                onClick={() => {/* Forgot password logic */}}
              >
                Forgot your password?
              </Button>
              
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="text-blue-600 p-0"
                  onClick={onSwitchToSignup}
                >
                  Sign up for free
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Made for students, by students 🎒</p>
        </div>
      </div>
    </div>
  );
}