import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Persists an uploaded image into public/uploads and returns its public URL.
 * Returns null when no usable file was provided.
 */
export async function saveUploadedImage(file: unknown): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não suportado. Use JPEG, PNG, WEBP ou GIF.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Imagem muito grande. O limite é 8 MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  const filename = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), bytes);

  return `/uploads/${filename}`;
}
