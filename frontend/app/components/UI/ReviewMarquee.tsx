import React from "react";
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jane",
    username: "@jane",
    img: "https://avatar.vercel.sh/jane",
    body: "This is the best thing I've ever bought. I can't believe how good it is.",
  },
  {
    name: "John",
    username: "@john", 
    body: "I love this product. It's so good.", 
    img: "https://avatar.vercel.sh/john"
 },
  {name: "Alice", username: "@alice", body: "This is the best thing I've ever bought. I can't believe how good it is.", img: "https://avatar.vercel.sh/alice"},
  {name: "Bob", username: "@bob", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/bob"},
  {name: "Charlie", username: "@charlie", body: "This is the best thing I've ever bought. I can't believe how good it is.", img: "https://avatar.vercel.sh/charlie"},
  {name: "David", username: "@david", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/david"},
  {name: "Eve", username: "@eve", body: "This is the best thing I've ever bought. I can't believe how good it is.", img: "https://avatar.vercel.sh/eve"},
  {name: "Frank", username: "@frank", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://avatar.vercel.sh/frank"},
  {name: "Grace", username: "@grace", body: "This is the best thing I've ever bought. I can't believe how good it is.", img: "https://avatar.vercel.sh/grace"}
  // ... rest of your reviews
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// 1. YOUR CLEAN STYLED CARD
const ReviewCard = ({ img, name, username, body }: { img: string; name: string; username: string; body: string }) => {
  return (
    <figure
      style={{
        position: 'relative', width: '256px', cursor: 'pointer', overflow: 'hidden',
        borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)',
        padding: '16px', backgroundColor: 'var(--cream, #fff)', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', display: 'flex',
        flexDirection: 'column', gap: '8px', flexShrink: 0, 
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
        <img style={{ borderRadius: '50%' }} width="32" height="32" alt="" src={img} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <figcaption style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main, #000)' }}>{name}</figcaption>
          <p style={{ fontSize: '12px', color: 'var(--brown-muted, #666)', margin: 0 }}>{username}</p>
        </div>
      </div>
      <blockquote style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-main, #333)' }}>"{body}"</blockquote>
    </figure>
  );
};

// 2. THE NEW BULLETPROOF MARQUEE WRAPPER
const StandardMarquee = ({ children, reverse = false, duration = "40s" }: { children: React.ReactNode, reverse?: boolean, duration?: string }) => {
  return (
    <div style={{ display: 'flex', overflow: 'hidden', width: '100%', gap: '16px' }}>
      <div
        className={`marquee-content ${reverse ? 'marquee-reverse' : ''}`}
        style={{ display: 'flex', gap: '16px', minWidth: 'min-content', animationDuration: duration }}
      >
        {/* We render the children TWICE here so it loops seamlessly! */}
        {children}
        {children}
      </div>
    </div>
  );
};

// 3. THE MAIN LAYOUT
export default function ReviewMarquee() {
  return (
    <div style={{
      position: 'relative', display: 'flex', width: '100%', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '20px 0'
    }}>
      
      {/* We now use StandardMarquee instead of MagicUI's broken component */}
      <div style={{ marginBottom: '16px', width: '100%' }}>
        <StandardMarquee duration="30s">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </StandardMarquee>
      </div>
      
      <div style={{ width: '100%' }}>
        <StandardMarquee reverse duration="30s">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </StandardMarquee>
      </div>

      <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, left: 0, width: '15%', background: 'linear-gradient(to right, var(--bg-base, white), transparent)' }}></div>
      <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, bottom: 0, right: 0, width: '15%', background: 'linear-gradient(to left, var(--bg-base, white), transparent)' }}></div>
    </div>
  );
}