"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({ name: z.string().min(2), description: z.string().min(5) });
type Values = z.infer<typeof schema>;

export function ProjectForm({ onSubmit }: { onSubmit: (values: Values) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  return (
    <form className="space-y-4" onSubmit={handleSubmit(async (values) => { await onSubmit(values); reset(); })}>
      <div className="space-y-2"><Label>Name</Label><Input {...register("name")} placeholder="Product launch" />{errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}</div>
      <div className="space-y-2"><Label>Description</Label><Textarea {...register("description")} placeholder="What is this project about?" />{errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}</div>
      <Button disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create project"}</Button>
    </form>
  );
}
