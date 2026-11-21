const CART_KEY = 'mayuriCart';
function readCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch{return[];} }
function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c)); updateCount();}
function updateCount(){const n=readCart().reduce((s,i)=>s+Number(i.quantity||1),0);document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=n);}
function imgPath(x){if(!x)return '../images/logo.png'; if(x.startsWith('../'))return x; if(x.startsWith('images/'))return '../'+x; return '../images/'+x;}
function displayCart(){
 const cart=readCart(), box=document.getElementById('cartItems'), summary=document.getElementById('cartSummary'); if(!box||!summary)return;
 if(!cart.length){box.innerHTML='<div class="empty-cart"><h2>Your Cart is Empty</h2><p>Looks like you haven\'t added any jewellery yet.</p><a href="products.html"><button>CONTINUE SHOPPING</button></a></div>';summary.innerHTML='';updateCount();return;}
 let total=0;
 box.innerHTML=cart.map((item,i)=>{const q=Number(item.quantity||1), price=Number(item.price||0), t=q*price;total+=t;return `<div class="cart-item"><img src="${imgPath(item.image)}" alt="${item.name}"><div><h3>${item.name}</h3><p>${item.category||''}</p><p>₹${price}</p><div class="cart-quantity"><button onclick="changeQuantity(${i},-1)">−</button><span>${q}</span><button onclick="changeQuantity(${i},1)">+</button></div></div><div class="cart-price"><strong>₹${t}</strong><button class="remove-btn" onclick="removeProduct(${i})">Remove</button></div></div>`;}).join('');
 summary.innerHTML=`<div class="cart-summary"><div class="summary-row"><span>Subtotal</span><span>₹${total}</span></div><div class="summary-row"><span>Delivery</span><span>FREE</span></div><div class="summary-row summary-total"><span>Total</span><span>₹${total}</span></div><button class="checkout-btn" onclick="goToCheckout()">PROCEED TO CHECKOUT</button></div><a href="products.html" class="continue-shopping">← Continue Shopping</a>`;
 updateCount();
}
function changeQuantity(i,d){const c=readCart();if(!c[i])return;c[i].quantity=Number(c[i].quantity||1)+d;if(c[i].quantity<=0)c.splice(i,1);saveCart(c);displayCart();}
function removeProduct(i){const c=readCart();if(!c[i])return;if(confirm('Remove '+c[i].name+' from your cart?')){c.splice(i,1);saveCart(c);displayCart();}}
function goToCheckout(){if(!readCart().length){alert('Your cart is empty!');return;}location.href='checkout.html';}
document.addEventListener('DOMContentLoaded',displayCart);
