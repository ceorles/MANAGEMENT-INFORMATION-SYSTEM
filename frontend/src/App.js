
import './App.css';

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/students/")
        .then(response => setStudents(response.data))
        .catch(error => console.log(error));
    }, []);

    return (
        <div>
        <h1>Students</h1>
        {students.map(student => (
            <p key={student.id}>
            {student.name} - Grade {student.grade}
            </p>
        ))}
        </div>
    );
}

export default App;
