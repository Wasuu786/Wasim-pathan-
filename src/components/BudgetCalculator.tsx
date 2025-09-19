import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Minus, Users, IndianRupee, Calculator, PieChart, Share2, Trash2 } from 'lucide-react';

type BudgetCalculatorProps = {
  travelers: string[];
  onTravelersChange: (travelers: string[]) => void;
  onNavigate: (page: string) => void;
};

type BudgetItem = {
  id: string;
  category: string;
  name: string;
  amount: number;
  splitType: 'equal' | 'custom';
  participants: string[];
};

export function BudgetCalculator({ travelers, onTravelersChange, onNavigate }: BudgetCalculatorProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      category: 'Transportation',
      name: 'Flight tickets',
      amount: 4500,
      splitType: 'equal',
      participants: []
    },
    {
      id: '2',
      category: 'Accommodation',
      name: 'Hotel/Hostel',
      amount: 1500,
      splitType: 'equal',
      participants: []
    }
  ]);
  
  const [newTravelerName, setNewTravelerName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Transportation');

  const categories = [
    'Transportation',
    'Accommodation',
    'Food & Dining',
    'Activities',
    'Shopping',
    'Emergency',
    'Miscellaneous'
  ];

  const addTraveler = () => {
    if (newTravelerName.trim() && !travelers.includes(newTravelerName.trim())) {
      onTravelersChange([...travelers, newTravelerName.trim()]);
      setNewTravelerName('');
    }
  };

  const removeTraveler = (index: number) => {
    const newTravelers = travelers.filter((_, i) => i !== index);
    onTravelersChange(newTravelers);
  };

  const addBudgetItem = () => {
    if (newItemName.trim() && newItemAmount.trim()) {
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        category: selectedCategory,
        name: newItemName.trim(),
        amount: parseFloat(newItemAmount),
        splitType: 'equal',
        participants: [...travelers]
      };
      setBudgetItems([...budgetItems, newItem]);
      setNewItemName('');
      setNewItemAmount('');
    }
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItems(budgetItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const calculateTotalBudget = () => {
    return budgetItems.reduce((total, item) => total + item.amount, 0);
  };

  const calculatePerPersonCost = () => {
  if (travelers.length === 0) return {};
    
    const totalPerPerson: { [key: string]: number } = {};
    travelers.forEach(traveler => {
      totalPerPerson[traveler] = 0;
    });

    budgetItems.forEach(item => {
      if (item.splitType === 'equal' && item.participants.length > 0) {
        const costPerPerson = item.amount / item.participants.length;
        item.participants.forEach(participant => {
          if (totalPerPerson[participant] !== undefined) {
            totalPerPerson[participant] += costPerPerson;
          }
        });
      }
    });

    return totalPerPerson;
  };

  const getCategoryTotal = (category: string) => {
    return budgetItems
      .filter(item => item.category === category)
      .reduce((total, item) => total + item.amount, 0);
  };

  const perPersonCosts = calculatePerPersonCost();
  const totalBudget = calculateTotalBudget();

  // Update participants when travelers list changes
  useEffect(() => {
    setBudgetItems(items => 
      items.map(item => ({
        ...item,
        participants: item.splitType === 'equal' ? travelers : item.participants.filter(p => travelers.includes(p))
      }))
    );
  }, [travelers]);

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
              <Calculator className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Budget Calculator</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Travelers Section */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Travelers ({travelers.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {travelers.map((traveler, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center space-x-2 py-2 px-3"
                      >
                        <span>{traveler}</span>
                        <button
                          onClick={() => removeTraveler(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add traveler name..."
                      value={newTravelerName}
                      onChange={(e) => setNewTravelerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTraveler()}
                      className="flex-1"
                    />
                    <Button onClick={addTraveler} disabled={!newTravelerName.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Items */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5" />
                  <span>Expense Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add New Item */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Item name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Amount (₹)"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value)}
                    />
                    <Button onClick={addBudgetItem} disabled={!newItemName.trim() || !newItemAmount.trim()}>
                      Add Item
                    </Button>
                  </div>

                  {/* Existing Items */}
                  <div className="space-y-3">
                    {budgetItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline">{item.category}</Badge>
                            <span>{item.name}</span>
                            <Badge className="bg-green-100 text-green-700">
                              ₹{item.amount.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Split among: {item.participants.length} people</span>
                            <span>₹{(item.amount / (item.participants.length || 1)).toFixed(0)} per person</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBudgetItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Total Budget */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <PieChart className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl mb-2">Total Budget</h3>
                <div className="text-3xl">₹{totalBudget.toLocaleString()}</div>
                <p className="text-blue-100 mt-2">
                  ₹{travelers.length > 0 ? (totalBudget / travelers.length).toFixed(0) : 0} per person average
                </p>
              </CardContent>
            </Card>

            {/* Per Person Breakdown */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Individual Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {travelers.map((traveler) => (
                    <div key={traveler} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>{traveler}</span>
                      <Badge className="bg-green-100 text-green-700">
                        ₹{(perPersonCosts[traveler] || 0).toFixed(0)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>By Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const categoryTotal = getCategoryTotal(category);
                    if (categoryTotal === 0) return null;
                    
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm">₹{categoryTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 space-y-3">
                <Button className="w-full" onClick={() => {/* Share functionality */}}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Group
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onNavigate('payment')}>
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Budget Tips */}
        <Card className="mt-8 border-0 shadow-md bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg mb-4">💰 Budget Tips for Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-2">• Book accommodation with kitchen facilities</p>
                <p className="mb-2">• Use student discounts whenever possible</p>
                <p className="mb-2">• Travel during off-peak seasons</p>
              </div>
              <div>
                <p className="mb-2">• Split costs for shared activities</p>
                <p className="mb-2">• Keep 10-15% extra for emergencies</p>
                <p className="mb-2">• Use local transport instead of taxis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}