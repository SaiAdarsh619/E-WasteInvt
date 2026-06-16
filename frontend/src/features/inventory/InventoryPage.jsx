import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchInventory, stockIn, stockOut, clearInventoryError } from './inventorySlice';
import { fetchComponents } from '../components/componentSlice';
import Header from '../../components/Header';
import { HiOutlineArrowDownTray, HiOutlineArrowUpTray, HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const InventoryPage = () => {
  const dispatch = useDispatch();
  const { onMenuToggle } = useOutletContext();
  const { inventory, loading, error, total, page, pages } = useSelector((state) => state.inventory);
  const { components } = useSelector((state) => state.components);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

  // Form states
  const [stockInForm, setStockInForm] = useState({ component: '', quantity: 1, storageLocation: '' });
  const [stockOutForm, setStockOutForm] = useState({ quantity: 1 });

  useEffect(() => {
    dispatch(fetchInventory({ page: 1, search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearInventoryError());
    }
  }, [error, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchInventory({ page: newPage, search: searchTerm, status: statusFilter }));
  };

  const openStockInModal = () => {
    dispatch(fetchComponents({ limit: 100, condition: 'Working' })); // Only working components should be stocked typically
    setIsStockInModalOpen(true);
  };

  const closeStockInModal = () => {
    setIsStockInModalOpen(false);
    setStockInForm({ component: '', quantity: 1, storageLocation: '' });
  };

  const handleStockInSubmit = (e) => {
    e.preventDefault();
    dispatch(stockIn(stockInForm)).then((res) => {
      if (!res.error) {
        toast.success('Stock added successfully');
        closeStockInModal();
      }
    });
  };

  const openStockOutModal = (item) => {
    setSelectedInventoryItem(item);
    setStockOutForm({ quantity: 1 });
    setIsStockOutModalOpen(true);
  };

  const closeStockOutModal = () => {
    setIsStockOutModalOpen(false);
    setSelectedInventoryItem(null);
  };

  const handleStockOutSubmit = (e) => {
    e.preventDefault();
    dispatch(stockOut({ inventoryId: selectedInventoryItem._id, quantity: stockOutForm.quantity })).then((res) => {
      if (!res.error) {
        toast.success('Stock reduced successfully');
        closeStockOutModal();
      }
    });
  };

  const statusBadge = {
    Available: 'badge-green',
    Reserved: 'badge-yellow',
    Sold: 'badge-blue',
    Disposed: 'badge-gray',
  };

  return (
    <div>
      <Header title="Inventory" subtitle={`Total items tracked: ${total}`} onMenuToggle={onMenuToggle} />

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select sm:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>
          {(userInfo.role === 'admin' || userInfo.role === 'inventory_manager') && (
            <button onClick={openStockInModal} className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              <HiOutlineArrowDownTray /> Stock In
            </button>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Category</th>
                <th>Source Device</th>
                <th>Location</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && inventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <p>No inventory found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item._id}>
                    <td className="font-medium text-dark-100">{item.component?.componentName || 'Unknown Component'}</td>
                    <td>{item.component?.category || 'N/A'}</td>
                    <td>
                      {item.component?.parentDevice ? (
                        <>
                          <div className="font-mono text-xs text-primary-400">{item.component.parentDevice.deviceId}</div>
                        </>
                      ) : (
                        <span className="text-dark-500 text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="font-mono text-sm">{item.storageLocation}</td>
                    <td className="font-bold">{item.quantity}</td>
                    <td>
                      <span className={`badge ${statusBadge[item.status] || 'badge-gray'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {(userInfo.role === 'admin' || userInfo.role === 'inventory_manager') && item.status === 'Available' && item.quantity > 0 && (
                        <button
                          onClick={() => openStockOutModal(item)}
                          className="btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                        >
                          <HiOutlineArrowUpTray /> Stock Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm">
            <span className="text-dark-400">
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary px-3 py-1 text-xs"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary px-3 py-1 text-xs"
                disabled={page === pages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock In Modal */}
      {isStockInModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-50">Stock In</h2>
              <button onClick={closeStockInModal} className="text-dark-400 hover:text-dark-200">
                <HiOutlineXMark className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleStockInSubmit} className="space-y-4">
              <div>
                <label className="form-label" htmlFor="stockIn-component">Select Component</label>
                <select
                  id="stockIn-component"
                  className="form-select"
                  value={stockInForm.component}
                  onChange={(e) => setStockInForm({...stockInForm, component: e.target.value})}
                  required
                >
                  <option value="">Select a working component...</option>
                  {components.map(comp => (
                    <option key={comp._id} value={comp._id}>
                      {comp.componentName} (Extracted Qty: {comp.quantity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label" htmlFor="stockIn-quantity">Quantity</label>
                <input
                  id="stockIn-quantity"
                  type="number"
                  min="1"
                  className="form-input"
                  value={stockInForm.quantity}
                  onChange={(e) => setStockInForm({...stockInForm, quantity: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="stockIn-location">Storage Location</label>
                <input
                  id="stockIn-location"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rack A-12"
                  value={stockInForm.storageLocation}
                  onChange={(e) => setStockInForm({...stockInForm, storageLocation: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeStockInModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex items-center justify-center min-w-[120px]" disabled={loading}>
                  {loading ? <span className="spinner !w-5 !h-5 !border-2" /> : 'Confirm Stock In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Out Modal */}
      {isStockOutModalOpen && selectedInventoryItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-50">Stock Out</h2>
              <button onClick={closeStockOutModal} className="text-dark-400 hover:text-dark-200">
                <HiOutlineXMark className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleStockOutSubmit} className="space-y-4">
              <div className="p-3 bg-dark-800 rounded-lg mb-4">
                <p className="text-sm font-medium text-dark-100">{selectedInventoryItem.component?.componentName}</p>
                <p className="text-xs text-dark-400">Current available quantity: <span className="font-bold text-primary-400">{selectedInventoryItem.quantity}</span></p>
                <p className="text-xs text-dark-400">Location: {selectedInventoryItem.storageLocation}</p>
              </div>

              <div>
                <label className="form-label" htmlFor="stockOut-quantity">Quantity to Remove</label>
                <input
                  id="stockOut-quantity"
                  type="number"
                  min="1"
                  max={selectedInventoryItem.quantity}
                  className="form-input"
                  value={stockOutForm.quantity}
                  onChange={(e) => setStockOutForm({...stockOutForm, quantity: e.target.value})}
                  required
                />
                <p className="text-xs text-dark-500 mt-1">
                  Note: For direct sales/disposals, it's better to use the Sales module. This is for manual inventory corrections.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeStockOutModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex items-center justify-center min-w-[120px]" disabled={loading}>
                  {loading ? <span className="spinner !w-5 !h-5 !border-2" /> : 'Confirm Stock Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
