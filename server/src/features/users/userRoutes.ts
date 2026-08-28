import Router from "express";
import type { Request, Response } from "express";
import { userService } from "./userService";
import { formErrorMessage } from "../../helpers/formErrorMessage";
import {
  getGoogleLoginUrl,
  getGoogleProfile,
  verifyGoogleLoginState,
} from "./googleLogin";

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
    const params = new URLSearchParams({
      token: result.token,
      refreshToken: result.refreshToken,
      user: JSON.stringify(result.user),
    });
    res.redirect(`${frontend}/auth/callback?${params.toString()}`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Google sign-in failed";
    res.redirect(
      `${frontend}/auth?error=${encodeURIComponent(message)}`
    );
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

router.delete("/delete/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    await userService.deleteAccount(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;