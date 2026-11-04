import type { ServiceAr } from "./types";
import { arServices1 } from "./services-1";
import { arServices2 } from "./services-2";
import { arServices3 } from "./services-3";

export const arServices: Record<string, ServiceAr> = {
  ...arServices1,
  ...arServices2,
  ...arServices3,
};
