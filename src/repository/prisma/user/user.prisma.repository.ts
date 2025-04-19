import { CreateUserDto } from "../../../dto/auth/CreateUserDto";
import { IUserRepository } from "repository/interfaces";
import { prisma } from "../../../libs/prisma";
import { UpdateUserDto } from "@/dto/user/UpdateUserDto";
import { AddressDto, AddressUpdateDto } from "@/dto/address/AddressDto";
import { Usuario } from "@prisma/client";

class UserRepository implements IUserRepository {
  create = async (data: CreateUserDto) => {
    return await prisma.usuario.create({
      data: {
        nome: data?.nome,
        email: data?.email,
        senha: data?.senha,
        telefone: data?.telefone,
        role: data?.role,
        dataAtualizacao: new Date(),
        dataCriacao: new Date(),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            endereco: true,
          },
        },
        dataCriacao: true,
        dataAtualizacao: true,
        role: true,
        senha: false,
      },
    });
  };

  list = async () => {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            endereco: true,
          },
        },
        dataCriacao: true,
        dataAtualizacao: true,
        role: true,
        senha: false,
      },
    });

    return usuarios;
  };

  userExistsByEmail = async (email: string) => {
    const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            endereco: true,
          },
        },
        dataCriacao: true,
        dataAtualizacao: false,
        role: true,
        senha: true,
      },
    });

    return user;
  };

  findUserById = async (id: string) => {
    const user = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        enderecos: {
          select: {
            endereco: true,
          },
        },
        dataCriacao: true,
        dataAtualizacao: false,
        role: true,
        senha: false,
      },
    });

    return user;
  };

  updateUser = async (data: UpdateUserDto, userId: string) => {
    return await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome: data?.nome,
        telefone: data?.telefone,
        dataAtualizacao: new Date(),
        senha: data?.senha
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        dataAtualizacao: true,
      },
    });
  };

  addAddress = async (dto: AddressDto, userId: string) => {
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        enderecos: {
          create: {
            endereco: {
              create: {
                rua: dto.rua,
                numero: dto.numero,
                cidade: dto.cidade,
                estado: dto.estado,
                bairro: dto.bairro,
                cep: dto.cep,
                complemento: dto.complemento,
              },
            },
          },
        },
      },
    });
  };

  updateAddress = async (dto: AddressUpdateDto, userId: string, addressId: string) => {
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        enderecos: {
          update: {
            where: { usuarioId_enderecoId: { usuarioId: userId, enderecoId: addressId } },
            data: {
              endereco: {
                update: {
                  rua: dto.rua,
                  numero: dto.numero,
                  cidade: dto.cidade,
                  estado: dto.estado,
                  bairro: dto.bairro,
                  cep: dto.cep,
                  complemento: dto.complemento,
                },
              },
            },
          },
        },
      },
    });
  };

  removeAddress = async (userId: string, idAddress: string) => {
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        enderecos: {
          delete: { usuarioId_enderecoId: { usuarioId: userId, enderecoId: idAddress } },
        },
      },
    });
  };
}

export { UserRepository };
