import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Truck, 
  BarChart3, 
  Users, 
  MapPin, 
  Plus,
  History,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'parcels', label: 'All Parcels', icon: Package },
          { id: 'agents', label: 'Agents', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'agent':
        return [
          { id: 'assigned', label: 'Assigned Parcels', icon: Package },
          { id: 'route', label: 'Route Optimizer', icon: MapPin },
          { id: 'history', label: 'Delivery History', icon: History },
        ];
      default:
        return [
          { id: 'book', label: 'Book Parcel', icon: Plus },
          { id: 'track', label: 'Track Parcel', icon: MapPin },
          { id: 'history', label: 'My Bookings', icon: History },
        ];
    }
  };

  return (
    <aside className={`bg-gray-900 text-white w-64 min-h-screen transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 fixed lg:relative z-30`}>
      <div className="p-6">
        <div className="space-y-2">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 text-left ${
                  activeView === item.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;