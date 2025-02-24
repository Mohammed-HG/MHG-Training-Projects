import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Container, Form, Row, Col } from 'react-bootstrap';

const PageWrapper = styled.div`
  background-color:rgba(8, 84, 119, 0.84); /* لون الخلفية الجديد للصفحة */
  min-height: 100vh;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  border-collapse: collapse;

  th, td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
  }

  thead {
    background-color:rgb(5, 28, 53);
    color: #fff;
  }

  tbody tr:hover {
    background-color:rgb(241, 241, 241);
  }
`;

const CustomContainer = styled(Container)`
  background-color:rgba(6, 42, 161, 0.38); /* لون الخلفية الجديد للمكون */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const UserViolations = () => {
  const [violations, setViolations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token provided');
        }

        const response = await axios.get('http://127.0.0.1:5000/api/user-violations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setViolations(response.data);
      } catch (error) {
        console.error('Error fetching violations:', error);
      }
    };
    fetchViolations();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredViolations = violations.filter(violation => 
    violation.number.includes(searchQuery) ||
    violation.type.includes(searchQuery) ||
    violation.date.includes(searchQuery) ||
    violation.description.includes(searchQuery) ||
    violation.value.toString().includes(searchQuery)
  );

  return (
    <PageWrapper dir="rtl">
      <CustomContainer className="mt-5">
        <h2 className="text-center mb-4">مخالفاتي</h2>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="ابحث عن المخالفة"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Col>
        </Row>
        <Table>
          <thead>
            <tr>
              <th>رقم المخالفة</th>
              <th>نوع المخالفة</th>
              <th>تاريخ المخالفة</th>
              <th>وصف المخالفة</th>
              <th>قيمة المخالفة</th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.map((violation) => (
              <tr key={violation.violation_id}>
                <td>{violation.number}</td>
                <td>{violation.type}</td>
                <td>{violation.date}</td>
                <td>{violation.description}</td>
                <td>{violation.value} ر.س</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CustomContainer>
    </PageWrapper>
  );
};

export default UserViolations;
