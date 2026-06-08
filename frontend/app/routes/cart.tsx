import { Link } from "react-router";

export default function Cart() {
  const cartItems = [
    { id: 1, seller: "@thrift.lover", sales: 342, rating: 4.9, name: "Levi's Denim Jacket — Vintage '90s", size: "Size S", condition: "Like New", color: "Stone Blue", emoji: "👗", price: 38, was: 120, save: 82 },
    { id: 2, seller: "@bag.boutique", sales: 891, rating: 5.0, name: "Coach Leather Tote — Classic", size: "One Size", condition: "Very Good", color: "Tan", emoji: "👜", price: 78, was: 280, save: 202 },
    { id: 3, seller: "@menswear.finds", sales: 156, rating: 4.8, name: "Ralph Lauren Oxford Shirt — Slim Fit", size: "Size L", condition: "Excellent", color: "White / Blue stripe", emoji: "👔", price: 22, was: 85, save: 63 }
  ];

  const savedItems = [
    { id: 4, name: "Wool Peacoat", price: 45, emoji: "🧥" },
    { id: 5, name: "Straw Sun Hat", price: 12, emoji: "👒" }
  ];

  return (
    <div className="page-content cart-layout">
      {/* LEFT COLUMN: CART ITEMS */}
      <div className="cart-main">
        <div className="cart-header-row">
          <div className="cart-h1-group">
            <h1 className="cart-h1" style={{ marginBottom: 0 }}>YOUR CART</h1>
            <div className="cart-count-pill">3 items</div>
          </div>
          <button className="clear-all">Clear all</button>
        </div>

        {/* Shipping Banner */}
        <div className="shipping-banner">
          <div className="shipping-banner-left">
            🚚 You're <span>$8.00</span> away from <span>FREE shipping!</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="progress-track"><div className="progress-fill" style={{ width: '77%' }}></div></div>
            <div className="shipping-amt">$27/$35</div>
          </div>
        </div>

        {/* Cart Item List */}
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-img">{item.emoji}</div>
              <div className="cart-item-body">
                <div className="seller-info">
                  <span>⭐</span> {item.seller} · {item.sales} sales · {item.rating} rating
                </div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {item.size} <span className="item-condition-badge">{item.condition}</span> {item.color}
                </div>
                <div className="cart-item-actions">
                  <div className="qty-ctrl">
                    <button className="qty-b">−</button>
                    <div className="qty-n">1</div>
                    <button className="qty-b">+</button>
                  </div>
                  <button className="action-link">Remove</button>
                  <button className="action-link">Save for later</button>
                </div>
              </div>
              <div className="price-col">
                <div className="cart-item-price">${item.price}</div>
                <div className="price-was">${item.was}</div>
                <div className="savings-pill">You save ${item.save}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Saved For Later */}
        <div className="saved-section">
          <h2 className="saved-h2">SAVED FOR LATER — 2 ITEMS</h2>
          <div className="saved-grid">
            {savedItems.map(item => (
              <div key={item.id} className="saved-card">
                <div className="saved-img">{item.emoji}</div>
                <div>
                  <div className="saved-name">{item.name}</div>
                  <div className="saved-price">${item.price}</div>
                </div>
                <button className="btn-outline-sm">Move to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ORDER SUMMARY */}
      <div className="cart-panel">
        <h2 className="cart-panel-title">ORDER SUMMARY</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <div className="sum-row"><span className="sk">Subtotal (3 items)</span> <span>$138.00</span></div>
          <div className="sum-row"><span className="sk">Original retail value</span> <span style={{ textDecoration: 'line-through' }}>$485.00</span></div>
          <div className="sum-row"><span className="sk">Shipping</span> <span style={{ color: '#4A6741' }}>FREE 🎉</span></div>
          <div className="sum-row"><span className="sk">Estimated tax (BC)</span> <span>$11.04</span></div>
        </div>

        <div className="promo-row">
          <input type="text" className="promo-inp" placeholder="PROMO CODE" />
          <button className="promo-btn">APPLY</button>
        </div>

        <div className="total-row">
          <span className="tk">Total</span>
          <div style={{ textAlign: 'right' }}>
            <div className="tv">$149.04</div>
            <div style={{ fontSize: '11px', color: '#4A6741', fontWeight: 700, marginTop: '4px' }}>
              🎉 You're saving $347 vs. retail!
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <button className="btn-primary" style={{ width: '100%', fontSize: '14px', padding: '16px' }}>
            🔒 SECURE CHECKOUT →
          </button>
          <button className="btn-outline" style={{ width: '100%', border: '1.5px solid var(--border)' }}>
            ← CONTINUE SHOPPING
          </button>
        </div>

        {/* Trust Signals & Payment info */}
        <div className="trust-list">
          <div className="trust-item">🔒 SSL encrypted · 100% secure</div>
          <div className="trust-item">↩️ Free 30-day returns on all items</div>
          <div className="trust-item">⭐ All sellers verified by Value Village</div>
          <div className="trust-item">🇨🇦 Ships from Canadian sellers</div>
        </div>

        <div className="payment-icons">
          <div className="pay-icon"><span style={{ color: '#1A1F71' }}>💳</span> Visa</div>
          <div className="pay-icon"><span style={{ color: '#EB001B' }}>💳</span> MC</div>
          <div className="pay-icon">🍎 Pay</div>
          <div className="pay-icon"><span style={{ color: '#003087' }}>🅿️</span> PayPal</div>
          <div className="pay-icon" style={{ color: '#FFB3C7' }}>Klarna</div>
        </div>

        <div className="info-box">
          🏷️ <span>Items ship from 3 different sellers.</span> Sellers have 2 business days to confirm. You'll be notified of any issues before payment is taken.
        </div>
      </div>
    </div>
  );
}