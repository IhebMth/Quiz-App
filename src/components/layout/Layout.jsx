// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../NavBar';
import Footer from '../Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-500 via-blue-300 to-green-300">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;