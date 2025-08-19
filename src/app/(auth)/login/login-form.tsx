"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  LoginBody,
  LoginBodyType,
  LoginResType,
} from "@api/schemaValidations/auth.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import authApiRequest from "@/apiRequests/auth";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/utils";

const LoginForm = () => {
  const router = useRouter();
  const { setSessionToken } = useAuth();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    try {
      const response: LoginResType = await authApiRequest.login(values);

      toast.success(response.message, {
        position: "top-left",
      });

      await authApiRequest.auth({
        sessionToken: response.data.token,
        expiresAt: response.data.expiresAt,
      });

      setSessionToken(response.data.token);
      router.push("/me");
    } catch (error: unknown) {
      handleApiError(error, form, {
        useFormErrors: false, // Use toast instead of form errors for login
        toastPosition: "top-left",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Please check your form and try again", {
            position: "top-left",
          });
        })}
        className="space-y-6 max-w-md mx-auto w-full"
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="w-full cursor-pointer"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
