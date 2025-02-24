import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginAdmin from'./Pages/LoginAdmin';
import AddViolation from './Pages/AddViolation';
import EditViolation from './Pages/EditViolation';
import AdminViolations from './Pages/AdminViolations';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Violations from './Pages/Violations';
import NavBar from './components/NavBar';
import BottomBar from './components/BottomBar';
import Account from './components/Account';
import HomePage from './Pages/HomePage';
import About from './Pages/About';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/account' element={<Account />} />
        <Route path='/admin/Add-Violation' element={<AddViolation />} />
        <Route path="/admin/violations/edit/:id" element={<EditViolation />} />    
        <Route path="/admin/Violations" element={<AdminViolations />} />
        <Route path='/register' element={<Register />} />
        <Route path='about' element={<About />} />
        <Route path="/violations" element={<Violations />} />
      </Routes>
      <BottomBar />
    </Router>
  );
}

export default App;
