import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Account from './Pages/Account';
import Admin from './Pages/Admin'; 
import AdminRoute from './components/AdminRoute';
import Unauthorized from './components/Unauthorized';

import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import OrderStatus from './Pages/OrderStatus';
import Contact from './Pages/Contact';
import About from './Pages/About';

import NavBar from './components/NavBar';
import BottomBar from './components/BottomBar';
import { CartProvider } from './components/CartContext';
import { UserProvider } from './components/UserContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path='/' element={<ProductList />} />
            <Route path='/Admin' element={<Admin />} />
            <Route path="/admin" element={<AdminRoute element={<Admin />} />} />
            <Route path="/unauthorized" element={<Unauthorized />}/>
            <Route path='/المنتجات' element={<ProductList />} />
            <Route path='/products/:id' element={<ProductDetails />} />
            <Route path='/Cart' element={<Cart />} />
            <Route path='/Checkout' element={<Checkout />} />
            <Route path='/orders/:orderId/status' element={<OrderStatus />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/About' element={<About />} />
          </Routes>
          <hr/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <BottomBar />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
