import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { StrictMode } from "react";
import StudentTable from "./Components/StudentTable/StudentTable";
import CreateStudent from "./Components/CreateStudent/CreateStudent";
import EditStudent from "./Components/EditStudent/EditStudent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Routes>
            <Route path="/" element={<StudentTable />}></Route>
            <Route path="student/create" element={<CreateStudent />}></Route>
            <Route path="student/edit/:id" element={<EditStudent />}></Route>
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="shadow-lg"
          />
        </div>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
