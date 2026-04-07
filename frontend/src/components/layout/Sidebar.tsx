import { NavLink } from 'react-router-dom';
import {
  RiHome5Line,
  RiFolder3Line,
  RiQuestionLine,
  RiFileList3Line,
} from 'react-icons/ri';

const menus = [
  { label: 'Dashboard', path: '/', icon: <RiHome5Line size={20} /> },
  { label: 'Kategori', path: '/categories', icon: <RiFolder3Line size={20} /> },
  { label: 'Bank Soal', path: '/questions', icon: <RiQuestionLine size={20} /> },
  { label: 'Ujian', path: '/exams', icon: <RiFileList3Line size={20} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 fixed top-16 left-0 bottom-0 flex flex-col py-4">
      <nav className="flex flex-col gap-1 px-3">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            {menu.icon}
            {menu.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;