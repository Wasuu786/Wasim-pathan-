import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, MessageSquare, Star, Send, ThumbsUp, ThumbsDown, Image, Camera } from 'lucide-react';

type FeedbackSystemProps = {
  onNavigate: (page: string) => void;
};

type Feedback = {
  id: string;
  category: string;
  rating: number;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'reviewed' | 'resolved';
  response?: string;
};

export function FeedbackSystem({ onNavigate }: FeedbackSystemProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'general',
    rating: 0,
    title: '',
    description: '',
    images: [] as File[]
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'general', name: 'General Experience', description: 'Overall app experience' },
    { id: 'booking', name: 'Booking Process', description: 'Transportation and hotel booking' },
    { id: 'payment', name: 'Payment System', description: 'Payment methods and transactions' },
    { id: 'ui', name: 'User Interface', description: 'App design and usability' },
    { id: 'features', name: 'Features', description: 'App features and functionality' },
    { id: 'bug', name: 'Bug Report', description: 'Technical issues or errors' },
    { id: 'suggestion', name: 'Feature Request', description: 'New feature suggestions' }
  ];

  const feedbackHistory: Feedback[] = [
    {
      id: '1',
      category: 'booking',
      rating: 4,
      title: 'Great hotel selection',
      description: 'Love the variety of budget-friendly hostels. Found perfect accommodation for our group trip.',
      date: '2024-01-20',
      status: 'resolved',
      response: 'Thanks for the feedback! We\'re glad you found suitable accommodation.'
    },
    {
      id: '2',
      category: 'payment',
      rating: 3,
      title: 'UPI payment sometimes fails',
      description: 'Had to try 3 times to complete payment via PhonePe. Maybe add more payment options?',
      date: '2024-01-18',
      status: 'reviewed',
      response: 'We\'re working on improving payment reliability. Update coming soon!'
    },
    {
      id: '3',
      category: 'features',
      rating: 5,
      title: 'Budget calculator is amazing!',
      description: 'The split bill feature saved us so much time. Perfect for group travel planning.',
      date: '2024-01-15',
      status: 'resolved'
    }
  ];

  const handleRatingClick = (rating: number) => {
    setFeedbackForm({ ...feedbackForm, rating });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFeedbackForm({ ...feedbackForm, images: [...feedbackForm.images, ...files] });
  };

  const removeImage = (index: number) => {
    const newImages = feedbackForm.images.filter((_, i) => i !== index);
    setFeedbackForm({ ...feedbackForm, images: newImages });
  };

  const submitFeedback = async () => {
    if (!feedbackForm.title.trim() || !feedbackForm.description.trim() || feedbackForm.rating === 0) {
      alert('Please fill in all required fields and provide a rating');
      return;
    }

    setSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset form
    setFeedbackForm({
      category: 'general',
      rating: 0,
      title: '',
      description: '',
      images: []
    });

    setSubmitting(false);
    alert('Thank you for your feedback! We\'ll review it and get back to you.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking': return '🏨';
      case 'payment': return '💳';
      case 'ui': return '🎨';
      case 'features': return '⚡';
      case 'bug': return '🐛';
      case 'suggestion': return '💡';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
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
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Feedback & Support</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'submit' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'history' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Feedback History
          </button>
        </div>

        {/* Submit Feedback Tab */}
        {activeTab === 'submit' && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <p className="text-gray-600">Help us improve TravelMate for student travelers</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Feedback Category</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFeedbackForm({ ...feedbackForm, category: category.id })}
                      className={`p-4 text-left border rounded-lg transition-colors ${
                        feedbackForm.category === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getCategoryIcon(category.id)}</span>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-3">Overall Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`p-2 transition-colors ${
                        feedbackForm.rating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                  {feedbackForm.rating > 0 && (
                    <span className="ml-3 text-sm text-gray-600 self-center">
                      {feedbackForm.rating} out of 5 stars
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Feedback Title</label>
                <Input
                  placeholder="Brief summary of your feedback"
                  value={feedbackForm.title}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <Textarea
                  placeholder="Tell us more about your experience. What went well? What could be improved?"
                  value={feedbackForm.description}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, description: e.target.value })}
                  rows={5}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-3">Screenshots (Optional)</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer bg-gray-50"
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload screenshots</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                    </div>
                  </label>

                  {/* Image Previews */}
                  {feedbackForm.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {feedbackForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={submitFeedback}
                disabled={submitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Feedback History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">Your Feedback History</h2>
              <Badge variant="outline">
                {feedbackHistory.length} feedback{feedbackHistory.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {feedbackHistory.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-500 mb-2">No feedback submitted yet</h3>
                  <p className="text-gray-400">Your feedback history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {feedbackHistory.map(feedback => (
                  <Card key={feedback.id} className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getCategoryIcon(feedback.category)}</span>
                          <div>
                            <h3 className="text-lg mb-1">{feedback.title}</h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>•</span>
                              <span>{new Date(feedback.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4">{feedback.description}</p>

                      {feedback.response && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Team Response:</h4>
                          <p className="text-blue-700">{feedback.response}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Guidelines */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">💬 Feedback Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Be specific about the issue or suggestion</p>
                <p className="mb-2">• Include screenshots if reporting a bug</p>
                <p className="mb-2">• Mention device/browser details for technical issues</p>
              </div>
              <div>
                <p className="mb-2">• We typically respond within 24-48 hours</p>
                <p className="mb-2">• Your feedback helps improve the app for everyone</p>
                <p className="mb-2">• Rate honestly to help us prioritize improvements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}