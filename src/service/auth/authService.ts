import { authDto } from "../../dto/auth/LoginDto";
import { IAuthService } from "./IAuthService";
import { BadRequestException } from "../../core/error/exceptions/bad-request-exception";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import "dotenv/config";
import { CreateUserDto } from "../../dto/auth/CreateUserDto";
import { IUserRepository } from "../../repository/interfaces";
import { ForgotPasswordDto } from "@/dto/auth/ForgotPasswordDto";
import { generateTokenAuth } from "@/utils/generateToken";
import { ITokenResets } from "@/repository/interfaces/tokenResets/ITokenResets";
import { InternalServerException } from "@/core/error/exceptions/internal-server-exception";
import { IEmailService } from "../email/nodemailer.type";
import { StatusToken } from "@/utils/constants/statusToken";

class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenResetsRepository: ITokenResets,
    private readonly emailService: IEmailService
  ) {}

  register = async (dto: CreateUserDto) => {
    const userExist = await this.userRepository.userExistsByEmail(dto.email)

    if(userExist) {
      throw new BadRequestException("Já existe conta cadastrada com esse email!");
    }

    const hashedPassword = await bcrypt.hash(dto.senha, 8);

    dto.senha = hashedPassword;

    return this.userRepository.create(dto);
  };

  login = async (dto: authDto) => {
    const userExist = await this.verifyUserExistsByEmail(dto.email)

    const passwordCorrect = await bcrypt.compare(dto.password, userExist.senha as string);

    if (!passwordCorrect) {
      throw new BadRequestException("Email ou senha incorretos");
    }

    const token = sign(
      {
        id: userExist.id,
        email: userExist.email,
        role: userExist.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d", algorithm: "HS256" },
    );

    return token;
  };

  createToken = async (dto: ForgotPasswordDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email)

    //SALVAR TOKEN E ID DO USUÁRIO NA TABELA tokenResets
    const token = generateTokenAuth();
    const createdToken = await this.tokenResetsRepository.createToken(token, userExists.id!);

    if(!createdToken) {
      throw new BadRequestException("Falha ao salvar token!");
    }

    //ENVIAR EMAIL PARA O USUÁRIO COM O TOKEN ACIMA
    this.emailService.sendEmail(dto.email, createdToken.token!)
  };

  validateToken = async (dto: ForgotPasswordDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email)

    const tokenRecord = await this.tokenResetsRepository.findByToken(dto.token!)

    if(!tokenRecord || tokenRecord.usuarioId !== userExists.id) {
      throw new BadRequestException("Token inválido. Gere outro token!");
    }

    const isExpired = tokenRecord.expiraEm < new Date()
    if(isExpired) {
      await this.tokenResetsRepository.updateStatus(StatusToken.EXPIRADO, tokenRecord.id!)
      throw new BadRequestException("Token expirado. Gere outro token!");
    }
    
    return tokenRecord
  }

  resetPassword = async(dto:ForgotPasswordDto) => {
    const userExists = await this.verifyUserExistsByEmail(dto.email)

    const hashedPassword = await bcrypt.hash(dto.newPassword!, 8);
    userExists.senha = hashedPassword;
    await this.userRepository.updateUser(userExists, userExists.id!);

    const tokenRecord = await this.tokenResetsRepository.findByToken(dto.token!)
    
    if(!tokenRecord) {
      throw new BadRequestException("Token não existe");
    }
    await this.tokenResetsRepository.updateStatus(StatusToken.EXPIRADO, tokenRecord.id!)
  }

  private async verifyUserExistsByEmail(email: string) {
    const userExists = await this.userRepository.userExistsByEmail(email);
    if (!userExists) {
      throw new BadRequestException("Esse usuário não foi encontrado!");
    }

    return userExists;
  }
}

export { AuthService };
