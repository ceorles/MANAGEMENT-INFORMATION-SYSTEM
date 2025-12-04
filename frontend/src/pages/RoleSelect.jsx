import React from "react";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";

const RoleSelect = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex overflow-hidden font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="hidden md:block w-1/2 h-full">
        <img
          src={require("../assets/books.png")}
          alt="Bookshelf"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full h-full p-8 bg-white">
        <img
          src={require("../assets/logo.png")}
          alt="Lib Logo"
            className="w-80 h-80 mb-[-70px] mt-[-130px] object-contain"
        />
        <div className="flex items-center mb-6">
          <span className="text-5xl font-extrabold text-yellow-800 tracking-tight mr-2">LIB</span>
          <span className="text-5xl font-extrabold text-black tracking-tight">YTE</span>
        </div>

        <h2 className="text-2xl font-extrabold text-black mb-2 text-center">Access Your Library.</h2>
        <p className="text-lg font-medium text-black mb-8 text-center">Please log in as:</p>
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <button
            className="flex items-center justify-center gap-3 bg-[#8A5F0F] hover:bg-yellow-900 text-white font-bold py-4 rounded-xl text-xl shadow-md transition duration-150 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            onClick={() => navigate('/member-login')}
          >
            <FaUserGraduate className="text-2xl" /> Student
          </button>
          <button
            className="flex items-center justify-center gap-3 bg-[#8A5F0F] hover:bg-yellow-900 text-white font-bold py-4 rounded-xl text-xl shadow-md transition duration-150 focus:outline-none focus:ring-4 focus:ring-yellow-300"
            onClick={() => navigate('/librarian-login')}
          >
            <FaUserTie className="text-2xl" /> Librarian
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
