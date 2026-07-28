import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/context/WishlistContext";
import toast from "react-hot-toast";

import HeartCursor from "./HoverAni/pointer";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    condition: string;
    imageUrl: string[];
    badge?: { type: "hot" | "thrift" | "new"; text: string };
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist(); 
  
  const isSaved = isInWishlist(product._id);
  
  // Mouse tracking state for the heart cursor
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveringWishlist, setIsHoveringWishlist] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const displayImage = product.imageUrl && product.imageUrl.length > 0 
    ? product.imageUrl[0] 
    : 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
        
        {/* IMAGE WRAPPER: Added mouse event listeners and 'cursor: none' */}
        <div 
          className="product-img" 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          style={{ aspectRatio: '4/5', backgroundColor: 'var(--cream)', borderRadius: '8px', overflow: 'hidden', position: 'relative', cursor: 'none' }}
        >
          <HeartCursor 
            isVisible={isHovered && !isHoveringWishlist} 
            x={mousePos.x} 
            y={mousePos.y} 
          />

          <img 
            src={displayImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          <button 
            className="p-wish" 
            onClick={(e) => {
              e.preventDefault(); 
              toggleWishlist(product);
            }}
            style={{ 
              position: 'absolute', top: '12px', right: '12px',
              color: isSaved ? 'var(--red)' : 'var(--brown-muted)',
              background: 'white', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10
            }}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* INFO WRAPPER */}
        <div className="product-info" style={{ marginTop: '12px' }}>
          <div className="product-name" style={{ fontSize: '16px', fontWeight: 600 }}>
            {product.name}
          </div>
          
          <div className="product-meta" style={{ fontSize: '13px', color: 'var(--brown-muted)', textTransform: 'capitalize', marginTop: '4px' }}>
            {product.category} • {product.condition}
          </div>
          
          <div className="product-price-row" style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="price-now" style={{ fontSize: '16px', fontWeight: 700 }}>
              ₹{product.price}
            </span>
            
            {/* FIXED: Added e.preventDefault() so it adds to cart without leaving the page! */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
              style={{
                padding: '6px 12px', backgroundColor: 'var(--brown)', 
                color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}