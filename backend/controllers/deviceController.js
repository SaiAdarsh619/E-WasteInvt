import Device from '../models/Device.js';

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
export const getDevices = async (req, res) => {
  try {
    const { status, deviceType, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (deviceType) query.deviceType = deviceType;
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { deviceId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Device.countDocuments(query);
    const devices = await Device.find(query)
      .populate('registeredBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      devices,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single device
// @route   GET /api/devices/:id
// @access  Private
export const getDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id).populate('registeredBy', 'name email');

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create device
// @route   POST /api/devices
// @access  Private (Admin, Technician)
export const createDevice = async (req, res) => {
  try {
    const deviceData = {
      ...req.body,
      registeredBy: req.user._id,
    };

    const device = await Device.create(deviceData);
    const populated = await device.populate('registeredBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private (Admin, Technician)
export const updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('registeredBy', 'name email');

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private (Admin)
export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
