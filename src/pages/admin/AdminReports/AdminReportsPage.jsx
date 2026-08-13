import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "../../../utils/cn";
import {
  fetchOrdersThunk,
  selectOrders,
  selectProducts,
} from "../../../store/dataSlice";
import { useReportStats } from "./useReportStats";
import { ReportsFilterBar } from "./ReportsFilterBar";
import { StatsGrid } from "./StatsGrid";
import { RevenueCharts } from "./RevenueCharts";
import { useTranslation } from "react-i18next";

export const AdminReportsPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);
  const { t } = useTranslation(["admin", "common"]);

  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  const reportState = useReportStats(orders, products);

  return (
    <div>
      <h1 className={cn("text-3xl font-bold text-gray-900 mb-8")}>
        {t("fullReports")}
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
