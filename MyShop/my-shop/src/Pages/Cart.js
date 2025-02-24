import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/Checkout');
  };

  return (
    <><div dir='rtl'>
      <h2>سلة المشتريات</h2>
      <ul className="list-group">
        {cart.map((product, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5>{product.name}</h5>
              <p>السعر: {product.price} ر.س</p>
              <p>الكمية: {product.quantity}</p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => removeFromCart(index)}
            >
              إزالة
            </button>
          </li>
        ))}
      </ul>


    </div>
    <div>
        <p className="mt-3">الإجمالي: {total} ر.س</p>
        <button onClick={handleCheckout} className="btn btn-success">إتمام الطلب</button>
      </div></>
  );
}

export default Cart;
