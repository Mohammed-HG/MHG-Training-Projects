import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageModal from '../components/MessageModal';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(120deg,rgb(102, 112, 119),rgb(69, 112, 129));
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
  background:rgb(10, 47, 148);
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => setModalShow(false);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/admin/login', {
        username,
        password
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token); // تخزين التوكن في localStorage

        navigate('/admin/Violations');
        setModalTitle('نجاح');
        setModalMessage('تم تسجيل الدخول بنجاح');
        setModalShow(true);

        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setModalTitle('خطأ');
        setModalMessage('اسم المستخدم او كلمة المرور غير صحيحه');
        setModalShow(true);
      }
    } catch (error) {
      setModalTitle('خطأ');
      setModalMessage('فشل تسجيل الدخول');
      setModalShow(true);
    }
  };

  return (
    <Container>
      <Title>هذه الصفحه لتسجيل الدخول للمشرفين فقط</Title>
      <Form onSubmit={handleLogin}>
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
        <hr></hr>
        <p>إذا لم يكن لديك حساب مشرف يجب عليك التواصل مع المسؤول.</p>
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

