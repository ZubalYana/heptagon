import Router from "express";
import type { Request, Response } from "express";
import { userService } from "./userService";
import { formErrorMessage } from "../../helpers/formErrorMessage";

const router = Router();

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

router.delete("/delete", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await userService.deleteAccount(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;