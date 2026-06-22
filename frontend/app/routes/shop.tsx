import { useLoaderData } from "react-router";
import ProductCard from "../components/UI/ProductCard";

// 1. The Loader: Strictly fetches live data from your Express backend
export async function loader() {
  try {
    const controller = new AbortController();
    // Abort if the backend takes longer than 1.5 seconds to respond
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch("http://localhost:5000/api/products", {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`);
    }

    const products = await res.json();
    return { products, error: null };
  } catch (error: any) {
    console.error("❌ Shop Loader Error:", error.message);
    // Return empty array and the error message to handle gracefully in UI
    return { products: [], error: "Could not connect to the database server." };
  }
}

// 2. The UI Component
export default function Shop() {
  const { products, error } = useLoaderData<typeof loader>();

  return (
    <div className="shop-layout">
      {/* SIDEBAR FILTERS */}
      <div className="sidebar">
        <div className="sidebar-title">Filters</div>

        <div className="filter-group">
          <div className="filter-group-title">Category</div>
          <div className="filter-opts">
            <label className="filter-opt checked">
              <input
                type="checkbox"
                defaultChecked
                style={{ display: "none" }}
              />
              <div className="f-check">✓</div>
              <span className="f-label">All</span>
            </label>
            <label className="filter-opt">
              <input type="checkbox" style={{ display: "none" }} />
              <div className="f-check"></div>
              <span className="f-label">Women's</span>
            </label>
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group-title">Colour</div>
          <div className="color-row">
            <div className="c-swatch on" style={{ background: "#1A1612", borderColor: "#1A1612" }}></div>
            <div className="c-swatch" style={{ background: "#FFF", border: "1px solid #ccc" }}></div>
            <div className="c-swatch" style={{ background: "#C8342A" }}></div>
            <div className="c-swatch" style={{ background: "#4A6741" }}></div>
          </div>
        </div>
      </div>

      {/* MAIN SHOP GRID */}
      <div className="shop-main">
        <div className="shop-bar">
          <div className="shop-count">
            <span>{products.length}</span> items found
          </div>
          <select className="sort-select">
            <option>Sort: Best Match</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        {/* Dynamic Alert Status Banner */}
        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FDF2F2', border: '1px solid #F8D7DA', color: '#9B1C1C', borderRadius: '6px', marginBottom: '24px', fontSize: '14px' }}>
            ⚠️ <strong>Connection Notice:</strong> {error} Showing offline view.
          </div>
        )}

        <div className="shop-grid">
          {products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0', color: 'var(--brown-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
              <h3>No listings available</h3>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>Be the first to list a pre-loved item in the closet!</p>
            </div>
          ) : (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}