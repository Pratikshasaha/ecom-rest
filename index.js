require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
var nodemailer = require('nodemailer');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.sendStatus(204);
  }

  next();
});

// Initialize Prisma client
const prisma = new PrismaClient();

app.get('/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user', details: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Unable to fetch users', details: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Unable to fetch user profile', details: error.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    // Send welcome email
    try {
      if (req.body.status == 'approved') {
        const transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: 'info@rishfotechsolutions.com',
            pass: 'Launch@12345'
          }
        });

        await transporter.sendMail({
          from: `"Ecom" <${'no-reply@ecom.com'}>`,
          to: req.body.email,
          subject: 'Welcome to Precia Ecom Store!',
          html: `<h1>Hi ${req.body.name}!</h1><p>Your account has been Approved successfully by Precia.</p><p>User ID: ${req.body.id}</p><p>Email: ${req.body.email}</p><p>Thank you!</p>`
        });
        console.log('Welcome email sent to', req.body.email);
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    const user = await prisma.user.update({
      where: { id },
      data: req.body
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Unable to update user', details: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Product routes
app.post('/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Unable to create product', details: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Unable to fetch products', details: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Unable to fetch product', details: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Unable to update product', details: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot delete superadmin' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Unable to delete user', details: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Unable to delete product', details: error.message });
  }
});

// Order routes
app.post('/orders', async (req, res) => {
  try {
    const order = await prisma.order.create({
      data: req.body
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Unable to create order', details: error.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Unable to fetch orders', details: error.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Unable to fetch order', details: error.message });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: req.body
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Unable to update order', details: error.message });
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Unable to delete order', details: error.message });
  }
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
