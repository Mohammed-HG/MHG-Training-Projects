import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const OrderList = styled.div`
  width: 100%;
  max-width: 800px;
`;

const OrderItem = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const OrderId = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 5px;
`;

const OrderStatus = styled.p`
  font-size: 1rem;
  color: #28a745;
`;

const OrderDate = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ProductList = styled.p`
  font-size: 1rem;
  color: #333;
`;

const ErrorMessage = styled.p`
  font-size: 1.25rem;
  color: red;
`;

// OrderStatusComponent.js (المُعدّل)
const OrderStatusComponent = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('الرجاء تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    if (!userId) {
      setError('معرف المستخدم غير موجود');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3300/api/users/${userId}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          setError('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
        } else {
          setError('فشل جلب البيانات: ' + (error.response?.data?.message || 'خطأ غير معروف'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Container dir='rtl'>
      <Title>حالة الطلبات</Title>
      {orders.length > 0 ? (
        <OrderList>
          {orders.map(order => (
            <OrderItem key={order.OrderId}>
              <OrderId>طلب #{order.OrderId}</OrderId>
              <OrderStatus>الحالة: {order.Status}</OrderStatus>
              <OrderDate>تاريخ الحالة: {new Date(order.StatusDate).toLocaleString()}</OrderDate>
              <ProductList>
                المنتجات:
                {order.products.map((product, index) => (
                  <div key={index}>
                    {product.name} - الكمية: {product.quantity}
                  </div>
                ))}
              </ProductList>
            </OrderItem>
          ))}
        </OrderList>
      ) : (
        <ErrorMessage>{error || 'لا توجد طلبات لعرضها'}</ErrorMessage>
      )}
    </Container>
  );
};

export default OrderStatusComponent  ;
