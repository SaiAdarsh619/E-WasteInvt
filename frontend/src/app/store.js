import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import deviceReducer from '../features/devices/deviceSlice';
import componentReducer from '../features/components/componentSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import salesReducer from '../features/sales/salesSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    components: componentReducer,
    inventory: inventoryReducer,
    sales: salesReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
