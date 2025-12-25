import { defineStore } from "pinia";
import { axiosInstance } from "@/api/axios";
import { errorHandlerService } from "@/services/errorHandler.service";
import { notificationService } from "@/services/notification.service";
import { ROUTE_NAMES } from "@/config/routes.config";
import router from "@/router";

export const useHeadOfFamilyStore = defineStore("head-of-family", {
  state: () => ({
    headOfFamilies: [],
    meta: {
      per_page: 10,
      total: 0,
    },
    loading: false,
    error: null,
    success: null,
  }),

  actions: {
    async fetchHeadOfFamilies(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get("head-of-family", { params });
        this.headOfFamilies = response.data.data;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchHeadOfFamiliesPaginated(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          "head-of-family/all/paginated",
          { params }
        );

        const { data, meta } = response.data.data;

        this.headOfFamilies = data;
        this.meta = meta;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchHeadOfFamily(id) {
      this.loading = true;

      try {
        const response = await axiosInstance.get(`/head-of-family/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
      } finally {
        this.loading = false;
      }
    },

    async deleteHeadOfFamily(id) {
      // Validate ID
      if (!id) {
        const error = new Error("ID tidak valid");
        this.error = error.message;
        notificationService.error("ID tidak valid", "Gagal Menghapus");
        throw error;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.delete(`/head-of-family/${id}`);
        this.success = response.data.message;

        await router.push({ name: ROUTE_NAMES.HEAD_OF_FAMILY });

        // Show success notification
        notificationService.success(
          "Kepala Keluarga Berhasil Dihapus",
          "Berhasil"
        );
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
          showNotification: true,
        });

        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
