import { computed, type Ref } from "vue";

export function useAge(dateOfBirth: Ref<string | null | undefined>) {
  const age = computed<number | null>(() => {
    if (!dateOfBirth.value) return null;

    const today = new Date();
    const birth = new Date(dateOfBirth.value);

    if (isNaN(birth.getTime())) return null;

    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const d = today.getDate() - birth.getDate();

    if (m < 0 || (m === 0 && d < 0)) years--;

    return years;
  });

  return { age };
}
