"use client";

// Format
import { PatternFormat } from "react-number-format";

// Zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

// Toast
import { toast } from "sonner";

// React
import { useState } from "react";

// Actions
import { addShippingAddress } from "@/actions/add-shipping-address";
import { shippingAddressTable } from "@/db/schema";
import { useMutation } from "@tanstack/react-query";

// Zod schema basead in shippingAddressTable
export const addressFormSchema = z.object({
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

type AddressFormData = z.infer<typeof addressFormSchema>;

interface AddressProps {
  addressUser: (typeof shippingAddressTable.$inferSelect)[];
}

const Addresses = ({ addressUser }: AddressProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const { mutate: AddAddress } = useMutation({
    mutationKey: ["shippingAddress"],
    mutationFn: addShippingAddress,
    onSuccess: () => {
      toast.success("Endereço salvo com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Erro ao salvar endereço. Tente novamente.",
      );
    },
  });

  function onSubmit(values: AddressFormData) {
    AddAddress(values);
  }

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      recipientName: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      country: "",
      phone: "",
      email: "",
      cpfOrCnpj: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indentificação</CardTitle>
      </CardHeader>
      <CardContent>
        {addressUser.map((address) => (
          <div key={address.id} className="flex items-center space-x-2">
            <RadioGroupItem value={address.id} id={address.id} />
            <Label htmlFor={address.id}>
              {address.recipientName}, {address.street}, {address.number} -{" "}
              {address.city}
            </Label>
          </div>
        ))}
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="add_new_address" id="add_new_address" />
            <Label htmlFor="add_new_address">Adcionar novo endereço.</Label>
          </div>
        </RadioGroup>

        {selectedAddress === "add_new_address" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do destinatário</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Rua</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Número" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apartamento, bloco, etc. (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          customInput={Input}
                          format="#####-###"
                          mask="_"
                          placeholder="00000-000"
                          {...field}
                          value={field.value || ""}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input placeholder="Brasil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <PatternFormat
                          customInput={Input}
                          format="(##) #####-####"
                          mask="_"
                          placeholder="(99) 99999-9999"
                          {...field}
                          value={field.value || ""}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seuemail@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpfOrCnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF ou CNPJ</FormLabel>
                      <FormControl>
                        <PatternFormat
                          customInput={Input}
                          format={
                            field.value && field.value.length > 11
                              ? "##.###.###/####-##"
                              : "###.###.###-##"
                          }
                          mask="_"
                          placeholder="Digite seu CPF ou CNPJ"
                          {...field}
                          value={field.value || ""}
                          onValueChange={(values) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" variant="default">
                  Salvar endereço
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
