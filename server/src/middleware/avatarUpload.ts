import multer from "multer";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new Error("Image must be JPEG, PNG, WebP, or GIF"));
      return;
    }
    cb(null, true);
  },
});
