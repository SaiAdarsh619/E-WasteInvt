import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link, useOutletContext } from 'react-router-dom';
import { createDevice, updateDevice, clearDeviceError } from './deviceSlice';
import Header from '../../components/Header';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const DeviceFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onMenuToggle } = useOutletContext();
  const { loading, error } = useSelector((state) => state.devices);

  const [formData, setFormData] = useState({
    deviceType: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    source: '',
    status: 'Received',
    notes: '',
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchDevice = async () => {
        try {
          const { data } = await API.get(`/devices/${id}`);
          setFormData({
            deviceType: data.deviceType,
            brand: data.brand,
            model: data.model,
            serialNumber: data.serialNumber || '',
            source: data.source,
            status: data.status,
            notes: data.notes || '',
          });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load device details');
          navigate('/devices');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchDevice();
    }
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDeviceError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      dispatch(updateDevice({ id, deviceData: formData })).then((res) => {
        if (!res.error) {
          toast.success('Device updated successfully');
          navigate('/devices');
        }
      });
    } else {
      dispatch(createDevice(formData)).then((res) => {
        if (!res.error) {
          toast.success('Device created successfully');
          navigate('/devices');
        }
      });
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center mt-20"><div className="spinner" /></div>;
  }

  return (
    <div>
      <Header
        title={isEditMode ? 'Edit Device' : 'Add New Device'}
        subtitle="Manage device information"
        onMenuToggle={onMenuToggle}
      />

      <div className="mb-6">
        <Link to="/devices" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors text-sm font-medium">
          <HiOutlineArrowLeft /> Back to Devices
        </Link>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label" htmlFor="deviceType">Device Type</label>
              <select
                id="deviceType"
                name="deviceType"
                className="form-select"
                value={formData.deviceType}
                onChange={handleChange}
                required
              >
                {['Laptop', 'Desktop', 'Mobile', 'Printer', 'Monitor', 'Tablet', 'Server', 'Other'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Received">Received</option>
                <option value="Processing">Processing</option>
                <option value="Dismantled">Dismantled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                type="text"
                className="form-input"
                placeholder="e.g., Dell, Apple"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="model">Model</label>
              <input
                id="model"
                name="model"
                type="text"
                className="form-input"
                placeholder="e.g., XPS 13, iPhone 12"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="serialNumber">Serial Number</label>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                className="form-input"
                placeholder="Optional"
                value={formData.serialNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="source">Source / Origin</label>
              <input
                id="source"
                name="source"
                type="text"
                className="form-input"
                placeholder="Where did this come from?"
                value={formData.source}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="form-input resize-none"
              placeholder="Any visible damage or specific observations..."
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Link to="/devices" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary min-w-[120px]" disabled={loading}>
              {loading ? <span className="spinner !w-5 !h-5 !border-2 mx-auto" /> : isEditMode ? 'Update Device' : 'Save Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceFormPage;
