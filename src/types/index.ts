export type UserRole = 'customer' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Parcel {
  id: string;
  customerId: string;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  size: 'small' | 'medium' | 'large';
  type: 'document' | 'package' | 'fragile';
  paymentType: 'cod' | 'prepaid';
  codAmount?: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  agentId?: string;
  agentName?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string;
}

export interface DeliveryAgent extends User {
  assignedParcels: string[];
  completedDeliveries: number;
  rating: number;
}

export interface ParcelMetrics {
  totalBookings: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  failedDeliveries: number;
  totalCodAmount: number;
  dailyBookings: number;
}