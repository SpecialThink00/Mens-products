const products = [
  {
    id: 'urban-jacket',
    name: 'Urban Jacket',
    price: 149,
    image: 'images/jacket.svg',
    description: 'Industrial-inspired outerwear made from premium heavyweight cotton, designed for versatile everyday wear.',
    sizes: ['Small', 'Medium', 'Large', 'XL']
  },
  {
    id: 'leather-weekender',
    name: 'Leather Weekender',
    price: 220,
    image: 'images/bag.svg',
    description: 'A refined travel bag with a soft leather finish, perfect for weekend getaways and carry-on essentials.',
    sizes: ['One Size']
  }
];

const cartKey = 'atelier_men_cart';
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(updatedCart) {
  cart = updatedCart;
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function findProduct(productId) {
  return products.find(product => product.id === productId) || products[0];
}

function addToCart(productId) {
  const product = findProduct(productId);
  const sizeSelect = document.getElementById('product-size');
  const selectedSize = sizeSelect ? sizeSelect.value : product.sizes[0];

  const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.image
    });
  }

  saveCart(cart);
  alert(`${product.name} (${selectedSize}) added to cart.`);
  renderCart();
}

function removeFromCart(index) {
  const updatedCart = getCart();
  updatedCart.splice(index, 1);
  saveCart(updatedCart);
  renderCart();
}

function renderShop() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${formatCurrency(product.price)}</p>
      <p>${product.description}</p>
      <div class="actions">
        <a class="button button-secondary" href="product.html?product=${product.id}">View Product</a>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function renderProduct() {
  const detail = document.getElementById('product-detail');
  if (!detail) return;

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('product') || 'urban-jacket';
  const product = findProduct(productId);

  detail.innerHTML = `
    <div class="product-page">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <p class="eyebrow">Product</p>
        <h1>${product.name}</h1>
        <p class="price">${formatCurrency(product.price)}</p>
        <p>${product.description}</p>
        <label for="product-size">Size</label>
        <select id="product-size">
          ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
        <button id="product-add-button">Add To Cart</button>
      </div>
    </div>
  `;

  const addButton = document.getElementById('product-add-button');
  if (addButton) {
    addButton.addEventListener('click', () => addToCart(product.id));
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  const currentCart = getCart();
  container.innerHTML = '';

  if (currentCart.length === 0) {
    container.innerHTML = `
      <div class="product-card empty-cart">
        <h3>Your cart is empty.</h3>
        <p><a href="shop.html">Browse our shop</a> and add something nice.</p>
      </div>
    `;
    const totalElement = document.getElementById('total');
    if (totalElement) totalElement.innerText = formatCurrency(0);
    return;
  }

  let total = 0;

  currentCart.forEach((item, index) => {
    total += item.price * item.quantity;
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <strong>${item.name}</strong>
          <span>${item.size}</span>
          <span>${item.quantity} x ${formatCurrency(item.price)}</span>
        </div>
        <div class="item-actions">
          <button onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  const totalElement = document.getElementById('total');
  if (totalElement) totalElement.innerText = formatCurrency(total);
}

function renderCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;

  const currentCart = getCart();
  if (currentCart.length === 0) {
    summary.innerHTML = `
      <div class="product-card empty-cart">
        <h3>No items in your order yet.</h3>
        <p><a href="shop.html">Return to shop</a> to add items.</p>
      </div>
    `;
    return;
  }

  let total = 0;
  summary.innerHTML = `
    <div class="product-card">
      <h2>Order summary</h2>
      <div class="order-items">
        ${currentCart.map(item => {
          total += item.price * item.quantity;
          return `
            <div class="order-item">
              <div>${item.name} (${item.size})</div>
              <div>${item.quantity} × ${formatCurrency(item.price)}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="summary-row">
        <span>Total</span>
        <strong>${formatCurrency(total)}</strong>
      </div>
    </div>
  `;
}

function placeOrder(event) {
  if (!event) return;
  event.preventDefault();

  const currentCart = getCart();
  if (currentCart.length === 0) {
    alert('Your cart is empty. Add items before placing an order.');
    return;
  }

  const form = document.getElementById('checkout-form');
  if (!form) return;

  const name = form.elements['name'].value.trim();
  const email = form.elements['email'].value.trim();
  const address = form.elements['address'].value.trim();
  const city = form.elements['city'].value.trim();
  const postalCode = form.elements['postalCode'].value.trim();
  const country = form.elements['country'].value.trim();

  if (!name || !email || !address || !city || !postalCode || !country) {
    alert('Please complete all required fields before placing your order.');
    return;
  }

  localStorage.removeItem(cartKey);
  cart = [];
  updateCartCount();
  alert(`Thank you, ${name}! Your order has been placed successfully.`);
  window.location.href = 'index.html';
}

function checkout() {
  const currentCart = getCart();
  if (currentCart.length === 0) {
    alert('Your cart is empty. Add items before checking out.');
    return;
  }

  window.location.href = 'checkout.html';
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.innerText = count;
  }
}

function initPage() {
  renderShop();
  renderProduct();
  renderCart();
  renderCheckoutSummary();
  updateCartCount();

  const checkoutButton = document.getElementById('checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', placeOrder);
  }
}

document.addEventListener('DOMContentLoaded', initPage);
