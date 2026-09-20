import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. App Icon SVG (with dark luxury emerald banking background and 3D lime sphere)
const appIconSvg = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.15 : 0;
  const contentSize = size - padding * 2;
  const radius = size * 0.22; // rounded squircle for standard, or full bleed for maskable
  const cx = size / 2;
  const cy = size / 2 - (size * 0.05);
  const r = contentSize * 0.32;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sphereGrad" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stop-color="#73f55e" />
        <stop offset="35%" stop-color="#16cf32" />
        <stop offset="70%" stop-color="#059e1e" />
        <stop offset="100%" stop-color="#026312" />
      </radialGradient>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#042314" />
        <stop offset="100%" stop-color="#02140b" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="${size * 0.03}" stdDeviation="${size * 0.04}" flood-color="#000000" flood-opacity="0.5"/>
      </filter>
      <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="${size * 0.01}" stdDeviation="${size * 0.015}" flood-color="#a3ff95" flood-opacity="0.6"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : radius}" fill="url(#bgGrad)" />

    <!-- Subtle border -->
    ${isMaskable ? '' : `<rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${radius}" fill="none" stroke="rgba(52, 211, 153, 0.2)" stroke-width="2" />`}

    <!-- 3D Greendot Sphere -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#sphereGrad)" filter="url(#shadow)" />
    
    <!-- Specular highlight reflection -->
    <ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.38}" rx="${r * 0.28}" ry="${r * 0.22}" fill="white" opacity="0.65" transform="rotate(-20, ${cx - r * 0.35}, ${cy - r * 0.38})" />

    <!-- Typography underneath: greendot bank -->
    <text x="${cx}" y="${cy + r + (size * 0.12)}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${size * 0.088}" fill="#ffffff" letter-spacing="-0.5px">
      greendot
    </text>
    <text x="${cx}" y="${cy + r + (size * 0.195)}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="${size * 0.055}" fill="#34d399" letter-spacing="1.5px">
      BANK
    </text>
  </svg>
  `;
};

// 2. Full Brand Horizontal Logo SVG (matching user's uploaded IMG_8856.png)
const brandLogoSvg = `
<svg width="600" height="200" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="logoSphereGrad" cx="36%" cy="33%" r="67%">
      <stop offset="0%" stop-color="#73f55e" />
      <stop offset="35%" stop-color="#16cf32" />
      <stop offset="70%" stop-color="#059e1e" />
      <stop offset="100%" stop-color="#026312" />
    </radialGradient>
    <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- 3D Lime Sphere -->
  <circle cx="95" cy="100" r="50" fill="url(#logoSphereGrad)" filter="url(#logoShadow)" />
  <!-- Specular Reflection -->
  <ellipse cx="78" cy="80" rx="15" ry="11" fill="white" opacity="0.7" transform="rotate(-22, 78, 80)" />

  <!-- "greendot" text -->
  <text x="165" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="64" fill="#0f172a" letter-spacing="-2px">
    greendot
  </text>
  <!-- Trademark symbol ® -->
  <text x="430" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="20" fill="#0f172a">
    ®
  </text>

  <!-- "bank" text aligned under dot -->
  <text x="325" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="400" font-size="46" fill="#0f172a" letter-spacing="-0.5px">
    bank
  </text>
</svg>
`;

async function generateAssets() {
  console.log('Generating PWA & Brand assets...');

  // Save brand logo SVG
  fs.writeFileSync(path.join(publicDir, 'greendot-logo.svg'), brandLogoSvg.trim());

  // Generate 192x192 PNG
  await sharp(Buffer.from(appIconSvg(192, false)))
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate 512x512 PNG
  await sharp(Buffer.from(appIconSvg(512, false)))
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Generate maskable 512x512 PNG
  await sharp(Buffer.from(appIconSvg(512, true)))
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Generate Apple Touch Icon 180x180 PNG
  await sharp(Buffer.from(appIconSvg(180, false)))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate favicon.png (64x64)
  await sharp(Buffer.from(appIconSvg(64, false)))
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  // Save icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), appIconSvg(512, false).trim());

  console.log('All PWA and Brand assets generated successfully in /public!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
