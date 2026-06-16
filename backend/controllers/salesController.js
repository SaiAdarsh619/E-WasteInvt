import Sale from '../models/Sale.js';
import Disposal from '../models/Disposal.js';
import Inventory from '../models/Inventory.js';

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Sale.countDocuments();
    const sales = await Sale.find()
      .populate({
        path: 'component',
        select: 'componentName category condition',
      })
      .populate('processedBy', 'name')
      .sort({ saleDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      sales,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a sale
// @route   POST /api/sales
// @access  Private (Admin, Inventory Manager)
export const createSale = async (req, res) => {
  try {
    const { component, quantity, salePrice, buyer } = req.body;

    // Update inventory
    const inventoryItem = await Inventory.findOne({
      component,
      status: 'Available',
    });

    if (inventoryItem) {
      if (inventoryItem.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient inventory stock' });
      }
      inventoryItem.quantity -= Number(quantity);
      if (inventoryItem.quantity === 0) {
        inventoryItem.status = 'Sold';
      }
      await inventoryItem.save();
    }

    const sale = await Sale.create({
      component,
      quantity,
      salePrice,
      buyer,
      processedBy: req.user._id,
    });

    const populated = await sale.populate([
      { path: 'component', select: 'componentName category condition' },
      { path: 'processedBy', select: 'name' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a disposal
// @route   POST /api/sales/dispose
// @access  Private (Admin, Inventory Manager)
export const createDisposal = async (req, res) => {
  try {
    const { component, quantity, disposalType, notes } = req.body;

    // Update inventory
    const inventoryItem = await Inventory.findOne({
      component,
      status: 'Available',
    });

    if (inventoryItem) {
      inventoryItem.quantity -= Number(quantity);
      if (inventoryItem.quantity <= 0) {
        inventoryItem.quantity = 0;
        inventoryItem.status = 'Disposed';
      }
      await inventoryItem.save();
    }

    const disposal = await Disposal.create({
      component,
      quantity,
      disposalType,
      notes,
      processedBy: req.user._id,
    });

    const populated = await disposal.populate([
      { path: 'component', select: 'componentName category condition' },
      { path: 'processedBy', select: 'name' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all disposals
// @route   GET /api/sales/disposals
// @access  Private
export const getDisposals = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Disposal.countDocuments();
    const disposals = await Disposal.find()
      .populate({
        path: 'component',
        select: 'componentName category condition',
      })
      .populate('processedBy', 'name')
      .sort({ disposalDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      disposals,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
