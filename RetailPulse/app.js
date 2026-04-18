const alerts = [
  {
    id: 1,
    type: "Price",
    severity: "high",
    product: "Purely Fresh 12oz",
    owner: "Competitor",
    title: "Direct competitor dropped price 14%",
    copy: "FreshCo moved from $4.98 to $4.28 overnight, creating a $0.70 gap against your premium SKU.",
    meta: ["Walmart", "Price gap: 16%", "Confidence 92%"],
    time: "6:02 AM",
  },
  {
    id: 2,
    type: "Availability",
    severity: "high",
    product: "RetailCo Family Pack",
    owner: "Owned",
    title: "Owned SKU went out of stock",
    copy: "The 24oz family pack is unavailable in 38% of checked ZIP codes after two weeks of rising velocity.",
    meta: ["Target", "Distribution risk", "Confidence 88%"],
    time: "5:41 AM",
  },
  {
    id: 3,
    type: "Promo",
    severity: "medium",
    product: "ValueChoice 16oz",
    owner: "Competitor",
    title: "Rollback promotion started",
    copy: "ValueChoice launched a rollback and gained one category search position within the same scan window.",
    meta: ["Walmart", "Rank +1", "Confidence 81%"],
    time: "4:58 AM",
  },
  {
    id: 4,
    type: "Content",
    severity: "medium",
    product: "PrimeHarvest 10oz",
    owner: "Competitor",
    title: "Competitor replaced main image",
    copy: "PrimeHarvest changed to a lifestyle image and added a benefit-led first bullet focused on protein.",
    meta: ["Amazon", "Image update", "Confidence 77%"],
    time: "3:36 AM",
  },
  {
    id: 5,
    type: "Price",
    severity: "low",
    product: "RetailCo Singles",
    owner: "Owned",
    title: "Price returned to baseline",
    copy: "Your singles SKU ended its temporary discount and now sits 4% above the category median.",
    meta: ["Target", "Promo ended", "Confidence 85%"],
    time: "2:20 AM",
  },
  {
    id: 6,
    type: "Content",
    severity: "low",
    product: "New entrant: ThriveJar",
    owner: "Competitor",
    title: "New premium entrant detected",
    copy: "ThriveJar appeared in the top 30 category results with premium positioning and strong early reviews.",
    meta: ["Walmart", "New SKU", "Confidence 73%"],
    time: "1:14 AM",
  },
];

const products = [
  {
    id: "owned-family",
    name: "RetailCo Family Pack",
    brand: "RetailCo",
    role: "Owned",
    retailer: "Target",
    price: "$8.98",
    status: "Out of stock",
    rating: "4.6",
    reviews: "2,184",
    accent: "#12785c",
    timeline: [
      ["Today", "Out-of-stock detected across 38% of checked ZIP codes."],
      ["Yesterday", "Review count increased by 42; rating held at 4.6."],
      ["Apr 15", "Velocity rose 11% week over week in uploaded POS extract."],
    ],
  },
  {
    id: "purely-fresh",
    name: "Purely Fresh 12oz",
    brand: "FreshCo",
    role: "Competitor",
    retailer: "Walmart",
    price: "$4.28",
    status: "In stock",
    rating: "4.4",
    reviews: "1,032",
    accent: "#0f6c7b",
    timeline: [
      ["Today", "Price dropped from $4.98 to $4.28."],
      ["Apr 17", "Rollback badge appeared on product tile."],
      ["Apr 12", "Search rank improved from #8 to #6."],
    ],
  },
  {
    id: "primeharvest",
    name: "PrimeHarvest 10oz",
    brand: "PrimeHarvest",
    role: "Competitor",
    retailer: "Amazon",
    price: "$6.49",
    status: "In stock",
    rating: "4.7",
    reviews: "846",
    accent: "#335f9f",
    timeline: [
      ["Today", "Main image and first bullet updated."],
      ["Apr 16", "Review velocity increased 18% versus prior week."],
      ["Apr 10", "Coupon removed from PDP."],
    ],
  },
  {
    id: "retailco-singles",
    name: "RetailCo Singles",
    brand: "RetailCo",
    role: "Owned",
    retailer: "Target",
    price: "$5.49",
    status: "In stock",
    rating: "4.5",
    reviews: "1,578",
    accent: "#9a6a0a",
    timeline: [
      ["Today", "Temporary discount ended; price returned to $5.49."],
      ["Apr 17", "Share held steady in local file extract."],
      ["Apr 14", "Description updated with new nutrition claim."],
    ],
  },
];

const viewTitles = {
  dashboard: "What changed in the last 24 hours",
  feed: "Alert feed",
  products: "Product workspace",
  digest: "Daily digest preview",
};

let activeFilter = "all";
let selectedProductId = products[0].id;

function severityClass(severity) {
  return `severity-${severity}`;
}

function alertMarkup(alert) {
  return `
    <article class="alert-item" data-type="${alert.type}" data-search="${[
      alert.type,
      alert.product,
      alert.title,
      alert.copy,
      alert.owner,
    ].join(" ").toLowerCase()}">
      <span class="severity-dot ${severityClass(alert.severity)}" aria-label="${alert.severity} severity"></span>
      <div>
        <p class="alert-title">${alert.title}</p>
        <p class="alert-copy">${alert.copy}</p>
        <div class="alert-meta">
          <span>${alert.time}</span>
          <span>${alert.product}</span>
          ${alert.meta.map((item) => `<span>${item}</span>`).join("")}
        </div>
      </div>
      <span class="pill">${alert.type}</span>
    </article>
  `;
}

function renderAlerts() {
  const query = document.querySelector("#search-input").value.trim().toLowerCase();
  const filtered = alerts.filter((alert) => {
    const matchesFilter = activeFilter === "all" || alert.type === activeFilter;
    const searchable = [alert.type, alert.product, alert.title, alert.copy, alert.owner].join(" ").toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });

  document.querySelector("#top-alerts").innerHTML = alerts.slice(0, 4).map(alertMarkup).join("");
  document.querySelector("#feed-list").innerHTML = filtered.length
    ? filtered.map(alertMarkup).join("")
    : `<div class="panel"><h2>No matching alerts</h2><p>Try a broader search or a different event type.</p></div>`;

  document.querySelector("#digest-items").innerHTML = alerts.slice(0, 5).map((alert) => `
    <article class="digest-item">
      <strong>${alert.title}</strong>
      <span>${alert.copy}</span>
      <small>${alert.product} · ${alert.type} · ${alert.time}</small>
    </article>
  `).join("");
}

function renderProducts() {
  document.querySelector("#product-list").innerHTML = products.map((product) => `
    <button class="product-row ${product.id === selectedProductId ? "active" : ""}" data-product-id="${product.id}" type="button">
      <span class="product-thumb" style="background:${product.accent}">${product.brand.slice(0, 2).toUpperCase()}</span>
      <span>
        <span class="product-name">${product.name}</span>
        <span class="product-meta">${product.brand} · ${product.retailer} · ${product.role}</span>
      </span>
      <span class="pill">${product.status}</span>
    </button>
  `).join("");

  const product = products.find((item) => item.id === selectedProductId);
  document.querySelector("#product-detail").innerHTML = `
    <div class="panel-heading">
      <div>
        <h2>${product.name}</h2>
        <p>${product.brand} · ${product.retailer} · ${product.role}</p>
      </div>
      <span class="pill">${product.status}</span>
    </div>
    <div class="metric-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <article class="metric-card"><span>Current price</span><strong>${product.price}</strong><small>Latest snapshot</small></article>
      <article class="metric-card"><span>Rating</span><strong>${product.rating}</strong><small>${product.reviews} reviews</small></article>
      <article class="metric-card"><span>Role</span><strong style="font-size:22px">${product.role}</strong><small>Watchlist label</small></article>
    </div>
    <div class="timeline">
      ${product.timeline.map(([time, text]) => `
        <div class="timeline-row">
          <span class="timeline-time">${time}</span>
          <span>${text}</span>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll("[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedProductId = button.dataset.productId;
      renderProducts();
    });
  });
}

function setView(view) {
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.querySelector(`#${view}-view`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  document.querySelector("#view-title").textContent = viewTitles[view];
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelectorAll("[data-view-jump]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.viewJump));
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => item.classList.toggle("active", item === button));
    renderAlerts();
  });
});

document.querySelector("#search-input").addEventListener("input", renderAlerts);

document.querySelector("#simulate-btn").addEventListener("click", () => {
  const metric = document.querySelector("#metric-high");
  metric.textContent = Number(metric.textContent) + 1;
  alerts.unshift({
    id: Date.now(),
    type: "Promo",
    severity: "high",
    product: "FreshCo Club Pack",
    owner: "Competitor",
    title: "New competitor coupon detected",
    copy: "FreshCo added a $1.00 coupon on a high-overlap SKU. Retail Pulse recommends watching conversion and rank movement today.",
    meta: ["Walmart", "Coupon", "Confidence 79%"],
    time: "Now",
  });
  renderAlerts();
  setView("feed");
});

renderAlerts();
renderProducts();
