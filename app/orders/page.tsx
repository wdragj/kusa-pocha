import { subtitle } from "@/components/primitives";
import { auth } from "@/lib/auth";

export default async function OrdersPage() {
  const session = await auth();
  const user = session?.user;

  console.log(session);

  return (
    <div>
      <h1 className={subtitle()}>Orders</h1>
    </div>
  );
}
