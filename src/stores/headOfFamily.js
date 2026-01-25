// stores/headOfFamily.js
import { defineStore } from "pinia";
import { axiosInstance } from "@/api/axios";
import { errorHandlerService } from "@/services/errorHandler.service";
import { notificationService } from "@/services/notification.service";
import { create } from "lodash";
import router from "@/router";
import { ROUTE_NAMES } from "@/config/routes.config";

export const useHeadOfFamilyStore = defineStore("head-of-family", {
  state: () => ({
    headOfFamilies: [],
    meta: {
      current_page: 1,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0,
    },
    loading: false,
    error: null,
  }),

  getters: {
    // ✅ Computed getter untuk status kosong
    isEmpty: (state) => !state.loading && state.headOfFamilies.length === 0,

    // ✅ Getter untuk total data
    totalData: (state) => state.meta.total || 0,
  },

  actions: {
    /**
     * ✅ Fetch semua data (tanpa pagination)
     */
    async fetchHeadOfFamilies(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get("head-of-family", { params });
        this.headOfFamilies = response.data.data;
        return response.data.data;
      } catch (error) {
        // ✅ Untuk fetch, cukup handle error tanpa validation
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * ✅ Fetch data dengan pagination + search
     */
    async fetchHeadOfFamiliesPaginated(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          "head-of-family/all/paginated",
          { params },
        );

        const { data, meta } = response.data.data;

        // ✅ Update state dengan data baru
        this.headOfFamilies = data;
        this.meta = {
          current_page: meta.current_page,
          total: meta.total,
          last_page: meta.last_page,
          from: meta.from,
          to: meta.to,
        };

        return { data, meta };
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
          showNotification: true,
        });

        // ✅ Reset data saat error
        this.headOfFamilies = [];
        this.meta = {
          current_page: 1,
          total: 0,
          last_page: 1,
          from: 0,
          to: 0,
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * ✅ Fetch single data by ID
     */
    async fetchHeadOfFamily(id) {
      if (!id) {
        throw new Error("ID tidak valid");
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(`/head-of-family/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
          showNotification: true,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * ✅ Create data
     */
    async createHeadOfFamily(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post("/head-of-family", payload);
        this.success = response.data.message;

        notificationService.success(
          response.data.message || "Kepala Keluarga Berhasil Dibuat",
          "Berhasil",
        );
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * ✅ Delete head of family
     */
    async deleteHeadOfFamily(id) {
      if (!id) {
        notificationService.error("ID tidak valid", "Gagal Menghapus");
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.delete(`/head-of-family/${id}`);

        // ✅ Optimistic update - hapus dari state lokal
        this.headOfFamilies = this.headOfFamilies.filter(
          (item) => item.id !== id,
        );

        // ✅ Update meta total
        if (this.meta.total > 0) {
          this.meta.total -= 1;
        }

        notificationService.success(
          response.data.message || "Kepala Keluarga Berhasil Dihapus",
          "Berhasil",
        );

        return true;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
          showNotification: true,
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * ✅ Reset state ke default
     */
    resetState() {
      this.headOfFamilies = [];
      this.meta = {
        current_page: 1,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
      };
      this.loading = false;
      this.error = null;
    },
  },
});
