/**
 * Generate CSS custom properties from design tokens.
 * Run: node tokens/generate-variables.js
 * Output: assets/css/base/variables.css
 */

import {readFileSync, writeFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokens = JSON.parse(readFileSync(join(__dirname, 'tokens.json'), 'utf8'));

function clamp(min, max, minVP, maxVP) {
  const root = 16;
  const minRem = min / root;
  const maxRem = max / root;
  const minVPRem = minVP / root;
  const maxVPRem = maxVP / root;

  if (min === max) return `${minRem}rem`;

  const slope = (maxRem - minRem) / (maxVPRem - minVPRem);
  const intersection = -1 * minVPRem * slope + minRem;

  return `clamp(${minRem}rem, ${intersection.toFixed(2)}rem + ${(slope * 100).toFixed(2)}vw, ${maxRem}rem)`;
}

const {min: vpMin, max: vpMax} = tokens.viewports;
const lines = [];

lines.push('/* Auto-generated from tokens/tokens.json — do not edit by hand */');
lines.push('/* Run: node tokens/generate-variables.js */');
lines.push('');
lines.push(':root {');

// Colors
lines.push('  /* Colors */');
for (const {name, value} of tokens.colors) {
  lines.push(`  --color-${name}: ${value};`);
}

// Spacing (fluid)
lines.push('');
lines.push('  /* Spacing */');
for (const {name, min, max} of tokens.spacing) {
  lines.push(`  --space-${name}: ${clamp(min, max, vpMin, vpMax)};`);
}

// Text sizes (fluid)
lines.push('');
lines.push('  /* Text sizes */');
for (const {name, min, max} of tokens.textSizes) {
  lines.push(`  --size-${name}: ${clamp(min, max, vpMin, vpMax)};`);
}

// Fonts
lines.push('');
lines.push('  /* Fonts */');
lines.push(`  --font-display: ${tokens.fonts.display};`);
lines.push(`  --font-base: ${tokens.fonts.base};`);
lines.push(`  --font-mono: ${tokens.fonts.mono};`);

// Leading
lines.push('');
lines.push('  /* Leading */');
for (const [name, value] of Object.entries(tokens.leading)) {
  lines.push(`  --leading-${name}: ${value};`);
}

// Weights
lines.push('');
lines.push('  /* Weights */');
for (const [name, value] of Object.entries(tokens.weights)) {
  lines.push(`  --font-${name}: ${value};`);
}

// Radii
lines.push('');
lines.push('  /* Border radius */');
for (const [name, value] of Object.entries(tokens.radii)) {
  lines.push(`  --border-radius-${name}: ${value};`);
}

// Layout & misc
lines.push('');
lines.push('  /* Layout */');
lines.push('  --gutter: 5vw;');
lines.push('  --wrapper-width: 1034px;');
lines.push('  --transition-duration: 100ms;');
lines.push('  --transition-timing: ease;');
lines.push('  --tracking: -0.04ch;');
lines.push('  --tracking-s: -0.075ch;');
lines.push('  --stroke: 1px solid var(--color-bg-accent);');

// Gradients
if (tokens.gradients) {
  lines.push('');
  lines.push('  /* Gradients */');
  for (const [name, value] of Object.entries(tokens.gradients)) {
    lines.push(`  --gradient-${name}: ${value};`);
  }
}

lines.push('}');

// Semantic color mappings
lines.push('');
lines.push('/* Semantic color mappings */');
lines.push(':root {');
lines.push('  --color-light: var(--color-gray-100);');
lines.push('  --color-dark: var(--color-gray-900);');
lines.push('  --color-mid: var(--color-gray-400);');
lines.push('}');

// Light theme
lines.push('');
lines.push(':root,');
lines.push(':root[data-mode="light"] {');
lines.push('  --color-text: var(--color-gray-800);');
lines.push('  --color-bg: var(--color-gray-100);');
lines.push('  --color-primary: var(--color-teal);');
lines.push('  --color-secondary: var(--color-indigo);');
lines.push('  --color-tertiary: var(--color-purple);');
lines.push('  --color-text-accent: var(--color-gray-700);');
lines.push('  --color-bg-accent: var(--color-gray-200);');
lines.push('  --color-bg-accent-2: var(--color-gray-300);');
lines.push('}');

// Dark theme
lines.push('');
lines.push('@media (prefers-color-scheme: dark) {');
lines.push('  :root:not([data-mode="light"]) {');
lines.push('    --color-text: var(--color-gray-100);');
lines.push('    --color-bg: var(--color-gray-800);');
lines.push('    --color-primary: var(--color-teal-alt);');
lines.push('    --color-secondary: var(--color-indigo-alt);');
lines.push('    --color-tertiary: var(--color-lavender);');
lines.push('    --color-text-accent: var(--color-gray-300);');
lines.push('    --color-bg-accent: var(--color-gray-700);');
lines.push('    --color-bg-accent-2: var(--color-gray-600);');
lines.push('  }');
lines.push('}');

lines.push('');
lines.push(':root[data-mode="dark"] {');
lines.push('  --color-text: var(--color-gray-100);');
lines.push('  --color-bg: var(--color-gray-800);');
lines.push('  --color-primary: var(--color-teal-alt);');
lines.push('  --color-secondary: var(--color-indigo-alt);');
lines.push('  --color-tertiary: var(--color-lavender);');
lines.push('  --color-text-accent: var(--color-gray-300);');
lines.push('  --color-bg-accent: var(--color-gray-700);');
lines.push('  --color-bg-accent-2: var(--color-gray-600);');
lines.push('}');

const css = lines.join('\n') + '\n';
const outPath = join(__dirname, '..', 'assets', 'css', 'base', 'variables.css');
writeFileSync(outPath, css);
console.log(`Generated ${outPath}`);
