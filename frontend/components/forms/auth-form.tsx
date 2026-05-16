"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8)
});

type Values = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    try {
      const { data } = await api.post(`/auth/${mode}`, values);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      toast({ title: mode === "login" ? "Welcome back" : "Workspace ready", description: "You are signed in." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ title: "Authentication failed", description: error.response?.data?.message ?? "Please try again." });
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_10%,rgba(20,184,166,.2),transparent_32%)] px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="glass">
          <CardHeader>
            <CardTitle>{mode === "login" ? "Login to TaskFlow" : "Create your account"}</CardTitle>
            <CardDescription>{mode === "login" ? "Use admin@example.com / Password123! after seeding." : "Start managing team projects in minutes."}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...register("name")} placeholder="Avery Admin" />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="admin@example.com" />
                {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input {...register("password")} type="password" placeholder="Password123!" />
                {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
              </div>
              <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
              <Link className="font-medium text-primary" href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Sign up" : "Login"}</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
