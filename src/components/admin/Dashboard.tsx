import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  TrendingUp,
  Users,
  Clock,
  Download,
  UserPlus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    failedDeliveries: 0,
    totalCodAmount: 0,
    dailyBookings: 0,
    activeAgents: 0
  });
  const [recentParcels, setRecentParcels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, parcelsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/api/analytics/dashboard', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:3001/api/parcels', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:3001/api/auth/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setMetrics(analyticsData);
      }

      if (parcelsRes.ok) {
        const parcelsData = await parcelsRes.json();
        setRecentParcels(parcelsData.slice(0, 10));
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignAgent = async (parcelId: string, agentId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/parcels/${parcelId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ agentId })
      });

      if (response.ok) {
        toast({
          title: "Agent Assigned",
          description: "Parcel has been assigned to agent successfully",
        });
        fetchDashboardData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign agent",
        variant: "destructive"
      });
    }
  };

  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`http://localhost:3001/api/analytics/export?format=${format}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${format}`;
        a.click();
        
        toast({
          title: "Export Successful",
          description: `Report exported as ${format.toUpperCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export report",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your courier operations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportReport('csv')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportReport('pdf')} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Bookings</p>
                <p className="text-3xl font-bold">{metrics.totalBookings}</p>
              </div>
              <Package className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed</p>
                <p className="text-3xl font-bold">{metrics.completedDeliveries}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pending</p>
                <p className="text-3xl font-bold">{metrics.pendingDeliveries}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">COD Amount</p>
                <p className="text-3xl font-bold">${metrics.totalCodAmount}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Parcels */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Parcels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Tracking ID</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Agent</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentParcels.map((parcel: any) => (
                  <tr key={parcel.id} className="border-b">
                    <td className="py-3 font-mono text-sm">{parcel.trackingNumber}</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(parcel.status)}>
                        {parcel.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3">{parcel.agentId ? 'Assigned' : 'Not Assigned'}</td>
                    <td className="py-3">
                      {!parcel.agentId && (
                        <Button size="sm" variant="outline">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Assign Agent
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;