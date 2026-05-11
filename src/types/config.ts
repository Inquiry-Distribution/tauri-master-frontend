export type ConfigLoginLimit = {
  enabled: boolean;
  maxAttempts: number;
  lockoutMinutes: number;
};
