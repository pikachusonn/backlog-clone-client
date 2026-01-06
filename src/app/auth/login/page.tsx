"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setToken } from "@/helper/common";
const LoginPage = () => {
  const router = useRouter();
  const loginSchema = z.object({
    email: z.string().refine((value) => value.trim().length > 0, {
      message: "Email is required",
    }),
    password: z.string().refine((value) => value.trim().length > 0, {
      message: "Password is required",
    }),
  });
  type LoginSchemaType = z.infer<typeof loginSchema>;
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginSchemaType) => login(values),
    onSuccess: (response) => {
      setToken(response.accessToken, response.refreshToken);
      toast.success("Login successful");
      router.push("/");
    },
    onError: () => {
      toast.error("Login failed");
    },
  });

  const onSubmit = (values: LoginSchemaType) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 rounded-md border w-[320px]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={!form.formState.isValid}>
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
