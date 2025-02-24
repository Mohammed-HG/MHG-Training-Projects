import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { handleLogout } from './Logout';
import MessageModal from "../components/MessageModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faHome, faCalendarAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import logo from './Pic/AlhasaMunic.png';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // التحقق مما إذا كان المستخدم مسجل الدخول ومعلومات الصلاحيات
        const token = localStorage.getItem('token');
        const userIsAdmin = localStorage.getItem('isAdmin');
        if (token) {
            setIsAuthenticated(true);
            setIsAdmin(userIsAdmin === 'true' || userIsAdmin === '1');
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="شعار الأمانة" width="75" />
                </Link>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item key="home">
                                <Link className="nav-link" to="/"><FontAwesomeIcon icon={faHome} /> الرئيسية</Link>
                            </Menu.Item>
                            {!isAuthenticated && (
                                <>
                                    <Menu.Item key="login">
                                        <button className="btn btn-outline-light" onClick={handleLogin}>
                                            <FontAwesomeIcon icon={faSignOutAlt} /> تسجيل دخول
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item key="register">
                                        <button className="btn btn-outline-light" onClick={handleRegister}>
                                            <FontAwesomeIcon icon={faUser} /> إنشاء حساب
                                        </button>
                                    </Menu.Item>
                                </>
                            )}
                            {isAuthenticated && isAdmin && (
                                <>
                                    <Menu.Item key="admin">
                                        <Link className="nav-link" to="/admin"><FontAwesomeIcon icon={faCalendarCheck} /> إدارة المواعيد</Link>
                                    </Menu.Item>
                                    <Menu.Item key="account">
                                        <Link className="nav-link" to="/account/me/info"><FontAwesomeIcon icon={faUser} /> حسابي</Link>
                                    </Menu.Item>
                                    <Menu.Item key="logout">
                                        <button className="btn btn-outline-light" onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} /> تسجيل الخروج
                                        </button>
                                    </Menu.Item>
                                </>
                            )}
                            {isAuthenticated && !isAdmin && (
                                <>
                                    <Menu.Item key="appointments">
                                        <Link className="nav-link" to="/user-appointments"><FontAwesomeIcon icon={faCalendarAlt} /> مواعيدي</Link>
                                    </Menu.Item>
                                    <Menu.Item key="account">
                                        <Link className="nav-link" to="/account/me/info"><FontAwesomeIcon icon={faUser} /> حسابي</Link>
                                    </Menu.Item>
                                    <Menu.Item key="logout">
                                        <button className="btn btn-outline-light" onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} /> تسجيل الخروج
                                        </button>
                                    </Menu.Item>
                                </>
                            )}
                        </Menu>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
