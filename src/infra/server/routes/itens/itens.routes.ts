import { AccessProfile } from "@/utils/constants/accessProfile";
import { itensController } from "@/controllers/itens";
import { jwtAtuhenticator } from "@/middlewares/authentication";
import { authorization } from "@/middlewares/authorization";
import { Router } from "express";

const itensRouter = Router();

itensRouter.post(
  "/api/itens",
  jwtAtuhenticator.authenticate,
  authorization.ofRoles([AccessProfile.ADMIN]).authorize,
  itensController.create,
);

itensRouter.get("/api/itens", jwtAtuhenticator.authenticate, authorization.anyRole().authorize, itensController.list);

export { itensRouter };
