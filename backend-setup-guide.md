# Node.js/Express + MySQL Backend Setup Guide

## 1. Project Structure
```
arprints/
├── frontend/          # Your current React app
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # New Express server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── database/          # MySQL scripts
    └── schema.sql
```

## 2. Backend Setup

### Initialize Backend
```bash
mkdir backend
cd backend
npm init -y
```

### Install Dependencies
```bash
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

### Basic Express Server (server.js)
```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arprints_db'
});

// Test DB Connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

// Orders API
app.post('/api/orders', (req, res) => {
  const { name, contactNo, orderDetails, orderType, designChoice, quantity } = req.body;
  
  const query = `
    INSERT INTO orders (name, contact_no, order_details, order_type, design_choice, quantity, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  
  db.query(query, [name, contactNo, orderDetails, orderType, designChoice, quantity], (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Failed to create order' });
    }
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: result.insertId 
    });
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Environment Variables (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=arprints_db
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 3. MySQL Database Setup

### Database Schema (database/schema.sql)
```sql
CREATE DATABASE IF NOT EXISTS arprints_db;
USE arprints_db;

-- Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_no VARCHAR(20) NOT NULL,
  order_details TEXT NOT NULL,
  order_type VARCHAR(100),
  design_choice VARCHAR(100),
  quantity INT NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('photocards', 'instax', 'strips') NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table (Optional)
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO products (name, category, description, price) VALUES
('Matte Photo Cards', 'photocards', 'High-quality matte finish photo cards', 50.00),
('Glossy Photo Cards', 'photocards', 'Glossy finish photo cards', 50.00),
('Instax Mini', 'instax', 'Instax mini size prints', 15.00),
('Photo Strips Classic', 'strips', 'Classic photo strip design', 25.00);
```

## 4. Frontend Integration

### Update Your React App

#### Install Axios for API calls
```bash
cd frontend
npm install axios
```

#### Create API Service (src/services/api.js)
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create order');
    }
  },

  // Get all orders
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      throw new Error('Backend connection failed');
    }
  },
};

export default api;
```

#### Update Order Component (src/pages/Order.js)
```javascript
import { orderAPI } from '../services/api';

// In your handleSubmit function:
const handleSubmit = async () => {
  try {
    setLoading(true);
    
    const orderData = {
      name: formData.name,
      contactNo: formData.contactNo,
      orderDetails: formData.orderDetails,
      orderType: formData.orderType,
      designChoice: formData.designChoice,
      quantity: parseInt(formData.quantity)
    };

    const result = await orderAPI.createOrder(orderData);
    
    // Success handling
    alert(`Order submitted successfully! Order ID: ${result.orderId}`);
    
    // Reset form or redirect
    setFormData({
      name: '',
      contactNo: '',
      orderDetails: '',
      orderType: '',
      designChoice: '',
      quantity: ''
    });
    
  } catch (error) {
    console.error('Order submission error:', error);
    alert('Failed to submit order. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

#### Environment Variables (frontend/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 5. Development Workflow

### Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Production Deployment Options
1. **Separate Hosting**: Deploy React on Netlify/Vercel, API on Heroku/Railway
2. **Same Server**: Serve React build files from Express
3. **Docker**: Containerize both applications

## 6. Useful Features to Add

### Authentication
```javascript
// JWT-based auth for admin panel
app.post('/api/admin/login', async (req, res) => {
  // Verify admin credentials
  // Return JWT token
});
```

### Order Management Dashboard
```javascript
// Protected routes for order management
app.put('/api/orders/:id/status', authenticateAdmin, (req, res) => {
  // Update order status
});
```

### File Upload for Design Images
```javascript
const multer = require('multer');
// Handle design file uploads
```

This setup gives you a professional full-stack application with proper separation of concerns! 