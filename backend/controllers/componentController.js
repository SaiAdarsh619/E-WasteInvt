import Component from '../models/Component.js';
import Device from '../models/Device.js';

// @desc    Get all components
// @route   GET /api/components
// @access  Private
export const getComponents = async (req, res) => {
  try {
    const { condition, parentDevice, category, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (condition) query.condition = condition;
    if (parentDevice) query.parentDevice = parentDevice;
    if (category) query.category = category;
    if (search) {
      query.componentName = { $regex: search, $options: 'i' };
    }

    const total = await Component.countDocuments(query);
    const components = await Component.find(query)
      .populate('parentDevice', 'deviceId deviceType brand model')
      .populate('extractedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      components,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single component
// @route   GET /api/components/:id
// @access  Private
export const getComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
      .populate('parentDevice', 'deviceId deviceType brand model')
      .populate('extractedBy', 'name');

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json(component);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create component (extract from device)
// @route   POST /api/components
// @access  Private (Admin, Technician)
export const createComponent = async (req, res) => {
  try {
    const { parentDevice } = req.body;

    // Verify device exists
    const device = await Device.findById(parentDevice);
    if (!device) {
      return res.status(404).json({ message: 'Parent device not found' });
    }

    // Update device status to Processing if still Received
    if (device.status === 'Received') {
      device.status = 'Processing';
      await device.save();
    }

    const componentData = {
      ...req.body,
      extractedBy: req.user._id,
    };

    const component = await Component.create(componentData);
    const populated = await component.populate([
      { path: 'parentDevice', select: 'deviceId deviceType brand model' },
      { path: 'extractedBy', select: 'name' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update component
// @route   PUT /api/components/:id
// @access  Private (Admin, Technician)
export const updateComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const updatedComponent = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('parentDevice', 'deviceId deviceType brand model')
      .populate('extractedBy', 'name');

    res.json(updatedComponent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete component
// @route   DELETE /api/components/:id
// @access  Private (Admin)
export const deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    await Component.findByIdAndDelete(req.params.id);
    res.json({ message: 'Component removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
