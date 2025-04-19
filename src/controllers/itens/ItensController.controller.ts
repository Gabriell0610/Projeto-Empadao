import { HttpStatus } from "@/core/http";
import { IItensService } from "@/service/itens/IItensService";
import { NextFunction, Request } from "express";

class ItensController {
  constructor(private itensService: IItensService) {}

  create = async (req: Request, res: any, next: NextFunction) => {
    try {
      await this.itensService.create(req.body);
      res.status(HttpStatus.CREATED).json({ message: "Item criado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: any, next: NextFunction) => {
    try {
      const payload = await this.itensService.list();
      res.status(HttpStatus.OK).json({ message: "Listando itens", res: payload });
    } catch (error) {
      next(error);
    }
  };
}

export { ItensController };
