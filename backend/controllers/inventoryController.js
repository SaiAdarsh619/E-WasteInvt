import Inventory from '../models/Inventory.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export const getInventory = async (req, res) => {
  try {
    const { status, search, storageLocation, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (storageLocation) query.storageLocation = { $regex: storageLocation, $options: 'i' };

    const total = await Inventory.countDocuments(query);

    let inventoryQuery = Inventory.find(query)
      .populate({
        path: 'component',
        select: 'componentName category condition parentDevice',
        populate: {
          path: 'parentDevice',
          select: 'deviceId brand model',
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const inventory = await inventoryQuery;

    // Apply search filter after populate (searches component name)
    let filteredInventory = inventory;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filteredInventory = inventory.filter(
        (item) =>
          item.component &&
          (searchRegex.test(item.component.componentName) ||
            searchRegex.test(item.component.category))
      );
    }

    res.json({
      inventory: filteredInventory,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stock In - Add item to inventory
// @route   POST /api/inventory/stock-in
// @access  Private (Admin, Inventory Manager)
export const stockIn = async (req, res) => {
  try {
    const { component, quantity, storageLocation } = req.body;

    // Check if component already exists in inventory
    let inventoryItem = await Inventory.findOne({ component, status: 'Available' });

    if (inventoryItem) {
      inventoryItem.quantity += Number(quantity);
      if (storageLocation) inventoryItem.storageLocation = storageLocation;
      await inventoryItem.save();
    } else {
      inventoryItem = await Inventory.create({
        component,
        quantity: Number(quantity),
        storageLocation,
        status: 'Available',
      });
    }

    const populated = await inventoryItem.populate({
      path: 'component',
      select: 'componentName category condition parentDevice',
      populate: {
        path: 'parentDevice',
        select: 'deviceId brand model',
      },
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stock Out - Remove item from inventory
// @route   POST /api/inventory/stock-out
// @access  Private (Admin, Inventory Manager)
export const stockOut = async (req, res) => {
  try {
    const { inventoryId, quantity } = req.body;

    const inventoryItem = await Inventory.findById(inventoryId);

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock quantity' });
    }

    inventoryItem.quantity -= Number(quantity);

    if (inventoryItem.quantity === 0) {
      inventoryItem.status = 'Sold';
    }

    await inventoryItem.save();

    const populated = await inventoryItem.populate({
      path: 'component',
      select: 'componentName category condition parentDevice',
      populate: {
        path: 'parentDevice',
        select: 'deviceId brand model',
      },
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin, Inventory Manager)
export const updateInventory = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'component',
      select: 'componentName category condition parentDevice',
      populate: {
        path: 'parentDevice',
        select: 'deviceId brand model',
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
