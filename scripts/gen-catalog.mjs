// Sinh lib/catalog.gen.ts — metadata NHẸ cho màn Today (bundle GĐ2).
// Chạy: node scripts/gen-catalog.mjs (tự chạy trong "npm run build").
// Nguyên lý: esbuild bundle catalog-entry.ts (kéo cả lib/learn + lib/adventures
// ~735KB ở phía NODE), lấy object catalog rồi ghi ra file TS nhỏ vài chục KB.
// Test tests/catalog.test.ts sẽ ĐỎ nếu content đổi mà quên chạy lại script này.
import { build } from "esbuild";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const r = await build({
  entryPoints: [join(root, "scripts/catalog-entry.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  logLevel: "silent",
});
const code = Buffer.from(r.outputFiles[0].contents).toString("base64");
const { catalog } = await import(`data:text/javascript;base64,${code}`);

const banner = `// ⚠️ FILE TỰ SINH — ĐỪNG SỬA TAY. Chạy lại: node scripts/gen-catalog.mjs
// Metadata nhẹ cho màn Today: tên bài học, đếm unit, danh sách chương Adventure.
// Nguồn sự thật là lib/learn.ts + lib/adventures.ts; test catalog.test.ts gác đồng bộ.

import type { LearningSectionKey } from "./learn";   // type-only: bị xoá khi compile, KHÔNG kéo content vào bundle

export type CatalogSection = { key: LearningSectionKey; name: string; vi: string; icon: string; desc: string };
export type CatalogChapter = { id: string; vi: string; sceneImage: string | null; playable: boolean };
export type CatalogSeason = { id: string; chapters: CatalogChapter[] };
export type Catalog = {
  sections: CatalogSection[];
  unitCounts: { l1: number; l2: number; l3: number };
  lessons: Record<string, { title: string; sceneImage: string | null }>;
  lostCompassId: string;
  seasons: CatalogSeason[];
};

export const CATALOG: Catalog = `;

writeFileSync(join(root, "lib/catalog.gen.ts"), banner + JSON.stringify(catalog, null, 1) + ";\n");
const kb = Math.round(JSON.stringify(catalog).length / 1024);
console.log(`CATALOG_OK lib/catalog.gen.ts (~${kb}KB, ${Object.keys(catalog.lessons).length} bài, ${catalog.seasons.length} season)`);
