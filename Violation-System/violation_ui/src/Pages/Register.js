import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageModal from '../components/MessageModal';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #666;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
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
      const response = await axios.post('http://127.0.0.1:5000/api/register', {
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
      <Title>تسجيل</Title>
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Label className="form-label">اسم المستخدم</Label>
          <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <Label className="form-label">كلمة المرور</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
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
