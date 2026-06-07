import { useLoaderData } from "react-router";
import ProductCard from "../components/UI/ProductCard";

// 1. The Loader: Fetches data before the page loads
export async function loader() {
  try {
    // // abort controller that triggers after 800 milliseconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch("http://localhost:5000/api/products", {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error("Failed to fetch");
    const products = await res.json();
    return { products };
  } catch (error) {
    // Fallback dummy data in case your backend isn't running yet
    return {
      products: [
        {
          _id: "1",
          emoji: "👗",
          name: "Levi's Denim Jacket '90s",
          meta: "Size M · Like new",
          priceNow: 38,
          priceWas: 120,
          savePercentage: 68,
          badge: { type: "hot", text: "🔥 Hot" },
        },
        {
          _id: "2",
          emoji: "👟",
          name: "Nike Air Max 90 Vintage",
          meta: "Size 10 · Good",
          priceNow: 54,
          priceWas: 130,
          savePercentage: 58,
          badge: { type: "thrift", text: "Thrift" },
        },
        {
          _id: "3",
          emoji: "👔",
          name: "Ralph Lauren Oxford Shirt",
          meta: "Size L · Excellent",
          priceNow: 22,
          priceWas: 85,
          savePercentage: 74,
          badge: { type: "new", text: "New in" },
        },
      ],
    };
  }
}

// 2. The UI Component
export default function Shop() {
  // Access the data fetched by the loader
  const { products } = useLoaderData<typeof loader>();

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
              <span className="f-count">48,200</span>
            </label>
            <label className="filter-opt">
              <input type="checkbox" style={{ display: "none" }} />
              <div className="f-check"></div>
              <span className="f-label">Women's</span>
              <span className="f-count">18,200</span>
            </label>
            {/* Add the rest of your categories here */}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group-title">Colour</div>
          <div className="color-row">
            <div
              className="c-swatch on"
              style={{ background: "#1A1612", borderColor: "#1A1612" }}
            ></div>
            <div
              className="c-swatch"
              style={{ background: "#FFF", border: "1px solid #ccc" }}
            ></div>
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

        <div className="shop-grid">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
