import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { api } from "../lib/api";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api(`/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Failed to fetch order details", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const formatPrice = (amount: number | string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', backgroundColor: 'var(--cream)', minHeight: '80vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', marginBottom: '24px' }}>
          <CheckCircle size={48} />
        </div>
        <h1 style={{ fontSize: '36px', color: 'var(--brown)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
          ORDER CONFIRMED!
        </h1>
        <p style={{ color: 'var(--brown-muted)', fontSize: '16px' }}>
          Thank you for choosing pre-loved fashion! Your order has been placed successfully.
        </p>
        <div style={{ display: 'inline-block', marginTop: '12px', padding: '6px 16px', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid var(--border-color)', fontSize: '13px', color: 'var(--text-muted)' }}>
          Order ID: <strong>{id}</strong>
        </div>
      </div>

      {order && (
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status</div>
              <div style={{ textTransform: 'capitalize', fontWeight: 700, color: '#166534', fontSize: '16px' }}>
                {order.orderStatus || 'Placed'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Payment Method</div>
              <div style={{ fontWeight: 600 }}>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Delivery</div>
              <div style={{ fontWeight: 600 }}>3-5 Business Days</div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--text-main)' }}>Items in this order:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Package size={18} color="var(--brown)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'var(--cream)', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>📍 Shipping To:</div>
            <div>{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</div>
            <div>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee', fontWeight: 700, fontSize: '18px' }}>
            <span>Total Amount:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link to="/orders">
          <button style={{ padding: '14px 28px', backgroundColor: '#fff', color: 'var(--brown)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            View My Orders
          </button>
        </Link>
        <Link to="/shop">
          <button style={{ padding: '14px 28px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Continue Shopping <ArrowRight size={16} />
          </button>
        </Link>
      </div>

    </div>
  );
}
