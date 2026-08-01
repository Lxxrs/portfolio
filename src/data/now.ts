export interface NowEntry {
  month: string;
  building: string;
  reading?: string;
  listening?: string;
  pondering?: string;
}

// Update me whenever life changes — this is a one-file edit.
export const now: NowEntry = {
  month: "2026-07",
  building: "this site (the Astro rewrite you're reading)",
  reading: "Florian Dalwigk - Cyberspionage",
  pondering: "how to physically flash libreboot on my OPNsense machine after I bricked its BIOS due too much tinkering xD",
};
