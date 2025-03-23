import { AuthorizationBodyDto } from "@/helpers/zod/schemas/token";
import { CreateUserDto } from "../../dto/user/CreateUserDto";
import { Usuario } from "@prisma/client";
import { UpdateUserDto } from "@/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/dto/user/AddressDto";

interface IUserService {
  list: () => Promise<Partial<Usuario>[]>;
  updateUser: (dto: UpdateUserDto, userId: string, userEmail: string) => Promise<Partial<Usuario>>;
  listUserById: (id: string) => Promise<Partial<Usuario | null>>;
  removeAddress: (userId: string, idAddress: string) => Promise<void>;
  addAddress: (dto: AddressDto, userId: string) => Promise<void>;
  updateUserAddress: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<void>;
}

export { IUserService };
