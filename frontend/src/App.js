
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
import Landing from './pages/Landing';
import Login from './pages/login';
import Signup from './pages/signup'; // We will update this next
import StudentDashboard from './pages/StudentDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* LOGIN ROUTES */}
          <Route path="/login/student" element={<Login userType="student" />} />
          <Route path="/login/librarian" element={<Login userType="librarian" />} />

          {/* SIGNUP ROUTES (Distinct for each role) */}
          <Route path="/signup/student" element={<Signup userType="student" />} />
          <Route path="/signup/librarian" element={<Signup userType="librarian" />} />

          {/* DASHBOARDS */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;