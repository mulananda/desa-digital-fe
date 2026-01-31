<script setup>
/* =========================
 * IMPORTS
 * ========================= */
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useHeadOfFamilyStore } from "@/stores/headOfFamily";
import router from "@/router";

import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";

import { ROUTE_NAMES } from "@/config/routes.config";
import { scrollToFirstError } from "@/utils/scrollToFirstError";

import { useAge } from "@/composables/useAge";

/* assets */
import defaultPhoto from "@/assets/images/photos/kk-preview.png";

/* icons */
import IconProfileSecondaryGreen from "@/assets/images/icons/user-secondary-green.svg";
import IconProfileBlack from "@/assets/images/icons/user-black.svg";
import IconKeyboardSecondaryGreen from "@/assets/images/icons/keyboard-secondary-green.svg";
import IconKeyboardBlack from "@/assets/images/icons/keyboard-black.svg";
import IconCallSecondaryGreen from "@/assets/images/icons/call-secondary-green.svg";
import IconCallBlack from "@/assets/images/icons/call-black.svg";
import IconBriefcaseSecondaryGreen from "@/assets/images/icons/briefcase-secondary-green.svg";
import IconBriefcaseBlack from "@/assets/images/icons/briefcase-black.svg";
import IconCalendarSecondaryGreen from "@/assets/images/icons/calendar-2-secondary-green.svg";
import IconCalendarBlack from "@/assets/images/icons/calendar-2-black.svg";
import IconKeySecondaryGreen from "@/assets/images/icons/key-secondary-green.svg";
import IconKeyBlack from "@/assets/images/icons/key-black.svg";

/* =========================
 * STORE
 * ========================= */
const headOfFamilyStore = useHeadOfFamilyStore();
const { loading, error } = storeToRefs(headOfFamilyStore);
const { createHeadOfFamily } = headOfFamilyStore;

/* =========================
 * FORM STATE
 * ========================= */
const headOfFamily = ref({
  name: "",
  email: "",
  password: "",
  identity_number: "",
  gender: "",
  date_of_birth: "",
  phone_number: "",
  occupation: "",
  marital_status: "",
  profile_picture: null,
  profile_picture_url: null,
});

/* =========================
 * COMPOSABLE
 * ========================= */
const { age } = useAge(computed(() => headOfFamily.value?.date_of_birth));

/* =========================
 * REFS
 * ========================= */
const profilePictureRef = ref(null);

/* =========================
 * HANDLERS
 * ========================= */
const handleImageChange = (event) => {
  const file = event.target?.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  if (headOfFamily.value.profile_picture_url) {
    URL.revokeObjectURL(headOfFamily.value.profile_picture_url);
  }

  headOfFamily.value.profile_picture = file;
  headOfFamily.value.profile_picture_url = URL.createObjectURL(file);
};

const handleSubmit = async () => {
  await createHeadOfFamily(headOfFamily.value);

  if (error.value) {
    scrollToFirstError(error.value);
    return;
  }

  router.push({ name: ROUTE_NAMES.HEAD_OF_FAMILY });
};
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Kepala Rumah
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Tambah Kepala Rumah
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Tambah Kepala Rumah Baru</h1>
    </div>
  </div>
  <form @submit.prevent="handleSubmit" id="myForm" class="capitalize">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <section id="Photo-Profile" class="flex items-center justify-between">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Profile Kepala Rumah
        </h2>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center size-[100px] rounded-full overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="
                headOfFamily.profile_picture_url
                  ? headOfFamily.profile_picture_url
                  : defaultPhoto
              "
              alt="image"
              class="size-full object-cover"
            />
          </div>
          <div class="relative">
            <input
              required
              id="File"
              type="file"
              name="file"
              class="absolute opacity-0 left-0 w-full top-0 h-full"
              @change="handleImageChange"
              ref="profilePictureRef"
            />
            <button
              id="Upload"
              type="button"
              class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
              @click="profilePictureRef?.click()"
            >
              <img
                src="@/assets/images/icons/send-square-white.svg"
                alt="icon"
                class="size-6 shrink-0"
              />
              <p class="font-medium leading-5 text-white">Upload</p>
            </button>
          </div>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nama-Kepala-Rumah" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Kepala Rumah
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label
            class="relative group peer w-full valid"
            data-error-field="name"
          >
            <Input
              v-model="headOfFamily.name"
              type="text"
              placeholder="Masukan Nama Lengkap"
              :error-message="error?.name"
              :icon="IconProfileSecondaryGreen"
              :filled-icon="IconProfileBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="NIK" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nomor Induk Kependudukan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label
            class="relative group peer w-full valid"
            data-error-field="identity_number"
          >
            <Input
              v-model="headOfFamily.identity_number"
              type="text"
              inputmode="numeric"
              placeholder="Masukan Nomer Induk Kependudukan"
              :error-message="error?.identity_number"
              :icon="IconKeyboardSecondaryGreen"
              :filled-icon="IconKeyboardBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Phone" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nomor Handphone
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label
            class="relative group peer w-full valid"
            data-error-field="phone_number"
          >
            <Input
              v-model="headOfFamily.phone_number"
              type="text"
              inputmode="numeric"
              placeholder="Masukan Nomer HP"
              :error-message="error?.phone_number"
              :icon="IconCallSecondaryGreen"
              :filled-icon="IconCallBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Pekerjaan" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pekerjaan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label
            class="relative group peer w-full valid"
            data-error-field="occupation"
          >
            <Input
              v-model="headOfFamily.occupation"
              type="text"
              placeholder="Masukan Nama Pekerjaan"
              :error-message="error?.occupation"
              :icon="IconBriefcaseSecondaryGreen"
              :filled-icon="IconBriefcaseBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Tanggal-Lahir" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Tanggal Lahir
        </p>
        <div class="flex items-center gap-6 flex-1 shrink-0">
          <label
            class="relative group peer w-full valid"
            data-error-field="date_of_birth"
          >
            <Input
              v-model="headOfFamily.date_of_birth"
              type="date"
              placeholder="Masukan Tanggal Lahir Anda"
              :error-message="error?.date_of_birth"
              :icon="IconCalendarSecondaryGreen"
              :filled-icon="IconCalendarBlack"
            />
          </label>
          <div
            class="w-[180px] flex shrink-0 h-[52px] rounded-2xl bg-desa-foreshadow p-4 font-medium leading-5 text-desa-dark-green justify-center"
          >
            <p>
              Umur:
              <span id="Age">{{ age }}</span>
              tahun
            </p>
          </div>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Jenis-Kelamin" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Jenis Kelamin
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup"
          >
            <input
              type="radio"
              name="gender"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
              v-model="headOfFamily.gender"
              value="male"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Pria
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/man-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/man-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup"
          >
            <input
              type="radio"
              name="gender"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
              v-model="headOfFamily.gender"
              value="female"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Wanita
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/woman-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/woman-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Status" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Status
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup"
          >
            <input
              type="radio"
              name="status"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
              v-model="headOfFamily.marital_status"
              value="single"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Belum Menikah
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/profile-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/profile-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup"
          >
            <input
              type="radio"
              name="status"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
              v-model="headOfFamily.marital_status"
              value="married"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Sudah Menikah
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/profile-2user-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/profile-2user-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />
      <p class="font-medium leading-5">Akun Dashboard</p>
      <section id="Email" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Email Address
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <!-- add or remove .invalid class for error state (red border, icon, and text) -->
          <label
            class="relative group peer w-full invalid"
            data-error-field="email"
          >
            <Input
              v-model="headOfFamily.email"
              type="email"
              placeholder="Masukan Email"
              :icon="IconProfileSecondaryGreen"
              :filled-icon="IconProfileBlack"
              autocomplete="email"
              :disabled="loading"
              required
              :error-message="error?.email"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Passwords" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Passwords
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full" data-error-field="password">
            <Input
              v-model="headOfFamily.password"
              type="password"
              placeholder="Masukan Password"
              :icon="IconKeySecondaryGreen"
              :filled-icon="IconKeyBlack"
              autocomplete="current-password"
              :disabled="loading"
              required
              :error-message="error?.password"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Buttons" class="flex items-center justify-end gap-4">
        <RouterLink :to="{ name: ROUTE_NAMES.HEAD_OF_FAMILY }">
          <div
            class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white"
          >
            Batal, Tidak jadi
          </div>
        </RouterLink>
        <Button
          type="submit"
          label="Create Now"
          :loading="loading"
          :disabled="loading"
          aria-label="Membuat Akun .."
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        />
      </section>
    </div>
  </form>
</template>
