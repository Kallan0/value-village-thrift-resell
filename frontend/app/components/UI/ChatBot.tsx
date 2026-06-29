import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust path to your auth context


interface Message {
  id: string; // A temporary local ID for mapping
  sender: 'user' | 'bot';
  text: string;
  dbLogId?: string; // The MongoDB ID, assigned only to bot messages
  feedbackGiven?: boolean;
}

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);

  const [dynamicFAQ, setDynamicFAQ] = useState<{ question: string, answer: string }[]>([]);

useEffect(() => {
    const fetchFAQ = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/chat/faq");
            if (response.ok) {
                const data = await response.json();
                setDynamicFAQ(data);
            }
        } catch (error) {
            console.error("Failed to fetch FAQ data", error);
        }
    };
    fetchFAQ();
}, []);


  const handleQuestionClick = async (qaPair: { question: string, answer: string }) => {
    // 1. Instantly show the user's question and the bot's answer locally
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: qaPair.question };
    const botMsgId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, userMsg, { id: botMsgId, sender: 'bot', text: 'Typing...' }]);

    // 2. Send the data to your backend to be logged
    try {
      const response = await fetch("http://localhost:5000/api/chat/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id, // Works whether logged in or guest
          question: qaPair.question,
          answer: qaPair.answer
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // 3. Update the typing message with the real answer AND the MongoDB logId
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: qaPair.answer, dbLogId: data.logId } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Failed to log chat");
      // Still show the answer even if logging fails, for good UX
      setMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, text: qaPair.answer } : msg));
    }
  };

  const submitFeedback = async (dbLogId: string, localMsgId: string, feedback: 'good' | 'bad') => {
    // Optimistically hide the buttons locally
    setMessages(prev => prev.map(msg => msg.id === localMsgId ? { ...msg, feedbackGiven: true } : msg));

    try {
      await fetch(`http://localhost:5000/api/chat/feedback/${dbLogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback })
      });
    } catch (error) {
      console.error("Failed to send feedback");
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      
      {/* THE TOGGLE BUTTON */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--white)', color: '#ff0505', border: '2px solid #ff0505', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '24px' }}
        >          💬
        </button>
      )}

      {/* THE CHAT WINDOW */}
      {isOpen && (
        <div style={{ width: '320px', height: '480px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ padding: '16px', backgroundColor: 'var(--brown)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Support Bot</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>✖</button>
          </div>

          {/* Chat History */}
          <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                
                {/* The Bubble */}
                <div style={{ 
                  maxWidth: '85%', padding: '10px 14px', borderRadius: '16px', fontSize: '14px', lineHeight: '1.4',
                  backgroundColor: msg.sender === 'user' ? 'var(--brown)' : 'var(--bg-base)',
                  color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                }}>
                  {msg.text}
                </div>

                {/* The Feedback Buttons (Only show for bot answers that have a dbLogId and haven't been rated yet) */}
                {msg.sender === 'bot' && msg.dbLogId && !msg.feedbackGiven && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', marginLeft: '4px' }}>
                    <button onClick={() => submitFeedback(msg.dbLogId!, msg.id, 'good')} style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>👍</button>
                    <button onClick={() => submitFeedback(msg.dbLogId!, msg.id, 'bad')} style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>👎</button>
                  </div>
                )}
                {msg.feedbackGiven && (
                   <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', marginLeft: '4px' }}>Thanks for the feedback!</span>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Options (The "Keyboard") */}
{/* FAQ Options (The Dynamic "Keyboard") */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-base)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Ask a question:</span>
            
            {dynamicFAQ.length === 0 ? (
               <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading options...</span>
            ) : (
              dynamicFAQ.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleQuestionClick(item)}
                  style={{ /* your existing button styles */ }}
                >
                  {item.question}
                </button>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}