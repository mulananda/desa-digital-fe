import { errorHandlerService } from "@/services/errorHandler.service";
import { axiosInstance } from "@/api/axios";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    dashboardData: null,
    statistic: {
      list: [],
    },

    loadingDashboard: false,
    loadingStatistic: false,

    error: null,
  }),

  getters: {
    isLoading: (state) => state.loadingDashboard || state.loadingStatistic,
  },

  actions: {
    async fetchDashboardData() {
      this.loadingDashboard = true;
      this.error = null;

      try {
        const { data } = await axiosInstance.get(
          "/dashboard/get-dashboard-data",
        );
        this.dashboardData = data.data ?? data;
      } catch (err) {
        this.error = errorHandlerService.handle(err, {
          context: "Dashboard Data",
        });
        throw this.error;
      } finally {
        this.loadingDashboard = false;
      }
    },

    async fetchStatisticData() {
      this.loadingStatistic = true;
      this.error = null;

      try {
        const { data } = await axiosInstance.get("/dashboard/get-statistic");
        this.statistic = data.data ?? data;
      } catch (err) {
        this.error = errorHandlerService.handle(err, {
          context: "Population Statistic",
        });
        throw this.error;
      } finally {
        this.loadingStatistic = false;
      }
    },
  },
});
