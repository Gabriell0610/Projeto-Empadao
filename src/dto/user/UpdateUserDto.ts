import { passwordValidation } from "@/utils/helpers/zod/validations/password";
import { z } from "zod";

const updateUserBodySchema = z.object({
  nome: z.string().optional(),
  telefone: z.string().optional(),
  senha: passwordValidation.optional()
});

type UpdateUserDto = z.infer<typeof updateUserBodySchema>;

export { updateUserBodySchema, UpdateUserDto };
