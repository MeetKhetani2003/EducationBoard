const fs = require('fs');
const path = require('path');

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return {h, s, l};
}

function HSLToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c/2, r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
}

function processContent(content) {
  // Replace hex colors
  let newContent = content.replace(/#[0-9a-fA-F]{3,6}/g, (match) => {
    let hsl = hexToHSL(match);
    
    // If it's a gray/monochrome (low saturation), keep it or warm it up slightly
    if (hsl.s < 10) {
      if (hsl.l < 90 && hsl.l > 10) {
          hsl.h = 35;
          hsl.s = 15;
      }
      return HSLToHex(hsl.h, hsl.s, hsl.l);
    }

    // If it's Blue
    if (hsl.h >= 190 && hsl.h <= 260) {
      hsl.h = 32; // Brown/Orange
      hsl.s = Math.min(hsl.s * 0.9, 85); // Slightly reduce saturation to make it a premium brown
      return HSLToHex(hsl.h, hsl.s, hsl.l);
    }
    
    // If it's Orange/Yellow (the accents)
    if (hsl.h >= 10 && hsl.h <= 50) {
      hsl.h = 45; // Shift to golden yellow
      hsl.s = Math.min(hsl.s * 1.1, 95); // Boost saturation for pop
      return HSLToHex(hsl.h, hsl.s, hsl.l);
    }

    return match;
  });

  // Replace Tailwind classes
  newContent = newContent.replace(/blue-/g, 'stone-'); // Muted backgrounds
  newContent = newContent.replace(/slate-/g, 'stone-'); // Warmer grays
  newContent = newContent.replace(/emerald-/g, 'lime-'); // Success state fits better with yellow/brown

  return newContent;
}

const appTsxPath = path.join('src', 'App.tsx');
let appContent = fs.readFileSync(appTsxPath, 'utf8');
fs.writeFileSync(appTsxPath, processContent(appContent));

const indexCssPath = path.join('src', 'index.css');
let indexContent = fs.readFileSync(indexCssPath, 'utf8');
fs.writeFileSync(indexCssPath, processContent(indexContent));

console.log("Theme updated.");
