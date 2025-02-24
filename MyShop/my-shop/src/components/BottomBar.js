import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../components/Pic/AlhasaMunic.png';
import Instagram from '../components/Pic/Instagram.png';
import Snapchat from '../components/Pic/Snapchat.png';
import facebook from '../components/Pic/facebook.png';
import twitter from '../components/Pic/twitter.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLifeRing, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './BottomBar.css'; // تأكد من إضافة ملف CSS

const BottomBar = () => {
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setVisible(true);  // إظهار الشريط السفلي عند الوصول إلى نهاية الصفحة
    } else {
      setVisible(false); // إخفاء الشريط السفلي في غير ذلك
    }
  };

  const handleLinkClick = () => {
    window.location.href = ('https://www.alhasa.gov.sa/ar/Pages/default.aspx')
  };

  const handleInstagramClick = () => {
    window.location.href = ('https://www.instagram.com/alahsamun')
  };

  const handleSnapchatClick = () => {
    window.location.href = ('https://snapchat.com/add/alhasa.events')
  };
  
  const handleFacebookClick = () => {
    window.location.href = ('https://www.facebook.com/pages/Al-Hasa-Municipality/107067309377986')
  };

  const handleTwitterClick = () => {
    window.location.href = ('https://twitter.com/Alahsamun')
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar fixed="bottom" bg="transparent" variant="light" className={visible ? 'visible' : 'hidden'}>
      <Container dir="rtl">
      <div style={{ textAlign: 'center', color: 'black' }}>
        <div> <button className="nav-link active btn btn-link" onClick={handleLinkClick}><img src={logo} alt="ًصورة الامانه" width={85} /></button></div>
        <br/>
        <div>بوابة الأمانه</div>
      </div>
        <Nav className="justify-content-center" style={{ width: '100%' }}>
          
          <div style={{ textAlign: 'center', color: 'black' }}>
            <div>للتواصل مع الأمانة</div>
            <hr />
            <div><FontAwesomeIcon icon={faPhone} /> الهاتف : 0135825000</div>
            <br />
            <div><FontAwesomeIcon icon={faEnvelope} /> البريد الإليكتروني : info@alhasa.gov.sa</div>
            <br />
            <div><FontAwesomeIcon icon={faLifeRing} /> الطوارئ : 940</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <div> <button className="nav-link active btn btn-link" onClick={handleInstagramClick}><img src={Instagram} alt="انستقرام الامانه" width={40} /></button></div>
          <div> <button className="nav-link active btn btn-link" onClick={handleSnapchatClick}><img src={Snapchat} alt="سناب الامانه" width={40} /></button></div>
          <div> <button className="nav-link active btn btn-link" onClick={handleFacebookClick}><img src={facebook} alt="فيسبوك الامانه" width={40} /></button></div>
          <div> <button className="nav-link active btn btn-link" onClick={handleTwitterClick}><img src={twitter} alt="تويتر الامانه" width={40} /></button></div>
         </div>
          </div>
          <Nav.Link as={Link} to="/about"><FontAwesomeIcon icon={faInfoCircle} /> عن الموقع</Nav.Link>
          <Nav.Link as={Link} to=""></Nav.Link>



        </Nav>
      </Container>
    </Navbar>
  );
};

export default BottomBar;
