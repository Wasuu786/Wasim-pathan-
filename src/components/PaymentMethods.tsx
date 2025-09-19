import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, CreditCard, Smartphone, Building, Shield, CheckCircle, IndianRupee } from 'lucide-react';

type PaymentMethodsProps = {
  onNavigate: (page: string) => void;
};

export function PaymentMethods({ onNavigate }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    netBankingBank: '',
    saveCard: false
  });
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI ID',
      icon: Smartphone,
      color: 'text-green-600',
      options: [
        { id: 'gpay', name: 'Google Pay', logo: '🟢' },
        { id: 'phonepe', name: 'PhonePe', logo: '🟣' },
        { id: 'paytm', name: 'Paytm', logo: '🔵' },
        { id: 'bhim', name: 'BHIM UPI', logo: '🟠' }
      ]
    },
    {
      id: 'cards',
      name: 'Cards',
      description: 'Credit/Debit Card',
      icon: CreditCard,
      color: 'text-blue-600',
      options: [
        { id: 'visa', name: 'Visa', logo: '💳' },
        { id: 'mastercard', name: 'Mastercard', logo: '💳' },
        { id: 'rupay', name: 'RuPay', logo: '💳' },
        { id: 'amex', name: 'American Express', logo: '💳' }
      ]
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Internet Banking',
      icon: Building,
      color: 'text-purple-600',
      options: [
        { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
        { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
        { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
        { id: 'axis', name: 'Axis Bank', logo: '🏦' },
        { id: 'kotak', name: 'Kotak Mahindra', logo: '🏦' },
        { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' }
      ]
    }
  ];

  const bookingSummary = {
    transportation: 4500,
    accommodation: 1500,
    activities: 800,
    fees: 45,
    total: 6845
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProcessing(false);
    // Navigate to success page or dashboard
    onNavigate('dashboard');
  };

  const updatePaymentDetails = (field: string, value: string | boolean) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
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
              onClick={() => onNavigate('transportation')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl">Payment Methods</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                {paymentMethods.map(method => {
                  const IconComponent = method.icon;
                  return (
                    <TabsTrigger key={method.id} value={method.id} className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{method.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* UPI Payment */}
              <TabsContent value="upi">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <span>UPI Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* UPI Apps */}
                    <div>
                      <Label className="text-base mb-3 block">Choose UPI App</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.find(m => m.id === 'upi')?.options.map(option => (
                          <Button
                            key={option.id}
                            variant="outline"
                            className="h-16 flex items-center space-x-3 justify-start"
                          >
                            <span className="text-2xl">{option.logo}</span>
                            <span>{option.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* UPI ID Input */}
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                        value={paymentDetails.upiId}
                        onChange={(e) => updatePaymentDetails('upiId', e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm">Instant payment confirmation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Card Payment */}
              <TabsContent value="cards">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span>Card Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Card Types */}
                    <div>
                      <Label className="text-base mb-3 block">Accepted Cards</Label>
                      <div className="flex space-x-4">
                        {paymentMethods.find(m => m.id === 'cards')?.options.map(option => (
                          <Badge key={option.id} variant="outline" className="px-3 py-2">
                            <span className="mr-2">{option.logo}</span>
                            {option.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => updatePaymentDetails('cardNumber', e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => updatePaymentDetails('expiryDate', e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={(e) => updatePaymentDetails('cvv', e.target.value)}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="Name on card"
                          value={paymentDetails.cardholderName}
                          onChange={(e) => updatePaymentDetails('cardholderName', e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="saveCard"
                        checked={paymentDetails.saveCard}
                        onCheckedChange={(checked: boolean | undefined) => updatePaymentDetails('saveCard', !!checked)}
                      />
                      <Label htmlFor="saveCard" className="text-sm">Save card for future payments</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Net Banking */}
              <TabsContent value="netbanking">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-purple-600" />
                      <span>Net Banking</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base mb-3 block">Select Your Bank</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paymentMethods.find(m => m.id === 'netbanking')?.options.map(option => (
                          <Button
                            key={option.id}
                            variant="outline"
                            className="h-12 flex items-center space-x-3 justify-start"
                            onClick={() => updatePaymentDetails('netBankingBank', option.name)}
                          >
                            <span className="text-xl">{option.logo}</span>
                            <span>{option.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-purple-700">
                        <Shield className="h-5 w-5" />
                        <span className="text-sm">Secure banking gateway</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-0 shadow-md sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5" />
                  <span>Payment Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Transportation</span>
                    <span>₹{bookingSummary.transportation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accommodation</span>
                    <span>₹{bookingSummary.accommodation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities</span>
                    <span>₹{bookingSummary.activities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Fee</span>
                    <span>₹{bookingSummary.fees}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span>Total Amount</span>
                    <span>₹{bookingSummary.total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  onClick={handlePayment}
                  disabled={!selectedMethod || processing}
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Pay ₹${bookingSummary.total.toLocaleString()}`
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>🔒 Payments are 100% secure</p>
                  <p>Protected by 256-bit SSL encryption</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card className="mt-6 border-0 shadow-md bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-4">
                <h3 className="text-sm mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Why TravelMate Payments are Safe</span>
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• PCI DSS certified payment gateway</p>
                  <p>• No card details stored on our servers</p>
                  <p>• 24/7 fraud monitoring</p>
                  <p>• Instant refund policy</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}