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
import IssueReturn from './pages/IssueReturn';
import ManageCatalog from './pages/ManageCatalog';
import './App.css';
<<<<<<< HEAD

function App() {
    return (
        <Router>
            <Routes>
                {/* LOGIN - SIGNUP */}
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
                <Route path="/librarian/catalog" element={<ManageCatalog />} />
                <Route path="/librarian/issue-return" element={<IssueReturn />} />
                
            </Routes>
        </Router>
    );
=======
import RoleSelect from './pages/RoleSelect';
import MemberLogin from './pages/MemberLogin';
import MemberRegister from './pages/MemberRegister';
import LibrarianLogin from './pages/LibrarianLogin';
import LibrarianRegister from './pages/LibrarianRegister';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BorrowedBooks from './pages/BorrowedBooks';
import LibrarianHome from './pages/LibrarianHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/member-login" element={<MemberLogin />} />
        <Route path="/member-register" element={<MemberRegister />} />
        <Route path="/librarian-login" element={<LibrarianLogin />} />
        <Route path="/librarian-register" element={<LibrarianRegister />} />
        <Route path="/borrowed-books" element={<BorrowedBooks />} />
        <Route path="/librarian-home" element={<LibrarianHome />} />
      </Routes>
    </Router>
  );
>>>>>>> b9daade5e9291570267858c187b1b32302287f23
}

export default App;