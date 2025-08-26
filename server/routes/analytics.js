import express from 'express';
import { parcels } from '../data/parcels.js';
import { users } from '../data/users.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get booking analytics
router.get('/bookings', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  const thisMonthParcels = parcels.filter(p => new Date(p.createdAt) >= thisMonth);
  const lastMonthParcels = parcels.filter(p => 
    new Date(p.createdAt) >= lastMonth && new Date(p.createdAt) < thisMonth
  );

  const totalRevenue = parcels.reduce((sum, p) => sum + (p.price || 0), 0);
  const thisMonthRevenue = thisMonthParcels.reduce((sum, p) => sum + (p.price || 0), 0);

  const statusCounts = parcels.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalParcels: parcels.length,
    thisMonthParcels: thisMonthParcels.length,
    lastMonthParcels: lastMonthParcels.length,
    totalRevenue,
    thisMonthRevenue,
    statusBreakdown: statusCounts,
    totalCustomers: users.filter(u => u.role === 'customer').length,
    totalAgents: users.filter(u => u.role === 'agent').length
  });
});

// Get delivery performance
router.get('/performance', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const deliveredParcels = parcels.filter(p => p.status === 'delivered');
  const onTimeParcels = deliveredParcels.filter(p => 
    new Date(p.updatedAt || p.createdAt) <= new Date(p.estimatedDelivery)
  );

  const agentPerformance = users
    .filter(u => u.role === 'agent')
    .map(agent => {
      const agentParcels = parcels.filter(p => p.agentId === agent.id);
      const delivered = agentParcels.filter(p => p.status === 'delivered');
      return {
        agentId: agent.id,
        name: agent.name,
        totalAssigned: agentParcels.length,
        delivered: delivered.length,
        deliveryRate: agentParcels.length > 0 ? (delivered.length / agentParcels.length * 100).toFixed(1) : 0
      };
    });

  res.json({
    onTimeDeliveryRate: deliveredParcels.length > 0 ? 
      (onTimeParcels.length / deliveredParcels.length * 100).toFixed(1) : 0,
    totalDelivered: deliveredParcels.length,
    agentPerformance
  });
});

export default router;