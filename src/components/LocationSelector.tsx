import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Search, MapPin, Star, IndianRupee, Compass } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type LocationSelectorProps = {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onNavigate: (page: string) => void;
};

export function LocationSelector({ selectedLocation, onLocationChange, onNavigate }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const popularDestinations = [
    {
      name: 'Goa',
      description: 'Beaches, nightlife, and Portuguese heritage',
      budget: '₹2,000-4,000/day',
      rating: 4.8,
      image: 'img/15 Fun Things To Do In Palolem Beach, South Goa - Trot_World.jpg',
      tags: ['Beach', 'Party', 'Budget-friendly']
    },
    {
      name: 'Manali',
      description: 'Mountains, adventure sports, and cool weather',
      budget: '₹1,500-3,000/day',
      rating: 4.7,
      image: 'img/houses-surrounded-by-green-trees-in-manali-during-daytime.DAktkgeM_90jep.jpg',
      tags: ['Mountains', 'Adventure', 'Scenic']
    },
    {
      name: 'Rishikesh',
      description: 'Yoga capital, river rafting, and spiritual vibes',
      budget: '₹1,000-2,500/day',
      rating: 4.6,
      image: 'img/rishikesh-yoga-city-india-gange-600nw-1137990866.webp',
      tags: ['Spiritual', 'Adventure', 'Budget']
    },
    {
      name: 'Udaipur',
      description: 'City of lakes, palaces, and royal heritage',
      budget: '₹2,500-4,500/day',
      rating: 4.9,
      image: 'img/b3.jpg',
      tags: ['Heritage', 'Lakes', 'Culture']
    },
    {
      name: 'Hampi',
      description: 'Ancient ruins, boulders, and backpacker paradise',
      budget: '₹800-2,000/day',
      rating: 4.5,
      image: 'img/India-for-Beginners-custom-tours-6.jpg',
      tags: ['History', 'Backpacking', 'UNESCO']
    },
    {
      name: 'Kasol',
      description: 'Mini Israel, trekking, and hippie culture',
      budget: '₹1,200-2,800/day',
      rating: 4.4,
      image: 'img/360_F_383581969_qisnIIKvUr9GmLKZbaTHzpCTXBvwpTsV.jpg',
      tags: ['Trekking', 'Culture', 'Nature']
    },
    {
      name: 'Pushkar',
      description: 'Holy lake, camel safari, and desert vibes',
      budget: '₹1,000-2,200/day',
      rating: 4.3,
      image: 'img/Places-to-visit-in-Pushkar-in-1-day-00063.jpg',
      tags: ['Desert', 'Culture', 'Spiritual']
    },
    {
      name: 'Vashisht',
      description: 'Hot springs, mountain views, and peaceful atmosphere',
      budget: '₹900-2,000/day',
      rating: 4.5,
      image: 'img/b-vashisht.jpg',
      tags: ['Hot Springs', 'Mountains', 'Peaceful']
    }
  ];

  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
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
              <Compass className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Choose Destination</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Selected Location */}
        {selectedLocation && (
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Selected Destination</p>
                      <p className="text-blue-600">{selectedLocation}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('transportation')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue Planning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Destinations */}
        <div>
          <h2 className="text-2xl mb-6">Popular Student Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-lg transition-all border-0 shadow-md ${
                  selectedLocation === destination.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleLocationSelect(destination.name)}
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`}
                    alt={destination.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white text-gray-800 shadow-md">
                      <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                      {destination.rating}
                    </Badge>
                  </div>
                  {selectedLocation === destination.name && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-t-lg flex items-center justify-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full">
                        <MapPin className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-lg">{destination.name}</CardTitle>
                  </CardHeader>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {destination.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-green-600">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.budget}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {destination.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Location Input */}
        <div className="mt-12">
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg mb-2">Don't see your destination?</h3>
              <p className="text-gray-600 mb-4">Type in any destination you have in mind</p>
              <div className="max-w-md mx-auto flex space-x-3">
                <Input
                  type="text"
                  placeholder="Enter custom destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10"
                />
                <Button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      handleLocationSelect(searchQuery.trim());
                      setSearchQuery('');
                    }
                  }}
                  disabled={!searchQuery.trim()}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {selectedLocation && (
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => onNavigate('voting')}
              className="flex items-center space-x-2"
            >
              <span>Create Group Vote</span>
            </Button>
            <Button
              onClick={() => onNavigate('transportation')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Book Transportation</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}