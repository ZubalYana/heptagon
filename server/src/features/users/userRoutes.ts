import Router from "express";
import type { Request, Response, NextFunction } from "express";
import { userService } from "./userService";
import { formErrorMessage } from "../../helpers/formErrorMessage";
import { authMiddleware } from "../../middleware/auth";
import { avatarUpload } from "../../middleware/avatarUpload";
import { MulterError } from "multer";
import {
  getGoogleLoginUrl,
  getGoogleProfile,
  verifyGoogleLoginState,
} from "./googleLogin";
import {
  storeGoogleLoginResult,
  takeGoogleLoginResult,
} from "./googleLoginExchange";

const router = Router();

router.get("/google", (_req: Request, res: Response) => {
  try {
    res.redirect(getGoogleLoginUrl());
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/google/callback", async (req: Request, res: Response) => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    if (req.query.error) {
      throw new Error("Google sign-in was cancelled");
    }
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;
    if (!code || !state) {
      throw new Error("Google sign-in failed");
    }
    verifyGoogleLoginState(state);
    const profile = await getGoogleProfile(code);
    const result = await userService.loginWithGoogle(profile);
    const loginCode = storeGoogleLoginResult(result);
    res.redirect(
      `${frontend}/auth/callback?code=${encodeURIComponent(loginCode)}`
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Google sign-in failed";
    res.redirect(
      `${frontend}/auth?error=${encodeURIComponent(message)}`
    );
  }
});

router.post("/google/exchange", async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const result = takeGoogleLoginResult(code);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.register(name, email, password);
    res.status(200).json({ message: "User registered successfully", ...result });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await userService.refresh(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await userService.verifyEmail(token);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/resend-verification", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await userService.resendVerification(userId);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/change-password", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { currentPassword, newPassword } = req.body;
    const result = await userService.requestPasswordChange(
      userId,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/confirm-password-change", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await userService.confirmPasswordChange(token);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.patch("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await userService.updateProfile(userId, req.body.name);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post(
  "/avatar",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    avatarUpload.single("avatar")(req, res, (err) => {
      if (!err) {
        next();
        return;
      }
      const message =
        err instanceof MulterError && err.code === "LIMIT_FILE_SIZE"
          ? "Image must be 2 MB or smaller"
          : err instanceof Error
            ? err.message
            : "Could not upload image";
      const errorResult = formErrorMessage(new Error(message));
      res.status(errorResult.status).json({ error: errorResult.message });
    });
  },
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id as string;
      const file = req.file;
      if (!file) {
        throw new Error("Image is required");
      }
      const result = await userService.uploadAvatar(userId, file);
      res.status(200).json(result);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      const errorResult = formErrorMessage(err);
      res.status(errorResult.status).json({ error: errorResult.message });
    }
  }
);

router.delete("/avatar", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const result = await userService.removeAvatar(userId);
    res.status(200).json(result);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await userService.logout(refreshToken);
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/delete", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    await userService.deleteAccount(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;