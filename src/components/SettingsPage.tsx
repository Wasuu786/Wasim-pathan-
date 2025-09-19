import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { ArrowLeft, Settings, User, Shield, Bell, CreditCard, HelpCircle, LogOut, Edit, Save, Mail, Phone, GraduationCap } from 'lucide-react';

type SettingsPageProps = {
  user: {
    id: string;
    email: string;
    name: string;
    studentId?: string;
  };
  onLogout: () => void;
  onNavigate: (page: string) => void;
};

export function SettingsPage({ user, onLogout, onNavigate }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: '+91 98765 43210',
    studentId: user.studentId || '',
    college: 'Delhi University',
    emergencyContact: '+91 98765 43211'
  });

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    priceAlerts: false,
    groupInvites: true,
    promotions: false,
    securityAlerts: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    biometricLogin: true,
    sessionTimeout: '30'
  });

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
    { id: 'help', name: 'Help & Support', icon: HelpCircle }
  ];

  const handleProfileSave = () => {
    // In a real app, this would save to the backend
    setEditingProfile(false);
    alert('Profile updated successfully!');
  };

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const renderProfileSection = () => (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile Information</CardTitle>
          {!editingProfile ? (
            <Button variant="outline" onClick={() => setEditingProfile(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Student ID</label>
            <Input
              value={profileData.studentId}
              onChange={(e) => setProfileData({...profileData, studentId: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">College/University</label>
            <Input
              value={profileData.college}
              onChange={(e) => setProfileData({...profileData, college: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Emergency Contact</label>
            <Input
              value={profileData.emergencyContact}
              onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
              disabled={!editingProfile}
              className="h-12"
            />
          </div>
        </div>

        {user.studentId && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">Verified Student Account</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              You're eligible for student discounts and special offers
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSecuritySection = () => (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <p className="text-gray-600">Manage your account security and privacy</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={security.twoFactorAuth}
            onCheckedChange={(checked: boolean | undefined) => setSecurity({...security, twoFactorAuth: !!checked})}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium">Biometric Login</h3>
            <p className="text-sm text-gray-600">Use fingerprint or face recognition to login</p>
          </div>
          <Switch
            checked={security.biometricLogin}
            onCheckedChange={(checked: boolean | undefined) => setSecurity({...security, biometricLogin: !!checked})}
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Session Timeout</h3>
          <select
            value={security.sessionTimeout}
            onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
            className="w-full p-3 border rounded-lg"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Download Account Data
          </Button>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationsSection = () => (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-gray-600">Choose what notifications you want to receive</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => {
          const notificationLabels: {[key: string]: {title: string, description: string}} = {
            bookingUpdates: {
              title: 'Booking Updates',
              description: 'Get notified about booking confirmations and changes'
            },
            priceAlerts: {
              title: 'Price Alerts',
              description: 'Receive alerts when prices drop for your saved trips'
            },
            groupInvites: {
              title: 'Group Invites',
              description: 'Get notified when friends invite you to group trips'
            },
            promotions: {
              title: 'Promotions & Offers',
              description: 'Receive updates about special offers and discounts'
            },
            securityAlerts: {
              title: 'Security Alerts',
              description: 'Important security notifications for your account'
            }
          };

          return (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{notificationLabels[key].title}</h3>
                <p className="text-sm text-gray-600">{notificationLabels[key].description}</p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked: boolean | undefined) => setNotifications({...notifications, [key]: checked})}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  const renderPaymentSection = () => (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <p className="text-gray-600">Manage your saved payment methods</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                VISA
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 1234</p>
                <p className="text-sm text-gray-600">Expires 12/25</p>
              </div>
            </div>
            <Badge>Primary</Badge>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-6 bg-purple-600 rounded text-white text-xs flex items-center justify-center">
                UPI
              </div>
              <div>
                <p className="font-medium">student@paytm</p>
                <p className="text-sm text-gray-600">PhonePe UPI</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Add New Payment Method
        </Button>
      </CardContent>
    </Card>
  );

  const renderHelpSection = () => (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Help & Support</CardTitle>
        <p className="text-gray-600">Get help and contact support</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('feedback')}>
          <Mail className="h-4 w-4 mr-3" />
          Contact Support
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="h-4 w-4 mr-3" />
          FAQ & Help Center
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Phone className="h-4 w-4 mr-3" />
          Call Support: 1800-123-4567
        </Button>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Student Support Hours</h3>
          <p className="text-sm text-blue-700">
            Monday - Friday: 9 AM - 9 PM<br />
            Saturday - Sunday: 10 AM - 6 PM
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'security': return renderSecuritySection();
      case 'notifications': return renderNotificationsSection();
      case 'payment': return renderPaymentSection();
      case 'help': return renderHelpSection();
      default: return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl">Settings</h1>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogoutClick}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sections.map((section) => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 transition-colors ${
                          activeSection === section.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                        }`}
                      >
                        <IconComponent className="h-5 w-5 text-gray-500" />
                        <span className={activeSection === section.id ? 'text-blue-600' : ''}>{section.name}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* User Info Card */}
            <Card className="mt-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.studentId && (
                  <Badge className="mt-2 bg-blue-100 text-blue-700">
                    Student
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {renderSection()}
          </div>
        </div>

        {/* App Info */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg mb-2">TravelMate v2.1.0</h3>
            <p className="text-gray-600 text-sm mb-4">
              The ultimate travel companion for students and budget travelers
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>Terms of Service</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>About Us</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}