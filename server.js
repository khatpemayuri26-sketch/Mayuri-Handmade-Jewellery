const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const productsFile = path.join(__dirname, 'products.json');
const ordersFile = path.join(__dirname, 'orders.json');
function readJSON(file, fallback = []) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8'); }

app.get('/', (_req, res) => res.json({ ok: true, message: 'Mayuri Handcrafted Jewellery Backend is running.' }));
app.get('/api/products', (_req, res) => res.json(readJSON(productsFile)));
app.get('/api/products/:id', (req, res) => { const p = readJSON(productsFile).find(x => String(x.id) === String(req.params.id)); if (!p) return res.status(404).json({ message: 'Product not found' }); res.json(p); });

app.post('/api/orders', (req, res) => {
  const body = req.body || {};
  const customerName = body.customerName || body.name;
  const { mobile, email = '', address, city, pincode, paymentMethod, items, total } = body;
  if (!customerName || !/^\d{10}$/.test(String(mobile || '')) || !address || !city || !/^\d{6}$/.test(String(pincode || '')) || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Please provide valid customer, address, payment and item details.' });
  }
  const orders = readJSON(ordersFile);
  const newOrder = { orderId: body.orderId || ('MY' + Date.now().toString().slice(-8)), customerName, mobile: String(mobile), email, address, city, pincode: String(pincode), paymentMethod, items, total: Number(total) || 0, status: 'Placed', createdAt: body.createdAt || new Date().toISOString() };
  orders.push(newOrder); writeJSON(ordersFile, orders);
  res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
});
app.get('/api/orders', (_req, res) => res.json(readJSON(ordersFile)));
app.get('/api/orders/:id', (req, res) => { const o = readJSON(ordersFile).find(x => String(x.orderId || x.id) === String(req.params.id)); if (!o) return res.status(404).json({ message: 'Order not found' }); res.json(o); });

app.listen(PORT, () => console.log(`Mayuri Jewellery backend running at http://localhost:${PORT}`));
