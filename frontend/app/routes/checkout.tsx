import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const formatPrice = (amount: number | string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));

  if (cartItems.length === 0) {
    return (
      <div className="page-content" style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', backgroundColor: 'var(--cream)' }}>
        <h1 style={{ color: 'var(--brown)', fontSize: '36px', marginBottom: '16px' }}>NOTHING TO CHECKOUT</h1>
        <p style={{ color: 'var(--brown-muted)', marginBottom: '32px' }}>Your cart is empty.</p>
        <Link to="/shop">
          <button className="btn-primary" style={{ padding: '16px 32px' }}>BACK TO SHOP</button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // No payment gateway yet — this simulates a successful order.
    clearCart();
    toast.success("Order placed! (Demo checkout — no payment was processed)");
  };

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', backgroundColor: 'var(--cream)' }}>
      <h1 style={{ color: 'var(--brown)', fontSize: '32px', marginBottom: '32px' }}>CHECKOUT</h1>

      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Order Summary</h2>
        {cartItems.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--text-muted)' }}>
            <span>{item.name} × {item.quantity || 1}</span>
            <span>{formatPrice(Number(item.price) * (item.quantity || 1))}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--text-muted)' }}>
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontWeight: 700, fontSize: '20px', color: 'var(--text-main)' }}>
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        style={{ width: '100%', padding: '16px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
      >
        PLACE ORDER (DEMO)
      </button>
    </div>
  );
}
