import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill fields if user is authenticated and has profile data
  useEffect(() => {
    if (user) {
      setFullName(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim());
      setPhone(user.phone || "");
      if (user.shippingAddress) {
        setStreet(user.shippingAddress.street || "");
        setCity(user.shippingAddress.city || "");
        setState(user.shippingAddress.state || "");
        setPostalCode(user.shippingAddress.postalCode || "");
      }
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const shipping = subtotal >= 2000 ? 0 : 150;
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in or create an account to complete your order.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!fullName || !phone || !street || !city || !postalCode) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity || 1,
            imageUrl: item.imageUrl
          })),
          shippingAddress: {
            fullName,
            phone,
            street,
            city,
            state,
            postalCode,
            country: "India"
          },
          paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok && data.order) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        toast.success("Order placed successfully!");
        navigate(`/order-success/${data.order._id}`);
      } else {
        toast.error(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Network error while placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', backgroundColor: 'var(--cream)' }}>
      <h1 style={{ color: 'var(--brown)', fontSize: '32px', marginBottom: '8px' }}>
        SECURE <span style={{ color: 'var(--red)' }}>CHECKOUT</span>
      </h1>
      <p style={{ color: 'var(--brown-muted)', marginBottom: '32px' }}>
        Enter your delivery address and choose payment method to complete your thrift order.
      </p>

      {!isAuthenticated && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Already have an account?</strong>
            <p style={{ fontSize: '13px', color: 'var(--brown-muted)', margin: '4px 0 0 0' }}>Sign in to auto-fill your saved address and speed up checkout.</p>
          </div>
          <Link to="/login" state={{ from: "/checkout" }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              Sign In
            </button>
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: SHIPPING & PAYMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Shipping Address Box */}
          <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="var(--brown)" /> 1. Shipping Address
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="var(--brown)" /> 2. Payment Method
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  borderRadius: '8px', border: paymentMethod === 'COD' ? '2px solid var(--brown)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'COD' ? 'var(--cream)' : '#fff',
                  cursor: 'pointer' 
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')} 
                />
                <Banknote size={20} color="#166534" />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pay cash or UPI at your doorstep when package arrives.</div>
                </div>
              </label>

              <label 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                  borderRadius: '8px', border: paymentMethod === 'Online' ? '2px solid var(--brown)' : '1px solid var(--border-color)',
                  backgroundColor: paymentMethod === 'Online' ? 'var(--cream)' : '#fff',
                  cursor: 'pointer' 
                }}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'Online'} 
                  onChange={() => setPaymentMethod('Online')} 
                />
                <CreditCard size={20} color="#2563eb" />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 600 }}>Pay Online (Card / UPI / NetBanking)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simulated instant digital payment processing.</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            Order Summary ({cartItems.length} items)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '20px' }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.imageUrl && item.imageUrl.length > 0 ? (
                    <img src={item.imageUrl[0]} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : null}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity || 1}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  {formatPrice(Number(item.price) * (item.quantity || 1))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>{shipping === 0 ? <strong style={{ color: '#166534' }}>Free</strong> : formatPrice(shipping)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontWeight: 700, fontSize: '20px', color: 'var(--text-main)', marginTop: '16px', marginBottom: '24px' }}>
            <span>Total to Pay</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ 
              width: '100%', padding: '16px', backgroundColor: 'var(--brown)', 
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', 
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'PROCESSING ORDER...' : `CONFIRM & PLACE ORDER (${formatPrice(total)})`}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '12px', color: 'var(--brown-muted)' }}>
            <ShieldCheck size={16} /> Guaranteed Thrift Quality · Free Returns
          </div>
        </div>

      </form>
    </div>
  );
}
