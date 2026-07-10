import { Link } from "react-router";
// Assuming you have a context similar to WishlistContext. Adjust the import path if needed!
import { useCart } from "../context/CartContext"; 
import { ShoppingCart, Trash2} from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // 1. Calculate dynamic totals based on real data
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const shipping = subtotal > 2000 ? 0 : 150; // Free shipping over ₹2000
  const total = subtotal + shipping;

  // 2. The Indian Rupee Formatter we set up earlier
  const formatPrice = (amount: number | string) => {
    // Number(amount) forces strings like "500" to become math-safe 500
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));
  };

  // ─── EMPTY STATE ────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="page-content" style={{ backgroundColor: 'var(--cream)', minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '24px', opacity: 0.5 }}>
         <ShoppingCart size="{80}" strokeWidth="{1}"/>
        </div>
        <h1 style={{ color: 'var(--brown)', fontSize: '48px', textAlign: 'center', margin: '0 0 16px 0' }}>
          YOUR CART IS <span style={{ color: 'var(--red)' }}>EMPTY</span>
        </h1>
        <p style={{ color: 'var(--brown-muted)', marginBottom: '32px', fontSize: '15px', textAlign: 'center', maxWidth: '400px' }}>
          Looks like you haven't added anything yet. Discover unique thrifted pieces before they are gone!
        </p>
        <Link to="/shop">
          <button style={{ padding: '16px 32px', fontSize: '14px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            + EXPLORE THRIFT FINDS
          </button>
        </Link>
      </div>
    );
  }

  // ─── POPULATED STATE ────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ backgroundColor: 'var(--cream)', minHeight: 'calc(100vh - 68px)', padding: '48px 64px' }}>
      <h1 style={{ color: 'var(--brown)', fontSize: '32px', marginBottom: '32px' }}>MY <span>CART</span></h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: The Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', gap: '24px', backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              {/* Product Image */}
              <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eee', flexShrink: 0 }}>
                {item.imageUrl && item.imageUrl.length > 0 ? (
                   <img src={item.imageUrl[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                   <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                )}
              </div>

              {/* Product Details */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.category || "General"} • {item.condition || "Used"}</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>{item.name}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{formatPrice(item.price)}</div>
                  </div>
                  
                  {/* Remove Button */}
                  <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '20px' }}>
                    <Trash2 size="{20}"/>
                  </button>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)} style={{ padding: '4px 12px', background: 'var(--bg-base)', border: 'none', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '4px 12px', background: '#fff', fontSize: '14px', fontWeight: 600 }}>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)} style={{ padding: '4px 12px', background: 'var(--bg-base)', border: 'none', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '15px' }}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '15px' }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'green', fontWeight: 600 }}>Free</span> : formatPrice(shipping)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '20px', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '32px' }}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        
      </div>
    </div>
  );
}