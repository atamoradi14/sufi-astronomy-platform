/** A dedicated capability, independent of the general users-admin allowlist. */
export function canUseMobileSensors(email?: string | null): boolean {
  return email?.trim().toLowerCase() === "atamoradi8@gmail.com";
}
