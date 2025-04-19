/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserService } from "../../service/user/IUserService";
import { NextFunction, Request } from "express";
import { HttpStatus } from "../../core/http";
import { authorizationBodySchema } from "@/utils/helpers/zod/schemas/token";
import { updateUserBodySchema } from "@/dto/user/UpdateUserDto";
import { addressBodySchema, updateAddressBodySchema } from "@/dto/address/AddressDto";
import { BadRequestException } from "@/core/error/exceptions/bad-request-exception";

export class UserController {
  constructor(private userService: IUserService) {}

  list = async (req: Request, res: any, next: NextFunction) => {
    try {
      const payload = await this.userService.list();
      return res.status(HttpStatus.OK).json({ message: "Listando usuários", res: payload });
    } catch (error) {
      next(error);
    }
  };

  listUserById = async (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterId } = authorizationBodySchema.parse(req.body);
      const data = await this.userService.listUserById(requesterId);
      return res.status(HttpStatus.OK).json({ message: "Listando usuário logado com sucesso!", res: data });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterId: userId, requesterEmail: userEmail } = authorizationBodySchema.parse(req.body);
      const dto = updateUserBodySchema.parse(req.body);
      const data = await this.userService.updateUser(dto, userId, userEmail);

      return res.status(HttpStatus.OK).json({ message: "Usuário atualizado com sucesso!", res: data });
    } catch (error) {
      next(error);
    }
  };

  addAddress = async (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const dto = addressBodySchema.parse(req.body);
      await this.userService.addAddress(dto, userId);
      return res.status(HttpStatus.CREATED).json({ message: "Endereço adicionado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  removeAddress = async (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const { idAddress } = req.params;
      await this.userService.removeAddress(userId, idAddress);
      return res.status(HttpStatus.CREATED).json({ message: "Endereço removido com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  updateUserAddress = async (req: Request, res: any, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const { idAddress } = req.params;

      if (Array.isArray(req.body) || typeof req.body !== "object") {
        throw new BadRequestException("Payload Formatado errado");
      }

      const dto = updateAddressBodySchema.parse(req.body);

      await this.userService.updateUserAddress(dto, userId, idAddress);
      return res.status(HttpStatus.OK).json({ message: "Endereço atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
