import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import axios from 'axios';
import MessageModal from '../components/MessageModal';
import styled from 'styled-components';

// Styled-components for better UX
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(120deg, rgb(10, 79, 124), rgb(26, 14, 70));
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const Form = styled.form`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: white
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #8e44ad;
    outline: none;
    box-shadow: 0 0 5px rgba(142, 68, 173, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: rgb(10, 47, 148);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background: #5b6ef4;
    transform: translateY(-2px);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(93, 173, 226, 0.5);
  }
`;

const SmailButton = styled.button`
  width: 35%;
  padding: 12px;
  background: rgb(10, 148, 141);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background:rgb(10, 61, 201);
    transform: translateY(-2px);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(93, 173, 226, 0.5);
  }
`;

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const isAdminLogin = username.toLowerCase().includes('admin');
      
      const response = await axios.post('http://127.0.0.1:3300/api/login', {
        username,
        password
      });

      const { userId, token, role, email, isAdmin } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      
      setUser({ 
        username,
        userId,
        role: isAdmin ? 'admin' : role,
        email
      });

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate(from);
      }

      setModalTitle('نجاح');
      setModalMessage(`تم تسجيل الدخول ${isAdmin ? 'كمدير' : ''} بنجاح`);
      setModalShow(true);

    } catch (error) {
      let errorMessage = 'فشل تسجيل الدخول';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'انتهت مهلة الاتصال';
      } else if (error.request) {
        errorMessage = 'لا يوجد اتصال بالخادم';
      }
      
      setModalTitle('خطأ');
      setModalMessage(errorMessage);
      setModalShow(true);
    }
  };

  const handleRegister = () => {
    navigate('/register')
  }

  return (
    <Container>
      <Title>تسجيل الدخول</Title>
      <Form onSubmit={handleLogin} dir='rtl'>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="اسم المستخدم"
          name="uname"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          name="pswd"
          required
        />
        <Button type="submit">تسجيل الدخول</Button>

        <hr/>
        <p dir='rtl'>ليس لديك حساب ؟</p> 
        <SmailButton onClick={handleRegister} dir='rtl'>أنشئ حساب جديد !</SmailButton>

      </Form>
      <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default Login;
