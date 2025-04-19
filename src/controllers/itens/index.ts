import { InMemoryItensRepository } from "@/repository/in-memory/itens";
import { ItensService } from "@/service/itens/itensService";
import { ItensController } from "./ItensController.controller";
import { ItensRepository } from "@/repository/prisma/itens/itens.prisma.repository";

const itensRepository = new ItensRepository();

const itensService = new ItensService(itensRepository);

const itensController = new ItensController(itensService);

export { itensController };
