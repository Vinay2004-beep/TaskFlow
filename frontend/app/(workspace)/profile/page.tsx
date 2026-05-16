"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/services/api";
import type { User } from "@/types";

const schema = z.object({ name: z.string().min(2), bio: z.string().max(240).optional(), avatarUrl: z.string().url().optional().or(z.literal("")) });
type Values = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    values: { name: user?.name ?? "", bio: user?.bio ?? "", avatarUrl: user?.avatarUrl ?? "" }
  });

  async function onSubmit(values: Values) {
    const { data } = await api.patch<User>("/users/profile", { ...values, avatarUrl: values.avatarUrl || null });
    setUser(data);
    toast({ title: "Profile updated" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2"><Label>Name</Label><Input {...register("name")} /></div>
            <div className="space-y-2"><Label>Avatar URL</Label><Input {...register("avatarUrl")} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Bio</Label><Textarea {...register("bio")} /></div>
            <Button disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
