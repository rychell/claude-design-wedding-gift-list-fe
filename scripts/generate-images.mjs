#!/usr/bin/env node
/**
 * Generates images for each gift in gifts.json using Gemini image generation.
 *
 * Usage:
 *   GEMINI_API_KEY=<key> node scripts/generate-images.mjs
 *   GEMINI_API_KEY=<key> node scripts/generate-images.mjs <gift-id>   # single item
 *   GEMINI_API_KEY=<key> node scripts/generate-images.mjs --force      # regenerate existing
 *
 * When the imagePrompt mentions "Mayara" or "Rychell", the script includes
 * mayara.png / rychell.png as visual reference so the model can render
 * those faces in the scene.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set.');
  process.exit(1);
}

const MODEL = 'nano-banana-pro-preview';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: { responseModalities: ['IMAGE'] },
});

const GIFTS_PATH = path.join(ROOT, 'apps/web/src/data/gifts.json');
const OUTPUT_DIR = path.join(ROOT, 'apps/web/public/images');

const gifts = JSON.parse(fs.readFileSync(GIFTS_PATH, 'utf-8'));

function readImageBase64(filename) {
  return fs.readFileSync(path.join(OUTPUT_DIR, filename)).toString('base64');
}

const refs = {
  mayara: readImageBase64('mayara.png'),
  rychell: readImageBase64('rychell.png'),
};

// Detects any hint of human presence in the prompt — names, couple terms, pronouns, silhouettes
const PEOPLE_RE = /rychell|mayara|couple|casal|silhou|their|his\b|her\b|hands?\b|person|people|figure|two\b|both\b|noivo|noiva|bride|groom/i;

function buildParts(prompt) {
  const hasPeople = PEOPLE_RE.test(prompt);

  const parts = [];

  if (hasPeople) {
    // ── Identity block ──────────────────────────────────────────────────────
    parts.push({
      text: [
        '=== MANDATORY IDENTITY RULES — READ BEFORE GENERATING ===',
        '',
        'The two reference photos below define the ONLY human faces allowed in this image.',
        'Do NOT invent, hallucinate, or use any other faces.',
      ].join('\n'),
    });

    parts.push({
      text: 'REFERENCE PHOTO 1 — RYCHELL (BRAZILIAN MAN): Use his exact face, skin tone, hair and features for any male figure, "Rychell", "he/his", "the groom", "noivo", or the male half of any couple:',
    });
    parts.push({ inlineData: { mimeType: 'image/png', data: refs.rychell } });

    parts.push({
      text: 'REFERENCE PHOTO 2 — MAYARA (BRAZILIAN WOMAN): Use her exact face, skin tone, hair and features for any female figure, "Mayara", "she/her", "the bride", "noiva", or the female half of any couple:',
    });
    parts.push({ inlineData: { mimeType: 'image/png', data: refs.mayara } });

    parts.push({
      text: [
        '── Rules summary ──',
        '• "Rychell" or any male figure → the MAN from Reference Photo 1',
        '• "Mayara"  or any female figure → the WOMAN from Reference Photo 2',
        '• "couple" / "casal" / "two" / "both" / "their" → heterosexual couple: MAN (Photo 1) + WOMAN (Photo 2)',
        '• NEVER generate two women or two men when a couple or pair is requested',
        '• NEVER add background people whose faces differ from the two references above',
        '=== END OF IDENTITY RULES — NOW GENERATE THE IMAGE BELOW ===',
        '',
      ].join('\n'),
    });
  }

  parts.push({ text: prompt });

  if (hasPeople) {
    parts.push({
      text: 'FINAL REMINDER: Rychell = the man in Reference Photo 1. Mayara = the woman in Reference Photo 2. Any couple = one of each. Do not deviate.',
    });
  }

  return parts;
}

async function generateImage(gift, force = false) {
  const outputPath = path.join(OUTPUT_DIR, `${gift.id}.png`);

  if (!force && fs.existsSync(outputPath)) {
    console.log(`⏭  skip   ${gift.id}`);
    return;
  }

  const parts = buildParts(gift.imagePrompt);

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
      });

      const candidate = result.response.candidates?.[0];
      if (!candidate) {
        console.error(`✗ error  ${gift.id} — no candidate returned`);
        return;
      }

      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          fs.writeFileSync(outputPath, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`✓ done   ${gift.id}`);
          return;
        }
      }

      console.error(`✗ error  ${gift.id} — no image in response`);
      return;
    } catch (err) {
      const is429 = err.message?.includes('429') || err.message?.includes('Too Many Requests');
      if (is429 && attempt < MAX_RETRIES) {
        const retryMatch = err.message?.match(/retryDelay["\s:]+(\d+)/);
        const waitSecs = retryMatch ? parseInt(retryMatch[1], 10) + 2 : 60 * attempt;
        console.warn(`⏳ rate limit ${gift.id} — waiting ${waitSecs}s (attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, waitSecs * 1000));
      } else {
        console.error(`✗ error  ${gift.id} — ${err.message}`);
        return;
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const targetId = args.find(a => !a.startsWith('--'));

  const queue = targetId
    ? gifts.filter(g => g.id === targetId)
    : gifts;

  if (targetId && queue.length === 0) {
    console.error(`Gift not found: "${targetId}"`);
    process.exit(1);
  }

  const remaining = force
    ? queue
    : queue.filter(g => !fs.existsSync(path.join(OUTPUT_DIR, `${g.id}.png`)));

  console.log(`Model: ${MODEL}`);
  console.log(`Total: ${queue.length} gifts | To generate: ${remaining.length}\n`);

  for (const gift of queue) {
    await generateImage(gift, force);
    await new Promise(r => setTimeout(r, 600)); // avoid rate limiting
  }

  console.log('\nDone!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
