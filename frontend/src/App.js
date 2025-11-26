
// import './App.css';

// import { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//     const [students, setStudents] = useState([]);

//     useEffect(() => {
//         axios.get("http://localhost:8000/api/students/")
//         .then(response => setStudents(response.data))
//         .catch(error => console.log(error));
//     }, []);

//     return (
//         <div>
//         <h1>Students</h1>
//         {students.map(student => (
//             <p key={student.id}>
//             {student.name} - Grade {student.grade}
//             </p>
//         ))}
//         </div>
//     );
// }

// export default App; 

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Login from './pages/login';
import Signup from './pages/signup';
import './App.css';

function App() {
  return (
    <Router>
      <Layout> {/* This wraps every page with the Navbar/CSS */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;