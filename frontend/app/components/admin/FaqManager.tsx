import { useState, useEffect } from "react";

interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "", order: 10, isActive: true });

  // 1. Fetch FAQs on Load
  const fetchFaqs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/faqs");
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // 2. Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/chat/faqs/${editingId}`
      : `http://localhost:5000/api/chat/faqs`;
    
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ question: "", answer: "", order: 10, isActive: true });
        fetchFaqs(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to save FAQ");
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await fetch(`http://localhost:5000/api/chat/faqs/${id}`, { method: "DELETE" });
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error("Failed to delete FAQ");
    }
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq._id);
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order, isActive: faq.isActive });
  };

  if (loading) return <div style={{ color: 'var(--text-main)' }}>Loading Knowledge Base...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* --- ADD/EDIT FORM --- */}
      <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-main)' }}>
          {editingId ? "✏️ Edit FAQ" : "➕ Add New FAQ"}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Question (e.g., Do you ship internationally?)" 
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'inherit' }}
          />
          <textarea 
            placeholder="Answer" 
            value={formData.answer}
            onChange={(e) => setFormData({...formData, answer: e.target.value})}
            required
            rows={3}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)', fontFamily: 'inherit' }}
          />
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
              Order (e.g., 10, 20):
              <input 
                type="number" 
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              Active
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: 'var(--brown)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {editingId ? "Update FAQ" : "Save FAQ"}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ question: "", answer: "", order: 10, isActive: true }); }} style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- FAQ LIST --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Current Knowledge Base</h3>
        {faqs.map(faq => (
          <div key={faq._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: 'var(--bg-base)', borderRadius: '4px', color: 'var(--text-muted)' }}>Order: {faq.order}</span>
                {!faq.isActive && <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>Inactive</span>}
                <strong style={{ color: 'var(--text-main)' }}>{faq.question}</strong>
              </div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>{faq.answer}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => startEdit(faq)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
              <button onClick={() => handleDelete(faq._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No FAQs added yet.</p>}
      </div>

    </div>
  );
}