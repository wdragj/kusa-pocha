import MyCart from "@/components/myCart/myCart";

export default function CartPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      My Cart
      <MyCart />
    </section>
  );
}
