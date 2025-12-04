import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import LibrarianSidebar from '../components/LibrarianSidebar';
import borrowImg from '../assets/borrow.png';
import returnImg from '../assets/return.png';
import totalBooksImg from '../assets/total-books.png';

const LibrarianHome = () => {
  return (
    <div className="flex min-h-screen font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Sidebar */}
      <LibrarianSidebar />

      {/* Main Content */}
      <main className="flex-1 bg-white p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-yellow-900">Latest Report</h1>
          <div className="relative w-80">
            <input type="text" placeholder="Search..." className="w-full border-2 border-yellow-800 rounded-full py-2 px-6 pl-10 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <span className="absolute left-3 top-2.5 text-yellow-800">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Borrow */}
            <div
              className="relative rounded-xl p-6 flex flex-col justify-center shadow-2xl bg-white/0"
              style={{
                background: `linear-gradient(90deg, #8A5F0D 70%, rgba(138,95,15,0.7) 100%)`,
                overflow: 'hidden',
                minHeight: '120px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              }}
          >
            <span className="text-2xl font-bold text-white mb-2">Newly Added Books</span>
            <span className="text-xl font-semibold text-white">10,067</span>
            <img
              src={borrowImg}
              alt="borrow"
              className="absolute right-4 bottom-4 w-24 h-20 opacity-20 pointer-events-none select-none"
              style={{zIndex: 0}}
            />
          </div>
          {/* Return */}
            <div
              className="relative rounded-xl p-6 flex flex-col justify-center shadow-2xl bg-white/0"
              style={{
                background: `linear-gradient(90deg, #8A5F0D 70%, rgba(138,95,15,0.7) 100%)`,
                overflow: 'hidden',
                minHeight: '120px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              }}
          >
            <span className="text-2xl font-bold text-white mb-2">Borrowed Books</span>
            <span className="text-xl font-semibold text-white">5,002</span>
            <img
              src={returnImg}
              alt="return"
              className="absolute right-4 bottom-4 w-24 h-20 opacity-20 pointer-events-none select-none"
              style={{zIndex: 0}}
            />
          </div>
          {/* Total Books */}
            <div
              className="relative rounded-xl p-6 flex flex-col justify-center shadow-2xl bg-white/0"
              style={{
                background: `linear-gradient(90deg, #8A5F0D 70%, rgba(138,95,15,0.7) 100%)`,
                overflow: 'hidden',
                minHeight: '120px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              }}
          >
            <span className="text-2xl font-bold text-white mb-2">Total Books</span>
            <span className="text-xl font-semibold text-white">20,302</span>
            <img
              src={totalBooksImg}
              alt="total books"
              className="absolute right-4 bottom-4 w-24 h-20 opacity-20 pointer-events-none select-none"
              style={{zIndex: 0}}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold text-yellow-900 mb-4">Top Borrowed Books</h2>
            <ol className="list-decimal ml-6 text-lg font-semibold text-gray-800">
              <li className="mb-2"><span className="font-bold text-yellow-900">Little Women</span></li>
              <li className="mb-2"><span className="font-bold text-yellow-900">Pride and Prejudice</span></li>
              <li><span className="font-bold text-yellow-900">And Then There Were None</span></li>
            </ol>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-center" style={{ minHeight: '300px' }}>
            <h2 className="text-xl font-bold text-yellow-900 mb-4">Monthly Borrowed Books</h2>
            <div className="w-full" style={{height: '220px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Jan', value: 3400 },
                    { month: 'Feb', value: 2200 },
                    { month: 'Mar', value: 1600 },
                    { month: 'Apr', value: 1200 },
                    { month: 'May', value: 3200 },
                    { month: 'Jun', value: 2300 },
                    { month: 'Jul', value: 4400 },
                    { month: 'Aug', value: 4500 },
                    { month: 'Sept', value: 5700 },
                    { month: 'Oct', value: 3200 },
                    { month: 'Nov', value: 4300 },
                    { month: 'Dec', value: 6700 },
                  ]}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} domain={[0, 7000]} tickCount={8} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8A5F0F"
                    strokeWidth={4}
                    dot={{ r: 4, stroke: '#8A5F0F', strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#8A5F0F', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-900 mb-4">Recent Issued</h2>
          <table className="w-full text-left border-t border-yellow-200">
            <thead>
              <tr className="text-yellow-900">
                <th className="py-2">Name</th>
                <th className="py-2">Book Name</th>
                <th className="py-2">D/ Issue</th>
                <th className="py-2">D/ Return</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="py-2">Jhon Jhon Wayne</td>
                <td>Harry Potter and Smeagol</td>
                <td>01-01-2025</td>
                <td>01-01-2010</td>
              </tr>
              <tr>
                <td className="py-2">Elvira Beng</td>
                <td>How to Cook a Duck</td>
                <td>02-02-2025</td>
                <td>02-02-2035</td>
              </tr>
              <tr>
                <td className="py-2">Neco Jico</td>
                <td>How to Ragebait someone</td>
                <td>02-03-2025</td>
                <td>02-02-2045</td>
              </tr>
              <tr>
                <td className="py-2">Kimmy David</td>
                <td>No Breaks</td>
                <td>03-02-2025</td>
                <td>02-06-2055</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default LibrarianHome;
