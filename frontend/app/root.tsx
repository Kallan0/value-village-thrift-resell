import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext"; 
import { WishlistProvider } from "./context/WishlistContext";
import { useEffect, useState } from "react";
import "./app.css";
import Chatbot from "./components/UI/ChatBot";


export default function Root() {

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    setTheme(savedTheme);
  }, []);

  
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Value Village — Thrift & Resale</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
       <AuthProvider>
          <WishlistProvider> {/* <-- 2. Wrap the app */}
            <Navbar />
            <div style={{ paddingTop: '68px', minHeight: '100vh' }}>
              <Outlet context={{theme, setTheme}} />
              <Chatbot/>
            </div>
            <Footer />
          </WishlistProvider>
        </AuthProvider>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}