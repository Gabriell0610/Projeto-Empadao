import { Usuario } from "@prisma/client";
import { CreateUserDto } from "../../dto/auth/CreateUserDto";
import { IUserRepository } from "../interfaces";
import { AddressDto, AddressUpdateDto } from "@/dto/address/AddressDto";
import { UpdateUserDto } from "@/dto/user/UpdateUserDto";

class InMemoryUserRepository implements IUserRepository {
  userDatabase: CreateUserDto[] = [];

  create = async (data: CreateUserDto) => {
    this.userDatabase.push(data);
    return data;
  };

  list = async () => {
    const datas = this.userDatabase.map(({ senha, ...userWhithoutPassword }) => {
      return userWhithoutPassword;
    });

    return datas;
  };

  userExistsByEmail = async (email: string) => {
    const user = this.userDatabase.find((user) => user.email === email);
    return user || null;
  };

  findUserById!: (id: string) => Promise<Partial<Usuario> | null>;
  updateUser!: (dto: UpdateUserDto, userId: string) => Promise<Partial<Usuario>>;
  updateAddress!: (dto: AddressUpdateDto, userId: string, addressId: string) => Promise<Partial<void>>;
  removeAddress!: (userId: string, idAddress: string) => Promise<void>;
  addAddress!: (dto: AddressDto, userId: string) => Promise<void>;
}

export { InMemoryUserRepository };
