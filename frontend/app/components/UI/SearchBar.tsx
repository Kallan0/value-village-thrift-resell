import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

// mock data
const TRENDING_SEARCHES = ["Vintage Leather Jacket", "Nike Dunks", "Levis 501", "Y2K Tops"];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load recent searches from the browser's memory on load
  useEffect(() => {
    const saved = localStorage.getItem("value-village-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close the dropdown if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Execute the search and save it to history
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    // Save to recent searches (keep max 5, remove duplicates)
    const newRecents = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem("value-village-recent-searches", JSON.stringify(newRecents));

    setIsOpen(false);
    
    // Navigate to the shop page with the search query in the URL
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const clearRecents = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from closing
    setRecentSearches([]);
    localStorage.removeItem("value-village-recent-searches");
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '300px' }}>
      
      {/* THE INPUT BAR */}
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search items, brands..."
          style={{
            width: '100%',
            padding: '10px 16px 10px 40px',
            borderRadius: '24px',
            border: `1px solid ${isOpen ? 'var(--brown)' : 'var(--border-color)'}`,
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-main)',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />
        {/* Search Icon SVG inside the input */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="var(--text-muted)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* THE DROPDOWN MENU */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          
          {/* RECENT SEARCHES SECTION */}
          {recentSearches.length > 0 && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Recent
                </span>
                <button onClick={clearRecents} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                  Clear
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {recentSearches.map(term => (
                  <div 
                    key={term} 
                    onClick={() => handleSearch(term)}
                    style={{ padding: '8px', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-base)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>🕒</span>
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentSearches.length > 0 && <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />}

          {/* TRENDING SEARCHES SECTION */}
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Trending Right Now
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {TRENDING_SEARCHES.map(term => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-base)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brown)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  🔥 {term}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}