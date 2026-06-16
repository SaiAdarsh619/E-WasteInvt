import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchSales, fetchDisposals, createSale, createDisposal, clearSalesError } from './salesSlice';
import { fetchInventory } from '../inventory/inventorySlice';
import Header from '../../components/Header';
import { HiOutlineCurrencyDollar, HiOutlineTrash, HiOutlinePlus, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const SalesPage = () => {
  const dispatch = useDispatch();
  const { onMenuToggle } = useOutletContext();
  
  const { sales, disposals, loading, error } = useSelector((state) => state.sales);
  const { inventory } = useSelector((state) => state.inventory);
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('sales'); // 'sales' or 'disposals'

  // Modals
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isDisposalModalOpen, setIsDisposalModalOpen] = useState(false);

  const [saleForm, setSaleForm] = useState({ component: '', quantity: 1, salePrice: '', buyer: '' });
  const [disposalForm, setDisposalForm] = useState({ component: '', quantity: 1, disposalType: 'Recycled', notes: '' });

  useEffect(() => {
    if (activeTab === 'sales') {
      dispatch(fetchSales({ page: 1 }));
    } else {
      dispatch(fetchDisposals({ page: 1 }));
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearSalesError());
    }
  }, [error, dispatch]);

  const openSaleModal = () => {
    dispatch(fetchInventory({ limit: 100, status: 'Available' }));
    setIsSaleModalOpen(true);
  };

  const closeSaleModal = () => {
    setIsSaleModalOpen(false);
    setSaleForm({ component: '', quantity: 1, salePrice: '', buyer: '' });
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSale(saleForm)).then((res) => {
      if (!res.error) {
        toast.success('Sale recorded successfully');
        closeSaleModal();
      }
    });
  };

  const openDisposalModal = () => {
    dispatch(fetchInventory({ limit: 100, status: 'Available' }));
    setIsDisposalModalOpen(true);
  };

  const closeDisposalModal = () => {
    setIsDisposalModalOpen(false);
    setDisposalForm({ component: '', quantity: 1, disposalType: 'Recycled', notes: '' });
  };

  const handleDisposalSubmit = (e) => {
    e.preventDefault();
    dispatch(createDisposal(disposalForm)).then((res) => {
      if (!res.error) {
        toast.success('Disposal recorded successfully');
        closeDisposalModal();
      }
    });
  };

  return (
    <div>
      <Header title="Sales & Disposals" subtitle="Manage component sales and scrapped parts" onMenuToggle={onMenuToggle} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex bg-dark-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sales' ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Sales History
          </button>
          <button
            onClick={() => setActiveTab('disposals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'disposals' ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-400 hover:text-dark-200'
            }`}
          >
            Disposals
          </button>
        </div>

        {(userInfo.role === 'admin' || userInfo.role === 'inventory_manager') && (
          <div className="flex gap-3">
            <button onClick={openSaleModal} className="btn-primary flex items-center gap-2">
              <HiOutlineCurrencyDollar className="text-lg" /> Record Sale
            </button>
            <button onClick={openDisposalModal} className="btn-secondary flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
              <HiOutlineTrash className="text-lg" /> Dispose Items
            </button>
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'sales' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Component</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Sale Price (₹)</th>
                  <th>Total (₹)</th>
                  <th>Buyer</th>
                  <th>Processed By</th>
                </tr>
              </thead>
              <tbody>
                {loading && sales.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8"><div className="spinner mx-auto" /></td></tr>
                ) : sales.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-8 text-dark-400">No sales records found.</td></tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="text-xs text-dark-300">{new Date(sale.saleDate).toLocaleDateString()}</td>
                      <td className="font-medium text-dark-100">{sale.component?.componentName}</td>
                      <td>{sale.component?.category}</td>
                      <td className="font-bold">{sale.quantity}</td>
                      <td>₹{sale.salePrice.toLocaleString()}</td>
                      <td className="font-bold text-primary-400">₹{(sale.salePrice * sale.quantity).toLocaleString()}</td>
                      <td>{sale.buyer || 'N/A'}</td>
                      <td>{sale.processedBy?.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Component</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Processed By</th>
                </tr>
              </thead>
              <tbody>
                {loading && disposals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8"><div className="spinner mx-auto" /></td></tr>
                ) : disposals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-dark-400">No disposal records found.</td></tr>
                ) : (
                  disposals.map((disposal) => (
                    <tr key={disposal._id}>
                      <td className="text-xs text-dark-300">{new Date(disposal.disposalDate).toLocaleDateString()}</td>
                      <td className="font-medium text-dark-100">{disposal.component?.componentName}</td>
                      <td>{disposal.component?.category}</td>
                      <td className="font-bold">{disposal.quantity}</td>
                      <td>
                        <span className={`badge ${disposal.disposalType === 'Recycled' ? 'badge-green' : 'badge-red'}`}>
                          {disposal.disposalType}
                        </span>
                      </td>
                      <td className="text-xs max-w-xs truncate" title={disposal.notes}>{disposal.notes || 'N/A'}</td>
                      <td>{disposal.processedBy?.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Sale Modal */}
      {isSaleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-50">Record Sale</h2>
              <button onClick={closeSaleModal} className="text-dark-400 hover:text-dark-200">
                <HiOutlineXMark className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSaleSubmit} className="space-y-4">
              <div>
                <label className="form-label" htmlFor="sale-component">Select Inventory Item</label>
                <select
                  id="sale-component"
                  className="form-select"
                  value={saleForm.component}
                  onChange={(e) => setSaleForm({...saleForm, component: e.target.value})}
                  required
                >
                  <option value="">Select an available item...</option>
                  {inventory.map(item => (
                    <option key={item.component?._id} value={item.component?._id}>
                      {item.component?.componentName} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="sale-quantity">Quantity Sold</label>
                  <input
                    id="sale-quantity"
                    type="number"
                    min="1"
                    className="form-input"
                    value={saleForm.quantity}
                    onChange={(e) => setSaleForm({...saleForm, quantity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="sale-price">Price Per Unit (₹)</label>
                  <input
                    id="sale-price"
                    type="number"
                    min="0"
                    className="form-input"
                    value={saleForm.salePrice}
                    onChange={(e) => setSaleForm({...saleForm, salePrice: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="sale-buyer">Buyer Name/Company</label>
                <input
                  id="sale-buyer"
                  type="text"
                  className="form-input"
                  placeholder="Optional"
                  value={saleForm.buyer}
                  onChange={(e) => setSaleForm({...saleForm, buyer: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeSaleModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary flex items-center justify-center min-w-[120px]" disabled={loading}>
                  {loading ? <span className="spinner !w-5 !h-5 !border-2" /> : 'Confirm Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disposal Modal */}
      {isDisposalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-50">Record Disposal</h2>
              <button onClick={closeDisposalModal} className="text-dark-400 hover:text-dark-200">
                <HiOutlineXMark className="text-2xl" />
              </button>
            </div>
            <form onSubmit={handleDisposalSubmit} className="space-y-4">
              <div>
                <label className="form-label" htmlFor="disp-component">Select Inventory Item</label>
                <select
                  id="disp-component"
                  className="form-select"
                  value={disposalForm.component}
                  onChange={(e) => setDisposalForm({...disposalForm, component: e.target.value})}
                  required
                >
                  <option value="">Select an available item...</option>
                  {inventory.map(item => (
                    <option key={item.component?._id} value={item.component?._id}>
                      {item.component?.componentName} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="disp-quantity">Quantity Disposed</label>
                  <input
                    id="disp-quantity"
                    type="number"
                    min="1"
                    className="form-input"
                    value={disposalForm.quantity}
                    onChange={(e) => setDisposalForm({...disposalForm, quantity: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="disp-type">Disposal Type</label>
                  <select
                    id="disp-type"
                    className="form-select"
                    value={disposalForm.disposalType}
                    onChange={(e) => setDisposalForm({...disposalForm, disposalType: e.target.value})}
                    required
                  >
                    <option value="Recycled">Recycled</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="disp-notes">Notes</label>
                <textarea
                  id="disp-notes"
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Reason for disposal, certified recycler name, etc."
                  value={disposalForm.notes}
                  onChange={(e) => setDisposalForm({...disposalForm, notes: e.target.value})}
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeDisposalModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-danger flex items-center justify-center min-w-[120px]" disabled={loading}>
                  {loading ? <span className="spinner !w-5 !h-5 !border-2" /> : 'Confirm Disposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
