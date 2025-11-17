#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Função para criar um ícone SVG simples
function createSVGIcon(size, color = '#007bff') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}" rx="20"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">
    ⛪
  </text>
  <text x="50%" y="75%" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="${size * 0.1}" font-weight="bold">
    IGREJA
  </text>
</svg>`;
}

// Tamanhos necessários para PWA e Play Store
const iconSizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'frontend', 'assets', 'icons');

// Criar diretório se não existir
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Gerar ícones SVG
iconSizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    fs.writeFileSync(path.join(iconsDir, filename), svgContent);
    console.log(`✓ Criado: ${filename}`);
});

// Criar favicon
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(path.join(__dirname, 'frontend', 'favicon.svg'), faviconSVG);

// Criar splash screen
const splashScreen = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="1136" viewBox="0 0 640 1136">
  <rect width="640" height="1136" fill="#007bff"/>
  <circle cx="320" cy="400" r="80" fill="white" opacity="0.2"/>
  <text x="50%" y="450" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="60" font-weight="bold">
    ⛪
  </text>
  <text x="50%" y="550" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="32" font-weight="bold">
    SISTEMA IGREJA
  </text>
  <text x="50%" y="600" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="18">
    Dízimos e Ofertas
  </text>
  <text x="50%" y="700" text-anchor="middle" dy=".3em" fill="white" 
        font-family="Arial, sans-serif" font-size="16" opacity="0.7">
    Carregando...
  </text>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'splash-screen.svg'), splashScreen);

console.log('\n🎨 ÍCONES GERADOS COM SUCESSO!');
console.log('\nPara converter SVG para PNG, use:');
console.log('npm install -g svgexport');
console.log('svgexport icon-512x512.svg icon-512x512.png 512:512');