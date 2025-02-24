import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // تأكد من استيراد ملف CSS
import logo from './Pic/AlhasaMunic.png';

const Home = () => (
  <div className="home-container" dir="rtl">
    <header className="home-header">
      <div className="logo">
        <img src={logo} alt="شعار الأمانة" />
      </div>
      <h1 className="main-title">نظام حجز المواعيد</h1>
      <br />
      <p>لعرض او حجز موعد يجب تسجيل الدخول</p>
    </header>  
    <home-container>
    <main className="home-content">
      <div className="buttons">
      <button className="btn btn-outline-light"><Link to="/login" className="btn">تسجيل الدخول</Link></button>
      <button className="btn btn-outline-light"><Link to="/register" className="btn">إنشاء حساب</Link></button>  
      </div>
    </main>
    </home-container>
  </div>
);

export default Home;
