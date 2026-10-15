
const products = [
  {
    id: 1, name: "Classic Dark Chocolate", category: "Dark",
    price: 199, description: "Rich cocoa with an intense flavour.",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "Creamy Milk Chocolate", category: "Milk",
    price: 149, description: "Smooth, creamy and delicious.",
    image: "https://images.unsplash.com/photo-1548907040-4d42f0c7d7c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "Chocolate Gift Box", category: "Gift",
    price: 599, description: "A lovely gift for every occasion.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4, name: "White Chocolate Bliss", category: "White",
    price: 179, description: "Sweet and velvety white chocolate.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5, name: "Chocolate Truffles", category: "Dark",
    price: 349, description: "Delicate bites with a rich centre.",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6, name: "Hazelnut Chocolate", category: "Milk",
    price: 249, description: "Chocolate with a nutty crunch.",
    image: "https://images.unsplash.com/photo-1575377427642-087cf684f29d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7, name: "Luxury Chocolate Hamper", category: "Gift",
    price: 999, description: "A premium surprise for someone special.",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8, name: "Chocolate Pralines", category: "White",
    price: 299, description: "Beautiful little bites of sweetness.",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=600&q=80"
  }
];

const cart = {};

const money = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(amount);

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");

document.getElementById("year").textContent =
  new Date().getFullYear();

// ---------------- PRODUCT DISPLAY ----------------

function renderProducts() {
  const query = document.getElementById("search").value
    .trim().toLowerCase();
  const category = document.getElementById("category").value;

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) &&
    (category === "All" || product.category === category)
  );

  if (!filtered.length) {
    productGrid.innerHTML =
      '<p>No chocolates found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/600x400/f2e4d5/32180f?text=Chocolate'">
      <div class="product-info">
        <span class="product-category">${product.category} Chocolate</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("search").addEventListener(
  "input", renderProducts
);

document.getElementById("category").addEventListener(
  "change", renderProducts
);

// ---------------- SHOPPING CART ----------------

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();

  document.getElementById("cart").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function changeQuantity(id, change) {
  if (!cart[id]) return;

  cart[id] += change;

  if (cart[id] <= 0) delete cart[id];

  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function getTotals() {
  const subtotal = products.reduce((sum, product) => {
    return sum + product.price * (cart[product.id] || 0);
  }, 0);

  const discount = subtotal >= 1000 ? subtotal * 0.05 : 0;
  const delivery = subtotal === 0 || subtotal >= 1000 ? 0 : 50;
  const total = subtotal - discount + delivery;

  return { subtotal, discount, delivery, total };
}

function renderCart() {
  const selectedProducts = products.filter(p => cart[p.id]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  document.getElementById("cart-count").textContent = count;

  if (!selectedProducts.length) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your cart is empty. Add some chocolate!</p>';
  } else {
    cartItems.innerHTML = selectedProducts.map(product => `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <p>${money(product.price)} each</p>
          <div class="quantity">
            <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
            <span>${cart[product.id]}</span>
            <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-btn" data-remove="${product.id}">
            Remove
          </button>
        </div>
        <div class="cart-line-total">
          ${money(product.price * cart[product.id])}
        </div>
      </div>
    `).join("");
  }

  const totals = getTotals();

  document.getElementById("subtotal").textContent =
    money(totals.subtotal);
  document.getElementById("discount").textContent =
    "-" + money(totals.discount);
  document.getElementById("delivery").textContent =
    money(totals.delivery);
  document.getElementById("total").textContent =
    money(totals.total);
}

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.plus) {
    changeQuantity(Number(button.dataset.plus), 1);
  } else if (button.dataset.minus) {
    changeQuantity(Number(button.dataset.minus), -1);
  } else if (button.dataset.remove) {
    removeFromCart(Number(button.dataset.remove));
  }
});

// ---------------- IMAGE CAROUSEL ----------------

const slides = [...document.querySelectorAll(".hero-slide")];
const dotsContainer = document.getElementById("carousel-dots");
let currentSlide = 0;
let carouselTimer;

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = "dot";
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.addEventListener("click", () => showSlide(index));
  dotsContainer.appendChild(dot);
});

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  [...dotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

document.getElementById("prev-slide").addEventListener("click", () => {
  showSlide(currentSlide - 1);
  restartCarousel();
});

document.getElementById("next-slide").addEventListener("click", () => {
  showSlide(currentSlide + 1);
  restartCarousel();
});

showSlide(0);
restartCarousel();

// ---------------- CHECKOUT AND INVOICE ----------------

const checkoutForm = document.getElementById("checkout-form");
const invoice = document.getElementById("invoice");

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!Object.keys(cart).length) {
    alert("Your cart is empty. Please add chocolates first.");
    return;
  }

  if (!checkoutForm.reportValidity()) return;

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const payment = document.getElementById("payment-method").value;
  const totals = getTotals();

  // Create a unique reference for this demo order.
  const orderId = "CB-" + Date.now().toString().slice(-9);

  document.getElementById("invoice-number").textContent =
    "Order ID: " + orderId;

  document.getElementById("invoice-date").textContent =
    "Date: " + new Date().toLocaleString("en-IN");

  // Use textContent to safely display customer-provided data.
  const customerBox = document.getElementById("invoice-customer");
  customerBox.replaceChildren();

  [
    ["Customer", name],
    ["Phone", phone],
    ["Email", email || "Not provided"],
    ["Address", address],
    ["Payment", payment + (payment === "Cash on Delivery"
      ? "" : " (demo — not charged)")],
  ].forEach(([label, value]) => {
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    p.append(strong, document.createTextNode(value));
    customerBox.appendChild(p);
  });

  const lines = document.getElementById("invoice-lines");
  lines.replaceChildren();

  products.filter(product => cart[product.id]).forEach(product => {
    const tr = document.createElement("tr");

    [
      product.name,
      money(product.price),
      String(cart[product.id]),
      money(product.price * cart[product.id])
    ].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    lines.appendChild(tr);
  });

  const totalsBox = document.getElementById("invoice-totals");
  totalsBox.replaceChildren();

  [
    ["Subtotal", totals.subtotal],
    ["Discount", -totals.discount],
    ["Delivery", totals.delivery],
    ["Grand Total", totals.total]
  ].forEach(([label, amount]) => {
    const row = document.createElement("div");
    if (label === "Grand Total") row.className = "invoice-grand";

    const left = document.createElement("span");
    left.textContent = label;

    const right = document.createElement("strong");
    right.textContent = money(amount);

    row.append(left, right);
    totalsBox.appendChild(row);
  });

  invoice.classList.remove("hidden");
  invoice.scrollIntoView({ behavior: "smooth", block: "start" });

  alert("Demo order created! Your invoice is ready.");
});

// Print invoice or save it as PDF from the browser print dialog.
document.getElementById("print-invoice").addEventListener("click", () => {
  window.print();
});

// Reset for the next customer.
document.getElementById("new-order").addEventListener("click", () => {
  Object.keys(cart).forEach(id => delete cart[id]);

  renderCart();
  checkoutForm.reset();
  invoice.classList.add("hidden");

  document.getElementById("cart").scrollIntoView({
    behavior: "smooth"
  });
});

// Initial page render
renderProducts();
renderCart();
