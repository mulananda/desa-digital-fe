import { computed, type Ref } from "vue";

export function useAge(dateOfBirth: Ref<string | null | undefined>) {
  const age = computed<number | null>(() => {
    const dob = dateOfBirth.value;
    if (!dob) return null;

    const today = new Date();
    const birth = new Date(dob);

    if (isNaN(birth.getTime())) return null;

    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }

    return years;
  });

  return {
    age,
  };
}
