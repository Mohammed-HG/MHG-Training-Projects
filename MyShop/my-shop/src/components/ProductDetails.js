import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
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

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 20px;
  overflow: hidden;
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const Title = styled.h3`
  font-size: 1.75rem;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #666;
`;

const Price = styled.p`
  font-size: 1.25rem;
  color: #e67e22;
  margin-bottom: 20px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const QuantityButton = styled.button`
  padding: 5px 10px;
  margin: 0 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background: #218838;
    transform: translateY(-2px);
  }
`;

function ProductDetails() {
  const { state } = useLocation();
  const { product } = state || { product: {} }; // Default value to avoid error
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1); // كمية المنتج

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Container>
      <h2>تفاصيل المنتج</h2>
      <Card>
        <CardImage src={`http://localhost:3300/uploads/${product.image_url}`} // ✅ المسار الصحيح
              alt={product.name} 
              style={{ cursor: 'pointer' }
            }
              />
        <CardBody>
          <Title>{product.name}</Title>
          <Price>السعر: {product.price} ر.س</Price>
          <Text>المخزون: {product.stock > 0 ? product.stock : 'غير متوفر'}</Text>
          <Text>الحالة: {product.status}</Text>
          <Text>الوصف: {product.description}</Text>
          <Text>المكونات: {product.ingredients}</Text>

          {/* تحديد الكمية */}
          <QuantityContainer>
            <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
            <QuantityInput 
              type="number" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min="1" 
              max={product.stock} 
            />
            <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
          </QuantityContainer>

          <AddToCartButton onClick={handleAddToCart}>إضافة إلى السلة</AddToCartButton>
        </CardBody>
      </Card>
    </Container>
  );
}

export default ProductDetails;
