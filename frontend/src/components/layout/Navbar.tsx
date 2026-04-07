import { RiBookOpenLine } from 'react-icons/ri';

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-2 text-blue-600">
        <RiBookOpenLine size={24} />
        <span className="font-bold text-lg text-gray-800">Bank Soal</span>
      </div>
    </header>
  );
};

export default Navbar;