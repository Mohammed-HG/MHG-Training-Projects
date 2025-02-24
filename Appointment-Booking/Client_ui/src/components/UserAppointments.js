import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

// Animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled-components
const Container = styled.div`
  padding: 50px;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(120deg,rgb(209, 128, 73),rgb(53, 40, 29));
  min-height: 100vh;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #111;
  text-align: center;
  font-size: 2.5em;
`;

const NewAppointmentButton = styled.button`
  display: inline-block;
  padding: 15px 30px;
  background-color: rgb(9, 60, 201);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  font-size: 1.2em;
  margin-bottom: 40px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  &:hover {
    background-color: #5b6ef4;
    transform: translateY(-3px);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  background: #fff
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  min-width: 600px;
`;

const Th = styled.th`
  padding: 15px;
  background-color: #0a2f94;
  color: white;
  font-size: 1.1em;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
  color: #111;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f2f2f2;
  }
`;

const LoadingText = styled.p`
  font-size: 1.5em;
  color: #333;
  text-align: center;
`;

const NoAppointmentsText = styled.p`
  font-size: 1.5em;
  color: #888;
  text-align: center;
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background: #c82333;
    transform: translateY(-2px);
  }
`;

const Spacer = styled.div`
  height: 100px; /* Adjust height as needed */
`;

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:3600/api/user-appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log(response.data);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
      setLoading(false);
    }
  };

  const handleNewAppointment = () => {
    navigate('/appointment');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:3600/api/appointments/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  return (
    <Container dir='rtl'>
      <Title>المواعيد</Title>
      <NewAppointmentButton onClick={handleNewAppointment}>
        حجز موعد جديد
      </NewAppointmentButton>
      {loading ? (
        <LoadingText>جاري التحميل...</LoadingText>
      ) : appointments.length > 0 ? (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>الاسم</Th>
                <Th>التاريخ</Th>
                <Th>السبب</Th>
                <Th>الحالة</Th>
                <Th>ملاحظة المسؤول</Th>
                <Th>إجراءات</Th> {/* Added column for actions */}
              </tr>
            </thead>
            <tbody>
              {appointments.map(app => (
                <Tr key={app.id}>
                  <Td>{app.name}</Td>
                  <Td>{new Date(app.date).toLocaleDateString()}</Td>
                  <Td>{app.reason}</Td>
                  <Td>{app.status}</Td>
                  <Td>{app.adminNotes}</Td>
                  <Td>
                    <DeleteButton onClick={() => handleDelete(app.id)}>حذف</DeleteButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      ) : (
        <NoAppointmentsText>لا توجد مواعيد متاحة</NoAppointmentsText>
      )}
      <Spacer />
    </Container>
  );
};

export default UserAppointments;
