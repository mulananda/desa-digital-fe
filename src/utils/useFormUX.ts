import { nextTick } from "vue";

export function useFormUX() {
  // Cari elemen yang visible — naik ke parent jika elemen hidden
  function findScrollTarget(el: HTMLElement): HTMLElement {
    if (
      el.offsetParent !== null && // visible
      !el.hasAttribute("aria-hidden")
    ) {
      return el;
    }
    // Naik ke section/parent terdekat yang visible
    return el.closest("section") ?? el.parentElement ?? el;
  }

  async function scrollToFirstError(errors: Record<string, string>) {
    if (!Object.keys(errors).length) return;

    await nextTick();

    const firstKey = Object.keys(errors)[0];

    const el =
      document.querySelector<HTMLElement>(`[name="${firstKey}"]`) ??
      document.querySelector<HTMLElement>(
        `[aria-describedby="error-${firstKey}"]`,
      ) ??
      document.querySelector<HTMLElement>(`#error-${firstKey}`);

    if (!el) return;

    const target = findScrollTarget(el);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function focusFirstError(errors: Record<string, string>) {
    if (!Object.keys(errors).length) return;

    await nextTick();

    const firstKey = Object.keys(errors)[0];

    if (firstKey === "thumbnail") {
      // Focus tombol upload yang visible, bukan input hidden
      document.querySelector<HTMLElement>("button[type='button']")?.focus();
      return;
    }

    document
      .querySelector<HTMLElement>(
        `[name="${firstKey}"]:not([aria-hidden="true"])`,
      )
      ?.focus();
  }

  return { scrollToFirstError, focusFirstError };
}
