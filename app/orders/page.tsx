import { subtitle } from "@/components/primitives";
import ProfitAnalytics from "@/components/dashboard/profitAnalytics";
import OrderAnalytics from "@/components/dashboard/orderAnalytics";
import Orders from "@/components/dashboard/orders";

export default async function OrdersPage() {
  return (
    <div>
      <ProfitAnalytics />
      <OrderAnalytics />
      <h1 className={subtitle()}>Orders</h1>
      <Orders />
    </div>
  );
}
