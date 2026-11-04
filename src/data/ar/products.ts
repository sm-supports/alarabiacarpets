import type { ProductAr } from "./types";
import { arProducts1 } from "./products-1";
import { arProducts2 } from "./products-2";
import { arProducts3 } from "./products-3";

export const arProducts: Record<string, ProductAr> = {
  ...arProducts1,
  ...arProducts2,
  ...arProducts3,
};
