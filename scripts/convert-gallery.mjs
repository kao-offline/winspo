#!/usr/bin/env node
/**
 * WInspo gallery converter.
 *
 * Converts a folder of scraped site folders (like lapa.ninja gallery dumps) into
 * a WInspo built-in dataset:
 *
 *   input folder/
 *     Site Name/
 *       data.txt        -> "Name: ..." / "Url: ..." / "Url status: ..."
 *       <name>.jpg|png  -> full-page screenshot
 *       <name>.mp4      -> hover/scroll video clip (optional)
 *
 * Output:
 *   datasets/<name>/winspo.json          (manifest, source of truth)
 *   public/datasets/<name>/assets/       (converted thumbnails, fullpages, clips)
 *
 * Usage:
 *   node scripts/convert-gallery.mjs [datasetName] [galleryDir]
 *
 * Env:
 *   WINSPO_DATASET  (default: "kao")
 *   GALLERY_DIR     (default: "C:\\Users\\hrdyk\\Documents\\gallery")
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const DEFAULT_GALLERY = "C:\\Users\\hrdyk\\Documents\\gallery";
const datasetName = process.argv[2] || process.env.WINSPO_DATASET || "kao";
const galleryDir = process.argv[3] || process.env.GALLERY_DIR || DEFAULT_GALLERY;

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestDir = path.join(projectRoot, "datasets", datasetName);
const assetsDir = path.join(projectRoot, "public", "datasets", datasetName, "assets");

const THUMB_WIDTH = 960;
const FULLPAGE_MAX_WIDTH = 1280;
const FULLPAGE_MAX_HEIGHT = 14000;
const VIDEO_MAX_WIDTH = 960;
const VIDEO_MAX_DURATION = 90;

/**
 * Curated overrides: [layout, motion, typography, category] per site.
 * Palette is computed from the screenshot. Keyed by normalized site name
 * (lowercased, alphanumeric only). These are starting guesses — edit freely.
 */
const OVERRIDES = {
  // --- studios / creative ---
  "130studio": ["full-bleed", "medium", "display-sans", "studio"],
  aeons: ["editorial", "high", "display-serif", "studio"],
  beaucoup: ["asymmetric", "high", "display-sans", "studio"],
  darkroomengineering: ["full-bleed", "high", "display-serif", "studio"],
  doodles: ["asymmetric", "high", "display-sans", "studio"],
  figurefilm: ["full-bleed", "high", "display-serif", "studio"],
  fleshandbones: ["full-bleed", "high", "display-sans", "studio"],
  funandawe: ["asymmetric", "medium", "display-serif", "studio"],
  generousbranding: ["grid", "medium", "display-sans", "studio"],
  glyphic: ["editorial", "high", "display-serif", "studio"],
  gracebrigade: ["editorial", "medium", "display-serif", "studio"],
  heyato: ["asymmetric", "medium", "display-sans", "studio"],
  lamalama: ["asymmetric", "medium", "display-sans", "studio"],
  mojostudio: ["asymmetric", "high", "display-sans", "studio"],
  motion: ["full-bleed", "high", "display-serif", "studio"],
  ogakidigital: ["asymmetric", "medium", "display-serif", "studio"],
  owo: ["grid", "medium", "sans", "studio"],
  sami: ["editorial", "high", "display-serif", "studio"],
  sunset: ["editorial", "high", "display-serif", "studio"],
  tinker: ["asymmetric", "high", "display-serif", "studio"],
  usefoulplay: ["asymmetric", "high", "display-serif", "studio"],
  // --- agencies ---
  analogue: ["editorial", "medium", "display-serif", "agency"],
  atlantic: ["grid", "medium", "sans", "agency"],
  axisgroup: ["grid", "low", "sans", "agency"],
  brandappart: ["asymmetric", "medium", "display-sans", "agency"],
  collins: ["grid", "low", "sans", "agency"],
  contralabs: ["asymmetric", "medium", "display-serif", "agency"],
  further: ["grid", "medium", "sans", "agency"],
  future: ["centered", "medium", "sans", "agency"],
  futurethree: ["asymmetric", "high", "display-sans", "agency"],
  huehausagency: ["grid", "medium", "sans", "agency"],
  offsite: ["grid", "medium", "sans", "agency"],
  raggededge: ["asymmetric", "high", "display-serif", "agency"],
  waxyweb: ["grid", "medium", "sans", "agency"],
  // --- tech / saas / dev tools ---
  aave: ["centered", "medium", "display-sans", "tech"],
  aptos: ["grid", "medium", "sans", "tech"],
  celo: ["grid", "medium", "sans", "tech"],
  cloudflareworkers: ["grid", "medium", "sans", "tech"],
  devnotion: ["centered", "medium", "sans", "tech"],
  ethena: ["centered", "medium", "sans", "tech"],
  greptile: ["centered", "medium", "sans", "tech"],
  linear: ["centered", "low", "sans", "tech"],
  microsoftai: ["grid", "medium", "sans", "tech"],
  moneda: ["grid", "medium", "sans", "tech"],
  outseta: ["grid", "low", "sans", "tech"],
  paradigm: ["centered", "medium", "display-sans", "tech"],
  proofmode: ["centered", "low", "sans", "tech"],
  reactemail: ["centered", "low", "sans", "tech"],
  readme: ["grid", "low", "sans", "tech"],
  robot: ["grid", "medium", "sans", "tech"],
  rollups: ["grid", "medium", "sans", "tech"],
  stackbyte: ["grid", "low", "sans", "tech"],
  subframe: ["centered", "medium", "sans", "tech"],
  superhuman: ["centered", "low", "sans", "tech"],
  worldlabs: ["centered", "high", "sans", "tech"],
  // --- products / apps ---
  flim: ["centered", "medium", "sans", "product"],
  humble: ["grid", "low", "sans", "product"],
  interlude: ["centered", "medium", "sans", "product"],
  luffu: ["grid", "medium", "sans", "product"],
  marblex: ["centered", "high", "display-sans", "product"],
  mindmarket: ["grid", "medium", "sans", "product"],
  momoney: ["grid", "low", "sans", "product"],
  monolog: ["editorial", "low", "serif", "product"],
  quoti: ["centered", "medium", "sans", "product"],
  satius: ["grid", "medium", "sans", "product"],
  solidroad: ["centered", "low", "sans", "product"],
  structuredmoney: ["grid", "low", "sans", "product"],
  synthesis: ["centered", "high", "sans", "product"],
  tavus: ["centered", "high", "sans", "product"],
  vovy: ["centered", "high", "sans", "product"],
  // --- portfolios ---
  amnajaved: ["asymmetric", "medium", "display-serif", "portfolio"],
  cosmos: ["editorial", "high", "display-serif", "portfolio"],
  juanmora: ["asymmetric", "medium", "display-serif", "portfolio"],
  selvincortez: ["asymmetric", "high", "display-serif", "portfolio"],
  // --- brand / hospitality / events ---
  busybeehoney: ["centered", "medium", "display-serif", "brand"],
  chipsa: ["full-bleed", "high", "display-sans", "brand"],
  houseofhoney: ["centered", "medium", "display-sans", "brand"],
  lobbspadel: ["editorial", "medium", "display-sans", "brand"],
  monologue: ["centered", "medium", "display-serif", "brand"],
  munrooftoprome: ["editorial", "high", "display-serif", "hospitality"],
  tastelabs: ["editorial", "medium", "display-serif", "brand"],
  tesoro: ["grid", "medium", "display-serif", "brand"],
  tinywins: ["editorial", "medium", "sans", "brand"],
  truus: ["editorial", "medium", "display-serif", "brand"],
  creativesouth2026: ["centered", "high", "display-sans", "event"],
  // --- music / film / culture ---
  coveo: ["full-bleed", "high", "display-sans", "music"],
  docemilmusic: ["editorial", "medium", "display-serif", "music"],
  maps: ["full-bleed", "medium", "display-sans", "music"],
  massivemusic: ["full-bleed", "high", "display-sans", "music"],
  molecularsound: ["full-bleed", "high", "display-serif", "music"],
  // --- food & drink ---
  limeiq: ["grid", "medium", "sans", "food"],
  // --- fashion ---
  elleriley: ["editorial", "high", "display-serif", "fashion"],
  leoffparis: ["editorial", "medium", "display-serif", "fashion"],
  taya: ["centered", "medium", "display-serif", "fashion"],
  // --- art / photography ---
  caligra: ["editorial", "high", "display-serif", "art"],
  chdartmaker: ["asymmetric", "medium", "display-serif", "art"],
  corygrossman: ["full-bleed", "high", "sans", "photography"],
  dryft: ["full-bleed", "high", "display-serif", "photography"],
  haleypark: ["full-bleed", "high", "sans", "photography"],
  // --- sports ---
  cowboyspace: ["full-bleed", "high", "display-sans", "sports"],
  davidalaba: ["centered", "medium", "display-sans", "sports"],
  landonorris: ["full-bleed", "high", "display-sans", "sports"],
  // --- wellness ---
  frequencybreathwork: ["centered", "low", "display-serif", "wellness"],
};

const DEFAULT_TAGS = ["asymmetric", "medium", "display-sans", "portfolio"];

function normalizeName(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function slugify(name) {
  return normalizeName(name) || "site";
}

function parseDataTxt(text) {
  const name = /^Name:\s*(.*)$/m.exec(text)?.[1]?.trim() ?? "";
  const url = /^Url:\s*(.*)$/m.exec(text)?.[1]?.trim() ?? "";
  const status = /^Url status:\s*(.*)$/m.exec(text)?.[1]?.trim() ?? "";
  return { name, url, status };
}

async function analyzePalette(imagePath) {
  try {
    const crop = sharp(imagePath).resize({ width: 120 });
    const { data, info } = await crop.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const len = info.width * info.height;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < len; i++) {
      const a = data[i * 4 + 3];
      if (a < 10) continue;
      r += data[i * 4];
      g += data[i * 4 + 1];
      b += data[i * 4 + 2];
      count++;
    }
    if (count === 0) return ["muted", "neutral", "subtle"];
    r /= count;
    g /= count;
    b /= count;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const sat = max === 0 ? 0 : (max - min) / max;

    let hue = 0;
    if (max !== min) {
      if (max === r) hue = 60 * (((g - b) / (max - min)) % 6);
      else if (max === g) hue = 60 * ((b - r) / (max - min) + 2);
      else hue = 60 * ((r - g) / (max - min) + 4);
      if (hue < 0) hue += 360;
    }

    const tags = [];
    if (lum > 0.62) tags.push("bright");
    else if (lum < 0.3) tags.push("dark");
    else tags.push("muted");

    if (sat > 0.12) {
      if (hue < 60 || hue >= 320) tags.push("warm");
      else if (hue >= 150 && hue < 270) tags.push("cool");
      else tags.push("neutral");
    } else {
      tags.push("neutral");
    }

    tags.push(sat > 0.28 ? "vibrant" : "subtle");
    return tags;
  } catch (error) {
    console.warn(`  palette analysis failed: ${error.message}`);
    return ["muted", "neutral", "subtle"];
  }
}

async function convertThumb(imagePath, outPath) {
  const meta = await sharp(imagePath).metadata();
  const width = meta.width ?? THUMB_WIDTH;
  const cropHeight = Math.max(1, Math.min(meta.height ?? 1, Math.round(width * (9 / 16))));
  await sharp(imagePath)
    .autoOrient()
    .extract({ left: 0, top: 0, width, height: cropHeight })
    .resize({ width: THUMB_WIDTH })
    .webp({ quality: 72 })
    .toFile(outPath);
}

async function convertFullpage(imagePath, outPath) {
  const meta = await sharp(imagePath).metadata();
  const scale = Math.min(
    FULLPAGE_MAX_WIDTH / (meta.width ?? 1),
    FULLPAGE_MAX_HEIGHT / (meta.height ?? 1),
    1
  );
  const w = Math.max(1, Math.round((meta.width ?? 1) * scale));
  const h = Math.max(1, Math.round((meta.height ?? 1) * scale));
  await sharp(imagePath)
    .autoOrient()
    .resize({ width: w, height: h })
    .webp({ quality: 78 })
    .toFile(outPath);
}

function convertVideo(videoPath, outPath) {
  if (!fs.existsSync(videoPath)) return false;
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      videoPath,
      "-t",
      String(VIDEO_MAX_DURATION),
      "-vf",
      `scale='min(${VIDEO_MAX_WIDTH},iw)':-2`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-an",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outPath,
    ],
    { stdio: "ignore", windowsHide: true }
  );
  return result.status === 0 && fs.existsSync(outPath);
}

function findFile(dir, extensions) {
  const files = fs.readdirSync(dir);
  const found = files.find((file) => extensions.some((ext) => file.toLowerCase().endsWith(ext)));
  return found ? path.join(dir, found) : null;
}

async function main() {
  console.log(`WInspo gallery converter`);
  console.log(`  dataset:  ${datasetName}`);
  console.log(`  gallery:  ${galleryDir}`);
  console.log();

  if (!fs.existsSync(galleryDir)) {
    console.error(`Gallery directory not found: ${galleryDir}`);
    process.exit(1);
  }

  fs.mkdirSync(manifestDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  const folders = fs
    .readdirSync(galleryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => entry.name !== "__pycache__")
    .map((entry) => path.join(galleryDir, entry.name));

  const items = [];
  let skipped = 0;

  for (const folder of folders) {
    const dataTxt = path.join(folder, "data.txt");
    if (!fs.existsSync(dataTxt)) {
      console.warn(`  skip ${path.basename(folder)}: no data.txt`);
      skipped++;
      continue;
    }
    const { name, url } = parseDataTxt(fs.readFileSync(dataTxt, "utf-8"));
    if (!name) {
      console.warn(`  skip ${path.basename(folder)}: empty Name in data.txt`);
      skipped++;
      continue;
    }

    const imagePath = findFile(folder, [".jpg", ".jpeg", ".png", ".webp"]);
    const videoPath = findFile(folder, [".mp4", ".webm", ".mov"]);
    if (!imagePath) {
      console.warn(`  skip ${name}: no screenshot image`);
      skipped++;
      continue;
    }

    const slug = slugify(name);
    const thumbPath = path.join(assetsDir, `${slug}-thumb.webp`);
    const fullpagePath = path.join(assetsDir, `${slug}-fullpage.webp`);
    const clipPath = path.join(assetsDir, `${slug}-clip.mp4`);

    const palette = await analyzePalette(imagePath);

    try {
      await convertThumb(imagePath, thumbPath);
      await convertFullpage(imagePath, fullpagePath);
    } catch (error) {
      console.warn(`  skip ${name}: image conversion failed (${error.message})`);
      skipped++;
      continue;
    }

    const hasVideo = convertVideo(videoPath, clipPath);
    if (videoPath && !hasVideo) {
      console.warn(`  ${name}: video conversion failed, continuing with images only`);
    }

    const override = OVERRIDES[normalizeName(name)] ?? DEFAULT_TAGS;
    const slot = items.length;
    items.push({
      id: slot + 1,
      slot,
      title: name,
      url: url || undefined,
      media: {
        thumbnail: `assets/${slug}-thumb.webp`,
        fullpage: `assets/${slug}-fullpage.webp`,
        ...(hasVideo ? { video: `assets/${slug}-clip.mp4` } : {}),
      },
      tags: {
        palette,
        layout: override[0],
        motion: override[1],
        typography: override[2],
        category: override[3],
      },
    });

    console.log(
      `  ok ${String(slot + 1).padStart(2, " ")} ${name.padEnd(24)} palette=${palette.join(",")}`
    );
  }

  if (items.length === 0) {
    console.error("No items converted. Aborting manifest write.");
    process.exit(1);
  }

  const manifest = {
    name: datasetName,
    version: "1.0.0",
    description: `A broad mix of ${items.length} real website styles.`,
    items,
  };

  const manifestPath = path.join(manifestDir, "winspo.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

  const totalMb = folders.length;
  console.log();
  console.log(`Wrote ${manifestPath}`);
  console.log(`  ${items.length} items, ${skipped} skipped`);
  console.log(`  assets in ${assetsDir}`);
  console.log();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
