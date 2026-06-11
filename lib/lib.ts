import { BASE62 } from "@/constants/constant";

export const toBase62 = (id: number): string => {
  let slug = "";

  while (id > 0) {
    slug = BASE62[id % 62] + slug;
    id = Math.floor(id / 62);
  }
  return slug;
};
