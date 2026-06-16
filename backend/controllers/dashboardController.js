import Device from '../models/Device.js';
import Component from '../models/Component.js';
import Inventory from '../models/Inventory.js';
import Sale from '../models/Sale.js';
import Disposal from '../models/Disposal.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    // Total devices
    const totalDevices = await Device.countDocuments();
    const devicesByStatus = await Device.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Total components
    const totalComponents = await Component.countDocuments();
    const componentsByCondition = await Component.aggregate([
      { $group: { _id: '$condition', count: { $sum: 1 } } },
    ]);
    const componentsByCategory = await Component.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Inventory stats
    const inventoryStats = await Inventory.aggregate([
      { $match: { status: 'Available' } },
      { $group: { _id: null, totalStock: { $sum: '$quantity' } } },
    ]);

    // Sales stats
    const salesStats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$salePrice', '$quantity'] } },
          totalSold: { $sum: '$quantity' },
        },
      },
    ]);

    // Disposal stats
    const disposalStats = await Disposal.aggregate([
      { $group: { _id: '$disposalType', count: { $sum: '$quantity' } } },
    ]);

    // Device types distribution
    const deviceTypes = await Device.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent activity - latest 5 devices
    const recentDevices = await Device.find()
      .populate('registeredBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalDevices,
      totalComponents,
      devicesByStatus,
      componentsByCondition,
      componentsByCategory,
      inventoryStock: inventoryStats[0]?.totalStock || 0,
      totalRevenue: salesStats[0]?.totalRevenue || 0,
      totalSold: salesStats[0]?.totalSold || 0,
      disposalStats,
      deviceTypes,
      recentDevices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get monthly recovery statistics
// @route   GET /api/dashboard/monthly
// @access  Private
export const getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Monthly devices received
    const monthlyDevices = await Device.aggregate([
      {
        $match: {
          arrivalDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$arrivalDate' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly components extracted
    const monthlyComponents = await Component.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly revenue
    const monthlyRevenue = await Sale.aggregate([
      {
        $match: {
          saleDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$saleDate' },
          revenue: { $sum: { $multiply: ['$salePrice', '$quantity'] } },
          sold: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build 12-month array
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyData = months.map((month, index) => {
      const deviceData = monthlyDevices.find((d) => d._id === index + 1);
      const componentData = monthlyComponents.find((c) => c._id === index + 1);
      const revenueData = monthlyRevenue.find((r) => r._id === index + 1);

      return {
        month,
        devices: deviceData?.count || 0,
        components: componentData?.count || 0,
        revenue: revenueData?.revenue || 0,
        sold: revenueData?.sold || 0,
      };
    });

    res.json({ year, monthlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
