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
  
  // UPGRADED STATE: Now handling arrays!
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // UPGRADED HANDLER: Allow up to 5 images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (images.length + selectedFiles.length > 5) {
        return alert("You can only upload a maximum of 5 images.");
      }

      const newFiles = [...images, ...selectedFiles];
      setImages(newFiles);

      // Create preview URLs for the newly added files
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one image!");
    if (!user) return alert("You must be logged in to sell items.");

    setIsUploading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("sellerId", user.id); 
    
    // UPGRADE: Loop through all files and append them to the 'images' key
    images.forEach(image => {
      formData.append("images", image); 
    });

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Item added to your closet successfully!");
        navigate("/shop");
      } else {
        alert(data.message);
      }
    } catch (error) {
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
      <p style={{ color: 'var(--brown-muted)', marginBottom: '32px' }}>Add up to 5 photos to show off your item.</p>

      <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* LEFT COLUMN: Multi-Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Upload Box */}
          {images.length < 5 && (
            <div 
              style={{ 
                aspectRatio: '4/5', border: '2px dashed var(--border)', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'var(--cream)', cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{ textAlign: 'center', color: 'var(--brown-muted)' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>📸</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Click to upload (Max 5)</div>
              </div>
              {/* Note the 'multiple' attribute here! */}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handleImageChange} />
            </div>
          )}

          {/* Image Previews Grid */}
          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {previews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Item Details (Keep exactly as it was) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ... (Your existing input fields go here: Name, Price, Condition, Category, Description) ... */}
          
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