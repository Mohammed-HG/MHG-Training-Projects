import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// تنسيق الصفحة باستخدام styled-components
const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ProductCard = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  overflow: hidden;
  text-align: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  color: #e67e22;
  margin-bottom: 10px;
`;

const ProductStock = styled.p`
  font-size: 1rem;
  color: ${props => (props.inStock ? 'green' : 'red')};
  margin-bottom: 10px;
`;

const ProductStatus = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
`;

const AddToCartButton = styled.button`
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
`;

function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:3300/api/products')
      .then(response => {
        console.log('Products data:', response.data); // فحص البيانات
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleDetails = (product) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`تمت إضافة ${product.name} إلى السلة!`);
  };  

  return (
    <Container>
      <br/>
      <br/>
      <Title>المنتجات</Title>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage 
              src={`http://localhost:3300/uploads/${product.image_url}`} // ✅ المسار الصحيح
              alt={product.name} 
              onClick={() => handleDetails(product)} 
              style={{ cursor: 'pointer' }}
            />
            <ProductDetails>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>السعر: {product.price} ر.س</ProductPrice>
              <ProductStock inStock={product.stock > 0}>
                المخزون: {product.stock > 0 ? product.stock : 'غير متوفر'}
              </ProductStock>
              <ProductStatus>الحالة: {product.status}</ProductStatus>
              <AddToCartButton onClick={() => handleAddToCart(product)}>
                إضافة إلى السلة
              </AddToCartButton>
            </ProductDetails>
          </ProductCard>
        ))}
      </ProductGrid>
      <ToastContainer />
     

    </Container>
   
  );
}

export default ProductList;
