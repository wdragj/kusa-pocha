"use client";

import { useEffect, useState } from "react";
import MyCart from "@/components/myCart/myCart";
import { subtitle } from "@/components/primitives";
import { useSession } from "@/context/sessionContext";

export default function CartPage() {
    const { session } = useSession();
    const [isSessionReady, setIsSessionReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    // useEffect(() => {
    //     if (session !== undefined) {
    //         setIsSessionReady(true); // Mark session as ready when it's defined
    //         if (session?.id) {
    //             fetchCart();
    //         } else {
    //             setIsLoading(false); // Stop loading if user is not logged in
    //         }
    //     }
    // }, [session]);

    // const fetchCart = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await fetch(`/api/cart?userId=${session?.id}`);
    //         if (!response.ok) throw new Error("Failed to fetch cart");
    //         const result = await response.json();
    //         setCartItems(result);
    //     } catch (error) {
    //         console.error("Error fetching cart:", error);
    //         setCartItems([]);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // // Prevent rendering until session check is completed
    // if (!isSessionReady) return null;

    // Function to load the cart from localStorage
    const refreshCart = () => {
        const storedCart = localStorage.getItem("cartItems");
        setCartItems(storedCart ? JSON.parse(storedCart) : []);
    };

    useEffect(() => {
        if (session !== undefined) {
            setIsSessionReady(true);
            // Load the cart from localStorage instead of from an API
            refreshCart();
            setIsLoading(false);
        }
    }, [session]);

    if (!isSessionReady) return null;

    return (
        <section className="flex flex-col items-center justify-center gap-4">
            {isLoading ? (
                <p className="text-lg text-gray-500 mt-10">장바구니를 불러오는 중...</p>
            ) : !session?.id ? (
                <p className="text-lg text-gray-500 mt-10">로그인이 필요합니다.</p>
            ) : cartItems.length === 0 ? (
                <p className="text-lg text-gray-500 mt-10">장바구니가 비었습니다.</p>
            ) : (
                <>
                    <h1 className={`${subtitle()} font-semibold`}>장바구니</h1>
                    {/* <MyCart cartItems={cartItems} refreshCart={fetchCart} /> */}
                    <MyCart cartItems={cartItems} refreshCart={refreshCart} />
                </>
            )}
        </section>
    );
}
