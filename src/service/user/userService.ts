import { IUserService } from "./IUserService";
import { IUserRepository } from "../../repository/interfaces";
import { BadRequestException } from "../../core/error/exceptions/bad-request-exception";
import { UpdateUserDto } from "@/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/dto/address/AddressDto";

class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}
  list = async () => {
    const res = this.userRepository.list();
    return res;
  };

  listUserById = async (id: string) => {
    const res = await this.userRepository.findUserById(id);
    return res;
  };

  updateUser = async (dto: UpdateUserDto, userId: string, userEmail: string) => {
    const verifyUser = await this.listUserById(userId);

    if (verifyUser?.email !== userEmail) {
      throw new BadRequestException("Usuário não pode alterar seus dados");
    }

    const updateUser = await this.userRepository.updateUser(dto, userId);

    return updateUser;
  };

  addAddress = async (dto: AddressDto, userId: string) => {
    await this.userRepository.addAddress(dto, userId);
  };

  updateUserAddress = async (dto: AddressUpdateDto, userId: string, addressId: string) => {
    await this.userRepository.updateAddress(dto, userId, addressId);
  };

  removeAddress = async (userId: string, addressId: string) => {
    this.userRepository.removeAddress(userId, addressId);
  };
}

export { UserService };
