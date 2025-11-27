
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
import Signup from './pages/signup';
import StudentDashboard from './pages/StudentDashboard';
import LibrarianDashboard from './pages/LibrarianDashboard';
import BookDetails from './pages/BookDetails';
import Members from './pages/Members';
import BorrowForm from './pages/BorrowForm'; 
import StudentReturn from './pages/StudentReturn';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/login/student" element={<Layout><Login userType="student" /></Layout>} />
          <Route path="/login/librarian" element={<Layout><Login userType="librarian" /></Layout>} />
          <Route path="/signup/student" element={<Layout><Signup userType="student" /></Layout>} />
          <Route path="/signup/librarian" element={<Layout><Signup userType="librarian" /></Layout>} />
          
          {/* STUDENT ROUTES */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/book/:id" element={<BookDetails />} />
          <Route path="/student/borrow/:id" element={<BorrowForm />} />
          <Route path="/student/return" element={<StudentReturn />} />

          {/* LIBRARIAN ROUTES */}
          <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />
          <Route path="/librarian/members" element={<Members />} /> 
          
        </Routes>
    </Router>
  );
}

export default App;