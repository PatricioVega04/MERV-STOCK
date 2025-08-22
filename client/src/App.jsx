import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {AuthProvider} from "./context/AuthContext";
import TaskPage from "./pages/TaskPage";
import HomePage from "./pages/HomePage";
import TaskCreatePage from "./pages/TaskCreatePage";

import ProtectedRoute from "./ProtecteRoute";
import { TasksProvider } from "./context/TasksContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
     <TasksProvider>
       
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        <Route element={<ProtectedRoute />}>
           <Route path="/tasks" element={<TaskPage />} />
           <Route path="/add-task" element={<TaskCreatePage />} />
           <Route path="/tasks/:id" element={<TaskCreatePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
