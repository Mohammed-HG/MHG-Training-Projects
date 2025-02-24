import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import MessageModal from '../components/MessageModal';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background-color:rgb(41, 79, 97); /* لون الخلفية الجديد للصفحة */
  min-height: 100vh;
  padding: 20px;
`;

const AddViolation = () => {
  const handleClose = () => setModalShow(false);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const { id } = useParams();

  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [value, setValue] = useState('');
  const [userId, setUserId] = useState('');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token provided');
        }

        const response = await axios.get('http://127.0.0.1:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchViolation = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token provided');
          }

          const response = await axios.get(`http://127.0.0.1:5000/api/violations/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const violation = response.data;
          setDate(violation.date);
          setType(violation.type);
          setNumber(violation.number);
          setValue(violation.value);
          setDescription(violation.description);
          setUserId(violation.userId);
        } catch (error) {
          console.error('Error fetching violation:', error);
        }
      };
      fetchViolation();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token provided');
      }

      const validUser = users.find(user => user.id === parseInt(userId));
      if (!validUser) {
        setModalTitle('خطأ');
        setModalMessage('المستخدم غير صالح');
        setModalShow(true);
        return;
      }

      if (id) {
        // تحديث المخالفة
        await axios.put(`http://127.0.0.1:5000/api/violations/${id}`, {
          date,
          type,
          number,
          value,
          userId,
          description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/admin/Violations');
        setModalTitle('نجاح');
        setModalMessage('تم تحديث المخالفة بنجاح');
        setModalShow(true);

        setTimeout(() => {
          handleClose();
        }, 2000);      
      } else {
        // إنشاء مخالفة جديدة
        await axios.post('http://127.0.0.1:5000/api/violations', {
          date,
          type,
          number,
          value,
          userId,
          description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/admin/Violations');
        setModalTitle('نجاح');
        setModalMessage('تم تسجيل المخالفة بنجاح');
        setModalShow(true);

        setTimeout(() => {
          handleClose();
        }, 2000);      
      }
    } catch (error) {
      console.error('Error adding/updating violation:', error);
      setModalTitle('خطأ');
      setModalMessage('فشل في إضافة المخالفة');
      setModalShow(true);
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

  const handleCancel = () => {
    navigate('/admin/Violations');
  };

  return (
    <PageWrapper>
      <Container className="mt-5" dir='rtl'>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center">{id ? 'تعديل مخالفة' : 'تسجيل مخالفة'}</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUserId">
                <Form.Label>اسم المخالف</Form.Label>
                <Form.Control
                  as="select"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                >
                  <option value="">اختر المخالف</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              
              <Form.Group controlId="formViolationType">
                <Form.Label>نوع المخالفة</Form.Label>
                <Form.Control
                  as="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">اختر المخالفة</option>
                  <option value="ممارسة النشاط بعد انتهاء الرخصة">ممارسة النشاط بعد انتهاء الرخصة</option>
                  <option value="بناء بدون رخصة">بناء بدون رخصة</option>
                  <option value="إقامة لوحة أو ملصق دعائي أو إعلاني بدون ترخيص">إقامة لوحة أو ملصق دعائي أو إعلاني بدون ترخيص</option>
                  <option value="عدم تجديد رخصة التشغيل للمنشأة">عدم تجديد رخصة التشغيل للمنشأة</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formNumber">
                <Form.Label>رقم المخالفة</Form.Label>
                <Form.Control
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="رقم المخالفة"
                  required
                />
                <Form.Label>تاريخ المخالفة</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>وصف المخالفة</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف المخالفة"
                />
              </Form.Group>

              <Form.Group controlId="formValue">
                <Form.Label>قيمة المخالفة</Form.Label>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="قيمة المخالفة"
                  required
                />
              </Form.Group>
              {users.length === 0 && <div>لا توجد بيانات للمستخدمين</div>}
              <Button variant="primary" type="submit" className="mt-3">
                <FontAwesomeIcon icon={faPlus} /> {id ? 'تحديث' : 'تسجيل'} المخالفة
              </Button>
              <br/>
              <Button variant="secondary" onClick={handleCancel} className="mt-3 ms-2">
                إلغاء
              </Button>
            </Form>
          </Col>
        </Row>
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

export default AddViolation;
