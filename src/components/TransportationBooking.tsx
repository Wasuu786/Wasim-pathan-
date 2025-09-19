import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Plane, Train, Bus, Car, Clock, IndianRupee, Users, Calendar, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type TransportationBookingProps = {
  location: string;
  travelers: string[];
  onNavigate: (page: string) => void;
};

type TransportOption = {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'carpool';
  operator: string;
  route: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  rating: number;
  features: string[];
  availability: number;
};

export function TransportationBooking({ location, travelers, onNavigate }: TransportationBookingProps) {
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState(location || 'Goa');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(travelers.length || 1);
  const [selectedTransport, setSelectedTransport] = useState<string>('');

  const transportOptions: TransportOption[] = [
    // Flights
    {
      id: 'flight-1',
      type: 'flight',
      operator: 'IndiGo',
      route: `${fromCity} → ${toCity}`,
      departure: '06:30',
      arrival: '08:45',
      duration: '2h 15m',
      price: 4500,
      rating: 4.3,
      features: ['Meal', 'WiFi', 'Power outlet'],
      availability: 8
    },
    {
      id: 'flight-2',
      type: 'flight',
      operator: 'SpiceJet',
      route: `${fromCity} → ${toCity}`,
      departure: '14:20',
      arrival: '16:50',
      duration: '2h 30m',
      price: 3800,
      rating: 4.1,
      features: ['Snacks', 'Entertainment'],
      availability: 12
    },
    // Trains
    {
      id: 'train-1',
      type: 'train',
      operator: 'Rajdhani Express',
      route: `${fromCity} → ${toCity}`,
      departure: '16:55',
      arrival: '07:30+1',
      duration: '14h 35m',
      price: 2200,
      rating: 4.5,
      features: ['AC 3-Tier', 'Meals', 'Bedding'],
      availability: 15
    },
    {
      id: 'train-2',
      type: 'train',
      operator: 'Shatabdi Express',
      route: `${fromCity} → ${toCity}`,
      departure: '06:00',
      arrival: '17:45',
      duration: '11h 45m',
      price: 1850,
      rating: 4.2,
      features: ['AC Chair Car', 'Meals'],
      availability: 20
    },
    // Buses
    {
      id: 'bus-1',
      type: 'bus',
      operator: 'Volvo AC Sleeper',
      route: `${fromCity} → ${toCity}`,
      departure: '20:30',
      arrival: '08:00+1',
      duration: '11h 30m',
      price: 1200,
      rating: 4.0,
      features: ['AC', 'Sleeper', 'WiFi', 'Charging'],
      availability: 25
    },
    {
      id: 'bus-2',
      type: 'bus',
      operator: 'RedBus AC Semi-Sleeper',
      route: `${fromCity} → ${toCity}`,
      departure: '22:00',
      arrival: '10:30+1',
      duration: '12h 30m',
      price: 900,
      rating: 3.8,
      features: ['AC', 'Semi-Sleeper', 'Snacks'],
      availability: 18
    },
    // Carpooling
    {
      id: 'carpool-1',
      type: 'carpool',
      operator: 'BlaBlaCar',
      route: `${fromCity} → ${toCity}`,
      departure: '09:00',
      arrival: '21:00',
      duration: '12h',
      price: 800,
      rating: 4.4,
      features: ['Shared ride', 'AC Car', 'Music'],
      availability: 3
    }
  ];

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'train': return Train;
      case 'bus': return Bus;
      case 'carpool': return Car;
      default: return Plane;
    }
  };

  const getTransportColor = (type: string) => {
    switch (type) {
      case 'flight': return 'text-blue-500';
      case 'train': return 'text-green-500';
      case 'bus': return 'text-orange-500';
      case 'carpool': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const filterByType = (type: string) => {
    return transportOptions.filter(option => option.type === type);
  };

  const handleBooking = (optionId: string) => {
    setSelectedTransport(optionId);
    // In a real app, this would proceed to payment
    onNavigate('payment');
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
              onClick={() => onNavigate('location')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Plane className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Book Transportation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Travel Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Select value={fromCity} onValueChange={setFromCity}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="to">To</Label>
                <Input 
                  id="to"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="departure">Departure</Label>
                <Input 
                  id="departure"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="return">Return (Optional)</Label>
                <Input 
                  id="return"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="passengers">Passengers</Label>
                <Select value={passengerCount.toString()} onValueChange={(value: string) => setPassengerCount(parseInt(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Passenger{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transportation Options */}
        <Tabs defaultValue="flight" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flight" className="flex items-center space-x-2">
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center space-x-2">
              <Train className="h-4 w-4" />
              <span>Trains</span>
            </TabsTrigger>
            <TabsTrigger value="bus" className="flex items-center space-x-2">
              <Bus className="h-4 w-4" />
              <span>Buses</span>
            </TabsTrigger>
            <TabsTrigger value="carpool" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Carpool</span>
            </TabsTrigger>
          </TabsList>

          {(['flight', 'train', 'bus', 'carpool'] as const).map((transportType) => (
            <TabsContent key={transportType} value={transportType}>
              <div className="space-y-4">
                {filterByType(transportType).map((option) => {
                  const IconComponent = getTransportIcon(option.type);
                  return (
                    <Card key={option.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`p-3 rounded-full bg-gray-100 ${getTransportColor(option.type)}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg">{option.operator}</h3>
                                <Badge className="bg-green-100 text-green-700">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  {option.rating}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-2">{option.route}</p>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{option.departure} - {option.arrival}</span>
                                </div>
                                <span>Duration: {option.duration}</span>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{option.availability} seats</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-2">
                                {option.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center text-2xl mb-2">
                              <IndianRupee className="h-5 w-5" />
                              <span>{option.price.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">per person</p>
                            <Button
                              onClick={() => handleBooking(option.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Travel Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">💡 Student Travel Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Book advance for better prices</p>
                <p className="mb-2">• Consider overnight journeys to save on accommodation</p>
              </div>
              <div>
                <p className="mb-2">• Group bookings often get discounts</p>
                <p className="mb-2">• Check for student ID discounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}