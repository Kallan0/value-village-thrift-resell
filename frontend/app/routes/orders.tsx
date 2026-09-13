import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { Package, ArrowLeft, Clock } from "lucide-react";

export default function MyOrders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api('/api/orders/my-orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const formatPrice = (amount: number | string) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));

  if (isLoading) {
    return <div className="page-content" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--brown)' }}>Loading your orders...</div>;
  }

  return (
    <div className="page-content" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px', backgroundColor: 'var(--cream)', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--brown)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '32px', color: 'var(--brown)', fontFamily: 'var(--font-display)', margin: 0 }}>
            MY <span style={{ color: 'var(--red)' }}>ORDERS</span>
          </h1>
          <p style={{ color: 'var(--brown-muted)', margin: '4px 0 0 0', fontSize: '14px' }}>
            Track and view your thrift purchases.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '48px 24px', borderRadius: '12px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
          <Package size={48} color="var(--brown-muted)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '20px', color: 'var(--brown)', marginBottom: '8px' }}>No orders yet</h2>
          <p style={{ color: 'var(--brown-muted)', marginBottom: '24px' }}>You haven't placed any orders yet. Discover unique pre-loved pieces today!</p>
          <Link to="/shop">
            <button className="btn-primary" style={{ padding: '12px 24px' }}>
              Explore Shop
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div key={order._id} style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Placed on {dateStr}</div>
                    <div style={{ fontSize: '13px', color: 'var(--brown)', fontWeight: 600, marginTop: '2px' }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor: order.orderStatus === 'delivered' ? '#dcfce7' : order.orderStatus === 'shipped' ? '#dbeafe' : '#fef3c7',
                      color: order.orderStatus === 'delivered' ? '#166534' : order.orderStatus === 'shipped' ? '#1e40af' : '#92400e'
                    }}>
                      {order.orderStatus}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {item.imageUrl && item.imageUrl.length > 0 ? (
                          <img src={item.imageUrl[0]} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', backgroundColor: '#eee', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👗</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <div>
                    Delivery to: {order.shippingAddress?.city}, {order.shippingAddress?.postalCode} ({order.paymentMethod})
                  </div>
                  <Link to={`/order-success/${order._id}`} style={{ color: 'var(--brown)', textDecoration: 'underline', fontWeight: 600 }}>
                    View Receipt →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
