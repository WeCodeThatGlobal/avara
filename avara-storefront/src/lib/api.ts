import { getBaseURL } from "@lib/util/env";

export const ROUTES = {
  DEAL_OF_THE_DAY: "/store/deal-of-the-day",
};

export function getApiUrl(path: string) {
  const base = getBaseURL();
  
  if (!base) {
    throw new Error("Base URL is not configured");
  }
  
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  const cleanBase = base.replace(/\/$/, "");
  
  return `${cleanBase}/${cleanPath}`;
} 