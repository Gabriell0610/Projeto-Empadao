import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(8, "A senha possui menos de 8 caracteres")
  .min(1, "A Senha é obrigatório")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[\W_]/, "A senha deve conter pelo menos um caractere especial");
