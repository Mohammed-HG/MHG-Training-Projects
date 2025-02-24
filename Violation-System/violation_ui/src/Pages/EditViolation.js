import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import MessageModal from '../components/MessageModal';

const EditViolation = () => {
      const handleClose = () => setModalShow(false);
      const navigate = useNavigate();
    
      const [modalShow, setModalShow] = useState(false);
      const [modalTitle, setModalTitle] = useState('');
      const [modalMessage, setModalMessage] = useState('');

  const { id } = useParams();
  
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
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
        setUserId(violation.userId)
        setDate(violation.date);
        setType(violation.type);
        setNumber(violation.number);
        setValue(violation.value);
        setDescription(violation.description);
      } catch (error) {
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
    fetchViolation();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token provided');
      }

      await axios.put(`http://127.0.0.1:5000/api/violations/${id}`, {
        userId,
        date,
        type,
        number,
        value,
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalTitle('نجاح');
      setModalMessage('تم تحديث المخالفه بنجاح');
      setModalShow(true);
      navigate('/admin/violations');
    } catch (error) {
      console.error('Error updating violation:', error); 
      setModalTitle('Error');
      setModalMessage('Error ):');
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
    navigate('/admin/violations');
  };

  return (
    <Container className="mt-5" dir="rtl">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center">تعديل المخالفة</h2>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formDate">
              <Form.Label>تاريخ المخالفة</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
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

            <Button variant="primary" onClick={handleEdit} className="mt-3">
              تعديل المخالفة
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="mt-3 ms-2">
              إلغاء
            </Button>
          </Form>
        </Col>
      </Row>
      <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

export default EditViolation;
