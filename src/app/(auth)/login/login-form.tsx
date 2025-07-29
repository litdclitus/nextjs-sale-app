"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoginBody, LoginBodyType } from "@api/schemaValidations/auth.schema";
import envConfig from "@/config";
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
import { useAppContext } from "@/app/AppProvider";

const LoginForm = () => {
  const { setSessionToken } = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    try {
      const response = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const payload = await response.json();
      const data = {
        status: response.status,
        payload,
      };

      if (!response.ok) {
        // toast.error(payload.message || "Login failed");
        throw data;
      }

      toast.success(payload.message, {
        position: "top-left",
      });

      const resultFromNextServer = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const resultPayload = await resultFromNextServer.json();

      // console.log("resultFromNextServer:", resultPayload);

      setSessionToken(resultPayload.res.data.token);

      // TODO: Handle successful login (redirect, store token, etc.)
    } catch (error: unknown) {
      console.log("error:", error);
      const status = (error as { status: number }).status;
      const errors = (
        error as {
          payload: {
            errors: { field: "email" | "password"; message: string }[];
          };
        }
      ).payload.errors;
      if (status === 422) {
        for (const error of errors) {
          // form.setError(error.field, {
          //   message: error.message,
          // });
          toast.error(error.message, {
            position: "top-left",
          });
        }
      }
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
