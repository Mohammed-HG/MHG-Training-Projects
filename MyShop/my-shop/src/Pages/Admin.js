import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import MessageModal from '../components/MessageModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #333;
  direction: rtl;
`;

const Title = styled.h2`
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
`;

const TabButton = styled.button`
  padding: 10px 25px;
  background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e9ecef'};
  }
`;

const ProductForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #495057;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px 15px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,.25);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.primary ? '#007bff' : props.secondary ? '#6c757d' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }

  &:not(:last-child) {
    margin-left: 10px;
  }
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductItem = styled.li`
  border: 1px solid #eee;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
`;

const ProductDetails = styled.div`
  flex: 1;
  margin-right: 20px;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #212529;
  }

  p {
    margin: 5px 0;
    color: #6c757d;
  }
`;

const OrdersContainer = styled.div`
  margin-top: 30px;
`;

const SearchBox = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  background: white;
  font-size: 14px;
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  text-align: right;
  color: #495057;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
  text-align: right;
  color: #6c757d;
`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    status: '',
    description: '',
    ingredients: '',
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:3300/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setModalTitle('خطأ');
      setModalMessage('Error fetching products');
      setModalShow(true);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:3300/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}`
      },
        params: { status: selectedStatus, search: searchTerm }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setModalTitle('خطأ');
      setModalMessage('Error fetching orders');
      setModalShow(true);
    } finally {
      setLoadingOrders(false);
    };
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, selectedStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    try {
      const token = localStorage.getItem('token');
      const url = editId 
        ? `http://127.0.0.1:3300/api/products/${editId}`
        : 'http://127.0.0.1:3300/api/products';

      const response = editId
        ? await axios.put(url, formPayload, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          })
        : await axios.post(url, formPayload, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });

      resetForm();
      fetchProducts();
      setActiveTab('list');
    } catch (error) {
      console.error('Error saving product:', error);
      setModalTitle('خطأ');
      setModalMessage('فشل في حفظ المنتج');
      setModalShow(true);    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'price', 'stock', 'status'];
    const missing = requiredFields.filter(field => !formData[field]);
    
    if (missing.length > 0) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return false;
    }
    
    if (!editId && !formData.image) {
      alert('الرجاء اختيار صورة للمنتج');
      return false;
    }
    
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      status: '',
      description: '',
      ingredients: '',
      image: null
    });
    setEditId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      status: product.status,
      description: product.description,
      ingredients: product.ingredients,
      image: null
    });
    setEditId(product.id);
    setActiveTab('add');
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:3300/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setModalTitle('خطأ');
      setModalMessage('فشل في حذف المنتج');
      setModalShow(true);    
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:3300/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      setModalTitle('خطأ');
      setModalMessage('فشل في تحديث حالة الطلب');
      setModalShow(true);        }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://127.0.0.1:3300/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        setModalTitle('خطأ');
        setModalMessage('فشل في حذف الطلبية');
        setModalShow(true);      }
    }
  };

  return (
    <Container>
      <Title>لوحة تحكم المسؤول</Title>

      <Tabs>
        <TabButton 
          active={activeTab === 'add'} 
          onClick={() => setActiveTab('add')}
        >
          {editId ? 'تعديل المنتج' : 'إضافة منتج'}
        </TabButton>
        
        <TabButton 
          active={activeTab === 'list'} 
          onClick={() => {
            setActiveTab('list');
            resetForm();
          }}
        >
          قائمة المنتجات
        </TabButton>

        <TabButton 
          active={activeTab === 'orders'} 
          onClick={() => setActiveTab('orders')}
        >
          إدارة الطلبات
        </TabButton>
      </Tabs>

      {activeTab === 'add' && (
        <ProductForm onSubmit={handleSubmit}>
          <Label>اسم المنتج:</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <Label>السعر (ريال سعودي):</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />

          <Label>الكمية المتاحة:</Label>
          <Input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            required
          />

          <Label>حالة التوفر:</Label>
          <StatusSelect
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            required
          >
            <option value="">اختر الحالة</option>
            <option value="متوفر">متوفر</option>
            <option value="غير متوفر">غير متوفر</option>
          </StatusSelect>

          <Label>الوصف:</Label>
          <Input
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <Label>المكونات:</Label>
          <Input
            name="ingredients"
            value={formData.ingredients}
            onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
          />

          <Label>صورة المنتج:</Label>
          <Input
            type="file"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            required={!editId}
          />

          <div>
            <Button type="submit" primary>
              {editId ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </Button>
            {editId && (
              <Button type="button" onClick={resetForm}>
                إلغاء التعديل
              </Button>
            )}
          </div>
        </ProductForm>
      )}

      {activeTab === 'list' && (
        <ProductList>
          {products.map(product => (
            <ProductItem key={product.id}>
              <ProductDetails>
                <h3>{product.name}</h3>
                {`http://localhost:3300/uploads/${product.image_url}` && (
                  <img 
                    src={`http://localhost:3300/uploads/${product.image_url}`} 
                    alt={product.name}
                    style={{ width: '100px', marginTop: '10px' }}
                  />
                )}
                <p>السعر: {product.price} ر.س</p>
                <p>الكمية: {product.stock}</p>
                <p>الحالة: {product.status}</p>
                {product.description && <p>الوصف: {product.description}</p>}
                {product.ingredients && <p>المكونات: {product.ingredients}</p>}
               
              </ProductDetails>
              <div>
                <Button primary onClick={() => handleEdit(product)}>
                  تعديل
                </Button>
                <Button onClick={() => handleDeleteProduct(product.id)}>
                  حذف
                </Button>
              </div>
            </ProductItem>
          ))}
        </ProductList>
      )}
      {activeTab === 'orders' && (
        <OrdersContainer>
          <SearchBox>
            <Input
              type="text"
              placeholder="ابحث برقم الطلب أو اسم العميل"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            
            <StatusSelect 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">جميع الحالات</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التسليم">تم التسليم</option>
              <option value="ملغي">ملغي</option>
            </StatusSelect>
          </SearchBox>

          {loadingOrders && <div style={{textAlign: 'center', padding: '20px'}}>جاري تحميل البيانات...</div>}

          <OrdersTable>
            <thead>
              <tr>
                <TableHeader>رقم الطلب</TableHeader>
                <TableHeader>اسم العميل</TableHeader>
                <TableHeader>رقم العميل</TableHeader>
                <TableHeader>المنتجات</TableHeader>
                <TableHeader>التاريخ</TableHeader>
                <TableHeader>الحالة</TableHeader>
                <TableHeader>الإجراءات</TableHeader>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <TableRow key={order.OrderId}>
                  <TableCell>#{order.OrderId}</TableCell>
                  <TableCell>{order.CustomerName || 'غير معروف'}</TableCell>
                  <TableCell>{order.CustomerId}</TableCell>
                  <TableCell>
                    {(order.products || []).map((item, index) => (
                      <div key={index} style={{ marginBottom: '5px' }}>
                        <strong>{item.quantity}x</strong> {item.name} - {item.price} ر.س
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.OrderDate && new Date(order.OrderDate).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusSelect
                      value={order.Status}
                      onChange={(e) => updateOrderStatus(order.OrderId, e.target.value)}
                      style={{
                        backgroundColor: getStatusColor(order.Status),
                        minWidth: '120px'
                      }}
                    >
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="تم الشحن">تم الشحن</option>
                      <option value="تم التسليم">تم التسليم</option>
                      <option value="ملغي">ملغي</option>
                    </StatusSelect>
                  </TableCell>
                  <TableCell>
                    <Button 
                      secondary 
                      onClick={() => deleteOrder(order.OrderId)}
                      style={{ padding: '8px 16px' }}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </OrdersTable>
        </OrdersContainer>
      )}
      <MessageModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
};

// دالة مساعدة للحصول على لون الحالة
const getStatusColor = (status) => {
  const colors = {
    'قيد التنفيذ': '#fff3cd',
    'تم الشحن': '#f3e957',
    'تم التسليم': '#d4edda',
    'ملغي': '#f8d7da'
  };
  return colors[status] || '#ffffff';
};

export default Admin;