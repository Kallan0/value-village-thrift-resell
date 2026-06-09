import { Link } from "react-router";
import { useWishlist } from "~/context/WishlistContext";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    emoji: string;
    meta: string;
    priceNow: number;
    priceWas: number;
    savePercentage: number;
    badge?: { type: "hot" | "thrift" | "new"; text: string };
  };
}

export default function ProductCard({ product }: any) {
  const { toggleWishlist, isInWishlist } = useWishlist(); // <-- 2. Get the functions
  
  const isSaved = isInWishlist(product._id);

  return (
    <div className="product-card">
      <div className="product-img">
        <div className="product-img-emoji">{product.emoji}</div>
        
        {/* 3. The Heart Button */}
        <button 
          className="p-wish" 
          onClick={(e) => {
            e.preventDefault(); // Stop from navigating to product page
            toggleWishlist(product);
          }}
          style={{ color: isSaved ? 'var(--red)' : 'var(--brown-muted)' }}
        >
          {isSaved ? '❤️' : '🤍'}
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
  );
}
