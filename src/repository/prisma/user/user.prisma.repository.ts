import { CreateUserDto } from "../../../dto/user/CreateUserDto";
import { IUserRepository } from "repository/interface";
import { prisma } from "../../../libs/prisma";
import { AccessProfile } from "../../../constants/access-profile";
import { Usuario } from "@prisma/client";
import { UpdateUserDto } from "@/dto/user/UpdateUserDto";
import { AddressDto } from "@/dto/user/AddressDto";

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
        enderecos: {
          create: data?.endereco?.map((address) => ({
            endereco: {
              create: {
                bairro: address?.bairro,
                cep: address?.cep,
                cidade: address?.cidade,
                complemento: address?.complemento,
                estado: address?.estado,
                numero: address?.numero,
                rua: address?.rua,
              },
            },
          })),
        },
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
    const user = await prisma.usuario.findUnique({ where: { email } });
    return user;
  };

  findById = async (id: string) => {
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
        role: false,
        senha: false,
      },
    });

    return user;
  };

  update = async (data: UpdateUserDto, userId: string, addressId: string) => {
    return await prisma.usuario.update({
      where: { id: userId },
      data: {
        nome: data?.nome,
        telefone: data?.telefone,
        dataAtualizacao: new Date(),
        enderecos: {
          update: {
            where: { usuarioId_enderecoId: { usuarioId: userId, enderecoId: addressId } }, // Filtra o endereço pelo ID
            data: {
              endereco: {
                update: {
                  rua: data.endereco?.[0]?.rua,
                  numero: data.endereco?.[0]?.numero,
                  cidade: data.endereco?.[0]?.cidade,
                  estado: data.endereco?.[0]?.estado,
                  bairro: data.endereco?.[0].bairro,
                  cep: data.endereco?.[0]?.cep,
                  complemento: data.endereco?.[0]?.complemento,
                },
              },
            },
          },
        },
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
}

export { UserRepository };
