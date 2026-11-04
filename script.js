// DADOS DO CARDÁPIO
const menuData = [
  {
    id: 1,
    name: "Calabresa Especial",
    category: "tradicionais",
    description: "Linguicinha calabresa fatiada, cebola roxa, azeitonas pretas e orégano fresco.",
    price: 48.90,
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500"
  },
  {
    id: 2,
    name: "Margherita Tradicional",
    category: "tradicionais",
    description: "Muçarela de cura natural, fatias de tomate fresco, manjericão e azeite extravirgem.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500"
  },
  {
    id: 3,
    name: "Quatro Queijos Mordomia",
    category: "especiais",
    description: "Combinação perfeita de Muçarela, Gorgonzola cremoso, Catupiry original e Parmessão.",
    price: 56.90,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
  },
  {
    id: 4,
    name: "Frango com Catupiry",
    category: "tradicionais",
    description: "Frango desfiado temperado, coberto com o autêntico Catupiry e milho selecionado.",
    price: 52.00,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
  },
  {
    id: 5,
    name: "Nutella com Morango",
    category: "doces",
    description: "Creme de Nutella abundante, morangos frescos fatiados e raspa de chocolate branco.",
    price: 42.00,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500"
  },
  {
    id: 6,
    name: "Coca-Cola 2 Litros",
    category: "bebidas",
    description: "Refrigerante Coca-Cola Garrafa 2L super gelada.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"
  }
];

let cart = [];

// RENDERIZAR CARDÁPIO
function renderMenu(category = "todas") {
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";

  const filtered = category === "todas" 
    ? menuData 
    : menuData.filter(item => item.category === category);

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "pizza-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="pizza-img" />
      <div class="pizza-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="pizza-bottom">
          <span class="pizza-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
          <button class="btn btn-primary" onclick="addToCart(${item.id})">
            Adicionar
          </button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// CARRINHO
function addToCart(id) {
  const item = menuData.find(prod => prod.id === id);
  const existing = cart.find(prod => prod.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  openCart();
}

function updateQty(id, change) {
  const item = cart.find(prod => prod.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(prod => prod.id !== id);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartBadge");
  const subtotalPrice = document.getElementById("subtotalPrice");
  const totalPrice = document.getElementById("totalPrice");

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;
  let totalQty = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    totalQty += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartBadge.innerText = totalQty;
  subtotalPrice.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  totalPrice.innerText = `R$ ${(subtotal + (cart.length > 0 ? 5 : 0)).toFixed(2).replace('.', ',')}`;
}

// CONTROLAR DRAWER DO CARRINHO
const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() { cartDrawer.classList.add("active"); }
function closeCart() { cartDrawer.classList.remove("active"); }

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// FILTROS
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderMenu(e.target.dataset.category);
  });
});

// CHECKOUT WHATSAPP
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const name = document.getElementById("custName").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const payment = document.getElementById("payMethod").value;

  if (!name || !address) {
    alert("Por favor, preencha o seu nome e endereço de entrega.");
    return;
  }

  let text = `*NOVO PEDIDO - PIZZARIA MORDOMIA* 🍕\n\n`;
  text += `*Cliente:* ${name}\n`;
  text += `*Endereço:* ${address}\n`;
  text += `*Forma de Pagamento:* ${payment}\n\n`;
  text += `*ITENS:*\n`;

  let total = 0;
  cart.forEach(item => {
    text += `- ${item.qty}x ${item.name} (R$ ${(item.price * item.qty).toFixed(2)})\n`;
    total += item.price * item.qty;
  });

  text += `\n*Subtotal:* R$ ${total.toFixed(2)}`;
  text += `\n*Taxa de Entrega:* R$ 5,00`;
  text += `\n*TOTAL:* R$ ${(total + 5).toFixed(2)}`;

  const encodedText = encodeURIComponent(text);
  const phone = "5511999999999"; // Substitua pelo número real
  window.open(`https://wa.me/${phone}?text=${encodedText}`, "_blank");
});

// CHECAR STATUS DA LOJA (ABERTO OU FECHADO)
function checkStoreStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const hour = now.getHours();
  
  const statusEl = document.getElementById("storeStatus");
  const badgeEl = statusEl ? statusEl.parentElement : null;

  if (!statusEl || !badgeEl) return;

  // Segunda fecha
  if (day === 1) {
    statusEl.innerText = "Fechado Hoje";
    badgeEl.classList.remove("open");
    return;
  }

  // Horários: 18h às 23h30 / 00h
  if (hour >= 18 && hour < 24) {
    statusEl.innerText = "Aberto Agora";
    badgeEl.classList.add("open");
  } else {
    statusEl.innerText = "Fechado Agora";
    badgeEl.classList.remove("open");
  }
}

// INICIALIZAR
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  checkStoreStatus();
  lucide.createIcons();
});