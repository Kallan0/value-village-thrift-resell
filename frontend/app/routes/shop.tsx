import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import ProductCard from "../components/UI/ProductCard";

// 1. The Category Assets
const CATEGORY_BANNERS = [
  { label: "All", value: "all", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80" },
  { label: "Men's", value: "Men's", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80" },
  { label: "Women's", value: "Women's", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
  { label: "Kids'", value: "Kids", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&q=80" },
  { label: "Accessories", value: "Accessories", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80" },
];

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Setup URL Parameters for Category and Sorting
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Server responded with an error");
        
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Failed to fetch products:", err);
        setError("Could not connect to the database server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 4. The Filter & Sort Engine
  let displayProducts = currentCategory === "all"
    ? [...products]
    : products.filter(p => p.category === currentCategory);

  // Apply Sorting Logic
  if (currentSort === "price-low") {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (currentSort === "newest") {
    // Assuming you have a createdAt field, otherwise this won't change the array
    displayProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // 5. Handlers for URL updating
  const handleCategoryChange = (categoryValue: string) => {
    // Update the URL without losing the current sort parameter!
    setSearchParams({ category: categoryValue, sort: currentSort });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ category: currentCategory, sort: e.target.value });
  };

  return (
    <div className="page-content" style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* --- VISUAL CATEGORY NAVIGATOR --- */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Shop by Category</h2>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none' }}>
          {CATEGORY_BANNERS.map((cat) => {
            const isActive = currentCategory === cat.value;
            return (
              <div 
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                style={{
                  minWidth: '160px', height: '100px', borderRadius: '12px', position: 'relative', 
                  overflow: 'hidden', cursor: 'pointer',
                  border: isActive ? '3px solid var(--brown)' : '3px solid transparent',
                  transition: 'transform 0.2s ease', transform: isActive ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {cat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MAIN SHOP LAYOUT --- */}
      <div className="shop-layout" style={{ display: 'flex', gap: '32px' }}>
        
        {/* SIDEBAR FILTERS */}
        <div className="sidebar" style={{ width: '250px', flexShrink: 0 }}>
          <div className="sidebar-title" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Filters</div>

          <div className="filter-group" style={{ marginBottom: '32px' }}>
            <div className="filter-group-title" style={{ fontWeight: 600, marginBottom: '16px' }}>Category List</div>
            <div className="filter-opts" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Syncing the old sidebar text with the visual banners */}
              {CATEGORY_BANNERS.map((cat) => (
                <label key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="categoryGroup"
                    checked={currentCategory === cat.value}
                    onChange={() => handleCategoryChange(cat.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: currentCategory === cat.value ? 700 : 400 }}>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Keep your color swatches */}
          <div className="filter-group">
            <div className="filter-group-title" style={{ fontWeight: 600, marginBottom: '16px' }}>Colour</div>
            <div className="color-row" style={{ display: 'flex', gap: '8px' }}>
              <div className="c-swatch on" style={{ background: "#1A1612", width: '30px', height: '30px', borderRadius: '50%' }}></div>
              <div className="c-swatch" style={{ background: "#FFF", border: "1px solid #ccc", width: '30px', height: '30px', borderRadius: '50%' }}></div>
              <div className="c-swatch" style={{ background: "#C8342A", width: '30px', height: '30px', borderRadius: '50%' }}></div>
              <div className="c-swatch" style={{ background: "#4A6741", width: '30px', height: '30px', borderRadius: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* MAIN SHOP GRID */}
        <div className="shop-main" style={{ flexGrow: 1 }}>
          <div className="shop-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div className="shop-count" style={{ fontWeight: 600 }}>
              <span style={{ fontSize: '20px' }}>{displayProducts.length}</span> items found
            </div>
            
            {/* The Working Sort Dropdown */}
            <select 
              value={currentSort} 
              onChange={handleSortChange}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--border)', cursor: 'pointer', outline: 'none' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {error && (
            <div style={{ padding: '16px', backgroundColor: '#FDF2F2', border: '1px solid #F8D7DA', color: '#9B1C1C', borderRadius: '6px', marginBottom: '24px', fontSize: '14px' }}>
              ⚠️ <strong>Connection Notice:</strong> {error}
            </div>
          )}

          {isLoading ? (
             <div style={{ padding: '48px', textAlign: 'center' }}>Loading listings...</div>
          ) : (
            <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {displayProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--brown-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
                  <h3>No listings available for this category</h3>
                  <p style={{ fontSize: '14px', marginTop: '4px' }}>Try selecting a different filter.</p>
                </div>
              ) : (
                displayProducts.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}