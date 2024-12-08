import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md relative">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Quiz App</h1>

        {/* Navigation Menu */}
        <ul className="flex items-center gap-6">
          {/* Languages Dropdown */}
          <li className="relative">
            <button
              onClick={handleDropdownToggle}
              className="flex items-center gap-1 hover:underline focus:outline-none"
            >
              Languages
              {isDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul
                className="absolute mt-2 bg-white text-black shadow-lg rounded-lg w-48 z-50"
                onMouseLeave={handleDropdownClose}
                onBlur={handleDropdownClose}
              >
                <li>
                  <Link
                    to="/drag-and-drop"
                    className="block px-4 py-2 hover:bg-blue-100 rounded-t-lg transition duration-300"
                    onClick={handleDropdownClose}
                  >
                    Drag and Drop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/fill-in-the-blanks"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleDropdownClose}
                  >
                    Fill in the Blanks
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gap-fill"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleDropdownClose}
                  >
                    Gap Fill
                  </Link>
                </li>
                <li>
                  <Link
                    to="/highlight"
                    className="block px-4 py-2 hover:bg-blue-100 transition duration-300"
                    onClick={handleDropdownClose}
                  >
                    Highlight
                  </Link>
                </li>
                <li>
                  <Link
                    to="/multiple-choice"
                    className="block px-4 py-2 hover:bg-blue-100 rounded-b-lg transition duration-300"
                    onClick={handleDropdownClose}
                  >
                    Multiple Choice
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* About Link */}
          <li>
            <Link
              to="/about"
              className="hover:underline hover:text-gray-200 px-4 py-2 transition duration-300"
            >
              About
            </Link>
          </li>

          {/* Contact Link */}
          <li>
            <Link
              to="/contact"
              className="hover:underline hover:text-gray-200 px-4 py-2 transition duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
