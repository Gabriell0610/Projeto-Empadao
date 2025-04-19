import { NextFunction, Request } from "express";
import { IAuthService } from "../../service/auth/IAuthService";
import { loginSchema } from "@/dto/auth/LoginDto";
import { HttpStatus } from "../../core/http";
import { CreateUserBodySchema } from "../../dto/auth/CreateUserDto";
import { forgotPasswordSchema } from "@/dto/auth/ForgotPasswordDto";

class AuthUserController {
  constructor(private authService: IAuthService) {}

  register = async (req: Request, res: any, next: NextFunction) => {
    try {
      const dto = CreateUserBodySchema.parse(req.body);
      await this.authService.register(dto);
      return res.status(HttpStatus.OK).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: any, next: NextFunction) => {
    try {
      const dto = loginSchema.parse(req.body);
      const token = await this.authService.login(dto);
      return res.status(HttpStatus.OK).json({ message: "Usuário logado com sucesso", access_token: token });
    } catch (error) {
      next(error);
    }
  };

  forgetPassword = async (req: Request, res: any, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body);
      await this.authService.createToken(dto);
      return res.status(HttpStatus.OK).json({ message: "Um token foi enviado para seu email!" });
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (req: Request, res: any, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body)
      const tokenValidated = await this.authService.validateToken(dto);
      return res.status(HttpStatus.OK).json({ message: "Token válido", data: tokenValidated});
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req: Request, res: any, next: NextFunction) => {
    try {
      const dto = forgotPasswordSchema.parse(req.body)
      await this.authService.resetPassword(dto);
      return res.status(HttpStatus.OK).json({message: "Senha alterada com sucesso!"})
    } catch (error) {
      next(error);
    }
  }
}

export { AuthUserController };
