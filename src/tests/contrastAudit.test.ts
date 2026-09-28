/**
 * WCAG AA Contrast Audit Verification Script
 * Validates text contrast ratios against WCAG 2.1 AA requirements (>= 4.5:1 normal text, >= 3.0:1 large text)
 */

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

interface ContrastTestCase {
  name: string;
  fg: string;
  bg: string;
  minRatio: number;
  context: string;
}

const testCases: ContrastTestCase[] = [
  // Dark Theme Tokens
  { name: "--text-on-dark on Dark Navy Surface (#0A1A33)", fg: "#F1F5F9", bg: "#0A1A33", minRatio: 4.5, context: "Primary text, headers, numbers" },
  { name: "--text-on-dark-muted on Dark Navy Surface (#0A1A33)", fg: "#B8C4D6", bg: "#0A1A33", minRatio: 7.0, context: "Labels, captions (specified >= 7:1)" },
  { name: "--accent-on-dark on Dark Navy Surface (#0A1A33)", fg: "#FFA366", bg: "#0A1A33", minRatio: 4.5, context: "Orange highlights" },
  { name: "--link-on-dark on Dark Navy Surface (#0A1A33)", fg: "#7DD3FC", bg: "#0A1A33", minRatio: 4.5, context: "Cyan links & status" },

  // Light Theme Tokens
  { name: "--text-on-light on White Surface (#FFFFFF)", fg: "#1B2430", bg: "#FFFFFF", minRatio: 4.5, context: "Light mode primary text" },
  { name: "--text-on-light-muted on White Surface (#FFFFFF)", fg: "#4A5568", bg: "#FFFFFF", minRatio: 4.5, context: "Light mode muted labels" },
  { name: "--text-on-light-muted on Light Card Surface (#EEF3FA)", fg: "#4A5568", bg: "#EEF3FA", minRatio: 4.5, context: "Light mode cards" },

  // Status Text Tokens
  { name: "Status Nominal (Dark)", fg: "#4ADE80", bg: "#0A1A33", minRatio: 4.5, context: "Nominal status text on dark" },
  { name: "Status Warning (Dark)", fg: "#FBBF24", bg: "#0A1A33", minRatio: 4.5, context: "Warning status text on dark" },
  { name: "Status Critical (Dark)", fg: "#FF6B6B", bg: "#0A1A33", minRatio: 4.5, context: "Critical status text on dark" },

  { name: "Status Nominal (Light)", fg: "#0F6B06", bg: "#FFFFFF", minRatio: 4.5, context: "Nominal status text on light" },
  { name: "Status Warning (Light)", fg: "#8A5300", bg: "#FFFFFF", minRatio: 4.5, context: "Warning status text on light" },
  { name: "Status Critical (Light)", fg: "#B71C1C", bg: "#FFFFFF", minRatio: 4.5, context: "Critical status text on light" },
  { name: "Status Info (Light)", fg: "#123F8C", bg: "#FFFFFF", minRatio: 4.5, context: "Info status text on light" },

  // Component Specific Badges & Cards
  { name: "Protocol Step Done Card", fg: "#FFFFFF", bg: "#14532D", minRatio: 4.5, context: "Solid dark green protocol done card" },
  { name: "Protocol Step Done Badge", fg: "#86EFAC", bg: "#14532D", minRatio: 4.5, context: "Light green status label on done card" },
  { name: "Verdict Banner Accepted", fg: "#FFFFFF", bg: "#166534", minRatio: 4.5, context: "Solid green verdict banner" },
  { name: "Verdict Banner Rejected", fg: "#FFFFFF", bg: "#991B1B", minRatio: 4.5, context: "Solid red verdict banner" },
  { name: "Causal Evidence Card PASS", fg: "#FFFFFF", bg: "#14532D", minRatio: 4.5, context: "Solid dark green evidence card" },
  { name: "Causal Evidence Card FAIL", fg: "#FFFFFF", bg: "#7F1D1D", minRatio: 4.5, context: "Solid dark red evidence card" },
  { name: "Viewport Overlay Backing", fg: "#F1F5F9", bg: "#0A1A33", minRatio: 4.5, context: "Semi-opaque dark backing text" },
  { name: "Recharts Axis Tick Text", fg: "#B8C4D6", bg: "#0A1A33", minRatio: 4.5, context: "Chart tick labels" },
  { name: "Simulation Drawer Button Label", fg: "#F1F5F9", bg: "#14532D", minRatio: 4.5, context: "Drawer button label" },
  { name: "Simulation Drawer Tag Text", fg: "#B8C4D6", bg: "#14532D", minRatio: 4.5, context: "Drawer small tag text" },
];

console.log("=========================================================");
console.log("     ASTRA-PVT WCAG 2.1 AA COLOR CONTRAST AUDIT REPORT    ");
console.log("=========================================================\n");

let passCount = 0;
let failCount = 0;

testCases.forEach(tc => {
  const ratio = getContrastRatio(tc.fg, tc.bg);
  const passed = ratio >= tc.minRatio;
  if (passed) passCount++; else failCount++;

  const statusStr = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${statusStr} | ${tc.name.padEnd(52)} | Ratio: ${ratio.toFixed(2)}:1 (Min: ${tc.minRatio}:1)`);
});

console.log("\n---------------------------------------------------------");
console.log(`TOTAL AUDITED: ${testCases.length} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log("=========================================================\n");

if (failCount > 0) {
  process.exit(1);
}
