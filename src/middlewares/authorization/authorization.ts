import { AccessProfile } from "@/utils/constants/accessProfile";
import { UnauthorizedException } from "@/core/error/exceptions/unauthorized-exception";
import { authorizationBodySchema } from "@/utils/helpers/zod/schemas/token";
import { NextFunction, Request } from "express";

class Authorization {
  public instanceName: string;
  private authorizedRoles: AccessProfile[] = [];
  private authorizedAnyRole: boolean = false;

  constructor(instanceName: string) {
    this.instanceName = instanceName;
  }

  ofRoles = (roles: AccessProfile[]) => {
    this.authorizedRoles = roles;

    return this;
  };

  anyRole = () => {
    this.authorizedAnyRole = true;

    return this;
  };

  authorize = (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterRole } = authorizationBodySchema.parse(req.body);

      if (!this.authorizedRoles.includes(requesterRole) && !this.authorizedAnyRole) {
        throw new UnauthorizedException("Você não tem permissão para executar esta ação.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export { Authorization };
