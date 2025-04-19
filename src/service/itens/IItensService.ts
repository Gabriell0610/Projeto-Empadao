import { ItensDto } from "@/dto/itens/ItensDto";
import { Item } from "@prisma/client";

interface IItensService {
  create: (data: ItensDto) => Promise<void>;
  list: () => Promise<Partial<Item>[]>;
}

export { IItensService };
