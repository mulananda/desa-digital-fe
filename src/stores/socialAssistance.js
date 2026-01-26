import { defineStore } from "pinia";

export const socialAssistanceStores = defineStore("social-assistance", {
  state: () => ({
    socialAssistances: [],
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
  actions: {
    /**
     * ✅ Fetch data dengan pagination + search
     */
    async fetchSocialAssistances(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get(
          "social-assistance/all/paginated",
          { params },
        );

        const { data, meta } = response.data.data;

        // ✅ Update state dengan data baru
        this.socialAssistances = data;
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
          context: "socialAssistances",
          showNotification: true,
        });

        // ✅ Reset data saat error
        this.socialAssistances = [];
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
  },
});
