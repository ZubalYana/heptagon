import { v2 as cloudinary } from "cloudinary";

function trim(value: string | undefined) {
  return value?.trim() || "";
}

function isConfigured() {
  if (trim(process.env.CLOUDINARY_URL)) return true;
  return Boolean(
    trim(process.env.CLOUDINARY_CLOUD_NAME) &&
      trim(process.env.CLOUDINARY_API_KEY) &&
      trim(process.env.CLOUDINARY_API_SECRET)
  );
}

function ensureConfig() {
  if (!isConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const url = trim(process.env.CLOUDINARY_URL);
  if (url) {
    cloudinary.config({ cloudinary_url: url, secure: true });
    return;
  }

  cloudinary.config({
    cloud_name: trim(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: trim(process.env.CLOUDINARY_API_KEY),
    api_secret: trim(process.env.CLOUDINARY_API_SECRET),
    secure: true,
  });
}

function asError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === "string" && err) return new Error(err);
  if (err && typeof err === "object" && "message" in err) {
    const text = String((err as { message?: unknown }).message ?? "");
    if (text) return new Error(text);
  }
  return new Error("Upload failed");
}

export async function uploadAvatarBuffer(buffer: Buffer, userId: string) {
  ensureConfig();
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "heptagon/avatars",
        public_id: userId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "auto" }],
      },
      (err, result) => {
        if (err || !result?.secure_url || !result.public_id) {
          reject(asError(err ?? "Upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function destroyAvatar(publicId: string) {
  if (!publicId || !isConfigured()) return;
  ensureConfig();
  await cloudinary.uploader.destroy(publicId);
}
