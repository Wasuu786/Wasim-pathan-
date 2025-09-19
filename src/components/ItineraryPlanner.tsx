import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Calendar, Plus, MapPin, Clock, Edit, Trash2, Save, Camera, Utensils, Car } from 'lucide-react';

type ItineraryPlannerProps = {
  location: string;
  onNavigate: (page: string) => void;
};

type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'sightseeing' | 'food' | 'transport' | 'accommodation' | 'activity';
  cost?: number;
  notes?: string;
};

type DayPlan = {
  date: string;
  activities: Activity[];
};

export function ItineraryPlanner({ location, onNavigate }: ItineraryPlannerProps) {
  const [tripDays, setTripDays] = useState<DayPlan[]>([
    {
      date: '2024-03-15',
      activities: [
        {
          id: '1',
          time: '08:00',
          title: 'Arrival at Goa Airport',
          description: 'Land at Dabolim Airport and take taxi to hotel',
          location: 'Dabolim Airport',
          type: 'transport',
          cost: 500
        },
        {
          id: '2',
          time: '10:00',
          title: 'Check-in at Hostel',
          description: 'Check-in at Backpacker\'s Paradise, freshen up',
          location: 'Anjuna',
          type: 'accommodation'
        },
        {
          id: '3',
          time: '12:00',
          title: 'Lunch at Local Restaurant',
          description: 'Try authentic Goan fish curry and rice',
          location: 'Anjuna Beach',
          type: 'food',
          cost: 300
        },
        {
          id: '4',
          time: '14:00',
          title: 'Anjuna Beach',
          description: 'Relax on the beach, swimming and sunbathing',
          location: 'Anjuna Beach',
          type: 'sightseeing'
        }
      ]
    },
    {
      date: '2024-03-16',
      activities: [
        {
          id: '5',
          time: '09:00',
          title: 'Breakfast',
          description: 'Continental breakfast at hostel',
          location: 'Hostel',
          type: 'food',
          cost: 150
        },
        {
          id: '6',
          time: '10:30',
          title: 'Scooter Rental',
          description: 'Rent scooters for local exploration',
          location: 'Anjuna',
          type: 'transport',
          cost: 400
        }
      ]
    }
  ]);

  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '',
    title: '',
    description: '',
    location: '',
    type: 'sightseeing',
    cost: 0
  });

  const activityTypes = [
    { id: 'sightseeing', name: 'Sightseeing', icon: Camera, color: 'bg-blue-100 text-blue-700' },
    { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'bg-green-100 text-green-700' },
    { id: 'transport', name: 'Transportation', icon: Car, color: 'bg-purple-100 text-purple-700' },
    { id: 'accommodation', name: 'Accommodation', icon: MapPin, color: 'bg-orange-100 text-orange-700' },
    { id: 'activity', name: 'Activities', icon: Calendar, color: 'bg-red-100 text-red-700' }
  ];

  const addNewDay = () => {
    const lastDate = tripDays.length > 0 ? new Date(tripDays[tripDays.length - 1].date) : new Date();
    lastDate.setDate(lastDate.getDate() + 1);
    const newDay: DayPlan = {
      date: lastDate.toISOString().split('T')[0],
      activities: []
    };
    setTripDays([...tripDays, newDay]);
  };

  const addActivity = () => {
    if (!newActivity.time || !newActivity.title || !newActivity.location) {
      alert('Please fill in all required fields');
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      time: newActivity.time || '',
      title: newActivity.title || '',
      description: newActivity.description || '',
      location: newActivity.location || '',
      type: newActivity.type as Activity['type'] || 'sightseeing',
      cost: newActivity.cost || 0,
      notes: newActivity.notes || ''
    };

    const updatedDays = [...tripDays];
    updatedDays[selectedDay].activities.push(activity);
    updatedDays[selectedDay].activities.sort((a, b) => a.time.localeCompare(b.time));
    setTripDays(updatedDays);

    setNewActivity({
      time: '',
      title: '',
      description: '',
      location: '',
      type: 'sightseeing',
      cost: 0
    });
    setShowAddActivity(false);
  };

  const deleteActivity = (dayIndex: number, activityId: string) => {
    const updatedDays = [...tripDays];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(a => a.id !== activityId);
    setTripDays(updatedDays);
  };

  const updateActivity = (dayIndex: number, activityId: string, updates: Partial<Activity>) => {
    const updatedDays = [...tripDays];
    const activityIndex = updatedDays[dayIndex].activities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      updatedDays[dayIndex].activities[activityIndex] = {
        ...updatedDays[dayIndex].activities[activityIndex],
        ...updates
      };
      setTripDays(updatedDays);
    }
    setEditingActivity(null);
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.icon : Calendar;
  };

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.color : 'bg-gray-100 text-gray-700';
  };

  const getTotalDayCost = (activities: Activity[]) => {
    return activities.reduce((total, activity) => total + (activity.cost || 0), 0);
  };

  const getTotalTripCost = () => {
    return tripDays.reduce((total, day) => total + getTotalDayCost(day.activities), 0);
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
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl">Trip Itinerary - {location}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-700">
                Total: ₹{getTotalTripCost().toLocaleString()}
              </Badge>
              <Button onClick={addNewDay} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Days Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Trip Days ({tripDays.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {tripDays.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(index)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b ${
                        selectedDay === index ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${selectedDay === index ? 'text-blue-600' : ''}`}>
                            Day {index + 1}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(day.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {day.activities.length} items
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            ₹{getTotalDayCost(day.activities)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Day Activities */}
          <div className="lg:col-span-3">
            {tripDays[selectedDay] && (
              <div className="space-y-6">
                {/* Day Header */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl mb-2">Day {selectedDay + 1}</h2>
                        <p className="text-blue-100">
                          {new Date(tripDays[selectedDay].date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl mb-1">₹{getTotalDayCost(tripDays[selectedDay].activities).toLocaleString()}</div>
                        <p className="text-blue-100">Total for day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Activity Button */}
                <Button
                  onClick={() => setShowAddActivity(!showAddActivity)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>

                {/* Add Activity Form */}
                {showAddActivity && (
                  <Card className="border-0 shadow-md border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle>Add New Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Time</label>
                          <Input
                            type="time"
                            value={newActivity.time}
                            onChange={(e) => setNewActivity({...newActivity, time: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Type</label>
                          <select
                            value={newActivity.type}
                            onChange={(e) => setNewActivity({...newActivity, type: e.target.value as Activity['type']})}
                            className="w-full p-2 border rounded-md"
                          >
                            {activityTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Activity Title</label>
                        <Input
                          placeholder="e.g., Visit Baga Beach"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          placeholder="e.g., Baga Beach, North Goa"
                          value={newActivity.location}
                          onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                          placeholder="Describe the activity..."
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Estimated Cost (₹)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newActivity.cost || ''}
                          onChange={(e) => setNewActivity({...newActivity, cost: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button onClick={addActivity} className="bg-blue-600 hover:bg-blue-700">
                          <Save className="h-4 w-4 mr-2" />
                          Add Activity
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddActivity(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Activities Timeline */}
                <div className="space-y-4">
                  {tripDays[selectedDay].activities.length === 0 ? (
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg text-gray-500 mb-2">No activities planned</h3>
                        <p className="text-gray-400">Add your first activity to get started</p>
                      </CardContent>
                    </Card>
                  ) : (
                    tripDays[selectedDay].activities.map((activity, activityIndex) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <Card key={activity.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex flex-col items-center">
                                <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                {activityIndex < tripDays[selectedDay].activities.length - 1 && (
                                  <div className="w-px h-12 bg-gray-300 mt-2"></div>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                      <Badge variant="outline" className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.time}</span>
                                      </Badge>
                                      <Badge className={getActivityColor(activity.type)}>
                                        {activityTypes.find(t => t.id === activity.type)?.name}
                                      </Badge>
                                    </div>
                                    <h3 className="text-lg mb-1">{activity.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{activity.location}</span>
                                      </div>
                                      {activity.cost && activity.cost > 0 && (
                                        <div className="flex items-center space-x-1 text-green-600">
                                          <span>₹{activity.cost}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingActivity(activity.id)}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => deleteActivity(selectedDay, activity.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Itinerary Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">📅 Itinerary Planning Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Plan buffer time between activities</p>
                <p className="mb-2">• Research opening hours and booking requirements</p>
                <p className="mb-2">• Keep digital and physical copies</p>
              </div>
              <div>
                <p className="mb-2">• Group nearby activities together</p>
                <p className="mb-2">• Include meal breaks and rest time</p>
                <p className="mb-2">• Have backup plans for weather changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}