export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function canAddTeamMembers(role: string): boolean {
  return ["dev", "admin", "owner"].includes(role);
}

export function canAddAdmins(role: string): boolean {
  return role === "owner";
}

export function canDeleteMembers(role: string): boolean {
  return role === "owner";
}

export function canBlacklistMembers(role: string): boolean {
  return ["admin", "owner"].includes(role);
}

export function canChangeRoles(role: string): boolean {
  return role === "owner";
}

export function canManageOrders(role: string): boolean {
  return ["dev", "admin", "owner"].includes(role);
}

export function isTeamMember(role: string): boolean {
  return ["dev", "admin", "owner"].includes(role);
}

export const canCreateOrders = (role: string) => {
  return ["customer", "dev", "admin", "owner"].includes(role);
};

export const canCreateBots = (role: string) => {
  return ["customer", "dev", "admin", "owner"].includes(role);
};