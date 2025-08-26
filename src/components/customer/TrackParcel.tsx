import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const TrackParcel: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/parcels/track/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingData(data);
      } else {
        toast({
          title: "Not Found",
          description: "Parcel not found with this tracking number",
          variant: "destructive"
        });
        setTrackingData(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track parcel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'in_transit': return 'bg-blue-500';
      case 'picked_up': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'in_transit') return <Truck className="w-5 h-5 text-blue-500" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const timeline = trackingData ? [
    { status: 'pending', label: 'Order Placed', completed: true },
    { status: 'assigned', label: 'Agent Assigned', completed: trackingData.status !== 'pending' },
    { status: 'picked_up', label: 'Picked Up', completed: ['picked_up', 'in_transit', 'delivered'].includes(trackingData.status) },
    { status: 'in_transit', label: 'In Transit', completed: ['in_transit', 'delivered'].includes(trackingData.status) },
    { status: 'delivered', label: 'Delivered', completed: trackingData.status === 'delivered' },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="w-6 h-6 text-blue-600" />
            Track Your Parcel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                placeholder="Enter tracking number (e.g., SP12345678)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleTrack} className="mt-6 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {trackingData && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Tracking: {trackingData.trackingNumber}</CardTitle>
                <p className="text-gray-600 mt-1">
                  Created: {new Date(trackingData.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={`${getStatusColor(trackingData.status)} text-white`}>
                {trackingData.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Pickup Address</h4>
                <p className="text-gray-600">{trackingData.pickupAddress}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
                <p className="text-gray-600">{trackingData.deliveryAddress}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Tracking Timeline</h4>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {getStatusIcon(item.status, item.completed)}
                    <div className="flex-1">
                      <span className={`font-medium ${item.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackParcel;