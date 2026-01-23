import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "assets/rawImages";
const outputDir = "public/images";

fs.mkdirSync(outputDir, { recursive: true });

const WIDTH = 1400;      // ✅ high enough to look sharp
const WEBP_Q = 85;       // ✅ quality-first
const AVIF_Q = 50;       // ✅ roughly comparable quality (AVIF scale differs)

async function optimize(file) {
  const input = path.join(inputDir, file);
  const base = file.replace(/\.[^.]+$/, "");

  const webpPath = path.join(outputDir, `${base}.webp`);
  const avifPath = path.join(outputDir, `${base}.avif`);

  const pipeline = sharp(input)
    .resize({ width: WIDTH, withoutEnlargement: true });

  const webpInfo = await pipeline.clone()
    .webp({ quality: WEBP_Q, effort: 6 })
    .toFile(webpPath);

  const avifInfo = await pipeline.clone()
    .avif({ quality: AVIF_Q, effort: 6 })
    .toFile(avifPath);

  console.log(`${file} → ${path.basename(webpPath)} (${Math.round(webpInfo.size/1024)} KB)`);
  console.log(`${file} → ${path.basename(avifPath)} (${Math.round(avifInfo.size/1024)} KB)`);
}

(async () => {
  const files = fs.readdirSync(inputDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  for (const f of files) await optimize(f);
})();