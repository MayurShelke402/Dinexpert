import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ActiveOrders from "./pages/ActiveOrder.jsx";
import BottomNav from "./components/BottomNav.jsx";
import HotelHeader from "./components/Header.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import AdminPage from "./components/admin/AdminDashboard.jsx";

import AdminAnalytics from "./pages/Admin/AdminAnalytics.jsx";
import AdminOrders from "./pages/admin/OrderHistory.jsx";
import OrderHistory from "./pages/admin/OrderHistory.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import BillSummary from "./pages/BillSummary.jsx";
import Cart from "./pages/Cart.jsx";



export default function App() {
  const location = useLocation();
  
  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      
      {!isAdminRoute && <HotelHeader />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:productSlug" element={<ProductDetail />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/activeorders" element={<ActiveOrders />} />
        <Route path="/orders" element={<Cart />} />
        <Route path="/order/table/:qrCodeValue" element={<OrderPage />} />
        <Route path="/admin" element={<AdminPage />} />
       
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/order-history" element={<OrderHistory />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/summary" element={<BillSummary />} />
        

      </Routes>
      
      {!isAdminRoute && <BottomNav />}
    </>
  );
}
