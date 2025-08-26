import { v4 as uuidv4 } from 'uuid';

export let parcels = [
  {
    id: uuidv4(),
    trackingNumber: 'CP001234567',
    senderId: null,
    recipientName: 'John Doe',
    recipientPhone: '+1234567890',
    recipientAddress: '123 Main St, City, State 12345',
    senderAddress: '456 Oak Ave, City, State 12345',
    weight: 2.5,
    dimensions: '20x15x10 cm',
    status: 'pending',
    agentId: null,
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    coordinates: { lat: 40.7128, lng: -74.0060 },
    price: 25.99
  }
];

export const findParcelById = (id) => {
  return parcels.find(parcel => parcel.id === id);
};

export const findParcelByTracking = (trackingNumber) => {
  return parcels.find(parcel => parcel.trackingNumber === trackingNumber);
};

export const createParcel = (parcelData) => {
  const newParcel = {
    id: uuidv4(),
    trackingNumber: `CP${Date.now()}${Math.floor(Math.random() * 1000)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...parcelData
  };
  parcels.push(newParcel);
  return newParcel;
};

export const updateParcel = (id, updates) => {
  const index = parcels.findIndex(p => p.id === id);
  if (index !== -1) {
    parcels[index] = { ...parcels[index], ...updates };
    return parcels[index];
  }
  return null;
};