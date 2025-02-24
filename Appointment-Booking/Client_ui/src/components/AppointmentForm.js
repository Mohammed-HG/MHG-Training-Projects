import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageModal from './MessageModal';
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
  height: 120vh;
  background: linear-gradient(120deg, #965a31, #575553);
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const FormWrapper = styled.form`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
  transition: border-color 0.3s;
  min-height: 100px;
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

const AppointmentForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://127.0.0.1:3600/api/appointments', // استخدم مسارًا نسبيًا إذا كان لديك proxy في package.json
        {
          name,
          date,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setModalTitle('نجاح');
        setModalMessage('تم حجز موعد لزيارتك بنجاح.');
        setModalShow(true);
        navigate('/user-appointments');


        // إعادة تعيين الحقول
        setName('');
        setDate('');
        setReason('');
      }
    } catch (error) {
      setModalTitle('فشل');
      setModalMessage('لم يتم حجز الموعد، حدث خطأ في النظام.');
      setModalShow(true);
      console.error('Error booking appointment:', error);
    }
  };

  const handleCloseModal = () => {
    setModalShow(false);
    // توجيه المستخدم إلى صفحة المواعيد
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSubmit}>
        <Title>حجز موعد</Title>
        <div>
          <Label>الاسم:</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>التاريخ المطلوب:</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>سبب الزيارة:</Label>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <Button type="submit">إرسال الطلب</Button>
      </FormWrapper>
      <MessageModal
        show={modalShow}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default AppointmentForm;
