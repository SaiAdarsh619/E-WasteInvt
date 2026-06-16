import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Component from '../models/Component.js';
import Inventory from '../models/Inventory.js';
import Sale from '../models/Sale.js';
import Disposal from '../models/Disposal.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Device.deleteMany();
    await Component.deleteMany();
    await Inventory.deleteMany();
    await Sale.deleteMany();
    await Disposal.deleteMany();

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@ewaste.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Technician',
        email: 'tech@ewaste.com',
        password: 'password123',
        role: 'technician',
      },
      {
        name: 'Jane Manager',
        email: 'manager@ewaste.com',
        password: 'password123',
        role: 'inventory_manager',
      },
    ]);

    console.log('Users seeded');

    // Create devices
    const devices = await Device.create([
      {
        deviceType: 'Laptop',
        brand: 'Dell',
        model: 'Latitude 5520',
        serialNumber: 'DL-2024-001',
        source: 'Corporate IT Disposal - Infosys',
        arrivalDate: new Date('2026-01-15'),
        status: 'Dismantled',
        registeredBy: users[1]._id,
      },
      {
        deviceType: 'Desktop',
        brand: 'HP',
        model: 'ProDesk 400 G7',
        serialNumber: 'HP-2024-002',
        source: 'Government Office Surplus',
        arrivalDate: new Date('2026-02-10'),
        status: 'Completed',
        registeredBy: users[1]._id,
      },
      {
        deviceType: 'Mobile',
        brand: 'Samsung',
        model: 'Galaxy S21',
        serialNumber: 'SM-2024-003',
        source: 'Consumer Drop-off',
        arrivalDate: new Date('2026-03-05'),
        status: 'Processing',
        registeredBy: users[1]._id,
      },
      {
        deviceType: 'Monitor',
        brand: 'LG',
        model: '27UK850-W',
        serialNumber: 'LG-2024-004',
        source: 'School District Upgrade',
        arrivalDate: new Date('2026-03-20'),
        status: 'Received',
        registeredBy: users[0]._id,
      },
      {
        deviceType: 'Printer',
        brand: 'Canon',
        model: 'imageRUNNER C3226i',
        serialNumber: 'CN-2024-005',
        source: 'Office Renovation - TCS',
        arrivalDate: new Date('2026-04-01'),
        status: 'Received',
        registeredBy: users[1]._id,
      },
      {
        deviceType: 'Laptop',
        brand: 'Lenovo',
        model: 'ThinkPad T14',
        serialNumber: 'LN-2024-006',
        source: 'University Lab Clearout',
        arrivalDate: new Date('2026-04-15'),
        status: 'Dismantled',
        registeredBy: users[1]._id,
      },
      {
        deviceType: 'Server',
        brand: 'Dell',
        model: 'PowerEdge R740',
        serialNumber: 'DL-2024-007',
        source: 'Data Center Decommission',
        arrivalDate: new Date('2026-05-01'),
        status: 'Processing',
        registeredBy: users[0]._id,
      },
      {
        deviceType: 'Tablet',
        brand: 'Apple',
        model: 'iPad Air 4th Gen',
        serialNumber: 'AP-2024-008',
        source: 'Consumer Trade-in',
        arrivalDate: new Date('2026-05-10'),
        status: 'Received',
        registeredBy: users[1]._id,
      },
    ]);

    console.log('Devices seeded');

    // Create components extracted from devices
    const components = await Component.create([
      // From Dell Latitude
      { componentName: 'Intel i7-1165G7 CPU', parentDevice: devices[0]._id, quantity: 1, condition: 'Working', testingResult: 'Fully functional, passes stress test', category: 'CPU', extractedBy: users[1]._id },
      { componentName: '16GB DDR4 RAM', parentDevice: devices[0]._id, quantity: 2, condition: 'Working', testingResult: 'No errors in MemTest86', category: 'RAM', extractedBy: users[1]._id },
      { componentName: '512GB NVMe SSD', parentDevice: devices[0]._id, quantity: 1, condition: 'Working', testingResult: 'SMART status healthy, 95% life remaining', category: 'Storage', extractedBy: users[1]._id },
      { componentName: '14-inch FHD LCD Panel', parentDevice: devices[0]._id, quantity: 1, condition: 'Repairable', testingResult: 'Minor dead pixels in corner', category: 'Display', extractedBy: users[1]._id },
      { componentName: '65W Laptop Battery', parentDevice: devices[0]._id, quantity: 1, condition: 'Scrap', testingResult: 'Holds only 20% charge', category: 'Battery', extractedBy: users[1]._id },
      // From HP ProDesk
      { componentName: 'Intel i5-10500 CPU', parentDevice: devices[1]._id, quantity: 1, condition: 'Working', testingResult: 'Passes all benchmarks', category: 'CPU', extractedBy: users[1]._id },
      { componentName: '8GB DDR4 RAM', parentDevice: devices[1]._id, quantity: 2, condition: 'Working', testingResult: 'No issues detected', category: 'RAM', extractedBy: users[1]._id },
      { componentName: '256GB SATA SSD', parentDevice: devices[1]._id, quantity: 1, condition: 'Working', testingResult: 'SMART OK, 88% life', category: 'Storage', extractedBy: users[1]._id },
      { componentName: '300W PSU', parentDevice: devices[1]._id, quantity: 1, condition: 'Working', testingResult: 'Stable voltage output', category: 'Power Supply', extractedBy: users[1]._id },
      { componentName: 'HP Motherboard', parentDevice: devices[1]._id, quantity: 1, condition: 'Repairable', testingResult: 'One USB port non-functional', category: 'Motherboard', extractedBy: users[1]._id },
      // From Samsung Galaxy
      { componentName: 'AMOLED 6.2" Display', parentDevice: devices[2]._id, quantity: 1, condition: 'Working', testingResult: 'No burn-in, touch responsive', category: 'Display', extractedBy: users[1]._id },
      { componentName: '4000mAh Li-ion Battery', parentDevice: devices[2]._id, quantity: 1, condition: 'Repairable', testingResult: 'Holds 60% original capacity', category: 'Battery', extractedBy: users[1]._id },
      { componentName: '12MP Rear Camera Module', parentDevice: devices[2]._id, quantity: 1, condition: 'Working', testingResult: 'Focus and stabilization working', category: 'Camera', extractedBy: users[1]._id },
      // From Lenovo ThinkPad
      { componentName: 'AMD Ryzen 5 5600U CPU', parentDevice: devices[5]._id, quantity: 1, condition: 'Working', testingResult: 'Fully functional', category: 'CPU', extractedBy: users[1]._id },
      { componentName: '16GB DDR4 RAM', parentDevice: devices[5]._id, quantity: 1, condition: 'Working', testingResult: 'MemTest passed', category: 'RAM', extractedBy: users[1]._id },
      { componentName: '1TB NVMe SSD', parentDevice: devices[5]._id, quantity: 1, condition: 'Working', testingResult: 'Excellent health', category: 'Storage', extractedBy: users[1]._id },
      { componentName: 'Laptop Keyboard Module', parentDevice: devices[5]._id, quantity: 1, condition: 'Scrap', testingResult: 'Multiple keys non-responsive', category: 'Keyboard', extractedBy: users[1]._id },
      { componentName: 'Cooling Fan Assembly', parentDevice: devices[5]._id, quantity: 1, condition: 'Working', testingResult: 'Quiet operation, good airflow', category: 'Fan', extractedBy: users[1]._id },
    ]);

    console.log('Components seeded');

    // Create inventory items for working components
    const workingComponents = components.filter((c) => c.condition === 'Working');
    const inventoryItems = await Inventory.create(
      workingComponents.map((comp, i) => ({
        component: comp._id,
        quantity: comp.quantity,
        storageLocation: `Rack ${String.fromCharCode(65 + (i % 5))}-Shelf ${(i % 4) + 1}`,
        status: 'Available',
      }))
    );

    console.log('Inventory seeded');

    // Create some sales
    await Sale.create([
      {
        component: components[0]._id,
        quantity: 1,
        salePrice: 8500,
        buyer: 'PC Parts Hub',
        saleDate: new Date('2026-04-10'),
        processedBy: users[2]._id,
      },
      {
        component: components[6]._id,
        quantity: 1,
        salePrice: 1200,
        buyer: 'Student Buyer',
        saleDate: new Date('2026-04-20'),
        processedBy: users[2]._id,
      },
      {
        component: components[7]._id,
        quantity: 1,
        salePrice: 2500,
        buyer: 'Refurb Center',
        saleDate: new Date('2026-05-05'),
        processedBy: users[2]._id,
      },
    ]);

    console.log('Sales seeded');

    // Create disposals
    await Disposal.create([
      {
        component: components[4]._id,
        quantity: 1,
        disposalType: 'Recycled',
        notes: 'Battery sent to certified recycler',
        processedBy: users[2]._id,
      },
      {
        component: components[16]._id,
        quantity: 1,
        disposalType: 'Scrap',
        notes: 'Keyboard beyond repair, scrapped for materials',
        processedBy: users[2]._id,
      },
    ]);

    console.log('Disposals seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin:     admin@ewaste.com / password123');
    console.log('  Tech:      tech@ewaste.com / password123');
    console.log('  Manager:   manager@ewaste.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
