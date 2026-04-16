
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import ChatBot from "@/features/chatbot/components/ChatBot";


export const MainLayout = () => {
  return (
    // min-h-screen + flex-col giúp footer luôn ở đáy
    <div className="flex min-h-screen flex-col font-sans bg-white">
      <CartDrawer />
      <Header />

      {/* flex-1: Chiếm hết khoảng trống còn lại */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />

      <ChatBot />


    </div>
  );
};
