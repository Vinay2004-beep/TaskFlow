"use client";

import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import type { Notification } from "@/types";

export function NotificationsDropdown() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    api.get<Notification[]>("/users/notifications").then(({ data }) => setItems(data)).catch(() => null);
  }, []);

  const unread = items.filter((item) => !item.read).length;

  return (
    <DropdownMenu.Root
      onOpenChange={(open) => {
        if (open && unread) {
          api.patch("/users/notifications/read").then(() => setItems((all) => all.map((item) => ({ ...item, read: true })))).catch(() => null);
        }
      }}
    >
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" /> : null}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 mt-2 w-80 rounded-lg border bg-card p-2 shadow-xl" align="end">
        <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
        {items.length ? items.map((item) => (
          <div key={item.id} className="rounded-md px-2 py-2 hover:bg-muted">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.body}</div>
          </div>
        )) : <div className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications yet</div>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
