import { passwordValidation } from "../../utils/helpers/zod/validations/password";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email escrito de forma errada").min(1, "Email é obrigatório"),
  password: passwordValidation,
});

type authDto = z.infer<typeof loginSchema>;

export { loginSchema, authDto };
