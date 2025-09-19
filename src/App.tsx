import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { Dashboard } from './components/Dashboard';
import { LocationSelector } from './components/LocationSelector';
import { TransportationBooking } from './components/TransportationBooking';
import { HotelBooking } from './components/HotelBooking';
import { BudgetCalculator } from './components/BudgetCalculator';
import { VotingPoll } from './components/VotingPoll';
import { DocumentStorage } from './components/DocumentStorage';
import { PaymentMethods } from './components/PaymentMethods';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { FeedbackSystem } from './components/FeedbackSystem';
import { SettingsPage } from './components/SettingsPage';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

type User = {
  id: string;
  email: string;
  name: string;
  studentId?: string;
};

type AppPage = 'login' | 'signup' | 'dashboard' | 'location' | 'transportation' | 'hotels' | 'budget' | 'voting' | 'documents' | 'payment' | 'itinerary' | 'feedback' | 'settings';

export default function App() {
  // Helper to ensure correct type for onNavigate
  const handleNavigate = (page: string) => setCurrentPage(page as AppPage);
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [travelers, setTravelers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          studentId: session.user.user_metadata?.studentId
        });
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          studentId: data.user.user_metadata?.studentId
        });
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string, name: string, studentId?: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-db77e5b0/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email,
          password,
          name,
          studentId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // After successful signup, log the user in
      await handleLogin(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('login');
      setSelectedLocation('');
      setTravelers([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TravelMate...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={handleNavigate} />;
      case 'location':
        return <LocationSelector selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} onNavigate={handleNavigate} />;
      case 'transportation':
        return <TransportationBooking location={selectedLocation} travelers={travelers} onNavigate={handleNavigate} />;
      case 'hotels':
        return <HotelBooking location={selectedLocation} travelers={travelers} onNavigate={handleNavigate} />;
      case 'budget':
        return <BudgetCalculator travelers={travelers} onTravelersChange={setTravelers} onNavigate={handleNavigate} />;
      case 'voting':
        return <VotingPoll onNavigate={handleNavigate} />;
      case 'documents':
        return <DocumentStorage user={user!} onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentMethods onNavigate={handleNavigate} />;
      case 'itinerary':
        return <ItineraryPlanner location={selectedLocation} onNavigate={handleNavigate} />;
      case 'feedback':
        return <FeedbackSystem onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage user={user!} onLogout={handleLogout} onNavigate={handleNavigate} />;
      default:
        return <Dashboard user={user!} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}