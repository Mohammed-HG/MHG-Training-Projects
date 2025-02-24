import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AppointmentForm from './components/AppointmentForm';
import AdminDashboard from './components/AdminDashboard';
import BottomBar from './components/BottomBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import UserAppointments from './components/UserAppointments';
import Account from './components/Account';
import About from './components/About';

const App = () => (

  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/appointment" element={<AppointmentForm />} />
      <Route path='/user-appointments' element={<UserAppointments />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path='/account/me/info' element={<Account />} />
      <Route path='/about' element={<About />} />
    </Routes>
    <BottomBar />
  </Router>

);

export default App;
