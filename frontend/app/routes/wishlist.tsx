import { Link } from "react-router";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();

  // Calculate dynamic stats
  const totalItems = wishlistItems.length;
  const totalPotentialSavings = wishlistItems.reduce((acc, item) => acc + (item.priceWas - item.priceNow), 0);

  // ─── EMPTY STATE ────────────────────────────────────────────────────────
  if (totalItems === 0) {
    return (
      <div className="page-content" style={{ backgroundColor: 'var(--cream)', minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', opacity: 0.5 }}>🤍</div>
        <h1 className="wl-h1" style={{ color: 'var(--brown)', fontSize: '48px', textAlign: 'center' }}>
          YOUR WISHLIST IS <span style={{ color: 'var(--red)' }}>EMPTY</span>
        </h1>
        <p style={{ color: 'var(--brown-muted)', marginBottom: '32px', fontSize: '15px', textAlign: 'center', maxWidth: '400px' }}>
          You haven't saved any items yet. Start exploring our thrift finds and tap the heart icon to save your favourites for later!
        </p>
        <Link to="/shop">
          <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '14px' }}>
            + EXPLORE THRIFT FINDS
          </button>
        </Link>
      </div>
    );
  }

  // ─── POPULATED STATE ────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ backgroundColor: 'var(--cream)' }}>
      {/* HERO SECTION */}
      <div className="wl-hero">
        <div className="wl-hero-left">
          <div className="wl-eyebrow">MY ACCOUNT</div>
          <h1 className="wl-h1">MY <span>WISHLIST</span></h1>
          <div className="wl-sub">Saved finds · Price alerts · Collections</div>
        </div>
        <div className="wl-stats">
          <div>
            <div className="wl-stat-val">{totalItems}</div>
            <div className="wl-stat-label">Items Saved</div>
          </div>
          <div>
            <div className="wl-stat-val">${totalPotentialSavings}</div>
            <div className="wl-stat-label">Potential Savings</div>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="wl-layout" style={{ gridTemplateColumns: '1fr', padding: '48px 64px' }}>
        <div className="wl-grid" style={{ marginTop: 0 }}>
          {wishlistItems.map((item) => (
            <div key={item._id} className="wl-card">
              <div className="wl-img-wrap">
                {item.badge && (
                  <div className="wl-tags">
                    <div className={`wl-tag ${item.badge.type}`}>{item.badge.text}</div>
                  </div>
                )}
                
                {/* Remove from wishlist button */}
                <button 
                  className="wl-card-heart" 
                  onClick={() => toggleWishlist(item)}
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  ❤️
                </button>
                
                {item.emoji}
                
                <div className="wl-hover-actions">
                  <button className="wl-btn-add">🛍️ ADD TO CART</button>
                </div>
              </div>
              <div className="wl-info">
                <div className="wl-seller"><span>⭐</span> {item.seller || '@value.village'}</div>
                <div className="wl-title">{item.name}</div>
                <div className="wl-meta"><span>{item.meta.split('·')[0]}</span></div>
                <div className="wl-price-row">
                  <div className="wl-price-now">${item.priceNow}</div>
                  <div className="wl-price-was">${item.priceWas}</div>
                  <div className="wl-price-pct">{item.savePercentage}% off retail</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}