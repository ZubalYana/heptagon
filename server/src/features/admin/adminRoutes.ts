import Router from "express";
import type { Request, Response } from "express";
import { adminService } from "./adminService";
import { verifyAdmin } from "../../middleware/verifyAdmin";
import { rateLimitAdminLogin } from "../../middleware/rateLimitAdminLogin";
import { formErrorMessage } from "../../helpers/formErrorMessage";

const router = Router();

router.post("/login", rateLimitAdminLogin, (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const adminToken = adminService.login(email, password);
    res.status(200).json({ message: "Admin allowed in", adminToken });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.get("/users", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

router.delete("/delete-user", verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const message = await adminService.deleteUser(userId);
    res.status(200).json({ message });
  } catch (err) {
    const errorResult = formErrorMessage(err);
    res.status(errorResult.status).json({ error: errorResult.message });
  }
});

export default router;