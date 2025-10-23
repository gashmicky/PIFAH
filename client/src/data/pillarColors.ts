// PIFAH Pillar Colors - Soft, professional colors
export const PILLAR_COLORS = {
  "Health Infrastructure": {
    primary: "hsl(210, 70%, 65%)", // Soft blue
    bg: "hsl(210, 70%, 95%)",
    text: "hsl(210, 70%, 35%)",
  },
  "Local Manufacturing": {
    primary: "hsl(150, 60%, 55%)", // Soft green
    bg: "hsl(150, 60%, 95%)",
    text: "hsl(150, 60%, 30%)",
  },
  "Diagnostics & Imaging": {
    primary: "hsl(280, 60%, 65%)", // Soft purple
    bg: "hsl(280, 60%, 95%)",
    text: "hsl(280, 60%, 35%)",
  },
  "Digital Health & AI": {
    primary: "hsl(200, 75%, 60%)", // Soft cyan
    bg: "hsl(200, 75%, 95%)",
    text: "hsl(200, 75%, 30%)",
  },
  "Human Capital Development": {
    primary: "hsl(30, 75%, 60%)", // Soft orange
    bg: "hsl(30, 75%, 95%)",
    text: "hsl(30, 75%, 30%)",
  },
} as const;

export type PillarName = keyof typeof PILLAR_COLORS;

export const PILLAR_LIST: PillarName[] = [
  "Health Infrastructure",
  "Local Manufacturing",
  "Diagnostics & Imaging",
  "Digital Health & AI",
  "Human Capital Development",
];
