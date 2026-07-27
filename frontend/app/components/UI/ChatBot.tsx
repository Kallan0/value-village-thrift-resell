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
            const response = await fetch("http://localhost:5000/api/chat/faqs");
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
      } else {
        throw new Error("Failed to log chat");
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
  <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
    
    {/* THE TOGGLE BUTTON */}
    {!isOpen && (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ 
          width: '60px', height: '60px', borderRadius: '50%', 
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
          color: '#fff', border: 'none', cursor: 'pointer', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '24px',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      > 
        💬
      </button>
    )}

    {/* THE CHAT WINDOW */}
    {isOpen && (
      <div style={{ 
        width: '350px', height: '550px', backgroundColor: '#fff', 
        borderRadius: '24px', display: 'flex', flexDirection: 'column', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)', overflow: 'hidden' 
      }}>
        
        {/* Header */}
        <div style={{ 
          padding: '16px 20px', backgroundColor: '#fff', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Fake Avatar */}
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'linear-gradient(45deg, #f09433, #bc1888)', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              color: '#fff', fontSize: '14px', fontWeight: 'bold' 
            }}>
              B
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#262626' }}>Support Bot</h3>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#262626', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>✕</button>
        </div>

        {/* Chat History */}
        <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fff' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              
              {/* The Bubble */}
              <div style={{ 
                maxWidth: '75%', padding: '12px 16px', fontSize: '15px', lineHeight: '1.4',
                backgroundColor: msg.sender === 'user' ? '#3797F0' : '#EFEFEF',
                color: msg.sender === 'user' ? '#fff' : '#262626',
                borderRadius: '22px',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '22px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '22px',
              }}>
                {msg.text}
              </div>

              {/* The Feedback Buttons */}
              {msg.sender === 'bot' && msg.dbLogId && !msg.feedbackGiven && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', marginLeft: '8px' }}>
                  <button onClick={() => submitFeedback(msg.dbLogId!, msg.id, 'good')} style={{ fontSize: '14px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer', filter: 'grayscale(100%)', opacity: 0.5, transition: '0.2s' }}>👍</button>
                  <button onClick={() => submitFeedback(msg.dbLogId!, msg.id, 'bad')} style={{ fontSize: '14px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer', filter: 'grayscale(100%)', opacity: 0.5, transition: '0.2s' }}>👎</button>
                </div>
              )}
              {msg.feedbackGiven && (
                 <span style={{ fontSize: '12px', color: '#8E8E8E', marginTop: '4px', marginLeft: '8px' }}>Thanks!</span>
              )}
            </div>
          ))}
        </div>

        {/* Quick Replies (FAQs formatted as horizontal scrollable chips) */}
        {dynamicFAQ.length > 0 && (
          <div style={{ padding: '0 16px 12px', backgroundColor: '#fff' }}>
            <style>
              {`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}
            </style>
            <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%', paddingBottom: '4px' }}>
              {dynamicFAQ.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleQuestionClick(item)}
                  style={{ 
                    padding: '8px 16px', borderRadius: '20px', border: '1px solid #DBDBDB', 
                    backgroundColor: '#fff', color: '#262626', fontSize: '14px', cursor: 'pointer',
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* The Textbox Input Area (Borderless, Gray Pill Background) */}
        <div style={{ padding: '12px 16px 20px', backgroundColor: '#fff' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', backgroundColor: '#EFEFEF', 
            borderRadius: '24px', padding: '4px 4px 4px 16px' 
          }}>
            <input 
              type="text" 
              placeholder="Message..." 
              style={{ 
                flexGrow: 1, border: 'none', background: 'transparent', 
                outline: 'none', fontSize: '15px', color: '#262626', padding: '8px 0' 
              }} 
            />
            <button 
              style={{ 
                border: 'none', background: '#3797F0', color: '#fff', 
                borderRadius: '50%', width: '32px', height: '32px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                cursor: 'pointer', marginLeft: '8px', fontWeight: 'bold'
              }}
            >
              ↑
            </button>
          </div>
        </div>

      </div>
    )}
  </div>
);
}