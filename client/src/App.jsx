import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtecteRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ConfirmationPage from './pages/ConfirmationPage';
import VerifyEmailPage from './pages/VerifyEmailPage';


function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <BrowserRouter>
          <main>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/confirm/:token" element={<ConfirmationPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/add-product" element={<ProductFormPage />} />
                <Route path="/products/:id" element={<ProductFormPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;