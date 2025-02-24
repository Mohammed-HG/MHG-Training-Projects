import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MessageModal from '../components/MessageModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; 

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg,rgb(77, 91, 97),rgb(218, 123, 14));
  font-family: 'Roboto', sans-serif;
`;

const Card = styled.div`
  background: #222;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  color: #666;
  margin-bottom: 15px;
  font-size: 1.1rem;
`;

const Loader = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solidrgb(219, 133, 52);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #111;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

const Account = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const handleClose = () => setModalShow(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('http://127.0.0.1:3600/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Full API response:', response.data);  // Log the full response
      setUser(response.data.UserName);
      setUserId(response.data.UserId);
      console.log('User:', response.data.UserName);  // Log the UserName
      console.log('UserId:', response.data.UserId);  // Corrected case for UserId
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setModalTitle('Session Expired');
        setModalMessage('Your session has expired. Please log in again.');
        setModalShow(true);
        navigate('/login');
      } else if (error.response && error.response.status === 404){
        setModalTitle('Data Fetch Error');
        setModalMessage('Data not found');
        setModalShow(true);
      } else if (error.response && error.response.status === 500){
        setModalTitle('res.status 500');
        setModalMessage('error: Internal server error');
        setModalShow(true);
      } else {
        console.error('Failed to fetch user:', error);
      }
    }
  };

  return (
      <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </BackButton>
        <Card>
          <Title>Account Details</Title>
          {user && userId ? (
            <div>
              <Paragraph>Username: {user}</Paragraph>
              <Paragraph>User ID: {userId}</Paragraph>
            </div>
          ) : (
            <Loader />
          )}
        </Card>

        <MessageModal
          show={modalShow}
          handleClose={handleClose}
          title={modalTitle}
          message={modalMessage}
        />

      </Container>
  );
};

export default Account;
