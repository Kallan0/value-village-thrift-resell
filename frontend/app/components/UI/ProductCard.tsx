import { Link } from "react-router";
import { useWishlist } from "~/context/WishlistContext";

// 1. Updated the interface to match your live MongoDB Product Schema
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
  const { toggleWishlist, isInWishlist } = useWishlist(); 
  
  const isSaved = isInWishlist(product._id);
  
  // Safely grab the first image from the array, or show a placeholder if missing
  const displayImage = product.imageUrl && product.imageUrl.length > 0 
    ? product.imageUrl[0] 
    : 'https://via.placeholder.com/400x500?text=No+Image';

  return (
    // 2. Wrap the whole card in a Link so it is clickable!
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
        
        <div className="product-img" style={{ aspectRatio: '4/5', backgroundColor: 'var(--cream)', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
          
          {/* 3. Replaced the dummy emoji with your live Cloudinary image */}
          <img 
            src={displayImage} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {/* The Heart Button (Kept your wishlist logic intact!) */}
          <button 
            className="p-wish" 
            onClick={(e) => {
              e.preventDefault(); // This stops the Link from triggering when they just want to favorite it
              toggleWishlist(product);
            }}
            style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px',
              color: isSaved ? 'var(--red)' : 'var(--brown-muted)',
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* 4. The updated info container using real database fields */}
        <div className="product-info" style={{ marginTop: '12px' }}>
          <div className="product-name" style={{ fontSize: '16px', fontWeight: 600 }}>
            {product.name}
          </div>
          
          <div className="product-meta" style={{ fontSize: '13px', color: 'var(--brown-muted)', textTransform: 'capitalize', marginTop: '4px' }}>
            {product.category} • {product.condition}
          </div>
          
          <div className="product-price-row" style={{ marginTop: '8px' }}>
            <span className="price-now" style={{ fontSize: '16px', fontWeight: 700 }}>
              ${product.price}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}