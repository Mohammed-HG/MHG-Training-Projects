import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Table as BootstrapTable, Container, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import MessageModal from '../components/MessageModal';

const PageWrapper = styled.div`
  background-color:rgba(22, 85, 141, 0.66);
  min-height: 100vh;
  padding: 20px;
`;

const StyledTable = styled(BootstrapTable)`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  border-collapse: collapse;
  th, td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
  }
  thead {
    background-color: #007bff;
    color: #fff;
  }
  tbody tr:hover {
    background-color:rgba(241, 241, 241, 0.88);
  }
`;

const AdminViolations = () => {
  const [violations, setViolations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const fetchViolations = async (query = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token provided');
      }

      const response = await axios.get(`http://127.0.0.1:5000/api/violations?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setViolations(response.data);
    } catch (error) {
      console.error('Error fetching violations:', error);
      if (error.response && error.response.status === 403) {
        setModalTitle('Session Expired');
        setModalMessage('Your session has expired. Please log in again.');
        setModalShow(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);       
      }
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token provided');
      }

      await axios.delete(`http://127.0.0.1:5000/api/violations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchViolations();
    } catch (error) {
      console.error('Error deleting violation:', error);
      if (error.response && error.response.status === 403) {
        setModalTitle('Session Expired');
        setModalMessage('Your session has expired. Please log in again.');
        setModalShow(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);       
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/violations/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/admin/Add-Violation');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchViolations(e.target.value);
  };

  return (
    <PageWrapper>
      <Container className="mt-5" dir='rtl'>
        <h2 className="text-center mb-4">عرض المخالفات</h2>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="ابحث عن المخالفة"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Col>
          <Col md={6} className="text-end">
            <Button variant="primary" onClick={handleAdd}>
              <FontAwesomeIcon icon={faAdd} /> إضافة مخالفة
            </Button>
          </Col>
        </Row>
        <StyledTable striped bordered hover>
          <thead>
            <tr>
              <th>اسم المستخدم</th>
              <th>رقم المستخدم</th>
              <th>رقم المخالفة</th>
              <th>تاريخ المخالفة</th>
              <th>نوع المخالفة</th>
              <th>وصف المخالفة</th>
              <th>قيمة المخالفة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((violation) => (
              <tr key={violation.violation_id}>
                <td>{violation.user_name}</td>
                <td>{violation.user_id}</td>
                <td>{violation.number}</td>
                <td>{violation.date}</td>
                <td>{violation.type}</td>
                <td>{violation.description}</td>
                <td>{violation.value} ر.س</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(violation.violation_id)}>تعديل</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(violation.violation_id)}>حذف</Button>
              </td>
            </tr>
          ))}
        </tbody>
        </StyledTable>
    </Container>
    <MessageModal
      show={modalShow}
      handleClose={() => setModalShow(false)}
      title={modalTitle}
      message={modalMessage}
    />
    </PageWrapper>
  );
};

export default AdminViolations;
