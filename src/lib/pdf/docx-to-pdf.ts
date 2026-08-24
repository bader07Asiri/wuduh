// ============================
// وضوح | Wuduh — DOCX → PDF عبر LibreOffice (headless)
// عربي سليم التشكيل والاتجاه، مجاني، وأخف من Chromium.
// مع طابور تزامن يحصر عدد عمليات LibreOffice المتوازية (حماية موارد السيرفر).
// ============================

import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

// ── طابور تزامن بسيط داخل العملية ──
const MAX = Math.max(1, Number(process.env.LIBREOFFICE_CONCURRENCY || 1));
let active = 0;
const waiters: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX) { active++; return Promise.resolve(); }
  return new Promise<void>((resolve) => waiters.push(resolve)).then(() => { active++; });
}
function release() {
  active = Math.max(0, active - 1);
  const next = waiters.shift();
  if (next) next();
}

function sofficeBin(): string {
  return process.env.SOFFICE_PATH || "soffice";
}

function runSoffice(inPath: string, outDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // ملف تعريف مستقل لكل عملية لتفادي أقفال التزامن
    const profile = `-env:UserInstallation=file://${path.join(outDir, "lo-profile")}`;
    const proc = spawn(
      sofficeBin(),
      ["--headless", "--norestore", "--nolockcheck", "--nodefault", profile,
       "--convert-to", "pdf:writer_pdf_Export", "--outdir", outDir, inPath],
      { timeout: 120000 }
    );
    let err = "";
    proc.stderr?.on("data", (d) => { err += String(d); });
    proc.on("error", (e) => reject(new Error(`تعذّر تشغيل LibreOffice (${sofficeBin()}): ${e.message}`)));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`فشل تحويل PDF عبر LibreOffice (كود ${code}). ${err.slice(0, 300)}`));
    });
  });
}

// يحوّل مستند Word (DOCX) إلى PDF ويُعيد الـbytes
export async function docxToPdf(docx: Uint8Array): Promise<Uint8Array> {
  await acquire();
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "wuduh-pdf-"));
  const inPath = path.join(dir, "document.docx");
  const outPath = path.join(dir, "document.pdf");
  try {
    await fs.writeFile(inPath, Buffer.from(docx));
    await runSoffice(inPath, dir);
    const pdf = await fs.readFile(outPath);
    return new Uint8Array(pdf);
  } finally {
    release();
    fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// هل LibreOffice متاح؟ (للفحص/التشخيص)
export async function isLibreOfficeAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const proc = spawn(sofficeBin(), ["--version"], { timeout: 8000 });
      proc.on("error", () => resolve(false));
      proc.on("close", (code) => resolve(code === 0));
    } catch {
      resolve(false);
    }
  });
}
