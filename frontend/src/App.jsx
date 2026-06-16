import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import DeviceListPage from './features/devices/DeviceListPage';
import DeviceFormPage from './features/devices/DeviceFormPage';
import ComponentListPage from './features/components/ComponentListPage';
import ComponentFormPage from './features/components/ComponentFormPage';
import InventoryPage from './features/inventory/InventoryPage';
import SalesPage from './features/sales/SalesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          
          {/* Devices */}
          <Route path="devices" element={<DeviceListPage />} />
          <Route path="devices/new" element={
            <ProtectedRoute roles={['admin', 'technician']}>
              <DeviceFormPage />
            </ProtectedRoute>
          } />
          <Route path="devices/:id/edit" element={
            <ProtectedRoute roles={['admin', 'technician']}>
              <DeviceFormPage />
            </ProtectedRoute>
          } />
          
          {/* Components */}
          <Route path="components" element={<ComponentListPage />} />
          <Route path="components/new" element={
            <ProtectedRoute roles={['admin', 'technician']}>
              <ComponentFormPage />
            </ProtectedRoute>
          } />
          <Route path="components/:id/edit" element={
            <ProtectedRoute roles={['admin', 'technician']}>
              <ComponentFormPage />
            </ProtectedRoute>
          } />
          
          {/* Inventory */}
          <Route path="inventory" element={<InventoryPage />} />
          
          {/* Sales & Disposals */}
          <Route path="sales" element={<SalesPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
