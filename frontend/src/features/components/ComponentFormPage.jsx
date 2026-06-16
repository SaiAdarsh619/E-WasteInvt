import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link, useOutletContext } from 'react-router-dom';
import { createComponent, updateComponent, clearComponentError } from './componentSlice';
import { fetchDevices } from '../devices/deviceSlice';
import Header from '../../components/Header';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const ComponentFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onMenuToggle } = useOutletContext();
  
  const { loading: compLoading, error } = useSelector((state) => state.components);
  const { devices, loading: devLoading } = useSelector((state) => state.devices);

  const [formData, setFormData] = useState({
    componentName: '',
    parentDevice: '',
    quantity: 1,
    condition: 'Working',
    category: 'Other',
    testingResult: '',
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    dispatch(fetchDevices({ limit: 100 })); // Fetch enough devices for the dropdown
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      const fetchComp = async () => {
        try {
          const { data } = await API.get(`/components/${id}`);
          setFormData({
            componentName: data.componentName,
            parentDevice: data.parentDevice?._id || '',
            quantity: data.quantity,
            condition: data.condition,
            category: data.category,
            testingResult: data.testingResult || '',
          });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load component details');
          navigate('/components');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchComp();
    }
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearComponentError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      dispatch(updateComponent({ id, compData: formData })).then((res) => {
        if (!res.error) {
          toast.success('Component updated successfully');
          navigate('/components');
        }
      });
    } else {
      dispatch(createComponent(formData)).then((res) => {
        if (!res.error) {
          toast.success('Component extracted successfully');
          navigate('/components');
        }
      });
    }
  };

  if (initialLoading || devLoading) {
    return <div className="flex justify-center mt-20"><div className="spinner" /></div>;
  }

  return (
    <div>
      <Header
        title={isEditMode ? 'Edit Component' : 'Extract New Component'}
        subtitle="Manage extracted parts and conditions"
        onMenuToggle={onMenuToggle}
      />

      <div className="mb-6">
        <Link to="/components" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors text-sm font-medium">
          <HiOutlineArrowLeft /> Back to Components
        </Link>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label" htmlFor="parentDevice">Source Device</label>
              <select
                id="parentDevice"
                name="parentDevice"
                className="form-select"
                value={formData.parentDevice}
                onChange={handleChange}
                required
                disabled={isEditMode}
              >
                <option value="">Select a device...</option>
                {devices.map(device => (
                  <option key={device._id} value={device._id}>
                    {device.deviceId} - {device.brand} {device.model} ({device.status})
                  </option>
                ))}
              </select>
              {!isEditMode && <p className="text-xs text-dark-500 mt-1">Extracting a component will auto-update the device status to Processing.</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="componentName">Component Name</label>
              <input
                id="componentName"
                name="componentName"
                type="text"
                className="form-input"
                placeholder="e.g., 16GB DDR4 RAM, 1TB NVMe SSD"
                value={formData.componentName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {['CPU', 'RAM', 'Storage', 'Display', 'Battery', 'Motherboard', 'Power Supply', 'Fan', 'Cable', 'Casing', 'Keyboard', 'Touchpad', 'Camera', 'Speaker', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                className="form-select"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="Working">Working</option>
                <option value="Repairable">Repairable</option>
                <option value="Scrap">Scrap</option>
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="testingResult">Testing Results / Observations</label>
            <textarea
              id="testingResult"
              name="testingResult"
              rows="3"
              className="form-input resize-none"
              placeholder="Record any benchmark results, physical damage, or test outcomes..."
              value={formData.testingResult}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Link to="/components" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary min-w-[150px]" disabled={compLoading}>
              {compLoading ? <span className="spinner !w-5 !h-5 !border-2 mx-auto" /> : isEditMode ? 'Update Component' : 'Extract Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentFormPage;
