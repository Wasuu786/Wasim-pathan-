import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Hotel, Star, Wifi, Car, Coffee, Users, MapPin, IndianRupee, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';



type HotelBookingProps = {
  location: string;
  travelers: string[];
  onNavigate: (page: string) => void;
};

type Hotel = {
  id: string;
  name: string;
  type: 'hostel' | 'budget_hotel' | 'hotel';
  rating: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
  description: string;
  distance: string;
  studentFriendly: boolean;
  groupDiscounts: boolean;
  availability: number;
  reviews: number;
};

export function HotelBooking({ location, travelers, onNavigate }: HotelBookingProps) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [roomsNeeded, setRoomsNeeded] = useState(1);
  const [guestsPerRoom, setGuestsPerRoom] = useState(2);
  const [priceRange, setPriceRange] = useState('all');
  const [hotelType, setHotelType] = useState('all');
  const [selectedHotel, setSelectedHotel] = useState<string>('');

  const hotels: Hotel[] = [
    {
      id: 'hostel-1',
      name: 'Backpacker\'s Paradise Hostel',
      type: 'hostel',
      rating: 4.2,
      pricePerNight: 600,
      image: 'hostel dormitory beds',
      amenities: ['Free WiFi', 'Common Kitchen', 'Lockers', 'AC', 'Laundry'],
      description: 'Perfect for budget travelers with shared dormitories and great social atmosphere',
      distance: '2.5 km from city center',
      studentFriendly: true,
      groupDiscounts: true,
      availability: 8,
      reviews: 324
    },
    {
      id: 'hostel-2',
      name: 'Youth Hub Backpackers',
      type: 'hostel',
      rating: 4.4,
      pricePerNight: 750,
      image: 'modern hostel lounge',
      amenities: ['Free WiFi', 'Rooftop Cafe', 'Game Room', 'AC', 'Parking'],
      description: 'Modern hostel with private rooms and dormitories, popular among students',
      distance: '1.8 km from city center',
      studentFriendly: true,
      groupDiscounts: true,
      availability: 12,
      reviews: 567
    },
    {
      id: 'budget-1',
      name: 'Student Inn Budget Hotel',
      type: 'budget_hotel',
      rating: 4.0,
      pricePerNight: 1200,
      image: 'budget hotel room',
      amenities: ['Free WiFi', 'Restaurant', 'AC', 'Hot Water', 'Room Service'],
      description: 'Clean and comfortable budget hotel with student-friendly rates',
      distance: '3.2 km from city center',
      studentFriendly: true,
      groupDiscounts: false,
      availability: 6,
      reviews: 289
    },
    {
      id: 'budget-2',
      name: 'Traveler\'s Rest Inn',
      type: 'budget_hotel',
      rating: 3.8,
      pricePerNight: 1000,
      image: 'simple hotel room',
      amenities: ['WiFi', 'Restaurant', 'AC', 'Parking'],
      description: 'Basic accommodation with essential amenities at affordable prices',
      distance: '4.1 km from city center',
      studentFriendly: true,
      groupDiscounts: true,
      availability: 4,
      reviews: 156
    },
    {
      id: 'hotel-1',
      name: 'Heritage Grand Hotel',
      type: 'hotel',
      rating: 4.6,
      pricePerNight: 2500,
      image: 'luxury hotel lobby',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
      description: 'Luxury hotel with premium amenities and excellent service',
      distance: '1.2 km from city center',
      studentFriendly: false,
      groupDiscounts: true,
      availability: 3,
      reviews: 892
    },
    {
      id: 'hotel-2',
      name: 'City Center Boutique Hotel',
      type: 'hotel',
      rating: 4.3,
      pricePerNight: 1800,
      image: 'boutique hotel room',
      amenities: ['Free WiFi', 'Restaurant', 'Bar', 'AC', 'Business Center'],
      description: 'Stylish boutique hotel in the heart of the city',
      distance: '0.8 km from city center',
      studentFriendly: false,
      groupDiscounts: false,
      availability: 5,
      reviews: 445
    }
  ];

  const getFilteredHotels = () => {
    return hotels.filter(hotel => {
      // Filter by price range
      if (priceRange !== 'all') {
        if (priceRange === 'budget' && hotel.pricePerNight > 1000) return false;
        if (priceRange === 'mid' && (hotel.pricePerNight <= 1000 || hotel.pricePerNight > 2000)) return false;
        if (priceRange === 'luxury' && hotel.pricePerNight <= 2000) return false;
      }
      
      // Filter by hotel type
      if (hotelType !== 'all' && hotel.type !== hotelType) return false;
      
      return true;
    }).sort((a, b) => {
      // Sort by student-friendly first, then by price
      if (a.studentFriendly && !b.studentFriendly) return -1;
      if (!a.studentFriendly && b.studentFriendly) return 1;
      return a.pricePerNight - b.pricePerNight;
    });
  };

  const getHotelTypeIcon = (type: string) => {
    switch (type) {
      case 'hostel': return '🏠';
      case 'budget_hotel': return '🏨';
      case 'hotel': return '🏛️';
      default: return '🏨';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      case 'restaurant':
      case 'rooftop cafe': return <Coffee className="h-4 w-4" />;
      default: return <span className="text-xs">•</span>;
    }
  };

  const calculateTotalPrice = (hotel: Hotel) => {
    if (!checkInDate || !checkOutDate) return hotel.pricePerNight;
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    let totalPrice = hotel.pricePerNight * nights * roomsNeeded;
    
    // Apply group discount if available
    if (hotel.groupDiscounts && travelers.length >= 4) {
      totalPrice *= 0.9; // 10% group discount
    }
    
    return Math.round(totalPrice);
  };

  const handleBooking = (hotelId: string) => {
    setSelectedHotel(hotelId);
    onNavigate('payment');
  };

  const filteredHotels = getFilteredHotels();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('transportation')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Hotel className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Hotels in {location}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Search Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="checkin">Check In</Label>
                <Input
                  id="checkin"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="checkout">Check Out</Label>
                <Input
                  id="checkout"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="rooms">Rooms</Label>
                <Select value={roomsNeeded.toString()} onValueChange={(value: string) => setRoomsNeeded(parseInt(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Room{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="guests">Guests/Room</Label>
                <Select value={guestsPerRoom.toString()} onValueChange={(value: string) => setGuestsPerRoom(parseInt(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">₹500-1000</SelectItem>
                    <SelectItem value="mid">₹1000-2000</SelectItem>
                    <SelectItem value="luxury">₹2000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={hotelType} onValueChange={setHotelType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hostel">Hostels</SelectItem>
                    <SelectItem value="budget_hotel">Budget Hotels</SelectItem>
                    <SelectItem value="hotel">Hotels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Available Hotels ({filteredHotels.length})</h2>
            <Badge variant="outline" className="text-blue-600">
              <Users className="h-3 w-3 mr-1" />
              {travelers.length} traveler{travelers.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {filteredHotels.map((hotel) => {
            const totalPrice = calculateTotalPrice(hotel);
            const nights = checkInDate && checkOutDate ? 
              Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 1;

            return (
              <Card key={hotel.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Hotel Image */}
                    <div className="lg:col-span-1">
                      <div className="relative h-48 lg:h-full rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white text-gray-800 shadow-md">
                            <span className="mr-1">{getHotelTypeIcon(hotel.type)}</span>
                            {hotel.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                        {hotel.studentFriendly && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-blue-100 text-blue-700">
                              Student Friendly
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hotel Details */}
                    <div className="lg:col-span-2">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl mb-1">{hotel.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              <span>{hotel.rating}</span>
                              <span>({hotel.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{hotel.distance}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm">{hotel.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 5).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs flex items-center space-x-1">
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </Badge>
                          ))}
                          {hotel.amenities.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 5} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-green-600">
                            <span>{hotel.availability} rooms available</span>
                          </div>
                          {hotel.groupDiscounts && travelers.length >= 4 && (
                            <Badge className="bg-green-100 text-green-700">
                              10% Group Discount Applied
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Booking */}
                    <div className="lg:col-span-1 text-right">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-end text-2xl">
                            <IndianRupee className="h-5 w-5" />
                            <span>{hotel.pricePerNight.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-500">per night</p>
                        </div>

                        {checkInDate && checkOutDate && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex justify-between">
                                <span>{nights} night{nights > 1 ? 's' : ''}</span>
                                <span>₹{(hotel.pricePerNight * nights).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{roomsNeeded} room{roomsNeeded > 1 ? 's' : ''}</span>
                                <span>x{roomsNeeded}</span>
                              </div>
                              {hotel.groupDiscounts && travelers.length >= 4 && (
                                <div className="flex justify-between text-green-600">
                                  <span>Group discount</span>
                                  <span>-10%</span>
                                </div>
                              )}
                              <hr />
                              <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={() => handleBooking(hotel.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={hotel.availability === 0}
                        >
                          {hotel.availability === 0 ? 'Sold Out' : 'Book Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Student Travel Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">🏨 Student Accommodation Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Hostels are perfect for meeting fellow travelers</p>
                <p className="mb-2">• Book early for better rates and availability</p>
                <p className="mb-2">• Check for student ID discounts</p>
              </div>
              <div>
                <p className="mb-2">• Look for kitchenette facilities to save on food</p>
                <p className="mb-2">• Group bookings often get special rates</p>
                <p className="mb-2">• Read recent reviews for updated information</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}