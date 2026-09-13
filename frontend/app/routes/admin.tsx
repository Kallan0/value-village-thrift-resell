import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import FaqManager from "../components/admin/FaqManager";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('app-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // Route guard
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch Dashboard Products & Orders
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, orderRes] = await Promise.all([
          api("/api/admin/products"),
          api("/api/orders/admin/all")
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setAllProducts(data);
        }

        if (orderRes.ok) {
          const orders = await orderRes.json();
          setAllOrders(orders);
        }
      } catch (error) {
        console.error("❌ Admin fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ fontSize: '32px', color: 'var(--brown)', marginBottom: '8px' }}>ADMIN ACCESS RESTRICTED</h1>
        <p style={{ color: 'var(--brown-muted)', maxWidth: '400px', marginBottom: '24px' }}>
          Your account ({user.email}) does not have administrative permissions.
        </p>
        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAction = async (productId: string, status: 'approved' | 'rejected') => {
    let rejectionReason = "";
    if (status === 'rejected') {
      const reason = window.prompt("Reason for rejection?");
      if (reason === null) return;
      rejectionReason = reason;
    }

    try {
      const response = await api(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });

      if (response.ok) {
        toast.success(`Product ${status}!`);
        setAllProducts(prev => 
          prev.map(item => item._id === productId ? { ...item, status, rejectionReason } : item)
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Network error updating status.");
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, orderStatus: string) => {
    try {
      const res = await api(`/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus })
      });
      if (res.ok) {
        toast.success(`Order marked as ${orderStatus}!`);
        setAllOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus } : o));
      } else {
        toast.error('Failed to update order status');
      }
    } catch (err) {
      toast.error('Network error updating order');
    }
  };

  const pendingItems = allProducts.filter(p => p.status === 'pending' || !p.status);
  const approvedItems = allProducts.filter(p => p.status === 'approved');
  const rejectedItems = allProducts.filter(p => p.status === 'rejected');
  const soldItems = allProducts.filter(p => p.status === 'sold'); 

  let currentDisplayList: any[] = [];
  if (activeTab === 'all') currentDisplayList = allProducts;
  if (activeTab === 'pending') currentDisplayList = pendingItems;
  if (activeTab === 'approved') currentDisplayList = approvedItems;
  if (activeTab === 'rejected') currentDisplayList = rejectedItems;
  if (activeTab === 'sold') currentDisplayList = soldItems;

  if (isLoading) return <div style={{ padding: '64px', textAlign: 'center', color: 'var(--brown)', fontSize: '18px' }}>Loading Command Center...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base, #f9f9f9)', color: 'var(--text-main, #1A1612)' }}>
      
      {/* LEFT SIDEBAR PANEL */}
      <div style={{ width: '280px', backgroundColor: 'var(--bg-surface, #fff)', borderRight: '1px solid var(--border-color, #e5e7eb)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>
          ADMIN <span style={{ color: 'var(--red, #ef4444)' }}>PANEL</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarButton label="Pending Queue" count={pendingItems.length} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} alert={pendingItems.length > 0} />
          <SidebarButton label="Total Listed Items" count={allProducts.length} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <SidebarButton label="Approved" count={approvedItems.length} active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} />
          <SidebarButton label="Rejected" count={rejectedItems.length} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
          <SidebarButton label="Sold Items" count={soldItems.length} active={activeTab === 'sold'} onClick={() => setActiveTab('sold')} />
          
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color, #e5e7eb)' }} />
          
          <SidebarButton label="Customer Orders" count={allOrders.length} active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} alert={allOrders.filter(o => o.orderStatus === 'placed').length > 0} />
          <SidebarButton label="Chatbot FAQs" count={null} active={activeTab === 'faqs'} onClick={() => setActiveTab('faqs')} />
          
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color, #e5e7eb)' }}>
            <button 
              onClick={toggleTheme}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', 
                padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color, #e5e7eb)', 
                backgroundColor: 'transparent', color: 'var(--text-main)', 
                cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s ease'
              }}
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flexGrow: 1, padding: '48px', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, textTransform: 'capitalize' }}>
            {activeTab === 'all' ? 'Total Platform Listings' : activeTab === 'orders' ? 'Customer Orders' : activeTab === 'faqs' ? 'Knowledge Base (FAQs)' : activeTab}
          </h1>
          <p style={{ color: 'var(--brown-muted)' }}>Manage and review platform activity.</p>
        </div>

        {/* 1. FAQS TAB */}
        {activeTab === 'faqs' && <FaqManager />}

        {/* 2. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {allOrders.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed var(--border-color)', color: 'var(--brown-muted)' }}>
                No customer orders placed yet.
              </div>
            ) : (
              allOrders.map(order => (
                <div key={order._id} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Order ID: {order._id}</div>
                      <div style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>
                        Customer: {order.shippingAddress?.fullName} ({order.shippingAddress?.phone})
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>₹{order.totalAmount}</span>
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', backgroundColor: '#fcfcfc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee' }}>
                        <span>🛍️ {item.name} × {item.quantity}</span>
                        <strong style={{ color: 'var(--brown)' }}>₹{item.price}</strong>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    📍 Destination: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode} | Payment: {order.paymentMethod} ({order.paymentStatus})
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. PRODUCTS TABS */}
        {activeTab !== 'faqs' && activeTab !== 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentDisplayList.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed var(--border-color)', color: 'var(--brown-muted)' }}>
                No items found in this category.
              </div>
            ) : (
              currentDisplayList.map(item => {
                const displayImage = item.imageUrl && item.imageUrl.length > 0 
                  ? item.imageUrl[0] 
                  : (item.imageUrl ? item.imageUrl : 'https://via.placeholder.com/80?text=No+Image');

                const displayStatus = item.status || 'pending';

                return (
                  <div key={item._id} style={{ display: 'flex', gap: '24px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-surface, #fff)', alignItems: 'center' }}>
                    
                    <img src={displayImage} alt="thumb" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--cream)' }} />
                    
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--brown-muted)' }}>
                        Seller: {item.seller?.email || 'Unknown'} | Price: ₹{item.price} | Category: {item.category}
                      </div>
                      {displayStatus === 'rejected' && item.rejectionReason && (
                        <div style={{ fontSize: '13px', color: 'var(--red)', marginTop: '4px', backgroundColor: '#FDF2F2', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                          Reason: {item.rejectionReason}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', backgroundColor: displayStatus === 'approved' ? '#dcfce7' : displayStatus === 'rejected' ? '#fee2e2' : 'var(--cream)', color: displayStatus === 'approved' ? '#166534' : displayStatus === 'rejected' ? '#991b1b' : 'inherit' }}>
                      {displayStatus}
                    </div>

                    {displayStatus === 'pending' && (
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button onClick={() => handleAction(item._id, 'rejected')} style={{ padding: '8px 16px', border: '1px solid var(--red)', color: 'var(--red)', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                         <button onClick={() => handleAction(item._id, 'approved')} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'var(--brown)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                       </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function SidebarButton({ label, count, active, onClick, alert = false }: any) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', width: '100%', border: 'none', borderRadius: '8px',
        backgroundColor: active ? 'var(--cream)' : 'transparent',
        color: active ? 'var(--brown)' : 'var(--brown-muted)',
        fontWeight: active ? 700 : 500, cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s ease'
      }}
    >
      <span>{label}</span>
      {count !== null && count !== undefined && (
        <span style={{ 
          backgroundColor: alert ? 'var(--red)' : (active ? '#fff' : 'var(--cream)'), 
          color: alert ? '#fff' : 'var(--brown)',
          padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 
        }}>
          {count}
        </span>
      )}
    </button>
  );
}