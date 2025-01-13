import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Home,
  Languages,
  Info,
  Mail,
  BookOpen
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'Drag and Drop', path: '/drag-and-drop' },
    { name: 'Fill in the Blanks', path: '/fill-in-the-blanks' },
    { name: 'Gap Fill', path: '/gap-fill' },
    { name: 'Highlight', path: '/highlight' },
    { name: 'Click To Change', path: '/click-to-change' },
    { name: 'Single Answer', path: '/single-answer' },
    { name: 'Multiple Answers', path: '/multiple-answers' },
    { name: 'Sequencing', path: '/sequencing' },
    { name: 'Organize Information', path: '/organize-information-by-topic' }
  ];

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Languages', path: '#', icon: Languages, hasDropdown: true },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  return (
    <div>
      {/* Top White Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <a 
              href="https://english2master.com" 
              className="text-gray-800 hover:text-gray-900 text-lg font-extrabold tracking-tight"
              target="_blank"
              rel="noopener noreferrer"
            >
              English2Master.com
            </a>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-md transition duration-150">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Blue Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-white hover:text-blue-100">
                <Logo />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 text-white hover:text-blue-100 transition duration-150"
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                      {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                        {menuItems.map((menuItem, idx) => (
                          <Link
                            key={idx}
                            to={menuItem.path}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <BookOpen size={16} />
                            <span>{menuItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center space-x-2 text-white hover:text-blue-100 transition duration-150"
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-blue-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-700 shadow-inner">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div key={index} className="space-y-1">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isDropdownOpen && (
                      <div className="pl-4 space-y-1">
                        {menuItems.map((menuItem, idx) => (
                          <Link
                            key={idx}
                            to={menuItem.path}
                            className="flex items-center space-x-2 px-3 py-2 text-blue-100 hover:bg-blue-800 rounded-md text-sm"
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <BookOpen size={16} />
                            <span>{menuItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-blue-800 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;