const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = 'your_strong_secret_here@123!'; 

app.use(cors({
    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Token', 'X-Custom-Header'], // ✅
    credentials: true
  }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// DataBase Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '7253MHG7253mhg@!',
    database: 'myshopDB'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database!');
    }
});

// إعداد multer لتحميل الملفات
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // تحديد المسار المطلوب لتخزين الصور
        const uploadPath = path.join(__dirname, 'uploads'); // سيتم إنشاء مجلد uploads في نفس مكان ملف الكود
        cb(null, uploadPath); // تمرير المسار إلى multer
    },
    filename: function (req, file, cb) {
        // تحديد اسم الملف (يمكنك استخدام اسم فريد)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // حفظ الملف باسم فريد
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:3300/uploads/${req.file.filename}`;
    res.json({ 
        message: 'File uploaded successfully', 
        imageUrl // إرسال المسار الكامل
    });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO customer (UserName, UserPass) VALUES (?, ?)';

    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error Registering User:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).send('User Registered');
    });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password, isAdminLogin } = req.body;
    const sql = isAdminLogin 
        ? 'SELECT * FROM customer WHERE UserName = ? AND isAdmin = 1'
        : 'SELECT * FROM customer WHERE UserName = ?';

    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'خطأ في الخادم' });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: 'أسم المستخدم غير صحيح'
            });
        }

        const user = results[0];
        
        if (!await bcrypt.compare(password, user.UserPass)) {
            return res.status(401).json({
                message: 'كلمة المرور غير صحيحة'
            });
        }

        if (isAdminLogin && !user.isAdmin) {
            return res.status(403).json({
                message: 'غير مصرح بالدخول كمسؤول'
            });
        }

        const tokenPayload = {
            userId: user.UserId,
            username: user.UserName,
            isAdmin: user.isAdmin
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            userId: user.UserId,
            isAdmin: user.isAdmin
        });
    });
});

// Logout endpoint
router.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});
app.use(router);

// Middleware المصادقة
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = decoded;
      next();
    });
  };
  
  // Middleware الصلاحيات الإدارية
  const adminOnly = (req, res, next) => {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin access required' });
    next();
  };

// Get My info endpoint
router.get('/api/users/me', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const sql = 'SELECT UserName, UserId FROM customer WHERE UserId = ?';

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User Not Found' });
        }
    });
});
app.use(router);

// Get All Products endpoint
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching product data', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});  

// Checkout Order endpoint
app.post('/api/orders', authenticateToken, (req, res) => {
    const { products } = req.body;
    const customerId = req.user.userId;
  
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'بيانات المنتجات غير صالحة' });
    }
  
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: 'فشل في بدء العملية' });   
  
      // 1. التحقق من توفر المخزون
      const stockPromises = products.map(product => {
        return new Promise((resolve, reject) => {
          db.query(
            'SELECT stock FROM products WHERE id = ?',
            [product.id],
            (err, results) => {
              if (err) return reject(err);
              if (results[0].stock < product.quantity) {
                reject(new Error(`الكمية غير متوفرة لـ ${product.name}`));
              }
              resolve();
            }
          );
        });
      });
  
      Promise.all(stockPromises)
        .then(() => {
          // 2. تحديث المخزون
          const updatePromises = products.map(product => {
            return new Promise((resolve, reject) => {
              db.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [product.quantity, product.id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
          });
  
          return Promise.all(updatePromises);
        })
        .then(() => {
          // 3. إنشاء الطلب
          const orderData = {
            CustomerId: customerId,
            products: JSON.stringify(products),
            OrderDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
          };
  
          db.query('INSERT INTO orders SET ?', orderData, (err, result) => {
            if (err) return rollback(res, err);
  
            const orderId = result.insertId;
  
            // 4. إضافة حالة الطلب
            db.query(
              `INSERT INTO order_status 
              (OrderId, Status, StatusDate) 
              VALUES (?, ?, ?)`,
              [orderId, 'قيد التنفيذ', orderData.OrderDate],
              (err) => {
                if (err) return rollback(res, err);
  
                db.commit(err => {
                  if (err) return rollback(res, err);
                  res.status(201).json({ 
                    message: 'تم إنشاء الطلب بنجاح',
                    orderId
                  });
                });
              }
            );
          });
        })
        .catch(err => rollback(res, err));
    });
  });

// Order Status Track endpoint
app.get('/api/users/:userId/orders', authenticateToken, (req, res) => {
    const { userId } = req.params;
  
    const sql = `
      SELECT 
        o.OrderId, 
        o.OrderDate, 
        os.Status, 
        os.StatusDate, 
        COALESCE(o.products, '[]') AS products 
      FROM orders o
      LEFT JOIN order_status os ON o.OrderId = os.OrderId
      WHERE o.CustomerId = ?
      ORDER BY os.StatusDate DESC
    `;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'خطأ في الخادم' });
      }
  
      // تحويل products من JSON String إلى Array
      const parsedResults = results.map(order => ({
        ...order,
        products: JSON.parse(order.products) // ✅ تحويل البيانات
      }));
  
      res.status(200).json(parsedResults);
    });
  });

// --------------------------
// نقاط نهاية إدارة الطلبات
// --------------------------

// 1. الحصول على جميع الطلبات مع الفلترة
app.get('/api/admin/orders', authenticateToken, adminOnly, (req, res) => {
    const { status, search } = req.query;
  
    let sqlQuery = `
      SELECT 
        o.OrderId,
        o.CustomerId,
        c.UserName AS CustomerName,
        o.OrderDate,
        o.products,
        os.Status,
        os.StatusDate
      FROM orders o
      LEFT JOIN (
        SELECT 
          OrderId, 
          MAX(StatusDate) AS LatestStatusDate
        FROM order_status 
        GROUP BY OrderId
      ) latest_status ON o.OrderId = latest_status.OrderId
      LEFT JOIN order_status os ON latest_status.OrderId = os.OrderId 
        AND latest_status.LatestStatusDate = os.StatusDate
      LEFT JOIN customer c ON o.CustomerId = c.UserId
      WHERE 1=1
    `;
  
    const params = [];
  
    if (status) {
      sqlQuery += ' AND os.Status = ?';
      params.push(status);
    }
  
    if (search) {
      sqlQuery += ` AND (
        o.OrderId LIKE ? 
        OR c.UserName LIKE ? 
        OR c.UserId LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
  
    sqlQuery += ' ORDER BY o.OrderDate DESC';
  
    db.query(sqlQuery, params, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      const processedOrders = results.map(order => ({
        ...order,
        products: JSON.parse(order.products),
        StatusHistory: [] // يمكن إضافة استعلام لجلب التاريخ الكامل للحالات إذا لزم الأمر
      }));
  
      res.json(processedOrders);
    });
  });
  
  // 2. تحديث حالة الطلب
  app.put('/api/admin/orders/:orderId/status', authenticateToken, adminOnly, (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    const validStatuses = ['قيد التنفيذ', 'تم الشحن', 'تم التسليم', 'ملغي'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  
    const sql = `
      INSERT INTO order_status 
      (OrderId, Status, StatusDate)
      VALUES (?, ?, NOW())
    `;
  
    db.query(sql, [orderId, status], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update status' });
      }
  
      res.json({ 
        message: 'Order status updated',
        newStatus: status,
        updateDate: new Date().toISOString()
      });
    });
  });
  
  // 3. حذف الطلب
  app.delete('/api/admin/orders/:orderId', authenticateToken, adminOnly, (req, res) => {
    const { orderId } = req.params;
  
    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: 'Transaction failed' });
  
      // 1. حذف سجل الحالة أولاً
      db.query('DELETE FROM order_status WHERE OrderId = ?', [orderId], (err) => {
        if (err) return rollback(res, err);
  
        // 2. حذف الطلب الرئيسي
        db.query('DELETE FROM orders WHERE OrderId = ?', [orderId], (err) => {
          if (err) return rollback(res, err);
  
          db.commit(err => {
            if (err) return rollback(res, err);
            res.json({ message: 'Order deleted successfully' });
          });
        });
      });
    });
  });
  
  // دالة التراجع عن المعاملة في حال حدوث خطأ
  const rollback = (res, err) => {
    db.rollback(() => {
      console.error('Transaction error:', err);
      res.status(500).json({ error: 'Transaction failed' });
    });
  };  

// Add New Product endpoint
app.post('/api/products', authenticateToken, adminOnly, upload.single('image'), (req, res) => {
    const { name, price, stock, status, description, ingredients } = req.body;
    
    if (!name || !price || !stock || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const imageUrl = req.file 
      ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      : null;
  
    const sql = `
      INSERT INTO products 
      (name, price, stock, status, description, ingredients, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(sql, 
      [name, price, stock, status, description, ingredients, imageUrl],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Server error' });
        }
        
        res.status(201).json({
          id: result.insertId,
          message: 'Product added successfully'
        });
      }
    );
  });
  

// Update Products endpoint
app.put('/api/products/:id', authenticateToken, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, stock, status, description, ingredients } = req.body;
    const image = req.file ? req.file.filename : null;
    /*let imageUrl = existingProduct.image_url;
    if (req.file) {
        imageUrl = `http://localhost:3300/uploads/${req.file.filename}`;
    }*/
    console.log('Received data:', { id, name, price, stock, status, description, ingredients, image });

    if (!name || !price || !stock || !status || !description || !ingredients) {
        return res.status(400).json({ message: 'تأكد من ملء جميع الحقول المطلوبة' });
    }

    const sql = 'UPDATE products SET name = ?, price = ?, stock = ?, status = ?, description = ?, ingredients = ?, image_url = ? WHERE id = ?';
    db.query(sql, [name, price, stock, status, description, ingredients, image, id], (err, results) => {
        if (err) {
            console.error('Error updating product', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete Product endpoint
app.delete('/api/products/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    // جلب معلومات المنتج قبل الحذف
    const getProductSql = 'SELECT image_url FROM products WHERE id = ?';
    db.query(getProductSql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching product', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const imageUrl = results[0].image_url;

        // حذف المنتج من قاعدة البيانات
        const deleteProductSql = 'DELETE FROM products WHERE id = ?';
        db.query(deleteProductSql, [id], (err, results) => {
            if (err) {
                console.error('Error deleting product', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // حذف الصورة من نظام الملفات
            if (imageUrl) {
                const imagePath = path.join('C:', 'Users', 'Moham', 'OneDrive', 'Documents', 'my projects', 'Training projects', 'MHG-Training-Projects', 'project-photos', imageUrl);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file', err);
                    }
                });
            }

            res.json({ message: 'Product deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
