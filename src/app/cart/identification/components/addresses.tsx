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
import { setAddressCart } from "@/actions/set-cart-address";

// Database
import { shippingAddressTable } from "@/db/schema";

// Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  currentAddressId: string;
}

const Addresses = ({ addressUser, currentAddressId }: AddressProps) => {
  const queryClient = useQueryClient();

  const [selectedAddress, setSelectedAddress] =
    useState<string>(currentAddressId);

  // Mutate action from set address cart current
  const { mutate: SetAddress, isPending: isPendingSetAddress } = useMutation({
    mutationKey: ["setShippingAddress"],
    mutationFn: setAddressCart,
    onSuccess: () => {
      toast.success("Endereço definido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Erro ao definir endereço. Tente novamente.",
      );
    },
  });

  // Mutate action from add address in table and set like current cart.
  const { mutate: AddAddress, isPending: isPendingAddAddress } = useMutation({
    mutationKey: ["addShippingAddress"],
    mutationFn: addShippingAddress,
    onSuccess: () => {
      toast.success("Endereço salvo com sucesso!");

      return queryClient.invalidateQueries({
        queryKey: ["setShippingAddress", "addShippingAddress"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Erro ao salvar endereço. Tente novamente.",
      );
    },
  });

  // Function call on change input radio.
  const handleAddressChange = (shippingAddressId: string) => {
    if (shippingAddressId && shippingAddressId !== "add_new_address") {
      setSelectedAddress(shippingAddressId); // Set value address current only click user.
      SetAddress({ shippingAddressId }); // Set cart address only click user.
    }

    return queryClient.invalidateQueries({
      queryKey: ["setShippingAddress", "addShippingAddress"],
    });
  };

  // Add address on send form.
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

  // Check if has address selected
  const hasAddress =
    !selectedAddress || selectedAddress === "add_new_address" ? false : true;

  const handleToGoPayment = async () => {
    if (!hasAddress) return;

    try {
      toast.success("Botão de pagamento chamado com sucesso.");
    } catch (error) {
      toast.error("Erro ao renderizar o pagamento, Tente novamente!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indentificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          className=""
          value={selectedAddress ?? "add_new_address"}
          onValueChange={handleAddressChange}
        >
          {addressUser.map((address) => (
            <div key={address.id} className="flex items-center space-x-2">
              <RadioGroupItem value={address.id} id={address.id} />
              <Label htmlFor={address.id}>
                {address.recipientName}, {address.street}, {address.number} -{" "}
                {address.city}
              </Label>
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="add_new_address" id="add_new_address" />
            <Label htmlFor="add_new_address">Adicionar novo endereço.</Label>
          </div>
        </RadioGroup>

        {hasAddress && (
          <div className="mt-4">
            <Button
              onClick={handleToGoPayment}
              className="w-full"
              disabled={isPendingSetAddress}
            >
              {isPendingSetAddress ? "Processando..." : "Ir para o pagamento"}
            </Button>
          </div>
        )}

        {selectedAddress === "add_new_address" && (
          <div className="mt-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                        <FormItem className="w-16">
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
                  <Button
                    className="w-full"
                    type="submit"
                    variant="default"
                    disabled={isPendingSetAddress || isPendingAddAddress}
                  >
                    {isPendingSetAddress || isPendingAddAddress
                      ? "Salvando..."
                      : "Salvar endereço"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
