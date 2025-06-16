import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateStudent from "./Components/CreateStudent/CreateStudent";
import EditStudent from "./Components/EditStudent/EditStudent";
import StudentTable from "./Components/StudentTable/StudentTable";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/" element={<StudentTable />}></Route>
          <Route path="student/create" element={<CreateStudent />}></Route>
          <Route path="student/edit/:id" element={<EditStudent />}></Route>
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;