import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package, MapPin, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const BookParcel: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    size: '',
    type: '',
    paymentType: 'prepaid',
    codAmount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/parcels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          customerId: user?.id,
          codAmount: formData.paymentType === 'cod' ? parseFloat(formData.codAmount) : 0
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Parcel Booked Successfully!",
          description: `Tracking Number: ${data.trackingNumber}`,
        });

        setFormData({
          pickupAddress: '',
          deliveryAddress: '',
          size: '',
          type: '',
          paymentType: 'prepaid',
          codAmount: '',
          notes: ''
        });
      } else {
        throw new Error('Failed to book parcel');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book parcel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Package className="w-6 h-6 text-blue-600" />
            Book New Parcel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup">Pickup Address</Label>
                <Textarea
                  id="pickup"
                  placeholder="Enter pickup address..."
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="delivery">Delivery Address</Label>
                <Textarea
                  id="delivery"
                  placeholder="Enter delivery address..."
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Parcel Size</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (up to 1kg)</SelectItem>
                    <SelectItem value="medium">Medium (1-5kg)</SelectItem>
                    <SelectItem value="large">Large (5kg+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Parcel Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="fragile">Fragile Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup 
                value={formData.paymentType} 
                onValueChange={(value) => setFormData({...formData, paymentType: value})}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prepaid" id="prepaid" />
                  <Label htmlFor="prepaid">Prepaid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.paymentType === 'cod' && (
              <div>
                <Label htmlFor="codAmount">COD Amount</Label>
                <Input
                  id="codAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.codAmount}
                  onChange={(e) => setFormData({...formData, codAmount: e.target.value})}
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special handling instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? 'Booking...' : 'Book Parcel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookParcel;