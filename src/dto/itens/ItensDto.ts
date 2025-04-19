import { z } from "zod";

const itensBodySchema = z.object({
  nome: z.string().min(1, "O nome do item é obrigatório"),
  preco: z.coerce.number().min(1, "O preço do item é obrigatório"),
  descricao: z.string().min(1, "A descrião do item é obrigatório"),
  image: z.string(),
  disponivel: z.boolean(),
});

type ItensDto = z.infer<typeof itensBodySchema>;

export { itensBodySchema, ItensDto };
