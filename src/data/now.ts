export interface NowEntry {
  month: string;
  building: string;
  reading?: string;
  listening?: string;
  pondering?: string;
}

export const now: NowEntry = {
  month: "2026-07",
  building: "this site that you're reading",
  reading: "Florian Dalwigk - Cyberspionage",
  pondering:
    "how to flash libreboot on my OPNsense machine, after I bricked its BIOS. lmao",
};
