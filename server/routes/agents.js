import express from 'express';
import { users } from '../data/users.js';
import { parcels } from '../data/parcels.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all agents
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const agents = users.filter(user => user.role === 'agent');
  const agentsWithStats = agents.map(agent => {
    const assignedParcels = parcels.filter(p => p.agentId === agent.id);
    return {
      ...agent,
      assignedParcels: assignedParcels.length,
      deliveredParcels: assignedParcels.filter(p => p.status === 'delivered').length
    };
  });
  res.json(agentsWithStats);
});

// Get agent's assigned parcels
router.get('/my-parcels', authenticateToken, authorizeRoles('agent'), (req, res) => {
  const assignedParcels = parcels.filter(p => p.agentId === req.user.id);
  res.json(assignedParcels);
});

// Update parcel location (agent only)
router.patch('/parcels/:id/location', authenticateToken, authorizeRoles('agent'), (req, res) => {
  const { coordinates } = req.body;
  const parcelIndex = parcels.findIndex(p => p.id === req.params.id && p.agentId === req.user.id);
  
  if (parcelIndex === -1) {
    return res.status(404).json({ error: 'Parcel not found or not assigned to you' });
  }

  parcels[parcelIndex].coordinates = coordinates;
  parcels[parcelIndex].updatedAt = new Date().toISOString();
  
  res.json(parcels[parcelIndex]);
});

export default router;