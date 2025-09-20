// Fix for missing JSX namespace in TypeScript
import type { JSX } from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Plane, 
  MapPin, 
  Hotel, 
  Calculator, 
  Vote, 
  FolderLock, 
  CreditCard, 
  Calendar,
  MessageSquare,
  Settings,
  Users,
  Compass,
  Train,
  Bus,
  Car
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type DashboardProps = {
  user: {
    id: string;
    email: string;
    name: string;
    studentId?: string;
  };
  onNavigate: (page: string) => void;
};

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const quickActions = [
    {
      title: 'Plan Trip',
      description: 'Select destination & dates',
      icon: MapPin,
      action: () => onNavigate('location'),
      color: 'bg-blue-500'
    },
    {
      title: 'Book Transport',
      description: 'Flights, trains, buses',
      icon: Plane,
      action: () => onNavigate('transportation'),
      color: 'bg-green-500'
    },
    {
      title: 'Find Hotels',
      description: 'Budget-friendly stays',
      icon: Hotel,
      action: () => onNavigate('hotels'),
      color: 'bg-purple-500'
    },
    {
      title: 'Split Budget',
      description: 'Calculate & share costs',
      icon: Calculator,
      action: () => onNavigate('budget'),
      color: 'bg-orange-500'
    }
  ];

  const features = [
    {
      title: 'Group Voting',
      description: 'Vote on destinations with friends',
      icon: Vote,
      action: () => onNavigate('voting')
    },
    {
      title: 'Secure Documents',
      description: 'Store travel documents safely',
      icon: FolderLock,
      action: () => onNavigate('documents')
    },
    {
      title: 'Payment Hub',
      description: 'Multiple Indian payment options',
      icon: CreditCard,
      action: () => onNavigate('payment')
    },
    {
      title: 'Trip Itinerary',
      description: 'Plan day-by-day activities',
      icon: Calendar,
      action: () => onNavigate('itinerary')
    },
    {
      title: 'Feedback',
      description: 'Rate your travel experience',
      icon: MessageSquare,
      action: () => onNavigate('feedback')
    },
    {
      title: 'Settings',
      description: 'Account & security settings',
      icon: Settings,
      action: () => onNavigate('settings')
    }
  ];

  const transportOptions = [
    { name: 'Flights', icon: Plane, color: 'text-blue-500' },
    { name: 'Trains', icon: Train, color: 'text-green-500' },
    { name: 'Buses', icon: Bus, color: 'text-orange-500' },
    { name: 'Carpooling', icon: Car, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-blue-600">Tripzy</h1>
                <p className="text-xs text-gray-500">Tripzy made travel esay</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm">Welcome back,guys..!!</p>
                <p className="text-blue-600">{user.name}</p>
              </div>
              {user.studentId && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Student
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <ImageWithFallback
            src="img/group-sporty-people-walks-mountains-600nw-2049380855.jpg"
            alt="Budget travel destinations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
            <div>
              <h2 className="text-3xl mb-4">Ready for your next adventure?</h2>
              <p className="text-lg mb-6">Destination to destination with us..!!</p>
              <Button 
                onClick={() => onNavigate('location')}
                className="bg-white text-blue-600 hover:bg-gray-100"
                size="lg"
              >
                <Compass className="h-5 w-5 mr-2" />
                Start Planning
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <action.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg mb-2">{action.title}</h4>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Transportation Options */}
        <div className="mb-8">
          <h3 className="text-2xl mb-6">Transportation</h3>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {transportOptions.map((transport, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-20 flex-col space-y-2"
                    onClick={() => onNavigate('transportation')}
                  >
                    <transport.icon className={`h-8 w-8 ${transport.color}`} />
                    <span className="text-sm">{transport.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Features */}
        <div>
          <h3 className="text-2xl mb-6">All Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md"
                onClick={feature.action}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                    <span>{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-1">10,000+</div>
              <div className="text-blue-100">Student Travelers</div>
            </div>
            <div>
              <div className="text-2xl mb-1">₹2,50,000+</div>
              <div className="text-blue-100">Money Saved</div>
            </div>
            <div>
              <div className="text-2xl mb-1">50+</div>
              <div className="text-blue-100">Destinations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}