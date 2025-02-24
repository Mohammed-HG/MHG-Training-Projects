import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f8f8;
`;

const Message = styled.h1`
  color: #ff0000;
`;

const Unauthorized = () => {
  return (
    <Container>
      <Message>غير مصرح لك بالوصول إلى هذه الصفحة</Message>
    </Container>
  );
};

export default Unauthorized;
