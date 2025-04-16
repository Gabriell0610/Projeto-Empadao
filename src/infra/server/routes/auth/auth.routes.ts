
import { authUserController } from "@/controllers/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/api/auth/register", authUserController.register);

authRouter.post("/api/auth/login", authUserController.login);

authRouter.post("/api/auth/forgot-password", authUserController.forgetPassword);

authRouter.post("/api/auth/validate-token", authUserController.validateToken);
authRouter.post("/api/auth/reset-password");

export { authRouter };
