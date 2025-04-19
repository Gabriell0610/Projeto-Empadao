import { UnauthorizedException } from "@/core/error/exceptions/unauthorized-exception";
import { NextFunction, Request } from "express";
import { verify, decode, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import "dotenv/config";
import { InternalServerException } from "@/core/error/exceptions/internal-server-exception";
import { AccessProfile } from "@/utils/constants/accessProfile";

class JWTAuthenticator {
  authenticate = (req: Request, res: any, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException("Token não fornecido.");
      }

      const token = authHeader.replace("Bearer ", "");

      if (!process.env.JWT_SECRET) {
        throw new InternalServerException("JWT_SECRET não está definido");
      }

      verify(token, process.env.JWT_SECRET || "secret");

      const { id, email, role } = decode(token) as JwtPayload;

      req.body.requesterId = id;
      req.body.requesterEmail = email;
      req.body.requesterRole = role as AccessProfile;
      req.body.access_token = token;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException("Token expirado");
      next(new UnauthorizedException("Token inválido"));
    }
  };
}

export { JWTAuthenticator };
