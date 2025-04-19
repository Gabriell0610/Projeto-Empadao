import { UserRepository } from "../../repository/prisma/user/user.prisma.repository";
import { InMemoryUserRepository } from "../../repository/in-memory/user";
import { UserService } from "../../service/user/userService";
import { UserController } from "./UserController.controller";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userController };
