<!-- src/components/ui/ModalDelete.vue -->
<script setup lang="ts">
import { computed } from "vue";

/**
 * Props Type Definition
 * Dibuat interface agar reusable & lebih jelas kontraknya
 */
interface Props {
  modelValue: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

/**
 * defineProps + default value
 * withDefaults dipakai agar tetap type-safe
 */
const props = withDefaults(defineProps<Props>(), {
  title: "Hapus Data?",
  description: "Tindakan ini permanen dan tidak bisa dibatalkan!",
  loading: false,
  confirmText: "Iya Hapus",
  cancelText: "Batal",
});

/**
 * Emits Type Definition
 * Memberi typing pada event supaya auto-complete & aman
 */
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
}>();

/**
 * Computed untuk v-model binding
 */
const show = computed<boolean>({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

/**
 * Close modal (disabled saat loading)
 */
function close(): void {
  if (!props.loading) {
    show.value = false;
  }
}

/**
 * Emit confirm event
 */
function confirm(): void {
  emit("confirm");
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-40 flex bg-[#080C1ACC]"
        @click.self="close"
      >
        <div
          class="flex flex-col w-[335px] rounded-2xl overflow-hidden bg-white m-auto"
          role="dialog"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 bg-desa-black">
            <p class="font-medium text-white">{{ title }}</p>
            <button
              :disabled="loading"
              @click="close"
              class="disabled:opacity-50"
            >
              <img
                src="@/assets/images/icons/close-circle-white.svg"
                class="size-6"
                alt="close"
              />
            </button>
          </div>

          <!-- Body -->
          <div class="flex flex-col p-4 gap-3">
            <p class="font-medium text-sm text-desa-secondary">
              {{ description }}
            </p>

            <hr class="border-desa-background" />

            <div class="flex gap-3">
              <button
                class="h-14 rounded-2xl px-8 border border-desa-background hover:bg-desa-black hover:text-white transition disabled:opacity-50"
                :disabled="loading"
                @click="close"
              >
                {{ cancelText }}
              </button>

              <button
                class="h-14 flex-1 rounded-2xl bg-desa-red hover:bg-desa-red/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                :disabled="loading"
                @click="confirm"
              >
                <template v-if="!loading">
                  <img
                    src="@/assets/images/icons/trash-white.svg"
                    class="size-5"
                    alt=""
                  />
                  <span class="font-semibold text-white">
                    {{ confirmText }}
                  </span>
                </template>

                <template v-else>
                  <span
                    class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  <span class="font-semibold text-white">Menghapus...</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
