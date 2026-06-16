import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, Link } from 'react-router-dom';
import { fetchComponents, deleteComponent, clearComponentError } from './componentSlice';
import Header from '../../components/Header';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ComponentListPage = () => {
  const dispatch = useDispatch();
  const { onMenuToggle } = useOutletContext();
  const { components, loading, error, total, page, pages } = useSelector((state) => state.components);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  useEffect(() => {
    dispatch(fetchComponents({ page: 1, search: searchTerm, condition: conditionFilter }));
  }, [dispatch, searchTerm, conditionFilter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearComponentError());
    }
  }, [error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      dispatch(deleteComponent(id)).then((res) => {
        if (!res.error) toast.success('Component deleted successfully');
      });
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchComponents({ page: newPage, search: searchTerm, condition: conditionFilter }));
  };

  const conditionBadge = {
    Working: 'badge-green',
    Repairable: 'badge-yellow',
    Scrap: 'badge-red',
  };

  return (
    <div>
      <Header title="Components" subtitle={`Total: ${total} components extracted`} onMenuToggle={onMenuToggle} />

      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="text"
                placeholder="Search components..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select sm:w-48"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="">All Conditions</option>
              <option value="Working">Working</option>
              <option value="Repairable">Repairable</option>
              <option value="Scrap">Scrap</option>
            </select>
          </div>
          {(userInfo.role === 'admin' || userInfo.role === 'technician') && (
            <Link to="/components/new" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              <HiOutlinePlus /> Extract Component
            </Link>
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
                <th>Qty</th>
                <th>Condition</th>
                <th>Extracted By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && components.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <p>No components found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                components.map((comp) => (
                  <tr key={comp._id}>
                    <td className="font-medium text-dark-100">{comp.componentName}</td>
                    <td>{comp.category}</td>
                    <td>
                      {comp.parentDevice ? (
                        <>
                          <div className="font-mono text-xs text-primary-400">{comp.parentDevice.deviceId}</div>
                          <div className="text-xs text-dark-400">{comp.parentDevice.brand} {comp.parentDevice.model}</div>
                        </>
                      ) : (
                        <span className="text-dark-500 text-xs italic">Device deleted</span>
                      )}
                    </td>
                    <td>{comp.quantity}</td>
                    <td>
                      <span className={`badge ${conditionBadge[comp.condition] || 'badge-gray'}`}>
                        {comp.condition}
                      </span>
                    </td>
                    <td>{comp.extractedBy?.name || 'Unknown'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {(userInfo.role === 'admin' || userInfo.role === 'technician') && (
                          <Link
                            to={`/components/${comp._id}/edit`}
                            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                            title="Edit"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </Link>
                        )}
                        {userInfo.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(comp._id)}
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

export default ComponentListPage;
