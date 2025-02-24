import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../components/Pic/AlhasaMunic.png';

const BackgroundImage = styled.div`
  background-color: #282c34; /* لون الخلفية الجديد */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  font-family: 'Roboto', sans-serif;
`;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <BackgroundImage>
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
          <h2>موقع عرض وتسجيل المخالفات</h2>

            <Overlay>
            <img src={logo} alt="ًصورة الامانه" width={100} />      
              <br />
              <br />
              <br />
              <Button variant="primary" onClick={() => navigate('/login')} className="m-2">
                تسجيل الدخول للمستخدمين
              </Button>
              <Button variant="secondary" onClick={() => navigate('/admin/login')} className="m-2">
                تسجيل الدخول للمشرفين فقط
              </Button>
              <hr />
              <h3>ليس لديك حساب مسجل؟</h3>
              <Button variant="success" onClick={() => navigate('/register')} className="m-2">
                تسجيل حساب مستفيد جديد
              </Button>
            </Overlay>
          </Col>
        </Row>
      </Container>
    </BackgroundImage>
  );
};

export default HomePage;
