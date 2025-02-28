"use client";

import { useEffect, useState } from "react";
import MyCart from "@/components/myCart/myCart";
import { subtitle } from "@/components/primitives";
import { useSession } from "@/context/sessionContext";
import { Alert } from "@heroui/react";

export default function CartPage() {
  const { session } = useSession();
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  // Global alert state – remains visible even if MyCart unmounts.
  const [globalAlert, setGlobalAlert] = useState<{
    type: "success" | "danger";
    title: string;
    message: string;
  } | null>(null);

  // Load the cart from localStorage
  const refreshCart = () => {
    const storedCart = localStorage.getItem("cartItems");
    setCartItems(storedCart ? JSON.parse(storedCart) : []);
  };

  useEffect(() => {
    if (session !== undefined) {
      setIsSessionReady(true);
      refreshCart();
      setIsLoading(false);
    }
  }, [session]);

  if (!isSessionReady) return null;

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      {/* Global Alert rendered at the top-level */}
      {globalAlert && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
          <Alert
            color={globalAlert.type}
            variant="solid"
            title={globalAlert.title}
            description={globalAlert.message}
            onClose={() => setGlobalAlert(null)}
          />
        </div>
      )}
      {isLoading ? (
        <p className="text-lg text-gray-500 mt-10">장바구니를 불러오는 중...</p>
      ) : !session?.id ? (
        <p className="text-lg text-gray-500 mt-10">로그인이 필요합니다.</p>
      ) : cartItems.length === 0 ? (
        <p className="text-lg text-gray-500 mt-10">장바구니가 비었습니다.</p>
      ) : (
        <>
          <h1 className={`${subtitle()} font-semibold`}>장바구니</h1>
          {/* Pass setGlobalAlert down to MyCart */}
          <MyCart cartItems={cartItems} refreshCart={refreshCart} setGlobalAlert={setGlobalAlert} />
        </>
      )}
    </section>
  );
}
