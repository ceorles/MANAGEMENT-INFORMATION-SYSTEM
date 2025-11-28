
import './App.css';
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
}

export default App;
