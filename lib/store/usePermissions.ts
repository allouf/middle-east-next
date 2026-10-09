import { create } from "zustand";

export const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  STORE_OWNER: [
    "store.manage",
    "store.settings",
    "products.create",
    "products.read",
    "products.update",
    "products.delete",
    "products.pricing",
    "inventory.manage",
    "orders.manage",
    "orders.read",
    "customers.manage",
    "customers.read",
    "analytics.view",
    "members.invite",
    "members.manage",
    "members.remove",
    "policies.manage",
    "coupons.manage",
    "reviews.manage",
    "reviews.read",
    "support.access",
  ],
  STORE_MANAGER: [
    "store.manage",
    // No store.settings
    "products.create",
    "products.read",
    "products.update",
    // No products.delete
    "products.pricing",
    "inventory.manage",
    "orders.manage",
    "orders.read",
    "customers.manage",
    "customers.read",
    "analytics.view",
    "members.invite",
    // No members.manage or members.remove
    "policies.manage",
    "coupons.manage",
    "reviews.manage",
    "reviews.read",
    "support.access",
  ],
  SUPPORT_AGENT: [
    "products.read",
    "orders.read",
    "customers.read",
    "reviews.read",
    "support.access",
  ],
};

export const getPermissionsForRole = (role?: string | null) =>
  role && ROLE_PERMISSION_MAP[role] ? ROLE_PERMISSION_MAP[role] : [];

const usePermissions = create((set, get) => ({
  permissions: [] as string[],
  role: null as string | null,
  initialized: false,
  setPermissions: (permissions?: string[]) =>
    set({ permissions: permissions || [], initialized: true }),
  setRole: (role?: string | null) =>
    set({ role: role || null, initialized: true }),
  setInitialized: (initialized: boolean) => set({ initialized }),
  clearPermissions: () => set({ permissions: [], role: null, initialized: false }),
  getEffectivePermissions: () => {
    const { permissions, role } = get();
    if (permissions?.length) return permissions;
    return getPermissionsForRole(role);
  },
  can: (permission: string) => {
    const perms = get().getEffectivePermissions();
    return perms.includes(permission);
  },
  canAny: (permList: string[] = []) => {
    const perms = get().getEffectivePermissions();
    return permList.some((p) => perms.includes(p));
  },

  canAll: (permList: string[] = []) => {
    const perms = get().getEffectivePermissions();
    return permList.every((p) => perms.includes(p));
  },
}));

export default usePermissions;
