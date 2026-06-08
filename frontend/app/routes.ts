import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Maps the root URL ("/") to your home.tsx file
  index("routes/home.tsx"),

  // Maps login page & register page to their respective files
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Maps "/shop" to your shop.tsx file
  route("shop", "routes/shop.tsx"),


  // Maps "/about" to your about.tsx file
  route("about", "routes/about.tsx"),
  
  // Maps "/cart" to your cart.tsx file (once you create it)
  route("cart", "routes/cart.tsx"),
  
  // Maps "/checkout" to your checkout.tsx file (once you create it)
  route("checkout", "routes/checkout.tsx"),
  
  // Maps a dynamic URL like "/product/123" to a product details page
  route("product/:id", "routes/product.$id.tsx")
] satisfies RouteConfig;