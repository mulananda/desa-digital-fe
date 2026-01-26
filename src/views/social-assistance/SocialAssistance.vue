<script setup></script>
<template>
  <div id="Header" class="flex items-center justify-between">
    <h1 class="font-semibold text-2xl">List Bantuan Sosial</h1>
    <a
      href="kd-bantuan-sosial-add.html"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
    >
      <img
        src="@/assets/images/icons/add-square-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
      <p class="font-medium text-white">Add New</p>
    </a>
  </div>
  <section id="List-Bantuan-Sosial" class="flex flex-col gap-[14px]">
    <form id="Page-Search" class="flex items-center justify-between">
      <div class="flex flex-col gap-3 w-[370px] shrink-0">
        <label class="relative group peer w-full valid">
          <input
            type="text"
            placeholder="Cari nama bantuan social"
            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 pl-12 pr-6 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          />
          <div
            class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
          >
            <img
              src="@/assets/images/icons/receipt-search-secondary-green.svg"
              class="size-6 hidden group-has-[:placeholder-shown]:flex"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/receipt-search-black.svg"
              class="size-6 flex group-has-[:placeholder-shown]:hidden"
              alt="icon"
            />
          </div>
        </label>
      </div>
      <div class="options flex items-center gap-4">
        <div class="flex items-center gap-[10px]">
          <span class="font-medium leading-5">Show</span>
          <div class="relative">
            <select
              name=""
              id=""
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-6 pr-[52px] gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
            >
              <option value="5" selected>5 Entries</option>
              <option value="10">10 Entries</option>
              <option value="20">20 Entries</option>
              <option value="30">30 Entries</option>
              <option value="40">40 Entries</option>
              <option value="50">50 Entries</option>
            </select>
            <img
              src="@/assets/images/icons/arrow-down-black.svg"
              class="flex size-6 shrink-0 absolute transform -translate-y-1/2 top-1/2 right-6"
              alt="icon"
            />
          </div>
        </div>
        <button
          type="button"
          class="flex items-center gap-1 h-14 w-fit rounded-2xl border border-desa-background bg-white py-4 px-6"
        >
          <img
            src="@/assets/images/icons/filter-black.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
          <span class="font-medium leading-5">Filter</span>
        </button>
      </div>
    </form>
    <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            src="@/assets/images/thumbnails/kk-bansos-1.png"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            Bantuan Untuk Rakyat Kurang Mampu
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary"
              >PT Shaynakit Meningkatkan Bangsa</span
            >
          </p>
        </div>
        <a
          href="kd-bantuan-sosial-manage.html"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
        >
          <span class="font-medium text-white">Manage</span>
        </a>
      </div>
      <hr class="border-desa-background" />
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/money-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Rp120.000.000
            </p>
            <p class="font-medium text-sm text-desa-secondary">Uang Tunai</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/profile-2user-blue.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-blue">
              15.600 Warga
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Total Pengajuan
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-red/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/minus-square-red.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-red">
              Tidak Tersedia
            </p>
            <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            src="@/assets/images/thumbnails/kk-bansos-2.png"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            Peduli Sesama: Penyaluran Beras untuk Warga Desa
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary"
              >PT Angga Membangun Indonesia</span
            >
          </p>
        </div>
        <a
          href="kd-bantuan-sosial-manage.html"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
        >
          <span class="font-medium text-white">Manage</span>
        </a>
      </div>
      <hr class="border-desa-background" />
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/bag-2-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Beras 20 ton
            </p>
            <p class="font-medium text-sm text-desa-secondary">Bahan Pokok</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/profile-2user-blue.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-blue">
              15.600 Warga
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Total Pengajuan
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/tick-square-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Tersedia
            </p>
            <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            src="@/assets/images/thumbnails/kk-bansos-3.png"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            Mendukung Pertumbuhan Anak dengan Nutrisi Terbaik
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary"
              >PT Peternakan Sapi Bimore</span
            >
          </p>
        </div>
        <a
          href="kd-bantuan-sosial-manage.html"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
        >
          <span class="font-medium text-white">Manage</span>
        </a>
      </div>
      <hr class="border-desa-background" />
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/milk-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Susu 9.000 ml
            </p>
            <p class="font-medium text-sm text-desa-secondary">Bahan Pokok</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/profile-2user-blue.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-blue">
              15.600 Warga
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Total Pengajuan
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/tick-square-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Tersedia
            </p>
            <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            src="@/assets/images/thumbnails/kk-bansos-4.png"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            Energi Untuk Rakyat: Bantuan Bahan Bakar Kendaraan bagi Warga Desa
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary"
              >PT Masayoshi Membangun Indonesia</span
            >
          </p>
        </div>
        <a
          href="kd-bantuan-sosial-manage.html"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
        >
          <span class="font-medium text-white">Manage</span>
        </a>
      </div>
      <hr class="border-desa-background" />
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/gas-station-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              BBM 3.200 liter
            </p>
            <p class="font-medium text-sm text-desa-secondary">Bahan Pokok</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/profile-2user-blue.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-blue">
              15.600 Warga
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Total Pengajuan
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/tick-square-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Tersedia
            </p>
            <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            src="@/assets/images/thumbnails/kk-bansos-5.png"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            Energi Untuk Rakyat: Bantuan Bahan Bakar Kendaraan bagi Warga Desa
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary"
              >PT Masayoshi Membangun Indonesia</span
            >
          </p>
        </div>
        <a
          href="kd-bantuan-sosial-manage.html"
          class="flex items-center shrink-0 gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
        >
          <span class="font-medium text-white">Manage</span>
        </a>
      </div>
      <hr class="border-desa-background" />
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/bag-2-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Beras 20 ton
            </p>
            <p class="font-medium text-sm text-desa-secondary">Bahan Pokok</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/icons/profile-2user-blue.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-blue">
              15.600 Warga
            </p>
            <p class="font-medium text-sm text-desa-secondary">
              Total Pengajuan
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/tick-square-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-dark-green">
              Tersedia
            </p>
            <p class="font-medium text-sm text-desa-secondary">Status Bansos</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
