import { z } from "zod";

export const addShippingAddressSchema = z.object({
  recipientName: z.string().min(1, "Nome do destinatário é obrigatório."),
  street: z.string().min(1, "Rua é obrigatória."),
  number: z.string().min(1, "Número é obrigatório."),
  complement: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "Estado é obrigatório."),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  zipCode: z.string().min(1, "CEP é obrigatório."),
  country: z.string().min(1, "País é obrigatório."),
  phone: z.string().min(1, "Telefone é obrigatório."),
  email: z.email("E-mail inválido.").min(1, "E-mail é obrigatório."),
  cpfOrCnpj: z.string().min(1, "CPF ou CNPJ é obrigatório."),
});

export type AddShippingAddressSchema = z.infer<typeof addShippingAddressSchema>;
