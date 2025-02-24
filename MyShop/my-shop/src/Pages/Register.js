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
  background: linear-gradient(120deg,rgb(10, 79, 124),rgb(53, 14, 70));
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

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClose = () => setModalShow(false);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3300/api/register', {
        username,
        password
      });
      
      if (response.status === 201) {
        setModalTitle('Registered Successful');
        setModalMessage('Now We Will Move To Login ');
        setModalShow(true);
        navigate('/login');
        setTimeout(() => {
          handleClose();
        }, 5000);
      } else {
        setModalTitle('res.status(500)');
        setModalMessage('Internal Server Error');
        setModalShow(true);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Register failed');
      setModalShow(true);
    }
  };

  return (
    <Container>
      <Title>إنشاء حساب جديد</Title>
      <Form onSubmit={handleSubmit}>
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
        <Button type="submit">تسجيل</Button>
        <MessageModal
          show={modalShow}
          handleClose={() => setModalShow(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </Form>
    </Container>
  );
};

export default Register;
