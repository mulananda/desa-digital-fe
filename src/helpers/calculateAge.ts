export function calculateAge(birthDate?: string | null): number | null {
  if (!birthDate) return null;

  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  const d = today.getDate() - birth.getDate();

  if (m < 0 || (m === 0 && d < 0)) age--;

  return age;
}
