"use client";

// Zod and React Hook Form
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

// Auth Client
import { authClient } from "../../../lib/auth-client";
import { useRouter } from "next/router";

// Schema of the form
export const formSchema = z
  .object({
    name: z.string("Nome inserido.").trim().min(3, "Nome é obrigatório."),
    email: z
      .email("Endereço de E-mail inválido.")
      .min(1, "Email é obrigatório."),
    password: z
      .string("Senha é obrigatória.")
      .trim()
      .min(6, "Senha deve ter pelo menos 6 caracteres.")
      .max(32, "Senha deve ter no máximo 32 caracteres."),
    passwordConfirmation: z
      .string("Confirmação de senha é inválida.")
      .trim()
      .min(6, "Confirmação de senha é obrigatória.")
      .max(32, "Confirmação de senha deve corresponder à senha."),
  })
  // Validate that password and passwordConfirmation match
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      error: "Passwords must match",
      path: ["passwordConfirmation"], // Specify the path to the field that should show the error
    },
  );

type FormData = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: FormData) {
    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          if (error.error.code === "user_already_exists") {
            toast.error("Não é possível cadastrar este E-mail.");
            form.setError("email", {
              message: "Tente novamente com outro E-mail.",
            });
          }

          toast.error(error.error.message || "Erro ao cadastrar usuário.");
        },
      },
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Crie sua conta de forma totalmente gratuita
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardContent className="space-y-4">
              {/* NAME */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* PASSWORD CONFIRMATION */}
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="cursor-pointer" type="submit">
                Criar conta
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default SignUpForm;
