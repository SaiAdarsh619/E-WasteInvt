import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import {
  HiOutlineHome,
  HiOutlineDeviceTablet,
  HiOutlineCube,
  HiOutlineArchiveBox,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
} from 'react-icons/hi2';
import { IoLeafOutline } from 'react-icons/io5';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const links = [
    { to: '/', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/devices', icon: HiOutlineDeviceTablet, label: 'Devices' },
    { to: '/components', icon: HiOutlineCube, label: 'Components' },
    { to: '/inventory', icon: HiOutlineArchiveBox, label: 'Inventory' },
    { to: '/sales', icon: HiOutlineCurrencyDollar, label: 'Sales & Disposal' },
  ];

  const roleLabel = {
    admin: 'Administrator',
    technician: 'Technician',
    inventory_manager: 'Inventory Manager',
  };

  const roleBadgeClass = {
    admin: 'badge-purple',
    technician: 'badge-blue',
    inventory_manager: 'badge-cyan',
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          w-64 bg-dark-900/95 backdrop-blur-xl border-r border-white/5
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
            <IoLeafOutline className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-base font-bold gradient-text">E-Waste</h1>
            <p className="text-[0.65rem] text-dark-500 tracking-wider uppercase">Salvage Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 ${isActive ? 'active' : 'text-dark-400 hover:text-dark-200'}`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent flex items-center justify-center">
              <HiOutlineUser className="text-white text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-200 truncate">
                {userInfo?.name}
              </p>
              <span className={`badge text-[0.6rem] ${roleBadgeClass[userInfo?.role] || 'badge-gray'}`}>
                {roleLabel[userInfo?.role] || userInfo?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-dark-500
                       hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <HiOutlineArrowRightOnRectangle className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
