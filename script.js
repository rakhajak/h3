/* ====== Data toko (ditambahkan atribut stock) ====== */
const WA_NUMBER = "6289518035014"; // format: 62 + nomor tanpa 0 di depan
const PRODUCTS = [
  { id: 1,  name: "Gelang Couple Korean Style",  cat: "Gelang",  price: 3000, stock: 0, type: "gelang",   image: "images/gelang-couple.svg", colors: ["#E8407F","#FFD93D","#7ED9B5","#B9A7FF"], tint: "#B9A7FF" },
  { id: 2,  name: "Gelang Handmade",   cat: "Gelang",  price: 8000, stock: 1,  type: "gelang",   image: "images/gelang-handmade.jpeg", colors: ["#FFFFFF","#EFE6D8","#D9CBB5"],          tint: "#FFD93D" },
  { id: 3,  name: "Cincin Black Titanium",   cat: "Cincin",  price: 7000, stock: 0,  type: "cincin",   image: "images/cincin-black-titanium.svg", colors: ["#4FB8D6","#7ED9B5","#FFFFFF"], pendant: "star", tint: "#7ED9B5" },
  { id: 4,  name: "Keychain Obeng 3 in 1",   cat: "Ganci",  price: 2000, stock: 0, type: "ganci",   image: "images/keychain-obeng.svg", colors: ["#231942","#E8407F","#FFD93D"], pendant: "dot",  tint: "#E8407F" },
  { id: 5,  name: "Kaitan Carabiner",    cat: "Ganci",  price: 2000, stock: 4,  type: "ganci",   image: "images/kaitan-carabiner.jpeg", colors: ["#7ED9B5"], style: "drop", tint: "#7ED9B5" },
  { id: 6,  name: "Keychain Triple Dadu",  cat: "Ganci",  price: 2000, stock: 0, type: "ganci",   image: "images/keychain-triple-dadu.svg", colors: ["#FFD93D"], style: "moon", tint: "#FFD93D" },
  { id: 7,  name: "Bag Accessories Handmade",     cat: "Lainnya",  price: 8000, stock: 1,  type: "lainnya",    image: "images/bag-accessories.jpeg", colors: ["#E8407F","#FFD93D"], style: "flower", tint: "#E8407F" }
];

/* State & Utility Variables */
const cart = new Map(); // id -> qty
let filter = "Semua";
const cats = ["Semua", ...new Set(PRODUCTS.map(p => p.cat))];
const $ = id => document.getElementById(id);

const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const circle = (x, y, r, fill, extra = "") => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" ${extra}/>`;
const shine = (x, y, r) => circle(x - r * .3, y - r * .3, r * .28, "#fff", 'opacity=".75"');
const bead = (x, y, r, fill) => circle(x, y, r, fill, 'stroke="rgba(35,25,66,.18)" stroke-width=".8"') + shine(x, y, r);

function art(p) {
  const c = p.colors;
  let s = "";
  if (p.type === "gelang") {
    const n = 14;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      s += bead(50 + 31 * Math.cos(a), 50 + 31 * Math.sin(a), 7, c[i % c.length]);
    }
  } else if (p.type === "cincin") {
    s += `<path d="M 84.8 26 A 36 36 0 0 1 15.2 26" fill="none" stroke="rgba(35,25,66,.35)" stroke-width="1"/>`;
    const n = 13;
    for (let i = 0; i < n; i++) {
      const a = (15 + (150 * i) / (n - 1)) * Math.PI / 180;
      s += bead(50 + 36 * Math.cos(a), 17 + 36 * Math.sin(a), 5, c[i % c.length]);
    }
    if (p.pendant === "star") {
      let pts = "";
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? 4.5 : 10, a = -Math.PI / 2 + i * Math.PI / 5;
        pts += `${(50 + rr * Math.cos(a)).toFixed(1)},${(66 + rr * Math.sin(a)).toFixed(1)} `;
      }
      s += `<polygon points="${pts}" fill="#FFD93D" stroke="rgba(35,25,66,.25)" stroke-width=".8"/>`;
    } else {
      s += bead(50, 66, 7, "#FFD93D");
    }
  } else if (p.type === "ganci") {
    [32, 68].forEach(x => {
      s += `<path d="M ${x} 12 q 6 0 6 7 v 3" fill="none" stroke="rgba(35,25,66,.45)" stroke-width="1.6" stroke-linecap="round" transform="translate(${-3} 0)"/>`;
      s += `<line x1="${x + 3}" y1="22" x2="${x + 3}" y2="34" stroke="rgba(35,25,66,.45)" stroke-width="1.4"/>`;
      if (p.style === "drop") {
        s += `<path d="M ${x + 3} 34 C ${x + 15} 50, ${x + 14} 66, ${x + 3} 66 C ${x - 8} 66, ${x - 9} 50, ${x + 3} 34 Z" fill="${c[0]}" stroke="rgba(35,25,66,.2)" stroke-width=".8"/>`;
        s += circle(x - 1, 52, 2.4, "#fff", 'opacity=".7"');
      } else {
        s += `<path d="M ${x + 3} 34 A 15 15 0 1 0 ${x + 3} 66 A 11 11 0 1 1 ${x + 3} 34 Z" fill="${c[0]}" stroke="rgba(35,25,66,.2)" stroke-width=".8"/>`;
      }
    });
  } else if (p.type === "lainnya") {
    s += `<rect x="12" y="41" width="76" height="18" rx="9" fill="rgba(35,25,66,.78)"/>`;
    if (p.style === "flower") {
      [28, 50, 72].forEach((x, k) => {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          s += circle(x + 7 * Math.cos(a), 50 + 7 * Math.sin(a), 5.2, c[k % 2 === 0 ? 0 : 1] === c[0] ? c[0] : c[1], 'stroke="rgba(35,25,66,.2)" stroke-width=".7"');
        }
        s += circle(x, 50, 3.6, k % 2 === 0 ? c[1] : c[0]);
      });
    } else {
      s += `<path d="M 50 50 L 22 32 Q 16 50 22 68 Z" fill="${c[0]}" stroke="rgba(35,25,66,.2)" stroke-width=".8"/>`;
      s += `<path d="M 50 50 L 78 32 Q 84 50 78 68 Z" fill="${c[0]}" stroke="rgba(35,25,66,.2)" stroke-width=".8"/>`;
      s += `<rect x="43" y="42" width="14" height="16" rx="5" fill="${c[1]}" stroke="rgba(35,25,66,.2)" stroke-width=".8"/>`;
    }
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;
}

function productVisual(p) {
  return p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : art(p);
}

function totals() {
  let count = 0, sum = 0;
  cart.forEach((q, id) => { 
    const p = PRODUCTS.find(x => x.id === id); 
    if (p) {
      count += q; 
      sum += q * p.price; 
    }
  });
  return { count, sum };
}

function renderChips() {
  const chipsEl = $("chips");
  if (!chipsEl) return;
  chipsEl.innerHTML = cats.map(c => `<button type="button" class="chip" aria-pressed="${c === filter}" data-cat="${c}">${c}</button>`).join("");
}

function renderGrid() {
  const gridEl = $("grid");
  if (!gridEl) return;
  const list = PRODUCTS.filter(p => filter === "Semua" || p.cat === filter);
  gridEl.innerHTML = list.map(p => {
    const inCart = cart.get(p.id) || 0;
    const isOutOfStock = p.stock <= 0;
    const isMaxStock = inCart >= p.stock;

    return `<article class="card" style="--tint:${p.tint}">
      <div class="pic">${productVisual(p)}</div>
      <div class="info">
        <div class="cat-row">
          <span class="cat">${p.cat}</span>
          <span class="stock-tag ${isOutOfStock ? 'out' : ''}">
            ${isOutOfStock ? 'Stok Habis' : 'Stok: ' + p.stock}
          </span>
        </div>
        <span class="name">${p.name}</span>
        <span class="price">${rupiah(p.price)}</span>
        <div class="actions">
          <button type="button" class="add ${inCart ? "done" : ""}" data-add="${p.id}" ${isOutOfStock || isMaxStock ? "disabled" : ""}>
            ${isOutOfStock ? "Habis" : inCart ? "Di keranjang (" + inCart + ")" : "Tambah"}
          </button>
          ${inCart ? `<button type="button" class="cancel" data-remove="${p.id}" aria-label="Batalkan ${p.name}">Batal</button>` : ""}
        </div>
      </div>
    </article>`;
  }).join("");
}

function renderCart() {
  const { count, sum } = totals();
  const bar = $("bar");
  const sheet = $("sheet");
  
  if (bar && sheet) {
    bar.hidden = count === 0 || !sheet.hidden;
  }
  
  if ($("barCount")) $("barCount").textContent = count + " barang";
  if ($("barTotal")) $("barTotal").textContent = rupiah(sum) + " · Lihat keranjang";
  if ($("sheetTotal")) $("sheetTotal").textContent = rupiah(sum);
  
  const itemsEl = $("items");
  if (itemsEl) {
    if (count === 0) {
      itemsEl.innerHTML = `<p class="empty">Keranjangmu masih kosong. Pilih produk dulu ya.</p>`;
    } else {
      itemsEl.innerHTML = [...cart.entries()].map(([id, q]) => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return "";
        const isMax = q >= p.stock;
        return `<div class="row" style="--tint:${p.tint}">
          <div class="thumb">${productVisual(p)}</div>
          <div><div class="t">${p.name}</div><div class="p">${rupiah(p.price)}</div></div>
          <div class="qty">
            <button type="button" data-dec="${id}" aria-label="Kurangi ${p.name}">&minus;</button>
            <span>${q}</span>
            <button type="button" data-inc="${id}" ${isMax ? "disabled" : ""} aria-label="Tambah ${p.name}">+</button>
          </div>
        </div>`;
      }).join("");
    }
  }

  const lines = [...cart.entries()].map(([id, q]) => {
    const p = PRODUCTS.find(x => x.id === id);
    return p ? `- ${p.name} x${q} (${rupiah(p.price * q)})` : "";
  }).filter(Boolean);

  const buyerInput = $("buyer");
  const name = buyerInput ? buyerInput.value.trim() : "";
  const msg = `Halo Admin h3_accessories, saya${name ? " " + name : ""} bermaksud untuk memesan:\n\n${lines.join("\n")}\n\nTotal Pembayaran: ${rupiah(sum)}\n\nBoleh minta konfirmasinya apakah seluruh stok produk tersebut saat ini masih tersedia? Terima kasih.`;
  
  const order = $("order");
  if (order) {
    order.href = count ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}` : "#";
    order.style.opacity = count ? 1 : .5;
    order.style.pointerEvents = count ? "auto" : "none";
  }
}

function setQty(id, q) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (q > p.stock) q = p.stock;
  q <= 0 ? cart.delete(id) : cart.set(id, q);
  renderGrid();
  renderCart();
}

function openSheet() { 
  if ($("sheet")) $("sheet").hidden = false; 
  if ($("overlay")) $("overlay").hidden = false; 
  if ($("bar")) $("bar").hidden = true; 
  if ($("closeCart")) $("closeCart").focus(); 
}

function closeSheet() { 
  if ($("sheet")) $("sheet").hidden = true; 
  if ($("overlay")) $("overlay").hidden = true; 
  renderCart(); 
  if ($("openCart")) $("openCart").focus({ preventScroll: true }); 
}

/* Event Listeners */
document.addEventListener("click", e => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.cat) { filter = t.dataset.cat; renderChips(); renderGrid(); }
  else if (t.dataset.add) { const id = +t.dataset.add; setQty(id, (cart.get(id) || 0) + 1); }
  else if (t.dataset.remove) { setQty(+t.dataset.remove, 0); }
  else if (t.dataset.inc) { const id = +t.dataset.inc; setQty(id, (cart.get(id) || 0) + 1); }
  else if (t.dataset.dec) { const id = +t.dataset.dec; setQty(id, (cart.get(id) || 0) - 1); }
});

document.addEventListener("DOMContentLoaded", () => {
  if ($("openCart")) $("openCart").addEventListener("click", openSheet);
  if ($("closeCart")) $("closeCart").addEventListener("click", closeSheet);
  if ($("overlay")) $("overlay").addEventListener("click", closeSheet);
  if ($("buyer")) $("buyer").addEventListener("input", renderCart);
  
  document.addEventListener("keydown", e => { 
    if (e.key === "Escape" && $("sheet") && !$("sheet").hidden) closeSheet(); 
  });

  if ($("waLink")) $("waLink").href = `https://wa.me/${WA_NUMBER}`;

  /* SVG Icon untuk Mode Terang & Mode Gelap */
    const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    const themeBtn = $("themeToggle");
    if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isLight = document.documentElement.dataset.theme !== "light";
        document.documentElement.dataset.theme = isLight ? "light" : "dark";
        
        // Gunakan innerHTML agar mengganti Ikon SVG, BUKAN teks
        themeBtn.innerHTML = isLight ? moonIcon : sunIcon;
        themeBtn.setAttribute("aria-label", isLight ? "Aktifkan mode gelap" : "Aktifkan mode terang");
        themeBtn.setAttribute("aria-pressed", String(isLight));
    });
    }

  renderChips(); 
  renderGrid(); 
  renderCart();
});