import { cepValidation } from "../../utils/helpers/zod/validations/cep";
import { Indices, z } from "zod";

const addressBodySchema = z.object({
  rua: z.string().min(1, "Rua é obrigatório"),
  cep: cepValidation,
  numero: z.coerce
    .number()
    .min(1, "O número é obrigatório")
    .transform((value) => String(value)),
  bairro: z.string().min(1, "O Bairro é obrigatório"),
  cidade: z.string().min(1, "A Cidade é obrigatória"),
  estado: z.string().min(2, "O Estado é obrigatório"),
  complemento: z.string().optional().nullable(),
});

const updateAddressBodySchema = z.object({
  rua: z.string().optional(),
  cep: cepValidation.optional(),
  numero: z.coerce
    .number()
    .transform((value) => String(value))
    .optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  complemento: z.string().optional().nullable(),
});

type AddressDto = z.infer<typeof addressBodySchema>;
type AddressUpdateDto = z.infer<typeof updateAddressBodySchema>;

export { addressBodySchema, updateAddressBodySchema, AddressDto, AddressUpdateDto };
