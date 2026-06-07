import { Link } from "react-router";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    emoji: string;
    meta: string;
    priceNow: number;
    priceWas: number;
    savePercentage: number;
    badge?: { type: 'hot' | 'thrift' | 'new'; text: string };
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card">
        <div className="product-img">
          <div className="product-img-emoji">{product.emoji}</div>
          {product.badge && (
            <span className={`p-badge ${product.badge.type}`}>
              {product.badge.text}
            </span>
          )}
          <button className="p-wish" onClick={(e) => e.preventDefault()}>🤍</button>
          <button className="quick-add-btn" onClick={(e) => {
            e.preventDefault();
            console.log("Added to cart:", product._id);
          }}>
            + Add to Cart
          </button>
        </div>
        <div className="product-info">
          <div className="product-name">{product.name}</div>
          <div className="product-meta">{product.meta}</div>
          <div className="product-price-row">
            <span className="price-now">${product.priceNow}</span>
            <span className="price-was">${product.priceWas}</span>
            <span className="price-save">{product.savePercentage}% off</span>
          </div>
        </div>
      </div>
    </Link>
  );
}