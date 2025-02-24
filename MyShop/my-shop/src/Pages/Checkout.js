import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../components/CartContext';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
`;

const ProductDetails = styled.div`
  flex: 1;
  margin-left: 20px;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 5px;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  color: #e67e22;
`;

const ProductQuantity = styled.p`
  font-size: 1rem;
  color: #666;
`;

const CheckoutButton = styled.button`
  padding: 12px;
  background: ${({ disabled }) => (disabled ? '#ccc' : '#28a745')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#ccc' : '#218838')};
    transform: ${({ disabled }) => (disabled ? 'none' : 'translateY(-2px)')};
  }
`;

const OrderStatusMessage = styled.p`
  font-size: 1.25rem;
  color: ${({ success }) => (success ? 'green' : 'red')};
  margin-top: 20px;
`;

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [orderStatus, setOrderStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('سجّل الدخول أولًا لإتمام الطلب');
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    axios.post('http://127.0.0.1:3300/api/orders', { products: cart }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      if (response.status === 201 && response.data.orderId && response.data.success) {
        setOrderStatus('تم إتمام الطلب بنجاح');
        setCart([]);
        toast.success('تم إتمام الطلب بنجاح!');
      } else {
        throw new Error('استجابة غير متوقعة من الخادم');
      }
    })    
    .catch(error => {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'حدث خطأ أثناء إتمام الطلب';
      console.error('تفاصيل الخطأ:', error.response?.data || error.message);
      toast.error(errorMessage);
      setOrderStatus('فشل في إتمام الطلب');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <Container dir='rtl'>
      <Title>إتمام الطلب</Title>
      {cart.map(product => (
        <CartItem key={product.id}>
          <ProductImage src={`http://127.0.0.1:3300/uploads/${product.image_url}`} alt={product.name} />
          <ProductDetails>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>السعر: {product.price} ر.س</ProductPrice>
            <ProductQuantity>الكمية: {product.quantity}</ProductQuantity>
          </ProductDetails>
        </CartItem>
      ))}
      <CheckoutButton onClick={handleCheckout} disabled={isSubmitting}>
        {isSubmitting ? 'جاري الإتمام...' : 'إتمام الطلب'}
      </CheckoutButton>
      {orderStatus && (
        <OrderStatusMessage success={orderStatus === 'Order completed successfully'}>
          {orderStatus}
        </OrderStatusMessage>
      )}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}

export default Checkout;
