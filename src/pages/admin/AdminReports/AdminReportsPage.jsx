import { useSelector } from "react-redux";
import { cn } from "../../../utils/cn";
import { selectOrders, selectProducts } from "../../../store/dataSlice";
import { useReportStats } from "./useReportStats";
import { ReportsFilterBar } from "./ReportsFilterBar";
import { StatsGrid } from "./StatsGrid";
import { RevenueCharts } from "./RevenueCharts";

export const AdminReportsPage = () => {
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);

  const reportState = useReportStats(orders, products);

  return (
    <div>
      <h1 className={cn("text-3xl font-bold text-gray-900 mb-8")}>
        Full Reports
      </h1>

      <ReportsFilterBar {...reportState} />
      <StatsGrid stats={reportState.stats} />

      <RevenueCharts
        stats={reportState.stats}
        filterMonth={reportState.filterMonth}
        filterProductId={reportState.filterProductId}
      />
    </div>
  );
};
