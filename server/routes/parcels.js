import express from 'express';
import { parcels, findParcelById, findParcelByTracking, createParcel, updateParcel } from '../data/parcels.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all parcels (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json(parcels);
});

// Get parcel by tracking number
router.get('/track/:trackingNumber', (req, res) => {
  const parcel = findParcelByTracking(req.params.trackingNumber);
  if (!parcel) {
    return res.status(404).json({ error: 'Parcel not found' });
  }
  res.json(parcel);
});

// Get user's parcels
router.get('/my-parcels', authenticateToken, (req, res) => {
  const userParcels = parcels.filter(p => 
    p.senderId === req.user.id || 
    (req.user.role === 'agent' && p.agentId === req.user.id)
  );
  res.json(userParcels);
});

// Create new parcel
router.post('/', authenticateToken, (req, res) => {
  try {
    const parcelData = {
      ...req.body,
      senderId: req.user.id,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const newParcel = createParcel(parcelData);
    res.status(201).json(newParcel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create parcel' });
  }
});

// Update parcel status
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { status, coordinates } = req.body;
  const parcel = findParcelById(req.params.id);
  
  if (!parcel) {
    return res.status(404).json({ error: 'Parcel not found' });
  }

  const updatedParcel = updateParcel(req.params.id, { 
    status, 
    coordinates: coordinates || parcel.coordinates,
    updatedAt: new Date().toISOString()
  });
  
  res.json(updatedParcel);
});

// Assign agent to parcel
router.patch('/:id/assign', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const { agentId } = req.body;
  const updatedParcel = updateParcel(req.params.id, { agentId });
  
  if (!updatedParcel) {
    return res.status(404).json({ error: 'Parcel not found' });
  }
  
  res.json(updatedParcel);
});

export default router;