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
import "./app.css";
import { WishlistProvider } from "./context/WishlistContext";

export default function Root() {
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
              <Outlet />
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