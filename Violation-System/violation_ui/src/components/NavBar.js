import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleLogout } from './Logout';
import MessageModal from "../components/MessageModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faInfoCircle, faHome } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        // Extracting the page name from the pathname
        const pathParts = location.pathname.split('/');
        const page = pathParts[pathParts.length - 1] || 'Home';
        setPageTitle(page.charAt(0).toUpperCase() + page.slice(1));
    }, [location]);

    const handleAccountClick = () => {
        navigate('/account');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand"></a>
                </div>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <span className="nav-link text-white" style={{ fontSize: '1.25rem' }}>{pageTitle}</span>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item" dir="rtl">
                            <button className="nav-link active btn btn-link" onClick={handleAccountClick}>
                                <FontAwesomeIcon icon={faUser} />  
                            </button>
                        </li>

                        <li className="nav-item" dir="rtl">
                            <button className="nav-link active btn btn-link" onClick={handleHomeClick}>
                                <FontAwesomeIcon icon={faHome} />  
                            </button>
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
