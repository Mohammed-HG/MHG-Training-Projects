import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import MessageModal from './MessageModal';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from './Logout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faInfoCircle, faTable, faPhone, faUser, faSignOutAlt, faListUl, faList } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogoutClick = (e) => {
    e.preventDefault();
    handleLogout(navigate, setModalShow, setModalTitle, setModalMessage, setUser);
  };

  const handleCartClick = () => {
    navigate('/Cart');
  };

  const handleAboutClick = () => {
    navigate('/About');
  };

  const handleProductClick = () => {
    navigate('/المنتجات');
  };

  const handleContactClick = () => {
    navigate('/Contact');
  };

  const handleAccountClick = () => {
    navigate('/Account');
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleRegisterClick = () => {
    navigate('/Register');
  };

  const handleOrderStatusClick = () => {
    navigate('/orders/:orderId/status');
  };

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">متجر الأسر المنتجة</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link active btn btn-link" onClick={handleCartClick}>
                <FontAwesomeIcon icon={faShoppingCart} /> Cart
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleProductClick}>
                <FontAwesomeIcon icon={faTable} /> المنتجات
              </button>
            </li>
            <li className="nav-item dropdown">
              <button className="nav-link btn btn-link dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <FontAwesomeIcon icon={faListUl} />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                {user ? (
                  <>
                    <li><button className="dropdown-item" onClick={handleAccountClick}> <FontAwesomeIcon icon={faUser} /> معلومات الحساب</button></li>
                    <li><button className="dropdown-item" onClick={handleOrderStatusClick}> <FontAwesomeIcon icon={faList} />حالة الطلبات</button></li>
                    <li><button className="dropdown-item" onClick={handleLogoutClick}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                    </li>                                        
                    <li><button className="dropdown-item" onClick={handleContactClick}>
                      <FontAwesomeIcon icon={faPhone} /> Contact as
                    </button>
                    </li>
                    <li><button className="dropdown-item" onClick={handleAboutClick}>
                      <FontAwesomeIcon icon={faInfoCircle} /> About
                    </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><button className="dropdown-item" onClick={handleLoginClick}>تسجيل الدخول</button></li>
                    <li><button className="dropdown-item" onClick={handleRegisterClick}>تسجيل</button></li>
                    <li><button className="dropdown-item" onClick={handleContactClick}>
                      <FontAwesomeIcon icon={faPhone} /> Contact as
                    </button>
                    </li>
                    <li><button className="dropdown-item" onClick={handleAboutClick}>
                      <FontAwesomeIcon icon={faInfoCircle} /> About
                    </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </nav>
  );
};

export default NavBar;
