import React from 'react';
import { FaHome, FaUsers, FaBook, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import logo from '../assets/logo.png';


const LibrarianSidebar = () => (
  <aside className="w-72 min-h-screen bg-white flex flex-col items-center py-6 px-4 border-r-4 border-[#8A5F0F] shadow-lg">
    <div className="flex flex-col items-center w-full mb-2">
      <div className="flex items-center gap-2 mb-2">
        <img src={logo} alt="Libyte Logo" style={{ width: '4.5rem', height: '4.5rem', objectFit: 'contain' }} />
        <span className="text-4xl font-extrabold tracking-tight" style={{ color: '#8A5F0F', letterSpacing: '-2px' }}>LIB</span>
        <span className="text-4xl font-extrabold tracking-tight text-black" style={{ letterSpacing: '-2px' }}>YTE</span>
      </div>
    </div>

    <div className="flex flex-col items-center w-full mb-2">
      <img src="https://i.imgur.com/1Q9Z1Zm.png" alt="Profile" className="w-20 h-20 rounded-full border-2 border-yellow-200 object-cover mb-2" />
      <h2 className="text-2xl font-semibold text-black mb-1">Kim Batumbakal</h2>
      <hr className="w-32 border-t border-gray-400 mb-2" />
    </div>

    <nav className="flex flex-col gap-2 w-full mt-2">
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full border-2 border-[#8A5F0F] text-[#8A5F0F] font-bold text-lg mb-1 bg-[#FAF6F0]">
        <FaHome className="text-2xl" /> Home
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaUsers className="text-2xl" /> Members
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaBook className="text-2xl" /> Manage Catalog
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaExchangeAlt className="text-2xl" /> Issue / Return
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#FAF6F0] text-[#8A5F0F] font-semibold text-lg">
        <FaChartLine className="text-2xl" /> Generate Report
      </a>
    </nav>
    <div className="flex-grow" />
    <div className="flex flex-col items-center w-full mt-8 mb-2">
      <button className="flex items-center justify-center w-10 h-10 rounded-full text-[#8A5F0F] hover:bg-[#FAF6F0]">
        <FaSignOutAlt className="text-2xl" />
      </button>
    </div>
    <div className="mt-2 text-xs text-gray-400 text-center">
      © 2025 Libyte<br />ver. 2.67.67
    </div>
  </aside>
);

export default LibrarianSidebar;
