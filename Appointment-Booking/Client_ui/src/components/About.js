import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logo from './Pic/AlhasaMunic.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 175vh;
  background: linear-gradient(120deg,rgb(150, 80, 1), #34495e);
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const AboutBox = styled.div`
  background: #1c2833;
  padding: 50px 200px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1080px;
  animation: fadeIn 1s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #ecf0f1;
`;

const Subtitle = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  color: #95a5a6;
`;

const Paragraph = styled.p`
  text-align: center;
  margin-bottom: 5px; /* Reduced margin to keep paragraphs closer */
  color: #bdc3c7;
  line-height: 2.6;
`;

const List = styled.ul`
  text-align: center;
  margin-bottom: 20px;
  color: #bdc3c7;
  line-height: 1.6;
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
  padding-left: 1.2em;
  text-indent: -1.2em;
  &:before {
    content: "•";
    color: #95a5a6;
    padding-right: 10px;
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #95a5a6;
  margin: 40px 0; /* Adds space around the divider */
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #ecf0f1;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    color: #8e44ad;
  }

  &:focus {
    outline: none;
  }
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <Container dir='rtl'>
      <BackButton onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </BackButton>
      <AboutBox>
        <List>
      <img src={logo} />
      </List>
        <Title>أمانه الاحساء</Title>
        
        <Paragraph>هذه الخدمة لحجز المواعيد لزياره الامانة</Paragraph>
        <Divider/>
          <List>جميع طرق التواصل تجدها تحت في الشريط</List>
        <Divider/>

        <Paragraph>Mohammed Alghareeb (MHG)</Paragraph> 
        <Paragraph>الرقم التدريبي: 443236035</Paragraph> 
        <Paragraph> 443236035@tvtc.edu.sa</Paragraph>

      </AboutBox>

      <Divider/>
        <Paragraph>
          © 2025 (MHG) أمانه الاحساء. 
        </Paragraph>
    </Container>
  );
};

export default About;