import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, Link } from 'react-router-dom';
import { fetchDevices, deleteDevice, clearDeviceError } from './deviceSlice';
import Header from '../../components/Header';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const DeviceListPage = () => {
  const dispatch = useDispatch();
  const { onMenuToggle } = useOutletContext();
  const { devices, loading, error, total, page, pages } = useSelector((state) => state.devices);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchDevices({ page: 1, search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDeviceError());
    }
  }, [error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      dispatch(deleteDevice(id)).then((res) => {
        if (!res.error) toast.success('Device deleted successfully');
      });
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchDevices({ page: newPage, search: searchTerm, status: statusFilter }));
  };

  const statusBadge = {
    Received: 'badge-blue',
    Processing: 'badge-yellow',
    Dismantled: 'badge-cyan',
    Completed: 'badge-green',
  };

  return (
    <div>
      <Header title="Devices" subtitle={`Total: ${total} devices`} onMenuToggle={onMenuToggle} />

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                placeholder="Search devices..."
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
              <option value="Received">Received</option>
              <option value="Processing">Processing</option>
              <option value="Dismantled">Dismantled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {(userInfo.role === 'admin' || userInfo.role === 'technician') && (
            <Link to="/devices/new" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              <HiOutlinePlus /> Add Device
            </Link>
          )}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Brand / Model</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Registered By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && devices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <p>No devices found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device._id}>
                    <td className="font-mono text-xs text-primary-400">{device.deviceId}</td>
                    <td>{device.deviceType}</td>
                    <td>
                      <div className="font-medium text-dark-100">{device.brand}</div>
                      <div className="text-xs text-dark-400">{device.model}</div>
                    </td>
                    <td className="font-mono text-xs text-dark-400">{device.serialNumber || 'N/A'}</td>
                    <td>
                      <span className={`badge ${statusBadge[device.status] || 'badge-gray'}`}>
                        {device.status}
                      </span>
                    </td>
                    <td>{device.registeredBy?.name || 'Unknown'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {(userInfo.role === 'admin' || userInfo.role === 'technician') && (
                          <Link
                            to={`/devices/${device._id}/edit`}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </Link>
                        )}
                        {userInfo.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(device._id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        )}
                      </div>
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
    </div>
  );
};

export default DeviceListPage;
