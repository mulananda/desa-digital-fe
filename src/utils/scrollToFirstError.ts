// scroll atomatis ke inputan error
export function scrollToFirstError(
  errors: Record<string, string[] | string | undefined>,
  options: ScrollIntoViewOptions = { behavior: "smooth", block: "center" },
) {
  if (!errors) return;

  const firstErrorKey = Object.keys(errors).find((key) => errors[key]?.length);

  if (!firstErrorKey) return;

  const el = document.querySelector(`[data-error-field="${firstErrorKey}"]`);

  el?.scrollIntoView(options);
}
