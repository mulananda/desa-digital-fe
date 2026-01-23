<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { Chart } from "chart.js/auto";
import { useDashboardStore } from "@/stores/dashboard";

/* ======================
 * STORE
 * ====================== */
const dashboardStore = useDashboardStore();
const { dashboardData, statistic, isLoading } = storeToRefs(dashboardStore);

/* ======================
 * CHART
 * ====================== */
const chartRef = ref(null);
let chartInstance = null;

/* ======================
 * COMPUTED (SAFE)
 * ====================== */

const totalResidents = computed(() => statistic.value?.total_population ?? 0);

const chartPayload = computed(() => {
  return (
    statistic.value?.chart ?? {
      labels: [],
      datasets: [{ data: [] }],
    }
  );
});

/* ======================
 * CHART METHODS
 * ====================== */
const createChart = async () => {
  if (!chartRef.value || chartInstance) return;

  await nextTick();

  chartInstance = new Chart(chartRef.value, {
    type: "doughnut",
    data: {
      labels: chartPayload.value.labels,
      datasets: [
        {
          data: chartPayload.value.datasets[0].data,
          backgroundColor: [
            "#34613A", // Pria
            "#8FBD55", // Wanita
            "#FA7139", // Anak
            "#FBAD48", // Balita
          ],
          borderWidth: 0,
          borderRadius: 6,
          spacing: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "69%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${ctx.parsed.toLocaleString("id-ID")} orang`,
          },
        },
      },
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
    },
  });
};

const updateChart = () => {
  if (!chartInstance) return;

  chartInstance.data.labels = chartPayload.value.labels;
  chartInstance.data.datasets[0].data = chartPayload.value.datasets[0].data;

  chartInstance.update();
};

/* ======================
 * LIFECYCLE
 * ====================== */
onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchDashboardData(),
    dashboardStore.fetchStatisticData(),
  ]);
  // Tunggu data tersedia baru buat chart
  await nextTick();
  createChart();
});

watch(chartPayload, () => {
  updateChart();
});

onBeforeUnmount(() => {
  chartInstance?.destroy();
  chartInstance = null;
});
</script>

<template>
  <div
    id="Content"
    class="relative flex flex-col flex-1 gap-[14px] p-6 pb-[30px] w-full shrink-0"
  >
    <h1 class="font-semibold text-2xl">Desa Statistics</h1>

    <!-- Row 1: Hero Card + Statistics Grid -->
    <div id="Row-1" class="flex gap-[14px]">
      <!-- Hero Card -->
      <div
        class="flex flex-col w-[calc(389/1000*100%)] h-[358px] rounded-2xl p-6 gap-6 gradient-vertical"
      >
        <img
          src="@/assets/images/icons/gift-orange-background.svg"
          class="flex size-[86px] shrink-0"
          alt="icon"
          loading="lazy"
        />
        <div class="flex flex-col gap-3">
          <p class="font-medium text-sm text-desa-lime">— Bantuan Sosial</p>
          <p class="font-semibold text-2xl text-white text-nowrap">
            Dari Desa untuk Warga ❤️
          </p>
          <p class="text-white">
            Wujudkan kesejahteraan desa dengan bantuan sosial yang tepat
            sasaran.
          </p>
        </div>
        <a
          href="#"
          class="flex items-center justify-between rounded-2xl p-4 gap-[10px] bg-white hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium text-desa-dark-green leading-5"
            >Bikin Bantuan Sosial</span
          >
          <img
            src="@/assets/images/icons/add-square-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
            loading="lazy"
          />
        </a>
      </div>

      <!-- Statistics Grid -->
      <section
        id="Statistics"
        class="grid grid-cols-2 flex-1 shrink-0 gap-[14px]"
      >
        <!-- Stat Card Component Pattern -->
        <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Jumlah Penduduk</p>
            <img
              src="@/assets/images/icons/profil-2user-foreshadow-background.svg"
              class="flex size-12 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ totalResidents || 0 }}
            </p>
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
                loading="lazy"
              />
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>

        <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Pembangunan</p>
            <img
              src="@/assets/images/icons/buildings-foreshadow-background.svg"
              class="flex size-12 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ dashboardData?.developments || 0 }}
            </p>
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
                loading="lazy"
              />
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>

        <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Kepala Rumah</p>
            <img
              src="@/assets/images/icons/crown-foreshadow-background.svg"
              class="flex size-12 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ dashboardData?.head_of_families || 0 }}
            </p>
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
                loading="lazy"
              />
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>

        <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Total Events</p>
            <img
              src="@/assets/images/icons/calendar-2-foreshadow-background.svg"
              class="flex size-12 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ dashboardData?.events || 0 }}
            </p>
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
                loading="lazy"
              />
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Row 2: Social Assistance + Events -->
    <div id="Row-2" class="flex gap-[14px]">
      <!-- Bantuan Sosial Section -->
      <section
        id="Bantuan-Sosial"
        class="flex flex-col w-[calc(497/1000*100%)] shrink-0 rounded-2xl bg-white"
      >
        <div class="flex flex-col gap-3 p-6">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Bantuan Sosial</p>
            <img
              src="@/assets/images/icons/bag-2-foreshadow-background.svg"
              class="flex size-12 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ dashboardData?.social_assistances || 0 }}
            </p>
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
                loading="lazy"
              />
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>
        <hr class="border-desa-foreshadow" />
        <div class="flex flex-col gap-4 p-6">
          <p class="font-semibold text-[20px] leading-[25px] text-left w-full">
            Bansos Terakhir
          </p>

          <!-- Social Assistance Cards -->
          <div class="card flex items-center w-full gap-3">
            <div
              class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
            >
              <img
                src="@/assets/images/icons/money-dark-green.svg"
                class="flex size-9 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-xl leading-[25px]">Rp362.500.000</p>
              <div
                class="flex items-center gap-0.5 font-medium text-desa-secondary"
              >
                <img
                  src="@/assets/images/icons/profile-secondary-green.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <span class="line-clamp-1">Diberikan oleh Shayna Sakura</span>
              </div>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
            >
              <span class="font-semibold text-xs text-white uppercase"
                >Menunggu</span
              >
            </div>
          </div>
          <hr class="border-desa-foreshadow" />

          <div class="card flex items-center w-full gap-3">
            <div
              class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
            >
              <img
                src="@/assets/images/icons/bag-2-dark-green.svg"
                class="flex size-9 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-xl leading-[25px]">Beras 10kg</p>
              <div
                class="flex items-center gap-0.5 font-medium text-desa-secondary"
              >
                <img
                  src="@/assets/images/icons/profile-secondary-green.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <span class="line-clamp-1">Diberikan oleh Angga Hikari</span>
              </div>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
            >
              <span class="font-semibold text-xs text-white uppercase"
                >Diterima</span
              >
            </div>
          </div>
          <hr class="border-desa-foreshadow" />

          <div class="card flex items-center w-full gap-3">
            <div
              class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
            >
              <img
                src="@/assets/images/icons/money-dark-green.svg"
                class="flex size-9 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-xl leading-[25px]">Rp52.500.000</p>
              <div
                class="flex items-center gap-0.5 font-medium text-desa-secondary"
              >
                <img
                  src="@/assets/images/icons/profile-secondary-green.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <span class="line-clamp-1">Diberikan oleh Obito Uciha</span>
              </div>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-orange"
            >
              <span class="font-semibold text-xs text-white uppercase"
                >Ditolak</span
              >
            </div>
          </div>
          <hr class="border-desa-foreshadow" />

          <div class="card flex items-center w-full gap-3">
            <div
              class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
            >
              <img
                src="@/assets/images/icons/money-dark-green.svg"
                class="flex size-9 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-xl leading-[25px]">Rp52.500.000</p>
              <div
                class="flex items-center gap-0.5 font-medium text-desa-secondary"
              >
                <img
                  src="@/assets/images/icons/profile-secondary-green.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <span class="line-clamp-1">Diberikan oleh Masayoshi</span>
              </div>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
            >
              <span class="font-semibold text-xs text-white uppercase"
                >Diterima</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Events Section -->
      <section
        id="Event"
        class="flex flex-col flex-1 shrink-0 rounded-2xl bg-white"
      >
        <div id="Date-Picker" class="flex flex-col gap-4 p-6">
          <div class="flex items-center justify-between">
            <button
              class="flex items-center justify-center size-14 rounded-2xl border border-desa-foreshadow hover:border-desa-dark-green transition-colors"
              aria-label="Previous month"
            >
              <img
                src="@/assets/images/icons/arrow-left-secondary-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </button>
            <p class="font-semibold text-xl">December 2024</p>
            <button
              class="flex items-center justify-center size-14 rounded-2xl border border-desa-foreshadow hover:border-desa-dark-green transition-colors"
              aria-label="Next month"
            >
              <img
                src="@/assets/images/icons/arrow-left-secondary-green.svg"
                class="flex size-6 shrink-0 rotate-180"
                alt="icon"
                loading="lazy"
              />
            </button>
          </div>

          <div class="flex justify-between">
            <button
              v-for="day in [
                '28 Sen',
                '29 Sel',
                '30 Rab',
                '31 Kam',
                '1 Jum',
                '2 Sab',
                '3 Min',
              ]"
              :key="day"
              class="group flex flex-col items-center w-[46px] h-[76px] shrink-0 gap-3"
              :class="{ active: day === '31 Kam' }"
            >
              <div
                class="flex rounded-full size-[46px] items-center justify-center bg-desa-foreshadow group-[.active]:bg-desa-soft-green transition-colors"
              >
                <span
                  class="font-medium text-desa-dark-green group-[.active]:text-white"
                >
                  {{ day.split(" ")[0] }}
                </span>
              </div>
              <span
                class="font-medium text-sm text-desa-secondary group-[.active]:text-desa-black"
              >
                {{ day.split(" ")[1] }}
              </span>
            </button>
          </div>
        </div>

        <div id="Events" class="flex flex-col flex-1 gap-4 p-6">
          <div class="flex items-center justify-between">
            <button aria-label="Previous event">
              <img
                src="@/assets/images/icons/arrow-left-secondary-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </button>
            <span class="font-medium text-desa-secondary"
              >Upcoming Events (2)</span
            >
            <button aria-label="Next event">
              <img
                src="@/assets/images/icons/arrow-left-secondary-green.svg"
                class="flex size-6 shrink-0 rotate-180"
                alt="icon"
                loading="lazy"
              />
            </button>
          </div>

          <div
            class="event-card relative flex w-full h-[365px] shrink-0 rounded-2xl bg-desa-background overflow-hidden"
          >
            <img
              src="@/assets/images/thumbnails/event-image-1.png"
              class="w-full h-full object-cover object-top"
              alt="Belajar Coding Bersama event"
              loading="lazy"
            />
            <div
              class="absolute inset-3 top-auto text-white flex flex-col rounded-[18px] border border-white/20 p-4 gap-[6px] backdrop-blur-xl bg-white/[2%]"
            >
              <p class="font-semibold text-xl leading-[25px]">
                Belajar Coding Bersama
              </p>
              <div class="flex items-center gap-1">
                <img
                  src="@/assets/images/icons/clock-white.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <p class="font-medium">11:30 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Row 3: Applicants + Resident Statistics -->
    <div id="Row-3" class="flex gap-[14px]">
      <!-- Total Applicants Section -->
      <section
        id="Total-Aplicants"
        class="flex flex-col gap-[14px] w-[calc(603/1000*100%)]"
      >
        <div class="flex flex-col flex-1 shrink-0 rounded-2xl bg-white">
          <div class="flex flex-col gap-3 p-6">
            <div class="flex items-center justify-between">
              <p class="font-medium text-desa-secondary">Total Applicants</p>
              <img
                src="@/assets/images/icons/document-text-foreshadow-background.svg"
                class="flex size-12 shrink-0"
                alt="icon"
                loading="lazy"
              />
            </div>
            <div class="flex flex-col gap-[6px]">
              <p class="font-semibold text-[32px] leading-10">1.200</p>
              <div class="flex items-center gap-0.5">
                <img
                  src="@/assets/images/icons/trend-up-dark-green-fill.svg"
                  class="flex size-[18px] shrink-0"
                  alt="icon"
                  loading="lazy"
                />
                <p class="font-medium text-sm text-desa-secondary">
                  <span class="text-desa-dark-green">+12%</span>
                  dari bulan sebelumnya
                </p>
              </div>
            </div>
          </div>
          <hr class="border-desa-foreshadow" />

          <div class="flex flex-col gap-4 p-6">
            <p
              class="font-semibold text-[20px] leading-[25px] text-left w-full"
            >
              Applicant Terakhir
            </p>

            <!-- Applicant Cards -->
            <div class="card flex items-center w-full gap-3">
              <div
                class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/kd-applicant-1.png"
                  class="w-full h-full object-cover"
                  alt="Masayoshi applicant"
                  loading="lazy"
                />
              </div>
              <div class="flex flex-col gap-[6px] w-full">
                <div class="flex items-center gap-[6px]">
                  <div
                    class="flex size-8 rounded-full overflow-hidden bg-desa-foreshadow"
                  >
                    <img
                      src="@/assets/images/photos/kk-photo-1.png"
                      class="w-full h-full object-cover"
                      alt="Masayoshi"
                      loading="lazy"
                    />
                  </div>
                  <p class="font-medium text-xl leading-[22.5px] line-clamp-1">
                    Masayoshi
                  </p>
                </div>
                <span class="font-medium text-desa-secondary line-clamp-1">
                  Melamar pembangunan Jalanan Utama Desa
                </span>
              </div>
              <div
                class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
              >
                <span class="font-semibold text-xs text-white uppercase"
                  >Menunggu</span
                >
              </div>
            </div>
            <hr class="border-desa-foreshadow" />

            <div class="card flex items-center w-full gap-3">
              <div
                class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/kd-applicant-2.png"
                  class="w-full h-full object-cover"
                  alt="Surti Jasmine applicant"
                  loading="lazy"
                />
              </div>
              <div class="flex flex-col gap-[6px] w-full">
                <div class="flex items-center gap-[6px]">
                  <div
                    class="flex size-8 rounded-full overflow-hidden bg-desa-foreshadow"
                  >
                    <img
                      src="@/assets/images/photos/kk-photo-2.png"
                      class="w-full h-full object-cover"
                      alt="Surti Jasmine"
                      loading="lazy"
                    />
                  </div>
                  <p class="font-medium text-xl leading-[22.5px] line-clamp-1">
                    Surti Jasmine
                  </p>
                </div>
                <span class="font-medium text-desa-secondary line-clamp-1">
                  Melamar pembangunan Balai Desa
                </span>
              </div>
              <div
                class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
              >
                <span class="font-semibold text-xs text-white uppercase"
                  >Diterima</span
                >
              </div>
            </div>
            <hr class="border-desa-foreshadow" />

            <div class="card flex items-center w-full gap-3">
              <div
                class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/kd-applicant-3.png"
                  class="w-full h-full object-cover"
                  alt="Mirna Wonongso applicant"
                  loading="lazy"
                />
              </div>
              <div class="flex flex-col gap-[6px] w-full">
                <div class="flex items-center gap-[6px]">
                  <div
                    class="flex size-8 rounded-full overflow-hidden bg-desa-foreshadow"
                  >
                    <img
                      src="@/assets/images/photos/kk-photo-3.png"
                      class="w-full h-full object-cover"
                      alt="Mirna Wonongso"
                      loading="lazy"
                    />
                  </div>
                  <p class="font-medium text-xl leading-[22.5px] line-clamp-1">
                    Mirna Wonongso
                  </p>
                </div>
                <span class="font-medium text-desa-secondary line-clamp-1">
                  Melamar pembangunan Puskemas Desa
                </span>
              </div>
              <div
                class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-orange"
              >
                <span class="font-semibold text-xs text-white uppercase"
                  >Ditolak</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Download Report Card -->
        <div
          class="flex items-center justify-between h-[125px] rounded-2xl p-8 gap-4 gradient-horizontal"
        >
          <div class="flex flex-col gap-[6px]">
            <p class="font-medium text-sm text-desa-lime">— Unduh Data Desa</p>
            <p class="font-semibold text-2xl text-white text-nowrap">
              Data Desa Terkini
            </p>
          </div>
          <a
            href="#"
            class="flex items-center flex-nowrap rounded-2xl p-4 gap-[10px] bg-white hover:bg-gray-50 transition-colors"
          >
            <span class="font-medium text-desa-dark-green"
              >Download Laporan</span
            >
            <img
              src="@/assets/images/icons/receive-square-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
              loading="lazy"
            />
          </a>
        </div>
      </section>

      <!-- Resident Statistics Section -->
      <section
        id="statistik-Penduduk"
        class="flex flex-col flex-1 shrink-0 gap-4 p-6 rounded-2xl bg-white"
      >
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Statistics Penduduk</p>
          <img
            src="@/assets/images/icons/profile-2user-foreshadow-background.svg"
            class="flex size-12 shrink-0"
            alt="icon"
            loading="lazy"
          />
        </div>

        <div class="relative">
          <div
            class="absolute flex flex-col gap-1 justify-center items-center text-center inset-0 pointer-events-none"
          >
            <p class="font-semibold text-[32px] leading-10">
              {{ totalResidents }}
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Jumlah Penduduk
            </p>
          </div>
          <canvas ref="chartRef" class="size-[288px] mx-auto"></canvas>
        </div>

        <div
          v-for="item in statistic.list"
          :key="item.key"
          class="flex flex-col gap-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-1">
              <p class="font-medium leading-5 flex items-center">
                <span
                  class="block size-2 rounded-full mr-[6px]"
                  :class="{
                    'bg-desa-dark-green': item.label === 'Pria',
                    'bg-desa-soft-green': item.label === 'Wanita',
                    'bg-desa-orange': item.label === 'Anak-anak',
                    'bg-desa-yellow': item.label === 'Balita',
                  }"
                ></span>
                {{ item.label }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Rentang usia: {{ item.age_range }}
              </p>
            </div>
            <p class="flex items-center font-medium leading-5">
              {{ item.count }}
              <img
                src="@/assets/images/icons/user-black.svg"
                class="flex size-[18px] shrink-0 ml-0.5"
                alt="icon"
                loading="lazy"
              />
            </p>
          </div>
          <hr class="border-desa-foreshadow" />
        </div>
      </section>
    </div>
  </div>
</template>
