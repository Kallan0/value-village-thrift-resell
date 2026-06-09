import { Link } from "react-router";
import ProductCard from "../components/UI/ProductCard";

export default function Home() {
  const marqueeWords = [
    "PRE-LOVED", "VINTAGE", "GREAT DEALS", "FREE RETURNS", "THRIFT", "RESALE"
  ];
  const scrollingText = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];
  const dummyProducts = [
    {
      _id: "1",
      emoji: "👗",
      name: "Levi's Denim Jacket '90s",
      meta: "Size M · Like new · Women's",
      priceNow: 38,
      priceWas: 120,
      savePercentage: 68,
      badge: { type: "hot", text: "🔥 Hot" },
    },
    {
      _id: "2",
      emoji: "👟",
      name: "Nike Air Max 90 Vintage",
      meta: "Size 10 · Good condition",
      priceNow: 54,
      priceWas: 130,
      savePercentage: 58,
      badge: { type: "thrift", text: "Thrift" },
    },
  ];

  return (
    <div className="page-content">
      <div className="hero">
        <div className="hero-left">
          <div className="hero-kicker">🏷️ New drops every Tuesday</div>
          <div className="hero-title">
            FIND
            <br />
            YOUR
            <br />
            <span className="red">STYLE.</span>
          </div>
          <div className="hero-subtitle">Pre-loved. Perfectly priced.</div>
          <p className="hero-desc">
            Thousands of handpicked thrift finds from trusted resellers.
            Designer labels, vintage gems, and everyday essentials — all at a
            fraction of retail.
          </p>
          <div className="hero-actions">
            <Link to="/shop">
              <button className="btn-primary">Shop Now</button>
            </Link>
            <button className="btn-yellow">Sell With Us</button>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-right-bg"></div>
          <div className="hero-right-big">THRIFT</div>
          <div className="hero-right-content">
            <div className="price-tag">
              <div className="price-tag-label">Starting from</div>
              <div className="price-tag-val">$5</div>
              <div className="price-tag-sub">Verified pre-loved items</div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SCROLLING YELLOW BANNER */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
          {scrollingText.map((text, index) => (
            <div key={index} className="marquee-item">
              {text} <span className="marquee-diamond">♦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BROWSE BY CATEGORY SECTION */}
      <section className="category-section">
        <div className="cat-header-row">
          <div>
            <div className="cat-eyebrow">BROWSE BY CATEGORY</div>
            <h2 className="cat-h2">SHOP THE<br />VILLAGE</h2>
          </div>
          <Link to="/shop" className="cat-link-all">ALL CATEGORIES →</Link>
        </div>

        <div className="cat-grid">
          <Link to="/shop?category=womens" className="cat-card bg-brown">
            <div className="cat-card-icon">👗</div>
            <div className="cat-card-title">WOMEN'S</div>
            <div className="cat-card-count">18,200 items</div>
          </Link>
          
          <Link to="/shop?category=mens" className="cat-card bg-green">
            <div className="cat-card-icon">👔</div>
            <div className="cat-card-title">MEN'S</div>
            <div className="cat-card-count">12,400 items</div>
          </Link>
          
          <Link to="/shop?category=shoes" className="cat-card bg-purple">
            <div className="cat-card-icon">👟</div>
            <div className="cat-card-title">SHOES</div>
            <div className="cat-card-count">7,600 items</div>
          </Link>
          
          <Link to="/shop?category=accessories" className="cat-card bg-tan">
            <div className="cat-card-icon">👜</div>
            <div className="cat-card-title">ACCESSORIES</div>
            <div className="cat-card-count">5,800 items</div>
          </Link>
          
          <Link to="/shop?category=vintage" className="cat-card bg-red">
            <div className="cat-card-icon">✨</div>
            <div className="cat-card-title">VINTAGE</div>
            <div className="cat-card-count">3,200 items</div>
          </Link>
        </div>
      </section>


      <div className="products-section" style={{ paddingTop: "60px" }}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Handpicked finds</div>
            <div className="section-title">
              HOT RIGHT
              <br />
              NOW 🔥
            </div>
          </div>
          <Link to="/shop">
            <button className="section-link">View all →</button>
          </Link>
        </div>
        <div className="product-grid">
          {dummyProducts.map((product) => (
            <ProductCard key={product._id} product={product as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
