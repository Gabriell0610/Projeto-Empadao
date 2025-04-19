import { AccessProfile } from "../../utils/constants/accessProfile";
import { z } from "zod";
import { passwordValidation } from "@/utils/helpers/zod/validations/password";

//SCHEMAS
const CreateUserBodySchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email escrito de forma errada").min(1, "Email é obrigatório"),
  senha: passwordValidation,
  telefone: z.string().min(11, "O telefone possui menos de 21 caracteres").min(1, "O telefone é obrigatório"),
  role: z.enum([AccessProfile.ADMIN, AccessProfile.CLIENT]).default(AccessProfile.CLIENT),
});

type CreateUserDto = z.infer<typeof CreateUserBodySchema>;

export { CreateUserDto, CreateUserBodySchema };
