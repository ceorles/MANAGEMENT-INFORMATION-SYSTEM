import React from "react";
import bookMember from "../assets/book-member.jpg";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";

const MemberRegister = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-sans bg-gradient-to-br from-yellow-50 to-gray-100" style={{ fontFamily: 'Poppins, sans-serif', height: '100vh' }}>
      <div className="flex flex-col items-center w-full max-w-6xl px-4 py-8">
        <div className="w-full flex flex-row rounded-2xl border border-yellow-100 bg-white shadow-2xl overflow-hidden h-[680px]">
          <div className="flex-1 flex flex-col justify-center px-8 py-2 md:px-10 md:py-4 lg:px-12 lg:py-6">
            <h2 className="text-3xl font-bold text-center mb-10 mt-2">Step into your space. Register with Libyte today.</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
              <div className="col-span-1">
                <label className="block text-base font-semibold mb-1" htmlFor="name">Name:</label>
                <input id="name" type="text" placeholder="Enter your Name" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
              </div>
              <div className="col-span-1">
                <label className="block text-base font-semibold mb-1" htmlFor="email">Email:</label>
                <input id="email" type="email" placeholder="Enter your Email" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
              </div>

              <div className="col-span-1">
                <label className="block text-base font-semibold mb-1" htmlFor="studentId">Student ID:</label>
                <input id="studentId" type="text" placeholder="Enter your student ID" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
              </div>

              <div className="col-span-1">
                <label className="block text-base font-semibold mb-1" htmlFor="contact">Contact Number:</label>
                <input id="contact" type="text" placeholder="+639 000 000 0000" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col items-center">
                <label className="block text-base font-semibold mb-1">Sex:</label>
                <div className="flex gap-6 mt-1 justify-center">
                  <label className="flex items-center text-base font-medium">
                    <input type="radio" name="sex" value="female" className="mr-2 accent-yellow-800" />
                    Female
                  </label>
                  <label className="flex items-center text-base font-medium">
                    <input type="radio" name="sex" value="male" className="mr-2 accent-yellow-800" />
                    Male
                  </label>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full mt-2">
                <div>
                  <label className="block text-base font-semibold mb-1" htmlFor="password">Password:</label>
                  <input id="password" type="password" placeholder="Password" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
                </div>
                <div>
                  <label className="block text-base font-semibold mb-1" htmlFor="confirmPassword">Confirm Password:</label>
                  <input id="confirmPassword" type="password" placeholder="Confirm Password" className="w-full border-2 border-yellow-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base" />
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-4">
                <button type="submit" className="w-64 bg-yellow-800 hover:bg-yellow-900 text-white font-bold py-3 rounded-lg text-lg transition shadow-md focus:outline-none focus:ring-4 focus:ring-yellow-300">Sign Up</button>
                
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className="text-base font-medium text-black">If you have an account?</span>
                  <button
                    type="button"
                    className="text-blue-600 font-semibold text-base px-0 py-0 rounded hover:underline focus:outline-none bg-transparent shadow-none border-none"
                    onClick={() => window.location.href = '/member-login'}
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="hidden md:flex items-center justify-center bg-transparent p-0 w-1/2 h-full">
            <img src={bookMember} alt="Book Member" className="object-cover h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegister;
