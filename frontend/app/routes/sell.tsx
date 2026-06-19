import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Women's");
  const [condition, setCondition] = useState("Good");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle the image selection and create a temporary preview URL
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please upload an image of your item!");
    if (!user) return alert("You must be logged in to sell items.");

    setIsUploading(true);

    // 1. Pack the data into FormData (required for sending files!)
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("sellerId", user.id); 
    formData.append("image", image); // The actual file!

    try {
      // 2. Send it to our new Cloudinary backend route
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData, // Notice we do NOT use JSON.stringify here
      });

      const data = await response.json();

      if (response.ok) {
        alert("Item added to your closet successfully!");
        navigate("/shop"); // Send them to the shop to see their item
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload item.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--brown)', marginBottom: '8px' }}>
        SELL YOUR <span style={{ color: 'var(--red)' }}>FINDS</span>
      </h1>
      <p style={{ color: 'var(--brown-muted)', marginBottom: '32px' }}>List your pre-loved items in minutes and keep 85% of the sale.</p>

      <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* LEFT COLUMN: Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div 
            style={{ 
              aspectRatio: '4/5', 
              border: '2px dashed var(--border)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'var(--cream)',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--brown-muted)' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📸</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Click to upload photo</div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Item Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-field">
            <label className="form-label">Item Name</label>
            <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Vintage Levi's 501" />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Price ($)</label>
              <input type="number" className="form-input" required value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-field">
              <label className="form-label">Condition</label>
              <select className="form-input" value={condition} onChange={e => setCondition(e.target.value)}>
                <option>New with tags</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair / Vintage Wear</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              <option>Women's</option>
              <option>Men's</option>
              <option>Shoes</option>
              <option>Accessories</option>
              <option>Vintage</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              required 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Tell shoppers about the fit, fabric, and any flaws..."
              style={{ minHeight: '120px', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isUploading} style={{ padding: '16px', marginTop: 'auto' }}>
            {isUploading ? 'UPLOADING...' : 'LIST ITEM →'}
          </button>
        </div>
      </form>
    </div>
  );
}