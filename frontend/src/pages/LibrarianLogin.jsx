import React from "react";
import { useNavigate } from "react-router-dom";
import bookMember from "../assets/book-member.jpg";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

const LibrarianLogin = () => {
  const navigate = useNavigate();
  // Handler for form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // On successful login, redirect to librarian home page
    navigate('/librarian-home');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-gradient-to-br from-yellow-50 to-gray-100" style={{ fontFamily: 'Poppins, sans-serif', height: '100vh' }}>
      <div className="flex flex-col items-center w-full max-w-5xl px-4 py-8">
        <div className="w-full flex flex-row rounded-2xl border border-yellow-100 bg-white shadow-2xl overflow-hidden h-[680px]">
          <div className="hidden md:flex items-center justify-center bg-transparent p-0 w-1/2 h-full">
            <img src={bookMember} alt="Book Member" className="object-cover h-full w-full scale-x-[-1]" />
          </div>
          <div className="flex-1 flex flex-col justify-center px-10 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
            <h2 className="text-3xl font-bold text-center mb-2 mt-2">Log In as Librarian</h2>
            <p className="text-md text-gray-500 text-center mb-10">Enter your credentials to access the librarian dashboard.</p>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-base font-semibold mb-2" htmlFor="username">Username or Email:</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your Username"
                  className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base"
                />
              </div>
              <div>
                <label className="block text-base font-semibold mb-2" htmlFor="password">Password:</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs font-medium text-gray-700">
                  <input type="checkbox" className="mr-2 accent-yellow-800" />
                  Remember me?
                </label>
                <button type="button" className="text-xs font-medium text-blue hover:underline">Forgot Password?</button>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-800 hover:bg-yellow-900 text-white font-bold py-3 rounded-lg text-lg transition shadow-md mt-2 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              >
                Log In
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="text-base font-medium text-black">Don't have Account?</span>
              <button
                className="text-blue-600 font-semibold text-base px-0 py-0 rounded hover:underline focus:outline-none bg-transparent shadow-none border-none"
                type="button"
                onClick={() => navigate('/librarian-register')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianLogin;
