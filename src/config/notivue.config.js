// Notivue configuration
export const notivueConfig = {
  position: "top-center",
  limit: 3,
  enqueue: true,
  avoidDuplicates: true,
  pauseOnHover: true, // ← Pause saat hover
  // animations: {
  //   enter: "Notivue__enter",
  //   leave: "Notivue__leave",
  //   clearAll: "Notivue__clearAll",
  // },
  // transition: "transform 0.35s cubic-bezier(0.5, 1, 0.25, 1)",
  notifications: {
    global: {
      duration: 4000, // Default 4 detik
    },
  },
};
