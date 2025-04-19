import { passwordValidation } from "@/utils/helpers/zod/validations/password";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email escrito de forma errada").min(1, "Email é obrigatório"),
  newPassword: passwordValidation.optional(),
  token: z.string().optional(),
});

type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export { forgotPasswordSchema, ForgotPasswordDto };
