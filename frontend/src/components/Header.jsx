import { HiOutlineBars3 } from 'react-icons/hi2';

const Header = ({ title, subtitle, onMenuToggle }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-dark-200 transition-colors"
          id="mobile-menu-toggle"
        >
          <HiOutlineBars3 className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-dark-50">{title}</h1>
          {subtitle && <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
