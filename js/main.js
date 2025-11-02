// Product data
const products = [
  {
    id: 1,
    name: 'Aurora Pro X',
    price: 299.99,
    category: 'wireless',
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23667eea" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="80" fill="white" opacity="0.3"%3EAurora Pro X%3C/text%3E%3C/svg%3E',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    features: ['Active Noise Cancellation', '30h Battery Life', 'Bluetooth 5.0', 'Built-in Mic']
  },
  // Add more products as needed
];

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const navbar = document.getElementById('navbar');
const customCursor = document.getElementById('customCursor');
const themeToggle = document.getElementById('themeToggle');
const productCarousel = document.getElementById('productCarousel');
const newArrivalsContainer = document.getElementById('newArrivals');

// Initialize the application
function init() {
  setupEventListeners();
  renderProductCarousel();
  renderNewArrivals();
  checkScroll();
  observeElements();
  
  // Apply saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '☀️';
  }
}

// Set up event listeners
function setupEventListeners() {
  // Custom cursor
  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
    customCursor.classList.add('active');
  });

  // Hover effects for cursor
  const hoverElements = document.querySelectorAll('a, button, .product-card, .category-tile');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
  });

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Scroll event
  window.addEventListener('scroll', checkScroll);
}

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Render product carousel
function renderProductCarousel() {
  if (!productCarousel) return;
  
  const featuredProducts = products.slice(0, 5); // Get first 5 products
  
  productCarousel.innerHTML = featuredProducts.map(product => `
    <div class="product-card bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div class="relative h-64 overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        <button class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-all"
                onclick="toggleWishlist(${product.id}, this)">
          ❤️
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4">$${product.price.toFixed(2)}</p>
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onclick="openProductModal(${product.id})">
          View Details
        </button>
      </div>
    </div>
  `).join('');
}

// Render new arrivals
function renderNewArrivals() {
  if (!newArrivalsContainer) return;
  
  newArrivalsContainer.innerHTML = products.map(product => `
    <div class="product-card bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div class="relative h-64 overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        <button class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-all"
                onclick="toggleWishlist(${product.id}, this)">
          ❤️
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4">$${product.price.toFixed(2)}</p>
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onclick="openProductModal(${product.id})">
          View Details
        </button>
      </div>
    </div>
  `).join('');
}

// Toggle wishlist
function toggleWishlist(productId, iconElement) {
  const index = wishlist.indexOf(productId);
  if (index === -1) {
    wishlist.push(productId);
    iconElement.classList.add('text-red-500');
  } else {
    wishlist.splice(index, 1);
    iconElement.classList.remove('text-red-500');
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Open product modal
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  const modalContent = `
    <div class="grid md:grid-cols-2">
      <div class="bg-gradient-to-br from-purple-600 to-pink-600 p-12 flex items-center justify-center">
        <img src="${product.image}" alt="${product.name}" class="max-h-96 w-auto">
      </div>
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-3xl font-bold mb-2">${product.name}</h2>
            <p class="text-2xl font-semibold text-purple-600">$${product.price.toFixed(2)}</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600" id="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-6">${product.description}</p>
        <div class="mb-8">
          <h3 class="text-lg font-semibold mb-3">Features</h3>
          <ul class="grid grid-cols-2 gap-2">
            ${product.features.map(feature => `<li class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              ${feature}
            </li>`).join('')}
          </ul>
        </div>
        <div class="flex space-x-4">
          <button class="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Add to Cart
          </button>
          <button class="p-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  modal.querySelector('.modal-content').innerHTML = modalContent;
  modal.classList.add('active');
  
  // Add event listener to close button
  const closeButton = modal.querySelector('#closeModal');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  
  // Here you would typically send this to your backend
  console.log('Subscribing email:', email);
  
  // Show success message
  const successMessage = document.createElement('div');
  successMessage.className = 'mt-4 p-3 bg-green-100 text-green-700 rounded';
  successMessage.textContent = 'Thank you for subscribing!';
  e.target.appendChild(successMessage);
  
  // Reset form
  e.target.reset();
  
  // Remove success message after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

// Check scroll position for navbar effects
function checkScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled', 'bg-white/80', 'shadow-md');
    navbar.classList.remove('bg-transparent');
  } else {
    navbar.classList.remove('scrolled', 'bg-white/80', 'shadow-md');
    navbar.classList.add('bg-transparent');
  }
}

// Intersection Observer for fade-in animations
function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe all elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally for inline event handlers
window.toggleWishlist = toggleWishlist;
window.openProductModal = openProductModal;
