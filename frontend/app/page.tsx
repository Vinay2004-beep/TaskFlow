"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const features = [
  { icon: ShieldCheck, title: "Role-aware work", text: "Admins steer projects while members focus on assigned tasks." },
  { icon: BarChart3, title: "Live analytics", text: "Status, ownership, overdue work, and recent activity in one place." },
  { icon: Users, title: "Team flow", text: "Invite members, assign tasks, and keep everyone moving together." }
];

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold"><Sparkles className="h-5 w-5 text-primary" /> TaskFlow</Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
            <Button asChild><Link href="/signup">Start free</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[92vh] pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,.22),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(251,146,60,.18),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_1.05fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">Modern team delivery, minus the clutter</div>
            <h1 className="max-w-3xl text-5xl font-bold tracking-normal md:text-7xl">TaskFlow</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">A premium task manager for projects, roles, Kanban delivery, real-time updates, and recruiter-ready analytics.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/signup">Create workspace <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg"><Link href="#preview">View dashboard</Link></Button>
            </div>
          </motion.div>
          <motion.div id="preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="glass rounded-lg p-4 shadow-glow">
            <div className="grid gap-3 md:grid-cols-3">
              {["Total Tasks", "Overdue", "Completed"].map((label, index) => (
                <div key={label} className="rounded-md border bg-card p-4">
                  <div className="text-sm text-muted-foreground">{label}</div>
                  <div className="mt-2 text-3xl font-bold">{[42, 6, 28][index]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {["To Do", "In Progress", "Done"].map((column, index) => (
                <div key={column} className="rounded-md bg-muted/60 p-3">
                  <div className="mb-3 text-sm font-semibold">{column}</div>
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="mb-2 rounded-md border bg-card p-3 text-sm shadow-sm">
                      <div className="font-medium">{["Launch copy", "Invite flow", "QA deploy"][item]}</div>
                      <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${35 + index * 22}%` }} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} viewport={{ once: true }}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <feature.icon className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">Built to feel like a real SaaS product</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["Clean, fast, and role-aware.", "The dashboard made sprint planning obvious.", "A polished assignment-ready build."].map((quote) => (
              <Card key={quote}><CardContent className="pt-6 text-sm text-muted-foreground">{quote}</CardContent></Card>
            ))}
          </div>
          <Button asChild className="mt-10" size="lg"><Link href="/signup">Launch your workspace <CheckCircle2 className="h-4 w-4" /></Link></Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">TaskFlow © 2026. Built with Next.js, Express, Prisma, PostgreSQL, and Railway.</footer>
    </main>
  );
}
