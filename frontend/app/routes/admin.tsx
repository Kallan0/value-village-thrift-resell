import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useOutletContext } from "react-router";


export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {theme, setTheme} = useOutletContext<any>()  

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); 

  useEffect(() => {
    // if (!user) {
    //   navigate('/login');
    //   return;
    // }

    const fetchDashboardData = async () => {
      try {
        console.log("1. Frontend asking for data...");
        const response = await fetch("http://localhost:5000/api/admin/products");
        
        console.log("2. Response Status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("3. Data successfully received:", data);
          setAllProducts(data);
        } else {
          console.log("❌ Backend threw an error status!");
        }
      } catch (error) {
        console.error("❌ Network Fetch Error (Is the backend running?):", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAction = async (productId: string, status: 'approved' | 'rejected') => {
    let rejectionReason = "";
    if (status === 'rejected') {
      const reason = window.prompt("Reason for rejection?");
      if (reason === null) return;
      rejectionReason = reason;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason })
      });

      if (response.ok) {
        setAllProducts(prev => 
          prev.map(item => item._id === productId ? { ...item, status, rejectionReason } : item)
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Action error:", error);
    }
  };

  // --- BULLETPROOF FILTERS ---
  // If an old item doesn't have a status, we pretend it is 'pending'
  const pendingItems = allProducts.filter(p => p.status === 'pending' || !p.status);
  const approvedItems = allProducts.filter(p => p.status === 'approved');
  const rejectedItems = allProducts.filter(p => p.status === 'rejected');
  const soldItems = allProducts.filter(p => p.status === 'sold'); 

  let currentDisplayList = [];
  if (activeTab === 'all') currentDisplayList = allProducts;
  if (activeTab === 'pending') currentDisplayList = pendingItems;
  if (activeTab === 'approved') currentDisplayList = approvedItems;
  if (activeTab === 'rejected') currentDisplayList = rejectedItems;
  if (activeTab === 'sold') currentDisplayList = soldItems;

  if (isLoading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--brown)' }}>Loading Command Center...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#1A1612' }}>
      
      {/* LEFT SIDEBAR PANEL */}
      <div style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid var(--border)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>
          ADMIN <span style={{ color: 'var(--red)' }}>PANEL</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarButton label="Pending Queue" count={pendingItems.length} active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} alert={pendingItems.length > 0} />
          <SidebarButton label="Total Listed Items" count={allProducts.length} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          <SidebarButton label="Approved" count={approvedItems.length} active={activeTab === 'approved'} onClick={() => setActiveTab('approved')} />
          <SidebarButton label="Rejected" count={rejectedItems.length} active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} />
          <SidebarButton label="Sold Items" count={soldItems.length} active={activeTab === 'sold'} onClick={() => setActiveTab('sold')} />
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <SidebarButton label="Analytics & Stats" count={null} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', 
              padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', 
              backgroundColor: 'transparent', color: 'var(--text-main)', 
              cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s ease'
            }}
          >
            {/* Show a Moon if Light Mode, show a Sun if Dark Mode */}
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flexGrow: 1, padding: '48px', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, textTransform: 'capitalize' }}>
            {activeTab === 'all' ? 'Total Platform Listings' : activeTab}
          </h1>
          <p style={{ color: 'var(--brown-muted)' }}>Manage and review platform activity.</p>
        </div>

        {activeTab === 'analytics' ? (
          <div style={{ padding: '48px', backgroundColor: '#fff', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
            <h2>📊 Analytics Engine</h2>
            <p style={{ color: 'var(--brown-muted)', marginTop: '8px' }}>Sales graphs, user growth, and conversion rates will go here.</p>
          </div>
        ) : (
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentDisplayList.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed var(--border)', color: 'var(--brown-muted)' }}>
                No items found in this category.
              </div>
            ) : (
              currentDisplayList.map(item => {
                
                // 🛡️ THE SAFETY NET: Check for the new array, then the old string, then use a fallback
                const displayImage = item.imageUrl && item.imageUrl.length > 0 
                  ? item.imageUrl[0] 
                  : (item.imageUrl ? item.imageUrl : 'https://via.placeholder.com/80?text=No+Image');

                // 🛡️ THE STATUS SAFETY NET: Old items default to 'pending'
                const displayStatus = item.status || 'pending';

                return (
                  <div key={item._id} style={{ display: 'flex', gap: '24px', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)', alignItems: 'center' }}>
                    
                    {/* Thumbnail safely rendered */}
                    <img src={displayImage} alt="thumb" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--cream)' }} />
                    
                    {/* Details */}
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--brown-muted)' }}>
                        Seller: {item.seller?.email || 'Unknown'} | Price: ${item.price}
                      </div>
                      {displayStatus === 'rejected' && item.rejectionReason && (
                        <div style={{ fontSize: '13px', color: 'var(--red)', marginTop: '4px', backgroundColor: '#FDF2F2', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                          Reason: {item.rejectionReason}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div style={{ padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', backgroundColor: 'var(--cream)' }}>
                      {displayStatus}
                    </div>

                    {/* Actions */}
                    {displayStatus === 'pending' && (
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button onClick={() => handleAction(item._id, 'rejected')} style={{ padding: '8px 16px', border: '1px solid var(--red)', color: 'var(--red)', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                         <button onClick={() => handleAction(item._id, 'approved')} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'var(--brown)', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                       </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- HELPER COMPONENT FOR SIDEBAR BUTTONS ---
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