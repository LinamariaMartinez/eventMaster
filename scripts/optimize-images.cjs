#!/usr/bin/env node

/**
 * Script para optimizar imágenes del proyecto
 * - Convierte PNGs grandes a WebP
 * - Optimiza JPGs reduciendo calidad a 85%
 * - Genera versiones responsivas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Configuración de optimización
const CONFIG = {
  png: {
    quality: 85,
    convertToWebP: true,
  },
  jpg: {
    quality: 85,
    progressive: true,
  },
  webp: {
    quality: 85,
  },
};

// Imágenes grandes que se convertirán a WebP
const LARGE_PNGS = [
  'elegant-classic-invitation-burgundy-cream.png',
  'romantic-vintage-invitation-floral-design.png',
  'festive-colorful-invitation-celebration.png',
  'diverse-user-avatars.png',
  'modern-minimalist-invitation-clean-design.png',
];

const OPTIMIZE_DIRS = ['services', 'hero', 'logo'];

console.log('🎨 Iniciando optimización de imágenes...\n');

// Verificar si sharp está instalado
try {
  require.resolve('sharp');
  console.log('✓ sharp está instalado\n');
} catch (e) {
  console.log('❌ sharp no está instalado. Instalando...');
  execSync('npm install --save-dev sharp', { stdio: 'inherit' });
  console.log('✓ sharp instalado\n');
}

const sharp = require('sharp');

/**
 * Optimiza una imagen PNG grande convirtiéndola a WebP
 */
async function optimizeLargePNG(filename) {
  const inputPath = path.join(PUBLIC_DIR, filename);
  const outputPath = path.join(PUBLIC_DIR, filename.replace('.png', '.webp'));

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  ${filename} no existe, saltando...`);
    return;
  }

  try {
    const info = await sharp(inputPath)
      .webp({ quality: CONFIG.webp.quality })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`✓ ${filename} → WebP`);
    console.log(`  ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% reducción)\n`);
  } catch (error) {
    console.error(`❌ Error procesando ${filename}:`, error.message);
  }
}

/**
 * Optimiza imágenes JPG en un directorio
 */
async function optimizeJPGsInDir(dirName) {
  const dirPath = path.join(PUBLIC_DIR, dirName);

  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directorio ${dirName}/ no existe, saltando...`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg)$/i));

  console.log(`📁 Optimizando ${files.length} imágenes en ${dirName}/`);

  for (const file of files) {
    const inputPath = path.join(dirPath, file);
    const tempPath = path.join(dirPath, `temp_${file}`);

    try {
      const originalSize = fs.statSync(inputPath).size;

      await sharp(inputPath)
        .jpeg({
          quality: CONFIG.jpg.quality,
          progressive: CONFIG.jpg.progressive
        })
        .toFile(tempPath);

      const newSize = fs.statSync(tempPath).size;

      // Solo reemplazar si hay ahorro significativo
      if (newSize < originalSize) {
        fs.renameSync(tempPath, inputPath);
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(`  ✓ ${file}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% reducción)`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`  - ${file}: ya está optimizado`);
      }
    } catch (error) {
      console.error(`  ❌ Error procesando ${file}:`, error.message);
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  console.log('');
}

/**
 * Formatea bytes a formato legible
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Función principal
 */
async function main() {
  console.log('📸 Paso 1: Convirtiendo PNGs grandes a WebP\n');
  for (const png of LARGE_PNGS) {
    await optimizeLargePNG(png);
  }

  console.log('🖼️  Paso 2: Optimizando JPGs en directorios\n');
  for (const dir of OPTIMIZE_DIRS) {
    await optimizeJPGsInDir(dir);
  }

  console.log('✅ Optimización completada!\n');
  console.log('💡 Próximos pasos:');
  console.log('   1. Actualiza el código para usar archivos .webp');
  console.log('   2. Considera eliminar los PNGs originales si no son necesarios');
  console.log('   3. Usa el componente Next.js Image para lazy loading automático\n');
}

main().catch(console.error);
