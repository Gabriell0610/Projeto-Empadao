import { InMemoryUserRepository } from "@/repository/in-memory/user";
import { CreateUserDto } from "@/dto/auth/CreateUserDto";
import { AuthService } from ".";
import { AccessProfile } from "@/utils/constants/accessProfile";
import bcrypt from "bcryptjs";
import { InMemoryTokenResets } from "@/repository/in-memory/token-resets";
import { NodemailerService } from "../email/nodemailer";

let authService: AuthService;
let userRepositoryInMemory: InMemoryUserRepository;
let tokenResetsInMemory: InMemoryTokenResets
let nodemailerService: NodemailerService
describe("Unit Tests - authService", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    tokenResetsInMemory = new InMemoryTokenResets();
    nodemailerService = new NodemailerService();
    authService = new AuthService(userRepositoryInMemory, tokenResetsInMemory, nodemailerService);
  });

  describe("Testing method register", () => {
    it("Should create a user", async () => {
      //Arrange

      const userDto: CreateUserDto = {
        nome: "Gabriel",
        email: "gabriel@gmail.com",
        senha: "Gb12345!",
        telefone: "21979736993",
        role: AccessProfile.CLIENT,
      };
      //Act
      const response = await authService.register(userDto);
      //Assert
      expect(response).toMatchObject({
        nome: userDto.nome,
        email: userDto.email,
        telefone: userDto.telefone,
        role: userDto.role,
      });
    });

    it("Should throw a BadRequestException when user already exists", async () => {
      const userDto: CreateUserDto = {
        nome: "Gabriel",
        email: "gabriel@gmail.com",
        senha: "Gb12345!",
        telefone: "21979736993",
        role: AccessProfile.CLIENT,
      };

      await authService.register(userDto);

      await expect(authService.register(userDto)).rejects.toThrow("Já existe conta cadastrada com esse email!");
    });

    it("should hash the user password before register", async () => {
      const userDto: CreateUserDto = {
        nome: "Gabriel",
        email: "gabriel@gmail.com",
        senha: "Gb12345!",
        telefone: "21979736993",
        role: AccessProfile.CLIENT,
      };

      const response = await authService.register(userDto);

      const isPasswordHashed = await bcrypt.compare("Gb12345!", response.senha as string);
      expect(isPasswordHashed).toBe(true);
    });
  });
});
