/* Mayuri Handcrafted Jewellery - common frontend logic */
const MAYURI_PRODUCTS = [
  { id: 1, name: 'Traditional Designer Nath', shortName: 'Designer Nath', category: 'Nath', price: 499, image: 'nath.jpeg', description: 'A graceful traditional Nath handcrafted for festive and bridal looks.' },
  { id: 2, name: 'Handcrafted Mangalsutra', shortName: 'Handcrafted Mangalsutra', category: 'Mangalsutra', price: 899, image: 'mangalsutra.jpeg', description: 'Elegant handcrafted Mangalsutra with a classic traditional finish.' },
  { id: 3, name: 'Traditional Challa', shortName: 'Traditional Challa', category: 'Challa', price: 699, image: 'challa.jpeg', description: 'Traditional waist jewellery designed to add a beautiful festive touch.' },
  { id: 4, name: 'Designer Ear Cuffs', shortName: 'Designer Ear Cuffs', category: 'Ear Cuffs', price: 349, image: 'ear cuffs.jpeg', description: 'Stylish lightweight ear cuffs for a modern handcrafted look.' }
];

const CART_KEY = 'mayuriCart';
const ORDERS_KEY = 'mayuriOrders';
const WISHLIST_KEY = 'mayuriWishlist';

function readStorage(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeStorage(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getCart() { return readStorage(CART_KEY, []); }
function saveCart(cart) { writeStorage(CART_KEY, cart); updateCartCount(); }
function getOrders() { return readStorage(ORDERS_KEY, []); }
function saveOrders(orders) { writeStorage(ORDERS_KEY, orders); }
function productById(id) { return MAYURI_PRODUCTS.find(p => p.id === Number(id)); }
function imagePath(image, page = 'root') {
  if (!image) return page === 'root' ? 'images/logo.png' : '../images/logo.png';
  if (image.startsWith('http') || image.startsWith('/') || image.startsWith('../') || image.startsWith('images/')) {
    return page === 'root' ? image : (image.startsWith('images/') ? '../' + image : image);
  }
  return page === 'root' ? 'images/' + image : '../images/' + image;
}
function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

function addProductToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id || item.name === product.name);
  if (existing) existing.quantity = Number(existing.quantity || 1) + Number(quantity || 1);
  else cart.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, category: product.category, quantity: Number(quantity || 1) });
  saveCart(cart);
  alert(product.name + ' added to cart!');
}

function buyProduct(product, quantity = 1) {
  addProductToCart(product, quantity);
  window.location.href = 'checkout.html';
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}

function setupHome() {
  const customBtn = document.querySelector('[data-custom-order]');
  const form = document.getElementById('customOrderForm');
  if (customBtn && form) customBtn.addEventListener('click', () => form.scrollIntoView({ behavior: 'smooth' }));
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const requests = readStorage('mayuriCustomOrders', []);
    requests.push({ id: 'CO' + Date.now(), ...data, createdAt: new Date().toISOString(), status: 'Received' });
    writeStorage('mayuriCustomOrders', requests);
    alert('Your custom order request has been received!');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => { updateCartCount(); setupHome(); });
