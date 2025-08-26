import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, MapPin, Phone, Clock, Route } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AssignedParcels: React.FC = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedParcels();
  }, []);

  const fetchAssignedParcels = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/agents/${user?.id}/parcels`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setParcels(data);
      }
    } catch (error) {
      console.error('Failed to fetch assigned parcels:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateParcelStatus = async (parcelId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/parcels/${parcelId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setParcels(prev => prev.map((parcel: any) => 
          parcel.id === parcelId ? { ...parcel, status: newStatus } : parcel
        ));
        
        toast({
          title: "Status Updated",
          description: `Parcel status updated to ${newStatus.replace('_', ' ')}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getOptimizedRoute = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/agents/${user?.id}/route`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Route Optimized",
          description: `Optimized route for ${data.parcels.length} deliveries`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get optimized route",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading assigned parcels...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Assigned Parcels</h1>
          <p className="text-gray-600">Manage your delivery assignments</p>
        </div>
        <Button onClick={getOptimizedRoute} className="bg-green-600 hover:bg-green-700">
          <Route className="w-4 h-4 mr-2" />
          Get Optimized Route
        </Button>
      </div>

      <div className="grid gap-6">
        {parcels.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No parcels assigned</p>
            </CardContent>
          </Card>
        ) : (
          parcels.map((parcel: any) => (
            <Card key={parcel.id} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {parcel.trackingNumber}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">Customer: {parcel.customerName || 'N/A'}</p>
                  </div>
                  <Badge className={getStatusColor(parcel.status)}>
                    {parcel.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Pickup Address
                    </h4>
                    <p className="text-gray-600 text-sm">{parcel.pickupAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h4>
                    <p className="text-gray-600 text-sm">{parcel.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {parcel.paymentType === 'cod' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-green-600">
                        COD: ${parcel.codAmount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Select 
                    value={parcel.status} 
                    onValueChange={(value) => updateParcelStatus(parcel.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedParcels;