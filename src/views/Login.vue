<!-- src/views/Login.vue -->
<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ROUTE_NAMES } from "@/config/routes.config";
import { notificationService } from "@/services/notification.service";
import { SUCCESS_MESSAGES } from "@/config/messages.config";

import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";

import IconProfileSecondaryGreen from "@/assets/images/icons/user-secondary-green.svg";
import IconProfileBlack from "@/assets/images/icons/user-black.svg";
import IconKeySecondaryGreen from "@/assets/images/icons/key-secondary-green.svg";
import IconKeyBlack from "@/assets/images/icons/key-black.svg";
import RadioButton from "@/components/ui/RadioButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const { loading, loginError } = storeToRefs(authStore);

// Form state
const form = ref({
  email: "",
  password: "",
  role: "kepala-desa",
});

// Form validation
const isFormValid = computed(() => {
  const { email, password, role } = form.value;
  return email.trim() !== "" && password !== "" && role !== "";
});

// Submit handler
const handleSubmit = async () => {
  if (!isFormValid.value || loading.value) return;

  try {
    await authStore.login({
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
      role: form.value.role,
    });

    notificationService.success(
      SUCCESS_MESSAGES.LOGIN.message,
      SUCCESS_MESSAGES.LOGIN.title,
    );

    await router.push({ name: ROUTE_NAMES.DASHBOARD });
  } catch (error) {
    // Error handled by store and displayed via loginError reactive
    // Just clear password for security
    form.value.password = "";
  }
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex items-center flex-1 pl-[calc(((100%-1280px)/2)+75px)]"
  >
    <div
      class="flex flex-col h-fit w-[486px] shrink-0 rounded-3xl p-[32px] gap-[32px] bg-white"
    >
      <header class="flex flex-col gap-[32px] items-center">
        <img
          src="@/assets/images/logos/logo-text.svg"
          alt="icon"
          class="shrink-0 h-[38px] w-[197px]"
        />
        <div class="flex flex-col gap-2">
          <h1 class="font-semibold text-[24px] leading-[30px] text-center">
            Halo🙌🏻 , Selamat Datang!
          </h1>
          <p class="font-medium leading-5 text-desa-secondary text-center">
            Silahkan masuk untuk melanjutkan
          </p>
        </div>
      </header>

      <!-- Alert login error -->
      <div
        v-if="loginError"
        class="relative p-4 rounded-xl bg-red-100 border-l-4 border-red-500"
      >
        <p class="text-sm font-semibold text-red-700">
          {{ loginError }}
        </p>
      </div>

      <!-- Role selection -->
      <section id="Select" class="grid grid-cols-2 gap-6">
        <div
          class="group relative flex items-center justify-between p-5 rounded-2xl bg-white ring-[1px] ring-desa-background hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:ring-desa-dark-green transition-all duration-300"
        >
          <RadioButton
            id="Kepala-Desa"
            v-model="form.role"
            value="kepala-desa"
            required
            name="role"
            :disabled="loading"
            class="peer absolute left-0 right-0 top-0 bottom-0 z-50 opacity-0"
          />
          <p
            class="font-medium leading-5 text-desa-secondary group-hover:text-desa-dark-green group-has-[:checked]:text-desa-dark-green transition-all duration-300"
          >
            Kepala Desa
          </p>
          <div class="relative">
            <img
              src="@/assets/images/icons/crown-secondary-green.svg"
              alt="icon"
              class="shrink-0 h-[24px] w-[24px] group-hover:opacity-0 group-has-[:checked]:opacity-0 absolute transition-all duration-300"
            />
            <img
              src="@/assets/images/icons/crown-dark-green.svg"
              alt="icon"
              class="shrink-0 h-[24px] w-[24px] group-hover:opacity-100 group-has-[:checked]:opacity-100 opacity-0 transition-all duration-300"
            />
          </div>
        </div>

        <div
          class="group relative flex items-center justify-between p-5 rounded-2xl bg-white ring-[1px] ring-desa-background hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:ring-desa-dark-green transition-all duration-300"
        >
          <RadioButton
            id="Kepala-Rumah"
            v-model="form.role"
            value="kepala-rumah"
            required
            name="role"
            :disabled="loading"
            class="peer absolute left-0 right-0 top-0 bottom-0 z-50 opacity-0"
          />
          <p
            class="font-medium leading-5 text-desa-secondary group-hover:text-desa-dark-green group-has-[:checked]:text-desa-dark-green transition-all duration-300"
          >
            Kepala Rumah
          </p>
          <div class="relative">
            <img
              src="@/assets/images/icons/profile-circle-secondary-green.svg"
              alt="icon"
              class="shrink-0 h-[24px] w-[24px] group-hover:opacity-0 group-has-[:checked]:opacity-0 absolute transition-all duration-300"
            />
            <img
              src="@/assets/images/icons/profile-circle-dark-green.svg"
              alt="icon"
              class="shrink-0 h-[24px] w-[24px] group-hover:opacity-100 group-has-[:checked]:opacity-100 opacity-0 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      <!-- Form inputs -->
      <section id="Inputs" class="flex flex-col gap-[32px]">
        <div id="Email-Address" class="flex flex-col gap-4">
          <h2 class="font-medium leading-5 text-desa-secondary">
            Email Address
          </h2>
          <Input
            v-model="form.email"
            type="email"
            placeholder="Ketik Email Kamu"
            :icon="IconProfileSecondaryGreen"
            :filled-icon="IconProfileBlack"
            autocomplete="email"
            :disabled="loading"
            required
          />
        </div>

        <div id="Password" class="flex flex-col gap-4">
          <h2 class="font-medium leading-5 text-desa-secondary">Password</h2>
          <Input
            v-model="form.password"
            type="password"
            placeholder="Ketik Password Kamu"
            :icon="IconKeySecondaryGreen"
            :filled-icon="IconKeyBlack"
            autocomplete="current-password"
            :disabled="loading"
            required
          />
        </div>
      </section>

      <Button
        type="submit"
        label="Masuk"
        :loading="loading"
        :disabled="!isFormValid || loading"
        aria-label="Masuk ke akun Anda"
      />
    </div>
  </form>

  <section id="Banner" class="relative flex w-full max-w-[634px]">
    <div
      class="fixed top-0 h-screen w-full max-w-[634px] overflow-hidden pr-3 py-3"
    >
      <div
        class="h-full w-[622px] rounded-3xl gradient-vertical pt-[59px] pb-[60px]"
      >
        <img
          src="@/assets/images/backgrounds/bg-signin.png"
          class="h-full w-[542px] object-contain mx-auto"
          alt="banner"
        />
      </div>
    </div>
  </section>
</template>
