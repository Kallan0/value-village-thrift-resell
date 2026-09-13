import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  category?: string;
  condition?: string;
  imageUrl?: string[];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api(`/api/products/${id}`);
        if (!response.ok) throw new Error("Not found");
        setProduct(await response.json());
      } catch {
        setError("Could not load this product.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) return <div className="page-content" style={{ padding: '48px', textAlign: 'center', color: 'var(--brown)' }}>Loading...</div>;

  if (error || !product) {
    return (
      <div className="page-content" style={{ padding: '48px', textAlign: 'center', color: 'var(--brown)' }}>
        <h1>{error || "Product not found"}</h1>
        <Link to="/shop"><button className="btn-primary" style={{ padding: '12px 24px', marginTop: '16px' }}>BACK TO SHOP</button></Link>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        <div style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#eee' }}>
          {product.imageUrl && product.imageUrl.length > 0 ? (
            <img src={product.imageUrl[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            {product.category || "General"} • {product.condition || "Used"}
          </div>
          <h1 style={{ fontSize: '36px', color: 'var(--brown)', marginBottom: '16px' }}>{product.name}</h1>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>₹{product.price}</div>
          <p style={{ color: 'var(--brown-muted)', lineHeight: 1.6, marginBottom: '32px' }}>{product.description}</p>
          <button
            onClick={() => addToCart({ _id: product._id, name: product.name, price: product.price, category: product.category, condition: product.condition, imageUrl: product.imageUrl })}
            style={{ padding: '16px 32px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
