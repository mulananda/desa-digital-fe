import { defineStore } from "pinia";
import { axiosInstance } from "@/api/axios";
import { errorHandlerService } from "@/services/errorHandler.service";
import { notificationService } from "@/services/notification.service";

/* =====================
 * Helpers
 * ===================== */
const defaultMeta = () => ({
  current_page: 1,
  total: 0,
  last_page: 1,
  from: 0,
  to: 0,
});

export const useHeadOfFamilyStore = defineStore("head-of-family", {
  state: () => ({
    abortController: null,
    headOfFamilies: [],
    meta: defaultMeta(),
    loading: false,
    error: null,
  }),

  getters: {
    isEmpty: (state) => !state.loading && state.headOfFamilies.length === 0,
    totalData: (state) => state.meta.total || 0,
  },

  actions: {
    async fetchHeadOfFamiliesPaginated(params = {}) {
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          "head-of-family/all/paginated",
          {
            params,
            signal: this.abortController.signal,
          },
        );

        const { data, meta } = response.data.data;

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
        if (error.name === "CanceledError") return;
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
          showNotification: true,
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchHeadOfFamily(id) {
      if (!id) throw new Error("ID tidak valid");

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

    async createHeadOfFamily(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post("/head-of-family", payload);

        notificationService.success(
          response.data.message || "Kepala Keluarga Berhasil Dibuat",
          "Berhasil",
        );

        return true;
      } catch (error) {
        this.error = errorHandlerService.handle(error, {
          context: "HeadOfFamily",
        });
        return false;
      } finally {
        this.loading = false;
      }
    },

    async deleteHeadOfFamily(id) {
      if (!id) {
        notificationService.error("ID tidak valid", "Gagal Menghapus");
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.delete(`/head-of-family/${id}`);

        this.headOfFamilies = this.headOfFamilies.filter(
          (item) => item.id !== id,
        );

        if (this.meta.total > 0) this.meta.total--;

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

    resetState() {
      this.headOfFamilies = [];
      this.meta = defaultMeta();
      this.loading = false;
      this.error = null;
    },
  },
});
