import { subtitle } from "@/components/primitives";
import { auth } from "@/lib/auth";
import ProfitAnalytics from "@/components/dashboard/profitAnalytics";
import OrderAnalytics from "@/components/dashboard/orderAnalytics";
import Orders from "@/components/dashboard/orders";

export default async function OrdersPage() {
  const session = await auth();
  const user = session?.user;

  console.log(session);

  return (
    <div>
      <ProfitAnalytics />
      <OrderAnalytics />
      <h1 className={subtitle()}>Orders</h1>
      <Orders />
    </div>
  );
}
