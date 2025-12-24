import { axiosInstance } from "@/api/axios";
import { defineStore } from "pinia";
import { errorHandlerService } from "@/services/errorHandler.service";
import { logger } from "@/utils/helpers";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    dashboardData: {},
    loading: false,
    error: null,
    // success: null,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          "/dashboard/get-dashboard-data"
        );

        this.dashboardData = response.data.data;
        // logger.info("Dashboard data:", this.dashboardData);
      } catch (error) {
        // ⬇️ Ambil error dari errorHandler.service
        this.error = errorHandlerService.handle(error, {
          context: "Dashboard",
        });
      } finally {
        this.loading = false;
      }
    },
  },
});
