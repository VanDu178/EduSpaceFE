import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route đăng nhập công khai */}
        <Route path="/login" element={<Login />} />
        
        {/* Route đăng ký công khai */}
        <Route path="/register" element={<Register />} />
        
        {/* Route quản trị được bảo vệ */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Redirect mặc định về /admin nếu gõ sai route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
