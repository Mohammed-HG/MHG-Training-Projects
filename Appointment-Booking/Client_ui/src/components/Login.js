import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// تعريف الرسوم المتحركة
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// مكونات styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(120deg, #965a31, #575553);
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  animation: ${fadeIn} 1s ease-in-out;
`;

const FormWrapper = styled.form`
  background: trans;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3600/api/login', { username, password });

      if (response.status === 200 || response.status === 201) {
        const { token, isAdmin } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('isAdmin', isAdmin);

        if (isAdmin === 1 || isAdmin === true) {
          // توجيه إلى صفحة المسؤول
          navigate('/admin');
        } else {
          // توجيه إلى صفحة المواعيد الخاصة بالمستخدم
          navigate('/user-appointments');
        }
      }
    } catch (error) {
      alert('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <Container dir="rtl">
      <FormWrapper onSubmit={handleLogin}>
        <Title>تسجيل الدخول</Title>
        <div>
          <Label>اسم المستخدم:</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <Label>كلمة المرور:</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit">دخول</Button>
      </FormWrapper>
    </Container>
  );
};

export default Login;
