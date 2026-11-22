import type { GuideAr } from "./types";
import { arGuides1 } from "./guides-1";
import { arGuides2 } from "./guides-2";
import { arGuides3 } from "./guides-3";
import { arGuides4 } from "./guides-4";

export const arGuides: Record<string, GuideAr> = {
  ...arGuides1,
  ...arGuides2,
  ...arGuides3,
  ...arGuides4,
};
