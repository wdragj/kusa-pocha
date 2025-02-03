import MyCart from "@/components/myCart/myCart";
import { subtitle } from "@/components/primitives";

export default function CartPage() {
    return (
        <section className="flex flex-col items-center justify-center gap-4">
            <h1 className={`${subtitle()} font-semibold`}>장바구니</h1>
            <MyCart />
        </section>
    );
}
