import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { Plane, GraduationCap, Users } from 'lucide-react';

type SignupPageProps = {
  onSignup: (email: string, password: string, name: string, studentId?: string) => Promise<void>;
  onSwitchToLogin: () => void;
};

export function SignupPage({ onSignup, onSwitchToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      await onSignup(
        formData.email, 
        formData.password, 
        formData.name, 
        isStudent ? formData.studentId : undefined
      );
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl text-purple-600">TravelMate</h1>
          </div>
          <p className="text-gray-600">Join thousands of student travelers</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Create Account</span>
            </CardTitle>
            <CardDescription>Start your budget travel journey today</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is-student" 
                  checked={isStudent}
                  onCheckedChange={setIsStudent}
                />
                <Label htmlFor="is-student" className="flex items-center space-x-2 cursor-pointer">
                  <GraduationCap className="h-4 w-4" />
                  <span>I'm a student</span>
                </Label>
              </div>
              
              {isStudent && (
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="h-12"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agree-terms" 
                  checked={agreeTerms}
                  onCheckedChange={setAgreeTerms}
                />
                <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                  I agree to the{' '}
                  <span className="text-purple-600 underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-purple-600 underline">Privacy Policy</span>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="text-center">
            <div className="w-full">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="text-purple-600 p-0"
                  onClick={onSwitchToLogin}
                >
                  Sign in here
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🎒 Join 10,000+ student travelers</p>
          <p>💰 Save up to 60% on group bookings</p>
        </div>
      </div>
    </div>
  );
}